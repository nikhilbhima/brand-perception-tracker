'use client'

import { cn } from '@/lib/utils'

// Sample data
const stats = {
  score: 4.2,
  change: '+0.3',
  mentions24h: 12,
  mentionsWeek: 67,
  positive: 64.8,
  neutral: 28.1,
  negative: 7.1,
}

const criticalAlert = {
  title: '1-star review on G2',
  content: '"API documentation is severely lacking. Took us weeks to integrate what should have been days."',
  source: 'G2',
  time: '12 min ago',
}

const recentMentions = [
  { id: 1, source: 'Reddit', title: 'r/cryptocurrency thread gaining traction', sentiment: 'negative', time: '2h ago', engagement: '45 comments' },
  { id: 2, source: 'CoinDesk', title: 'BitGo expands institutional custody offerings', sentiment: 'positive', time: '4h ago', engagement: '2.1K views' },
  { id: 3, source: 'Trustpilot', title: '5-star review: "Excellent security features"', sentiment: 'positive', time: '6h ago', engagement: null },
  { id: 4, source: 'YouTube', title: 'Crypto custody comparison video', sentiment: 'neutral', time: '8h ago', engagement: '15K views' },
  { id: 5, source: 'Twitter/X', title: 'Thread on institutional custody trends', sentiment: 'neutral', time: '10h ago', engagement: '892 likes' },
]

const topSources = [
  { name: 'Reddit', count: 24, change: '+12%' },
  { name: 'Twitter/X', count: 18, change: '+8%' },
  { name: 'News', count: 15, change: '+3%' },
  { name: 'Reviews', count: 10, change: '-2%' },
]

