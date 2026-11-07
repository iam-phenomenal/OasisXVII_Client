const { chromium } = require('/home/iam-phenomenal/.nvm/versions/node/v22.14.0/lib/node_modules/@playwright/cli/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const OUT = process.argv[2];
const BASE = 'http://localhost:3000';
const WIDTHS = (process.env.WIDTHS || '320,390,768,1440').split(',').map(Number);
// Checkout redirects to /cart when the bag is empty, so without a seeded cart
// the checkout shots are really cart shots. CART_SEED is the JSON array that
// CartContext stores under `oasisxvii-cart`.
const CART_SEED = process.env.CART_SEED || null;
const ROUTES = [
  ['home', '/'],
  ['shop', '/shop'],
  ['product', '/products/oasis-shirt'],
  ['cart', '/cart'],
  ['checkout', '/checkout'],
  ['privacy', '/privacy'],
  ['terms', '/terms'],
  ['shipping', '/shipping'],
  ['refund', '/refund'],
  ['not-found', '/this-route-does-not-exist'],
].filter(([name]) => !process.env.ROUTES || process.env.ROUTES.split(',').includes(name));

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ executablePath: '/home/iam-phenomenal/.cache/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell' });
  const results = [];
  for (const w of WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, deviceScaleFactor: 1 });
    if (CART_SEED) {
      await ctx.addInitScript(seed => { localStorage.setItem('oasisxvii-cart', seed); }, CART_SEED);
    }
    const page = await ctx.newPage();
    const errors = [];
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    for (const [name, route] of ROUTES) {
      let status = 'ERR';
      for (let attempt = 1; attempt <= 4; attempt++) {
        try {
          const r = await page.goto(BASE + route, { waitUntil: 'networkidle', timeout: 60000 });
          status = r ? r.status() : 'null';
          if (status === 500 && attempt < 4) { await page.waitForTimeout(1500); continue; }
          // HeroSlideshow rotates every 4s, so the hero image is whatever
          // happens to be showing when the shutter fires — a 10-15% pixel diff
          // between two runs of identical code. Pin slide 0. `!important` in a
          // stylesheet outranks the component's inline opacity/z-index.
          await page.addStyleTag({ content: `
            .absolute.inset-0.z-0 > img { opacity: 0 !important; z-index: 0 !important; }
            .absolute.inset-0.z-0 > img:first-of-type { opacity: 1 !important; z-index: 2 !important; }
          ` });

          await page.waitForTimeout(600);
          // Trigger every IntersectionObserver-driven .animate-reveal on the page.
          // fullPage screenshots do not scroll, so without this everything below
          // the fold captures at opacity 0.
          await page.evaluate(async () => {
            const step = Math.floor(window.innerHeight * 0.8);
            for (let y = 0; y < document.body.scrollHeight; y += step) {
              window.scrollTo(0, y);
              await new Promise(r => setTimeout(r, 220));
            }
            window.scrollTo(0, document.body.scrollHeight);
            await new Promise(r => setTimeout(r, 500));
            window.scrollTo(0, 0);
            await new Promise(r => setTimeout(r, 400));
          });
          // Images occasionally fail from the CDN. A broken image is a
          // several-percent pixel diff that looks exactly like real visual
          // drift, so treat it as a failed attempt and retry rather than
          // recording it.
          const broken = await page.evaluate(() =>
            [...document.images].filter(i => !i.complete || i.naturalWidth === 0).length);
          if (broken && attempt < 4) {
            status = `${status} [${broken} broken images, retrying]`;
            console.log(`${String(w).padEnd(5)} ${name.padEnd(12)} ${status}`);
            await page.waitForTimeout(1500);
            continue;
          }

          const hidden = await page.evaluate(() =>
            [...document.querySelectorAll('.animate-reveal')].filter(
              el => getComputedStyle(el).opacity !== '1').length);
          // Any horizontal overflow means the page scrolls sideways on a phone.
          const overflow = await page.evaluate(() =>
            document.documentElement.scrollWidth - window.innerWidth);
          await page.screenshot({ path: path.join(OUT, `${name}-${w}.png`), fullPage: true });
          if (hidden) status = status + ` [${hidden} still hidden]`;
          if (broken) status = status + ` [${broken} BROKEN IMAGES]`;
          if (overflow > 0) status = status + ` [overflow ${overflow}px]`;
          if (attempt > 1) status = status + ` (retry x${attempt})`;
          break;
        } catch (e) {
          status = 'FAIL: ' + e.message.split('\n')[0].slice(0, 80);
          if (attempt < 4) await page.waitForTimeout(1500);
        }
      }
      results.push(`${String(w).padEnd(5)} ${name.padEnd(12)} ${status}`);
      console.log(results[results.length - 1]);
    }
    if (errors.length) console.log(`  [${w}] console errors: ${[...new Set(errors)].slice(0,5).join(' | ').slice(0,300)}`);
    await ctx.close();
  }
  await browser.close();
})();
