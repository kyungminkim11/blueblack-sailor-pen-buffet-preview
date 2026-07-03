const SUPABASE_URL='https://jnciddblcndmthmmvqrz.supabase.co';
const SUPABASE_KEY='sb_publishable_UUzSE7O9wqI0WN9cKG9OAQ_VleRkL4I';
const cache=new Map();
const pending=new Set();
window.blueblackBottleCatalog=window.blueblackBottleCatalog||{};

async function fetchVolume(itemId){
  if(cache.has(itemId))return cache.get(itemId);
  const response=await fetch(`${SUPABASE_URL}/rest/v1/rpc/ink_bottle_volume_public`,{
    method:'POST',
    headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`,'Content-Type':'application/json'},
    body:JSON.stringify({p_item_id:itemId})
  });
  if(!response.ok)throw new Error('본병 용량 조회 실패');
  const value=await response.json();
  const volume=typeof value==='string'?value:'';
  cache.set(itemId,volume);
  return volume;
}

function ensureBadge(card){
  const copy=card.querySelector('.ink-store-result-copy');
  if(!copy)return null;
  let badge=copy.querySelector('.ink-bottle-info');
  if(!badge){
    badge=document.createElement('aside');
    badge.className='ink-bottle-info is-loading';
    badge.innerHTML='<span>본병</span><strong>—</strong><em>가격 확인</em>';
    copy.classList.add('has-bottle-info');
    copy.append(badge);
  }
  return badge;
}
function publishVolume(card,volume){
  const itemId=card.dataset.itemId||'';
  const colorId=card.dataset.colorId||'';
  if(!itemId||!colorId||!volume)return;
  const key=`${itemId}:${colorId}`;
  const current=window.blueblackBottleCatalog[key]||{};
  window.blueblackBottleCatalog[key]={...current,volume};
  const button=card.querySelector('.ink-store-bottle-volume');
  if(button){
    button.dataset.bottleVolume=volume;
    const label=button.querySelector('span');
    if(label&&!label.textContent.includes(volume))label.textContent=`${label.textContent.trim()} ${volume}`;
  }
  window.dispatchEvent(new CustomEvent('blueblack:bottle-info',{detail:{itemId,colorId,price:Number(current.price||0),volume,productName:String(current.productName||'')}}));
}

async function applyCard(card){
  const itemId=card.dataset.itemId||'';
  if(!itemId||pending.has(itemId))return;
  const badge=ensureBadge(card);
  const strong=badge?.querySelector('strong');
  if(!strong)return;
  const current=strong.textContent.trim();
  if(current&&current!=='—'&&!/용량|확인|조회/.test(current)){publishVolume(card,current);return;}
  pending.add(itemId);
  try{
    const volume=await fetchVolume(itemId);
    if(!volume)return;
    document.querySelectorAll(`.ink-store-result[data-item-id="${CSS.escape(itemId)}"]`).forEach(node=>{
      const target=ensureBadge(node)?.querySelector('strong');
      if(target)target.textContent=volume;
      publishVolume(node,volume);
    });
  }catch(error){
    console.warn('[ink bottle volume]',error);
  }finally{
    pending.delete(itemId);
  }
}

function scan(){document.querySelectorAll('.ink-store-result[data-item-id]').forEach(applyCard);}
function init(){
  scan();
  let queued=false;
  new MutationObserver(()=>{
    if(queued)return;
    queued=true;
    requestAnimationFrame(()=>{queued=false;scan();});
  }).observe(document.body,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['hidden']});
  window.addEventListener('blueblack:ink-results-rendered',scan);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
