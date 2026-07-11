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
    try {
      await page.goto(`${baseURL}${route}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(900);
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
