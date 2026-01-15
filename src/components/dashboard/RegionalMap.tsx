'use client'

import { cn } from '@/lib/utils'

interface RegionData {
  region: string
  mentions: number
  sentiment: number
  code: string
}

interface RegionalMapProps {
  data: RegionData[]
}

export function RegionalMap({ data }: RegionalMapProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="text-xs text-muted-foreground mb-4">By Region</p>

      <div className="space-y-3">
        {data.map((region) => (
          <div key={region.code} className="flex items-center justify-between">
            <span className="text-[13px]">{region.region}</span>
            <div className="flex items-center gap-3">
              <span className="text-[13px] font-mono">{region.mentions}</span>
              <span className={cn(
                'text-xs font-mono w-10 text-right',
                region.sentiment > 0.2 ? 'text-emerald-500' :
                region.sentiment < -0.2 ? 'text-red-500' : 'text-muted-foreground'
              )}>
                {region.sentiment > 0 ? '+' : ''}{Math.round(region.sentiment * 100)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
