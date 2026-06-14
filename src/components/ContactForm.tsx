'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, ArrowUpRight } from 'lucide-react'
import InquiryModal from './InquiryModal'

const EASE = [0.23, 1, 0.32, 1] as const

export default function ContactSection() {
  const [showModal, setShowModal] = useState(false)

  return (
    <section id="contact" className="relative py-12 sm:py-18 md:py-24 px-5 sm:px-8 lg:px-20 overflow-hidden bg-[#0B0906]">
      {/* Ambient glow */}
      <div className="ambient-glow" aria-hidden />
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] max-w-full opacity-20"
        style={{
          background: 'radial-gradient(ellipse, rgba(232,93,4,0.4) 0%, transparent 65%)',
          filter: 'blur(100px)',
        }}
      />

      <div className="relative z-10 max-w-[1360px] mx-auto">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, ease: EASE }}
          className="mb-8 sm:mb-12"
        >
          <span className="eyebrow on-dark">
            Get in Touch
          </span>
        </motion.div>

        {/* Large editorial CTA headline */}
        <motion.h2
          initial={{ opacity: 0, y: 28, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, delay: 0.06, ease: EASE }}
          className="font-display text-[clamp(38px,6vw,96px)] text-[#FBF6EC] mb-5 sm:mb-6"
          style={{ lineHeight: 0.93, letterSpacing: '-0.03em' }}
        >
          Ready to Own<br />
          <em className="italic text-[#F27024]">Your First Home?</em>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.16, ease: EASE }}
          className="text-[#C6B9A4] text-[15px] sm:text-[17px] leading-relaxed max-w-xl mb-12 sm:mb-16"
        >
          Tell us your budget, preferred location, and family size, and a specialist
          will get back to you within 24 hours. The consultation costs nothing.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.22, ease: EASE }}
          className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:gap-4 mb-16 sm:mb-24"
        >
          <button
            onClick={() => setShowModal(true)}
            className="group flex items-center justify-center gap-2 pl-7 pr-3 py-4 min-h-[52px] rounded-full bg-[#E85D04] hover:bg-[#F27024] text-white font-semibold text-[15px] shadow-[0_0_40px_rgba(232,93,4,0.3)] transition-[background-color,transform] duration-[160ms] ease-out active:scale-[0.97]"
          >
            Send Inquiry Form
            <span className="cta-icon w-8 h-8"><ArrowUpRight size={16} strokeWidth={2.25} /></span>
          </button>
          <a
            href="tel:+639568843373"
            className="flex items-center justify-center gap-2.5 px-7 py-4 min-h-[52px] rounded-full border border-[rgba(255,255,255,0.14)] text-[#C6B9A4] hover:text-[#FBF6EC] hover:border-[rgba(255,255,255,0.3)] font-medium text-[15px] transition-[border-color,color,transform] duration-[160ms] ease-out active:scale-[0.97]"
          >
            <Phone size={15} strokeWidth={1.75} />
            +63 956 884 3373
          </a>
        </motion.div>

        {/* Contact details strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.28, ease: EASE }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-0 border border-[rgba(255,255,255,0.1)] rounded-2xl overflow-hidden"
        >
          <div className="px-6 py-6 sm:px-7 sm:py-7 border-b sm:border-b-0 sm:border-r border-[rgba(255,255,255,0.1)]">
            <p className="text-[10px] text-[#8A7C68] uppercase tracking-[0.16em] font-medium mb-2">Phone</p>
            <a href="tel:+639568843373" className="text-[#FBF6EC] text-[14px] font-medium hover:text-[#F27024] transition-colors duration-150">
              +63 956 884 3373
            </a>
          </div>
          <div className="px-6 py-6 sm:px-7 sm:py-7 border-b sm:border-b-0 sm:border-r border-[rgba(255,255,255,0.1)]">
            <p className="text-[10px] text-[#8A7C68] uppercase tracking-[0.16em] font-medium mb-2">Email</p>
            <a href="mailto:inquiries@orangesquarerealty.com.ph" className="text-[#FBF6EC] text-[13px] font-medium hover:text-[#F27024] transition-colors duration-150 break-all">
              inquiries@orangesquarerealty.com.ph
            </a>
          </div>
          <div className="px-6 py-6 sm:px-7 sm:py-7">
            <p className="text-[10px] text-[#8A7C68] uppercase tracking-[0.16em] font-medium mb-2">Hours</p>
            <p className="text-[#C6B9A4] text-[14px]">Mon–Sat, 8:00 AM – 6:00 PM</p>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showModal && <InquiryModal onClose={() => setShowModal(false)} />}
      </AnimatePresence>
    </section>
  )
}
