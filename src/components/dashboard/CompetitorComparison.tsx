'use client'

import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Competitor {
  id: string
  name: string
  isOwn: boolean
  avgRating: number
  reviewCount: number
  sentimentScore: number
  trend: number
}

interface CompetitorComparisonProps {
  competitors: Competitor[]
}

export function CompetitorComparison({ competitors }: CompetitorComparisonProps) {
  const sorted = [...competitors].sort((a, b) => b.sentimentScore - a.sentimentScore)

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="p-4 border-b border-border">
        <p className="text-xs text-muted-foreground">Competitors</p>
      </div>

      <div className="divide-y divide-border">
        {sorted.map((competitor, index) => (
          <div
            key={competitor.id}
            className={cn(
              'flex items-center justify-between p-4',
              competitor.isOwn && 'bg-secondary/30'
            )}
          >
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground w-5">#{index + 1}</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-medium">{competitor.name}</span>
                  {competitor.isOwn && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-foreground text-background">You</span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                  <span>★ {competitor.avgRating.toFixed(1)}</span>
                  <span>·</span>
                  <span>{competitor.reviewCount} reviews</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className={cn(
                'text-[13px] font-mono',
                competitor.sentimentScore > 0.2 ? 'text-emerald-500' :
                competitor.sentimentScore < -0.2 ? 'text-red-500' : 'text-muted-foreground'
              )}>
                {competitor.sentimentScore > 0 ? '+' : ''}{Math.round(competitor.sentimentScore * 100)}
              </span>
              <span className={cn(
                'flex items-center text-xs',
                competitor.trend > 0 ? 'text-emerald-500' : competitor.trend < 0 ? 'text-red-500' : 'text-muted-foreground'
              )}>
                {competitor.trend > 0 ? <TrendingUp className="h-3 w-3 mr-0.5" /> : competitor.trend < 0 ? <TrendingDown className="h-3 w-3 mr-0.5" /> : null}
                {Math.abs(competitor.trend)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
