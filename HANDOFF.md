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

**Working and verified (`npx tsc --noEmit` passes clean; zero type errors):**

- ✅ **Real business details** — phone, address, TikTok, Facebook, bio all wired everywhere
  (13 touch-points updated in a prior session).
- ✅ **Real logo** — `public/logo.jpg` (the orange-and-navy OSRC wordmark) replaces the CSS
  text badge in Navbar and Footer.
- ✅ **Stats consistent** — "4 Regions" correct across all 5 locations; sourced from
  `src/lib/site.ts` (single source of truth — can't drift again).
- ✅ **Admin UID locked** — only `183105ed-f54a-44e9-9f12-1d6715f58266` can reach `/admin/*`
  (set via `ADMIN_ALLOWED_UIDS` in `.env.local`; everyone else bounces to login).
- ✅ **Photo upload works** via `/api/upload` using the Supabase **service-role key** (bypasses
  Storage RLS; route is gated by an admin auth check + UID allowlist).
- ✅ **Listings read** for everyone — public `anon` and logged-in `authenticated` admin (RLS
  `Public read listings` policy added).
- ✅ **Multi-page architecture** live. Routes:
  - `/` (dynamic) — lean homepage
  - `/properties` (dynamic) — searchable grid
  - `/properties/[slug]` (dynamic) — per-property detail page w/ metadata + JSON-LD + `notFound()`
  - `/services`, `/about`, `/contact` (static section pages)
  - `/sitemap.xml` (dynamic, includes every property URL)
  - `/admin/*`, legal pages, `/api/*` all intact
- ✅ **Slug system** — `listings.slug` column + unique index. New listings auto-generate a slug
  on save.
- ✅ **Inquiry modal** — full ARIA (role=dialog, focus trap, Escape-to-close, body-scroll lock,
  focus restoration). Wired to real `/api/send-inquiry` route with rate limiting.
- ✅ **Promos server-rendered** — no more client-side pop-in (converted to async Server Component).
- ✅ **Spotlight** — driven from the latest DB listing; renders nothing if no listings exist
  (hardcoded fake "Camella Bacoor" is gone).
- ✅ **VideoShowcase** — CSP-compliant video URL (`videos.pexels.com`).
- ✅ **FinalCTA** — fake newsletter removed; real "Browse Properties" + "Get Pre-Qualified" CTA.
- ✅ **JsonLd** — broken `SearchAction` removed (PropertiesGrid doesn't read URL params yet).
- ✅ **Insights** — dead-end click affordances removed from stub blog cards.
- ✅ **LoanCalculator** — `id`/`htmlFor`, `aria-live`, `aria-label` accessibility on all sliders.

**Architecture notes:**
- Root layout `src/app/layout.tsx` = `<html><body>` + global metadata (unchanged).
- `src/app/(site)/layout.tsx` wraps all public pages with
  `JsonLd + Navbar + Footer + MobileCTABar + ScrollProgress`. (Route groups don't affect URLs.)
- `/admin` and legal pages live OUTSIDE `(site)` — no public chrome.
- `src/lib/listings.ts` — server-side anon reads + image/slug helpers.
- `src/lib/site.ts` — STATS, CONTACT, REGIONS, DEVELOPERS constants. Import from here; never
  hardcode numbers directly in components.
- Listing-reading pages use `export const dynamic = 'force-dynamic'` (new listings appear
  instantly without a rebuild).

**Section → page distribution:**
| Page | Sections |
|------|----------|
| `/` | Hero · Partners · WhyChooseUs · VideoShowcase · PropertiesPreview · Promos · TrustStats · FinalCTA |
| `/properties` | PropertiesGrid (text search) |
| `/services` | Services · HowItWorks · LoanCalculator · Spotlight |
| `/about` | About · Regions · Gallery · Team · Awards · Testimonials · VideoReel · Insights · Marquee |
| `/contact` | ContactForm · FAQ (+ FAQ JSON-LD) |

---

## 3. Files Edited / Created (all sessions to date)

### Session 1 — multi-page architecture + slug system
**Created:**
- `src/lib/listings.ts` — server-side listing reads + helpers.
- `src/app/api/upload/route.ts` — server upload using service-role key (auth-gated).
- `src/app/(site)/layout.tsx` — shared public chrome.
- `src/app/(site)/page.tsx` — lean homepage.
- `src/app/(site)/properties/page.tsx` — listing index.
- `src/app/(site)/properties/[slug]/page.tsx` — detail page.
- `src/app/(site)/services/page.tsx`, `about/page.tsx`, `contact/page.tsx`.
- `src/components/PropertyCard.tsx` — `Listing`-based card.
- `src/components/PropertiesGrid.tsx` — client search grid.
- `src/components/PropertiesPreview.tsx` — server component, 6-listing preview.
- `src/components/PropertyDetail.tsx` — client detail view + gallery + inquiry modal.

**Edited:** `src/app/admin/listings/page.tsx`, `src/components/Navbar.tsx`, `Footer.tsx`,
`MobileCTABar.tsx`, `JsonLd.tsx`, `Hero.tsx`, `LoanCalculator.tsx`, `Spotlight.tsx`,
`About.tsx`, `Insights.tsx`, `Regions.tsx`, `FAQ.tsx`, `src/app/sitemap.ts`, `.env.example`.

**Deleted:** `src/app/page.tsx` (old monolithic homepage), `src/components/Properties.tsx`.

### Session 2 — real business info
**Edited:** `src/components/Navbar.tsx`, `Footer.tsx`, `MobileCTABar.tsx`, `ContactForm.tsx`,
`About.tsx`, `JsonLd.tsx`, `Marquee.tsx`, `opengraph-image.tsx`,
`src/app/api/send-inquiry/route.ts`, `src/app/privacy-policy/page.tsx`,
`src/app/disclaimer/page.tsx`, `src/app/terms/page.tsx`, `src/app/cookie-policy/page.tsx`.

### Session 3 — pre-launch audit fixes (current)
**Created:**
- `public/logo.jpg` — real OSRC wordmark logo.
- `src/lib/site.ts` — single source of truth for STATS, CONTACT, REGIONS, DEVELOPERS.
- `src/components/PromosClient.tsx` — client animation layer (split from Promos).
- `src/components/SpotlightCard.tsx` — client display card (split from Spotlight).

**Edited:**
- `src/components/Navbar.tsx` — CSS "OSRC" badge → real `logo.jpg` via `<Image>`.
- `src/components/Footer.tsx` — CSS "OSRC" badge → real `logo.jpg` via `<Image>`.
- `src/components/Hero.tsx` — stats from `lib/site.ts`; "3" → "4" regions.
- `src/components/WhyChooseUs.tsx` — stats from `lib/site.ts`; "3" → "4" regions.
- `src/components/TrustStats.tsx` — stats from `lib/site.ts`; partner count unified to "10+".
- `src/components/About.tsx` — stats from `lib/site.ts`; "3" → "4" regions.
- `src/components/Services.tsx` — "three regions" → "four regions".
- `src/app/opengraph-image.tsx` — stats from `lib/site.ts`; "3" → "4" regions.
- `src/components/FinalCTA.tsx` — fake newsletter replaced with Browse Properties CTA.
- `src/components/VideoShowcase.tsx` — CSP-blocked URL → `videos.pexels.com` direct URL.
- `src/components/Promos.tsx` — rewritten as async Server Component; passes to PromosClient.
- `src/components/Insights.tsx` — removed dead-end click affordances; year 2024 → 2026.
- `src/components/JsonLd.tsx` — removed broken `SearchAction`.
- `src/components/InquiryModal.tsx` — full ARIA overhaul (role, focus trap, Escape, scroll lock).
- `src/components/LoanCalculator.tsx` — `id`/`htmlFor`/`aria-live`/`aria-label` on sliders.
- `src/components/Spotlight.tsx` — rewritten as async Server Component; fetches latest DB listing.
- `src/proxy.ts` — `ADMIN_ALLOWED_UIDS` allowlist check; fallback to any-auth if unset.
- `.env.example` — added `ADMIN_ALLOWED_UIDS` documentation.

**Supabase migrations run (SQL Editor):**
```sql
-- Storage upload/update policies
CREATE POLICY "Admin upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'property-images');
CREATE POLICY "Admin update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'property-images');
-- Public read
CREATE POLICY "Public read listings" ON public.listings FOR SELECT TO public USING (true);
CREATE POLICY "Public read promos"   ON public.promos   FOR SELECT TO public USING (true);
-- Slug column + backfill + unique index
ALTER TABLE listings ADD COLUMN IF NOT EXISTS slug text;
UPDATE listings SET slug = trim(both '-' from lower(regexp_replace(title, '[^a-zA-Z0-9]+', '-', 'g'))) || '-' || substr(id::text, 1, 6) WHERE slug IS NULL OR slug = '';
CREATE UNIQUE INDEX IF NOT EXISTS listings_slug_key ON listings(slug);
```

---

## 4. Everything Tried That Failed (don't repeat these)

### Photo upload: `new row violates row-level security policy`
1. ❌ **Client-side upload with the anon key** — Storage RLS rejected (no INSERT policy for anon).
2. ❌ **Storage INSERT/UPDATE policies for `authenticated`** — necessary but not sufficient.
3. ❌ **Server route with cookie/user-token client** (`@supabase/ssr`) — access token not
   reliably applied to Storage; fell back to anon.
4. ✅ **Server route with the service-role key** (`/api/upload`). Bypasses RLS; safe because
   the route checks `getUser()` first. **Keep this — do not change it.**

### Listings saved but not visible
5. ❌ Assumed DB insert failing — rows were inserting fine (verified with service-role key).
6. ❌ Assumed caching — real cause: SELECT policy was `TO anon` only. Admin logs in as
   `authenticated` → RLS silently returned 0 rows. ✅ Fixed with `TO public` read policy.

### Next.js 16 gotchas
- `params` is a `Promise` — must `await params` in pages and `generateMetadata`.
- Listing pages need `force-dynamic` — don't let the build prerender them with stale data.
- Middleware file must be named **`middleware.ts`** at `src/` root, but this project uses
  `src/proxy.ts` + a barrel `src/middleware.ts` that re-exports. Do not rename `proxy.ts`.

---

## 5. Next Steps (in order)

### Deploy
1. **Add all 7 env vars to Vercel** (see table below) — `ADMIN_ALLOWED_UIDS` is new.
2. **Deploy from GitHub** — push triggers auto-deploy; confirm build passes on Vercel.
3. **Test the live site end-to-end:** browse listings → open inquiry → check email at `jolavts@gmail.com`.
4. **Custom domain** — point `orangesquarerealty.com.ph` to Vercel; add DNS records.
5. **Resend domain verification** — after domain live, add Resend DNS records, change `RESEND_FROM`
   from `onboarding@resend.dev` to `noreply@orangesquarerealty.com.ph`.

### Content (before launch)
6. **Delete or replace** the 2 "Catanduanes" test listings via `/admin/listings`.
7. **Add real property listings** with actual photos.
8. **Replace fabricated team section** — `src/components/Team.tsx` has 4 invented names and
   Unsplash stock photos. Replace with real staff names/photos or remove the section.
9. **Replace fabricated testimonials** — `src/components/Testimonials.tsx` and
   `VideoReel.tsx` have invented client names. Replace with real stories (with consent) or remove.

### Code still to do
10. **Self-host / optimize the 4 autoplaying videos** — currently hotlinked from external CDNs.
    Download, encode ≤720p, add poster images, serve from `/public` or Supabase Storage.
    *(Hero + VideoShowcase are the highest priority — above-the-fold.)*
11. **Wire URL search params** to PropertiesGrid — currently only text-search; `?q=` from
    external links / schema.org SearchAction is ignored. Add `useSearchParams()` read on mount.
12. **Structured listings schema** — the DB `listings` table only has `price` as free-text.
    To add proper filters (region, bedrooms, price range, type), run these migrations:
    ```sql
    ALTER TABLE listings ADD COLUMN price_cents integer;
    ALTER TABLE listings ADD COLUMN region text;
    ALTER TABLE listings ADD COLUMN property_type text;
    ALTER TABLE listings ADD COLUMN bedrooms integer;
    ALTER TABLE listings ADD COLUMN bathrooms integer;
    ALTER TABLE listings ADD COLUMN floor_area_sqm numeric;
    ALTER TABLE listings ADD COLUMN lot_area_sqm numeric;
    ```
    Then update admin form + PropertiesGrid filters + PropertyDetail display.
13. **Generate `public/og-image.png`** — static fallback for JsonLd `logo` field (currently
    404s). Run `npm run build` then screenshot the `/opengraph-image` route, or generate with
    sharp/puppeteer in a one-off script.
14. **Supabase RLS hardening** — confirm public signups are disabled in Supabase Auth settings
    (Dashboard → Auth → Providers → Email → Disable sign-ups). Confirm Storage write policies
    require the specific admin UID (not just `authenticated`).

### Post-launch
15. **Google Search Console** — submit `https://orangesquarerealty.com.ph/sitemap.xml`.
16. **Google Business Profile** — create listing for the Cainta, Rizal office.
17. **NPC Registration** — register as Personal Information Controller under RA 10173.
18. **PRC License** — confirm licensed broker on staff; add broker name/PRC ID to Footer.

---

## Vercel Environment Variables (7 required)

| Key | Value / Notes |
|-----|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://pfnfgbbccdexbyjorvam.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | from `.env.local` |
| `SUPABASE_SERVICE_ROLE_KEY` | from `.env.local` — **server-only, never `NEXT_PUBLIC_`** |
| `RESEND_API_KEY` | from `.env.local` |
| `INQUIRY_EMAIL` | `jolavts@gmail.com` |
| `RESEND_FROM` | `OSRC Inquiries <onboarding@resend.dev>` → change after domain verification |
| `ADMIN_ALLOWED_UIDS` | `183105ed-f54a-44e9-9f12-1d6715f58266` (comma-separate multiple UIDs) |

---

## Known Remaining Issues

| # | Item | File | Priority |
|---|------|------|----------|
| H1 | All stock images/videos still from Unsplash/Pexels | Hero, VideoShowcase, About, Team, Testimonials, Spotlight | High — legal & brand |
| H2 | 4 autoplaying videos hotlinked from external CDNs | Hero.tsx, VideoShowcase.tsx, VideoReel.tsx | High — performance |
| C1 | Fabricated team (invented names + stock photos) | `src/components/Team.tsx` | High — trust |
| C2 | Fabricated testimonials + VideoReel quote | `Testimonials.tsx`, `VideoReel.tsx` | High — trust |
| M1 | URL search params ignored by PropertiesGrid | `PropertiesGrid.tsx` | Medium |
| M2 | Listings table lacks structured fields (price int, region, type, beds) | Supabase + admin form | Medium |
| M3 | `public/og-image.png` missing (JsonLd logo field 404s) | `public/` | Medium |
| M4 | Supabase public signup not confirmed disabled | Supabase Dashboard → Auth | Medium — security |
| M5 | Insights cards are stubs with no destination | `Insights.tsx` | Medium |
| L1 | Google Search Console / sitemap submission | — | Low — post-launch |
| L2 | Google Business Profile | — | Low — post-launch |
| L3 | NPC Registration (RA 10173) | — | Low — compliance |
| L4 | PRC broker license details in Footer | `Footer.tsx` | Low — compliance |

---

## Tech Stack Reference

- **Next.js 16.2.7** App Router (Turbopack) — `node_modules/next/dist/docs/` for API reference.
  ⚠️ Breaking changes vs older Next: `params` is async; Middleware lives in `src/proxy.ts`.
- **React 19.2.4** · **Tailwind v4** (`@theme` block in `globals.css`, no `tailwind.config.js`)
- **Framer Motion v12** — reduced-motion-aware; GPU-only transforms
- **`@supabase/ssr` + `@supabase/supabase-js`** — auth + DB + storage
- **Resend v6** — transactional email (admin notification + customer auto-reply)
- **Upstash Redis** — cross-instance rate limiting for `/api/send-inquiry` (falls back to
  in-memory Map in dev if `UPSTASH_REDIS_REST_URL` is unset)
- **Supabase Storage** — `property-images` bucket (public), `thumbnails/` subfolder

**Key file map:**
| File | Purpose |
|------|---------|
| `src/lib/site.ts` | STATS, CONTACT, REGIONS, DEVELOPERS — import here, never hardcode |
| `src/lib/listings.ts` | Server-side listing reads + image/slug helpers |
| `src/lib/supabase/client.ts` | Browser Supabase client (Client Components only) |
| `src/lib/supabase/server.ts` | Server Supabase client (Server Components, RSC) |
| `src/proxy.ts` | Middleware: admin auth + UID allowlist + security headers + CSP |
| `src/app/api/upload/route.ts` | Storage upload with service-role key (auth-gated) |
| `src/app/api/send-inquiry/route.ts` | Rate-limited inquiry email via Resend |

---

## Rollback Strategy

- **Vercel:** every deploy saved → Deployments → "Promote to Production" to roll back instantly.
- **Git:** `git revert <sha>` to undo a commit without rewriting history.
- **Supabase:** all migrations were additive. To reverse:
  ```sql
  DROP POLICY "Admin upload"         ON storage.objects;
  DROP POLICY "Admin update"         ON storage.objects;
  DROP POLICY "Public read listings" ON public.listings;
  DROP POLICY "Public read promos"   ON public.promos;
  DROP INDEX  listings_slug_key;
  ALTER TABLE listings DROP COLUMN slug;
  ```
