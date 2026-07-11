const APP_ROOT=new URL('../',import.meta.url);
const RECENT_KEY='blueblack-mobile-recents-v1';
const INSTALL_DISMISS_KEY='blueblack-install-dismissed-at';
const INSTALL_HIDE_DAYS=14;

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

const COPY={
  ko:{recent:'최근 사용',recentBody:'방금 확인한 메뉴를 바로 다시 열 수 있어요.',installTitle:'앱처럼 더 빠르게 열기',installBody:'홈 화면에 추가하면 주소창 없이 바로 실행할 수 있습니다.',install:'홈 화면에 추가',ios:'Safari의 공유 버튼을 누른 뒤 ‘홈 화면에 추가’를 선택해 주세요.',close:'닫기',offline:'오프라인 모드',online:'인터넷 연결 복구',update:'새 버전이 준비되었습니다.',refresh:'업데이트'},
  en:{recent:'Recently used',recentBody:'Open the guides you viewed most recently.',installTitle:'Open it like an app',installBody:'Add this guide to your home screen for faster, full-screen access.',install:'Add to home screen',ios:'In Safari, tap Share and choose “Add to Home Screen”.',close:'Close',offline:'Offline mode',online:'Back online',update:'A new version is ready.',refresh:'Update'},
  ja:{recent:'最近使ったメニュー',recentBody:'直前に確認した案内をすぐに開けます。',installTitle:'アプリのようにすばやく開く',installBody:'ホーム画面に追加すると、全画面ですぐに起動できます。',install:'ホーム画面に追加',ios:'Safariの共有ボタンから「ホーム画面に追加」を選択してください。',close:'閉じる',offline:'オフラインモード',online:'接続が復旧しました',update:'新しいバージョンがあります。',refresh:'更新'},
  'zh-Hans':{recent:'最近使用',recentBody:'快速重新打开刚刚查看的页面。',installTitle:'像应用一样快速打开',installBody:'添加到主屏幕后可全屏快速启动。',install:'添加到主屏幕',ios:'请在 Safari 中点击分享，再选择“添加到主屏幕”。',close:'关闭',offline:'离线模式',online:'网络已恢复',update:'新版本已准备好。',refresh:'更新'},
  'zh-Hant':{recent:'最近使用',recentBody:'快速重新開啟剛剛查看的頁面。',installTitle:'像 App 一樣快速開啟',installBody:'加入主畫面後即可全螢幕快速啟動。',install:'加入主畫面',ios:'請在 Safari 點選分享，再選擇「加入主畫面」。',close:'關閉',offline:'離線模式',online:'網路已恢復',update:'新版本已準備好。',refresh:'更新'},
  vi:{recent:'Đã dùng gần đây',recentBody:'Mở lại nhanh các hướng dẫn vừa xem.',installTitle:'Mở nhanh như ứng dụng',installBody:'Thêm vào màn hình chính để mở toàn màn hình nhanh hơn.',install:'Thêm vào màn hình chính',ios:'Trong Safari, chạm Chia sẻ rồi chọn “Thêm vào Màn hình chính”.',close:'Đóng',offline:'Chế độ ngoại tuyến',online:'Đã kết nối lại',update:'Đã có phiên bản mới.',refresh:'Cập nhật'},
  id:{recent:'Baru digunakan',recentBody:'Buka kembali panduan yang baru dilihat.',installTitle:'Buka lebih cepat seperti aplikasi',installBody:'Tambahkan ke layar utama untuk akses layar penuh.',install:'Tambahkan ke layar utama',ios:'Di Safari, ketuk Bagikan lalu pilih “Tambahkan ke Layar Utama”.',close:'Tutup',offline:'Mode offline',online:'Koneksi pulih',update:'Versi baru tersedia.',refresh:'Perbarui'},
  th:{recent:'ใช้ล่าสุด',recentBody:'เปิดเมนูที่เพิ่งดูอีกครั้งได้ทันที',installTitle:'เปิดได้รวดเร็วเหมือนแอป',installBody:'เพิ่มไปยังหน้าจอหลักเพื่อเปิดแบบเต็มหน้าจอ',install:'เพิ่มไปยังหน้าจอหลัก',ios:'ใน Safari ให้แตะแชร์ แล้วเลือก “เพิ่มไปยังหน้าจอโฮม”',close:'ปิด',offline:'โหมดออฟไลน์',online:'เชื่อมต่ออินเทอร์เน็ตแล้ว',update:'มีเวอร์ชันใหม่พร้อมใช้งาน',refresh:'อัปเดต'}
};

