'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { STATS } from '@/lib/site'

const EASE = [0.23, 1, 0.32, 1] as const

export default function About() {
  return (
    <section id="about" className="py-12 sm:py-18 md:py-24 overflow-hidden">
      {/* Full-bleed editorial split */}
      <div className="grid grid-cols-1 lg:grid-cols-[45%_1fr] min-h-[600px]">

        {/* Left — image panel */}
        <motion.div
          initial={{ opacity: 0, transform: 'scale(1.04)' }}
          whileInView={{ opacity: 1, transform: 'scale(1)' }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
          className="relative min-h-[400px] lg:min-h-full overflow-hidden"
        >
          <Image
            src="https://pfnfgbbccdexbyjorvam.supabase.co/storage/v1/object/public/site-assets/media/about.jpg"
            alt="Orange Square Realty team"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 45vw"
          />
          {/* Right edge blend into warm white */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#FAFAF7] hidden lg:block pointer-events-none" />

          {/* SEC card floated over image */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.45, ease: EASE }}
            className="absolute bottom-8 left-8 flex items-center gap-3 bg-[rgba(250,250,247,0.92)] backdrop-blur-xl border border-[rgba(28,23,20,0.1)] rounded-2xl px-5 py-4 shadow-[0_4px_20px_rgba(28,23,20,0.1)]"
          >
            <span className="w-2 h-2 rounded-full bg-green-500 shrink-0 animate-[pulse-dot_2s_ease-in-out_infinite]" />
            <div>
              <p className="text-[9px] text-[#A89070] uppercase tracking-[0.14em] font-medium">SEC Registered</p>
              <p className="text-[12px] text-[#1C1714] font-medium mt-0.5 font-mono">OPC-2024-OSRC-00142</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Right — editorial text */}
        <div className="flex flex-col justify-center px-5 sm:px-8 lg:px-16 xl:px-20 py-12 sm:py-16 lg:py-0">
          <motion.h2
            initial={{ opacity: 0, y: 28, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE }}
            className="font-display text-[clamp(36px,4vw,60px)] text-[#1C1714] mb-10"
            style={{ lineHeight: 0.95, letterSpacing: '-0.025em' }}
          >
            Pag-IBIG Loans,
            <br />
            <em className="italic text-shine">Done Right,</em>
            <br />
            Since 2024.
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.14, ease: EASE }}
            className="flex flex-col gap-5 text-[#6E6055] text-[16px] leading-relaxed mb-12 max-w-lg"
          >
            <p className="text-[#1C1714] text-[18px] font-medium leading-relaxed">
              Orange Square Realty is a Pag-IBIG housing loan specialist based in Cainta, Rizal.
              We handle the entire loan process: pre-qualification, property matching, filing,
              and follow-up. You focus on picking the right home.
            </p>
            <p>
              Orange Square Realty Corporation opened in 2024 to do one thing:
              get ordinary Filipino families into homes they own.
            </p>
            <p>
              From our office in Cainta, Rizal, we process Pag-IBIG housing loans for
              buyers across Metro Manila, Cavite, Laguna, and Bulacan.
            </p>
            <p>
              Buying a home here usually means drowning in paperwork and gambling on a
              broker. We sit with you, learn your situation, and stay with you until
              the keys are in your hand.
            </p>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.22, ease: EASE }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 mb-10 sm:mb-12 pt-8 border-t border-[rgba(28,23,20,0.08)]"
          >
            {[
              { v: '2024',                   l: 'Founded'       },
              { v: STATS.developerPartners,  l: 'Dev. Partners' },
              { v: STATS.regions,            l: 'Regions'       },
              { v: STATS.preQualTime,        l: 'Pre-Qual'      },
            ].map(s => (
              <div key={s.l}>
                <div className="font-display text-[32px] text-[#E85D04]" style={{ lineHeight: 1, letterSpacing: '-0.03em' }}>{s.v}</div>
                <div className="text-[11px] text-[#A89070] mt-1.5 uppercase tracking-[0.12em] font-medium">{s.l}</div>
              </div>
            ))}
          </motion.div>

          <motion.a
            href="/contact"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="group inline-flex items-center gap-2 pl-6 pr-3 py-3.5 min-h-[48px] rounded-full bg-[rgba(232,93,4,0.07)] hover:bg-[#E85D04] border border-[rgba(232,93,4,0.2)] hover:border-[#E85D04] text-[#E85D04] hover:text-white font-semibold text-[14px] transition-[background-color,border-color,color,transform] duration-[160ms] ease-out active:scale-[0.97] w-full sm:w-fit justify-center"
          >
            Free Pre-Qualification
            <span className="w-7 h-7 rounded-full bg-current/10 flex items-center justify-center transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              <ArrowUpRight size={15} strokeWidth={2.25} />
            </span>
          </motion.a>
        </div>
      </div>
    </section>
  )
}
