# Implementation Plan

**Status:** approved to write, not approved to execute. Nothing in this file has
been run. It converts the six phase documents into an ordered, file-level
execution plan with the session's rulings baked in.

**Read order:** [README.md](README.md) (direction lock) → this file → the phase
doc for whichever phase is active.

---

## 1. Rulings locked this session

These four answers close open questions in the phase docs. They are binding on
every phase below.

| # | Question | Ruling | Consequence |
|---|---|---|---|
| R1 | Execution cadence | **Plan only.** No phase runs until you say so. | Section 3 is a standing script, not a task list in flight. |
| R2 | AURA reference material | **Work from the written lock alone.** No screenshots. | Phase 2 derives structure from README prose + product-section.md. See §4.1 for the risk this carries. |
| R3 | Material Symbols | **Replace with inline SVG.** | Phase 1 Part B now edits `/cart` and `/checkout`. See §4.2 — this is the largest deviation from the plan's own ring-fence. |
| R4 | Hover CTA shape | **Circle.** Wax-seal / bottle-stamp motif. | product-section.md §6.1 resolved; §12.1 closed. `rounded-full` stays a sanctioned exception to zero-radius. |

### Still open, due at the Phase 2 checkpoint

| # | Question | Source | My recommendation |
|---|---|---|---|
| O1 | Does the colour selector belong in this round? | product-section.md §8.4, §12.2 | **Yes, but as its own commit.** `ProductInfoPanel` hardcodes `product.colors[0]` in the add-to-bag handler, so any multi-colourway product is unbuyable in its other colours. That is a live revenue bug, not a design nicety. Land it in Phase 3 step 4 with an explicit cart-path regression, and revert it independently if it misbehaves. |
| O2 | Is `mt-72` on the related rail deliberate? | product-section.md §8.5, §12.3 | **Keep.** It is the one place already meeting the negative-space goal. Confirm at the Phase 2 checkpoint; if it was inherited rather than chosen, it gets rationalised onto the `section` spacing token instead of deleted. |
| O3 | Which of the four fonts survive? | phase-2-direction.md, phase-5-verify.md Part C | Phase 2 decides. Phase 5 audits that the decision was carried out. Flagged here only because no phase currently *owns* the deletion — Phase 2 rules, **Phase 3 step 1 deletes from `layout.tsx`**. |

---

## 2. Preconditions

Before Phase 0 runs.

### 2.1 Branch

Work happens on `redesign`, cut from `main`. `main` is currently clean apart
from untracked `docs/` and `.playwright-cli/`.

```
git checkout -b redesign
git add docs/ && git commit -m "docs: redesign plan"
```

`.playwright-cli/` should go in `.gitignore` — it is 90 files of local run
artefacts.

One commit per exit-criterion cluster, not one per phase. Phases 1 and 3 are
too large to bisect as single commits.

### 2.2 Verification harness

Every phase ends with the same four checks. Establish them once, now, so
"no visual drift" in Phase 1 has a baseline to compare against.

1. `npm run build` && `npm run lint`
2. Playwright screenshots at **390 / 768 / 1440** against `next dev` with the
   live API (`API_URL=https://api.oasisxvii.xyz`)
3. Cart/checkout regression: both routes render, the checkout form validates,
   and an order submits
4. Scroll-lock check: mobile menu and dialog, individually **and stacked**

**Capture a full baseline screenshot set before Phase 0 touches anything.**
All 10 routes × 3 widths. Without it, Phase 1's "no visual drift yet" exit
criterion is unfalsifiable. Store under `docs/redesign/baseline/`.

### 2.3 API dependency

The hero headline, subheading and images come from the settings API. If it is
unreachable during a phase, screenshots are not evidence and the phase does not
close. Check reachability at the top of each session.

---

## 3. Phase execution

### Phase 0 — Foundations

No skill. No checkpoint. Rolls into Phase 1.

