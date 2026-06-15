'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useMotionValue, animate } from 'framer-motion'
import { STATS } from '@/lib/site'

const EASE = [0.23, 1, 0.32, 1] as const

const stats = [
  { value: STATS.familiesServed, suffix: '+', label: 'Families Served'     },
  { value: 10,                   suffix: '+', label: 'Developer Partners'   },
  { value: Number(STATS.regions),suffix: '',  label: 'Regions Covered'      },
  { value: 24,                   suffix: 'h', label: 'Pre-Qualification'    },
]

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const mv = useMotionValue(0)
  const [display, setDisplay] = useState<number | null>(null)

  useEffect(() => {
    if (!inView) return
    const controls = animate(mv, to, { duration: 1.6, ease: EASE })
    const unsub = mv.on('change', v => setDisplay(Math.round(v)))
    return () => { controls.stop(); unsub() }
  }, [inView, to, mv])

  return <span ref={ref}>{display === null ? '' : `${display}${suffix}`}</span>
}

export default function TrustStats() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28 md:py-32 px-5 sm:px-8 lg:px-20 bg-[#0B0906]">
      <div className="ambient-glow" aria-hidden />
      <div className="relative z-[1] max-w-[1360px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[rgba(255,255,255,0.1)] rounded-3xl overflow-hidden border border-[rgba(255,255,255,0.1)]"
        >
          {stats.map(s => (
            <div key={s.label} className="bg-[#14100B] px-5 py-9 sm:px-8 sm:py-12 flex flex-col items-center text-center">
              <div className="font-display text-[clamp(38px,6vw,72px)] text-[#F27024] leading-none tabular-nums">
                <Counter to={s.value} suffix={s.suffix} />
              </div>
              <div className="text-xs sm:text-[13px] text-[#C6B9A4] mt-2.5 sm:mt-3 uppercase tracking-wider font-medium">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
