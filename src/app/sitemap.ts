import type { MetadataRoute } from 'next'
import { getAllSlugs } from '@/lib/listings'

// Rebuild at most once per hour; new listings appear within 60 minutes.
// TODO: split into sitemap index when listing count approaches 1,000
export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://orangesquarerealty.com.ph'
  const slugs = await getAllSlugs()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base,                     lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${base}/properties`,     lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9 },
    { url: `${base}/services`,       lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/about`,          lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/contact`,        lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/privacy-policy`, lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${base}/terms`,          lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${base}/disclaimer`,     lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${base}/cookie-policy`,  lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
  ]

  const propertyRoutes: MetadataRoute.Sitemap = slugs
    .filter(s => s.slug)
    .map(({ slug, created_at }) => ({
      url: `${base}/properties/${slug}`,
      lastModified: created_at ? new Date(created_at) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }))

  return [...staticRoutes, ...propertyRoutes]
}
