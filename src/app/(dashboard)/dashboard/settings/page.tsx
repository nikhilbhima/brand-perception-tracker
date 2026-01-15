'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

export default function SettingsPage() {
  const [digestTime, setDigestTime] = useState('09:00')
  const [timezone, setTimezone] = useState('Asia/Kolkata')
  const [pollingFrequency, setPollingFrequency] = useState('6h')
  const [alertSensitivity, setAlertSensitivity] = useState('critical-warning')

  const [channels, setChannels] = useState({
    digestSlack: true,
    digestTelegram: true,
    digestEmail: true,
    alertSlack: true,
    alertTelegram: true,
    alertEmail: false,
  })

  return (
    <div className="min-h-screen p-8 max-w-3xl">
      {/* Page header */}
      <header className="mb-8 animate-in">
        <h1 className="font-display text-2xl mb-1">Settings</h1>
        <p className="text-sm text-[rgb(var(--text-muted))]">
          Configure notifications, alerts, and data collection
        </p>
      </header>

      <div className="space-y-8">
        {/* Daily Digest */}
        <section className="animate-in delay-1">
          <h2 className="text-sm font-medium mb-4">Daily Digest</h2>
          <div className="surface p-6 space-y-6">
            {/* Time */}
            <div>
              <label className="text-sm text-[rgb(var(--text-secondary))] block mb-2">
                Delivery Time
              </label>
              <div className="flex gap-3">
                <input
                  type="time"
                  value={digestTime}
                  onChange={(e) => setDigestTime(e.target.value)}
                  className="w-32"
                />
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="flex-1"
                >
                  <option value="Asia/Kolkata">IST (India)</option>
                  <option value="America/New_York">EST (New York)</option>
                  <option value="America/Los_Angeles">PST (Los Angeles)</option>
                  <option value="Europe/London">GMT (London)</option>
                  <option value="UTC">UTC</option>
                </select>
              </div>
            </div>

            {/* Channels */}
            <div>
              <label className="text-sm text-[rgb(var(--text-secondary))] block mb-3">
                Delivery Channels
              </label>
              <div className="space-y-3">
                {[
                  { key: 'digestSlack', label: 'Slack', detail: '#brand-alerts' },
                  { key: 'digestTelegram', label: 'Telegram', detail: '@bitgo_alerts_bot' },
                  { key: 'digestEmail', label: 'Email', detail: 'team@bitgo.com' },
                ].map((channel) => (
                  <div
                    key={channel.key}
                    className="flex items-center justify-between py-2"
                  >
                    <div>
                      <span className="text-sm block">{channel.label}</span>
                      <span className="text-xs text-[rgb(var(--text-muted))]">{channel.detail}</span>
                    </div>
                    <button
                      onClick={() => setChannels(prev => ({
                        ...prev,
                        [channel.key]: !prev[channel.key as keyof typeof channels]
                      }))}
                      className={cn(
                        "toggle",
                        channels[channel.key as keyof typeof channels] && "active"
                      )}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Instant Alerts */}
        <section className="animate-in delay-2">
          <h2 className="text-sm font-medium mb-4">Instant Alerts</h2>
          <div className="surface p-6 space-y-6">
            {/* Sensitivity */}
            <div>
              <label className="text-sm text-[rgb(var(--text-secondary))] block mb-3">
                Alert Sensitivity
              </label>
              <div className="space-y-2">
                {[
                  { value: 'critical', label: 'Critical only', desc: '≤2 star reviews, viral negative posts' },
                  { value: 'critical-warning', label: 'Critical + Warning', desc: 'Includes negative PR and threads' },
                  { value: 'all', label: 'All mentions', desc: 'Every mention triggers an alert' },
                ].map((option) => (
                  <label
                    key={option.value}
                    className={cn(
                      "flex items-start gap-3 p-4 rounded-lg cursor-pointer transition-colors border",
                      alertSensitivity === option.value
                        ? "bg-[rgb(var(--bg-elevated))] border-[rgb(var(--accent-border))]"
                        : "border-[rgb(var(--border))] hover:bg-[rgb(var(--bg-hover))]"
                    )}
                  >
                    <input
                      type="radio"
                      name="sensitivity"
                      value={option.value}
                      checked={alertSensitivity === option.value}
                      onChange={(e) => setAlertSensitivity(e.target.value)}
                      className="mt-0.5 accent-[rgb(var(--accent))]"
                    />
                    <div>
                      <span className="text-sm block">{option.label}</span>
                      <span className="text-xs text-[rgb(var(--text-muted))]">{option.desc}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Alert Channels */}
            <div>
              <label className="text-sm text-[rgb(var(--text-secondary))] block mb-3">
                Alert Channels
              </label>
              <div className="space-y-3">
                {[
                  { key: 'alertSlack', label: 'Slack' },
                  { key: 'alertTelegram', label: 'Telegram' },
                  { key: 'alertEmail', label: 'Email' },
                ].map((channel) => (
                  <div
                    key={channel.key}
                    className="flex items-center justify-between py-2"
                  >
                    <span className="text-sm">{channel.label}</span>
                    <button
                      onClick={() => setChannels(prev => ({
                        ...prev,
                        [channel.key]: !prev[channel.key as keyof typeof channels]
                      }))}
                      className={cn(
                        "toggle",
                        channels[channel.key as keyof typeof channels] && "active"
                      )}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Data Collection */}
        <section className="animate-in delay-3">
          <h2 className="text-sm font-medium mb-4">Data Collection</h2>
          <div className="surface p-6">
            <div>
              <label className="text-sm text-[rgb(var(--text-secondary))] block mb-3">
                Polling Frequency
              </label>
              <div className="flex gap-2">
                {['6h', '12h', '24h'].map((freq) => (
                  <button
                    key={freq}
                    onClick={() => setPollingFrequency(freq)}
                    className={cn(
                      "px-4 py-2.5 rounded-lg text-sm transition-colors border",
                      pollingFrequency === freq
                        ? "bg-[rgb(var(--bg-elevated))] border-[rgb(var(--accent-border))] text-[rgb(var(--text-primary))]"
                        : "border-[rgb(var(--border))] text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))]"
                    )}
                  >
                    Every {freq}
                  </button>
                ))}
              </div>
              <p className="text-xs text-[rgb(var(--text-muted))] mt-3">
                More frequent polling uses more Grok API credits
              </p>
            </div>
          </div>
        </section>

        {/* Connected Integrations */}
        <section className="animate-in delay-4">
          <h2 className="text-sm font-medium mb-4">Connected Integrations</h2>
          <div className="surface p-6 space-y-4">
            {[
              { name: 'Slack', detail: '#brand-alerts', status: 'connected' },
              { name: 'Telegram', detail: '@bitgo_alerts_bot', status: 'connected' },
              { name: 'Email (Resend)', detail: 'team@bitgo.com', status: 'connected' },
            ].map((integration) => (
              <div
                key={integration.name}
                className="flex items-center justify-between py-2"
              >
                <div className="flex items-center gap-3">
                  <span className="status-dot status-positive" />
                  <div>
                    <span className="text-sm block">{integration.name}</span>
                    <span className="text-xs text-[rgb(var(--text-muted))]">{integration.detail}</span>
                  </div>
                </div>
                <button className="text-xs text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text-primary))] transition-colors">
                  Configure
                </button>
              </div>
            ))}

            <button className="w-full mt-4 py-3 text-sm text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))] border border-[rgb(var(--border))] rounded-lg transition-colors">
              + Add integration
            </button>
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
