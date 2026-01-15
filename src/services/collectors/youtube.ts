import { BaseCollector, CollectorConfig } from './base'
import prisma from '@/lib/prisma'
import grok from '@/lib/grok'
import type { CollectorResult } from '@/types'

interface YouTubeVideo {
  id: { videoId: string }
  snippet: {
    title: string
    description: string
    channelTitle: string
    publishedAt: string
    thumbnails: { default: { url: string } }
  }
}

interface YouTubeResponse {
  items: YouTubeVideo[]
  pageInfo: { totalResults: number }
}

export class YouTubeCollector extends BaseCollector {
  private apiKey: string

  constructor(config: CollectorConfig, apiKey?: string) {
    super('YOUTUBE', config)
    this.apiKey = apiKey || process.env.YOUTUBE_API_KEY || ''
  }

  async collect(): Promise<CollectorResult> {
    const errors: string[] = []
    let itemsFound = 0
    let itemsNew = 0

    if (!this.apiKey) {
      return this.createResult(0, 0, ['YouTube API key not configured'])
    }

    try {
      const query = encodeURIComponent(this.config.brandName)
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&order=date&maxResults=25&key=${this.apiKey}`

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`YouTube API failed: ${response.status}`)
      }

      const data: YouTubeResponse = await response.json()
      itemsFound = data.items.length

      for (const video of data.items) {
        try {
          const existing = await prisma.mention.findUnique({
            where: {
              source_sourceId: {
                source: 'YOUTUBE',
                sourceId: video.id.videoId,
              },
            },
          })

          if (existing) continue

          const textForAnalysis = `${video.snippet.title} ${video.snippet.description}`

          const sentimentResult = await grok.analyzeSentiment(textForAnalysis)
          const priority = await grok.detectPriority(textForAnalysis)
          const region = this.extractRegion(textForAnalysis)

          await prisma.mention.create({
            data: {
              brandId: this.config.brandId,
              source: 'YOUTUBE',
              sourceId: video.id.videoId,
              title: this.sanitizeText(video.snippet.title),
              content: this.sanitizeText(video.snippet.description.slice(0, 1000)),
              url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
              author: video.snippet.channelTitle,
              sentiment: sentimentResult.sentiment,
              sentimentScore: sentimentResult.score,
              priority,
              region,
              metadata: {
                channelTitle: video.snippet.channelTitle,
                thumbnail: video.snippet.thumbnails.default.url,
              },
              publishedAt: new Date(video.snippet.publishedAt),
            },
          })

          itemsNew++
          await this.delay(200)
        } catch (err) {
          errors.push(`Failed to process YouTube video ${video.id.videoId}: ${err}`)
        }
      }
    } catch (err) {
      errors.push(`YouTube collection failed: ${err}`)
    }

    return this.createResult(itemsFound, itemsNew, errors.length > 0 ? errors : undefined)
  }
}
