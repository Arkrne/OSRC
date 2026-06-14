import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://orangesquarerealty.com.ph'
  return [
    { url: base,                     lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${base}/privacy-policy`, lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${base}/terms`,          lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${base}/disclaimer`,     lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${base}/cookie-policy`,  lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
  ]
}
