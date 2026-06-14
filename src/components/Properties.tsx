'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, ArrowUpRight, ArrowDown, Search, X } from 'lucide-react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import InquiryModal from './InquiryModal'

type Listing = {
  id: string
  title: string
  location: string
  price: string
  image_url: string
  image_urls: string[]
  thumbnail_urls: string[]
  main_image_index: number
  description: string
}
const EASE = [0.23, 1, 0.32, 1] as const

function getCardImage(l: Listing): string {
  // Prefer thumbnail for card — smaller file, faster load
  if (l.thumbnail_urls?.length) return l.thumbnail_urls[l.main_image_index ?? 0] ?? l.thumbnail_urls[0]
  if (l.image_urls?.length)     return l.image_urls[l.main_image_index ?? 0] ?? l.image_urls[0]
  return l.image_url ?? ''
}
function getFullImages(l: Listing): string[] {
  if (l.image_urls?.length) return l.image_urls
  if (l.image_url) return [l.image_url]
  return []
}
function getThumbImages(l: Listing): string[] {
  if (l.thumbnail_urls?.length) return l.thumbnail_urls
  return getFullImages(l)
}

export default function Properties() {
  const [listings, setListings]   = useState<Listing[]>([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')
  const [showCount, setShowCount] = useState(6)
  const [selected, setSelected]   = useState<Listing | null>(null)
  const [inquiring, setInquiring] = useState<Listing | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.from('listings').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { setListings(data ?? []); setLoading(false) })
  }, [])

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return listings
    return listings.filter(l => l.title.toLowerCase().includes(q) || l.location.toLowerCase().includes(q))
  }, [listings, search])

  const visible = filtered.slice(0, showCount)

  function openDetail(listing: Listing) { setSelected(listing) }
  function openInquiry(listing: Listing) { setSelected(null); setInquiring(listing) }

  return (
    <section id="properties" className="py-12 sm:py-18 md:py-24 px-5 sm:px-8 lg:px-20 bg-[#F5EEE8]">
      <div className="max-w-[1360px] mx-auto">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-5 mb-7 sm:mb-10">
          <div className="flex flex-col gap-5">
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, ease: EASE }}>
              <span className="eyebrow">Available Properties</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.08, ease: EASE }}
              className="font-display text-[clamp(36px,4vw,60px)] text-[#1C1714]"
              style={{ lineHeight: 0.95, letterSpacing: '-0.025em' }}
            >
              Find the Right Home for You
            </motion.h2>
          </div>
          {!loading && (
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="text-[#A89070] text-[13px] shrink-0">
              {filtered.length} propert{filtered.length === 1 ? 'y' : 'ies'} found
            </motion.p>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, ease: EASE }}
          className="mb-10 flex items-center gap-3 py-4 border-y border-[rgba(28,23,20,0.09)]"
        >
          <Search size={14} strokeWidth={1.5} className="text-[#A89070] shrink-0" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setShowCount(6) }}
            placeholder="Search by name or location…"
            className="flex-1 bg-transparent text-[#1C1714] text-[13px] placeholder:text-[#C4B8A8] focus:outline-none"
          />
          {search && <button onClick={() => setSearch('')} className="text-[#A89070] hover:text-[#1C1714] text-[11px] transition-colors">Clear</button>}
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {[0,1,2,3,4,5].map(i => <div key={i} className="h-[340px] rounded-2xl bg-[rgba(28,23,20,0.05)] animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-5 py-32 text-[#A89070]">
            <p className="font-display text-2xl text-[#6E6055]">{search ? 'No properties match your search.' : 'No listings available yet.'}</p>
            {search && <button onClick={() => setSearch('')} className="text-[#E85D04] text-[13px] underline hover:opacity-70">Clear search</button>}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            <AnimatePresence mode="popLayout">
              {visible.map((listing, i) => (
                <ListingCard key={listing.id} listing={listing} index={i} onOpen={() => openDetail(listing)} />
              ))}
            </AnimatePresence>
          </div>
        )}

        {filtered.length > showCount && (
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="flex justify-center mt-12">
            <button
              onClick={() => setShowCount(c => c + 3)}
              className="group flex items-center gap-2 px-8 py-3.5 min-h-[48px] rounded-full border border-[rgba(28,23,20,0.12)] hover:border-[rgba(232,93,4,0.35)] text-[#6E6055] hover:text-[#1C1714] text-[13px] font-medium transition-[border-color,color,transform] duration-[160ms] ease-out active:scale-[0.97]"
            >
              Load More Properties
              <span className="w-5 h-5 rounded-full bg-[rgba(28,23,20,0.05)] flex items-center justify-center transition-transform duration-200 group-hover:translate-y-0.5">
                <ArrowDown size={12} strokeWidth={2.25} />
              </span>
            </button>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {selected && (
          <PropertyDetailModal
            listing={selected}
            onInquire={() => openInquiry(selected)}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {inquiring && <InquiryModal propertyName={inquiring.title} onClose={() => setInquiring(null)} />}
      </AnimatePresence>
    </section>
  )
}

function ListingCard({ listing, index, onOpen }: { listing: Listing; index: number; onOpen: () => void }) {
  const mainImage  = getCardImage(listing)
  const imageCount = getFullImages(listing).length

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.23, 1, 0.32, 1] }}
      onClick={onOpen}
      className="bezel-outer lift property-card group cursor-pointer active:scale-[0.98]"
    >
      <div className="bezel-inner h-full flex flex-col">
        <div className="relative w-full h-[220px] overflow-hidden">
          {mainImage
            ? <Image src={mainImage} alt={listing.title} fill className="object-cover property-image" sizes="(max-width:768px) 100vw, 28vw" />
            : <div className="w-full h-full bg-[#EDE5DA]" />}
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
          {imageCount > 1 && (
            <div className="absolute bottom-3 right-3">
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-black/50 text-white backdrop-blur-sm">
                {imageCount} photos
              </span>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-3 p-5 flex-1">
          <div className="text-[22px] font-bold text-[#1C1714] tracking-tight leading-none">{listing.price}</div>
          <div className="border-t border-[rgba(28,23,20,0.07)] pt-3">
            <h3 className="text-[#1C1714] font-semibold text-[14px] leading-snug">{listing.title}</h3>
          </div>
          {listing.description ? (
            <p className="text-[#A89070] text-[12px] leading-relaxed line-clamp-2">{listing.description}</p>
          ) : null}
          <div className="flex items-center gap-1.5 text-[#6E6055]">
            <MapPin size={12} strokeWidth={1.5} />
            <span className="text-[12px]">{listing.location}</span>
          </div>
          <div className="mt-auto pt-3 border-t border-[rgba(28,23,20,0.07)]">
            <div className="group/btn flex items-center justify-between w-full">
              <span className="text-[13px] font-medium text-[#6E6055] group-hover/btn:text-[#E85D04] transition-colors duration-150">
                View property details
              </span>
              <span className="w-7 h-7 rounded-full border border-[rgba(28,23,20,0.1)] group-hover:border-[rgba(232,93,4,0.4)] group-hover:text-[#E85D04] text-[#A89070] flex items-center justify-center transition-[border-color,color,transform] duration-[160ms] ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                <ArrowUpRight size={14} strokeWidth={2} />
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  )
}

