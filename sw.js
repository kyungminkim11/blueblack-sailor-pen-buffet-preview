const CACHE_NAME = 'blueblack-pen-v6-20260627b';
const BASE = new URL('./', self.location.href);
const CORE_PATHS = [
  './',
  './index.html',
  './app-v3.css',
  './ux-upgrades-v4.css',
  './customer-flow-v6.css',
  './store-experience-v6.css',
  './pwa-v6.css',
  './manifest.webmanifest',
  './app-icon.svg',
  './src/app-v6.js',
  './src/data.js',
  './src/pen-model.js',
  './src/nib-feed.js',
  './src/i18n-v3.js',
  './src/restore-combination.js',
  './src/customer-flow-v6.js',
  './src/session-v6.js',
  './src/store-experience-v6.js',
  './src/pwa-v6.js'
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
    const cached = await cache.match(request);
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
