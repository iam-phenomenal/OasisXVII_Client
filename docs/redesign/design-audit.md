# Design Audit

**Phase 1, Part A.** Skill: `/redesign-existing-projects`.
**Checkpoint artifact — read this before Phase 2 starts.**

Scope: `/`, `/shop`, `/products/[slug]`, the shell, and the policy/utility
routes. `/cart` and `/checkout` are audited for **regression risk only** (§5) —
no design findings, per the README scope.

Bound to the direction lock. Where this skill's generic advice contradicts the
lock, the lock wins; §6 records what was deliberately rejected.

---

## 1. Verdict

The codebase is in better shape than a redesign brief usually implies. It is
not generic-AI work: the palette is deliberate and documented, the voice is
consistent, semantic HTML is used throughout, there are no `href="#"` dead
links, no lorem ipsum, no "Acme Corp" placeholder content, no purple-blue AI
gradient, no `z-index: 9999`, and the active nav state is handled.

The real problem is **a design system that exists in the config and is not
applied in the code**. Tokens are defined, documented with rationale, and then
bypassed at the call site. That is the through-line connecting most of what
follows.

Counts: 10 routes, ~3,425 lines of TSX, 4 font families, 11 surface tokens,
23 arbitrary tracking values, 0 uses of the spacing scale.

---

## 2. Findings — high

### A1. The spacing scale is defined and never used

`tailwind.config.ts` defines the entire vertical rhythm as two tokens:

```ts
spacing: {
  section: "8.5rem",  // "8.5rem (24) vertical section padding"
  block: "0.7rem",    // "0.7rem (2) heading-to-subtext gap"
}
```

**Usages across `src/`: zero.** Not `py-section`, not `gap-block`, nothing.

Every page instead hardcodes its own rhythm — home uses `py-32`, `mb-20`,
`gap-y-24`, `mb-10`, `mb-4`; the shop grid uses `gap-y-16`; the related rail
uses `mt-72` and `mb-20`. The three product grids disagree with each other
(`gap-y-24` / `gap-y-16` / `gap-12`).

This is the single highest-leverage finding. The lock's "substantially more
negative space" goal is unimplementable until spacing runs through tokens,
and Phase 2 cannot specify a rhythm that Phase 3 has no mechanism to apply.

**Phase 2 owns the values. Phase 3 owns the application.** Not fixed here —
changing spacing is a taste judgement, explicitly deferred by the phase doc.

### A2. Four font families, one of them nearly unused

| Token | Family | Call sites |
|---|---|---|
| `font-headline` | Space Grotesk | 61 |
| `font-body` | Inter | 25 |
| `font-serif` | Bodoni Moda | 13 |
| `font-display` | **Epilogue** | **4** |

Epilogue loads four weights (400/700/800/900) to serve four call sites: three
on the home page and one in `CartClient`. It is doing no work that Space
Grotesk or Bodoni Moda could not.

Bodoni Moda is the locked display serif and stays. Inter is the body face —
this skill's checklist says to replace Inter on sight, but here it is the
neutral body text under a strong display serif, which is a legitimate pairing,
not a default.

**Recommendation: drop Epilogue, fold its four sites into `font-headline`.**
One fewer family, four fewer weight files, no visual loss.

Phase 2 rules (O3 in the implementation plan); **Phase 3 step 1 deletes it
from `layout.tsx`**. Not fixed here — it changes the rendered type on the home
hero.

### A3. Render-blocking icon font

`layout.tsx` pulls Material Symbols from `fonts.googleapis.com` with a
`<link rel="stylesheet">` in `<head>`, blocking first paint on a third-party
request — for 17 glyphs.

Full inventory and the three-commit migration sequence are in the
[implementation plan](implementation-plan.md) §4.2. **This is the one Part B
item that edits `/cart` and `/checkout`.**

### A4. No focus-visible treatment across the shell

| Component | focus-visible |
|---|---|
| Navbar | **none** |
| MobileMenu | **none** |
| Footer | **none** |
| ProductCard | **none** |
| SortDropdown | **none** |
| ImageGallery | **none** |
| PolicyTableOfContents | **none** |
| Button, Dialog, NewsletterForm, SocialRow, HeroSlideshow | present |

A keyboard user tabbing the primary navigation or the product grid gets no
visible indication of position. The components that *do* have it already use a
consistent `ring-2 ring-accent ring-offset-2 ring-offset-background` pattern,
so there is an established treatment to extend — this is a gap, not a design
question.

Phase 4 owns focus states. Recorded here because it is an accessibility
requirement, not a polish item.

### A5. `accent` exceeds its own budget on the home hero

The config caps neon `#FF2D6F` at "<2% of UI". The home hero renders the
entire server-driven subheading in it at `md:text-4xl`:

