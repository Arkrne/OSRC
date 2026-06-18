import { createClient } from '@supabase/supabase-js'

export type AuditAction =
  | 'upload_image'
  | 'delete_listing'
  | 'create_promo'
  | 'update_promo'
  | 'delete_promo'

export function logAdminAction(
  action: AuditAction,
  actorId: string,
  meta?: Record<string, unknown>,
): void {
  const rawKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const serviceKey = rawKey?.startsWith('eyJ') ? rawKey : undefined
  if (!serviceKey) return

  const client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceKey,
    { auth: { autoRefreshToken: false, persistSession: false } },
  )

  void client
    .from('admin_audit_log')
    .insert({ actor_id: actorId, action, meta: meta ?? null })
    .then(({ error }) => {
      if (error) {
        console.error(JSON.stringify({
          ts: new Date().toISOString(),
          level: 'error',
          event: 'audit_log_failed',
          message: error.message,
        }))
      }
    })
}
