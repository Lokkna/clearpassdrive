import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// ─── Maintenance mode ─────────────────────────────────────────────────────────
// Flip MAINTENANCE_MODE=true in Vercel Environment Variables to activate.
// Anyone with the bypass cookie (set by visiting /?access=YOUR_BYPASS_KEY)
// gets through. The bypass key is set via the MAINTENANCE_BYPASS_KEY env var.
// To give someone access: send them https://www.clearpassdrive.com/?access=KEY
// They click it once, get a cookie, and can browse freely until they clear it.
// ─────────────────────────────────────────────────────────────────────────────

const BYPASS_COOKIE = 'cpd_access'

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl

  // ── Maintenance mode check ──────────────────────────────────────────────
  const maintenanceOn = process.env.MAINTENANCE_MODE === 'true'

  if (maintenanceOn) {
    // Allow the maintenance page itself through (avoid redirect loop)
    if (pathname === '/maintenance') {
      return NextResponse.next()
    }

    // Allow static assets and API routes through (needed for the page to render)
    if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.startsWith('/favicon')) {
      return NextResponse.next()
    }

    const bypassKey = process.env.MAINTENANCE_BYPASS_KEY || ''

    // If visitor is hitting the site with ?access=KEY, set the bypass cookie
    // and redirect to the same page without the query param (clean URL)
    const accessParam = searchParams.get('access')
    if (bypassKey && accessParam === bypassKey) {
      const url = request.nextUrl.clone()
      url.searchParams.delete('access')
      const res = NextResponse.redirect(url)
      res.cookies.set(BYPASS_COOKIE, bypassKey, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 90, // 90 days
        path: '/',
      })
      return res
    }

    // Check if visitor already has the bypass cookie
    const bypassCookie = request.cookies.get(BYPASS_COOKIE)?.value
    if (bypassKey && bypassCookie === bypassKey) {
      // Bypassed — fall through to normal site
    } else {
      // No bypass — redirect to maintenance page
      const url = request.nextUrl.clone()
      url.pathname = '/maintenance'
      return NextResponse.redirect(url)
    }
  }

  // ── Normal Supabase session refresh ────────────────────────────────────
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  await supabase.auth.getUser()
  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
