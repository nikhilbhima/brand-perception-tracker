'use client'

import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface QuickStatsProps {
  stats: {
    totalMentions: number
    mentionsTrend: number
    avgRating: number
    ratingTrend: number
    totalReviews: number
    reviewsTrend: number
    reach: string
    reachTrend: number
  }
}

export function QuickStats({ stats }: QuickStatsProps) {
  const items = [
    { label: 'Mentions', value: stats.totalMentions.toLocaleString(), trend: stats.mentionsTrend },
    { label: 'Avg Rating', value: stats.avgRating.toFixed(1), trend: stats.ratingTrend },
    { label: 'Reviews', value: stats.totalReviews.toLocaleString(), trend: stats.reviewsTrend },
    { label: 'Reach', value: stats.reach, trend: stats.reachTrend },
  ]

  return (
    <div className="grid grid-cols-4 gap-4">
      {items.map((item) => (
        <div key={item.label} className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold font-mono">{item.value}</span>
            <span className={cn(
              'flex items-center text-xs',
              item.trend > 0 ? 'text-emerald-500' : item.trend < 0 ? 'text-red-500' : 'text-muted-foreground'
            )}>
              {item.trend > 0 ? <TrendingUp className="h-3 w-3 mr-0.5" /> : item.trend < 0 ? <TrendingDown className="h-3 w-3 mr-0.5" /> : null}
              {Math.abs(item.trend)}%
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
