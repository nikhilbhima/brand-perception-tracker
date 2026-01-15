import { BaseCollector, CollectorConfig } from './base'
import prisma from '@/lib/prisma'
import grok from '@/lib/grok'
import type { CollectorResult } from '@/types'

// Uses Grok's X/Twitter integration for data access
export class TwitterCollector extends BaseCollector {
  constructor(config: CollectorConfig) {
    super('TWITTER', config)
  }

  async collect(): Promise<CollectorResult> {
    const errors: string[] = []
    let itemsFound = 0
    let itemsNew = 0

    try {
      // Use Grok to search for brand mentions on X/Twitter
      // Grok has native access to X data
      const posts = await grok.searchTwitter(this.config.brandName, 25)

      itemsFound = posts.length

      for (const post of posts) {
        try {
          // Generate a unique ID if not provided
          const sourceId = post.id || `grok-${Date.now()}-${Math.random().toString(36).slice(2)}`

          const existing = await prisma.mention.findUnique({
            where: {
              source_sourceId: {
                source: 'TWITTER',
                sourceId,
              },
            },
          })

          if (existing) continue

          const textForAnalysis = post.text
          const sentimentResult = await grok.analyzeSentiment(textForAnalysis)

          // Calculate engagement for priority
          const engagement = (post.engagement?.likes || 0) +
                            (post.engagement?.retweets || 0) * 2 +
                            (post.engagement?.replies || 0)

          const priority = await grok.detectPriority(textForAnalysis, undefined, engagement)
          const region = this.extractRegion(textForAnalysis)

          await prisma.mention.create({
            data: {
              brandId: this.config.brandId,
              source: 'TWITTER',
              sourceId,
              title: null,
              content: this.sanitizeText(post.text),
              url: post.url || `https://x.com/user/status/${sourceId}`,
              author: post.author || 'Unknown',
              sentiment: post.sentiment || sentimentResult.sentiment,
              sentimentScore: sentimentResult.score,
              priority,
              region,
              metadata: {
                engagement: post.engagement,
                isVerified: post.isVerified,
              },
              publishedAt: post.timestamp ? new Date(post.timestamp) : new Date(),
            },
          })

          itemsNew++
        } catch (err) {
          errors.push(`Failed to process tweet: ${err}`)
        }
      }
    } catch (err) {
      errors.push(`Twitter/X collection via Grok failed: ${err}`)
    }

    return this.createResult(itemsFound, itemsNew, errors.length > 0 ? errors : undefined)
  }
}
