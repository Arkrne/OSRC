# HANDOFF — OSRC Website

> Last updated: 2026-06-14. This document is the single source of truth for picking up
> work on this project. Read the top 5 sections first.

---

## 1. The Goal We're Working Toward

Ship the Orange Square Realty (OSRC) marketing + listings site to production on Vercel:

- A fast, SEO-strong **multi-page** Next.js 16 site for a Philippine real-estate broker
  specializing in Pag-IBIG housing loans.
- An **admin CMS** (`/admin`) where staff log in and manage property listings (with 30-photo
  upload + auto-compression) and promos, backed by Supabase (DB + Auth + Storage).
- Public visitors browse Pag-IBIG-eligible properties, view per-property detail pages, and
  submit inquiries (which email the team via Resend).

**Definition of done for the current milestone:** admin can add a listing with photos → it
appears publicly on `/properties` and its own `/properties/[slug]` page → inquiries email
through → deployed live on the real domain.

---

## 2. Current State of the Code

**Working and verified locally (`npm run build` passes clean; dev on `http://localhost:3000`):**

- ✅ **Photo upload works** via `/api/upload` using the Supabase **service-role key** (bypasses
  Storage RLS; route is gated by an admin auth check).
- ✅ **Listings read** for everyone — public `anon` and logged-in `authenticated` admin (RLS
  `Public read listings` policy added).
- ✅ **Multi-page architecture** live. Routes (from `next build`):
  - `/` (dynamic) — lean homepage
  - `/properties` (dynamic) — searchable grid
  - `/properties/[slug]` (dynamic) — per-property detail page w/ metadata + JSON-LD + `notFound()`
  - `/services`, `/about`, `/contact` (static section pages)
  - `/sitemap.xml` (dynamic, includes every property URL)
  - `/admin/*`, legal pages, `/api/*` all intact
- ✅ **Slug system** — `listings.slug` column added + backfilled + unique index. New listings
  auto-generate a slug on save. Verified: `/properties/catanduanes-43d12a` and
  `catanduanes-341a9a` both return 200 with correct `<title>` and JSON-LD.
- ✅ All nav/footer/CTA links converted from `#anchor` hashes to real routes via `<Link>`.

