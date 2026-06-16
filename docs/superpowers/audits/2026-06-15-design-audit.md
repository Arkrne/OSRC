# OSRC Design Audit — June 15, 2026

**Skill applied:** `design-taste-frontend` (Anti-Slop Frontend Skill)
**Design Read:** Premium-consumer real estate landing page for Philippine first-time homebuyers, warm lifestyle brand, leaning toward modern consumer marketing.
**Dials:** DESIGN_VARIANCE: 7 | MOTION_INTENSITY: 6 | VISUAL_DENSITY: 4
**Pages audited:** `/` `/about` `/contact` `/services` `/properties`

---

## SEVERITY KEY

- **[BANNED]** — Hard violation of a skill rule. Must fix before launch.
- **[AI TELL]** — Clear signature of AI-generated design. High priority.
- **[UX]** — Functional or clarity problem.
- **[POLISH]** — Refinement that raises perceived quality.

---

## GLOBAL (all pages)

### G1 — Em-dash used throughout the entire site [BANNED]

Em-dash (`—`) is completely banned (Section 9.G). Found on every single page:

| Location | Offending string |
|---|---|
| Homepage mid-page CTA | "Metro Manila — all Pag-IBIG eligible" |
| About page hero body | "transparent service — managing sales" |
| Services intro body | "We handle everything — Pag-IBIG paperwork" |
| Services HOW IT WORKS | "every stage — from finding out" |
| Properties header subtext | "pre-qualification — no obligation" |
| Properties empty state | "Check back soon — new properties are added" |

**Fix:** Replace every `—` with a comma, period, or restructured sentence. Zero exceptions.

---

### G2 — Eyebrow pill overuse (12+ instances across 5 pages) [AI TELL]

Rule: max 1 eyebrow per 3 sections. These are the pill badges above section headlines:

| Page | Eyebrow text |
|---|---|
| `/` | PAG-IBIG HOUSING LOAN SPECIALISTS (hero) |
| `/` | TRUSTED DEVELOPER PARTNERS (partners) |
| `/` | LIFESTYLE (video reel) |
| `/` | AVAILABLE PROPERTIES (properties section) |
| `/` | READY TO FIND YOUR HOME? (mid-page CTA) |
| `/about` | OUR STORY |
| `/about` | WHERE WE SERVE |
| `/about` | GALLERY |
| `/contact` | GET IN TOUCH |
| `/contact` | FAQ |
| `/services` | WHAT WE DO |
| `/services` | HOW IT WORKS |
| `/properties` | AVAILABLE PROPERTIES |

**Fix:** Remove eyebrow pills from at least 8 of these 13 instances. Keep only the most load-bearing 1 per page (e.g. the hero eyebrow on the homepage). Section headlines are strong enough alone.

---

### G3 — Premium-consumer beige/cream palette (AI default) [AI TELL]

The page background throughout is a warm cream (`#FBF6EC` / `#F5F0E8` range). This is the single most-tested AI-default for real estate and lifestyle brands (Section 4.2 PREMIUM-CONSUMER PALETTE BAN). Every property landing page, every real estate AI build defaults here.

**Fix:** Either commit to this palette with a clear brand justification (document it), or shift to one of the non-default alternatives:
- Cold Luxury: silver-grey + chrome + smoke
- Forest: deep green + bone + amber accent
- Black and Tan: true off-black + warm tan, sharp contrast
- Olive + Brick + Paper: muted olive + brick-red accent

If the brand explicitly chose this palette, document it in `CLAUDE.md` so future agents stop flagging it.

---

### G4 — Decorative status dots on every element [BANNED]

Section 9.F: "ZERO decorative status dots by default." Found:

| Location | Dot color | Element |
|---|---|---|
| Hero eyebrow pill | orange | "• PAG-IBIG HOUSING LOAN SPECIALISTS" |
| Hero secondary CTA | green | "• Get Pre-Qualified" |
| Hero top-right badge | green | "• All properties Pag-IBIG eligible" |
| About page SEC badge | green | "• SEC REGISTERED" |

