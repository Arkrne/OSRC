# OSRC Site Audit Fixes — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix all P0 (broken) and P1 (UX friction) issues from the June 2026 site audit, plus two quick P2 polish items.

**Architecture:** Pure component/utility edits — no new routes, no schema changes, no new dependencies. The video fix requires a one-time manual asset upload to Supabase Storage; all other changes are code-only.

**Tech Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion, Supabase (storage + DB)

---

## File Map — what each file owns

| File | Change |
|---|---|
| `src/components/Hero.tsx` | Update hero video `src` → self-hosted URL |
| `src/components/VideoReel.tsx` | Update lifestyle reel video `src` → self-hosted URL |
| `src/components/VideoShowcase.tsx` | Update showcase video `src` → self-hosted URL |
| `src/components/Gallery.tsx` | Update Community Tour video `src` → self-hosted URL |
| `src/components/Navbar.tsx` | "Consult" → "Free Consult" on mobile compact CTA |
| `src/components/ContactForm.tsx` | "Send Inquiry Form" → "Send Inquiry" |
| `src/components/FAQ.tsx` | Self-referential `/contact` link → `#contact` anchor |
| `src/lib/listings.ts` | Add `displayPrice()` utility |
| `src/components/PropertyCard.tsx` | Use `displayPrice()` for price display |
| `src/components/PropertyDetail.tsx` | Use `displayPrice()` for price display |
| `src/components/TrustStats.tsx` | Prevent counter from flashing 0 on first render |
| `src/components/InquiryModal.tsx` | Better placeholder for optional property field |

---

## Task 1: Fix broken Pexels videos (B1 + B2 — P0)

**The problem:** Pexels CDN blocks hotlinking via `Referer` check. Any `<video src="https://videos.pexels.com/...">` embedded on a third-party domain returns HTTP 403. This affects:
- Hero background video (`Hero.tsx:52`)
- Lifestyle section video (`VideoReel.tsx:17`)
- Lifestyle showcase video (`VideoShowcase.tsx:62`)
- Gallery "Community Tour" video (`Gallery.tsx:15`) — this is also "B2" in the audit

**Files:**
- Modify: `src/components/Hero.tsx:52`
- Modify: `src/components/VideoReel.tsx:17`
- Modify: `src/components/VideoShowcase.tsx:62`
- Modify: `src/components/Gallery.tsx:15`

### 1A: Download the 4 Pexels videos

- [ ] **Step 1: Open each Pexels page and download the video**

Open these 4 URLs in a browser (not via `<video src>` — direct page visits work):
```
https://www.pexels.com/video/7578552/
https://www.pexels.com/video/8293760/
https://www.pexels.com/video/29913691/
https://www.pexels.com/video/7578548/
```
Click the Download button on each page. Choose the "HD" (1920×1080) version — not UHD — to keep file sizes manageable (typically 30–80 MB each for ~30 seconds of footage).

Rename the downloaded files to:
- `hero.mp4`
- `lifestyle-reel.mp4`
- `lifestyle-showcase.mp4`
- `community-tour.mp4`

- [ ] **Step 2: Create a Supabase Storage bucket for videos**

Log in to your Supabase dashboard → Storage → New bucket.
- Bucket name: `videos`
- Public: ✓ (toggle ON — the videos are not sensitive and must be publicly readable)

- [ ] **Step 3: Upload the 4 videos**

Drag-and-drop the 4 `.mp4` files into the `videos` bucket via the Supabase Storage UI.

After upload, click each file and copy its **Public URL**. It will look like:
```
https://<your-project-ref>.supabase.co/storage/v1/object/public/videos/hero.mp4
```

Write down all 4 public URLs — you'll need them in the next steps.

- [ ] **Step 4: Verify the URLs work in a browser**

Open each public URL in a new browser tab. You should see the video play (or at least start loading). If you get 403, check that the bucket is set to **Public**.

### 1B: Update `Hero.tsx`

- [ ] **Step 5: Replace the Pexels src**

File: `src/components/Hero.tsx`, line 52.

Change:
```tsx
src="https://videos.pexels.com/video-files/7578552/7578552-uhd_2560_1440_30fps.mp4"
```
To (substitute your actual Supabase URL):
```tsx
src="https://<your-project-ref>.supabase.co/storage/v1/object/public/videos/hero.mp4"
```

### 1C: Update `VideoReel.tsx`

- [ ] **Step 6: Replace the Pexels src**

