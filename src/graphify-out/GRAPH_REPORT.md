# Graph Report - C:\Users\TUF\Downloads\Orange\osrc-website\src  (2026-06-15)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 295 nodes · 421 edges · 18 communities (13 shown, 5 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
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

## God Nodes (most connected - your core abstractions)
1. `getListings()` - 9 edges
2. `POST()` - 8 edges
3. `getFullImages()` - 7 edges
4. `createClient()` - 7 edges
5. `useVideoAutoplay()` - 7 edges
6. `RevealHeading()` - 6 edges
7. `Stagger()` - 6 edges
8. `StaggerItem()` - 6 edges
9. `TiltCard()` - 6 edges
10. `getAllSlugs()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `generateStaticParams()` --calls--> `getAllSlugs()`  [EXTRACTED]
  app/(site)/properties/[slug]/page.tsx → lib/listings.ts
- `AdminListings()` --calls--> `createClient()`  [EXTRACTED]
  app/admin/listings/page.tsx → lib/supabase/client.ts
- `AdminPromos()` --calls--> `createClient()`  [EXTRACTED]
  app/admin/promos/page.tsx → lib/supabase/client.ts
- `sitemap()` --calls--> `getAllSlugs()`  [EXTRACTED]
  app/sitemap.ts → lib/listings.ts
- `Gallery()` --calls--> `useVideoAutoplay()`  [EXTRACTED]
  components/Gallery.tsx → lib/useVideoAutoplay.ts

## Import Cycles
- None detected.

## Communities (18 total, 5 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.09
Nodes (33): sitemap(), BEDROOMS, EASE, PROPERTY_TYPES, Props, REGIONS, STATUSES, PropertiesPreview() (+25 more)

### Community 1 - "Community 1"
Cohesion: 0.09
Nodes (23): badges, EASE, steps, CountUp(), EASE, Parallax(), RevealHeading(), RevealVariant (+15 more)

### Community 2 - "Community 2"
Cohesion: 0.07
Nodes (16): EASE, faqs, quickLinks, services, FaqJsonLd(), faqPage, JsonLd(), localBusiness (+8 more)

### Community 3 - "Community 3"
Cohesion: 0.09
Nodes (18): metadata, EASE, Gallery(), Media, EASE, posts, Marquee(), ROW_A (+10 more)

### Community 4 - "Community 4"
Cohesion: 0.09
Nodes (16): makeSlug(), ALLOWED, drawBlob(), EMPTY_FORM, Form, Listing, loadImg(), OptionGroup (+8 more)

### Community 5 - "Community 5"
Cohesion: 0.10
Nodes (9): EASE, EASE, headlineLines, EASE, partners, Promos(), EASE, Promo (+1 more)

### Community 6 - "Community 6"
Cohesion: 0.12
Nodes (11): LogoutButton(), Dashboard(), publicClient(), AdminListings(), AdminPromos(), EMPTY, Form, Promo (+3 more)

### Community 7 - "Community 7"
Cohesion: 0.12
Nodes (10): size, EASE, EASE, stats, EASE, stats, CONTACT, DEVELOPERS (+2 more)

### Community 8 - "Community 8"
Cohesion: 0.29
Nodes (11): ALLOWED_ORIGINS, checkRate(), corsHeaders(), esc(), isEmail(), isPhone(), log(), OPTIONS() (+3 more)

### Community 9 - "Community 9"
Cohesion: 0.22
Nodes (6): EASE, EASE_OUT, FOCUSABLE, FormState, InquiryModal(), Props

### Community 10 - "Community 10"
Cohesion: 0.29
Nodes (4): EASE, LoanCalculator(), peso(), metadata

### Community 11 - "Community 11"
Cohesion: 0.33
Nodes (4): dmSerif, jakarta, metadata, viewport

## Knowledge Gaps
- **100 isolated node(s):** `metadata`, `metadata`, `Props`, `metadata`, `Props` (+95 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `InquiryModal()` connect `Community 9` to `Community 0`?**
  _High betweenness centrality (0.085) - this node is a cross-community bridge._
- **Why does `createClient()` connect `Community 6` to `Community 4`?**
  _High betweenness centrality (0.056) - this node is a cross-community bridge._
- **Why does `STATS` connect `Community 7` to `Community 1`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **What connects `metadata`, `metadata`, `Props` to the rest of the system?**
  _100 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.08687943262411348 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.09309309309309309 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.07096774193548387 - nodes in this community are weakly interconnected._