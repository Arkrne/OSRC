'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { ArrowLeft, Plus, Pencil, Trash2, X, Loader2, Search, ArrowUpDown, AlertTriangle } from 'lucide-react'

type Promo = {
  id: string; title: string; description: string
  valid_until: string | null; badge: string | null; created_at: string
}
type Form  = { title: string; description: string; valid_until: string; badge: string }
type SortKey = 'date_desc' | 'date_asc' | 'title_asc' | 'title_desc'

const EMPTY: Form = { title: '', description: '', valid_until: '', badge: '' }

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'date_desc',  label: 'Newest first'  },
  { value: 'date_asc',   label: 'Oldest first'  },
  { value: 'title_asc',  label: 'Title A → Z'   },
  { value: 'title_desc', label: 'Title Z → A'   },
]

function sanitizeText(s: string): string {
  return s.trim().replace(/[\x00-\x1F\x7F]/g, '')
}

const TODAY = new Date().toISOString().split('T')[0]

function isExpired(valid_until: string | null): boolean {
  return !!valid_until && valid_until < TODAY
}
function isExpiringSoon(valid_until: string | null): boolean {
  if (!valid_until || valid_until < TODAY) return false
  const in7 = new Date(Date.now() + 7 * 86_400_000).toISOString().split('T')[0]
  return valid_until <= in7
}

