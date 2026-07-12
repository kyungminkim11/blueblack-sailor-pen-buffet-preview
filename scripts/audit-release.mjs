import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const baseUrl = process.env.AUDIT_BASE_URL || 'http://127.0.0.1:4173';
const pages = [
  { name: 'home', path: '/' },
  { name: 'news', path: '/news/?lang=ko' },
  { name: 'review-event', path: '/review-event/?lang=ko' },
  { name: 'pen-buffet', path: '/pen-buffet/?lang=ko' },
  { name: 'store-guide', path: '/store-guide/?lang=ko&tour=f1-01' },
  { name: 'official-guide', path: '/official-guide/?lang=ko' },
  { name: 'engraving-guide', path: '/engraving-guide/?lang=ko' },
  { name: 'as-guide', path: '/as-guide/?lang=ko' },
  { name: 'ink-price', path: '/ink-price/?lang=ko&qa=release' },
];
const viewports = [
  { name: 'desktop', width: 1440, height: 1000 },
  { name: 'mobile', width: 390, height: 844 },
];
const knownOptional = [/\/models\/sailor-pen-buffet\.glb(?:\?|$)/];
const isKnownOptional = value => knownOptional.some(pattern => pattern.test(String(value || '')));
const failures = [];
const warnings = [];
const report = [];
const internalLinks = new Set();
const outDir = path.resolve('artifacts/release-audit');
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });

async function waitForApplication(page, name) {
  if (name === 'pen-buffet') {
    await page.waitForFunction(() => document.querySelectorAll('.part-button').length === 6, null, { timeout: 20000 });
  } else if (name === 'official-guide') {
    await page.waitForFunction(() => document.querySelectorAll('#officialBrandGrid > *').length > 0, null, { timeout: 15000 });
  } else if (name === 'engraving-guide') {
    await page.waitForFunction(() => document.querySelectorAll('#engravingFontGrid > *').length > 0, null, { timeout: 15000 });
  } else if (name === 'as-guide') {
    await page.waitForSelector('#asAllBrandsToggle', { timeout: 15000 });
  } else if (name === 'ink-price') {
    await page.waitForFunction(() => document.documentElement.dataset.inkApp === 'ready' || document.querySelector('#ink-store-app')?.children.length > 1, null, { timeout: 30000 });
  } else if (name === 'store-guide') {
    await page.waitForSelector('#floor-guide', { timeout: 15000 });
    await page.waitForSelector('.store-tour-public-card', { timeout: 15000 });
  }
}

async function runInteraction(page, name) {
  const errors = [];
  if (name === 'home') {
    const count = await page.locator('.tool-grid .tool-card').count();
    if (count < 8) errors.push(`expected at least 8 public tool cards, found ${count}`);
  }
  if (name === 'news') {
    const href = await page.locator('.instagram-feature-link').getAttribute('href');
    if (!href?.includes('instagram.com/blueblack_korea')) errors.push('official Instagram link is missing');
  }
  if (name === 'review-event') {
    const links = await page.locator('[data-review-link]').count();
    if (links < 1) errors.push('review action link is missing');
  }
  if (name === 'pen-buffet') {
    const parts = await page.locator('.part-button').count();
    const swatches = await page.locator('.swatch').count();
    if (parts !== 6) errors.push(`expected 6 part buttons, found ${parts}`);
    if (swatches < 1) errors.push('color swatches did not render');
    if (!(await page.locator('#pen-canvas').count())) errors.push('3D canvas is missing');
  }
  if (name === 'store-guide') {
    const secondTab = page.locator('[data-merged-floor="2"]');
    await secondTab.click();
    const hidden = await page.locator('[data-merged-panel="2"]').getAttribute('hidden');
    if (hidden !== null) errors.push('second floor panel did not open');
    await page.locator('[data-merged-floor="1"]').click();
  }
  if (name === 'official-guide') {
    const count = await page.locator('#officialBrandGrid > *').count();
    if (count < 1) errors.push('official brand directory did not render');
    await page.locator('#officialBrandSearch').fill('Lamy');
    await page.waitForTimeout(100);
    const visible = await page.locator('#officialBrandGrid > *:visible').count();
    if (visible < 1) errors.push('official brand search returned no result for Lamy');
  }
  if (name === 'engraving-guide') {
    const count = await page.locator('#engravingFontGrid > *').count();
    if (count < 12) errors.push(`expected 12 engraving fonts, found ${count}`);
    await page.locator('#engravingPreviewText').fill('BlueBlack 2026');
  }
  if (name === 'as-guide') {
    await page.locator('#asAllBrandsToggle').click();
    const waterman = page.locator('[data-brand-value="워터맨"]');
    if (!(await waterman.count())) errors.push('Waterman is missing from the full brand selector');
    else {
      await waterman.click();
      await page.waitForTimeout(150);
      const visibleCards = await page.locator('.as-center-card:visible').count();
      const visibleText = await page.locator('.as-center-card:visible').allTextContents();
      if (visibleCards !== 1) errors.push(`expected one A/S center after brand selection, found ${visibleCards}`);
      if (!visibleText.join(' ').includes('Hangso')) errors.push('Waterman did not resolve to Hangso');
    }
    if (await page.locator('.as-source-card > .bb-verified-date:visible').count()) errors.push('legacy verified-date badge is still visible');
  }
  if (name === 'ink-price') {
    const bootVisible = await page.locator('.ink-app-boot:visible').count();
    if (bootVisible) errors.push('ink application is still showing the boot screen');
    if ((await page.locator('#ink-store-app').textContent())?.trim().length < 20) errors.push('ink application content did not render');
  }
  return errors;
}

