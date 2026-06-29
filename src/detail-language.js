const LANGUAGES={
  ko:{flag:'🇰🇷',label:'한국어'},
  en:{flag:'🇺🇸',label:'English'},
  ja:{flag:'🇯🇵',label:'日本語'},
  'zh-Hans':{flag:'🇨🇳',label:'简体中文'},
  'zh-Hant':{flag:'🇹🇼',label:'繁體中文'}
};

const PAGE_TITLES={
  ko:{store:'블루블랙 펜샵 매장 안내',service:'블루블랙 펜뷔페 A/S·구매 안내',staff:'블루블랙 직원용 도구',ink:'블루블랙 잉크 소분 금액표'},
  en:{store:'BlueBlack Pen Shop Store Guide',service:'BlueBlack Pen Buffet Service & Purchase Guide',staff:'BlueBlack Staff Tools',ink:'BlueBlack Ink Decant Price List'},
  ja:{store:'BlueBlack Pen Shop 店舗案内',service:'BlueBlack ペンビュッフェ 修理・購入案内',staff:'BlueBlack スタッフ用ツール',ink:'BlueBlack インク小分け価格表'},
  'zh-Hans':{store:'BlueBlack Pen Shop 门店指南',service:'BlueBlack Pen Buffet 售后与购买指南',staff:'BlueBlack 店员工具',ink:'BlueBlack 墨水分装价格表'},
  'zh-Hant':{store:'BlueBlack Pen Shop 門市指南',service:'BlueBlack Pen Buffet 售後與購買指南',staff:'BlueBlack 店員工具',ink:'BlueBlack 墨水分裝價格表'}
};

const EXTRA={
  ko:{language:'언어 선택',naverOriginal:'NAVER 원본 열기',operationsTitle:'운영 원칙',sessionTitle:'새 고객 시작',sessionBody:'상담 전 이전 고객의 조합을 초기화합니다.',shareTitle:'QR·링크 공유',shareBody:'고객에게 현재 조합만 전달하고 직원용 상태는 공유하지 않습니다.',offlineTitle:'오프라인 대응',offlineBody:'매장 기기에서 한 번 실행한 뒤 핵심 화면을 캐시합니다.',dataTitle:'민감 정보 금지',dataBody:'공개 정적 페이지이므로 원가나 내부 정보는 등록하지 않습니다.'},
  en:{language:'Choose language',naverOriginal:'Open original on NAVER',operationsTitle:'Operating guidelines',sessionTitle:'Start a new customer session',sessionBody:'Clear the previous customer’s combination before consultation.',shareTitle:'QR and link sharing',shareBody:'Share only the current combination, never staff-only session data.',offlineTitle:'Offline support',offlineBody:'Core screens remain available after the store device has loaded them once.',dataTitle:'Do not publish sensitive data',dataBody:'This is a public static site, so costs and internal information must not be uploaded.'},
  ja:{language:'言語を選択',naverOriginal:'NAVER原本を開く',operationsTitle:'運用ルール',sessionTitle:'新しいお客様を開始',sessionBody:'接客前に前のお客様の組み合わせを初期化します。',shareTitle:'QR・リンク共有',shareBody:'現在の組み合わせのみ共有し、スタッフ用状態は共有しません。',offlineTitle:'オフライン対応',offlineBody:'店舗端末で一度読み込むと、主要画面を保存して利用できます。',dataTitle:'機密情報を掲載しない',dataBody:'公開静的ページのため、原価や社内情報は登録しません。'},
  'zh-Hans':{language:'选择语言',naverOriginal:'打开 NAVER 原图',operationsTitle:'运营原则',sessionTitle:'开始新顾客咨询',sessionBody:'咨询前请清除上一位顾客的组合。',shareTitle:'二维码与链接分享',shareBody:'仅分享当前组合，不分享店员专用状态。',offlineTitle:'离线支持',offlineBody:'门店设备首次加载后可继续使用核心画面。',dataTitle:'禁止公开敏感信息',dataBody:'这是公开静态页面，请勿上传成本及内部信息。'},
  'zh-Hant':{language:'選擇語言',naverOriginal:'開啟 NAVER 原圖',operationsTitle:'營運原則',sessionTitle:'開始新顧客諮詢',sessionBody:'諮詢前請清除上一位顧客的組合。',shareTitle:'QR碼與連結分享',shareBody:'僅分享目前組合，不分享店員專用狀態。',offlineTitle:'離線支援',offlineBody:'門市裝置首次載入後可繼續使用核心畫面。',dataTitle:'禁止公開敏感資訊',dataBody:'這是公開靜態頁面，請勿上傳成本及內部資訊。'}
};

