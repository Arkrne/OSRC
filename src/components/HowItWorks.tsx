'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { ClipboardCheck, Home, FileSignature, KeyRound } from 'lucide-react'
import { RevealHeading, Stagger, StaggerItem, TiltCard } from './motion'

const EASE = [0.23, 1, 0.32, 1] as const

const steps = [
  {
    icon: ClipboardCheck,
    num: '01',
    title: 'Free Pre-Qualification',
    body: 'Send us your details and within 24 hours we tell you how much Pag-IBIG can lend you. It costs nothing.',
  },
  {
    icon: Home,
    num: '02',
    title: 'Property Matching',
    body: 'We match you to Pag-IBIG-eligible homes that fit your budget, location, and family size across our developer network.',
  },
  {
    icon: FileSignature,
    num: '03',
    title: 'Loan Processing',
    body: 'We prepare and file your entire Pag-IBIG housing loan application and chase every document for you.',
  },
  {
    icon: KeyRound,
    num: '04',
    title: 'Move In',
    body: 'Once Pag-IBIG releases the loan, we meet you at your new home and hand over the keys.',
  },
]

export default function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 75%', 'end 60%'],
  })
  // connector line draws across the steps as the section scrolls through
  const lineWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <section id="how-it-works" className="py-12 sm:py-18 md:py-24 px-5 sm:px-8 lg:px-20 bg-[#F5EEE8]">
      <div className="max-w-[1360px] mx-auto">
        <div className="flex flex-col gap-2 sm:gap-3 mb-8 sm:mb-12 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <span className="eyebrow">Four Steps</span>
          </motion.div>
          <RevealHeading
            className="font-display text-[clamp(40px,5vw,72px)] text-[#1C1714]"
            style={{ lineHeight: 0.93, letterSpacing: '-0.03em' }}
            lines={['From Inquiry', <span key="2">to <em className="not-italic text-shine">Keys,</em> Four Steps</span>]}
          />
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.18, ease: EASE }}
            className="text-[#6E6055] text-[17px] leading-relaxed max-w-xl"
          >
            From finding out how much Pag-IBIG will lend you, all the way to the day you get your keys.
          </motion.p>
        </div>

        <div ref={ref} className="relative">
          {/* Scroll-drawn connector line (desktop) */}
          <div className="hidden lg:block absolute left-0 right-0 top-[2.2rem] h-[2px] bg-[rgba(28,23,20,0.08)] z-0">
            <motion.div
              className="h-full bg-gradient-to-r from-[#E85D04] to-[#F27024]"
              style={{ width: reduced ? '100%' : lineWidth }}
            />
          </div>

          <Stagger className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5" gap={0.12}>
            {steps.map((step) => (
              <StaggerItem key={step.num} variant="up">
                <TiltCard className="group h-full" max={7}>
                  <div className="glow-border relative h-full rounded-2xl bg-[#FAFAF7] border border-[rgba(28,23,20,0.08)] p-7 sm:p-9 flex flex-col gap-6 min-h-[280px] sm:min-h-[320px] overflow-hidden lift">
                    {/* numbered node sitting on the connector line */}
                    <div className="flex items-center justify-between">
                      <div className="w-11 h-11 rounded-xl bg-[rgba(232,93,4,0.08)] border border-[rgba(232,93,4,0.15)] flex items-center justify-center transition-colors duration-300 group-hover:bg-[#E85D04] group-hover:border-[#E85D04]" style={{ transform: 'translateZ(30px)' }}>
                        <step.icon size={18} strokeWidth={1.5} className="text-[#E85D04] transition-colors duration-300 group-hover:text-white" />
                      </div>
                      <span className="font-display text-[52px] text-[rgba(28,23,20,0.1)] group-hover:text-[rgba(232,93,4,0.28)] transition-[color,transform] duration-300 group-hover:-translate-y-0.5" style={{ lineHeight: 1 }}>
                        {step.num}
                      </span>
                    </div>
                    <div className="mt-auto transition-transform duration-300 ease-out group-hover:translate-y-[-2px]" style={{ transform: 'translateZ(20px)' }}>
                      <h3 className="text-[#1C1714] font-semibold text-[18px] mb-2.5 tracking-tight">{step.title}</h3>
                      <p className="text-[#6E6055] text-[15px] leading-relaxed">{step.body}</p>
                    </div>
                  </div>
                </TiltCard>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  )
}