**Fix:** Remove all decorative dots. The orange dot in the eyebrow pill and green dots on CTAs add nothing and are pure AI-design fingerprints.

---

### G5 — Duplicate CTA intent across pages [BANNED]

"Pre-Qualification" appears as a CTA on every page under a different label, violating the No Duplicate CTA Intent rule:

- Hero: "Get Pre-Qualified"
- Mid-page CTA: "Get Free Pre-Qualification"
- About page: "Get Free Loan Assessment"
- Services: "24-Hr Pre-Qualification"
- Nav CTA: "Get Free Consult"

**Fix:** Pick ONE label for this intent and use it everywhere. Recommendation: **"Get Free Pre-Qual"** (short, specific, distinct from the broader "Consult" CTA).

---

### G6 — Split-header pattern on every page [BANNED]

Section 4.7 SPLIT-HEADER BAN: "big left headline + right small explainer paragraph as a section header" is banned. It appears on:

| Page | Section |
|---|---|
| `/about` | Hero ("Built to Make Homeownership Real." left + 3-paragraph intro right) |
| `/about` | Gallery ("Life at Orange Square" left + "A look inside..." right) |
| `/services` | Intro (blank left, "We handle everything..." right) |
| `/contact` | FAQ ("Questions, Answered" left + accordion right) |

**Fix:** Stack vertically (headline on top, body below, max-width 65ch). Reserve a 2-column split for when the right column carries a real visual or interactive element, not filler text.

---

### G7 — Stats repeated 3 times across the site [UX]

The same 4 stats (Developer Partners, Regions, Families Served, Pre-Qual time) appear:
1. Homepage: dark horizontal strip at the top
2. Homepage: dark bento cards mid-page
3. About page: inline stat row below the hero

This is repetition without purpose. Pick ONE treatment and one location per page.

---

## HOMEPAGE (`/`)

### H1 — Hero headline spans 4 lines at desktop [BANNED]

"Find Your / Dream Home. / We Handle / the Pag-IBIG." is 4 lines at 1440px. Rule: max 2 lines at desktop. This is a Pre-Flight Fail.

**Fix (option A):** Increase font size so the headline is bold and large, rewrite to 2 lines: "Find Your Dream Home. We Handle the Pag-IBIG." at `text-6xl md:text-7xl` tracking-tight.

**Fix (option B):** Split into eyebrow + 2-line headline: eyebrow "Pag-IBIG specialists", headline "Find Your Dream Home."

**File:** `src/components/Hero.tsx`

---

### H2 — Serif display font mixed with sans in the hero headline [AI TELL]

"Dream Home." appears to use a serif/decorative font while "Find Your" and "We Handle / the Pag-IBIG." are in a different weight/family. Section 4.1 EMPHASIS RULE: "use italic or bold of the SAME font. Do NOT inject a different family just to add visual interest."

**Fix:** Use the accent color alone to differentiate "Dream Home." — same font family, different color (orange). Drop the serif variant for those words.

**File:** `src/components/Hero.tsx`

---

### H3 — VideoReel, VideoShowcase: broken video (black screen) [UX]

Pexels CDN hotlink blocking — tracked separately in the bug audit. Design implication: every section that relies on a video currently renders a black rectangle. The lifestyle section and hero are visually dead until videos are self-hosted.

---

### H4 — Partners: 2-letter acronym boxes instead of logos [AI TELL]

"VL", "SP", "CM", "LN", "LH", "CA", "FH" in small rounded boxes are not logos (Section 4.8). The logo wall rule: use real SVG logos (Simple Icons / devicon) or designed monogram SVGs, not plain-text abbreviations.

