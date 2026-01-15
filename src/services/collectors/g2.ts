import * as cheerio from 'cheerio'
import { BaseCollector, CollectorConfig } from './base'
import prisma from '@/lib/prisma'
import grok from '@/lib/grok'
import type { CollectorResult, Sentiment } from '@/types'

export class G2Collector extends BaseCollector {
  constructor(config: CollectorConfig) {
    super('G2', config)
  }

  async collect(): Promise<CollectorResult> {
    const errors: string[] = []
    let itemsFound = 0
    let itemsNew = 0

    try {
      // G2 URL format: https://www.g2.com/products/{product-slug}/reviews
      const productSlug = this.config.platformId || this.config.brandName.toLowerCase().replace(/\s+/g, '-')
      const url = `https://www.g2.com/products/${productSlug}/reviews`

      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          'Accept': 'text/html,application/xhtml+xml',
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch G2: ${response.status}`)
      }

      const html = await response.text()
      const $ = cheerio.load(html)

      const reviews: any[] = []

      // G2 review structure (selectors may need adjustment based on actual page structure)
      $('.review-row, [data-review-id]').each((_, element) => {
        const $review = $(element)
        const reviewId = $review.attr('data-review-id') || $review.attr('id')
        const starRating = $review.find('.stars').attr('data-rating') ||
                          $review.find('[data-star-rating]').attr('data-star-rating')
        const title = $review.find('.review-title, h3').first().text().trim()
        const content = $review.find('.review-content, [itemprop="reviewBody"]').text().trim()
        const author = $review.find('.reviewer-name, [itemprop="author"]').text().trim()
        const pros = $review.find('.review-pros, .what-i-like').text().trim()
        const cons = $review.find('.review-cons, .what-i-dislike').text().trim()
        const dateStr = $review.find('time').attr('datetime')

        if (reviewId && (content || pros || cons)) {
          reviews.push({
            sourceId: reviewId,
            rating: parseFloat(starRating || '3'),
            title: title || null,
            content: this.sanitizeText(content || `${pros} ${cons}`),
            pros: this.sanitizeText(pros),
            cons: this.sanitizeText(cons),
            author: author || 'G2 User',
            publishedAt: dateStr ? new Date(dateStr) : new Date(),
          })
        }
      })

      itemsFound = reviews.length

      for (const review of reviews) {
        try {
          const existing = await prisma.review.findUnique({
            where: {
              source_sourceId: {
                source: 'G2',
                sourceId: review.sourceId,
              },
            },
          })

          if (existing) continue

          // Combine pros, cons, and content for sentiment analysis
          const textForAnalysis = [review.title, review.content, review.pros, review.cons]
            .filter(Boolean)
            .join(' ')

          const sentimentResult = await grok.analyzeSentiment(textForAnalysis)

          let sentiment: Sentiment = sentimentResult.sentiment
          if (!sentiment) {
            sentiment = review.rating >= 4 ? 'POSITIVE' : review.rating <= 2 ? 'NEGATIVE' : 'NEUTRAL'
          }

          const region = this.extractRegion(textForAnalysis)

          await prisma.review.create({
            data: {
              brandId: this.config.brandId,
              source: 'G2',
              sourceId: review.sourceId,
              rating: review.rating,
              title: review.title,
              content: review.content,
              author: review.author,
              sentiment,
              region,
              pros: review.pros || null,
              cons: review.cons || null,
              url: `https://www.g2.com/products/${this.config.platformId || this.config.brandName}/reviews#review-${review.sourceId}`,
              publishedAt: review.publishedAt,
            },
          })

          const priority = await grok.detectPriority(textForAnalysis, review.rating)

          await prisma.mention.create({
            data: {
              brandId: this.config.brandId,
              source: 'G2',
              sourceId: `review-${review.sourceId}`,
              title: review.title,
              content: review.content,
              url: `https://www.g2.com/products/${this.config.platformId || this.config.brandName}/reviews#review-${review.sourceId}`,
              author: review.author,
              sentiment,
              sentimentScore: sentimentResult.score,
              priority,
              region,
              metadata: {
                rating: review.rating,
                pros: review.pros,
                cons: review.cons,
              },
              publishedAt: review.publishedAt,
            },
          })

          itemsNew++
          await this.delay(500)
        } catch (err) {
          errors.push(`Failed to process G2 review ${review.sourceId}: ${err}`)
        }
      }
    } catch (err) {
      errors.push(`G2 collection failed: ${err}`)
    }

    return this.createResult(itemsFound, itemsNew, errors.length > 0 ? errors : undefined)
  }
}
