'use client'

import { ShieldCheck, Clock, Handshake, Receipt } from 'lucide-react'
import { RevealHeading, CountUp, Stagger, StaggerItem, TiltCard, SpotlightCard } from './motion'
import { STATS } from '@/lib/site'

const reasons = [
  {
    icon: ShieldCheck,
    title: 'SEC-Registered Corporation',
    body: 'OSRC is a registered corporation, and the law protects your transaction from the day you sign.',
  },
  {
    icon: Clock,
    title: '24-Hour Pre-Qualification',
    body: "Send us your details and we'll compute your Pag-IBIG loanable amount within one business day, free of charge.",
  },
  {
    icon: Handshake,
    title: 'Trusted Developer Network',
    body: "We deal directly with Camella, Lancaster, Lumina, Crown Asia, and Futura, so you pay the developer's price and nothing on top.",
  },
  {
    icon: Receipt,
    title: 'Transparent Pricing',
    body: 'You get the full fee breakdown in writing before you sign anything, and that number never changes.',
  },
]

const counters = [
  { value: STATS.developerPartners, label: 'Developer\nPartners' },
  { value: STATS.regions,           label: 'Regions\nServed'     },
  { value: '₱0',                    label: 'Hidden\nFees'        },
  { value: '100%',                  label: 'Pag-IBIG\nEligible'  },
]

export default function WhyChooseUs() {
  return (
    <section id="why-osrc" className="relative py-12 sm:py-18 md:py-24 px-5 sm:px-8 lg:px-20 overflow-hidden">
      {/* Floating ambient depth */}
      <div className="blob blob-1 right-[-6rem] top-4 h-80 w-80" aria-hidden />
      <div className="relative z-10 max-w-[1360px] mx-auto">

        {/* Section header */}
        <div className="flex flex-col gap-2 sm:gap-3 mb-8 sm:mb-12">
          <RevealHeading
            className="font-display text-[clamp(36px,4vw,60px)] text-[#1C1714] max-w-xl"
            style={{ lineHeight: 0.95, letterSpacing: '-0.025em' }}
            lines={['Why Filipino Families', <span key="w">Choose <em className="not-italic text-shine">Orange Square</em></span>]}
          />
        </div>

        {/* Stats — each a tilting, spotlight, glow-border card */}
        <Stagger className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-12 sm:mb-16" gap={0.1}>
          {counters.map((c) => (
            <StaggerItem key={c.label} variant="scale">
              <TiltCard className="group h-full" max={8}>
                <SpotlightCard className={`glow-border h-full rounded-2xl border px-6 py-9 sm:px-8 sm:py-10 lift ${
                  c.value === '100%' ? 'bg-[#0B0906] border-[rgba(255,255,255,0.08)]' :
                  c.value === '₱0'   ? 'bg-[rgba(232,93,4,0.06)] border-[rgba(232,93,4,0.2)]' :
                  'bg-[#F5EEE8] border-[rgba(28,23,20,0.09)]'
                }`}>
                  <CountUp
                    value={c.value}
                    className="block font-display text-[clamp(36px,4vw,56px)] text-[#E85D04] tabular-nums"
                    style={{ lineHeight: 1, letterSpacing: '-0.03em' }}
                  />
                  <div className={`text-[11px] mt-3 uppercase tracking-[0.14em] font-medium whitespace-pre-line ${c.value === '100%' ? 'text-[#8A7C68]' : 'text-[#A89070]'}`}>
                    {c.label}
                  </div>
                </SpotlightCard>
              </TiltCard>
            </StaggerItem>
          ))}
        </Stagger>

        {/* Reason list — alternating entrance directions */}
        <Stagger className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-[rgba(28,23,20,0.08)]" gap={0.08}>
          {reasons.map((reason, i) => (
            <StaggerItem
              key={reason.title}
              variant={i % 2 === 0 ? 'left' : 'right'}
              className={`group flex items-start gap-5 py-9 px-0 ${
                i % 2 === 0 ? 'md:pr-12' : 'md:pl-12 md:border-l border-[rgba(28,23,20,0.08)]'
              } border-b border-[rgba(28,23,20,0.08)] last:md:border-b-0`}
            >
              <div className="w-9 h-9 rounded-xl bg-[rgba(232,93,4,0.07)] border border-[rgba(232,93,4,0.15)] flex items-center justify-center shrink-0 mt-0.5 transition-colors duration-300 group-hover:bg-[#E85D04] group-hover:border-[#E85D04]">
                <reason.icon size={16} strokeWidth={1.5} className="text-[#E85D04] transition-colors duration-300 group-hover:text-white" />
              </div>
              <div className="transition-transform duration-300 ease-out group-hover:translate-x-1">
                <h3 className="text-[#1C1714] font-semibold text-[16px] mb-2 tracking-tight">
                  {reason.title}
                </h3>
                <p className="text-[#6E6055] text-[14px] leading-relaxed">{reason.body}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
