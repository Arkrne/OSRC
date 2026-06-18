import { createClient as createServerSupabase } from '@/lib/supabase/server'
import { createClient as createAdminSupabase } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { strip } from '@/lib/validation'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function adminClient() {
  const rawKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const serviceKey = rawKey?.startsWith('eyJ') ? rawKey : undefined
  if (!serviceKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not configured')
  return createAdminSupabase(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

async function enforceAdmin(): Promise<{ error: NextResponse } | { userId: string }> {
  const auth = await createServerSupabase()
  const { data: { user } } = await auth.auth.getUser()
  if (!user) return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  const allowedUids = process.env.ADMIN_ALLOWED_UIDS?.split(',').map(s => s.trim()).filter(Boolean) ?? []
  if (allowedUids.length === 0 || !allowedUids.includes(user.id)) {
    return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) }
  }
  return { userId: user.id }
}

// POST /api/promos — create
export async function POST(request: NextRequest) {
  const auth = await enforceAdmin()
  if ('error' in auth) return auth.error

  const body = await request.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })

  const title       = strip(body.title, 200)
  const description = strip(body.description, 2000)
  const badge       = strip(body.badge, 50) || null
  const valid_until = typeof body.valid_until === 'string' && body.valid_until ? body.valid_until : null

  if (!title || !description) {
    return NextResponse.json({ error: 'Title and description are required' }, { status: 400 })
  }

  const { data, error } = await adminClient().from('promos').insert({ title, description, badge, valid_until }).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// PATCH /api/promos — update
export async function PATCH(request: NextRequest) {
  const auth = await enforceAdmin()
  if ('error' in auth) return auth.error

  const body = await request.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })

  const id = typeof body.id === 'string' ? body.id : ''
  if (!UUID_RE.test(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

  const title       = strip(body.title, 200)
  const description = strip(body.description, 2000)
  const badge       = strip(body.badge, 50) || null
  const valid_until = typeof body.valid_until === 'string' && body.valid_until ? body.valid_until : null

  if (!title || !description) {
    return NextResponse.json({ error: 'Title and description are required' }, { status: 400 })
  }

  const { data, error } = await adminClient().from('promos').update({ title, description, badge, valid_until }).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// DELETE /api/promos — delete
export async function DELETE(request: NextRequest) {
  const auth = await enforceAdmin()
  if ('error' in auth) return auth.error

  const body = await request.json().catch(() => null)
  const id = typeof body?.id === 'string' ? body.id : ''
  if (!UUID_RE.test(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

  const { error } = await adminClient().from('promos').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
