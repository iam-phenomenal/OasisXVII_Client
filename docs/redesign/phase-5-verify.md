# Phase 5 — Verify

**Skill:** `/redesign-existing-projects` (second run)
**Checkpoint:** yes — final sign-off.

The bookend. The same skill that audited the codebase in Phase 1 now audits the
finished redesign. It owns the "didn't break anything" guarantee at both ends
of the plan, and it is the only skill here whose competency is specifically
*existing* code rather than new design.

---

## Part A — Re-audit

Run the Phase 1 audit again against the finished build and **diff the findings
against `design-audit.md`**. Three questions:

1. Was every Phase 1 finding actually resolved, or did some get lost across
   four phases?
2. Did the redesign introduce *new* generic-AI patterns? This is the real risk
   after three consecutive taste skills have each pushed the design — the skill
   that flags templated work should get the last look.
3. Did token consolidation hold, or did Phases 2–4 quietly reintroduce
   one-off arbitrary values?

## Part B — Regression

Against the risks catalogued in Phase 1:

- `/cart` and `/checkout` render, validate and **submit** correctly — the only
  end-to-end flow that touches real money
- Scroll lock holds with Lenis: mobile menu and dialog, stacked and
  individually
- Reduced motion: no Lenis, no orchestration
- Server-driven content: hero images, headline and subheading still resolve
  from the settings API, and the preloader exits correctly on a cold cache
- Every route responds: all 10, at 390 / 768 / 1440

## Part C — Close out

- Confirm no dead CSS or unused tokens were reintroduced
- Confirm the four-font load was resolved as Phase 2 decided
- Final `npm run build` and `npm run lint`

## Exit criteria

- [ ] Phase 1 findings all resolved or consciously deferred
- [ ] No new generic-AI patterns
- [ ] Cart and checkout submit successfully
- [ ] All 10 routes verified at three widths
- [ ] Reduced motion verified
- [ ] Build and lint clean
