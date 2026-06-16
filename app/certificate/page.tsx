'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { generateCertificatePDF, buildCertId } from '@/lib/certificate-pdf'

export default function CertificatePage() {
  const [user, setUser] = useState<any>(null)
  const [enrollment, setEnrollment] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)

      const { data: enrollment } = await supabase
        .from('enrollments')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (!enrollment?.paid) { router.push('/checkout'); return }
      if (!enrollment?.exam_passed) { router.push('/exam'); return }

      setEnrollment(enrollment)
      setLoading(false)
    }
    load()
  }, [])

  function handleDownload() {
    const doc = generateCertificatePDF({
      fullName,
      examScore: enrollment?.exam_score ?? 0,
      completedDate,
      certId,
    })
    doc.save('ClearPassDrive-Certificate.pdf')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f8fafc' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTop: '3px solid #f59e0b', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  const fullName = user?.user_metadata?.full_name || user?.email || 'Student'
  const completedDate = enrollment?.exam_completed_at
    ? new Date(enrollment.exam_completed_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  const certId = buildCertId(user?.id || '', new Date().getFullYear())

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Screen controls — hidden when printing */}
      <div className="no-print" style={{ backgroundColor: '#0f2040', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'Sora, sans-serif', color: '#f59e0b', fontWeight: 700 }}>ClearPass Drive</span>
        <div style={{ display: 'flex', gap: '12px' }}>
          <a href="/dashboard" style={{ color: '#94a3b8', fontSize: '0.9rem', textDecoration: 'none' }}>← Dashboard</a>
          <button onClick={handleDownload} style={{ backgroundColor: '#f59e0b', color: '#0f2040', fontWeight: 700, padding: '8px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.9rem' }}>
            Download PDF
          </button>
        </div>
      </div>

      <div style={{ padding: '40px 24px', display: 'flex', justifyContent: 'center' }}>
        {/* Certificate */}
        <div id="certificate" style={{
          width: '800px',
          backgroundColor: '#ffffff',
          border: '8px solid #0f2040',
          borderRadius: '4px',
          padding: '60px',
          textAlign: 'center',
          position: 'relative',
          boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
        }}>
          {/* Corner decorations */}
          {[['top', 'left'], ['top', 'right'], ['bottom', 'left'], ['bottom', 'right']].map(([v, h]) => (
            <div key={`${v}-${h}`} style={{
              position: 'absolute', [v]: '16px', [h]: '16px',
              width: '40px', height: '40px',
              border: '3px solid #f59e0b',
              borderRadius: '2px',
            }} />
          ))}

          <div style={{ marginBottom: '8px' }}>
            <span style={{ fontFamily: 'Sora, sans-serif', color: '#f59e0b', fontWeight: 800, fontSize: '1.4rem', letterSpacing: '0.05em' }}>
              CLEARPASS DRIVE
            </span>
          </div>
          <div style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '32px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            California Traffic Violator School · DMV License Pending
          </div>

          <div style={{ fontFamily: 'Georgia, serif', color: '#475569', fontSize: '1rem', marginBottom: '8px' }}>
            This certifies that
          </div>
          <div style={{ fontFamily: 'Georgia, serif', color: '#0f2040', fontSize: '2.2rem', fontWeight: 700, borderBottom: '2px solid #f59e0b', paddingBottom: '12px', marginBottom: '12px', display: 'inline-block', minWidth: '400px' }}>
            {fullName}
          </div>
          <div style={{ fontFamily: 'Georgia, serif', color: '#475569', fontSize: '1rem', marginBottom: '8px', marginTop: '12px' }}>
            has successfully completed the
          </div>
          <div style={{ fontFamily: 'Sora, sans-serif', color: '#0f2040', fontSize: '1.3rem', fontWeight: 700, marginBottom: '8px' }}>
            California Traffic Violator School Course
          </div>
          <div style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '32px' }}>
            California Vehicle Code — 8-Hour Curriculum · OL 613 Compliant
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '48px', marginBottom: '40px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, color: '#0f2040', fontSize: '1.1rem' }}>
                {enrollment?.exam_score}%
              </div>
              <div style={{ color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Final Exam Score</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, color: '#0f2040', fontSize: '1.1rem' }}>
                {completedDate}
              </div>
              <div style={{ color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date Completed</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, color: '#0f2040', fontSize: '1.1rem' }}>
                {certId}
              </div>
              <div style={{ color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Certificate ID</div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '24px', display: 'flex', justifyContent: 'space-around' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ borderTop: '1.5px solid #0f2040', paddingTop: '8px', width: '180px', margin: '0 auto', color: '#0f2040', fontWeight: 600, fontSize: '0.85rem' }}>
                Maurice Ndole
              </div>
              <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Director, NMG Enterprises</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ borderTop: '1.5px solid #0f2040', paddingTop: '8px', width: '180px', margin: '0 auto', color: '#0f2040', fontWeight: 600, fontSize: '0.85rem' }}>
                NMG Enterprises
              </div>
              <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>TVS License Pending</div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { margin: 0; padding: 0; background: white; }
          #certificate { box-shadow: none; margin: 0 auto; }
        }
      `}</style>
    </div>
  )
}
