'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [sessionReady, setSessionReady] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Supabase sends the user back with an access token in the URL hash.
    // The client-side Supabase SDK picks this up automatically via
    // onAuthStateChange — we just need to wait for it to fire before
    // allowing a password update.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setSessionReady(true)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handleReset() {
    if (!password || !confirm) {
      setError('Please fill in both fields.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    setError('')

    const { error: updateError } = await supabase.auth.updateUser({ password })

    setLoading(false)

    if (updateError) {
      setError('Something went wrong. Your reset link may have expired — request a new one from the login page.')
      return
    }

    setDone(true)
    setTimeout(() => router.push('/dashboard'), 3000)
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#0f2040' }}>
      <nav className="px-6 py-4">
        <Link href="/" style={{ fontFamily: 'Sora, sans-serif', color: '#f59e0b', fontWeight: 700, fontSize: '1.1rem' }}>
          ← ClearPass Drive
        </Link>
      </nav>
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '40px', width: '100%', maxWidth: '420px' }}>

          {done ? (
            <div>
              <h1 style={{ fontFamily: 'Sora, sans-serif', color: '#0f2040', fontSize: '1.75rem', fontWeight: 700, marginBottom: '8px' }}>
                Password updated ✓
              </h1>
              <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Your password has been changed successfully. Taking you to your dashboard now...
              </p>
            </div>
          ) : !sessionReady ? (
            <div>
              <h1 style={{ fontFamily: 'Sora, sans-serif', color: '#0f2040', fontSize: '1.75rem', fontWeight: 700, marginBottom: '8px' }}>
                Verifying your link...
              </h1>
              <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Please wait a moment. If nothing happens, your reset link may have expired —{' '}
                <Link href="/login" style={{ color: '#1e3a6e', fontWeight: 600 }}>request a new one</Link>.
              </p>
            </div>
          ) : (
            <div>
              <h1 style={{ fontFamily: 'Sora, sans-serif', color: '#0f2040', fontSize: '1.75rem', fontWeight: 700, marginBottom: '8px' }}>
                Set a new password
              </h1>
              <p style={{ color: '#64748b', marginBottom: '32px', fontSize: '0.9rem' }}>
                Choose a new password for your account.
              </p>
              <div className="flex flex-col gap-4">
                <div>
                  <label style={{ display: 'block', color: '#374151', fontWeight: 500, fontSize: '0.9rem', marginBottom: '6px' }}>New password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="At least 8 characters"
                      style={{ width: '100%', border: '1.5px solid #e2e8f0', borderRadius: '8px', padding: '10px 44px 10px 14px', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }}
                    />
                    <button onClick={() => setShowPassword(p => !p)} tabIndex={-1} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '1rem', padding: 0, lineHeight: 1 }}>
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', color: '#374151', fontWeight: 500, fontSize: '0.9rem', marginBottom: '6px' }}>Confirm new password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={confirm}
                      onChange={e => setConfirm(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleReset()}
                      placeholder="Repeat your new password"
                      style={{ width: '100%', border: '1.5px solid #e2e8f0', borderRadius: '8px', padding: '10px 44px 10px 14px', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }}
                    />
                    <button onClick={() => setShowConfirm(p => !p)} tabIndex={-1} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '1rem', padding: 0, lineHeight: 1 }}>
                      {showConfirm ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>
                {error && (
                  <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 14px', color: '#dc2626', fontSize: '0.85rem' }}>
                    {error}
                  </div>
                )}
                <button
                  onClick={handleReset}
                  disabled={loading}
                  style={{ backgroundColor: loading ? '#94a3b8' : '#f59e0b', color: '#0f2040', fontWeight: 700, padding: '12px', borderRadius: '10px', fontSize: '1rem', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', width: '100%' }}
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
