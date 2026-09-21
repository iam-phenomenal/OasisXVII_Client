# Oasis XVII — Redesign Plan

Working documents for the redesign. Each phase is its own file and its own
checkpoint. Read this file first: it holds the direction lock that every phase
is bound to.

| Phase | File | Skill | Checkpoint |
|---|---|---|---|
| 0 | [phase-0-foundations.md](phase-0-foundations.md) | — | no |
| 1 | [phase-1-audit.md](phase-1-audit.md) | `/redesign-existing-projects` | **yes** |
| 2 | [phase-2-direction.md](phase-2-direction.md) | `/design-taste-frontend` | **yes — critical** |
| 3 | [phase-3-build.md](phase-3-build.md) | `/impeccable` | yes |
| 4 | [phase-4-craft.md](phase-4-craft.md) | `/emil-design-eng` | yes |
| 5 | [phase-5-verify.md](phase-5-verify.md) | `/redesign-existing-projects` | **yes** |

The ordered, file-level execution script for all six phases — with this
session's rulings baked in — is [implementation-plan.md](implementation-plan.md).
Read it after this file and before any phase doc.

### Component specs

Cross-phase specs that individual phases build against.

| Spec | File | Consumed by |
|---|---|---|
| Product section | [product-section.md](product-section.md) | Phase 2 (grid tokens), Phase 3 (build) |

---

## Direction lock

**Keep** the wine-noir identity: `#0F0F14` void, deep wine `#4A0F27`, neon
`#FF2D6F` used sparingly, Bodoni Moda serif, the "EST. XVII / built for the
void" voice, zero-radius geometry.

**Adopt from the AURA reference** — structure, not skin: counter preloader,
oversized wordmark as a layout element, image punched through type, editorial
4-up grid, tighter tracking, substantially more negative space.

This paragraph is the contract. Every phase conforms to it rather than
re-deriving its own direction. All four skills are independently opinionated;
without a single written lock, each one overwrites the last one's taste. That
is the entire reason for the sequencing.

---

## Scope

**In:** `/`, `/shop`, `/products/[slug]`, the shell (Navbar, MobileMenu,
Footer, NewsletterForm, SocialRow, Dialog, Button), and the policy/utility
routes (`/privacy`, `/terms`, `/shipping`, `/refund`,
`/order-confirmation`, `error.tsx`, `not-found.tsx`).

**Out:** `/cart` and `/checkout` — 1,017 lines of revenue-critical flow, not
redesigned. They still inherit shell and token changes, so they are **out of
design scope but not out of risk scope** and are regression-checked in every
phase.

---

## Stack facts that constrain the work

- Next.js 16.2.4 / React 19.2.5 / Tailwind v4 via the legacy `@config` bridge
  to `tailwind.config.ts`
- **Zero UI/animation dependencies today** — all motion is hand-rolled CSS in
  `src/app/globals.css`
- 10 routes, 3,425 lines of TSX
- Content is backend-driven: hero images, headline and subheading come from a
  settings API at `API_URL` (`https://api.oasisxvii.xyz`, verified reachable).
  The hero cannot be hardcoded.

## Verification standard

Every phase ends with, at 390 / 768 / 1440 widths:

```
npm run build
npm run lint
```

plus Playwright screenshots against `next dev` with the live API, and a
regression pass confirming `/cart` and `/checkout` still render and submit.
