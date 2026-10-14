// Renders public/og.png (1200x630) and public/apple-touch-icon.png (180x180) from the curl mark.
// Run: node scripts/brand-assets.mjs   (needs Chrome at /usr/bin/google-chrome)
import { chromium } from 'playwright';
import { readFileSync, mkdirSync } from 'node:fs';

const mark = readFileSync(new URL('../src/components/Mark.astro', import.meta.url), 'utf8').match(/<path d="([^"]+)"/)[1];
const small = readFileSync(new URL('../public/favicon.svg', import.meta.url), 'utf8').match(/<path d="([^"]+)"/)[1];
const svg = (d, size, color) => `<svg width="${size}" height="${size}" viewBox="0 0 48 48" fill="${color}"><path d="${d}"/></svg>`;

const og = `<html><body style="margin:0;width:1200px;height:630px;background:#f3f6f6;color:#10232a;font-family:system-ui,-apple-system,'Segoe UI',sans-serif;display:flex;flex-direction:column;justify-content:center;padding:0 96px;box-sizing:border-box">
<div style="display:flex;align-items:center;gap:20px;font-size:40px;font-weight:650">${svg(mark, 72, '#c4532b')}Azizam</div>
<div style="margin-top:48px;font-size:84px;line-height:1.05;font-weight:750;letter-spacing:-.02em;max-width:980px"><span style="color:#c4532b">Your own</span> AI gateway, shared on your terms.</div>
<div style="margin-top:36px;font-size:30px;color:#3d4f55">Self-hosted. One address, a key and a plan for everyone.</div>
</body></html>`;
const touch = `<html><body style="margin:0;width:180px;height:180px;background:#f3f6f6;display:grid;place-items:center">${svg(small, 140, '#c4532b')}</body></html>`;

const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox'] });
try {
  mkdirSync(new URL('../public', import.meta.url), { recursive: true });
  for (const [html, width, height, file] of [[og, 1200, 630, 'og.png'], [touch, 180, 180, 'apple-touch-icon.png']]) {
    const page = await browser.newPage({ viewport: { width, height } });
    await page.setContent(html);
    await page.screenshot({ path: new URL(`../public/${file}`, import.meta.url).pathname });
    await page.close();
  }
} finally { await browser.close(); }
