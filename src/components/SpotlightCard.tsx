'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { MapPin, ArrowUpRight, Check } from 'lucide-react'
import Link from 'next/link'
import type { Listing } from '@/lib/listings'

const EASE = [0.23, 1, 0.32, 1] as const

export default function SpotlightCard({ listing, image }: { listing: Listing; image: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])

  return (
    <section className="relative overflow-hidden py-20 sm:py-28 md:py-36 px-5 sm:px-8 lg:px-20 bg-[#0B0906]">
      <div className="ambient-glow" aria-hidden />
      <div className="relative z-[1] max-w-[1360px] mx-auto">
        <div className="flex flex-col gap-4 sm:gap-5 mb-10 sm:mb-12 max-w-xl">
          <span className="eyebrow on-dark self-start">Featured This Month</span>
          <motion.h2
            initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.06, ease: EASE }}
            className="font-display text-[clamp(30px,4vw,58px)] text-[#FBF6EC]"
            style={{ lineHeight: 0.95, letterSpacing: '-0.025em' }}
          >
            {listing.title}
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6 sm:gap-8 items-stretch">
          {/* Parallax image */}
          <div ref={ref} className="relative h-[300px] sm:h-[380px] lg:h-[520px] rounded-3xl overflow-hidden border border-[rgba(255,255,255,0.12)]">
            {image ? (
              <motion.div style={{ y }} className="absolute -inset-y-[10%] inset-x-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </motion.div>
            ) : (
              <div className="absolute inset-0 bg-[#1A1310]" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent pointer-events-none" />
            <div className="absolute top-5 left-5 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 text-[9px] font-medium px-2.5 py-1 rounded-full bg-white/90 text-[#C8943A] border border-[rgba(200,148,58,0.3)]">
                Pag-IBIG <Check size={10} strokeWidth={2.5} />
              </span>
            </div>
          </div>

          {/* Detail panel */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.12, ease: EASE }}
            className="lift on-dark flex flex-col justify-between rounded-3xl bg-[#14100B] border border-[rgba(255,255,255,0.1)] p-6 sm:p-8"
          >
            <div className="flex flex-col gap-5 sm:gap-6">
              <div>
                <div className="font-display text-[clamp(34px,5vw,44px)] text-[#FBF6EC] leading-none">{listing.price}</div>
              </div>
              {listing.location && (
                <div className="flex items-center gap-2 text-[#C6B9A4] text-[13px]">
                  <MapPin size={14} strokeWidth={1.75} className="text-[#F27024]" /> {listing.location}
                </div>
              )}
              {listing.description && (
                <p className="text-[#C6B9A4] text-[14px] leading-relaxed line-clamp-4">
                  {listing.description}
                </p>
              )}
            </div>
            <Link
              href={`/properties/${listing.slug}`}
              className="group mt-8 inline-flex items-center justify-center gap-2 w-full min-h-[48px] py-4 rounded-full bg-[#E85D04] hover:bg-[#F27024] text-white font-semibold text-[14px] transition-[background-color,transform] duration-[160ms] ease-out active:scale-[0.97]"
            >
              View Property Details
              <span className="cta-icon"><ArrowUpRight size={15} strokeWidth={2.25} /></span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
