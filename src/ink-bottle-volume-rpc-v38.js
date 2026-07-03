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

function existingBadge(card){return card.querySelector('.ink-bottle-info');}
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
  const currentVolume=existingBadge(card)?.querySelector('strong')?.textContent?.trim()||'';
  if(currentVolume&&currentVolume!=='—'&&!/용량|확인|조회/.test(currentVolume)){publishVolume(card,currentVolume);return;}
  pending.add(itemId);
  try{
    const volume=await fetchVolume(itemId);
    if(!volume)return;
    document.querySelectorAll(`.ink-store-result[data-item-id="${CSS.escape(itemId)}"]`).forEach(node=>{
      const target=existingBadge(node)?.querySelector('strong');
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
  }).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden']});
  window.addEventListener('blueblack:ink-results-rendered',scan);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