```
font-display text-lg md:text-4xl font-bold uppercase tracking-[0.2em] text-accent
```

At 1440 that is a full-width line of 36px neon, plus an accent left-border on
the body copy and an accent "View Archive →" link in the same viewport. By
rendered area this is the largest single accent surface on the site and it is
above the fold.

Phase 2 must rule on where accent is permitted. Flagged, not fixed — the
answer is a direction decision.

---

## 3. Findings — medium

### B1. Surface token sprawl: 4 of 11 are dead

Utility-prefixed usages across `src/`:

| Token | Uses |
|---|---|
| bare `surface` | 27 |
| `surface-container` | 21 |
| `surface-container-low` | 5 |
| `surface-container-lowest` | 1 |
| `surface-container-high` | 1 |
| `surface-container-highest` | 1 |
| `surface-dim` | **0** |
| `surface-bright` | **0** |
| `surface-variant` | **0** |
| `surface-tint` | **0** |

Four tokens are unreferenced. Three more carry exactly one rule each.

`on-surface-variant` (65 uses) is a **different token** and stays — a naive
grep for `surface-variant` conflates the two and will report 65 false uses.

**Part B deletes the four dead tokens.** The single-use three are a
consolidation judgement and wait for Phase 2.

### B2. 23 arbitrary tracking values, no tracking scale

| Value | Uses |
|---|---|
| `tracking-[0.3em]` | 9 |
| `tracking-[0.2em]` | 7 |
| `tracking-[0.4em]` | 4 |
| `tracking-[0.5em]` | 2 |
| `tracking-[0.25em]` | 1 |

Five distinct values, 23 call sites, zero tokens. The lock calls for "tighter
tracking" as a direction goal — currently there is nothing to tighten
centrally.

Also 33 uses of `text-[10px]` and scattered `[9px]`, `[11px]`, `[14px]`,
`[15px]` — a type scale that exists only as arbitrary values.

**Part B hoists these to named tokens at their current values.** Renaming is
mechanical and direction-neutral; *changing* the values is Phase 2's call.

### B3. `min-h-screen` on the hero

`src/app/page.tsx:41` uses `min-h-screen` (`100vh`). On iOS Safari the
viewport height changes as the URL bar collapses, so the hero jumps during the
first scroll. `min-h-dvh` fixes it.

Mechanical and direction-neutral, but it changes hero geometry on mobile, so
it is worth landing with the Phase 3 hero work rather than blind in Part B.

### B4. No favicon, no social metadata

`src/app/` has no `icon.*` or `favicon.ico`; `public/` contains only
`oasisxvii-logo.svg`. `metadata` in `layout.tsx` sets `title` and
`description` and nothing else — no `openGraph`, no `og:image`, no Twitter
card.

Every share of this store currently renders as a bare link with a default
browser icon. There is already a brand SVG to derive both from.

### B5. No skip-to-content link

No skip link anywhere. Every page puts the full Navbar ahead of `<main>`, so
keyboard users tab the entire nav on every route. `<main>` landmarks are
correctly used, which is half the work already done.

---

## 4. Findings — low

### C1. Heading hierarchy on the home hero

The hero renders the headline as `h1` and the **tagline** as `h2`, then "NEW
DROPS" as another `h2`. A tagline is not a section heading; this gives the page
two sibling `h2`s of unequal rank. Should be a `p`.

### C2. `text-white` in ProductCard

`ProductCard.tsx:66` passes `text-white` to the badge, against the palette's
documented "no pure white — use `on-surface`" rule. Same rendered value today,
so it is invisible until the palette changes.

Already tracked as product-section.md §11.10.

### C3. Three product grids, three ladders

Home `1/2/3` with `gap-x-12 gap-y-24` inside `max-w-7xl`; shop `1/2/3` with
`gap-x-12 gap-y-16` with no max-width; related rail `2/4` with `gap-12`.

product-section.md §4 already specifies the unified ladder. Phase 3 applies it.

### C4. Pre-existing defects carried from Phase 0

Three defects found while installing the motion stack, recorded in full in
[findings/phase-0-notes.md](findings/phase-0-notes.md):

- **F1 (high, user-facing)** — the mobile menu scrim is 390x64 instead of
  390x800. `backdrop-filter` on `<header>` makes it a containing block for
  `position: fixed` descendants, so the scrim's `inset: 0` resolves against the
  header. The page behind the menu is never dimmed and tap-outside-to-close
  works only in the top 64px. **Mechanical fix, high value — but it is shell
  layout, so it lands in Phase 3 step 1.**
- **F2 (medium)** — API-backed routes 500 on a cold socket; no retry or error
  boundary around `apiFetch`.
