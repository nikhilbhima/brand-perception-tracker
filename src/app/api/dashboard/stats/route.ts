import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { subDays, startOfDay, endOfDay } from 'date-fns'
import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const now = new Date()
    const weekAgo = subDays(now, 7)
    const twoWeeksAgo = subDays(now, 14)

    // Get user's brands
    const brands = await prisma.brand.findMany({
      where: { userId: session.user.id },
      select: { id: true },
    })
    const brandIds = brands.map((b) => b.id)

    if (brandIds.length === 0) {
      return NextResponse.json({
        data: {
          totalMentions: 0,
          totalReviews: 0,
          avgRating: 0,
          sentimentScore: 0,
          mentionsTrend: 0,
          reviewsTrend: 0,
          ratingTrend: 0,
          sentimentTrend: 0,
        },
      })
    }

    // Current period stats
    const [currentMentions, currentReviews] = await Promise.all([
      prisma.mention.findMany({
        where: {
          brandId: { in: brandIds },
          publishedAt: { gte: weekAgo },
        },
        select: { sentimentScore: true },
      }),
      prisma.review.findMany({
        where: {
          brandId: { in: brandIds },
          publishedAt: { gte: weekAgo },
        },
        select: { rating: true },
      }),
    ])

    // Previous period stats (for trend calculation)
    const [prevMentions, prevReviews] = await Promise.all([
      prisma.mention.count({
        where: {
          brandId: { in: brandIds },
          publishedAt: { gte: twoWeeksAgo, lt: weekAgo },
        },
      }),
      prisma.review.findMany({
        where: {
          brandId: { in: brandIds },
          publishedAt: { gte: twoWeeksAgo, lt: weekAgo },
        },
        select: { rating: true },
      }),
    ])

    // Calculate stats
    const totalMentions = currentMentions.length
    const totalReviews = currentReviews.length

    const avgRating =
      currentReviews.length > 0
        ? currentReviews.reduce((sum, r) => sum + r.rating, 0) / currentReviews.length
        : 0

    const sentimentScore =
      currentMentions.length > 0
        ? currentMentions.reduce((sum, m) => sum + m.sentimentScore, 0) / currentMentions.length
        : 0

    // Calculate trends
    const mentionsTrend =
      prevMentions > 0 ? ((totalMentions - prevMentions) / prevMentions) * 100 : 0

    const prevAvgRating =
      prevReviews.length > 0
        ? prevReviews.reduce((sum, r) => sum + r.rating, 0) / prevReviews.length
        : avgRating

    const ratingTrend =
      prevAvgRating > 0 ? ((avgRating - prevAvgRating) / prevAvgRating) * 100 : 0

    const reviewsTrend =
      prevReviews.length > 0
        ? ((totalReviews - prevReviews.length) / prevReviews.length) * 100
        : 0

    return NextResponse.json({
      data: {
        totalMentions,
        totalReviews,
        avgRating: Math.round(avgRating * 10) / 10,
        sentimentScore: Math.round(sentimentScore * 100),
        mentionsTrend: Math.round(mentionsTrend * 10) / 10,
        reviewsTrend: Math.round(reviewsTrend * 10) / 10,
        ratingTrend: Math.round(ratingTrend * 10) / 10,
        sentimentTrend: 0, // Would need previous sentiment data
      },
    })
  } catch (error) {
    console.error('GET /api/dashboard/stats error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
