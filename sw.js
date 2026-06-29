const CACHE_NAME = 'blueblack-store-guide-v26-20260629';
const BASE = new URL('./', self.location.href);
const CORE_PATHS = [
  './',
  './index.html',
  './portal.css',
  './platform-shell.css',
  './portal-card.svg',
  './portal-card.png',
  './store-guide/',
  './store-guide/index.html',
  './store-guide/store-map.css',
  './store-guide/store-map.svg',
  './ink-price/',
  './ink-price/index.html',
  './ink-price/ink-price.css',
  './ink-price/ink-search.css',
  './ink-price/ink-brand-catalog-v21.css',
  './ink-price/ink-inventory-colors-v22.css',
  './ink-price/ink-ux-v19.css',
  './ink-price/source/price-list-1.png',
  './ink-price/source/price-list-2.png',
  './ink-price/source/price-list-3.png',
  './ink-price/source/price-list-4.png',
  './service/',
  './service/index.html',
  './staff/',
  './staff/index.html',
  './pen-buffet/',
  './pen-buffet/index.html',
  './pen-buffet/manifest.webmanifest',
  './app-v3.css',
  './ux-upgrades-v4.css',
  './customer-flow-v6.css',
  './store-experience-v6.css',
  './part-guide-v8.css',
  './part-guide-v11.css',
  './mobile-share-v9.css',
  './ui-v10.css',
  './store-console-v12.css',
  './store-progress-v12.css',
  './store-dialogs-v12.css',
  './staff-handoff-v12.css',
  './store-recovery-v12.css',
  './consultation-polish-v13.css',
  './pwa-v6.css',
  './app-icon.svg',
  './social-card.svg',
  './social-card.png',
  './robots.txt',
  './sitemap.xml',
  './src/portal.js',
  './src/store-map.js',
  './src/store-map-foreign-v20.js',
  './src/portal-ink-live.js',
  './src/ink-products-data.js',
  './src/ink-inventory-colors.js',
  './src/ink-sample-colors-v24.js',
  './src/ink-store-colors-generated.js',
  './src/ink-catalog-i18n-v22.js',
  './src/ink-catalog-copy-patch-v23.js',
  './src/ink-catalog-model-v22.js',
  './src/ink-price-viewer.js',
  './src/ink-price-search-v22.js',
  './src/ink-price-ux-v19.js',
  './src/app-v12.js',
  './src/data.js',
  './src/pen-model.js',
  './src/nib-feed.js',
  './src/i18n-v3.js',
  './src/i18n-v9.js',
  './src/restore-combination-v9.js',
  './src/pwa-v9.js',
  './src/share-image-v9.js',
  './src/part-guide-chinese-v9.js',
  './src/preset-chinese-v9.js',
  './src/store-experience-v6.js',
  './src/part-guide-v8.js',
  './src/part-guide-v11.js',
  './src/locale-ui-v10.js',
  './src/store-session-v12.js',
  './src/store-actions-v12.js',
  './src/store-recovery-v12.js',
  './src/consultation-polish-v13.js',
  'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js',
  'https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/controls/OrbitControls.js',
  'https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/environments/RoomEnvironment.js',
  'https://cdn.jsdelivr.net/npm/qrcode@1.5.4/+esm'
].map((path) => new URL(path, BASE).href);

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await Promise.allSettled(CORE_PATHS.map(async (url) => {
      const response = await fetch(url, { cache: 'reload' });
      if (response.ok || response.type === 'opaque') await cache.put(url, response);
    }));
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const response = await fetch(request);
    if (response.ok || response.type === 'opaque') cache.put(request, response.clone());
    return response;
  } catch {
    const cached = await cache.match(request, { ignoreSearch: request.mode === 'navigate' });
    if (cached) return cached;
    if (request.mode === 'navigate') return cache.match(new URL('./index.html', BASE).href);
    throw new Error('Offline resource unavailable');
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok || response.type === 'opaque') cache.put(request, response.clone());
  return response;
}

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (event.request.mode === 'navigate' || url.origin === self.location.origin) {
    event.respondWith(networkFirst(event.request));
    return;
  }
  if (url.hostname === 'cdn.jsdelivr.net') event.respondWith(cacheFirst(event.request));
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});
