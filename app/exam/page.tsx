'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { examQuestions, PASSING_SCORE } from '@/lib/course-data'

type Phase = 'loading' | 'intro' | 'question' | 'review' | 'result'

export default function ExamPage() {
  const [user, setUser] = useState<any>(null)
  const [enrollment, setEnrollment] = useState<any>(null)
  const [phase, setPhase] = useState<Phase>('loading')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [selected, setSelected] = useState<number | null>(null)
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
        .from('enrollments').select('*').eq('user_id', user.id).single()

      if (!enrollment?.paid) { router.push('/checkout'); return }
      if (enrollment?.exam_passed) { router.push('/certificate'); return }

      const completedChapters = enrollment?.progress
        ? Object.keys(enrollment.progress).filter(k => enrollment.progress[k]).length : 0
      if (completedChapters < 10) { router.push('/course'); return }

      setEnrollment(enrollment)
      setPhase('intro')
    }
    load()
  }, [])

  function startExam() {
    setCurrentIndex(0)
    setAnswers({})
    setSelected(null)
    setPhase('question')
  }

  function selectOption(optionIndex: number) {
    if (selected !== null) return
    setSelected(optionIndex)
  }

  function nextQuestion() {
    const q = examQuestions[currentIndex]
    const newAnswers = { ...answers, [q.id]: selected! }
    setAnswers(newAnswers)
    setSelected(null)

    if (currentIndex + 1 < examQuestions.length) {
      setCurrentIndex(currentIndex + 1)
    } else {
      // Calculate score and go to review
      let correct = 0
      examQuestions.forEach(q => { if (newAnswers[q.id] === q.correct) correct++ })
      const pct = Math.round((correct / examQuestions.length) * 100)
      setScore(pct)
      setPhase('review')
    }
  }

  async function submitResults() {
    setSubmitting(true)
    const passed = score >= PASSING_SCORE

    await supabase.from('enrollments').update({
      exam_passed: passed,
      exam_score: score,
      exam_attempts: (enrollment?.exam_attempts || 0) + 1,
      exam_completed_at: new Date().toISOString(),
    }).eq('user_id', user.id)

    if (passed) {
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'passed', email: user.email, score }),
      })
    }

    setSubmitting(false)
    setPhase('result')
  }

  function retakeExam() {
    setAnswers({})
    setSelected(null)
    setCurrentIndex(0)
    setScore(0)
    setPhase('intro')
  }

  // LOADING
  if (phase === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f8fafc' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTop: '3px solid #f59e0b', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  const q = examQuestions[currentIndex]
  const progress = ((currentIndex) / examQuestions.length) * 100
  const passed = score >= PASSING_SCORE

  // INTRO
  if (phase === 'intro') {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#0f2040' }}>
        <nav style={{ padding: '14px 24px' }}>
          <span style={{ fontFamily: 'Sora, sans-serif', color: '#f59e0b', fontWeight: 700, fontSize: '1rem' }}>ClearPass Drive</span>
        </nav>
        <div className="flex-1 flex items-center justify-center px-6">
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '48px 40px', maxWidth: '520px', width: '100%', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📋</div>
            <h1 style={{ fontFamily: 'Sora, sans-serif', color: '#0f2040', fontSize: '1.75rem', fontWeight: 700, marginBottom: '12px' }}>Final Exam</h1>
            <p style={{ color: '#64748b', marginBottom: '28px', lineHeight: 1.6 }}>
              20 questions · No time limit · Score 70% or higher to pass
            </p>
            <div style={{ backgroundColor: '#f8fafc', borderRadius: '10px', padding: '20px', marginBottom: '28px', textAlign: 'left' }}>
              {[
                'Questions appear one at a time',
                'Select your answer to proceed',
                'Review your answers before submitting',
                'You can retake if you don\'t pass',
              ].map((tip, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: i < 3 ? '10px' : 0 }}>
                  <span style={{ color: '#f59e0b', fontWeight: 700 }}>✓</span>
                  <span style={{ color: '#475569', fontSize: '0.9rem' }}>{tip}</span>
                </div>
              ))}
            </div>
            <button onClick={startExam} style={{ backgroundColor: '#f59e0b', color: '#0f2040', fontWeight: 700, padding: '14px 40px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '1rem', width: '100%' }}>
              Begin Exam →
            </button>
          </div>
        </div>
      </div>
    )
  }

  // QUESTION
  if (phase === 'question') {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f8fafc' }}>
        <nav style={{ backgroundColor: '#0f2040', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'Sora, sans-serif', color: '#f59e0b', fontWeight: 700, fontSize: '1rem' }}>ClearPass Drive — Final Exam</span>
          <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Question {currentIndex + 1} of {examQuestions.length}</span>
        </nav>

        {/* Progress bar */}
        <div style={{ backgroundColor: '#1e3a6e', height: '4px' }}>
          <div style={{ backgroundColor: '#f59e0b', height: '100%', width: `${progress}%`, transition: 'width 0.3s ease' }} />
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div style={{ maxWidth: '620px', width: '100%' }}>

            {/* Question number pill */}
            <div style={{ display: 'inline-block', backgroundColor: '#0f2040', color: '#f59e0b', fontSize: '0.8rem', fontWeight: 700, padding: '4px 14px', borderRadius: '20px', marginBottom: '16px' }}>
              Question {currentIndex + 1} / {examQuestions.length}
            </div>

            {/* Question card */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '32px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
              <p style={{ fontFamily: 'Sora, sans-serif', color: '#0f2040', fontSize: '1.15rem', fontWeight: 600, lineHeight: 1.6, margin: '0 0 28px' }}>
                {q.question}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {q.options.map((option, oi) => {
                  const isSelected = selected === oi
                  return (
                    <button
                      key={oi}
                      onClick={() => selectOption(oi)}
                      disabled={selected !== null}
                      style={{
                        textAlign: 'left', padding: '14px 18px', borderRadius: '10px',
                        border: `2px solid ${isSelected ? '#0f2040' : '#e2e8f0'}`,
                        backgroundColor: isSelected ? '#0f2040' : '#ffffff',
                        color: isSelected ? '#ffffff' : '#374151',
                        fontSize: '0.95rem', cursor: selected !== null ? 'default' : 'pointer',
                        fontWeight: isSelected ? 600 : 400, transition: 'all 0.15s',
                        display: 'flex', alignItems: 'center', gap: '12px',
                      }}
                    >
                      <span style={{
                        width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                        border: `2px solid ${isSelected ? '#f59e0b' : '#d1d5db'}`,
                        backgroundColor: isSelected ? '#f59e0b' : 'transparent',
                        color: isSelected ? '#0f2040' : '#9ca3af',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.75rem', fontWeight: 700,
                      }}>
                        {String.fromCharCode(65 + oi)}
                      </span>
                      {option}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Next button — only shows after selection */}
            {selected !== null && (
              <button
                onClick={nextQuestion}
                style={{
                  backgroundColor: '#f59e0b', color: '#0f2040', fontWeight: 700,
                  padding: '14px', borderRadius: '10px', border: 'none',
                  cursor: 'pointer', fontSize: '1rem', width: '100%',
                }}
              >
                {currentIndex + 1 < examQuestions.length ? 'Next Question →' : 'Review Answers →'}
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  // REVIEW
  if (phase === 'review') {
    const correctCount = examQuestions.filter(q => answers[q.id] === q.correct).length
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#f8fafc' }}>
        <nav style={{ backgroundColor: '#0f2040', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'Sora, sans-serif', color: '#f59e0b', fontWeight: 700, fontSize: '1rem' }}>ClearPass Drive — Review</span>
          <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{correctCount}/{examQuestions.length} correct</span>
        </nav>

        <div style={{ maxWidth: '720px', margin: '0 auto', padding: '32px 24px' }}>
          <div style={{ backgroundColor: '#0f2040', borderRadius: '12px', padding: '24px', marginBottom: '28px' }}>
            <h1 style={{ fontFamily: 'Sora, sans-serif', color: '#ffffff', fontSize: '1.3rem', fontWeight: 700, margin: '0 0 6px' }}>Review Your Answers</h1>
            <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem' }}>Check your responses before submitting. Correct answers are shown in green.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
            {examQuestions.map((q, qi) => {
              const userAnswer = answers[q.id]
              const isCorrect = userAnswer === q.correct
              return (
                <div key={q.id} style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px', border: `1.5px solid ${isCorrect ? '#86efac' : '#fca5a5'}` }}>
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '12px', alignItems: 'flex-start' }}>
                    <span style={{
                      width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0,
                      backgroundColor: isCorrect ? '#16a34a' : '#dc2626',
                      color: '#ffffff', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, marginTop: '1px'
                    }}>
                      {isCorrect ? '✓' : '✗'}
                    </span>
                    <p style={{ fontWeight: 600, color: '#0f2040', margin: 0, fontSize: '0.9rem', lineHeight: 1.5 }}>
                      <span style={{ color: '#94a3b8', fontWeight: 400 }}>Q{qi + 1}. </span>{q.question}
                    </p>
                  </div>
                  <div style={{ paddingLeft: '34px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ fontSize: '0.85rem', color: isCorrect ? '#16a34a' : '#dc2626', fontWeight: 600 }}>
                      Your answer: {q.options[userAnswer]}
                    </div>
                    {!isCorrect && (
                      <div style={{ fontSize: '0.85rem', color: '#16a34a', fontWeight: 600 }}>
                        Correct answer: {q.options[q.correct]}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Score summary */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0', marginBottom: '20px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'Sora, sans-serif', fontSize: '2.5rem', fontWeight: 800, color: passed ? '#16a34a' : '#dc2626' }}>{score}%</div>
            <p style={{ color: '#64748b', margin: '6px 0 0', fontSize: '0.9rem' }}>
              {correctCount} of {examQuestions.length} correct · {passed ? 'Passing score ✓' : `Need ${PASSING_SCORE}% to pass`}
            </p>
          </div>

          <button
            onClick={submitResults}
            disabled={submitting}
            style={{ backgroundColor: submitting ? '#94a3b8' : '#f59e0b', color: '#0f2040', fontWeight: 700, padding: '14px', borderRadius: '10px', border: 'none', cursor: submitting ? 'not-allowed' : 'pointer', fontSize: '1rem', width: '100%' }}
          >
            {submitting ? 'Submitting...' : 'Submit Exam'}
          </button>
        </div>
      </div>
    )
  }

  // RESULT
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ backgroundColor: '#0f2040' }}>
      <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '48px 40px', maxWidth: '480px', width: '100%', textAlign: 'center' }}>
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
            : `You scored ${score}%. You need ${PASSING_SCORE}% to pass. Review the course material and try again.`}
        </p>
        {passed ? (
          <a href="/certificate" style={{ display: 'block', backgroundColor: '#16a34a', color: '#ffffff', fontWeight: 700, padding: '14px 32px', borderRadius: '10px', textDecoration: 'none', fontSize: '1rem' }}>
            Download Certificate →
          </a>
        ) : (
          <button onClick={retakeExam} style={{ backgroundColor: '#f59e0b', color: '#0f2040', fontWeight: 700, padding: '14px 32px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '1rem', width: '100%' }}>
            Retake Exam
          </button>
        )}
      </div>
    </div>
  )
}
