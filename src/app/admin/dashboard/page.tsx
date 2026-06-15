import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { Building2, Tag, AlertTriangle } from 'lucide-react'
import LogoutButton from '../LogoutButton'

function publicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  )
}

export const dynamic = 'force-dynamic'

export default async function Dashboard() {
  const supabase = publicClient()
  const today = new Date().toISOString().split('T')[0]
  const in7   = new Date(Date.now() + 7 * 86_400_000).toISOString().split('T')[0]

  const [
    { count: listingCount },
    { count: promoCount },
    { count: expiringCount },
  ] = await Promise.all([
    supabase.from('listings').select('*', { count: 'exact', head: true }),
    supabase.from('promos').select('*', { count: 'exact', head: true }),
    supabase.from('promos').select('*', { count: 'exact', head: true })
      .gte('valid_until', today)
      .lte('valid_until', in7),
  ])

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

        {/* Stats strip */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <StatCard label="Listings" value={listingCount ?? 0} />
          <StatCard label="Active Promos" value={promoCount ?? 0} />
          <StatCard
            label="Expiring Soon"
            value={expiringCount ?? 0}
            highlight={(expiringCount ?? 0) > 0}
            icon={<AlertTriangle size={13} className="text-amber-400" />}
          />
        </div>

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

function StatCard({
  label, value, highlight = false, icon,
}: {
  label: string; value: number; highlight?: boolean; icon?: React.ReactNode
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
