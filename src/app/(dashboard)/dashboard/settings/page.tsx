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
    <div className="p-10 max-w-3xl">
      {/* Header */}
      <header className="mb-10 animate-in">
        <h1 className="text-title1 mb-2">Settings</h1>
        <p className="text-footnote">
          Configure notifications, alerts, and data collection
        </p>
      </header>

      <div className="space-y-10">
        {/* Daily Digest */}
        <section className="animate-in delay-1">
          <h2 className="text-title3 mb-5">Daily Digest</h2>
          <div className="card p-7 space-y-8">
            {/* Time */}
            <div>
              <label className="text-subheadline text-secondary block mb-3">
                Delivery Time
              </label>
              <div className="flex gap-4">
                <input
                  type="time"
                  value={digestTime}
                  onChange={(e) => setDigestTime(e.target.value)}
                  className="w-36"
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
              <label className="text-subheadline text-secondary block mb-4">
                Delivery Channels
              </label>
              <div className="space-y-4">
                {[
                  { key: 'digestSlack', label: 'Slack', detail: '#brand-alerts' },
                  { key: 'digestTelegram', label: 'Telegram', detail: '@bitgo_alerts_bot' },
                  { key: 'digestEmail', label: 'Email', detail: 'team@bitgo.com' },
                ].map((channel) => (
                  <div
                    key={channel.key}
                    className="flex items-center justify-between py-3"
                  >
                    <div>
                      <p className="text-body font-medium">{channel.label}</p>
                      <p className="text-caption mt-1">{channel.detail}</p>
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
          <h2 className="text-title3 mb-5">Instant Alerts</h2>
          <div className="card p-7 space-y-8">
            {/* Sensitivity */}
            <div>
              <label className="text-subheadline text-secondary block mb-4">
                Alert Sensitivity
              </label>
              <div className="space-y-3">
                {[
                  { value: 'critical', label: 'Critical only', desc: '≤2 star reviews, viral negative posts' },
                  { value: 'critical-warning', label: 'Critical + Warning', desc: 'Includes negative PR and threads' },
                  { value: 'all', label: 'All mentions', desc: 'Every mention triggers an alert' },
                ].map((option) => (
                  <label
                    key={option.value}
                    className={cn(
                      "flex items-start gap-4 p-5 rounded-2xl cursor-pointer transition-all border",
                      alertSensitivity === option.value
                        ? "bg-[rgb(var(--bg-tertiary))] border-[rgb(var(--blue))]"
                        : "border-[rgb(var(--separator))] hover:bg-[rgb(var(--bg-tertiary))]"
                    )}
                  >
                    <input
                      type="radio"
                      name="sensitivity"
                      value={option.value}
                      checked={alertSensitivity === option.value}
                      onChange={(e) => setAlertSensitivity(e.target.value)}
                      className="mt-1 accent-[rgb(var(--blue))] w-4 h-4"
                    />
                    <div>
                      <p className="text-body font-medium">{option.label}</p>
                      <p className="text-caption mt-1">{option.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Alert Channels */}
            <div>
              <label className="text-subheadline text-secondary block mb-4">
                Alert Channels
              </label>
              <div className="space-y-4">
                {[
                  { key: 'alertSlack', label: 'Slack' },
                  { key: 'alertTelegram', label: 'Telegram' },
                  { key: 'alertEmail', label: 'Email' },
                ].map((channel) => (
                  <div
                    key={channel.key}
                    className="flex items-center justify-between py-3"
                  >
                    <p className="text-body font-medium">{channel.label}</p>
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
          <h2 className="text-title3 mb-5">Data Collection</h2>
          <div className="card p-7">
            <label className="text-subheadline text-secondary block mb-4">
              Polling Frequency
            </label>
            <div className="flex gap-3">
              {['6h', '12h', '24h'].map((freq) => (
                <button
                  key={freq}
                  onClick={() => setPollingFrequency(freq)}
                  className={cn(
                    "btn",
                    pollingFrequency === freq
                      ? "btn-primary"
                      : "btn-secondary"
                  )}
                >
                  Every {freq}
                </button>
              ))}
            </div>
            <p className="text-caption mt-4">
              More frequent polling uses more Grok API credits
            </p>
          </div>
        </section>

        {/* Connected Integrations */}
        <section className="animate-in delay-4">
          <h2 className="text-title3 mb-5">Connected Integrations</h2>
          <div className="card p-7 space-y-5">
            {[
              { name: 'Slack', detail: '#brand-alerts' },
              { name: 'Telegram', detail: '@bitgo_alerts_bot' },
              { name: 'Email (Resend)', detail: 'team@bitgo.com' },
            ].map((integration) => (
              <div
                key={integration.name}
                className="flex items-center justify-between py-3"
              >
                <div className="flex items-center gap-4">
                  <span className="dot dot-green" />
                  <div>
                    <p className="text-body font-medium">{integration.name}</p>
                    <p className="text-caption mt-1">{integration.detail}</p>
                  </div>
                </div>
                <button className="btn btn-ghost">Configure</button>
              </div>
            ))}

            <button className="w-full btn btn-secondary mt-5">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add Integration
            </button>
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
