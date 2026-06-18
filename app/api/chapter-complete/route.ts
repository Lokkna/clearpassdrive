import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getChapterMinSeconds } from '@/lib/course-data'
import { getAdminEmails } from '@/lib/admin'

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
      .select('*')
      .eq('id', enrollmentId)
      .single()

    if (fetchError || !enrollment || enrollment.user_id !== user.id) {
      return NextResponse.json({ error: 'Enrollment not found' }, { status: 404 })
    }

    const key = String(chapterId)
    const isAdmin = !!user.email && getAdminEmails().includes(user.email.toLowerCase())
    const allowedChapter = enrollment.current_chapter || 1
    if (!isAdmin && Number(chapterId) > allowedChapter) {
      return NextResponse.json({ error: 'Chapter is locked — complete earlier chapters first' }, { status: 403 })
    }

    const startedAtStr = enrollment.chapter_started_at?.[key]
    const requiredSeconds = getChapterMinSeconds(Number(chapterId))

    // No recorded start — should not happen in normal flow (the client
    // calls /api/chapter-start on load), but fail closed rather than open.
    // Admins are exempt below, but still need a start record to exist so
    // the rest of the flow (and the UI) has something to read.
    if (!startedAtStr && !isAdmin) {
      return NextResponse.json(
        { error: 'Chapter not started', requiredSeconds, elapsedSeconds: 0, remainingSeconds: requiredSeconds },
        { status: 400 }
      )
    }

    const elapsedSeconds = startedAtStr ? Math.floor((Date.now() - new Date(startedAtStr).getTime()) / 1000) : requiredSeconds

    // Allowlisted admins skip the actual dwell wait too (not just the
    // sequential lock), so QA on a personal test account doesn't mean
    // sitting through a real multi-minute timer for every chapter.
    if (!isAdmin && elapsedSeconds < requiredSeconds) {
      return NextResponse.json(
        {
          error: 'Minimum reading time not yet met',
          requiredSeconds,
          elapsedSeconds,
          remainingSeconds: requiredSeconds - elapsedSeconds,
        },
        { status: 400 }
      )
    }

    const newProgress = { ...(enrollment.progress || {}), [chapterId]: true }
    const nextChapter = chapterId < 10 ? chapterId + 1 : chapterId

    const { data: updated, error: updateError } = await supabaseAdmin
      .from('enrollments')
      .update({ progress: newProgress, current_chapter: nextChapter })
      .eq('id', enrollmentId)
      .select()
      .single()

    if (updateError) {
      console.error('chapter-complete update error:', updateError)
      return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 })
    }

    return NextResponse.json({ enrollment: updated })
  } catch (err: any) {
    console.error('chapter-complete error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
