'use client'

import { ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const stats = [
  { label: 'Mentions', value: '1,247', change: '+12%', up: true },
  { label: 'Avg Rating', value: '4.2', change: '+3%', up: true },
  { label: 'Sentiment', value: '+45', change: '+8%', up: true },
]

const activity = [
  { type: 'critical', text: '1-star review on G2', source: 'G2', time: '5m' },
  { type: 'warning', text: 'Negative Reddit thread gaining traction', source: 'Reddit', time: '23m' },
  { type: 'critical', text: 'Tech publication reports concerns', source: 'News', time: '45m' },
  { type: 'info', text: 'New 5-star review on Trustpilot', source: 'Trustpilot', time: '1h' },
  { type: 'info', text: 'YouTube review published (5K views)', source: 'YouTube', time: '2h' },
  { type: 'warning', text: '2-star review mentions API issues', source: 'Trustpilot', time: '3h' },
]

const competitors = [
  { name: 'Your Brand', score: 45, rating: 4.2, you: true },
  { name: 'Fireblocks', score: 62, rating: 4.5 },
  { name: 'Coinbase Custody', score: 52, rating: 4.3 },
  { name: 'Anchorage', score: 38, rating: 4.1 },
]

export default function DashboardPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-8">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-xl font-medium">Overview</h1>
        <p className="text-muted-foreground text-sm mt-1">Last 7 days</p>
      </div>

      {/* Stats */}
      <div className="flex gap-12 mb-12">
        {stats.map((stat) => (
          <div key={stat.label}>
            <p className="text-muted-foreground text-xs mb-1">{stat.label}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-medium tabular-nums">{stat.value}</span>
              <span className={cn(
                'text-xs flex items-center',
                stat.up ? 'text-emerald-600' : 'text-red-600'
              )}>
                {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Activity */}
      <section className="mb-12">
        <h2 className="text-xs text-muted-foreground uppercase tracking-wide mb-4">Activity</h2>
        <div className="space-y-0">
          {activity.map((item, i) => (
            <div key={i} className="flex items-center gap-3 py-2.5 border-b border-border last:border-0">
              <span className={cn(
                'w-1.5 h-1.5 rounded-full shrink-0',
                item.type === 'critical' && 'bg-red-500',
                item.type === 'warning' && 'bg-amber-500',
                item.type === 'info' && 'bg-emerald-500'
              )} />
              <span className="flex-1 text-sm truncate">{item.text}</span>
              <span className="text-xs text-muted-foreground shrink-0">{item.source}</span>
              <span className="text-xs text-muted-foreground tabular-nums shrink-0 w-8 text-right">{item.time}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Competitors */}
      <section>
        <h2 className="text-xs text-muted-foreground uppercase tracking-wide mb-4">Competitors</h2>
        <div className="space-y-0">
          {competitors.map((c, i) => (
            <div key={c.name} className="flex items-center gap-4 py-2.5 border-b border-border last:border-0">
              <span className="text-xs text-muted-foreground w-4">{i + 1}</span>
              <span className={cn('flex-1 text-sm', c.you && 'font-medium')}>{c.name}</span>
              <span className="text-xs text-muted-foreground">★ {c.rating}</span>
              <span className={cn(
                'text-sm tabular-nums w-8 text-right',
                c.score > 50 ? 'text-emerald-600' : c.score < 30 ? 'text-red-600' : ''
              )}>
                {c.score > 0 && '+'}{c.score}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
