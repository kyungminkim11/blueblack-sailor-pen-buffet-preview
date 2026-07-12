import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const base = process.env.AUDIT_BASE_URL || 'http://127.0.0.1:4173';
const routes = [
  ['home', '/'],
  ['news', '/news/?lang=ko'],
  ['review-event', '/review-event/?lang=ko'],
  ['pen-buffet', '/pen-buffet/?lang=ko'],
  ['store-guide', '/store-guide/?lang=ko'],
  ['official-guide', '/official-guide/?lang=ko'],
  ['engraving-guide', '/engraving-guide/?lang=ko'],
  ['as-guide', '/as-guide/?lang=ko'],
  ['ink-price', '/ink-price/?lang=ko&qa=release'],
];
const viewports = [
  ['desktop', { width: 1440, height: 1000 }],
  ['mobile', { width: 390, height: 844 }],
];
const optionalGlb = /\/models\/sailor-pen-buffet\.glb(?:\?|$)/;
const failures = [];
const warnings = new Set();
const report = [];
const links = new Set();
const out = path.resolve('artifacts/release-audit');
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true });

async function waitForReady(page, name) {
  const waits = {
    'pen-buffet': () => page.waitForFunction(() => document.querySelectorAll('.part-button').length === 6, null, { timeout: 20000 }),
    'official-guide': () => page.waitForFunction(() => document.querySelectorAll('#officialBrandGrid > *').length > 0, null, { timeout: 15000 }),
    'engraving-guide': () => page.waitForFunction(() => document.querySelectorAll('#engravingFontGrid > *').length > 0, null, { timeout: 15000 }),
    'as-guide': () => page.waitForSelector('#asAllBrandsToggle', { timeout: 15000 }),
    'ink-price': () => page.waitForFunction(() => document.documentElement.dataset.inkApp === 'ready' || document.querySelector('#ink-store-app')?.children.length > 1, null, { timeout: 30000 }),
    'store-guide': () => page.waitForSelector('#floor-guide', { timeout: 15000 }),
  };
  await waits[name]?.();
  await page.waitForTimeout(700);
}

async function interactions(page, name) {
  const errors = [];
  if (name === 'home' && await page.locator('.tool-grid .tool-card').count() < 8) errors.push('public tool cards are missing');
  if (name === 'news' && !(await page.locator('.instagram-feature-link').getAttribute('href'))?.includes('instagram.com/blueblack_korea')) errors.push('official Instagram link is missing');
  if (name === 'review-event' && await page.locator('[data-review-link]').count() < 1) errors.push('review action link is missing');
  if (name === 'pen-buffet') {
    if (await page.locator('.part-button').count() !== 6) errors.push('six pen parts did not render');
    if (await page.locator('.swatch').count() < 1) errors.push('pen color swatches did not render');
    if (await page.locator('#pen-canvas').count() !== 1) errors.push('3D canvas is missing');
  }
  if (name === 'store-guide') {
    await page.locator('[data-merged-floor="2"]').click();
    if (await page.locator('[data-merged-panel="2"]').getAttribute('hidden') !== null) errors.push('second guide map did not open');
    await page.locator('[data-merged-floor="1"]').click();
  }
  if (name === 'official-guide') {
    if (await page.locator('#officialBrandGrid > *').count() < 1) errors.push('official brand directory did not render');
    await page.locator('#officialBrandSearch').fill('Lamy');
    await page.waitForTimeout(120);
    if (await page.locator('#officialBrandGrid > *:visible').count() < 1) errors.push('official brand search returned no Lamy result');
  }
  if (name === 'engraving-guide') {
    if (await page.locator('#engravingFontGrid > *').count() < 12) errors.push('the 12 engraving fonts did not render');
    await page.locator('#engravingPreviewText').fill('BlueBlack 2026');
  }
  if (name === 'as-guide') {
    await page.locator('#asAllBrandsToggle').click();
    const button = page.locator('[data-brand-value="워터맨"]');
    if (await button.count() !== 1) errors.push('Waterman is missing from the full brand selector');
    else {
      await button.click();
      await page.waitForTimeout(200);
      const cards = page.locator('.as-center-card:visible');
      if (await cards.count() !== 1) errors.push('A/S brand selection did not reduce results to one center');
      if (!(await cards.allTextContents()).join(' ').includes('Hangso')) errors.push('Waterman did not resolve to Hangso');
    }
    if (await page.locator('.as-source-card > .bb-verified-date:visible').count()) errors.push('legacy verified-date badge is visible');
  }
  if (name === 'ink-price') {
    if (await page.locator('.ink-app-boot:visible').count()) errors.push('ink application remained on its boot screen');
    if (((await page.locator('#ink-store-app').textContent()) || '').trim().length < 20) errors.push('ink application content did not render');
  }
  return errors;
}

