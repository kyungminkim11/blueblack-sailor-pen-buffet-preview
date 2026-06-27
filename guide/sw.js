const CACHE='blueblack-guide-v4.2.0';
const CORE=['./','./index.html','./app.css','./extended.css','./collection-tools.css','./app.js','./advanced-search.js','./extensions.js','./additional-situations.js','./collection-tools.js','./result-tools.js','./offline.html','./manifest.webmanifest','./data/catalog.js','./data/premium.js','./modules/search.js','./modules/recommendation.js','./modules/sanitize.js','../app-icon.svg'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE))));
self.addEventListener('activate',event=>event.waitUntil(Promise.all([caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))),self.clients.claim()])));
self.addEventListener('message',event=>{if(event.data?.type==='SKIP_WAITING')self.skipWaiting()});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);
  if(event.request.mode==='navigate'){
    event.respondWith(fetch(event.request).then(res=>{const copy=res.clone();caches.open(CACHE).then(c=>c.put(event.request,copy));return res}).catch(()=>caches.match(event.request).then(x=>x||caches.match('./offline.html'))));return;
  }
  if(url.origin===location.origin){
    event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(res=>{if(res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put(event.request,copy))}return res})));return;
  }
  event.respondWith(fetch(event.request).catch(()=>new Response('',{status:503,statusText:'Offline'})));
});
