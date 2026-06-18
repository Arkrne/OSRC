import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

describe('logAdminAction', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('does not throw when SUPABASE_SERVICE_ROLE_KEY is absent', async () => {
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', '')
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://example.supabase.co')

    const { logAdminAction } = await import('./audit-log')

    expect(() => logAdminAction('delete_listing', 'uid-123', { listingId: 'abc' })).not.toThrow()
  })

  it('does not throw when SUPABASE_SERVICE_ROLE_KEY is a placeholder', async () => {
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'placeholder-not-a-jwt')
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://example.supabase.co')

    const { logAdminAction } = await import('./audit-log')

    expect(() => logAdminAction('upload_image', 'uid-456', { fullName: 'foo.jpg' })).not.toThrow()
  })
})
