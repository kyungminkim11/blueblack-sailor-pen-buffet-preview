import {
  colorById,
  currentLang,
  priceItemById
} from './ink-catalog-model-v22.js';

const SUPABASE_URL='https://jnciddblcndmthmmvqrz.supabase.co';
const SUPABASE_KEY='sb_publishable_UUzSE7O9wqI0WN9cKG9OAQ_VleRkL4I';
const COPY={
  ko:{label:'본병'},
  en:{label:'Bottle'},
  ja:{label:'本体'},
  'zh-Hans':{label:'整瓶'},
  'zh-Hant':{label:'整瓶'}
};

const cache=new Map();
const inFlight=new Set();
let scheduleTimer=0;

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
function removeInfo(card){
  card.querySelector('.ink-bottle-info')?.remove();
  card.querySelector('.ink-store-result-copy')?.classList.remove('has-bottle-info');
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
  if(node.dataset.signature===signature)return;
  node.dataset.signature=signature;
  node.title=String(info.product_name||'');
  node.innerHTML=`<span>${text().label}</span><strong>${volume||'용량 확인'}</strong><em>${price||'가격 확인'}</em>`;
  copy.classList.add('has-bottle-info');
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
  style.dataset.inkBottlePriceStyle='v36';
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
  document.querySelectorAll('[data-portal-lang]').forEach(button=>button.addEventListener('click',()=>setTimeout(()=>{cache.clear();schedule();},80)));
  schedule();
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
else init();
