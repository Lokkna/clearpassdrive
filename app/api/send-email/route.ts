import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { type, email, score } = await req.json()

    if (type === 'passed') {
      await resend.emails.send({
        from: 'ClearPass Drive <noreply@clearpassdrive.com>',
        to: email,
        subject: '🏆 You passed! Your certificate is ready — ClearPass Drive',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto;">
            <div style="background: #0f2040; padding: 32px 40px; text-align: center;">
              <h1 style="color: #f59e0b; font-size: 1.5rem; margin: 0;">ClearPass Drive</h1>
              <p style="color: #94a3b8; margin: 4px 0 0; font-size: 0.85rem;">California Traffic Violator School · License License Pending</p>
            </div>
            <div style="padding: 40px;">
              <h2 style="color: #16a34a; margin-top: 0;">🏆 You passed the final exam!</h2>
              <p style="color: #475569; line-height: 1.6;">Congratulations — you scored <strong>${score}%</strong> on the California Traffic School final exam.</p>
              <p style="color: #475569; line-height: 1.6;">Your completion certificate is ready to download. Submit it to your court before your deadline to mask the violation point from your driving record.</p>
              <a href="https://www.clearpassdrive.com/certificate" style="display: inline-block; background: #16a34a; color: #ffffff; font-weight: 700; padding: 12px 28px; border-radius: 8px; text-decoration: none; margin-top: 8px;">Download Certificate →</a>
            </div>
            <div style="padding: 24px 40px; border-top: 1px solid #e2e8f0; color: #94a3b8; font-size: 0.8rem;">
              <p style="margin: 0;">NMG Enterprises · California DMV Licensed TVS License Pending</p>
              <p style="margin: 4px 0 0;">Questions? Email support@clearpassdrive.com</p>
            </div>
          </div>
        `,
      })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Email error:', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