const PAGE_META={
  'pen-buffet':{icon:'✒',names:{ko:'세일러 펜뷔페',en:'Pen Buffet',ja:'ペンビュッフェ','zh-Hans':'钢笔配色','zh-Hant':'鋼筆配色',vi:'Phối bút',id:'Rakit Pena',th:'จัดสีปากกา'}},
  'store-guide':{icon:'⌖',names:{ko:'매장 안내',en:'Store guide',ja:'店舗案内','zh-Hans':'门店指南','zh-Hant':'門市指南',vi:'Hướng dẫn cửa hàng',id:'Panduan toko',th:'คู่มือร้านค้า'}},
  'ink-price':{icon:'◉',names:{ko:'잉크 소분 안내',en:'Ink guide',ja:'インク案内','zh-Hans':'墨水指南','zh-Hant':'墨水指南',vi:'Hướng dẫn mực',id:'Panduan tinta',th:'คู่มือหมึก'}},
  'review-event':{icon:'5',names:{ko:'영수증 리뷰 이벤트',en:'Review event',ja:'レビューイベント','zh-Hans':'评价活动','zh-Hant':'評論活動',vi:'Sự kiện đánh giá',id:'Acara ulasan',th:'กิจกรรมรีวิว'}},
  news:{icon:'N',names:{ko:'블루블랙 최신 소식',en:'BlueBlack news',ja:'BlueBlackのお知らせ','zh-Hans':'BlueBlack 消息','zh-Hant':'BlueBlack 消息',vi:'Tin BlueBlack',id:'Berita BlueBlack',th:'ข่าว BlueBlack'}},
  'official-guide':{icon:'A',names:{ko:'공식 정보 안내',en:'Official guide',ja:'公式情報案内','zh-Hans':'官方信息','zh-Hant':'官方資訊',vi:'Thông tin chính thức',id:'Panduan resmi',th:'ข้อมูลทางการ'}},
  'engraving-guide':{icon:'Aa',names:{ko:'각인 안내',en:'Engraving guide',ja:'名入れ案内','zh-Hans':'刻字指南','zh-Hant':'刻字指南',vi:'Hướng dẫn khắc',id:'Panduan ukir',th:'คู่มือสลัก'}},
  'as-guide':{icon:'AS',names:{ko:'A/S 안내',en:'Service guide',ja:'修理案内','zh-Hans':'售后指南','zh-Hant':'售後指南',vi:'Hướng dẫn bảo hành',id:'Panduan servis',th:'คู่มือบริการ'}}
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

function relativePage(){
  return location.pathname.replace(APP_ROOT.pathname,'').replace(/^\/+|\/+$/g,'').toLowerCase().replace(/\/index\.html$/,'').replace(/^index\.html$/,'');
}

function pageKey(){
  const relative=relativePage();
  return Object.keys(PAGE_META).find(key=>relative===key||relative.startsWith(`${key}/`))||'';
}

function isHomePage(){
  const relative=relativePage();
  return !relative;
}

function isCustomerPage(){
  const path=location.pathname.toLowerCase();
  const query=new URLSearchParams(location.search);
  if(/\/(admin|staff)(\/|\.html|$)/.test(path))return false;
  if(path.includes('/pen-buffet/'))return false;
  if(query.get('staff')==='1'||query.get('admin')==='1'||query.get('mode')==='store')return false;
  return true;
}

function safeRead(key,fallback){
  try{return JSON.parse(localStorage.getItem(key)||'')||fallback;}catch{return fallback;}
}

function safeWrite(key,value){
  try{localStorage.setItem(key,JSON.stringify(value));}catch{}
}

function ensureStyles(){
  if([...document.styleSheets].some(sheet=>String(sheet.href||'').includes('portal-mobile-app.css')))return;
  const link=document.createElement('link');
  link.rel='stylesheet';
  link.href=new URL('src/portal-mobile-app.css?v=3',APP_ROOT).href;
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
  const relative=relativePage();
  if(!relative)return'home';
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

function preserveLanguage(root,language){
  root.querySelectorAll('[data-mobile-link]').forEach(link=>{
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

function rememberCurrentPage(){
  const key=pageKey();
  if(!key)return;
  const current={key,href:new URL(`${key}/`,APP_ROOT).href,usedAt:Date.now()};
  const recents=safeRead(RECENT_KEY,[]).filter(item=>item?.key&&item.key!==key);
  safeWrite(RECENT_KEY,[current,...recents].slice(0,4));
}

function renderRecent(language){
  if(!isHomePage()||document.querySelector('.mobile-recent'))return;
  const recents=safeRead(RECENT_KEY,[]).filter(item=>PAGE_META[item?.key]).slice(0,3);
  if(!recents.length)return;
  const copy=COPY[language]||COPY.ko;
  const section=document.createElement('section');
  section.className='mobile-recent';
  section.setAttribute('aria-label',copy.recent);
  section.innerHTML=`<div class="mobile-recent-head"><div><small>CONTINUE</small><h2>${copy.recent}</h2></div><p>${copy.recentBody}</p></div><div class="mobile-recent-list"></div>`;
  const list=section.querySelector('.mobile-recent-list');
  recents.forEach(item=>{
    const meta=PAGE_META[item.key];
    const link=document.createElement('a');
    link.className='mobile-recent-card';
    link.dataset.mobileLink='true';
    link.href=new URL(`${item.key}/`,APP_ROOT).href;
    link.innerHTML=`<span class="mobile-recent-icon">${meta.icon}</span><span>${meta.names[language]||meta.names.ko}</span><b aria-hidden="true">→</b>`;
    list.append(link);
  });
  document.querySelector('#home-tools')?.insertAdjacentElement('beforebegin',section);
  preserveLanguage(section,language);
}

function isStandalone(){
  return matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
}

function installPromptDismissed(){
  try{
    const value=Number(localStorage.getItem(INSTALL_DISMISS_KEY)||0);
    return value>0&&Date.now()-value<INSTALL_HIDE_DAYS*86400000;
  }catch{return false;}
}

function renderInstallCard(language,mode,installEvent){
  if(!isHomePage()||isStandalone()||installPromptDismissed()||document.querySelector('.mobile-install-card'))return;
  const copy=COPY[language]||COPY.ko;
  const card=document.createElement('aside');
  card.className='mobile-install-card';
  card.innerHTML=`<span class="mobile-install-icon" aria-hidden="true">BB</span><div class="mobile-install-copy"><strong>${copy.installTitle}</strong><p>${mode==='ios'?copy.ios:copy.installBody}</p></div><button type="button" class="mobile-install-action">${copy.install}</button><button type="button" class="mobile-install-close" aria-label="${copy.close}">×</button>`;
  const close=()=>{
    try{localStorage.setItem(INSTALL_DISMISS_KEY,String(Date.now()));}catch{}
    card.remove();
  };
  card.querySelector('.mobile-install-close').addEventListener('click',close);
  card.querySelector('.mobile-install-action').addEventListener('click',async()=>{
    if(mode==='ios'){
      card.classList.toggle('show-instruction');
      card.querySelector('.mobile-install-copy p').textContent=copy.ios;
      return;
    }
    if(!installEvent)return;
    await installEvent.prompt();
    const result=await installEvent.userChoice;
    if(result.outcome==='accepted')card.remove();
  });
  document.querySelector('.portal-hero')?.insertAdjacentElement('afterend',card);
}

function setupInstallPrompt(language){
  if(!isHomePage()||isStandalone())return;
  const isIos=/iphone|ipad|ipod/i.test(navigator.userAgent)&&!window.MSStream;
  if(isIos){renderInstallCard(language,'ios',null);return;}
  window.addEventListener('beforeinstallprompt',event=>{
    event.preventDefault();
    renderInstallCard(language,'prompt',event);
  },{once:true});
  window.addEventListener('appinstalled',()=>document.querySelector('.mobile-install-card')?.remove(),{once:true});
}

function statusPill(){
  let pill=document.querySelector('.mobile-network-pill');
  if(!pill){
    pill=document.createElement('div');
    pill.className='mobile-network-pill';
    pill.setAttribute('role','status');
    pill.setAttribute('aria-live','polite');
    document.body.append(pill);
  }
  return pill;
}

function showStatus(message,state='neutral',timeout=2600){
  const pill=statusPill();
  pill.textContent=message;
  pill.dataset.state=state;
  pill.classList.add('is-visible');
  clearTimeout(showStatus.timer);
  if(timeout)showStatus.timer=setTimeout(()=>pill.classList.remove('is-visible'),timeout);
}

function setupNetworkStatus(language){
  const copy=COPY[language]||COPY.ko;
  if(!navigator.onLine)showStatus(copy.offline,'offline',0);
  window.addEventListener('offline',()=>showStatus(copy.offline,'offline',0));
  window.addEventListener('online',()=>showStatus(copy.online,'online',2200));
}

function setupScrollPolish(){
  const sync=()=>document.documentElement.classList.toggle('mobile-page-scrolled',scrollY>10);
  sync();
  addEventListener('scroll',sync,{passive:true});
}

function setupKeyboardAwareness(){
  if(!window.visualViewport)return;
  const initialHeight=window.visualViewport.height;
  const sync=()=>{
    const keyboardOpen=initialHeight-window.visualViewport.height>150;
    document.documentElement.classList.toggle('mobile-keyboard-open',keyboardOpen);
  };
  visualViewport.addEventListener('resize',sync);
  visualViewport.addEventListener('scroll',sync);
}

function setupPressTracking(){
  document.addEventListener('click',event=>{
    const link=event.target.closest('a[href]');
    if(!link)return;
    const url=new URL(link.href,location.href);
    if(url.origin!==location.origin)return;
    const relative=url.pathname.replace(APP_ROOT.pathname,'').replace(/^\/+|\/+$/g,'').toLowerCase();
    const key=Object.keys(PAGE_META).find(item=>relative===item||relative.startsWith(`${item}/`));
    if(!key)return;
    const recents=safeRead(RECENT_KEY,[]).filter(item=>item?.key&&item.key!==key);
    safeWrite(RECENT_KEY,[{key,href:url.href,usedAt:Date.now()},...recents].slice(0,4));
  },{capture:true});
}

function showUpdate(registration,language){
  if(document.querySelector('.mobile-update-pill'))return;
  const copy=COPY[language]||COPY.ko;
  const pill=document.createElement('div');
  pill.className='mobile-update-pill';
  pill.innerHTML=`<span>${copy.update}</span><button type="button">${copy.refresh}</button>`;
  pill.querySelector('button').addEventListener('click',()=>registration.waiting?.postMessage({type:'SKIP_WAITING'}));
  document.body.append(pill);
}

function registerServiceWorker(language){
  if(!('serviceWorker'in navigator)||!/^https?:$/.test(location.protocol)||window.__blueblackMobileSwRegistered)return;
  window.__blueblackMobileSwRegistered=true;
  window.addEventListener('load',async()=>{
    try{
      const registration=await navigator.serviceWorker.register(new URL('sw.js',APP_ROOT).href,{scope:APP_ROOT.pathname});
      if(registration.waiting&&navigator.serviceWorker.controller)showUpdate(registration,language);
      registration.addEventListener('updatefound',()=>{
        const worker=registration.installing;
        worker?.addEventListener('statechange',()=>{
          if(worker.state==='installed'&&navigator.serviceWorker.controller)showUpdate(registration,language);
        });
      });
      navigator.serviceWorker.addEventListener('controllerchange',()=>{
        if(sessionStorage.getItem('blueblack-sw-reloading'))return;
        sessionStorage.setItem('blueblack-sw-reloading','1');
        location.reload();
      });
    }catch(error){console.warn('Service worker registration failed',error);}
  },{once:true});
}

function init(){
  if(!isCustomerPage())return;
  ensureStyles();
  const language=currentLanguage();
  const nav=ensureNavigation();
  translateNavigation(nav,language);
  preserveLanguage(nav,language);
  markActive(nav);
  rememberCurrentPage();
  renderRecent(language);
  setupInstallPrompt(language);
  setupNetworkStatus(language);
  setupScrollPolish();
  setupKeyboardAwareness();
  setupPressTracking();
  document.documentElement.dataset.mobileAppShell='ready';
  registerServiceWorker(language);
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
