import {
  fetchCatalogStatus,
  getAccessToken,
  hasAccessToken,
  replaceRemoteCatalog,
  setAccessToken,
  clearAccessToken
} from './catalog-db.js';
import { buildProducts, readCatalogRows, sourceDateFromRows } from './catalog-parser.js';
import { formatPrice, formatStock, initials } from './catalog-utils.js';
import { searchCatalog } from './catalog-search.js';

let authorized = false;
let searchTimer = 0;
let currentResults = [];
let selectedProductId = null;

const ui = {
  dbStatus: document.querySelector('#dbStatus'),
  search: document.querySelector('#productSearch'),
  searchButton: document.querySelector('#searchButton'),
  resultList: document.querySelector('#resultList'),
  resultTitle: document.querySelector('#resultTitle'),
  resultSummary: document.querySelector('#resultSummary'),
  detail: document.querySelector('#productDetail'),
  openImport: document.querySelector('#openImport'),
  importDialog: document.querySelector('#importDialog'),
  catalogFile: document.querySelector('#catalogFile'),
  importCatalog: document.querySelector('#importCatalog'),
  importProgress: document.querySelector('#importProgress'),
  importProgressTitle: document.querySelector('#importProgressTitle'),
  importProgressDetail: document.querySelector('#importProgressDetail'),
  changeAccess: document.querySelector('#changeAccess'),
  focusScanner: document.querySelector('#focusScanner'),
  accessDialog: document.querySelector('#accessDialog'),
  accessKey: document.querySelector('#accessKey'),
  unlockAccess: document.querySelector('#unlockAccess'),
  accessError: document.querySelector('#accessError'),
  toast: document.querySelector('#finderToast')
};

export function showToast(message) {
  ui.toast.textContent = message;
  ui.toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => ui.toast.classList.remove('show'), 3000);
}

export function isAuthorized() {
  return authorized && hasAccessToken();
}

