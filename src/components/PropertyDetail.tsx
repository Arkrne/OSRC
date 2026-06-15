'use client'

import { useMemo, useState, useEffect, useRef } from 'react'
import { AnimatePresence } from 'framer-motion'
import { MapPin, ArrowUpRight, ArrowLeft, Check, Images } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { type Listing, getFullImages, getThumbImages } from '@/lib/listings'
import InquiryModal from './InquiryModal'

const RATE = 0.0625

function parsePrice(str: string): number {
  const n = parseInt((str ?? '').replace(/[^0-9]/g, ''), 10)
  return isNaN(n) || n < 100_000 ? 0 : n
}

const peso = (n: number) => '₱' + Math.round(n).toLocaleString('en-PH')

export default function PropertyDetail({ listing }: { listing: Listing }) {
  const images      = getFullImages(listing)
  const thumbImages = getThumbImages(listing)
  const [activeImg, setActiveImg] = useState(
    Math.min(listing.main_image_index ?? 0, Math.max(0, images.length - 1))
  )
  const [activeLoaded, setActiveLoaded] = useState(false)
  const prevActive = useRef(activeImg)
  const [inquiring, setInquiring] = useState(false)

  // Preload all full-size images on mount so clicking a thumbnail is instant.
  // Uses unoptimized Supabase CDN URLs (images are already 1920×1080 @ 0.88
  // from the upload pipeline — no Next.js optimizer needed).
  useEffect(() => {
    images.forEach((url, i) => {
      if (i === activeImg) return          // already loading as the visible image
      const img = new window.Image()
      img.src = url
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Reset loaded state whenever the user switches to a new photo
  function switchPhoto(i: number) {
    if (i === activeImg) return
    prevActive.current = activeImg
    setActiveLoaded(false)
    setActiveImg(i)
  }
  const [loanDown,  setLoanDown]  = useState(10)
  const [loanYears, setLoanYears] = useState(25)

  const parsedPrice = useMemo(() => parsePrice(listing.price), [listing.price])

  const loanMonthly = useMemo(() => {
    if (!parsedPrice) return 0
    const principal = parsedPrice * (1 - loanDown / 100)
    const r = RATE / 12
    const n = loanYears * 12
    return (principal * r) / (1 - Math.pow(1 + r, -n))
  }, [parsedPrice, loanDown, loanYears])

  const features = listing.features ?? []
  const hasSpecs = listing.bedrooms != null || listing.bathrooms != null || listing.floor_area != null

  return (
    <div className="min-h-screen bg-[#FAFAF7] pt-24 sm:pt-28 pb-16 sm:pb-24 px-5 sm:px-8 lg:px-20">
      <div className="max-w-[1240px] mx-auto">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[12px] text-[#6E6055] mb-6">
          <Link href="/" className="hover:text-[#E85D04] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/properties" className="hover:text-[#E85D04] transition-colors">Properties</Link>
          <span>/</span>
          <span className="text-[#6E6055] truncate max-w-[180px]">{listing.title}</span>
        </div>

        <Link href="/properties" className="inline-flex items-center gap-2 text-[13px] text-[#6E6055] hover:text-[#E85D04] transition-colors mb-8">
          <ArrowLeft size={15} /> Back to all properties
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-8 lg:gap-12">

          {/* ── Gallery ── */}
          <div className="flex flex-col gap-3">
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-[#EDE5DA] border border-[rgba(28,23,20,0.06)]">
              {images[activeImg] ? (
                <Image
                  key={activeImg}
                  src={images[activeImg]}
                  alt={`${listing.title} — photo ${activeImg + 1}`}
                  fill
                  unoptimized
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  onLoad={() => setActiveLoaded(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#C4B8A8]">
                  <Images size={40} strokeWidth={1.25} />
                </div>
              )}

              {/* Shimmer — shown while the active photo is still downloading */}
              {!activeLoaded && images[activeImg] && (
                <div className="absolute inset-0 z-10 overflow-hidden">
                  <div
                    className="w-full h-full"
                    style={{
                      background: 'linear-gradient(90deg, #EDE5DA 0%, #F5EFE8 40%, #EDE5DA 80%)',
                      backgroundSize: '200% 100%',
                      animation: 'shimmer 1.4s ease-in-out infinite',
                    }}
                  />
                </div>
              )}

              {images.length > 1 && (
                <div className="absolute bottom-3 right-3 z-20">
                  <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-black/55 text-white backdrop-blur-sm">
                    {activeImg + 1} / {images.length}
                  </span>
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => switchPhoto(i)}
                    className={`relative w-20 h-16 rounded-lg overflow-hidden shrink-0 transition-all duration-150 ${
                      i === activeImg ? 'ring-2 ring-[#E85D04] ring-offset-2 ring-offset-[#FAFAF7]' : 'opacity-55 hover:opacity-90'
                    }`}
                    aria-label={`View photo ${i + 1}`}
                  >
                    <Image src={thumbImages[i] ?? url} alt={`Photo ${i + 1}`} fill className="object-cover" sizes="80px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Details ── */}
          <div className="flex flex-col">
            <div className="lg:sticky lg:top-28">
              <span className="eyebrow mb-4 block">Property Details</span>
              <div className="text-[clamp(30px,4vw,42px)] font-bold text-[#1C1714] tracking-tight leading-none">{listing.price}</div>
              <h1 className="font-display text-[22px] sm:text-[26px] text-[#1C1714] leading-tight mt-3" style={{ letterSpacing: '-0.02em' }}>
                {listing.title}
              </h1>
              <div className="flex items-center gap-1.5 text-[#A89070] mt-2.5">
                <MapPin size={14} strokeWidth={1.5} />
                <span className="text-[13px]">{listing.location}</span>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mt-5">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-full bg-[rgba(200,148,58,0.1)] text-[#C8943A] border border-[rgba(200,148,58,0.25)]">
                  Pag-IBIG Eligible <Check size={12} strokeWidth={2.5} />
                </span>
                {listing.status && (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-full bg-[rgba(28,23,20,0.05)] text-[#6E6055]">
                    {listing.status}
                  </span>
                )}
                {listing.property_type && (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-full bg-[rgba(28,23,20,0.05)] text-[#6E6055]">
                    {listing.property_type}
                  </span>
                )}
                {images.length > 0 && (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-full bg-[rgba(28,23,20,0.05)] text-[#6E6055]">
                    <Images size={12} /> {images.length} photo{images.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {/* Specs strip */}
              {hasSpecs && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-px mt-6 rounded-2xl overflow-hidden border border-[rgba(28,23,20,0.08)] bg-[rgba(28,23,20,0.08)]">
                  {listing.bedrooms != null && (
                    <div className="flex flex-col gap-0.5 px-4 py-3 bg-[#FAFAF7]">
                      <span className="text-[9px] uppercase tracking-[0.14em] text-[#A89070] font-medium">Beds</span>
                      <span className="text-[20px] font-bold text-[#1C1714] leading-none">{listing.bedrooms}</span>
                    </div>
                  )}
                  {listing.bathrooms != null && (
                    <div className="flex flex-col gap-0.5 px-4 py-3 bg-[#FAFAF7]">
                      <span className="text-[9px] uppercase tracking-[0.14em] text-[#A89070] font-medium">Baths</span>
                      <span className="text-[20px] font-bold text-[#1C1714] leading-none">{listing.bathrooms}</span>
                    </div>
                  )}
                  {listing.floor_area != null && (
                    <div className="flex flex-col gap-0.5 px-4 py-3 bg-[#FAFAF7]">
                      <span className="text-[9px] uppercase tracking-[0.14em] text-[#A89070] font-medium">Floor Area</span>
                      <span className="text-[20px] font-bold text-[#1C1714] leading-none">{listing.floor_area} <span className="text-[11px] font-normal text-[#A89070]">sqm</span></span>
                    </div>
                  )}
                  {listing.lot_area != null && (
                    <div className="flex flex-col gap-0.5 px-4 py-3 bg-[#FAFAF7]">
                      <span className="text-[9px] uppercase tracking-[0.14em] text-[#A89070] font-medium">Lot Area</span>
                      <span className="text-[20px] font-bold text-[#1C1714] leading-none">{listing.lot_area} <span className="text-[11px] font-normal text-[#A89070]">sqm</span></span>
                    </div>
                  )}
                </div>
              )}

              {/* Description */}
              {listing.description ? (
                <div className="border-t border-[rgba(28,23,20,0.08)] mt-7 pt-6">
                  <h2 className="text-[10px] font-semibold text-[#A89070] uppercase tracking-[0.15em] mb-3">Description</h2>
                  <p className="text-[#4A3D35] text-[14px] leading-[1.75] whitespace-pre-line">{listing.description}</p>
                </div>
              ) : null}

              {/* Features */}
              {features.length > 0 && (
                <div className="border-t border-[rgba(28,23,20,0.08)] mt-7 pt-6">
                  <h2 className="text-[10px] font-semibold text-[#A89070] uppercase tracking-[0.15em] mb-3">Features</h2>
                  <div className="flex flex-wrap gap-2">
                    {features.map((f, i) => (
                      <span key={i} className="text-[12px] px-3 py-1.5 rounded-full bg-[rgba(28,23,20,0.05)] text-[#4A3D35] border border-[rgba(28,23,20,0.06)]">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Inline loan estimate */}
              {parsedPrice > 0 && (
                <div className="border-t border-[rgba(28,23,20,0.08)] mt-7 pt-6">
                  <h2 className="text-[10px] font-semibold text-[#A89070] uppercase tracking-[0.15em] mb-4">Loan Estimate</h2>
                  {listing.monthly_amortization && (
                    <p className="text-[12px] text-[#6E6055] mb-4">
                      Indicative: <span className="font-semibold text-[#1C1714]">{listing.monthly_amortization}</span>
                    </p>
                  )}
                  <div className="flex flex-col gap-4">
                    <MiniSlider label="Down Payment" display={`${loanDown}%`} min={5} max={30} step={1} value={loanDown} onChange={setLoanDown} />
                    <MiniSlider label="Loan Term"    display={`${loanYears} yrs`} min={5} max={30} step={1} value={loanYears} onChange={setLoanYears} />
                    <div className="flex items-baseline justify-between pt-3 border-t border-[rgba(28,23,20,0.06)]">
                      <span className="text-[11px] text-[#A89070]">Est. monthly · 6.25% p.a.</span>
                      <span className="font-display text-[28px] text-[#E85D04] leading-none">{peso(loanMonthly)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* CTA */}
              <button
                onClick={() => setInquiring(true)}
                className="group mt-8 flex items-center justify-between w-full px-6 py-4 rounded-2xl bg-[#E85D04] hover:bg-[#F27024] text-white font-semibold text-[15px] tracking-tight transition-[background-color,transform] duration-[160ms] ease-out active:scale-[0.98] shadow-[0_6px_24px_rgba(232,93,4,0.35)]"
              >
                Inquire About This Property
                <span className="w-8 h-8 rounded-full bg-black/15 flex items-center justify-center transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <ArrowUpRight size={16} strokeWidth={2.25} />
                </span>
              </button>
              <p className="text-[11px] text-[#A89070] text-center mt-3">Free 24-hour Pag-IBIG pre-qualification · No obligation</p>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {inquiring && <InquiryModal propertyName={listing.title} onClose={() => setInquiring(false)} />}
      </AnimatePresence>
    </div>
  )
}

function MiniSlider({ label, display, min, max, step, value, onChange }: {
  label: string; display: string; min: number; max: number; step: number; value: number; onChange: (n: number) => void
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-[#6E6055]">{label}</span>
        <span className="text-[12px] font-semibold text-[#1C1714] tabular-nums">{display}</span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="osrc-range"
        aria-label={`${label}: ${display}`}
      />
    </div>
  )
}
