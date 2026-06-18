import type { Metadata } from 'next'
import { getListings, getListingsCount, CARD_COLUMNS, type ListingFilters } from '@/lib/listings'
import PropertiesGrid from '@/components/PropertiesGrid'

export const dynamic = 'force-dynamic'

const PAGE_SIZE = 9

export const metadata: Metadata = {
  title: 'Properties for Sale — Pag-IBIG Eligible Homes',
  description:
    'Browse Pag-IBIG-eligible house and lot listings across Cavite, Laguna, Bulacan, and Metro Manila. Find your next home with Orange Square Realty and get free 24-hour pre-qualification.',
  alternates: { canonical: '/properties' },
  openGraph: {
    title: 'Properties for Sale | Orange Square Realty',
    description: 'Browse Pag-IBIG-eligible house and lot listings across the Philippines.',
    url: '/properties',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Properties for Sale — Pag-IBIG Eligible Homes Philippines' }],
  },
}

type Props = {
  searchParams: Promise<{
    page?: string; q?: string
    type?: string; region?: string; status?: string
    bedrooms?: string; minPrice?: string; maxPrice?: string
  }>
}

export default async function PropertiesPage({ searchParams }: Props) {
  const {
    page: pageStr = '1', q = '',
    type = '', region = '', status = '',
    bedrooms = '', minPrice = '', maxPrice = '',
  } = await searchParams

  const page   = Math.max(1, parseInt(pageStr, 10) || 1)
  const offset = (page - 1) * PAGE_SIZE

  const filters: ListingFilters = {
    search:   q.trim() || undefined,
    type:     type     || undefined,
    region:   region   || undefined,
    status:   status   || undefined,
    // parseInt('5+', 10) === 5, so '5+' naturally maps to the ≥5 branch in applyFilters
    bedrooms: bedrooms ? parseInt(bedrooms, 10) : undefined,
    minPrice: minPrice ? parseInt(minPrice, 10) : undefined,
    maxPrice: maxPrice ? parseInt(maxPrice, 10) : undefined,
  }

  const [listings, total] = await Promise.all([
    getListings({ ...filters, limit: PAGE_SIZE, offset, select: CARD_COLUMNS }),
    getListingsCount(filters),
  ])

  return (
    <div className="min-h-screen bg-[#F5EEE8] pt-24 sm:pt-28 pb-16 sm:pb-24 px-5 sm:px-8 lg:px-20">
      <div className="max-w-[1360px] mx-auto">
        <div className="flex flex-col gap-5 mb-8 sm:mb-10">
          <span className="eyebrow">Available Properties</span>
          <h1
            className="font-display text-[clamp(36px,4.5vw,60px)] text-[#1C1714]"
            style={{ lineHeight: 0.95, letterSpacing: '-0.025em' }}
          >
            Browse Our Listings
          </h1>
          <p className="text-[#6E6055] text-[14px] max-w-xl leading-relaxed">
            Every listing is Pag-IBIG eligible. Browse, then get a free 24-hour pre-qualification. No obligation.
          </p>
        </div>

        <PropertiesGrid
          listings={listings} total={total} page={page} q={q}
          filterType={type} filterRegion={region} filterStatus={status}
          filterBedrooms={bedrooms} filterMinPrice={minPrice} filterMaxPrice={maxPrice}
        />
      </div>
    </div>
  )
}