export default function DashboardPage() {
  return (
    <div className="p-10 max-w-[1400px]">
      {/* Header */}
      <header className="flex items-center justify-between mb-10 animate-in">
        <div>
          <h1 className="text-title1 mb-2">Overview</h1>
          <p className="text-footnote">
            Last updated 2 min ago
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn btn-secondary">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            Refresh
          </button>
          <button className="btn btn-primary">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Export
          </button>
        </div>
      </header>

      {/* Alert Banner */}
      {criticalAlert && (
        <div className="card p-5 mb-10 border-l-4 border-l-[rgb(var(--red))] animate-in delay-1">
          <div className="flex items-start gap-5">
            <div className="w-12 h-12 rounded-2xl bg-[rgb(var(--red)/0.15)] flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-[rgb(var(--red))]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <span className="tag tag-red">Critical</span>
                <span className="text-caption">{criticalAlert.source} · {criticalAlert.time}</span>
              </div>
              <p className="text-headline mb-1">{criticalAlert.title}</p>
              <p className="text-callout text-secondary line-clamp-1">{criticalAlert.content}</p>
            </div>
            <button className="btn btn-ghost flex-shrink-0">
              View
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-5 mb-10 animate-in delay-2">
        {/* Brand Score */}
        <div className="card p-7">
          <p className="text-subheadline text-secondary mb-4">Brand Score</p>
          <div className="flex items-baseline gap-2">
            <span className="metric text-5xl">{stats.score}</span>
            <span className="text-tertiary text-title3">/5</span>
          </div>
          <div className="flex items-center gap-3 mt-4">
            <span className="tag tag-green">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
              </svg>
              {stats.change}
            </span>
            <span className="text-caption">vs yesterday</span>
          </div>
        </div>

        {/* Mentions */}
        <div className="card p-7">
          <p className="text-subheadline text-secondary mb-4">Mentions (24h)</p>
          <div className="flex items-baseline gap-2">
            <span className="metric text-5xl">{stats.mentions24h}</span>
          </div>
          <p className="text-caption mt-4">{stats.mentionsWeek} this week</p>
        </div>

        {/* Sentiment Breakdown */}
        <div className="card p-7 col-span-2">
          <p className="text-subheadline text-secondary mb-5">Sentiment Distribution</p>
          <div className="flex items-center gap-8">
            <div className="flex-1">
              <div className="flex h-4 rounded-full overflow-hidden bg-[rgb(var(--bg-tertiary))]">
                <div
                  className="h-full bg-[rgb(var(--green))]"
                  style={{ width: `${stats.positive}%` }}
                />
                <div
                  className="h-full bg-[rgb(var(--fg-tertiary))]"
                  style={{ width: `${stats.neutral}%` }}
                />
                <div
                  className="h-full bg-[rgb(var(--red))]"
                  style={{ width: `${stats.negative}%` }}
                />
              </div>
            </div>
            <div className="flex items-center gap-8">
              <div className="text-center">
                <p className="metric text-xl text-green">{stats.positive}%</p>
                <p className="text-caption">Positive</p>
              </div>
              <div className="text-center">
                <p className="metric text-xl">{stats.neutral}%</p>
                <p className="text-caption">Neutral</p>
              </div>
              <div className="text-center">
                <p className="metric text-xl text-red">{stats.negative}%</p>
                <p className="text-caption">Negative</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Recent Mentions */}
        <div className="col-span-2 animate-in delay-3">
          <div className="card">
            <div className="flex items-center justify-between p-6 border-b border-[rgb(var(--separator))]">
              <h2 className="text-title3">Recent Mentions</h2>
              <div className="segmented-control">
                <button className="segmented-item active">All</button>
                <button className="segmented-item">Reviews</button>
                <button className="segmented-item">Social</button>
                <button className="segmented-item">News</button>
              </div>
            </div>

            <div className="divide-y divide-[rgb(var(--separator))]">
              {recentMentions.map((mention) => (
                <div
                  key={mention.id}
                  className="p-6 hover:bg-[rgb(var(--bg-tertiary))] transition-colors cursor-pointer group"
                >
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "dot mt-2",
                      mention.sentiment === 'positive' && "dot-green",
                      mention.sentiment === 'negative' && "dot-red",
                      mention.sentiment === 'neutral' && "dot-gray"
                    )} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="tag">{mention.source}</span>
                        <span className="text-caption">{mention.time}</span>
                        {mention.engagement && (
                          <>
                            <span className="text-tertiary">·</span>
                            <span className="text-caption">{mention.engagement}</span>
                          </>
                        )}
                      </div>
                      <p className="text-body group-hover:text-blue transition-colors">
                        {mention.title}
                      </p>
                    </div>
                    <span className={cn(
                      "tag",
                      mention.sentiment === 'positive' && "tag-green",
                      mention.sentiment === 'negative' && "tag-red"
                    )}>
                      {mention.sentiment}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-5 border-t border-[rgb(var(--separator))]">
              <button className="w-full btn btn-ghost text-blue">
                View all mentions
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-span-1 space-y-6 animate-in delay-4">
          {/* Top Sources */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-title3">Top Sources</h2>
              <span className="text-caption">Last 7 days</span>
            </div>
            <div className="space-y-5">
              {topSources.map((source, i) => (
                <div key={source.name} className="flex items-center gap-4">
                  <span className="w-6 text-callout text-tertiary">{i + 1}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-body font-medium">{source.name}</span>
                      <span className="metric text-body">{source.count}</span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill bg-[rgb(var(--blue))]"
                        style={{ width: `${(source.count / 24) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className={cn(
                    "text-caption font-medium",
                    source.change.startsWith('+') ? "text-green" : "text-red"
                  )}>
                    {source.change}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card p-6">
            <h2 className="text-title3 mb-5">Quick Actions</h2>
            <div className="space-y-2">
              <button className="w-full btn btn-secondary justify-start">
                <svg className="w-5 h-5 text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                Add Source
              </button>
              <button className="w-full btn btn-secondary justify-start">
                <svg className="w-5 h-5 text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                </svg>
                Configure Alerts
              </button>
              <button className="w-full btn btn-secondary justify-start">
                <svg className="w-5 h-5 text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
                View Latest Digest
              </button>
            </div>
          </div>

          {/* Data Sources Status */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-title3">Data Sources</h2>
              <span className="tag tag-green">
                <span className="dot dot-green dot-glow w-2 h-2" />
                All Active
              </span>
            </div>
            <p className="text-callout text-secondary mb-3">
              17 sources connected, refreshing every 6 hours
            </p>
            <p className="text-caption">
              Next refresh in 5h 42m
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
