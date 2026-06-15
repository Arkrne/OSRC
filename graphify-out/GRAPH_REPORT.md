# Graph Report - osrc-website  (2026-06-15)

## Corpus Check
- 76 files · ~43,406 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 533 nodes · 722 edges · 47 communities (33 shown, 14 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 21 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `cfc15759`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Awards & Gallery|Awards & Gallery]]
- [[_COMMUNITY_Main Pages & About|Main Pages & About]]
- [[_COMMUNITY_Contact & Inquiry Forms|Contact & Inquiry Forms]]
- [[_COMMUNITY_Dependencies & Packages|Dependencies & Packages]]
- [[_COMMUNITY_TypeScript Configuration|TypeScript Configuration]]
- [[_COMMUNITY_Dev Docs & Agent Rules|Dev Docs & Agent Rules]]
- [[_COMMUNITY_App Layout & Fonts|App Layout & Fonts]]
- [[_COMMUNITY_AI Chatbot|AI Chatbot]]
- [[_COMMUNITY_Navigation Bar|Navigation Bar]]
- [[_COMMUNITY_Hero Section|Hero Section]]
- [[_COMMUNITY_Loan Calculator|Loan Calculator]]
- [[_COMMUNITY_Testimonials|Testimonials]]
- [[_COMMUNITY_Trust Statistics|Trust Statistics]]
- [[_COMMUNITY_Next.js Brand Assets|Next.js Brand Assets]]
- [[_COMMUNITY_Window UI Icon|Window UI Icon]]
- [[_COMMUNITY_Chat API Route|Chat API Route]]
- [[_COMMUNITY_File Icon Asset|File Icon Asset]]
- [[_COMMUNITY_Globe Icon Asset|Globe Icon Asset]]
- [[_COMMUNITY_Vercel Brand Asset|Vercel Brand Asset]]
- [[_COMMUNITY_Email Inquiry API|Email Inquiry API]]
- [[_COMMUNITY_Next.js Config|Next.js Config]]
- [[_COMMUNITY_PostCSS Config|PostCSS Config]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]

## God Nodes (most connected - your core abstractions)
1. `OSRC Website Handoff Document` - 18 edges
2. `compilerOptions` - 16 edges
3. `1. CONTENT & COPY` - 16 edges
4. `HANDOFF — OSRC Website` - 11 edges
5. `OSRC Website — Complete Requirements Checklist` - 10 edges
6. `OSRC Website Requirements Checklist (222 items)` - 10 edges
7. `getListings()` - 9 edges
8. `3. TECHNICAL / CODE` - 9 edges
9. `POST()` - 8 edges
10. `POST()` - 8 edges

## Surprising Connections (you probably didn't know these)
- `Vercel Triangle Logo SVG — Hosting Platform Brand` --conceptually_related_to--> `Vercel Deployment Target`  [INFERRED]
  public/vercel.svg → HANDOFF.md
- `Vercel Platform Deployment` --semantically_similar_to--> `Vercel Deployment Target`  [INFERRED] [semantically similar]
  README.md → HANDOFF.md
- `Next.js SVG Logo` --conceptually_related_to--> `Next.js 16.2.7 App Router (Turbopack)`  [INFERRED]
  osrc-website/public/next.svg → HANDOFF.md
- `Brand Colors — #E85D04 Orange, #1C1714 Dark, #FAFAF7 Light` --conceptually_related_to--> `OSRC Logo — Orange Background with Navy OSRC Wordmark`  [INFERRED]
  requirements.md → public/logo.jpg
- `Next.js Project (osrc-website)` --references--> `Next.js 16.2.7 App Router (Turbopack)`  [INFERRED]
  osrc-website/README.md → HANDOFF.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Core Technology Stack** — handoff_nextjs16, handoff_react19, handoff_tailwind_v4, handoff_framer_motion_v12, handoff_supabase, handoff_resend, handoff_upstash_redis [EXTRACTED 1.00]
- **Admin Security Layer** — handoff_proxy_ts, handoff_admin_uid, handoff_supabase_rls, handoff_api_upload, handoff_api_delete_listing [INFERRED 0.90]
- **Property Listing System** — handoff_lib_listings_ts, handoff_slug_system, handoff_price_value_column, handoff_apply_filters, handoff_propertiesgrid, handoff_propertydetail [EXTRACTED 1.00]
- **OSRC Brand Identity Assets** — public_logo, requirements_brand_colors, handoff_orange_square_realty [INFERRED 0.85]
- **Deployment Requirements** — handoff_vercel_deploy, handoff_vercel_env_vars, requirements_infrastructure, public_robots [INFERRED 0.85]

## Communities (47 total, 14 thin omitted)

