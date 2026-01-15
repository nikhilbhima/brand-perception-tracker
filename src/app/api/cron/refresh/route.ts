import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { runAllCollectors } from '@/services/collectors'
import { processAndAlert } from '@/services/notifications'

// This endpoint should be called by a cron job every 6 hours
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
        type: 'REFRESH',
        status: 'RUNNING',
        startedAt: new Date(),
      },
    })

    const results: any[] = []

    try {
      // Get all brands from all users
      const brands = await prisma.brand.findMany({
        include: {
          user: {
            select: { id: true },
          },
        },
      })

      for (const brand of brands) {
        console.log(`[Refresh] Processing brand: ${brand.name}`)

        // Run collectors for this brand
        const collectorResults = await runAllCollectors({
          brandName: brand.name,
          brandId: brand.id,
          platformId: brand.trustpilotId || brand.g2Id || undefined,
        })

        results.push({
          brandId: brand.id,
          brandName: brand.name,
          results: collectorResults,
        })

        // Find new mentions that need alerts
        const newMentions = await prisma.mention.findMany({
          where: {
            brandId: brand.id,
            alertSent: false,
            priority: { in: ['CRITICAL', 'WARNING'] },
          },
          include: {
            brand: {
              select: { name: true },
            },
          },
        })

        // Send alerts for new critical/warning mentions
        for (const mention of newMentions) {
          await processAndAlert(brand.userId, {
            id: mention.id,
            title: mention.title,
            content: mention.content,
            url: mention.url,
            priority: mention.priority,
            source: mention.source,
            brandName: mention.brand.name,
          })
        }
      }

      // Update job as completed
      await prisma.cronJob.update({
        where: { id: job.id },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
          metadata: { results },
        },
      })

      return NextResponse.json({
        success: true,
        jobId: job.id,
        brandsProcessed: brands.length,
        results,
      })
    } catch (error) {
      // Update job as failed
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
    console.error('Cron refresh error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Allow GET for testing/monitoring
export async function GET(req: NextRequest) {
  try {
    const lastJob = await prisma.cronJob.findFirst({
      where: { type: 'REFRESH' },
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
