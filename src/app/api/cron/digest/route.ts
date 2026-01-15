import { NextRequest, NextResponse } from 'next/server'
import { format, subDays, startOfDay, endOfDay } from 'date-fns'
import prisma from '@/lib/prisma'
import grok from '@/lib/grok'
import { sendDigest } from '@/services/notifications'

// This endpoint should be called by a cron job daily
// Protected by CRON_SECRET

export async function POST(req: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = req.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Create job record
    const job = await prisma.cronJob.create({
      data: {
        type: 'DIGEST',
        status: 'RUNNING',
        startedAt: new Date(),
      },
    })

    const results: any[] = []
    const yesterday = subDays(new Date(), 1)
    const dateStr = format(yesterday, 'yyyy-MM-dd')

    try {
      // Get all users with notification settings
      const users = await prisma.user.findMany({
        include: {
          notificationSettings: true,
          brands: {
            select: { id: true, name: true },
          },
        },
      })

      for (const user of users) {
        if (!user.notificationSettings || user.brands.length === 0) continue

        const brandIds = user.brands.map((b) => b.id)

        // Get yesterday's data
        const [mentions, reviews] = await Promise.all([
          prisma.mention.findMany({
            where: {
              brandId: { in: brandIds },
              publishedAt: {
                gte: startOfDay(yesterday),
                lte: endOfDay(yesterday),
              },
            },
            include: {
              brand: { select: { name: true } },
            },
          }),
          prisma.review.findMany({
            where: {
              brandId: { in: brandIds },
              publishedAt: {
                gte: startOfDay(yesterday),
                lte: endOfDay(yesterday),
              },
            },
          }),
        ])

        // Calculate stats
        const avgSentiment =
          mentions.length > 0
            ? mentions.reduce((sum, m) => sum + m.sentimentScore, 0) / mentions.length
            : 0

        // Get highlights (top positive items)
        const highlights = mentions
          .filter((m) => m.sentiment === 'POSITIVE')
          .slice(0, 5)
          .map((m) => ({
            title: m.title || m.content.slice(0, 60),
            url: m.url,
            sentiment: m.sentiment,
          }))

        // Get negative items that need attention
        const negativeItems = mentions
          .filter((m) => m.priority === 'CRITICAL' || m.priority === 'WARNING')
          .slice(0, 3)
          .map((m) => ({
            title: m.title || m.content.slice(0, 60),
            url: m.url,
          }))

        // Generate AI summary
        let summary = ''
        try {
          summary = await grok.generateDigestSummary({
            reviews: reviews.length,
            mentions: mentions.length,
            avgSentiment,
            highlights: highlights.map((h) => h.title),
            negativeItems: negativeItems.map((n) => n.title),
          })
        } catch {
          summary = `Yesterday you had ${mentions.length} mentions and ${reviews.length} reviews. Overall sentiment was ${avgSentiment > 0.2 ? 'positive' : avgSentiment < -0.2 ? 'negative' : 'neutral'}.`
        }

        // Save digest to database
        await prisma.digest.create({
          data: {
            userId: user.id,
            date: startOfDay(yesterday),
            summary,
            stats: {
              mentions: mentions.length,
              reviews: reviews.length,
              avgSentiment,
            },
            sentiment: avgSentiment > 0.2 ? 'Positive' : avgSentiment < -0.2 ? 'Negative' : 'Neutral',
            highlights: highlights,
          },
        })

        // Send digest notifications
        const digestResults = await sendDigest(user.id, {
          date: format(yesterday, 'MMMM d, yyyy'),
          summary,
          stats: {
            mentions: mentions.length,
            reviews: reviews.length,
            avgSentiment,
          },
          highlights,
          negativeItems,
        })

        results.push({
          userId: user.id,
          mentions: mentions.length,
          reviews: reviews.length,
          notifications: digestResults,
        })

        // Mark mentions as included in digest
        await prisma.mention.updateMany({
          where: {
            id: { in: mentions.map((m) => m.id) },
          },
          data: { digestIncluded: true },
        })
      }

      // Update job as completed
      await prisma.cronJob.update({
        where: { id: job.id },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
          metadata: { date: dateStr, usersProcessed: users.length, results },
        },
      })

      return NextResponse.json({
        success: true,
        jobId: job.id,
        date: dateStr,
        usersProcessed: users.length,
        results,
      })
    } catch (error) {
      await prisma.cronJob.update({
        where: { id: job.id },
        data: {
          status: 'FAILED',
          completedAt: new Date(),
          error: String(error),
        },
      })

      throw error
    }
  } catch (error) {
    console.error('Cron digest error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const lastJob = await prisma.cronJob.findFirst({
      where: { type: 'DIGEST' },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      lastRun: lastJob?.completedAt,
      status: lastJob?.status,
      metadata: lastJob?.metadata,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
