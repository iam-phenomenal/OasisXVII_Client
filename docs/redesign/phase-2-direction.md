# Phase 2 — Direction and tokens

**Skill:** `/design-taste-frontend`
**Checkpoint:** **yes — this is the critical one.**

The highest-leverage approval point in the plan. Approving a direction here is
far cheaper than rejecting built pages in Phase 3.

**Scope: the system only. No pages.** This phase produces the vocabulary that
Phase 3 builds with.

---

## Inputs

1. The direction lock in [README.md](README.md) — non-negotiable
2. `design-audit.md` from Phase 1
3. The AURA screenshots, as **structural** reference only

The skill's anti-slop pre-flight is the right gate for a "must not look
templated" brief. Let it run that check against the lock, not against a blank
page — it is inferring a direction for an existing brand, not inventing one.

## Deliverables

**A written design spec** covering:

- **Type scale** — Bodoni Moda stays the display serif. Resolve the current
  four-family load (Bodoni Moda / Epilogue / Space Grotesk / Inter) — that is
  a lot of font weight for one site, and the audit should say whether all four
  earn their place.
- **Spacing rhythm** — the current `section: 8.5rem` / `block: 0.7rem` pair is
  the whole system. The "substantially more negative space" goal lives here.
- **Consolidated tokens** — the surviving surface set, the wine family, and
  where neon `#FF2D6F` is permitted. The existing config caps it at
  "<2% of UI"; keep a hard rule of that kind.
- **Grid** — the editorial 4-up from the reference, and how it degrades at 768
  and 390.
- **The wordmark concept** — oversized wordmark as layout element with image
  punched through type. This is the signature move of the redesign; it needs
  to work with a *server-driven* hero image, not a fixed asset.
- **The preloader** — counter treatment, and its readiness contract from
  Phase 0 hazard 3.

**A rewritten `tailwind.config.ts`** implementing the above.

## Constraint

Every token change is checked against `/cart` and `/checkout` before it lands.
They are not being redesigned, but they consume these tokens.

## Exit criteria

- [ ] Design spec written
- [ ] `tailwind.config.ts` rewritten
- [ ] **You have approved the direction in writing**
- [ ] Cart/checkout still render correctly under the new tokens
- [ ] Build and lint clean
