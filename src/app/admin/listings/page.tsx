'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Plus, Pencil, Trash2, X, Loader2, Star, AlertTriangle, Images } from 'lucide-react'

// ─── Constants ─────────────────────────────────────────────────────────────
const MAX_PHOTOS  = 30
const MAX_BYTES   = 10 * 1024 * 1024   // 10 MB per file
const MAX_DESC    = 5000
const FULL_MAX_W  = 1920
const FULL_MAX_H  = 1080
const FULL_Q      = 0.82
const THUMB_MAX_W = 480
const THUMB_MAX_H = 360
const THUMB_Q     = 0.75
const ALLOWED     = new Set(['image/jpeg', 'image/png', 'image/webp'])

// ─── Types ──────────────────────────────────────────────────────────────────
type Photo = {
  id: string
  file: File | null           // null for DB-loaded photos
  previewUrl: string          // blob: or https: for display
  thumbPreviewUrl: string
  fullBlob: Blob | null       // null for DB-loaded (use existingUrl)
  thumbBlob: Blob | null
  existingUrl: string
  existingThumbUrl: string
  isPortrait: boolean
  origW: number
  origH: number
  tooSmall: boolean
}

type Listing = {
  id: string; title: string; location: string; price: string
  image_url: string; image_urls: string[]; thumbnail_urls: string[]
  main_image_index: number; description: string; created_at: string
}
type Form = { title: string; location: string; price: string; description: string }
const EMPTY_FORM: Form = { title: '', location: '', price: '', description: '' }

// ─── Helpers ─────────────────────────────────────────────────────────────────
function uid() { return Math.random().toString(36).slice(2, 10) }

function sanitizeFilename(n: string) {
  return n.replace(/[^a-zA-Z0-9._-]/g, '_').replace(/\.{2,}/g, '_').replace(/^[._-]+/, '').slice(0, 80)
}
function sanitizeText(s: string) { return s.trim().replace(/[\x00-\x1F\x7F]/g, '') }

function getDisplayImage(l: Listing): string {
  if (l.thumbnail_urls?.length) return l.thumbnail_urls[l.main_image_index ?? 0] ?? l.thumbnail_urls[0]
  if (l.image_urls?.length)     return l.image_urls[l.main_image_index ?? 0] ?? l.image_urls[0]
  return l.image_url ?? ''
}

function loadImg(src: string): Promise<HTMLImageElement> {
  return new Promise((res, rej) => {
    const img = new window.Image()
    img.onload = () => res(img)
    img.onerror = rej
    img.src = src
  })
}

function drawBlob(
  img: HTMLImageElement,
  sx: number, sy: number, sw: number, sh: number,
  maxW: number, maxH: number, q: number
): Promise<Blob> {
  return new Promise(res => {
    const scale = Math.min(1, maxW / sw, maxH / sh)
    const w = Math.round(sw * scale), h = Math.round(sh * scale)
    const c = document.createElement('canvas')
    c.width = w; c.height = h
    c.getContext('2d')!.drawImage(img, sx, sy, sw, sh, 0, 0, w, h)
    c.toBlob(b => res(b!), 'image/jpeg', q)
  })
}

