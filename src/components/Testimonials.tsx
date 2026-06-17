'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react'

// Adapted from 21st.dev "Testimonial Slider" — themed warm light, framer-motion
type Testimonial = { image: string; quote: string; name: string; role: string; rating: number }

const data: Testimonial[] = [
  {
    image: 'https://pfnfgbbccdexbyjorvam.supabase.co/storage/v1/object/public/site-assets/media/team-andrea-reyes.jpg',
    quote: 'We thought a Pag-IBIG loan would be impossible for us. OSRC handled every document and got us approved in weeks. We have our own home now.',
    name: 'Maria & Jun Santos',
    role: 'Camella Bacoor · Cavite',
    rating: 5,
  },
  {
    image: 'https://pfnfgbbccdexbyjorvam.supabase.co/storage/v1/object/public/site-assets/media/team-danny-bautista.jpg',
    quote: 'Honest from day one. They told us our real loanable amount within a day and never pressured us. Found the perfect home for our budget.',
    name: 'Rafael Dela Cruz',
    role: 'Lumina Homes · Bulacan',
    rating: 5,
  },
  {
    image: 'https://pfnfgbbccdexbyjorvam.supabase.co/storage/v1/object/public/site-assets/media/testimonial-3.jpg',
    quote: 'As an OFW, I worried about processing while abroad. OSRC kept me updated and did everything remotely. I never had to fly home.',
    name: 'Grace Villanueva',
    role: 'Lancaster New City · Cavite',
    rating: 5,
  },
]

const EASE = [0.23, 1, 0.32, 1] as const

export default function Testimonials() {
  const [index, setIndex] = useState(0)
  const [dir, setDir] = useState(0)

  const next = useCallback(() => { setDir(1); setIndex(i => (i + 1) % data.length) }, [])
  const prev = useCallback(() => { setDir(-1); setIndex(i => (i - 1 + data.length) % data.length) }, [])

  useEffect(() => {
    const t = setInterval(next, 6000)
    return () => clearInterval(t)
  }, [next])

  const t = data[index]

  const variants = {
    hidden: (d: number) => ({ x: d > 0 ? 60 : -60, opacity: 0 }),
    visible: { x: 0, opacity: 1, transition: { duration: 0.5, ease: EASE } },
    exit: (d: number) => ({ x: d < 0 ? 60 : -60, opacity: 0, transition: { duration: 0.3, ease: EASE } }),
  }

  return (
    <section id="testimonials" className="py-12 sm:py-18 md:py-24 px-5 sm:px-8 lg:px-20">
      <div className="max-w-[1360px] mx-auto">
        <div className="flex flex-col items-center text-center gap-2 sm:gap-3 mb-8 sm:mb-11">
          <h2 className="font-display text-[clamp(34px,4vw,58px)] text-[#1C1714] max-w-2xl" style={{ lineHeight: 0.95, letterSpacing: '-0.025em' }}>
            Families We've Helped Come Home
          </h2>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="relative min-h-[340px] md:min-h-[280px]">
            <AnimatePresence initial={false} custom={dir} mode="wait">
              <motion.div
                key={index}
                custom={dir}
                variants={variants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex flex-col md:flex-row items-center gap-8"
              >
                {/* Photo */}
                <div className="relative w-44 h-44 md:w-60 md:h-60 shrink-0 rounded-3xl overflow-hidden md:mr-[-3rem] z-10 shadow-[0_10px_40px_rgba(28,23,20,0.12)]">
                  <Image src={t.image} alt={t.name} fill sizes="(max-width: 768px) 176px, 240px" className="object-cover" />
                </div>
                {/* Card */}
                <div className="relative w-full bezel-outer">
                  <div className="bezel-inner p-7 md:pl-20 md:pr-8 md:py-9">
                    <Quote className="absolute top-5 left-5 md:left-14 h-8 w-8 text-[rgba(232,93,4,0.18)]" />
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#C8943A] text-[#C8943A]" />
                      ))}
                    </div>
                    <blockquote className="text-[#1C1714] text-[15px] md:text-[16px] leading-relaxed mb-5">
                      "{t.quote}"
                    </blockquote>
                    <div>
                      <p className="font-semibold text-[#1C1714] text-[15px]">{t.name}</p>
                      <p className="text-[#A89070] text-[13px]">{t.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-10">
            <button onClick={prev} aria-label="Previous" className="w-10 h-10 rounded-full border border-[rgba(28,23,20,0.12)] flex items-center justify-center text-[#6E6055] hover:text-[#1C1714] hover:border-[rgba(28,23,20,0.25)] transition-[color,border-color,transform] duration-[160ms] ease-out active:scale-[0.95]">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              {data.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setDir(i > index ? 1 : -1); setIndex(i) }}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${i === index ? 'w-6 bg-[#E85D04]' : 'w-2 bg-[rgba(28,23,20,0.18)]'}`}
                />
              ))}
            </div>
            <button onClick={next} aria-label="Next" className="w-10 h-10 rounded-full border border-[rgba(28,23,20,0.12)] flex items-center justify-center text-[#6E6055] hover:text-[#1C1714] hover:border-[rgba(28,23,20,0.25)] transition-[color,border-color,transform] duration-[160ms] ease-out active:scale-[0.95]">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
