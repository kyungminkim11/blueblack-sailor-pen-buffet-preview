import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const base = process.env.AUDIT_BASE_URL || 'http://127.0.0.1:4173';
const routes = [
  ['/admin/', 'admin-home'],
  ['/admin.html', 'pen-admin'],
  ['/admin/product-finder/', 'product-finder'],
  ['/admin/inventory-audit/', 'inventory-audit'],
  ['/admin/catalog-update/', 'catalog-update'],
  ['/admin/store-tour/', 'store-tour-admin'],
];
const out = path.resolve('artifacts/admin-security-audit');
await mkdir(out, { recursive: true });
const failures = [];
const browser = await chromium.launch({ headless: true });

for (const [route, name] of routes) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  try {
    await page.goto(new URL(route, base).href, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForSelector('.bb-admin-lock', { state: 'visible', timeout: 12000 });
    const heading = (await page.locator('.bb-admin-lock h1').textContent())?.trim();
    const password = page.locator('.bb-admin-lock input[type="password"]');
    const remember = page.locator('.bb-admin-lock input[type="checkbox"]');
    if (heading !== '관리자 암호 확인') failures.push(`${name}: unexpected gate heading`);
    if (await password.count() !== 1) failures.push(`${name}: password input is missing`);
    if (await remember.count() !== 1) failures.push(`${name}: remember-device option is missing`);
    await page.screenshot({ path: path.join(out, `${name}.png`), fullPage: true });
  } catch (error) {
    failures.push(`${name}: admin gate was not shown (${error?.message || error})`);
  }
  await context.close();
}

await browser.close();
await writeFile(path.join(out, 'report.json'), JSON.stringify({ failures, routes: routes.map(([route, name]) => ({ route, name })) }, null, 2));
if (failures.length) {
  console.error('Admin security audit failed:');
  failures.forEach(failure => console.error(`- ${failure}`));
  process.exit(1);
}
console.log(`Admin security audit passed for ${routes.length} internal routes.`);
