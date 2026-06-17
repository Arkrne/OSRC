#!/usr/bin/env node
/**
 * One-shot cleanup of leftover TEST listings (see HANDOFF.md "Known issues").
 *
 * SAFE BY DEFAULT: prints what it WOULD delete and exits. Nothing is removed
 * unless you pass --apply. Run this yourself — it is not wired into the app.
 *
 *   # 1. Make sure your service-role key is available (NEVER commit it):
 *   #    set it in .env.local or export it in your shell.
 *   #
 *   # 2. Dry run (default) — review the matches:
 *   node scripts/cleanup-test-listings.mjs
 *   #
 *   # 3. Actually delete (DB rows + their storage images):
 *   node scripts/cleanup-test-listings.mjs --apply
 *
 * Match terms are case-insensitive substrings checked against slug + title.
 * Edit TEST_TERMS below to match whatever test rows currently exist.
 */
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'

// Known test rows flagged in HANDOFF.md. Adjust as needed before running.
const TEST_TERMS = ['catanduanes-43d12a', 'djuarlong', 'portak nab', 'test']

const APPLY = process.argv.includes('--apply')

// Minimal .env.local loader (no dotenv dependency).
function loadEnv() {
  try {
    for (const line of readFileSync('.env.local', 'utf8').split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
    }
  } catch {
    /* no .env.local — rely on shell env */
  }
}
loadEnv()

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !key || !key.startsWith('eyJ')) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or a valid SUPABASE_SERVICE_ROLE_KEY.')
  process.exit(1)
}

const supabase = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } })

function isTest(row) {
  const hay = `${row.slug ?? ''} ${row.title ?? ''}`.toLowerCase()
  return TEST_TERMS.some(t => hay.includes(t.toLowerCase()))
}

function storagePaths(row) {
  const urls = [...(row.image_urls ?? []), ...(row.thumbnail_urls ?? [])]
  return urls.flatMap(u => {
    try {
      const after = String(u).split('/property-images/')[1]
      return after ? [decodeURIComponent(after.split('?')[0])] : []
    } catch {
      return []
    }
  })
}

const { data, error } = await supabase
  .from('listings')
  .select('id,slug,title,image_urls,thumbnail_urls')
if (error) {
  console.error('Query failed:', error.message)
  process.exit(1)
}

const targets = (data ?? []).filter(isTest)
if (targets.length === 0) {
  console.log('No test listings matched. Nothing to do.')
  process.exit(0)
}

console.log(`Matched ${targets.length} test listing(s):`)
for (const t of targets) console.log(`  - ${t.slug}  "${t.title}"`)

if (!APPLY) {
  console.log('\nDry run only. Re-run with --apply to delete these rows and their images.')
  process.exit(0)
}

for (const t of targets) {
  const paths = storagePaths(t)
  if (paths.length) {
    const { error: sErr } = await supabase.storage.from('property-images').remove(paths)
    if (sErr) console.warn(`  storage cleanup warning for ${t.slug}: ${sErr.message}`)
  }
  const { error: dErr } = await supabase.from('listings').delete().eq('id', t.id)
  if (dErr) console.error(`  FAILED to delete ${t.slug}: ${dErr.message}`)
  else console.log(`  deleted ${t.slug} (+${paths.length} image(s))`)
}
console.log('\nDone.')
