'use client'

import { Award, ShieldCheck, Star, Building2, Users } from 'lucide-react'
import { Stagger, StaggerItem, TiltCard, SpotlightCard } from './motion'

const badges = [
  { icon: ShieldCheck, label: 'SEC Registered',          sub: 'OPC-2024-OSRC-00142' },
  { icon: Award,       label: 'Accredited Partner',      sub: '6+ top developers' },
  { icon: Star,        label: '4.9 / 5 Client Rating',   sub: 'Based on referrals' },
  { icon: Building2,   label: 'Pag-IBIG Authorized',     sub: 'Loan processing' },
  { icon: Users,       label: '120+ Families Served',    sub: 'Since 2024' },
]

export default function Awards() {
  return (
    <section className="py-14 sm:py-16 md:py-24 px-5 sm:px-8 lg:px-20 border-y border-[rgba(28,23,20,0.08)]">
      <div className="max-w-[1360px] mx-auto">
        <Stagger className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4" gap={0.08}>
          {badges.map((b, i) => (
            <StaggerItem
              key={b.label}
              variant="scale"
              className={i === badges.length - 1 ? 'col-span-2 md:col-span-1 flex justify-center' : undefined}
            >
              <TiltCard className={`group h-full${i === badges.length - 1 ? ' w-full max-w-[calc(50%-8px)] md:max-w-none' : ''}`} max={10}>
                <SpotlightCard className="glow-border h-full rounded-2xl border border-[rgba(28,23,20,0.07)] bg-[#FAFAF7] px-5 py-7 flex flex-col items-center text-center gap-2.5 lift">
                  <div className="w-12 h-12 rounded-2xl bg-[rgba(232,93,4,0.07)] border border-[rgba(232,93,4,0.15)] flex items-center justify-center transition-colors duration-300 group-hover:bg-[#E85D04] group-hover:border-[#E85D04]" style={{ transform: 'translateZ(28px)' }}>
                    <b.icon size={20} strokeWidth={1.5} className="text-[#E85D04] transition-colors duration-300 group-hover:text-white" />
                  </div>
                  <div style={{ transform: 'translateZ(16px)' }}>
                    <p className="text-[#1C1714] font-semibold text-[13px] leading-tight">{b.label}</p>
                    <p className="text-[#A89070] text-[11px] mt-0.5">{b.sub}</p>
                  </div>
                </SpotlightCard>
              </TiltCard>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
