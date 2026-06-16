'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const CALIFORNIA_COURTS = [
  'Alameda County Superior Court','Alpine County Superior Court','Amador County Superior Court',
  'Butte County Superior Court','Calaveras County Superior Court','Colusa County Superior Court',
  'Contra Costa County Superior Court','Del Norte County Superior Court','El Dorado County Superior Court',
  'Fresno County Superior Court','Glenn County Superior Court','Humboldt County Superior Court',
  'Imperial County Superior Court','Inyo County Superior Court','Kern County Superior Court',
  'Kings County Superior Court','Lake County Superior Court','Lassen County Superior Court',
  'Los Angeles County Superior Court','Madera County Superior Court','Marin County Superior Court',
  'Mariposa County Superior Court','Mendocino County Superior Court','Merced County Superior Court',
  'Modoc County Superior Court','Mono County Superior Court','Monterey County Superior Court',
  'Napa County Superior Court','Nevada County Superior Court','Orange County Superior Court',
  'Placer County Superior Court','Plumas County Superior Court','Riverside County Superior Court',
  'Sacramento County Superior Court','San Benito County Superior Court','San Bernardino County Superior Court',
  'San Diego County Superior Court','San Francisco County Superior Court','San Joaquin County Superior Court',
  'San Luis Obispo County Superior Court','San Mateo County Superior Court','Santa Barbara County Superior Court',
  'Santa Clara County Superior Court','Santa Cruz County Superior Court','Shasta County Superior Court',
  'Sierra County Superior Court','Siskiyou County Superior Court','Solano County Superior Court',
  'Sonoma County Superior Court','Stanislaus County Superior Court','Sutter County Superior Court',
  'Tehama County Superior Court','Trinity County Superior Court','Tulare County Superior Court',
  'Tuolumne County Superior Court','Ventura County Superior Court','Yolo County Superior Court',
  'Yuba County Superior Court',
]

