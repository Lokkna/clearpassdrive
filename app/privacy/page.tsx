'use client'
import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <nav style={{ backgroundColor: '#0f2040', padding: '16px 24px' }}>
        <Link href="/" style={{ fontFamily: 'Sora, sans-serif', color: '#f59e0b', fontWeight: 700, fontSize: '1.1rem', textDecoration: 'none' }}>
          ← ClearPass Drive
        </Link>
      </nav>

      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '48px 24px 80px' }}>
        <h1 style={{ fontFamily: 'Sora, sans-serif', color: '#0f2040', fontSize: '2rem', fontWeight: 700, marginBottom: '8px' }}>
          Privacy Policy
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '40px' }}>Last updated: June 16, 2026</p>

        <div style={{ color: '#374151', fontSize: '0.95rem', lineHeight: 1.75, display: 'flex', flexDirection: 'column', gap: '28px' }}>
          <section>
            <p>
              NMG Enterprises ("ClearPass Drive," "we," "us") operates clearpassdrive.com as a California traffic violator
              school course. This policy explains what information we collect when you use the site, how we use it, and
              who we share it with.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: 'Sora, sans-serif', color: '#0f2040', fontSize: '1.2rem', fontWeight: 700, marginBottom: '10px' }}>Information we collect</h2>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li><strong>Account information:</strong> your name, email address, and password.</li>
              <li><strong>Citation information:</strong> the details you enter from your traffic citation (court, citation number, violation, and similar fields), which we use to prepare your DMV intake record and completion certificate.</li>
              <li><strong>Payment information:</strong> our payment processor, Stripe, handles your card details directly. We never see or store your full card number.</li>
              <li><strong>Course activity:</strong> which chapters you've read, your time spent per chapter, and your exam answers and score, which we're required to track to issue a valid completion certificate.</li>
              <li><strong>Support communications:</strong> anything you send us by email.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontFamily: 'Sora, sans-serif', color: '#0f2040', fontSize: '1.2rem', fontWeight: 700, marginBottom: '10px' }}>How we use your information</h2>
            <p>We use your information to provide the course itself, process your payment, generate and deliver your completion certificate, communicate with you about your enrollment, and meet our recordkeeping obligations as a California traffic violator school. We do not use your information for advertising, and we do not sell your information to anyone.</p>
          </section>

          <section>
            <h2 style={{ fontFamily: 'Sora, sans-serif', color: '#0f2040', fontSize: '1.2rem', fontWeight: 700, marginBottom: '10px' }}>Who we share it with</h2>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li><strong>Stripe</strong> — to process your course payment.</li>
              <li><strong>Resend</strong> — to deliver your enrollment and certificate emails.</li>
              <li><strong>Supabase</strong> — our database provider, which securely stores your account and course records.</li>
              <li><strong>Courts and the DMV</strong> — only your completion certificate, and only because that's the document your enrollment exists to produce. We don't share your account, payment, or course-activity data with courts.</li>
              <li>We may disclose information if required by law, subpoena, or court order.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontFamily: 'Sora, sans-serif', color: '#0f2040', fontSize: '1.2rem', fontWeight: 700, marginBottom: '10px' }}>Data security</h2>
            <p>Connections to clearpassdrive.com are encrypted. Card payments are handled directly by Stripe under its own PCI-compliant infrastructure — we never receive your full card number. Access to your records within our systems is restricted to what's needed to operate the course and to respond to support requests.</p>
          </section>

          <section>
            <h2 style={{ fontFamily: 'Sora, sans-serif', color: '#0f2040', fontSize: '1.2rem', fontWeight: 700, marginBottom: '10px' }}>Data retention</h2>
            <p>We retain enrollment and completion records for as long as required under California traffic violator school recordkeeping rules and other applicable law.</p>
          </section>

          <section>
            <h2 style={{ fontFamily: 'Sora, sans-serif', color: '#0f2040', fontSize: '1.2rem', fontWeight: 700, marginBottom: '10px' }}>Your choices</h2>
            <p>You can ask us to access, correct, or delete your personal information by emailing us at the address below. We'll honor that request to the extent it doesn't conflict with our recordkeeping obligations as a licensed traffic violator school — for example, we may need to retain a record that a completed course exists, even after deleting other details, where law requires it.</p>
          </section>

          <section>
            <h2 style={{ fontFamily: 'Sora, sans-serif', color: '#0f2040', fontSize: '1.2rem', fontWeight: 700, marginBottom: '10px' }}>Cookies</h2>
            <p>We use only the essential cookies needed to keep you signed in while you take the course. We don't use advertising or third-party tracking cookies.</p>
          </section>

          <section>
            <h2 style={{ fontFamily: 'Sora, sans-serif', color: '#0f2040', fontSize: '1.2rem', fontWeight: 700, marginBottom: '10px' }}>Children's privacy</h2>
            <p>ClearPass Drive is not directed at, and we do not knowingly collect information from, children under 13.</p>
          </section>

          <section>
            <h2 style={{ fontFamily: 'Sora, sans-serif', color: '#0f2040', fontSize: '1.2rem', fontWeight: 700, marginBottom: '10px' }}>Changes to this policy</h2>
            <p>If we make material changes to this policy, we'll update the date at the top of this page.</p>
          </section>

          <section>
            <h2 style={{ fontFamily: 'Sora, sans-serif', color: '#0f2040', fontSize: '1.2rem', fontWeight: 700, marginBottom: '10px' }}>Contact us</h2>
            <p>NMG Enterprises<br />Email: <a href="mailto:support@clearpassdrive.com" style={{ color: '#1e3a6e' }}>support@clearpassdrive.com</a></p>
          </section>
        </div>
      </div>

      <footer style={{ backgroundColor: '#0a1628', padding: '32px 24px', textAlign: 'center' }}>
        <p style={{ color: '#334155', fontSize: '0.75rem' }}>© {new Date().getFullYear()} NMG Enterprises. All rights reserved.</p>
      </footer>
    </div>
  )
}