### Community 0 - "Awards & Gallery"
Cohesion: 0.15
Nodes (12): badges, EASE, steps, ScrollImage(), Stagger(), StaggerItem(), TiltCard(), EASE (+4 more)

### Community 1 - "Main Pages & About"
Cohesion: 0.05
Nodes (49): sitemap(), EASE, EASE_OUT, FOCUSABLE, FormState, InquiryModal(), Props, BEDROOMS (+41 more)

### Community 2 - "Contact & Inquiry Forms"
Cohesion: 0.18
Nodes (13): Orange Square Realty (OSRC) — Philippine Real Estate Broker, Pag-IBIG Housing Loan Specialization, Orange Square Realty Marketing + Listings Site Goal, OSRC Logo — Orange Background with Navy OSRC Wordmark, Brand Colors — #E85D04 Orange, #1C1714 Dark, #FAFAF7 Light, OSRC Website Requirements Checklist (222 items), Content & Copy Requirements — Team, Partners, Awards, Gallery, Testimonials, Design & UI Assets Requirements — Branding, Favicon, OG Image, Cookie Consent, 404 (+5 more)

### Community 3 - "Dependencies & Packages"
Cohesion: 0.09
Nodes (15): ALLOWED, drawBlob(), EMPTY_FORM, Form, Listing, loadImg(), OptionGroup, OptionItem (+7 more)

### Community 4 - "TypeScript Configuration"
Cohesion: 0.36
Nodes (13): ALLOWED_ORIGINS, checkRate(), corsHeaders(), esc(), isEmail(), isPhone(), log(), OPTIONS() (+5 more)

### Community 5 - "Dev Docs & Agent Rules"
Cohesion: 0.20
Nodes (4): quickLinks, services, JsonLd(), ScrollProgress()

### Community 6 - "App Layout & Fonts"
Cohesion: 0.07
Nodes (26): dependencies, @anthropic-ai/sdk, framer-motion, lucide-react, next, react, react-dom, resend (+18 more)

### Community 7 - "AI Chatbot"
Cohesion: 0.12
Nodes (11): LogoutButton(), Dashboard(), publicClient(), AdminListings(), AdminPromos(), EMPTY, Form, Promo (+3 more)

### Community 8 - "Navigation Bar"
Cohesion: 0.06
Nodes (21): size, EASE, EASE, EASE, headlineLines, stats, EASE, partners (+13 more)

### Community 9 - "Hero Section"
Cohesion: 0.20
Nodes (7): EASE, Parallax(), RevealHeading(), RevealVariant, VARIANTS, EASE, services

### Community 10 - "Loan Calculator"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 11 - "Testimonials"
Cohesion: 0.22
Nodes (10): Next.js 16 Breaking Changes Warning, Next.js Agent Rules, Next.js Dist Docs in node_modules, CLAUDE.md Agents Reference, ISR Strategy for /properties/[slug] — revalidate=300 + dynamicParams=true, Next.js 16.2.7 App Router (Turbopack), Next.js Brand Identity, Next.js Framework (+2 more)

### Community 12 - "Trust Statistics"
Cohesion: 0.50
Nodes (3): EASE, LoanCalculator(), peso()

### Community 13 - "Next.js Brand Assets"
Cohesion: 0.39
Nodes (5): dmSerif, jakarta, metadata, RootLayout(), viewport

### Community 17 - "Globe Icon Asset"
Cohesion: 0.67
Nodes (4): Browser Window UI Element, Flat Monochrome Icon Style, Window SVG Icon, Traffic Light Dots (Window Controls)

### Community 19 - "Email Inquiry API"
Cohesion: 1.00
Nodes (3): Document/File Icon (generic file representation), File SVG Icon, Flat Monochrome Icon Style (#666 fill, no stroke)

### Community 20 - "Next.js Config"
Cohesion: 0.67
Nodes (3): World / Global Concept, Globe SVG Icon, Flat Monochrome Icon Style

### Community 21 - "PostCSS Config"
Cohesion: 1.00
Nodes (3): Vercel Brand Identity, Vercel Logo SVG, Vercel Triangle Icon

### Community 28 - "Community 28"
Cohesion: 0.05
Nodes (42): 2.1 Branding Assets, 2.2 Favicon & App Icons, 2.3 Open Graph / Social Share Image, 2.4 Cookie Consent Banner, 2.5 Custom 404 Page, 2.6 Custom Error Page, 2. DESIGN & UI ASSETS, 3.1 Video (+34 more)

### Community 29 - "Community 29"
Cohesion: 0.06
Nodes (30): 0. How to Work on This Project (READ THIS FIRST), 1. The Goal We're Working Toward, 2. Current State of the Code, 3. Files Edited / Created (all sessions to date), 4. Everything Tried That Failed (don't repeat these), 5. Next Steps (in order), 6. Vercel Environment Variables (7 required), 7. Known Remaining Issues (+22 more)

