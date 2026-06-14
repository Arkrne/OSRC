import type { Metadata } from 'next'
import { getListings } from '@/lib/listings'
import PropertiesGrid from '@/components/PropertiesGrid'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Properties for Sale — Pag-IBIG Eligible Homes',
  description:
    'Browse Pag-IBIG-eligible house and lot listings across Cavite, Laguna, Bulacan, and Metro Manila. Find your next home with Orange Square Realty and get free 24-hour pre-qualification.',
  alternates: { canonical: '/properties' },
  openGraph: {
    title: 'Properties for Sale | Orange Square Realty',
    description: 'Browse Pag-IBIG-eligible house and lot listings across the Philippines.',
    url: '/properties',
  },
}

export default async function PropertiesPage() {
  const listings = await getListings()

  return (
    <div className="min-h-screen bg-[#F5EEE8] pt-24 sm:pt-28 pb-16 sm:pb-24 px-5 sm:px-8 lg:px-20">
      <div className="max-w-[1360px] mx-auto">
        <div className="flex flex-col gap-5 mb-8 sm:mb-10">
          <span className="eyebrow">Available Properties</span>
          <h1
            className="font-display text-[clamp(36px,4.5vw,60px)] text-[#1C1714]"
            style={{ lineHeight: 0.95, letterSpacing: '-0.025em' }}
          >
            Find the Right Home for You
          </h1>
          <p className="text-[#6E6055] text-[14px] max-w-xl leading-relaxed">
            Every listing is Pag-IBIG eligible. Browse, then get a free 24-hour pre-qualification — no obligation.
          </p>
        </div>

        <PropertiesGrid listings={listings} />
      </div>
    </div>
  )
}
