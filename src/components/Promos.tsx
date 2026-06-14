import { createClient } from '@/lib/supabase/server'
import PromosClient from './PromosClient'

export default async function Promos() {
  const supabase = await createClient()
  const { data: promos } = await supabase
    .from('promos')
    .select('*')
    .order('created_at', { ascending: false })

  if (!promos || promos.length === 0) return null

  return <PromosClient promos={promos} />
}
