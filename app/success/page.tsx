'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

function SuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const sessionId = searchParams.get('session_id')
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

  useEffect(() => {
    if (!sessionId) { router.push('/'); return }
    async function completeEnrollment() {
      try {
        const res = await fetch('/api/complete', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sessionId }) })
        const data = await res.json()
        setStatus(data.success ? 'success' : 'error')
      } catch { setStatus('error') }
    }
    completeEnrollment()
  }, [sessionId])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ backgroundColor: '#0f2040' }}>
      {status === 'loading' && (
        <div className="text-center">
          <div style={{ width: '48px', height: '48px', border: '4px solid #1e3a6e', borderTop: '4px solid #f59e0b', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }} />
          <p style={{ color: '#94a3b8' }}>Setting up your course...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}
      {status === 'success' && (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '48px 40px', maxWidth: '480px', width: '100%', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🎉</div>
          <h1 style={{ fontFamily: 'Sora, sans-serif', color: '#0f2040', fontSize: '1.75rem', fontWeight: 700, marginBottom: '12px' }}>You're enrolled!</h1>
          <p style={{ color: '#64748b', marginBottom: '32px', lineHeight: 1.6 }}>Payment confirmed. Your course is ready.</p>
          <Link href="/course" style={{ display: 'block', backgroundColor: '#f59e0b', color: '#0f2040', fontWeight: 700, padding: '14px', borderRadius: '10px', fontSize: '1rem', textDecoration: 'none' }}>Start Chapter 1 →</Link>
        </div>
      )}
      {status === 'error' && (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '40px', maxWidth: '440px', width: '100%', textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'Sora, sans-serif', color: '#dc2626', fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px' }}>Something went wrong</h1>
          <p style={{ color: '#64748b', marginBottom: '24px' }}>Please contact support@clearpassdrive.com</p>
          <Link href="/dashboard" style={{ color: '#1e3a6e', fontWeight: 600 }}>Go to Dashboard</Link>
        </div>
      )}
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0f2040' }}>
        <div style={{ width: '48px', height: '48px', border: '4px solid #1e3a6e', borderTop: '4px solid #f59e0b', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
