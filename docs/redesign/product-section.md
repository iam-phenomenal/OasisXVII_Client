# Product Section — Design Spec

**Status:** build spec, not a description of what ships today.
**Consumed by:** Phase 3 (`/impeccable`), with the grid and card tokens landing
in Phase 2.
**Bound to:** the direction lock in [README.md](README.md). This document does
not re-derive direction; where it is silent, the lock governs.

Supersedes `products_design.md`, which described the AURA reference site's own
skin (blue on beige, placeholder catalog). None of that skin survives here.
AURA contributes **structure only** — the 4-up editorial grid, tight columns
against generous row bands, the hover-reveal CTA, and substantially more
negative space.

---

## 1. Scope

| Surface | File | Role |
|---|---|---|
| Home "NEW DROPS" | [src/app/page.tsx](../../src/app/page.tsx) | 8-tile teaser grid |
| Shop catalog | [src/components/ui/ShopResults.tsx](../../src/components/ui/ShopResults.tsx) | paginated full catalog |
| Product tile | [src/components/ui/ProductCard.tsx](../../src/components/ui/ProductCard.tsx) | shared by all three |
| Product detail | [src/app/products/](../../src/app/products/) | gallery, info panel, related rail |

Out of scope: `/cart`, `/checkout`. They consume the same tokens, so every
token change here is regression-checked against them before it lands.

---

## 2. Inherited constraints

These are facts about the codebase, not choices this spec is free to make.

- **Tokens** come from [tailwind.config.ts](../../tailwind.config.ts). Wine-noir:
  `background #0F0F14`, `primary #4A0F27`, `accent #FF2D6F`, text `on-surface #E4E1E9`.
- **`primary` is fill-only.** As a foreground it lands between 1.04:1 and 1.26:1
  on every surface in the palette. Wine-colored *text* uses `on-surface-primary`
  (`#FFB2BD`, 9.28:1 at worst).
- **`accent` is capped at <2% of UI.** A neon element on every tile would blow
  that budget on its own.
- **Zero radius is the default.** `borderRadius.DEFAULT` is `0px`; only `btn`
  (12px) and `full` exist as exceptions.
- **No UI or animation dependencies.** All motion is hand-rolled CSS in
  [globals.css](../../src/app/globals.css). Nothing here may assume a library.
- **Content is backend-driven.** Products come from the settings/catalog API.
  Nothing in the grid may be hardcoded.
- **Verification widths** are 390 / 768 / 1440.

---

## 3. Data contract

Every visual slot maps to a real `Product` field
([src/types/product.ts](../../src/types/product.ts)). There are no placeholder
products in this spec — the AURA sample table is deleted.

| Slot | Field | Notes |
|---|---|---|
| Tile image | `images[0]` | via `getSafeImageUrl`; renders nothing if invalid |
| Product name | `name` | links to `/products/{slug}` |
| Sub-label | `tagline` | **not** `category` — see §11.3 |
| Price | `price` + `currency` | via `formatPrice`; `NGN` → `₦12,000`, `USD` → `$35.00 USD` |
| Corner chip | `badge` | `"New Drop"` \| `"Limited"` \| `"Sold Out"` |
| Availability | derived | `isSoldOut(product)` — `badge === "Sold Out"` is the catalog's only stock signal |

`category`, `sizes`, `colors`, `specs`, `description` and `relatedProductIds`
are consumed by the detail page only (§8).

### 3.1 Mixed-currency grids

`formatPrice` renders USD with a trailing ` USD` and NGN without a suffix. A
grid mixing both will show ragged price strings. This is acceptable — the
suffix is a disambiguation, not decoration — but prices must be
`tabular-nums` so the digits still align down the column.

---

## 4. Grid system

One ladder, all surfaces. Today the three grids disagree (3-up home with
`gap-y-24`, 3-up shop with `gap-y-16`, 4-up related with `gap-12`); this
unifies them.

### 4.1 The canonical ladder

```
grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
gap-x-6 gap-y-24
```

- **390** → 1 column
- **768** → 2 columns
- **1024** → 3 columns
- **1280+** → 4 columns (the AURA editorial 4-up)

### 4.2 Gutters — the full-bleed ruling

AURA runs tiles edge-to-edge with zero gutters. **We do not adopt that.**
Full-bleed is AURA's skin; its *structure* is the contrast between tight
columns and generous row bands. Zero page gutter would also fight the lock's
"substantially more negative space" goal by pushing content into the viewport
edge.

The ruling:

