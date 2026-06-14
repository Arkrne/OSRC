'use client'

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type CSSProperties,
} from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useVelocity,
  useMotionTemplate,
  animate,
  type Variants,
} from 'framer-motion'

const EASE = [0.23, 1, 0.32, 1] as const

/* ────────────────────────────────────────────────────────────
   RevealHeading — masked, line-by-line kinetic reveal (the Hero's
   language) so every section header arrives cinematically.
   ──────────────────────────────────────────────────────────── */
export function RevealHeading({
  lines,
  className,
  style,
  as = 'h2',
  delay = 0,
}: {
  lines: ReactNode[]
  className?: string
  style?: CSSProperties
  as?: 'h1' | 'h2' | 'h3'
  delay?: number
}) {
  const reduced = useReducedMotion()
  const Tag = as

  return (
    <Tag className={className} style={style}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
          <motion.span
            className="block"
            initial={reduced ? { opacity: 0 } : { y: '110%' }}
            whileInView={reduced ? { opacity: 1 } : { y: '0%' }}
            viewport={{ once: true, margin: '-8% 0px' }}
            transition={{ duration: 0.8, delay: delay + i * 0.09, ease: EASE }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}

/* ────────────────────────────────────────────────────────────
   Reveal — the variety engine. One wrapper, many entrances, so
   the scroll stops feeling like the same fade 21 times. Pick a
   `variant` per section to give each its own personality.
   GPU-only (transform/opacity/filter); collapses to a plain fade
   under reduced-motion.
   ──────────────────────────────────────────────────────────── */
type RevealVariant =
  | 'up'
  | 'down'
  | 'left'
  | 'right'
  | 'scale'
  | 'blur'
  | 'clip'        // wipes up behind a clip-path
  | 'rotate'      // subtle 3D card swing
  | 'fade'

const VARIANTS: Record<RevealVariant, Variants> = {
  up:     { hidden: { opacity: 0, transform: 'translateY(40px)' },                       show: { opacity: 1, transform: 'translateY(0px)' } },
  down:   { hidden: { opacity: 0, transform: 'translateY(-40px)' },                      show: { opacity: 1, transform: 'translateY(0px)' } },
  left:   { hidden: { opacity: 0, transform: 'translateX(-56px)' },                      show: { opacity: 1, transform: 'translateX(0px)' } },
  right:  { hidden: { opacity: 0, transform: 'translateX(56px)' },                       show: { opacity: 1, transform: 'translateX(0px)' } },
  scale:  { hidden: { opacity: 0, transform: 'scale(0.92)' },                            show: { opacity: 1, transform: 'scale(1)' } },
  blur:   { hidden: { opacity: 0, filter: 'blur(14px)', transform: 'translateY(24px)' }, show: { opacity: 1, filter: 'blur(0px)', transform: 'translateY(0px)' } },
  clip:   { hidden: { opacity: 0, clipPath: 'inset(100% 0% 0% 0%)', transform: 'translateY(20px)' }, show: { opacity: 1, clipPath: 'inset(0% 0% 0% 0%)', transform: 'translateY(0px)' } },
  rotate: { hidden: { opacity: 0, transform: 'perspective(1000px) rotateX(18deg) translateY(40px)' }, show: { opacity: 1, transform: 'perspective(1000px) rotateX(0deg) translateY(0px)' } },
  fade:   { hidden: { opacity: 0 },                                                       show: { opacity: 1 } },
}

export function Reveal({
  children,
  variant = 'up',
  delay = 0,
  duration = 0.7,
  className,
  style,
  amount = 0.25,
  once = true,
}: {
  children: ReactNode
  variant?: RevealVariant
  delay?: number
  duration?: number
  className?: string
  style?: CSSProperties
  amount?: number
  once?: boolean
}) {
  const reduced = useReducedMotion()
  const variants = reduced ? VARIANTS.fade : VARIANTS[variant]

  return (
    <motion.div
      className={className}
      style={style}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

/* ────────────────────────────────────────────────────────────
   Stagger — parent/child orchestration for grids & lists, so
   cards cascade in instead of popping together. Wrap items in
   <StaggerItem>.
   ──────────────────────────────────────────────────────────── */
export function Stagger({
  children,
  className,
  style,
  gap = 0.08,
  amount = 0.2,
  once = true,
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
  gap?: number
  amount?: number
  once?: boolean
}) {
  return (
    <motion.div
      className={className}
      style={style}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap } } }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
  children,
  variant = 'up',
  className,
  style,
  duration = 0.6,
}: {
  children: ReactNode
  variant?: RevealVariant
  className?: string
  style?: CSSProperties
  duration?: number
}) {
  const reduced = useReducedMotion()
  const variants = reduced ? VARIANTS.fade : VARIANTS[variant]
  return (
    <motion.div
      className={className}
      style={style}
      variants={variants}
      transition={{ duration, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

/* ────────────────────────────────────────────────────────────
   Parallax — drifts a child against scroll. GPU-only, off under
   reduced-motion. Use for numbers, art, decorative depth.
   ──────────────────────────────────────────────────────────── */
export function Parallax({
  children,
  className,
  distance = 60,
  style,
}: {
  children: ReactNode
  className?: string
  distance?: number
  style?: CSSProperties
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance])

  return (
    <motion.div ref={ref} className={className} style={{ y: reduced ? 0 : y, ...style }}>
      {children}
    </motion.div>
  )
}

/* ────────────────────────────────────────────────────────────
   ScrollImage — scroll-scrubbed scale + parallax for media. The
   image breathes as it crosses the viewport: a real "wow" moment
   that costs nothing on the main thread (transform only).
   ──────────────────────────────────────────────────────────── */
export function ScrollImage({
  children,
  className,
  style,
  scaleFrom = 1.18,
  drift = 40,
  rounded = true,
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
  scaleFrom?: number
  drift?: number
  rounded?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const scale = useTransform(scrollYProgress, [0, 1], [scaleFrom, 1])
  const y = useTransform(scrollYProgress, [0, 1], [drift, -drift])

  return (
    <div
      ref={ref}
      className={className}
      style={{ overflow: 'hidden', borderRadius: rounded ? undefined : 0, ...style }}
    >
      <motion.div
        style={{ scale: reduced ? 1 : scale, y: reduced ? 0 : y, height: '100%', willChange: 'transform' }}
      >
        {children}
      </motion.div>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────
   TiltCard — pointer-driven 3D tilt with a cursor-following
   sheen. Gives cards real depth on hover. Pointer-fine only;
   inert on touch / reduced-motion.
   ──────────────────────────────────────────────────────────── */
export function TiltCard({
  children,
  className,
  style,
  max = 9,
  glare = true,
  glareColor = 'rgba(232,93,4,0.18)',
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
  max?: number
  glare?: boolean
  glareColor?: string
}) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const gx = useMotionValue(50)
  const gy = useMotionValue(50)
  const srx = useSpring(rx, { stiffness: 220, damping: 18 })
  const sry = useSpring(ry, { stiffness: 220, damping: 18 })
  const glareBg = useMotionTemplate`radial-gradient(220px circle at ${gx}% ${gy}%, ${glareColor}, transparent 65%)`

  function onMove(e: React.PointerEvent) {
    if (reduced || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    ry.set((px - 0.5) * max * 2)
    rx.set((0.5 - py) * max * 2)
    gx.set(px * 100)
    gy.set(py * 100)
  }
  function onLeave() {
    rx.set(0)
    ry.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={className}
      style={{
        rotateX: reduced ? 0 : srx,
        rotateY: reduced ? 0 : sry,
        transformStyle: 'preserve-3d',
        transformPerspective: 1000,
        position: 'relative',
        ...style,
      }}
    >
      {children}
      {glare && !reduced && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 [.group:hover_&]:opacity-100"
          style={{ background: glareBg, borderRadius: 'inherit', mixBlendMode: 'screen' }}
        />
      )}
    </motion.div>
  )
}

/* ────────────────────────────────────────────────────────────
   SpotlightCard — a soft radial glow follows the cursor across
   the card surface. Pure CSS var update, no re-render.
   ──────────────────────────────────────────────────────────── */
export function SpotlightCard({
  children,
  className,
  style,
  color = 'rgba(232,93,4,0.14)',
  size = 320,
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
  color?: string
  size?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  function onMove(e: React.PointerEvent) {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - r.left}px`)
    el.style.setProperty('--my', `${e.clientY - r.top}px`)
  }
  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      className={className}
      style={
        {
          position: 'relative',
          '--spot': color,
          '--spot-size': `${size}px`,
        } as CSSProperties
      }
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 [.group:hover_&]:opacity-100"
        style={{
          borderRadius: 'inherit',
          background:
            'radial-gradient(var(--spot-size) circle at var(--mx) var(--my), var(--spot), transparent 70%)',
        }}
      />
      {children}
    </div>
  )
}

/* ────────────────────────────────────────────────────────────
   Magnetic — element drifts toward the cursor, then springs back.
   Use on primary CTAs for a tactile, premium feel.
   ──────────────────────────────────────────────────────────── */
export function Magnetic({
  children,
  className,
  style,
  strength = 0.35,
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
  strength?: number
}) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 260, damping: 16, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 260, damping: 16, mass: 0.4 })

  function onMove(e: React.PointerEvent) {
    if (reduced || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  function reset() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      className={className}
      style={{ x: reduced ? 0 : sx, y: reduced ? 0 : sy, ...style }}
    >
      {children}
    </motion.div>
  )
}

/* ────────────────────────────────────────────────────────────
   VelocityMarquee — a track that scrolls on its own and skews /
   accelerates with scroll velocity. A kinetic ribbon that makes
   the page feel alive between sections.
   ──────────────────────────────────────────────────────────── */
export function VelocityMarquee({
  children,
  baseVelocity = 40,
  className,
  style,
}: {
  children: ReactNode
  baseVelocity?: number
  className?: string
  style?: CSSProperties
}) {
  const reduced = useReducedMotion()
  const baseX = useMotionValue(0)
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const smoothV = useSpring(scrollVelocity, { damping: 50, stiffness: 400 })
  const vFactor = useTransform(smoothV, [0, 1000], [0, 5], { clamp: false })
  const skew = useTransform(smoothV, [-1000, 0, 1000], [-8, 0, 8], { clamp: true })

  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`)
  const dirRef = useRef(1)

  useEffect(() => {
    if (reduced) return
    let frame = 0
    let last = 0
    const loop = (t: number) => {
      if (last) {
        const dt = (t - last) / 1000
        let move = dirRef.current * baseVelocity * dt
        const vf = vFactor.get()
        if (vf < 0) dirRef.current = -1
        else if (vf > 0) dirRef.current = 1
        move += dirRef.current * Math.abs(vf) * baseVelocity * dt
        baseX.set(baseX.get() + move)
      }
      last = t
      frame = requestAnimationFrame(loop)
    }
    frame = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(frame)
  }, [reduced, baseVelocity, baseX, vFactor])

  return (
    <div className={className} style={{ overflow: 'hidden', ...style }}>
      <motion.div
        className="flex w-max flex-nowrap whitespace-nowrap"
        style={{ x: reduced ? 0 : x, skewX: reduced ? 0 : skew }}
      >
        {/* each copy is shrink-0 so the global min-width:0 reset can't
            collapse it and wrap the words into an overlapping jumble */}
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center">{children}</div>
      </motion.div>
    </div>
  )
}

function wrap(min: number, max: number, v: number) {
  const range = max - min
  const mod = (((v - min) % range) + range) % range
  return mod + min
}

/* ────────────────────────────────────────────────────────────
   CountUp — animates a numeric stat from 0 when scrolled into view.
   ──────────────────────────────────────────────────────────── */
export function CountUp({
  value,
  className,
  style,
  duration = 1.5,
}: {
  value: string
  className?: string
  style?: CSSProperties
  duration?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-12% 0px' })
  const reduced = useReducedMotion()

  const match = value.match(/^(\D*?)([\d.,]+)(\D*)$/)
  const prefix = match?.[1] ?? ''
  const numStr = match?.[2] ?? ''
  const suffix = match?.[3] ?? ''
  const target = numStr ? parseFloat(numStr.replace(/,/g, '')) : NaN
  const decimals = numStr.includes('.') ? numStr.split('.')[1].length : 0

  const [display, setDisplay] = useState(reduced ? target : 0)

  useEffect(() => {
    if (!inView || reduced || Number.isNaN(target)) return
    const controls = animate(0, target, {
      duration,
      ease: EASE,
      onUpdate: (v) => setDisplay(v),
    })
    return () => controls.stop()
  }, [inView, reduced, target, duration])

  if (Number.isNaN(target)) {
    return (
      <span ref={ref} className={className} style={style}>
        {value}
      </span>
    )
  }

  return (
    <span ref={ref} className={className} style={style}>
      {prefix}
      {display.toFixed(decimals)}
      {suffix}
    </span>
  )
}
