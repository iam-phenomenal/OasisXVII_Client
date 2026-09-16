const { chromium } = require('/home/iam-phenomenal/.nvm/versions/node/v22.14.0/lib/node_modules/@playwright/cli/node_modules/playwright');
const EXE = '/home/iam-phenomenal/.cache/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const BASE = 'http://localhost:3000';
const results = [];
const check = (name, pass, detail) => { results.push({ name, pass, detail }); console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? '  — ' + detail : ''}`); };

const goto = async (page, url) => {
  for (let i = 0; i < 5; i++) {
    const r = await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
    if (r.status() === 200) return;
    await page.waitForTimeout(1500);
  }
  throw new Error('could not load ' + url);
};
const scrollAttempt = async (page, px = 600) => {
  const before = await page.evaluate(() => window.scrollY);
  await page.mouse.wheel(0, px);
  await page.waitForTimeout(900);
  const after = await page.evaluate(() => window.scrollY);
  return { before, after, moved: Math.abs(after - before) > 4 };
};

(async () => {
  const browser = await chromium.launch({ executablePath: EXE });

  // ---- A. Lenis initializes under normal motion ----
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await goto(page, BASE + '/');
    const hasLenis = await page.evaluate(() => document.documentElement.classList.contains('lenis'));
    check('A1 Lenis initializes (html.lenis present)', hasLenis);
    const s = await scrollAttempt(page);
    check('A2 page scrolls normally when unlocked', s.moved, `scrollY ${s.before} -> ${s.after}`);
    await ctx.close();
  }

  // ---- B. Mobile menu locks scroll ----
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 800 } });
    const page = await ctx.newPage();
    await goto(page, BASE + '/');
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(400);
    const btn = page.locator('header button').last();
    await btn.click();
    await page.waitForTimeout(500);
    const menuVisible = await page.locator('nav[aria-label="Mobile navigation"]').isVisible();
    check('B1 mobile menu opens', menuVisible);
    const s = await scrollAttempt(page);
    check('B2 page does NOT scroll behind mobile menu', !s.moved, `scrollY ${s.before} -> ${s.after}`);
    const stopped = await page.evaluate(() => document.documentElement.classList.contains('lenis-stopped'));
    check('B3 Lenis reports stopped', stopped);
    // Close via the scrim. The header's close button renders *under* the z-40
    // scrim (MobileMenu is inside header.z-50, so the scrim wins the stacking
    // context) — a click there lands on the scrim regardless. Logged as a
    // finding; the scrim's onClick is the same close path a real tap hits.
    await page.locator('header button').last().click({ force: true });
    await page.waitForTimeout(600);
    const s2 = await scrollAttempt(page);
    check('B4 scrolling restored after menu closes', s2.moved, `scrollY ${s2.before} -> ${s2.after}`);
    await ctx.close();
  }

  // ---- C. Dialog locks scroll, and D. stacking ----
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 800 } });
    const page = await ctx.newPage();
    await goto(page, BASE + '/products/oasis-shirt');
    const trigger = page.getByRole('button', { name: /size guide/i }).first();
    await trigger.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await trigger.click();
    await page.waitForTimeout(600);
    const dlgVisible = await page.locator('[role="dialog"]').isVisible();
    check('C1 size-guide dialog opens', dlgVisible);
    const s = await scrollAttempt(page);
    check('C2 page does NOT scroll behind dialog', !s.moved, `scrollY ${s.before} -> ${s.after}`);

    // D. Stacking. Close the dialog first, then stack in the order a user can
    // actually reach: mobile menu FIRST, then the size guide. (Opening the menu
    // on top of the dialog is not reachable — the click lands on the dialog's
    // scrim and closes it. The reverse order works only because the menu scrim
    // is 64px tall, see findings.)
    await page.keyboard.press('Escape');
    await page.waitForTimeout(600);

    await page.locator('header button').last().click();
    await page.waitForTimeout(500);
    const menuUp = await page.locator('nav[aria-label="Mobile navigation"]').isVisible();
    const trigger2 = page.getByRole('button', { name: /size guide/i }).first();
    await trigger2.click();
    await page.waitForTimeout(700);
    const bothUp = menuUp && await page.locator('[role="dialog"]').isVisible();
    check('D1 menu + dialog can both be open (ref count = 2)', bothUp);
    const sStack = await scrollAttempt(page);
    check('D2 no scroll with both overlays open', !sStack.moved, `scrollY ${sStack.before} -> ${sStack.after}`);

    // Close ONLY the dialog. The menu still holds the lock, so it must stay locked.
    await page.keyboard.press('Escape');
    await page.waitForTimeout(700);
    const menuStill = await page.locator('nav[aria-label="Mobile navigation"]').isVisible();
    const sInner = await scrollAttempt(page);
    check('D3 lock HOLDS when inner overlay closes but menu remains',
      !sInner.moved && menuStill, `menu open: ${menuStill}, scrollY ${sInner.before} -> ${sInner.after}`);

    // Close the menu — nothing left holding the lock.
    await page.locator('header button').last().click({ force: true });
    await page.waitForTimeout(700);
    const sFree = await scrollAttempt(page);
    check('D4 scrolling restored once all overlays closed', sFree.moved, `scrollY ${sFree.before} -> ${sFree.after}`);
    await ctx.close();
  }

  // ---- E. Reduced motion: no Lenis at all ----
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await goto(page, BASE + '/');
    const hasLenis = await page.evaluate(() => document.documentElement.classList.contains('lenis'));
    check('E1 Lenis does NOT initialize under reduced motion', !hasLenis);
    const s = await scrollAttempt(page);
    check('E2 native scrolling still works under reduced motion', s.moved, `scrollY ${s.before} -> ${s.after}`);
    await ctx.close();
  }

  await browser.close();
  const failed = results.filter(r => !r.pass);
  console.log(`\n${results.length - failed.length}/${results.length} passed`);
  if (failed.length) { console.log('FAILED: ' + failed.map(f => f.name).join(', ')); process.exit(1); }
})();
