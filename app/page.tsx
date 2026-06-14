'use client'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8fafc' }}>
      {/* Nav */}
      <nav style={{ backgroundColor: '#0f2040' }} className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span style={{ fontFamily: 'Sora, sans-serif', color: '#f59e0b', fontWeight: 700, fontSize: '1.25rem' }}>
            ClearPass Drive
          </span>
          <span style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '2px' }}>
            California Traffic School
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" style={{ color: '#cbd5e1', fontSize: '0.9rem' }} className="hover:text-white transition-colors">
            Sign In
          </Link>
          <Link href="/register" style={{ backgroundColor: '#f59e0b', color: '#0f2040', fontWeight: 600, padding: '8px 20px', borderRadius: '8px', fontSize: '0.9rem' }} className="hover:bg-amber-400 transition-colors">
            Start Course
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ backgroundColor: '#0f2040', paddingBottom: '80px', paddingTop: '80px' }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div style={{ display: 'inline-block', backgroundColor: '#1e3a6e', color: '#f59e0b', fontSize: '0.8rem', fontWeight: 600, padding: '4px 14px', borderRadius: '20px', marginBottom: '24px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            DMV-Licensed Traffic Violator School · License #E1393
          </div>
          <h1 style={{ fontFamily: 'Sora, sans-serif', color: '#ffffff', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: '20px' }}>
            Clear your ticket.<br />
            <span style={{ color: '#f59e0b' }}>Keep your record clean.</span>
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '540px', margin: '0 auto 40px', lineHeight: 1.7 }}>
            Complete your California traffic school requirement online, on your schedule. 10 chapters, one final exam, certificate delivered to your court.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/register" style={{ backgroundColor: '#f59e0b', color: '#0f2040', fontWeight: 700, padding: '14px 36px', borderRadius: '10px', fontSize: '1.05rem', display: 'inline-block' }} className="hover:bg-amber-400 transition-colors">
              Get Started — $24.95
            </Link>
            <a href="#how-it-works" style={{ color: '#cbd5e1', fontSize: '0.95rem' }} className="hover:text-white transition-colors">
              How it works →
            </a>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section style={{ backgroundColor: '#1e3a6e', padding: '20px 0' }}>
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-center gap-8 flex-wrap">
          {['✓ DMV-Licensed #E1393', '✓ Self-Paced Online', '✓ Certificate Same Day', '✓ 70% to Pass'].map(item => (
            <span key={item} style={{ color: '#f59e0b', fontSize: '0.85rem', fontWeight: 600 }}>{item}</span>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="max-w-4xl mx-auto px-6 py-20">
        <h2 style={{ fontFamily: 'Sora, sans-serif', color: '#0f2040', fontSize: '2rem', fontWeight: 700, textAlign: 'center', marginBottom: '12px' }}>
          How it works
        </h2>
        <p style={{ color: '#64748b', textAlign: 'center', marginBottom: '48px' }}>Done in four steps. No classroom. No waiting.</p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { step: '1', title: 'Pay once', desc: 'Secure payment of $24.95. No hidden fees.' },
            { step: '2', title: 'Read 10 chapters', desc: 'Work at your own pace. Progress is saved automatically.' },
            { step: '3', title: 'Pass the exam', desc: 'Score 70% or higher on the 20-question final exam.' },
            { step: '4', title: 'Get your certificate', desc: 'Download and submit to your court before your deadline.' },
          ].map(({ step, title, desc }) => (
            <div key={step} className="text-center">
              <div style={{ width: '48px', height: '48px', backgroundColor: '#f59e0b', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: '#0f2040' }}>
                {step}
              </div>
              <h3 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 600, color: '#0f2040', marginBottom: '8px' }}>{title}</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section style={{ backgroundColor: '#0f2040', padding: '80px 24px' }}>
        <div className="max-w-md mx-auto text-center">
          <h2 style={{ fontFamily: 'Sora, sans-serif', color: '#ffffff', fontSize: '2rem', fontWeight: 700, marginBottom: '8px' }}>
            One flat price
          </h2>
          <p style={{ color: '#94a3b8', marginBottom: '40px' }}>Everything included. No surprises.</p>
          <div style={{ backgroundColor: '#1e3a6e', borderRadius: '16px', padding: '40px', border: '1px solid #2d4f8e' }}>
            <div style={{ fontFamily: 'Sora, sans-serif', fontSize: '4rem', fontWeight: 800, color: '#f59e0b', lineHeight: 1 }}>$24.95</div>
            <div style={{ color: '#94a3b8', marginBottom: '32px', fontSize: '0.9rem' }}>one-time payment</div>
            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '32px' }}>
              {[
                '10-chapter DMV-compliant curriculum',
                'Unlimited reads — go at your pace',
                '20-question final exam',
                'Retake exam if needed',
                'Completion certificate PDF',
                'Email confirmation',
              ].map(item => (
                <li key={item} style={{ color: '#e2e8f0', fontSize: '0.9rem', padding: '8px 0', borderBottom: '1px solid #2d4f8e', textAlign: 'left', display: 'flex', gap: '10px' }}>
                  <span style={{ color: '#f59e0b' }}>✓</span> {item}
                </li>
              ))}
            </ul>
            <Link href="/register" style={{ display: 'block', backgroundColor: '#f59e0b', color: '#0f2040', fontWeight: 700, padding: '14px', borderRadius: '10px', fontSize: '1rem', textAlign: 'center' }} className="hover:bg-amber-400 transition-colors">
              Enroll Now
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: '#0a1628', padding: '40px 24px', textAlign: 'center' }}>
        <div style={{ fontFamily: 'Sora, sans-serif', color: '#f59e0b', fontWeight: 700, marginBottom: '8px' }}>ClearPass Drive</div>
        <p style={{ color: '#475569', fontSize: '0.8rem', marginBottom: '4px' }}>NMG Enterprises — California DMV-Licensed Traffic Violator School · License #E1393</p>
        <p style={{ color: '#334155', fontSize: '0.75rem' }}>© {new Date().getFullYear()} NMG Enterprises. All rights reserved.</p>
      </footer>
    </div>
  )
}
