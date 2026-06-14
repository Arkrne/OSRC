'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Calculator, ArrowUpRight } from 'lucide-react'

const EASE = [0.23, 1, 0.32, 1] as const

const peso = (n: number) =>
  '₱' + Math.round(n).toLocaleString('en-PH')

export default function LoanCalculator() {
  const [price, setPrice]   = useState(2_500_000)
  const [down, setDown]     = useState(10)       // % down payment
  const [years, setYears]   = useState(25)        // loan term
  const rate = 0.0625                              // 6.25% Pag-IBIG annual

  const monthly = useMemo(() => {
    const principal = price * (1 - down / 100)
    const r = rate / 12
    const n = years * 12
    return (principal * r) / (1 - Math.pow(1 + r, -n))
  }, [price, down, years])

  return (
    <section className="py-12 sm:py-18 md:py-24 px-5 sm:px-8 lg:px-20 bg-[#F5EEE8]">
      <div className="max-w-[1360px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-20 items-center">

        {/* Left — copy */}
        <div className="flex flex-col gap-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <span className="eyebrow">
              <Calculator size={12} strokeWidth={1.5} /> Loan Estimator
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.08, ease: EASE }}
            className="font-display text-[clamp(34px,4vw,56px)] text-[#1C1714]"
            style={{ lineHeight: 0.95, letterSpacing: '-0.025em' }}
          >
            Estimate Your
            <br /><em className="italic text-[#E85D04]">Monthly Amortization</em>
          </motion.h2>
          <p className="text-[#6E6055] text-[16px] leading-relaxed max-w-md">
            Adjust the price, down payment, and term to see a sample Pag-IBIG monthly
            payment at 6.25% p.a. For a precise, free pre-qualification, send us an inquiry.
          </p>
        </div>

        {/* Right — interactive calculator card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.12, ease: EASE }}
          className="bezel-outer"
        >
          <div className="bezel-inner p-6 sm:p-8 flex flex-col gap-7">
            <Slider label="Property Price" value={peso(price)} min={890_000} max={8_000_000} step={50_000} v={price} onChange={setPrice} />
            <Slider label="Down Payment" value={`${down}%`} min={5} max={30} step={1} v={down} onChange={setDown} />
            <Slider label="Loan Term" value={`${years} years`} min={5} max={30} step={1} v={years} onChange={setYears} />

            <div className="mt-2 pt-6 border-t border-[rgba(28,23,20,0.08)]">
              <p className="text-[10px] uppercase tracking-[0.16em] text-[#A89070] font-medium mb-2">Estimated Monthly</p>
              <div className="font-display text-[clamp(40px,6vw,56px)] text-[#E85D04] leading-none">
                {peso(monthly)}
              </div>
              <p className="text-[#6E6055] text-[12px] mt-3">
                Loanable amount: {peso(price * (1 - down / 100))} · {years * 12} payments
              </p>
            </div>
            <a
              href="/contact"
              className="group inline-flex items-center justify-center gap-2 w-full min-h-[48px] py-3.5 rounded-full bg-[#0B0906] hover:bg-black text-white font-semibold text-[14px] transition-[background-color,transform] duration-[160ms] ease-out active:scale-[0.97]"
            >
              Get Free Pre-Qualification
              <span className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"><ArrowUpRight size={14} strokeWidth={2.25} /></span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function Slider({ label, value, min, max, step, v, onChange }: {
  label: string; value: string; min: number; max: number; step: number; v: number; onChange: (n: number) => void
}) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <label className="text-[12px] font-medium text-[#6E6055]">{label}</label>
        <span className="text-[14px] font-semibold text-[#1C1714] tabular-nums">{value}</span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step} value={v}
        onChange={e => onChange(Number(e.target.value))}
        className="osrc-range w-full"
      />
      <style>{`
        .osrc-range { -webkit-appearance: none; appearance: none; height: 4px; border-radius: 999px; background: rgba(28,23,20,0.12); outline: none; }
        .osrc-range::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 20px; height: 20px; border-radius: 999px; background: #E85D04; cursor: pointer; border: 3px solid #fff; box-shadow: 0 1px 6px rgba(232,93,4,0.4); transition: transform 160ms cubic-bezier(0.23,1,0.32,1); }
        .osrc-range::-webkit-slider-thumb:active { transform: scale(1.15); }
        .osrc-range::-moz-range-thumb { width: 20px; height: 20px; border-radius: 999px; background: #E85D04; cursor: pointer; border: 3px solid #fff; box-shadow: 0 1px 6px rgba(232,93,4,0.4); }
      `}</style>
    </div>
  )
}
