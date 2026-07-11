const APP_ROOT=new URL('../',import.meta.url);

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
  const params=new URLSearchParams(location.search);
  if(params.has('lang'))return normalizeLanguage(params.get('lang'));
  return normalizeLanguage(document.documentElement.lang||navigator.language||'ko');
}

function isCustomerPage(){
  const path=location.pathname.toLowerCase();
  const query=new URLSearchParams(location.search);
  if(/\/(admin|staff)(\/|\.html|$)/.test(path))return false;
  if(query.get('staff')==='1'||query.get('admin')==='1'||query.get('mode')==='store')return false;
  return true;
}

function ensureStyles(){
  if([...document.styleSheets].some(sheet=>String(sheet.href||'').includes('portal-mobile-app.css')))return;
  const link=document.createElement('link');
  link.rel='stylesheet';
  link.href=new URL('src/portal-mobile-app.css?v=2',APP_ROOT).href;
  link.dataset.mobileAppStyle='true';
  document.head.append(link);
}

function navigationMarkup(){
  return `
    <a href="${new URL('./',APP_ROOT).href}" data-mobile-link data-mobile-route="home">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 10.5 12 3.5l8.5 7v8.2a1.8 1.8 0 0 1-1.8 1.8H5.3a1.8 1.8 0 0 1-1.8-1.8z"/><path d="M9 20.5v-6h6v6"/></svg>
      <span data-mobile-nav-label="home">홈</span>
    </a>
    <a class="mobile-nav-pen" href="${new URL('pen-buffet/',APP_ROOT).href}" data-mobile-link data-mobile-route="pen">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14.5 4.5 5 5-8.7 8.7-6.3 1.3 1.3-6.3z"/><path d="m12.8 6.2 5 5M4.8 19.2l4.7-4.7"/></svg>
      <span data-mobile-nav-label="pen">펜뷔페</span>
    </a>
    <a href="${new URL('store-guide/',APP_ROOT).href}" data-mobile-link data-mobile-route="store">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 5.2-8 10.5-8 10.5S4 15.2 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>
      <span data-mobile-nav-label="store">매장</span>
    </a>
    <a href="${new URL('ink-price/',APP_ROOT).href}" data-mobile-link data-mobile-route="ink">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.2S6.2 10 6.2 14.6a5.8 5.8 0 0 0 11.6 0C17.8 10 12 3.2 12 3.2Z"/><path d="M9.5 16.2c.5 1 1.4 1.6 2.5 1.6"/></svg>
      <span data-mobile-nav-label="ink">잉크</span>
    </a>
    <a href="${new URL('./#site-map',APP_ROOT).href}" data-mobile-link data-mobile-route="more">
      <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="6" height="6" rx="1.5"/><rect x="14" y="4" width="6" height="6" rx="1.5"/><rect x="4" y="14" width="6" height="6" rx="1.5"/><rect x="14" y="14" width="6" height="6" rx="1.5"/></svg>
      <span data-mobile-nav-label="more">더보기</span>
    </a>`;
}

function ensureNavigation(){
  let nav=document.querySelector('.mobile-app-nav');
  if(!nav){
    nav=document.createElement('nav');
    nav.className='mobile-app-nav';
    nav.innerHTML=navigationMarkup();
    document.body.append(nav);
  }
  [...nav.querySelectorAll('a')].forEach((link,index)=>{
    if(!link.dataset.mobileRoute)link.dataset.mobileRoute=['home','pen','store','ink','more'][index]||'more';
  });
  return nav;
}

function activeRoute(){
  const relative=location.pathname.replace(APP_ROOT.pathname,'').replace(/^\/+|\/+$/g,'').toLowerCase();
  if(!relative||relative==='index.html')return'home';
  if(relative.startsWith('pen-buffet'))return'pen';
  if(relative.startsWith('store-guide')||relative.startsWith('store-tour')||relative.startsWith('store-map'))return'store';
  if(relative.startsWith('ink-price'))return'ink';
  return'more';
}

function translateNavigation(nav,language){
  const labels=NAV_LABELS[language]||NAV_LABELS.ko;
  nav.querySelectorAll('[data-mobile-nav-label]').forEach(node=>{
    const key=node.dataset.mobileNavLabel;
    if(labels[key])node.textContent=labels[key];
  });
  nav.setAttribute('aria-label',language==='ko'?'하단 주요 메뉴':'Primary navigation');
}

function preserveLanguage(nav,language){
  nav.querySelectorAll('[data-mobile-link]').forEach(link=>{
    const href=link.getAttribute('href');
    if(!href)return;
    const url=new URL(href,location.href);
    if(url.origin!==location.origin)return;
    url.searchParams.set('lang',language);
    link.href=url.href;
  });
}

function markActive(nav){
  const active=activeRoute();
  nav.querySelectorAll('[data-mobile-route]').forEach(link=>{
    if(link.dataset.mobileRoute===active)link.setAttribute('aria-current','page');
    else link.removeAttribute('aria-current');
  });
}

function registerServiceWorker(){
  if(!('serviceWorker'in navigator)||!/^https?:$/.test(location.protocol)||window.__blueblackMobileSwRegistered)return;
  window.__blueblackMobileSwRegistered=true;
  window.addEventListener('load',()=>{
    navigator.serviceWorker.register(new URL('sw.js',APP_ROOT).href,{scope:APP_ROOT.pathname}).catch(error=>console.warn('Service worker registration failed',error));
  },{once:true});
}

function init(){
  if(!isCustomerPage())return;
  ensureStyles();
  const nav=ensureNavigation();
  const language=currentLanguage();
  translateNavigation(nav,language);
  preserveLanguage(nav,language);
  markActive(nav);
  document.documentElement.dataset.mobileAppShell='ready';
  registerServiceWorker();
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
