# Graph Report - .  (2026-06-10)

## Corpus Check
- Corpus is ~17,585 words - fits in a single context window. You may not need a graph.

## Summary
- 228 nodes · 268 edges · 22 communities (17 shown, 5 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 11 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

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

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `RevealHeading()` - 6 edges
3. `Stagger()` - 6 edges
4. `StaggerItem()` - 6 edges
5. `TiltCard()` - 6 edges
6. `Next.js Project (osrc-website)` - 6 edges
7. `Next.js Framework` - 5 edges
8. `scripts` - 4 edges
9. `SpotlightCard()` - 4 edges
10. `Property` - 4 edges

## Surprising Connections (you probably didn't know these)
- `Next.js Agent Rules` --conceptually_related_to--> `Next.js Framework`  [INFERRED]
  osrc-website/AGENTS.md → osrc-website/README.md
- `Next.js Breaking Changes Warning` --rationale_for--> `Next.js Framework`  [INFERRED]
  osrc-website/AGENTS.md → osrc-website/README.md
- `CLAUDE.md Agents Reference` --references--> `Next.js Agent Rules`  [EXTRACTED]
  osrc-website/CLAUDE.md → osrc-website/AGENTS.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Next.js Project Bootstrap and Deployment Flow** — readme_nextjs_project, readme_create_next_app, readme_vercel_deployment [INFERRED 0.85]
- **Agent Rules, Breaking Changes Warning, and Docs Reference for Next.js** — agents_nextjs_agent_rules, agents_nextjs_breaking_changes_warning, agents_nextjs_docs_node_modules [EXTRACTED 1.00]

## Communities (22 total, 5 thin omitted)

### Community 0 - "Awards & Gallery"
Cohesion: 0.07
Nodes (29): badges, EASE, Media, EASE, steps, ROW_A, ROW_B, CountUp() (+21 more)

### Community 1 - "Main Pages & About"
Cohesion: 0.06
Nodes (13): EASE, EASE, faqs, EASE, quickLinks, services, EASE, posts (+5 more)

### Community 2 - "Contact & Inquiry Forms"
Cohesion: 0.12
Nodes (13): EASE, EASE_OUT, FormState, Props, EASE, EASE, Props, priceRanges (+5 more)

### Community 3 - "Dependencies & Packages"
Cohesion: 0.09
Nodes (22): dependencies, @anthropic-ai/sdk, framer-motion, lucide-react, next, react, react-dom, resend (+14 more)

### Community 4 - "TypeScript Configuration"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 5 - "Dev Docs & Agent Rules"
Cohesion: 0.21
Nodes (12): Next.js Agent Rules, Next.js Breaking Changes Warning, Next.js Dist Docs in node_modules, CLAUDE.md Agents Reference, app/page.tsx Entry Point, create-next-app Bootstrap Tool, Development Server (npm run dev), Geist Font Family (+4 more)

### Community 6 - "App Layout & Fonts"
Cohesion: 0.33
Nodes (4): dmSerif, jakarta, metadata, viewport

### Community 7 - "AI Chatbot"
Cohesion: 0.33
Nodes (4): EASE_DRAWER, EASE_OUT, INITIAL_MESSAGE, Message

### Community 8 - "Navigation Bar"
Cohesion: 0.33
Nodes (4): EASE_DRAWER, EASE_OUT, navLinks, SPRING

### Community 9 - "Hero Section"
Cohesion: 0.40
Nodes (3): EASE, headlineLines, stats

### Community 10 - "Loan Calculator"
Cohesion: 0.50
Nodes (3): EASE, LoanCalculator(), peso()

### Community 11 - "Testimonials"
Cohesion: 0.40
Nodes (3): data, EASE, Testimonial

### Community 13 - "Next.js Brand Assets"
Cohesion: 0.67
Nodes (4): Next.js Brand Identity, Next.js Framework, Next.js SVG Logo, Next.js Wordmark Typography

### Community 14 - "Window UI Icon"
Cohesion: 0.67
Nodes (4): Browser Window UI Element, Flat Monochrome Icon Style, Window SVG Icon, Traffic Light Dots (Window Controls)

### Community 16 - "File Icon Asset"
Cohesion: 1.00
Nodes (3): Document/File Icon (generic file representation), File SVG Icon, Flat Monochrome Icon Style (#666 fill, no stroke)

### Community 17 - "Globe Icon Asset"
Cohesion: 0.67
Nodes (3): World / Global Concept, Globe SVG Icon, Flat Monochrome Icon Style

### Community 18 - "Vercel Brand Asset"
Cohesion: 1.00
Nodes (3): Vercel Brand Identity, Vercel Logo SVG, Vercel Triangle Icon

## Knowledge Gaps
- **110 isolated node(s):** `nextConfig`, `name`, `version`, `private`, `dev` (+105 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What connects `nextConfig`, `name`, `version` to the rest of the system?**
  _110 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Awards & Gallery` be split into smaller, more focused modules?**
  _Cohesion score 0.06648936170212766 - nodes in this community are weakly interconnected._
- **Should `Main Pages & About` be split into smaller, more focused modules?**
  _Cohesion score 0.05555555555555555 - nodes in this community are weakly interconnected._
- **Should `Contact & Inquiry Forms` be split into smaller, more focused modules?**
  _Cohesion score 0.11956521739130435 - nodes in this community are weakly interconnected._
- **Should `Dependencies & Packages` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._
- **Should `TypeScript Configuration` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._