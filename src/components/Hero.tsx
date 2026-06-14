'use client'

import { useRef, useState } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Pause, Play } from 'lucide-react'

const EASE = [0.23, 1, 0.32, 1] as const

const stats = [
  { value: '10+',   label: 'Developer Partners'     },
  { value: '3',     label: 'Regions Served'         },
  { value: '₱890K', label: 'Starting Price'         },
  { value: '24h',   label: 'Loan Pre-Qualification' },
]

// Headline lines — each gets a masked slide-up reveal (kinetic typography)
const headlineLines = [
  { text: 'Find Your', accent: false },
  { text: 'Dream Home.', accent: true },
  { text: 'We Handle', accent: false },
  { text: 'the Pag‑IBIG.', accent: false },
]

// Full-bleed background-video hero — adapted from 21st.dev "Hero with bg video"
export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const [playing, setPlaying] = useState(true)
  const reduced = useReducedMotion()

  // Subtle depth parallax — video drifts slower than the page on scroll-out
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] })
  const videoY = useTransform(scrollYProgress, [0, 1], ['0%', reduced ? '0%' : '18%'])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, reduced ? 1 : 0.25])

  const toggle = () => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) { v.play(); setPlaying(true) }
    else { v.pause(); setPlaying(false) }
  }

  return (
    <section ref={sectionRef} id="home" className="relative min-h-[100dvh] flex flex-col overflow-hidden">
      {/* ── Background video (parallax wrapper) ── */}
      <motion.div className="absolute inset-0 z-0" style={{ y: videoY }}>
        <video
          ref={videoRef}
          className="absolute inset-0 w-full object-cover"
          style={{ height: '115%' }}
          src="https://videos.pexels.com/video-files/7578552/7578552-uhd_2560_1440_30fps.mp4"
          poster="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80"
          autoPlay
          loop
          muted
          playsInline
        />
      </motion.div>

      {/* ── Overlays for legibility (darken left + bottom) ── */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#0B0906]/75 via-[#0B0906]/40 to-[#0B0906]/15 md:from-[#0B0906]/92 md:via-[#0B0906]/55 md:to-[#0B0906]/20" />
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#0B0906]/45 via-transparent to-[#0B0906]/30 md:from-[#0B0906]/85 md:to-[#0B0906]/25" />

      {/* ── Content ── */}
      <motion.div
        style={{ opacity: contentOpacity }}
        className="relative z-20 flex-1 flex flex-col justify-center px-5 sm:px-8 md:px-12 lg:px-16 xl:px-20 pt-32 sm:pt-36 pb-10 sm:pb-12"
      >
        <div className="flex flex-col gap-7 sm:gap-9 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <span className="eyebrow" style={{ background: 'rgba(232,93,4,0.12)', borderColor: 'rgba(232,93,4,0.35)', color: '#F27024' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#E85D04] inline-block" />
              Pag-IBIG Housing Loan Specialists
            </span>
          </motion.div>

          {/* Kinetic headline — masked line-by-line reveal */}
          <h1
            className="font-display text-[clamp(42px,8.5vw,100px)] text-[#FBF6EC]"
            style={{ lineHeight: 0.96, letterSpacing: '-0.03em', textShadow: '0 2px 30px rgba(0,0,0,0.35)' }}
          >
            {headlineLines.map((line, i) => (
              <span key={line.text} className="block overflow-hidden pb-[0.06em] -mb-[0.06em]">
                <motion.span
                  className={`block ${line.accent ? 'italic text-[#F27024]' : ''}`}
                  initial={reduced ? { opacity: 0 } : { y: '105%' }}
                  animate={reduced ? { opacity: 1 } : { y: '0%' }}
                  transition={{ duration: 0.85, delay: 0.1 + i * 0.09, ease: EASE }}
                >
                  {line.text}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5, ease: EASE }}
            className="text-[#E7DCC9] text-[15px] sm:text-[17px] leading-relaxed max-w-[440px]"
            style={{ textShadow: '0 1px 16px rgba(0,0,0,0.35)' }}
          >
            We find your house and handle the whole Pag-IBIG loan,
            from first form to move-in keys. No hidden fees.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.62, ease: EASE }}
            className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:gap-4"
          >
            <a
              href="/properties"
              className="group flex items-center justify-center sm:justify-start gap-2 pl-6 pr-3 py-3.5 min-h-[48px] rounded-full bg-[#E85D04] hover:bg-[#F27024] text-white font-semibold text-[14px] tracking-tight shadow-[0_8px_32px_rgba(232,93,4,0.4)] transition-[background-color,transform] duration-[160ms] ease-out active:scale-[0.97]"
            >
              Browse Properties
              <span className="w-7 h-7 rounded-full bg-black/20 flex items-center justify-center transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                <ArrowUpRight size={15} strokeWidth={2.25} />
              </span>
            </a>
            <a
              href="/contact"
              className="flex items-center justify-center gap-2.5 px-6 py-3.5 min-h-[48px] rounded-full border border-[rgba(255,255,255,0.25)] text-[#E7DCC9] hover:text-white hover:border-[rgba(255,255,255,0.45)] text-[14px] font-medium backdrop-blur-sm transition-[border-color,color,transform] duration-[160ms] ease-out active:scale-[0.97]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#E85D04] animate-pulse" />
              Get Pre-Qualified
            </a>
          </motion.div>
        </div>
      </motion.div>

      {/* ── Bottom stats strip — staggered entrance ── */}
      <div className="relative z-20 px-5 sm:px-8 md:px-12 lg:px-16 xl:px-20 pb-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-6 border-t border-[rgba(255,255,255,0.15)] pt-6 sm:pt-7 max-w-4xl">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: reduced ? 0 : 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75 + i * 0.07, duration: 0.5, ease: EASE }}
              className={`pr-6 ${i > 0 ? 'lg:pl-8 lg:border-l border-[rgba(255,255,255,0.15)]' : ''}`}
            >
              <div className="font-display text-[clamp(24px,3vw,32px)] text-[#FBF6EC] tabular-nums" style={{ lineHeight: 1, letterSpacing: '-0.03em' }}>
                {s.value}
              </div>
              <div className="text-[10px] md:text-[11px] text-[#C6B9A4] mt-1.5 uppercase tracking-[0.14em] font-medium">
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Scroll cue — animated hairline (hidden on short/landscape phones) ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        aria-hidden
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 hidden sm:flex [@media(max-height:500px)]:!hidden flex-col items-center gap-2"
      >
        <div className="relative w-px h-12 bg-[rgba(255,255,255,0.18)] overflow-hidden rounded-full">
          <motion.div
            className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-transparent via-[#F27024] to-transparent"
            animate={reduced ? {} : { y: ['-100%', '220%'] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>

      {/* ── Floating badge + video control ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.45, ease: EASE }}
        className="absolute top-28 right-6 lg:right-12 z-20 hidden sm:flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[rgba(11,9,6,0.55)] backdrop-blur-xl border border-[rgba(255,255,255,0.14)]"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-[pulse-dot_2s_ease-in-out_infinite]" />
        <span className="text-[12px] font-medium text-[#FBF6EC] tracking-tight">All properties Pag-IBIG eligible</span>
      </motion.div>

      <button
        onClick={toggle}
        aria-label={playing ? 'Pause background video' : 'Play background video'}
        className="absolute bottom-10 right-5 sm:right-6 lg:right-12 z-20 w-11 h-11 rounded-full bg-[rgba(11,9,6,0.5)] backdrop-blur-md border border-[rgba(255,255,255,0.2)] flex items-center justify-center text-white hover:bg-[rgba(11,9,6,0.7)] transition-[background-color,transform] duration-[160ms] ease-out active:scale-[0.95]"
      >
        {playing ? <Pause size={15} className="fill-white" /> : <Play size={15} className="fill-white ml-0.5" />}
      </button>
    </section>
  )
}
