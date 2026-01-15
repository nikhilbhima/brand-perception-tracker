import type { NotificationPayload, Priority } from '@/types'
import { getSourceName } from '@/lib/utils'

const priorityEmoji: Record<Priority, string> = {
  CRITICAL: '🔴',
  WARNING: '🟡',
  INFO: '🟢',
}

export async function sendTelegramAlert(
  botToken: string,
  chatId: string,
  payload: NotificationPayload
): Promise<boolean> {
  try {
    const emoji = priorityEmoji[payload.priority]

    let message = `${emoji} *${payload.priority} Alert*\n\n`
    message += `*${escapeMarkdown(payload.title)}*\n\n`
    message += `${escapeMarkdown(payload.message)}\n\n`
    message += `📍 *Brand:* ${escapeMarkdown(payload.brandName || 'Unknown')}\n`
    message += `📰 *Source:* ${payload.source ? getSourceName(payload.source) : 'Unknown'}`

    if (payload.url) {
      message += `\n\n🔗 [View Source](${payload.url})`
    }

    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'Markdown',
          disable_web_page_preview: false,
        }),
      }
    )

    const data = await response.json()
    return data.ok === true
  } catch (error) {
    console.error('Telegram notification failed:', error)
    return false
  }
}

export async function sendTelegramDigest(
  botToken: string,
  chatId: string,
  digest: {
    date: string
    summary: string
    stats: {
      mentions: number
      reviews: number
      avgSentiment: number
    }
    highlights: { title: string; url: string; sentiment: string }[]
  }
): Promise<boolean> {
  try {
    const sentimentEmoji = digest.stats.avgSentiment > 0.2 ? '📈' : digest.stats.avgSentiment < -0.2 ? '📉' : '➡️'

    let message = `📊 *Daily Brand Digest \\- ${escapeMarkdown(digest.date)}*\n\n`
    message += `${escapeMarkdown(digest.summary)}\n\n`
    message += `━━━━━━━━━━━━━━━\n\n`
    message += `📝 *Mentions:* ${digest.stats.mentions}\n`
    message += `⭐ *Reviews:* ${digest.stats.reviews}\n`
    message += `${sentimentEmoji} *Sentiment:* ${digest.stats.avgSentiment > 0 ? '+' : ''}${(digest.stats.avgSentiment * 100).toFixed(0)}%\n`

    if (digest.highlights.length > 0) {
      message += `\n━━━━━━━━━━━━━━━\n\n`
      message += `*Key Highlights:*\n`
      digest.highlights.slice(0, 5).forEach((h, i) => {
        message += `${i + 1}\\. [${escapeMarkdown(h.title.slice(0, 50))}](${h.url})\n`
      })
    }

    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'MarkdownV2',
          disable_web_page_preview: true,
        }),
      }
    )

    const data = await response.json()
    return data.ok === true
  } catch (error) {
    console.error('Telegram digest failed:', error)
    return false
  }
}

// Escape special characters for Telegram MarkdownV2
function escapeMarkdown(text: string): string {
  return text.replace(/[_*[\]()~`>#+=|{}.!-]/g, '\\$&')
}
