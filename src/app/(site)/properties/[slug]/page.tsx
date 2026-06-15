import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getListingBySlug, getMainImage, getAllSlugs } from '@/lib/listings'
import PropertyDetail from '@/components/PropertyDetail'

export const revalidate = 300
export const dynamicParams = true

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const slugs = await getAllSlugs()
  return slugs.filter(s => !!s.slug).map(({ slug }) => ({ slug }))
}

function buildDescription(title: string, location: string, description: string): string {
  const clean = (description || '').replace(/\s+/g, ' ').trim()
  if (clean) return clean.slice(0, 155)
  return `${title} in ${location} — Pag-IBIG eligible. Get free 24-hour pre-qualification with Orange Square Realty.`
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const listing = await getListingBySlug(slug)

  if (!listing) {
    return { title: 'Property Not Found', robots: { index: false, follow: false } }
  }

  const title = `${listing.title} — ${listing.location}`
  const description = buildDescription(listing.title, listing.location, listing.description)
  const image = getMainImage(listing)

  return {
    title,
    description,
    alternates: { canonical: `/properties/${listing.slug}` },
    openGraph: {
      title: `${title} | Orange Square Realty`,
      description,
      url: `/properties/${listing.slug}`,
      type: 'website',
      ...(image ? { images: [{ url: image, width: 1200, height: 675, alt: listing.title }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  }
}

export default async function PropertyPage({ params }: Props) {
  const { slug } = await params
  const listing = await getListingBySlug(slug)

  if (!listing) notFound()

  const image = getMainImage(listing)
  const priceValue = (listing.price || '').replace(/[^0-9.]/g, '')
  const SITE_URL = 'https://orangesquarerealty.com.ph'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': ['Residence', 'Product'],
    name: listing.title,
    description: buildDescription(listing.title, listing.location, listing.description),
    url: `${SITE_URL}/properties/${listing.slug}`,
    ...(image ? { image } : {}),
    address: {
      '@type': 'PostalAddress',
      addressLocality: listing.location,
      addressCountry: 'PH',
    },
    ...(priceValue
      ? {
          offers: {
            '@type': 'Offer',
            price: priceValue,
            priceCurrency: 'PHP',
            availability: 'https://schema.org/InStock',
            url: `${SITE_URL}/properties/${listing.slug}`,
            seller: { '@type': 'RealEstateAgent', name: 'Orange Square Realty Corporation' },
          },
        }
      : {}),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PropertyDetail listing={listing} />
    </>
  )
}
