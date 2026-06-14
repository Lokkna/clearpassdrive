'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { examQuestions, PASSING_SCORE } from '@/lib/course-data'

export default function ExamPage() {
  const [user, setUser] = useState<any>(null)
  const [enrollment, setEnrollment] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)

      const { data: enrollment } = await supabase
        .from('enrollments')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (!enrollment?.paid) { router.push('/checkout'); return }
      if (enrollment?.exam_passed) { router.push('/certificate'); return }

      const completedChapters = enrollment?.progress ? Object.keys(enrollment.progress).filter(k => enrollment.progress[k]).length : 0
      if (completedChapters < 10) { router.push('/course'); return }

      setEnrollment(enrollment)
      setLoading(false)
    }
    load()
  }, [])

  function selectAnswer(questionId: number, optionIndex: number) {
    if (submitted) return
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }))
  }

  async function submitExam() {
    if (Object.keys(answers).length < examQuestions.length) {
      alert('Please answer all questions before submitting.')
      return
    }
    setSubmitting(true)

    let correct = 0
    examQuestions.forEach(q => {
      if (answers[q.id] === q.correct) correct++
    })

    const pct = Math.round((correct / examQuestions.length) * 100)
    const passed = pct >= PASSING_SCORE
    setScore(pct)
    setSubmitted(true)

    await supabase
      .from('enrollments')
      .update({
        exam_passed: passed,
        exam_score: pct,
        exam_attempts: (enrollment?.exam_attempts || 0) + 1,
        exam_completed_at: new Date().toISOString(),
      })
      .eq('user_id', user.id)

    if (passed) {
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'passed', email: user.email, score: pct }),
      })
    }

    setSubmitting(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f8fafc' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTop: '3px solid #f59e0b', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  const passed = score >= PASSING_SCORE

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8fafc' }}>
      <nav style={{ backgroundColor: '#0f2040', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'Sora, sans-serif', color: '#f59e0b', fontWeight: 700, fontSize: '1rem' }}>ClearPass Drive — Final Exam</span>
        {!submitted && <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{Object.keys(answers).length}/{examQuestions.length} answered</span>}
      </nav>

      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '32px 24px' }}>
        {submitted ? (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '48px 40px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>{passed ? '🏆' : '📚'}</div>
            <h1 style={{ fontFamily: 'Sora, sans-serif', color: passed ? '#16a34a' : '#dc2626', fontSize: '2rem', fontWeight: 700, marginBottom: '8px' }}>
              {passed ? 'You passed!' : 'Not quite yet'}
            </h1>
            <div style={{ fontFamily: 'Sora, sans-serif', fontSize: '3.5rem', fontWeight: 800, color: passed ? '#16a34a' : '#dc2626', margin: '16px 0' }}>
              {score}%
            </div>
            <p style={{ color: '#64748b', marginBottom: '32px', lineHeight: 1.6 }}>
              {passed
                ? `You scored ${score}% and passed the final exam. Your certificate is ready to download.`
                : `You scored ${score}%. You need 70% to pass. Review the course material and try again.`}
            </p>
            {passed ? (
              <a href="/certificate" style={{ display: 'inline-block', backgroundColor: '#16a34a', color: '#ffffff', fontWeight: 700, padding: '14px 32px', borderRadius: '10px', textDecoration: 'none', fontSize: '1rem' }}>
                Download Certificate →
              </a>
            ) : (
              <button
                onClick={() => { setAnswers({}); setSubmitted(false); setScore(0); window.scrollTo({ top: 0 }) }}
                style={{ backgroundColor: '#f59e0b', color: '#0f2040', fontWeight: 700, padding: '14px 32px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '1rem' }}
              >
                Retake Exam
              </button>
            )}
          </div>
        ) : (
          <>
            <div style={{ backgroundColor: '#0f2040', borderRadius: '12px', padding: '24px', marginBottom: '28px' }}>
              <h1 style={{ fontFamily: 'Sora, sans-serif', color: '#ffffff', fontSize: '1.4rem', fontWeight: 700, margin: '0 0 8px' }}>Final Exam</h1>
              <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem' }}>20 questions · Score 70% or higher to pass · No time limit</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {examQuestions.map((q, qi) => (
                <div key={q.id} style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0' }}>
                  <p style={{ fontWeight: 600, color: '#0f2040', marginBottom: '16px', fontSize: '0.95rem', lineHeight: 1.5 }}>
                    <span style={{ color: '#f59e0b' }}>{qi + 1}.</span> {q.question}
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {q.options.map((option, oi) => {
                      const selected = answers[q.id] === oi
                      return (
                        <button
                          key={oi}
                          onClick={() => selectAnswer(q.id, oi)}
                          style={{
                            textAlign: 'left', padding: '12px 16px', borderRadius: '8px', border: `1.5px solid ${selected ? '#1e3a6e' : '#e2e8f0'}`,
                            backgroundColor: selected ? '#f0f4ff' : '#ffffff',
                            color: selected ? '#1e3a6e' : '#374151', fontSize: '0.9rem', cursor: 'pointer',
                            fontWeight: selected ? 600 : 400, transition: 'all 0.15s',
                          }}
                        >
                          <span style={{ marginRight: '10px', color: selected ? '#1e3a6e' : '#94a3b8' }}>{String.fromCharCode(65 + oi)}.</span>
                          {option}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '32px', textAlign: 'center' }}>
              <button
                onClick={submitExam}
                disabled={submitting || Object.keys(answers).length < examQuestions.length}
                style={{
                  backgroundColor: Object.keys(answers).length < examQuestions.length ? '#94a3b8' : '#f59e0b',
                  color: '#0f2040', fontWeight: 700, padding: '14px 40px', borderRadius: '10px',
                  border: 'none', cursor: Object.keys(answers).length < examQuestions.length ? 'not-allowed' : 'pointer',
                  fontSize: '1rem',
                }}
              >
                {submitting ? 'Grading...' : `Submit Exam (${Object.keys(answers).length}/${examQuestions.length} answered)`}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
