import { createClient as createServerSupabase } from '@/lib/supabase/server'
import { createClient as createAdminSupabase } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  // ── Auth guard: only logged-in admins may upload ──────────────────────────
  // Uses the cookie-based session (same mechanism that protects /admin/*).
  const auth = await createServerSupabase()
  const { data: { user } } = await auth.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  // Fail closed: if the allowlist is unconfigured, deny everyone (matches proxy.ts).
  const allowedUids = process.env.ADMIN_ALLOWED_UIDS?.split(',').map(s => s.trim()).filter(Boolean) ?? []
  if (allowedUids.length === 0 || !allowedUids.includes(user.id)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // ── Storage client ────────────────────────────────────────────────────────
  // Prefer the service-role key: it runs as a trusted server identity and
  // bypasses Storage RLS entirely. This route is already gated by the auth
  // check above, so only authenticated admins ever reach this code. If the
  // service-role key is not configured, fall back to the user's own session
  // (subject to Storage RLS policies).
  const rawKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  // Treat the placeholder / anything that isn't a real JWT as "not configured".
  const serviceKey = rawKey?.startsWith('eyJ') ? rawKey : undefined
  const storage = serviceKey
    ? createAdminSupabase(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      })
    : auth

  const formData = await request.formData()
  const fullBlob  = formData.get('full')  as Blob | null
  const thumbBlob = formData.get('thumb') as Blob | null
  const fullName  = formData.get('fullName')  as string | null
  const thumbName = formData.get('thumbName') as string | null

  if (!fullBlob || !thumbBlob || !fullName || !thumbName) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // Reject path-traversal / unexpected storage keys (client-supplied → untrusted).
  const isSafeKey = (k: string) =>
    /^[A-Za-z0-9._\-/]+$/.test(k) && !k.includes('..') && !k.startsWith('/') && k.length <= 200
  if (!isSafeKey(fullName) || !isSafeKey(thumbName)) {
    return NextResponse.json({ error: 'Invalid file name' }, { status: 400 })
  }

  // Only accept images, and cap size to prevent storage/memory exhaustion.
  const MAX_BYTES = 10 * 1024 * 1024 // 10 MB
  if (!fullBlob.type.startsWith('image/') || !thumbBlob.type.startsWith('image/')) {
    return NextResponse.json({ error: 'Only image uploads are allowed' }, { status: 415 })
  }
  if (fullBlob.size > MAX_BYTES || thumbBlob.size > MAX_BYTES) {
    return NextResponse.json({ error: 'File too large (10 MB max)' }, { status: 413 })
  }

  const fullBytes  = Buffer.from(await fullBlob.arrayBuffer())
  const thumbBytes = Buffer.from(await thumbBlob.arrayBuffer())

  const [r1, r2] = await Promise.all([
    storage.storage.from('property-images').upload(fullName,  fullBytes,  { upsert: true, contentType: 'image/jpeg' }),
    storage.storage.from('property-images').upload(thumbName, thumbBytes, { upsert: true, contentType: 'image/jpeg' }),
  ])

  if (r1.error || r2.error) {
    const msg = r1.error?.message ?? r2.error?.message ?? 'Upload error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }

  const fullUrl  = storage.storage.from('property-images').getPublicUrl(fullName).data.publicUrl
  const thumbUrl = storage.storage.from('property-images').getPublicUrl(thumbName).data.publicUrl

  return NextResponse.json({ fullUrl, thumbUrl })
}
