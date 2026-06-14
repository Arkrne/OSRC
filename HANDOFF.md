# HANDOFF — OSRC Website: Final Push & Deployment

## Repository
- **GitHub:** https://github.com/Arkrne/OSRC.git
- **Local project:** `C:\Users\TUF\Downloads\Orange\osrc-website`

---

## What Is Done ✅

### Legal Pages
| File | Status |
|------|--------|
| `src/app/privacy-policy/page.tsx` | ✅ RA 10173-compliant |
| `src/app/terms/page.tsx` | ✅ Full Terms & Conditions |
| `src/app/disclaimer/page.tsx` | ✅ Property/loan disclaimers |
| `src/app/cookie-policy/page.tsx` | ✅ Minimal cookies, no banner needed |
| `src/components/Footer.tsx` | ✅ Legal links in bottom bar |

### Features
| Feature | Status |
|---------|--------|
| Pag-IBIG field in InquiryModal | ✅ |
| Aira removed everywhere | ✅ Hero + MobileCTABar |
| 30-photo admin with Canvas compression | ✅ Auto-compress, thumbnails, portrait crop |
| Property detail modal (gallery + description) | ✅ |
| 5000-char description | ✅ |
| Resend email (API key set) | ✅ API key set in `.env.local` |
| FROM address fallback | ✅ Uses `onboarding@resend.dev` until domain verified |

### Security (done this session)
| Item | Status |
|------|--------|
| Rate limiting (5 req/min per IP) | ✅ `src/app/api/send-inquiry/route.ts` |
| CORS headers on API | ✅ |
| Input validation + sanitization | ✅ |
| Security headers (HSTS, CSP, X-Frame-Options) | ✅ `src/middleware.ts` |
| Structured JSON logging | ✅ |
| Generic admin login error (no Supabase leak) | ✅ |
| Parameterized queries | ✅ Supabase client does this by default |
| RLS on DB tables | ✅ Done in a previous session |

---

## What Still Needs To Be Done

### 1. Create `.env.example` (for Vercel/team reference)

Create this file at the project root (`osrc-website/.env.example`):

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
RESEND_API_KEY=your-resend-api-key
INQUIRY_EMAIL=your-email@example.com
RESEND_FROM=OSRC Inquiries <noreply@orangesquarerealty.com.ph>
```

### 2. Run Supabase SQL Migrations

Go to **Supabase Dashboard → SQL Editor → New Query** and run:

```sql
-- Add columns needed for multi-photo + description support
ALTER TABLE listings ADD COLUMN IF NOT EXISTS image_urls       text[]  DEFAULT '{}';
ALTER TABLE listings ADD COLUMN IF NOT EXISTS thumbnail_urls   text[]  DEFAULT '{}';
ALTER TABLE listings ADD COLUMN IF NOT EXISTS main_image_index integer DEFAULT 0;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS description      text    DEFAULT '';

-- Database indexes for fields queried most
CREATE INDEX IF NOT EXISTS idx_listings_created_at  ON listings (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_listings_title       ON listings USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_listings_location    ON listings USING gin(to_tsvector('english', location));
CREATE INDEX IF NOT EXISTS idx_promos_created_at    ON promos   (created_at DESC);
```

### 3. Push to GitHub

In PowerShell inside `C:\Users\TUF\Downloads\Orange\osrc-website`:

```powershell
git init
git add .
git commit -m "Initial commit — OSRC website production ready"
git branch -M main
git remote add origin https://github.com/Arkrne/OSRC.git
git push -u origin main
```

If `git init` says already initialized, skip it and start from `git add .`.

### 4. Set Vercel Environment Variables

Go to **Vercel → Project → Settings → Environment Variables** and add:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://pfnfgbbccdexbyjorvam.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (from `.env.local`) |
| `RESEND_API_KEY` | (copy from `.env.local`) |
| `INQUIRY_EMAIL` | `jolavts@gmail.com` |
| `RESEND_FROM` | Leave blank for now (uses onboarding@resend.dev fallback) |

After adding, **redeploy** from Vercel dashboard.

### 5. Deploy on Vercel

- Go to vercel.com → New Project → Import from GitHub → select `Arkrne/OSRC`
- Framework: **Next.js** (auto-detected)
- Root directory: `osrc-website` ← **important**, the repo root is not the Next.js root
- Build command: `npm run build` (default)
- Click Deploy

### 6. Test Inquiry Email End-to-End

✅ Verified locally — both admin notification and customer auto-reply send successfully via Resend.

After deploy, repeat on the live URL:
1. Go to the live site → submit the inquiry form
2. Check `jolavts@gmail.com` for the admin notification email
3. Check the submitted email address for the customer auto-reply
4. If emails don't arrive: check Vercel Function Logs → confirm `RESEND_API_KEY` is set

---

## Pre-Launch Checklist (Manual — Danny / OSRC)

| Item | Status | Action |
|------|--------|--------|
| Admin user in Supabase | ✅ Done | — |
| RLS policies | ✅ Done | — |
| Storage policies | ✅ Done | — |
| Real property photos | ❌ | Log in to `/admin/listings` and add listings with real photos |
| SEC Reg No. `OPC-2024-OSRC-00142` | ❓ | Confirm this is the real number — it appears in Footer + Terms |
| Domain `orangesquarerealty.com.ph` | ❌ | Register with a .PH registrar (requires business docs) |
| Resend domain verification | ❌ | After domain is live: Resend dashboard → Domains → Add → add DNS records |
| Update `RESEND_FROM` env var | ❌ | After domain verified: set `RESEND_FROM=OSRC Inquiries <noreply@orangesquarerealty.com.ph>` in Vercel |
| NPC Registration | ❌ | Register at privacy.gov.ph as a Personal Information Controller (required under RA 10173) |
| PRC License | ❓ | Confirm licensed real estate broker on staff has current PRC license |

---

## Rollback Strategy

- **Vercel:** Every deploy is saved. Go to Vercel → Deployments → click any previous deploy → "Promote to Production" to instantly roll back.
- **GitHub:** All code is version-controlled. `git revert` or `git reset` to any previous commit if needed.
- **Supabase:** The `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` migrations are non-destructive (additive only). They can be reversed with `ALTER TABLE listings DROP COLUMN <name>` if needed, but this is unlikely to be necessary.

---

## Tech Stack Reference
- Next.js App Router (check `node_modules/next/dist/docs/` for breaking changes)
- React 19
- Tailwind v4
- Framer Motion v12
- `@supabase/ssr` + `@supabase/supabase-js`
- Resend for email
- Vercel Analytics (cookieless)
- Supabase Storage (`property-images` bucket, public read)
