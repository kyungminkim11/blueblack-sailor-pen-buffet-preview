import './global-ux-v60.js';
import './portal-mobile-app.js?v=2';

const BB_LANGUAGES={
  ko:{flag:'🇰🇷',label:'한국어',aria:'언어 선택'},
  en:{flag:'🇺🇸',label:'English',aria:'Choose language'},
  ja:{flag:'🇯🇵',label:'日本語',aria:'言語を選択'},
  'zh-Hans':{flag:'🇨🇳',label:'简体中文',aria:'选择语言'},
  'zh-Hant':{flag:'🇹🇼',label:'繁體中文',aria:'選擇語言'},
  vi:{flag:'🇻🇳',label:'Tiếng Việt',aria:'Chọn ngôn ngữ'},
  id:{flag:'🇮🇩',label:'Bahasa Indonesia',aria:'Pilih bahasa'},
  th:{flag:'🇹🇭',label:'ไทย',aria:'เลือกภาษา'}
};

const RESIDUAL_COPY={
  '고객은 필요한 내용을 직접 확인하고, 직원은 상담에 맞는 화면을 바로 열어 더 정확하게 안내할 수 있습니다.':{
    en:'Customers can check essential information themselves, while staff can open the right screen for clearer consultations.',
    ja:'お客様は必要な情報を直接確認でき、スタッフは接客内容に合った画面をすぐに開いて、より正確にご案内できます。',
    'zh-Hans':'顾客可自行查看所需信息，店员也能快速打开相应页面，提供更准确的说明。',
    'zh-Hant':'顧客可自行查看所需資訊，店員也能快速開啟相應頁面，提供更準確的說明。'
  },
  '1층·2층 안내도, 브랜드 위치, 주소, 영업시간과 방문 정보를 한곳에서 확인하세요.':{
    en:'Check store maps, brand locations, address, opening hours and visit information in one place.',
    ja:'店舗案内図、ブランド位置、住所、営業時間、来店情報をまとめて確認できます。',
    'zh-Hans':'集中查看门店导览图、品牌位置、地址、营业时间和到店信息。',
    'zh-Hant':'集中查看門市導覽圖、品牌位置、地址、營業時間與到店資訊。'
  },
  '브랜드와 시리즈별 잉크를 찾고, 5ml·10ml 소분 가격과 본병 정보를 비교하세요.':{
    en:'Find inks by brand and series, then compare 5ml and 10ml decant prices with full-bottle information.',
    ja:'ブランド・シリーズ別にインクを探し、5ml・10mlの小分け価格とボトル情報を比較できます。',
    'zh-Hans':'按品牌和系列查找墨水，并比较5ml、10ml分装价格与原装瓶信息。',
    'zh-Hant':'依品牌與系列查找墨水，並比較5ml、10ml分裝價格與原裝瓶資訊。'
  },
  '내자동 · B1·2·4층 · 경복궁역 인근':{
    en:'Naeja-dong · B1, 2F and 4F · Near Gyeongbokgung Station',
    ja:'内資洞 · B1・2階・4階 · 景福宮駅近く',
    'zh-Hans':'内资洞 · 地下一层、2层、4层 · 景福宫站附近',
    'zh-Hant':'內資洞 · 地下一層、2樓、4樓 · 景福宮站附近'
  },
  '제품과 서비스 문의는 영업시간 내 도와드립니다.':{
    en:'Product and service inquiries are available during opening hours.',
    ja:'商品・サービスに関するお問い合わせは営業時間内に承ります。',
    'zh-Hans':'商品与服务咨询请在营业时间内联系。',
    'zh-Hant':'商品與服務諮詢請於營業時間內聯絡。'
  },
  '매장 안내':{en:'Store guide',ja:'店舗案内','zh-Hans':'门店指南','zh-Hant':'門市指南'},
  '잉크 소분 안내':{en:'Ink decant guide',ja:'インク小分け案内','zh-Hans':'墨水分装指南','zh-Hant':'墨水分裝指南'}
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
  if(text.startsWith('ko'))return'ko';
  return'';
}

function currentLanguage(){
  const query=normalizeLanguage(new URLSearchParams(location.search).get('lang'));
  let saved='';
  try{saved=normalizeLanguage(localStorage.getItem('blueblack-language'));}catch{}
  const html=normalizeLanguage(document.documentElement.lang);
  const browser=(navigator.languages||[navigator.language]).map(normalizeLanguage).find(Boolean);
  return BB_LANGUAGES[query]?query:BB_LANGUAGES[saved]?saved:BB_LANGUAGES[html]?html:browser||'ko';
}

function ensureStyles(){
  if(document.querySelector('link[data-bb-public-ui]'))return;
  const link=document.createElement('link');
  link.rel='stylesheet';
  link.href=new URL('./public-ui-v52.css?v=60',import.meta.url).href;
  link.dataset.bbPublicUi='true';
  document.head.append(link);
}

