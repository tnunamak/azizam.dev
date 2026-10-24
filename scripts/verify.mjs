// Site checks. Run `npm run build` first. With no SITE_URL it serves dist/ itself.
// Usage: npm run verify            (ARTIFACT_DIR=... to choose where screenshots go)
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { createServer } from 'node:http';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { loadavg } from 'node:os';
import { extname, join } from 'node:path';
import assert from 'node:assert/strict';

const output = process.env.ARTIFACT_DIR || '.verify-artifacts';
await mkdir(output, { recursive: true });

// Browser runs wait while the machine is busy.
async function waitForQuietMachine(limit = 24) {
  while (loadavg()[0] > limit) {
    console.log(`load ${loadavg()[0].toFixed(1)} is above ${limit}; waiting`);
    await new Promise((resolve) => setTimeout(resolve, 15000));
  }
}

// Serve dist/ with a small static server (no preview daemon to clean up).
const types = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.txt': 'text/plain', '.wasm': 'application/wasm' };
const distDir = new URL('../dist/', import.meta.url).pathname;
let server;
let url = process.env.SITE_URL;
if (!url) {
  server = createServer(async (req, res) => {
    let path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (path.endsWith('/')) path += 'index.html';
    try {
      const file = join(distDir, path);
      assert.ok(file.startsWith(distDir));
      const body = await readFile(file);
      res.writeHead(200, { 'content-type': types[extname(file)] || 'application/octet-stream' }).end(body);
    } catch {
      res.writeHead(404, { 'content-type': 'text/plain' }).end('not found');
    }
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  url = `http://127.0.0.1:${server.address().port}`;
}

const HOME_H1 = 'Your own AI gateway, shared on your terms.';
const SKY_REPLY = "Sunlight entering Earth's atmosphere scatters off air molecules, and shorter blue wavelengths scatter much more strongly than longer red ones (a process called Rayleigh scattering). This scattered blue light is then distributed across the sky in all directions, so no matter where you look, you see blue.";
const ENGINE_NAMES = /litellm|comfyui|llama\.cpp|llama-server|vllm|lm studio|invokeai|stable diffusion webui/i;
// 192.168.1.0/24 is the generic example range in the access-plan docs, not a real host.
const PRIVATE = /vivid\.fish|192\.168\.(?!1\.0\/24)|tnunamak|\.local\b|opk_[a-z0-9]{8,}/i;
const INVENTED = /testimonial|\b\d[\d,.]*k?\+?\s+(users|stars|downloads|customers)\b/i;
const warnings = [];
const summary = [];

// ---- Site-wide checks on the built files -------------------------------------------------
const dist = distDir;
async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) { if (entry.name !== 'pagefind') out.push(...await walk(path)); }
    else if (entry.name.endsWith('.html')) out.push(path);
  }
  return out;
}
const files = await walk(dist);
const pages = new Map(); // url path -> { html, ids }
for (const file of files) {
  const html = await readFile(file, 'utf8');
  const path = '/' + file.slice(dist.length).replace(/index\.html$/, '');
  pages.set(path, { html, ids: new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])) });
}
assert.ok(pages.size >= 37, `Expected at least 37 pages, built ${pages.size}`);
assert.ok(pages.has('/') && pages.has('/examples/') && pages.has('/docs/'), 'Home, Examples and Docs exist');
for (const [path, { html }] of pages) {
  assert.equal([...html.matchAll(/<h1[\s>]/g)].length, 1, `${path}: exactly one h1`);
  assert.match(html, /<meta name="robots" content="noindex, nofollow"/, `${path}: noindex`);
  assert.ok(!/fish/i.test(html.replace(/<path d="[^"]*"/g, '')), `${path}: no fish`);
  const text = html.replace(/<style[\s\S]*?<\/style>|<script[\s\S]*?<\/script>/g, '');
  assert.ok(!PRIVATE.test(text), `${path}: private host or name: ${text.match(PRIVATE)?.[0]}`);
  assert.ok(!INVENTED.test(text), `${path}: invented proof`);
  const engines = text.match(ENGINE_NAMES)?.[0];
  if (engines) assert.ok(path === '/docs/start/install/' && /litellm/i.test(engines), `${path}: engine name "${engines}"`);
  assert.ok(!/git clone/i.test(text), `${path}: no git clone`);
  assert.ok(!/github\.com\/tnunamak\/azizam/i.test(text), path + ': no link to the private gateway repository');
  for (const img of html.matchAll(/<img\b[^>]*>/g)) assert.match(img[0], /\salt=/, `${path}: img without alt`);
}
// Every internal link and anchor resolves.
let links = 0;
for (const [path, { html }] of pages) {
  for (const [, href] of html.matchAll(/<a\b[^>]*\shref="([^"]+)"/g)) {
    if (/^(https?:|mailto:)/.test(href)) continue;
    links++;
    const target = new URL(href, 'https://azizam.dev' + path);
    const page = pages.get(target.pathname);
    assert.ok(page, `${path}: broken link ${href}`);
    if (target.hash) assert.ok(page.ids.has(decodeURIComponent(target.hash.slice(1))), `${path}: missing anchor ${href}`);
  }
}
for (const [path, { html }] of pages) if (path.startsWith('/docs/')) {
  assert.ok(!/href="\/(showcase|openapi\.json|gateway\/)/.test(html), `${path}: link into a live gateway`);
}
const docsCount = [...pages.keys()].filter((p) => p.startsWith('/docs/')).length;
const guideData = JSON.parse(await readFile(new URL('../src/data/app-guides.json', import.meta.url), 'utf8'));
assert.equal(docsCount, 35 + guideData.apps.length + 2, 'Existing docs and generated connection pages are built');
assert.ok((await readdir(join(dist, 'pagefind'))).includes('pagefind.js'), 'Pagefind index exists');
summary.push({ pages: pages.size, docs: docsCount, internalLinksChecked: links });

// ---- Browser checks ----------------------------------------------------------------------
await waitForQuietMachine();
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox'] });
const TAP = 'button, summary, .btn, .site-nav a, .site-disclosure nav a, .brand, .foot-links a, .chips a, .pager a, .docs-menu a, .docs-route-mobile-nav a, .toc-inline a, .search-open, .copy-btn, .code-bar .copy';
const SAMPLES = [
  { name: 'home', path: '/' },
  { name: 'examples', path: '/examples/' },
  { name: 'docs', path: '/docs/' },
  { name: 'docs-page', path: '/docs/concepts/access-plans/' },
  { name: 'docs-install', path: '/docs/start/install/' },
  { name: 'docs-connect', path: '/docs/connect/' },
  { name: 'docs-client', path: '/docs/connect/open-webui/' },
  { name: 'docs-mcp', path: '/docs/mcp/' },
];
const results = [];
try {
  for (const width of [1440, 390]) {
    for (const theme of ['light', 'dark']) {
      await waitForQuietMachine();
      const height = width === 1440 ? 900 : 844;
      const context = await browser.newContext({ viewport: { width, height }, colorScheme: theme, reducedMotion: 'reduce', permissions: ['clipboard-read', 'clipboard-write'] });
      for (const sample of SAMPLES) {
        const page = await context.newPage();
        const errors = [];
        page.on('pageerror', (e) => errors.push(e.message));
        page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
        let bytes = 0;
        page.on('response', async (r) => { try { bytes += (await r.body()).length; } catch {} });
        await page.goto(url + sample.path, { waitUntil: 'networkidle' });
        const label = `${sample.name} ${width} ${theme}`;
        assert.equal(await page.locator('h1').count(), 1, `${label}: one h1`);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${label}: sideways scroll`);
        assert.deepEqual(errors, [], `${label}: console errors`);
        const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
        assert.deepEqual(axe.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })), [], `${label}: axe`);
        // The headings go in order: no level is skipped.
        const levels = await page.locator('h1, h2, h3, h4').evaluateAll((hs) => hs.map((h) => Number(h.tagName[1])));
        levels.forEach((level, i) => { if (i) assert.ok(level <= levels[i - 1] + 1, `${label}: heading order ${levels.join(',')}`); });
        if (width === 390) {
          const small = await page.locator(TAP).evaluateAll((els) => els
            .filter((el) => el.checkVisibility({ contentVisibilityAuto: true, visibilityProperty: true }))
            .map((el) => ({ el: el.outerHTML.slice(0, 60), w: Math.round(el.getBoundingClientRect().width), h: Math.round(el.getBoundingClientRect().height) }))
            .filter((r) => r.w < 44 || r.h < 44));
          assert.deepEqual(small, [], `${label}: tap targets under 44 px`);
        }
        const height1 = await page.evaluate(() => document.documentElement.scrollHeight);
        const record = { sample: sample.name, width, theme, height: height1, kb: Math.round(bytes / 1024) };
        if (sample.name === 'home') {
          assert.equal((await page.locator('h1').innerText()).replace(/\s+/g, ' '), HOME_H1);
          assert.equal(await page.locator('h1 .accent-words').innerText(), 'Your own');
          const words = (await page.locator('main').innerText()).split(/\s+/).filter(Boolean).length;
          assert.ok(words >= 350 && words <= 1100, `${label}: ${words} words`);
          assert.ok(height1 <= (width === 1440 ? 6000 : 9000), `${label}: page height ${height1}`);
          assert.ok(bytes <= 400 * 1024, `${label}: ${bytes} bytes`);
          const inFirstScreen = await page.locator('h1, [data-cta]').evaluateAll((els) => els.map((el) => el.getBoundingClientRect().bottom <= innerHeight));
          assert.equal(inFirstScreen.length, 3);
          assert.ok(inFirstScreen.every(Boolean), `${label}: h1 and both CTAs in the first screen`);
          if (width === 1440) assert.ok(await page.locator('.proof-card').evaluate((el) => el.getBoundingClientRect().bottom <= innerHeight), `${label}: proof card in the first screen`);
          assert.equal(await page.locator('[data-cta]').count(), 2);
          assert.match(await page.locator('.proof-exchange').innerText(), new RegExp(SKY_REPLY.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
          assert.match(await page.locator('.proof-meta').innerText(), /Ran in 4\.3 s · 115 tokens · recorded 2 Oct 2026/);
          assert.match(await page.locator('#early-access').innerText(), /Azizam is in private preview\./);
          assert.match(await page.locator('#early-access').innerText(), /Access is by invitation for now\./);
          assert.equal(await page.locator('#early-access a[href^="mailto:"]').count(), 0, `${label}: no contact address until the owner chooses one`);
          assert.equal(await page.locator('.quick-steps li').count(), 3);
          assert.equal(await page.locator('.value-card').count(), 4);
          assert.equal(await page.locator('.brand .mark').count(), 1);
          // Copy button.
          await page.locator('#copy-command').click();
          await page.waitForFunction(() => document.getElementById('copy-command').textContent === 'Copied');
          assert.equal(await page.evaluate(() => navigator.clipboard.readText()), 'docker compose up -d');
          // Header: current page and menu.
          assert.equal(await page.locator('.brand').first().getAttribute('aria-current'), 'page');
          if (width === 390) {
            assert.equal(await page.locator('.site-nav').isVisible(), false);
            await page.locator('.site-disclosure summary').click();
            assert.equal(await page.locator('.site-disclosure nav a').count(), 4);
            assert.equal(await page.locator('.site-disclosure nav a:visible').count(), 4);
          } else {
            assert.deepEqual(await page.locator('.site-nav a').allInnerTexts(), ['Examples', 'Docs', 'API', 'Get started']);
          }
        }
        if (sample.name === 'examples') {
          assert.equal((await page.locator('h1').innerText()), 'See it work');
          assert.equal(await page.locator('.example').count(), 7);
          assert.match(await page.locator('#chat-default').innerText(), /Rayleigh scattering/);
          assert.equal(await page.locator('.site-nav a[aria-current]').first().getAttribute('aria-current'), 'page');
        }
        if (['docs', 'docs-page', 'docs-install'].includes(sample.name)) {
          assert.equal(await page.locator('.docs-shell .docs-nav a').count(), 35, `${label}: sidebar lists every page`);
          if (width === 1440) assert.equal(await page.locator('.docs-nav a[aria-current="page"]').count(), 1);
          assert.equal(await page.locator('.site-header').count(), 1);
          assert.equal(await page.locator('footer.foot').count(), 1);
        }
        if (['docs-connect', 'docs-client', 'docs-mcp'].includes(sample.name)) {
          assert.equal(await page.locator('.docs-route-sidebar a').count(), 3, 'desktop section navigation ' + label);
          assert.equal(await page.locator('.docs-route-mobile-nav a').count(), 3, 'mobile section navigation ' + label);
          assert.equal(await page.locator('.site-header').count(), 1);
          assert.equal(await page.locator('footer.foot').count(), 1);
        }
        if (sample.name === 'docs-connect') {
          assert.equal(await page.locator('.endpoint-list > div').count(), 4, 'protocol paths ' + label);
          assert.equal(await page.locator('.client-guide-list a').count(), guideData.apps.length, 'guide links ' + label);
        }
        if (sample.name === 'docs-client') {
          assert.equal(await page.locator('.guide-instructions').count(), 2, 'key and MCP instructions ' + label);
          assert.ok(await page.locator('.guide-fields').count() >= 1, 'connection fields ' + label);
        }
        if (sample.name === 'docs-mcp') {
          assert.equal(await page.locator('.mcp-tools > section').count(), 8, 'MCP tool definitions ' + label);
          assert.equal(await page.locator('.mcp-client-note').count(), guideData.apps.filter((app) => app.mcp).length, 'MCP client notes ' + label);
        }
        if (sample.name === 'docs-page' || sample.name === 'docs-install') {
          if (width === 1440) assert.ok(await page.locator('.toc a').count() >= 2, `${label}: on-page contents`);
          assert.ok(await page.locator('.pager a').count() >= 1);
          if (sample.name === 'docs-install') assert.ok(await page.locator('.table-wrap').count() >= 1, `${label}: table wrapper`);
        }
        if (sample.name === 'docs-install') {
          assert.ok(await page.locator('.codeblock').count() >= 3, `${label}: code blocks with copy`);
          await page.locator('.code-bar .copy').first().click();
          await page.waitForFunction(() => document.querySelector('.code-bar .copy').textContent === 'Copied');
          assert.match(await page.evaluate(() => navigator.clipboard.readText()), /docker compose up -d/);
        }
        if (sample.name === 'docs') {
          // Search: opens, finds a page and goes to it.
          await page.locator('.search-open').click();
          assert.equal(await page.locator('#search').evaluate((d) => d.open), true);
          await page.locator('#search-input').fill('spend');
          await page.locator('#search-results a').first().waitFor();
          const hit = await page.locator('#search-results a').first().getAttribute('href');
          assert.ok(hit.startsWith('/docs/'), `${label}: search hit ${hit}`);
          await page.locator('#search-results a').first().click();
          await page.waitForURL(url + hit.split('#')[0] + '*');
          await page.goto(url + '/docs/', { waitUntil: 'networkidle' });
          await page.keyboard.press('/');
          assert.equal(await page.locator('#search').evaluate((d) => d.open), true, `${label}: slash opens search`);
          await page.keyboard.press('Escape');
        }
        await page.evaluate(() => { document.querySelectorAll('details[open]').forEach((d) => d.removeAttribute('open')); scrollTo(0, 0); });
        await page.screenshot({ path: `${output}/${sample.name}-${width}-${theme}.png`, fullPage: true });
        results.push(record);
        await page.close();
      }
      await context.close();
    }
  }
  // Without JavaScript the pages still read.
  const plain = await browser.newContext({ javaScriptEnabled: false });
  const page = await plain.newPage();
  await page.goto(url + '/', { waitUntil: 'networkidle' });
  assert.equal(await page.locator('#compose-command').isVisible(), true);
  assert.equal(await page.locator('#copy-command').isVisible(), false);
  await page.goto(url + '/docs/start/install/', { waitUntil: 'networkidle' });
  assert.equal(await page.locator('pre').first().isVisible(), true);
  await plain.close();
  await writeFile(`${output}/results.json`, JSON.stringify({ url, summary, warnings, results }, null, 2));
  console.log(JSON.stringify({ url, passed: true, ...summary[0], samples: results.length, warnings }, null, 1));
} finally {
  await browser.close();
  server?.close();
}
