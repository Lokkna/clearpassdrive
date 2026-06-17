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

  const { email } = await req.json()
  if (!email) {
    return NextResponse.json({ error: 'Email required' }, { status: 400 })
  }

  // Note: listUsers() with a large perPage is fine at current scale (a
  // single, just-launching county school). If the student base grows into
  // the thousands, switch this to a dedicated profiles table indexed on
  // email instead of scanning the full auth.users list.
  const { data: usersPage, error: listError } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 })
  if (listError) {
    console.error('admin lookup listUsers error:', listError)
    return NextResponse.json({ error: 'Lookup failed' }, { status: 500 })
  }

  const match = usersPage.users.find(u => u.email?.toLowerCase() === String(email).toLowerCase())
  if (!match) {
    return NextResponse.json({ error: 'No student found with that email' }, { status: 404 })
  }

  const { data: enrollments, error: enrollError } = await supabaseAdmin
    .from('enrollments')
    .select('*')
    .eq('user_id', match.id)
    .order('created_at', { ascending: false })

  if (enrollError) {
    console.error('admin lookup enrollments error:', enrollError)
    return NextResponse.json({ error: 'Failed to load enrollments' }, { status: 500 })
  }

  const enrichedEnrollments = (enrollments || []).map(e => ({
    ...e,
    chapterLocks: Array.from({ length: 10 }, (_, i) => {
      const chapterId = i + 1
      const startedAt = e.chapter_started_at?.[chapterId]
      const requiredSeconds = getChapterMinSeconds(chapterId)
      const elapsedSeconds = startedAt ? Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000) : null
      return {
        chapterId,
        complete: e.progress?.[chapterId] === true,
        startedAt: startedAt || null,
        requiredSeconds,
        elapsedSeconds,
        locked: elapsedSeconds === null ? null : elapsedSeconds < requiredSeconds,
      }
    }),
  }))

  return NextResponse.json({
    student: {
      id: match.id,
      email: match.email,
      fullName: match.user_metadata?.full_name || null,
    },
    enrollments: enrichedEnrollments,
  })
}
