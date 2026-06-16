'use client'

import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import {
  ArrowUpRight, Phone, Mail, Clock,
  Zap, ShieldCheck, BadgeCheck,
  CheckCircle, Loader2,
} from 'lucide-react'
import Image from 'next/image'

const EASE = [0.23, 1, 0.32, 1] as const

type FormState = 'idle' | 'loading' | 'success' | 'error'

const TRUST = [
  { Icon: Zap,         text: 'Response within 24 hours'     },
  { Icon: ShieldCheck, text: 'Zero hidden fees, ever'        },
  { Icon: BadgeCheck,  text: 'Pag-IBIG accredited specialist'},
]

export default function ContactSection() {
  const reduced = useReducedMotion()
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    property: '', time: 'Morning',
    pagibig: 'Active Member', message: '',
  })
  const [firstName, setFirstName] = useState('')
  const [formState, setFormState] = useState<FormState>('idle')
  const [error, setError] = useState('')
  const [invalidField, setInvalidField] = useState('')

  const set = (k: keyof typeof form, v: string) => {
    setForm(f => ({ ...f, [k]: v }))
    // Clear the error/invalid highlight as soon as the user edits.
    if (error || invalidField) { setError(''); setInvalidField('') }
  }

  const fail = (field: string, msg: string) => {
    setInvalidField(field)
    setError(msg)
    document.getElementById(`cf-${field}`)?.focus()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formState === 'loading') return // re-entry guard (blocks Enter double-submit)

    // Client-side validation mirrors the API so users get the precise message.
    if (!form.name || form.name.trim().length < 2) return fail('name', 'Please enter your full name.')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email)) return fail('email', 'Please enter a valid email address.')
    if (!/^[+\d\s\-().]{7,20}$/.test(form.phone)) return fail('phone', 'Please enter a valid phone number.')

    setError('')
    setInvalidField('')
    setFirstName(form.name.split(' ')[0])
    setFormState('loading')
    try {
      const res = await fetch('/api/send-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data: { error?: string } = await res.json().catch(() => ({}))
      if (!res.ok) {
        setFormState('error')
        setError(data.error ?? 'Unable to send your inquiry right now. Please call us at +63 956 884 3373.')
        return
      }
      setFormState('success')
    } catch {
      setFormState('error')
      setError('Something went wrong. Please try again or call us directly.')
    }
  }

  const resetForm = () => {
    setFormState('idle')
    setError('')
    setForm({ name: '', email: '', phone: '', property: '', time: 'Morning', pagibig: 'Active Member', message: '' })
  }

  return (
    <section
      id="contact"
      className="relative min-h-[100dvh] flex flex-col lg:flex-row overflow-hidden"
    >
      {/* ── Full-bleed background ── */}
      <Image
        src="https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1800&q=85"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
        aria-hidden
      />
      {/* Gradient overlays — cinema-grade darkness build */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0B0906]/96 via-[#0B0906]/80 to-[#0B0906]/45" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0906]/85 via-transparent to-[#0B0906]/30" />
      {/* Orange ambient glow — bottom left */}
      <div
        className="pointer-events-none absolute -bottom-24 -left-16 w-[520px] h-[380px] rounded-full opacity-30"
        style={{
          background: 'radial-gradient(ellipse, rgba(232,93,4,0.65) 0%, transparent 70%)',
          filter: 'blur(90px)',
        }}
        aria-hidden
      />

      {/* ── LEFT: Editorial panel ── */}
      <div className="relative z-10 flex flex-col justify-end lg:justify-center lg:w-[50%] px-6 sm:px-10 lg:px-16 xl:px-24 pt-10 pb-10 lg:py-32">
        {/* Eyebrow */}
        <motion.div
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08, ease: EASE }}
          className="mb-7"
        >
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[rgba(242,112,36,0.3)] bg-[rgba(232,93,4,0.1)] text-[#F8A56A] text-[10px] uppercase tracking-[0.2em] font-semibold">
            <span className="w-1 h-1 rounded-full bg-[#F27024] animate-pulse" />
            Free Consultation
          </span>
        </motion.div>

        {/* Headline */}
        <div className="overflow-hidden mb-6">
          <motion.h1
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 60, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.9, delay: 0.16, ease: EASE }}
            className="font-display text-[#FBF6EC]"
            style={{
              fontSize: 'clamp(44px, 5.5vw, 86px)',
              lineHeight: 0.92,
              letterSpacing: '-0.03em',
            }}
          >
            Your Dream<br />
            Home Starts<br />
            <em className="not-italic text-[#F27024]">Here.</em>
          </motion.h1>
        </div>

        <motion.p
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.32, ease: EASE }}
          className="text-[#C6B9A4] text-[15px] leading-relaxed max-w-[320px] mb-10"
        >
          Share your budget and location. A specialist reaches out within 24 hours, at no cost.
        </motion.p>

        {/* Trust signals */}
        <motion.ul
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.42, ease: EASE }}
          className="flex flex-col gap-3 mb-10"
        >
          {TRUST.map(({ Icon, text }) => (
            <li key={text} className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-xl bg-[rgba(232,93,4,0.13)] border border-[rgba(232,93,4,0.22)] flex items-center justify-center shrink-0">
                <Icon size={12} className="text-[#F27024]" strokeWidth={2} />
              </div>
              <span className="text-[#E7DCC9] text-[13px]">{text}</span>
            </li>
          ))}
        </motion.ul>

        {/* Contact strip — desktop only */}
        <motion.div
          initial={reduced ? { opacity: 0 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.56, ease: EASE }}
          className="hidden lg:flex flex-col gap-3.5 border-t border-[rgba(255,255,255,0.08)] pt-8"
        >
          <a href="tel:+639568843373" className="group flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.09)] flex items-center justify-center">
              <Phone size={12} className="text-[#F27024]" strokeWidth={1.75} />
            </div>
            <span className="text-[#C6B9A4] text-[12px] font-medium group-hover:text-[#FBF6EC] transition-colors duration-150">
              +63 956 884 3373
            </span>
          </a>
          <a href="mailto:inquiries@orangesquarerealty.com.ph" className="group flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.09)] flex items-center justify-center">
              <Mail size={12} className="text-[#F27024]" strokeWidth={1.75} />
            </div>
            <span className="text-[#C6B9A4] text-[12px] font-medium group-hover:text-[#FBF6EC] transition-colors duration-150 break-all">
              inquiries@orangesquarerealty.com.ph
            </span>
          </a>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.09)] flex items-center justify-center">
              <Clock size={12} className="text-[#F27024]" strokeWidth={1.75} />
            </div>
            <span className="text-[#8A7C68] text-[12px]">Mon-Sat, 8:00 AM - 6:00 PM</span>
          </div>
        </motion.div>
      </div>

      {/* ── RIGHT: Double-Bezel floating form card ── */}
      <div className="relative z-10 flex-1 flex items-center justify-center lg:justify-start px-5 sm:px-8 lg:px-10 xl:px-8 pb-14 pt-2 lg:py-20">
        <motion.div
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 28, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.75, delay: 0.28, ease: EASE }}
          className="w-full max-w-[460px]"
        >
          {/* Outer shell */}
          <div
            className="rounded-[2rem] p-[6px]"
            style={{
              background: 'rgba(253,252,249,0.09)',
              border: '1px solid rgba(253,252,249,0.16)',
              boxShadow: '0 40px 100px rgba(0,0,0,0.65), 0 0 0 1px rgba(253,252,249,0.04)',
            }}
          >
            {/* Inner core */}
            <div
              className="rounded-[calc(2rem-6px)] px-7 py-8"
              style={{
                background: '#FDFCF9',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.95)',
              }}
            >
              {formState === 'success' ? (
                <div className="flex flex-col items-center gap-5 py-10 text-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                    className="w-14 h-14 rounded-full bg-green-50 border border-green-100 flex items-center justify-center"
                  >
                    <CheckCircle size={26} strokeWidth={1.5} className="text-green-600" />
                  </motion.div>
                  <div>
                    <h2
                      className="font-display text-[#1C1714] mb-2"
                      style={{ fontSize: '28px', lineHeight: 0.94, letterSpacing: '-0.025em' }}
                    >
                      You're in good hands.
                    </h2>
                    <p className="text-[#6E6055] text-[14px] leading-relaxed max-w-[240px] mx-auto">
                      Thank you, {firstName}! A specialist will reach out within 24 hours.
                    </p>
                  </div>
                  <button
                    onClick={resetForm}
                    className="mt-1 px-6 py-2.5 rounded-full border border-[rgba(28,23,20,0.12)] text-[#6E6055] text-[12px] font-medium hover:border-[rgba(28,23,20,0.26)] hover:text-[#1C1714] transition-[border-color,color] duration-150 press"
                  >
                    Submit another inquiry
                  </button>
                </div>
              ) : (
                <>
                  {/* Form header */}
                  <div className="mb-6">
                    <h2
                      className="font-display text-[#1C1714] mb-1"
                      style={{ fontSize: 'clamp(24px,2.2vw,32px)', lineHeight: 0.94, letterSpacing: '-0.025em' }}
                    >
                      Tell us your plans.
                    </h2>
                    <p className="text-[#A89070] text-[12px]">Free pre-qualification. No obligations whatsoever.</p>
                  </div>

                  <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
                    {error && (
                      <p role="alert" className="text-red-700 text-[11px] bg-red-50 border border-red-200 rounded-xl px-3 py-2.5 leading-relaxed">
                        {error}
                      </p>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                      <PremiumField id="cf-name"  label="Full Name"  required autoComplete="name"  maxLength={120} invalid={invalidField === 'name'}  value={form.name}  onChange={v => set('name', v)}  placeholder="Juan dela Cruz" />
                      <PremiumField id="cf-email" label="Email"      required type="email" autoComplete="email" maxLength={120} invalid={invalidField === 'email'} value={form.email} onChange={v => set('email', v)} placeholder="juan@email.com" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <PremiumField id="cf-phone"    label="Phone"            required type="tel" autoComplete="tel" inputMode="tel" maxLength={20} invalid={invalidField === 'phone'} value={form.phone}    onChange={v => set('phone', v)}    placeholder="09XX XXX XXXX" />
                      <PremiumField id="cf-property" label="Property Interest" autoComplete="off" maxLength={120}        value={form.property} onChange={v => set('property', v)} placeholder="Cavite, Camella..." />
                    </div>

                    <fieldset>
                      <legend className="text-[10px] font-semibold text-[#A89070] uppercase tracking-[0.15em] mb-2.5">
                        Best Time to Call
                      </legend>
                      <div className="grid grid-cols-3 gap-2">
                        {['Morning', 'Afternoon', 'Evening'].map(t => (
                          <ToggleChip key={t} label={t} active={form.time === t} onClick={() => set('time', t)} />
                        ))}
                      </div>
                    </fieldset>

                    <fieldset>
                      <legend className="text-[10px] font-semibold text-[#A89070] uppercase tracking-[0.15em] mb-2.5">
                        Pag-IBIG Status
                      </legend>
                      <div className="grid grid-cols-2 gap-2">
                        {['Active Member', 'Not Yet a Member'].map(s => (
                          <ToggleChip key={s} label={s} active={form.pagibig === s} onClick={() => set('pagibig', s)} />
                        ))}
                      </div>
                    </fieldset>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="cf-msg" className="text-[10px] font-semibold text-[#A89070] uppercase tracking-[0.15em]">
                        Message{' '}
                        <span className="normal-case tracking-normal font-normal text-[#C4B8A8]">(optional)</span>
                      </label>
                      <div
                        className="rounded-xl p-[3px] transition-[border-color] duration-200 focus-within:border-[rgba(232,93,4,0.4)]"
                        style={{ background: 'rgba(28,23,20,0.03)', border: '1px solid rgba(28,23,20,0.08)' }}
                      >
                        <textarea
                          id="cf-msg"
                          value={form.message}
                          onChange={e => set('message', e.target.value)}
                          placeholder="Budget range, target area, or anything on your mind"
                          rows={2}
                          maxLength={2000}
                          className="w-full px-3 py-2 rounded-[calc(0.75rem-3px)] bg-[#FDFCF9] text-[#1C1714] text-[16px] lg:text-[13px] placeholder:text-[#C4B8A8] focus:outline-none resize-none"
                        />
                      </div>
                    </div>

                    {/* CTA */}
                    <button
                      type="submit"
                      disabled={formState === 'loading'}
                      className="group flex items-center justify-center gap-2 w-full py-3.5 rounded-full bg-[#E85D04] hover:bg-[#F27024] disabled:opacity-60 text-white font-semibold text-[14px] transition-[background-color,box-shadow,transform] duration-[220ms] ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.98] mt-1"
                      style={{ boxShadow: '0 4px 24px rgba(232,93,4,0.32)' }}
                    >
                      {formState === 'loading' ? (
                        <Loader2 size={15} className="animate-spin" aria-label="Sending…" />
                      ) : (
                        <>
                          Get My Free Consult
                          <span className="w-7 h-7 rounded-full bg-black/15 flex items-center justify-center transition-transform duration-[220ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                            <ArrowUpRight size={12} strokeWidth={2.5} />
                          </span>
                        </>
                      )}
                    </button>

                    <p className="text-center text-[#B4A490] text-[11px]">
                      Responds within 24 hours · Mon-Sat 8AM-6PM
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function PremiumField({
  id, label, value, onChange, placeholder, type = 'text', required,
  autoComplete, inputMode, maxLength, invalid,
}: {
  id: string; label: string; value: string;
  onChange: (v: string) => void; placeholder?: string;
  type?: string; required?: boolean;
  autoComplete?: string;
  inputMode?: 'text' | 'tel' | 'email' | 'numeric';
  maxLength?: number; invalid?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[10px] font-semibold text-[#A89070] uppercase tracking-[0.15em]">
        {label}{required && <span className="text-[#E85D04] ml-0.5" aria-hidden>*</span>}
      </label>
      {/* Double-Bezel field */}
      <div
        className="rounded-xl p-[3px] transition-[border-color] duration-200 focus-within:border-[rgba(232,93,4,0.4)]"
        style={{
          background: 'rgba(28,23,20,0.03)',
          border: `1px solid ${invalid ? 'rgba(220,38,38,0.55)' : 'rgba(28,23,20,0.08)'}`,
        }}
      >
        <input
          id={id}
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          aria-required={required || undefined}
          aria-invalid={invalid || undefined}
          autoComplete={autoComplete}
          inputMode={inputMode}
          maxLength={maxLength}
          /* 16px on mobile prevents iOS Safari focus-zoom; tightens to 13px at lg */
          className="w-full h-9 px-3 rounded-[calc(0.75rem-3px)] bg-[#FDFCF9] text-[#1C1714] text-[16px] lg:text-[13px] placeholder:text-[#C4B8A8] focus:outline-none"
        />
      </div>
    </div>
  )
}

function ToggleChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`py-2 rounded-xl text-[12px] font-medium border transition-[background-color,color,border-color,box-shadow,transform] duration-[160ms] ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] ${
        active
          ? 'bg-[#E85D04] text-white border-[#E85D04] shadow-[0_2px_10px_rgba(232,93,4,0.3)]'
          : 'text-[#6E6055] border-[rgba(28,23,20,0.08)] hover:border-[rgba(28,23,20,0.18)]'
      }`}
      style={active ? {} : { background: 'rgba(28,23,20,0.03)' }}
    >
      {label}
    </button>
  )
}
