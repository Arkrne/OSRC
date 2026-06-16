'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

const EASE = [0.23, 1, 0.32, 1] as const

export default function FinalCTA() {
  return (
    <section className="py-20 sm:py-24 md:py-32 px-5 sm:px-8 lg:px-20 bg-[#F5EEE8]">
      <div className="max-w-[1360px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
          className="relative overflow-hidden rounded-[1.75rem] sm:rounded-[2rem] bg-[#0B0906] px-6 py-12 sm:px-10 sm:py-16 md:px-16 md:py-20"
        >
          {/* Ambient glow */}
          <div className="ambient-glow" aria-hidden />
          <div className="pointer-events-none absolute -top-1/3 right-0 w-[500px] h-[500px] max-w-full opacity-30" style={{ background: 'radial-gradient(ellipse, rgba(232,93,4,0.5) 0%, transparent 65%)', filter: 'blur(90px)' }} />

          <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto">
<h2 className="font-display text-[clamp(30px,5vw,68px)] text-[#FBF6EC] mb-5" style={{ lineHeight: 0.95, letterSpacing: '-0.03em' }}>
              Browse Pag-IBIG Homes,<br /><em className="not-italic text-[#F27024]">Find the Right Fit</em>
            </h2>
            <p className="text-[#C6B9A4] text-[15px] sm:text-[16px] leading-relaxed mb-8 sm:mb-10 max-w-lg">
              Explore available properties across Cavite, Laguna, Bulacan, and Metro Manila. All Pag-IBIG eligible, all at developer pricing.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="/properties"
                className="group flex items-center gap-2 pl-7 pr-5 py-4 rounded-full bg-[#E85D04] hover:bg-[#F27024] text-white font-semibold text-[15px] transition-[background-color,transform] duration-[160ms] ease-out active:scale-[0.97]"
              >
                Browse Properties
                <span className="cta-icon">
                  <ArrowUpRight size={15} strokeWidth={2.5} />
                </span>
              </Link>
              <Link
                href="/contact"
                className="flex items-center gap-2.5 px-7 py-4 rounded-full border border-[rgba(255,255,255,0.2)] text-[#C6B9A4] hover:text-white hover:border-[rgba(255,255,255,0.4)] text-[15px] font-medium transition-[border-color,color] duration-[160ms] ease-out"
              >
                Free Pre-Qualification
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
