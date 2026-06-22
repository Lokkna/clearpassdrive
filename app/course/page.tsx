'use client'
import { useEffect, useState, useRef, Suspense } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { chapters, getChapterMinSeconds, getRandomChapterQuiz, CHAPTER_QUIZ_PASSING_SCORE } from '@/lib/course-data'
import { ChapterDiagram } from '@/lib/chapter-diagrams'
import { getSectionDiagram, isSectionHeader } from '@/lib/section-diagrams'

function formatRemaining(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

function CourseContent() {
  const [user, setUser] = useState<any>(null)
  const [enrollment, setEnrollment] = useState<any>(null)
  const [currentChapter, setCurrentChapter] = useState(1)
  const [loading, setLoading] = useState(true)
  const [marking, setMarking] = useState(false)
  const [secondsRemaining, setSecondsRemaining] = useState<number | null>(null)
  const [lockError, setLockError] = useState<string | null>(null)
  const [quizPhase, setQuizPhase] = useState<'none' | 'question' | 'review'>('none')
  const [quizSet, setQuizSet] = useState<ReturnType<typeof getRandomChapterQuiz>>([])
  const [quizIndex, setQuizIndex] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({})
  const [quizSelected, setQuizSelected] = useState<number | null>(null)
  const [quizScore, setQuizScore] = useState(0)
  const [isAdmin, setIsAdmin] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      if (!currentUser) { router.push('/login'); return }
      setUser(currentUser)

      const { data: { session } } = await supabase.auth.getSession()
      let adminStatus = false
      try {
        const res = await fetch('/api/admin/whoami', { headers: { Authorization: `Bearer ${session?.access_token}` } })
        const data = await res.json()
        adminStatus = !!data.isAdmin
      } catch {
        adminStatus = false
      }
      setIsAdmin(adminStatus)

      const { data: enrollment } = await supabase.from('enrollments').select('*').eq('user_id', currentUser.id).eq('paid', true).order('created_at', { ascending: false }).limit(1).single()
      if (!enrollment?.paid) { router.push('/checkout'); return }
      setEnrollment(enrollment)
      const maxAllowed = enrollment.current_chapter || 1
      const chapterParam = searchParams.get('chapter')
      const requested = chapterParam ? parseInt(chapterParam) : maxAllowed
      const fallback = Number.isFinite(requested) && requested > 0 ? requested : maxAllowed
      // Admins can jump to any chapter via the URL for QA; everyone else
      // gets clamped to their legitimate frontier (the real enforcement
      // for non-admins lives server-side regardless — this is just so the
      // page doesn't render a confusing state for a locked chapter).
      setCurrentChapter(adminStatus ? Math.min(fallback, 10) : Math.min(fallback, maxAllowed))
      setLoading(false)
    }
    load()
  }, [])

  // Start (or resume) the dwell-time clock for whichever chapter is showing.
  useEffect(() => {
    if (loading || !enrollment || !user) return
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null }
    setLockError(null)
    setQuizPhase('none')
    setQuizIndex(0)
    setQuizAnswers({})
    setQuizSelected(null)

    const alreadyComplete = enrollment?.progress?.[currentChapter] === true
    if (alreadyComplete) { setSecondsRemaining(0); return }

    const requiredSeconds = getChapterMinSeconds(currentChapter)
    let cancelled = false

    async function startClock() {
      const existingStart = enrollment?.chapter_started_at?.[currentChapter]
      let startedAt = existingStart

      if (!startedAt) {
        const { data: { session } } = await supabase.auth.getSession()
        try {
          const res = await fetch('/api/chapter-start', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session?.access_token}` },
            body: JSON.stringify({ enrollmentId: enrollment.id, chapterId: currentChapter }),
          })
          const data = await res.json()
          startedAt = data.startedAt
          if (!cancelled && startedAt) {
            setEnrollment((prev: any) => ({ ...prev, chapter_started_at: { ...(prev?.chapter_started_at || {}), [currentChapter]: startedAt } }))
          }
        } catch (err) {
          console.error('Failed to start chapter clock:', err)
        }
      }

      if (cancelled || !startedAt) return

      const tick = () => {
        const elapsed = Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000)
        setSecondsRemaining(Math.max(0, requiredSeconds - elapsed))
      }
      tick()
      intervalRef.current = setInterval(tick, 1000)
    }

    startClock()
    return () => { cancelled = true; if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null } }
  }, [currentChapter, loading, enrollment?.id])

  async function markComplete() {
    if (!user || !enrollment || marking) return
    setMarking(true)
    setLockError(null)

    const { data: { session } } = await supabase.auth.getSession()
    try {
      const res = await fetch('/api/chapter-complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session?.access_token}` },
        body: JSON.stringify({ enrollmentId: enrollment.id, chapterId: currentChapter }),
      })
      const data = await res.json()

      if (!res.ok) {
        // Server is the source of truth — resync the countdown if our local
        // clock had drifted (e.g. the tab was asleep).
        if (typeof data.remainingSeconds === 'number') setSecondsRemaining(data.remainingSeconds)
        setLockError(data.error === 'Minimum reading time not yet met' ? 'Keep reading — the minimum chapter time hasn\u2019t elapsed yet.' : (data.error || 'Could not save progress.'))
        setMarking(false)
        return
      }

      const updatedEnrollment = data.enrollment
      setEnrollment(updatedEnrollment)
      setMarking(false)
      const completedCount = Object.keys(updatedEnrollment.progress || {}).filter(k => updatedEnrollment.progress[k]).length
      if (completedCount >= 10) {
        router.push('/exam')
      } else if (currentChapter < 10) {
        setCurrentChapter(currentChapter + 1)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    } catch (err) {
      console.error('markComplete error:', err)
      setLockError('Something went wrong saving your progress. Please try again.')
      setMarking(false)
    }
  }

  async function recordQuizAttempt(passed: boolean, score: number) {
    if (!enrollment) return
    const prior = enrollment.chapter_quiz_attempts?.[currentChapter] || { attempts: 0 }
    const updatedAttempts = {
      ...(enrollment.chapter_quiz_attempts || {}),
      [currentChapter]: {
        attempts: (prior.attempts || 0) + 1,
        lastScore: score,
        passed,
        lastAttemptAt: new Date().toISOString(),
      },
    }
    try {
      await supabase.from('enrollments').update({ chapter_quiz_attempts: updatedAttempts }).eq('id', enrollment.id)
      setEnrollment((prev: any) => ({ ...prev, chapter_quiz_attempts: updatedAttempts }))
    } catch (err) {
      // Analytics-only — never block the student's flow over a logging failure.
      console.error('Failed to record knowledge check attempt:', err)
    }
  }

  function startQuiz() {
    setQuizSet(getRandomChapterQuiz(currentChapter))
    setQuizIndex(0)
    setQuizAnswers({})
    setQuizSelected(null)
    setQuizPhase('question')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function selectQuizOption(optionIndex: number) {
    if (quizSelected !== null) return
    setQuizSelected(optionIndex)
  }

  function nextQuizQuestion() {
    const q = quizSet[quizIndex]
    const newAnswers = { ...quizAnswers, [q.id]: quizSelected! }
    setQuizAnswers(newAnswers)
    setQuizSelected(null)

    if (quizIndex + 1 < quizSet.length) {
      setQuizIndex(quizIndex + 1)
    } else {
      let correct = 0
      quizSet.forEach(q => { if (newAnswers[q.id] === q.correct) correct++ })
      const pct = Math.round((correct / quizSet.length) * 100)
      setQuizScore(pct)
      setQuizPhase('review')
      recordQuizAttempt(pct >= CHAPTER_QUIZ_PASSING_SCORE, pct)
    }
  }

  function retakeQuiz() {
    setQuizSet(getRandomChapterQuiz(currentChapter))
    setQuizIndex(0)
    setQuizAnswers({})
    setQuizSelected(null)
    setQuizPhase('question')
  }

  function backToReading() {
    setQuizPhase('none')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function advanceToNextChapter() {
    // Drop back to the reading view first — if the server-side dwell-time
    // check somehow fails (e.g. clock drift), the existing lockError UI
    // in the reading view is what surfaces it to the student. Called both
    // after a pass and when a student chooses to skip ahead after a fail.
    setQuizPhase('none')
    await markComplete()
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
  const locked = !isAdmin && !isComplete && (secondsRemaining ?? 1) > 0

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8fafc' }}>
      <nav style={{ backgroundColor: '#0f2040', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
        <Link href="/dashboard" style={{ fontFamily: 'Sora, sans-serif', color: '#f59e0b', fontWeight: 700, fontSize: '1rem', textDecoration: 'none' }}>← Dashboard</Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {isAdmin && (
            <span style={{ backgroundColor: '#f59e0b', color: '#0f2040', fontWeight: 700, fontSize: '0.7rem', padding: '3px 9px', borderRadius: '20px' }}>Admin mode — locks &amp; wait bypassed</span>
          )}
          <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{completedCount}/10 chapters complete</span>
        </div>
      </nav>
      <div style={{ display: 'flex', maxWidth: '1100px', margin: '0 auto', padding: '0 16px' }}>
        <aside style={{ width: '220px', flexShrink: 0, padding: '24px 16px 24px 0', display: 'flex', flexDirection: 'column', gap: '4px' }} className="hidden md:flex">
          {chapters.map(ch => {
            const done = enrollment?.progress?.[ch.id] === true
            const active = ch.id === currentChapter
            const locked = !isAdmin && ch.id > (enrollment?.current_chapter || 1)
            return (
              <button key={ch.id} onClick={() => { if (!locked) { setCurrentChapter(ch.id); window.scrollTo({ top: 0 }) } }}
                disabled={locked}
                title={locked ? 'Complete the current chapter to unlock this one' : undefined}
                style={{ textAlign: 'left', padding: '10px 12px', borderRadius: '8px', border: 'none', cursor: locked ? 'not-allowed' : 'pointer', backgroundColor: active ? '#1e3a6e' : 'transparent', color: active ? '#ffffff' : done ? '#16a34a' : locked ? '#cbd5e1' : '#64748b', fontSize: '0.8rem', fontWeight: active ? 600 : 400, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ flexShrink: 0 }}>{done ? '✓' : locked ? '🔒' : ch.id}</span>
                <span>{ch.title}</span>
              </button>
            )
          })}
        </aside>
        <main style={{ flex: 1, padding: '32px 0 32px 24px', minWidth: 0 }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '40px', border: '1px solid #e2e8f0' }}>
            {quizPhase === 'none' && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <span style={{ backgroundColor: '#f59e0b', color: '#0f2040', fontWeight: 700, fontSize: '0.75rem', padding: '3px 10px', borderRadius: '20px' }}>Chapter {currentChapter} of 10</span>
                  {isComplete && <span style={{ backgroundColor: '#dcfce7', color: '#16a34a', fontWeight: 600, fontSize: '0.75rem', padding: '3px 10px', borderRadius: '20px' }}>Complete</span>}
                </div>
                <h1 style={{ fontFamily: 'Sora, sans-serif', color: '#0f2040', fontSize: '1.75rem', fontWeight: 700, marginBottom: '32px' }}>{chapter.title}</h1>
                <ChapterDiagram chapterId={currentChapter} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px' }}>
                  {chapter.content.map((paragraph, i) => {
                    if (isSectionHeader(paragraph)) {
                      const diagram = getSectionDiagram(paragraph)
                      return (
                        <div key={i}>
                          <h2 style={{ fontFamily: 'Sora, sans-serif', color: '#0f2040', fontSize: '1.15rem', fontWeight: 700, margin: '16px 0 4px', paddingTop: '8px', borderTop: '1px solid #e2e8f0' }}>
                            {paragraph}
                          </h2>
                          {diagram}
                        </div>
                      )
                    }
                    return (
                      <p key={i} style={{ color: '#374151', lineHeight: 1.8, fontSize: '1rem', margin: 0 }}>{paragraph}</p>
                    )
                  })}
                </div>
                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {lockError && (
                    <div style={{ backgroundColor: '#fef3c7', color: '#92400e', fontSize: '0.85rem', padding: '10px 14px', borderRadius: '8px' }}>{lockError}</div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <button onClick={() => { if (currentChapter > 1) { setCurrentChapter(currentChapter - 1); window.scrollTo({ top: 0 }) } }} disabled={currentChapter === 1}
                      style={{ color: currentChapter === 1 ? '#cbd5e1' : '#1e3a6e', background: 'none', border: 'none', cursor: currentChapter === 1 ? 'not-allowed' : 'pointer', fontWeight: 600, fontSize: '0.9rem' }}>← Previous</button>
                    {!isComplete ? (
                      <button onClick={startQuiz} disabled={locked}
                        style={{ backgroundColor: locked ? '#e2e8f0' : '#f59e0b', color: locked ? '#64748b' : '#0f2040', fontWeight: 700, padding: '12px 28px', borderRadius: '10px', border: 'none', cursor: locked ? 'not-allowed' : 'pointer', fontSize: '0.95rem' }}>
                        {locked ? `Keep reading — ${formatRemaining(secondsRemaining ?? 0)} remaining` : 'Take Knowledge Check →'}
                      </button>
                    ) : (
                      <button onClick={() => { if (currentChapter < 10) { setCurrentChapter(currentChapter + 1); window.scrollTo({ top: 0 }) } else { router.push('/exam') } }}
                        style={{ backgroundColor: '#0f2040', color: '#ffffff', fontWeight: 700, padding: '12px 28px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '0.95rem' }}>
                        {currentChapter === 10 ? 'Take Final Exam →' : 'Next Chapter →'}
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}

            {quizPhase === 'question' && quizSet[quizIndex] && (() => {
              const q = quizSet[quizIndex]
              const progress = (quizIndex / quizSet.length) * 100
              return (
                <div>
                  <span style={{ display: 'inline-block', backgroundColor: '#f59e0b', color: '#0f2040', fontWeight: 700, fontSize: '0.75rem', padding: '3px 10px', borderRadius: '20px', marginBottom: '12px' }}>Knowledge Check — Chapter {currentChapter}</span>
                  <h1 style={{ fontFamily: 'Sora, sans-serif', color: '#0f2040', fontSize: '1.4rem', fontWeight: 700, marginBottom: '20px' }}>Question {quizIndex + 1} of {quizSet.length}</h1>
                  <div style={{ height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px', marginBottom: '28px', overflow: 'hidden' }}>
                    <div style={{ backgroundColor: '#f59e0b', height: '100%', width: `${progress}%`, transition: 'width 0.3s ease' }} />
                  </div>
                  <div style={{ backgroundColor: '#f8fafc', borderRadius: '14px', padding: '28px', marginBottom: '20px' }}>
                    <p style={{ fontFamily: 'Sora, sans-serif', color: '#0f2040', fontSize: '1.1rem', fontWeight: 600, lineHeight: 1.6, margin: '0 0 24px' }}>{q.question}</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {q.options.map((option, oi) => {
                        const isSelected = quizSelected === oi
                        return (
                          <button key={oi} onClick={() => selectQuizOption(oi)} disabled={quizSelected !== null}
                            style={{ textAlign: 'left', padding: '14px 18px', borderRadius: '10px', border: `2px solid ${isSelected ? '#0f2040' : '#e2e8f0'}`, backgroundColor: isSelected ? '#0f2040' : '#ffffff', color: isSelected ? '#ffffff' : '#374151', fontSize: '0.95rem', cursor: quizSelected !== null ? 'default' : 'pointer', fontWeight: isSelected ? 600 : 400, transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ width: '26px', height: '26px', borderRadius: '50%', flexShrink: 0, border: `2px solid ${isSelected ? '#f59e0b' : '#d1d5db'}`, backgroundColor: isSelected ? '#f59e0b' : 'transparent', color: isSelected ? '#0f2040' : '#9ca3af', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700 }}>
                              {String.fromCharCode(65 + oi)}
                            </span>
                            {option}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                  {quizSelected !== null && (
                    <button onClick={nextQuizQuestion} style={{ backgroundColor: '#f59e0b', color: '#0f2040', fontWeight: 700, padding: '14px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '1rem', width: '100%' }}>
                      {quizIndex + 1 < quizSet.length ? 'Next Question →' : 'See Results →'}
                    </button>
                  )}
                </div>
              )
            })()}

            {quizPhase === 'review' && (() => {
              const correctCount = quizSet.filter(q => quizAnswers[q.id] === q.correct).length
              const passed = quizScore >= CHAPTER_QUIZ_PASSING_SCORE
              return (
                <div>
                  <span style={{ display: 'inline-block', backgroundColor: '#f59e0b', color: '#0f2040', fontWeight: 700, fontSize: '0.75rem', padding: '3px 10px', borderRadius: '20px', marginBottom: '12px' }}>Knowledge Check — Chapter {currentChapter}</span>
                  <h1 style={{ fontFamily: 'Sora, sans-serif', color: '#0f2040', fontSize: '1.4rem', fontWeight: 700, marginBottom: '20px' }}>{passed ? 'Nice work!' : 'Not quite yet'}</h1>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
                    {quizSet.map((q, qi) => {
                      const userAnswer = quizAnswers[q.id]
                      const isCorrect = userAnswer === q.correct
                      return (
                        <div key={q.id} style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '18px', border: `1.5px solid ${isCorrect ? '#86efac' : '#fca5a5'}` }}>
                          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'flex-start' }}>
                            <span style={{ width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0, backgroundColor: isCorrect ? '#16a34a' : '#dc2626', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, marginTop: '1px' }}>
                              {isCorrect ? '✓' : '✗'}
                            </span>
                            <p style={{ fontWeight: 600, color: '#0f2040', margin: 0, fontSize: '0.88rem', lineHeight: 1.5 }}>
                              <span style={{ color: '#94a3b8', fontWeight: 400 }}>Q{qi + 1}. </span>{q.question}
                            </p>
                          </div>
                          <div style={{ paddingLeft: '32px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <div style={{ fontSize: '0.82rem', color: isCorrect ? '#16a34a' : '#dc2626', fontWeight: 600 }}>
                              Your answer: {q.options[userAnswer]}
                            </div>
                            {!isCorrect && (
                              <div style={{ fontSize: '0.82rem', color: '#16a34a', fontWeight: 600 }}>
                                Correct answer: {q.options[q.correct]}
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <div style={{ backgroundColor: '#f8fafc', borderRadius: '12px', padding: '20px', marginBottom: '20px', textAlign: 'center' }}>
                    <div style={{ fontFamily: 'Sora, sans-serif', fontSize: '2.2rem', fontWeight: 800, color: passed ? '#16a34a' : '#dc2626' }}>{quizScore}%</div>
                    <p style={{ color: '#64748b', margin: '6px 0 0', fontSize: '0.88rem' }}>
                      {correctCount} of {quizSet.length} correct · {passed ? 'Passing score ✓' : `Need ${CHAPTER_QUIZ_PASSING_SCORE}% to pass`}
                    </p>
                  </div>
                  {lockError && (
                    <div style={{ backgroundColor: '#fef3c7', color: '#92400e', fontSize: '0.85rem', padding: '10px 14px', borderRadius: '8px', marginBottom: '12px' }}>{lockError}</div>
                  )}
                  {passed ? (
                    <button onClick={advanceToNextChapter} disabled={marking}
                      style={{ backgroundColor: marking ? '#94a3b8' : '#0f2040', color: '#ffffff', fontWeight: 700, padding: '14px', borderRadius: '10px', border: 'none', cursor: marking ? 'not-allowed' : 'pointer', fontSize: '1rem', width: '100%' }}>
                      {marking ? 'Saving...' : currentChapter === 10 ? 'Complete Course → Take Exam' : 'Continue to Next Chapter →'}
                    </button>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <button onClick={backToReading} style={{ flex: 1, minWidth: '180px', backgroundColor: '#ffffff', color: '#0f2040', fontWeight: 700, padding: '14px', borderRadius: '10px', border: '2px solid #0f2040', cursor: 'pointer', fontSize: '0.92rem' }}>
                          ← Review Chapter Material
                        </button>
                        <button onClick={retakeQuiz} style={{ flex: 1, minWidth: '180px', backgroundColor: '#f59e0b', color: '#0f2040', fontWeight: 700, padding: '14px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '0.92rem' }}>
                          Retake Knowledge Check
                        </button>
                      </div>
                      <button onClick={advanceToNextChapter} disabled={marking}
                        style={{ background: 'none', border: 'none', color: '#94a3b8', fontWeight: 600, fontSize: '0.82rem', cursor: marking ? 'not-allowed' : 'pointer', textDecoration: 'underline', padding: '4px', alignSelf: 'center' }}>
                        {marking ? 'Saving...' : currentChapter === 10 ? 'Skip ahead to the exam anyway →' : 'Skip ahead anyway →'}
                      </button>
                    </div>
                  )}
                </div>
              )
            })()}
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

