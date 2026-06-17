// Pure, dependency-free validation + sanitization helpers.
// Extracted so they can be unit-tested without pulling in Resend/Upstash/Supabase.

/** RFC-ish email check, capped at the 254-char practical maximum. */
export function isEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s) && s.length <= 254
}

/** Permissive international phone check: digits, spaces, and common separators. */
export function isPhone(s: string): boolean {
  return /^[+\d\s\-()\\.]{7,20}$/.test(s)
}

/** Coerce to string, trim, strip control characters, and cap length. */
export function strip(s: unknown, max = 1000): string {
  if (typeof s !== 'string') return ''
  // eslint-disable-next-line no-control-regex
  return s.trim().replace(/[\x00-\x1F\x7F]/g, '').slice(0, max)
}

/** HTML-entity escape for safe interpolation into email markup. */
export function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/**
 * Reject path-traversal / unexpected storage keys (client-supplied → untrusted).
 * Used by /api/upload to validate storage object names.
 */
export function isSafeKey(k: string): boolean {
  return /^[A-Za-z0-9._\-/]+$/.test(k) && !k.includes('..') && !k.startsWith('/') && k.length <= 200
}
