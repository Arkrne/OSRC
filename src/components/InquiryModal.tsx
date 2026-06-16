'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { X, Send, CheckCircle, Loader2 } from 'lucide-react'

type Props = {
  propertyName?: string
  onClose: () => void
}
type FormState = 'idle' | 'loading' | 'success' | 'error'

const EASE_OUT = [0.23, 1, 0.32, 1] as const

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

export default function InquiryModal({ propertyName, onClose }: Props) {
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    property: propertyName ?? '',
    time: 'Morning',
    pagibig: 'Active Member',
    message: '',
  })
  const [formState, setFormState] = useState<FormState>('idle')
  const [error, setError]         = useState('')
  const [invalidField, setInvalidField] = useState('')
  const dialogRef  = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLElement | null>(null)

  // Capture trigger element for focus restoration on close
  useEffect(() => {
    triggerRef.current = document.activeElement as HTMLElement
  }, [])

  // Body scroll lock
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  // Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // Focus trap
  const trapFocus = useCallback((e: KeyboardEvent) => {
    if (e.key !== 'Tab' || !dialogRef.current) return
    const nodes = dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)
    const els = Array.from(nodes).filter(el => !el.closest('[hidden]'))
    if (els.length === 0) return
    const first = els[0]
    const last  = els[els.length - 1]
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus() }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus() }
    }
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', trapFocus)
    // Initial focus: first focusable element inside dialog
    const first = dialogRef.current?.querySelector<HTMLElement>(FOCUSABLE)
    first?.focus()
    return () => window.removeEventListener('keydown', trapFocus)
  }, [trapFocus])

  // Focus restoration
  const handleClose = useCallback(() => {
    onClose()
    triggerRef.current?.focus()
  }, [onClose])

  const set = (k: keyof typeof form, v: string) => {
    setForm(f => ({ ...f, [k]: v }))
    if (error || invalidField) { setError(''); setInvalidField('') }
  }

  const fail = (field: string, msg: string) => {
    setInvalidField(field)
    setError(msg)
    document.getElementById(`modal-${field}`)?.focus()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formState === 'loading') return // re-entry guard (blocks Enter double-submit)

    // Client-side validation mirrors the API for precise, immediate feedback.
    if (!form.name || form.name.trim().length < 2) return fail('name', 'Please enter your full name.')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email)) return fail('email', 'Please enter a valid email address.')
    if (!/^[+\d\s\-().]{7,20}$/.test(form.phone)) return fail('phone', 'Please enter a valid phone number.')

    setError('')
    setInvalidField('')
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      aria-hidden="true"
      onClick={e => { if (e.target === e.currentTarget) handleClose() }}
    >
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={propertyName ? `Send inquiry for ${propertyName}` : 'Send inquiry'}
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1,    y: 0  }}
        exit={{ opacity: 0, scale: 0.97, y: 8 }}
        transition={{ duration: 0.3, ease: EASE_OUT }}
        className="bezel-outer w-full max-w-lg max-h-[90vh] overflow-y-auto"
        aria-hidden="false"
      >
        <div className="bezel-inner px-6 py-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="font-semibold text-[#1C1714] text-[17px] tracking-tight">Send Inquiry</h3>
              {propertyName && <p className="text-[12px] text-[#6E6055] mt-1">{propertyName}</p>}
            </div>
            <button
              onClick={handleClose}
              aria-label="Close dialog"
              className="w-8 h-8 rounded-full bg-[rgba(28,23,20,0.05)] hover:bg-[rgba(28,23,20,0.09)] flex items-center justify-center transition-[background-color,transform] duration-[160ms] ease-out active:scale-[0.97]"
            >
              <X size={13} strokeWidth={1.5} className="text-[#6E6055]" />
            </button>
          </div>

          {formState === 'success' ? (
            <div className="flex flex-col items-center gap-4 py-10 text-center">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1,    opacity: 1 }}
                transition={{ type: 'spring', stiffness: 280, damping: 22 }}
              >
                <CheckCircle size={44} strokeWidth={1.5} className="text-green-600" />
              </motion.div>
              <h4 className="text-[#1C1714] font-semibold text-[17px]">Inquiry Sent!</h4>
              <p className="text-[#6E6055] text-[13px] max-w-xs leading-relaxed">
                Thank you, {form.name.split(' ')[0]}! We&apos;ll get back to you within 24 hours.
              </p>
              <button
                onClick={handleClose}
                className="mt-2 px-6 py-2.5 rounded-full bg-[#E85D04] text-white text-[13px] font-medium hover:bg-[#F27024] transition-[background-color,transform] duration-[160ms] ease-out active:scale-[0.97]"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
              {error && (
                <p role="alert" className="text-red-700 text-[12px] bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  {error}
                </p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field id="modal-name"  label="Full Name"  required autoComplete="name"  maxLength={120} invalid={invalidField === 'name'}  value={form.name}  onChange={v => set('name',  v)} placeholder="Juan dela Cruz"  />
                <Field id="modal-email" label="Email" required type="email" autoComplete="email" maxLength={120} invalid={invalidField === 'email'} value={form.email} onChange={v => set('email', v)} placeholder="juan@email.com" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field id="modal-phone" label="Phone" required type="tel" autoComplete="tel" inputMode="tel" maxLength={20} invalid={invalidField === 'phone'} value={form.phone} onChange={v => set('phone', v)} placeholder="09XX XXX XXXX" />
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="modal-property" className="text-[10px] font-medium text-[#A89070] uppercase tracking-wide">
                    Property of Interest{!propertyName && <span className="normal-case tracking-normal font-normal text-[#C4B8A8] ml-1">(optional)</span>}
                  </label>
                  <input
                    id="modal-property"
                    value={form.property}
                    onChange={e => set('property', e.target.value)}
                    placeholder={propertyName ? '' : 'e.g. Catanduanes in Virac, or leave blank'}
                    autoComplete="off"
                    maxLength={120}
                    className="h-11 px-4 rounded-xl bg-[rgba(28,23,20,0.03)] border border-[rgba(28,23,20,0.1)] text-[#1C1714] text-[16px] sm:text-[13px] placeholder:text-[#C4B8A8] focus:outline-none focus:border-[rgba(232,93,4,0.45)] transition-[border-color] duration-200"
                  />
                </div>
              </div>

              <fieldset className="flex flex-col gap-1.5">
                <legend className="text-[10px] font-medium text-[#A89070] uppercase tracking-wide mb-1.5">Best Time to Contact</legend>
                <div className="flex gap-2">
                  {['Morning', 'Afternoon', 'Evening'].map(t => (
                    <button
                      key={t}
                      type="button"
                      aria-pressed={form.time === t}
                      onClick={() => set('time', t)}
                      className={`flex-1 py-2.5 rounded-xl text-[12px] font-medium transition-[background-color,color,transform] duration-[150ms] ease-out active:scale-[0.97] border ${
                        form.time === t
                          ? 'bg-[#E85D04] text-white border-[#E85D04]'
                          : 'bg-transparent text-[#6E6055] border-[rgba(28,23,20,0.1)] hover:text-[#1C1714] hover:border-[rgba(28,23,20,0.2)]'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </fieldset>

              <fieldset className="flex flex-col gap-1.5">
                <legend className="text-[10px] font-medium text-[#A89070] uppercase tracking-wide mb-1.5">Pag-IBIG Membership</legend>
                <div className="flex gap-2">
                  {['Active Member', 'Not Yet a Member'].map(s => (
                    <button
                      key={s}
                      type="button"
                      aria-pressed={form.pagibig === s}
                      onClick={() => set('pagibig', s)}
                      className={`flex-1 py-2.5 rounded-xl text-[12px] font-medium transition-[background-color,color,transform] duration-[150ms] ease-out active:scale-[0.97] border ${
                        form.pagibig === s
                          ? 'bg-[#E85D04] text-white border-[#E85D04]'
                          : 'bg-transparent text-[#6E6055] border-[rgba(28,23,20,0.1)] hover:text-[#1C1714] hover:border-[rgba(28,23,20,0.2)]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </fieldset>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="modal-message" className="text-[10px] font-medium text-[#A89070] uppercase tracking-wide">Message (optional)</label>
                <textarea
                  id="modal-message"
                  value={form.message}
                  onChange={e => set('message', e.target.value)}
                  placeholder="Budget, location, or anything else on your mind"
                  rows={3}
                  maxLength={2000}
                  className="px-4 py-3 rounded-xl bg-[rgba(28,23,20,0.03)] border border-[rgba(28,23,20,0.1)] text-[#1C1714] text-[16px] sm:text-[13px] placeholder:text-[#C4B8A8] focus:outline-none focus:border-[rgba(232,93,4,0.45)] transition-[border-color] duration-200 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={formState === 'loading'}
                className="group flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-[#E85D04] hover:bg-[#F27024] disabled:opacity-60 text-white font-semibold text-[14px] transition-[background-color,transform] duration-[160ms] ease-out active:scale-[0.97] mt-1"
              >
                {formState === 'loading' ? (
                  <Loader2 size={15} className="animate-spin" aria-label="Sending…" />
                ) : (
                  <>
                    Send My Inquiry
                    <span className="w-6 h-6 rounded-full bg-black/15 flex items-center justify-center transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                      <Send size={10} aria-hidden="true" />
                    </span>
                  </>
                )}
              </button>
              <p className="text-center text-[#C4B8A8] text-[11px]">
                We respond within 24 hours · Mon–Sat 8AM–6PM
              </p>
            </form>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

function Field({
  id, label, value, onChange, placeholder, type = 'text',
  required, autoComplete, inputMode, maxLength, invalid,
}: {
  id: string; label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; required?: boolean;
  autoComplete?: string;
  inputMode?: 'text' | 'tel' | 'email' | 'numeric';
  maxLength?: number; invalid?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[10px] font-medium text-[#A89070] uppercase tracking-wide">
        {label}{required && <span className="text-[#E85D04] ml-0.5" aria-hidden>*</span>}
      </label>
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
        /* 16px on mobile prevents iOS Safari focus-zoom; tightens to 13px at sm+ */
        className={`h-11 px-4 rounded-xl bg-[rgba(28,23,20,0.03)] border text-[#1C1714] text-[16px] sm:text-[13px] placeholder:text-[#C4B8A8] focus:outline-none transition-[border-color] duration-200 ${
          invalid ? 'border-[rgba(220,38,38,0.55)]' : 'border-[rgba(28,23,20,0.1)] focus:border-[rgba(232,93,4,0.45)]'
        }`}
      />
    </div>
  )
}
