import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json()

    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ success: false, error: 'Payment not confirmed' })
    }

    const userId = session.metadata?.user_id
    const userEmail = session.metadata?.user_email

    if (!userId) {
      return NextResponse.json({ success: false, error: 'No user ID' })
    }

    // Idempotency check — avoid duplicate enrollment rows for the same Stripe session
    const { data: existing } = await supabaseAdmin
      .from('enrollments')
      .select('id')
      .eq('stripe_session_id', sessionId)
      .limit(1)

    if (existing && existing.length > 0) {
      return NextResponse.json({ success: true })
    }

    // Insert new enrollment (per-incident model — one row per payment)
    const { error: enrollError } = await supabaseAdmin
      .from('enrollments')
      .insert({
        user_id: userId,
        paid: true,
        paid_at: new Date().toISOString(),
        stripe_session_id: sessionId,
        amount_paid: 2495,
        progress: {},
        current_chapter: 1,
        exam_passed: false,
        exam_attempts: 0,
      })

    if (enrollError) {
      console.error('Enrollment error:', enrollError)
    }

    // Send confirmation email
    if (userEmail) {
      await resend.emails.send({
        from: 'ClearPass Drive <noreply@clearpassdrive.com>',
        to: userEmail,
        subject: 'You\'re enrolled — ClearPass Drive Traffic School',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; background: #ffffff;">
            <div style="background: #0f2040; padding: 32px 40px; text-align: center;">
              <h1 style="color: #f59e0b; font-size: 1.5rem; margin: 0;">ClearPass Drive</h1>
              <p style="color: #94a3b8; margin: 4px 0 0; font-size: 0.85rem;">California Traffic Violator School · License Pending</p>
            </div>
            <div style="padding: 40px;">
              <h2 style="color: #0f2040; margin-top: 0;">You're enrolled! 🎉</h2>
              <p style="color: #475569; line-height: 1.6;">Your payment of $24.95 has been confirmed. Your course is ready to start.</p>
              <div style="background: #f8fafc; border-radius: 10px; padding: 20px; margin: 24px 0; border: 1px solid #e2e8f0;">
                <p style="margin: 0 0 8px; color: #374151; font-weight: 600;">What's next:</p>
                <ul style="color: #475569; padding-left: 20px; margin: 0; line-height: 1.8;">
                  <li>Complete all 10 chapters at your own pace</li>
                  <li>Pass the 20-question final exam (70% to pass)</li>
                  <li>Download your completion certificate</li>
                  <li>Submit to your court before your deadline</li>
                </ul>
              </div>
              <a href="https://www.clearpassdrive.com/course" style="display: inline-block; background: #f59e0b; color: #0f2040; font-weight: 700; padding: 12px 28px; border-radius: 8px; text-decoration: none;">Start Chapter 1 →</a>
            </div>
            <div style="padding: 24px 40px; border-top: 1px solid #e2e8f0; color: #94a3b8; font-size: 0.8rem;">
              <p style="margin: 0;">Questions? Email us at support@clearpassdrive.com</p>
              <p style="margin: 4px 0 0;">NMG Enterprises · California DMV Licensed TVS License Pending</p>
            </div>
          </div>
        `,
      })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Complete error:', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
