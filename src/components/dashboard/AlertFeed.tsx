'use client'

import { ExternalLink } from 'lucide-react'
import { cn, timeAgo, getSourceName } from '@/lib/utils'

interface Alert {
  id: string
  priority: 'CRITICAL' | 'WARNING' | 'INFO'
  title: string
  source: string
  brandName: string
  timestamp: Date
  url: string
}

interface AlertFeedProps {
  alerts: Alert[]
}

export function AlertFeed({ alerts }: AlertFeedProps) {
  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <p className="text-xs text-muted-foreground">Recent Alerts</p>
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 pulse-dot" />
      </div>

      <div className="divide-y divide-border">
        {alerts.map((alert) => (
          <a
            key={alert.id}
            href={alert.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 p-4 hover:bg-secondary/30 transition-colors group"
          >
            <span className={cn(
              'shrink-0 mt-0.5 h-1.5 w-1.5 rounded-full',
              alert.priority === 'CRITICAL' ? 'bg-red-500' :
              alert.priority === 'WARNING' ? 'bg-amber-500' : 'bg-blue-500'
            )} />
            <div className="flex-1 min-w-0">
              <p className="text-[13px] text-foreground truncate">{alert.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {getSourceName(alert.source)} · {timeAgo(alert.timestamp)}
              </p>
            </div>
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
          </a>
        ))}
      </div>
    </div>
  )
}
