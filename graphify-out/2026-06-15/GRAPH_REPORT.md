# Graph Report - .  (2026-06-15)

## Corpus Check
- 82 files · ~42,679 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 440 nodes · 621 edges · 28 communities (18 shown, 10 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 21 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]

## God Nodes (most connected - your core abstractions)
1. `OSRC Website Handoff Document` - 18 edges
2. `compilerOptions` - 16 edges
3. `OSRC Website Requirements Checklist (222 items)` - 10 edges
4. `getListings()` - 9 edges
5. `POST()` - 8 edges
6. `Next.js Project (osrc-website)` - 7 edges
7. `getFullImages()` - 7 edges
8. `createClient()` - 7 edges
9. `useVideoAutoplay()` - 7 edges
10. `Supabase (DB + Auth + Storage)` - 7 edges

## Surprising Connections (you probably didn't know these)
- `Vercel Triangle Logo SVG — Hosting Platform Brand` --conceptually_related_to--> `Vercel Deployment Target`  [INFERRED]
  public/vercel.svg → HANDOFF.md
- `Vercel Platform Deployment` --semantically_similar_to--> `Vercel Deployment Target`  [INFERRED] [semantically similar]
  README.md → HANDOFF.md
- `Next.js SVG Logo` --conceptually_related_to--> `Next.js 16.2.7 App Router (Turbopack)`  [INFERRED]
  osrc-website/public/next.svg → HANDOFF.md
- `Brand Colors — #E85D04 Orange, #1C1714 Dark, #FAFAF7 Light` --conceptually_related_to--> `OSRC Logo — Orange Background with Navy OSRC Wordmark`  [INFERRED]
  requirements.md → public/logo.jpg
- `OSRC Logo — Orange Background with Navy OSRC Wordmark` --references--> `Orange Square Realty (OSRC) — Philippine Real Estate Broker`  [EXTRACTED]
  public/logo.jpg → HANDOFF.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Core Technology Stack** — handoff_nextjs16, handoff_react19, handoff_tailwind_v4, handoff_framer_motion_v12, handoff_supabase, handoff_resend, handoff_upstash_redis [EXTRACTED 1.00]
- **Admin Security Layer** — handoff_proxy_ts, handoff_admin_uid, handoff_supabase_rls, handoff_api_upload, handoff_api_delete_listing [INFERRED 0.90]
- **Property Listing System** — handoff_lib_listings_ts, handoff_slug_system, handoff_price_value_column, handoff_apply_filters, handoff_propertiesgrid, handoff_propertydetail [EXTRACTED 1.00]
- **OSRC Brand Identity Assets** — public_logo, requirements_brand_colors, handoff_orange_square_realty [INFERRED 0.85]
- **Deployment Requirements** — handoff_vercel_deploy, handoff_vercel_env_vars, requirements_infrastructure, public_robots [INFERRED 0.85]

## Communities (28 total, 10 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.06
Nodes (37): metadata, badges, EASE, Gallery(), Media, EASE, steps, Marquee() (+29 more)

### Community 1 - "Community 1"
Cohesion: 0.08
Nodes (36): sitemap(), BEDROOMS, EASE, PROPERTY_TYPES, Props, REGIONS, STATUSES, PropertiesPreview() (+28 more)

### Community 2 - "Community 2"
Cohesion: 0.07
Nodes (42): Admin CMS (/admin) — Listings and Promos Management, Admin UID Allowlist — 183105ed-f54a-44e9-9f12-1d6715f58266, src/app/api/delete-listing/route.ts — DB Delete + Storage Cleanup, src/app/api/send-inquiry/route.ts — Rate-limited Inquiry Email via Resend, src/app/api/upload/route.ts — Storage Upload with Service-Role Key, applyFilters Helper — Supabase TypeScript Type Workaround using any, Framer Motion v12, Gallery Preload + Shimmer — useEffect Preloader with unoptimized Images (+34 more)

### Community 3 - "Community 3"
Cohesion: 0.05
Nodes (25): EASE_DRAWER, EASE_OUT, INITIAL_MESSAGE, Message, EASE, posts, data, EASE (+17 more)

### Community 4 - "Community 4"
Cohesion: 0.09
Nodes (21): client, EASE, EASE, partners, Promos(), EASE, Promo, ALLOWED_ORIGINS (+13 more)

### Community 5 - "Community 5"
Cohesion: 0.07
Nodes (16): EASE, faqs, quickLinks, services, FaqJsonLd(), faqPage, JsonLd(), localBusiness (+8 more)

### Community 6 - "Community 6"
Cohesion: 0.07
Nodes (26): dependencies, @anthropic-ai/sdk, framer-motion, lucide-react, next, react, react-dom, resend (+18 more)

### Community 7 - "Community 7"
Cohesion: 0.12
Nodes (11): LogoutButton(), Dashboard(), publicClient(), AdminListings(), AdminPromos(), EMPTY, Form, Promo (+3 more)

### Community 8 - "Community 8"
Cohesion: 0.11
Nodes (11): size, EASE, EASE, headlineLines, stats, EASE, stats, CONTACT (+3 more)

### Community 9 - "Community 9"
Cohesion: 0.14
Nodes (13): EASE, EASE_OUT, FOCUSABLE, FormState, InquiryModal(), Props, EASE, priceRanges (+5 more)

### Community 10 - "Community 10"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 11 - "Community 11"
Cohesion: 0.14
Nodes (18): Next.js 16 Breaking Changes Warning, Next.js Agent Rules, Next.js Dist Docs in node_modules, CLAUDE.md Agents Reference, ISR Strategy for /properties/[slug] — revalidate=300 + dynamicParams=true, Next.js 16.2.7 App Router (Turbopack), Next.js Brand Identity, Next.js Framework (+10 more)

### Community 12 - "Community 12"
Cohesion: 0.29
Nodes (4): EASE, LoanCalculator(), peso(), metadata

### Community 13 - "Community 13"
Cohesion: 0.29
Nodes (4): dmSerif, jakarta, metadata, viewport

### Community 17 - "Community 17"
Cohesion: 0.67
Nodes (4): Browser Window UI Element, Flat Monochrome Icon Style, Window SVG Icon, Traffic Light Dots (Window Controls)

### Community 19 - "Community 19"
Cohesion: 1.00
Nodes (3): Document/File Icon (generic file representation), File SVG Icon, Flat Monochrome Icon Style (#666 fill, no stroke)

### Community 20 - "Community 20"
Cohesion: 0.67
Nodes (3): World / Global Concept, Globe SVG Icon, Flat Monochrome Icon Style

### Community 21 - "Community 21"
Cohesion: 1.00
Nodes (3): Vercel Brand Identity, Vercel Logo SVG, Vercel Triangle Icon

## Knowledge Gaps
- **179 isolated node(s):** `nextConfig`, `name`, `version`, `private`, `dev` (+174 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createClient()` connect `Community 7` to `Community 3`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **What connects `nextConfig`, `name`, `version` to the rest of the system?**
  _182 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.05786090005844535 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.0792156862745098 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.06736353077816493 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.0524390243902439 - nodes in this community are weakly interconnected._
- **Should `Community 4` be split into smaller, more focused modules?**
  _Cohesion score 0.08870967741935484 - nodes in this community are weakly interconnected._