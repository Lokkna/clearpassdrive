export default function MaintenancePage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f2040', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', textAlign: 'center', fontFamily: 'Outfit, sans-serif' }}>
      <div style={{ marginBottom: '32px' }}>
        <div style={{ fontFamily: 'Sora, sans-serif', color: '#f59e0b', fontWeight: 800, fontSize: '1.6rem', marginBottom: '4px' }}>
          ClearPass Drive
        </div>
        <div style={{ color: '#64748b', fontSize: '0.85rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          California Traffic School
        </div>
      </div>

      <div style={{ backgroundColor: '#1e3a6e', borderRadius: '16px', padding: '48px 40px', maxWidth: '480px', width: '100%', border: '1px solid #2d4f8e' }}>
        <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🚧</div>
        <h1 style={{ fontFamily: 'Sora, sans-serif', color: '#ffffff', fontSize: '1.6rem', fontWeight: 700, marginBottom: '16px', lineHeight: 1.3 }}>
          We're getting ready
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '32px' }}>
          ClearPass Drive is currently undergoing final preparation before opening to the public. We'll be live soon — check back shortly.
        </p>
        <div style={{ backgroundColor: '#0f2040', borderRadius: '10px', padding: '16px 20px', border: '1px solid #1e3a6e' }}>
          <p style={{ color: '#64748b', fontSize: '0.8rem', margin: 0, lineHeight: 1.6 }}>
            If you received a private access link, please use that link to access the site.
          </p>
        </div>
      </div>

      <p style={{ color: '#334155', fontSize: '0.75rem', marginTop: '40px' }}>
        © {new Date().getFullYear()} Ndole Media Group · DMV License Pending
      </p>
    </div>
  )
}
