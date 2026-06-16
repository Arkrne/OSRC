import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { getListings, CARD_COLUMNS } from '@/lib/listings'
import PropertyCard from './PropertyCard'

export default async function PropertiesPreview() {
  const listings = await getListings({ limit: 6, select: CARD_COLUMNS })

  return (
    <section id="properties" className="py-12 sm:py-18 md:py-24 px-5 sm:px-8 lg:px-20 bg-[#F5EEE8]">
      <div className="max-w-[1360px] mx-auto">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-5 mb-7 sm:mb-10">
          <div className="flex flex-col gap-2 sm:gap-3">
            <span className="eyebrow">Available Properties</span>
            <h2
              className="font-display text-[clamp(36px,4vw,60px)] text-[#1C1714]"
              style={{ lineHeight: 0.95, letterSpacing: '-0.025em' }}
            >
              Find the Right Home for You
            </h2>
          </div>
          <Link
            href="/properties"
            className="group hidden md:inline-flex items-center gap-2 text-[#6E6055] hover:text-[#E85D04] text-[13px] font-medium transition-colors shrink-0"
          >
            View all properties
            <span className="w-7 h-7 rounded-full border border-[rgba(28,23,20,0.1)] group-hover:border-[rgba(232,93,4,0.4)] flex items-center justify-center transition-[border-color,transform] duration-[160ms] group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              <ArrowUpRight size={14} strokeWidth={2} />
            </span>
          </Link>
        </div>

        {listings.length === 0 ? (
          <div className="flex flex-col items-center gap-5 py-24 text-[#A89070]">
            <p className="font-display text-2xl text-[#6E6055]">No listings available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {listings.map((listing, i) => (
              <PropertyCard key={listing.id} listing={listing} index={i} />
            ))}
          </div>
        )}

        <div className="flex justify-center mt-10 md:mt-12">
          <Link
            href="/properties"
            className="group flex items-center gap-2 px-8 py-3.5 min-h-[48px] rounded-full bg-[#1C1714] hover:bg-[#E85D04] text-white text-[13px] font-medium transition-[background-color,transform] duration-[160ms] ease-out active:scale-[0.97]"
          >
            Browse All Properties
            <ArrowUpRight size={14} strokeWidth={2.25} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
