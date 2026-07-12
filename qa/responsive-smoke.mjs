import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const baseURL = process.env.QA_BASE_URL || 'http://127.0.0.1:4173';
const routes = [
  ['home', '/'],
  ['news', '/news/'],
  ['review-event', '/review-event/'],
  ['pen-buffet', '/pen-buffet/'],
  ['official-guide', '/official-guide/'],
  ['engraving-guide', '/engraving-guide/'],
  ['as-guide', '/as-guide/'],
  ['ink-price', '/ink-price/?lang=ko&qa=responsive'],
  ['store-guide', '/store-guide/?lang=ko'],
  ['store-guide-tour', '/store-guide/?lang=ko&tour=f1-01'],
  ['admin-tools', '/admin/'],
  ['admin-settings', '/admin.html'],
  ['product-finder', '/admin/product-finder/'],
  ['service-redirect', '/service/'],
  ['staff-redirect', '/staff/'],
  ['store-tour-redirect', '/store-tour/'],
];
const viewports = [
  { name: 'phone-360', width: 360, height: 800 },
  { name: 'phone-390', width: 390, height: 844 },
  { name: 'tablet-768', width: 768, height: 1024 },
];

const outDir = path.resolve('qa-artifacts/responsive');
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const report = [];
let failed = false;

for (const viewport of viewports) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
  for (const [name, route] of routes) {
    const page = await context.newPage();
    const consoleErrors = [];
    page.on('console', message => {
      if (message.type() === 'error') consoleErrors.push(message.text());
    });
    page.on('pageerror', error => consoleErrors.push(error.message));

    let navigationError = '';
    const interactionErrors = [];
    let interaction = null;
    try {
      await page.goto(`${baseURL}${route}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(900);

      if (name === 'store-guide-tour') {
        await page.waitForSelector('.store-tour-view-shell', { timeout: 12000 });
        await page.waitForSelector('[data-tour-next]', { timeout: 12000 });
        await page.locator('.store-tour-mobile-start button').click({ timeout: 1500 }).catch(() => {});
        await page.waitForTimeout(300);

        const before = (await page.locator('[data-tour-progress]').textContent())?.trim() || '';
        const next = page.locator('[data-tour-next]');
        const clickGeometry = await next.evaluate((element) => {
          const rect = element.getBoundingClientRect();
          const x = rect.left + rect.width / 2;
          const y = rect.top + rect.height / 2;
          const hit = document.elementFromPoint(x, y);
          return {
            disabled: element.disabled,
            width: Math.round(rect.width),
            height: Math.round(rect.height),
            hitTag: hit?.tagName || '',
            hitText: (hit?.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 50),
            ownsHit: hit === element || element.contains(hit),
          };
        });
        if (clickGeometry.disabled) interactionErrors.push('next location button is disabled at the first viewpoint');
        if (!clickGeometry.ownsHit) interactionErrors.push(`next location button is covered by ${clickGeometry.hitTag}:${clickGeometry.hitText}`);

        await next.click({ timeout: 3000 });
        await page.waitForTimeout(250);
        const after = (await page.locator('[data-tour-progress]').textContent())?.trim() || '';
        if (before === after || !after.includes('2 / 11')) interactionErrors.push(`tour progress did not advance: ${before} -> ${after}`);
        interaction = { before, after, clickGeometry };
      }
    } catch (error) {
      navigationError = String(error?.message || error);
    }

    const metrics = await page.evaluate(() => {
      const html = document.documentElement;
      const body = document.body;
      const viewportMeta = document.querySelector('meta[name="viewport"]')?.getAttribute('content') || '';
      const overflow = Math.max(html.scrollWidth, body?.scrollWidth || 0) - window.innerWidth;
      const visible = element => {
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) !== 0 && rect.width > 0 && rect.height > 0;
      };
      const smallTargets = [...document.querySelectorAll('button,a,input,select,summary')]
        .filter(visible)
        .map(element => {
          const rect = element.getBoundingClientRect();
          return {
            tag: element.tagName.toLowerCase(),
            text: (element.getAttribute('aria-label') || element.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 60),
            width: Math.round(rect.width),
            height: Math.round(rect.height),
          };
        })
        .filter(item => item.width < 36 || item.height < 36)
        .slice(0, 20);
      const wideFixed = [...document.querySelectorAll('*')]
        .filter(visible)
        .map(element => ({ element, style: getComputedStyle(element), rect: element.getBoundingClientRect() }))
        .filter(({ style, rect }) => ['fixed', 'sticky'].includes(style.position) && rect.width > window.innerWidth + 4)
        .map(({ element, rect }) => ({
          selector: element.id ? `#${element.id}` : `${element.tagName.toLowerCase()}.${[...element.classList].slice(0, 2).join('.')}`,
          width: Math.round(rect.width),
        }))
        .slice(0, 10);
      return {
        title: document.title,
        url: location.href,
        viewportMeta,
        overflow: Math.round(overflow),
        smallTargets,
        wideFixed,
      };
    });

    const hardErrors = [];
    if (navigationError) hardErrors.push(`navigation: ${navigationError}`);
    if (!metrics.viewportMeta.includes('width=device-width')) hardErrors.push('missing responsive viewport meta');
    if (metrics.overflow > 4) hardErrors.push(`horizontal overflow ${metrics.overflow}px`);
    if (metrics.wideFixed.length) hardErrors.push(`oversized fixed/sticky element: ${JSON.stringify(metrics.wideFixed)}`);
    hardErrors.push(...interactionErrors);
    if (hardErrors.length) failed = true;

    const screenshotPath = path.join(outDir, `${name}-${viewport.name}.png`);
    if (viewport.name !== 'phone-360') {
      await page.screenshot({ path: screenshotPath, fullPage: true }).catch(() => {});
    }

    report.push({
      page: name,
      route,
      viewport,
      ...metrics,
      interaction,
      hardErrors,
      consoleErrors: consoleErrors.slice(0, 12),
    });
    await page.close();
  }
  await context.close();
}

await browser.close();
await writeFile(path.join(outDir, 'report.json'), JSON.stringify(report, null, 2));

for (const item of report) {
  const state = item.hardErrors.length ? 'FAIL' : 'PASS';
  console.log(`${state} ${item.page} ${item.viewport.name} overflow=${item.overflow}px smallTargets=${item.smallTargets.length}`);
  for (const error of item.hardErrors) console.log(`  - ${error}`);
}

if (failed) process.exitCode = 1;
