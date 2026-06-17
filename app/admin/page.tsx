'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

function formatClock(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function AdminPage() {
  const [checking, setChecking] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [email, setEmail] = useState('')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<any>(null)
  const [actionKey, setActionKey] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function check() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }
      try {
        const res = await fetch('/api/admin/whoami', {
          headers: { Authorization: `Bearer ${session.access_token}` },
        })
        const data = await res.json()
        if (!data.isAdmin) { router.push('/dashboard'); return }
        setIsAdmin(true)
      } catch {
        router.push('/dashboard')
      } finally {
        setChecking(false)
      }
    }
    check()
  }, [])

  async function authHeader() {
    const { data: { session } } = await supabase.auth.getSession()
    return { 'Content-Type': 'application/json', Authorization: `Bearer ${session?.access_token}` }
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch('/api/admin/lookup', {
        method: 'POST',
        headers: await authHeader(),
        body: JSON.stringify({ email: email.trim() }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Lookup failed'); setLoading(false); return }
      setResult(data)
    } catch {
      setError('Something went wrong. Try again.')
    }
    setLoading(false)
  }

  async function handleOverride(enrollmentId: string, chapterId: number, action: 'unlock' | 'complete') {
    const key = `${enrollmentId}-${chapterId}-${action}`
    setActionKey(key)
    try {
      const res = await fetch('/api/admin/override-chapter', {
        method: 'POST',
        headers: await authHeader(),
        body: JSON.stringify({ enrollmentId, chapterId, action, note: note.trim() || undefined }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Action failed'); setActionKey(null); return }
      // Re-run the search to pull fresh, server-computed lock state.
      await handleSearch({ preventDefault: () => {} } as React.FormEvent)
    } catch {
      setError('Something went wrong. Try again.')
    }
    setActionKey(null)
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f8fafc' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTop: '3px solid #f59e0b', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  if (!isAdmin) return null

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8fafc' }}>
      <nav style={{ backgroundColor: '#0f2040', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'Sora, sans-serif', color: '#f59e0b', fontWeight: 700, fontSize: '1.1rem' }}>ClearPass Drive — Admin</span>
        <a href="/dashboard" style={{ color: '#94a3b8', fontSize: '0.85rem', textDecoration: 'none' }}>← Dashboard</a>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 style={{ fontFamily: 'Sora, sans-serif', color: '#0f2040', fontSize: '1.5rem', fontWeight: 700, marginBottom: '4px' }}>
          Student Support
        </h1>
        <p style={{ color: '#64748b', marginBottom: '24px', fontSize: '0.9rem' }}>
          Look up a student to view or override their chapter time-lock status. Every override is logged with your email, the time, and your note.
        </p>

        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="student@email.com"
            style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.9rem' }}
          />
          <button type="submit" disabled={loading}
            style={{ backgroundColor: '#f59e0b', color: '#0f2040', fontWeight: 700, padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '0.9rem' }}>
            {loading ? 'Searching...' : 'Look up'}
          </button>
        </form>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', color: '#64748b', fontSize: '0.8rem', marginBottom: '4px' }}>Reason / note (recorded with any action you take below)</label>
          <input
            type="text"
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="e.g. student reported a stuck timer, verified via phone call"
            style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.85rem' }}
          />
        </div>

        {error && (
          <div style={{ backgroundColor: '#fef2f2', color: '#b91c1c', fontSize: '0.85rem', padding: '10px 14px', borderRadius: '8px', marginBottom: '20px' }}>{error}</div>
        )}

        {result && (
          <div>
            <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '16px 20px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
              <div style={{ fontWeight: 700, color: '#0f2040' }}>{result.student.fullName || result.student.email}</div>
              <div style={{ color: '#64748b', fontSize: '0.85rem' }}>{result.student.email}</div>
            </div>

            {result.enrollments.length === 0 && (
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>No enrollments found for this student.</p>
            )}

            {result.enrollments.map((enr: any) => (
              <div key={enr.id} style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ fontSize: '0.85rem', color: '#374151' }}>
                    Enrollment <span style={{ fontFamily: 'monospace', color: '#94a3b8' }}>{enr.id.slice(0, 8)}</span> · {new Date(enr.created_at).toLocaleDateString()}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ backgroundColor: enr.paid ? '#dcfce7' : '#fef2f2', color: enr.paid ? '#16a34a' : '#b91c1c', fontSize: '0.75rem', fontWeight: 600, padding: '2px 10px', borderRadius: '12px' }}>{enr.paid ? 'Paid' : 'Unpaid'}</span>
                    {enr.exam_passed && <span style={{ backgroundColor: '#dcfce7', color: '#16a34a', fontSize: '0.75rem', fontWeight: 600, padding: '2px 10px', borderRadius: '12px' }}>Exam passed ({enr.exam_score}%)</span>}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '8px' }}>
                  {enr.chapterLocks.map((cl: any) => {
                    const unlockKey = `${enr.id}-${cl.chapterId}-unlock`
                    const completeKey = `${enr.id}-${cl.chapterId}-complete`
                    return (
                      <div key={cl.chapterId} style={{ border: '1px solid #f1f5f9', borderRadius: '8px', padding: '10px 12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#0f2040' }}>Ch {cl.chapterId}</span>
                          <span style={{ fontSize: '0.75rem', color: cl.complete ? '#16a34a' : cl.locked ? '#b45309' : cl.locked === false ? '#0f2040' : '#94a3b8' }}>
                            {cl.complete ? 'Complete' : cl.locked === null ? 'Not started' : cl.locked ? `${formatClock(cl.requiredSeconds - cl.elapsedSeconds)} left` : 'Unlocked'}
                          </span>
                        </div>
                        {!cl.complete && (
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button onClick={() => handleOverride(enr.id, cl.chapterId, 'unlock')} disabled={actionKey === unlockKey}
                              style={{ flex: 1, fontSize: '0.75rem', padding: '5px 8px', borderRadius: '6px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', cursor: actionKey === unlockKey ? 'not-allowed' : 'pointer' }}>
                              {actionKey === unlockKey ? '...' : 'Unlock'}
                            </button>
                            <button onClick={() => handleOverride(enr.id, cl.chapterId, 'complete')} disabled={actionKey === completeKey}
                              style={{ flex: 1, fontSize: '0.75rem', padding: '5px 8px', borderRadius: '6px', border: 'none', backgroundColor: '#0f2040', color: '#ffffff', cursor: actionKey === completeKey ? 'not-allowed' : 'pointer' }}>
                              {actionKey === completeKey ? '...' : 'Complete'}
                            </button>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
