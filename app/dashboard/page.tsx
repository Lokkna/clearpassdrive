'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { chapters } from '@/lib/course-data'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [enrollment, setEnrollment] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)

      const { data: enrollments } = await supabase
        .from('enrollments')
        .select('*')
        .eq('user_id', user.id)
        .eq('paid', true)
        .order('created_at', { ascending: false })
        .limit(1)

      const enrollment = enrollments?.[0] || null
      if (!enrollment) { router.push('/checkout'); return }
      setEnrollment(enrollment)
      setLoading(false)

      // Quietly check admin status to decide whether to show the admin
      // link — actual access control happens server-side in /api/admin/*.
      try {
        const { data: sessionData } = await supabase.auth.getSession()
        const res = await fetch('/api/admin/whoami', {
          headers: { Authorization: `Bearer ${sessionData?.session?.access_token}` },
        })
        const data = await res.json()
        setIsAdmin(!!data.isAdmin)
      } catch {
        setIsAdmin(false)
      }
    }
    load()
  }, [])

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f8fafc' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTop: '3px solid #f59e0b', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  const completedChapters = enrollment?.progress ? Object.keys(enrollment.progress).filter(k => enrollment.progress[k]).length : 0
  const progressPct = Math.round((completedChapters / 10) * 100)

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8fafc' }}>
      {/* Nav */}
      <nav style={{ backgroundColor: '#0f2040', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ fontFamily: 'Sora, sans-serif', color: '#f59e0b', fontWeight: 700, fontSize: '1.1rem', textDecoration: 'none' }}>ClearPass Drive</Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {isAdmin && <a href="/admin" style={{ color: '#f59e0b', fontSize: '0.85rem', textDecoration: 'none', fontWeight: 600 }}>Admin</a>}
          <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{user?.email}</span>
          <button onClick={handleSignOut} style={{ color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}>Sign out</button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 style={{ fontFamily: 'Sora, sans-serif', color: '#0f2040', fontSize: '1.75rem', fontWeight: 700, marginBottom: '4px' }}>
          Your Course
        </h1>
        <p style={{ color: '#64748b', marginBottom: '32px' }}>
          {enrollment?.exam_passed ? 'Course complete! Download your certificate below.' : `${completedChapters} of 10 chapters complete`}
        </p>

        {/* Progress */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '24px', marginBottom: '24px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontWeight: 600, color: '#374151' }}>Overall Progress</span>
            <span style={{ fontWeight: 700, color: '#f59e0b' }}>{progressPct}%</span>
          </div>
          <div style={{ height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progressPct}%`, backgroundColor: '#f59e0b', borderRadius: '4px', transition: 'width 0.5s' }} />
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
          {!enrollment?.exam_passed && (
            <Link href="/course" style={{ backgroundColor: '#0f2040', color: '#ffffff', fontWeight: 600, padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', fontSize: '0.95rem' }}>
              {completedChapters === 0 ? 'Start Course →' : 'Continue Course →'}
            </Link>
          )}
          {completedChapters >= 10 && !enrollment?.exam_passed && (
            <Link href="/exam" style={{ backgroundColor: '#f59e0b', color: '#0f2040', fontWeight: 700, padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', fontSize: '0.95rem' }}>
              Take Final Exam →
            </Link>
          )}
          {enrollment?.exam_passed && (
            <Link href="/certificate" style={{ backgroundColor: '#16a34a', color: '#ffffff', fontWeight: 700, padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', fontSize: '0.95rem' }}>
              Download Certificate →
            </Link>
          )}
          {enrollment?.exam_passed && (
            <Link href="/intake?new=1" style={{ backgroundColor: '#ffffff', color: '#0f2040', fontWeight: 600, padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', fontSize: '0.95rem', border: '2px solid #0f2040' }}>
              Got another ticket? Enroll again →
            </Link>
          )}
        </div>

        {/* Chapter list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {chapters.map((ch, i) => {
            const done = enrollment?.progress?.[ch.id] === true
            return (
              <Link key={ch.id} href={`/course?chapter=${ch.id}`} style={{ backgroundColor: '#ffffff', borderRadius: '10px', padding: '16px 20px', border: `1px solid ${done ? '#bbf7d0' : '#e2e8f0'}`, display: 'flex', alignItems: 'center', gap: '14px', textDecoration: 'none', transition: 'border-color 0.2s' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: done ? '#16a34a' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {done ? <span style={{ color: '#ffffff', fontSize: '0.9rem' }}>✓</span> : <span style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600 }}>{i + 1}</span>}
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.9rem' }}>Chapter {ch.id}: {ch.title}</div>
                  <div style={{ color: '#94a3b8', fontSize: '0.78rem' }}>{done ? 'Complete' : 'Not started'}</div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
