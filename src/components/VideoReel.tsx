'use client'

import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'

const EASE = [0.23, 1, 0.32, 1] as const

// Second video block — a "client story reel" full-bleed band
export default function VideoReel() {
  return (
    <section className="relative min-h-[78svh] sm:min-h-[70vh] flex items-center overflow-hidden bg-[#0B0906]">
      {/* Background video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="https://videos.pexels.com/video-files/8293760/8293760-uhd_2560_1440_25fps.mp4"
        autoPlay loop muted playsInline
        poster="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1400&q=80"
      />
      <div className="absolute inset-0 bg-[#0B0906]/75" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0B0906] via-[#0B0906]/55 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0906]/70 to-transparent" />

      <div className="relative z-10 max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-20 w-full py-20 sm:py-0">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
          className="max-w-2xl"
        >
          <Quote className="w-9 h-9 sm:w-10 sm:h-10 text-[#F27024] mb-5 sm:mb-6" />
          <p className="font-display text-[clamp(24px,3.2vw,44px)] text-[#FBF6EC] leading-tight mb-7 sm:mb-8" style={{ letterSpacing: '-0.02em', textShadow: '0 2px 24px rgba(0,0,0,0.4)' }}>
            &ldquo;For the first time, our family has a place that&rsquo;s truly ours.
            OSRC made the Pag-IBIG process feel simple and human.&rdquo;
          </p>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border border-white/20 shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=200&auto=format&fit=crop" alt="Liza Mariano" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div>
              <p className="text-[#FBF6EC] font-semibold text-[14px]">Liza Mariano</p>
              <p className="text-[#C6B9A4] text-[12px]">Homeowner · Lumina Homes, Bulacan</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