- **F3 (low)** — `/products/[slug]` runs `generateStaticParams` and then opts
  out of static generation with `revalidate: 0`.

---

## 5. Cart and checkout — regression risk only

No design findings. These are the risks that token and shell changes create
for the 1,017 lines of revenue-critical flow.

| Risk | Detail | Mitigation |
|---|---|---|
| **Icon migration** | `CartClient` uses 7 glyphs, `CheckoutClient` 1. This is the only Part B change that edits either file. | Isolated commit, reverted independently. Full cart→checkout→submit regression before acceptance. See implementation plan §4.2. |
| **Surface token deletion** | The four dead tokens were grepped across **all** of `src/`, including both files. Zero uses. | Safe. |
| **Tracking/type token hoisting** | Renames must cover cart and checkout call sites or styles silently change. | Hoist by value, verify by screenshot diff against baseline. |
| **`font-display` removal** | `CartClient.tsx` has one `font-display` site. | Deferred to Phase 3 with the rest; must be migrated in the same commit. |
| **Scroll lock / Lenis** | Both consume `lockScroll`. | Verified in Phase 0 — [verify-scroll-lock.js](verify-scroll-lock.js), 14/14, including stacked overlays. |
| **Button / Dialog changes** | `Dialog` is only used by `ProductInfoPanel`; `Button` is used by both flows. | Button restyling in Phase 3 step 1 must be screenshot-diffed against cart and checkout. |
| **Form validation states** | Checkout validation must still render after any input restyling. | Covered by the Phase 5 submit test; re-check after Phase 3 step 1. |

---

## 6. Rejected — the lock overrides this skill

The skill's checklist is written for generic AI-built projects. These items
were raised by it and **deliberately not applied**, because the direction lock
governs:

| Skill says | Why rejected |
|---|---|
| "All-caps subheaders everywhere — try lowercase italics" | The uppercase editorial voice *is* the brand. Locked. |
| "Replace Inter" | Inter is the body face under a display serif, not a default choice. |
| "Three equal card columns is the most generic AI layout" | The lock adopts an editorial 4-up grid from the reference. Intentional. |
| "Pure `#000000` background" | Background is `#0F0F14`, already a tinted void. Not applicable. |
| "Pick one accent color" | Already one. The issue is quantity (A5), not count. |
| "Add a max-width container" | product-section.md §4.2 explicitly drops `max-w-7xl` so the grid runs full-bleed inside the page gutter. Direct conflict; the spec wins. |
| "Uniform border-radius — vary it" | Zero-radius is locked. The circle CTA is the one sanctioned exception. |
| "Use picsum.photos placeholder imagery" | All content is backend-driven. Never hardcode. |

This table is the guard §4.3 of the implementation plan calls for: four
opinionated skills run back to back, and each one's taste has to be filtered
through the lock rather than applied on top of the last one's.

---

## 7. Part B — what gets applied now

Only changes that are correct under **any** final direction.

| # | Change | Status |
|---|---|---|
| 1 | Delete dead CSS (`.primary-gradient`, `.text-glow-accent`) | done in Phase 0 |
| 2 | Delete 4 unused surface tokens | Part B |
| 3 | Hoist 23 arbitrary tracking values + the `[10px]`/`[9px]`/`[11px]` type sizes to tokens, at current values | Part B |
| 4 | Hoist the hero `drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)]` to a token | Part B |
| 5 | Material Symbols → inline SVG, three commits | Part B |
| 6 | Favicon + `openGraph` metadata (B4) | Part B |

**Explicitly deferred** — these need the Phase 2 direction and applying them
now would pre-empt it: the spacing scale (A1), the font-family decision (A2),
the accent budget (A5), the surface-token consolidation beyond the dead four
(B1), type scale *values*, grid ladder (C3), `min-h-dvh` (B3), the scrim fix
(F1), focus states (A4), skip link (B5), heading hierarchy (C1).

---

## 8. Open questions for the checkpoint

1. **A2 / O3 — Epilogue.** Confirm it is dropped. It changes the home hero's
   rendered type, so it needs your ruling before Phase 3 step 1.
2. **A5 — the accent budget.** The hero subheading is the biggest accent
   surface on the site and it is server-driven copy. Does it stay neon?
3. **O1 — the colour selector.** `ProductInfoPanel` hardcodes
   `product.colors[0]` in the add-to-bag handler, so multi-colourway products
   are unbuyable in their other colours. This is a live revenue bug found
   during the spec work, not a design gap. Confirm it lands in Phase 3 step 4.
4. **F1 — the scrim.** Mechanical, high-value, user-facing, and currently
   scheduled for Phase 3 step 1. Confirm you do not want it pulled forward.
