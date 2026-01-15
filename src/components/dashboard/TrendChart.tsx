'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface TrendData {
  date: string
  mentions: number
  sentiment: number
}

interface TrendChartProps {
  data: TrendData[]
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-md border border-border bg-card px-3 py-2 text-xs">
        <p className="text-muted-foreground mb-1">{label}</p>
        <p className="text-foreground">Mentions: <span className="font-mono">{payload[0]?.value}</span></p>
        <p className="text-foreground">Sentiment: <span className="font-mono">{payload[1]?.value}</span></p>
      </div>
    )
  }
  return null
}

export function TrendChart({ data }: TrendChartProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-muted-foreground">Trend</p>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-foreground" />
            Mentions
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Sentiment
          </span>
        </div>
      </div>

      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="mentions" stroke="hsl(var(--foreground))" strokeWidth={1.5} fill="hsl(var(--foreground))" fillOpacity={0.1} dot={false} />
            <Area type="monotone" dataKey="sentiment" stroke="hsl(160, 84%, 39%)" strokeWidth={1.5} fill="hsl(160, 84%, 39%)" fillOpacity={0.1} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
