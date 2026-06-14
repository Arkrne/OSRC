# OSRC Website — Complete Requirements Checklist

> Everything needed to go from current state → fully launched, production-grade website.
> Grouped by who does the work: **OWNER** (you provide it), **DEV** (code change needed), **BOTH**.
> Status: ✅ Done · ⚠️ Partial · ❌ Not done

---

## 1. CONTENT & COPY

### 1.1 Team Section (`src/components/Team.tsx`)
| # | Item | Owner/Dev | Status |
|---|------|-----------|--------|
| 1 | Replace fake name "Danny Bautista" with real founder name | OWNER | ❌ |
| 2 | Replace fake name "Andrea Reyes" with real team member | OWNER | ❌ |
| 3 | Replace fake name "Marco Lim" with real team member | OWNER | ❌ |
| 4 | Replace fake name "Jasmine Cruz" with real team member | OWNER | ❌ |
| 5 | Replace fake role titles with real ones | OWNER | ❌ |
| 6 | Provide real headshot photos for each team member | OWNER | ❌ |
| 7 | Upload real photos to Supabase Storage or `/public` | DEV | ❌ |
| 8 | Update `src/components/Team.tsx` with real names, roles, and photo URLs | DEV | ❌ |
| 9 | Decide: keep 4 members or add/remove based on real staff count | OWNER | ❌ |

### 1.2 Partners Section (`src/components/Partners.tsx`)
| # | Item | Owner/Dev | Status |
|---|------|-----------|--------|
| 10 | Confirm the 8 listed developers (Camella, Lancaster, Lumina, Crown Asia, Futura, Bria, Vista Land, Suntrust) are real partners OSRC actually works with | OWNER | ❌ |
| 11 | Remove any developers OSRC does NOT have a relationship with | OWNER + DEV | ❌ |
| 12 | Obtain official developer logos (PNG/SVG) from each partner or their media kits | OWNER | ❌ |
| 13 | Replace the text-only marquee with real developer logo images | DEV | ❌ |

### 1.3 Awards / Trust Badges (`src/components/Awards.tsx`)
| # | Item | Owner/Dev | Status |
|---|------|-----------|--------|
| 14 | Confirm SEC Reg. No. `OPC-2024-OSRC-00142` is the real, correct number | OWNER | ❌ |
| 15 | Confirm "6+ top developers" is accurate (or update the number) | OWNER | ❌ |
| 16 | Confirm "4.9 / 5 Client Rating" — if not yet tracked, remove or replace with a real metric | OWNER | ❌ |
| 17 | Confirm "120+ Families Served" is accurate (or update) | OWNER | ❌ |
| 18 | Confirm "Pag-IBIG Authorized Loan Processing" — OSRC should verify it is formally accredited or reword to "Pag-IBIG Loan Assistance" if not formally accredited | OWNER | ❌ |
| 19 | Update Awards badges with confirmed real figures | DEV | ❌ |

### 1.4 Gallery Section (`src/components/Gallery.tsx`)
| # | Item | Owner/Dev | Status |
|---|------|-----------|--------|
| 20 | Provide real property photos from actual OSRC listings | OWNER | ❌ |
| 21 | Provide a real community/property tour video | OWNER | ❌ |
| 22 | Replace all 5 Unsplash placeholder images with real photos | DEV | ❌ |
| 23 | Replace Pexels community tour video (`7578548`) with real video | DEV | ❌ |
| 24 | Upload real media to Supabase Storage or `/public` | BOTH | ❌ |
| 25 | Update captions/titles to match the real properties shown | OWNER | ❌ |

### 1.5 Testimonials (`src/components/Testimonials.tsx`)
| # | Item | Owner/Dev | Status |
|---|------|-----------|--------|
| 26 | Provide real client testimonials (name, quote, city, optional photo) | OWNER | ❌ |
| 27 | Get written consent from clients before publishing their name/photo | OWNER | ❌ |
| 28 | Replace placeholder testimonials with real ones | DEV | ❌ |

### 1.6 Regions / Coverage (`src/components/Regions.tsx`)
| # | Item | Owner/Dev | Status |
|---|------|-----------|--------|
| 29 | Confirm the regions listed (Cavite, Laguna, Bulacan, Metro Manila, etc.) are actually covered | OWNER | ❌ |
| 30 | Update property counts per region with real numbers or remove counts | OWNER + DEV | ❌ |

