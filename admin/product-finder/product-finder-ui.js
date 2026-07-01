import { loadBuiltInCatalog } from './catalog-db.js';
import { buildProducts, parseCsv } from './catalog-parser.js';
import { searchCatalog } from './catalog-search.js';
import {
  escapeHtml,
  formatPrice,
  formatStock,
  initials,
  normalize,
  productSearchUrl
} from './catalog-utils.js';

let products = [];
let selectedProductId = '';
let searchTimer = 0;

const select = (selector, root = document) => root.querySelector(selector);
const selectAll = (selector, root = document) => [...root.querySelectorAll(selector)];

const ui = {
  dbStatus: select('#dbStatus'),
  search: select('#productSearch'),
  searchButton: select('#searchButton'),
  resultList: select('#resultList'),
  resultTitle: select('#resultTitle'),
  resultSummary: select('#resultSummary'),
  detail: select('#productDetail'),
  openImport: select('#openImport'),
  importDialog: select('#importDialog'),
  catalogFile: select('#catalogFile'),
  importCatalog: select('#importCatalog'),
  importProgress: select('#importProgress'),
  exportCatalog: select('#exportCatalog'),
  clearCatalog: select('#clearCatalog'),
  focusScanner: select('#focusScanner'),
  toast: select('#finderToast')
};

export function showToast(message) {
  ui.toast.textContent = message;
  ui.toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => ui.toast.classList.remove('show'), 2600);
}

export function getProducts() {
  return products;
}

function updateDatabaseStatus(meta = {}) {
  if (!products.length) {
    ui.dbStatus.classList.remove('ready');
    ui.dbStatus.innerHTML = '<span></span><strong>상품 DB 없음</strong><small>재고 CSV를 불러와 주세요.</small>';
    return;
  }

  const updated = meta.updatedAt
    ? new Date(meta.updatedAt).toLocaleString('ko-KR')
    : '현재 세션';

  ui.dbStatus.classList.add('ready');
  ui.dbStatus.innerHTML = `<span></span><strong>${products.length.toLocaleString('ko-KR')}개 상품</strong><small>업데이트 ${updated}</small>`;
}

export function activateMode(mode) {
  selectAll('[data-mode]').forEach((button) => {
    button.classList.toggle('active', button.dataset.mode === mode);
  });
  selectAll('[data-panel]').forEach((panel) => {
    panel.classList.toggle('active', panel.dataset.panel === mode);
  });

  if (mode === 'text') {
    setTimeout(() => ui.search.focus(), 40);
  }

  document.dispatchEvent(new CustomEvent('finder-mode-change', { detail: { mode } }));
}

function renderEmpty(title, body) {
  return `<div class="finder-empty"><b>${escapeHtml(title)}</b><span>${escapeHtml(body)}</span></div>`;
}

export function renderResults(items, label = '') {
  ui.resultTitle.textContent = label ? `${label} 검색 결과` : '상품 검색';
  ui.resultSummary.textContent = items.length
    ? `${items.length}개 후보를 표시합니다.`
    : products.length
      ? '검색 결과가 없습니다.'
      : '재고 CSV를 불러와 주세요.';

  if (!items.length) {
    ui.resultList.innerHTML = products.length
      ? renderEmpty('일치하는 상품이 없습니다.', '상품명 일부, 브랜드 또는 품목코드로 다시 검색해 보세요.')
      : renderEmpty('상품 데이터가 필요합니다.', '‘재고 CSV 불러오기’를 눌러 최신 파일을 등록해 주세요.');
    return;
  }

  ui.resultList.innerHTML = items.map((product) => {
    const active = product.id === selectedProductId ? ' active' : '';
    const image = product.image
      ? `<img src="${escapeHtml(product.image)}" alt="">`
      : initials(product.brand || product.name);

    return `<button type="button" class="result-item${active}" data-product-id="${escapeHtml(product.id)}">
      <span class="result-thumb">${image}</span>
      <span class="result-copy">
        <strong>${escapeHtml(product.name)}</strong>
        <span>${escapeHtml(product.brand || '브랜드 미등록')} · ${escapeHtml(product.code || product.barcode)}</span>
      </span>
      <span class="result-meta">
        <b>${formatPrice(product.salePrice ?? product.retailPrice)}</b>
        <small>재고 ${formatStock(product.stock)}</small>
      </span>
    </button>`;
  }).join('');

  selectAll('.result-item', ui.resultList).forEach((button) => {
    button.addEventListener('click', () => selectProduct(button.dataset.productId));
  });
}

function renderProductDetail(product) {
  const fields = [
    ['판매가', formatPrice(product.salePrice)],
    ['소비자가', formatPrice(product.retailPrice)],
    ['재고수량', formatStock(product.stock)],
    ['재고 위치', product.location || '미등록'],
    ['품목코드', product.code || '미등록'],
    ['바코드', product.barcode || product.code || '미등록']
  ];

  const image = product.image
    ? `<img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}">`
    : initials(product.brand || product.name);

  ui.detail.innerHTML = `<div class="detail-hero">
    <div class="detail-image">${image}</div>
    <div class="detail-copy">
      <small>${escapeHtml(product.brand || 'BRAND NOT SET')}</small>
      <h2>${escapeHtml(product.name)}</h2>
      <div class="detail-code">
        ${product.code ? `<span>품목코드 ${escapeHtml(product.code)}</span>` : ''}
        ${product.barcode ? `<span>바코드 ${escapeHtml(product.barcode)}</span>` : ''}
      </div>
    </div>
  </div>
  <div class="detail-grid">
    ${fields.map(([label, value]) => `<div class="detail-field"><small>${label}</small><strong>${escapeHtml(value)}</strong></div>`).join('')}
  </div>
  ${product.note ? `<div class="detail-note">${escapeHtml(product.note)}</div>` : ''}
  <div class="detail-actions">
    <a class="primary" href="${escapeHtml(productSearchUrl(product))}" target="_blank" rel="noopener">자사몰에서 보기</a>
    <button type="button" id="copyProductCode">품목코드 복사</button>
    <button type="button" id="searchAgain">새 검색</button>
  </div>`;

  select('#copyProductCode')?.addEventListener('click', async () => {
    await navigator.clipboard.writeText(product.code || product.barcode || product.name);
    showToast('품목코드를 복사했습니다.');
  });

  select('#searchAgain')?.addEventListener('click', () => {
    activateMode('text');
    ui.search.focus();
    ui.search.select();
  });
}

