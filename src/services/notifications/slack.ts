import type { NotificationPayload, Priority, SlackBlock } from '@/types'
import { getSourceName } from '@/lib/utils'

const priorityEmoji: Record<Priority, string> = {
  CRITICAL: '🔴',
  WARNING: '🟡',
  INFO: '🟢',
}

const priorityColor: Record<Priority, string> = {
  CRITICAL: '#ef4444',
  WARNING: '#f59e0b',
  INFO: '#3b82f6',
}

export async function sendSlackAlert(
  webhookUrl: string,
  payload: NotificationPayload
): Promise<boolean> {
  try {
    const blocks: SlackBlock[] = [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: `${priorityEmoji[payload.priority]} ${payload.priority} Alert`,
          emoji: true,
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*${payload.title}*\n${payload.message}`,
        },
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `*Brand:* ${payload.brandName || 'Unknown'} | *Source:* ${payload.source ? getSourceName(payload.source) : 'Unknown'}`,
          },
        ],
      },
    ]

    if (payload.url) {
      blocks.push({
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'View Source',
              emoji: true,
            },
            url: payload.url,
            style: 'primary',
          },
        ],
      })
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        blocks,
        attachments: [
          {
            color: priorityColor[payload.priority],
            fallback: `${payload.priority}: ${payload.title}`,
          },
        ],
      }),
    })

    return response.ok
  } catch (error) {
    console.error('Slack notification failed:', error)
    return false
  }
}

export async function sendSlackDigest(
  webhookUrl: string,
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

    const blocks: SlackBlock[] = [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: `📊 Daily Brand Digest - ${digest.date}`,
          emoji: true,
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: digest.summary,
        },
      },
      {
        type: 'divider',
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Total Mentions*\n${digest.stats.mentions}`,
          },
          {
            type: 'mrkdwn',
            text: `*New Reviews*\n${digest.stats.reviews}`,
          },
          {
            type: 'mrkdwn',
            text: `*Avg Sentiment*\n${sentimentEmoji} ${digest.stats.avgSentiment > 0 ? '+' : ''}${(digest.stats.avgSentiment * 100).toFixed(0)}%`,
          },
        ],
      },
    ]

    if (digest.highlights.length > 0) {
      blocks.push({
        type: 'divider',
      })
      blocks.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '*Key Highlights:*\n' + digest.highlights
            .slice(0, 5)
            .map((h) => `• <${h.url}|${h.title}> (${h.sentiment})`)
            .join('\n'),
        },
      })
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ blocks }),
    })

    return response.ok
  } catch (error) {
    console.error('Slack digest failed:', error)
    return false
  }
}