export default function IntakePage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [checkingAuth, setCheckingAuth] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  const [citationNumber, setCitationNumber] = useState('')
  const [violationDate, setViolationDate] = useState('')
  const [court, setCourt] = useState('')
  const [licenseNumber, setLicenseNumber] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [licenseState, setLicenseState] = useState('CA')
  const [hasCommercialLicense, setHasCommercialLicense] = useState('')
  const [violationInCommercialVehicle, setViolationInCommercialVehicle] = useState('')
  const [priorTrafficSchool18Months, setPriorTrafficSchool18Months] = useState('')

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/register'); return }
      const { data: enrollment } = await supabase.from('enrollments').select('paid').eq('user_id', user.id).single()
      if (enrollment?.paid) { router.push('/course'); return }
      setCheckingAuth(false)
    }
    checkAuth()
  }, [])

  async function handleSubmit() {
    if (!citationNumber || !violationDate || !court || !licenseNumber || !dateOfBirth) {
      setError('Please fill in all required fields.')
      return
    }
    if (!hasCommercialLicense || !violationInCommercialVehicle || !priorTrafficSchool18Months) {
      setError('Please answer all eligibility questions.')
      return
    }
    if (hasCommercialLicense === 'yes' && violationInCommercialVehicle === 'yes') {
      setError('You are not eligible. Commercial license holders cannot use traffic school for violations that occurred while operating a commercial vehicle.')
      return
    }
    if (priorTrafficSchool18Months === 'yes') {
      setError('You are not eligible. California law only allows traffic school once every 18 months per violation date.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/register'); return }

      const { error: insertError } = await supabase.from('citations').upsert({
        user_id: user.id,
        citation_number: citationNumber.trim().toUpperCase(),
        violation_date: violationDate,
        court_name: court,
        driver_license_number: licenseNumber.trim().toUpperCase(),
        driver_license_state: licenseState,
        date_of_birth: dateOfBirth,
        has_commercial_license: hasCommercialLicense === 'yes',
        violation_in_commercial_vehicle: violationInCommercialVehicle === 'yes',
        prior_traffic_school_18_months: priorTrafficSchool18Months === 'yes',
        ol767_completed: true,
        ol767_completed_at: new Date().toISOString(),
      }, { onConflict: 'user_id' })

      if (insertError) throw new Error(insertError.message)
      router.push('/checkout')
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  if (checkingAuth) return null

  const inputStyle = { width: '100%', border: '1.5px solid #e2e8f0', borderRadius: '8px', padding: '10px 14px', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' as const }
  const labelStyle = { display: 'block', color: '#374151', fontWeight: 500, fontSize: '0.85rem', marginBottom: '6px' }

  const YesNoToggle = ({ value, onChange }: { value: string, onChange: (v: string) => void }) => (
    <div style={{ display: 'flex', gap: '12px' }}>
      {['yes', 'no'].map(val => (
        <button key={val} onClick={() => onChange(val)} style={{
          flex: 1, padding: '10px', borderRadius: '8px', border: '1.5px solid',
          borderColor: value === val ? '#0f2040' : '#e2e8f0',
          backgroundColor: value === val ? '#0f2040' : 'white',
          color: value === val ? 'white' : '#374151',
          fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer',
        }}>
          {val === 'yes' ? 'Yes' : 'No'}
        </button>
      ))}
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#0f2040' }}>
      <nav className="px-6 py-4">
        <Link href="/" style={{ fontFamily: 'Sora, sans-serif', color: '#f59e0b', fontWeight: 700, fontSize: '1.1rem' }}>
          ← ClearPass Drive
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '40px', width: '100%', maxWidth: '520px' }}>

          <h1 style={{ fontFamily: 'Sora, sans-serif', color: '#0f2040', fontSize: '1.6rem', fontWeight: 700, marginBottom: '8px' }}>
            Citation Information
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '24px' }}>
            Required to report your completion to the DMV and the court. This information must match your ticket exactly.
          </p>

          {/* Progress steps */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '28px' }}>
            {['Account', 'Citation', 'Payment', 'Course'].map((step, i) => (
              <div key={step} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '26px', height: '26px', borderRadius: '50%', backgroundColor: i === 1 ? '#f59e0b' : i < 1 ? '#0f2040' : '#e2e8f0', color: i <= 1 ? 'white' : '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 700 }}>
                  {i < 1 ? '✓' : i + 1}
                </div>
                <span style={{ fontSize: '0.72rem', color: i === 1 ? '#0f2040' : '#94a3b8', fontWeight: i === 1 ? 600 : 400 }}>{step}</span>
                {i < 3 && <div style={{ width: '16px', height: '1px', backgroundColor: '#e2e8f0' }} />}
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-4">

            <div>
              <label style={labelStyle}>Citation / Ticket Number <span style={{ color: '#dc2626' }}>*</span></label>
              <input type="text" value={citationNumber} onChange={e => setCitationNumber(e.target.value)} placeholder="e.g. A1234567" style={inputStyle} />
              <p style={{ color: '#94a3b8', fontSize: '0.78rem', marginTop: '4px' }}>Found at the top of your traffic citation</p>
            </div>

            <div>
              <label style={labelStyle}>Violation Date <span style={{ color: '#dc2626' }}>*</span></label>
              <input type="date" value={violationDate} onChange={e => setViolationDate(e.target.value)} max={new Date().toISOString().split('T')[0]} style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>Court with Jurisdiction <span style={{ color: '#dc2626' }}>*</span></label>
              <select value={court} onChange={e => setCourt(e.target.value)} style={{ ...inputStyle, backgroundColor: 'white' }}>
                <option value="">Select court...</option>
                {CALIFORNIA_COURTS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <p style={{ color: '#94a3b8', fontSize: '0.78rem', marginTop: '4px' }}>Found on your citation or notice from the court</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
              <div>
                <label style={labelStyle}>Driver License Number <span style={{ color: '#dc2626' }}>*</span></label>
                <input type="text" value={licenseNumber} onChange={e => setLicenseNumber(e.target.value)} placeholder="e.g. A1234567" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>State</label>
                <select value={licenseState} onChange={e => setLicenseState(e.target.value)} style={{ ...inputStyle, backgroundColor: 'white' }}>
                  <option value="CA">CA</option>
                  <option value="AZ">AZ</option>
                  <option value="NV">NV</option>
                  <option value="OR">OR</option>
                  <option value="WA">WA</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label style={labelStyle}>Date of Birth <span style={{ color: '#dc2626' }}>*</span></label>
              <input type="date" value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)} max={new Date(Date.now() - 16 * 365.25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]} style={inputStyle} />
            </div>

            {/* OL 767 */}
            <div style={{ borderTop: '1.5px solid #e2e8f0', paddingTop: '24px', marginTop: '8px' }}>
              <h2 style={{ fontFamily: 'Sora, sans-serif', color: '#0f2040', fontSize: '1rem', fontWeight: 700, marginBottom: '4px' }}>
                Eligibility Verification (OL 767)
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.82rem', marginBottom: '20px', lineHeight: '1.5' }}>
                California law requires you to certify your eligibility. Providing false information is a violation of California law.
              </p>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ ...labelStyle, marginBottom: '10px' }}>Do you hold a commercial driver&apos;s license (CDL)? <span style={{ color: '#dc2626' }}>*</span></label>
                <YesNoToggle value={hasCommercialLicense} onChange={setHasCommercialLicense} />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ ...labelStyle, marginBottom: '10px' }}>Did the violation occur while operating a commercial vehicle? <span style={{ color: '#dc2626' }}>*</span></label>
                <YesNoToggle value={violationInCommercialVehicle} onChange={setViolationInCommercialVehicle} />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ ...labelStyle, marginBottom: '10px' }}>Have you completed traffic school within the last 18 months? <span style={{ color: '#dc2626' }}>*</span></label>
                <YesNoToggle value={priorTrafficSchool18Months} onChange={setPriorTrafficSchool18Months} />
              </div>
            </div>

            <div style={{ backgroundColor: '#f8fafc', borderRadius: '8px', padding: '14px', fontSize: '0.8rem', color: '#475569', lineHeight: '1.6' }}>
              By continuing, I certify under penalty of perjury that the information provided is true and correct, and that I am eligible to attend traffic violator school for the cited violation.
            </div>

            {error && (
              <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '12px 14px', color: '#dc2626', fontSize: '0.85rem' }}>
                {error}
              </div>
            )}

            <button onClick={handleSubmit} disabled={loading} style={{ backgroundColor: loading ? '#94a3b8' : '#f59e0b', color: '#0f2040', fontWeight: 700, padding: '14px', borderRadius: '10px', fontSize: '1rem', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', width: '100%' }}>
              {loading ? 'Saving...' : 'Continue to Payment →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