File: `src/components/VideoReel.tsx`, line 17.

Change:
```tsx
src="https://videos.pexels.com/video-files/8293760/8293760-uhd_2560_1440_25fps.mp4"
```
To:
```tsx
src="https://<your-project-ref>.supabase.co/storage/v1/object/public/videos/lifestyle-reel.mp4"
```

### 1D: Update `VideoShowcase.tsx`

- [ ] **Step 7: Replace the Pexels src**

File: `src/components/VideoShowcase.tsx`, line 62.

Change:
```tsx
src="https://videos.pexels.com/video-files/29913691/29913691-uhd_2560_1440_30fps.mp4"
```
To:
```tsx
src="https://<your-project-ref>.supabase.co/storage/v1/object/public/videos/lifestyle-showcase.mp4"
```

### 1E: Update `Gallery.tsx` — also fixes B2 (Community Tour card)

- [ ] **Step 8: Replace the Pexels src**

File: `src/components/Gallery.tsx`, line 15.

Change:
```tsx
{ type: 'video', url: 'https://videos.pexels.com/video-files/7578548/7578548-uhd_2560_1440_30fps.mp4', title: 'Community Tour', desc: 'Master-planned living', span: 'md:col-span-1 md:row-span-2' },
```
To:
```tsx
{ type: 'video', url: 'https://<your-project-ref>.supabase.co/storage/v1/object/public/videos/community-tour.mp4', title: 'Community Tour', desc: 'Master-planned living', span: 'md:col-span-1 md:row-span-2' },
```

- [ ] **Step 9: Verify videos in the browser**

Run the dev server:
```bash
cd osrc-website
npm run dev
```

Visit `http://localhost:3000` and verify:
- Hero video plays (not a black screen)
- The "Lifestyle" showcase video plays on the homepage
- The lifestyle reel section has a video background
- On `/about`, the Gallery grid shows the Community Tour card with a video (not just a heading)

---

## Task 2: Fix CTA label inconsistency (F1 — P1)

The mobile compact nav CTA reads "Consult" — too terse and ambiguous (sounds paid). The contact page button says "Send Inquiry Form" — "Form" is redundant.

**Files:**
- Modify: `src/components/Navbar.tsx:139–145`
- Modify: `src/components/ContactForm.tsx:76`

### 2A: Fix mobile nav CTA

- [ ] **Step 1: Change "Consult" to "Free Consult"**

File: `src/components/Navbar.tsx`, lines 139–145.

Current:
```tsx
<Link
  href="/contact"
  className="flex md:hidden items-center gap-1.5 pl-3.5 pr-3 min-h-[40px] rounded-full bg-[#E85D04] text-white text-[12px] font-semibold tracking-tight press"
>
  Consult
  <span className="w-4 h-4 rounded-full bg-black/15 flex items-center justify-center">
    <ArrowUpRight size={10} strokeWidth={2.75} />
  </span>
</Link>
```

Change to:
```tsx
<Link
  href="/contact"
  className="flex md:hidden items-center gap-1.5 pl-3.5 pr-3 min-h-[40px] rounded-full bg-[#E85D04] text-white text-[12px] font-semibold tracking-tight press"
>
  Free Consult
  <span className="w-4 h-4 rounded-full bg-black/15 flex items-center justify-center">
    <ArrowUpRight size={10} strokeWidth={2.75} />
  </span>
</Link>
```

### 2B: Fix contact page button label

- [ ] **Step 2: Rename "Send Inquiry Form" to "Send Inquiry"**

File: `src/components/ContactForm.tsx`, line 76.

Current:
```tsx
Send Inquiry Form
```
Change to:
```tsx
Send Inquiry
```

- [ ] **Step 3: Verify at 375px**

Open browser DevTools → Responsive → 375px. Verify:
- The nav compact button shows "Free Consult" (not clipped)
- The contact page primary button reads "Send Inquiry"

---

## Task 3: Fix FAQ self-referential link (F2 — P1)

The FAQ "Talk to our team" link points to `/contact`. Since FAQ is rendered on `/contact`, clicking this link navigates nowhere useful. Fix: scroll the user to the top of the ContactForm section (already has `id="contact"`).

**Files:**
- Modify: `src/components/FAQ.tsx:42`

- [ ] **Step 1: Change the href**

File: `src/components/FAQ.tsx`, line 42.

Current:
```tsx
<a href="/contact" className="text-[#E85D04] font-medium hover:underline">Talk to our team</a>.
```

