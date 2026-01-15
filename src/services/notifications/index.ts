import { sendSlackAlert, sendSlackDigest } from './slack'
import { sendTelegramAlert, sendTelegramDigest } from './telegram'
import { sendEmailAlert, sendEmailDigest } from './email'
import prisma from '@/lib/prisma'
import type { NotificationPayload, Priority, Channel } from '@/types'

export { sendSlackAlert, sendSlackDigest } from './slack'
export { sendTelegramAlert, sendTelegramDigest } from './telegram'
export { sendEmailAlert, sendEmailDigest } from './email'

interface AlertResult {
  channel: Channel
  success: boolean
  error?: string
}

export async function sendAlert(
  userId: string,
  payload: NotificationPayload
): Promise<AlertResult[]> {
  const results: AlertResult[] = []

  // Get user's notification settings
  const settings = await prisma.notificationSettings.findUnique({
    where: { userId },
  })

  if (!settings) {
    return [{ channel: 'SLACK', success: false, error: 'No notification settings found' }]
  }

  const shouldNotify = (channel: 'SLACK' | 'TELEGRAM' | 'EMAIL'): boolean => {
    if (payload.priority === 'CRITICAL') {
      if (channel === 'SLACK') return settings.criticalSlack
      if (channel === 'TELEGRAM') return settings.criticalTelegram
      if (channel === 'EMAIL') return settings.criticalEmail
    }
    if (payload.priority === 'WARNING') {
      if (channel === 'SLACK') return settings.warningSlack
      if (channel === 'TELEGRAM') return settings.warningTelegram
      if (channel === 'EMAIL') return settings.warningEmail
    }
    // INFO priority goes to digest, not immediate alerts
    return false
  }

  // Send to Slack
  if (settings.slackWebhook && shouldNotify('SLACK')) {
    try {
      const success = await sendSlackAlert(settings.slackWebhook, payload)
      results.push({ channel: 'SLACK', success })

      await prisma.alert.create({
        data: {
          userId,
          priority: payload.priority,
          channel: 'SLACK',
          message: `${payload.title}: ${payload.message}`,
          delivered: success,
        },
      })
    } catch (error) {
      results.push({ channel: 'SLACK', success: false, error: String(error) })
    }
  }

  // Send to Telegram
  if (settings.telegramChatId && shouldNotify('TELEGRAM')) {
    try {
      const botToken = process.env.TELEGRAM_BOT_TOKEN || ''
      const success = await sendTelegramAlert(botToken, settings.telegramChatId, payload)
      results.push({ channel: 'TELEGRAM', success })

      await prisma.alert.create({
        data: {
          userId,
          priority: payload.priority,
          channel: 'TELEGRAM',
          message: `${payload.title}: ${payload.message}`,
          delivered: success,
        },
      })
    } catch (error) {
      results.push({ channel: 'TELEGRAM', success: false, error: String(error) })
    }
  }

  // Send Email
  if (settings.email && shouldNotify('EMAIL')) {
    try {
      const success = await sendEmailAlert(settings.email, payload)
      results.push({ channel: 'EMAIL', success })

      await prisma.alert.create({
        data: {
          userId,
          priority: payload.priority,
          channel: 'EMAIL',
          message: `${payload.title}: ${payload.message}`,
          delivered: success,
        },
      })
    } catch (error) {
      results.push({ channel: 'EMAIL', success: false, error: String(error) })
    }
  }

  return results
}

interface DigestData {
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

export async function sendDigest(
  userId: string,
  digest: DigestData
): Promise<AlertResult[]> {
  const results: AlertResult[] = []

  const settings = await prisma.notificationSettings.findUnique({
    where: { userId },
  })

  if (!settings) {
    return [{ channel: 'EMAIL', success: false, error: 'No notification settings found' }]
  }

  // Send digest to Slack
  if (settings.slackWebhook && settings.digestSlack) {
    try {
      const success = await sendSlackDigest(settings.slackWebhook, digest)
      results.push({ channel: 'SLACK', success })
    } catch (error) {
      results.push({ channel: 'SLACK', success: false, error: String(error) })
    }
  }

  // Send digest to Email
  if (settings.email && settings.digestEmail) {
    try {
      const success = await sendEmailDigest(settings.email, digest)
      results.push({ channel: 'EMAIL', success })
    } catch (error) {
      results.push({ channel: 'EMAIL', success: false, error: String(error) })
    }
  }

  return results
}

// Process new mentions and send alerts based on priority
export async function processAndAlert(
  userId: string,
  mention: {
    id: string
    title: string | null
    content: string
    url: string
    priority: Priority
    source: string
    brandName: string
  }
): Promise<void> {
  // Only send immediate alerts for CRITICAL and WARNING
  if (mention.priority === 'INFO') {
    return
  }

  const payload: NotificationPayload = {
    userId,
    priority: mention.priority,
    title: mention.title || 'New Brand Mention',
    message: mention.content.slice(0, 200),
    url: mention.url,
    brandName: mention.brandName,
    source: mention.source as any,
  }

  await sendAlert(userId, payload)

  // Mark mention as alerted
  await prisma.mention.update({
    where: { id: mention.id },
    data: { alertSent: true },
  })
}
