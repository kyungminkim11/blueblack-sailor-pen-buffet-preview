import './public-ui-v52.js';

const STORE_FLOOR_COPY={
  ko:{title:'블루블랙 펜샵 매장 안내',intro:'층별 브랜드 안내도부터 위치, 영업시간과 방문 정보를 한곳에서 확인하세요.',floorTitle:'층별 매장 안내',floorBody:'1층과 2층의 주요 브랜드와 진열 구역을 검색하고 확인하세요.',floorAria:'층 선택',floor1:'1층 브랜드 안내도',floor2:'2층 브랜드 안내도',floor2Body:'브랜드 위치와 주요 체험 공간을 확인하세요.',openMap:'브랜드 검색 지도 열기',note:'브랜드와 진열 위치는 매장 운영 상황에 따라 변경될 수 있습니다.',mapAlt:'블루블랙 펜샵 2층 브랜드 안내도'},
  en:{title:'BlueBlack Pen Shop Store Guide',intro:'Check floor maps, brand locations, opening hours and visit information in one place.',floorTitle:'Store guide by floor',floorBody:'Search and browse the main brands and display areas on the first and second floors.',floorAria:'Choose a floor',floor1:'First-floor brand map',floor2:'Second-floor brand map',floor2Body:'Check brand locations and the main trial areas.',openMap:'Open searchable brand map',note:'Brand and display locations may change according to store operations.',mapAlt:'BlueBlack Pen Shop second-floor brand map'},
  ja:{title:'BlueBlack Pen Shop 店舗案内',intro:'フロア別ブランド案内図、場所、営業時間、来店情報をまとめて確認できます。',floorTitle:'フロア別店舗案内',floorBody:'1階と2階の主なブランドと陳列エリアを検索・確認できます。',floorAria:'フロアを選択',floor1:'1階ブランド案内図',floor2:'2階ブランド案内図',floor2Body:'ブランドの場所と主な体験スペースをご確認ください。',openMap:'ブランド検索マップを開く',note:'ブランドや陳列場所は店舗運営状況により変更される場合があります。',mapAlt:'BlueBlack Pen Shop 2階ブランド案内図'},
  'zh-Hans':{title:'BlueBlack Pen Shop 门店指南',intro:'集中查看各楼层品牌地图、位置、营业时间和到店信息。',floorTitle:'楼层门店指南',floorBody:'搜索并查看一楼和二楼的主要品牌与陈列区域。',floorAria:'选择楼层',floor1:'一楼品牌地图',floor2:'二楼品牌地图',floor2Body:'查看品牌位置和主要体验区域。',openMap:'打开品牌搜索地图',note:'品牌和陈列位置可能会根据门店运营情况调整。',mapAlt:'BlueBlack Pen Shop 二楼品牌地图'},
  'zh-Hant':{title:'BlueBlack Pen Shop 門市指南',intro:'集中查看各樓層品牌地圖、位置、營業時間與到店資訊。',floorTitle:'樓層門市指南',floorBody:'搜尋並查看一樓與二樓的主要品牌及陳列區域。',floorAria:'選擇樓層',floor1:'一樓品牌地圖',floor2:'二樓品牌地圖',floor2Body:'查看品牌位置與主要體驗區域。',openMap:'開啟品牌搜尋地圖',note:'品牌與陳列位置可能會依門市營運情況調整。',mapAlt:'BlueBlack Pen Shop 二樓品牌地圖'}
};

function storeLanguage(){
  const value=(document.documentElement.lang||'ko').toLowerCase();
  if(value.includes('hant')||value.startsWith('zh-tw')||value.startsWith('zh-hk'))return'zh-Hant';
  if(value.startsWith('zh'))return'zh-Hans';
  if(value.startsWith('ja'))return'ja';
  if(value.startsWith('en'))return'en';
  return'ko';
}

function setText(selector,value){const node=document.querySelector(selector);if(node&&value)node.textContent=value;}

function applyStoreFloorInformation(){
  const language=storeLanguage();
  const copy=STORE_FLOOR_COPY[language]||STORE_FLOOR_COPY.ko;
  const address=document.querySelector('[data-map-i18n="addressValue"]');
  if(address){
    if(language==='ko')address.textContent='서울특별시 종로구 사직로 109 · B1, 2F, 4F';
    else address.textContent=`${address.textContent.replace(/\s*[·,]?\s*B1.*$/,'')} · B1, 2F, 4F`;
  }
  setText('.detail-header-inner > h1',copy.title);
  setText('.detail-header-inner > p',copy.intro);
  setText('.merged-floor-heading h2',copy.floorTitle);
  setText('.merged-floor-heading p',copy.floorBody);
  setText('[data-merged-floor="1"] strong',copy.floor1);
  setText('[data-merged-floor="2"] strong',copy.floor2);
  setText('[data-merged-panel="2"] h3',copy.floor2);
  setText('[data-merged-panel="2"] .merged-floor-panel-head p',copy.floor2Body);
  setText('[data-merged-panel="2"] .merged-floor-link',copy.openMap);
  setText('[data-merged-panel="2"] .merged-floor-note',copy.note);
  document.querySelector('.merged-floor-tabs')?.setAttribute('aria-label',copy.floorAria);
  document.querySelector('[data-merged-panel="2"] img')?.setAttribute('alt',copy.mapAlt);
  document.title=copy.title;
}

document.querySelectorAll('[data-portal-lang]').forEach(button=>button.addEventListener('click',()=>queueMicrotask(applyStoreFloorInformation)));
new MutationObserver(applyStoreFloorInformation).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
applyStoreFloorInformation();
import('./store-guide-merged.js');
import('./store-map-dedupe.js');
import('./store-map-live.js?v=7');
import('./store-map-1f-details.js?v=3');
import('./store-closing-notice.js?v=2');