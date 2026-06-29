const COPY = {
  ko: {
    openMap: '매장 내부 지도',
    title: '매장 내부 브랜드 지도',
    intro: '입구와 카운터를 기준으로 원하는 브랜드의 진열 위치를 빠르게 확인하세요.',
    largeView: '새 창에서 크게 보기',
    searchLabel: '브랜드 찾기',
    searchPlaceholder: '예: 세일러, 라미, 파이롯트',
    fit: '맞춤',
    fullscreen: '전체 화면',
    searchHint: '브랜드명을 입력하면 해당 진열 구역이 강조됩니다.',
    found: (count) => `${count}개 진열 구역을 강조했습니다.`,
    missing: '일치하는 진열 구역을 찾지 못했습니다.',
    legendBrand: '브랜드 진열',
    legendTable: '테이블·체험',
    legendService: '카운터·출입구',
    note: '브랜드 진열 위치는 매장 운영과 입고 상황에 따라 변경될 수 있습니다.'
  },
  en: {
    openMap: 'In-store map',
    title: 'In-store brand map',
    intro: 'Use the entrance and counter as landmarks to find each brand display.',
    largeView: 'Open large map',
    searchLabel: 'Find a brand',
    searchPlaceholder: 'e.g. Sailor, Lamy, Pilot',
    fit: 'Fit',
    fullscreen: 'Full screen',
    searchHint: 'Enter a brand name to highlight its display area.',
    found: (count) => `${count} display area${count === 1 ? '' : 's'} highlighted.`,
    missing: 'No matching display area was found.',
    legendBrand: 'Brand displays',
    legendTable: 'Tables & trial area',
    legendService: 'Counter & entrance',
    note: 'Display locations may change according to store operation and stock.'
  },
  ja: {
    openMap: '店内マップ',
    title: '店内ブランドマップ',
    intro: '入口とカウンターを目印に、各ブランドの売場をご確認ください。',
    largeView: '大きな地図を開く',
    searchLabel: 'ブランド検索',
    searchPlaceholder: '例：Sailor、Lamy、Pilot',
    fit: '全体表示',
    fullscreen: '全画面',
    searchHint: 'ブランド名を入力すると該当売場を強調表示します。',
    found: (count) => `${count}か所の売場を強調表示しました。`,
    missing: '一致する売場が見つかりませんでした。',
    legendBrand: 'ブランド売場',
    legendTable: 'テーブル・試筆',
    legendService: 'カウンター・入口',
    note: '売場位置は店舗運営や入荷状況により変更される場合があります。'
  },
  'zh-Hans': {
    openMap: '店内地图',
    title: '店内品牌地图',
    intro: '以入口和柜台为参照，快速查找各品牌陈列位置。',
    largeView: '打开大图',
    searchLabel: '查找品牌',
    searchPlaceholder: '例如 Sailor、Lamy、Pilot',
    fit: '适应',
    fullscreen: '全屏',
    searchHint: '输入品牌名称即可高亮对应陈列区域。',
    found: (count) => `已高亮 ${count} 个陈列区域。`,
    missing: '未找到匹配的陈列区域。',
    legendBrand: '品牌陈列',
    legendTable: '桌台与试写',
    legendService: '柜台与入口',
    note: '陈列位置可能会根据门店运营和到货情况调整。'
  },
  'zh-Hant': {
    openMap: '店內地圖',
    title: '店內品牌地圖',
    intro: '以入口和櫃檯為參照，快速查找各品牌陳列位置。',
    largeView: '開啟大圖',
    searchLabel: '查找品牌',
    searchPlaceholder: '例如 Sailor、Lamy、Pilot',
    fit: '適應',
    fullscreen: '全螢幕',
    searchHint: '輸入品牌名稱即可醒目顯示對應陳列區域。',
    found: (count) => `已醒目顯示 ${count} 個陳列區域。`,
    missing: '未找到相符的陳列區域。',
    legendBrand: '品牌陳列',
    legendTable: '桌台與試寫',
    legendService: '櫃檯與入口',
    note: '陳列位置可能會依門市營運和到貨狀況調整。'
  }
};