### 1.7 Hero Section (`src/components/Hero.tsx`)
| # | Item | Owner/Dev | Status |
|---|------|-----------|--------|
| 31 | Provide a real background video (aerial/property footage, owned or licensed) | OWNER | ❌ |
| 32 | Self-host the video — move from Pexels hotlink (`7578552`) to `/public/hero.mp4` or Supabase Storage | DEV | ❌ |
| 33 | Compress the video to ≤10MB for fast load (H.264, 1080p max, 30fps) | BOTH | ❌ |
| 34 | Provide a poster/thumbnail image for the video (shown before video loads) | OWNER | ❌ |
| 35 | Confirm headline copy "Find Your Dream Home. We Handle the Pag-IBIG Loan." is final | OWNER | ❌ |
| 36 | Confirm subheadline copy is final | OWNER | ❌ |

### 1.8 About Section (`src/components/About.tsx`)
| # | Item | Owner/Dev | Status |
|---|------|-----------|--------|
| 37 | Confirm the founding story / company description copy is accurate | OWNER | ❌ |
| 38 | Confirm the statistics shown (years, families helped, etc.) are real | OWNER | ❌ |

### 1.9 Services Section (`src/components/Services.tsx`)
| # | Item | Owner/Dev | Status |
|---|------|-----------|--------|
| 39 | Confirm all services listed are services OSRC actually offers | OWNER | ❌ |
| 40 | Confirm the Pag-IBIG loan processing steps in HowItWorks are accurate | OWNER | ❌ |

### 1.10 Loan Calculator (`src/components/LoanCalculator.tsx`)
| # | Item | Owner/Dev | Status |
|---|------|-----------|--------|
| 41 | Confirm current Pag-IBIG interest rates used in the calculator are correct | OWNER | ❌ |
| 42 | Add a disclaimer below the calculator that results are estimates only (already in Disclaimer page — add inline too) | DEV | ❌ |
| 43 | Plan to update rates when Pag-IBIG announces rate changes | OWNER | ❌ |

### 1.11 Promos (`src/components/Promos.tsx`)
| # | Item | Owner/Dev | Status |
|---|------|-----------|--------|
| 44 | Add real promos via `/admin/promos` | OWNER | ❌ |
| 45 | Set expiry dates on promos so they auto-disappear | OWNER | ❌ |

### 1.12 Property Listings
| # | Item | Owner/Dev | Status |
|---|------|-----------|--------|
| 46 | Delete the 2 "Catanduanes" test listings via `/admin/listings` | OWNER | ❌ |
| 47 | Add real property listings with real photos, prices, and descriptions | OWNER | ❌ |
| 48 | Upload real property photos (up to 30 per listing) via the admin panel | OWNER | ❌ |
| 49 | Confirm required listing fields: title, price, location, bedrooms, bathrooms, lot area, floor area, monthly amortization estimate | OWNER | ❌ |
| 50 | Confirm which properties are Pag-IBIG eligible | OWNER | ❌ |

### 1.13 Insights / Blog (`src/components/Insights.tsx`)
| # | Item | Owner/Dev | Status |
|---|------|-----------|--------|
| 51 | Decide: build actual blog/article pages, or keep the section as decorative (current state) | OWNER | ❌ |
| 52 | If building blog: create `/insights/[slug]` route and CMS for articles | DEV | ❌ |
| 53 | If building blog: write the 3 placeholder articles (Pag-IBIG requirements, loanable amount, OFW guide) | OWNER | ❌ |
| 54 | Replace Unsplash placeholder images with real article cover photos | BOTH | ❌ |

### 1.14 Contact Information
| # | Item | Owner/Dev | Status |
|---|------|-----------|--------|
| 55 | Confirm phone number `+63 951 434 2858` is the live business number | OWNER | ❌ |
| 56 | Confirm email `inquiries@orangesquarerealty.com.ph` will be active (requires domain) | OWNER | ❌ |
| 57 | Confirm office address "Unit 4B, Cityland Herrera Tower, Makati City 1227" is correct and current | OWNER | ❌ |
| 58 | Confirm business hours "Mon–Sat 8:00 AM – 6:00 PM" are correct | OWNER | ❌ |
| 59 | Add a Google Maps embed or link to the office address on the contact page | DEV | ❌ |

