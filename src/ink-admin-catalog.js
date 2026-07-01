export const INK_ADMIN_CATALOG_KEY = 'blueblack-ink-admin-catalog-v1';

const MAX_TEXT = 180;
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function normalizeInkId(value = 'ink') {
  const text = String(value || 'ink')
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return text || 'ink';
}

function text(value, fallback = '') {
  return String(value ?? fallback).trim().slice(0, MAX_TEXT);
}

function number(value, fallback = 0) {
  const next = Number(value);
  return Number.isFinite(next) ? Math.max(0, Math.round(next)) : fallback;
}

function list(value) {
  if (Array.isArray(value)) return value.map((item) => text(item)).filter(Boolean).slice(0, 16);
  return String(value || '')
    .split(',')
    .map((item) => text(item))
    .filter(Boolean)
    .slice(0, 16);
}

function hex(value, fallback = '#2f5875') {
  const next = text(value, fallback);
  return /^#[0-9a-f]{6}$/i.test(next) ? next : fallback;
}

export function sanitizeInkPriceItem(value = {}) {
  const brandKo = text(value.brandKo);
  const brandEn = text(value.brandEn, brandKo || 'Custom Ink');
  const productKo = text(value.productKo);
  const productEn = text(value.productEn, productKo || 'Custom Series');
  const id = normalizeInkId(value.id || [brandEn, productEn].join('-'));
  return {
    id,
    brandKo: brandKo || brandEn,
    brandEn,
    productKo: productKo || productEn,
    productEn,
    price5: number(value.price5),
    price10: number(value.price10),
    color: hex(value.color),
    keywords: list(value.keywords),
    active: value.active !== false,
  };
}

export function sanitizeInkColor(value = {}) {
  const brandKo = text(value.brandKo);
  const brandEn = text(value.brandEn, brandKo || 'Custom Ink');
  const nameKo = text(value.nameKo);
  const nameEn = text(value.nameEn, nameKo || 'Custom Color');
  const id = normalizeInkId(value.id || [brandEn, value.priceItemId, nameEn || nameKo].join('-'));
  return {
    id,
    brandKo: brandKo || brandEn,
    brandEn,
    form: 'bottle',
    volume: text(value.volume, '50ml') || '50ml',
    nameKo: nameKo || nameEn,
    nameEn,
    nameJa: text(value.nameJa, nameEn || nameKo),
    nameZhHans: text(value.nameZhHans, nameKo || nameEn),
    nameZhHant: text(value.nameZhHant, nameKo || nameEn),
    hex: hex(value.hex, '#6d7484'),
    productTitle: text(value.productTitle, [brandKo || brandEn, nameKo || nameEn].filter(Boolean).join(' ')),
    productUrl: text(value.productUrl),
    priceItemId: text(value.priceItemId),
    active: value.active !== false,
  };
}

export function sanitizeInkAdminCatalog(value = {}) {
  const source = value && typeof value === 'object' ? value : {};
  return {
    priceItems: Array.isArray(source.priceItems) ? source.priceItems.map(sanitizeInkPriceItem) : [],
    colors: Array.isArray(source.colors) ? source.colors.map(sanitizeInkColor) : [],
    updatedAt: source.updatedAt ? text(source.updatedAt) : null,
  };
}

function readCookie() {
  try {
    const prefix = `${INK_ADMIN_CATALOG_KEY}=`;
    const entry = document.cookie.split('; ').find((item) => item.startsWith(prefix));
    return entry ? decodeURIComponent(entry.slice(prefix.length)) : '';
  } catch {
    return '';
  }
}

function writeCookie(value) {
  try {
    document.cookie = `${INK_ADMIN_CATALOG_KEY}=${encodeURIComponent(value)}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  } catch {}
}

function clearCookie() {
  try {
    document.cookie = `${INK_ADMIN_CATALOG_KEY}=; path=/; max-age=0; SameSite=Lax`;
  } catch {}
}

function readStoredCatalogText() {
  let saved = '';
  try {
    saved = localStorage.getItem(INK_ADMIN_CATALOG_KEY) || '';
  } catch {}
  return saved || readCookie();
}

export function readInkAdminCatalog() {
  try {
    return sanitizeInkAdminCatalog(JSON.parse(readStoredCatalogText() || 'null') || {});
  } catch {
    return sanitizeInkAdminCatalog();
  }
}

export function writeInkAdminCatalog(value) {
  const next = sanitizeInkAdminCatalog({ ...value, updatedAt: new Date().toISOString() });
  const serialized = JSON.stringify(next);
  try {
    localStorage.setItem(INK_ADMIN_CATALOG_KEY, serialized);
  } catch {}
  writeCookie(serialized);
  window.dispatchEvent(new CustomEvent('blueblackinkcatalogchange', { detail: next }));
  return next;
}

export function resetInkAdminCatalog() {
  try {
    localStorage.removeItem(INK_ADMIN_CATALOG_KEY);
  } catch {}
  clearCookie();
  const next = sanitizeInkAdminCatalog();
  window.dispatchEvent(new CustomEvent('blueblackinkcatalogchange', { detail: next }));
  return next;
}

export function applyInkAdminCatalog(basePriceItems = [], baseColors = [], catalog = readInkAdminCatalog()) {
  const priceMap = new Map(basePriceItems.map((item) => [item.id, { ...item }]));
  const colorMap = new Map(baseColors.map((color) => [color.id, { ...color }]));

  for (const item of catalog.priceItems) {
    if (!item.active) priceMap.delete(item.id);
    else priceMap.set(item.id, { ...priceMap.get(item.id), ...item });
  }

  for (const color of catalog.colors) {
    if (!color.active) colorMap.delete(color.id);
    else colorMap.set(color.id, { ...colorMap.get(color.id), ...color });
  }

  return {
    priceItems: [...priceMap.values()],
    colors: [...colorMap.values()],
  };
}
