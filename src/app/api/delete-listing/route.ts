import { createClient as createServerSupabase } from '@/lib/supabase/server'
import { createClient as createAdminSupabase } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { reportError } from '@/lib/report-error'
import { makeRatelimit } from '@/lib/ratelimit'
import { getClientIp } from '@/lib/client-ip'

const isRateLimited = makeRatelimit('delete-listing', 10, 60)
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function DELETE(request: NextRequest) {
  // Rate limit: 10 deletes/min per IP
  const ip = getClientIp(request.headers)
  if (await isRateLimited(ip)) {
    return NextResponse.json({ error: 'Too many requests.' }, { status: 429, headers: { 'Retry-After': '60' } })
  }

  // Auth guard
  const auth = await createServerSupabase()
  const { data: { user } } = await auth.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  // Fail closed: if the allowlist is unconfigured, deny everyone (matches proxy.ts).
  const allowedUids = process.env.ADMIN_ALLOWED_UIDS?.split(',').map(s => s.trim()).filter(Boolean) ?? []
  if (allowedUids.length === 0 || !allowedUids.includes(user.id)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json().catch(() => null)
  const id = body?.id as string | undefined
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  if (!UUID_RE.test(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

  // Use service-role key for all DB and storage operations (bypasses RLS)
  const rawKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const serviceKey = rawKey?.startsWith('eyJ') ? rawKey : undefined
  const admin = serviceKey
    ? createAdminSupabase(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      })
    : auth

  // Read image paths before deletion so we can clean storage
  const { data: row } = await admin.from('listings')
    .select('image_urls,thumbnail_urls')
    .eq('id', id)
    .maybeSingle()

  // Delete the DB row
  const { error: dbErr } = await admin.from('listings').delete().eq('id', id)
  if (dbErr) {
    reportError('delete_listing_failed', dbErr, { userId: user.id, listingId: id })
    return NextResponse.json({ error: dbErr.message }, { status: 500 })
  }

  // Clean up storage images (best-effort — don't fail the request if this errors)
  if (row) {
    const allUrls: string[] = [
      ...(row.image_urls      ?? []),
      ...(row.thumbnail_urls  ?? []),
    ]
    const paths = allUrls.flatMap(url => {
      try {
        const after = url.split('/property-images/')[1]
        return after ? [decodeURIComponent(after.split('?')[0])] : []
      } catch { return [] }
    })
    if (paths.length) {
      await admin.storage.from('property-images').remove(paths)
    }
  }

  return NextResponse.json({ ok: true })
}
