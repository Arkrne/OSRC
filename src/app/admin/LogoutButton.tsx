'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { LogOut } from 'lucide-react'

export default function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[rgba(255,255,255,0.07)] text-[#6E6055] hover:text-[#FBF6EC] text-sm transition-colors"
    >
      <LogOut size={14} />
      Sign Out
    </button>
  )
}
