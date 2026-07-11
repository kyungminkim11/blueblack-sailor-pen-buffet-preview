const NAV_LABELS={
  ko:{home:'홈',pen:'펜뷔페',store:'매장',ink:'잉크',more:'더보기'},
  en:{home:'Home',pen:'Pen Buffet',store:'Store',ink:'Ink',more:'More'},
  ja:{home:'ホーム',pen:'ペンビュッフェ',store:'店舗',ink:'インク',more:'その他'},
  'zh-Hans':{home:'首页',pen:'钢笔配色',store:'门店',ink:'墨水',more:'更多'},
  'zh-Hant':{home:'首頁',pen:'鋼筆配色',store:'門市',ink:'墨水',more:'更多'},
  vi:{home:'Trang chủ',pen:'Phối bút',store:'Cửa hàng',ink:'Mực',more:'Thêm'},
  id:{home:'Beranda',pen:'Rakit Pena',store:'Toko',ink:'Tinta',more:'Lainnya'},
  th:{home:'หน้าแรก',pen:'จัดสีปากกา',store:'ร้านค้า',ink:'หมึก',more:'เพิ่มเติม'}
};

function normalizeLanguage(value=''){
  const text=String(value).toLowerCase();
  if(text.includes('hant')||text.startsWith('zh-tw')||text.startsWith('zh-hk')||text.startsWith('zh-mo'))return'zh-Hant';
  if(text.startsWith('zh'))return'zh-Hans';
  if(text.startsWith('vi'))return'vi';
  if(text.startsWith('id'))return'id';
  if(text.startsWith('th'))return'th';
  if(text.startsWith('ja'))return'ja';
  if(text.startsWith('en'))return'en';
  return'ko';
}

function currentLanguage(){
  const query=normalizeLanguage(new URLSearchParams(location.search).get('lang')||'');
  if(new URLSearchParams(location.search).has('lang'))return query;
  return normalizeLanguage(document.documentElement.lang||navigator.language||'ko');
}

function translateNavigation(language){
  const labels=NAV_LABELS[language]||NAV_LABELS.ko;
  document.querySelectorAll('[data-mobile-nav-label]').forEach(node=>{
    const key=node.dataset.mobileNavLabel;
    if(labels[key])node.textContent=labels[key];
  });
  const nav=document.querySelector('.mobile-app-nav');
  if(nav)nav.setAttribute('aria-label',language==='ko'?'하단 주요 메뉴':'Primary navigation');
}

function preserveLanguage(language){
  document.querySelectorAll('[data-mobile-link]').forEach(link=>{
    const href=link.getAttribute('href');
    if(!href||href.startsWith('#'))return;
    const url=new URL(href,location.href);
    if(url.origin!==location.origin)return;
    url.searchParams.set('lang',language);
    link.href=url.href;
  });
}

function registerServiceWorker(){
  if(!('serviceWorker'in navigator)||!/^https?:$/.test(location.protocol))return;
  window.addEventListener('load',()=>{
    navigator.serviceWorker.register('./sw.js',{scope:'./'}).catch(error=>console.warn('Service worker registration failed',error));
  },{once:true});
}

function init(){
  const language=currentLanguage();
  translateNavigation(language);
  preserveLanguage(language);
  document.documentElement.dataset.mobileAppShell='ready';
  registerServiceWorker();
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
