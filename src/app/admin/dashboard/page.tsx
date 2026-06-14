'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Building2, Tag, LogOut } from 'lucide-react'

export default function Dashboard() {
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[#0B0906] p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-[#FBF6EC] font-display text-3xl mb-1">Dashboard</h1>
            <p className="text-[#6E6055] text-sm">Orange Square Realty CMS</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[rgba(255,255,255,0.07)] text-[#6E6055] hover:text-[#FBF6EC] text-sm transition-colors"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>

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
