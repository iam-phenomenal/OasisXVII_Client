# Phase 0 — Foundations

**Skill:** none — plain engineering.
**Checkpoint:** no. Rolls straight into Phase 1.
**Goal:** install the motion stack and resolve its integration hazards *before*
any design work, so that later phases never have to debug infrastructure while
also making taste decisions.

```
npm i motion lenis
```

---

## Hazard 1 — Lenis breaks the existing scroll lock

`src/lib/scrollLock.ts` is a ref-counted lock that works by setting:

```js
document.body.style.overflow = "hidden";
```

Lenis drives scrolling itself on a rAF loop and **ignores `overflow: hidden`
entirely**. Once Lenis is installed, opening the mobile menu or any dialog will
let the page keep scrolling behind the overlay.

**Fix:** extend the existing counter to also drive Lenis, preserving the paired
lock/unlock discipline the file already documents:

- `lockScroll()` → on `0 → 1` transition, also `lenis.stop()`
- `unlockScroll()` → on `1 → 0` transition, also `lenis.start()`

The ref count matters: overlays stack (mobile menu + dialog can both be open),
so the Lenis call must fire only on the outermost transition, exactly as the
overflow write already does.

**Consumers to re-verify:** `src/components/layout/MobileMenu.tsx`,
`src/components/ui/Dialog.tsx`.

## Hazard 2 — Reduced-motion must reach the JS layer

`globals.css` already has a `prefers-reduced-motion: reduce` block that
neutralizes the reveal and dialog animations. The CSS half is done; the JS half
is not.

**Fix:** do not initialize Lenis at all under reduced-motion, and gate
`motion`'s transitions on the same query. A user with the OS setting on should
get native scrolling and no orchestration — not a shorter animation.

## Hazard 3 — Preloader vs. server-driven content

The counter preloader runs at first paint, but the hero's images, headline and
subheading are fetched from the settings API. A fixed timer will flash
unstyled or half-loaded content on slow connections.

**Fix:** gate the preloader's exit on actual readiness — fonts loaded *and*
first hero image decoded — with a timeout ceiling as a floor-guarantee, not as
the primary mechanism.

---

## Decisions already made

**Tailwind stays on the `@config` bridge.** Migrating to v4's CSS-first
`@theme` would be cleaner, but it renames every color utility across 3,425
lines *including the out-of-scope checkout*. Not worth the blast radius. Token
work happens in `tailwind.config.ts`.

**Dead CSS to delete, not redesign.** Verified zero usages across `src/`:

| Rule | Location | Usages |
|---|---|---|
| `.primary-gradient` | `globals.css` | 0 |
| `.text-glow-accent` | `globals.css` | 0 |

## Exit criteria

- [ ] `motion` and `lenis` installed
- [ ] Scroll lock drives Lenis on the ref-count boundary
- [ ] Mobile menu and dialog confirmed non-scrollable behind overlay
- [ ] Lenis does not initialize under reduced-motion
- [ ] Dead CSS removed
- [ ] `npm run build` and `npm run lint` clean
