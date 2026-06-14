'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { MapPin, BedDouble, Bath, Square, Check, ArrowUpRight } from 'lucide-react'

const EASE = [0.23, 1, 0.32, 1] as const

export default function Spotlight() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  // Parallax: image drifts slower than scroll
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])

  return (
    <section className="relative overflow-hidden py-20 sm:py-28 md:py-36 px-5 sm:px-8 lg:px-20 bg-[#0B0906]">
      <div className="ambient-glow" aria-hidden />
      <div className="relative z-[1] max-w-[1360px] mx-auto">
        <div className="flex flex-col gap-4 sm:gap-5 mb-10 sm:mb-12 max-w-xl">
          <span className="eyebrow on-dark self-start">
            Featured This Month
          </span>
          <motion.h2
            initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.06, ease: EASE }}
            className="font-display text-[clamp(30px,4vw,58px)] text-[#FBF6EC]"
            style={{ lineHeight: 0.95, letterSpacing: '-0.025em' }}
          >
            Camella Bacoor — <em className="italic text-[#F27024]">Mara Model</em>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6 sm:gap-8 items-stretch">
          {/* Parallax image */}
          <div ref={ref} className="relative h-[300px] sm:h-[380px] lg:h-[520px] rounded-3xl overflow-hidden border border-[rgba(255,255,255,0.12)]">
            <motion.div style={{ y }} className="absolute -inset-y-[10%] inset-x-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1400&q=80"
                alt="Camella Bacoor Mara Model"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent pointer-events-none" />
            <div className="absolute top-5 left-5 flex flex-wrap gap-2">
              <span className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-white/90 text-[#E85D04] border border-[rgba(232,93,4,0.2)]">Pre-Selling</span>
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
                <div className="font-display text-[clamp(34px,5vw,44px)] text-[#FBF6EC] leading-none">₱2.45M</div>
                <p className="text-[#C6B9A4] text-[13px] mt-2">≈ ₱13,400 / mo · 25-yr Pag-IBIG term</p>
              </div>
              <div className="flex items-center gap-2 text-[#C6B9A4] text-[13px]">
                <MapPin size={14} strokeWidth={1.75} className="text-[#F27024]" /> Bacoor, Cavite
              </div>
              <div className="grid grid-cols-3 gap-4 py-5 border-y border-[rgba(255,255,255,0.1)]">
                {[
                  { icon: BedDouble, v: '3', l: 'Bedrooms' },
                  { icon: Bath, v: '2', l: 'Baths' },
                  { icon: Square, v: '88', l: 'sqm floor' },
                ].map(s => (
                  <div key={s.l} className="flex flex-col gap-1.5">
                    <s.icon size={16} strokeWidth={1.75} className="text-[#F27024]" />
                    <span className="text-[#FBF6EC] text-[16px] font-semibold">{s.v}</span>
                    <span className="text-[#8A7C68] text-[11px]">{s.l}</span>
                  </div>
                ))}
              </div>
              <p className="text-[#C6B9A4] text-[14px] leading-relaxed">
                A spacious single-attached home inside a Camella community with its own
                clubhouse, pool, and 24/7 security. Ready for Pag-IBIG financing.
              </p>
            </div>
            <a
              href="/contact"
              className="group mt-8 inline-flex items-center justify-center gap-2 w-full min-h-[48px] py-4 rounded-full bg-[#E85D04] hover:bg-[#F27024] text-white font-semibold text-[14px] transition-[background-color,transform] duration-[160ms] ease-out active:scale-[0.97]"
            >
              Inquire About This Home
              <span className="cta-icon"><ArrowUpRight size={15} strokeWidth={2.25} /></span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
