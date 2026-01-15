import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { sendAlert } from '@/services/notifications'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { priority = 'INFO', channel } = body

    const results = await sendAlert(session.user.id, {
      userId: session.user.id,
      priority,
      title: 'Test Alert from Brand Monitor',
      message: 'This is a test notification to verify your alert settings are working correctly.',
      brandName: 'Test Brand',
      url: 'https://brandmonitor.app',
    })

    return NextResponse.json({
      success: results.some((r) => r.success),
      results,
    })
  } catch (error) {
    console.error('POST /api/alerts/test error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
