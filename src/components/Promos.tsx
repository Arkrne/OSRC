'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Tag, Calendar } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type Promo = { id: string; title: string; description: string; valid_until: string | null; badge: string | null }
const EASE = [0.23, 1, 0.32, 1] as const

export default function Promos() {
  const [promos, setPromos]   = useState<Promo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.from('promos').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { setPromos(data ?? []); setLoading(false) })
  }, [])

  if (loading || promos.length === 0) return null

  return (
    <section id="promos" className="py-16 sm:py-20 md:py-28 px-5 sm:px-8 lg:px-20 bg-[#0B0906]">
      <div className="max-w-[1360px] mx-auto">
        <div className="mb-12">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, ease: EASE }} className="mb-5">
            <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#E85D04]">
              <Tag size={12} /> Promos & Discounts
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.08, ease: EASE }}
            className="font-display text-[clamp(32px,3.5vw,56px)] text-[#FBF6EC]"
            style={{ lineHeight: 0.95, letterSpacing: '-0.025em' }}
          >
            Exclusive Deals for You
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {promos.map((promo, i) => (
              <motion.div
                key={promo.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07, ease: EASE }}
                className="p-6 rounded-2xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)] hover:border-[rgba(232,93,4,0.25)] transition-colors"
              >
                {promo.badge && (
                  <span className="inline-block text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full bg-[rgba(232,93,4,0.15)] text-[#E85D04] border border-[rgba(232,93,4,0.2)] mb-4">
                    {promo.badge}
                  </span>
                )}
                <h3 className="text-[#FBF6EC] font-semibold text-[16px] leading-snug mb-3">{promo.title}</h3>
                <p className="text-[#A89070] text-[13px] leading-relaxed mb-4">{promo.description}</p>
                {promo.valid_until && (
                  <div className="flex items-center gap-1.5 text-[#6E6055] text-[11px] pt-3 border-t border-[rgba(255,255,255,0.05)]">
                    <Calendar size={11} strokeWidth={1.5} />
                    Valid until {new Date(promo.valid_until).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                )}
              </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