for (const [viewportName, viewport] of viewports) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
  for (const [name, route] of routes) {
    const page = await context.newPage();
    const errors = [];
    const consoleErrors = [];
    const responseErrors = [];
    page.on('console', message => {
      if (message.type() !== 'error') return;
      const location = message.location()?.url || '';
      const text = message.text();
      if (!optionalGlb.test(location) && !optionalGlb.test(text)) consoleErrors.push(location ? `${text} @ ${location}` : text);
    });
    page.on('pageerror', error => consoleErrors.push(error.message));
    page.on('response', response => {
      const url = response.url();
      if (response.status() < 400 || !url.startsWith(base)) return;
      if (optionalGlb.test(url)) warnings.add(`${name}/${viewportName}: GLB file is absent, so the procedural pen fallback is active`);
      else responseErrors.push(`${response.status()} ${url}`);
    });

    try {
      await page.goto(new URL(route, base).href, { waitUntil: 'domcontentloaded', timeout: 45000 });
      await waitForReady(page, name);
      const metrics = await page.evaluate(() => {
        const root = document.documentElement;
        const body = document.body;
        const ids = [...document.querySelectorAll('[id]')].map(node => node.id).filter(Boolean);
        const duplicates = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
        const noAlt = [...document.images].filter(image => !image.hasAttribute('alt') && image.getAttribute('aria-hidden') !== 'true').map(image => image.src);
        const unsafeBlank = [...document.querySelectorAll('a[target="_blank"]')].filter(link => !String(link.rel).split(/\s+/).includes('noopener')).map(link => link.href);
        return {
          title: document.title.trim(),
          h1: document.querySelector('h1')?.textContent?.trim() || '',
          canonical: document.querySelector('link[rel="canonical"]')?.href || '',
          viewport: document.querySelector('meta[name="viewport"]')?.content || '',
          overflow: Math.max(root.scrollWidth, body?.scrollWidth || 0) - root.clientWidth,
          duplicates,
          noAlt,
          unsafeBlank,
          links: [...document.querySelectorAll('a[href]')].map(link => link.href),
        };
      });
      if (!metrics.title) errors.push('document title is missing');
      if (!metrics.h1) errors.push('main heading is missing');
      if (!metrics.canonical) errors.push('canonical URL is missing');
      if (!metrics.viewport.includes('width=device-width')) errors.push('responsive viewport is missing');
      if (metrics.overflow > 4) errors.push(`horizontal overflow ${Math.round(metrics.overflow)}px`);
      if (metrics.duplicates.length) errors.push(`duplicate IDs: ${metrics.duplicates.join(', ')}`);
      if (metrics.noAlt.length) errors.push(`images without alt: ${metrics.noAlt.join(', ')}`);
      if (metrics.unsafeBlank.length) errors.push(`target=_blank links without noopener: ${metrics.unsafeBlank.join(', ')}`);
      for (const href of metrics.links) {
        try {
          const url = new URL(href);
          if (url.origin === new URL(base).origin && !url.hash) links.add(url.href);
        } catch {}
      }
      errors.push(...await interactions(page, name));
      if (consoleErrors.length) errors.push(`console errors: ${consoleErrors.slice(0, 5).join(' | ')}`);
      if (responseErrors.length) errors.push(`same-origin response errors: ${responseErrors.slice(0, 8).join(' | ')}`);
      await page.screenshot({ path: path.join(out, `${name}-${viewportName}.png`), fullPage: true }).catch(() => {});
      report.push({ name, viewport: viewportName, metrics, consoleErrors, responseErrors, errors });
    } catch (error) {
      errors.push(`navigation or interaction failed: ${error?.message || error}`);
      report.push({ name, viewport: viewportName, consoleErrors, responseErrors, errors });
    }
    for (const error of errors) failures.push(`${name}/${viewportName}: ${error}`);
    await page.close();
  }
  await context.close();
}

for (const href of links) {
  try {
    const response = await fetch(href, { redirect: 'follow' });
    if (response.status >= 400) failures.push(`internal link failed: ${response.status} ${href}`);
  } catch (error) {
    failures.push(`internal link request failed: ${href} (${error?.message || error})`);
  }
}

await browser.close();
await writeFile(path.join(out, 'report.json'), JSON.stringify({ failures, warnings: [...warnings], pages: report }, null, 2));
for (const warning of warnings) console.warn(`WARN ${warning}`);
if (failures.length) {
  console.error('Release audit failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log(`Release audit passed for ${routes.length} pages across ${viewports.length} viewports.`);
