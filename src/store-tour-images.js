const loaders={
'f1-01':()=>import('./admin-360-bundled-photo-1.js').then(m=>m.bundledPhoto1?.dataUrl),
'f1-02':()=>import('./admin-360-bundled-photo-2.js').then(m=>m.bundledPhoto2?.dataUrl),
'f1-03':()=>import('./admin-360-bundled-photo-3.js').then(m=>m.bundledPhoto3?.dataUrl),
'f1-04':()=>import('./admin-360-bundled-photo-4.js').then(m=>m.bundledPhoto4?.dataUrl),
'f1-05':()=>import('./admin-360-bundled-photo-5.js').then(m=>m.bundledPhoto5?.dataUrl),
'f1-06':()=>import('./admin-360-bundled-photo-6.js').then(m=>m.bundledPhoto6?.dataUrl),
'f1-07':()=>import('./admin-360-bundled-photo-7.js').then(m=>m.bundledPhoto7?.dataUrl),
'f1-08':()=>import('./admin-360-bundled-photo-8.js').then(m=>m.bundledPhoto8?.dataUrl),
'f1-09':()=>import('./admin-360-bundled-photo-9.js').then(m=>m.bundledPhoto9?.dataUrl),
'f1-10':()=>import('./admin-360-bundled-photo-6.js').then(m=>m.bundledPhoto6?.dataUrl),
'f1-11':()=>import('./admin-360-bundled-photo-5.js').then(m=>m.bundledPhoto5?.dataUrl)};
const cache=new Map();
export async function defaultImage(id){if(!cache.has(id))cache.set(id,loaders[id]?.());const value=await cache.get(id);if(!value)throw new Error('기본 사진 없음');return value;}
export function sceneImage(spot){return spot.imageMode==='custom'&&spot.imageUrl?Promise.resolve(spot.imageUrl):defaultImage(spot.id);}
