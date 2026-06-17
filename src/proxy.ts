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

  // Security headers (CSP, HSTS, X-Frame-Options, …) are set globally in
  // next.config.ts so they also cover static assets the matcher below excludes.
  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)).*)',
  ],
}
