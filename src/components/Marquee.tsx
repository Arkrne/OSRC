'use client'

import { VelocityMarquee } from './motion'

/* A kinetic ribbon that scrolls on its own and reacts to scroll
   velocity — a living seam between sections. Two stacked rows
   drift in opposite directions for a parallax weave. */

const ROW_A = ['Pag-IBIG Eligible', 'Zero Hidden Fees', 'SEC-Registered', 'Developer Pricing', 'Honest Advice']
const ROW_B = ['Cavite', 'Laguna', 'Bulacan', 'Metro Manila', 'Makati', 'Your Next Home']

function Dot() {
  return (
    <span
      aria-hidden
      className="mx-[0.35em] inline-block h-[0.14em] w-[0.14em] translate-y-[-0.35em] rounded-full bg-[#E85D04] align-middle"
    />
  )
}

export default function Marquee() {
  return (
    <section
      aria-hidden
      className="relative mesh-dark overflow-hidden py-14 sm:py-20 select-none"
    >
      <div className="ambient-glow" />
      {/* top row — outline type, drifts right→left */}
      <VelocityMarquee baseVelocity={8} className="relative z-10 mb-3 sm:mb-4">
        <div className="flex shrink-0 items-center">
          {ROW_A.map((w) => (
            <span key={w} className="flex shrink-0 items-center">
              <span className="marquee-word outline on-dark">{w}</span>
              <Dot />
            </span>
          ))}
        </div>
      </VelocityMarquee>

      {/* bottom row — solid cream, drifts opposite via negative base */}
      <VelocityMarquee baseVelocity={-6} className="relative z-10">
        <div className="flex shrink-0 items-center">
          {ROW_B.map((w, i) => (
            <span key={w} className="flex shrink-0 items-center">
              <span
                className="marquee-word"
                style={{ color: i % 2 === 0 ? '#FBF6EC' : '#F27024' }}
              >
                {w}
              </span>
              <Dot />
            </span>
          ))}
        </div>
      </VelocityMarquee>
    </section>
  )
}