Change to:
```tsx
<a href="#contact" className="text-[#E85D04] font-medium hover:underline">Talk to our team</a>.
```

The ContactForm section already has `id="contact"` at `ContactForm.tsx:14`, so `href="#contact"` will smooth-scroll to the Send Inquiry button.

- [ ] **Step 2: Verify on `/contact` page**

Visit `http://localhost:3000/contact`. Scroll to the FAQ. Click "Talk to our team". Verify it scrolls up to the "Ready to Own Your First Home?" section (not a page navigation).

---

## Task 4: Fix price display formatting (F3 — P1)

The `price` field in Supabase is stored as a raw integer string (e.g. `"59000"`, `"90000000000"`) without the peso sign or comma separators. Both `PropertyCard` and `PropertyDetail` render `{listing.price}` directly, so buyers see `59000` instead of `₱59,000`.

**Files:**
- Modify: `src/lib/listings.ts` — add `displayPrice()` utility
- Modify: `src/components/PropertyCard.tsx:38`
- Modify: `src/components/PropertyDetail.tsx:150`

### 4A: Add the utility

- [ ] **Step 1: Add `displayPrice` to `lib/listings.ts`**

Open `src/lib/listings.ts`. After the `makeSlug` function at the bottom of the file, add:

```ts
// Format a raw price string for display.
// If the stored value is a bare integer ("59000"), formats it as "₱59,000".
// If it already contains a non-numeric character (₱, comma, K, M), returns as-is.
export function displayPrice(price: string | null | undefined): string {
  const s = (price ?? '').trim()
  if (!s) return ''
  if (/^\d+$/.test(s)) {
    return '₱' + parseInt(s, 10).toLocaleString('en-PH')
  }
  return s
}
```

### 4B: Use it in PropertyCard

- [ ] **Step 2: Import and use `displayPrice` in PropertyCard**

File: `src/components/PropertyCard.tsx`.

At the top, update the import from `@/lib/listings`:
```tsx
import { type Listing, getCardImage, getFullImages, displayPrice } from '@/lib/listings'
```

Line 38, change:
```tsx
<div className="text-[22px] font-bold text-[#1C1714] tracking-tight leading-none">{listing.price}</div>
```
To:
```tsx
<div className="text-[22px] font-bold text-[#1C1714] tracking-tight leading-none">{displayPrice(listing.price)}</div>
```

### 4C: Use it in PropertyDetail

- [ ] **Step 3: Import and use `displayPrice` in PropertyDetail**

File: `src/components/PropertyDetail.tsx`.

At the top, update the import from `@/lib/listings`:
```tsx
import { type Listing, getFullImages, getThumbImages, displayPrice } from '@/lib/listings'
```

Line 150, change:
```tsx
<div className="text-[clamp(30px,4vw,42px)] font-bold text-[#1C1714] tracking-tight leading-none">{listing.price}</div>
```
To:
```tsx
<div className="text-[clamp(30px,4vw,42px)] font-bold text-[#1C1714] tracking-tight leading-none">{displayPrice(listing.price)}</div>
```

- [ ] **Step 4: Verify price formatting**

Navigate to `http://localhost:3000/properties`. Verify:
- Prices that were raw integers now show with `₱` sign and comma separators
- Prices that already have `₱` or text (e.g. "₱2.5M") are unchanged

Navigate to a property detail page. Verify the price in the sticky right panel is also formatted correctly.

### 4D: Clean up test listing (data fix — F4)

- [ ] **Step 5: Delete the ₱90B test listing from Supabase**

Log in to Supabase dashboard → Table Editor → `listings` table.
Find the listing with `slug = 'catanduanes-341a9a'` (price value ~90000000000).
Delete the row.

This listing is clearly test/seed data and should never appear in production.

---

## Task 5: Fix counter zero-flash (D3 — P2)

`TrustStats.tsx` Counter components initialize `display` to `null` (renders as empty string). But when `inView` fires, `framer-motion`'s `animate()` starts the motion value at `0` and immediately emits a `change` event with `v ≈ 0`, causing `setDisplay(0)` to run. Users briefly see `0+`, `0`, `0h` before the count-up begins.

**Files:**
- Modify: `src/components/TrustStats.tsx:25`

- [ ] **Step 1: Skip setting display when value rounds to 0**

File: `src/components/TrustStats.tsx`, line 25.

Current:
```tsx
const unsub = mv.on('change', v => setDisplay(Math.round(v)))
```

