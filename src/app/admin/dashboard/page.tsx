import Link from 'next/link'
import {
  Building2, Tag, AlertTriangle, HardDrive, Wallet, Star, Sparkles,
  ImageOff, CircleDollarSign, FileText, CalendarX,
} from 'lucide-react'
import LogoutButton from '../LogoutButton'
import { getDashboardStats, getRecentAuditLog, type AuditLogEntry } from '@/lib/admin-stats'

export const dynamic = 'force-dynamic'

export default async function Dashboard() {
  const [{ storage, content }, auditLog] = await Promise.all([
    getDashboardStats(),
    getRecentAuditLog(),
  ])

  const pct = storage.quotaBytes > 0
    ? Math.min(100, (storage.usedBytes / storage.quotaBytes) * 100)
    : 0
  const free = Math.max(0, storage.quotaBytes - storage.usedBytes)

  const alertItems = [
    { key: 'photos', icon: ImageOff,        label: 'have no photos',        group: content.alerts.noPhotos },
    { key: 'price',  icon: CircleDollarSign, label: 'missing a price',       group: content.alerts.noPrice },
    { key: 'desc',   icon: FileText,         label: 'missing a description', group: content.alerts.noDescription },
  ].filter(a => a.group.count > 0)
  const hasAlerts = alertItems.length > 0 || content.alerts.expiredPromos > 0

  return (
    <div className="min-h-screen bg-[#0B0906] p-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-[#FBF6EC] font-display text-3xl mb-1">Dashboard</h1>
            <p className="text-[#6E6055] text-sm">Orange Square Realty CMS</p>
          </div>
          <LogoutButton />
        </div>

        {/* Storage gauge */}
        <StorageGauge
          ok={storage.ok}
          usedBytes={storage.usedBytes}
          quotaBytes={storage.quotaBytes}
          freeBytes={free}
          pct={pct}
          fileCount={storage.fileCount}
          listingCount={content.listings}
          capped={storage.capped}
        />

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
          <StatCard label="Listings"      value={content.listings}                icon={<Building2 size={13} className="text-[#E85D04]" />} />
          <StatCard label="Active Promos" value={content.promos}                  icon={<Tag size={13} className="text-[#E85D04]" />} />
          <StatCard
            label="Expiring Soon"
            value={content.expiring}
            highlight={content.expiring > 0}
            icon={<AlertTriangle size={13} className="text-amber-400" />}
          />
          <StatCard label="Portfolio Value" value={formatPeso(content.portfolioValue)} icon={<Wallet size={13} className="text-[#E85D04]" />} />
          <StatCard label="Featured"        value={content.featured}                 icon={<Star size={13} className="text-[#E85D04]" />} />
          <StatCard label="Added (30d)"     value={content.added30d}                 icon={<Sparkles size={13} className="text-[#E85D04]" />} />
        </div>

        {/* By status */}
        {content.byStatus.length > 0 && (
          <div className="mb-8">
            <h3 className="text-[10px] font-medium text-[#6E6055] uppercase tracking-[0.12em] mb-3">Listings by status</h3>
            <div className="flex flex-wrap gap-2">
              {content.byStatus.map(s => (
                <span
                  key={s.status}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1A1410] border border-[rgba(255,255,255,0.06)] text-[13px] text-[#C6B9A4]"
                >
                  {s.status}
                  <span className="text-[#FBF6EC] font-semibold tabular-nums">{s.count}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Needs attention */}
        {hasAlerts && (
          <div className="mb-8 rounded-2xl border border-amber-500/[0.15] bg-amber-500/[0.05] p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={15} className="text-amber-400" />
              <h3 className="text-amber-300 font-semibold text-sm">Needs attention</h3>
            </div>
            <ul className="flex flex-col gap-2.5">
              {alertItems.map(({ key, icon: Icon, label, group }) => (
                <AlertRow key={key} icon={<Icon size={14} className="text-amber-400/80 shrink-0" />} count={group.count} label={`listing${group.count === 1 ? '' : 's'} ${label}`} sample={group.sample} />
              ))}
              {content.alerts.expiredPromos > 0 && (
                <AlertRow
                  icon={<CalendarX size={14} className="text-amber-400/80 shrink-0" />}
                  count={content.alerts.expiredPromos}
                  label={`expired promo${content.alerts.expiredPromos === 1 ? '' : 's'} still listed`}
                />
              )}
            </ul>
            <Link href="/admin/listings" className="inline-block mt-4 text-[12px] text-amber-300/90 hover:text-amber-200 transition-colors">
              Review listings →
            </Link>
          </div>
        )}

        {/* Recent Activity */}
        <RecentActivity entries={auditLog} />

        {/* Nav cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/admin/listings"
            className="p-6 rounded-2xl bg-[#1A1410] border border-[rgba(255,255,255,0.05)] hover:border-[rgba(232,93,4,0.3)] transition-all"
          >
            <Building2 size={24} className="text-[#E85D04] mb-4" />
            <h2 className="text-[#FBF6EC] font-semibold text-lg mb-1">Property Listings</h2>
            <p className="text-[#6E6055] text-sm">Add, edit and delete property listings with photo uploads</p>
          </Link>
          <Link
            href="/admin/promos"
            className="p-6 rounded-2xl bg-[#1A1410] border border-[rgba(255,255,255,0.05)] hover:border-[rgba(232,93,4,0.3)] transition-all"
          >
            <Tag size={24} className="text-[#E85D04] mb-4" />
            <h2 className="text-[#FBF6EC] font-semibold text-lg mb-1">Promos & Discounts</h2>
            <p className="text-[#6E6055] text-sm">Manage promotional deals and special offers</p>
          </Link>
        </div>
      </div>
    </div>
  )
}

// ─── Storage gauge ────────────────────────────────────────────────────────────

function StorageGauge({
  ok, usedBytes, quotaBytes, freeBytes, pct, fileCount, listingCount, capped,
}: {
  ok: boolean; usedBytes: number; quotaBytes: number; freeBytes: number
  pct: number; fileCount: number; listingCount: number; capped: boolean
}) {
  // green < 70%, amber 70–90%, red > 90% — like a phone storage bar.
  const barColor = pct > 90 ? '#EF4444' : pct >= 70 ? '#F59E0B' : '#E85D04'

  return (
    <div className="mb-8 rounded-2xl bg-[#1A1410] border border-[rgba(255,255,255,0.05)] p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <HardDrive size={15} className="text-[#E85D04]" />
          <span className="text-[11px] font-medium text-[#6E6055] uppercase tracking-[0.12em]">Storage</span>
        </div>
        {ok ? (
          <span className="text-[13px] text-[#C6B9A4] tabular-nums">
            <span className="text-[#FBF6EC] font-semibold">{formatBytes(usedBytes)}</span>
            {' / '}{formatBytes(quotaBytes)}
          </span>
        ) : (
          <span className="text-[12px] text-[#6E6055]">data unavailable</span>
        )}
      </div>

      {ok ? (
        <>
          <div className="h-2.5 w-full rounded-full bg-[#0B0906] overflow-hidden">
            <div
              className="h-full rounded-full transition-[width] duration-500"
              style={{ width: `${Math.max(pct, 1.5)}%`, backgroundColor: barColor }}
            />
          </div>
          <div className="flex items-center justify-between mt-2.5 text-[12px] text-[#6E6055]">
            <span>{formatBytes(freeBytes)} free</span>
            <span className="tabular-nums">
              {fileCount.toLocaleString()}{capped ? '+' : ''} files · {listingCount.toLocaleString()} listings
            </span>
          </div>
        </>
      ) : (
        <p className="text-[12px] text-[#6E6055]">
          Could not read storage usage. Ensure the service-role key is configured.
        </p>
      )}
    </div>
  )
}

function AlertRow({
  icon, count, label, sample,
}: {
  icon: React.ReactNode; count: number; label: string; sample?: string[]
}) {
  return (
    <li className="flex items-start gap-2.5 text-[13px] text-[#D8C9B4]">
      <span className="mt-0.5">{icon}</span>
      <span>
        <span className="text-amber-300 font-semibold tabular-nums">{count}</span> {label}
        {sample && sample.length > 0 && (
          <span className="text-[#6E6055]"> — {sample.join(', ')}{count > sample.length ? '…' : ''}</span>
        )}
      </span>
    </li>
  )
}

function StatCard({
  label, value, highlight = false, icon,
}: {
  label: string; value: number | string; highlight?: boolean; icon?: React.ReactNode
}) {
  return (
    <div className={`rounded-2xl p-4 border ${
      highlight
        ? 'bg-amber-500/[0.06] border-amber-500/[0.15]'
        : 'bg-[#1A1410] border-[rgba(255,255,255,0.05)]'
    }`}>
      <div className="flex items-center gap-1.5 mb-2">
        {icon}
        <span className="text-[10px] font-medium text-[#6E6055] uppercase tracking-[0.12em]">{label}</span>
      </div>
      <span className={`text-[28px] font-bold leading-none ${highlight ? 'text-amber-400' : 'text-[#FBF6EC]'}`}>
        {value}
      </span>
    </div>
  )
}

// ─── Formatting ───────────────────────────────────────────────────────────────

function formatBytes(n: number): string {
  if (n <= 0) return '0 MB'
  const gb = n / 1024 ** 3
  if (gb >= 1) return `${gb.toFixed(gb >= 10 ? 0 : 2)} GB`
  const mb = n / 1024 ** 2
  if (mb >= 1) return `${mb.toFixed(mb >= 10 ? 0 : 1)} MB`
  const kb = n / 1024
  return `${kb.toFixed(0)} KB`
}

function formatPeso(n: number): string {
  if (!n || n <= 0) return '₱0'
  if (n >= 1e9) return `₱${(n / 1e9).toFixed(2)}B`
  if (n >= 1e6) return `₱${(n / 1e6).toFixed(1)}M`
  if (n >= 1e3) return `₱${(n / 1e3).toFixed(0)}K`
  return `₱${n.toLocaleString('en-PH')}`
}

// ─── Audit log helpers ────────────────────────────────────────────────────────

const ACTION_LABELS: Record<string, string> = {
  upload_image:   'Uploaded image',
  delete_listing: 'Deleted listing',
  create_promo:   'Created promo',
  update_promo:   'Updated promo',
  delete_promo:   'Deleted promo',
}

function metaSummary(action: string, meta: Record<string, unknown> | null): string {
  if (!meta) return ''
  if (action === 'upload_image' && meta.fullName)
    return ` — ${String(meta.fullName).split('/').pop()}`
  if (action === 'delete_listing' && meta.listingId)
    return ` — ${String(meta.listingId).slice(0, 8)}…`
  if ((action === 'create_promo' || action === 'update_promo') && meta.title)
    return ` — ${String(meta.title).slice(0, 40)}`
  if (action === 'delete_promo' && meta.promoId)
    return ` — ${String(meta.promoId).slice(0, 8)}…`
  return ''
}

function formatRelativeTime(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime()
  const min  = Math.floor(diff / 60_000)
  if (min < 1)  return 'just now'
  if (min < 60) return `${min}m ago`
  const hr = Math.floor(min / 60)
  if (hr < 24)  return `${hr}h ago`
  const days = Math.floor(hr / 24)
  if (days === 1) return 'yesterday'
  if (days < 7)   return `${days}d ago`
  return new Date(ts).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })
}

function RecentActivity({ entries }: { entries: AuditLogEntry[] }) {
  return (
    <div className="mb-8 rounded-2xl bg-[#1A1410] border border-[rgba(255,255,255,0.05)] p-5">
      <h3 className="text-[10px] font-medium text-[#6E6055] uppercase tracking-[0.12em] mb-3">
        Recent Activity
      </h3>
      {entries.length === 0 ? (
        <p className="text-[13px] text-[#6E6055]">No activity recorded yet.</p>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {entries.map(e => (
            <li key={e.id} className="flex items-baseline justify-between gap-3">
              <span className="text-[13px] text-[#C6B9A4] leading-snug">
                {ACTION_LABELS[e.action] ?? e.action}
                <span className="text-[#6E6055]">{metaSummary(e.action, e.meta)}</span>
              </span>
              <span className="text-[11px] text-[#6E6055] shrink-0 tabular-nums">
                {formatRelativeTime(e.ts)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
