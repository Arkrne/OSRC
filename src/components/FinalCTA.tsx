'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, CheckCircle } from 'lucide-react'

const EASE = [0.23, 1, 0.32, 1] as const

export default function FinalCTA() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setSent(true)
  }

  return (
    <section className="py-20 sm:py-24 md:py-32 px-5 sm:px-8 lg:px-20 bg-[#F5EEE8]">
      <div className="max-w-[1360px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
          className="relative overflow-hidden rounded-[1.75rem] sm:rounded-[2rem] bg-[#0B0906] px-6 py-12 sm:px-10 sm:py-16 md:px-16 md:py-20"
        >
          {/* Ambient glow */}
          <div className="ambient-glow" aria-hidden />
          <div className="pointer-events-none absolute -top-1/3 right-0 w-[500px] h-[500px] max-w-full opacity-30" style={{ background: 'radial-gradient(ellipse, rgba(232,93,4,0.5) 0%, transparent 65%)', filter: 'blur(90px)' }} />

          <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto">
            <span className="eyebrow on-dark mb-5 sm:mb-6">
              Stay in the Loop
            </span>
            <h2 className="font-display text-[clamp(30px,5vw,68px)] text-[#FBF6EC] mb-5" style={{ lineHeight: 0.95, letterSpacing: '-0.03em' }}>
              New Pag-IBIG Homes,<br /><em className="italic text-[#F27024]">Straight to Your Inbox</em>
            </h2>
            <p className="text-[#C6B9A4] text-[15px] sm:text-[16px] leading-relaxed mb-8 sm:mb-10 max-w-lg">
              Get notified about new property launches, Pag-IBIG rate updates, and
              limited-time promos from our developer partners.
            </p>

            {sent ? (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                className="flex items-center gap-2.5 text-[#FBF6EC]"
              >
                <CheckCircle className="w-6 h-6 text-green-500" />
                <span className="text-[15px] font-medium">You&rsquo;re subscribed! We&rsquo;ll be in touch.</span>
              </motion.div>
            ) : (
              <form onSubmit={submit} className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md">
                <div className="relative w-full">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A7C68]" />
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full h-12 pl-11 pr-4 rounded-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.12)] text-[#FBF6EC] text-[16px] sm:text-[14px] placeholder:text-[#8A7C68] focus:outline-none focus:border-[rgba(242,112,36,0.5)] transition-[border-color] duration-200"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto shrink-0 h-12 px-7 rounded-full bg-[#E85D04] hover:bg-[#F27024] text-white font-semibold text-[14px] transition-[background-color,transform] duration-[160ms] ease-out active:scale-[0.97] whitespace-nowrap"
                >
                  Notify Me
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
