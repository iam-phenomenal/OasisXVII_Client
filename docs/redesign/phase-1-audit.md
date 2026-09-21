# Phase 1 — Audit and mechanical cleanup

**Skill:** `/redesign-existing-projects`
**Mode:** audit **and apply**.
**Checkpoint:** yes — review `design-audit.md` before Phase 2.

This skill is purpose-built for existing codebases, so it goes first and its
output becomes the shared input for every phase after. It owns the
"don't break functionality" guarantee at this end of the plan; Phase 5 closes
the loop at the other end.

The split of responsibility is deliberate: this phase lands **mechanical**
fixes that are true regardless of the final direction. Anything requiring a
taste judgement waits for the Phase 2 spec.

---

## Part A — Audit

Produce `docs/redesign/design-audit.md`. Known targets going in:

- **Token sprawl** in `tailwind.config.ts` — eleven surface tokens
  (`surface-container-lowest` through `surface-bright`) plus a parallel wine
  family. Establish which are actually used and consolidate.
- **The hand-rolled reveal system** — `.animate-reveal` plus nine hardcoded
  `.stagger-1..9` classes driven by `useIntersectionObserver`. Works, but is
  the main thing `motion` should replace in Phase 4.
- **Render-blocking icon font** — `src/app/layout.tsx` pulls Material Symbols
  from a Google Fonts stylesheet in `<head>`, blocking first paint on a
  third-party request, for an icon set the design may not keep.
- **Inline arbitrary values** — e.g. the hero's
  `drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)]` in `src/app/page.tsx`. Hoist to
  tokens.
- **Generic-AI patterns** in the current composition — the skill's core
  competency. Let it report freely here.

### Cart and checkout: regression risk only

`CartClient.tsx` (297 ln) and `CheckoutClient.tsx` (720 ln) are audited
**only** for what token and shell changes might break. No design findings, no
redesign suggestions — they are out of scope this round.

Check specifically: token renames that break styles, changes to
`Button`/`Dialog`, the scroll-lock/Lenis interaction, and that form validation
states still render.

## Part B — Apply

Only changes that are correct under any final direction:

- Delete the dead CSS confirmed in Phase 0
- Consolidate the surface token set to what is demonstrably used
- Hoist arbitrary values to named tokens
- Resolve the Material Symbols blocking load

**Not** in this phase: type scale, spacing rhythm, colour relationships,
layout. Those are Phase 2's call and applying them here would pre-empt the
direction.

## Exit criteria

- [ ] `design-audit.md` written and reviewed by you
- [ ] Mechanical fixes applied, behaviour unchanged
- [ ] Cart/checkout regression risks documented
- [ ] Build, lint, and Playwright screenshots show no visual drift yet
