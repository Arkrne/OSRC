'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, ArrowDown } from 'lucide-react'
import { type Listing } from '@/lib/listings'
import PropertyCard from './PropertyCard'

const EASE = [0.23, 1, 0.32, 1] as const

export default function PropertiesGrid({ listings }: { listings: Listing[] }) {
  const [search, setSearch]       = useState('')
  const [showCount, setShowCount] = useState(9)

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return listings
    return listings.filter(l =>
      l.title.toLowerCase().includes(q) || l.location.toLowerCase().includes(q)
    )
  }, [listings, search])

  const visible = filtered.slice(0, showCount)

  return (
    <>
      <div className="flex items-center justify-end mb-6">
        <p className="text-[#A89070] text-[13px]">
          {filtered.length} propert{filtered.length === 1 ? 'y' : 'ies'} found
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, ease: EASE }}
        className="mb-10 flex items-center gap-3 py-4 border-y border-[rgba(28,23,20,0.09)]"
      >
        <Search size={14} strokeWidth={1.5} className="text-[#A89070] shrink-0" />
        <input
          value={search}
          onChange={e => { setSearch(e.target.value); setShowCount(9) }}
          placeholder="Search by name or location…"
          className="flex-1 bg-transparent text-[#1C1714] text-[13px] placeholder:text-[#C4B8A8] focus:outline-none"
        />
        {search && <button onClick={() => setSearch('')} className="text-[#A89070] hover:text-[#1C1714] text-[11px] transition-colors">Clear</button>}
      </motion.div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-5 py-32 text-[#A89070]">
          <p className="font-display text-2xl text-[#6E6055]">{search ? 'No properties match your search.' : 'No listings available yet.'}</p>
          {search && <button onClick={() => setSearch('')} className="text-[#E85D04] text-[13px] underline hover:opacity-70">Clear search</button>}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {visible.map((listing, i) => (
            <PropertyCard key={listing.id} listing={listing} index={i} />
          ))}
        </div>
      )}

      {filtered.length > showCount && (
        <div className="flex justify-center mt-12">
          <button
            onClick={() => setShowCount(c => c + 6)}
            className="group flex items-center gap-2 px-8 py-3.5 min-h-[48px] rounded-full border border-[rgba(28,23,20,0.12)] hover:border-[rgba(232,93,4,0.35)] text-[#6E6055] hover:text-[#1C1714] text-[13px] font-medium transition-[border-color,color,transform] duration-[160ms] ease-out active:scale-[0.97]"
          >
            Load More Properties
            <span className="w-5 h-5 rounded-full bg-[rgba(28,23,20,0.05)] flex items-center justify-center transition-transform duration-200 group-hover:translate-y-0.5">
              <ArrowDown size={12} strokeWidth={2.25} />
            </span>
          </button>
        </div>
      )}
    </>
  )
}
