'use client'

import { motion } from 'framer-motion'

const EASE = [0.23, 1, 0.32, 1] as const

const posts = [
  {
    tag: 'Guide',
    title: 'Pag-IBIG Housing Loan Requirements in 2026',
    excerpt: 'Every document you need to qualify, and how OSRC prepares each one for you.',
    img: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80',
    read: '6 min read',
  },
  {
    tag: 'Tips',
    title: 'How Much Can You Borrow? Computing Your Loanable Amount',
    excerpt: 'Understand how Pag-IBIG calculates your maximum loan based on income and contributions.',
    img: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80',
    read: '5 min read',
  },
  {
    tag: 'For OFWs',
    title: 'Buying a Home While Working Abroad',
    excerpt: 'How to process your Pag-IBIG loan from abroad, step by step, without flying home.',
    img: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80',
    read: '7 min read',
  },
]

export default function Insights() {
  return (
    <section className="py-12 sm:py-18 md:py-24 px-5 sm:px-8 lg:px-20">
      <div className="max-w-[1360px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div className="flex flex-col gap-5 max-w-xl">
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, ease: EASE }}>
              <span className="eyebrow">Insights & Guides</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.08, ease: EASE }}
              className="font-display text-[clamp(34px,4vw,58px)] text-[#1C1714]"
              style={{ lineHeight: 0.95, letterSpacing: '-0.025em' }}
            >
              Learn Before You Buy
            </motion.h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((p, i) => (
            <motion.article
              key={p.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
              className="flex flex-col"
            >
              <div className="relative h-56 rounded-3xl overflow-hidden border border-[rgba(28,23,20,0.08)] mb-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.img} alt="" role="presentation" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
                <span className="absolute top-4 left-4 text-[10px] font-medium px-2.5 py-1 rounded-full bg-white/90 text-[#E85D04] border border-[rgba(232,93,4,0.2)]">{p.tag}</span>
              </div>
              <div className="flex items-center gap-2 text-[#A89070] text-[11px] mb-2">{p.read}</div>
              <h3 className="text-[#1C1714] font-semibold text-[17px] leading-snug tracking-tight mb-2">
                {p.title}
              </h3>
              <p className="text-[#6E6055] text-[14px] leading-relaxed">{p.excerpt}</p>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.25, ease: EASE }}
          className="mt-12 flex justify-center"
        >
          <a
            href="/contact"
            className="inline-flex items-center gap-2 pl-6 pr-5 py-3 rounded-full bg-[#1C1714] hover:bg-[#2E2420] text-[#FBF6EC] text-[13px] font-semibold tracking-tight transition-colors duration-150"
          >
            Have questions? Talk to a specialist
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7M7 7h10v10"/></svg>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
