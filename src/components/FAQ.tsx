'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { RevealHeading, Reveal, Stagger, StaggerItem } from './motion'

const EASE = [0.23, 1, 0.32, 1] as const

// Adapted from 21st.dev FAQ accordion — themed warm light, framer-motion (no radix)
const faqs = [
  { q: 'Who is eligible for a Pag-IBIG housing loan?', a: 'Any active Pag-IBIG member with at least 24 monthly contributions, not more than 65 years old at loan application, and with the legal capacity to acquire real property. We assess your eligibility for free within 24 hours.' },
  { q: 'How much can I borrow?', a: 'Pag-IBIG offers up to ₱6 million depending on your actual monthly income, capacity to pay, and the property value. Send us your details and we will compute your exact loanable amount.' },
  { q: 'What does OSRC charge for processing?', a: 'We put every fee in writing before you sign anything, and the number never changes after. Pre-qualification costs nothing.' },
  { q: 'Do you handle the entire loan application?', a: 'Yes. We prepare your documents, file them, follow up with Pag-IBIG, and stay on it until the loan is released. You never line up at a branch.' },
  { q: 'Can OFWs apply through OSRC?', a: 'Yes. Our OFW desk processes everything remotely and updates you at every step, so you never need to fly back.' },
  { q: 'Which areas and developers do you cover?', a: 'We work directly with Camella, Lancaster New City, Lumina, Crown Asia, Futura, Bria and more across Cavite, Laguna, Bulacan, and Metro Manila.' },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="py-12 sm:py-18 md:py-24 px-5 sm:px-8 lg:px-20 bg-[#FAFAF7]">
      <div className="max-w-5xl mx-auto grid md:grid-cols-5 gap-10 md:gap-12">
        <div className="md:col-span-2">
          <Reveal variant="fade" className="mb-5">
            <span className="eyebrow">FAQ</span>
          </Reveal>
          <RevealHeading
            lines={['Questions,', 'Answered']}
            delay={0.06}
            className="font-display text-[clamp(32px,3.6vw,52px)] text-[#1C1714] mb-5"
            style={{ lineHeight: 0.95, letterSpacing: '-0.025em' }}
          />
          <Reveal variant="fade" delay={0.18}>
            <p className="text-[#6E6055] text-[15px] leading-relaxed">
              Can't find what you're looking for?{' '}
              <a href="#contact" className="text-[#E85D04] font-medium hover:underline">Talk to our team</a>.
            </p>
          </Reveal>
        </div>

        <Stagger className="md:col-span-3 flex flex-col" gap={0.06} amount={0.1}>
          {faqs.map((item, i) => {
            const isOpen = open === i
            return (
              <StaggerItem key={i} variant="clip" className="border-b border-[rgba(28,23,20,0.1)]">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex items-center justify-between gap-4 w-full text-left py-5 group"
                >
                  <span className={`text-[15px] font-medium transition-colors duration-200 ${isOpen ? 'text-[#E85D04]' : 'text-[#1C1714] group-hover:text-[#6E6055]'}`}>
                    {item.q}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-[#A89070] transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#E85D04]' : ''}`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <p className="text-[#6E6055] text-[14px] leading-relaxed pb-5 pr-8">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </StaggerItem>
            )
          })}
        </Stagger>
      </div>
    </section>
  )
}
