'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Phone, ArrowUpRight } from 'lucide-react'

export default function MobileCTABar() {
  const [visible, setVisible] = useState(false)
  const reduced = useReducedMotion()

  useEffect(() => {
    const fn = () => setVisible(window.scrollY > window.innerHeight * 0.85)
    fn()
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={reduced ? { opacity: 0 } : { y: 88, opacity: 0 }}
          animate={reduced ? { opacity: 1 } : { y: 0, opacity: 1 }}
          exit={reduced ? { opacity: 0 } : { y: 88, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          className="md:hidden fixed inset-x-0 bottom-0 z-[25] px-4 pointer-events-none"
          style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 12px)' }}
        >
          <div className="pointer-events-auto flex items-stretch gap-2 p-2 rounded-2xl bg-[rgba(11,9,6,0.88)] backdrop-blur-xl border border-[rgba(255,255,255,0.12)] shadow-[0_12px_40px_rgba(0,0,0,0.45)]">
            <a
              href="tel:+639514342858"
              aria-label="Call Orange Square"
              className="flex items-center justify-center w-12 min-h-[48px] rounded-xl bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] text-[#FBF6EC] active:scale-[0.95] transition-transform duration-150"
            >
              <Phone size={18} strokeWidth={1.75} />
            </a>
            <a
              href="#contact"
              className="flex-1 flex items-center justify-center gap-1.5 min-h-[48px] rounded-xl bg-[#E85D04] text-white font-semibold text-[14px] tracking-tight shadow-[0_4px_20px_rgba(232,93,4,0.45)] active:scale-[0.97] transition-transform duration-150"
            >
              Get Pre-Qualified Free
              <ArrowUpRight size={15} strokeWidth={2.25} />
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