async function processFile(file: File, cropForMain: boolean): Promise<Photo> {
  const objUrl = URL.createObjectURL(file)
  const img    = await loadImg(objUrl)
  const origW  = img.naturalWidth
  const origH  = img.naturalHeight
  const isPortrait = origH > origW
  const longer     = Math.max(origW, origH)
  const shorter    = Math.min(origW, origH)
  const tooSmall   = longer < 1200 || shorter < 800

  // Source crop rect
  let sx = 0, sy = 0, sw = origW, sh = origH
  if (cropForMain && isPortrait) {
    // Center-crop to 4:3 landscape
    sw = origW
    sh = Math.round(origW / (4 / 3))
    sy = Math.round((origH - sh) / 2)
  }

  const [fullBlob, thumbBlob] = await Promise.all([
    drawBlob(img, sx, sy, sw, sh, FULL_MAX_W, FULL_MAX_H, FULL_Q),
    drawBlob(img, sx, sy, sw, sh, THUMB_MAX_W, THUMB_MAX_H, THUMB_Q),
  ])

  URL.revokeObjectURL(objUrl)

  return {
    id: uid(), file,
    previewUrl:      URL.createObjectURL(fullBlob),
    thumbPreviewUrl: URL.createObjectURL(thumbBlob),
    fullBlob, thumbBlob,
    existingUrl: '', existingThumbUrl: '',
    isPortrait, origW, origH, tooSmall,
  }
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function AdminListings() {
  const [listings,    setListings]    = useState<Listing[]>([])
  const [loading,     setLoading]     = useState(true)
  const [showForm,    setShowForm]    = useState(false)
  const [editing,     setEditing]     = useState<Listing | null>(null)
  const [form,        setForm]        = useState<Form>(EMPTY_FORM)
  const [photos,      setPhotos]      = useState<Photo[]>([])
  const [mainIndex,   setMainIndex]   = useState(0)
  const [processing,  setProcessing]  = useState(false)
  const [saving,      setSaving]      = useState(false)
  const [error,       setError]       = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('listings').select('*').order('created_at', { ascending: false })
    setListings(data ?? [])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  function openAdd() {
    setEditing(null); setForm(EMPTY_FORM); setPhotos([]); setMainIndex(0); setError(''); setShowForm(true)
  }

  function openEdit(l: Listing) {
    setEditing(l)
    setForm({ title: l.title, location: l.location, price: l.price, description: l.description ?? '' })
    const fullUrls  = l.image_urls?.length ? l.image_urls : (l.image_url ? [l.image_url] : [])
    const thumbUrls = l.thumbnail_urls ?? []
    const loaded: Photo[] = fullUrls.map((url, i) => ({
      id: uid(), file: null,
      previewUrl: url,
      thumbPreviewUrl: thumbUrls[i] ?? url,
      fullBlob: null, thumbBlob: null,
      existingUrl: url,
      existingThumbUrl: thumbUrls[i] ?? '',
      isPortrait: false, origW: 0, origH: 0, tooSmall: false,
    }))
    setPhotos(loaded)
    setMainIndex(Math.min(l.main_image_index ?? 0, Math.max(0, fullUrls.length - 1)))
    setError(''); setShowForm(true)
  }

  async function addFiles(files: FileList) {
    const remaining = MAX_PHOTOS - photos.length
    if (remaining <= 0) { setError(`Maximum ${MAX_PHOTOS} photos allowed.`); return }
    const list   = Array.from(files).slice(0, remaining)
    const bad    = list.filter(f => !ALLOWED.has(f.type) || f.size > MAX_BYTES)
    const good   = list.filter(f =>  ALLOWED.has(f.type) && f.size <= MAX_BYTES)
    if (bad.length) setError(`${bad.length} file(s) skipped — only JPEG/PNG/WebP under 10 MB.`)
    else setError('')
    if (!good.length) return
    setProcessing(true)
    const processed = await Promise.all(good.map(f => processFile(f, false)))
    setPhotos(prev => [...prev, ...processed])
    setProcessing(false)
  }

  function removePhoto(i: number) {
    setPhotos(prev => prev.filter((_, idx) => idx !== i))
    setMainIndex(prev => prev === i ? 0 : prev > i ? prev - 1 : prev)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    const title       = sanitizeText(form.title)
    const location    = sanitizeText(form.location)
    const price       = sanitizeText(form.price)
    const description = sanitizeText(form.description).slice(0, MAX_DESC)
    if (!title || !location || !price) { setError('Title, location, and price are required.'); return }
    if (!photos.length)                { setError('At least one photo is required.'); return }
    setSaving(true); setError('')

    const fullUrls:  string[] = []
    const thumbUrls: string[] = []

    for (let i = 0; i < photos.length; i++) {
      const p = photos[i]

      if (!p.fullBlob) {
        // DB-loaded — keep existing URLs
        fullUrls.push(p.existingUrl)
        thumbUrls.push(p.existingThumbUrl || p.existingUrl)
        continue
      }

      // Re-process main photo with portrait crop if needed
      let uploadFull  = p.fullBlob
      let uploadThumb = p.thumbBlob!
      if (i === mainIndex && p.isPortrait && p.file) {
        const cropped = await processFile(p.file, true)
        uploadFull  = cropped.fullBlob!
        uploadThumb = cropped.thumbBlob!
      }

      const ts   = Date.now()
      const safe = p.file ? sanitizeFilename(p.file.name.replace(/\.[^.]+$/, '')) : 'photo'
      const fullName  = `${ts}-${i}-${safe}.jpg`
      const thumbName = `thumbnails/${ts}-${i}-${safe}-th.jpg`

      const [r1, r2] = await Promise.all([
        supabase.storage.from('property-images').upload(fullName,  uploadFull,  { upsert: true, contentType: 'image/jpeg' }),
        supabase.storage.from('property-images').upload(thumbName, uploadThumb, { upsert: true, contentType: 'image/jpeg' }),
      ])
      if (r1.error || r2.error) { setError('Upload failed. Please try again.'); setSaving(false); return }

      fullUrls.push(supabase.storage.from('property-images').getPublicUrl(fullName).data.publicUrl)
      thumbUrls.push(supabase.storage.from('property-images').getPublicUrl(thumbName).data.publicUrl)
    }

    const safeMain = Math.min(mainIndex, fullUrls.length - 1)
    const payload  = {
      title, location, price, description,
      image_urls:     fullUrls,
      thumbnail_urls: thumbUrls,
      main_image_index: safeMain,
      image_url: fullUrls[0] ?? '',
    }

    const { error: dbErr } = editing
      ? await supabase.from('listings').update(payload).eq('id', editing.id)
      : await supabase.from('listings').insert(payload)

    if (dbErr) { setError('Save failed. Please try again.'); setSaving(false); return }
    setSaving(false); setShowForm(false); load()
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this listing?')) return
    await supabase.from('listings').delete().eq('id', id)
    load()
  }

  const mainPhoto      = photos[mainIndex]
  const mainIsPortrait = mainPhoto?.isPortrait && !!mainPhoto.file

  return (
    <div className="min-h-screen bg-[#0B0906] p-6 md:p-10">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <Link href="/admin/dashboard" className="w-8 h-8 rounded-lg bg-[#1A1410] border border-[rgba(255,255,255,0.07)] flex items-center justify-center text-[#6E6055] hover:text-[#FBF6EC] transition-colors">
            <ArrowLeft size={15} />
          </Link>
          <h1 className="text-[#FBF6EC] font-display text-2xl flex-1">Property Listings</h1>
          <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#E85D04] text-white text-sm font-medium hover:bg-[#F27024] transition-colors">
            <Plus size={15} /> Add Listing
          </button>
        </div>

        {/* Listings table */}
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 size={24} className="animate-spin text-[#6E6055]" /></div>
        ) : listings.length === 0 ? (
          <div className="text-center py-20 text-[#6E6055]">
            <p className="mb-3">No listings yet.</p>
            <button onClick={openAdd} className="text-[#E85D04] text-sm underline">Add your first listing</button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {listings.map(l => (
              <div key={l.id} className="flex items-center gap-4 p-4 rounded-2xl bg-[#1A1410] border border-[rgba(255,255,255,0.05)]">
                <div className="relative w-16 h-12 rounded-lg overflow-hidden shrink-0 bg-[#2A2018]">
                  {getDisplayImage(l) && <Image src={getDisplayImage(l)} alt={l.title} fill className="object-cover" sizes="64px" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#FBF6EC] text-sm font-medium truncate">{l.title}</p>
                  <p className="text-[#6E6055] text-xs mt-0.5 truncate">{l.location}</p>
                  <p className="text-[#3A3028] text-[10px] mt-0.5">
                    {l.image_urls?.length
                      ? `${l.image_urls.length} photo${l.image_urls.length !== 1 ? 's' : ''}`
                      : l.image_url ? '1 photo' : 'No photos'}
                    {l.description ? ` · ${l.description.length} char description` : ''}
                  </p>
                </div>
                <div className="text-[#C8943A] text-sm font-semibold shrink-0">{l.price}</div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => openEdit(l)} className="w-8 h-8 rounded-lg bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.08)] flex items-center justify-center text-[#6E6055] hover:text-[#FBF6EC] transition-colors">
                    <Pencil size={13} />
                  </button>
                  <button onClick={() => handleDelete(l.id)} className="w-8 h-8 rounded-lg bg-[rgba(255,255,255,0.04)] hover:bg-red-500/20 flex items-center justify-center text-[#6E6055] hover:text-red-400 transition-colors">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-sm"
          onClick={e => { if (e.target === e.currentTarget) setShowForm(false) }}
        >
          <div className="min-h-full flex items-start justify-center p-4 pt-8">
            <div className="relative w-full max-w-3xl bg-[#131008] border border-[rgba(255,255,255,0.07)] rounded-2xl p-6 mb-8">

              {/* Modal header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[#FBF6EC] font-semibold">{editing ? 'Edit Listing' : 'Add Listing'}</h2>
                <button onClick={() => setShowForm(false)} className="w-7 h-7 rounded-full bg-[rgba(255,255,255,0.06)] flex items-center justify-center text-[#6E6055] hover:text-[#FBF6EC] transition-colors">
                  <X size={13} />
                </button>
              </div>

              <form onSubmit={handleSave} className="flex flex-col gap-6">
                {error && (
                  <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">{error}</p>
                )}

                {/* Basic fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Title"    value={form.title}    onChange={v => setForm(f => ({ ...f, title: v }))}    placeholder="e.g. Camella Bucandala" />
                  <Field label="Location" value={form.location} onChange={v => setForm(f => ({ ...f, location: v }))} placeholder="e.g. Imus, Cavite" />
                  <Field label="Price"    value={form.price}    onChange={v => setForm(f => ({ ...f, price: v }))}    placeholder="e.g. ₱2,450,000" className="sm:col-span-2" />
                </div>

                {/* ── Photos section ── */}
                <div>
                  {/* Section header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <label className="text-[10px] font-medium text-[#6E6055] uppercase tracking-wide">Photos</label>
                      <span className="text-[10px] text-[#3A3028] tabular-nums">{photos.length} / {MAX_PHOTOS}</span>
                    </div>
                    <div className="text-[10px] text-[#4A3D35] text-right leading-snug">
                      <span className="text-[#E85D04] font-semibold">★ MAIN:</span> landscape required
                      <span className="mx-1.5 text-[#3A3028]">·</span>
                      Gallery: any orientation
                    </div>
                  </div>

                  {/* Portrait warning banner */}
                  {mainIsPortrait && (
                    <div className="flex items-start gap-2.5 mb-3 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/25">
                      <AlertTriangle size={14} className="text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-amber-300 text-[12px] font-semibold">Main photo is portrait — will be auto-cropped to landscape (4:3) on save.</p>
                        <p className="text-amber-400/60 text-[11px] mt-0.5">For best results, use a landscape photo as the main image (16:9, 4:3, or 3:2).</p>
                      </div>
                    </div>
                  )}

                  {/* Photo grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-2">
                    {photos.map((photo, i) => (
                      <div key={photo.id} className="relative group">
                        <div className={`relative aspect-video rounded-xl overflow-hidden border-2 transition-all duration-150 ${
                          i === mainIndex
                            ? 'border-[#E85D04] shadow-[0_0_0_1px_rgba(232,93,4,0.3)]'
                            : 'border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.14)]'
                        }`}>
                          <Image
                            src={photo.thumbPreviewUrl || photo.previewUrl}
                            alt={`Photo ${i + 1}`}
                            fill
                            className="object-cover"
                            sizes="200px"
                            unoptimized
                          />
                          {/* MAIN badge */}
                          {i === mainIndex && (
                            <div className="absolute top-1 left-1">
                              <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-[#E85D04] text-white tracking-wide">MAIN</span>
                            </div>
                          )}
                          {/* Portrait tag for non-main */}
                          {photo.isPortrait && i !== mainIndex && (
                            <div className="absolute bottom-1 left-1">
                              <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-black/60 text-[#C6B9A4]">Portrait</span>
                            </div>
                          )}
                          {/* Low-res tag */}
                          {photo.tooSmall && (
                            <div className="absolute bottom-1 right-1">
                              <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-amber-600/80 text-white">Low res</span>
                            </div>
                          )}
                        </div>

                        {/* Hover controls */}
                        <div className="absolute top-1 right-1 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                          <button
                            type="button"
                            title="Set as main"
                            onClick={() => setMainIndex(i)}
                            className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors shadow-sm ${
                              i === mainIndex
                                ? 'bg-[#E85D04] text-white'
                                : 'bg-black/65 text-[#8A7C68] hover:text-[#E85D04]'
                            }`}
                          >
                            <Star size={9} fill={i === mainIndex ? 'currentColor' : 'none'} />
                          </button>
                          <button
                            type="button"
                            onClick={() => removePhoto(i)}
                            className="w-5 h-5 rounded-full bg-black/65 text-[#8A7C68] hover:text-red-400 flex items-center justify-center transition-colors shadow-sm"
                          >
                            <X size={9} />
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Add photos slot */}
                    {photos.length < MAX_PHOTOS && (
                      <button
                        type="button"
                        onClick={() => !processing && fileRef.current?.click()}
                        className="relative aspect-video rounded-xl border-2 border-dashed border-[rgba(255,255,255,0.08)] hover:border-[rgba(232,93,4,0.4)] bg-[rgba(255,255,255,0.02)] transition-colors flex flex-col items-center justify-center gap-1.5"
                      >
                        {processing
                          ? <Loader2 size={16} className="text-[#6E6055] animate-spin" />
                          : (
                            <>
                              <Images size={16} className="text-[#4A3D35]" />
                              <span className="text-[9px] text-[#4A3D35] text-center leading-tight px-1">
                                {photos.length === 0 ? 'Add photos' : '+ Add more'}
                              </span>
                            </>
                          )
                        }
                      </button>
                    )}
                  </div>

                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={e => { if (e.target.files) addFiles(e.target.files); e.target.value = '' }}
                    className="hidden"
                  />

                  <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-1">
                    <p className="text-[10px] text-[#3A3028]">JPEG · PNG · WebP &nbsp;·&nbsp; max 10 MB each &nbsp;·&nbsp; up to {MAX_PHOTOS} photos</p>
                    <p className="text-[10px] text-[#3A3028] sm:text-right">Recommended: ≥ 1200 × 800 px · 16:9 · 4:3 · 3:2</p>
                  </div>
                  <p className="text-[10px] text-[#3A3028] mt-0.5">
                    Images are automatically compressed and optimized. Portrait main photos are center-cropped to landscape on save.
                  </p>
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-medium text-[#6E6055] uppercase tracking-wide">Description</label>
                    <span className={`text-[10px] tabular-nums ${form.description.length > MAX_DESC * 0.9 ? 'text-amber-500' : 'text-[#3A3028]'}`}>
                      {form.description.length} / {MAX_DESC}
                    </span>
                  </div>
                  <textarea
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value.slice(0, MAX_DESC) }))}
                    placeholder="Describe the property — location benefits, community features, construction quality, amenities, Pag-IBIG eligibility notes…"
                    rows={6}
                    className="w-full px-4 py-3 rounded-xl bg-[#1A1410] border border-[rgba(255,255,255,0.07)] text-[#FBF6EC] placeholder-[#3A3028] text-sm focus:outline-none focus:border-[rgba(232,93,4,0.5)] transition-colors resize-none leading-relaxed"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 py-3 rounded-xl border border-[rgba(255,255,255,0.07)] text-[#6E6055] text-sm hover:text-[#FBF6EC] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving || processing}
                    className="flex-1 py-3 rounded-xl bg-[#E85D04] text-white text-sm font-medium hover:bg-[#F27024] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {saving
                      ? <><Loader2 size={14} className="animate-spin" /> Uploading…</>
                      : editing ? 'Save Changes' : 'Add Listing'
                    }
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Field({ label, value, onChange, placeholder, className = '' }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; className?: string
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-[10px] font-medium text-[#6E6055] uppercase tracking-wide">{label}</label>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl bg-[#1A1410] border border-[rgba(255,255,255,0.07)] text-[#FBF6EC] placeholder-[#3A3028] text-sm focus:outline-none focus:border-[rgba(232,93,4,0.5)] transition-colors"
      />
    </div>
  )
}
