'use client'

import { useEffect, useRef, useTransition, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ChevronLeft, ChevronRight, SlidersHorizontal, X } from 'lucide-react'
import Link from 'next/link'
import { type Listing } from '@/lib/listings'
import PropertyCard from './PropertyCard'

const EASE = [0.23, 1, 0.32, 1] as const
const PAGE_SIZE = 9

const PROPERTY_TYPES = [
  'House & Lot', 'Townhouse', 'Row House', 'Duplex',
  'Condominium Unit', 'Studio Unit', 'Apartment / Flat', 'Lot Only',
  'Foreclosed Property', 'Commercial Space', 'Office Space',
  'Warehouse / Industrial', 'Farm Lot / Agricultural', 'Memorial Lot',
]

const REGIONS = [
  'Metro Manila', 'CALABARZON', 'Central Luzon', 'MIMAROPA',
  'Ilocos Region', 'Cagayan Valley', 'Bicol Region', 'CAR',
  'Western Visayas', 'Central Visayas', 'Eastern Visayas',
  'Zamboanga Peninsula', 'Northern Mindanao', 'Davao Region',
  'SOCCSKSARGEN', 'Caraga', 'BARMM',
]

const STATUSES = ['Ready for Occupancy', 'Pre-Selling', 'Pre-Owned', 'Foreclosed']
const BEDROOMS = ['1', '2', '3', '4', '5+']

type Props = {
  listings: Listing[]
  total: number
  page: number
  q: string
  filterType: string
  filterRegion: string
  filterStatus: string
  filterBedrooms: string
  filterMinPrice: string
  filterMaxPrice: string
}

