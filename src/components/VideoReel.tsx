'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'
import { useVideoAutoplay } from '@/lib/useVideoAutoplay'

const EASE = [0.23, 1, 0.32, 1] as const

// Second video block — a "client story reel" full-bleed band
export default function VideoReel() {
  const shouldAutoplay = useVideoAutoplay()
  return (
    <section className="relative min-h-[78svh] sm:min-h-[70vh] flex items-center overflow-hidden bg-[#0B0906]">
      {/* Background video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        // src="..." // Video unavailable at source
        autoPlay={false}
        preload="none"
        loop muted playsInline
        poster="https://pfnfgbbccdexbyjorvam.supabase.co/storage/v1/object/public/site-assets/media/video-reel-poster.jpg"
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
            <div className="relative w-12 h-12 rounded-full overflow-hidden border border-white/20 shrink-0">
              <Image src="https://pfnfgbbccdexbyjorvam.supabase.co/storage/v1/object/public/site-assets/media/avatar-liza-mariano.jpg" alt="Liza Mariano" fill sizes="48px" className="object-cover" />
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