function PropertyDetailModal({ listing, onInquire, onClose }: {
  listing: Listing
  onInquire: () => void
  onClose: () => void
}) {
  const images      = getFullImages(listing)
  const thumbImages = getThumbImages(listing)
  const [activeImg, setActiveImg] = useState(
    Math.min(listing.main_image_index ?? 0, Math.max(0, images.length - 1))
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center md:p-6 bg-black/65 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
        className="relative w-full md:max-w-4xl bg-[#FAFAF7] rounded-t-3xl md:rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden max-h-[92dvh] md:max-h-[88dvh]"
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/25 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/40 transition-colors"
        >
          <X size={14} />
        </button>

        {/* Gallery */}
        <div className="md:w-[52%] shrink-0 flex flex-col">
          <div className="relative w-full h-[240px] sm:h-[300px] md:h-full overflow-hidden bg-[#EDE5DA]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeImg}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="absolute inset-0"
              >
                {images[activeImg] ? (
                  <Image
                    src={images[activeImg]}
                    alt={`${listing.title} — photo ${activeImg + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 52vw"
                  />
                ) : (
                  <div className="w-full h-full bg-[#EDE5DA]" />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 p-3 bg-[#EDE5DA] overflow-x-auto shrink-0">
              {images.map((url, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`relative w-16 h-12 rounded-lg overflow-hidden shrink-0 transition-all duration-150 ${
                    i === activeImg
                      ? 'ring-2 ring-[#E85D04] ring-offset-1 ring-offset-[#EDE5DA]'
                      : 'opacity-50 hover:opacity-80'
                  }`}
                >
                  <Image src={thumbImages[i] ?? url} alt={`Photo ${i + 1}`} fill className="object-cover" sizes="64px" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col gap-5">
            <div>
              <div className="text-[28px] font-bold text-[#1C1714] tracking-tight leading-none">{listing.price}</div>
              <h2 className="text-[#1C1714] font-semibold text-[18px] leading-snug mt-3">{listing.title}</h2>
              <div className="flex items-center gap-1.5 text-[#A89070] mt-1.5">
                <MapPin size={13} strokeWidth={1.5} />
                <span className="text-[13px]">{listing.location}</span>
              </div>
            </div>

            {listing.description ? (
              <div className="border-t border-[rgba(28,23,20,0.08)] pt-5">
                <p className="text-[#4A3D35] text-[14px] leading-[1.75] whitespace-pre-line">{listing.description}</p>
              </div>
            ) : null}
          </div>

          {/* Sticky CTA */}
          <div className="shrink-0 px-6 pb-6 md:px-8 md:pb-8 pt-4 border-t border-[rgba(28,23,20,0.07)]">
            <button
              onClick={onInquire}
              className="group flex items-center justify-between w-full px-6 py-4 rounded-2xl bg-[#E85D04] hover:bg-[#F27024] text-white font-semibold text-[15px] tracking-tight transition-[background-color,transform] duration-[160ms] ease-out active:scale-[0.98] shadow-[0_6px_24px_rgba(232,93,4,0.35)]"
            >
              Inquire About This Property
              <span className="w-8 h-8 rounded-full bg-black/15 flex items-center justify-center transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                <ArrowUpRight size={16} strokeWidth={2.25} />
              </span>
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