Change to:
```tsx
const unsub = mv.on('change', v => { const n = Math.round(v); if (n > 0) setDisplay(n) })
```

This keeps `display = null` (renders empty) until the animation reaches 1, then counts up normally. The final value is still reached and displayed correctly.

- [ ] **Step 2: Verify**

Visit `http://localhost:3000`. Scroll past the hero to the dark stats bar ("Families Served", "Developer Partners", "Regions Covered", "Pre-Qualification"). Watch the count-up animation trigger. Verify:
- No `0`, `0+`, `0h` flash before the numbers start
- The numbers count up and land on their correct final values

---

## Task 6: Improve InquiryModal property placeholder (D4 — P2)

When the modal opens from the `/contact` page (no `propertyName` prop), the "Property of Interest" field shows placeholder "Which property?" — vague and leaves users unsure what to type.

**Files:**
- Modify: `src/components/InquiryModal.tsx`

- [ ] **Step 1: Find the property input field**

Open `src/components/InquiryModal.tsx`. Find the input for the `property` field — it will look like an `<input>` or `<div>` referencing `form.property`. The field is pre-filled with `propertyName ?? ''` on mount.

- [ ] **Step 2: Update the label and placeholder**

Find the label and input for the property field. Make two changes:
1. Add `(optional)` to the label text when `propertyName` is not provided
2. Change the placeholder to something more guiding

Replace the property label/input block with:
```tsx
<label className="flex flex-col gap-1.5">
  <span className="text-[11px] font-medium text-[#A89070] uppercase tracking-[0.12em]">
    Property of Interest{!propertyName && <span className="normal-case tracking-normal font-normal text-[#C4B8A8] ml-1">(optional)</span>}
  </span>
  <input
    type="text"
    value={form.property}
    onChange={e => setForm(f => ({ ...f, property: e.target.value }))}
    placeholder={propertyName ? '' : 'e.g. Catanduanes in Virac, or leave blank'}
    className="osrc-input"
  />
</label>
```

Note: match whatever className pattern is used in the existing modal inputs (look for `osrc-input` or equivalent inline Tailwind classes in the file).

- [ ] **Step 3: Verify**

1. Visit `http://localhost:3000/contact`, click "Send Inquiry". The modal opens with:
   - "Property of Interest (optional)" label
   - Placeholder text "e.g. Catanduanes in Virac, or leave blank"
   - Field is empty (not pre-filled)

2. Visit `http://localhost:3000/properties/catanduanes-43d12a`, click "Inquire About This Property". The modal opens with:
   - "Property of Interest" label (no "(optional)")
   - Field pre-filled with the listing title

---

## What's already done (no fix needed)

- **D5 (empty state for filters)**: `PropertiesGrid.tsx:289–309` already implements a full empty state with "No matches found", helper text, and a "Clear all filters" button. Audit note was incorrect.

## What's deferred (requires client assets)

- **D1 (logo marquee)**: `Partners.tsx` shows 2-letter acronyms (CM, LN, LH…) because real developer logo files don't exist in the repo. The fix requires sourcing SVG/PNG logos from Camella, Lancaster New City, Lumina, Crown Asia, Futura, Bria, Vista Land, and Suntrust. Once provided by the client, store in `public/logos/` and update `Partners.tsx` to render `<Image src="/logos/camella.svg" alt="Camella" width={120} height={40} />` instead of the acronym box.

---

## Self-Review

**Spec coverage check:**
- B1 ✓ (Task 1 — all 4 Pexels URLs replaced)
- B2 ✓ (Task 1E — Community Tour same fix)
- F1 ✓ (Task 2 — "Free Consult" + "Send Inquiry")
- F2 ✓ (Task 3 — `#contact` anchor)
- F3 ✓ (Task 4 — `displayPrice()`)
- F4 ✓ (Task 4D — data deletion step)
- D1 → deferred (needs client logo assets)
- D2 → same fix as F1 (Task 2A)
- D3 ✓ (Task 5 — counter guard)
- D4 ✓ (Task 6 — modal placeholder)
- D5 → already done

**Placeholder scan:** No TBDs, no "add validation" hand-waves, no "similar to Task N" shortcuts. All code is written out.

**Type consistency:**
- `displayPrice(price: string | null | undefined): string` — defined in Task 4A, consumed identically in 4B and 4C.
- `listing.price` type is `string` per `Listing` interface in `lib/listings.ts:8` — ✓ compatible.
