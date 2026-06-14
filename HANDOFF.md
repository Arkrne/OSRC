# HANDOFF — OSRC Website: Final Push & Deployment

## Repository
- **GitHub:** https://github.com/Arkrne/OSRC.git (branch: `main`, latest commit: `81625b3`)
- **Local project:** `C:\Users\TUF\Downloads\Orange\osrc-website`
- **Vercel:** Connected to `Arkrne/OSRC` — root directory set to `osrc-website`

---

## What Is Done ✅

### Legal Pages
| File | Status |
|------|--------|
| `src/app/privacy-policy/page.tsx` | ✅ RA 10173-compliant + SEO metadata + canonical |
| `src/app/terms/page.tsx` | ✅ Full Terms & Conditions + SEO metadata + canonical |
| `src/app/disclaimer/page.tsx` | ✅ Property/loan disclaimers + SEO metadata + canonical |
| `src/app/cookie-policy/page.tsx` | ✅ Minimal cookies, no banner needed + SEO metadata + canonical |
| `src/components/Footer.tsx` | ✅ Legal links in bottom bar |

### Features
| Feature | Status |
|---------|--------|
| Pag-IBIG field in InquiryModal | ✅ |
| Aira removed everywhere | ✅ Hero + MobileCTABar |
| 30-photo admin with Canvas compression | ✅ Auto-compress, thumbnails, portrait crop |
| Property detail modal (gallery + description) | ✅ |
| 5000-char description | ✅ |
| Resend email (API key set) | ✅ API key set in `.env.local` and Vercel env vars |
| FROM address fallback | ✅ Uses `onboarding@resend.dev` until domain verified |
| Inquiry email verified working | ✅ Tested locally — both admin notification and customer auto-reply send |

### Security
| Item | Status |
|------|--------|
| Rate limiting (5 req/min per IP) | ✅ `src/app/api/send-inquiry/route.ts` |
| CORS headers on API | ✅ Allows only `orangesquarerealty.com.ph` + localhost in dev |
| Input validation + sanitization | ✅ |
| Security headers (HSTS, CSP, X-Frame-Options) | ✅ `src/proxy.ts` |
| Vercel Analytics in CSP connect-src | ✅ |
| Structured JSON logging | ✅ |
| Generic admin login error (no Supabase leak) | ✅ |
| Parameterized queries | ✅ Supabase client does this by default |
| RLS on DB tables | ✅ |
| Storage policies | ✅ |
| API key redacted from repo | ✅ Removed from HANDOFF.md before GitHub push |

### SEO
| Item | Status |
|------|--------|
| `metadataBase` set | ✅ `https://orangesquarerealty.com.ph` |
| Title template | ✅ `'%s \| Orange Square Realty'` — legal pages auto-inherit |
| 20 targeted keywords | ✅ Pag-IBIG, house and lot per province, OFW loan, etc. |
| `robots` directive | ✅ `googleBot: max-image-preview large, max-snippet -1` |
| OpenGraph + Twitter card | ✅ All pages |
| Dynamic OG image (1200×630) | ✅ `src/app/opengraph-image.tsx` — branded, builds at deploy time |
| JSON-LD structured data | ✅ `src/components/JsonLd.tsx` — RealEstateAgent, FAQPage, WebSite schemas |
| `sitemap.ts` | ✅ All 5 public routes with priority + changeFrequency |
| `robots.txt` | ✅ `public/robots.txt` — crawlers allowed, `/admin/` blocked |
| `lang="en-PH"` on `<html>` | ✅ |
| Canonical URLs on all pages | ✅ |

### Infrastructure
| Item | Status |
|------|--------|
| `.env.example` | ✅ Created at project root |
| `.env.local` | ✅ Has all 5 keys including `RESEND_FROM` |
| Supabase SQL migrations | ✅ Run — 4 columns + 4 indexes added |
| GitHub push | ✅ `https://github.com/Arkrne/OSRC` — branch `main` |
| `middleware.ts` → `proxy.ts` | ✅ Renamed + export renamed `middleware` → `proxy` per Next.js 16 |
| Resend lazy init | ✅ Moved inside POST handler — no longer crashes build |
| Auto-reply contact email | ✅ Fixed — was `inquiries@orangesquarerealty.com.ph` (unregistered), now `jolavts@gmail.com` |
| Vercel env vars | ✅ All 5 set in Vercel project settings |
| Admin user in Supabase | ✅ |
| RLS policies | ✅ |

---

## What Still Needs To Be Done

### 1. Complete Vercel Deployment (IN PROGRESS)

The latest build on Vercel is failing on commit `e5f96fa` — that is an **old commit**.
The fix is in commit `81625b3`. Make sure Vercel is building the latest commit:

- Go to **Vercel → Deployments**
- Find the deployment that says **Commit: `81625b3`** (it may have auto-triggered from the GitHub push)
- If it hasn't appeared, go to **Deployments → New Deployment → Branch: main**
- Do NOT click "Redeploy" on the old `e5f96fa` deployment