**Architecture notes:**
- Root layout `src/app/layout.tsx` = `<html><body>` + global metadata (unchanged).
- New route group `src/app/(site)/layout.tsx` wraps all public pages with
  `JsonLd + Navbar + Footer + MobileCTABar + ScrollProgress`. (Route groups don't affect URLs.)
- `/admin` and legal pages live OUTSIDE `(site)` so they don't get the public chrome.
- Listing data access is centralized in `src/lib/listings.ts` (server-side anon reads +
  image/slug helpers). Listing-reading pages use `export const dynamic = 'force-dynamic'` so
  new listings appear instantly without a rebuild (still full SSR HTML for crawlers).

**Section → page distribution (easy to rearrange — each page file is just a list of sections):**
| Page | Sections |
|------|----------|
| `/` | Hero · Partners · WhyChooseUs · VideoShowcase · PropertiesPreview · Promos · TrustStats · FinalCTA |
| `/properties` | PropertiesGrid (search) |
| `/services` | Services · HowItWorks · LoanCalculator · Spotlight |
| `/about` | About · Regions · Gallery · Team · Awards · Testimonials · VideoReel · Insights · Marquee |
| `/contact` | ContactForm · FAQ (+ FAQ JSON-LD) |

---

## 3. Files Actively Edited / Created (this session)

**Created:**
- `src/lib/listings.ts` — server-side listing reads (`getListings`, `getListingBySlug`,
  `getAllSlugs`) + helpers (`getCardImage`, `getFullImages`, `getThumbImages`, `getMainImage`, `makeSlug`).
- `src/app/api/upload/route.ts` — server upload using service-role key (RLS bypass), auth-gated.
- `src/app/(site)/layout.tsx` — shared public chrome.
- `src/app/(site)/page.tsx` — lean homepage (replaces old `src/app/page.tsx`, which was deleted).
- `src/app/(site)/properties/page.tsx` — listing index.
- `src/app/(site)/properties/[slug]/page.tsx` — detail page (generateMetadata + Residence/Product JSON-LD).
- `src/app/(site)/services/page.tsx`, `about/page.tsx`, `contact/page.tsx` — section pages.
- `src/components/PropertyCard.tsx` — repurposed (was dead legacy code) into a `Listing`-based card linking to detail pages.
- `src/components/PropertiesGrid.tsx` — client search grid for `/properties`.
- `src/components/PropertiesPreview.tsx` — server component, 6-listing homepage preview.
- `src/components/PropertyDetail.tsx` — client detail view (gallery + inquiry modal).

**Edited:**
- `src/app/admin/listings/page.tsx` — uploads now POST to `/api/upload`; added `getUser()` session
  guard; generates `slug` on insert.
- `src/components/Navbar.tsx`, `Footer.tsx`, `MobileCTABar.tsx` — links → routes via `<Link>`.
- `src/components/JsonLd.tsx` — split FAQ schema into `FaqJsonLd` (now rendered on `/contact`);
  org+website stay site-wide; search action URL → `/properties`.
- `src/components/{Hero,LoanCalculator,Spotlight,About,Insights,Regions,FAQ}.tsx` — stale
  `#contact` / `#properties` anchors → `/contact` / `/properties`.
- `src/app/sitemap.ts` — async, adds new routes + dynamic property URLs.
- `.env.local` / `.env.example` — added `SUPABASE_SERVICE_ROLE_KEY`.

**Deleted:** `src/app/page.tsx` (old monolithic homepage), `src/components/Properties.tsx`
(old modal-based component, superseded).

**Supabase migrations run (in SQL Editor):**
```sql
-- Storage upload/update policies
CREATE POLICY "Admin upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'property-images');
CREATE POLICY "Admin update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'property-images');
-- Public read (fixes admin/authenticated seeing 0 listings)
CREATE POLICY "Public read listings" ON public.listings FOR SELECT TO public USING (true);
CREATE POLICY "Public read promos"   ON public.promos   FOR SELECT TO public USING (true);
-- Slug column + backfill + unique index
ALTER TABLE listings ADD COLUMN IF NOT EXISTS slug text;
UPDATE listings SET slug = trim(both '-' from lower(regexp_replace(title, '[^a-zA-Z0-9]+', '-', 'g'))) || '-' || substr(id::text, 1, 6) WHERE slug IS NULL OR slug = '';
CREATE UNIQUE INDEX IF NOT EXISTS listings_slug_key ON listings(slug);
```

---

## 4. Everything Tried That Failed (and why) — don't repeat these

### Photo upload: `new row violates row-level security policy`
1. ❌ **Client-side upload with the anon key** (original code). Storage RLS rejected it — the
   request reached Supabase as `anon`, which has no INSERT policy.
2. ❌ **Added storage INSERT/UPDATE policies for `authenticated`** — necessary but not
   sufficient; uploads still failed.
3. ❌ **Moved upload to a server route using the cookie/user-token client**
   (`@supabase/ssr` `createServerClient`). Still failed: the access token wasn't reliably
   applied to the Storage request, so it fell back to `anon`.
4. ✅ **Server route with the service-role key** (`/api/upload`). Bypasses RLS entirely; safe
   because the route checks `getUser()` first. **This is the fix — keep it.**

### Listings saved but not visible
5. ❌ Assumed the DB insert was failing. It wasn't — rows were inserting fine. Verified with the
   service-role key that the rows existed.
6. ❌ Assumed a page refresh / caching issue. Real cause: the `listings` SELECT policy allowed
   only `anon`. The logged-in admin browses as `authenticated`, so they saw **0** rows (RLS on
   SELECT silently returns empty — no error). ✅ Fixed with the `TO public` read policy.

### Multi-page build gotchas (avoided)
- `params` is a `Promise` in Next.js 16 — must `await params` in pages & `generateMetadata`.
- Listing-reading pages set `force-dynamic` so the build doesn't try to prerender them with
  build-time Supabase calls.

---

## 5. Next Steps (in order)

1. **Click-through QA in the browser** at `http://localhost:3000`: every nav item, footer link,
   a couple property cards → detail → inquiry submit. Check mobile widths (320–1024px+).
2. **Add real property listings** via `/admin/listings` (replace the 2 "Catanduanes" test rows —
   ask whether to delete them first).
3. **Deploy to Vercel:**
   - Add `SUPABASE_SERVICE_ROLE_KEY` to Vercel env vars (now **6** vars, not 5) — without it,
     live uploads fall back to the RLS path and fail.
   - Confirm Vercel builds the latest commit.
   - (Supabase migrations above are already applied to the shared project — no prod DB step needed.)
4. **Test inquiry email on the live site** (admin notification to `jolavts@gmail.com` + customer
   auto-reply).
5. **Content/business tasks** below (team photos, hero video self-hosting, domain, etc.).

---

## Vercel Environment Variables (6 required)

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://pfnfgbbccdexbyjorvam.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (from `.env.local`) |
| `SUPABASE_SERVICE_ROLE_KEY` | (from `.env.local` — **server-only secret, never `NEXT_PUBLIC`**) |
| `RESEND_API_KEY` | (from `.env.local`) |
| `INQUIRY_EMAIL` | `jolavts@gmail.com` |
| `RESEND_FROM` | `OSRC Inquiries <onboarding@resend.dev>` |

---

## Remaining Manual / Business Tasks

| Item | Status | Action |
|------|--------|--------|
| Real property photos | ❌ | Add real listings via `/admin/listings` |
| Delete test listings | ❓ | 2 "Catanduanes" test rows still in DB |
| Team section photos | ❌ | Replace placeholders/fake names in `src/components/Team.tsx` (now on `/about`) |
| Hero video | ⚠️ | Hotlinked from Pexels — self-host in `/public` or Supabase Storage |
| `public/og-image.png` | ⚠️ | Optional static fallback (1200×630); dynamic OG generates at build |
| SEC Reg No. `OPC-2024-OSRC-00142` | ❓ | Confirm real number (Footer + Terms) |
| Domain `orangesquarerealty.com.ph` | ❌ | Register with a .PH registrar |
| Resend domain verification | ❌ | After domain live: add DNS records, then update `RESEND_FROM` + auto-reply email |
| NPC Registration | ❌ | Register as Personal Information Controller (RA 10173) |
| PRC License | ❓ | Confirm licensed broker on staff |
| Google Search Console + Business Profile | ❌ | After domain live: submit sitemap, create GBP |

---

## Tech Stack Reference
- **Next.js 16.2.7** App Router (Turbopack) — `node_modules/next/dist/docs/` for API reference.
  ⚠️ Breaking changes vs older Next: `params` is async, Middleware → **Proxy** (`src/proxy.ts`).
- **React 19.2.4** · **Tailwind v4** · **Framer Motion v12** · **lucide-react**
- **`@supabase/ssr` + `@supabase/supabase-js`** — auth + DB + storage
- **Resend v6** — transactional email
- **Supabase Storage** — `property-images` bucket (public), `thumbnails/` subfolder
- **Data layer:** `src/lib/listings.ts` (server reads) · `src/lib/supabase/{client,server}.ts`

---

## Rollback Strategy
- **Vercel:** every deploy saved → Deployments → "Promote to Production" to roll back.
- **Git:** `git revert` / `git reset` to any prior commit.
- **Supabase:** migrations are additive/non-destructive. To reverse:
  `DROP POLICY ...`, `DROP INDEX listings_slug_key`, `ALTER TABLE listings DROP COLUMN slug`.
