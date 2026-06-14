'use client'

import { motion, useScroll, useSpring } from 'framer-motion'

// Hairline page-scroll progress indicator — transform-only, GPU composited.
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28, restDelta: 0.001 })

  return (
    <motion.div
      aria-hidden
      className="fixed top-0 inset-x-0 h-[2px] z-50 origin-left bg-gradient-to-r from-[#E85D04] to-[#F27024]"
      style={{ scaleX }}
    />
  )
}
