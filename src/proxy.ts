import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const { pathname } = request.nextUrl

  // Allowlisted admin UIDs — add the real Supabase UID(s) here.
  // Keeping the env var optional: if unset, any authenticated user passes.
  const ALLOWED_UIDS = process.env.ADMIN_ALLOWED_UIDS
    ? process.env.ADMIN_ALLOWED_UIDS.split(',').map(s => s.trim()).filter(Boolean)
    : []

  const isAllowedAdmin = (u: typeof user) => {
    if (!u) return false
    if (ALLOWED_UIDS.length === 0) return false // deny all if env var not configured
    return ALLOWED_UIDS.includes(u.id)
  }

  // Protect all /admin/* except the login page itself
  if (pathname.startsWith('/admin') && pathname !== '/admin') {
    if (!isAllowedAdmin(user)) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }

  // Already logged in (and allowed) → skip login page
  if (pathname === '/admin' && isAllowedAdmin(user)) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  // ── Security headers on every response ────────────────────────────────────
  supabaseResponse.headers.set('X-Frame-Options', 'DENY')
  supabaseResponse.headers.set('X-Content-Type-Options', 'nosniff')
  supabaseResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  supabaseResponse.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  supabaseResponse.headers.set(
    'Strict-Transport-Security',
    'max-age=63072000; includeSubDomains; preload'
  )
  // 'unsafe-eval' is only needed by the dev server (HMR); never ship it to production.
  const scriptSrc =
    process.env.NODE_ENV === 'development'
      ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
      : "script-src 'self' 'unsafe-inline'"
  supabaseResponse.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      scriptSrc,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://*.supabase.co",
      "media-src 'self' https://*.supabase.co",
      "connect-src 'self' https://*.supabase.co https://api.resend.com https://va.vercel-scripts.com https://vitals.vercel-insights.com",
      "font-src 'self'",
      "frame-ancestors 'none'",
    ].join('; ')
  )

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)).*)',
  ],
}
