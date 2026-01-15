import { Resend } from 'resend'
import type { NotificationPayload, Priority } from '@/types'
import { getSourceName } from '@/lib/utils'

// Lazy initialization to avoid build-time errors
function getResend(): Resend {
  return new Resend(process.env.RESEND_API_KEY || '')
}

const priorityColors: Record<Priority, { bg: string; text: string; border: string }> = {
  CRITICAL: { bg: '#fef2f2', text: '#991b1b', border: '#fecaca' },
  WARNING: { bg: '#fffbeb', text: '#92400e', border: '#fde68a' },
  INFO: { bg: '#eff6ff', text: '#1e40af', border: '#bfdbfe' },
}

export async function sendEmailAlert(
  to: string,
  payload: NotificationPayload
): Promise<boolean> {
  try {
    const colors = priorityColors[payload.priority]

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: #f9fafb;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
      <!-- Header -->
      <div style="background: ${colors.bg}; border-bottom: 2px solid ${colors.border}; padding: 20px;">
        <h1 style="margin: 0; font-size: 18px; color: ${colors.text};">
          ${payload.priority === 'CRITICAL' ? '🔴' : payload.priority === 'WARNING' ? '🟡' : '🟢'}
          ${payload.priority} Alert - Brand Monitor
        </h1>
      </div>

      <!-- Content -->
      <div style="padding: 24px;">
        <h2 style="margin: 0 0 12px; font-size: 20px; color: #111827;">
          ${payload.title}
        </h2>
        <p style="margin: 0 0 20px; font-size: 16px; color: #4b5563; line-height: 1.5;">
          ${payload.message}
        </p>

        <!-- Meta -->
        <div style="background: #f9fafb; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
          <div style="display: flex; gap: 24px;">
            <div>
              <span style="font-size: 12px; color: #6b7280; text-transform: uppercase;">Brand</span>
              <p style="margin: 4px 0 0; font-size: 14px; color: #111827; font-weight: 500;">
                ${payload.brandName || 'Unknown'}
              </p>
            </div>
            <div>
              <span style="font-size: 12px; color: #6b7280; text-transform: uppercase;">Source</span>
              <p style="margin: 4px 0 0; font-size: 14px; color: #111827; font-weight: 500;">
                ${payload.source ? getSourceName(payload.source) : 'Unknown'}
              </p>
            </div>
          </div>
        </div>

        ${payload.url ? `
        <a href="${payload.url}"
           style="display: inline-block; background: #0ea5e9; color: white; text-decoration: none;
                  padding: 12px 24px; border-radius: 8px; font-weight: 500; font-size: 14px;">
          View Source →
        </a>
        ` : ''}
      </div>

      <!-- Footer -->
      <div style="background: #f9fafb; padding: 16px 24px; text-align: center;">
        <p style="margin: 0; font-size: 12px; color: #9ca3af;">
          You're receiving this because you have alerts enabled for Brand Monitor.
          <a href="#" style="color: #6b7280;">Manage notification settings</a>
        </p>
      </div>
    </div>
  </div>
</body>
</html>
    `.trim()

    const { data, error } = await getResend().emails.send({
      from: process.env.EMAIL_FROM || 'Brand Monitor <alerts@brandmonitor.app>',
      to,
      subject: `[${payload.priority}] ${payload.title}`,
      html,
    })

    if (error) {
      console.error('Email send error:', error)
      return false
    }

    return !!data?.id
  } catch (error) {
    console.error('Email notification failed:', error)
    return false
  }
}

export async function sendEmailDigest(
  to: string,
  digest: {
    date: string
    summary: string
    stats: {
      mentions: number
      reviews: number
      avgSentiment: number
    }
    highlights: { title: string; url: string; sentiment: string }[]
    negativeItems: { title: string; url: string }[]
  }
): Promise<boolean> {
  try {
    const sentimentColor = digest.stats.avgSentiment > 0.2 ? '#10b981' : digest.stats.avgSentiment < -0.2 ? '#ef4444' : '#6b7280'
    const sentimentText = digest.stats.avgSentiment > 0 ? '+' : ''

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: #f9fafb;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 32px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px; color: white;">
          📊 Daily Brand Digest
        </h1>
        <p style="margin: 8px 0 0; font-size: 14px; color: #94a3b8;">
          ${digest.date}
        </p>
      </div>

      <!-- Summary -->
      <div style="padding: 24px;">
        <p style="margin: 0 0 24px; font-size: 16px; color: #374151; line-height: 1.6;">
          ${digest.summary}
        </p>

        <!-- Stats Grid -->
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px;">
          <div style="background: #f9fafb; border-radius: 8px; padding: 16px; text-align: center;">
            <p style="margin: 0; font-size: 28px; font-weight: 700; color: #0ea5e9;">${digest.stats.mentions}</p>
            <p style="margin: 4px 0 0; font-size: 12px; color: #6b7280; text-transform: uppercase;">Mentions</p>
          </div>
          <div style="background: #f9fafb; border-radius: 8px; padding: 16px; text-align: center;">
            <p style="margin: 0; font-size: 28px; font-weight: 700; color: #f59e0b;">${digest.stats.reviews}</p>
            <p style="margin: 4px 0 0; font-size: 12px; color: #6b7280; text-transform: uppercase;">Reviews</p>
          </div>
          <div style="background: #f9fafb; border-radius: 8px; padding: 16px; text-align: center;">
            <p style="margin: 0; font-size: 28px; font-weight: 700; color: ${sentimentColor};">${sentimentText}${(digest.stats.avgSentiment * 100).toFixed(0)}%</p>
            <p style="margin: 4px 0 0; font-size: 12px; color: #6b7280; text-transform: uppercase;">Sentiment</p>
          </div>
        </div>

        ${digest.negativeItems.length > 0 ? `
        <!-- Attention Needed -->
        <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
          <h3 style="margin: 0 0 12px; font-size: 14px; color: #991b1b;">⚠️ Items Needing Attention</h3>
          <ul style="margin: 0; padding: 0 0 0 16px;">
            ${digest.negativeItems.slice(0, 3).map(item => `
            <li style="margin: 8px 0; font-size: 14px; color: #7f1d1d;">
              <a href="${item.url}" style="color: #991b1b;">${item.title}</a>
            </li>
            `).join('')}
          </ul>
        </div>
        ` : ''}

        ${digest.highlights.length > 0 ? `
        <!-- Highlights -->
        <h3 style="margin: 0 0 12px; font-size: 14px; color: #374151;">Key Highlights</h3>
        <div style="border-top: 1px solid #e5e7eb;">
          ${digest.highlights.slice(0, 5).map(item => `
          <a href="${item.url}" style="display: block; padding: 12px 0; border-bottom: 1px solid #e5e7eb; text-decoration: none;">
            <p style="margin: 0; font-size: 14px; color: #111827;">${item.title}</p>
            <span style="font-size: 12px; color: ${item.sentiment === 'POSITIVE' ? '#10b981' : item.sentiment === 'NEGATIVE' ? '#ef4444' : '#6b7280'};">
              ${item.sentiment}
            </span>
          </a>
          `).join('')}
        </div>
        ` : ''}
      </div>

      <!-- Footer -->
      <div style="background: #f9fafb; padding: 16px 24px; text-align: center;">
        <p style="margin: 0; font-size: 12px; color: #9ca3af;">
          Brand Monitor - Reputation Intelligence Platform
        </p>
      </div>
    </div>
  </div>
</body>
</html>
    `.trim()

    const { data, error } = await getResend().emails.send({
      from: process.env.EMAIL_FROM || 'Brand Monitor <digest@brandmonitor.app>',
      to,
      subject: `📊 Daily Brand Digest - ${digest.date}`,
      html,
    })

    if (error) {
      console.error('Email digest error:', error)
      return false
    }

    return !!data?.id
  } catch (error) {
    console.error('Email digest failed:', error)
    return false
  }
}
