import { bundledPhoto1 } from './admin-360-bundled-photo-1.js';
import { bundledPhoto2 } from './admin-360-bundled-photo-2.js';
import { bundledPhoto3 } from './admin-360-bundled-photo-3.js';
import { bundledPhoto4 } from './admin-360-bundled-photo-4.js';
import { bundledPhoto5 } from './admin-360-bundled-photo-5.js';
import { bundledPhoto6 } from './admin-360-bundled-photo-6.js';
import { bundledPhoto7 } from './admin-360-bundled-photo-7.js';
import { bundledPhoto8 } from './admin-360-bundled-photo-8.js';
import { bundledPhoto9 } from './admin-360-bundled-photo-9.js';

const DB_NAME='blueblack-360-roadview-v2';
const DB_VERSION=1;
const PHOTO_STORE='photos';
const SEED_KEY='blueblack-360-bundled-seed-2026-07-07-v1';
const BUNDLED_PHOTOS=[bundledPhoto1,bundledPhoto2,bundledPhoto3,bundledPhoto4,bundledPhoto5,bundledPhoto6,bundledPhoto7,bundledPhoto8,bundledPhoto9];

function openDatabase(){
  return new Promise((resolve,reject)=>{
    if(!('indexedDB' in window)){resolve(null);return;}
    const request=indexedDB.open(DB_NAME,DB_VERSION);
    request.onupgradeneeded=()=>{
      const db=request.result;
      if(!db.objectStoreNames.contains(PHOTO_STORE))db.createObjectStore(PHOTO_STORE,{keyPath:'spotId'});
    };
    request.onsuccess=()=>resolve(request.result);
    request.onerror=()=>reject(request.error||new Error('360 기본 사진 저장소를 열지 못했습니다.'));
  });
}

function dataUrlToBlob(dataUrl,type='image/webp'){
  const comma=dataUrl.indexOf(',');
  const binary=atob(comma>=0?dataUrl.slice(comma+1):dataUrl);
  const bytes=new Uint8Array(binary.length);
  for(let i=0;i<binary.length;i+=1)bytes[i]=binary.charCodeAt(i);
  return new Blob([bytes],{type});
}

function getExistingIds(db){
  return new Promise((resolve,reject)=>{
    const tx=db.transaction(PHOTO_STORE,'readonly');
    const request=tx.objectStore(PHOTO_STORE).getAllKeys();
    request.onsuccess=()=>resolve(new Set(request.result||[]));
    request.onerror=()=>reject(request.error||new Error('기존 360 사진을 확인하지 못했습니다.'));
  });
}

function writeRecords(db,records){
  return new Promise((resolve,reject)=>{
    const tx=db.transaction(PHOTO_STORE,'readwrite');
    const store=tx.objectStore(PHOTO_STORE);
    records.forEach((record)=>store.put(record));
    tx.oncomplete=()=>resolve();
    tx.onerror=()=>reject(tx.error||new Error('기본 360 사진을 저장하지 못했습니다.'));
    tx.onabort=()=>reject(tx.error||new Error('기본 360 사진 저장이 중단되었습니다.'));
  });
}

export async function seedBundledPhotos(){
  if(localStorage.getItem(SEED_KEY)==='done')return;
  const db=await openDatabase();
  if(!db)return;
  const existing=await getExistingIds(db);
  const missing=BUNDLED_PHOTOS.filter((photo)=>!existing.has(photo.spotId));
  if(missing.length){
    const records=missing.map((photo)=>({
      spotId:photo.spotId,
      floor:photo.floor,
      name:photo.name,
      type:photo.type,
      size:photo.size,
      width:photo.width,
      height:photo.height,
      updatedAt:Date.parse(photo.updatedAt),
      blob:dataUrlToBlob(photo.dataUrl,photo.type),
      source:'bundled-2026-07-07',
      privacyProcessed:true
    }));
    await writeRecords(db,records);
  }
  localStorage.setItem(SEED_KEY,'done');
}
