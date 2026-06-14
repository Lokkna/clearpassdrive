'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin() {
    if (!email || !password) {
      setError('Please enter your email and password.')
      return
    }
    setLoading(true)
    setError('')

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })

    if (signInError) {
      setError('Invalid email or password.')
      setLoading(false)
      return
    }

    router.push('/dashboard')
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
            Welcome back
          </h1>
          <p style={{ color: '#64748b', marginBottom: '32px', fontSize: '0.9rem' }}>
            Sign in to continue your course.
          </p>

          <div className="flex flex-col gap-4">
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
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Your password"
                style={{ width: '100%', border: '1.5px solid #e2e8f0', borderRadius: '8px', padding: '10px 14px', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            {error && (
              <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 14px', color: '#dc2626', fontSize: '0.85rem' }}>
                {error}
              </div>
            )}

            <button
              onClick={handleLogin}
              disabled={loading}
              style={{ backgroundColor: loading ? '#94a3b8' : '#f59e0b', color: '#0f2040', fontWeight: 700, padding: '12px', borderRadius: '10px', fontSize: '1rem', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', width: '100%' }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
              Don't have an account?{' '}
              <Link href="/register" style={{ color: '#1e3a6e', fontWeight: 600 }}>Register</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
