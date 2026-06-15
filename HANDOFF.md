# HANDOFF — OSRC Website

> Last updated: 2026-06-15. This document is the single source of truth for picking up
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

- ✅ **Real business details** — phone, address, TikTok, Facebook, bio all wired everywhere.
- ✅ **Real logo** — `public/logo.jpg` (the orange-and-navy OSRC wordmark) in Navbar and Footer.
- ✅ **Stats consistent** — "4 Regions" sourced from `src/lib/site.ts` (single source of truth).
- ✅ **Admin UID locked** — only `183105ed-f54a-44e9-9f12-1d6715f58266` can reach `/admin/*`.
- ✅ **Photo upload** — `/api/upload` with service-role key, auth-gated, parallel per-photo.
- ✅ **16:9 image pipeline** — all uploads center-cropped to 16:9 at upload time via Canvas API.
  Quality: full 1920×1080 @ 0.88 JPEG, thumbnail 640×360 @ 0.85 JPEG. No blur.
- ✅ **Listings read** for everyone — public `anon` and logged-in `authenticated` admin.
- ✅ **Multi-page architecture** live. Routes:
  - `/` — lean homepage (force-dynamic)
  - `/properties` — searchable + filterable grid (force-dynamic)
  - `/properties/[slug]` — ISR detail page (`revalidate=300`, `dynamicParams=true`, `generateStaticParams`)
  - `/services`, `/about`, `/contact` — static section pages
  - `/sitemap.xml` — ISR (`revalidate=3600`), capped at 1,000 slugs
  - `/admin/*`, legal pages, `/api/*` all intact
- ✅ **Slug system** — `listings.slug` column + unique index.
- ✅ **Inquiry modal** — full ARIA (role=dialog, focus trap, Escape, scroll lock, focus restore).
- ✅ **Promos** — async Server Component, no client-side pop-in.
- ✅ **Spotlight** — async Server Component, driven from latest DB listing.
- ✅ **Admin listings page** — dark espresso redesign; search + sort toolbar; 16:9 thumbnails;
  status colour badges; **pagination 50/page**; parallel upload in batches of 5.
- ✅ **Admin promos page** — search + sort toolbar; expiry badges (Expired / Expiring Soon);
  expired rows dimmed automatically based on today's date.
- ✅ **Admin dashboard** — async server component; live counts for listings, promos, and
  promos expiring within 7 days shown as a stat strip.
- ✅ **Delete cleans Storage** — `/api/delete-listing` deletes the DB row then removes all
  full + thumbnail images from the `property-images` bucket using the service-role key.
- ✅ **Filter bar on `/properties`** — URL-param–driven; 6 dimensions: property type, region,
  status, bedrooms (1–5+), min price, max price. Collapsible on mobile. Active filter count badge.
  Pagination preserves all active filters.
- ✅ **Extended search** — `getListings` now searches title, location, property_type, region,
  and description (was title + location only).
- ✅ **`price_value` column** — `bigint` column on `listings` table, backfilled from `price`
  string. Used for price range filter (`gte`/`lte`). The `price` string column is **still present**
  (transition period — do not drop yet).
- ✅ **`CARD_COLUMNS` selective fetching** — grid and preview views fetch only the columns
  they need (excludes `features`, `lot_area`, `pagibig_eligible`, etc.).
- ✅ **OG image dimensions** — detail page OpenGraph height corrected from 900 → 675 (16:9).
- ✅ **`makeSlug` deduplicated** — single implementation in `lib/listings.ts`; admin page
  imports it instead of maintaining a local copy.
- ✅ **Gallery preload + shimmer** — detail page preloads all full-size photos on mount via
  `new window.Image()` so clicking thumbnails is instant. A shimmer animation plays while any
  photo is still downloading. Images served `unoptimized` (direct Supabase CDN URL) since they
  are already 1920×1080 JPEG @ 0.88 from the upload pipeline.

