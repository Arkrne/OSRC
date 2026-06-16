# Environment Setup — Launch Checklist

Every variable the app reads, what it does, where to get it, and whether it blocks launch.
Copy `.env.example` → `.env.local` for local dev. In production (Vercel), set these in
**Project → Settings → Environment Variables**. Never commit `.env.local` (it's gitignored).

> ⚠️ **Security:** Only `NEXT_PUBLIC_*` variables are exposed to the browser. Everything
> else is server-only. **Never** add the `NEXT_PUBLIC_` prefix to a secret
> (`SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `UPSTASH_*`) — doing so ships it to
> every visitor's browser.

---

## Required to launch

| Variable | What it does | Where to get it |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL — used by the browser, server, and middleware to talk to your database/auth. | Supabase Dashboard → Project Settings → Data API → **Project URL** |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key for client-side reads (subject to RLS). Safe to expose. | Supabase Dashboard → Project Settings → API Keys → **anon / public** |
| `SUPABASE_SERVICE_ROLE_KEY` | **Secret.** Lets `/api/upload` and `/api/delete-listing` write Storage/DB as a trusted identity (bypasses RLS). Routes are auth-gated. | Supabase Dashboard → Project Settings → API Keys → **service_role** |
| `ADMIN_ALLOWED_UIDS` | Comma-separated Supabase user IDs allowed into `/admin` **and** the admin API routes. **Fails closed** — if empty, all admin access (uploads, deletes, dashboard) is denied. | Supabase Dashboard → Authentication → Users → copy the UID of each admin account. Example: `a1b2c3d4-...,e5f6...` |
| `RESEND_API_KEY` | **Secret.** Authenticates outbound email for the contact/inquiry forms. | [resend.com](https://resend.com) → API Keys → Create |
| `INQUIRY_EMAIL` | Inbox that receives new lead notifications. **Default is a placeholder Gmail — change it or leads misroute.** | Your real business inbox, e.g. `inquiries@orangesquarerealty.com.ph` |
| `RESEND_FROM` | The "From" address on outbound mail. **Must be on a domain verified in Resend**, or mail lands in spam / is rejected. Default uses Resend's test domain. | Format: `OSRC Inquiries <noreply@yourdomain.com>`. Verify the domain in Resend → Domains first. |

## Recommended for production (app runs without them, but degraded)

| Variable | What it does | Where to get it | If unset |
|---|---|---|---|
| `UPSTASH_REDIS_REST_URL` | Cross-instance rate limiting for `/api/send-inquiry` (5 req/min/IP). | [console.upstash.com](https://console.upstash.com) → your DB → REST API | Falls back to **in-memory** rate limiting — not shared across serverless instances, so the limit is weak in production. |
| `UPSTASH_REDIS_REST_TOKEN` | Auth token for the above. | Same Upstash REST API page | Same as above. |

---

## Pre-launch verification

- [ ] All **Required** variables set in Vercel (Production environment).
- [ ] `RESEND_FROM` domain shows **Verified** in Resend → Domains.
- [ ] Sent a test inquiry from `/contact` → arrived at `INQUIRY_EMAIL`, and the auto-reply arrived at the submitter.
- [ ] `ADMIN_ALLOWED_UIDS` contains every real admin UID — confirm each admin can log in at `/admin` and a non-listed user is redirected out.
- [ ] Confirmed `SUPABASE_SERVICE_ROLE_KEY` is **not** prefixed with `NEXT_PUBLIC_` anywhere.
- [ ] Upstash vars set (or accepted the in-memory tradeoff for low traffic).
- [ ] `npm run build` exits clean.

---

## Quick reference: what breaks if it's missing

- **No `ADMIN_ALLOWED_UIDS`** → you cannot use the admin CMS at all (fails closed by design).
- **No `RESEND_API_KEY`** → contact + inquiry forms return a 500 ("Unable to send… please call us").
- **Wrong `INQUIRY_EMAIL` / unverified `RESEND_FROM`** → forms appear to work but leads silently misroute or hit spam.
- **No Supabase vars** → site can't load listings or authenticate; most pages error.
- **No Upstash vars** → still works; rate limiting is just per-instance instead of global.
