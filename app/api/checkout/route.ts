import { NextRequest, NextResponse } from 'next/server'
import { stripe, COURSE_PRICE, COURSE_NAME } from '@/lib/stripe'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.clearpassdrive.com'

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: COURSE_NAME },
            unit_amount: COURSE_PRICE,
          },
          quantity: 1,
        },
      ],
      metadata: { user_id: user.id, user_email: user.email || '' },
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout`,
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (err: any) {
    console.error('Stripe checkout error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
