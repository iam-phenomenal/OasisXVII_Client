# Phase 4 — Craft

**Skill:** `/emil-design-eng`
**Checkpoint:** yes.

The narrowest scope and the final pass: the invisible details, and the motion
layer the whole dependency choice was made for.

---

## Motion

**Replace the hand-rolled reveal system.** `.animate-reveal` plus the nine
hardcoded `.stagger-1..9` classes and `useIntersectionObserver` become proper
orchestration with `motion`. Delete the CSS once nothing references it.

Decisions this phase owns:

- **Spring vs. duration** per interaction — springs for anything
  gesture-driven or interruptible, duration curves for entrances
- **Interruptibility** — an animation the user can interrupt mid-flight
  beats one that must finish
- **Exit transitions** — currently nothing animates out anywhere
- **The Lenis feel** — inertia and easing tuned, not left at defaults
- **Preloader choreography** — the counter's exit into the hero is the first
  thing anyone sees

## Detail

- Focus states across every interactive element — the shell especially
- Hover states, noting `globals.css` already defines a `pointer-fine` custom
  variant to keep hover off touch devices; use it
- Loading and empty states: empty cart, no search results in `ShopResults`,
  sold-out via `isSoldOut.ts`, and the `error.tsx` / `not-found.tsx` pair
- Image loading — `getSafeImageUrl.ts` and the `priority` flags on
  above-the-fold product cards

## Reduced motion

Everything added here needs the Phase 0 treatment: `motion` transitions gated,
Lenis absent, no orchestration. Verify by toggling the OS setting, not by
reading the code.

## Exit criteria

- [ ] `.animate-reveal` and `.stagger-*` removed from `globals.css`
- [ ] Reveal, stagger and exit transitions run through `motion`
- [ ] Lenis tuned
- [ ] Focus, hover, loading and empty states complete
- [ ] Reduced-motion verified live
- [ ] Build and lint clean