### 1.15 Footer
| # | Item | Owner/Dev | Status |
|---|------|-----------|--------|
| 60 | Confirm Facebook URL `https://www.facebook.com/profile.php?id=61565408232254` is the correct official page | OWNER | ❌ |
| 61 | Add Instagram link if OSRC has one | OWNER + DEV | ❌ |
| 62 | Add TikTok link if OSRC has one (common for PH real estate) | OWNER + DEV | ❌ |
| 63 | Add YouTube link if OSRC has a channel | OWNER + DEV | ❌ |
| 64 | Confirm SEC Reg. No. in the footer is accurate | OWNER | ❌ |

---

## 2. DESIGN & UI ASSETS

### 2.1 Branding Assets
| # | Item | Owner/Dev | Status |
|---|------|-----------|--------|
| 65 | Provide official Orange Square Realty logo (SVG preferred) | OWNER | ❌ |
| 66 | Replace the current "OS" text badge in the Navbar with the real logo | DEV | ❌ |
| 67 | Replace the "OS" badge in the Footer with the real logo | DEV | ❌ |
| 68 | Confirm brand colors (#E85D04 orange, #1C1714 dark, #FAFAF7 light) are the official brand colors | OWNER | ❌ |

### 2.2 Favicon & App Icons
| # | Item | Owner/Dev | Status |
|---|------|-----------|--------|
| 69 | Design a favicon (32×32 and 16×16 .ico, or SVG favicon) | OWNER/DEV | ❌ |
| 70 | Design Apple Touch Icon (180×180 PNG) | OWNER/DEV | ❌ |
| 71 | Add favicon files to `/public` and reference in `src/app/layout.tsx` | DEV | ❌ |
| 72 | Add Apple Touch Icon in layout metadata | DEV | ❌ |

### 2.3 Open Graph / Social Share Image
| # | Item | Owner/Dev | Status |
|---|------|-----------|--------|
| 73 | Design OG image (1200×630 PNG) — shown when site is shared on Facebook, Viber, etc. | OWNER/DEV | ❌ |
| 74 | Add `public/og-image.png` as static fallback (current dynamic OG covers build-time but not all crawlers) | BOTH | ❌ |

### 2.4 Cookie Consent Banner
| # | Item | Owner/Dev | Status |
|---|------|-----------|--------|
| 75 | Build a cookie consent banner (required under RA 10173 / NPC guidelines if using analytics) | DEV | ❌ |
| 76 | Banner should let users accept or decline non-essential cookies | DEV | ❌ |
| 77 | Store consent in localStorage; only load analytics if accepted | DEV | ❌ |
| 78 | Link to Cookie Policy page from the banner | DEV | ❌ |

### 2.5 Custom 404 Page
| # | Item | Owner/Dev | Status |
|---|------|-----------|--------|
| 79 | Create `src/app/not-found.tsx` — currently shows Next.js default | DEV | ❌ |
| 80 | Style it on-brand with logo, message, and link back to home/properties | DEV | ❌ |

### 2.6 Custom Error Page
| # | Item | Owner/Dev | Status |
|---|------|-----------|--------|
| 81 | Create `src/app/error.tsx` for 500-level errors — currently shows Next.js default | DEV | ❌ |
| 82 | Style it on-brand with a user-friendly message and contact phone number | DEV | ❌ |

---

## 3. TECHNICAL / CODE

### 3.1 Video
| # | Item | Owner/Dev | Status |
|---|------|-----------|--------|
| 83 | Self-host hero video (remove Pexels hotlink in `Hero.tsx` line 51) | DEV | ❌ |
| 84 | Self-host gallery community tour video (remove Pexels hotlink in `Gallery.tsx`) | DEV | ❌ |
| 85 | Add `<source>` tags for WebM format (smaller file size) alongside MP4 | DEV | ❌ |
| 86 | Add a `poster` attribute to `<video>` so a still image shows before the video loads | DEV | ❌ |

### 3.2 Analytics
| # | Item | Owner/Dev | Status |
|---|------|-----------|--------|
| 87 | Set up Google Analytics 4 (GA4) property for the domain | OWNER | ❌ |
| 88 | Add GA4 tracking script to `src/app/layout.tsx` (load only after cookie consent) | DEV | ❌ |
| 89 | Set up conversion events: inquiry form submit, phone click, property page view | DEV | ❌ |
| 90 | Optionally add Facebook Pixel if running FB/Instagram ads | BOTH | ❌ |

### 3.3 Performance
| # | Item | Owner/Dev | Status |
|---|------|-----------|--------|
| 91 | Run Lighthouse audit on production URL and fix any LCP/CLS issues | DEV | ❌ |
| 92 | Convert all team/gallery/property images to WebP where possible | DEV | ❌ |
| 93 | Ensure all `<img>` tags in dynamic content use Next.js `<Image>` component for automatic optimization | DEV | ❌ |
| 94 | Verify Core Web Vitals pass in Google Search Console after launch | BOTH | ❌ |

### 3.4 Accessibility
| # | Item | Owner/Dev | Status |
|---|------|-----------|--------|
| 95 | Audit all images for meaningful `alt` text (property images, team photos, gallery) | DEV | ❌ |
| 96 | Test keyboard navigation across all pages (tab order, focus states) | DEV | ❌ |
| 97 | Verify color contrast ratios meet WCAG AA (especially light text on warm backgrounds) | DEV | ❌ |
| 98 | Add `aria-label` to all icon-only buttons (hamburger, close, play/pause) | DEV | ❌ |
| 99 | Test with a screen reader on the inquiry form flow | DEV | ❌ |

### 3.5 Admin Panel
| # | Item | Owner/Dev | Status |
|---|------|-----------|--------|
| 100 | Change admin login credentials from any test password to a strong production password | OWNER | ❌ |
| 101 | Verify the promos admin page (`/admin/promos`) works end-to-end | BOTH | ❌ |
| 102 | Add the ability to delete/deactivate listings from the admin panel | DEV | ❌ |
| 103 | Add the ability to mark a listing as "Sold" without deleting it | DEV | ❌ |
| 104 | Add pagination to the admin listings table (will grow over time) | DEV | ❌ |

### 3.6 Inquiry Form
| # | Item | Owner/Dev | Status |
|---|------|-----------|--------|
| 105 | Test the inquiry form end-to-end on the live Vercel URL | BOTH | ❌ |
| 106 | Confirm admin notification email arrives at `jolavts@gmail.com` | OWNER | ❌ |
| 107 | Confirm customer auto-reply email is received | OWNER | ❌ |
| 108 | Consider saving inquiries to a Supabase `inquiries` table so they're never lost if email fails | DEV | ❌ |
| 109 | Add a Supabase `inquiries` table with columns: name, email, phone, property, message, pagibig_status, created_at | DEV | ❌ |
| 110 | Add an inquiries view in the admin panel so staff can see submissions without checking email | DEV | ❌ |

### 3.7 SEO
| # | Item | Owner/Dev | Status |
|---|------|-----------|--------|
| 111 | Verify `sitemap.xml` is accessible at `https://orangesquarerealty.com.ph/sitemap.xml` after deployment | BOTH | ❌ |
| 112 | Verify `robots.txt` is correct (currently allows all, disallows /admin) | ✅ Done | ✅ |
| 113 | Add `canonical` meta tag to all pages (already in legal pages — verify on main pages) | DEV | ❌ |
| 114 | Add JSON-LD LocalBusiness schema with real phone, address, hours | DEV | ❌ |
| 115 | Verify JSON-LD structured data with Google Rich Results Test after launch | BOTH | ❌ |
| 116 | Add `hreflang` tag if a Filipino (Tagalog) version of the site is planned | BOTH | ❌ |

### 3.8 Monitoring & Error Tracking
| # | Item | Owner/Dev | Status |
|---|------|-----------|--------|
| 117 | Set up Vercel Analytics (free, built-in) for traffic monitoring | BOTH | ❌ |
| 118 | Set up uptime monitoring (e.g. Better Uptime free tier or UptimeRobot) — alerts you if site goes down | OWNER | ❌ |
| 119 | Optionally integrate Sentry for JavaScript error tracking | DEV | ❌ |

---

## 4. INFRASTRUCTURE & DEPLOYMENT

### 4.1 Domain
| # | Item | Owner/Dev | Status |
|---|------|-----------|--------|
| 120 | Register `orangesquarerealty.com.ph` with a .PH registrar (e.g. Dot PH, DotHost) | OWNER | ❌ |
| 121 | Add the domain to Vercel project → Settings → Domains | OWNER | ❌ |
| 122 | Update DNS A/CNAME records to point to Vercel | OWNER | ❌ |
| 123 | Verify HTTPS/SSL is automatically provisioned by Vercel | BOTH | ❌ |
| 124 | Set up `www` redirect → apex domain (or vice versa) | OWNER | ❌ |

### 4.2 Email (Resend)
| # | Item | Owner/Dev | Status |
|---|------|-----------|--------|
| 125 | After domain is live: add Resend DNS records (SPF, DKIM, DMARC) to the domain | OWNER | ❌ |
| 126 | Verify the domain in Resend dashboard | OWNER | ❌ |
| 127 | Update `RESEND_FROM` env var in Vercel from `onboarding@resend.dev` to `OSRC Inquiries <noreply@orangesquarerealty.com.ph>` | OWNER | ❌ |
| 128 | Update `INQUIRY_EMAIL` env var to the real staff email that should receive inquiries | OWNER | ❌ |
| 129 | Test inquiry email again after domain verification | BOTH | ❌ |

### 4.3 Supabase
| # | Item | Owner/Dev | Status |
|---|------|-----------|--------|
| 130 | Set up regular Supabase database backups (Supabase Pro has daily backups; free tier does not) | OWNER | ❌ |
| 131 | Confirm `property-images` storage bucket is public (required for images to load without auth) | BOTH | ✅ |
| 132 | Set up Supabase email auth settings (rate limits on OTP, etc.) for admin login security | OWNER | ❌ |

### 4.4 Upstash
| # | Item | Owner/Dev | Status |
|---|------|-----------|--------|
| 133 | Add `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` to Vercel env vars | OWNER | ✅ |
| 134 | Verify rate limiting is working after deployment | BOTH | ❌ |

---

## 5. LEGAL & COMPLIANCE (PHILIPPINES)

### 5.1 National Privacy Commission (NPC)
| # | Item | Owner/Dev | Status |
|---|------|-----------|--------|
| 135 | Register OSRC as a Personal Information Controller (PIC) with the NPC at `privacy.gov.ph` | OWNER | ❌ |
| 136 | Designate a Data Protection Officer (DPO) — can be the owner for a small company | OWNER | ❌ |
| 137 | Register the DPO with the NPC | OWNER | ❌ |
| 138 | Implement and document a Privacy Management Program | OWNER | ❌ |
| 139 | Update the Privacy Policy with the DPO's contact details once appointed | BOTH | ❌ |

### 5.2 Securities and Exchange Commission (SEC)
| # | Item | Owner/Dev | Status |
|---|------|-----------|--------|
| 140 | Confirm and document the real SEC Registration Number | OWNER | ❌ |
| 141 | Ensure GIS (General Information Sheet) is filed annually with the SEC | OWNER | ❌ |
| 142 | Ensure AFS (Audited Financial Statements) is filed annually | OWNER | ❌ |

### 5.3 Professional Regulation Commission (PRC)
| # | Item | Owner/Dev | Status |
|---|------|-----------|--------|
| 143 | Confirm a licensed real estate broker (PRC license) is associated with OSRC | OWNER | ❌ |
| 144 | Display the broker's PRC license number on the website if required | BOTH | ❌ |

### 5.4 HDMF / Pag-IBIG
| # | Item | Owner/Dev | Status |
|---|------|-----------|--------|
| 145 | Confirm whether OSRC is a formally accredited Pag-IBIG collection agent or just an assistant/facilitator | OWNER | ❌ |
| 146 | If not formally accredited, update all copy that implies formal accreditation | BOTH | ❌ |

### 5.5 BIR / Tax Compliance
| # | Item | Owner/Dev | Status |
|---|------|-----------|--------|
| 147 | Ensure BIR registration and COR (Certificate of Registration) is current | OWNER | ❌ |
| 148 | Ensure official receipts / invoices are ready for clients who pay commissions | OWNER | ❌ |

### 5.6 DICT / E-Commerce Act (RA 8792)
| # | Item | Owner/Dev | Status |
|---|------|-----------|--------|
| 149 | Ensure the Terms & Conditions are conspicuously linked from the inquiry form (users should see it before submitting) | DEV | ❌ |
| 150 | Add a checkbox on the inquiry form: "I agree to the Privacy Policy and Terms & Conditions" | DEV | ❌ |

---

## 6. SEO & MARKETING

### 6.1 Google
| # | Item | Owner/Dev | Status |
|---|------|-----------|--------|
| 151 | Create a Google Search Console property for the domain | OWNER | ❌ |
| 152 | Verify domain ownership via DNS TXT record | OWNER | ❌ |
| 153 | Submit `sitemap.xml` in Search Console | OWNER | ❌ |
| 154 | Add Google Search Console verification meta tag to `src/app/layout.tsx` | DEV | ❌ |
| 155 | Create Google Business Profile for OSRC | OWNER | ❌ |
| 156 | Fill out GBP completely: hours, photos, category (Real Estate Agency), services | OWNER | ❌ |
| 157 | Link GBP to the website | OWNER | ❌ |
| 158 | Start collecting real Google Reviews from satisfied clients | OWNER | ❌ |

### 6.2 Facebook / Meta
| # | Item | Owner/Dev | Status |
|---|------|-----------|--------|
| 159 | Confirm OSRC Facebook Page is fully set up with accurate contact info | OWNER | ❌ |
| 160 | Add website link to the Facebook Page | OWNER | ❌ |
| 161 | Set up Facebook Business Manager if running paid ads | OWNER | ❌ |
| 162 | Add Facebook Pixel to the site for ad conversion tracking | BOTH | ❌ |

### 6.3 Content Strategy
| # | Item | Owner/Dev | Status |
|---|------|-----------|--------|
| 163 | Decide on content publishing cadence (blog articles, property updates, promos) | OWNER | ❌ |
| 164 | Write the 3 Insights articles planned in the section | OWNER | ❌ |
| 165 | Build the blog/insights article system if articles will be published regularly | DEV | ❌ |

---

## 7. TESTING & QA

### 7.1 Functional Testing
| # | Item | Owner/Dev | Status |
|---|------|-----------|--------|
| 166 | Click every nav link and confirm it goes to the right page | BOTH | ❌ |
| 167 | Click every footer link and confirm destination | BOTH | ❌ |
| 168 | Click logo — confirm it goes to home | BOTH | ❌ |
| 169 | Submit the inquiry form with valid data — confirm admin email received | BOTH | ❌ |
| 170 | Submit the inquiry form with invalid data — confirm validation errors show | BOTH | ❌ |
| 171 | Submit the inquiry form 6+ times rapidly — confirm rate limit kicks in | BOTH | ❌ |
| 172 | Browse to `/properties` — confirm real listings appear | BOTH | ❌ |
| 173 | Click a property card — confirm detail page loads with correct data | BOTH | ❌ |
| 174 | Submit an inquiry from the property detail page — confirm property name pre-fills | BOTH | ❌ |
| 175 | Log in to `/admin` — confirm dashboard loads | OWNER | ❌ |
| 176 | Add a test listing via `/admin/listings` with photos — confirm it appears on `/properties` | BOTH | ❌ |
| 177 | Add a promo via `/admin/promos` — confirm it appears on the homepage | BOTH | ❌ |
| 178 | Test the loan calculator with various inputs | BOTH | ❌ |
| 179 | Test the mobile hamburger menu — open, navigate, close | BOTH | ❌ |
| 180 | Test the mobile sticky CTA bar appears after scrolling | BOTH | ❌ |
| 181 | Test the "Get Free Consult" button in the navbar | BOTH | ❌ |
| 182 | Verify `/sitemap.xml` lists all pages and property URLs | BOTH | ❌ |
| 183 | Verify `/robots.txt` blocks `/admin` and allows everything else | BOTH | ✅ |

### 7.2 Cross-Device / Browser Testing
| # | Item | Owner/Dev | Status |
|---|------|-----------|--------|
| 184 | Test on iPhone (Safari) — most PH users browse on iOS | BOTH | ❌ |
| 185 | Test on Android (Chrome) | BOTH | ❌ |
| 186 | Test on desktop Chrome | BOTH | ❌ |
| 187 | Test on desktop Firefox | BOTH | ❌ |
| 188 | Test on desktop Safari (Mac) | BOTH | ❌ |
| 189 | Test at 320px width (smallest common phone) | DEV | ❌ |
| 190 | Test at 375px (iPhone SE) | DEV | ❌ |
| 191 | Test at 768px (tablet) | DEV | ❌ |
| 192 | Test at 1280px and 1440px (desktop) | DEV | ❌ |

### 7.3 Performance Testing
| # | Item | Owner/Dev | Status |
|---|------|-----------|--------|
| 193 | Run Google PageSpeed Insights on production URL | BOTH | ❌ |
| 194 | Target LCP (Largest Contentful Paint) < 2.5s | DEV | ❌ |
| 195 | Target CLS (Cumulative Layout Shift) < 0.1 | DEV | ❌ |
| 196 | Target FID / INP < 200ms | DEV | ❌ |
| 197 | Test page load on a slow 3G connection (simulate in Chrome DevTools) | DEV | ❌ |

### 7.4 Security Testing
| # | Item | Owner/Dev | Status |
|---|------|-----------|--------|
| 198 | Verify `/admin` redirects to login if not authenticated | BOTH | ❌ |
| 199 | Verify `/api/upload` returns 401 without a valid session | BOTH | ❌ |
| 200 | Try submitting XSS payloads in the inquiry form — confirm they are escaped in the email | DEV | ✅ |
| 201 | Verify security headers are present using `https://securityheaders.com` | BOTH | ❌ |
| 202 | Confirm `.env.local` is not committed to the repo | BOTH | ✅ |
| 203 | Confirm service role key is never exposed in client-side bundle | BOTH | ✅ |

---

## 8. POST-LAUNCH

### 8.1 Ongoing Maintenance
| # | Item | Owner/Dev | Status |
|---|------|-----------|--------|
| 204 | Update Pag-IBIG interest rates in the loan calculator when HDMF announces changes | OWNER + DEV | ❌ |
| 205 | Add new property listings as they become available | OWNER | ❌ |
| 206 | Mark sold properties as "Sold" in the admin | OWNER | ❌ |
| 207 | Renew domain annually | OWNER | ❌ |
| 208 | Renew Resend plan if email volume grows past free tier (100/day) | OWNER | ❌ |
| 209 | Monitor Upstash Redis usage (free tier: 10,000 commands/day) | OWNER | ❌ |
| 210 | Keep Next.js and dependencies updated (security patches) | DEV | ❌ |
| 211 | Respond to Google Search Console coverage issues | OWNER | ❌ |
| 212 | Collect and publish new client testimonials quarterly | OWNER | ❌ |

### 8.2 Growth / Phase 2 (Optional)
| # | Item | Owner/Dev | Status |
|---|------|-----------|--------|
| 213 | Build the blog/Insights article system with a CMS | DEV | ❌ |
| 214 | Add a Tagalog (Filipino) version of the site | BOTH | ❌ |
| 215 | Build a client portal where buyers can track their loan application status | DEV | ❌ |
| 216 | Add WhatsApp / Messenger chat widget | BOTH | ❌ |
| 217 | Add property comparison feature | DEV | ❌ |
| 218 | Add saved/favorited properties (requires user accounts) | DEV | ❌ |
| 219 | Add property search filters (price range, bedrooms, location, developer) | DEV | ❌ |
| 220 | Add a referral tracking system for agent commissions | DEV | ❌ |
| 221 | Integrate with a calendar booking tool (Calendly) for consultation scheduling | BOTH | ❌ |

---

## Summary

| Category | Total | Done | Remaining |
|----------|-------|------|-----------|
| Content & Copy | 65 | 0 | 65 |
| Design & UI Assets | 17 | 0 | 17 |
| Technical / Code | 35 | 5 | 30 |
| Infrastructure | 15 | 2 | 13 |
| Legal & Compliance | 16 | 0 | 16 |
| SEO & Marketing | 15 | 0 | 15 |
| Testing & QA | 38 | 4 | 34 |
| Post-Launch | 21 | 0 | 21 |
| **Total** | **222** | **11** | **211** |

---

> **Minimum to go live:** Items 46–50 (real listings), 120–124 (domain), 125–129 (email), 169–171 (form test), 135 (NPC registration started). Everything else can be done after launch.
