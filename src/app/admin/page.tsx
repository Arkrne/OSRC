'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'

export default function AdminLogin() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return // re-entry guard (blocks Enter double-submit)
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError) {
      // Generic message — never expose Supabase internals to the browser
      setError('Invalid email or password.')
      setLoading(false)
    } else {
      router.push('/admin/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="min-h-[100dvh] bg-[#0B0906] flex items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <div className="inline-block w-10 h-10 rounded-xl bg-[#E85D04] mb-5" />
          <h1 className="text-[#FBF6EC] font-display text-3xl mb-1">Admin</h1>
          <p className="text-[#6E6055] text-sm">Orange Square Realty CMS</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete="email"
            aria-invalid={error ? true : undefined}
            className="w-full px-4 py-3 rounded-xl bg-[#1A1410] border border-[rgba(255,255,255,0.07)] text-[#FBF6EC] placeholder-[#6E6055] text-base sm:text-sm focus:outline-none focus:border-[#E85D04] transition-colors"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            aria-invalid={error ? true : undefined}
            className="w-full px-4 py-3 rounded-xl bg-[#1A1410] border border-[rgba(255,255,255,0.07)] text-[#FBF6EC] placeholder-[#6E6055] text-base sm:text-sm focus:outline-none focus:border-[#E85D04] transition-colors"
          />
          {error && <p role="alert" className="text-red-400 text-xs">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            className="w-full py-3 rounded-xl bg-[#E85D04] text-white font-medium text-base sm:text-sm hover:bg-[#F27024] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={15} className="animate-spin" /> : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
