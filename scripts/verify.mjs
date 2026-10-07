import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const url = process.env.SITE_URL || 'http://127.0.0.1:4321';
const output = process.env.ARTIFACT_DIR || '.verify-artifacts';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox', ...(process.env.CHROME_RESOLVE_HOST ? ['--host-resolver-rules=' + process.env.CHROME_RESOLVE_HOST] : [])] });
const findings = [];
async function verifyProductImages(page, theme) {
 const images = page.locator('.product-shot img');
 assert.equal(await images.count(), 8, 'All eight required product surfaces are present');
 for (const img of await images.all()) {
  await img.scrollIntoViewIfNeeded();
  await img.evaluate(async image => { await image.decode(); });
  assert.equal(await img.evaluate(image => image.complete && image.naturalWidth === 1440), true, 'Crisp product capture loaded');
  assert.match(await img.evaluate(image => image.currentSrc), new RegExp(`-${theme}\\.webp$`), 'Product theme matches site');
 }
}
try {
 for (const width of [1440, 390]) {
  for (const theme of ['light','dark']) {
   const context = await browser.newContext({ viewport: { width, height: 960 }, colorScheme: theme, reducedMotion: 'reduce', permissions: ['clipboard-read', 'clipboard-write'] });
   const page = await context.newPage();
   await page.addInitScript(() => { const original = document.execCommand.bind(document); document.execCommand = (command, ...args) => { if(command === 'copy') (window).__copiedText = document.activeElement?.value; return original(command, ...args); }; });
   const errors = []; page.on('pageerror', error => errors.push(error.message));
   await page.goto(url, {waitUntil:'networkidle'});
   await page.evaluate(() => document.fonts.ready);
   assert.equal(await page.locator('h1').count(), 1);
   assert.match(await page.locator('h1').innerText(), /One self-hosted gateway\s+for your AI apps/);
   assert.equal(await page.locator('meta[name=robots]').getAttribute('content'), 'noindex, nofollow');
   assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'), 'https://azizam.dev/');
   for (const property of ['type', 'url', 'title', 'description', 'image']) {
    assert.ok(await page.locator(`meta[property="og:${property}"]`).getAttribute('content'));
   }
   for (const name of ['card', 'title', 'description']) {
    assert.ok(await page.locator(`meta[name="twitter:${name}"]`).getAttribute('content'));
   }
   assert.match(await page.locator('#install').innerText(), /Setup requires access to the private Azizam repository\./);
   assert.match(await page.locator('.closing a').innerText(), /^View preview setup\s+↗$/);
   assert.equal(await page.locator('#panel-0').isVisible(), true);
   assert.equal(await page.locator('#panel-1').isVisible(), false);
   assert.equal(await page.locator('#panel-2').isVisible(), false);
   assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `Page overflow at ${width}`);
   assert.equal(await page.locator('.hero-proof img').evaluate(img => img.complete && img.naturalWidth > 0), true, 'Product image loaded');
   await verifyProductImages(page, theme);
   await page.getByRole('tab', {name:'Anthropic',exact:true}).click();
   assert.equal(await page.locator('#panel-1').isVisible(),true);
   await page.getByRole('tab', {name:'Anthropic',exact:true}).press('ArrowRight');
   assert.equal(await page.locator('#panel-2').isVisible(),true);
   await page.getByRole('tab', {name:'OpenAI',exact:true}).click();
   await page.locator('#install .copy-button').click();
   const copied = await page.evaluate(() => navigator.clipboard ? navigator.clipboard.readText() : window.__copiedText);
   assert.equal(await page.locator('#install .copy-button').innerText(),'Copied');
   assert.match(copied, /docker compose up -d/);
   assert.ok(!copied.includes('AI_GATEWAY_LITELLM_BASE_URL'), 'Compose config is not pointed at an inference engine');
   assert.match(await page.locator('#cap-explanation').innerText(), /actual cost of requests already in flight/);
   assert.match(await page.locator('body').innerText(), /seeded request panel/i);
   assert.equal((await page.request.get(new URL('/robots.txt', url).href)).status(), 200);
   await page.getByText('What hardware do I need?',{exact:true}).click();
   assert.equal(await page.locator('details').first().getAttribute('open'), '');
   await page.getByText('What hardware do I need?',{exact:true}).click();
   await page.locator('#theme-toggle').click();
   assert.equal(await page.locator('html').getAttribute('data-theme'), theme === 'light' ? 'dark' : 'light');
   await verifyProductImages(page, theme === 'light' ? 'dark' : 'light');
   await page.reload({waitUntil:'networkidle'});
   assert.equal(await page.locator('html').getAttribute('data-theme'), theme === 'light' ? 'dark' : 'light');
   await page.locator('#theme-toggle').click();
   await page.locator('.hero-actions a.primary').click();
   assert.match(page.url(), /#install$/);
   const axe = await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
   assert.deepEqual(axe.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)})), []);
   assert.deepEqual(errors, []);
   for (const link of await page.locator('a[href^="#"]').evaluateAll(links => links.map(a=>a.getAttribute('href')))) {
    if(link && link.length>1) assert.equal(await page.locator(link).count(),1,`Anchor ${link} exists`);
   }
   await page.goto(url,{waitUntil:'networkidle'});
   await verifyProductImages(page, theme);
   await page.evaluate(() => scrollTo(0, 0));
   await page.screenshot({path:`${output}/${width}-${theme}.png`,fullPage:true});
   await page.screenshot({path:`${output}/${width}-${theme}-hero.png`});
   findings.push({width,theme,axeViolations:0,consoleErrors:errors,checks:['noindex','no horizontal overflow','all 8 real images load in both themes','tab click and keyboard','clipboard exact install','FAQ disclosure','theme toggles and persists','install CTA','all anchor targets']});
   await context.close();
  }
 }
 const noScriptContext = await browser.newContext({ javaScriptEnabled: false });
 try {
  const page = await noScriptContext.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  for (const index of [0, 1, 2]) {
   assert.equal(await page.locator(`#panel-${index}`).isVisible(), true, 'Protocol example available without JavaScript');
   assert.ok((await page.locator(`#panel-${index} code`).innerText()).length > 0);
  }
  assert.equal(await page.locator('meta[name=robots]').getAttribute('content'), 'noindex, nofollow');
  console.log('No-JavaScript check: all three protocol examples visible');
 } finally { await noScriptContext.close(); }
 await writeFile(`${output}/journey-results.json`,JSON.stringify({url,findings},null,2));
 console.log(JSON.stringify({url,viewports:findings.length,passed:true}));
} finally {await browser.close();}
