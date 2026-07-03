import {
  colorById,
  currentLang,
  priceItemById
} from './ink-catalog-model-v22.js';

const SUPABASE_URL='https://jnciddblcndmthmmvqrz.supabase.co';
const SUPABASE_KEY='sb_publishable_UUzSE7O9wqI0WN9cKG9OAQ_VleRkL4I';
const COPY={
  ko:{label:'본병',add:'본병 담기',selected:'담음',checking:'가격 확인 중'},
  en:{label:'Full bottle',add:'Add bottle',selected:'Added',checking:'Checking price'},
  ja:{label:'ボトル',add:'ボトルを追加',selected:'追加済み',checking:'価格確認中'},
  'zh-Hans':{label:'原装瓶',add:'加入原装瓶',selected:'已加入',checking:'正在查询价格'},
  'zh-Hant':{label:'原裝瓶',add:'加入原裝瓶',selected:'已加入',checking:'正在查詢價格'}
};

const cache=new Map();
const inFlight=new Set();
let scheduleTimer=0;
window.blueblackBottleCatalog=window.blueblackBottleCatalog||{};

function text(){return COPY[currentLang()]||COPY.ko;}
function formatWon(value){
  const number=Number(value);
  return Number.isFinite(number)&&number>0?`${number.toLocaleString('ko-KR')}원`:'';
}
function cardData(card){
  const itemId=card.dataset.itemId||'';
  const colorId=card.dataset.colorId||'';
  if(!itemId||!colorId)return null;
  const item=priceItemById(itemId);
  const color=colorById(colorId);
  if(!item||!color)return null;
  const key=`${itemId}:${colorId}`;
  return{
    key,
    item,
    color,
    query:{
      key,
      brandKo:color.brandKo||item.brandKo||'',
      brandEn:color.brandEn||item.brandEn||'',
      seriesKo:item.productKo||'',
      seriesEn:item.productEn||'',
      colorKo:color.nameKo||color.nameEn||'',
      colorEn:color.nameEn||color.nameKo||''
    }
  };
}
function setBottleButton(card,info){
  const button=card.querySelector('.ink-store-bottle-volume');
  if(!button)return;
  const value=text();
  const volume=String(info?.bottle_volume||info?.volume||'').trim();
  const price=Number(info?.bottle_price||info?.price||0);
  const productName=String(info?.product_name||info?.productName||'');
  const span=button.querySelector('span');
  const strong=button.querySelector('strong');
  const small=button.querySelector('small');
  if(!(price>0)){
    button.disabled=true;
    if(span)span.textContent=value.label;
    if(strong)strong.textContent='—';
    if(small)small.textContent=value.checking;
    return;
  }
  button.disabled=false;
  button.dataset.bottlePrice=String(price);
  button.dataset.bottleVolume=volume;
  button.dataset.productName=productName;
  if(span)span.textContent=`${value.label}${volume?` ${volume}`:''}`;
  if(strong)strong.textContent=formatWon(price);
  if(small)small.textContent=button.classList.contains('is-selected')?`✓ ${value.selected}`:value.add;
}
function removeInfo(card){
  setBottleButton(card,null);
  card.querySelector('.ink-bottle-info')?.remove();
  card.querySelector('.ink-store-result-copy')?.classList.remove('has-bottle-info');
}
function publishInfo(card,info){
  const itemId=card.dataset.itemId||'';
  const colorId=card.dataset.colorId||'';
  const price=Number(info?.bottle_price||0);
  if(!itemId||!colorId||!(price>0))return;
  const record={price,volume:String(info?.bottle_volume||''),productName:String(info?.product_name||'')};
  window.blueblackBottleCatalog[`${itemId}:${colorId}`]=record;
  setBottleButton(card,info);
  window.dispatchEvent(new CustomEvent('blueblack:bottle-info',{detail:{itemId,colorId,...record}}));
}
function applyInfo(card,info){
  if(!info){removeInfo(card);return;}
  const volume=String(info.bottle_volume||'').trim();
  const price=formatWon(info.bottle_price);
  if(!volume&&!price){removeInfo(card);return;}
  const copy=card.querySelector('.ink-store-result-copy');
  if(!copy)return;
  let node=copy.querySelector('.ink-bottle-info');
  if(!node){
    node=document.createElement('aside');
    node.className='ink-bottle-info';
    copy.append(node);
  }
  const signature=[text().label,volume,price,info.product_name||''].join('|');
  if(node.dataset.signature!==signature){
    node.dataset.signature=signature;
    node.title=String(info.product_name||'');
    node.innerHTML=`<span>${text().label}</span><strong>${volume||'—'}</strong><em>${price||'—'}</em>`;
  }
  copy.classList.add('has-bottle-info');
  publishInfo(card,info);
}
async function rpc(queries){
  const response=await fetch(`${SUPABASE_URL}/rest/v1/rpc/ink_bottle_prices_public`,{
    method:'POST',
    headers:{
      apikey:SUPABASE_KEY,
      Authorization:`Bearer ${SUPABASE_KEY}`,
      'Content-Type':'application/json'
    },
    body:JSON.stringify({p_queries:queries})
  });
  const data=await response.json().catch(()=>[]);
  if(!response.ok)throw new Error(data?.message||'Bottle price lookup failed');
  return Array.isArray(data)?data:[];
}
async function loadBatch(items){
  items.forEach(item=>inFlight.add(item.key));
  try{
    const rows=await rpc(items.map(item=>item.query));
    const rowMap=new Map(rows.map(row=>[row.query_key,row]));
    items.forEach(item=>cache.set(item.key,rowMap.get(item.key)||null));
  }catch(error){
    console.warn('[ink bottle price]',error);
    items.forEach(item=>cache.set(item.key,null));
  }finally{
    items.forEach(item=>inFlight.delete(item.key));
    applyAll();
  }
}
function applyAll(){
  const cards=[...document.querySelectorAll('.ink-store-result[data-item-id]')];
  const missing=new Map();
  cards.forEach(card=>{
    const data=cardData(card);
    if(!data){removeInfo(card);return;}
    if(cache.has(data.key)){applyInfo(card,cache.get(data.key));return;}
    setBottleButton(card,null);
    if(!inFlight.has(data.key))missing.set(data.key,data);
  });
  const values=[...missing.values()];
  for(let index=0;index<values.length;index+=40)loadBatch(values.slice(index,index+40));
}
function schedule(){
  clearTimeout(scheduleTimer);
  scheduleTimer=setTimeout(applyAll,80);
}
function addStyles(){
  if(document.querySelector('[data-ink-bottle-price-style]'))return;
  const style=document.createElement('style');
  style.dataset.inkBottlePriceStyle='v44';
  style.textContent=`
.ink-store-result-copy{position:relative;min-width:0}
.ink-store-result-copy.has-bottle-info{padding-right:112px}
.ink-bottle-info{position:absolute;top:0;right:0;display:grid;grid-template-columns:auto auto;grid-template-areas:'label volume' 'price price';align-items:center;gap:1px 6px;min-width:94px;padding:8px 9px;border:1px solid #ded5c7;border-radius:12px;background:linear-gradient(180deg,#fff,#f7f2e9);box-shadow:0 5px 14px rgba(16,35,63,.055);text-align:right;pointer-events:none}
.ink-bottle-info span{grid-area:label;color:#9a7138;font-size:9px;font-weight:900;letter-spacing:.04em}.ink-bottle-info strong{grid-area:volume;color:#566477;font-size:10px;font-weight:900}.ink-bottle-info em{grid-area:price;color:#10233f;font-size:12px;font-style:normal;font-weight:950;white-space:nowrap}
@media(max-width:680px){.ink-store-result-copy.has-bottle-info{padding-right:104px}.ink-bottle-info{min-width:88px;padding:7px 8px}.ink-bottle-info em{font-size:11px}}
@media(max-width:390px){.ink-store-result-copy.has-bottle-info{padding-right:0;padding-top:50px}.ink-bottle-info{left:0;right:auto;top:0;grid-template-columns:auto auto auto;grid-template-areas:'label volume price';min-width:0;text-align:left}.ink-bottle-info em{font-size:10px}}
`;
  document.head.append(style);
}
async function init(){
  addStyles();
  const root=await new Promise(resolve=>{
    const existing=document.querySelector('.ink-store-results');
    if(existing)return resolve(existing);
    const observer=new MutationObserver(()=>{
      const node=document.querySelector('.ink-store-results');
      if(node){observer.disconnect();resolve(node);}
    });
    observer.observe(document.body,{childList:true,subtree:true});
    setTimeout(()=>{observer.disconnect();resolve(document.querySelector('.ink-store-results'));},8000);
  });
  if(!root)return;
  new MutationObserver(schedule).observe(root,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden']});
  window.addEventListener('blueblack:ink-results-rendered',schedule);
  document.querySelectorAll('[data-portal-lang]').forEach(button=>button.addEventListener('click',()=>setTimeout(()=>{cache.clear();schedule();},80)));
  schedule();
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
else init();
