'use client'

import { Star, ExternalLink } from 'lucide-react'
import { cn, timeAgo, getSourceName } from '@/lib/utils'

interface Review {
  id: string
  source: string
  rating: number
  title: string
  content: string
  author: string
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE'
  publishedAt: Date
  url: string
}

interface RecentReviewsProps {
  reviews: Review[]
}

export function RecentReviews({ reviews }: RecentReviewsProps) {
  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="p-4 border-b border-border">
        <p className="text-xs text-muted-foreground">Recent Reviews</p>
      </div>

      <div className="divide-y divide-border">
        {reviews.map((review) => (
          <a
            key={review.id}
            href={review.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 hover:bg-secondary/30 transition-colors group"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={cn(
                          'h-3 w-3',
                          star <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/20'
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">{getSourceName(review.source)}</span>
                </div>
                <p className="text-[13px] mt-1.5 truncate">{review.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{review.author} · {timeAgo(review.publishedAt)}</p>
              </div>
              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
