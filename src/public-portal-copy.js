const publicPortalIntro={
  ko:'매장에서 필요한 고객 안내와 상담 도구를 한곳에서 빠르게 확인해 보세요.',
  en:'Open customer-facing store guides and consultation tools from one place.',
  ja:'店頭で必要なお客様向け案内と接客ツールを一か所から確認できます。',
  'zh-Hans':'从一个入口快速查看面向顾客的门店指南和咨询工具。',
  'zh-Hant':'從一個入口快速查看面向顧客的門市指南與諮詢工具。'
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
  document.querySelectorAll('a[href="./staff/"],a[href$="/staff/"],a[href="./service/"],a[href$="/service/"]').forEach(node=>node.remove());
  const intro=document.querySelector('[data-portal-t="portalIntro"]');
  if(intro)intro.textContent=publicPortalIntro[currentLanguage()]||publicPortalIntro.ko;
}

document.querySelectorAll('[data-portal-lang]').forEach(button=>button.addEventListener('click',()=>queueMicrotask(cleanPublicPortal)));
cleanPublicPortal();
import('./portal-closing-notice.js?v=1');