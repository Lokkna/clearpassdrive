# ClearPass Drive — California Traffic School

NMG Enterprises · DMV License #E1393

## Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Database & Auth:** Supabase
- **Payments:** Stripe
- **Email:** Resend
- **Hosting:** Vercel

## Environment Variables (already set in Vercel)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `RESEND_API_KEY`
- `NEXT_PUBLIC_BASE_URL` → set to `https://www.clearpassdrive.com`

## Setup Steps
1. Run `supabase-schema.sql` in Supabase SQL editor
2. Add `NEXT_PUBLIC_BASE_URL=https://www.clearpassdrive.com` to Vercel env vars
3. Push this repo to `Lokkna/clearpassdrive` main branch
4. Vercel auto-deploys

## User Flow
1. Landing page → Register → Checkout (Stripe $24.95)
2. Payment success → Course (10 chapters, progress saved)
3. All chapters complete → Final exam (20 questions, 70% to pass)
4. Pass → Certificate (print/download PDF)
