'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { makeSlug } from '@/lib/listings'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Plus, Pencil, Trash2, X, Loader2, Star, Images, Save, Search, ArrowUpDown, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react'

// ─── Constants ─────────────────────────────────────────────────────────────
const MAX_PHOTOS  = 30
const MAX_BYTES   = 10 * 1024 * 1024
const MAX_DESC    = 5000
const FULL_MAX_W  = 1920
const FULL_MAX_H  = 1080
const FULL_Q      = 0.88
const THUMB_MAX_W = 640
const THUMB_MAX_H = 360
const THUMB_Q     = 0.85
const ALLOWED     = new Set(['image/jpeg', 'image/png', 'image/webp'])

const REGIONS = [
  { label: 'NCR', options: [
    { value: 'Metro Manila', label: 'Metro Manila (NCR)' },
  ]},
  { label: 'Luzon', options: [
    { value: 'Ilocos Region',   label: 'Ilocos Region (Region I)'   },
    { value: 'Cagayan Valley',  label: 'Cagayan Valley (Region II)' },
    { value: 'Central Luzon',   label: 'Central Luzon (Region III)' },
    { value: 'CALABARZON',     label: 'CALABARZON (Region IV-A)'  },
    { value: 'MIMAROPA',       label: 'MIMAROPA (Region IV-B)'    },
    { value: 'Bicol Region',   label: 'Bicol Region (Region V)'   },
    { value: 'CAR',            label: 'CAR (Cordillera)'          },
  ]},
  { label: 'Visayas', options: [
    { value: 'Western Visayas', label: 'Western Visayas (Region VI)'   },
    { value: 'Central Visayas', label: 'Central Visayas (Region VII)'  },
    { value: 'Eastern Visayas', label: 'Eastern Visayas (Region VIII)' },
  ]},
  { label: 'Mindanao', options: [
    { value: 'Zamboanga Peninsula', label: 'Zamboanga Peninsula (Region IX)' },
    { value: 'Northern Mindanao',   label: 'Northern Mindanao (Region X)'    },
    { value: 'Davao Region',        label: 'Davao Region (Region XI)'        },
    { value: 'SOCCSKSARGEN',        label: 'SOCCSKSARGEN (Region XII)'       },
    { value: 'Caraga',              label: 'Caraga (Region XIII)'            },
    { value: 'BARMM',               label: 'BARMM (Bangsamoro)'             },
  ]},
] as const

const PROPERTY_TYPES = [
  { label: 'Residential', options: [
    { value: 'House & Lot',           label: 'House & Lot'           },
    { value: 'Townhouse',             label: 'Townhouse'             },
    { value: 'Row House',             label: 'Row House'             },
    { value: 'Duplex',                label: 'Duplex'                },
    { value: 'Condominium Unit',      label: 'Condominium Unit'      },
    { value: 'Studio Unit',           label: 'Studio Unit'           },
    { value: 'Apartment / Flat',      label: 'Apartment / Flat'      },
    { value: 'Lot Only',              label: 'Lot Only'              },
    { value: 'Foreclosed Property',   label: 'Foreclosed Property'   },
  ]},
  { label: 'Commercial', options: [
    { value: 'Commercial Space',       label: 'Commercial Space'       },
    { value: 'Office Space',           label: 'Office Space'           },
    { value: 'Warehouse / Industrial', label: 'Warehouse / Industrial' },
  ]},
  { label: 'Special Use', options: [
    { value: 'Farm Lot / Agricultural', label: 'Farm Lot / Agricultural' },
    { value: 'Memorial Lot',            label: 'Memorial Lot'            },
  ]},
] as const

// ─── Sort ───────────────────────────────────────────────────────────────────
type SortKey = 'date_desc' | 'date_asc' | 'title_asc' | 'title_desc' | 'price_asc' | 'price_desc'

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'date_desc',  label: 'Newest first'     },
  { value: 'date_asc',   label: 'Oldest first'     },
  { value: 'title_asc',  label: 'Title A → Z'      },
  { value: 'title_desc', label: 'Title Z → A'      },
  { value: 'price_asc',  label: 'Price low → high' },
  { value: 'price_desc', label: 'Price high → low' },
]

function parsePriceNum(p: string) {
  return parseInt(p.replace(/[^0-9]/g, ''), 10) || 0
}

// ─── Types ──────────────────────────────────────────────────────────────────
type Photo = {
  id: string
  file: File | null
  previewUrl: string
  thumbPreviewUrl: string
  fullBlob: Blob | null
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
  property_type: string | null; region: string | null; status: string | null
  bedrooms: number | null; bathrooms: number | null
  floor_area: number | null; lot_area: number | null
  monthly_amortization: string | null; features: string[]
  pagibig_eligible: boolean
  featured: boolean
}

type Form = {
  title: string; location: string; price: string; description: string
  property_type: string; region: string; status: string
  bedrooms: string; bathrooms: string; floor_area: string; lot_area: string
  monthly_amortization: string; features: string
  pagibig_eligible: boolean
  featured: boolean
}

