import { BaseCollector, CollectorConfig } from './base'
import prisma from '@/lib/prisma'
import grok from '@/lib/grok'
import type { CollectorResult } from '@/types'

interface RedditPost {
  kind: string
  data: {
    id: string
    title: string
    selftext: string
    author: string
    subreddit: string
    permalink: string
    score: number
    num_comments: number
    created_utc: number
    url: string
  }
}

interface RedditResponse {
  kind: string
  data: {
    children: RedditPost[]
    after: string | null
  }
}

export class RedditCollector extends BaseCollector {
  private subreddits: string[]

  constructor(config: CollectorConfig, subreddits?: string[]) {
    super('REDDIT', config)
    // Default subreddits to monitor for crypto/fintech brands
    this.subreddits = subreddits || [
      'cryptocurrency',
      'Bitcoin',
      'ethereum',
      'defi',
      'CryptoMarkets',
      'fintech',
    ]
  }

  async collect(): Promise<CollectorResult> {
    const errors: string[] = []
    let itemsFound = 0
    let itemsNew = 0

    try {
      // Search across Reddit for brand mentions
      const query = encodeURIComponent(this.config.brandName)
      const url = `https://www.reddit.com/search.json?q=${query}&sort=new&limit=50&t=week`

      const response = await fetch(url, {
        headers: {
          'User-Agent': 'BrandMonitor/1.0 (https://brandmonitor.app)',
        },
      })

      if (!response.ok) {
        // Reddit rate limiting
        if (response.status === 429) {
          await this.delay(60000) // Wait a minute
          return this.createResult(0, 0, ['Reddit rate limited, will retry later'])
        }
        throw new Error(`Reddit API failed: ${response.status}`)
      }

      const data: RedditResponse = await response.json()
      itemsFound = data.data.children.length

      for (const post of data.data.children) {
        try {
          const existing = await prisma.mention.findUnique({
            where: {
              source_sourceId: {
                source: 'REDDIT',
                sourceId: post.data.id,
              },
            },
          })

          if (existing) continue

          const textForAnalysis = `${post.data.title} ${post.data.selftext}`

          const sentimentResult = await grok.analyzeSentiment(textForAnalysis)
          const priority = await grok.detectPriority(
            textForAnalysis,
            undefined,
            post.data.score + post.data.num_comments
          )
          const region = this.extractRegion(textForAnalysis)

          await prisma.mention.create({
            data: {
              brandId: this.config.brandId,
              source: 'REDDIT',
              sourceId: post.data.id,
              title: this.sanitizeText(post.data.title),
              content: this.sanitizeText(post.data.selftext || post.data.title),
              url: `https://reddit.com${post.data.permalink}`,
              author: post.data.author,
              sentiment: sentimentResult.sentiment,
              sentimentScore: sentimentResult.score,
              priority,
              region,
              metadata: {
                subreddit: post.data.subreddit,
                score: post.data.score,
                numComments: post.data.num_comments,
              },
              publishedAt: new Date(post.data.created_utc * 1000),
            },
          })

          itemsNew++
          await this.delay(500) // Rate limiting
        } catch (err) {
          errors.push(`Failed to process Reddit post ${post.data.id}: ${err}`)
        }
      }

      // Also search in specific subreddits
      for (const subreddit of this.subreddits.slice(0, 3)) { // Limit to avoid rate limits
        try {
          const subUrl = `https://www.reddit.com/r/${subreddit}/search.json?q=${query}&restrict_sr=1&sort=new&limit=20&t=week`

          const subResponse = await fetch(subUrl, {
            headers: {
              'User-Agent': 'BrandMonitor/1.0',
            },
          })

          if (!subResponse.ok) continue

          const subData: RedditResponse = await subResponse.json()

          for (const post of subData.data.children) {
            const existing = await prisma.mention.findFirst({
              where: {
                source: 'REDDIT',
                sourceId: post.data.id,
              },
            })

            if (existing) continue

            const textForAnalysis = `${post.data.title} ${post.data.selftext}`
            const sentimentResult = await grok.analyzeSentiment(textForAnalysis)
            const priority = await grok.detectPriority(
              textForAnalysis,
              undefined,
              post.data.score + post.data.num_comments
            )

            await prisma.mention.create({
              data: {
                brandId: this.config.brandId,
                source: 'REDDIT',
                sourceId: post.data.id,
                title: this.sanitizeText(post.data.title),
                content: this.sanitizeText(post.data.selftext || post.data.title),
                url: `https://reddit.com${post.data.permalink}`,
                author: post.data.author,
                sentiment: sentimentResult.sentiment,
                sentimentScore: sentimentResult.score,
                priority,
                region: null,
                metadata: {
                  subreddit: post.data.subreddit,
                  score: post.data.score,
                  numComments: post.data.num_comments,
                },
                publishedAt: new Date(post.data.created_utc * 1000),
              },
            })

            itemsNew++
            itemsFound++
          }

          await this.delay(2000) // Be nice to Reddit
        } catch (err) {
          errors.push(`Failed to search subreddit ${subreddit}: ${err}`)
        }
      }
    } catch (err) {
      errors.push(`Reddit collection failed: ${err}`)
    }

    return this.createResult(itemsFound, itemsNew, errors.length > 0 ? errors : undefined)
  }
}
