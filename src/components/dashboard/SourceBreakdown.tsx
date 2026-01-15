'use client'

import { getSourceName } from '@/lib/utils'

interface SourceData {
  source: string
  count: number
  sentiment: number
}

interface SourceBreakdownProps {
  data: SourceData[]
}

export function SourceBreakdown({ data }: SourceBreakdownProps) {
  const total = data.reduce((acc, item) => acc + item.count, 0)

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="text-xs text-muted-foreground mb-4">By Source</p>

      <div className="space-y-3">
        {data.map((item) => (
          <div key={item.source} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[13px]">{getSourceName(item.source)}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[13px] font-mono">{item.count}</span>
              <span className="text-xs text-muted-foreground w-8 text-right">
                {Math.round((item.count / total) * 100)}%
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-border flex justify-between text-xs text-muted-foreground">
        <span>Total</span>
        <span className="font-mono">{total}</span>
      </div>
    </div>
  )
}
