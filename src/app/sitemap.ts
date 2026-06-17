import type { MetadataRoute } from 'next'
import { getListingsCount, getSlugPage } from '@/lib/listings'

const BASE = 'https://orangesquarerealty.com.ph'
// URLs per sitemap chunk. Google caps a single sitemap at 50,000 URLs; we keep
// a comfortable margin. Each chunk is served at /sitemap/[id].xml and Next.js
// exposes /sitemap.xml as the sitemap index pointing at every chunk.
const PAGE = 10_000

// Rebuild at most once per hour; new listings appear within 60 minutes.
export const revalidate = 3600

// One sitemap chunk per PAGE listings (always at least one, for static routes).
export async function generateSitemaps(): Promise<{ id: number }[]> {
  const total = await getListingsCount()
  const chunks = Math.max(1, Math.ceil(total / PAGE))
  return Array.from({ length: chunks }, (_, id) => ({ id }))
}

function staticRoutes(): MetadataRoute.Sitemap {
  return [
    { url: BASE,                     lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/properties`,     lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE}/services`,       lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/about`,          lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/contact`,        lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/privacy-policy`, lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${BASE}/terms`,          lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${BASE}/disclaimer`,     lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${BASE}/cookie-policy`,  lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
  ]
}

// In Next 16 the `id` arrives as a Promise that resolves to a string.
export default async function sitemap({ id }: { id: Promise<string> }): Promise<MetadataRoute.Sitemap> {
  const idx = Number(await id) || 0
  const slugs = await getSlugPage(idx * PAGE, PAGE)

  const propertyRoutes: MetadataRoute.Sitemap = slugs
    .filter(s => s.slug)
    .map(({ slug, created_at }) => ({
      url: `${BASE}/properties/${slug}`,
      lastModified: created_at ? new Date(created_at) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }))

  // Static routes live only in the first chunk to avoid duplication.
  return idx === 0 ? [...staticRoutes(), ...propertyRoutes] : propertyRoutes
}
