import 'server-only'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { unstable_cache } from 'next/cache'

/* ────────────────────────────────────────────────────────────────────────────
   Admin dashboard metrics.

   Gathers everything the dashboard renders, kept separate from presentation so
   the page stays a thin view. Server-only — uses the service-role key, which is
   safe here because /admin/* is gated to allowlisted admins by src/proxy.ts.
   ──────────────────────────────────────────────────────────────────────────── */

const QUOTA_GB    = Number(process.env.STORAGE_QUOTA_GB ?? '1') || 1
const QUOTA_BYTES = QUOTA_GB * 1024 ** 3
const PAGE        = 1000          // Supabase Storage list page size
const MAX_PAGES   = 50            // safety cap: never list more than 50k entries

function adminClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const raw = process.env.SUPABASE_SERVICE_ROLE_KEY
  // Treat the placeholder / anything that isn't a real JWT as "not configured".
  const key = raw?.startsWith('eyJ') ? raw : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  return createClient(url, key, { auth: { persistSession: false } })
}

// ─── Storage ─────────────────────────────────────────────────────────────────

export type StorageStats = {
  ok: boolean
  usedBytes: number
  quotaBytes: number
  fileCount: number
  capped: boolean   // true if the page cap was hit (usage is a lower bound)
}

type Budget = { pages: number; capped: boolean }

/** Recursively sum file sizes under a prefix. Folders are entries with id===null. */
async function sumPrefix(
  sb: SupabaseClient,
  bucket: string,
  prefix: string,
  budget: Budget,
): Promise<{ bytes: number; count: number }> {
  let bytes = 0
  let count = 0
  let offset = 0

  for (;;) {
    if (budget.pages >= MAX_PAGES) { budget.capped = true; break }
    budget.pages++

    const { data, error } = await sb.storage.from(bucket).list(prefix, {
      limit: PAGE,
      offset,
      sortBy: { column: 'name', order: 'asc' },
    })
    if (error || !data) break

    for (const obj of data) {
      const isFolder = obj.id === null || obj.metadata == null
      if (isFolder) {
        const sub = prefix ? `${prefix}/${obj.name}` : obj.name
        const r = await sumPrefix(sb, bucket, sub, budget)
        bytes += r.bytes
        count += r.count
      } else {
        const size = (obj.metadata as { size?: number } | null)?.size
        if (typeof size === 'number') { bytes += size; count++ }
      }
    }

    if (data.length < PAGE) break
    offset += PAGE
  }

  return { bytes, count }
}

async function computeStorageStats(): Promise<StorageStats> {
  try {
    const sb = adminClient()
    const { data: buckets, error } = await sb.storage.listBuckets()

    // Fall back to the known property bucket if listBuckets is unavailable.
    const names =
      !error && buckets?.length ? buckets.map(b => b.name) : ['property-images']

    const budget: Budget = { pages: 0, capped: false }
    let usedBytes = 0
    let fileCount = 0
    for (const name of names) {
      const r = await sumPrefix(sb, name, '', budget)
      usedBytes += r.bytes
      fileCount += r.count
    }

    return { ok: true, usedBytes, quotaBytes: QUOTA_BYTES, fileCount, capped: budget.capped }
  } catch {
    return { ok: false, usedBytes: 0, quotaBytes: QUOTA_BYTES, fileCount: 0, capped: false }
  }
}

// Cache storage usage for 5 minutes — listing the bucket on every refresh is
// wasteful and the number barely moves between uploads.
export const getStorageStats = unstable_cache(
  computeStorageStats,
  ['admin-storage-stats'],
  { revalidate: 300, tags: ['admin-storage'] },
)

// ─── Content ─────────────────────────────────────────────────────────────────

export type ContentStats = {
  listings: number
  featured: number
  added30d: number
  portfolioValue: number
  byStatus: { status: string; count: number }[]
  promos: number
  expiring: number
  expired: number
  alerts: {
    noPhotos: AlertGroup
    noPrice: AlertGroup
    noDescription: AlertGroup
    expiredPromos: number
  }
}

/** Total count plus a small sample of offending listing titles for display. */
export type AlertGroup = { count: number; sample: string[] }

const ALERT_SAMPLE = 5   // how many offending titles to surface per alert

/** Numeric value of a listing: prefer the price_value column, else parse the
    price string ("₱8,500,000" → 8500000). Returns 0 when neither is usable. */
function listingValue(price_value: number | null, price: string | null): number {
  if (typeof price_value === 'number' && price_value > 0) return price_value
  const n = parseInt((price ?? '').replace(/[^0-9]/g, ''), 10)
  return Number.isNaN(n) ? 0 : n
}

type ListingRow = {
  title: string | null
  price: string | null
  price_value: number | null
  status: string | null
  featured: boolean | null
  created_at: string
  image_url: string | null
  image_urls: string[] | null
  thumbnail_urls: string[] | null
  description: string | null
}

export async function getContentStats(): Promise<ContentStats> {
  const sb = adminClient()
  const now = Date.now()
  const today = new Date(now).toISOString().split('T')[0]
  const in7   = new Date(now + 7 * 86_400_000).toISOString().split('T')[0]
  const cutoff30 = now - 30 * 86_400_000

  const [{ data: listings }, { data: promos }] = await Promise.all([
    sb.from('listings').select(
      'title,price,price_value,status,featured,created_at,image_url,image_urls,thumbnail_urls,description',
    ),
    sb.from('promos').select('valid_until'),
  ])

  const rows = (listings ?? []) as ListingRow[]

  let featured = 0
  let added30d = 0
  let portfolioValue = 0
  const statusCounts = new Map<string, number>()
  const noPhotos: string[] = []
  const noPrice: string[] = []
  const noDescription: string[] = []

  for (const l of rows) {
    if (l.featured) featured++
    if (l.created_at && Date.parse(l.created_at) >= cutoff30) added30d++
    portfolioValue += listingValue(l.price_value, l.price)

    const status = l.status?.trim() || 'Unspecified'
    statusCounts.set(status, (statusCounts.get(status) ?? 0) + 1)

    const name = l.title?.trim() || 'Untitled'
    const hasPhoto = !!(l.image_urls?.length || l.thumbnail_urls?.length || l.image_url)
    if (!hasPhoto) noPhotos.push(name)
    if (listingValue(l.price_value, l.price) <= 0) noPrice.push(name)
    if (!l.description?.trim()) noDescription.push(name)
  }

  const byStatus = [...statusCounts.entries()]
    .map(([status, count]) => ({ status, count }))
    .sort((a, b) => b.count - a.count)

  const promoDates = (promos ?? []) as { valid_until: string | null }[]
  let expiring = 0
  let expired = 0
  for (const p of promoDates) {
    const v = p.valid_until
    if (!v) continue
    if (v < today) expired++
    else if (v <= in7) expiring++
  }

  return {
    listings: rows.length,
    featured,
    added30d,
    portfolioValue,
    byStatus,
    promos: promoDates.length,
    expiring,
    expired,
    alerts: {
      noPhotos: { count: noPhotos.length, sample: noPhotos.slice(0, ALERT_SAMPLE) },
      noPrice: { count: noPrice.length, sample: noPrice.slice(0, ALERT_SAMPLE) },
      noDescription: { count: noDescription.length, sample: noDescription.slice(0, ALERT_SAMPLE) },
      expiredPromos: expired,
    },
  }
}

export type DashboardStats = { storage: StorageStats; content: ContentStats }

export async function getDashboardStats(): Promise<DashboardStats> {
  const [storage, content] = await Promise.all([getStorageStats(), getContentStats()])
  return { storage, content }
}
