'use client'

import { motion } from 'framer-motion'

const EASE = [0.23, 1, 0.32, 1] as const

const partners = [
  { name: 'Camella',             mark: 'CM' },
  { name: 'Lancaster New City',  mark: 'LN' },
  { name: 'Lumina Homes',        mark: 'LH' },
  { name: 'Crown Asia',          mark: 'CA' },
  { name: 'Futura Homes',        mark: 'FH' },
  { name: 'Bria Homes',          mark: 'BH' },
  { name: 'Vista Land',          mark: 'VL' },
  { name: 'Suntrust',            mark: 'SP' },
]

export default function Partners() {
  return (
    <section className="py-12 sm:py-18 md:py-24 border-y border-[rgba(28,23,20,0.08)] overflow-hidden">
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE }}
          className="flex flex-col items-center text-center gap-3 mb-12"
        >
          <span className="eyebrow">Trusted Developer Partners</span>
          <p className="text-[#6E6055] text-[15px] max-w-md">
            We buy direct from the country's biggest housing developers,
            so you skip the middleman's markup.
          </p>
        </motion.div>
      </div>

      {/* Marquee — seamless CSS loop, pauses on hover, edge fade masks */}
      <div
        className="group relative w-full overflow-hidden"
        style={{ maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)' }}
      >
        <div className="flex w-max items-center gap-5 marquee-track group-hover:[animation-play-state:paused]">
          {[...partners, ...partners].map((p, i) => (
            <div
              key={i}
              className="shrink-0 flex items-center gap-3 h-16 px-5 rounded-2xl bg-[#F5EEE8] border border-[rgba(28,23,20,0.07)]"
            >
              <div className="w-8 h-8 rounded-lg bg-[rgba(232,93,4,0.1)] border border-[rgba(232,93,4,0.2)] flex items-center justify-center shrink-0">
                <span className="text-[10px] font-bold text-[#E85D04] tracking-wider">{p.mark}</span>
              </div>
              <span className="font-display text-[19px] text-[#1C1714] whitespace-nowrap" style={{ letterSpacing: '-0.02em' }}>
                {p.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee-x { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .marquee-track { animation: marquee-x 36s linear infinite; }
        @media (prefers-reduced-motion: reduce) { .marquee-track { animation: none; } }
      `}</style>
    </section>
  )
}
