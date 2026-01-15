'use client'

import { cn } from '@/lib/utils'

// Sample data
const criticalAlert = {
  id: 1,
  title: '1-star review on G2',
  source: 'G2',
  content: '"API documentation is severely lacking. Took us weeks to integrate what should have been days."',
  time: '12 minutes ago',
  url: '#'
}

const recentMentions = [
  { id: 1, source: 'Reddit', title: 'r/cryptocurrency thread gaining traction', sentiment: 'negative', time: '2h ago', engagement: '45 comments' },
  { id: 2, source: 'CoinDesk', title: 'BitGo expands institutional custody offerings', sentiment: 'positive', time: '4h ago', engagement: '2.1K views' },
  { id: 3, source: 'Trustpilot', title: '5-star review: "Excellent security features"', sentiment: 'positive', time: '6h ago', engagement: null },
  { id: 4, source: 'YouTube', title: 'Crypto custody comparison video', sentiment: 'neutral', time: '8h ago', engagement: '15K views' },
  { id: 5, source: 'Twitter', title: 'Thread on institutional custody trends', sentiment: 'neutral', time: '10h ago', engagement: '892 likes' },
]

const sources = [
  { name: 'G2', status: 'active', lastSync: '2m ago' },
  { name: 'Trustpilot', status: 'active', lastSync: '2m ago' },
  { name: 'Reddit', status: 'active', lastSync: '15m ago' },
  { name: 'Twitter/X', status: 'active', lastSync: '5m ago' },
  { name: 'NewsAPI', status: 'active', lastSync: '1h ago' },
  { name: 'YouTube', status: 'active', lastSync: '30m ago' },
]