### Community 30 - "Community 30"
Cohesion: 0.12
Nodes (16): 1.10 Loan Calculator (`src/components/LoanCalculator.tsx`), 1.11 Promos (`src/components/Promos.tsx`), 1.12 Property Listings, 1.13 Insights / Blog (`src/components/Insights.tsx`), 1.14 Contact Information, 1.15 Footer, 1.1 Team Section (`src/components/Team.tsx`), 1.2 Partners Section (`src/components/Partners.tsx`) (+8 more)

### Community 31 - "Community 31"
Cohesion: 0.29
Nodes (7): EASE, Gallery(), Media, SpotlightCard(), EASE, VideoShowcase(), useVideoAutoplay()

### Community 32 - "Community 32"
Cohesion: 0.20
Nodes (7): metadata, Marquee(), ROW_A, ROW_B, VelocityMarquee(), EASE, VideoReel()

### Community 33 - "Community 33"
Cohesion: 0.40
Nodes (3): data, EASE, Testimonial

### Community 35 - "Community 35"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 38 - "Community 38"
Cohesion: 0.18
Nodes (12): applyFilters Helper — Supabase TypeScript Type Workaround using any, Framer Motion v12, Gallery Preload + Shimmer — useEffect Preloader with unoptimized Images, src/lib/listings.ts — Server-side Listing Reads and Helpers, src/lib/site.ts — STATS, CONTACT, REGIONS, DEVELOPERS Constants, OSRC Website Handoff Document, price_value bigint Column — Numeric Price for Range Filtering, src/components/PropertiesGrid.tsx — Client Grid with Filter Bar + Search + Pagination (+4 more)

### Community 39 - "Community 39"
Cohesion: 0.22
Nodes (10): Admin CMS (/admin) — Listings and Promos Management, Admin UID Allowlist — 183105ed-f54a-44e9-9f12-1d6715f58266, src/app/api/delete-listing/route.ts — DB Delete + Storage Cleanup, src/app/api/upload/route.ts — Storage Upload with Service-Role Key, 16:9 Image Upload Pipeline — Canvas Center-crop to 1920x1080 and 640x360 JPEG, Supabase Storage — property-images Bucket (Public) with thumbnails/ Subfolder, src/proxy.ts — Middleware (Admin Auth + UID Allowlist + Security Headers + CSP), Supabase (DB + Auth + Storage) (+2 more)

### Community 40 - "Community 40"
Cohesion: 0.25
Nodes (5): FaqJsonLd(), faqPage, localBusiness, webSite, metadata

### Community 41 - "Community 41"
Cohesion: 0.32
Nodes (8): app/page.tsx Entry Point, create-next-app Bootstrap Tool, Development Server (npm run dev), Geist Font Family, next/font Optimization, Next.js Framework, Next.js Project (osrc-website), Vercel Platform Deployment

### Community 42 - "Community 42"
Cohesion: 0.29
Nodes (5): EASE_DRAWER, EASE_OUT, mobileLinks, navLinks, SPRING

### Community 43 - "Community 43"
Cohesion: 0.38
Nodes (7): src/app/api/send-inquiry/route.ts — Rate-limited Inquiry Email via Resend, Resend — Transactional Email Service, Upstash Redis — Rate Limiting, Vercel Deployment Target, Vercel Environment Variables (7 required: Supabase, Resend, Inquiry, Admin UIDs), Vercel Triangle Logo SVG — Hosting Platform Brand, Infrastructure & Deployment Requirements — Domain, Email (Resend), Supabase, Upstash

### Community 44 - "Community 44"
Cohesion: 0.33
Nodes (4): CountUp(), counters, EASE, reasons

## Knowledge Gaps
- **252 isolated node(s):** `nextConfig`, `name`, `version`, `private`, `dev` (+247 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **14 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createClient()` connect `Navigation Bar` to `TypeScript Configuration`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **Why does `createClient()` connect `AI Chatbot` to `Dependencies & Packages`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **What connects `nextConfig`, `name`, `version` to the rest of the system?**
  _255 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Awards & Gallery` be split into smaller, more focused modules?**
  _Cohesion score 0.14619883040935672 - nodes in this community are weakly interconnected._
- **Should `Main Pages & About` be split into smaller, more focused modules?**
  _Cohesion score 0.05285592497868713 - nodes in this community are weakly interconnected._
- **Should `Dependencies & Packages` be split into smaller, more focused modules?**
  _Cohesion score 0.09 - nodes in this community are weakly interconnected._
- **Should `App Layout & Fonts` be split into smaller, more focused modules?**
  _Cohesion score 0.07407407407407407 - nodes in this community are weakly interconnected._