'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleRegister() {
    if (!email || !password || !fullName) {
      setError('Please fill in all fields.')
      return
    }
    setLoading(true)
    setError('')

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    // Sign in immediately so the session cookie is set before redirecting
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    if (signInError) {
      setError(signInError.message)
      setLoading(false)
      return
    }

    // Redirect to intake form
    router.push('/intake')
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
          <h1 style={{ fontFamily: 'Sora, sans-serif', color: '#0f2040', fontSize: '1.75rem', fontWeight: 700, marginBottom: '8px' }}>
            Create your account
          </h1>
          <p style={{ color: '#64748b', marginBottom: '32px', fontSize: '0.9rem' }}>
            You'll pay after creating your account.
          </p>

          <div className="flex flex-col gap-4">
            <div>
              <label style={{ display: 'block', color: '#374151', fontWeight: 500, fontSize: '0.9rem', marginBottom: '6px' }}>Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Jane Smith"
                style={{ width: '100%', border: '1.5px solid #e2e8f0', borderRadius: '8px', padding: '10px 14px', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', color: '#374151', fontWeight: 500, fontSize: '0.9rem', marginBottom: '6px' }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="jane@email.com"
                style={{ width: '100%', border: '1.5px solid #e2e8f0', borderRadius: '8px', padding: '10px 14px', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', color: '#374151', fontWeight: 500, fontSize: '0.9rem', marginBottom: '6px' }}>Password</label>
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

            {error && (
              <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 14px', color: '#dc2626', fontSize: '0.85rem' }}>
                {error}
              </div>
            )}

            <button
              onClick={handleRegister}
              disabled={loading}
              style={{ backgroundColor: loading ? '#94a3b8' : '#f59e0b', color: '#0f2040', fontWeight: 700, padding: '12px', borderRadius: '10px', fontSize: '1rem', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', width: '100%' }}
            >
              {loading ? 'Creating account...' : 'Continue to Payment →'}
            </button>

            <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
              Already have an account?{' '}
              <Link href="/login" style={{ color: '#1e3a6e', fontWeight: 600 }}>Sign in</Link>
            </p>
            <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.75rem' }}>
              By creating an account, you agree to our{' '}
              <Link href="/terms" style={{ color: '#64748b', textDecoration: 'underline' }}>Terms of Service</Link>{' '}
              and{' '}
              <Link href="/privacy" style={{ color: '#64748b', textDecoration: 'underline' }}>Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
