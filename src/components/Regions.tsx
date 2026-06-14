'use client'

import { motion } from 'framer-motion'
import { MapPin, ArrowUpRight } from 'lucide-react'
import { RevealHeading, Stagger, StaggerItem, TiltCard, ScrollImage } from './motion'

const EASE = [0.23, 1, 0.32, 1] as const

const regions = [
  { name: 'Cavite', tag: 'Bacoor · Imus · Dasmariñas', count: '5 communities', img: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80' },
  { name: 'Laguna', tag: 'Santa Rosa · Calamba · Biñan', count: '3 communities', img: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80' },
  { name: 'Bulacan', tag: 'Marilao · Sta. Maria · Plaridel', count: '4 communities', img: 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=800&q=80' },
  { name: 'Metro Manila', tag: 'Quezon City · Las Piñas', count: '2 communities', img: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&q=80' },
]

// staggered reveal directions so cards don't all arrive identically
const ENTER = ['left', 'up', 'up', 'right'] as const

export default function Regions() {
  return (
    <section className="relative py-12 sm:py-18 md:py-24 px-5 sm:px-8 lg:px-20 mesh-warm overflow-hidden">
      <div className="blob blob-2 -left-20 top-10 h-72 w-72" aria-hidden />
      <div className="relative z-10 max-w-[1360px] mx-auto">
        <div className="flex flex-col gap-2 sm:gap-3 mb-7 sm:mb-10 max-w-xl">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, ease: EASE }}>
            <span className="eyebrow">Where We Serve</span>
          </motion.div>
          <RevealHeading
            className="font-display text-[clamp(34px,4vw,58px)] text-[#1C1714]"
            style={{ lineHeight: 0.95, letterSpacing: '-0.025em' }}
            lines={['Communities Across', <em key="r" className="italic text-shine">4 Regions</em>]}
          />
        </div>

        <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5" gap={0.09}>
          {regions.map((r, i) => (
            <StaggerItem key={r.name} variant={ENTER[i]}>
              <TiltCard className="group h-full" max={10} glareColor="rgba(255,255,255,0.16)">
                <a
                  href="#properties"
                  className="glow-border relative block h-[340px] sm:h-[360px] rounded-3xl overflow-hidden border border-[rgba(28,23,20,0.08)] shadow-[0_10px_40px_-18px_rgba(28,23,20,0.35)]"
                >
                  <ScrollImage className="absolute inset-0 h-full w-full" scaleFrom={1.22} drift={26}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={r.img} alt={r.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.04]" />
                  </ScrollImage>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                  {/* count chip — floats on a 3D layer */}
                  <div
                    className="absolute left-5 top-5 flex items-center gap-1.5 rounded-full bg-white/12 px-3 py-1.5 text-[11px] font-medium text-white/90 backdrop-blur-md border border-white/15"
                    style={{ transform: 'translateZ(40px)' }}
                  >
                    <MapPin size={12} strokeWidth={1.75} /> {r.count}
                  </div>
                  <div className="absolute inset-0 flex flex-col justify-end p-6" style={{ transform: 'translateZ(30px)' }}>
                    <h3 className="font-display text-[26px] text-white leading-none mb-1.5">{r.name}</h3>
                    <p className="text-white/75 text-[12px]">{r.tag}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-medium text-[#F8A56A]">
                      View properties
                      <ArrowUpRight size={13} strokeWidth={2.25} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>
                </a>
              </TiltCard>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
