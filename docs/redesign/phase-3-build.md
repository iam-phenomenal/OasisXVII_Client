# Phase 3 — Build

**Skill:** `/impeccable`
**Checkpoint:** yes — per surface, not just at the end.

Implements the approved Phase 2 spec across the in-scope routes, using live
browser iteration against `next dev` and the Playwright CLI with the live API.

**This phase conforms to the spec. It does not re-derive direction.** If
something in the spec does not survive contact with a real page, that is a
finding to raise and amend in Phase 2's document — not a licence to improvise.

---

## Order

Chrome stabilizes before the pages that inherit it:

**1. Shell** — `Navbar` (130), `MobileMenu` (70), `Footer` (99),
`NewsletterForm` (118), `SocialRow` (48), `Dialog` (151), `Button` (35).

Note `NewsletterForm.tsx` and `SocialRow.tsx` are currently untracked, as are
`src/lib/email.ts` and `src/lib/social.ts` — this is unfinished work, so
confirm intended behaviour before restyling.

**2. Home** — `src/app/page.tsx` (106) + `HeroSlideshow` (105) +
`RevealSection` (30). The wordmark hero and preloader land here.

**3. Shop** — `src/app/shop/page.tsx` (53) + `ShopCatalog` (20) +
`ShopResults` (89) + `SortDropdown` (75) + `ProductCard` (94).

**4. Product** — `src/app/products/[slug]/page.tsx` (82) +
`ProductInfoPanel` (253) + `ImageGallery` (66) + `VintageTag` (34).

**5. Policy and utility** — `PolicyLayout` (135) +
`PolicyTableOfContents` (68), `order-confirmation` (176), `error.tsx` (29),
`not-found.tsx` (26). Mostly typographic; cheap once the type scale is set.

## Motion is deferred

Layout and hierarchy get settled first, so Phase 4 applies motion to a finished
composition instead of tuning it twice. Use static states here. The existing
`.animate-reveal` / `.stagger-*` system stays in place until Phase 4 replaces
it wholesale.

## Exit criteria

- [ ] All five surface groups match the Phase 2 spec
- [ ] Playwright screenshots at 390 / 768 / 1440 for each
- [ ] Keyboard navigation and focus order intact across the shell
- [ ] Cart and checkout render and submit correctly
- [ ] Build and lint clean