export default function DashboardPage() {
  return (
    <div className="min-h-screen p-8">
      {/* Page header */}
      <header className="flex items-start justify-between mb-8 animate-in">
        <div>
          <h1 className="font-display text-2xl mb-1">Brand Overview</h1>
          <p className="text-sm text-[rgb(var(--text-muted))]">
            Last updated 2 minutes ago · Tracking 17 sources
          </p>
        </div>
        <button className="btn btn-primary">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Export Report
        </button>
      </header>

      {/* Critical Alert Banner */}
      <section className="surface p-5 mb-8 border-l-4 border-l-[rgb(var(--negative))] animate-in delay-1">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-[rgb(var(--negative)/0.15)] flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-[rgb(var(--negative))]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="tag tag-negative text-xs">Critical</span>
              <span className="text-xs text-[rgb(var(--text-muted))]">{criticalAlert.time}</span>
            </div>
            <h3 className="font-medium mb-1">{criticalAlert.title}</h3>
            <p className="text-sm text-[rgb(var(--text-secondary))] line-clamp-2">{criticalAlert.content}</p>
          </div>
          <button className="btn btn-ghost text-sm flex-shrink-0">
            View Details
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </section>

      {/* Main grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left column - Score & Stats */}
        <div className="col-span-4 space-y-6">
          {/* Brand Health Score */}
          <section className="surface p-6 animate-in delay-2">
            <h2 className="text-sm font-medium text-[rgb(var(--text-muted))] mb-5">Brand Health Score</h2>

            <div className="flex items-center gap-6">
              {/* Score ring */}
              <div className="score-ring" style={{ '--score': 84 } as React.CSSProperties}>
                <svg width="140" height="140" viewBox="0 0 140 140">
                  <circle className="score-ring-track" cx="70" cy="70" r="60" />
                  <circle className="score-ring-fill" cx="70" cy="70" r="60" />
                </svg>
                <div className="score-ring-value">
                  <span className="font-display text-4xl">4.2</span>
                  <span className="text-xs text-[rgb(var(--text-muted))]">out of 5</span>
                </div>
              </div>

              {/* Score breakdown */}
              <div className="flex-1 space-y-3">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-[rgb(var(--text-secondary))]">Positive</span>
                    <span className="text-[rgb(var(--positive))] font-medium">64.8%</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: '64.8%', background: 'rgb(var(--positive))' }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-[rgb(var(--text-secondary))]">Neutral</span>
                    <span className="font-medium">28.1%</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: '28.1%', background: 'rgb(var(--text-muted))' }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-[rgb(var(--text-secondary))]">Negative</span>
                    <span className="text-[rgb(var(--negative))] font-medium">7.1%</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: '7.1%', background: 'rgb(var(--negative))' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-5 pt-5 border-t border-[rgb(var(--border))]">
              <span className="tag tag-accent">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
                </svg>
                +0.3 vs yesterday
              </span>
              <span className="text-xs text-[rgb(var(--text-muted))]">+12% this month</span>
            </div>
          </section>

          {/* Quick Stats */}
          <section className="grid grid-cols-2 gap-4 animate-in delay-3">
            <div className="surface p-5">
              <p className="text-xs text-[rgb(var(--text-muted))] mb-2">Mentions (24h)</p>
              <p className="font-display text-3xl">12</p>
              <p className="text-xs text-[rgb(var(--text-muted))] mt-2">67 this week</p>
            </div>
            <div className="surface p-5">
              <p className="text-xs text-[rgb(var(--text-muted))] mb-2">Avg Response</p>
              <p className="font-display text-3xl">2.4h</p>
              <p className="text-xs text-[rgb(var(--positive))] mt-2">-18% faster</p>
            </div>
          </section>

          {/* Active Sources */}
          <section className="surface p-5 animate-in delay-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium">Active Sources</h2>
              <span className="text-xs text-[rgb(var(--text-muted))]">{sources.length} connected</span>
            </div>
            <div className="space-y-2">
              {sources.map((source) => (
                <div key={source.name} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <span className="status-dot status-positive" />
                    <span className="text-sm">{source.name}</span>
                  </div>
                  <span className="text-xs text-[rgb(var(--text-muted))]">{source.lastSync}</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2.5 text-sm text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))] border border-[rgb(var(--border))] rounded-lg transition-colors">
              Manage Sources
            </button>
          </section>
        </div>

        {/* Right column - Activity Feed */}
        <div className="col-span-8 animate-in delay-2">
          <section className="surface">
            <div className="flex items-center justify-between p-5 border-b border-[rgb(var(--border))]">
              <h2 className="text-sm font-medium">Recent Activity</h2>
              <div className="flex items-center gap-2">
                <button className="btn btn-ghost text-xs active">All</button>
                <button className="btn btn-ghost text-xs">Reviews</button>
                <button className="btn btn-ghost text-xs">Social</button>
                <button className="btn btn-ghost text-xs">News</button>
              </div>
            </div>

            <div className="divide-y divide-[rgb(var(--border))]">
              {recentMentions.map((mention) => (
                <div
                  key={mention.id}
                  className="p-5 hover:bg-[rgb(var(--bg-hover))] transition-colors cursor-pointer group"
                >
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "status-dot mt-2",
                      mention.sentiment === 'positive' && "status-positive",
                      mention.sentiment === 'negative' && "status-critical",
                      mention.sentiment === 'neutral' && "status-neutral"
                    )} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="tag text-xs">{mention.source}</span>
                        <span className="text-xs text-[rgb(var(--text-muted))]">{mention.time}</span>
                        {mention.engagement && (
                          <>
                            <span className="text-[rgb(var(--text-muted))]">·</span>
                            <span className="text-xs text-[rgb(var(--text-muted))]">{mention.engagement}</span>
                          </>
                        )}
                      </div>
                      <h3 className="text-[15px] group-hover:text-[rgb(var(--accent))] transition-colors">{mention.title}</h3>
                    </div>
                    <span className={cn(
                      "text-xs font-medium px-2 py-1 rounded",
                      mention.sentiment === 'positive' && "text-[rgb(var(--positive))] bg-[rgb(var(--positive)/0.1)]",
                      mention.sentiment === 'negative' && "text-[rgb(var(--negative))] bg-[rgb(var(--negative)/0.1)]",
                      mention.sentiment === 'neutral' && "text-[rgb(var(--text-muted))] bg-[rgb(var(--bg-elevated))]"
                    )}>
                      {mention.sentiment}
                    </span>
                    <svg
                      className="w-4 h-4 text-[rgb(var(--text-muted))] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1"
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-5 border-t border-[rgb(var(--border))]">
              <button className="w-full py-2.5 text-sm text-[rgb(var(--accent))] hover:text-[rgb(var(--text-primary))] transition-colors">
                View all mentions →
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
