'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

export default function ProfilePage() {
  const [brandName, setBrandName] = useState('BitGo')
  const [keywords, setKeywords] = useState('BitGo, bitgo, @BitGo')
  const [excludeKeywords, setExcludeKeywords] = useState('bitgogaming')

  const reviewUrls = [
    { platform: 'G2', url: 'https://g2.com/products/bitgo/reviews' },
    { platform: 'Trustpilot', url: 'https://trustpilot.com/review/bitgo.com' },
    { platform: 'Capterra', url: 'https://capterra.com/p/bitgo' },
    { platform: 'TrustRadius', url: 'https://trustradius.com/products/bitgo' },
  ]

  const teamMembers = [
    { name: 'Nikhil Bhima', email: 'admin@bitgo.com', role: 'Admin', isYou: true },
    { name: 'Nick Chen', email: 'nick@bitgo.com', role: 'Viewer', isYou: false },
  ]

  return (
    <div className="p-10 max-w-3xl">
      {/* Header */}
      <header className="mb-10 animate-in">
        <h1 className="text-title1 mb-2">Brand Profile</h1>
        <p className="text-footnote">
          Configure your brand details and tracking settings
        </p>
      </header>

      <div className="space-y-10">
        {/* Brand Info */}
        <section className="animate-in delay-1">
          <h2 className="text-title3 mb-5">Brand Details</h2>
          <div className="card p-7 space-y-6">
            <div>
              <label className="text-subheadline text-secondary block mb-3">
                Brand Name
              </label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
              />
            </div>

            <div>
              <label className="text-subheadline text-secondary block mb-3">
                Keywords to Track
              </label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="Comma-separated keywords"
              />
              <p className="text-caption mt-3">
                Mentions containing these keywords will be tracked
              </p>
            </div>

            <div>
              <label className="text-subheadline text-secondary block mb-3">
                Exclude Keywords
              </label>
              <input
                type="text"
                value={excludeKeywords}
                onChange={(e) => setExcludeKeywords(e.target.value)}
                placeholder="Comma-separated keywords to ignore"
              />
              <p className="text-caption mt-3">
                Mentions containing these keywords will be ignored
              </p>
            </div>
          </div>
        </section>

        {/* Review Platforms */}
        <section className="animate-in delay-2">
          <h2 className="text-title3 mb-5">Review Platforms</h2>
          <div className="card p-7">
            <div className="space-y-4">
              {reviewUrls.map((review) => (
                <div
                  key={review.platform}
                  className="flex items-center justify-between py-4"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <span className="dot dot-green" />
                    <div className="min-w-0">
                      <p className="text-body font-medium">{review.platform}</p>
                      <p className="text-caption truncate max-w-[350px] mt-1">
                        {review.url}
                      </p>
                    </div>
                  </div>
                  <button className="btn btn-ghost">Edit</button>
                </div>
              ))}
            </div>

            <button className="w-full btn btn-secondary mt-5">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add Platform
            </button>
          </div>
        </section>

        {/* Team */}
        <section className="animate-in delay-3">
          <h2 className="text-title3 mb-5">Team Access</h2>
          <div className="card p-7">
            <div className="space-y-3">
              {teamMembers.map((member) => (
                <div
                  key={member.email}
                  className={cn(
                    "flex items-center justify-between p-5 rounded-2xl",
                    member.isYou && "bg-[rgb(var(--blue)/0.1)] border border-[rgb(var(--blue)/0.2)]"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-11 h-11 rounded-full flex items-center justify-center text-sm font-semibold",
                      member.isYou
                        ? "bg-[rgb(var(--blue))] text-white"
                        : "bg-[rgb(var(--bg-elevated))] text-secondary"
                    )}>
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <p className={cn(
                        "text-body font-medium",
                        member.isYou && "text-blue"
                      )}>
                        {member.name}
                        {member.isYou && <span className="font-normal ml-2 text-secondary">(you)</span>}
                      </p>
                      <p className="text-caption mt-1">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="tag">{member.role}</span>
                    {!member.isYou && (
                      <button className="btn btn-ghost text-red">
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full btn btn-secondary mt-5">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
              </svg>
              Invite Member
            </button>
          </div>
        </section>

        {/* Data Export */}
        <section className="animate-in delay-4">
          <h2 className="text-title3 mb-5">Data Export</h2>
          <div className="card p-7">
            <p className="text-callout text-secondary mb-5">
              Download all mentions and analytics data as CSV
            </p>
            <div className="flex gap-3">
              <button className="btn btn-secondary">Last 30 days</button>
              <button className="btn btn-secondary">Last 90 days</button>
              <button className="btn btn-ghost">Custom range</button>
            </div>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="animate-in delay-4">
          <h2 className="text-title3 mb-5 text-red">Danger Zone</h2>
          <div className="card p-7 border-[rgb(var(--red)/0.2)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body font-medium">Delete all data</p>
                <p className="text-caption mt-2">
                  Permanently remove all mentions, alerts, and analytics
                </p>
              </div>
              <button className="btn btn-ghost text-red border border-[rgb(var(--red)/0.3)] hover:bg-[rgb(var(--red)/0.1)]">
                Delete
              </button>
            </div>
          </div>
        </section>

        {/* Save */}
        <div className="flex justify-end pt-6">
          <button className="btn btn-primary px-8">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}
