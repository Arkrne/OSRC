'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { MapPin, BedDouble, Bath, Square, Check, ArrowUpRight } from 'lucide-react'
import type { Property } from '@/data/properties'

const EASE = [0.23, 1, 0.32, 1] as const

type Props = {
  property: Property
  index?: number
  featured?: boolean
  onInquire: (property: Property) => void
}

export default function PropertyCard({ property, index = 0, featured = false, onInquire }: Props) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: EASE }}
      onClick={() => onInquire(property)}
      className={`bezel-outer lift property-card group cursor-pointer active:scale-[0.98] ${featured ? 'md:col-span-2' : ''}`}
    >
      <div className="bezel-inner h-full flex flex-col">

        {/* Image */}
        <div className={`relative w-full overflow-hidden ${featured ? 'h-72 md:h-[360px]' : 'h-[220px]'}`}>
          <Image
            src={property.image}
            alt={property.name}
            fill
            className="object-cover property-image"
            sizes={featured ? '(max-width: 768px) 100vw, 55vw' : '(max-width: 768px) 100vw, 28vw'}
          />
          {/* Gradient — bottom only */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

          {/* Status badge */}
          <div className="absolute top-4 left-4">
            <span className={`text-[10px] font-medium px-2.5 py-1 rounded-full backdrop-blur-sm ${
              property.status === 'Ready for Occupancy'
                ? 'bg-white/90 text-green-700 border border-green-200'
                : 'bg-white/90 text-[#E85D04] border border-[rgba(232,93,4,0.2)]'
            }`}>
              {property.status === 'Ready for Occupancy' ? 'RFO' : 'Pre-Selling'}
            </span>
          </div>

          {/* Pag-IBIG — top right */}
          {property.pagibigEligible && (
            <div className="absolute top-4 right-4">
              <span className="inline-flex items-center gap-1 text-[9px] font-medium px-2.5 py-1 rounded-full bg-white/90 text-[#C8943A] border border-[rgba(200,148,58,0.3)] backdrop-blur-sm">
                Pag-IBIG <Check size={10} strokeWidth={2.5} />
              </span>
            </div>
          )}
        </div>

        {/* Card body */}
        <div className="flex flex-col gap-4 p-5 flex-1">

          {/* Price — lead the hierarchy */}
          <div>
            <div className="text-[22px] font-bold text-[#1C1714] tracking-tight leading-none mb-1">
              {property.priceDisplay}
            </div>
            <div className="text-[11px] text-[#A89070]">{property.monthlyAmortization} · 25-yr Pag-IBIG term</div>
          </div>

          {/* Name + developer */}
          <div className="border-t border-[rgba(28,23,20,0.07)] pt-4">
            <h3 className="text-[#1C1714] font-semibold text-[14px] leading-snug mb-1">
              {property.name}
            </h3>
            <p className="text-[#A89070] text-[12px]">{property.developer}</p>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-[#6E6055]">
            <MapPin size={12} strokeWidth={1.5} />
            <span className="text-[12px]">{property.location}</span>
          </div>

          {/* Specs */}
          <div className="flex items-center gap-5 pt-1">
            <div className="flex items-center gap-1.5 text-[#6E6055]">
              <BedDouble size={12} strokeWidth={1.5} />
              <span className="text-[12px]">{property.bedrooms} BR</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#6E6055]">
              <Bath size={12} strokeWidth={1.5} />
              <span className="text-[12px]">{property.bathrooms} Bath</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#6E6055]">
              <Square size={12} strokeWidth={1.5} />
              <span className="text-[12px]">{property.floorArea}sqm floor</span>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-auto pt-4 border-t border-[rgba(28,23,20,0.07)]">
            <button className="group/btn flex items-center justify-between w-full transition-[color,transform] duration-[160ms] ease-out active:scale-[0.97]">
              <span className="text-[13px] font-medium text-[#6E6055] group-hover/btn:text-[#E85D04] transition-colors duration-150">
                Inquire about this property
              </span>
              <span className="w-7 h-7 rounded-full border border-[rgba(28,23,20,0.1)] group-hover/btn:border-[rgba(232,93,4,0.4)] group-hover/btn:text-[#E85D04] text-[#A89070] flex items-center justify-center transition-[border-color,color,transform] duration-[160ms] ease-out group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5">
                <ArrowUpRight size={14} strokeWidth={2} />
              </span>
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  )
}
