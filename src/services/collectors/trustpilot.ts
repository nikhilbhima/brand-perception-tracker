import * as cheerio from 'cheerio'
import { BaseCollector, CollectorConfig } from './base'
import prisma from '@/lib/prisma'
import grok from '@/lib/grok'
import type { CollectorResult, Sentiment } from '@/types'

export class TrustPilotCollector extends BaseCollector {
  constructor(config: CollectorConfig) {
    super('TRUSTPILOT', config)
  }

  async collect(): Promise<CollectorResult> {
    const errors: string[] = []
    let itemsFound = 0
    let itemsNew = 0

    try {
      // TrustPilot URL format: https://www.trustpilot.com/review/{business-domain}
      const businessId = this.config.platformId || this.config.brandName.toLowerCase().replace(/\s+/g, '')
      const url = `https://www.trustpilot.com/review/${businessId}`

      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch TrustPilot: ${response.status}`)
      }

      const html = await response.text()
      const $ = cheerio.load(html)

      // Parse reviews from the page
      const reviews: any[] = []

      // TrustPilot review structure (simplified - actual selectors may vary)
      $('[data-review-id]').each((_, element) => {
        const $review = $(element)
        const reviewId = $review.attr('data-review-id')
        const rating = $review.find('[data-rating]').attr('data-rating')
        const title = $review.find('[data-review-title]').text().trim()
        const content = $review.find('[data-review-content]').text().trim()
        const author = $review.find('[data-consumer-name]').text().trim()
        const dateStr = $review.find('[data-review-date]').attr('data-review-date')

        if (reviewId && content) {
          reviews.push({
            sourceId: reviewId,
            rating: parseInt(rating || '3'),
            title: title || null,
            content: this.sanitizeText(content),
            author: author || 'Anonymous',
            publishedAt: dateStr ? new Date(dateStr) : new Date(),
          })
        }
      })

      itemsFound = reviews.length

      // Process and save reviews
      for (const review of reviews) {
        try {
          // Check if review already exists
          const existing = await prisma.review.findUnique({
            where: {
              source_sourceId: {
                source: 'TRUSTPILOT',
                sourceId: review.sourceId,
              },
            },
          })

          if (existing) continue

          // Analyze sentiment
          const sentimentResult = await grok.analyzeSentiment(
            `${review.title || ''} ${review.content}`
          )

          // Determine sentiment from rating if AI is unavailable
          let sentiment: Sentiment = sentimentResult.sentiment
          if (!sentiment) {
            sentiment = review.rating >= 4 ? 'POSITIVE' : review.rating <= 2 ? 'NEGATIVE' : 'NEUTRAL'
          }

          // Extract region
          const region = this.extractRegion(review.content)

          // Create review record
          await prisma.review.create({
            data: {
              brandId: this.config.brandId,
              source: 'TRUSTPILOT',
              sourceId: review.sourceId,
              rating: review.rating,
              title: review.title,
              content: review.content,
              author: review.author,
              sentiment,
              region,
              url: `https://www.trustpilot.com/reviews/${review.sourceId}`,
              publishedAt: review.publishedAt,
            },
          })

          // Also create a mention record for unified tracking
          const priority = await grok.detectPriority(review.content, review.rating)

          await prisma.mention.create({
            data: {
              brandId: this.config.brandId,
              source: 'TRUSTPILOT',
              sourceId: `review-${review.sourceId}`,
              title: review.title,
              content: review.content,
              url: `https://www.trustpilot.com/reviews/${review.sourceId}`,
              author: review.author,
              sentiment,
              sentimentScore: sentimentResult.score,
              priority,
              region,
              metadata: { rating: review.rating },
              publishedAt: review.publishedAt,
            },
          })

          itemsNew++

          // Rate limiting
          await this.delay(500)
        } catch (err) {
          errors.push(`Failed to process review ${review.sourceId}: ${err}`)
        }
      }
    } catch (err) {
      errors.push(`TrustPilot collection failed: ${err}`)
    }

    return this.createResult(itemsFound, itemsNew, errors.length > 0 ? errors : undefined)
  }
}
