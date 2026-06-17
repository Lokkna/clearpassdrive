'use client'
import Link from 'next/link'

export default function TermsPage() {
  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <nav style={{ backgroundColor: '#0f2040', padding: '16px 24px' }}>
        <Link href="/" style={{ fontFamily: 'Sora, sans-serif', color: '#f59e0b', fontWeight: 700, fontSize: '1.1rem', textDecoration: 'none' }}>
          ← ClearPass Drive
        </Link>
      </nav>

      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '48px 24px 80px' }}>
        <h1 style={{ fontFamily: 'Sora, sans-serif', color: '#0f2040', fontSize: '2rem', fontWeight: 700, marginBottom: '8px' }}>
          Terms of Service
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '40px' }}>Last updated: June 16, 2026</p>

        <div style={{ color: '#374151', fontSize: '0.95rem', lineHeight: 1.75, display: 'flex', flexDirection: 'column', gap: '28px' }}>
          <section>
            <p>
              These terms govern your use of ClearPass Drive, operated by Ndole Media Group ("we," "us"). By creating an
              account, you agree to these terms.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: 'Sora, sans-serif', color: '#0f2040', fontSize: '1.2rem', fontWeight: 700, marginBottom: '10px' }}>1. The course</h2>
            <p>ClearPass Drive provides a 10-chapter online California traffic violator school course followed by a final exam. You must complete all 10 chapters and pass the final exam with a score of 70% or higher to receive a completion certificate.</p>
          </section>

          <section>
            <h2 style={{ fontFamily: 'Sora, sans-serif', color: '#0f2040', fontSize: '1.2rem', fontWeight: 700, marginBottom: '10px' }}>2. Accuracy of your information</h2>
            <p>You're responsible for entering accurate citation information (court, citation number, and related details) and for confirming the name on your account matches the name on your citation. We're not responsible for a certificate being rejected by a court due to inaccurate information you provided.</p>
          </section>

          <section>
            <h2 style={{ fontFamily: 'Sora, sans-serif', color: '#0f2040', fontSize: '1.2rem', fontWeight: 700, marginBottom: '10px' }}>3. Fees and payment</h2>
            <p>The course fee is a one-time charge per citation, processed securely through Stripe. We don't store your card details and don't charge you again without your action.</p>
          </section>

          <section>
            <h2 style={{ fontFamily: 'Sora, sans-serif', color: '#0f2040', fontSize: '1.2rem', fontWeight: 700, marginBottom: '10px' }}>4. Refunds</h2>
            <p>You may request a full refund within 24 hours of enrolling, provided you have not yet started Chapter 1. Once 24 hours have passed, or once you've started the course — whichever happens first — the fee is non-refundable.</p>
          </section>

          <section>
            <h2 style={{ fontFamily: 'Sora, sans-serif', color: '#0f2040', fontSize: '1.2rem', fontWeight: 700, marginBottom: '10px' }}>5. Submitting your certificate</h2>
            <p>You are solely responsible for submitting your completion certificate to your court before the deadline on your citation or court notice. We're not responsible for late submission, missed deadlines, or any consequence of failing to submit your certificate on time.</p>
          </section>

          <section>
            <h2 style={{ fontFamily: 'Sora, sans-serif', color: '#0f2040', fontSize: '1.2rem', fontWeight: 700, marginBottom: '10px' }}>6. Course conduct</h2>
            <p>Your account is for your own use only. You agree to complete the course and exam yourself, without having someone else complete it on your behalf, and without attempting to bypass the minimum reading-time requirement built into each chapter. We may suspend or terminate accounts that violate this section, without refund.</p>
          </section>

          <section>
            <h2 style={{ fontFamily: 'Sora, sans-serif', color: '#0f2040', fontSize: '1.2rem', fontWeight: 700, marginBottom: '10px' }}>7. No guarantee of outcome</h2>
            <p>We provide the course "as is." Completing the course does not guarantee that a specific court will accept your certificate, that a citation will be dismissed or masked, or that your insurance rates will change — those outcomes depend on your court, the DMV, and your insurer, not on us.</p>
          </section>

          <section>
            <h2 style={{ fontFamily: 'Sora, sans-serif', color: '#0f2040', fontSize: '1.2rem', fontWeight: 700, marginBottom: '10px' }}>8. Limitation of liability</h2>
            <p>To the extent permitted by law, our total liability to you for any claim relating to the course is limited to the amount you paid us.</p>
          </section>

          <section>
            <h2 style={{ fontFamily: 'Sora, sans-serif', color: '#0f2040', fontSize: '1.2rem', fontWeight: 700, marginBottom: '10px' }}>9. Governing law</h2>
            <p>These terms are governed by the laws of the State of California. Any dispute will be resolved in the state or federal courts located in Fresno County, California.</p>
          </section>

          <section>
            <h2 style={{ fontFamily: 'Sora, sans-serif', color: '#0f2040', fontSize: '1.2rem', fontWeight: 700, marginBottom: '10px' }}>10. Changes to these terms</h2>
            <p>If we make material changes to these terms, we'll update the date at the top of this page.</p>
          </section>

          <section>
            <h2 style={{ fontFamily: 'Sora, sans-serif', color: '#0f2040', fontSize: '1.2rem', fontWeight: 700, marginBottom: '10px' }}>11. Contact us</h2>
            <p>Ndole Media Group<br />Email: <a href="mailto:support@clearpassdrive.com" style={{ color: '#1e3a6e' }}>support@clearpassdrive.com</a></p>
          </section>
        </div>
      </div>

      <footer style={{ backgroundColor: '#0a1628', padding: '32px 24px', textAlign: 'center' }}>
        <p style={{ color: '#334155', fontSize: '0.75rem' }}>© {new Date().getFullYear()} Ndole Media Group. All rights reserved.</p>
      </footer>
    </div>
  )
}
