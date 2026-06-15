'use client'

import { motion } from 'framer-motion'
import { STATS } from '@/lib/site'

const EASE = [0.23, 1, 0.32, 1] as const

const stats = [
  { value: STATS.developerPartners, label: 'Developer Partners'  },
  { value: STATS.regions,           label: 'Regions Served'      },
  { value: STATS.startingPrice,     label: 'Starting Price'      },
  { value: STATS.preQualTime,       label: 'Loan Pre-Qual'       },
]

export default function TrustBar() {
  return (
    <section className="bg-[#1C1714] border-b border-[rgba(255,255,255,0.05)] px-5 sm:px-8 lg:px-20 py-8 sm:py-10">
      <div className="max-w-[1360px] mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-6">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07, ease: EASE }}
              className={`pr-6 ${i > 0 ? 'lg:pl-8 lg:border-l border-[rgba(255,255,255,0.08)]' : ''}`}
            >
              <div
                className="font-display text-[clamp(24px,3vw,36px)] text-[#FBF6EC] tabular-nums"
                style={{ lineHeight: 1, letterSpacing: '-0.03em' }}
              >
                {s.value}
              </div>
              <div className="text-[11px] text-[#8A7C68] mt-1.5 uppercase tracking-[0.15em] font-medium">
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
