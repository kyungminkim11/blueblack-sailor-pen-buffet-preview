import { INK_PRODUCTS, formatWon } from './ink-products-data.js';
import { INK_INVENTORY_COLORS } from './ink-inventory-colors.js';
import { INK_STORE_COLORS } from './ink-store-colors-generated.js';
import { INK_CATALOG_COPY } from './ink-catalog-i18n-v22.js';

const LIST_KEY='blueblack-ink-check-list-v5';
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
export function initials(value){return String(value||'INK').split(/\s+/).map(word=>word[0]).join('').slice(0,3).toUpperCase();}
export function brandName(group){return currentLang()==='ko'?group.brandKo:group.brandEn;}
export function seriesName(item){return currentLang()==='ko'?item.productKo:item.productEn;}
export function colorName(color){
  const lang=currentLang();
  if(lang==='ko')return color.nameKo||color.nameEn||color.productTitle;
  if(lang==='ja')return color.nameJa||color.nameEn||color.nameKo;
  if(lang==='zh-Hans')return color.nameZhHans||color.nameEn||color.nameKo;
  if(lang==='zh-Hant')return color.nameZhHant||color.nameEn||color.nameKo;
  return color.nameEn||color.nameKo||color.productTitle;
}
export function formName(color){return color.form==='bottle'?copy().bottle:copy().cartridge;}
export function formatPrice(value){return value==null?copy().unknownPrice:formatWon(value);}
export function priceFor(item,volume){return volume==='10ml'?item.price10:item.price5;}
export function getList(){return read(LIST_KEY);}
export function getFavorites(){return new Set(read(FAV_KEY));}
export function priceItemById(id){return INK_PRODUCTS.find(item=>item.id===id);}

const ALL_COLORS=(()=>{
  const result=[];
  const seen=new Set();
  for(const color of [...INK_INVENTORY_COLORS,...INK_STORE_COLORS]){
    const key=[normalize(color.brandEn||color.brandKo),color.form,normalize(color.nameKo||color.nameEn)].join('|');
    if(!key||seen.has(key))continue;
    seen.add(key);
    result.push(color);
  }
  return result;
})();

export function colorById(id){return ALL_COLORS.find(item=>item.id===id);}
export function colorCount(){return ALL_COLORS.length;}

export function brandGroups(){
  const map=new Map();
  const ensure=(brandKo,brandEn)=>{
    const key=brandEn||brandKo||'Other';
    if(!map.has(key))map.set(key,{id:normalize(key),brandKo:brandKo||brandEn,brandEn:brandEn||brandKo,priceItems:[],colors:[],keywords:[]});
    return map.get(key);
  };
  INK_PRODUCTS.forEach(item=>{const group=ensure(item.brandKo,item.brandEn);group.priceItems.push(item);group.keywords.push(...(item.keywords||[]));});
  ALL_COLORS.forEach(color=>{
    const group=ensure(color.brandKo,color.brandEn);
    group.colors.push(color);
    group.keywords.push(color.nameKo,color.nameEn,color.nameJa,color.nameZhHans,color.nameZhHant,color.form,color.volume||'',color.productTitle||'');
  });
  return[...map.values()];
}

export function matchedGroups(query=''){
  const value=normalize(query);
  const fav=getFavorites();
  return brandGroups().map(group=>{
    if(!value)return{...group,visiblePrices:group.priceItems,visibleColors:group.colors};
    const brandHit=normalize([group.brandKo,group.brandEn,...group.keywords].join(' ')).includes(value);
    const visiblePrices=brandHit?group.priceItems:group.priceItems.filter(item=>normalize([item.productKo,item.productEn,...(item.keywords||[])].join(' ')).includes(value));
    const visibleColors=brandHit?group.colors:group.colors.filter(color=>normalize([color.nameKo,color.nameEn,color.nameJa,color.nameZhHans,color.nameZhHant,color.form,color.productTitle||''].join(' ')).includes(value));
    return{...group,visiblePrices,visibleColors};
  }).filter(group=>group.visiblePrices.length||group.visibleColors.length).sort((a,b)=>Number(fav.has(b.id))-Number(fav.has(a.id))||Number(b.colors.length>0)-Number(a.colors.length>0)||brandName(a).localeCompare(brandName(b)));
}

