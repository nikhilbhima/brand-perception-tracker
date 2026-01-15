import { BaseCollector, CollectorConfig } from './base'
import prisma from '@/lib/prisma'
import grok from '@/lib/grok'
import type { CollectorResult } from '@/types'

interface NewsArticle {
  source: { id: string | null; name: string }
  author: string | null
  title: string
  description: string | null
  url: string
  urlToImage: string | null
  publishedAt: string
  content: string | null
}

interface NewsAPIResponse {
  status: string
  totalResults: number
  articles: NewsArticle[]
}

export class NewsAPICollector extends BaseCollector {
  private apiKey: string

  constructor(config: CollectorConfig, apiKey?: string) {
    super('NEWSAPI', config)
    this.apiKey = apiKey || process.env.NEWS_API_KEY || ''
  }

  async collect(): Promise<CollectorResult> {
    const errors: string[] = []
    let itemsFound = 0
    let itemsNew = 0

    if (!this.apiKey) {
      return this.createResult(0, 0, ['NewsAPI key not configured'])
    }

    try {
      // Search for brand mentions in news
      const query = encodeURIComponent(this.config.brandName)
      const url = `https://newsapi.org/v2/everything?q=${query}&sortBy=publishedAt&pageSize=50&apiKey=${this.apiKey}`

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`NewsAPI request failed: ${response.status}`)
      }

      const data: NewsAPIResponse = await response.json()

      if (data.status !== 'ok') {
        throw new Error('NewsAPI returned error status')
      }

      itemsFound = data.articles.length

      for (const article of data.articles) {
        try {
          // Create a unique sourceId from the URL
          const sourceId = Buffer.from(article.url).toString('base64').slice(0, 50)

          const existing = await prisma.mention.findUnique({
            where: {
              source_sourceId: {
                source: 'NEWSAPI',
                sourceId,
              },
            },
          })

          if (existing) continue

          const textForAnalysis = [
            article.title,
            article.description,
            article.content?.slice(0, 500),
          ]
            .filter(Boolean)
            .join(' ')

          const sentimentResult = await grok.analyzeSentiment(textForAnalysis)
          const priority = await grok.detectPriority(textForAnalysis)
          const region = this.extractRegion(textForAnalysis)

          await prisma.mention.create({
            data: {
              brandId: this.config.brandId,
              source: 'NEWSAPI',
              sourceId,
              title: this.sanitizeText(article.title),
              content: this.sanitizeText(article.description || article.content || article.title),
              url: article.url,
              author: article.author || article.source.name,
              sentiment: sentimentResult.sentiment,
              sentimentScore: sentimentResult.score,
              priority,
              region,
              metadata: {
                sourceName: article.source.name,
                imageUrl: article.urlToImage,
              },
              publishedAt: new Date(article.publishedAt),
            },
          })

          itemsNew++
          await this.delay(200)
        } catch (err) {
          errors.push(`Failed to process news article: ${err}`)
        }
      }
    } catch (err) {
      errors.push(`NewsAPI collection failed: ${err}`)
    }

    return this.createResult(itemsFound, itemsNew, errors.length > 0 ? errors : undefined)
  }
}
