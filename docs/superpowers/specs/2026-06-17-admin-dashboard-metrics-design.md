# Admin Dashboard Metrics — Design

**Date:** 2026-06-17
**Status:** Approved (scope + visual confirmed by user)

## Goal

Upgrade the admin dashboard (`/admin/dashboard`) from three bare counts into a
genuinely useful operations panel. Headline feature: a phone-style **storage
gauge** (used vs remaining) for the Supabase Storage bucket. Plus the metrics a
realty CMS admin actually needs to run the site.

## Context

- Images live in Supabase Storage bucket `property-images`: full images at the
  bucket root (`{ts}-{i}-{name}.jpg`), thumbnails under `thumbnails/`.
- Content lives in Postgres tables `listings` and `promos`.
- `/admin/*` is gated by `src/proxy.ts` to allowlisted admin UIDs, so the
  dashboard server component may safely use the service-role key (server-only).
- Existing dashboard shows: Listings, Active Promos, Expiring Soon.

## Decisions

- **Storage quota:** Supabase Free tier = **1 GB**. Configurable via
  `STORAGE_QUOTA_GB` env (default `1`) so it's trivial to bump on upgrade.
- **Scope:** Full set (storage gauge + portfolio value + status breakdown +
  data-quality alerts + recently-added + featured).

## Architecture

Separate gathering from presentation.

### `src/lib/admin-stats.ts` (new, server-only)

- `adminClient()` — service-role Supabase client when `SUPABASE_SERVICE_ROLE_KEY`
  is a real JWT; else falls back to the anon key.
- `getStorageStats(): StorageStats` — recursively lists every bucket
  (folders detected by `id === null`), sums `metadata.size`, counts files.
  Paginated (1000/page) with a hard page cap (`capped` flag when hit).
  Wrapped in `unstable_cache` (300 s) to avoid re-listing on every refresh.
  Returns `{ ok, usedBytes, quotaBytes, fileCount, capped }`. On any error,
  `ok: false` and the UI degrades gracefully.
- `getContentStats(): ContentStats` — reads `listings` (selected columns) and
  `promos` once each, computes in JS:
  - `listings`, `featured`, `added30d`, `portfolioValue` (sum `price_value`)
  - `byStatus` — `{ status, count }[]` (null → "Unspecified")
  - `promos`, `expiring` (≤7 d), `expired` (< today)
  - `alerts` — `noPhotos`, `noPrice`, `noDescription` (offending listing titles,
    capped for display) + `expiredPromos`
- `getDashboardStats()` — runs both in parallel.

### `src/app/admin/dashboard/page.tsx` (rewrite, presentation only)

- **StorageGauge** — horizontal bar, `usedBytes/quotaBytes`, free remaining,
  percent, color states: green `<70%`, amber `70–90%`, red `>90%`. Secondary
  line: file count + listing count. Shows an "unavailable" state when
  `ok: false`.
- **Stat cards** — Listings, Active Promos, Expiring, Portfolio (₱ compact),
  Featured, Added (30d).
- **StatusBreakdown** — inline pills.
- **AlertsPanel** — only rendered when there is at least one issue; lists counts
  and a few offending titles, links to `/admin/listings`.
- Existing nav cards retained.

Formatting helpers (in page): `formatBytes`, `formatPeso` (compact B/M/K).

## Error Handling

- Storage listing failure → `ok: false` → gauge shows "Storage data
  unavailable" instead of breaking the page.
- Missing service-role key → falls back to anon; if that can't list, same
  graceful degradation.
- All counts default to 0 / empty.

## Out of Scope (YAGNI)

- Per-listing storage attribution, historical trend charts, real-time updates,
  Supabase Management API integration for exact account usage.