**Fix:** Source real SVG logos from developer brand sites or Simple Icons for: Vista Land, Suntrust, Camella, Lancaster New City, Lumina Homes, Crown Asia, Futura. Store in `public/logos/`. Until sourced, use designed monogram SVGs (single letter in a circle matching brand color) — not colored text in a box.

**File:** `src/components/Partners.tsx`

---

### H5 — Mid-page CTA: headline is 3 lines at desktop [BANNED]

"Browse Pag-IBIG Homes, / Find the Right Fit" is visually 3 lines (including the orange italic line). Max 2 lines at desktop.

**Fix:** Reduce to 2 lines: "Browse Pag-IBIG Homes. Find the Right Fit." at a tighter `text-5xl`. Or cut to one line per visual band: "Browse Pag-IBIG Homes" (white) / "Find the Right Fit" (orange).

**File:** `src/components/PropertiesCTA.tsx` (or equivalent mid-page CTA component)

---

### H6 — TrustStats section appears twice on homepage [UX]

The dark stats strip and the bento stat cards are the same data rendered twice. Users see "10+ Developer Partners" and "4 Regions" twice before they reach the footer.

**Fix:** Remove the thin horizontal stat strip between the hero and the partners section. Keep only the bento card version which is visually stronger.

**File:** `src/components/TrustStats.tsx` (remove one render from the homepage)

---

### H7 — "Lifestyle" section eyebrow on VideoReel [AI TELL]

"LIFESTYLE" pill above the video reel section is a section-number-adjacent tell. The video itself communicates the lifestyle topic. No label needed.

**Fix:** Remove the "LIFESTYLE" eyebrow pill entirely.

**File:** `src/components/VideoReel.tsx`

---

## ABOUT PAGE (`/about`)

### A1 — Gallery: text labels overlaid directly on images [BANNED]

"Model Homes", "Interiors", "Bedrooms", "Community Tour" appear as white text rendered on top of the gallery images. Section 9.F: "No pills/labels/tags overlaid on images."

**Fix:** Move label text to BELOW each image as a caption outside the image bounds. Or remove captions entirely if the images are self-explanatory. The images themselves already communicate their subject.

**File:** `src/components/Gallery.tsx`

---

### A2 — Region cards: "X communities" pill overlaid on images [BANNED]

"5 communities", "3 communities", "4 communities", "2 communities" appear as pills on top of the region card images.

**Fix:** Move community count below the region name, outside the image, as secondary metadata text.

**File:** `src/components/RegionsGrid.tsx` (or equivalent)

---

### A3 — "Orange Square" styled in italic serif within headline [AI TELL]

In "Life at *Orange Square*", the brand name is in an italic serif variant embedded within a sans-serif headline. This is the mixed-family emphasis pattern (Section 4.1 BANNED). It reads as a deliberate "artsy" choice but is a textbook AI design tell.

**Fix:** Bold the brand name in the same sans-serif family, using the orange accent color. Remove the serif italic treatment.

**File:** `src/components/Gallery.tsx`

---

### A4 — SEC badge uses decorative green dot [BANNED]

Floating image badge "• SEC REGISTERED / OPC-2024-OSRC-00142" has a green dot before the label. This is a decorative status dot (BANNED, Global G4).

**Fix:** Remove the green dot. The word "SEC REGISTERED" and the registration number are sufficient trust signals. A shield icon from Phosphor/Tabler would be more appropriate if an icon is needed.

**File:** `src/components/AboutHero.tsx` (or equivalent)

---

### A5 — Body copy em-dash in the about hero [BANNED]

"We offer exceptional options and transparent service — managing sales, loan documentation, and consultancy to make your search effortless and enjoyable."

**Fix:** "We offer exceptional options and transparent service: managing sales, loan documentation, and consultancy to make your search effortless and enjoyable."

---

## SERVICES PAGE (`/services`)

### S1 — Section numbers as design elements [BANNED]

Large faded "01", "02", "03" numbers and "01", "02", "03", "04" in the step cards. Section 9.F: "No section-numbering eyebrows / No generic step labels." The content itself is the label.

