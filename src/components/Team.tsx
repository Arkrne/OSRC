'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { RevealHeading, Stagger, StaggerItem, TiltCard, ScrollImage } from './motion'

const EASE = [0.23, 1, 0.32, 1] as const

// Adapted from 21st.dev "Team Section" — themed warm light.
// `pos` keeps each face framed regardless of the source crop.
const members = [
  { name: 'Danny Bautista', role: 'Founder & Loan Specialist', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop', pos: 'center 22%' },
  { name: 'Andrea Reyes',  role: 'Property Matching Lead',     img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop', pos: 'center 18%' },
  { name: 'Marco Lim',     role: 'Pag-IBIG Documentation',     img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop', pos: 'center 25%' },
  { name: 'Jasmine Cruz',  role: 'Client Care & OFW Desk',     img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop', pos: 'center 22%' },
]

export default function Team() {
  return (
    <section className="relative py-12 sm:py-18 md:py-24 px-5 sm:px-8 lg:px-20 mesh-warm overflow-hidden">
      <div className="blob blob-1 left-1/2 -translate-x-1/2 -top-10 h-72 w-[28rem] opacity-70" aria-hidden />
      <div className="relative z-10 max-w-[1360px] mx-auto">
        <div className="flex flex-col items-center text-center gap-2 sm:gap-3 mb-8 sm:mb-11">
          <RevealHeading
            className="font-display text-[clamp(34px,4vw,58px)] text-[#1C1714] max-w-2xl"
            style={{ lineHeight: 0.95, letterSpacing: '-0.025em' }}
            lines={['The Same Team,', <span key="2">Start to <em className="italic text-shine">Finish</em></span>]}
          />
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15, ease: EASE }}
            className="text-[#6E6055] text-[15px] max-w-lg"
          >
            The same specialists answer your calls from pre-qualification
            all the way to move-in day.
          </motion.p>
        </div>

        <Stagger className="grid grid-cols-2 lg:grid-cols-4 gap-5" gap={0.1}>
          {members.map((m, i) => (
            <StaggerItem key={m.name} variant={i % 2 === 0 ? 'up' : 'down'}>
              <TiltCard className="group flex flex-col h-full" max={9} glareColor="rgba(255,255,255,0.14)">
                <div className="relative aspect-[3/4] rounded-3xl overflow-hidden border border-[rgba(28,23,20,0.08)] mb-4 shadow-[0_10px_35px_-18px_rgba(28,23,20,0.3)] transition-shadow duration-300 group-hover:shadow-[0_24px_50px_-18px_rgba(28,23,20,0.4)]">
                  <ScrollImage className="absolute inset-0 h-full w-full" scaleFrom={1.18} drift={20}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={m.img}
                      alt={`${m.name}, ${m.role} at Orange Square Realty`}
                      loading="lazy"
                      style={{ objectPosition: m.pos }}
                      className="h-full w-full object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.05]"
                    />
                  </ScrollImage>
                  {/* Warm gradient + role caption sweep up on hover */}
                  <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#1C1714]/80 via-[#1C1714]/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                  <div className="absolute inset-x-0 bottom-0 p-4 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-[transform,opacity] duration-400 ease-out">
                    <span className="text-[11px] text-[#FBF6EC]/85 uppercase tracking-[0.14em] font-medium">
                      {m.role}
                    </span>
                  </div>
                  {/* Hover badge */}
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#E85D04] flex items-center justify-center text-white opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-[transform,opacity] duration-300" style={{ transform: 'translateZ(40px)' }}>
                    <ArrowUpRight size={15} strokeWidth={2.25} />
                  </div>
                </div>
                <h3 className="text-[#1C1714] font-semibold text-[15px] tracking-tight">{m.name}</h3>
                <p className="text-[#A89070] text-[12px] mt-0.5">{m.role}</p>
              </TiltCard>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
