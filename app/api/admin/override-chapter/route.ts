import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requireAdmin } from '@/lib/admin'
import { getChapterMinSeconds } from '@/lib/course-data'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
)

export async function POST(req: NextRequest) {
  const admin = await requireAdmin(req)
  if (!admin) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
  }

  const { enrollmentId, chapterId, action, note } = await req.json()
  if (!enrollmentId || !chapterId || !['unlock', 'complete'].includes(action)) {
    return NextResponse.json({ error: 'Missing or invalid parameters' }, { status: 400 })
  }

  const { data: enrollment, error: fetchError } = await supabaseAdmin
    .from('enrollments')
    .select('*')
    .eq('id', enrollmentId)
    .single()

  if (fetchError || !enrollment) {
    return NextResponse.json({ error: 'Enrollment not found' }, { status: 404 })
  }

  const key = String(chapterId)
  const requiredSeconds = getChapterMinSeconds(Number(chapterId))
  // Backdate far enough that the normal elapsed-time check on
  // /api/chapter-complete passes immediately, whether the student or the
  // admin is the one that ultimately clicks "Mark Complete."
  const backdatedStart = new Date(Date.now() - (requiredSeconds + 60) * 1000).toISOString()
  const newStartedAt = { ...(enrollment.chapter_started_at || {}), [key]: backdatedStart }

  const updates: Record<string, any> = { chapter_started_at: newStartedAt }

  if (action === 'complete') {
    const newProgress = { ...(enrollment.progress || {}), [chapterId]: true }
    updates.progress = newProgress
    if (Number(chapterId) === enrollment.current_chapter && Number(chapterId) < 10) {
      updates.current_chapter = Number(chapterId) + 1
    }
  }

  const { data: updated, error: updateError } = await supabaseAdmin
    .from('enrollments')
    .update(updates)
    .eq('id', enrollmentId)
    .select()
    .single()

  if (updateError) {
    console.error('admin override update error:', updateError)
    return NextResponse.json({ error: 'Failed to update enrollment' }, { status: 500 })
  }

  const { error: logError } = await supabaseAdmin.from('admin_actions').insert({
    admin_email: admin.email,
    action: action === 'unlock' ? 'unlock_chapter_timer' : 'mark_chapter_complete',
    enrollment_id: enrollmentId,
    chapter_id: chapterId,
    note: note || null,
  })
  if (logError) {
    // Don't fail the request over a logging hiccup, but do surface it.
    console.error('admin_actions log error:', logError)
  }

  return NextResponse.json({ enrollment: updated })
}