function numberValue(value) {
  if (value === null || value === undefined || value === '') return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function localDateTime(value) {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

function statusAge(updatedAt) {
  if (!updatedAt) return { stale: true, text: '업데이트 기록 없음' };
  const elapsed = Date.now() - new Date(updatedAt).getTime();
  const hours = Math.max(0, Math.floor(elapsed / 3600000));
  if (hours < 24) return { stale: false, text: `${localDateTime(updatedAt)} 업데이트 · 실시간 재고 아님` };
  if (hours < 48) return { stale: true, text: `약 ${hours}시간 전 업데이트 · 최신 파일 확인 필요` };
  return { stale: true, text: `${Math.floor(hours / 24)}일 전 업데이트 · 재고 정보가 오래되었습니다` };
}

function setStatus(status) {
  ui.dbStatus.replaceChildren();
  const dot = document.createElement('span');
  const title = document.createElement('strong');
  const description = document.createElement('small');
  ui.dbStatus.append(dot, title, description);

  if (!authorized) {
    ui.dbStatus.classList.remove('ready', 'stale');
    title.textContent = '접근 잠김';
    description.textContent = '관리자 접근키가 필요합니다.';
    return;
  }

  const count = Number(status?.item_count || 0);
  const date = status?.source_date ? ` · ${status.source_date} 기준` : '';
  const age = statusAge(status?.updated_at);
  ui.dbStatus.classList.toggle('ready', count > 0);
  ui.dbStatus.classList.toggle('stale', count > 0 && age.stale);
  title.textContent = `${count.toLocaleString('ko-KR')}개 상품${date}`;
  description.textContent = count ? age.text : '오늘 재고 파일을 업로드해 주세요.';
  ui.resultSummary.textContent = count ? '품목코드, 바코드 또는 상품명을 입력하세요.' : '재고 파일 업로드가 필요합니다.';
}

function openAccess(message = '') {
  authorized = false;
  ui.accessError.textContent = message;
  if (!ui.accessDialog.open) ui.accessDialog.showModal();
  setTimeout(() => ui.accessKey.focus(), 50);
}

async function unlock() {
  const token = ui.accessKey.value.trim();
  if (!token) {
    ui.accessError.textContent = '관리자 접근키를 입력해 주세요.';
    return;
  }
  ui.unlockAccess.disabled = true;
  try {
    const status = await fetchCatalogStatus(token);
    setAccessToken(token);
    authorized = true;
    setStatus(status);
    ui.accessDialog.close();
    ui.accessKey.value = '';
    showToast('비공개 상품 DB에 연결했습니다.');
  } catch (error) {
    clearAccessToken();
    ui.accessError.textContent = error.message;
  } finally {
    ui.unlockAccess.disabled = false;
  }
}

export function activateMode(mode) {
  document.querySelectorAll('[data-mode]').forEach((button) => {
    button.classList.toggle('active', button.dataset.mode === mode);
  });
  document.querySelectorAll('[data-panel]').forEach((panel) => {
    panel.classList.toggle('active', panel.dataset.panel === mode);
  });
  if (mode === 'text') setTimeout(() => ui.search.focus(), 40);
  document.dispatchEvent(new CustomEvent('finder-mode-change', { detail: { mode } }));
}

function stockInfo(value) {
  const stock = numberValue(value);
  if (stock === null) return { label: '재고 확인 필요', className: 'unknown' };
  if (stock > 0) return { label: `재고 ${formatStock(stock)}`, className: 'available' };
  if (stock === 0) return { label: '재고 0개', className: 'empty' };
  return { label: `재고 ${formatStock(stock)} · 확인 필요`, className: 'warning' };
}

function mallSearchKeyword(productName) {
  return String(productName || '')
    .replace(/\[[^\]]+\]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function mallSearchUrl(product) {
  const keyword = mallSearchKeyword(product.product_name) || product.item_code || product.barcode || '';
  return `https://blueblack.co.kr/product/search.html?keyword=${encodeURIComponent(keyword)}`;
}

function detailField(label, value) {
  const field = document.createElement('div');
  const small = document.createElement('small');
  const strong = document.createElement('strong');
  field.className = 'detail-field';
  small.textContent = label;
  strong.textContent = value || '등록 없음';
  field.append(small, strong);
  return field;
}

function showProduct(product) {
  selectedProductId = product.id;
  ui.detail.replaceChildren();

  const hero = document.createElement('div');
  const image = document.createElement('div');
  const copy = document.createElement('div');
  const eyebrow = document.createElement('small');
  const title = document.createElement('h2');
  const price = document.createElement('div');
  const codes = document.createElement('div');
  const stock = stockInfo(product.stock_qty);

  hero.className = 'detail-hero';
  image.className = 'detail-image';
  copy.className = 'detail-copy';
  price.className = 'detail-price';
  codes.className = 'detail-code';

  image.textContent = initials(product.product_name);
  eyebrow.textContent = 'BLUEBLACK INTERNAL PRODUCT';
  title.textContent = product.product_name;

  const salePrice = numberValue(product.sale_price);
  const consumerPrice = numberValue(product.consumer_price);
  price.innerHTML = salePrice !== null
    ? `<strong>${formatPrice(salePrice)}</strong>${consumerPrice !== null && consumerPrice !== salePrice ? `<span>소비자가 ${formatPrice(consumerPrice)}</span>` : ''}`
    : `<strong>가격 확인 필요</strong>`;

  [
    product.item_code && `품목코드 ${product.item_code}`,
    product.barcode && `바코드 ${product.barcode}`
  ].filter(Boolean).forEach((text) => {
    const badge = document.createElement('span');
    badge.textContent = text;
    codes.append(badge);
  });

  copy.append(eyebrow, title, price, codes);
  hero.append(image, copy);

  const grid = document.createElement('div');
  grid.className = 'detail-grid';
  grid.append(
    detailField('판매가', salePrice !== null ? formatPrice(salePrice) : '확인 필요'),
    detailField('소비자가', consumerPrice !== null ? formatPrice(consumerPrice) : '확인 필요'),
    detailField('재고수량', stock.label),
    detailField('재고 위치', product.location || '등록 없음'),
    detailField('품목코드', product.item_code || '등록 없음'),
    detailField('바코드', product.barcode || '등록 없음')
  );
  grid.children[2].classList.add('stock-field', stock.className);

  const note = document.createElement('div');
  note.className = 'detail-note';
  note.textContent = '재고와 가격은 마지막 파일 업데이트 시점 기준이며 실시간 정보와 다를 수 있습니다. 판매 전 실제 재고와 가격을 확인해 주세요.';

  const actions = document.createElement('div');
  const mallLink = document.createElement('a');
  const copyCode = document.createElement('button');
  actions.className = 'detail-actions';
  mallLink.className = 'primary';
  mallLink.target = '_blank';
  mallLink.rel = 'noopener';
  mallLink.href = mallSearchUrl(product);
  mallLink.textContent = '자사몰 검색 결과 보기';
  copyCode.type = 'button';
  copyCode.textContent = '품목코드 복사';
  copyCode.disabled = !product.item_code;
  copyCode.addEventListener('click', async () => {
    if (!product.item_code) return;
    await navigator.clipboard.writeText(product.item_code);
    showToast('품목코드를 복사했습니다.');
  });
  actions.append(mallLink, copyCode);

  ui.detail.append(hero, grid, note, actions);
  document.querySelectorAll('.result-item').forEach((button) => {
    button.classList.toggle('active', String(button.dataset.id) === String(product.id));
  });
}

function renderResults(items, label) {
  currentResults = items;
  ui.resultList.replaceChildren();
  ui.resultTitle.textContent = `${label} 검색 결과`;
  ui.resultSummary.textContent = `${items.length}개 후보 · 최대 50개 조회`;

  if (!items.length) {
    const empty = document.createElement('div');
    empty.className = 'finder-empty';
    empty.innerHTML = '<b>검색 결과가 없습니다.</b><span>상품명 일부, 품목코드 또는 바코드를 다시 확인해 주세요.</span>';
    ui.resultList.append(empty);
    return;
  }

  items.forEach((product) => {
    const button = document.createElement('button');
    const thumb = document.createElement('span');
    const copy = document.createElement('span');
    const name = document.createElement('strong');
    const info = document.createElement('span');
    const meta = document.createElement('span');
    const price = document.createElement('b');
    const stock = document.createElement('small');
    const salePrice = numberValue(product.sale_price);
    const stockState = stockInfo(product.stock_qty);

    button.type = 'button';
    button.className = 'result-item';
    button.dataset.id = product.id;
    thumb.className = 'result-thumb';
    copy.className = 'result-copy';
    meta.className = 'result-meta';
    stock.className = `stock-state ${stockState.className}`;

    thumb.textContent = initials(product.product_name);
    name.textContent = product.product_name;
    info.textContent = [
      product.item_code && `품목코드 ${product.item_code}`,
      product.barcode && `바코드 ${product.barcode}`,
      product.location && `위치 ${product.location}`
    ].filter(Boolean).join(' · ') || '추가 정보 없음';
    price.textContent = salePrice !== null ? formatPrice(salePrice) : '가격 확인';
    stock.textContent = stockState.label;

    copy.append(name, info);
    meta.append(price, stock);
    button.append(thumb, copy, meta);
    button.addEventListener('click', () => showProduct(product));
    ui.resultList.append(button);
  });

  const selected = items.find((item) => item.id === selectedProductId) || items[0];
  if (selected) showProduct(selected);
}

export async function runSearch(value, options = {}) {
  const query = String(value || '').trim();
  if (!query) return [];
  if (!isAuthorized()) {
    openAccess('상품 검색을 사용하려면 관리자 접근키가 필요합니다.');
    return [];
  }

  ui.searchButton.disabled = true;
  ui.resultSummary.textContent = 'Supabase에서 검색하고 있습니다.';
  try {
    const items = await searchCatalog(query, options);
    renderResults(items, options.label || `‘${query}’`);
    return items;
  } catch (error) {
    showToast(error.message || '상품 검색에 실패했습니다.');
    return [];
  } finally {
    ui.searchButton.disabled = false;
  }
}

export async function handleScannedCode(code, source = '바코드') {
  const value = String(code || '').trim();
  if (!value) return [];
  activateMode('text');
  ui.search.value = value;
  return runSearch(value, { label: `${source}: ${value}` });
}

async function importSelectedCatalog() {
  const file = ui.catalogFile.files?.[0];
  if (!file || !isAuthorized()) return;

  ui.importCatalog.disabled = true;
  ui.importProgress.hidden = false;
  ui.importProgressTitle.textContent = '파일을 읽고 있습니다.';
  ui.importProgressDetail.textContent = '품목코드·상품명·가격·재고·위치를 확인합니다.';

  try {
    const rows = await readCatalogRows(file);
    const products = buildProducts(rows);
    const sourceDate = sourceDateFromRows(rows);
    const priceCount = products.filter((product) => product.sale_price !== null).length;
    const stockCount = products.filter((product) => product.stock_qty !== null).length;
    const locationCount = products.filter((product) => product.location).length;

    const approved = window.confirm(
      `${products.length.toLocaleString('ko-KR')}개 상품을 업데이트합니다.\n` +
      `판매가 ${priceCount.toLocaleString('ko-KR')}건 · 재고 ${stockCount.toLocaleString('ko-KR')}건 · 위치 ${locationCount.toLocaleString('ko-KR')}건\n\n` +
      '검증이 끝난 뒤 기존 상품 DB가 한 번에 교체됩니다.'
    );
    if (!approved) return;

    ui.importProgressTitle.textContent = 'Supabase 비공개 DB로 전송 중입니다.';
    ui.importProgressDetail.textContent = `0 / ${products.length.toLocaleString('ko-KR')}개`;

    const total = await replaceRemoteCatalog(products, sourceDate, (uploaded, count) => {
      const percent = Math.round((uploaded / count) * 100);
      ui.importProgressDetail.textContent = `${uploaded.toLocaleString('ko-KR')} / ${count.toLocaleString('ko-KR')}개 · ${percent}%`;
    });

    const status = await fetchCatalogStatus();
    setStatus(status);
    ui.importDialog.close();
    ui.catalogFile.value = '';
    showToast(`${total.toLocaleString('ko-KR')}개 상품 업데이트가 완료됐습니다.`);
  } catch (error) {
    ui.importProgressTitle.textContent = '업데이트하지 못했습니다.';
    ui.importProgressDetail.textContent = error.message;
    showToast(error.message || '상품 데이터 업데이트에 실패했습니다.');
  } finally {
    ui.importCatalog.disabled = !ui.catalogFile.files?.length;
  }
}

ui.searchButton?.addEventListener('click', () => runSearch(ui.search.value));
ui.search?.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    runSearch(ui.search.value);
  }
});
ui.search?.addEventListener('input', () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    if (ui.search.value.trim().length >= 2) runSearch(ui.search.value);
  }, 300);
});
ui.focusScanner?.addEventListener('click', () => {
  activateMode('text');
  ui.search.value = '';
  ui.search.focus();
  showToast('USB 바코드 스캐너 입력을 기다립니다.');
});
document.querySelectorAll('[data-mode]').forEach((button) => {
  button.addEventListener('click', () => activateMode(button.dataset.mode));
});
ui.unlockAccess?.addEventListener('click', unlock);
ui.accessKey?.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    unlock();
  }
});
ui.importCatalog?.addEventListener('click', importSelectedCatalog);
ui.changeAccess?.addEventListener('click', () => {
  clearAccessToken();
  openAccess('새 관리자 접근키를 입력해 주세요.');
});

setStatus(null);
if (hasAccessToken()) {
  fetchCatalogStatus(getAccessToken()).then((status) => {
    authorized = true;
    setStatus(status);
  }).catch(() => {
    clearAccessToken();
    openAccess('접근키를 다시 입력해 주세요.');
  });
} else {
  openAccess();
}
