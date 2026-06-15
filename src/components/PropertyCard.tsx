'use client'

import { motion } from 'framer-motion'
import { MapPin, ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { type Listing, getCardImage, getFullImages, displayPrice } from '@/lib/listings'

export default function PropertyCard({ listing, index = 0 }: { listing: Listing; index?: number }) {
  const mainImage  = getCardImage(listing)
  const imageCount = getFullImages(listing).length

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.23, 1, 0.32, 1] }}
    >
      <Link
        href={`/properties/${listing.slug}`}
        className="bezel-outer lift property-card group cursor-pointer active:scale-[0.98] block"
        aria-label={`View ${listing.title} in ${listing.location}`}
      >
        <div className="bezel-inner h-full flex flex-col">
          <div className="relative w-full aspect-video overflow-hidden">
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
            <div className="text-[22px] font-bold text-[#1C1714] tracking-tight leading-none">{displayPrice(listing.price)}</div>
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
              <div className="flex items-center justify-between w-full">
                <span className="text-[13px] font-medium text-[#6E6055] group-hover:text-[#E85D04] transition-colors duration-150">
                  View property details
                </span>
                <span className="w-7 h-7 rounded-full border border-[rgba(28,23,20,0.1)] group-hover:border-[rgba(232,93,4,0.4)] group-hover:text-[#E85D04] text-[#A89070] flex items-center justify-center transition-[border-color,color,transform] duration-[160ms] ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <ArrowUpRight size={14} strokeWidth={2} />
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