- **Page gutter stays:** `px-6` at mobile, `px-12` from `md`. Matches the
  detail page, which already uses `px-6 md:px-12`.
- **Column gap tightens:** `gap-x-12` (3rem) → `gap-x-6` (1.5rem). Tiles read
  as a continuous band, which is the move we actually wanted from AURA.
- **Row gap stays generous:** `gap-y-24` (6rem). Rows read as separate
  editorial bands, not as a dense catalog dump.
- **No `max-w-7xl`.** The home grid currently centers inside `max-w-7xl`; the
  shop grid does not. Drop it so both run the full viewport width inside the
  page gutter.

### 4.3 Page size

`PAGE_SIZE` moves **6 → 8** in
[ShopResults.tsx](../../src/components/ui/ShopResults.tsx). Six tiles in four
columns leaves a ragged 2-tile final row on every page; eight fills two clean
rows. The home teaser moves `slice(0, 6)` → `slice(0, 8)` for the same reason.

Eight also stays within the `stagger-1..9` classes that already exist in
`globals.css`, so no new stagger steps are needed.

### 4.4 Related-products rail (deliberate exception)

```
grid-cols-2 lg:grid-cols-4
gap-x-6 gap-y-16
```

Two columns at 390 rather than one. This rail is secondary content below the
fold of a detail page; a single-column stack there would add a full screen of
scrolling to reach the footer. Row gap is tighter (4rem) for the same reason.
This is the only permitted deviation from §4.1.

---

## 5. Product tile

### 5.1 Anatomy

```
┌─────────────────────────┐
│                   [chip]│  ← badge, top-right, flush
│                         │
│         image           │  aspect-[4/5], object-cover
│       ( 4 : 5 )         │  object-[center_20%]
│                         │
│      ( ○ VIEW MORE )    │  ← hover-reveal CTA, centered
└─────────────────────────┘
   NAME             PRICE     ← baseline-aligned row
   TAGLINE                    ← muted, letter-spaced
```

### 5.2 Image

- `aspect-[4/5]`, `bg-surface-container` as the loading plate.
- `object-cover object-[center_20%]` — the 20% Y-anchor keeps torsos and
  garment detail in frame rather than centering on a model's waist. Keep it.
- **`sizes` must match §4.1.** The current value stops at a `768px` breakpoint
  while the shop grid switches at `640px`, so tablet widths over-fetch today.
  Correct value:

  ```
  (min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw
  ```

- **`priority`** covers the first row: `index < 4`, up from `index < 3`.

### 5.3 Info row

- Container: `mt-5`, `flex flex-col gap-block` (the `0.7rem` token).
- Name + price on one `flex justify-between items-baseline gap-4` row.
- **Name:** `font-headline font-black uppercase tracking-tighter text-lg`.
  Steps down from `text-xl` — at 4-up the tile is ~318px at 1440, and `text-xl`
  black-weight wraps most two-word product names.
- **Price:** same weight and size as the name, plus `tabular-nums`, `shrink-0`.
- **Tagline:** `text-[10px] font-headline font-medium uppercase tracking-[0.25em] text-on-surface-variant`.

### 5.4 Badge chip

`VintageTag` at `size="md"`, top-right, flush to the image corner.

Current usage passes `text-white`, which violates the palette's "no pure white"
rule. Use `text-on-primary` — same rendered value, but tokenized, so a future
palette change carries.

`"Limited"` keeps the `vintage` variant; everything else uses `wine`.

### 5.5 Sold-out state

When `isSoldOut(product)`:

- Image and info row drop to `opacity-40`.
- The lift, the image scale and the hover CTA are all suppressed.
- A centered chip reads `SOLD OUT` — `bg-on-surface/10 backdrop-blur-md`,
  `text-[12px] font-headline font-black uppercase tracking-[0.3em]`,
  `border border-on-surface/20`.
- **The tile stays a link.** A sold-out product still has a detail page worth
  reading, and the accessible name already appends `, sold out`.

---

## 6. Interaction and motion

### 6.1 Hover-reveal CTA

The one structural move adopted wholesale from AURA.

- Centered on the image, revealed on hover of the tile.
- **Fill `primary` (`#4A0F27`), text `on-primary`.** Not `accent` — a neon
  circle on every tile would break the <2% budget in §2.
- Size: `clamp(88px, 8vw, 120px)` square. AURA's "15–18% of tile width" was
  measured against wider tiles; at our 4-up that computes to ~51px, too small
  for two lines of type.
- Label: `VIEW MORE`, two centered lines, `text-[10px] font-headline font-black
  uppercase tracking-[0.15em] leading-tight`.