function selectProduct(id) {
  const product = products.find((item) => item.id === id);
  if (!product) return;

  selectedProductId = id;
  selectAll('.result-item', ui.resultList).forEach((button) => {
    button.classList.toggle('active', button.dataset.productId === id);
  });
  renderProductDetail(product);
}

export function runSearch(value, options = {}) {
  const query = String(value || '').trim();
  if (!query) {
    renderResults([], '');
    return [];
  }

  const items = searchCatalog(products, query, options);
  renderResults(items, options.label || `‘${query}’`);
  if (items.length) selectProduct(items[0].id);
  return items;
}

export function handleScannedCode(code, source = '바코드') {
  const value = String(code || '').trim();
  if (!value) return;

  activateMode('text');
  ui.search.value = value;
  const items = runSearch(value, { label: `${source}: ${value}` });
  if (!items.length) showToast(`등록된 상품에서 ${value}를 찾지 못했습니다.`);
}

function prepareProducts(items) {
  return items.map((product, index) => ({
    ...product,
    id: product.id || `imported-${index}`,
    searchText: product.searchText || normalize([
      product.code,
      product.barcode,
      product.brand,
      product.name,
      product.location,
      product.note
    ].join(' '))
  }));
}

async function importSelectedFile() {
  const file = ui.catalogFile.files?.[0];
  if (!file) return;

  ui.importCatalog.disabled = true;
  ui.importProgress.hidden = false;

  try {
    let importedProducts;

    if (file.name.toLowerCase().endsWith('.json')) {
      const data = JSON.parse(await file.text());
      const items = Array.isArray(data) ? data : data.products;
      if (!Array.isArray(items)) throw new Error('올바른 상품 DB 백업 파일이 아닙니다.');
      importedProducts = prepareProducts(items);
    } else {
      importedProducts = buildProducts(parseCsv(await file.text()));
    }

    if (!importedProducts.length) throw new Error('등록 가능한 상품이 없습니다.');

    products = importedProducts;
    selectedProductId = '';
    updateDatabaseStatus({ updatedAt: new Date().toISOString() });
    ui.importDialog.close();
    ui.catalogFile.value = '';
    renderResults(products.slice(0, 50), '불러온 상품');
    showToast(`${products.length.toLocaleString('ko-KR')}개 상품을 불러왔습니다.`);
  } catch (error) {
    console.error(error);
    showToast(error.message || '상품 DB를 만들지 못했습니다.');
  } finally {
    ui.importProgress.hidden = true;
    ui.importCatalog.disabled = !ui.catalogFile.files?.length;
  }
}

function exportCatalog() {
  if (!products.length) {
    showToast('내보낼 상품 DB가 없습니다.');
    return;
  }

  const data = {
    version: 1,
    exportedAt: new Date().toISOString(),
    products
  };
  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `blueblack-product-catalog-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

function clearCatalog() {
  if (!products.length) return;
  if (!confirm('현재 화면에 불러온 상품 DB를 지울까요?')) return;

  products = [];
  selectedProductId = '';
  updateDatabaseStatus();
  renderResults([]);
  ui.detail.innerHTML = renderEmpty('상품을 선택해 주세요.', '검색 결과에서 상품을 누르면 상세 정보가 표시됩니다.');
  showToast('현재 세션의 상품 DB를 지웠습니다.');
}

function bindEvents() {
  selectAll('[data-mode]').forEach((button) => {
    button.addEventListener('click', () => activateMode(button.dataset.mode));
  });

  ui.searchButton.addEventListener('click', () => runSearch(ui.search.value));
  ui.search.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      runSearch(ui.search.value);
    }
  });
  ui.search.addEventListener('input', () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      if (ui.search.value.trim().length >= 2) runSearch(ui.search.value);
    }, 180);
  });

  ui.focusScanner.addEventListener('click', () => {
    activateMode('text');
    ui.search.value = '';
    ui.search.placeholder = '바코드를 스캔하세요…';
    ui.search.focus();
    showToast('USB 바코드 스캐너 입력을 기다립니다.');
  });

  ui.openImport.addEventListener('click', () => ui.importDialog.showModal());
  ui.catalogFile.addEventListener('change', () => {
    ui.importCatalog.disabled = !ui.catalogFile.files?.length;
  });
  ui.importCatalog.addEventListener('click', importSelectedFile);
  ui.exportCatalog.addEventListener('click', exportCatalog);
  ui.clearCatalog.addEventListener('click', clearCatalog);
}

async function initialize() {
  bindEvents();

  try {
    const builtIn = await loadBuiltInCatalog();
    products = prepareProducts(builtIn.products || []);
    updateDatabaseStatus(builtIn);
  } catch (error) {
    console.error(error);
    updateDatabaseStatus();
  }
}

initialize();
