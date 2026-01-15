'use client'

import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SentimentScoreProps {
  score: number
  trend: number
  breakdown: {
    positive: number
    neutral: number
    negative: number
  }
}

export function SentimentScore({ score, trend, breakdown }: SentimentScoreProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="text-xs text-muted-foreground mb-3">Sentiment Score</p>

      <div className="flex items-baseline gap-2 mb-4">
        <span className={cn(
          'text-3xl font-semibold font-mono',
          score >= 20 ? 'text-emerald-500' : score <= -20 ? 'text-red-500' : 'text-foreground'
        )}>
          {score > 0 ? '+' : ''}{score}
        </span>
        <span className={cn(
          'flex items-center text-xs',
          trend > 0 ? 'text-emerald-500' : trend < 0 ? 'text-red-500' : 'text-muted-foreground'
        )}>
          {trend > 0 ? <TrendingUp className="h-3 w-3 mr-0.5" /> : trend < 0 ? <TrendingDown className="h-3 w-3 mr-0.5" /> : null}
          {Math.abs(trend)}%
        </span>
      </div>

      {/* Breakdown */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Positive</span>
          <span className="text-emerald-500 font-mono">{breakdown.positive}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${breakdown.positive}%` }} />
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Neutral</span>
          <span className="text-muted-foreground font-mono">{breakdown.neutral}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
          <div className="h-full bg-muted-foreground/50 rounded-full" style={{ width: `${breakdown.neutral}%` }} />
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Negative</span>
          <span className="text-red-500 font-mono">{breakdown.negative}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
          <div className="h-full bg-red-500 rounded-full" style={{ width: `${breakdown.negative}%` }} />
        </div>
      </div>
    </div>
  )
}
