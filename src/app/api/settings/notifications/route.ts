import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

const updateSettingsSchema = z.object({
  slackWebhook: z.string().url().optional().nullable(),
  telegramChatId: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  criticalSlack: z.boolean().optional(),
  criticalTelegram: z.boolean().optional(),
  criticalEmail: z.boolean().optional(),
  warningSlack: z.boolean().optional(),
  warningTelegram: z.boolean().optional(),
  warningEmail: z.boolean().optional(),
  digestSlack: z.boolean().optional(),
  digestEmail: z.boolean().optional(),
  digestTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  timezone: z.string().optional(),
})

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let settings = await prisma.notificationSettings.findUnique({
      where: { userId: session.user.id },
    })

    // Create default settings if they don't exist
    if (!settings) {
      settings = await prisma.notificationSettings.create({
        data: {
          userId: session.user.id,
        },
      })
    }

    return NextResponse.json({ data: settings })
  } catch (error) {
    console.error('GET /api/settings/notifications error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const validated = updateSettingsSchema.parse(body)

    const settings = await prisma.notificationSettings.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        ...validated,
      },
      update: validated,
    })

    return NextResponse.json({ data: settings })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('PATCH /api/settings/notifications error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