**Fix:** Remove the large faded step numbers entirely. For the HOW IT WORKS cards: use a solid colored step indicator (small orange circle with step number, 24x24px max) or no number at all, letting the card title carry the weight.

**File:** `src/app/services/page.tsx`

---

### S2 — Floating tag pills ("FULL PROCESSING", "TRUSTED DEVELOPERS", "HONEST ADVICE") [AI TELL]

These pill labels float on the right side of each service row with no clear alignment. They are a pattern of "decorative meta-labels" — the Section 9.F "floating top-right sub-text" tell.

**Fix:** Remove these floating tags. The service titles are self-explanatory. If a short qualifier is needed, add it as a small sentence below the description body.

**File:** `src/app/services/page.tsx`

---

### S3 — border-t hairline on every service row [BANNED]

Section 9.F: "No `border-t` + `border-b` on every row of a long list." The services list uses a hairline above each service item in a classic spec-table pattern.

**Fix:** Replace the hairline list with a 2-column feature card grid (icon + title + 2-sentence description). Or use a single divider only at the TOP of the section, then let services breathe with section padding alone.

---

### S4 — HOW IT WORKS: 4 equal-width cards in a row [AI TELL]

The 4 step cards (Free Pre-Qualification, Property Matching, Loan Processing, Move In) are 4 equal columns — a variation of the "3 equal feature cards" banned pattern. They all have the same structure: icon box, step number, title, body.

**Fix:** Vary the treatment. Options:
- Horizontal numbered timeline (connector line between steps)
- 2+2 grid with alternating emphasis
- Vertical accordion with step connector

---

### S5 — "WHAT WE DO" eyebrow stretches full page width [UX]

The pill eyebrow on the services page stretches edge-to-edge across the page, which is not how a small eyebrow label should behave. It reads as a nav bar or banner, not a section label.

**Fix:** Constrain the eyebrow pill to `width: fit-content`. It should be a small label, not a full-bleed element.

**File:** `src/app/services/page.tsx`

---

## CONTACT PAGE (`/contact`)

### C1 — Contact info cards (PHONE/EMAIL/HOURS) use border-t dividers between equal cards [AI TELL]

The 3-column info row with thin borders between PHONE, EMAIL, HOURS is a mild version of the hairline-spec-table pattern (Section 9.F).

**Fix:** Use negative space alone to separate the 3 items, or a light border only on the container (no internal dividers). Alternatively, present them as a clean horizontal row with icons, no card borders.

**File:** `src/components/ContactForm.tsx` or `src/app/contact/page.tsx`

---

### C2 — FAQ layout is the split-header pattern [BANNED]

"Questions, Answered" sits as a left-column headline opposite the right-column FAQ accordion. This is the banned split-header layout (Global G6).

**Fix:** Stack vertically — headline + 1-line description above the full-width accordion. This is also cleaner at mobile.

**File:** `src/components/FAQ.tsx`

---

## PROPERTIES PAGE (`/properties`)

### P1 — Page has no visual anchor at the top [UX]

The properties page opens with an eyebrow pill + headline + search bar on a plain cream background. There is no hero image, no lifestyle photograph, no visual context. For a real estate browse page, this is a missed opportunity to show the quality of properties.

**Fix:** Add a subdued hero image strip (a property photo at 40% height, with a dark overlay) behind the headline and search bar. This anchors the page visually and reinforces the brand before the listings grid.

---

### P2 — Empty state icon is a generic rounded box [AI TELL]

The empty state shows a magnifying glass icon inside a soft-cornered light square box. This is the standard "egg icon in a box" AI empty state pattern (Section 9.D "NO generic avatars").

**Fix:** Replace with a more intentional empty state: a small line-art illustration of a house, or a cleaner typographic treatment ("No properties yet — we add new listings weekly.") with a direct CTA to submit inquiry. Remove the generic icon box.