for (const viewport of viewports) {
  const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height }, deviceScaleFactor: 1 });
  for (const pageInfo of pages) {
    const page = await context.newPage();
    const consoleErrors = [];
    const responseErrors = [];
    page.on('console', message => {
      if (message.type() !== 'error') return;
      const sourceUrl = message.location()?.url || '';
      if (!isKnownOptional(sourceUrl)) consoleErrors.push(`${message.text()}${sourceUrl ? ` @ ${sourceUrl}` : ''}`);
    });
    page.on('pageerror', error => consoleErrors.push(error.message));
    page.on('response', response => {
      const url = response.url();
      if (response.status() >= 400 && url.startsWith(baseUrl)) {
        if (isKnownOptional(url)) warnings.push(`${pageInfo.name}/${viewport.name}: optional GLB unavailable; procedural model fallback is active`);
        else responseErrors.push(`${response.status()} ${url}`);
      }
    });

    const pageFailures = [];
    try {
      const url = new URL(pageInfo.path, baseUrl).href;
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
      await waitForApplication(page, pageInfo.name);
      await page.waitForTimeout(800);

      const metrics = await page.evaluate(() => {
        const root = document.documentElement;
        const body = document.body;
        const duplicateIds = [...document.querySelectorAll('[id]')]
          .map(node => node.id)
          .filter((id, index, list) => id && list.indexOf(id) !== index)
          .filter((id, index, list) => list.indexOf(id) === index);
        const imagesWithoutAlt = [...document.images]
          .filter(image => !image.hasAttribute('alt') && image.getAttribute('aria-hidden') !== 'true')
          .map(image => image.currentSrc || image.src || image.outerHTML.slice(0, 80));
        const unsafeBlankLinks = [...document.querySelectorAll('a[target="_blank"]')]
          .filter(link => !String(link.rel || '').split(/\s+/).includes('noopener'))
          .map(link => link.href);
        const emptyControls = [...document.querySelectorAll('button,a[href],summary')]
          .filter(node => {
            const style = getComputedStyle(node);
            const rect = node.getBoundingClientRect();
            const visible = style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
            const label = (node.getAttribute('aria-label') || node.textContent || '').trim();
            return visible && !label;
          })
          .map(node => node.outerHTML.slice(0, 120));
        const links = [...document.querySelectorAll('a[href]')].map(link => link.href);
        return {
          title: document.title.trim(),
          h1: document.querySelector('h1')?.textContent?.trim() || '',
          canonical: document.querySelector('link[rel="canonical"]')?.href || '',
          viewport: document.querySelector('meta[name="viewport"]')?.content || '',
          overflow: Math.max(root.scrollWidth, body?.scrollWidth || 0) - root.clientWidth,
          duplicateIds,
          imagesWithoutAlt,
          unsafeBlankLinks,
          emptyControls,
          links,
        };
      });

      if (!metrics.title) pageFailures.push('missing document title');
      if (!metrics.h1) pageFailures.push('missing main heading');
      if (!metrics.canonical) pageFailures.push('missing canonical URL');
      if (!metrics.viewport.includes('width=device-width')) pageFailures.push('missing responsive viewport');
      if (metrics.overflow > 4) pageFailures.push(`horizontal overflow ${Math.round(metrics.overflow)}px`);
      if (metrics.duplicateIds.length) pageFailures.push(`duplicate IDs: ${metrics.duplicateIds.join(', ')}`);
      if (metrics.imagesWithoutAlt.length) pageFailures.push(`images without alt: ${metrics.imagesWithoutAlt.join(', ')}`);
      if (metrics.unsafeBlankLinks.length) pageFailures.push(`target=_blank links without noopener: ${metrics.unsafeBlankLinks.join(', ')}`);
      if (metrics.emptyControls.length) pageFailures.push(`empty visible controls: ${metrics.emptyControls.join(', ')}`);
      metrics.links.forEach(href => {
        try {
          const url = new URL(href);
          if (url.origin === new URL(baseUrl).origin && !url.hash.startsWith('#')) internalLinks.add(url.href.split('#')[0]);
        } catch {}
      });

      pageFailures.push(...await runInteraction(page, pageInfo.name));
      if (consoleErrors.length) pageFailures.push(`console errors: ${consoleErrors.slice(0, 5).join(' | ')}`);
      if (responseErrors.length) pageFailures.push(`same-origin response errors: ${responseErrors.slice(0, 8).join(' | ')}`);

      await page.screenshot({ path: path.join(outDir, `${pageInfo.name}-${viewport.name}.png`), fullPage: true }).catch(() => {});
      report.push({ page: pageInfo.name, viewport: viewport.name, metrics, consoleErrors, responseErrors, failures: pageFailures });
    } catch (error) {
      pageFailures.push(`navigation or interaction failed: ${error?.message || error}`);
      report.push({ page: pageInfo.name, viewport: viewport.name, consoleErrors, responseErrors, failures: pageFailures });
    }
    pageFailures.forEach(failure => failures.push(`${pageInfo.name}/${viewport.name}: ${failure}`));
    await page.close();
  }
  await context.close();
}

for (const href of internalLinks) {
  try {
    const response = await fetch(href, { redirect: 'follow' });
    if (response.status >= 400) failures.push(`internal link failed: ${response.status} ${href}`);
  } catch (error) {
    failures.push(`internal link request failed: ${href} (${error?.message || error})`);
  }
}

await browser.close();
await writeFile(path.join(outDir, 'report.json'), JSON.stringify({ failures, warnings: [...new Set(warnings)], pages: report }, null, 2));

for (const warning of [...new Set(warnings)]) console.warn(`WARN ${warning}`);
if (failures.length) {
  console.error('Release audit failed:');
  failures.forEach(failure => console.error(`- ${failure}`));
  process.exit(1);
}
console.log(`Release audit passed for ${pages.length} pages across ${viewports.length} viewports.`);
