# Phase 0 — findings

Pre-existing defects found while installing the motion stack. **None was
introduced by Phase 0**, and none is fixed by it. They are inputs to the
Phase 1 audit.

---

## F1 — The mobile menu scrim covers the header, not the page

**Severity: high. User-facing.**

[MobileMenu.tsx](../../../src/components/layout/MobileMenu.tsx) renders its
scrim as `fixed inset-0 z-40`, intending a full-viewport overlay. Measured at
390x800, the scrim is **390x64**.

The cause is in [Navbar.tsx:65](../../../src/components/layout/Navbar.tsx#L65):
`MobileMenu` renders *inside* `<header className="... backdrop-blur-nav ...">`,
and `backdrop-filter` makes an element a **containing block for
`position: fixed` descendants**. The scrim's `inset: 0` therefore resolves
against the header's 65px box instead of the viewport.

Consequences:

1. The page behind the open menu is **not dimmed at all** — only the header
   strip is.
2. **Tap-outside-to-close only works in the top 64px.** Everywhere else the tap
   goes to the page underneath.
3. The close button and the cart icon are the only things *under* the scrim, so
   they render washed out at 80% opacity — visible in
   [mobile-menu-open-390.png](mobile-menu-open-390.png). `elementFromPoint` at
   the close button's centre returns the scrim, not the button.
4. It makes overlay stacking reachable: with the menu open, the size-guide
   button is **not** covered, so a user can open the dialog on top of the menu.

Note 3 also means a direct Playwright click on the close button is intercepted;
[verify-scroll-lock.js](../verify-scroll-lock.js) uses `force: true` and says
why. A real tap still closes the menu, because it lands on the scrim whose
`onClick` is `onClose` — which is why this has gone unnoticed.

**Not fixed here.** It is shell layout, which is Phase 3's scope. Flagged for
the Phase 1 audit because the fix is mechanical (move `MobileMenu` out of
`<header>`, or portal the scrim) and is true under any final direction.

## F2 — API-backed routes 500 on a cold socket

**Severity: medium. User-facing.**

`/`, `/shop` and `/products/[slug]` intermittently return 500 with
`TypeError: fetch failed` from `apiFetch`
([src/lib/api/client.ts:34](../../../src/lib/api/client.ts#L34)). The API itself
is healthy — 12/12 consecutive `curl` requests returned 200 while the app was
failing.

The pattern is a first-request-after-idle failure, consistent with a stale
keep-alive socket being reused. There is **no retry and no error boundary**
around `apiFetch`, so one dropped socket becomes a 500 for the user.

This is why [capture.js](../capture.js) retries a 500 up to four times. That is
a harness workaround, not a fix.

Relevant to Phase 5's "server-driven content still resolves" criterion and to
Phase 0 hazard 3 — a preloader that gates on a hero image will sit behind this
same failure mode.

## F3 — `/products/[slug]` opts itself out of static generation

**Severity: low. Build-time only.**

Every build logs:

```
Dynamic server usage: Route /products/[slug] couldn't be rendered statically
because it used revalidate: 0 fetch
```

`generateStaticParams` enumerates the slugs, but the page's own fetch uses
`revalidate: 0`, so nothing is prerendered and the route is served `ƒ`
(dynamic) regardless. Either the `generateStaticParams` work is wasted or the
cache policy is wrong; they currently contradict each other.

Not a redesign concern, but it is free performance and the audit should record
it.

---

## Environment note — not a defect

`npm run build` fails **on this machine** with `ETIMEDOUT` while prerendering
`/checkout`. IPv6 is unroutable here (`curl -6` fails in 1.6ms; `curl -4`
succeeds), and Node's default `verbatim` DNS ordering tries the AAAA records
first.

Verified pre-existing: the same failure, with the same digest, reproduces with
every Phase 0 change stashed.

Build and dev therefore run with:

```
NODE_OPTIONS="--dns-result-order=ipv4first"
```

This is local-only. No application code was changed for it, and a production
build on a dual-stack host is unaffected.