function currentLanguage() {
  const value = document.documentElement.lang || 'ko';
  if (value.startsWith('zh-Hant') || value.startsWith('zh-TW') || value.startsWith('zh-HK')) return 'zh-Hant';
  if (value.startsWith('zh')) return 'zh-Hans';
  if (value.startsWith('ja')) return 'ja';
  if (value.startsWith('en')) return 'en';
  return 'ko';
}

function applyCopy() {
  const copy = COPY[currentLanguage()] || COPY.ko;
  document.querySelectorAll('[data-map-i18n]').forEach((node) => {
    const key = node.dataset.mapI18n;
    if (typeof copy[key] === 'string') node.textContent = copy[key];
  });
  document.querySelectorAll('[data-map-i18n-placeholder]').forEach((node) => {
    const key = node.dataset.mapI18nPlaceholder;
    if (typeof copy[key] === 'string') node.placeholder = copy[key];
  });
}

const viewport = document.querySelector('#storeMapViewport');
const canvas = document.querySelector('#storeMapCanvas');
const mapObject = document.querySelector('#storeMapObject');
const searchInput = document.querySelector('#storeMapSearch');
const result = document.querySelector('#storeMapResult');
const zoomIn = document.querySelector('#storeMapZoomIn');
const zoomOut = document.querySelector('#storeMapZoomOut');
const fitButton = document.querySelector('#storeMapFit');
const fullscreenButton = document.querySelector('#storeMapFullscreen');

let mapDocument = null;
let zoom = 1;

function normalize(value = '') {
  return String(value)
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[^0-9a-z가-힣ぁ-んァ-ヶ一-龠]+/g, '');
}

function zones() {
  return mapDocument ? [...mapDocument.querySelectorAll('[data-brands]')] : [];
}

function setResult(type, count = 0) {
  const copy = COPY[currentLanguage()] || COPY.ko;
  result.classList.remove('is-found', 'is-missing');
  if (type === 'found') {
    result.textContent = copy.found(count);
    result.classList.add('is-found');
  } else if (type === 'missing') {
    result.textContent = copy.missing;
    result.classList.add('is-missing');
  } else {
    result.textContent = copy.searchHint;
  }
}

function searchMap() {
  const query = normalize(searchInput.value);
  const allZones = zones();
  allZones.forEach((zone) => zone.classList.remove('is-match', 'is-dimmed'));

  if (!query) {
    setResult('hint');
    return;
  }

  const matches = allZones.filter((zone) => normalize(zone.dataset.brands).includes(query));
  allZones.forEach((zone) => zone.classList.add(matches.includes(zone) ? 'is-match' : 'is-dimmed'));
  setResult(matches.length ? 'found' : 'missing', matches.length);
}

function baseWidth() {
  return Math.max(viewport?.clientWidth || 0, 760);
}

function applyZoom(next) {
  zoom = Math.min(2.2, Math.max(0.65, next));
  canvas.style.minWidth = '0';
  canvas.style.width = `${Math.round(baseWidth() * zoom)}px`;
}

function fitMap() {
  zoom = 1;
  canvas.style.minWidth = '0';
  canvas.style.width = '100%';
  if (viewport) {
    viewport.scrollLeft = 0;
    viewport.scrollTop = 0;
  }
}

async function toggleFullscreen() {
  if (!viewport) return;
  if (document.fullscreenElement) {
    await document.exitFullscreen?.();
  } else {
    await viewport.requestFullscreen?.();
  }
}

mapObject?.addEventListener('load', () => {
  mapDocument = mapObject.contentDocument;
  searchMap();
});

searchInput?.addEventListener('input', searchMap);
zoomIn?.addEventListener('click', () => applyZoom(zoom + 0.2));
zoomOut?.addEventListener('click', () => applyZoom(zoom - 0.2));
fitButton?.addEventListener('click', fitMap);
fullscreenButton?.addEventListener('click', toggleFullscreen);
document.addEventListener('fullscreenchange', () => {
  const copy = COPY[currentLanguage()] || COPY.ko;
  fullscreenButton.textContent = document.fullscreenElement ? (currentLanguage() === 'ko' ? '전체 화면 종료' : 'Exit') : copy.fullscreen;
});

applyCopy();
setResult('hint');
