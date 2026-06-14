'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { ArrowLeft, Plus, Pencil, Trash2, X, Loader2 } from 'lucide-react'

type Promo = { id: string; title: string; description: string; valid_until: string | null; badge: string | null; created_at: string }
type Form  = { title: string; description: string; valid_until: string; badge: string }
const EMPTY: Form = { title: '', description: '', valid_until: '', badge: '' }

function sanitizeText(s: string): string {
  return s.trim().replace(/[\x00-\x1F\x7F]/g, '')
}

export default function AdminPromos() {
  const [promos, setPromos]     = useState<Promo[]>([])
  const [loading, setLoading]   = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing]   = useState<Promo | null>(null)
  const [form, setForm]         = useState<Form>(EMPTY)
  const [saving, setSaving]     = useState(false)
  const [error, setError]       = useState('')
  const supabase                = createClient()

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('promos').select('*').order('created_at', { ascending: false })
    setPromos(data ?? [])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  function openAdd() { setEditing(null); setForm(EMPTY); setError(''); setShowForm(true) }
  function openEdit(p: Promo) {
    setEditing(p)
    setForm({ title: p.title, description: p.description, valid_until: p.valid_until?.slice(0, 10) ?? '', badge: p.badge ?? '' })
    setError(''); setShowForm(true)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    const title       = sanitizeText(form.title)
    const description = sanitizeText(form.description)
    const badge       = sanitizeText(form.badge)
    if (!title || !description) { setError('Title and description are required.'); return }
    setSaving(true); setError('')
    const payload = { title, description, valid_until: form.valid_until || null, badge: badge || null }
    const { error: dbErr } = editing
      ? await supabase.from('promos').update(payload).eq('id', editing.id)
      : await supabase.from('promos').insert(payload)
    if (dbErr) { setError('Save failed. Please try again.'); setSaving(false); return }
    setSaving(false); setShowForm(false); load()
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this promo?')) return
    await supabase.from('promos').delete().eq('id', id)
    load()
  }

  const fmt = (d: string) => new Date(d).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' })

  return (
    <div className="min-h-screen bg-[#0B0906] p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <Link href="/admin/dashboard" className="w-8 h-8 rounded-lg bg-[#1A1410] border border-[rgba(255,255,255,0.07)] flex items-center justify-center text-[#6E6055] hover:text-[#FBF6EC] transition-colors">
            <ArrowLeft size={15} />
          </Link>
          <h1 className="text-[#FBF6EC] font-display text-2xl flex-1">Promos & Discounts</h1>
          <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#E85D04] text-white text-sm font-medium hover:bg-[#F27024] transition-colors">
            <Plus size={15} /> Add Promo
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 size={24} className="animate-spin text-[#6E6055]" /></div>
        ) : promos.length === 0 ? (
          <div className="text-center py-20 text-[#6E6055]">
            <p className="mb-3">No promos yet.</p>
            <button onClick={openAdd} className="text-[#E85D04] text-sm underline">Add your first promo</button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {promos.map(p => (
              <div key={p.id} className="flex items-center gap-4 p-4 rounded-2xl bg-[#1A1410] border border-[rgba(255,255,255,0.05)]">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[#FBF6EC] text-sm font-medium truncate">{p.title}</span>
                    {p.badge && <span className="text-[10px] px-2 py-0.5 rounded-full bg-[rgba(232,93,4,0.15)] text-[#E85D04] border border-[rgba(232,93,4,0.2)] shrink-0">{p.badge}</span>}
                  </div>
                  <p className="text-[#6E6055] text-xs truncate">{p.description}</p>
                  {p.valid_until && <p className="text-[#A89070] text-[11px] mt-1">Valid until {fmt(p.valid_until)}</p>}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => openEdit(p)} className="w-8 h-8 rounded-lg bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.08)] flex items-center justify-center text-[#6E6055] hover:text-[#FBF6EC] transition-colors"><Pencil size={13} /></button>
                  <button onClick={() => handleDelete(p.id)} className="w-8 h-8 rounded-lg bg-[rgba(255,255,255,0.04)] hover:bg-red-500/20 flex items-center justify-center text-[#6E6055] hover:text-red-400 transition-colors"><Trash2 size={13} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={e => { if (e.target === e.currentTarget) setShowForm(false) }}>
          <div className="w-full max-w-lg bg-[#131008] border border-[rgba(255,255,255,0.07)] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[#FBF6EC] font-semibold">{editing ? 'Edit Promo' : 'Add Promo'}</h2>
              <button onClick={() => setShowForm(false)} className="w-7 h-7 rounded-full bg-[rgba(255,255,255,0.06)] flex items-center justify-center text-[#6E6055] hover:text-[#FBF6EC] transition-colors"><X size={13} /></button>
            </div>
            <form onSubmit={handleSave} className="flex flex-col gap-4">
              {error && <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">{error}</p>}
              <Field label="Title" value={form.title} onChange={v => setForm(f => ({ ...f, title: v }))} placeholder="e.g. First Home Promo 2026" />
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-medium text-[#6E6055] uppercase tracking-wide">Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe the promo or discount…" rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-[#1A1410] border border-[rgba(255,255,255,0.07)] text-[#FBF6EC] placeholder-[#4A3D35] text-sm focus:outline-none focus:border-[rgba(232,93,4,0.5)] transition-colors resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Badge (optional)" value={form.badge} onChange={v => setForm(f => ({ ...f, badge: v }))} placeholder="e.g. HOT DEAL" />
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-medium text-[#6E6055] uppercase tracking-wide">Valid Until (optional)</label>
                  <input type="date" value={form.valid_until} onChange={e => setForm(f => ({ ...f, valid_until: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-[#1A1410] border border-[rgba(255,255,255,0.07)] text-[#FBF6EC] text-sm focus:outline-none focus:border-[rgba(232,93,4,0.5)] transition-colors" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3 rounded-xl border border-[rgba(255,255,255,0.07)] text-[#6E6055] text-sm hover:text-[#FBF6EC] transition-colors">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-3 rounded-xl bg-[#E85D04] text-white text-sm font-medium hover:bg-[#F27024] transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                  {saving ? <Loader2 size={14} className="animate-spin" /> : (editing ? 'Save Changes' : 'Add Promo')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-medium text-[#6E6055] uppercase tracking-wide">{label}</label>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl bg-[#1A1410] border border-[rgba(255,255,255,0.07)] text-[#FBF6EC] placeholder-[#4A3D35] text-sm focus:outline-none focus:border-[rgba(232,93,4,0.5)] transition-colors" />
    </div>
  )
}
