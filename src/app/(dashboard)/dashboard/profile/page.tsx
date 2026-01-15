'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

export default function ProfilePage() {
  const [brandName, setBrandName] = useState('BitGo')
  const [keywords, setKeywords] = useState('BitGo, bitgo, @BitGo')
  const [excludeKeywords, setExcludeKeywords] = useState('bitgogaming')

  const reviewUrls = [
    { platform: 'G2', url: 'https://g2.com/products/bitgo/reviews', status: 'active' },
    { platform: 'Trustpilot', url: 'https://trustpilot.com/review/bitgo.com', status: 'active' },
    { platform: 'Capterra', url: 'https://capterra.com/p/bitgo', status: 'active' },
    { platform: 'TrustRadius', url: 'https://trustradius.com/products/bitgo', status: 'active' },
  ]

  const teamMembers = [
    { name: 'Nikhil Bhima', email: 'admin@bitgo.com', role: 'Admin', isYou: true },
    { name: 'Nick Chen', email: 'nick@bitgo.com', role: 'Viewer', isYou: false },
  ]

  return (
    <div className="min-h-screen p-8 max-w-3xl">
      {/* Page header */}
      <header className="mb-8 animate-in">
        <h1 className="font-display text-2xl mb-1">Brand Profile</h1>
        <p className="text-sm text-[rgb(var(--text-muted))]">
          Configure your brand details and tracking settings
        </p>
      </header>

      <div className="space-y-8">
        {/* Brand Info */}
        <section className="animate-in delay-1">
          <h2 className="text-sm font-medium mb-4">Brand Details</h2>
          <div className="surface p-6 space-y-5">
            <div>
              <label className="text-sm text-[rgb(var(--text-secondary))] block mb-2">
                Brand Name
              </label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm text-[rgb(var(--text-secondary))] block mb-2">
                Keywords to Track
              </label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                className="w-full"
                placeholder="Comma-separated keywords"
              />
              <p className="text-xs text-[rgb(var(--text-muted))] mt-2">
                Mentions containing these keywords will be tracked
              </p>
            </div>

            <div>
              <label className="text-sm text-[rgb(var(--text-secondary))] block mb-2">
                Exclude Keywords
              </label>
              <input
                type="text"
                value={excludeKeywords}
                onChange={(e) => setExcludeKeywords(e.target.value)}
                className="w-full"
                placeholder="Comma-separated keywords to ignore"
              />
              <p className="text-xs text-[rgb(var(--text-muted))] mt-2">
                Mentions containing these keywords will be ignored
              </p>
            </div>
          </div>
        </section>

        {/* Review Platforms */}
        <section className="animate-in delay-2">
          <h2 className="text-sm font-medium mb-4">Review Platforms</h2>
          <div className="surface p-6">
            <div className="space-y-3">
              {reviewUrls.map((review) => (
                <div
                  key={review.platform}
                  className="flex items-center justify-between py-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="status-dot status-positive" />
                    <div className="min-w-0">
                      <span className="text-sm block">{review.platform}</span>
                      <span className="text-xs text-[rgb(var(--text-muted))] truncate block max-w-[400px]">
                        {review.url}
                      </span>
                    </div>
                  </div>
                  <button className="text-xs text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text-primary))] transition-colors flex-shrink-0">
                    Edit
                  </button>
                </div>
              ))}
            </div>

            <button className="w-full mt-4 py-3 text-sm text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))] border border-[rgb(var(--border))] rounded-lg transition-colors">
              + Add review platform
            </button>
          </div>
        </section>

        {/* Team */}
        <section className="animate-in delay-3">
          <h2 className="text-sm font-medium mb-4">Team Access</h2>
          <div className="surface p-6">
            <div className="space-y-2">
              {teamMembers.map((member) => (
                <div
                  key={member.email}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-lg",
                    member.isYou && "bg-[rgb(var(--accent-dim))] border border-[rgb(var(--accent-border))]"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium",
                      member.isYou
                        ? "bg-[rgb(var(--accent))] text-[rgb(var(--bg-base))]"
                        : "bg-[rgb(var(--bg-elevated))] text-[rgb(var(--text-secondary))]"
                    )}>
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <span className={cn(
                        "text-sm block",
                        member.isYou && "text-[rgb(var(--accent))]"
                      )}>
                        {member.name} {member.isYou && <span className="text-xs font-normal">(you)</span>}
                      </span>
                      <span className="text-xs text-[rgb(var(--text-muted))]">{member.email}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="tag text-xs">{member.role}</span>
                    {!member.isYou && (
                      <button className="text-xs text-[rgb(var(--text-muted))] hover:text-[rgb(var(--negative))] transition-colors">
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-4 py-3 text-sm text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))] border border-[rgb(var(--border))] rounded-lg transition-colors">
              + Invite team member
            </button>
          </div>
        </section>

        {/* Data Export */}
        <section className="animate-in delay-4">
          <h2 className="text-sm font-medium mb-4">Data Export</h2>
          <div className="surface p-6">
            <p className="text-sm text-[rgb(var(--text-secondary))] mb-4">
              Download all mentions and analytics data as CSV
            </p>
            <div className="flex gap-3">
              <button className="px-4 py-2.5 text-sm bg-[rgb(var(--bg-elevated))] hover:bg-[rgb(var(--bg-hover))] border border-[rgb(var(--border))] rounded-lg transition-colors">
                Last 30 days
              </button>
              <button className="px-4 py-2.5 text-sm bg-[rgb(var(--bg-elevated))] hover:bg-[rgb(var(--bg-hover))] border border-[rgb(var(--border))] rounded-lg transition-colors">
                Last 90 days
              </button>
              <button className="px-4 py-2.5 text-sm text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))] rounded-lg transition-colors">
                Custom range
              </button>
            </div>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="animate-in delay-5">
          <h2 className="text-sm font-medium mb-4 text-[rgb(var(--negative))]">Danger Zone</h2>
          <div className="surface p-6 border-[rgb(var(--negative)/0.2)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm">Delete all data</p>
                <p className="text-xs text-[rgb(var(--text-muted))] mt-1">
                  Permanently remove all mentions, alerts, and analytics
                </p>
              </div>
              <button className="px-4 py-2 text-[rgb(var(--negative))] border border-[rgb(var(--negative)/0.3)] rounded-lg text-sm hover:bg-[rgb(var(--negative)/0.1)] transition-colors">
                Delete
              </button>
            </div>
          </div>
        </section>

        {/* Save */}
        <div className="flex justify-end pt-4 animate-in delay-5">
          <button className="btn btn-primary">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}
