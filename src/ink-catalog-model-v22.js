import { INK_PRODUCTS, formatWon } from './ink-products-data.js';
import { INK_INVENTORY_COLORS } from './ink-inventory-colors.js';
import { INK_CATALOG_COPY } from './ink-catalog-i18n-v22.js';

const LIST_KEY='blueblack-ink-check-list-v4';
const FAV_KEY='blueblack-ink-brand-favorites-v4';

export function currentLang(){
  const value=document.documentElement.lang||'ko';
  if(value.startsWith('zh-Hant'))return'zh-Hant';
  if(value.startsWith('zh'))return'zh-Hans';
  if(value.startsWith('ja'))return'ja';
  if(value.startsWith('en'))return'en';
  return'ko';
}
export function copy(){return INK_CATALOG_COPY[currentLang()]||INK_CATALOG_COPY.ko;}
function read(key,fallback=[]){try{return JSON.parse(localStorage.getItem(key)||'null')||fallback;}catch{return fallback;}}
function write(key,value){try{localStorage.setItem(key,JSON.stringify(value));}catch{}}
export function normalize(value=''){return String(value).toLowerCase().normalize('NFKC').replace(/[\s._&()\-/·'’]/g,'');}
export function initials(value){return value.split(/\s+/).map(word=>word[0]).join('').slice(0,3).toUpperCase();}
export function brandName(group){return currentLang()==='ko'?group.brandKo:group.brandEn;}
export function seriesName(item){return currentLang()==='ko'?item.productKo:item.productEn;}
export function colorName(color){const lang=currentLang();if(lang==='ko')return color.nameKo;if(lang==='ja')return color.nameJa;if(lang==='zh-Hans')return color.nameZhHans;if(lang==='zh-Hant')return color.nameZhHant;return color.nameEn;}
export function formName(color){return color.form==='bottle'?copy().bottle:copy().cartridge;}
export function formatPrice(value){return value==null?copy().unknownPrice:formatWon(value);}
export function priceFor(item,volume){return volume==='10ml'?item.price10:item.price5;}
export function getList(){return read(LIST_KEY);}
export function getFavorites(){return new Set(read(FAV_KEY));}
export function priceItemById(id){return INK_PRODUCTS.find(item=>item.id===id);}
export function colorById(id){return INK_INVENTORY_COLORS.find(item=>item.id===id);}

export function brandGroups(){
  const map=new Map();
  const ensure=(brandKo,brandEn)=>{
    if(!map.has(brandEn))map.set(brandEn,{id:normalize(brandEn),brandKo,brandEn,priceItems:[],colors:[],keywords:[]});
    return map.get(brandEn);
  };
  INK_PRODUCTS.forEach(item=>{const group=ensure(item.brandKo,item.brandEn);group.priceItems.push(item);group.keywords.push(...(item.keywords||[]));});
  INK_INVENTORY_COLORS.forEach(color=>{const group=ensure(color.brandKo,color.brandEn);group.colors.push(color);group.keywords.push(color.nameKo,color.nameEn,color.nameJa,color.nameZhHans,color.nameZhHant,color.form,color.volume||'');});
  return[...map.values()];
}

export function matchedGroups(query=''){
  const value=normalize(query);
  const fav=getFavorites();
  return brandGroups().map(group=>{
    if(!value)return{...group,visiblePrices:group.priceItems,visibleColors:group.colors};
    const brandHit=normalize([group.brandKo,group.brandEn,...group.keywords].join(' ')).includes(value);
    const visiblePrices=brandHit?group.priceItems:group.priceItems.filter(item=>normalize([item.productKo,item.productEn,...(item.keywords||[])].join(' ')).includes(value));
    const visibleColors=brandHit?group.colors:group.colors.filter(color=>normalize([color.nameKo,color.nameEn,color.nameJa,color.nameZhHans,color.nameZhHant,color.form].join(' ')).includes(value));
    return{...group,visiblePrices,visibleColors};
  }).filter(group=>group.visiblePrices.length||group.visibleColors.length).sort((a,b)=>Number(fav.has(b.id))-Number(fav.has(a.id))||Number(b.colors.length>0)-Number(a.colors.length>0)||brandName(a).localeCompare(brandName(b)));
}

export function toggleFavorite(id){const values=getFavorites();values.has(id)?values.delete(id):values.add(id);write(FAV_KEY,[...values]);}
export function isColorSelected(id){return getList().some(entry=>entry.type==='color'&&entry.colorId===id);}
export function isPriceSelected(id,volume){return getList().some(entry=>entry.type==='price'&&entry.itemId===id&&entry.volume===volume);}
export function addColor(color){const values=getList();if(!values.some(entry=>entry.type==='color'&&entry.colorId===color.id))values.push({type:'color',colorId:color.id,addedAt:Date.now()});write(LIST_KEY,values);}
export function addPrice(item,volume){const values=getList();if(!values.some(entry=>entry.type==='price'&&entry.itemId===item.id&&entry.volume===volume))values.push({type:'price',itemId:item.id,volume,price:priceFor(item,volume),addedAt:Date.now()});write(LIST_KEY,values);}
export function removeListItem(index){const values=getList();values.splice(index,1);write(LIST_KEY,values);}
export function clearList(){write(LIST_KEY,[]);}
export function listTotal(){return getList().reduce((sum,entry)=>sum+(entry.type==='price'?Number(entry.price||0):0),0);}
export function shareLines(){
  return getList().map((entry,index)=>{
    if(entry.type==='color'){const color=colorById(entry.colorId);return`${index+1}. ${color?.brandKo||''} · ${color?.nameKo||entry.colorId} · ${color?formName(color):''} · ${copy().unknownPrice}`;}
    const item=priceItemById(entry.itemId);return`${index+1}. ${item?.brandKo||''} · ${item?.productKo||entry.itemId} · ${entry.volume} · ${formatPrice(entry.price)}`;
  });
}
export{formatWon};
