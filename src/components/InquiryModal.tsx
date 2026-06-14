'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Send, CheckCircle, Loader2 } from 'lucide-react'
type Props = {
  propertyName?: string
  onClose: () => void
}
type FormState = 'idle' | 'loading' | 'success' | 'error'

const EASE_OUT = [0.23, 1, 0.32, 1] as const

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

  const set = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.phone) {
      setError('Please fill in all required fields.')
      return
    }
    setError('')
    setFormState('loading')
    try {
      const res = await fetch('/api/send-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
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
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1,    y: 0  }}
        exit={{ opacity: 0, scale: 0.97, y: 8 }}
        transition={{ duration: 0.3, ease: EASE_OUT }}
        className="bezel-outer w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="bezel-inner px-6 py-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="font-semibold text-[#1C1714] text-[17px] tracking-tight">Send Inquiry</h3>
              {propertyName && <p className="text-[12px] text-[#6E6055] mt-1">{propertyName}</p>}
            </div>
            <button
              onClick={onClose}
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
                onClick={onClose}
                className="mt-2 px-6 py-2.5 rounded-full bg-[#E85D04] text-white text-[13px] font-medium hover:bg-[#F27024] transition-[background-color,transform] duration-[160ms] ease-out active:scale-[0.97]"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {error && (
                <p className="text-red-700 text-[12px] bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  {error}
                </p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Full Name *"     value={form.name}  onChange={v => set('name',  v)} placeholder="Juan dela Cruz"  />
                <Field label="Email *"         type="email" value={form.email} onChange={v => set('email', v)} placeholder="juan@email.com" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Phone *"         type="tel"   value={form.phone} onChange={v => set('phone', v)} placeholder="09XX XXX XXXX" />
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-medium text-[#A89070] uppercase tracking-wide">Property of Interest</label>
                  <input
                    value={form.property}
                    onChange={e => set('property', e.target.value)}
                    placeholder="Which property?"
                    className="h-11 px-4 rounded-xl bg-[rgba(28,23,20,0.03)] border border-[rgba(28,23,20,0.1)] text-[#1C1714] text-[13px] placeholder:text-[#C4B8A8] focus:outline-none focus:border-[rgba(232,93,4,0.45)] transition-[border-color] duration-200"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-medium text-[#A89070] uppercase tracking-wide">Best Time to Contact</label>
                <div className="flex gap-2">
                  {['Morning', 'Afternoon', 'Evening'].map(t => (
                    <button
                      key={t}
                      type="button"
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
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-medium text-[#A89070] uppercase tracking-wide">Pag-IBIG Membership</label>
                <div className="flex gap-2">
                  {['Active Member', 'Not Yet a Member'].map(s => (
                    <button
                      key={s}
                      type="button"
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
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-medium text-[#A89070] uppercase tracking-wide">Message (optional)</label>
                <textarea
                  value={form.message}
                  onChange={e => set('message', e.target.value)}
                  placeholder="Any specific questions or requirements…"
                  rows={3}
                  className="px-4 py-3 rounded-xl bg-[rgba(28,23,20,0.03)] border border-[rgba(28,23,20,0.1)] text-[#1C1714] text-[13px] placeholder:text-[#C4B8A8] focus:outline-none focus:border-[rgba(232,93,4,0.45)] transition-[border-color] duration-200 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={formState === 'loading'}
                className="group flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-[#E85D04] hover:bg-[#F27024] disabled:opacity-60 text-white font-semibold text-[14px] transition-[background-color,transform] duration-[160ms] ease-out active:scale-[0.97] mt-1"
              >
                {formState === 'loading' ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <>
                    Send My Inquiry
                    <span className="w-6 h-6 rounded-full bg-black/15 flex items-center justify-center transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                      <Send size={10} />
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

function Field({ label, value, onChange, placeholder, type = 'text' }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-medium text-[#A89070] uppercase tracking-wide">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-11 px-4 rounded-xl bg-[rgba(28,23,20,0.03)] border border-[rgba(28,23,20,0.1)] text-[#1C1714] text-[13px] placeholder:text-[#C4B8A8] focus:outline-none focus:border-[rgba(232,93,4,0.45)] transition-[border-color] duration-200"
      />
    </div>
  )
}