export default function AdminPromos() {
  const [promos,   setPromos]   = useState<Promo[]>([])
  const [loading,  setLoading]  = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing,  setEditing]  = useState<Promo | null>(null)
  const [form,     setForm]     = useState<Form>(EMPTY)
  const [saving,   setSaving]   = useState(false)
  const [error,    setError]    = useState('')
  const [search,   setSearch]   = useState('')
  const [sortBy,   setSortBy]   = useState<SortKey>('date_desc')
  const supabase = createClient()

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    const list = q
      ? promos.filter(p =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.badge ?? '').toLowerCase().includes(q)
        )
      : [...promos]
    switch (sortBy) {
      case 'date_asc':   list.sort((a, b) => a.created_at.localeCompare(b.created_at)); break
      case 'date_desc':  list.sort((a, b) => b.created_at.localeCompare(a.created_at)); break
      case 'title_asc':  list.sort((a, b) => a.title.localeCompare(b.title));           break
      case 'title_desc': list.sort((a, b) => b.title.localeCompare(a.title));           break
    }
    return list
  }, [promos, search, sortBy])

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('promos').select('*').order('created_at', { ascending: false })
    setPromos(data ?? [])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  function openAdd()  { setEditing(null); setForm(EMPTY); setError(''); setShowForm(true) }
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
    const res = await fetch('/api/promos', {
      method: editing ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editing ? { id: editing.id, ...payload } : payload),
    })
    if (!res.ok) { setError('Save failed. Please try again.'); setSaving(false); return }
    setSaving(false); setShowForm(false); load()
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this promo?')) return
    await fetch('/api/promos', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    load()
  }

  const fmt = (d: string) => new Date(d).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' })

  return (
    <div
      className="min-h-screen bg-[#0B0906]"
      style={{ backgroundImage: 'radial-gradient(ellipse 80% 50% at 72% -8%, rgba(232,93,4,0.09) 0%, transparent 55%)' }}
    >
      <div className="max-w-5xl mx-auto px-5 sm:px-8 pt-8 pb-24">

        {/* Page header */}
        <div className="flex items-start gap-4 mb-9">
          <Link
            href="/admin/dashboard"
            className="mt-0.5 w-8 h-8 rounded-lg bg-[#1A1410] border border-[rgba(255,255,255,0.07)] flex items-center justify-center text-[#6E6055] hover:text-[#FBF6EC] transition-colors shrink-0"
          >
            <ArrowLeft size={15} />
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-[#FBF6EC] font-display text-[28px] leading-none tracking-tight">Promos & Discounts</h1>
            <p className="text-[#3A3028] text-[12px] mt-1.5">
              {loading ? 'Loading…' : `${promos.length} promo${promos.length !== 1 ? 's' : ''} total`}
            </p>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#E85D04] text-white text-sm font-medium hover:bg-[#F27024] transition-colors shadow-[0_4px_20px_rgba(232,93,4,0.32)] shrink-0"
          >
            <Plus size={15} /> Add Promo
          </button>
        </div>

        {/* Toolbar */}
        {!loading && promos.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-2 mb-3">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#3A3028] pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search title, description, badge…"
                className="w-full pl-9 pr-8 py-[10px] rounded-xl bg-[#131008] border border-[rgba(255,255,255,0.06)] text-[#EDE5DA] placeholder-[#2A2018] text-[13px] focus:outline-none focus:border-[rgba(232,93,4,0.38)] transition-colors"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded flex items-center justify-center text-[#3A3028] hover:text-[#FBF6EC] transition-colors">
                  <X size={12} />
                </button>
              )}
            </div>
            <div className="relative shrink-0">
              <ArrowUpDown size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3A3028] pointer-events-none" />
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as SortKey)}
                className="w-full sm:w-auto pl-8 pr-4 py-[10px] rounded-xl bg-[#131008] border border-[rgba(255,255,255,0.06)] text-[#EDE5DA] text-[13px] focus:outline-none focus:border-[rgba(232,93,4,0.38)] transition-colors appearance-none cursor-pointer"
              >
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>
        )}

        {/* Search result count */}
        {!loading && search.trim() && (
          <p className="text-[11px] text-[#3A3028] mb-3">
            {filtered.length === 0
              ? `No promos match "${search.trim()}"`
              : `${filtered.length} of ${promos.length} match "${search.trim()}"`}
          </p>
        )}

        {/* States */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={24} className="animate-spin text-[#2A2018]" />
          </div>

        ) : promos.length === 0 ? (
          <div className="text-center py-20 text-[#4A3D35]">
            <p className="mb-3 text-[14px]">No promos yet.</p>
            <button onClick={openAdd} className="text-[#E85D04] text-sm underline">Add your first promo</button>
          </div>

        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <p className="text-[#4A3D35] text-[13px]">No results for &ldquo;{search}&rdquo;</p>
            <button onClick={() => setSearch('')} className="text-[11px] text-[#E85D04] hover:underline">Clear search</button>
          </div>

        ) : (
          <div className="flex flex-col gap-1.5">
            {filtered.map(p => {
              const expired = isExpired(p.valid_until)
              const expiring = isExpiringSoon(p.valid_until)
              return (
                <div
                  key={p.id}
                  className={`group/row relative flex items-center gap-4 px-4 py-3.5 rounded-2xl border transition-all duration-150 overflow-hidden ${
                    expired
                      ? 'bg-[#0D0A06] border-[rgba(255,255,255,0.025)] opacity-55'
                      : 'bg-[#0F0B07] border-[rgba(255,255,255,0.045)] hover:border-[rgba(232,93,4,0.2)] hover:bg-[#150F09]'
                  }`}
                >
                  {/* Hover accent */}
                  {!expired && (
                    <div className="absolute left-0 inset-y-[12px] w-[3px] rounded-r-full bg-gradient-to-b from-[#E85D04] to-[#C8943A] opacity-0 group-hover/row:opacity-100 transition-opacity duration-200" />
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-[#EDE5DA] text-[13.5px] font-semibold truncate">{p.title}</span>
                      {p.badge && (
                        <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-[rgba(232,93,4,0.12)] text-[#E85D04] border border-[rgba(232,93,4,0.2)] shrink-0">
                          {p.badge}
                        </span>
                      )}
                      {expired && (
                        <span className="text-[9px] font-medium px-1.5 py-0.5 rounded border bg-red-500/[0.08] text-red-400/70 border-red-500/[0.12] shrink-0">
                          Expired
                        </span>
                      )}
                      {expiring && (
                        <span className="text-[9px] font-medium px-1.5 py-0.5 rounded border bg-amber-500/[0.08] text-amber-400/70 border-amber-500/[0.12] shrink-0 flex items-center gap-1">
                          <AlertTriangle size={8} /> Expiring soon
                        </span>
                      )}
                    </div>
                    <p className="text-[#4A3D35] text-[11px] truncate">{p.description}</p>
                    {p.valid_until && (
                      <p className={`text-[10px] mt-0.5 ${expired ? 'text-red-400/50' : 'text-[#3A3028]'}`}>
                        Valid until {fmt(p.valid_until)}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => openEdit(p)} title="Edit"
                      className="w-8 h-8 rounded-lg bg-white/[0.03] hover:bg-white/[0.07] border border-transparent hover:border-white/[0.06] flex items-center justify-center text-[#4A3D35] hover:text-[#FBF6EC] transition-all duration-150">
                      <Pencil size={13} />
                    </button>
                    <button onClick={() => handleDelete(p.id)} title="Delete"
                      className="w-8 h-8 rounded-lg bg-white/[0.03] hover:bg-red-500/10 border border-transparent hover:border-red-500/[0.12] flex items-center justify-center text-[#4A3D35] hover:text-red-400/80 transition-all duration-150">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Form modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={e => { if (e.target === e.currentTarget) setShowForm(false) }}
        >
          <div className="w-full max-w-lg bg-[#131008] border border-[rgba(255,255,255,0.07)] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[#FBF6EC] font-semibold">{editing ? 'Edit Promo' : 'Add Promo'}</h2>
              <button onClick={() => setShowForm(false)} className="w-7 h-7 rounded-full bg-[rgba(255,255,255,0.06)] flex items-center justify-center text-[#6E6055] hover:text-[#FBF6EC] transition-colors">
                <X size={13} />
              </button>
            </div>
            <form onSubmit={handleSave} className="flex flex-col gap-4">
              {error && (
                <div className="flex items-start gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20">
                  <AlertTriangle size={14} className="text-red-400 shrink-0 mt-0.5" />
                  <p className="text-red-400 text-[12px]">{error}</p>
                </div>
              )}
              <Field label="Title" value={form.title} onChange={v => setForm(f => ({ ...f, title: v }))} placeholder="e.g. First Home Promo 2026" />
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-medium text-[#6E6055] uppercase tracking-wide">Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Describe the promo or discount…"
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-[#1A1410] border border-[rgba(255,255,255,0.07)] text-[#FBF6EC] placeholder-[#4A3D35] text-sm focus:outline-none focus:border-[rgba(232,93,4,0.5)] transition-colors resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Badge (optional)" value={form.badge} onChange={v => setForm(f => ({ ...f, badge: v }))} placeholder="e.g. HOT DEAL" />
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-medium text-[#6E6055] uppercase tracking-wide">Valid Until (optional)</label>
                  <input
                    type="date"
                    value={form.valid_until}
                    onChange={e => setForm(f => ({ ...f, valid_until: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-[#1A1410] border border-[rgba(255,255,255,0.07)] text-[#FBF6EC] text-sm focus:outline-none focus:border-[rgba(232,93,4,0.5)] transition-colors"
                  />
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

function Field({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-medium text-[#6E6055] uppercase tracking-wide">{label}</label>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl bg-[#1A1410] border border-[rgba(255,255,255,0.07)] text-[#FBF6EC] placeholder-[#4A3D35] text-sm focus:outline-none focus:border-[rgba(232,93,4,0.5)] transition-colors"
      />
    </div>
  )
}