- Transition: opacity and `scale(0.92 → 1)`, `300ms cubic-bezier(0.2, 1, 0.3, 1)`
  — the same curve the rest of the system uses.
- Not focusable and `aria-hidden`. The whole tile is already one link; a second
  tab stop to the same destination is noise for keyboard and screen-reader
  users.

**Flagged decision — the circle vs. the lock.** The direction lock specifies
zero-radius geometry, and a perfect circle contradicts it. Recommendation:
**keep the circle**, on the grounds that it reads as a wax seal or bottle
stamp — a viticulture motif consistent with "The Underground Sommelier" — not
as soft UI chrome. The config already permits `rounded-full`. If you'd rather
hold the line, the fallback is a square stamp at the same dimensions with
identical fill and type; say so and I'll switch it.

### 6.2 Composition with the existing lift

The CTA is *added to*, not a replacement for, what ships:

| Effect | Where it lives | Keep |
|---|---|---|
| `translateY(-8px)` tile lift | `.product-card-hover` in globals.css | yes |
| `scale(1.05)` image push-in | `pointer-fine:group-hover:scale-105` | yes |
| Name → `on-surface-primary` | ProductCard | yes |
| Circular CTA reveal | **new** | — |

All four fire together on one hover, on the same curve.

### 6.3 Pointer gating

Every hover effect stays behind the `pointer-fine` variant. Tailwind v4 gates
`hover:` on its own but **not** `group-hover:`, which is why the custom variant
exists in globals.css. A tap on a touch device must not leave the CTA stuck
open.

### 6.4 Reduced motion

`globals.css` has a `prefers-reduced-motion: reduce` block, but it currently
covers only `.animate-reveal` and the dialog. **Extend it** to neutralize the
tile lift, the image scale and the CTA's scale — the CTA may still fade, since
opacity alone is not vestibular motion.

### 6.5 Scroll reveal

`RevealSection` with `stagger={((index % 9) + 1)}` stays as-is on both grids.
With `PAGE_SIZE = 8` the stagger tops out at step 8 (560ms), which is a
comfortable ceiling for a two-row band.

### 6.6 Focus

The tile link has **no focus-visible treatment today** — a keyboard user
tabbing the grid gets nothing. Add the same ring the detail page already uses:

```
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent
focus-visible:ring-offset-2 focus-visible:ring-offset-background
```

This is `accent`'s highest-value use and is exempt from the <2% budget, since
it renders one tile at a time.

---

## 7. Shop catalog chrome

- **Header** keeps the oversized serif `SHOP` at `clamp(4rem, 12vw, 10rem)`,
  `leading-[0.85] tracking-tighter italic`.
- **Blurb + sort** stay on one `border-b border-primary/30` row, stacking at
  `md`.
- **Pagination** keeps the `01 — 08` zero-padded counter treatment. Disabled
  Prev/Next stay rendered at `text-on-surface-variant/40` with
  `pointer-events-none` so the control row does not reflow between pages.
- **Empty state — missing today.** If the catalog returns zero products the
  grid renders as blank space with a `01 / 01` counter under it. Add a centered
  block: `NOTHING IN THE ARCHIVE` in `font-headline font-black uppercase`, a
  muted line of body copy, and suppress the pagination row entirely.

---

## 8. Product detail page

### 8.1 Layout

`grid-cols-12`, gallery at `lg:col-span-7`, info panel at `lg:col-span-5` and
`lg:sticky lg:top-40`. Unchanged — this is already the editorial split the
direction calls for.

### 8.2 Gallery

`aspect-[4/5]` main image over a `grid-cols-2` thumbnail set capped at 4.
Active thumb carries `ring-2 ring-primary ring-offset-2`; inactive sit at
`opacity-60`. Keep the `cursor-crosshair` on inactive thumbs — it is a small,
deliberate piece of character.

### 8.3 Info panel

- `h1` at `font-serif clamp(3rem, 8vw, 6rem)`, `font-[900] leading-[0.8] tracking-tighter`.
- Price at `text-4xl font-headline font-medium`, badge chip beside it.
- Size grid at `grid-cols-4`, `h-16` targets — comfortably above the 44px
  minimum.
- Add-to-bag `Button` at `h-24 text-2xl`, with the `aria-live="polite"`
  confirmation already wired.
- Description, the bordered fit note (`border-l-4 border-primary`) and the size
  table keep their current structure.

### 8.4 Missing colour selector