const EMPTY_FORM: Form = {
  title: '', location: '', price: '', description: '',
  property_type: '', region: '', status: 'Ready for Occupancy',
  bedrooms: '', bathrooms: '', floor_area: '', lot_area: '',
  monthly_amortization: '', features: '',
  pagibig_eligible: true,
  featured: false,
}

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

async function processFile(file: File): Promise<Photo> {
  const objUrl = URL.createObjectURL(file)
  const img    = await loadImg(objUrl)
  const origW  = img.naturalWidth
  const origH  = img.naturalHeight
  const isPortrait = origH > origW
  const longer     = Math.max(origW, origH)
  const shorter    = Math.min(origW, origH)
  const tooSmall   = longer < 1280 || shorter < 720

  // Always center-crop to 16:9
  let sx = 0, sy = 0, sw = origW, sh = origH
  const srcRatio = origW / origH
  if (srcRatio > 16 / 9) {
    // wider than 16:9 — trim sides
    sw = Math.round(origH * (16 / 9))
    sx = Math.round((origW - sw) / 2)
  } else if (srcRatio < 16 / 9) {
    // taller than 16:9 — trim top/bottom
    sh = Math.round(origW / (16 / 9))
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
  const [listings,    setListings]   = useState<Listing[]>([])
  const [loading,     setLoading]    = useState(true)
  const [adminPage,   setAdminPage]  = useState(0)
  const [adminTotal,  setAdminTotal] = useState(0)
  const [showForm,    setShowForm]   = useState(false)
  const [editing,     setEditing]    = useState<Listing | null>(null)
  const [form,        setForm]       = useState<Form>(EMPTY_FORM)
  const [photos,      setPhotos]     = useState<Photo[]>([])
  const [mainIndex,   setMainIndex]  = useState(0)
  const [processing,  setProcessing] = useState(false)
  const [saving,      setSaving]     = useState(false)
  const [error,       setError]      = useState('')
  const [search,      setSearch]     = useState('')
  const [sortBy,      setSortBy]     = useState<SortKey>('date_desc')
  const fileRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const supabase = createClient()

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    let list = q
      ? listings.filter(l =>
          l.title.toLowerCase().includes(q) ||
          l.location.toLowerCase().includes(q) ||
          (l.property_type ?? '').toLowerCase().includes(q) ||
          (l.status ?? '').toLowerCase().includes(q) ||
          (l.region ?? '').toLowerCase().includes(q)
        )
      : [...listings]
    switch (sortBy) {
      case 'date_asc':   list.sort((a, b) => a.created_at.localeCompare(b.created_at)); break
      case 'date_desc':  list.sort((a, b) => b.created_at.localeCompare(a.created_at)); break
      case 'title_asc':  list.sort((a, b) => a.title.localeCompare(b.title));           break
      case 'title_desc': list.sort((a, b) => b.title.localeCompare(a.title));           break
      case 'price_asc':  list.sort((a, b) => parsePriceNum(a.price) - parsePriceNum(b.price)); break
      case 'price_desc': list.sort((a, b) => parsePriceNum(b.price) - parsePriceNum(a.price)); break
    }
    return list
  }, [listings, search, sortBy])

  // Ctrl/Cmd+S saves the form
  useEffect(() => {
    if (!showForm) return
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault()
        formRef.current?.requestSubmit()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [showForm])

  async function load(pg = 0) {
    setLoading(true)
    const [{ count }, { data }] = await Promise.all([
      supabase.from('listings').select('*', { count: 'exact', head: true }),
      supabase.from('listings').select('*').order('created_at', { ascending: false })
        .range(pg * 50, pg * 50 + 49),
    ])
    setAdminTotal(count ?? 0)
    setListings(data ?? [])
    setLoading(false)
  }

  function goToPage(pg: number) {
    setAdminPage(pg)
    load(pg)
  }

  useEffect(() => { load(0) }, [])

  function openAdd() {
    setEditing(null); setForm(EMPTY_FORM); setPhotos([]); setMainIndex(0); setError(''); setShowForm(true)
  }

  function openEdit(l: Listing) {
    setEditing(l)
    setForm({
      title: l.title, location: l.location, price: l.price, description: l.description ?? '',
      property_type:        l.property_type ?? '',
      region:               l.region ?? '',
      status:               l.status ?? 'Ready for Occupancy',
      bedrooms:             l.bedrooms  != null ? String(l.bedrooms)  : '',
      bathrooms:            l.bathrooms != null ? String(l.bathrooms) : '',
      floor_area:           l.floor_area  != null ? String(l.floor_area)  : '',
      lot_area:             l.lot_area    != null ? String(l.lot_area)    : '',
      monthly_amortization: l.monthly_amortization ?? '',
      features:             (l.features ?? []).join('\n'),
      pagibig_eligible:     l.pagibig_eligible ?? true,
      featured:             l.featured ?? false,
    })
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
    const list  = Array.from(files).slice(0, remaining)
    const bad   = list.filter(f => !ALLOWED.has(f.type) || f.size > MAX_BYTES)
    const good  = list.filter(f =>  ALLOWED.has(f.type) && f.size <= MAX_BYTES)
    if (bad.length) setError(`${bad.length} file(s) skipped — only JPEG/PNG/WebP under 10 MB.`)
    else setError('')
    if (!good.length) return
    setProcessing(true)
    const processed = await Promise.all(good.map(f => processFile(f)))
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

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError('Session expired — please log in again.'); setSaving(false); return }

    const fullUrls:  (string | null)[] = photos.map(p => (p.fullBlob ? null : p.existingUrl))
    const thumbUrls: (string | null)[] = photos.map(p => (p.fullBlob ? null : (p.existingThumbUrl || p.existingUrl)))

    const uploadQueue = photos.map((_, i) => i).filter(i => photos[i].fullBlob !== null)
    const UPLOAD_BATCH = 5
    const uploadTs = Date.now()

    for (let b = 0; b < uploadQueue.length; b += UPLOAD_BATCH) {
      const batch   = uploadQueue.slice(b, b + UPLOAD_BATCH)
      const results = await Promise.allSettled(
        batch.map(async i => {
          const p    = photos[i]
          const safe = p.file ? sanitizeFilename(p.file.name.replace(/\.[^.]+$/, '')) : 'photo'
          const fd   = new FormData()
          fd.append('full',      new Blob([p.fullBlob!],  { type: 'image/jpeg' }))
          fd.append('thumb',     new Blob([p.thumbBlob!], { type: 'image/jpeg' }))
          fd.append('fullName',  `${uploadTs}-${i}-${safe}.jpg`)
          fd.append('thumbName', `thumbnails/${uploadTs}-${i}-${safe}-th.jpg`)
          const res = await fetch('/api/upload', { method: 'POST', body: fd })
          if (!res.ok) {
            const err = await res.json().catch(() => ({ error: 'unknown' }))
            throw new Error(err.error ?? 'unknown')
          }
          const { fullUrl, thumbUrl } = await res.json()
          return { i, fullUrl, thumbUrl }
        })
      )
      for (const r of results) {
        if (r.status === 'rejected') {
          setError(`Upload failed: ${(r.reason as Error).message ?? 'unknown'}`)
          setSaving(false)
          return
        }
        fullUrls[r.value.i]  = r.value.fullUrl
        thumbUrls[r.value.i] = r.value.thumbUrl
      }
    }

    const safeMain = Math.min(mainIndex, fullUrls.length - 1)
    const payload = {
      title, location, price, description,
      property_type:        form.property_type || null,
      region:               form.region || null,
      status:               form.status || null,
      bedrooms:             form.bedrooms   ? parseInt(form.bedrooms, 10)   : null,
      bathrooms:            form.bathrooms  ? parseInt(form.bathrooms, 10)  : null,
      floor_area:           form.floor_area ? parseFloat(form.floor_area)   : null,
      lot_area:             form.lot_area   ? parseFloat(form.lot_area)     : null,
      monthly_amortization: sanitizeText(form.monthly_amortization) || null,
      features:             form.features.split('\n').map(s => s.trim()).filter(Boolean),
      pagibig_eligible:     form.pagibig_eligible,
      featured:             form.featured,
      image_urls:           fullUrls as string[],
      thumbnail_urls:       thumbUrls as string[],
      main_image_index:     safeMain,
      image_url:            (fullUrls as string[])[0] ?? '',
    }

    const { error: dbErr } = editing
      ? await supabase.from('listings').update(payload).eq('id', editing.id)
      : await supabase.from('listings').insert({ ...payload, slug: makeSlug(title) })

    if (dbErr) { setError('Save failed. Please try again.'); setSaving(false); return }
    setSaving(false); setShowForm(false); setAdminPage(0); load(0)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this listing?')) return
    const res = await fetch('/api/delete-listing', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    if (!res.ok) {
      const { error: msg } = await res.json().catch(() => ({ error: 'unknown' }))
      setError(`Delete failed: ${msg ?? 'unknown'}`)
      return
    }
    setAdminPage(0); load(0)
  }

  return (
    <div
      className="min-h-screen bg-[#0B0906]"
      style={{ backgroundImage: 'radial-gradient(ellipse 80% 50% at 72% -8%, rgba(232,93,4,0.09) 0%, transparent 55%), radial-gradient(ellipse 45% 35% at 5% 105%, rgba(200,148,58,0.05) 0%, transparent 50%)' }}
    >
      <div className="max-w-5xl mx-auto px-5 sm:px-8 pt-8 pb-24">

        {/* ── Page header ── */}
        <div className="flex items-start gap-4 mb-9">
          <Link
            href="/admin/dashboard"
            className="mt-0.5 w-8 h-8 rounded-lg bg-[#1A1410] border border-[rgba(255,255,255,0.07)] flex items-center justify-center text-[#6E6055] hover:text-[#FBF6EC] transition-colors shrink-0"
          >
            <ArrowLeft size={15} />
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-[#FBF6EC] font-display text-[28px] leading-none tracking-tight">Property Listings</h1>
            <p className="text-[#3A3028] text-[12px] mt-1.5">
              {loading
                ? 'Loading…'
                : `${adminTotal} listing${adminTotal !== 1 ? 's' : ''} total`}
            </p>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#E85D04] text-white text-sm font-medium hover:bg-[#F27024] transition-colors shadow-[0_4px_20px_rgba(232,93,4,0.32)] shrink-0"
          >
            <Plus size={15} /> Add Listing
          </button>
        </div>

        {/* ── Toolbar: search + sort ── */}
        {!loading && listings.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-2 mb-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#3A3028] pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search title, location, type, status…"
                className="w-full pl-9 pr-8 py-[10px] rounded-xl bg-[#131008] border border-[rgba(255,255,255,0.06)] text-[#EDE5DA] placeholder-[#2A2018] text-[13px] focus:outline-none focus:border-[rgba(232,93,4,0.38)] transition-colors"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded flex items-center justify-center text-[#3A3028] hover:text-[#FBF6EC] transition-colors"
                >
                  <X size={12} />
                </button>
              )}
            </div>
            {/* Sort */}
            <div className="relative shrink-0">
              <ArrowUpDown size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3A3028] pointer-events-none" />
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as SortKey)}
                className="w-full sm:w-auto pl-8 pr-4 py-[10px] rounded-xl bg-[#131008] border border-[rgba(255,255,255,0.06)] text-[#EDE5DA] text-[13px] focus:outline-none focus:border-[rgba(232,93,4,0.38)] transition-colors appearance-none cursor-pointer"
              >
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* ── Search result count ── */}
        {!loading && search.trim() && (
          <p className="text-[11px] text-[#3A3028] mb-3 px-0.5">
            {filtered.length === 0
              ? `No listings match "${search.trim()}"`
              : `${filtered.length} of ${listings.length} match "${search.trim()}"`}
          </p>
        )}

        {/* ── States ── */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-28 gap-3">
            <Loader2 size={20} className="animate-spin text-[#2A2018]" />
            <span className="text-[#2A2018] text-[12px]">Loading…</span>
          </div>

        ) : listings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 gap-5">
            <div className="w-14 h-14 rounded-2xl bg-[#131008] border border-[rgba(255,255,255,0.05)] flex items-center justify-center">
              <Images size={20} className="text-[#2A2018]" />
            </div>
            <div className="text-center">
              <p className="text-[#6E6055] text-[14px] font-medium">No listings yet</p>
              <p className="text-[#2A2018] text-[12px] mt-1">Add your first property to get started.</p>
            </div>
            <button
              onClick={openAdd}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E85D04] hover:bg-[#F27024] text-white text-sm font-medium transition-colors"
            >
              <Plus size={14} /> Add First Listing
            </button>
          </div>

        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#131008] border border-[rgba(255,255,255,0.05)] flex items-center justify-center">
              <Search size={16} className="text-[#2A2018]" />
            </div>
            <div className="text-center">
              <p className="text-[#4A3D35] text-[13px] font-medium">No results found</p>
              <p className="text-[#2A2018] text-[11px] mt-0.5">Try a different keyword or clear your search.</p>
            </div>
            <button onClick={() => setSearch('')} className="text-[11px] text-[#E85D04] hover:underline transition-colors">
              Clear search
            </button>
          </div>

        ) : (
          <>
            {/* Column headers (desktop) */}
            <div className="hidden md:grid md:grid-cols-[88px_1fr_130px_72px] gap-4 px-4 pb-2.5 mb-1 border-b border-[rgba(255,255,255,0.04)]">
              <div />
              <span className="text-[9.5px] font-semibold text-[#2A2018] uppercase tracking-[0.14em]">Property</span>
              <span className="text-[9.5px] font-semibold text-[#2A2018] uppercase tracking-[0.14em] text-right pr-1">Price</span>
              <span className="text-[9.5px] font-semibold text-[#2A2018] uppercase tracking-[0.14em] text-center">Actions</span>
            </div>

            {/* Listing rows */}
            <div className="flex flex-col gap-1.5">
              {filtered.map(l => {
                const photoCount = l.image_urls?.length ?? (l.image_url ? 1 : 0)
                const img        = getDisplayImage(l)
                return (
                  <div
                    key={l.id}
                    className="group/row relative flex items-center gap-4 px-4 py-3.5 rounded-2xl bg-[#0F0B07] border border-[rgba(255,255,255,0.045)] hover:border-[rgba(232,93,4,0.2)] hover:bg-[#150F09] transition-all duration-150 overflow-hidden"
                  >
                    {/* Gradient left accent */}
                    <div className="absolute left-0 inset-y-[12px] w-[3px] rounded-r-full bg-gradient-to-b from-[#E85D04] to-[#C8943A] opacity-0 group-hover/row:opacity-100 transition-opacity duration-200" />

                    {/* 16:9 thumbnail */}
                    <div className="relative w-[88px] h-[50px] rounded-xl overflow-hidden shrink-0 bg-[#1A1008] ring-1 ring-inset ring-white/[0.04]">
                      {img ? (
                        <Image
                          src={img}
                          alt={l.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover/row:scale-[1.05]"
                          sizes="88px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Images size={13} className="text-[#2A2018]" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[#EDE5DA] text-[13.5px] font-semibold truncate leading-snug">{l.title}</p>
                      <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                        <span className="text-[#4A3D35] text-[11px] truncate max-w-[200px]">{l.location}</span>
                        {l.status && (
                          <span className={`shrink-0 text-[9px] font-medium px-1.5 py-0.5 rounded border ${
                            l.status === 'Ready for Occupancy'
                              ? 'bg-emerald-500/[0.08] text-emerald-500/60 border-emerald-500/[0.12]'
                              : l.status === 'Pre-Selling'
                              ? 'bg-sky-500/[0.08] text-sky-400/60 border-sky-500/[0.12]'
                              : l.status === 'Foreclosed'
                              ? 'bg-red-500/[0.08] text-red-400/60 border-red-500/[0.12]'
                              : 'bg-white/[0.03] text-[#4A3D35] border-white/[0.05]'
                          }`}>
                            {l.status}
                          </span>
                        )}
                        {l.property_type && (
                          <span className="shrink-0 text-[9px] px-1.5 py-0.5 rounded bg-white/[0.03] text-[#3A3028] border border-white/[0.04]">
                            {l.property_type}
                          </span>
                        )}
                      </div>
                      <p className="text-[#2A2018] text-[10px] mt-0.5 tabular-nums">
                        {[
                          l.bedrooms   != null && `${l.bedrooms}BR`,
                          l.bathrooms  != null && `${l.bathrooms}BA`,
                          l.floor_area != null && `${l.floor_area}sqm`,
                          photoCount > 0
                            ? `${photoCount} photo${photoCount !== 1 ? 's' : ''}`
                            : 'no photos',
                        ].filter(Boolean).join(' · ')}
                      </p>
                    </div>

                    {/* Price (hidden on xs) */}
                    <div className="shrink-0 text-right hidden sm:block min-w-[110px]">
                      <div className="text-[#C8943A] text-[14px] font-bold tracking-tight">{l.price}</div>
                      {l.monthly_amortization && (
                        <div className="text-[#2A2018] text-[9.5px] mt-0.5 tabular-nums">{l.monthly_amortization}/mo</div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => openEdit(l)}
                        title="Edit listing"
                        className="w-8 h-8 rounded-lg bg-white/[0.03] hover:bg-white/[0.07] border border-transparent hover:border-white/[0.06] flex items-center justify-center text-[#4A3D35] hover:text-[#FBF6EC] transition-all duration-150"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => handleDelete(l.id)}
                        title="Delete listing"
                        className="w-8 h-8 rounded-lg bg-white/[0.03] hover:bg-red-500/10 border border-transparent hover:border-red-500/[0.12] flex items-center justify-center text-[#4A3D35] hover:text-red-400/80 transition-all duration-150"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Footer count */}
            <p className="text-center text-[10px] text-[#2A2018] mt-7 tabular-nums">
              {search.trim()
                ? `Showing ${filtered.length} of ${listings.length} on this page`
                : `${adminTotal} total · page ${adminPage + 1} of ${Math.max(1, Math.ceil(adminTotal / 50))} · sorted by ${SORT_OPTIONS.find(o => o.value === sortBy)?.label.toLowerCase()}`}
            </p>

            {/* Pagination */}
            {adminTotal > 50 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-[rgba(255,255,255,0.04)]">
                <button
                  onClick={() => goToPage(adminPage - 1)}
                  disabled={adminPage === 0}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[#6E6055] hover:text-[#FBF6EC] text-[12px] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={13} /> Prev
                </button>
                <span className="text-[11px] text-[#3A3028] tabular-nums">
                  Page {adminPage + 1} / {Math.ceil(adminTotal / 50)} · {adminTotal} listings
                </span>
                <button
                  onClick={() => goToPage(adminPage + 1)}
                  disabled={(adminPage + 1) * 50 >= adminTotal}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[#6E6055] hover:text-[#FBF6EC] text-[12px] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Next <ChevronRight size={13} />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Form modal ── */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm"
          onClick={e => { if (e.target === e.currentTarget) setShowForm(false) }}
        >
          <div className="min-h-full flex items-start justify-center p-4 pt-8">
            <div className="relative w-full max-w-3xl bg-[#131008] border border-[rgba(255,255,255,0.07)] rounded-2xl mb-8 overflow-hidden">

              {/* Sticky header */}
              <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-[#131008]/95 backdrop-blur-md border-b border-[rgba(255,255,255,0.06)]">
                <div>
                  <h2 className="text-[#FBF6EC] font-semibold text-[15px]">{editing ? 'Edit Listing' : 'New Listing'}</h2>
                  <p className="text-[10px] text-[#3A3028] mt-0.5">
                    {form.title
                      ? `"${form.title.slice(0, 45)}${form.title.length > 45 ? '…' : ''}"`
                      : 'Fill in the details below'}
                    {' · '}
                    <kbd className="font-mono text-[#4A3D35]">Ctrl+S</kbd> to save
                  </p>
                </div>
                <button onClick={() => setShowForm(false)} className="w-7 h-7 rounded-full bg-[rgba(255,255,255,0.06)] flex items-center justify-center text-[#6E6055] hover:text-[#FBF6EC] transition-colors">
                  <X size={13} />
                </button>
              </div>

              <form ref={formRef} onSubmit={handleSave} className="p-6 flex flex-col gap-0">
                {error && (
                  <div className="flex items-start gap-2.5 mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20">
                    <AlertTriangle size={14} className="text-red-400 shrink-0 mt-0.5" />
                    <p className="text-red-400 text-[12px]">{error}</p>
                  </div>
                )}

                {/* ── 1. Core Info ── */}
                <SectionHeader label="Core Information" hint="Required" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  <Field label="Title" required value={form.title} onChange={v => setForm(f => ({ ...f, title: v }))} placeholder="e.g. Camella Bucandala — Dahlia" />
                  <Field label="Location" required value={form.location} onChange={v => setForm(f => ({ ...f, location: v }))} placeholder="e.g. Imus, Cavite" />
                  <div className="sm:col-span-2">
                    <PriceInput value={form.price} onChange={v => setForm(f => ({ ...f, price: v }))} />
                  </div>
                </div>

                {/* ── 2. Classification ── */}
                <SectionHeader label="Classification" hint="Enables filters &amp; detail page" />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  <SelectField label="Property Type" value={form.property_type} onChange={v => setForm(f => ({ ...f, property_type: v }))} optgroups={PROPERTY_TYPES} />
                  <SelectField label="Region" value={form.region} onChange={v => setForm(f => ({ ...f, region: v }))} optgroups={REGIONS} />
                  <SelectField label="Status" value={form.status} onChange={v => setForm(f => ({ ...f, status: v }))} options={[
                    { value: 'Ready for Occupancy', label: 'Ready for Occupancy' },
                    { value: 'Pre-Selling',         label: 'Pre-Selling'         },
                    { value: 'Pre-Owned',           label: 'Pre-Owned'           },
                    { value: 'Foreclosed',          label: 'Foreclosed'          },
                  ]} />
                </div>
                <div className="mb-4">
                  <ToggleField
                    label="Pag-IBIG Eligible"
                    hint="Disable only for cash-only or non-HDMF listings"
                    checked={form.pagibig_eligible}
                    onChange={v => setForm(f => ({ ...f, pagibig_eligible: v }))}
                  />
                </div>
                <div className="mb-8">
                  <ToggleField
                    label="Featured Listing"
                    hint="Pins this listing to the Spotlight section on the Services page"
                    checked={form.featured}
                    onChange={v => setForm(f => ({ ...f, featured: v }))}
                  />
                </div>

                {/* ── 3. Specifications ── */}
                <SectionHeader label="Property Specifications" hint="Optional — shown on listing detail page" />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                  <Field label="Bedrooms"         value={form.bedrooms}   onChange={v => setForm(f => ({ ...f, bedrooms: v }))}   placeholder="e.g. 3"  inputMode="numeric" />
                  <Field label="Bathrooms"        value={form.bathrooms}  onChange={v => setForm(f => ({ ...f, bathrooms: v }))}  placeholder="e.g. 2"  inputMode="numeric" />
                  <Field label="Floor Area (sqm)" value={form.floor_area} onChange={v => setForm(f => ({ ...f, floor_area: v }))} placeholder="e.g. 44" inputMode="numeric" />
                  <Field label="Lot Area (sqm)"   value={form.lot_area}   onChange={v => setForm(f => ({ ...f, lot_area: v }))}   placeholder="e.g. 88" inputMode="numeric" />
                </div>
                <div className="mb-8">
                  <Field label="Monthly Amortization" value={form.monthly_amortization} onChange={v => setForm(f => ({ ...f, monthly_amortization: v }))} placeholder="e.g. ₱12,800/mo" />
                </div>

                {/* ── 4. Photos ── */}
                <SectionHeader label="Photos" hint={`${photos.length} / ${MAX_PHOTOS} · All images center-cropped to 16:9`} />
                <div className="mb-8">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-2">
                    {photos.map((photo, i) => (
                      <div key={photo.id} className="relative group">
                        <div className={`relative aspect-video rounded-xl overflow-hidden border-2 transition-all duration-150 ${
                          i === mainIndex
                            ? 'border-[#E85D04] shadow-[0_0_0_1px_rgba(232,93,4,0.3)]'
                            : 'border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.14)]'
                        }`}>
                          <Image src={photo.thumbPreviewUrl || photo.previewUrl} alt={`Photo ${i + 1}`} fill className="object-cover" sizes="200px" unoptimized />
                          {i === mainIndex && (
                            <div className="absolute top-1 left-1">
                              <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-[#E85D04] text-white tracking-wide">MAIN</span>
                            </div>
                          )}
                          {photo.tooSmall && (
                            <div className="absolute bottom-1 right-1">
                              <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-amber-600/80 text-white">Low res</span>
                            </div>
                          )}
                        </div>
                        <div className="absolute top-1 right-1 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                          <button type="button" title="Set as main" onClick={() => setMainIndex(i)}
                            className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors shadow-sm ${
                              i === mainIndex ? 'bg-[#E85D04] text-white' : 'bg-black/65 text-[#8A7C68] hover:text-[#E85D04]'
                            }`}
                          >
                            <Star size={9} fill={i === mainIndex ? 'currentColor' : 'none'} />
                          </button>
                          <button type="button" onClick={() => removePhoto(i)}
                            className="w-5 h-5 rounded-full bg-black/65 text-[#8A7C68] hover:text-red-400 flex items-center justify-center transition-colors shadow-sm"
                          >
                            <X size={9} />
                          </button>
                        </div>
                      </div>
                    ))}

                    {photos.length < MAX_PHOTOS && (
                      <button type="button" onClick={() => !processing && fileRef.current?.click()}
                        className="relative aspect-video rounded-xl border-2 border-dashed border-[rgba(255,255,255,0.08)] hover:border-[rgba(232,93,4,0.4)] bg-[rgba(255,255,255,0.02)] transition-colors flex flex-col items-center justify-center gap-1.5"
                      >
                        {processing ? <Loader2 size={16} className="text-[#6E6055] animate-spin" /> : (
                          <>
                            <Images size={16} className="text-[#4A3D35]" />
                            <span className="text-[9px] text-[#4A3D35] text-center leading-tight px-1">
                              {photos.length === 0 ? 'Add photos' : '+ Add more'}
                            </span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" multiple
                    onChange={e => { if (e.target.files) addFiles(e.target.files); e.target.value = '' }}
                    className="hidden"
                  />
                  <p className="text-[10px] text-[#3A3028] mt-2.5">
                    JPEG · PNG · WebP · max 10 MB each · up to {MAX_PHOTOS} photos · min 1280×720 px recommended · auto-cropped to 16:9
                  </p>
                </div>

                {/* ── 5. Content ── */}
                <SectionHeader label="Description &amp; Features" />
                <div className="flex flex-col gap-4 mb-8">
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
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl bg-[#1A1410] border border-[rgba(255,255,255,0.07)] text-[#FBF6EC] placeholder-[#3A3028] text-sm focus:outline-none focus:border-[rgba(232,93,4,0.5)] transition-colors resize-none leading-relaxed"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-medium text-[#6E6055] uppercase tracking-wide">
                      Features <span className="normal-case font-normal text-[#3A3028]">— one per line, shown as pills on the listing page</span>
                    </label>
                    <textarea
                      value={form.features}
                      onChange={e => setForm(f => ({ ...f, features: e.target.value }))}
                      placeholder={'Gated community\nClubhouse & pool\n24/7 security\nNear SLEX/CAVITEX\nComplete amenities'}
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl bg-[#1A1410] border border-[rgba(255,255,255,0.07)] text-[#FBF6EC] placeholder-[#3A3028] text-sm focus:outline-none focus:border-[rgba(232,93,4,0.5)] transition-colors resize-none leading-relaxed"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-[rgba(255,255,255,0.05)]">
                  <button type="button" onClick={() => setShowForm(false)}
                    className="flex-1 py-3 rounded-xl border border-[rgba(255,255,255,0.07)] text-[#6E6055] text-sm hover:text-[#FBF6EC] hover:border-[rgba(255,255,255,0.12)] transition-colors"
                  >
                    Cancel
                  </button>
                  <button type="submit" disabled={saving || processing}
                    className="flex-1 py-3 rounded-xl bg-[#E85D04] text-white text-sm font-medium hover:bg-[#F27024] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {saving
                      ? <><Loader2 size={14} className="animate-spin" /> Uploading…</>
                      : <><Save size={14} /> {editing ? 'Save Changes' : 'Add Listing'}</>
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

// ─── Form sub-components ─────────────────────────────────────────────────────

function SectionHeader({ label, hint }: { label: string; hint?: string }) {
  return (
    <div className="flex items-baseline gap-3 mb-4">
      <h3
        className="text-[10px] font-semibold text-[#C8943A] uppercase tracking-[0.14em]"
        dangerouslySetInnerHTML={{ __html: label }}
      />
      {hint && <span className="text-[10px] text-[#3A3028]" dangerouslySetInnerHTML={{ __html: hint }} />}
    </div>
  )
}

function Field({ label, value, onChange, placeholder, className = '', required, inputMode }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string
  className?: string; required?: boolean
  inputMode?: React.InputHTMLAttributes<HTMLInputElement>['inputMode']
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-[10px] font-medium text-[#6E6055] uppercase tracking-wide">
        {label}{required && <span className="text-[#E85D04] ml-0.5">*</span>}
      </label>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        inputMode={inputMode}
        className="w-full px-4 py-3 rounded-xl bg-[#1A1410] border border-[rgba(255,255,255,0.07)] text-[#FBF6EC] placeholder-[#3A3028] text-sm focus:outline-none focus:border-[rgba(232,93,4,0.5)] transition-colors"
      />
    </div>
  )
}

type OptionItem  = { value: string; label: string }
type OptionGroup = { label: string; options: readonly OptionItem[] }

function SelectField({ label, value, onChange, options, optgroups, className = '' }: {
  label: string; value: string; onChange: (v: string) => void
  options?: OptionItem[]; optgroups?: readonly OptionGroup[]; className?: string
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-[10px] font-medium text-[#6E6055] uppercase tracking-wide">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl bg-[#1A1410] border border-[rgba(255,255,255,0.07)] text-[#FBF6EC] text-sm focus:outline-none focus:border-[rgba(232,93,4,0.5)] transition-colors"
      >
        <option value="">— unset —</option>
        {optgroups
          ? optgroups.map(g => (
              <optgroup key={g.label} label={g.label}>
                {g.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </optgroup>
            ))
          : options?.map(o => <option key={o.value} value={o.value}>{o.label}</option>)
        }
      </select>
    </div>
  )
}

function ToggleField({ label, hint, checked, onChange }: {
  label: string; hint?: string; checked: boolean; onChange: (v: boolean) => void
}) {
  return (
    <div
      className="flex items-center justify-between gap-4 px-4 py-3 rounded-xl bg-[#1A1410] border border-[rgba(255,255,255,0.07)] cursor-pointer select-none"
      onClick={() => onChange(!checked)}
    >
      <div>
        <p className="text-[#FBF6EC] text-[13px] font-medium">{label}</p>
        {hint && <p className="text-[#3A3028] text-[10px] mt-0.5 leading-snug">{hint}</p>}
      </div>
      <div className={`relative w-11 h-6 rounded-full shrink-0 transition-colors duration-200 ${checked ? 'bg-[#E85D04]' : 'bg-[#2A2018]'}`}>
        <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
      </div>
    </div>
  )
}

function PriceInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Strip everything non-numeric to get the raw integer
  const digits = value.replace(/[^0-9]/g, '')
  const numVal = digits ? parseInt(digits, 10) : null

  // While focused: commas only. While blurred: commas + .00
  const displayValue = numVal == null
    ? ''
    : focused
      ? numVal.toLocaleString('en-PH')
      : numVal.toLocaleString('en-PH') + '.00'

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '')
    if (!raw) { onChange(''); return }
    const n = parseInt(raw, 10)
    onChange(`₱${n.toLocaleString('en-PH')}`)
    // Keep cursor at end after comma insertion
    requestAnimationFrame(() => {
      if (inputRef.current) {
        const pos = n.toLocaleString('en-PH').length
        inputRef.current.setSelectionRange(pos, pos)
      }
    })
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-medium text-[#6E6055] uppercase tracking-wide">
        Price<span className="text-[#E85D04] ml-0.5">*</span>
      </label>
      <div className="relative flex items-center">
        <span className="absolute left-4 text-[#C8943A] font-bold text-sm pointer-events-none select-none z-10">₱</span>
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          value={displayValue}
          onChange={handleChange}
          onFocus={() => { setFocused(true); setTimeout(() => inputRef.current?.select(), 10) }}
          onBlur={() => setFocused(false)}
          placeholder="0.00"
          className="w-full pl-8 pr-4 py-3 rounded-xl bg-[#1A1410] border border-[rgba(255,255,255,0.07)] text-[#FBF6EC] placeholder-[#3A3028] text-sm focus:outline-none focus:border-[rgba(232,93,4,0.5)] transition-colors"
        />
      </div>
      {numVal != null && (
        <p className="text-[10px] text-[#3A3028]">
          Stored as <span className="text-[#6E6055]">₱{numVal.toLocaleString('en-PH')}</span>
          {numVal >= 1_000_000 && (
            <span className="ml-1 text-[#4A3D35]">
              (₱{(numVal / 1_000_000).toFixed(numVal % 1_000_000 === 0 ? 0 : 2)}M)
            </span>
          )}
        </p>
      )}
    </div>
  )
}