**Architecture notes:**
- Root layout `src/app/layout.tsx` = `<html><body>` + global metadata (unchanged).
- `src/app/(site)/layout.tsx` wraps all public pages with
  `JsonLd + Navbar + Footer + MobileCTABar + ScrollProgress`. (Route groups don't affect URLs.)
- `/admin` and legal pages live OUTSIDE `(site)` — no public chrome.
- `src/lib/listings.ts` — server-side anon reads + image/slug helpers + `ListingFilters` type
  + `CARD_COLUMNS` constant + `applyFilters` helper used by both `getListings` and
  `getListingsCount`. Any new filter dimension must be added to `applyFilters` to work in
  both count and data queries simultaneously.
- `src/lib/site.ts` — STATS, CONTACT, REGIONS, DEVELOPERS constants. Import from here; never
  hardcode numbers directly in components.
- `/properties/[slug]` is ISR. New slugs are pre-generated at build via `generateStaticParams`;
  unknown slugs at runtime are served dynamically via `dynamicParams=true` and cached for 5
  minutes. New listing → up to 5 min for a cached page, but served immediately on first hit.
- `/properties` (the grid) remains `force-dynamic` — too many filter combinations to pre-render.
- Admin dashboard is a **server component** with no `'use client'`. The logout button is a
  separate `src/app/admin/LogoutButton.tsx` client component imported by the dashboard.
- **Gallery images use `unoptimized={true}`** — bypasses `/_next/image` optimizer (which adds
  1-2s server-side processing latency per image on first hit). Safe because images are already
  optimally sized at upload time. Do not remove `unoptimized` from the detail gallery.

**Section → page distribution:**
| Page | Sections |
|------|----------|
| `/` | Hero · Partners · WhyChooseUs · VideoShowcase · PropertiesPreview · Promos · TrustStats · FinalCTA |
| `/properties` | PropertiesGrid (search + 6-dimension filter bar + pagination) |
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

### Session 3 — pre-launch audit fixes
**Created:**
- `public/logo.jpg` — real OSRC wordmark logo.
- `src/lib/site.ts` — single source of truth for STATS, CONTACT, REGIONS, DEVELOPERS.
- `src/components/PromosClient.tsx` — client animation layer (split from Promos).
- `src/components/SpotlightCard.tsx` — client display card (split from Spotlight).

**Edited:** `Navbar.tsx`, `Footer.tsx`, `Hero.tsx`, `WhyChooseUs.tsx`, `TrustStats.tsx`,
`About.tsx`, `Services.tsx`, `opengraph-image.tsx`, `FinalCTA.tsx`, `VideoShowcase.tsx`,
`Promos.tsx`, `Insights.tsx`, `JsonLd.tsx`, `InquiryModal.tsx`, `LoanCalculator.tsx`,
`Spotlight.tsx`, `src/proxy.ts`, `.env.example`.

**Supabase migrations run (SQL Editor):**
```sql
CREATE POLICY "Admin upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'property-images');
CREATE POLICY "Admin update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'property-images');
CREATE POLICY "Public read listings" ON public.listings FOR SELECT TO public USING (true);
CREATE POLICY "Public read promos"   ON public.promos   FOR SELECT TO public USING (true);
ALTER TABLE listings ADD COLUMN IF NOT EXISTS slug text;
UPDATE listings SET slug = trim(both '-' from lower(regexp_replace(title, '[^a-zA-Z0-9]+', '-', 'g'))) || '-' || substr(id::text, 1, 6) WHERE slug IS NULL OR slug = '';
CREATE UNIQUE INDEX IF NOT EXISTS listings_slug_key ON listings(slug);
```

### Session 4 — image quality + admin redesign + 14-item scalability sprint

**Created:**
- `src/app/api/delete-listing/route.ts` — DELETE endpoint; removes DB row then purges all
  full + thumbnail images from Storage using the service-role key. Auth-gated.
- `src/app/admin/LogoutButton.tsx` — `'use client'` logout button extracted so the dashboard
  page can be a pure async server component.

**Edited:**
- `src/lib/listings.ts` — added `price_value: number | null` to `Listing` type; added
  `CARD_COLUMNS` constant; added `ListingFilters` type; added `applyFilters` helper shared
  between `getListings` and `getListingsCount`; extended search to 5 fields; added `.limit(1000)`
  to `getAllSlugs`.
- `src/app/(site)/properties/page.tsx` — reads 7 filter searchParams; passes to
  `getListings`/`getListingsCount`/`PropertiesGrid`.
- `src/app/(site)/properties/[slug]/page.tsx` — removed `force-dynamic`; added
  `revalidate=300`, `dynamicParams=true`, `generateStaticParams`; OG image height 900→675.
- `src/components/PropertiesGrid.tsx` — full rewrite; collapsible 6-dimension filter bar;
  URL-param driven; active filter count badge.
- `src/components/PropertiesPreview.tsx` — passes `select: CARD_COLUMNS` to `getListings`.
- `src/components/PropertyCard.tsx` — image container `h-[220px]` → `aspect-video`.
- `src/components/PropertyDetail.tsx` — gallery container `aspect-[4/3]` → `aspect-video`.
- `src/app/admin/listings/page.tsx` — full session 4 overhaul (see HANDOFF history).
- `src/app/admin/promos/page.tsx` — search + sort toolbar; expiry badges; expired rows dimmed.
- `src/app/admin/dashboard/page.tsx` — async server component; parallel stat fetches.
- `src/app/sitemap.ts` — `force-dynamic` → `revalidate=3600`.

**Supabase migrations run (SQL Editor):**
```sql
ALTER TABLE listings ADD COLUMN IF NOT EXISTS price_value bigint;
UPDATE listings
SET price_value = CAST(REGEXP_REPLACE(price, '[^0-9]', '', 'g') AS bigint)
WHERE price IS NOT NULL
  AND REGEXP_REPLACE(price, '[^0-9]', '', 'g') != '';
CREATE INDEX IF NOT EXISTS idx_listings_price_value ON listings (price_value);
```

### Session 5 — gallery preload + shimmer

**Edited:**
- `src/components/PropertyDetail.tsx` — rewrote gallery to:
  1. Use `unoptimized={true}` on full-size gallery `<Image>` (bypasses `/_next/image` optimizer;
     images are already resized at upload so no quality loss).
  2. Add `useEffect` preloader: on mount, creates `new window.Image()` for every photo URL so
     the browser fetches all of them in the background before the user clicks.
  3. Track `activeLoaded` boolean state; reset to `false` via `switchPhoto()` whenever the user
     picks a new thumbnail.
  4. Show a sliding shimmer overlay (`shimmer` keyframe, defined in `globals.css`) whenever
     `!activeLoaded` — disappears the instant `onLoad` fires on the `<Image>`.
  5. Added `useRef` + `switchPhoto()` helper to coordinate state resets cleanly.
  6. Removed unused `motion` import (AnimatePresence still used for InquiryModal).
- `src/app/globals.css` — added `@keyframes shimmer` (sweeping gradient, 1.4s loop).

---

## 4. Everything Tried That Failed (don't repeat these)

### Photo upload: `new row violates row-level security policy`
1. ❌ **Client-side upload with the anon key** — Storage RLS rejected.
2. ❌ **Storage INSERT/UPDATE policies for `authenticated`** — necessary but not sufficient.
3. ❌ **Server route with cookie/user-token client** (`@supabase/ssr`) — access token not
   reliably applied to Storage; fell back to anon.
4. ✅ **Server route with the service-role key** (`/api/upload`). Bypasses RLS; safe because
   the route checks `getUser()` first. **Keep this — do not change it.**

### Listings saved but not visible
5. ❌ Assumed DB insert failing — rows were inserting fine.
6. ❌ Assumed caching — real cause: SELECT policy was `TO anon` only. Admin logs in as
   `authenticated` → RLS silently returned 0 rows. ✅ Fixed with `TO public` read policy.

### Next.js 16 gotchas
- `params` is a `Promise` — must `await params` in pages and `generateMetadata`.
- `/properties/[slug]` was `force-dynamic`; now ISR. New slugs at runtime are served via
  `dynamicParams=true` without needing a rebuild.
- Middleware file must be named **`middleware.ts`** at `src/` root, but this project uses
  `src/proxy.ts` + a barrel `src/middleware.ts` that re-exports. Do not rename `proxy.ts`.
- Admin dashboard cannot be a client component AND a server component in the same file — the
  logout button was extracted to `LogoutButton.tsx` so the page could be `async`.

### Dynamic filter building with Supabase TypeScript types
- Supabase's query builder returns progressively narrowed generic types on each chained method.
  A `let query = supabase.from(...).select(...)` variable can't be reassigned after chaining
  without TypeScript complaining about type mismatches. Solution: type the variable as `any`
  and wrap filter logic in an `applyFilters(q: any, f: ListingFilters): any` helper. This is
  the established pattern in `src/lib/listings.ts` — follow it for any new filter dimensions.

### Gallery preload — two approaches that didn't work
7. ❌ **`AnimatePresence` + single keyed `<Image>`** — unmounts and remounts on every thumbnail
   click, triggering a fresh `/_next/image` server request each time. No preloading at all.
8. ❌ **Stacked `opacity-0` images with `loading="eager"`** — `/_next/image` is the bottleneck,
   not the browser. Even with all images rendered in the DOM, the Next.js image optimizer still
   processes each URL server-side on first request (1-2s). Hidden images may also be deprioritized
   by the browser even with `loading="eager"`. Shimmer also didn't show because `onLoad` on
   pre-rendered hidden images fired before the user switched to that photo.
9. ✅ **`unoptimized={true}` + `useEffect` preloader** — serves raw Supabase CDN URLs (already
   optimized at upload), preloads all of them via `new window.Image()` on mount. Cache hit on
   click = instant. Shimmer reliably shows because `activeLoaded` resets to `false` in
   `switchPhoto()` before the new image mounts. **Keep `unoptimized` on gallery images.**

---

## 5. Next Steps (in order)

### Deploy (blocking launch)
1. **Commit + push session 4 & 5 changes** — run the git commands below.
2. **Add all 7 env vars to Vercel** (see table in section 6).
3. **Deploy from GitHub** — push triggers auto-deploy; confirm build passes on Vercel.
4. **Test the live site end-to-end:**
   - Browse listings → filter by type/region → open detail page → click through all photos
     (should be instant after first load) → open inquiry → check `jolavts@gmail.com` for email.
5. **Custom domain** — point `orangesquarerealty.com.ph` to Vercel; add DNS records.
6. **Resend domain verification** — after domain live, add Resend DNS records, change
   `RESEND_FROM` from `onboarding@resend.dev` to `noreply@orangesquarerealty.com.ph`.

**Git commands to push all uncommitted work:**
```bash
cd osrc-website
git add HANDOFF.md \
  src/app/globals.css \
  src/components/PropertyDetail.tsx \
  src/app/admin/LogoutButton.tsx \
  src/app/api/delete-listing/ \
  src/lib/useVideoAutoplay.ts \
  src/app/admin/dashboard/page.tsx \
  src/app/admin/listings/page.tsx \
  src/app/admin/promos/page.tsx \
  src/app/(site)/properties/page.tsx \
  src/app/(site)/properties/[slug]/page.tsx \
  src/app/sitemap.ts \
  src/components/PropertiesGrid.tsx \
  src/components/PropertiesPreview.tsx \
  src/components/PropertyCard.tsx \
  src/components/Gallery.tsx \
  src/components/Hero.tsx \
  src/components/JsonLd.tsx \
  src/components/Spotlight.tsx \
  src/components/VideoReel.tsx \
  src/components/VideoShowcase.tsx \
  src/lib/listings.ts \
  supabase/

git commit -m "feat: gallery preload + shimmer; session 4 scalability sprint"
git push origin main
```

### Code still to do
7. **Self-host / optimize the 4 autoplaying videos** — currently hotlinked from external CDNs.
   Download, encode ≤720p, add poster images, serve from `/public` or Supabase Storage.
   *(Hero + VideoShowcase are the highest priority — above-the-fold.)*
8. **Generate `public/og-image.png`** — static fallback for JsonLd `logo` field (currently
   404s). Run `npm run build` then screenshot the `/opengraph-image` route, or generate with
   sharp/puppeteer in a one-off script.
9. **Supabase RLS hardening** — confirm public signups are disabled (Dashboard → Auth →
   Providers → Email → Disable sign-ups). Confirm Storage write policies require the specific
   admin UID (not just `authenticated`).
10. **Drop `price` string column** — once `price_value` has been live in production and
    verified stable for 1–2 weeks, update `PropertyCard`, `PropertyDetail`, and the admin form
    to read exclusively from `price_value`, then run:
    ```sql
    ALTER TABLE listings DROP COLUMN price;
    ```
    Until then, both columns coexist. Do not drop early.
11. **Sitemap index** — split `/sitemap.xml` into a sitemap index file once listing count
    approaches 1,000. Currently capped at 1,000 via `.limit(1000)` in `getAllSlugs`.

### Content (before launch)
12. **Delete or replace** the test listings via `/admin/listings`.
13. **Add real property listings** with actual photos.
14. **Replace fabricated team section** — `src/components/Team.tsx` has invented names and
    Unsplash stock photos. Replace with real staff names/photos or remove the section.
15. **Replace fabricated testimonials** — `Testimonials.tsx` and `VideoReel.tsx` have invented
    client names. Replace with real stories (with consent) or remove.

### Post-launch
16. **Google Search Console** — submit `https://orangesquarerealty.com.ph/sitemap.xml`.
17. **Google Business Profile** — create listing for the Cainta, Rizal office.
18. **NPC Registration** — register as Personal Information Controller under RA 10173.
19. **PRC License** — confirm licensed broker on staff; add broker name/PRC ID to Footer.

---

## 6. Vercel Environment Variables (7 required)

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

## 7. Known Remaining Issues

| # | Item | File | Priority |
|---|------|------|----------|
| H1 | Stock images/videos still from Unsplash/Pexels | Hero, VideoShowcase, About, Team, Testimonials, Spotlight | High — legal & brand |
| H2 | 4 autoplaying videos hotlinked from external CDNs | Hero.tsx, VideoShowcase.tsx, VideoReel.tsx | High — performance |
| C1 | Fabricated team (invented names + stock photos) | `src/components/Team.tsx` | High — trust |
| C2 | Fabricated testimonials + VideoReel quote | `Testimonials.tsx`, `VideoReel.tsx` | High — trust |
| M1 | `public/og-image.png` missing (JsonLd logo field 404s) | `public/` | Medium |
| M2 | Supabase public signup not confirmed disabled | Supabase Dashboard → Auth | Medium — security |
| M3 | `price` string column still present alongside `price_value` | `listings` table | Medium — cleanup after verification |
| M4 | Insights cards are stubs with no destination | `Insights.tsx` | Medium |
| L1 | Google Search Console / sitemap submission | — | Low — post-launch |
| L2 | Google Business Profile | — | Low — post-launch |
| L3 | NPC Registration (RA 10173) | — | Low — compliance |
| L4 | PRC broker license details in Footer | `Footer.tsx` | Low — compliance |

---

## 8. Tech Stack Reference

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
| `src/lib/listings.ts` | Server-side listing reads; `Listing` type; `CARD_COLUMNS`; `ListingFilters`; `applyFilters`; image/slug helpers |
| `src/lib/supabase/client.ts` | Browser Supabase client (Client Components only) |
| `src/lib/supabase/server.ts` | Server Supabase client (Server Components, RSC, API routes) |
| `src/proxy.ts` | Middleware: admin auth + UID allowlist + security headers + CSP |
| `src/app/api/upload/route.ts` | Storage upload with service-role key (auth-gated) |
| `src/app/api/delete-listing/route.ts` | DB delete + Storage image cleanup with service-role key (auth-gated) |
| `src/app/api/send-inquiry/route.ts` | Rate-limited inquiry email via Resend |
| `src/app/admin/LogoutButton.tsx` | `'use client'` logout button — the only client piece of the dashboard |
| `src/components/PropertiesGrid.tsx` | Client grid: URL-param filter bar + debounced search + pagination |
| `src/components/PropertyDetail.tsx` | Detail page gallery: preloader + shimmer + `unoptimized` images |

**Image upload pipeline (`src/app/admin/listings/page.tsx`):**
```
File → processFile() → Canvas 16:9 center-crop → drawBlob()
  → full  1920×1080 JPEG @ 0.88  (fullBlob)
  → thumb  640×360  JPEG @ 0.85  (thumbBlob)
  → /api/upload (5 in parallel per batch) → Supabase Storage
```

**Gallery image pipeline (`src/components/PropertyDetail.tsx`):**
```
Mount → useEffect preloader → new Image() × N → Supabase CDN (background)
Click thumbnail → switchPhoto(i) → activeLoaded=false → shimmer shows
                                 → <Image key={i} unoptimized src={url}> mounts
                                 → onLoad fires → activeLoaded=true → shimmer hides
```

**Filter URL shape for `/properties`:**
```
/properties?q=camella&type=Townhouse&region=CALABARZON&status=Pre-Selling&bedrooms=3&minPrice=1500000&maxPrice=4000000&page=2
```

**Adding a new filter dimension checklist:**
1. Add the Supabase `.eq()/.gte()/.lte()` clause to `applyFilters` in `src/lib/listings.ts`
2. Add the URL param to `searchParams` in `src/app/(site)/properties/page.tsx`
3. Add to `ListingFilters` type in `src/lib/listings.ts`
4. Add UI control to the filter panel in `src/components/PropertiesGrid.tsx`
5. Add to `buildHref` and `latestFilters` ref in `PropertiesGrid.tsx`

---

## 9. Rollback Strategy

- **Vercel:** every deploy saved → Deployments → "Promote to Production" to roll back instantly.
- **Git:** `git revert <sha>` to undo a commit without rewriting history.
- **Supabase — all migrations were additive. To reverse:**

  Session 3 policies + slug:
  ```sql
  DROP POLICY "Admin upload"         ON storage.objects;
  DROP POLICY "Admin update"         ON storage.objects;
  DROP POLICY "Public read listings" ON public.listings;
  DROP POLICY "Public read promos"   ON public.promos;
  DROP INDEX  listings_slug_key;
  ALTER TABLE listings DROP COLUMN slug;
  ```

  Session 4 price_value column:
  ```sql
  DROP INDEX IF EXISTS idx_listings_price_value;
  ALTER TABLE listings DROP COLUMN price_value;
  ```
  ⚠️ If you roll back `price_value`, also revert `src/lib/listings.ts` (remove `applyFilters`
  minPrice/maxPrice clauses) and `PropertiesGrid.tsx` (remove min/max price filter inputs)
  to avoid runtime errors querying a non-existent column.