function normalize(value=''){
  const text=String(value).toLowerCase();
  if(text.startsWith('zh-tw')||text.startsWith('zh-hk')||text.startsWith('zh-mo')||text.includes('hant'))return'zh-Hant';
  if(text.startsWith('zh'))return'zh-Hans';
  if(text.startsWith('ja'))return'ja';
  if(text.startsWith('ko'))return'ko';
  if(text.startsWith('en'))return'en';
  return'';
}

function currentLanguage(){
  const query=normalize(new URLSearchParams(location.search).get('lang'));
  let saved='';
  try{saved=normalize(localStorage.getItem('blueblack-language'));}catch{}
  const browser=(navigator.languages||[navigator.language]).map(normalize).find(Boolean);
  return LANGUAGES[query]?query:LANGUAGES[saved]?saved:browser||'en';
}

function pageType(){
  const path=location.pathname;
  if(path.includes('/store-guide/'))return'store';
  if(path.includes('/service/'))return'service';
  if(path.includes('/staff/'))return'staff';
  if(path.includes('/ink-price/'))return'ink';
  return'';
}

function ensureStyles(){
  if(document.querySelector('link[data-detail-language]'))return;
  const link=document.createElement('link');
  link.rel='stylesheet';
  link.href=new URL('../detail-language.css',import.meta.url).href;
  link.dataset.detailLanguage='true';
  document.head.append(link);
}

function applyExtraTranslations(language){
  const values=EXTRA[language]||EXTRA.ko;
  document.querySelectorAll('[data-detail-t]').forEach(node=>{
    const value=values[node.dataset.detailT];
    if(value)node.textContent=value;
  });
  const type=pageType();
  if(type==='ink'){
    const sourceLink=[...document.querySelectorAll('.ink-source a')].find(link=>link.href.includes('m.site.naver.com'));
    if(sourceLink)sourceLink.textContent=values.naverOriginal;
  }
  const title=PAGE_TITLES[language]?.[type];
  if(title)document.title=title;
  document.documentElement.lang=language;
}

function addAlternateLinks(){
  const canonical=document.querySelector('link[rel="canonical"]')?.href||location.href;
  Object.keys(LANGUAGES).forEach(language=>{
    if(document.querySelector(`link[rel="alternate"][hreflang="${language}"]`))return;
    const url=new URL(canonical,location.href);
    url.searchParams.set('lang',language);
    const link=document.createElement('link');
    link.rel='alternate';
    link.hreflang=language;
    link.href=url.href;
    document.head.append(link);
  });
}

function buildMenu(language){
  const details=document.createElement('details');
  details.className='detail-language-menu';
  details.dataset.detailLanguageMenu='true';
  const current=LANGUAGES[language];
  details.innerHTML=`<summary aria-label="${EXTRA[language]?.language||EXTRA.ko.language}"><span class="detail-language-current-flag">${current.flag}</span><span class="detail-language-current-label">${current.label}</span><span class="detail-language-chevron">⌄</span></summary><div class="detail-language-panel" role="group"></div>`;
  const panel=details.querySelector('.detail-language-panel');
  Object.entries(LANGUAGES).forEach(([id,item])=>{
    const button=document.createElement('button');
    button.type='button';
    button.dataset.detailLanguage=id;
    button.setAttribute('aria-pressed',String(id===language));
    button.innerHTML=`<span class="detail-language-flag">${item.flag}</span><span class="detail-language-label">${item.label}</span><span class="detail-language-check">✓</span>`;
    button.addEventListener('click',()=>{
      try{localStorage.setItem('blueblack-language',id);}catch{}
      const url=new URL(location.href);
      url.searchParams.set('lang',id);
      location.assign(url.href);
    });
    panel.append(button);
  });
  return details;
}

function mount(){
  ensureStyles();
  const language=currentLanguage();
  applyExtraTranslations(language);
  addAlternateLinks();
  const inner=document.querySelector('.detail-header-inner');
  const back=inner?.querySelector('.detail-back');
  if(!inner||!back)return;
  inner.querySelector('.detail-language')?.remove();
  inner.querySelector('[data-detail-language-menu]')?.remove();
  let topbar=inner.querySelector('.detail-topbar');
  if(!topbar){
    topbar=document.createElement('div');
    topbar.className='detail-topbar';
    inner.insertBefore(topbar,inner.firstChild);
    topbar.append(back);
  }
  topbar.append(buildMenu(language));
  document.addEventListener('click',event=>{
    const menu=document.querySelector('[data-detail-language-menu]');
    if(menu?.open&&!menu.contains(event.target))menu.open=false;
  });
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape')document.querySelector('[data-detail-language-menu]')?.removeAttribute('open');
  });
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();