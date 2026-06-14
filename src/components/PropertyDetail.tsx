'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, ArrowUpRight, ArrowLeft, Check, Images } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { type Listing, getFullImages, getThumbImages } from '@/lib/listings'
import InquiryModal from './InquiryModal'

export default function PropertyDetail({ listing }: { listing: Listing }) {
  const images      = getFullImages(listing)
  const thumbImages = getThumbImages(listing)
  const [activeImg, setActiveImg] = useState(
    Math.min(listing.main_image_index ?? 0, Math.max(0, images.length - 1))
  )
  const [inquiring, setInquiring] = useState(false)

  return (
    <div className="min-h-screen bg-[#FAFAF7] pt-24 sm:pt-28 pb-16 sm:pb-24 px-5 sm:px-8 lg:px-20">
      <div className="max-w-[1240px] mx-auto">

        {/* Breadcrumb / back */}
        <div className="flex items-center gap-2 text-[12px] text-[#A89070] mb-6">
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
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#EDE5DA] border border-[rgba(28,23,20,0.06)]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImg}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="absolute inset-0"
                >
                  {images[activeImg] ? (
                    <Image
                      src={images[activeImg]}
                      alt={`${listing.title} — photo ${activeImg + 1}`}
                      fill priority
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 60vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#C4B8A8]">
                      <Images size={40} strokeWidth={1.25} />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
              {images.length > 1 && (
                <div className="absolute bottom-3 right-3">
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
                    onClick={() => setActiveImg(i)}
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

              <div className="flex flex-wrap gap-2 mt-5">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-full bg-[rgba(200,148,58,0.1)] text-[#C8943A] border border-[rgba(200,148,58,0.25)]">
                  Pag-IBIG Eligible <Check size={12} strokeWidth={2.5} />
                </span>
                {images.length > 0 && (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-full bg-[rgba(28,23,20,0.05)] text-[#6E6055]">
                    <Images size={12} /> {images.length} photo{images.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {listing.description ? (
                <div className="border-t border-[rgba(28,23,20,0.08)] mt-7 pt-6">
                  <h2 className="text-[10px] font-semibold text-[#A89070] uppercase tracking-[0.15em] mb-3">Description</h2>
                  <p className="text-[#4A3D35] text-[14px] leading-[1.75] whitespace-pre-line">{listing.description}</p>
                </div>
              ) : null}

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