**File:** `src/components/PropertiesGrid.tsx`

---

### P3 — Empty state has em-dash [BANNED]

"Check back soon — new properties are added regularly." (Global G1)

**Fix:** "Check back soon. New properties are added every week."

---

## COMPONENT-LEVEL ISSUES

### CM1 — Navbar floating pill is now a cliche [AI TELL]

The floating glassmorphism pill navbar (centered, floating, with backdrop-blur) was distinctive in 2023. By 2026 it is the default AI-generated nav pattern. Every SaaS site, real estate site, and marketing page uses this exact treatment.

**Fix (option A):** Convert to a flush top nav with a thin `border-b` instead of a floating pill. Keep the orange CTA pill.
**Fix (option B):** Push the nav to the left edge (left-align logo, center nav links, right-align CTA) with more visual weight on the left side.

**File:** `src/components/Navbar.tsx`

---

### CM2 — Feature icons are beige rounded squares with orange icons [AI TELL]

The "Why Choose Us" features use a consistent pattern: small beige/cream rounded square containing an orange lucide icon. This icon-in-a-box pattern is the single most common AI component design. It appears on: homepage features, about page features, services HOW IT WORKS cards.

**Fix:** Replace with either:
- No icon box at all — use the icon directly, unstyled, at 20px with `strokeWidth={1.5}`
- A large decorative number replacing the icon (styled uniquely, not the faded grey "01" pattern)
- An image or illustration for each feature

**Files:** `src/components/WhyChooseUs.tsx`, services step cards

---

### CM3 — PropertyCard price display was showing raw integers [FIXED]

Already fixed in the June 15 audit (displayPrice utility). Note: property cards will need real listing data to validate visually.

---

### CM4 — InquiryModal "Property of Interest (optional)" label line-breaks awkwardly [POLISH]

The optional label now reads: `Property of Interest(optional)` with the "(optional)" text appended inline. Depending on font rendering, this can line-break mid-label at narrow widths.

**Fix:** Ensure the label uses `flex items-center gap-1` or wraps the optional span with `whitespace-nowrap`.

**File:** `src/components/InquiryModal.tsx`

---

## TYPOGRAPHY AUDIT

### T1 — Serif display font used for all major headlines [AI TELL]

The site uses a serif display font for all hero headlines and section headers. Per Section 4.1: "Serif is very discouraged as the default. 'It feels creative/premium/editorial' is NOT a reason to reach for serif."

Real estate is not inherently editorial or luxury (in the Philippines first-home-buyer context, it is aspirational but accessible). The current serif gives an "AI tried to feel premium" impression.

**Recommendation:** Keep the serif IF it is explicitly the brand font (document this decision). If choosing fresh: use a strong sans-serif display — Cabinet Grotesk, Satoshi, or Geist — which would feel more modern, trustworthy, and accessible. The orange accent color does more heavy lifting for warmth than the serif does.

---

### T2 — Inconsistent font emphasis in headlines [AI TELL]

Multiple headlines mix font weight changes to create accent: "Find Your / **Dream Home.** / We Handle" — where "Dream Home." is a different color AND appears to be a different weight/style. The emphasis should come from color alone, not font switching.

**Fix:** One font family, two weights max, one accent color. Do not switch to a decorative/italic variant mid-headline.

---

## MOTION / INTERACTION AUDIT

### MI1 — No hover states on partner logo cards [UX]

The partner acronym cards have no hover treatment. At minimum they should have a gentle lift or border highlight on hover given the interactive aesthetic of the rest of the site.

---

### MI2 — Pause button on videos has no tooltip or label [UX]

The video pause button (circle with pause icon, bottom-right of video sections) has no accessible label and is small (32px). A user who has never seen this pattern may not know it controls the video.

**Fix:** Add `aria-label="Pause video"` and a tooltip on hover. Consider making it slightly larger (40px) with a text label ("Pause") on hover.