`Product.colors` exists and the add-to-bag handler hardcodes `product.colors[0]`.
Any product with more than one colourway is unbuyable in its other colours.
**Spec:** a swatch row directly beneath the size grid, matching its cell
geometry and selected-state treatment. Flagged as a functional gap, not a
visual one — it needs a cart-path regression check.

### 8.5 Related rail

`SUGGESTED DROPS` header at `font-headline font-black text-5xl md:text-7xl`,
`VIEW ALL` link at `text-xs tracking-[0.3em]`, over the §4.4 grid. The `mt-72`
separation above it is retained — it is the one place in the product section
already hitting the negative-space target.

---

## 9. Responsive behaviour

| | 390 | 768 | 1440 |
|---|---|---|---|
| Grid columns | 1 | 2 | 4 |
| Page gutter | `px-6` | `px-12` | `px-12` |
| Related rail | 2 | 2 | 4 |
| Tile name | `text-lg` | `text-lg` | `text-lg` |
| Hover effects | none (coarse pointer) | none | all |
| Detail layout | stacked | stacked | 7/5 split, sticky panel |

At 390 a single-column grid of `aspect-[4/5]` tiles is intentional: the tile
becomes a full-width editorial plate, which is the mobile expression of the
AURA band.

---

## 10. Accessibility and performance rules

1. Never use `primary` as a text colour. `on-surface-primary` for wine text,
   `on-surface` for body, `on-surface-variant` for muted.
2. Every tile link carries an accessible name including sold-out state.
3. The hover CTA is `aria-hidden` and not focusable.
4. `sizes` must be updated with any column-count change — §5.2.
5. `priority` covers exactly the first row, never more.
6. Hit targets at 44px minimum; the size grid's `h-16` already clears this.
7. All hover state is `pointer-fine`-gated.
8. Reduced motion neutralizes transform, not opacity.

---

## 11. Deltas from shipped code

Phase 3's work list. Each row is a change, not a description.

| # | Delta | Files |
|---|---|---|
| 11.1 | Grid ladder unified to `1/2/3/4`; `gap-x-12` → `gap-x-6`; `max-w-7xl` dropped from home | page.tsx, ShopResults.tsx |
| 11.2 | `PAGE_SIZE` 6 → 8; home `slice(0,6)` → `slice(0,8)` | ShopResults.tsx, page.tsx |
| 11.3 | Sub-label stays `tagline`; AURA's bulleted `• CATEGORY` line **not** adopted | ProductCard.tsx |
| 11.4 | Hover-reveal CTA added | ProductCard.tsx, globals.css |
| 11.5 | `sizes` breakpoints corrected to match the grid | ProductCard.tsx |
| 11.6 | `priority` `index < 3` → `index < 4` | page.tsx, ShopResults.tsx |
| 11.7 | Name `text-xl` → `text-lg`; price gains `tabular-nums` | ProductCard.tsx |
| 11.8 | Focus-visible ring added to the tile link | ProductCard.tsx |
| 11.9 | Reduced-motion block extended to lift, image scale, CTA scale | globals.css |
| 11.10 | Badge `text-white` → `text-on-primary` | ProductCard.tsx |
| 11.11 | Shop empty state added | ShopResults.tsx |
| 11.12 | Colour selector added to the info panel | ProductInfoPanel.tsx |
| 11.13 | Related rail regularized to `grid-cols-2 lg:grid-cols-4`, `gap-x-6 gap-y-16` | `products/[slug]/page.tsx` |
| 11.14 | Section padding moved onto the `section` spacing token | page.tsx |

---

## 12. Open decisions

1. **Circle vs. square stamp** for the hover CTA (§6.1) — recommendation is the
   circle as a seal motif; it needs a ruling against the zero-radius lock.
2. **Colour selector** (§8.4) is a functional gap that touches the cart path.
   Confirm it belongs in this phase rather than a separate fix.
3. **`mt-72`** on the related rail (§8.5) is retained on the argument that it
   already meets the negative-space goal. Worth confirming it was deliberate
   rather than inherited.

---

## 13. Exit criteria

- [ ] Grid ladder identical across home, shop and related rail (modulo §4.4)
- [ ] Hover CTA lands with the lift, scale and colour shift on one curve
- [ ] Nothing hover-dependent is reachable on a coarse pointer
- [ ] Keyboard tab through the grid shows a visible ring on every tile
- [ ] Reduced motion kills all transform, keeps opacity
- [ ] `accent` still under 2% of rendered UI
- [ ] Screenshots at 390 / 768 / 1440
- [ ] `/cart` and `/checkout` still render and submit
- [ ] `npm run build` and `npm run lint` clean
