import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { slugify } from '@/lib/utils'

const createBrandSchema = z.object({
  name: z.string().min(1).max(100),
  website: z.string().url().optional(),
  isOwn: z.boolean().default(true),
  trustpilotId: z.string().optional(),
  g2Id: z.string().optional(),
  capterraId: z.string().optional(),
})

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const brands = await prisma.brand.findMany({
      where: { userId: session.user.id },
      include: {
        _count: {
          select: {
            mentions: true,
            reviews: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ data: brands })
  } catch (error) {
    console.error('GET /api/brands error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const validated = createBrandSchema.parse(body)

    const slug = slugify(validated.name)

    // Check if brand with same slug already exists for this user
    const existing = await prisma.brand.findUnique({
      where: {
        userId_slug: {
          userId: session.user.id,
          slug,
        },
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'A brand with this name already exists' },
        { status: 400 }
      )
    }

    const brand = await prisma.brand.create({
      data: {
        userId: session.user.id,
        name: validated.name,
        slug,
        website: validated.website,
        isOwn: validated.isOwn,
        trustpilotId: validated.trustpilotId,
        g2Id: validated.g2Id,
        capterraId: validated.capterraId,
      },
    })

    return NextResponse.json({ data: brand }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('POST /api/brands error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
