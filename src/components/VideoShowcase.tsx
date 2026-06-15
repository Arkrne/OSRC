'use client'

import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause } from 'lucide-react'
import { useVideoAutoplay } from '@/lib/useVideoAutoplay'

const EASE = [0.23, 1, 0.32, 1] as const

// Adapted from 21st.dev "Hero With Video" pattern — themed to warm editorial light
export default function VideoShowcase() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const shouldAutoplay = useVideoAutoplay()
  const [playing, setPlaying] = useState(true)
  useEffect(() => {
    if (!shouldAutoplay) { videoRef.current?.pause(); setPlaying(false) }
  }, [shouldAutoplay])

  const toggle = () => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) { v.play(); setPlaying(true) }
    else { v.pause(); setPlaying(false) }
  }

  return (
    <section className="py-12 sm:py-18 md:py-24 px-5 sm:px-8 lg:px-20 bg-[#F5EEE8]">
      <div className="max-w-[1360px] mx-auto">
        <div className="flex flex-col items-center text-center gap-2 sm:gap-3 mb-7 sm:mb-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <span className="eyebrow">Lifestyle</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.08, ease: EASE }}
            className="font-display text-[clamp(36px,4.5vw,64px)] text-[#1C1714] max-w-3xl"
            style={{ lineHeight: 0.95, letterSpacing: '-0.025em' }}
          >
            Your Future Home, <em className="italic text-[#E85D04]">Today</em>
          </motion.h2>
        </div>

        {/* Double-bezel video container */}
        <motion.div
          initial={{ opacity: 0, transform: 'scale(0.97)' }}
          whileInView={{ opacity: 1, transform: 'scale(1)' }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
          className="bezel-outer"
        >
          <div className="bezel-inner relative aspect-video">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              src="https://videos.pexels.com/video-files/29913691/29913691-uhd_2560_1440_30fps.mp4"
              autoPlay={shouldAutoplay}
              preload={shouldAutoplay ? 'auto' : 'none'}
              loop
              muted
              playsInline
              poster="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&q=80"
            />
            {/* Gradient overlay for legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent pointer-events-none" />

            {/* Overlaid copy */}
            <div className="absolute bottom-0 left-0 right-0 p-7 md:p-10 flex items-end justify-between gap-4">
              <div className="max-w-md">
                <p className="text-white/85 text-[13px] md:text-[15px] leading-relaxed">
                  Take a look around the communities and move-in-ready homes
                  our buyers choose from.
                </p>
              </div>
              <button
                onClick={toggle}
                aria-label={playing ? 'Pause video' : 'Play video'}
                className="shrink-0 w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center hover:bg-white/30 transition-[background-color,transform] duration-[160ms] ease-out active:scale-[0.95]"
              >
                {playing
                  ? <Pause className="h-6 w-6 text-white fill-white" />
                  : <Play  className="h-6 w-6 text-white fill-white ml-0.5" />}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
