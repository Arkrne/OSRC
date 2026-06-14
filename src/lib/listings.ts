import { createClient } from '@supabase/supabase-js'

export type Listing = {
  id: string
  slug: string
  title: string
  location: string
  price: string
  image_url: string
  image_urls: string[]
  thumbnail_urls: string[]
  main_image_index: number
  description: string
  created_at: string
}

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

export async function getListings(limit?: number): Promise<Listing[]> {
  const supabase = publicClient()
  let query = supabase.from('listings').select('*').order('created_at', { ascending: false })
  if (limit) query = query.limit(limit)
  const { data, error } = await query
  if (error) { console.error('getListings error:', error.message); return [] }
  return (data ?? []) as Listing[]
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

// Full-resolution main image — used for OpenGraph / structured data.
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
