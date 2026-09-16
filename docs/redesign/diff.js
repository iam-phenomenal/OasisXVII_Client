// Pixel-diff two screenshot directories captured by capture.js.
//   node docs/redesign/diff.js docs/redesign/baseline docs/redesign/shots/phase-1
// Reports, per route/width, the share of pixels differing by more than a small
// per-channel tolerance (JPEG-ish encoding noise and font AA are not drift).
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const [, , A, B] = process.argv;
const TOLERANCE = 8;      // per-channel 0-255
const REPORT_AT = 0.001;  // 0.1% of pixels

(async () => {
  const names = fs.readdirSync(A).filter(f => f.endsWith('.png')).sort();
  let worst = 0;
  const rows = [];
  for (const name of names) {
    const bPath = path.join(B, name);
    if (!fs.existsSync(bPath)) { rows.push([name, 'MISSING in ' + B]); continue; }
    const a = sharp(path.join(A, name));
    const b = sharp(bPath);
    const [ma, mb] = await Promise.all([a.metadata(), b.metadata()]);
    if (ma.width !== mb.width || ma.height !== mb.height) {
      rows.push([name, `SIZE ${ma.width}x${ma.height} -> ${mb.width}x${mb.height}`]);
      worst = 1;
      continue;
    }
    const [ra, rb] = await Promise.all([
      a.raw().toBuffer(), b.raw().toBuffer(),
    ]);
    let diff = 0;
    for (let i = 0; i < ra.length; i++) if (Math.abs(ra[i] - rb[i]) > TOLERANCE) diff++;
    const frac = diff / ra.length;
    if (frac > worst) worst = frac;
    rows.push([name, frac > REPORT_AT ? `DRIFT ${(frac * 100).toFixed(2)}%` : `ok ${(frac * 100).toFixed(3)}%`]);
  }
  for (const [n, r] of rows) console.log(`${n.padEnd(22)} ${r}`);
  console.log(`\nworst: ${(worst * 100).toFixed(2)}%`);
})();
