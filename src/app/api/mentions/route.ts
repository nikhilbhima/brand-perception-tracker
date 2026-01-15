import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const brandId = searchParams.get('brandId')
    const source = searchParams.get('source')
    const sentiment = searchParams.get('sentiment')
    const priority = searchParams.get('priority')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    // Build where clause
    const where: any = {
      brand: {
        userId: session.user.id,
      },
    }

    if (brandId) where.brandId = brandId
    if (source) where.source = source
    if (sentiment) where.sentiment = sentiment
    if (priority) where.priority = priority

    const [mentions, total] = await Promise.all([
      prisma.mention.findMany({
        where,
        include: {
          brand: {
            select: {
              id: true,
              name: true,
              isOwn: true,
            },
          },
        },
        orderBy: { publishedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.mention.count({ where }),
    ])

    return NextResponse.json({
      data: mentions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('GET /api/mentions error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