### 2. Test Inquiry Email on Live Site

After a successful Vercel deploy:
1. Go to the live site → submit the inquiry form
2. Check `jolavts@gmail.com` for the admin notification
3. Check the submitted email address for the customer auto-reply
4. If emails don't arrive: Vercel → Project → Functions → check logs for `RESEND_API_KEY`

### 3. Fix "Upload Failed" on Admin Listings ← NEXT TASK

The error message now shows the real Supabase error (commit `50c5c5e`).
Try adding a listing and read the exact error shown.

**Most likely cause — missing storage policy.** Run this in Supabase SQL Editor:

```sql
CREATE POLICY "Admin upload" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'property-images');

CREATE POLICY "Admin update" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'property-images');
```

**Second most likely — bucket doesn't exist.** Go to Supabase → Storage.
If `property-images` is not listed, create it as a **public** bucket.

### 4. Add Real Property Listings

After upload is fixed, log in to `/admin/listings` and add real properties.
The public Properties section shows "No listings available yet." until you do this.

---

## Remaining Manual / Business Tasks

| Item | Status | Action |
|------|--------|--------|
| Real property photos | ❌ | Log in to `/admin/listings` and add listings with real photos |
| Team section photos | ❌ | Replace placeholder Unsplash photos + fake names in `src/components/Team.tsx` with real team members — or remove the section |
| Hero video | ⚠️ | Currently hotlinked from Pexels (`videos.pexels.com`) — Pexels can block this. Replace with a self-hosted video in `/public` or Supabase Storage |
| `public/og-image.png` | ⚠️ | The dynamic OG image generates at build time. Optionally also add a static `public/og-image.png` (1200×630) as a fallback for pages that don't use the dynamic generator |
| SEC Reg No. `OPC-2024-OSRC-00142` | ❓ | Confirm this is the real number — appears in Footer + Terms |
| Domain `orangesquarerealty.com.ph` | ❌ | Register with a .PH registrar (requires business docs) |
| Resend domain verification | ❌ | After domain is live: Resend dashboard → Domains → Add → add DNS records |
| Update `RESEND_FROM` in Vercel | ❌ | After domain verified: change to `OSRC Inquiries <noreply@orangesquarerealty.com.ph>` in Vercel env vars + redeploy |
| Update auto-reply contact email | ❌ | After domain verified: update `route.ts:163` from `jolavts@gmail.com` to `inquiries@orangesquarerealty.com.ph` |
| NPC Registration | ❌ | Register at `privacy.gov.ph` as a Personal Information Controller (required under RA 10173) |
| PRC License | ❓ | Confirm licensed real estate broker on staff has current PRC license |
| Google Search Console | ❌ | After domain is live: submit `https://orangesquarerealty.com.ph/sitemap.xml` to GSC |
| Google Business Profile | ❌ | Create a Google Business Profile — critical for local SEO ranking in PH |

---

## Vercel Environment Variables (all 5 required)

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://pfnfgbbccdexbyjorvam.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (from `.env.local` line 2) |
| `RESEND_API_KEY` | (from `.env.local` line 3) |
| `INQUIRY_EMAIL` | `jolavts@gmail.com` |
| `RESEND_FROM` | `OSRC Inquiries <onboarding@resend.dev>` |

---

## Git Commit History

| Commit | Description |
|--------|-------------|
| `95bf23b` | Initial commit from Create Next App |
| `51b2f49` | SEO: JSON-LD, OG image, full metadata, robots, sitemap + security fixes |
| `e5f96fa` | Fix Vercel build: lazy Resend init, middleware → proxy |
| `81625b3` | Fix opengraph-image: Satori-compliant JSX |
| `9b0a448` | Update HANDOFF.md |
| `50c5c5e` | Show real Supabase error message on upload failure ← **latest** |

---

## Rollback Strategy

- **Vercel:** Every deploy is saved. Go to Vercel → Deployments → click any previous deploy → "Promote to Production" to instantly roll back.
- **GitHub:** All code is version-controlled. `git revert` or `git reset` to any previous commit if needed.
- **Supabase:** The `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` migrations are non-destructive. Reverse with `ALTER TABLE listings DROP COLUMN <name>` if needed.

---

## Tech Stack Reference
- **Next.js 16.2.7** App Router — `node_modules/next/dist/docs/` for API reference
- **React 19.2.4**
- **Tailwind v4**
- **Framer Motion v12**
- **`@supabase/ssr` + `@supabase/supabase-js`** — auth + DB + storage
- **Resend v6** — transactional email
- **Vercel Analytics** (cookieless, no GDPR banner needed)
- **Supabase Storage** — `property-images` bucket, public read, `thumbnails/` subfolder
- **Proxy file:** `src/proxy.ts` (was `middleware.ts` — renamed in Next.js 16)
