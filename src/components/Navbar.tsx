'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Phone } from 'lucide-react'
import Link from 'next/link'

const EASE_OUT    = [0.23, 1, 0.32, 1] as const
const EASE_DRAWER = [0.32, 0.72, 0, 1] as const
// Springy, liquid feel — the Dynamic Island language
const SPRING = { type: 'spring', stiffness: 420, damping: 32, mass: 0.9 } as const

const navLinks = [
  { href: '/services',   label: 'Services'   },
  { href: '/properties', label: 'Properties' },
  { href: '/about',      label: 'About'      },
]

const mobileLinks = [
  { href: '/',                      label: 'Home'        },
  { href: '/services',              label: 'Services'    },
  { href: '/services#how-it-works', label: 'How It Works'},
  { href: '/properties',            label: 'Properties'  },
  { href: '/#why-osrc',             label: 'Why Us'      },
  { href: '/about#testimonials',    label: 'Stories'     },
  { href: '/contact#faq',           label: 'FAQ'         },
  { href: '/about',                 label: 'About'       },
]

export default function Navbar() {
  const [isOpen, setIsOpen]     = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden]     = useState(false)
  const lastY = useRef(0)
  const reduced = useReducedMotion()

  // Scroll-direction detection → hide on the way down, reveal on the way up.
  useEffect(() => {
    lastY.current = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 40)
      const delta = y - lastY.current
      if (Math.abs(delta) > 6) {
        if (delta > 0 && y > 180) setHidden(true)   // scrolling down, past the hero
        else setHidden(false)                        // scrolling up
        lastY.current = y
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Mobile menu: lock scroll, close on Escape, and force the bar visible.
  useEffect(() => {
    if (!isOpen) return
    setHidden(false)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [isOpen])

  const visible = !hidden || isOpen

  return (
    <>
      <motion.nav
        className="fixed inset-x-0 top-0 z-40 flex justify-center px-4"
        style={{ paddingTop: 'max(env(safe-area-inset-top), 0px)' }}
        animate={reduced ? undefined : { y: visible ? 0 : '-150%' }}
        transition={SPRING}
      >
        <motion.div
          initial={reduced ? false : { opacity: 0, y: -16, scale: 0.96 }}
          animate={{
            opacity: 1,
            y: 0,
            scale: scrolled ? 0.985 : 1,
            marginTop: scrolled ? 8 : 18,
          }}
          transition={SPRING}
          className={`flex w-full sm:w-auto items-center justify-between sm:justify-start gap-3 sm:gap-8 rounded-full border transition-[background-color,border-color,box-shadow] duration-300 ${
            scrolled
              ? 'px-3.5 sm:px-5 py-2 bg-[rgba(250,250,247,0.92)] backdrop-blur-xl border-[rgba(28,23,20,0.12)] shadow-[0_10px_40px_rgba(28,23,20,0.16)]'
              : 'px-4 sm:px-5 py-2.5 bg-[rgba(250,250,247,0.72)] backdrop-blur-md border-[rgba(28,23,20,0.08)] shadow-[0_2px_18px_rgba(28,23,20,0.06)]'
          }`}
        >
          {/* Logo wordmark + live pulse dot (the Dynamic Island tell) */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group/logo">
            <span className="relative w-7 h-7 rounded-[0.7rem] bg-[#E85D04] flex items-center justify-center shadow-[0_0_14px_rgba(232,93,4,0.4)] transition-transform duration-300 group-hover/logo:scale-105">
              <span className="text-white font-bold text-[9px] tracking-widest">OS</span>
              <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                {!reduced && (
                  <span className="absolute inline-flex h-full w-full rounded-full bg-[#3CCB7F] opacity-75 animate-ping" />
                )}
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#3CCB7F] ring-2 ring-[#FAFAF7]" />
              </span>
            </span>
            <span className="text-[13px] font-semibold text-[#1C1714] tracking-tight">
              Orange Square
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="ul-draw text-[13px] text-[#6E6055] hover:text-[#1C1714] transition-colors duration-150 font-medium pb-0.5"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right cluster */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Desktop CTA */}
            <Link
              href="/contact"
              className="hidden md:flex items-center gap-2 pl-4 pr-3 py-2 rounded-full bg-[#E85D04] hover:bg-[#F27024] text-white text-[12px] font-semibold tracking-tight transition-[background-color,transform] duration-[160ms] ease-out active:scale-[0.97] group"
            >
              Get Free Consult
              <span className="cta-icon">
                <ArrowUpRight size={11} strokeWidth={2.5} />
              </span>
            </Link>

            {/* Mobile compact CTA — keeps the bar feeling intentional, not empty */}
            <Link
              href="/contact"
              className="flex md:hidden items-center gap-1.5 pl-3.5 pr-3 min-h-[40px] rounded-full bg-[#E85D04] text-white text-[12px] font-semibold tracking-tight press"
            >
              Consult
              <span className="w-4 h-4 rounded-full bg-black/15 flex items-center justify-center">
                <ArrowUpRight size={10} strokeWidth={2.75} />
              </span>
            </Link>

            {/* Hamburger — morphs to X */}
            <button
              onClick={() => setIsOpen((v) => !v)}
              className="md:hidden relative w-11 h-11 -mr-1.5 flex flex-col items-center justify-center press"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
            >
              <span
                className="absolute block w-[18px] h-[1.5px] bg-[#1C1714] origin-center transition-transform duration-[240ms] ease-[cubic-bezier(0.32,0.72,0,1)]"
                style={{ transform: isOpen ? 'rotate(45deg)' : 'translateY(-4px)' }}
              />
              <span
                className="absolute block w-[18px] h-[1.5px] bg-[#1C1714] origin-center transition-[transform,opacity] duration-[240ms] ease-[cubic-bezier(0.32,0.72,0,1)]"
                style={{ opacity: isOpen ? 0 : 1, transform: isOpen ? 'scaleX(0.4)' : 'scaleX(1)' }}
              />
              <span
                className="absolute block w-[18px] h-[1.5px] bg-[#1C1714] origin-center transition-transform duration-[240ms] ease-[cubic-bezier(0.32,0.72,0,1)]"
                style={{ transform: isOpen ? 'rotate(-45deg)' : 'translateY(4px)' }}
              />
            </button>
          </div>
        </motion.div>
      </motion.nav>

      {/* Full-screen menu — premium dark "island expansion" */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ clipPath: 'circle(0% at 92% 6%)', opacity: 0.6 }}
            animate={{ clipPath: 'circle(150% at 92% 6%)', opacity: 1 }}
            exit={{ clipPath: 'circle(0% at 92% 6%)', opacity: 0.4 }}
            transition={{ duration: 0.5, ease: EASE_DRAWER }}
            className="fixed inset-0 z-30 mesh-dark flex flex-col"
            style={{
              paddingTop: 'max(env(safe-area-inset-top), 0px)',
              paddingBottom: 'max(env(safe-area-inset-bottom), 0px)',
            }}
          >
            <div className="ambient-glow" />
            <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-1 px-6 py-4 overflow-y-auto">
              {mobileLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ delay: 0.08 + i * 0.05, duration: 0.45, ease: EASE_OUT }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="font-display text-[36px] sm:text-[48px] text-[#FBF6EC] hover:text-[#F27024] transition-colors duration-200"
                    style={{ lineHeight: 1.1 }}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.08 + mobileLinks.length * 0.05, duration: 0.45, ease: EASE_OUT }}
              >
                <Link
                  href="/contact"
                  onClick={() => setIsOpen(false)}
                  className="group mt-8 flex items-center gap-2 pl-7 pr-5 py-4 rounded-full bg-[#E85D04] text-white font-semibold text-base active:scale-[0.97] transition-transform hover:bg-[#F27024]"
                >
                  Get Free Consult
                  <span className="cta-icon">
                    <ArrowUpRight size={15} strokeWidth={2.5} />
                  </span>
                </Link>
              </motion.div>
            </div>

            {/* Contact footer inside the menu */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="relative z-10 flex items-center justify-center gap-2 pb-8 text-[#C6B9A4] text-[13px]"
            >
              <Phone size={13} strokeWidth={1.75} className="text-[#F27024]" />
              <a href="tel:+639000000000" className="tracking-wide">Talk to a specialist today</a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
