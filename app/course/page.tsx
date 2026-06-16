'use client'
import { useEffect, useState, Suspense } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { chapters } from '@/lib/course-data'
import { ChapterDiagram } from '@/lib/chapter-diagrams'

function CourseContent() {
  const [user, setUser] = useState<any>(null)
  const [enrollment, setEnrollment] = useState<any>(null)
  const [currentChapter, setCurrentChapter] = useState(1)
  const [loading, setLoading] = useState(true)
  const [marking, setMarking] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)
      const { data: enrollment } = await supabase.from('enrollments').select('*').eq('user_id', user.id).single()
      if (!enrollment?.paid) { router.push('/checkout'); return }
      setEnrollment(enrollment)
      const chapterParam = searchParams.get('chapter')
      if (chapterParam) { setCurrentChapter(parseInt(chapterParam)) } else { setCurrentChapter(enrollment.current_chapter || 1) }
      setLoading(false)
    }
    load()
  }, [])

  async function markComplete() {
    if (!user || marking) return
    setMarking(true)
    const newProgress = { ...(enrollment?.progress || {}), [currentChapter]: true }
    const nextChapter = currentChapter < 10 ? currentChapter + 1 : currentChapter
    const { data } = await supabase.from('enrollments').update({ progress: newProgress, current_chapter: nextChapter }).eq('user_id', user.id).select().single()
    setEnrollment(data)
    setMarking(false)
    const completedCount = Object.keys(newProgress).filter(k => newProgress[k]).length
    if (completedCount >= 10) { router.push('/exam') } else if (currentChapter < 10) { setCurrentChapter(nextChapter); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f8fafc' }}>
      <div style={{ width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTop: '3px solid #f59e0b', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  const chapter = chapters.find(c => c.id === currentChapter)!
  const isComplete = enrollment?.progress?.[currentChapter] === true
  const completedCount = enrollment?.progress ? Object.keys(enrollment.progress).filter(k => enrollment.progress[k]).length : 0

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8fafc' }}>
      <nav style={{ backgroundColor: '#0f2040', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
        <Link href="/dashboard" style={{ fontFamily: 'Sora, sans-serif', color: '#f59e0b', fontWeight: 700, fontSize: '1rem', textDecoration: 'none' }}>← Dashboard</Link>
        <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{completedCount}/10 chapters complete</span>
      </nav>
      <div style={{ display: 'flex', maxWidth: '1100px', margin: '0 auto', padding: '0 16px' }}>
        <aside style={{ width: '220px', flexShrink: 0, padding: '24px 16px 24px 0', display: 'flex', flexDirection: 'column', gap: '4px' }} className="hidden md:flex">
          {chapters.map(ch => {
            const done = enrollment?.progress?.[ch.id] === true
            const active = ch.id === currentChapter
            return (
              <button key={ch.id} onClick={() => { setCurrentChapter(ch.id); window.scrollTo({ top: 0 }) }}
                style={{ textAlign: 'left', padding: '10px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', backgroundColor: active ? '#1e3a6e' : 'transparent', color: active ? '#ffffff' : done ? '#16a34a' : '#64748b', fontSize: '0.8rem', fontWeight: active ? 600 : 400, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ flexShrink: 0 }}>{done ? '✓' : ch.id}</span>
                <span>{ch.title}</span>
              </button>
            )
          })}
        </aside>
        <main style={{ flex: 1, padding: '32px 0 32px 24px', minWidth: 0 }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '40px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <span style={{ backgroundColor: '#f59e0b', color: '#0f2040', fontWeight: 700, fontSize: '0.75rem', padding: '3px 10px', borderRadius: '20px' }}>Chapter {currentChapter} of 10</span>
              {isComplete && <span style={{ backgroundColor: '#dcfce7', color: '#16a34a', fontWeight: 600, fontSize: '0.75rem', padding: '3px 10px', borderRadius: '20px' }}>Complete</span>}
            </div>
            <h1 style={{ fontFamily: 'Sora, sans-serif', color: '#0f2040', fontSize: '1.75rem', fontWeight: 700, marginBottom: '32px' }}>{chapter.title}</h1>
            <ChapterDiagram chapterId={currentChapter} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px' }}>
              {chapter.content.map((paragraph, i) => (
                <p key={i} style={{ color: '#374151', lineHeight: 1.8, fontSize: '1rem', margin: 0 }}>{paragraph}</p>
              ))}
            </div>
            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <button onClick={() => { if (currentChapter > 1) { setCurrentChapter(currentChapter - 1); window.scrollTo({ top: 0 }) } }} disabled={currentChapter === 1}
                style={{ color: currentChapter === 1 ? '#cbd5e1' : '#1e3a6e', background: 'none', border: 'none', cursor: currentChapter === 1 ? 'not-allowed' : 'pointer', fontWeight: 600, fontSize: '0.9rem' }}>← Previous</button>
              {!isComplete ? (
                <button onClick={markComplete} disabled={marking}
                  style={{ backgroundColor: marking ? '#94a3b8' : '#f59e0b', color: '#0f2040', fontWeight: 700, padding: '12px 28px', borderRadius: '10px', border: 'none', cursor: marking ? 'not-allowed' : 'pointer', fontSize: '0.95rem' }}>
                  {marking ? 'Saving...' : currentChapter === 10 ? 'Complete Course → Take Exam' : 'Mark Complete & Continue →'}
                </button>
              ) : (
                <button onClick={() => { if (currentChapter < 10) { setCurrentChapter(currentChapter + 1); window.scrollTo({ top: 0 }) } else { router.push('/exam') } }}
                  style={{ backgroundColor: '#0f2040', color: '#ffffff', fontWeight: 700, padding: '12px 28px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '0.95rem' }}>
                  {currentChapter === 10 ? 'Take Final Exam →' : 'Next Chapter →'}
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default function CoursePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f8fafc' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTop: '3px solid #f59e0b', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    }>
      <CourseContent />
    </Suspense>
  )
}
