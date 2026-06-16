'use client'
import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/register')
        return
      }
      setUserEmail(user.email || '')

      // Check if already paid
      const { data: enrollment } = await supabase
        .from('enrollments')
        .select('paid')
        .eq('user_id', user.id)
        .single()

      if (enrollment?.paid) {
        router.push('/course')
        return
      }

      // Check citation intake is complete
      const { data: citation } = await supabase
        .from('citations')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (!citation) {
        router.push('/intake')
        return
      }
    }
    getUser()
  }, [])

  async function handleCheckout() {
    setLoading(true)
    setError('')

    try {
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ email: userEmail }),
      })

      const { sessionId, error: apiError } = await res.json()
      if (apiError) throw new Error(apiError)

      const stripe = await stripePromise
      const { error: stripeError } = await stripe!.redirectToCheckout({ sessionId })
      if (stripeError) throw new Error(stripeError.message)
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#0f2040' }}>
      <nav className="px-6 py-4">
        <Link href="/" style={{ fontFamily: 'Sora, sans-serif', color: '#f59e0b', fontWeight: 700, fontSize: '1.1rem' }}>
          ← ClearPass Drive
        </Link>
      </nav>
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '40px', width: '100%', maxWidth: '440px' }}>
          <h1 style={{ fontFamily: 'Sora, sans-serif', color: '#0f2040', fontSize: '1.75rem', fontWeight: 700, marginBottom: '8px' }}>
            Complete your enrollment
          </h1>
          <p style={{ color: '#64748b', marginBottom: '32px', fontSize: '0.9rem' }}>
            One payment per citation. Valid for this traffic violation only.
          </p>

          {/* Order summary */}
          <div style={{ backgroundColor: '#f8fafc', borderRadius: '10px', padding: '20px', marginBottom: '24px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ color: '#374151', fontWeight: 500 }}>California Traffic School Course</span>
              <span style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, color: '#0f2040' }}>$24.95</span>
            </div>
            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
              {['10 chapters', '20-question final exam', 'Completion certificate', 'DMV-licensed school License Pending'].map(item => (
                <div key={item} style={{ color: '#64748b', fontSize: '0.85rem', padding: '2px 0', display: 'flex', gap: '8px' }}>
                  <span style={{ color: '#f59e0b' }}>✓</span> {item}
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 14px', color: '#dc2626', fontSize: '0.85rem', marginBottom: '16px' }}>
              {error}
            </div>
          )}

          <button
            onClick={handleCheckout}
            disabled={loading}
            style={{ backgroundColor: loading ? '#94a3b8' : '#f59e0b', color: '#0f2040', fontWeight: 700, padding: '14px', borderRadius: '10px', fontSize: '1rem', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', width: '100%', marginBottom: '12px' }}
          >
            {loading ? 'Redirecting to payment...' : 'Pay $24.95 — Start Learning'}
          </button>

          <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.78rem' }}>
            Secured by Stripe. We never store your card details.
          </p>
        </div>
      </div>
    </div>
  )
}