function findMountTarget(){
  const original=document.querySelector('.portal-language,.news-language,.review-language,.language-menu,.detail-language-menu');
  if(original?.parentElement)return original.parentElement;
  return document.querySelector('.portal-nav,.news-topbar-inner,.review-topbar-inner,.official-topbar,.detail-topbar,.header-inner,.detail-header-inner');
}

function prepareMountTarget(target){
  if(!target?.classList.contains('detail-header-inner'))return target;
  let row=target.querySelector('.bb-public-topbar');
  if(row)return row;
  row=document.createElement('div');
  row.className='bb-public-topbar';
  const back=target.querySelector('.detail-back,.platform-back');
  target.insertBefore(row,target.firstChild);
  if(back)row.append(back);
  return row;
}

function switchLanguage(language){
  if(!BB_LANGUAGES[language])return;
  try{localStorage.setItem('blueblack-language',language);}catch{}
  const url=new URL(location.href);
  url.searchParams.set('lang',language);
  location.assign(url.href);
}

function buildMenu(language){
  const details=document.createElement('details');
  details.className='bb-language-menu';
  details.dataset.bbLanguageMenu='true';
  const current=BB_LANGUAGES[language];
  details.innerHTML=`<summary aria-label="${current.aria}"><span class="bb-language-current-flag">${current.flag}</span><span class="bb-language-current-label">${current.label}</span><span class="bb-language-chevron">⌄</span></summary><div class="bb-language-panel" role="group" aria-label="${current.aria}"></div>`;
  const panel=details.querySelector('.bb-language-panel');
  Object.entries(BB_LANGUAGES).forEach(([id,item])=>{
    const button=document.createElement('button');
    button.type='button';
    button.dataset.bbLanguage=id;
    button.setAttribute('aria-pressed',String(id===language));
    button.innerHTML=`<span class="bb-language-flag">${item.flag}</span><span class="bb-language-label">${item.label}</span><span class="bb-language-check">✓</span>`;
    button.addEventListener('click',()=>switchLanguage(id));
    panel.append(button);
  });
  return details;
}

function patchResidualTranslations(language){
  if(language==='ko')return;
  const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,{acceptNode(node){
    if(!node.parentElement||['SCRIPT','STYLE','NOSCRIPT'].includes(node.parentElement.tagName))return NodeFilter.FILTER_REJECT;
    return node.nodeValue.trim()?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT;
  }});
  const nodes=[];
  while(walker.nextNode())nodes.push(walker.currentNode);
  nodes.forEach(node=>{
    const original=node.nodeValue.trim();
    const translated=RESIDUAL_COPY[original]?.[language];
    if(translated)node.nodeValue=node.nodeValue.replace(original,translated);
  });
}

function addAlternateLinks(){
  const canonical=document.querySelector('link[rel="canonical"]')?.href||location.href;
  Object.keys(BB_LANGUAGES).forEach(language=>{
    if(document.querySelector(`link[rel="alternate"][hreflang="${language}"]`))return;
    const url=new URL(canonical,location.href);
    url.searchParams.set('lang',language);
    const link=document.createElement('link');
    link.rel='alternate';link.hreflang=language;link.href=url.href;
    document.head.append(link);
  });
}

async function ensurePageTranslationModule(){
  if(location.pathname.includes('/ink-price/')){
    try{await import('./ink-price-i18n-completion-v50.js?v=60');}catch(error){console.warn('Ink translation completion failed',error);}
  }
}

function mount(){
  if(document.documentElement.dataset.bbPublicUiMounted)return;
  document.documentElement.dataset.bbPublicUiMounted='true';
  ensureStyles();
  const language=currentLanguage();
  document.documentElement.lang=language;
  document.querySelectorAll('.portal-language,.news-language,.review-language,.language-menu,.detail-language-menu').forEach(node=>{
    node.classList.add('bb-original-language');node.setAttribute('aria-hidden','true');
  });
  document.querySelector('[data-bb-language-menu]')?.remove();
  const target=prepareMountTarget(findMountTarget());
  if(target)target.append(buildMenu(language));
  addAlternateLinks();
  patchResidualTranslations(language);
  setTimeout(()=>patchResidualTranslations(language),300);
  setTimeout(()=>patchResidualTranslations(language),1200);
  document.addEventListener('click',event=>{
    const menu=document.querySelector('[data-bb-language-menu]');
    if(menu?.open&&!menu.contains(event.target))menu.open=false;
  });
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape')document.querySelector('[data-bb-language-menu]')?.removeAttribute('open');
  });
  import('./public-extra-locales-v54.js?v=60').catch(error=>console.warn('Extra locale module failed',error));
}

ensurePageTranslationModule();
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
