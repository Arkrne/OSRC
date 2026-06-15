'use client'

import { motion } from 'framer-motion'
import { FileText, Building2, Search, ArrowUpRight } from 'lucide-react'
import { RevealHeading, Parallax } from './motion'

const EASE = [0.23, 1, 0.32, 1] as const

const services = [
  {
    icon: FileText,
    num: '01',
    title: 'Pag-IBIG Loan Processing',
    description:
      'We file your whole Pag-IBIG housing loan, from pre-qualification to loan release, and chase every document so you never have to.',
    tag: 'Full processing',
  },
  {
    icon: Building2,
    num: '02',
    title: 'Real Estate Outsourcing',
    description:
      'We work directly with Camella, Lancaster, Lumina, Crown Asia, and Futura, and curate Pag-IBIG-eligible homes across four regions at developer pricing.',
    tag: 'Trusted developers',
  },
  {
    icon: Search,
    num: '03',
    title: 'Property Search & Matching',
    description:
      'Tell us your budget, preferred location, and family size. We shortlist homes that fit, and we tell you straight when one does not.',
    tag: 'Honest advice',
  },
]

export default function Services() {
  return (
    <section id="services" className="relative py-12 sm:py-18 md:py-24 px-5 sm:px-8 lg:px-20 bg-[#F5EEE8] overflow-hidden">
      {/* Ambient warmth — breaks the flat beige */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{ background: 'radial-gradient(48% 40% at 88% 8%, rgba(232,93,4,0.07) 0%, transparent 60%)' }}
      />
      <div className="relative z-10 max-w-[1360px] mx-auto">

        {/* Section header — editorial two-column */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 pb-8 sm:mb-12 sm:pb-12 border-b border-[rgba(28,23,20,0.09)]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASE }}
            className="flex flex-col gap-3"
          >
            <span className="eyebrow">What We Do</span>
            <RevealHeading
              className="font-display text-[clamp(32px,4.5vw,64px)] text-[#1C1714]"
              style={{ lineHeight: 0.95, letterSpacing: '-0.025em' }}
              lines={['Complete', <span key="hs">Homeownership <em className="not-italic text-[#E85D04]">Support</em></span>]}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.12, ease: EASE }}
            className="flex items-end lg:pb-3"
          >
            <p className="text-[#6E6055] text-[17px] leading-relaxed max-w-md">
              We handle everything — Pag-IBIG paperwork, property matching,
              loan processing — so you spend your energy on the decision,
              not the bureaucracy.
            </p>
          </motion.div>
        </div>

        {/* Editorial numbered list */}
        <div>
          {services.map((service, i) => (
            <motion.div
              key={service.num}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.08, ease: EASE }}
              className="group"
            >
              <div className="relative grid grid-cols-[64px_1fr] md:grid-cols-[100px_1fr_auto] lg:grid-cols-[120px_1fr_200px] items-start gap-x-4 gap-y-2 sm:gap-6 lg:gap-12 py-8 sm:py-10 md:py-12 border-b border-[rgba(28,23,20,0.08)] transition-[background-color] duration-300 hover:bg-[rgba(28,23,20,0.025)] -mx-5 px-5 sm:-mx-8 sm:px-8 lg:-mx-20 lg:px-20 cursor-default">

                {/* Orange edge wipe — draws in on hover */}
                <span
                  aria-hidden
                  className="absolute left-0 top-0 h-full w-[3px] bg-[#E85D04] origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-400 ease-out"
                />

                {/* Large section number — parallax drift + ignites on hover */}
                <Parallax distance={18} className="pt-1">
                  <div
                    className="section-num select-none transition-colors duration-300 group-hover:text-[rgba(232,93,4,0.28)]"
                    aria-hidden="true"
                  >
                    {service.num}
                  </div>
                </Parallax>

                {/* Content — nudges right on hover */}
                <div className="flex flex-col gap-4 transition-transform duration-300 ease-out group-hover:translate-x-1.5">
                  <div className="flex items-center gap-3">
                    <service.icon size={16} strokeWidth={1.5} className="text-[#E85D04] opacity-80 shrink-0" />
                    <h3 className="text-[#1C1714] font-semibold text-xl tracking-tight">
                      {service.title}
                    </h3>
                  </div>
                  <p className="text-[#6E6055] text-[15px] leading-relaxed max-w-xl">
                    {service.description}
                  </p>
                </div>

                {/* Tag + arrow — right column */}
                <div className="hidden md:flex items-center gap-3 pt-1.5">
                  <span className="text-[11px] text-[#E85D04] font-medium uppercase tracking-[0.14em] border border-[rgba(232,93,4,0.22)] px-3 py-1.5 rounded-full">
                    {service.tag}
                  </span>
                  <span className="w-8 h-8 rounded-full bg-[rgba(232,93,4,0.1)] text-[#E85D04] flex items-center justify-center opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-[transform,opacity] duration-300 ease-out shrink-0">
                    <ArrowUpRight size={15} strokeWidth={2.25} />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