| # | Step | Files |
|---|---|---|
| 0.1 | `npm i motion lenis` | package.json |
| 0.2 | Lenis provider, not initialised under `prefers-reduced-motion: reduce` | new `src/lib/lenis.ts` + wire into `layout.tsx` |
| 0.3 | Extend the ref-counted lock to drive Lenis on the `0→1` and `1→0` transitions only | [src/lib/scrollLock.ts](../../src/lib/scrollLock.ts) |
| 0.4 | Verify overlays: menu alone, dialog alone, both stacked | [MobileMenu.tsx](../../src/components/layout/MobileMenu.tsx), [Dialog.tsx](../../src/components/ui/Dialog.tsx) |
| 0.5 | Delete `.primary-gradient` and `.text-glow-accent` | [globals.css:34-42](../../src/app/globals.css#L34-L42) |
| 0.6 | Preloader readiness contract — **design only, no UI yet** | — |

**On 0.3.** The existing file already documents the pairing discipline and
stores `previousOverflow` on the `0→1` edge. The Lenis calls attach to the same
two edges; do not add a second counter.

**On 0.5.** Verified zero usages across `src/` this session. Safe.

**On 0.6.** Phase 0 hazard 3 wants the preloader gated on fonts-loaded plus
first-hero-image-decoded, with a timeout ceiling as a floor guarantee. The
preloader itself is a Phase 2 design decision and a Phase 3 build. What Phase 0
owns is the *readiness signal* — write the contract down, build it in Phase 3.
Do not ship a preloader here.

**Exit:** build + lint clean, overlays confirmed non-scrollable, Lenis absent
under reduced motion.

---

### Phase 1 — Audit and mechanical cleanup

Skill: `/redesign-existing-projects`, audit **and** apply. **Checkpoint.**

#### Part A — produce `docs/redesign/design-audit.md`

Findings already confirmed this session, to seed the audit rather than
rediscover it:

**Surface token sprawl.** Eleven tokens, counted by utility-prefixed usage
across `src/`:

| Token | Uses |
|---|---|
| `surface-container` | 21 |
| bare `surface` | 27 |
| `surface-container-low` | 5 |
| `surface-container-lowest` | 1 |
| `surface-container-high` | 1 |
| `surface-container-highest` | 1 |
| `surface-dim` | **0** |
| `surface-bright` | **0** |
| `surface-variant` | **0** |
| `surface-tint` | **0** |

Four tokens are dead; three more are load-bearing for a single rule each. A
five-token set (`surface`, `surface-container`, `-low`, `-high`, plus one void
step) covers everything in use. Phase 2 makes the final call; Phase 1 just
reports the numbers.

Note `on-surface-variant` (65 uses) is a **different token** and stays — naive
grep for `surface-variant` conflates them.

**Also audit, per the phase doc:** the `.animate-reveal` + `.stagger-1..9`
system, the four-family font load, inline arbitrary values (e.g. the hero's
`drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)]`), and generic-AI patterns in the
current composition.

**Cart/checkout:** regression risk only. No design findings.

#### Part B — apply

| # | Change | Risk |
|---|---|---|
| 1.1 | Delete dead CSS (already done in 0.5 — verify only) | none |
| 1.2 | Consolidate surface tokens to the demonstrably-used set | low |
| 1.3 | Hoist arbitrary values to named tokens | low |
| 1.4 | **Material Symbols → inline SVG** | **high — see §4.2** |

**Not in this phase:** type scale, spacing rhythm, colour relationships,
layout. Those are Phase 2's.

**Exit:** audit written and reviewed by you; mechanical fixes applied with
behaviour unchanged; screenshots diffed against the §2.2 baseline show no
visual drift *except* the icon swap.

**→ CHECKPOINT. You read `design-audit.md` before Phase 2 starts.**

---

### Phase 2 — Direction and tokens

Skill: `/design-taste-frontend`. **Checkpoint — the critical one.**

System only. No pages.

Inputs are now the direction lock, `design-audit.md`, and
[product-section.md](product-section.md) — **no AURA screenshots** (R2).

Deliverable: a written design spec at `docs/redesign/design-spec.md` covering
type scale, spacing rhythm, consolidated tokens, the grid, the wordmark
concept, and the preloader; plus a rewritten `tailwind.config.ts`.

Two items need explicit attention because R2 removed their reference:

- **"Image punched through type."** The signature move, and the one the lock
  describes least precisely. Phase 2 must produce a concrete mechanism —
  `background-clip: text`, an SVG mask, or a `mix-blend-mode` layer — and note
  that it has to work against a **server-driven** hero image of unknown
  dimensions and unknown subject placement. Not a fixed asset.
- **The counter preloader.** Its numeric treatment plus the Phase 0 hazard-3
  readiness contract.

Every token change is checked against `/cart` and `/checkout` before it lands.

**Exit:** spec written; `tailwind.config.ts` rewritten; **you approve the
direction in writing**; cart/checkout render correctly under the new tokens;
build and lint clean.

**→ CHECKPOINT. Approving a spec here is far cheaper than rejecting built
pages in Phase 3.**

---

### Phase 3 — Build

Skill: `/impeccable`. Checkpoint **per surface**.

Conforms to the Phase 2 spec. Does not re-derive direction. If the spec fails
on contact with a real page, that is an amendment to `design-spec.md`, not a
licence to improvise.

Order — chrome stabilises before what inherits it:

| Step | Surface | Files | Notes |
|---|---|---|---|
| 3.1 | Shell | Navbar, MobileMenu, Footer, NewsletterForm, SocialRow, Dialog, Button | **Also delete the dropped fonts from `layout.tsx` (O3).** |
| 3.2 | Home | page.tsx, HeroSlideshow, RevealSection | Wordmark hero + preloader land here |
| 3.3 | Shop | shop/page.tsx, ShopCatalog, ShopResults, SortDropdown, ProductCard | product-section.md §4, §5, §7 |
| 3.4 | Product | products/[slug]/page.tsx, ProductInfoPanel, ImageGallery, VintageTag | Includes the O1 colour selector, as a separate commit |
| 3.5 | Policy & utility | PolicyLayout, PolicyTableOfContents, order-confirmation, error.tsx, not-found.tsx | Mostly typographic; cheap once the type scale is set |

**The product-section.md §11 delta table is the work list for 3.3 and 3.4.**
Fourteen numbered changes, each naming its files. Work it row by row.

**Motion is deferred.** Static states only. `.animate-reveal` / `.stagger-*`
stay until Phase 4 replaces them wholesale.

**Correction to [phase-3-build.md](phase-3-build.md):** it warns that
`NewsletterForm.tsx`, `SocialRow.tsx`, `src/lib/email.ts` and `src/lib/social.ts`
are untracked unfinished work. They are all committed as of `0bfbaff`. The
warning is stale — but still confirm intended behaviour of the newsletter
submit path before restyling it.

**Exit:** all five groups match the spec; screenshots at three widths for each;
keyboard nav and focus order intact across the shell; cart and checkout render
**and submit**; build and lint clean.

---

### Phase 4 — Craft

Skill: `/emil-design-eng`. Checkpoint.

The narrowest scope, and the reason `motion` and `lenis` were installed in
Phase 0.

**Motion.** Replace `.animate-reveal` + the nine `.stagger-*` classes +
`useIntersectionObserver` with `motion` orchestration. Delete the CSS *and*
[useIntersectionObserver.ts](../../src/hooks/useIntersectionObserver.ts) once
nothing references them. Decisions this phase owns: spring vs. duration per
interaction, interruptibility, exit transitions (nothing animates out anywhere
today), Lenis inertia tuning, and preloader-to-hero choreography.

**Detail.** Focus states everywhere, `pointer-fine`-gated hover, loading and
empty states (empty cart, no-results in `ShopResults`, sold-out via
`isSoldOut.ts`, `error.tsx` / `not-found.tsx`), and image loading via
`getSafeImageUrl` + `priority` flags.

**Reduced motion.** Everything added here gets the Phase 0 treatment. Verify by
toggling the OS setting, not by reading the code.

**Exit:** `.animate-reveal` and `.stagger-*` gone; reveal/stagger/exit run
through `motion`; Lenis tuned; focus, hover, loading and empty states complete;
reduced motion verified live; build and lint clean.

---

### Phase 5 — Verify

Skill: `/redesign-existing-projects`, second run. **Final sign-off.**

**Part A — re-audit.** Run Phase 1's audit against the finished build and diff
against `design-audit.md`. Three questions: was every Phase 1 finding actually
resolved; did the redesign introduce *new* generic-AI patterns; did token
consolidation hold or did Phases 2–4 quietly reintroduce one-off arbitrary
values.

**Part B — regression.** Cart and checkout render, validate and **submit**.
Scroll lock holds with Lenis, stacked and individually. Reduced motion: no
Lenis, no orchestration. Server-driven hero content still resolves, and the
preloader exits correctly on a **cold cache**. All 10 routes at three widths.

**Part C — close out.** No dead CSS or unused tokens reintroduced. The
four-font load resolved as Phase 2 decided (O3). Final build and lint.

---

## 4. Risk register

### 4.1 No visual reference for Phase 2 (from R2)

Working from the lock's prose alone means "image punched through type" and
"oversized wordmark as a layout element" get *my* interpretation, not a matched
one. The lock names the moves but not their proportions.

**Mitigation:** Phase 2 produces the wordmark concept as an explicit written
mechanism plus a static mockup **before** `tailwind.config.ts` is rewritten, so
you are approving a picture at the checkpoint rather than a paragraph. If the
interpretation is wrong, it is wrong at the cheapest possible moment.

**Reversal is cheap** — if you find the AURA screenshots later, drop them in
before the Phase 2 checkpoint and the phase re-runs against them.

### 4.2 Icon migration reaches into the ring-fence (from R3)

This is the plan's sharpest edge. [README.md](README.md) puts `/cart` and
`/checkout` out of design scope precisely because they are 1,017 lines of
revenue-critical flow. R3 requires editing both.

**Inventory — 18 instances, 17 distinct glyphs, 7 files:**

| File | Glyphs |
|---|---|
| [Navbar.tsx](../../src/components/layout/Navbar.tsx) | `arrow_back`, `shopping_cart`, `menu`, `close` |
| [Dialog.tsx](../../src/components/ui/Dialog.tsx) | `close` |
| [SortDropdown.tsx](../../src/components/ui/SortDropdown.tsx) | `expand_more` |
| [ProductInfoPanel.tsx](../../src/app/products/[slug]/ProductInfoPanel.tsx) | `check` |
| [order-confirmation/page.tsx](../../src/app/order-confirmation/page.tsx) | `check_circle`, `cancel`, `schedule`, `error_outline` |
| **[CartClient.tsx](../../src/app/cart/CartClient.tsx)** | `remove`, `add`, `delete`, `credit_card`, `payments`, `wallet`, `shield` |
| **[CheckoutClient.tsx](../../src/app/checkout/CheckoutClient.tsx)** | `expand_more` |

**Approach.** Build `src/components/ui/Icon.tsx` exposing the 17 glyphs as
inline SVG paths, sized via `currentColor` and a `size` prop. There is already
precedent in the codebase: [social.ts](../../src/lib/social.ts) inlines its
brand SVG paths rather than pulling a dependency, and documents why.

**Sequencing — this is the part that matters.** Do it in three commits:

1. Add `Icon.tsx` and migrate the **six in-scope files** (11 instances). Leave
   the stylesheet link in place. Nothing breaks: the two checkout-path files
   still use the font.
2. Migrate **`CartClient.tsx` and `CheckoutClient.tsx`** (8 instances) as an
   isolated, independently revertible commit. `CheckoutClient` is a single
   `expand_more` chevron; `CartClient` is 7 glyphs across quantity controls,
   delete, and the payment-badge row. Full cart→checkout→submit regression
   before this commit is accepted.
3. Only once 1 and 2 are verified: remove the `<link>` from
   [layout.tsx](../../src/app/layout.tsx) and the `.material-symbols-outlined`
   rule from [globals.css:11-25](../../src/app/globals.css#L11-L25).

Do **not** collapse these into one commit. If the checkout regresses, step 2
reverts alone and the render-blocking request still goes away for everyone
else's routes.

**Watch for:** the payment-badge row in `CartClient` (lines 286-289) is four
glyphs in a row with no labels — verify the SVG set keeps their optical sizing
consistent, since Material Symbols normalised it for free.

### 4.3 Four consecutive opinionated skills

Each of `/redesign-existing-projects`, `/design-taste-frontend`, `/impeccable`
and `/emil-design-eng` has its own taste. The direction lock exists to stop each
one overwriting the last. **Every phase re-reads the lock before starting** —
that is the entire reason for the sequencing, and the failure mode if it is
skipped is a design that drifts a little further from the brand at each phase
while every individual phase looks defensible.

Phase 5 Part A question 2 is the backstop.

### 4.4 Token renames vs. the ring-fence

Phase 1 consolidates surface tokens; Phase 2 rewrites the whole config. Both
touch classes used by cart and checkout. The four zero-use tokens are free to
delete. Anything with a non-zero count needs a grep across **all** of `src/`,
including the out-of-scope files, before it is renamed or removed.

### 4.5 Preloader on a cold cache

The counter preloader is the first thing anyone sees, and it gates on content
from an external API. A fixed timer flashes half-loaded content on a slow
connection; a readiness gate with no ceiling hangs forever if the API is down.
The contract from Phase 0 hazard 3 — fonts loaded **and** first hero image
decoded, with a timeout as a *floor guarantee* — must survive into the Phase 3
build. Phase 5 Part B tests it specifically on a cold cache.

---

## 5. Sequencing summary

```
preconditions ──→ P0 ──→ P1 ──┤CHECKPOINT├──→ P2 ──┤CHECKPOINT: CRITICAL├──→
                                                        │
      ┌─────────────────────────────────────────────────┘
      └──→ P3 (5 surfaces, checkpoint each) ──→ P4 ──┤CHECKPOINT├──→
                                                        │
      ┌─────────────────────────────────────────────────┘
      └──→ P5 ──┤FINAL SIGN-OFF├
```

Phase 0 and Phase 1 run continuously. Everything after Phase 1 waits on you.
