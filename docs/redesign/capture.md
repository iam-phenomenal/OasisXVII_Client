# Screenshot capture

[capture.js](capture.js) is the verification harness from
[implementation-plan.md](implementation-plan.md) §2.2. Every phase captures with
**this same script** — a screenshot taken any other way is not comparable to the
baseline.

```bash
# dev server must already be running with node on PATH
node docs/redesign/capture.js docs/redesign/baseline      # phase 0 baseline
node docs/redesign/capture.js docs/redesign/shots/phase-3 # any later phase
```

10 routes x 390 / 768 / 1440.

## Why it scrolls before it shoots

`fullPage: true` does **not** scroll the page. The site reveals content with
`.animate-reveal` + `useIntersectionObserver`, which starts every section below
the fold at `opacity: 0`. A naive full-page screenshot therefore captures the
hero and the footer with a black void between them — the first baseline run
here did exactly that.

The script scrolls the viewport top to bottom in 80%-height steps, returns to
the top, then shoots. It also counts any `.animate-reveal` element still below
`opacity: 1` at capture time and appends `[N still hidden]` to that row, so a
silent failure of the reveal system shows up in the run log rather than in a
picture nobody re-checks.

**Phase 4 replaces the reveal system with `motion`.** When it does, re-verify
that this scroll pass still triggers the new orchestration, and update the
`.animate-reveal` selector in the hidden-element check.

## Retries

Routes backed by the settings/catalog API intermittently 500 on a cold socket
(see design-audit.md). The script retries a 500 up to four times and marks the
row `(retry xN)`. A row that still reads 500 after four attempts is a real
failure, not flake.

## Environment

- Node is not on PATH; see the `node` skill. Turbopack spawns a pooled node
  process for the PostCSS transform and needs `node` **on PATH**, not just an
  absolute-path invocation:
  `PATH="/home/iam-phenomenal/.nvm/versions/node/v22.14.0/bin:$PATH"`
- A stale `.next/` from another branch makes dev fail with a Turbopack panic
  (`spawning node pooled process`). `rm -rf .next` clears it.
- Chromium comes from the globally installed `@playwright/cli`; the executable
  path is pinned in the script because the bundled playwright build otherwise
  looks for a browser revision that is not installed.
