import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { isEmail, isPhone, strip, esc } from '@/lib/validation'
import { reportError } from '@/lib/report-error'

const RECIPIENT = process.env.INQUIRY_EMAIL ?? 'jolavts@gmail.com'
// Switch to noreply@orangesquarerealty.com.ph once domain is verified in Resend
const FROM      = process.env.RESEND_FROM ?? 'OSRC Inquiries <onboarding@resend.dev>'

// ─── Rate limiting ────────────────────────────────────────────────────────────
// Upstash Redis when env vars are present (production); in-memory fallback for local dev.
const upstashRatelimit =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(5, '60 s'),
        prefix: 'osrc:inquiry',
      })
    : null

// In-memory fallback (dev only — not shared across Vercel instances)
const rateMap = new Map<string, { count: number; resetAt: number }>()
setInterval(() => {
  const now = Date.now()
  for (const [k, v] of rateMap) if (now > v.resetAt) rateMap.delete(k)
}, 5 * 60 * 1000)

async function checkRate(ip: string): Promise<boolean> {
  if (upstashRatelimit) {
    const { success } = await upstashRatelimit.limit(ip)
    return !success
  }
  const now   = Date.now()
  const entry = rateMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + 60_000 })
    return false
  }
  if (entry.count >= 5) return true
  entry.count++
  return false
}

// Validation + sanitization helpers (isEmail, isPhone, strip, esc) now live in
// @/lib/validation so they can be unit-tested in isolation.

// ─── CORS helpers ─────────────────────────────────────────────────────────────
const ALLOWED_ORIGINS = new Set([
  'https://orangesquarerealty.com.ph',
  'https://www.orangesquarerealty.com.ph',
  ...(process.env.NODE_ENV === 'development' ? ['http://localhost:3000'] : []),
])

function corsHeaders(origin: string | null) {
  const allowed = origin && ALLOWED_ORIGINS.has(origin) ? origin : ''
  return {
    'Access-Control-Allow-Origin':  allowed || 'null',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age':       '86400',
  }
}

// ─── Structured log ───────────────────────────────────────────────────────────
function log(level: 'info' | 'warn' | 'error', event: string, meta?: Record<string, unknown>) {
  const entry = JSON.stringify({ ts: new Date().toISOString(), level, event, ...meta })
  if (level === 'error') console.error(entry)
  else if (level === 'warn') console.warn(entry)
  else console.log(entry)
}

// ─── Preflight ────────────────────────────────────────────────────────────────
export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get('origin')
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) })
}

// ─── Main handler ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const origin = req.headers.get('origin')
  const cors   = corsHeaders(origin)

  // 1. Rate limit
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (await checkRate(ip)) {
    log('warn', 'rate_limited', { ip })
    return NextResponse.json(
      { error: 'Too many requests. Please wait a minute before trying again.' },
      { status: 429, headers: { ...cors, 'Retry-After': '60' } }
    )
  }

  // 2. Content-type guard
  const ct = req.headers.get('content-type') ?? ''
  if (!ct.includes('application/json')) {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 415, headers: cors })
  }

  // 3. Parse body safely
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    log('warn', 'invalid_json', { ip })
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400, headers: cors })
  }

  // 4. Extract + sanitize fields (all values go through strip())
  const name     = strip(body.name)
  const email    = strip(body.email)
  const phone    = strip(body.phone)
  const property = strip(body.property)
  const time     = strip(body.time)
  const pagibig  = strip(body.pagibig)
  const message  = strip(body.message).slice(0, 2000)

  // 5. Validate required fields
  if (!name || name.length < 2) {
    return NextResponse.json({ error: 'Please enter your full name.' }, { status: 400, headers: cors })
  }
  if (!email || !isEmail(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400, headers: cors })
  }
  if (!phone || !isPhone(phone)) {
    return NextResponse.json({ error: 'Please enter a valid phone number.' }, { status: 400, headers: cors })
  }

  // 6. Send emails
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    await Promise.all([
      // Admin notification
      resend.emails.send({
        from: FROM,
        to:   RECIPIENT,
        subject: `New Inquiry — ${esc(property) || 'General'} — ${esc(name)}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:auto;">
            <div style="background:#FF6B00;padding:20px 32px;border-radius:12px 12px 0 0;">
              <h2 style="color:white;margin:0;font-size:20px;">New Property Inquiry</h2>
            </div>
            <div style="background:#f9f9f9;padding:32px;border-radius:0 0 12px 12px;">
              <table style="width:100%;border-collapse:collapse;">
                <tr><td style="padding:8px 0;color:#666;width:160px;font-size:14px;">Name</td><td style="padding:8px 0;font-weight:600;font-size:14px;">${esc(name)}</td></tr>
                <tr><td style="padding:8px 0;color:#666;font-size:14px;">Email</td><td style="padding:8px 0;font-size:14px;"><a href="mailto:${esc(email)}">${esc(email)}</a></td></tr>
                <tr><td style="padding:8px 0;color:#666;font-size:14px;">Phone</td><td style="padding:8px 0;font-size:14px;"><a href="tel:${esc(phone)}">${esc(phone)}</a></td></tr>
                <tr><td style="padding:8px 0;color:#666;font-size:14px;">Property</td><td style="padding:8px 0;font-size:14px;">${esc(property) || '—'}</td></tr>
                <tr><td style="padding:8px 0;color:#666;font-size:14px;">Best time</td><td style="padding:8px 0;font-size:14px;">${esc(time) || '—'}</td></tr>
                <tr><td style="padding:8px 0;color:#666;font-size:14px;">Pag-IBIG</td><td style="padding:8px 0;font-size:14px;font-weight:600;color:${pagibig === 'Active Member' ? '#16a34a' : '#d97706'};">${esc(pagibig) || '—'}</td></tr>
                ${message ? `<tr><td style="padding:8px 0;color:#666;font-size:14px;vertical-align:top;">Message</td><td style="padding:8px 0;font-size:14px;white-space:pre-wrap;">${esc(message)}</td></tr>` : ''}
              </table>
            </div>
          </div>
        `,
      }),

      // Customer auto-reply
      resend.emails.send({
        from: FROM,
        to:   email,
        subject: 'We Received Your Inquiry — Orange Square Realty',
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:auto;">
            <div style="background:#FF6B00;padding:20px 32px;border-radius:12px 12px 0 0;">
              <h2 style="color:white;margin:0;font-size:20px;">Thank You, ${esc(name.split(' ')[0])}!</h2>
            </div>
            <div style="background:#f9f9f9;padding:32px;border-radius:0 0 12px 12px;">
              <p style="font-size:15px;color:#333;">We've received your inquiry${property ? ` about <strong>${esc(property)}</strong>` : ''} and one of our loan specialists will contact you within <strong>24 hours</strong>.</p>
              <p style="font-size:15px;color:#333;">For immediate assistance:</p>
              <p style="font-size:15px;"><strong>📞 +63 956 884 3373</strong><br/><strong>📧 ${esc(RECIPIENT)}</strong></p>
              <p style="font-size:13px;color:#999;margin-top:24px;">Orange Square Realty Corporation · Mon–Sat 8AM–6PM</p>
            </div>
          </div>
        `,
      }),
    ])

    log('info', 'inquiry_sent', { ip, property: property || 'general' })
    return NextResponse.json({ success: true }, { headers: cors })

  } catch (err) {
    reportError('email_failed', err, { ip, property: property || 'general' })
    return NextResponse.json(
      { error: 'Unable to send your inquiry right now. Please call us directly at +63 956 884 3373.' },
      { status: 500, headers: cors }
    )
  }
}