**File:** `src/components/Hero.tsx`, `src/components/VideoReel.tsx`

---

### MI3 — Gallery images have no hover interaction [POLISH]

The About page gallery grid has no hover state on individual images. Given MOTION_INTENSITY: 6, images should have a subtle zoom or overlay reveal on hover.

**Fix:** Add `group-hover:scale-105 transition-transform duration-500` on the inner `<Image>` inside a `group` container. Use `overflow-hidden` on the outer div to clip the scale.

**File:** `src/components/Gallery.tsx`

---

## COPY AUDIT

### CO1 — "manage your search effortless" — grammatical error [UX]

About page body: "make your search effortless and enjoyable" — this one is correct. But check: "We offer exceptional options and transparent service — managing sales, loan documentation, and consultancy to make your search effortless and enjoyable." The sentence uses "exceptional options" which is vague filler copy.

**Fix:** "We handle your Pag-IBIG paperwork, developer negotiations, and loan documentation from start to finish."

---

### CO2 — "Gambling on a broker" phrasing is strong but potentially off-brand [POLISH]

About page: "Buying a home here usually means drowning in paperwork and gambling on a broker." The word "gambling" is punchy but may feel aggressive to risk-averse Filipino homebuyers.

**Fix (optional):** Consider "trusting the wrong broker" as a softer alternative that is equally clear but less abrasive.

---

## PRIORITY ORDER FOR FIXES

### Immediate (BANNED violations — launch blockers)

1. **G1** — Remove all em-dashes sitewide (find-replace `—` with alternatives)
2. **G4** — Remove all decorative dots (hero eyebrow, CTA dots, SEC badge)
3. **H2** — Fix hero headline font mixing (same family, color only for accent)
4. **H1** — Reduce hero headline to 2 lines at desktop
5. **A1** — Move gallery labels off images (Gallery.tsx)
6. **A2** — Move community count off region card images
7. **S3** — Replace hairline service list with card grid

### High (AI tells — brand quality)

8. **G2** — Cull eyebrow pills to max 1 per 3 sections per page
9. **H4** — Replace acronym partner boxes with real SVG logos
10. **S1** — Remove faded section numbers from services
11. **S2** — Remove floating tag pills from service rows
12. **S4** — Replace 4 equal step cards with a timeline or varied layout
13. **CM2** — Replace icon-in-a-beige-box feature pattern
14. **H6** — Remove duplicate TrustStats strip from homepage
15. **G6** — Fix split-header pattern (stack vertically)

### Medium (UX + polish)

16. **G5** — Unify pre-qualification CTA label sitewide
17. **H5** — Mid-page CTA headline to 2 lines
18. **CM1** — Evaluate nav treatment vs. floating pill cliche
19. **P1** — Add visual anchor to properties page header
20. **P2** — Replace generic empty state icon
21. **S5** — Constrain "WHAT WE DO" eyebrow to fit-content width
22. **G3** — Document or replace the cream palette decision
23. **MI2** — Add accessible label to video pause button
24. **MI3** — Add hover interaction to gallery images
25. **C1** — Remove internal dividers from contact info cards

---

## WHAT IS ALREADY GOOD

- Color accent consistency: orange `#E85D04` is used consistently and without variation — this is correct
- Shape consistency: rounded-full CTAs, rounded-xl cards, rounded-2xl modals — consistent
- Dark section contrast: the dark TrustStats bento and mid-page CTA card use high contrast well
- Footer: clean, well-structured 4-column layout with useful links
- Contact page hero: 2-line headline, clear hierarchy, correct CTA placement
- PropertyCard layout: good image-to-content ratio, correct info hierarchy (price, title, location, description)
- InquiryModal: comprehensive form fields with good focus management
- Mobile nav: hamburger pattern is clean; the "Free Consult" fix is correct

---

*Audit conducted via Playwright browser session at 1440x900. All findings are against the `design-taste-frontend` skill ruleset.*
