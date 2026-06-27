import { getLanguage } from './i18n-v3.js';

if(!document.querySelector('link[data-store-recovery-v12]')){
  const link=document.createElement('link');
  link.rel='stylesheet';
  link.href='./store-recovery-v12.css';
  link.dataset.storeRecoveryV12='true';
  document.head.append(link);
}

const copy={
  ko:{ready:'3D 실시간 미리보기',retry:'3D 다시 불러오기'},
  en:{ready:'Live 3D preview',retry:'Reload 3D'},
  ja:{ready:'3Dリアルタイムプレビュー',retry:'3Dを再読み込み'},
  'zh-Hans':{ready:'3D实时预览',retry:'重新加载3D'},
  'zh-Hant':{ready:'3D即時預覽',retry:'重新載入3D'}
};
const text=()=>copy[getLanguage()]||copy.ko;
let wakeLock=null;
async function requestWakeLock(){if(!('wakeLock' in navigator))return;try{wakeLock=await navigator.wakeLock.request('screen');}catch{}}
function addReadyBadge(){const stage=document.querySelector('#viewer-stage');if(!stage)return;let badge=stage.querySelector('.viewer-quality-badge');if(!badge){badge=document.createElement('div');badge.className='viewer-quality-badge';stage.append(badge);}badge.textContent=text().ready;}
function addRetry(){const error=document.querySelector('#viewer-error');if(!error)return;let button=error.parentElement.querySelector('.viewer-error-action');if(!button){button=document.createElement('button');button.type='button';button.className='viewer-error-action';button.addEventListener('click',()=>location.reload());error.insertAdjacentElement('afterend',button);}button.textContent=text().retry;}
function refreshLanguage(){addReadyBadge();addRetry();}
addEventListener('viewerstatus',event=>{if(event.detail.status==='ready')addReadyBadge();if(event.detail.status==='error')addRetry();});
document.addEventListener('pointerdown',requestWakeLock,{once:true,passive:true});
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&wakeLock===null)requestWakeLock();});
document.querySelectorAll('[data-language]').forEach(button=>button.addEventListener('click',()=>setTimeout(refreshLanguage,40)));
setTimeout(()=>{if(window.blueblackPenApp?.ready)addReadyBadge();},150);