export default function PropertiesGrid({
  listings, total, page, q,
  filterType, filterRegion, filterStatus, filterBedrooms, filterMinPrice, filterMaxPrice,
}: Props) {
  const router = useRouter()
  const [search,   setSearch]   = useState(q)
  const [type,     setType]     = useState(filterType)
  const [region,   setRegion]   = useState(filterRegion)
  const [status,   setStatus]   = useState(filterStatus)
  const [bedrooms, setBedrooms] = useState(filterBedrooms)
  const [minPrice, setMinPrice] = useState(filterMinPrice)
  const [maxPrice, setMaxPrice] = useState(filterMaxPrice)
  const [filtersOpen, setFiltersOpen] = useState(
    !!(filterType || filterRegion || filterStatus || filterBedrooms || filterMinPrice || filterMaxPrice)
  )
  const [, startTransition] = useTransition()
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Keep a ref of the latest filter state for the debounce closure
  const latestFilters = useRef({ search, type, region, status, bedrooms, minPrice, maxPrice })
  useEffect(() => {
    latestFilters.current = { search, type, region, status, bedrooms, minPrice, maxPrice }
  })

  // Sync local state from server navigation (back/forward buttons)
  useEffect(() => { setSearch(q) },             [q])
  useEffect(() => { setType(filterType) },       [filterType])
  useEffect(() => { setRegion(filterRegion) },   [filterRegion])
  useEffect(() => { setStatus(filterStatus) },   [filterStatus])
  useEffect(() => { setBedrooms(filterBedrooms) }, [filterBedrooms])
  useEffect(() => { setMinPrice(filterMinPrice) }, [filterMinPrice])
  useEffect(() => { setMaxPrice(filterMaxPrice) }, [filterMaxPrice])
  useEffect(() => () => { if (debounce.current) clearTimeout(debounce.current) }, [])

  const activeFilterCount = [type, region, status, bedrooms, minPrice, maxPrice].filter(Boolean).length
  const hasAnyFilter = !!(search.trim() || activeFilterCount)

  function buildHref(overrides: {
    q?: string; type?: string; region?: string; status?: string
    bedrooms?: string; minPrice?: string; maxPrice?: string; page?: number
  } = {}) {
    const f = latestFilters.current
    const get = <K extends keyof typeof overrides>(k: K, fallback: string) =>
      k in overrides ? (overrides[k] as string ?? '') : fallback

    const params = new URLSearchParams()
    const sq = get('q', f.search);       if (sq.trim()) params.set('q', sq.trim())
    const t  = get('type', f.type);      if (t)  params.set('type',     t)
    const r  = get('region', f.region);  if (r)  params.set('region',   r)
    const st = get('status', f.status);  if (st) params.set('status',   st)
    const bd = get('bedrooms', f.bedrooms); if (bd) params.set('bedrooms', bd)
    const mn = get('minPrice', f.minPrice); if (mn) params.set('minPrice', mn.replace(/[^0-9]/g, ''))
    const mx = get('maxPrice', f.maxPrice); if (mx) params.set('maxPrice', mx.replace(/[^0-9]/g, ''))
    const p  = overrides.page ?? 1;      if (p > 1) params.set('page', String(p))
    const qs = params.toString()
    return `/properties${qs ? `?${qs}` : ''}`
  }

  const push = (overrides: Parameters<typeof buildHref>[0] = {}) =>
    startTransition(() => router.push(buildHref(overrides)))

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    setSearch(v)
    if (debounce.current) clearTimeout(debounce.current)
    debounce.current = setTimeout(() => push({ q: v }), 400)
  }

  const handleFilter = (key: string, value: string) => {
    if (key === 'type')     setType(value)
    if (key === 'region')   setRegion(value)
    if (key === 'status')   setStatus(value)
    if (key === 'bedrooms') setBedrooms(value)
    if (key === 'minPrice') setMinPrice(value)
    if (key === 'maxPrice') setMaxPrice(value)
    push({ [key]: value })
  }

  const clearAll = () => {
    setSearch(''); setType(''); setRegion(''); setStatus('')
    setBedrooms(''); setMinPrice(''); setMaxPrice('')
    latestFilters.current = { search: '', type: '', region: '', status: '', bedrooms: '', minPrice: '', maxPrice: '' }
    startTransition(() => router.push('/properties'))
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  function pageHref(p: number) { return buildHref({ page: p }) }

  function pageNums(): (number | '…')[] {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const s = new Set([1, totalPages, page, page - 1, page + 1].filter(n => n >= 1 && n <= totalPages))
    const sorted = [...s].sort((a, b) => a - b)
    const result: (number | '…')[] = []
    let prev = 0
    for (const n of sorted) {
      if (n - prev > 1) result.push('…')
      result.push(n)
      prev = n
    }
    return result
  }

  return (
    <>
      {/* ── Search + filter bar ── */}
      <motion.div
        initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        transition={{ duration: 0.45, ease: EASE }}
        className="mb-6"
      >
        {/* Search row */}
        <div className="flex items-center gap-3 py-4 border-y border-[rgba(28,23,20,0.09)]">
          <Search size={14} strokeWidth={1.5} className="text-[#A89070] shrink-0" />
          <input
            value={search}
            onChange={handleSearchChange}
            placeholder="Search by name, location, type, or region…"
            className="flex-1 bg-transparent text-[#1C1714] text-[13px] placeholder:text-[#C4B8A8] focus:outline-none"
          />
          {/* Filters toggle */}
          <button
            onClick={() => setFiltersOpen(v => !v)}
            className={`flex items-center gap-1.5 text-[12px] font-medium transition-colors shrink-0 px-2.5 py-1.5 rounded-lg ${
              filtersOpen || activeFilterCount > 0
                ? 'bg-[rgba(232,93,4,0.08)] text-[#E85D04]'
                : 'text-[#A89070] hover:text-[#1C1714] hover:bg-[rgba(28,23,20,0.05)]'
            }`}
          >
            <SlidersHorizontal size={13} strokeWidth={1.75} />
            <span className="hidden sm:inline">Filters</span>
            {activeFilterCount > 0 && (
              <span className="flex items-center justify-center w-4 h-4 rounded-full bg-[#E85D04] text-white text-[9px] font-bold leading-none">
                {activeFilterCount}
              </span>
            )}
          </button>
          {search && (
            <button onClick={clearAll} className="text-[#A89070] hover:text-[#1C1714] text-[11px] transition-colors shrink-0">
              Clear
            </button>
          )}
        </div>

        {/* Collapsible filter panel */}
        <AnimatePresence>
          {filtersOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: EASE }}
              className="overflow-hidden"
            >
              <div className="pt-4 pb-2 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <FilterSelect
                  label="Type"
                  value={type}
                  onChange={v => handleFilter('type', v)}
                  options={PROPERTY_TYPES}
                />
                <FilterSelect
                  label="Region"
                  value={region}
                  onChange={v => handleFilter('region', v)}
                  options={REGIONS}
                />
                <FilterSelect
                  label="Status"
                  value={status}
                  onChange={v => handleFilter('status', v)}
                  options={STATUSES}
                />
                <FilterSelect
                  label="Bedrooms"
                  value={bedrooms}
                  onChange={v => handleFilter('bedrooms', v)}
                  options={BEDROOMS}
                />
                {/* Min price */}
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-medium text-[#A89070] uppercase tracking-wide">Min Price</span>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#A89070] text-[11px] pointer-events-none">₱</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="0"
                      value={minPrice}
                      onChange={e => setMinPrice(e.target.value.replace(/[^0-9]/g, ''))}
                      onBlur={() => push({ minPrice })}
                      onKeyDown={e => e.key === 'Enter' && push({ minPrice })}
                      className="w-full pl-6 pr-2 py-[7px] rounded-lg border border-[rgba(28,23,20,0.12)] text-[#1C1714] text-[12px] bg-transparent placeholder:text-[#C4B8A8] focus:outline-none focus:border-[rgba(232,93,4,0.4)] transition-colors"
                    />
                  </div>
                </div>
                {/* Max price */}
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-medium text-[#A89070] uppercase tracking-wide">Max Price</span>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#A89070] text-[11px] pointer-events-none">₱</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="Any"
                      value={maxPrice}
                      onChange={e => setMaxPrice(e.target.value.replace(/[^0-9]/g, ''))}
                      onBlur={() => push({ maxPrice })}
                      onKeyDown={e => e.key === 'Enter' && push({ maxPrice })}
                      className="w-full pl-6 pr-2 py-[7px] rounded-lg border border-[rgba(28,23,20,0.12)] text-[#1C1714] text-[12px] bg-transparent placeholder:text-[#C4B8A8] focus:outline-none focus:border-[rgba(232,93,4,0.4)] transition-colors"
                    />
                  </div>
                </div>
              </div>

              {hasAnyFilter && (
                <button
                  onClick={clearAll}
                  className="flex items-center gap-1 text-[11px] text-[#A89070] hover:text-[#E85D04] transition-colors mb-3"
                >
                  <X size={11} /> Clear all filters
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Count row ── */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-[#A89070] text-[13px]">
          {total} propert{total === 1 ? 'y' : 'ies'} found
        </p>
        {hasAnyFilter && !filtersOpen && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1 text-[11px] text-[#A89070] hover:text-[#E85D04] transition-colors"
          >
            <X size={11} /> Clear filters
          </button>
        )}
      </div>

      {/* ── Grid ── */}
      {listings.length === 0 ? (
        <div className="flex flex-col items-center gap-5 py-32 text-[#A89070]">
          <p className="font-display text-2xl text-[#6E6055]">
            {hasAnyFilter ? 'No properties match your filters.' : 'No listings available yet.'}
          </p>
          {hasAnyFilter && (
            <button onClick={clearAll} className="text-[#E85D04] text-[13px] underline hover:opacity-70">
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {listings.map((listing, i) => (
            <PropertyCard key={listing.id} listing={listing} index={i} />
          ))}
        </div>
      )}

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <nav className="flex items-center justify-center gap-1.5 mt-12" aria-label="Pagination">
          {page > 1 ? (
            <Link href={pageHref(page - 1)} className="w-9 h-9 rounded-full border border-[rgba(28,23,20,0.12)] flex items-center justify-center text-[#6E6055] hover:text-[#1C1714] hover:border-[rgba(28,23,20,0.25)] transition-[border-color,color]">
              <ChevronLeft size={15} />
            </Link>
          ) : (
            <span className="w-9 h-9 rounded-full border border-[rgba(28,23,20,0.06)] flex items-center justify-center text-[#C4B8A8] cursor-not-allowed">
              <ChevronLeft size={15} />
            </span>
          )}

          {pageNums().map((n, i) =>
            n === '…' ? (
              <span key={`e${i}`} className="w-9 h-9 flex items-center justify-center text-[#A89070] text-[13px]">…</span>
            ) : n === page ? (
              <span key={n} className="w-9 h-9 rounded-full bg-[#1C1714] flex items-center justify-center text-white text-[13px] font-semibold">{n}</span>
            ) : (
              <Link key={n} href={pageHref(n)} className="w-9 h-9 rounded-full border border-[rgba(28,23,20,0.12)] flex items-center justify-center text-[#6E6055] hover:text-[#1C1714] hover:border-[rgba(28,23,20,0.25)] text-[13px] transition-[border-color,color]">
                {n}
              </Link>
            )
          )}

          {page < totalPages ? (
            <Link href={pageHref(page + 1)} className="w-9 h-9 rounded-full border border-[rgba(28,23,20,0.12)] flex items-center justify-center text-[#6E6055] hover:text-[#1C1714] hover:border-[rgba(28,23,20,0.25)] transition-[border-color,color]">
              <ChevronRight size={15} />
            </Link>
          ) : (
            <span className="w-9 h-9 rounded-full border border-[rgba(28,23,20,0.06)] flex items-center justify-center text-[#C4B8A8] cursor-not-allowed">
              <ChevronRight size={15} />
            </span>
          )}
        </nav>
      )}
    </>
  )
}

function FilterSelect({
  label, value, onChange, options,
}: {
  label: string; value: string; onChange: (v: string) => void; options: string[]
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[9px] font-medium text-[#A89070] uppercase tracking-wide">{label}</span>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full px-2.5 py-[7px] rounded-lg border border-[rgba(28,23,20,0.12)] text-[#1C1714] text-[12px] bg-[#F5EEE8] focus:outline-none focus:border-[rgba(232,93,4,0.4)] transition-colors cursor-pointer"
      >
        <option value="">Any</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )
}
