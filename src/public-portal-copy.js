import './public-ui-v52.js';

const publicPortalIntro={
  ko:'매장에서 필요한 고객 안내를 한곳에서 빠르게 확인해 보세요.',
  en:'Open customer-facing store guides from one place.',
  ja:'店頭で必要なお客様向け案内を一か所から確認できます。',
  'zh-Hans':'从一个入口快速查看面向顾客的门店指南。',
  'zh-Hant':'從一個入口快速查看面向顧客的門市指南。'
};

function currentLanguage(){
  const value=(new URLSearchParams(location.search).get('lang')||localStorage.getItem('blueblack-language')||navigator.language||'ko').toLowerCase();
  if(value.includes('hant')||value.startsWith('zh-tw')||value.startsWith('zh-hk'))return'zh-Hant';
  if(value.startsWith('zh'))return'zh-Hans';
  if(value.startsWith('ja'))return'ja';
  if(value.startsWith('en'))return'en';
  return'ko';
}

function cleanPublicPortal(){
  // 고객용 메인에서는 직원용 진입점과 직원 전용 패널을 완전히 제거합니다.
  document.querySelectorAll(
    'a[href="./staff/"],a[href$="/staff/"],a[href="./admin/"],a[href$="/admin/"],a[href="./admin.html"],a[href$="/admin.html"],a[href="./service/"],a[href$="/service/"]'
  ).forEach(node=>node.remove());

  document.querySelectorAll('.bb-home-mode,[data-bb-home-panel="staff"],.bb-staff-panel').forEach(node=>node.remove());

  const customer=document.querySelector('[data-bb-home-panel="customer"]');
  if(customer){
    customer.hidden=false;
    customer.removeAttribute('hidden');
    customer.classList.add('bb-public-customer-panel');
  }

  try{localStorage.removeItem('bb-home-mode-v60');}catch{}

  const intro=document.querySelector('[data-portal-t="portalIntro"]');
  if(intro)intro.textContent=publicPortalIntro[currentLanguage()]||publicPortalIntro.ko;
}

let cleanQueued=false;
function queueClean(){
  if(cleanQueued)return;
  cleanQueued=true;
  queueMicrotask(()=>{
    cleanQueued=false;
    cleanPublicPortal();
  });
}

document.querySelectorAll('[data-portal-lang]').forEach(button=>button.addEventListener('click',queueClean));
new MutationObserver(queueClean).observe(document.body,{childList:true,subtree:true});
cleanPublicPortal();
setTimeout(cleanPublicPortal,0);
setTimeout(cleanPublicPortal,120);
