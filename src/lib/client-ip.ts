// Best-effort *trusted* client IP for rate-limit keying.
//
// The naive `x-forwarded-for`.split(',')[0] is spoofable: a client can send any
// X-Forwarded-For value, and the leftmost token is simply whatever they put
// there — so rotating it bypasses an IP-keyed rate limit entirely.
//
// Standard XFF semantics: each proxy *appends* the address it received the
// connection from. So the LAST entry is the address the nearest trusted proxy
// (e.g. Vercel's edge) actually observed — the value a client cannot forge.
// We therefore prefer:
//   1. `x-real-ip`            — set directly by Vercel/most proxies to the client IP
//   2. last hop of `x-forwarded-for` — the entry appended by the nearest trusted proxy
//   3. 'unknown'             — un-proxied callers share one conservative bucket
//
// Assumption: a single trusted proxy in front of the app (Vercel). With a chain
// of trusted proxies, prefer x-real-ip or adjust the hop index accordingly.

type HeaderGetter = { get(name: string): string | null }

export function getClientIp(headers: HeaderGetter): string {
  const realIp = headers.get('x-real-ip')?.trim()
  if (realIp) return realIp

  const xff = headers.get('x-forwarded-for')
  if (xff) {
    const parts = xff.split(',').map(s => s.trim()).filter(Boolean)
    if (parts.length) return parts[parts.length - 1]
  }

  return 'unknown'
}
