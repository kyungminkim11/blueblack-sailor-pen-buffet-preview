import {bundledPhoto1} from './admin-360-bundled-photo-1.js';
import {bundledPhoto2} from './admin-360-bundled-photo-2.js';
import {bundledPhoto3} from './admin-360-bundled-photo-3.js';
import {bundledPhoto4} from './admin-360-bundled-photo-4.js';
import {bundledPhoto5} from './admin-360-bundled-photo-5.js';
import {bundledPhoto6} from './admin-360-bundled-photo-6.js';
import {bundledPhoto7} from './admin-360-bundled-photo-7.js';
import {bundledPhoto8} from './admin-360-bundled-photo-8.js';
import {bundledPhoto9} from './admin-360-bundled-photo-9.js';

const PHOTOS=[bundledPhoto1,bundledPhoto2,bundledPhoto3,bundledPhoto4,bundledPhoto5,bundledPhoto6,bundledPhoto7,bundledPhoto8,bundledPhoto9];
const KEY='blueblack-360-bundle-v2';

function openDb(){return new Promise((resolve,reject)=>{const request=indexedDB.open('blueblack-360-roadview-v2',1);request.onupgradeneeded=()=>{const db=request.result;if(!db.objectStoreNames.contains('photos'))db.createObjectStore('photos',{keyPath:'spotId'});};request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);});}

async function saveMissing(db){
  const existing=await new Promise((resolve,reject)=>{const request=db.transaction('photos','readonly').objectStore('photos').getAllKeys();request.onsuccess=()=>resolve(new Set(request.result||[]));request.onerror=()=>reject(request.error);});
  const records=[];
  for(const photo of PHOTOS){
    if(!photo?.spotId||existing.has(photo.spotId))continue;
    const blob=await fetch(photo.dataUrl).then((response)=>response.blob());
    records.push({...photo,blob,updatedAt:Date.parse(photo.updatedAt),source:'bundled-2026-07-07',privacyProcessed:true});
  }
  if(!records.length)return;
  await new Promise((resolve,reject)=>{const tx=db.transaction('photos','readwrite');const store=tx.objectStore('photos');records.forEach(({dataUrl,...record})=>store.put(record));tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);});
}

export async function seedBundledPhotos(){
  if(localStorage.getItem(KEY)==='done'||!('indexedDB'in window))return;
  const db=await openDb();
  await saveMissing(db);
  localStorage.setItem(KEY,'done');
}
