import { createClient } from '@supabase/supabase-js'

export type Listing = {
  id: string
  slug: string
  title: string
  location: string
  price: string
  price_value: number | null
  image_url: string
  image_urls: string[]
  thumbnail_urls: string[]
  main_image_index: number
  description: string
  created_at: string
  bedrooms:             number | null
  bathrooms:            number | null
  floor_area:           number | null
  lot_area:             number | null
  property_type:        string | null
  region:               string | null
  features:             string[]
  status:               string | null
  monthly_amortization: string | null
  pagibig_eligible:     boolean
}

// Columns for card/grid views — omits heavy fields (features, lot_area, etc.)
export const CARD_COLUMNS = 'id,slug,title,location,price,price_value,thumbnail_urls,image_urls,main_image_index,image_url,status,property_type,bedrooms,bathrooms,floor_area,description'

// Server-side public reader. Uses the anon key (no cookies) so it works in
// Server Components, generateMetadata, and sitemap generation. Listings are
// world-readable via the "Public read listings" RLS policy.
function publicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  )
}

export type ListingFilters = {
  search?:   string
  type?:     string
  region?:   string
  status?:   string
  bedrooms?: number   // ≥5 → gte query; <5 → eq query
  minPrice?: number
  maxPrice?: number
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function applyFilters(q: any, f: ListingFilters): any {
  const s = f.search?.trim()
  if (s) q = q.or(`title.ilike.%${s}%,location.ilike.%${s}%,property_type.ilike.%${s}%,region.ilike.%${s}%,description.ilike.%${s}%`)
  if (f.type)     q = q.eq('property_type', f.type)
  if (f.region)   q = q.eq('region', f.region)
  if (f.status)   q = q.eq('status', f.status)
  if (f.bedrooms) q = f.bedrooms >= 5 ? q.gte('bedrooms', f.bedrooms) : q.eq('bedrooms', f.bedrooms)
  if (f.minPrice != null) q = q.gte('price_value', f.minPrice)
  if (f.maxPrice != null) q = q.lte('price_value', f.maxPrice)
  return q
}

export async function getListings(
  opts?: ListingFilters & { limit?: number; offset?: number; select?: string }
): Promise<Listing[]> {
  const supabase = publicClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query: any = supabase.from('listings').select(opts?.select ?? '*').order('created_at', { ascending: false })
  query = applyFilters(query, opts ?? {})
  if (opts?.offset != null && opts?.limit) {
    query = query.range(opts.offset, opts.offset + opts.limit - 1)
  } else if (opts?.limit) {
    query = query.limit(opts.limit)
  }
  const { data, error } = await query
  if (error) { console.error('getListings error:', error.message); return [] }
  return (data ?? []) as Listing[]
}

export async function getListingsCount(opts?: ListingFilters): Promise<number> {
  const supabase = publicClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query: any = supabase.from('listings').select('*', { count: 'exact', head: true })
  query = applyFilters(query, opts ?? {})
  const { count, error } = await query
  if (error) { console.error('getListingsCount error:', error.message); return 0 }
  return count ?? 0
}

export async function getListingBySlug(slug: string): Promise<Listing | null> {
  const supabase = publicClient()
  const { data, error } = await supabase.from('listings').select('*').eq('slug', slug).maybeSingle()
  if (error) { console.error('getListingBySlug error:', error.message); return null }
  return (data as Listing) ?? null
}

export async function getAllSlugs(): Promise<{ slug: string; created_at: string }[]> {
  const supabase = publicClient()
  const { data, error } = await supabase
    .from('listings')
    .select('slug,created_at')
    .not('slug', 'is', null)
    .limit(1000)
  if (error) { console.error('getAllSlugs error:', error.message); return [] }
  return (data ?? []) as { slug: string; created_at: string }[]
}

// ─── Image helpers (shared across card, grid, detail) ────────────────────────
export function getCardImage(l: Listing): string {
  if (l.thumbnail_urls?.length) return l.thumbnail_urls[l.main_image_index ?? 0] ?? l.thumbnail_urls[0]
  if (l.image_urls?.length)     return l.image_urls[l.main_image_index ?? 0] ?? l.image_urls[0]
  return l.image_url ?? ''
}
export function getFullImages(l: Listing): string[] {
  if (l.image_urls?.length) return l.image_urls
  if (l.image_url) return [l.image_url]
  return []
}
export function getThumbImages(l: Listing): string[] {
  if (l.thumbnail_urls?.length) return l.thumbnail_urls
  return getFullImages(l)
}
export function getMainImage(l: Listing): string {
  const full = getFullImages(l)
  return full[l.main_image_index ?? 0] ?? full[0] ?? l.image_url ?? ''
}

// Slug generator for new listings (admin). Unique via short random suffix.
export function makeSlug(title: string): string {
  const base = title.toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
  const suffix = Math.random().toString(36).slice(2, 8)
  return `${base || 'property'}-${suffix}`
}
