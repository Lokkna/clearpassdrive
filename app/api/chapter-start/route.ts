import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization')
    const token = authHeader?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const authClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { data: { user }, error: authError } = await authClient.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { enrollmentId, chapterId } = await req.json()
    if (!enrollmentId || !chapterId) {
      return NextResponse.json({ error: 'Missing enrollmentId or chapterId' }, { status: 400 })
    }

    const { data: enrollment, error: fetchError } = await supabaseAdmin
      .from('enrollments')
      .select('id, user_id, chapter_started_at')
      .eq('id', enrollmentId)
      .single()

    if (fetchError || !enrollment || enrollment.user_id !== user.id) {
      return NextResponse.json({ error: 'Enrollment not found' }, { status: 404 })
    }

    const startedAt = { ...(enrollment.chapter_started_at || {}) }
    const key = String(chapterId)

    // Only set once — using the server's clock, never a client-supplied
    // timestamp — so a student can't rewind the clock from devtools.
    if (!startedAt[key]) {
      startedAt[key] = new Date().toISOString()
      const { error: updateError } = await supabaseAdmin
        .from('enrollments')
        .update({ chapter_started_at: startedAt })
        .eq('id', enrollmentId)

      if (updateError) {
        console.error('chapter-start update error:', updateError)
        return NextResponse.json({ error: 'Failed to record start time' }, { status: 500 })
      }
    }

    return NextResponse.json({ startedAt: startedAt[key] })
  } catch (err: any) {
    console.error('chapter-start error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