const PRICE_RULES=[
  {tests:['카멜레온','starbright','star bright'],picks:['카멜레온','starbright','star bright']},
  {tests:['쉬머','shimmer','glistening','glitter','sparkle','펄','pearl'],picks:['쉬머','shimmer','shake','pearl']},
  {tests:['캘리그라피','calligraphy'],picks:['캘리그라피','calligraphy']},
  {tests:['센티드','scented'],picks:['센티드','scented']},
  {tests:['피그먼트','pigment'],picks:['피그먼트','pigment']},
  {tests:['카본','carbon'],picks:['카본','carbon']},
  {tests:['만요','manyo'],picks:['만요','manyo']},
  {tests:['잉크스튜디오','inkstudio','스튜디오'],picks:['스튜디오','studio']},
  {tests:['시키오리','shikiori'],picks:['시키오리','shikiori']},
  {tests:['유라메쿠','yurameku'],picks:['유라메쿠','yurameku']},
  {tests:['젠틀','gentle'],picks:['젠틀','gentle']},
  {tests:['킹덤노트','kingdomnote'],picks:['킹덤','kingdom']},
  {tests:['이로시주쿠','iroshizuku'],picks:['이로시주쿠','iroshizuku']},
  {tests:['에델슈타인','edelstein'],picks:['에델슈타인','edelstein']},
  {tests:['4001'],picks:['4001']},
  {tests:['150주년','150th'],picks:['150','anniversary']},
  {tests:['100주년','100th'],picks:['100','anniversary']},
  {tests:['반고흐','vangogh'],picks:['반고흐','vangogh']},
  {tests:['1670','1798','350'],picks:['1670','1798','350']},
  {tests:['아티스트','artist'],picks:['아티스트','artist']},
  {tests:['그리스신화','greekmyth'],picks:['그리스','greek']},
  {tests:['매직포춘','magicfortune'],picks:['매직','magic']},
  {tests:['타이완티','taiwantea'],picks:['타이완','taiwan']},
  {tests:['인디고','indigo'],picks:['인디고','indigo']},
  {tests:['카사네','kasane'],picks:['카사네','kasane']},
  {tests:['22ml'],picks:['22ml']},
  {tests:['32ml'],picks:['32ml']},
  {tests:['30ml'],picks:['30ml']},
  {tests:['60ml'],picks:['60ml']},
  {tests:['90ml'],picks:['90ml']}
];

function itemText(item){return normalize([item.productKo,item.productEn,...(item.keywords||[])].join(' '));}
export function priceItemForColor(color,group){
  const items=group?.priceItems||brandGroups().find(candidate=>normalize(candidate.brandEn)===normalize(color.brandEn))?.priceItems||[];
  if(!items.length)return null;
  if(items.length===1)return items[0];
  const source=normalize([color.productTitle,color.nameKo,color.nameEn,color.volume].join(' '));
  for(const rule of PRICE_RULES){
    if(!rule.tests.some(test=>source.includes(normalize(test))))continue;
    const match=items.find(item=>rule.picks.some(pick=>itemText(item).includes(normalize(pick))));
    if(match)return match;
    return null;
  }
  const standard=items.find(item=>/standard|스탠다드/.test([item.productKo,item.productEn].join(' ').toLowerCase()));
  return standard||null;
}

export function toggleFavorite(id){const values=getFavorites();values.has(id)?values.delete(id):values.add(id);write(FAV_KEY,[...values]);}
export function isColorSelected(id){return getList().some(entry=>entry.type==='color'&&entry.colorId===id);}
export function isColorPriceSelected(id,volume){return getList().some(entry=>entry.type==='color-price'&&entry.colorId===id&&entry.volume===volume);}
export function isPriceSelected(id,volume){return getList().some(entry=>entry.type==='price'&&entry.itemId===id&&entry.volume===volume);}
export function addColor(color){const values=getList();if(!values.some(entry=>entry.type==='color'&&entry.colorId===color.id))values.push({type:'color',colorId:color.id,addedAt:Date.now()});write(LIST_KEY,values);}
export function addColorPrice(color,item,volume){const values=getList();if(!values.some(entry=>entry.type==='color-price'&&entry.colorId===color.id&&entry.volume===volume))values.push({type:'color-price',colorId:color.id,itemId:item.id,volume,price:priceFor(item,volume),addedAt:Date.now()});write(LIST_KEY,values);}
export function addPrice(item,volume){const values=getList();if(!values.some(entry=>entry.type==='price'&&entry.itemId===item.id&&entry.volume===volume))values.push({type:'price',itemId:item.id,volume,price:priceFor(item,volume),addedAt:Date.now()});write(LIST_KEY,values);}
export function removeListItem(index){const values=getList();values.splice(index,1);write(LIST_KEY,values);}
export function clearList(){write(LIST_KEY,[]);}
export function listTotal(){return getList().reduce((sum,entry)=>sum+Number(entry.price||0),0);}
export function shareLines(){
  return getList().map((entry,index)=>{
    if(entry.type==='color'){const color=colorById(entry.colorId);return`${index+1}. ${color?.brandKo||''} · ${color?.nameKo||entry.colorId} · ${color?formName(color):''} · ${copy().unknownPrice}`;}
    if(entry.type==='color-price'){
      const color=colorById(entry.colorId);
      return`${index+1}. ${color?.brandKo||''} · ${color?.nameKo||entry.colorId} · ${entry.volume} · ${formatPrice(entry.price)}`;
    }
    const item=priceItemById(entry.itemId);return`${index+1}. ${item?.brandKo||''} · ${item?.productKo||entry.itemId} · ${entry.volume} · ${formatPrice(entry.price)}`;
  });
}
export{formatWon};
