const SUPABASE_URL = 'https://jnciddblcndmthmmvqrz.supabase.co';
const SUPABASE_KEY = 'sb_publishable_UUzSE7O9wqI0WN9cKG9OAQ_VleRkL4I';
const MALL_SEARCH_BASE = 'https://blueblack.co.kr/product/search.html?keyword=';

const ui = {
  tabs: [...document.querySelectorAll('[data-mode]')],
  panels: [...document.querySelectorAll('[data-panel]')],
  catalogStatus: document.querySelector('#catalogStatus'),
  search: document.querySelector('#productSearch'),
  searchButton: document.querySelector('#searchButton'),
  video: document.querySelector('#barcodeVideo'),
  cameraEmpty: document.querySelector('#cameraEmpty'),
  startCamera: document.querySelector('#startCamera'),
  stopCamera: document.querySelector('#stopCamera'),
  barcodeImageInput: document.querySelector('#barcodeImageInput'),
  scannerMessage: document.querySelector('#scannerMessage'),
  photoInput: document.querySelector('#photoInput'),
  photoPreview: document.querySelector('#photoPreview'),
  runPhotoSearch: document.querySelector('#runPhotoSearch'),
  clearPhoto: document.querySelector('#clearPhoto'),
  recognitionStatus: document.querySelector('#recognitionStatus'),
  resultCard: document.querySelector('#resultCard'),
  resultHeading: document.querySelector('#resultHeading'),
  resultSummary: document.querySelector('#resultSummary'),
  resultCandidates: document.querySelector('#resultCandidates'),
  productDetail: document.querySelector('#productDetail'),
  productImage: document.querySelector('#productImage'),
  productBrand: document.querySelector('#productBrand'),
  productName: document.querySelector('#productName'),
  productMeta: document.querySelector('#productMeta'),
  productPrice: document.querySelector('#productPrice'),
  productFields: document.querySelector('#productFields'),
  productNote: document.querySelector('#productNote'),
  updateInfo: document.querySelector('#updateInfo'),
  recognizedQuery: document.querySelector('#recognizedQuery'),
  recognizedRaw: document.querySelector('#recognizedRaw'),
  mallLink: document.querySelector('#mallLink'),
  webLookupLink: document.querySelector('#webLookupLink'),
  copyMallLink: document.querySelector('#copyMallLink'),
  resetResult: document.querySelector('#resetResult'),
  resultNote: document.querySelector('#resultNote'),
  toast: document.querySelector('#finderToast')
};

let cameraStream = null;
let nativeFrame = 0;
let zxingControls = null;
let selectedPhoto = null;
let selectedPhotoUrl = '';
let tesseractPromise = null;
let zxingPromise = null;
let currentProducts = [];
let selectedProductId = null;
let catalogMeta = null;

function showToast(message) {
  ui.toast.textContent = message;
  ui.toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => ui.toast.classList.remove('show'), 2800);
}

function activateMode(mode) {
  ui.tabs.forEach((button) => {
    const active = button.dataset.mode === mode;
    button.classList.toggle('active', active);
    button.setAttribute('aria-selected', String(active));
  });
  ui.panels.forEach((panel) => panel.classList.toggle('active', panel.dataset.panel === mode));
  if (mode !== 'barcode') stopCamera();
  if (mode === 'text') setTimeout(() => ui.search.focus(), 30);
}

function mallUrl(query) {
  return `${MALL_SEARCH_BASE}${encodeURIComponent(String(query || '').trim())}`;
}

function updateMallLink() {
  const query = ui.recognizedQuery.value.trim();
  ui.mallLink.href = query ? mallUrl(query) : '#';
  ui.mallLink.setAttribute('aria-disabled', query ? 'false' : 'true');
}

function formatNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number.toLocaleString('ko-KR') : '';
}

function formatPrice(value) {
  const number = Number(value);
  return Number.isFinite(number) ? `${number.toLocaleString('ko-KR')}원` : '등록 없음';
}

function formatDateTime(value) {
  if (!value) return '업데이트 기록 없음';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '업데이트 기록 없음';
  return new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

function initials(value) {
  const text = String(value || '').trim();
  if (!text) return 'BB';
  const parts = text.split(/\s+/).filter(Boolean);
  if (parts.length > 1) return parts.slice(0, 2).map((part) => part[0]).join('').toUpperCase();
  return text.slice(0, 2).toUpperCase();
}

async function rpc(name, body = {}) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${name}`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.message || data?.error || '상품 DB 요청에 실패했습니다.');
  return data;
}

async function loadCatalogStatus() {
  try {
    const rows = await rpc('internal_product_status_public');
    catalogMeta = Array.isArray(rows) ? rows[0] || null : rows;
    const count = Number(catalogMeta?.item_count || 0);
    ui.catalogStatus.classList.remove('loading', 'error');
    ui.catalogStatus.innerHTML = count
      ? `<strong>${count.toLocaleString('ko-KR')}개 상품 연결됨</strong><small>상품·바코드 ${formatDateTime(catalogMeta.info_updated_at)}<br>재고 ${formatDateTime(catalogMeta.stock_updated_at)}</small>`
      : '<strong>상품 데이터 준비 중</strong><small>상품 파일을 업데이트하면 검색을 시작할 수 있습니다.</small>';
  } catch (error) {
    ui.catalogStatus.classList.remove('loading');
    ui.catalogStatus.classList.add('error');
    ui.catalogStatus.innerHTML = `<strong>상품 DB 연결 오류</strong><small>${error.message}</small>`;
  }
}

function clearProductDetail() {
  ui.productDetail.hidden = true;
  ui.productName.textContent = '';
  ui.productMeta.textContent = '';
  ui.productFields.replaceChildren();
  ui.productPrice.replaceChildren();
  ui.productNote.hidden = true;
  ui.productNote.textContent = '';
  ui.updateInfo.replaceChildren();
}

function setRawText(text) {
  const value = String(text || '').trim();
  ui.recognizedRaw.textContent = value;
  ui.recognizedRaw.hidden = !value;
}

function detailField(label, value, className = '') {
  const field = document.createElement('div');
  const small = document.createElement('small');
  const strong = document.createElement('strong');
  field.className = `detail-field ${className}`.trim();
  small.textContent = label;
  strong.textContent = value || '등록 없음';
  field.append(small, strong);
  return field;
}

function stockState(value) {
  if (value === null || value === undefined || value === '') return { text: '재고 정보 없음', className: 'stock-warning' };
  const number = Number(value);
  if (!Number.isFinite(number)) return { text: '재고 확인 필요', className: 'stock-warning' };
  if (number > 0) return { text: `${formatNumber(number)}개`, className: 'stock-ok' };
  if (number === 0) return { text: '0개', className: 'stock-empty' };
  return { text: `${formatNumber(number)}개 · 확인 필요`, className: 'stock-warning' };
}

function renderProduct(product) {
  selectedProductId = product.id;
  ui.productDetail.hidden = false;
  ui.productImage.textContent = initials(product.manufacturer || product.product_name);
  ui.productBrand.textContent = [product.manufacturer, product.product_type].filter(Boolean).join(' · ') || 'BLUEBLACK INTERNAL PRODUCT';
  ui.productName.textContent = product.product_name;
  ui.productMeta.textContent = [product.item_code && `품목코드 ${product.item_code}`, product.barcode && `바코드 ${product.barcode}`].filter(Boolean).join(' · ') || '코드 정보 미등록';

  ui.productPrice.replaceChildren();
  const price = document.createElement('strong');
  price.textContent = formatPrice(product.sale_price ?? product.store_price ?? product.consumer_price);
  ui.productPrice.append(price);
  const comparePrice = Number(product.consumer_price);
  const salePrice = Number(product.sale_price);
  if (Number.isFinite(comparePrice) && Number.isFinite(salePrice) && comparePrice !== salePrice) {
    const span = document.createElement('span');
    span.textContent = formatPrice(comparePrice);
    ui.productPrice.append(span);
  }

  const stock = stockState(product.stock_qty);
  ui.productFields.replaceChildren(
    detailField('판매가', formatPrice(product.sale_price)),
    detailField('소비자가', formatPrice(product.consumer_price)),
    detailField('매장가', formatPrice(product.store_price)),
    detailField('재고수량', stock.text, stock.className),
    detailField('재고 위치', product.location || '등록 없음'),
    detailField('종류', product.product_type || '등록 없음'),
    detailField('제조사', product.manufacturer || '등록 없음'),
    detailField('품목코드', product.item_code || '등록 없음'),
    detailField('바코드', product.barcode || '등록 없음')
  );

  ui.productNote.hidden = !product.note;
  ui.productNote.textContent = product.note ? `적요 · ${product.note}` : '';

  const infoTime = product.info_updated_at || catalogMeta?.info_updated_at;
  const stockTime = product.stock_updated_at || catalogMeta?.stock_updated_at;
  ui.updateInfo.innerHTML = `<strong>마지막 동기화</strong><span>상품·바코드 정보: ${formatDateTime(infoTime)}</span><span>재고 정보: ${formatDateTime(stockTime)}</span>`;

  ui.recognizedQuery.value = product.product_name || product.item_code || product.barcode || '';
  updateMallLink();
  ui.resultNote.textContent = '가격·재고·위치는 마지막 파일 업로드 시점 기준입니다. 판매 전 이카운트와 실물 재고를 함께 확인해 주세요.';

  [...ui.resultCandidates.querySelectorAll('.candidate-button')].forEach((button) => {
    button.classList.toggle('active', String(button.dataset.id) === String(product.id));
  });
}

function renderCandidates(products) {
  ui.resultCandidates.replaceChildren();
  ui.resultCandidates.hidden = products.length <= 1;
  if (products.length <= 1) return;

  products.forEach((product) => {
    const button = document.createElement('button');
    const copy = document.createElement('span');
    const title = document.createElement('strong');
    const meta = document.createElement('span');
    const price = document.createElement('b');
    button.type = 'button';
    button.className = 'candidate-button';
    button.dataset.id = product.id;
    title.textContent = product.product_name;
    meta.textContent = [
      product.manufacturer,
      product.item_code && `품목코드 ${product.item_code}`,
      product.barcode && `바코드 ${product.barcode}`,
      product.location && `위치 ${product.location}`
    ].filter(Boolean).join(' · ');
    price.textContent = formatPrice(product.sale_price ?? product.store_price ?? product.consumer_price);
    copy.append(title, meta);
    button.append(copy, price);
    button.addEventListener('click', () => renderProduct(product));
    ui.resultCandidates.append(button);
  });
}

function showEmptyResult(query, source, rawText = '') {
  currentProducts = [];
  selectedProductId = null;
  ui.resultCard.hidden = false;
  ui.resultHeading.textContent = '등록 상품을 찾지 못했습니다';
  ui.resultSummary.textContent = `${source} · “${query}”`;
  ui.resultCandidates.hidden = false;
  ui.resultCandidates.innerHTML = '<div class="empty-result"><strong>검색 결과가 없습니다.</strong>상품명 일부, 품목코드 또는 바코드를 다시 확인해 주세요.</div>';
  clearProductDetail();
  ui.recognizedQuery.value = query;
  setRawText(rawText);
  updateMallLink();
  ui.resultNote.textContent = '이카운트 파일에 아직 등록되지 않았거나 상품·바코드 정보 파일과 재고 파일의 품목코드가 다를 수 있습니다.';
  ui.resultCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

async function searchProducts(query, source = '검색', rawText = '') {
  const clean = String(query || '').replace(/\s+/g, ' ').trim();
  if (clean.length < 2) {
    showToast('검색어를 두 글자 이상 입력해 주세요.');
    return [];
  }

  ui.searchButton.disabled = true;
  ui.resultCard.hidden = false;
  ui.resultHeading.textContent = '상품을 찾고 있습니다…';
  ui.resultSummary.textContent = `${source} · “${clean}”`;
  ui.resultCandidates.hidden = true;
  clearProductDetail();
  ui.recognizedQuery.value = clean;
  setRawText(rawText);
  updateMallLink();
  ui.resultCard.scrollIntoView({ behavior: 'smooth', block: 'start' });

  try {
    const products = await rpc('internal_product_search_public', { p_query: clean, p_limit: 50 });
    currentProducts = Array.isArray(products) ? products : [];
    if (!currentProducts.length) {
      showEmptyResult(clean, source, rawText);
      return [];
    }

    ui.resultHeading.textContent = currentProducts.length === 1 ? '상품 확인 완료' : `${currentProducts.length}개 상품을 찾았습니다`;
    ui.resultSummary.textContent = `${source} · 정확한 색상과 규격을 선택해 주세요.`;
    renderCandidates(currentProducts);
    renderProduct(currentProducts[0]);
    showToast(currentProducts.length === 1 ? '상품 정보를 확인했습니다.' : `${currentProducts.length}개 후보를 찾았습니다.`);
    return currentProducts;
  } catch (error) {
    ui.resultHeading.textContent = '상품 DB 연결 오류';
    ui.resultSummary.textContent = error.message;
    ui.resultCandidates.hidden = false;
    ui.resultCandidates.innerHTML = '<div class="empty-result"><strong>잠시 후 다시 시도해 주세요.</strong>네트워크 연결 또는 상품 DB 상태를 확인해 주세요.</div>';
    clearProductDetail();
    showToast(error.message);
    return [];
  } finally {
    ui.searchButton.disabled = false;
  }
}

async function resolveBarcode(value, source = '바코드') {
  const barcode = String(value || '').trim();
  if (!barcode) return;
  ui.scannerMessage.textContent = `바코드 ${barcode} 상품을 확인하고 있습니다…`;
  const products = await searchProducts(barcode, source, `인식 바코드: ${barcode}`);
  ui.scannerMessage.textContent = products.length
    ? `${products[0].product_name}${products.length > 1 ? ` 외 ${products.length - 1}개` : ''}를 확인했습니다.`
    : '바코드는 읽었지만 등록된 상품을 찾지 못했습니다.';
}

function scoreOcrLine(line) {
  let score = 0;
  if (/[가-힣A-Za-z]/.test(line)) score += 8;
  if (/[A-Za-z]{2,}/.test(line)) score += 4;
  if (/\d/.test(line)) score += 2;
  if (line.length >= 4 && line.length <= 55) score += 5;
  if (/^(www\.|https?:|made in|warning|주의)/i.test(line)) score -= 8;
  if (/^[\d\W]+$/.test(line)) score -= 6;
  return score;
}

function bestOcrQuery(text) {
  const lines = String(text || '')
    .split(/\r?\n/)
    .map((line) => line.replace(/[|_]+/g, ' ').replace(/\s+/g, ' ').trim())
    .filter((line) => line.length >= 2 && line.length <= 90)
    .filter((line, index, list) => list.indexOf(line) === index);
  return lines
    .map((line) => ({ line, score: scoreOcrLine(line) }))
    .sort((a, b) => b.score - a.score || a.line.length - b.line.length)
    .filter((item) => item.score > 0)
    .slice(0, 2)
    .map((item) => item.line)
    .join(' ')
    .slice(0, 100);
}

async function loadZXing() {
  if (!zxingPromise) zxingPromise = import('https://cdn.jsdelivr.net/npm/@zxing/browser@0.1.5/+esm');
  return zxingPromise;
}

async function loadTesseract() {
  if (window.Tesseract) return window.Tesseract;
  if (!tesseractPromise) {
    tesseractPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
      script.onload = () => resolve(window.Tesseract);
      script.onerror = () => reject(new Error('OCR 모듈을 불러오지 못했습니다.'));
      document.head.append(script);
    });
  }
  return tesseractPromise;
}

function stopCamera() {
  if (nativeFrame) cancelAnimationFrame(nativeFrame);
  nativeFrame = 0;
  zxingControls?.stop?.();
  zxingControls = null;
  cameraStream?.getTracks?.().forEach((track) => track.stop());
  cameraStream = null;
  ui.video.srcObject = null;
  ui.startCamera.disabled = false;
  ui.stopCamera.disabled = true;
  ui.cameraEmpty.hidden = false;
}

async function startNativeScanner() {
  const detector = new BarcodeDetector({ formats: ['ean_13', 'ean_8', 'code_128', 'code_39', 'upc_a', 'upc_e', 'itf', 'qr_code'] });
  cameraStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 } }, audio: false });
  ui.video.srcObject = cameraStream;
  await ui.video.play();
  ui.cameraEmpty.hidden = true;

  const scan = async () => {
    if (!cameraStream) return;
    const codes = await detector.detect(ui.video).catch(() => []);
    if (codes[0]?.rawValue) {
      const value = codes[0].rawValue;
      stopCamera();
      await resolveBarcode(value, '바코드 스캔');
      return;
    }
    nativeFrame = requestAnimationFrame(scan);
  };
  scan();
}

async function startZXingScanner() {
  const { BrowserMultiFormatReader } = await loadZXing();
  const reader = new BrowserMultiFormatReader();
  zxingControls = await reader.decodeFromVideoDevice(undefined, ui.video, (result) => {
    if (!result) return;
    const value = result.getText();
    stopCamera();
    resolveBarcode(value, '바코드 스캔');
  });
  ui.cameraEmpty.hidden = true;
}

async function startCamera() {
  stopCamera();
  ui.startCamera.disabled = true;
  ui.stopCamera.disabled = false;
  ui.scannerMessage.textContent = '바코드를 인식하고 있습니다…';
  try {
    if ('BarcodeDetector' in window) await startNativeScanner();
    else await startZXingScanner();
    ui.scannerMessage.textContent = '바코드를 화면 중앙에 천천히 맞춰 주세요.';
  } catch (error) {
    stopCamera();
    ui.scannerMessage.textContent = '카메라 권한을 허용한 뒤 다시 시도해 주세요.';
    showToast(error?.message || '카메라를 시작하지 못했습니다.');
  }
}

function fileToImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => resolve({ image, url });
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('이미지를 읽지 못했습니다.'));
    };
    image.src = url;
  });
}

async function detectBarcodeFromFile(file) {
  const { image, url } = await fileToImage(file);
  try {
    if ('BarcodeDetector' in window) {
      const detector = new BarcodeDetector();
      const codes = await detector.detect(image);
      return codes[0]?.rawValue || '';
    }
    const { BrowserMultiFormatReader } = await loadZXing();
    const reader = new BrowserMultiFormatReader();
    const result = await reader.decodeFromImageElement(image);
    return result?.getText?.() || '';
  } finally {
    URL.revokeObjectURL(url);
  }
}

async function handleBarcodeImage(file) {
  if (!file) return;
  ui.scannerMessage.textContent = '바코드 사진을 분석하고 있습니다…';
  try {
    const value = await detectBarcodeFromFile(file);
    if (!value) throw new Error('바코드를 찾지 못했습니다. 더 선명하게 촬영해 주세요.');
    await resolveBarcode(value, '바코드 사진');
  } catch (error) {
    ui.scannerMessage.textContent = error.message;
    showToast(error.message);
  } finally {
    ui.barcodeImageInput.value = '';
  }
}

function setPhoto(file) {
  if (selectedPhotoUrl) URL.revokeObjectURL(selectedPhotoUrl);
  selectedPhoto = file || null;
  selectedPhotoUrl = file ? URL.createObjectURL(file) : '';
  ui.photoPreview.replaceChildren();
  if (file) {
    const image = new Image();
    image.src = selectedPhotoUrl;
    image.alt = 'OCR 촬영 이미지';
    ui.photoPreview.append(image);
  } else {
    const span = document.createElement('span');
    span.textContent = '선택한 사진이 여기에 표시됩니다.';
    ui.photoPreview.append(span);
  }
  ui.runPhotoSearch.disabled = !file;
  ui.clearPhoto.disabled = !file;
  ui.recognitionStatus.textContent = file ? '사진이 준비됐습니다. 글자 읽기를 눌러 주세요.' : '사진은 서버에 저장하지 않고 현재 브라우저에서만 OCR 처리합니다.';
}

async function runOcr() {
  if (!selectedPhoto) return;
  ui.runPhotoSearch.disabled = true;
  try {
    const Tesseract = await loadTesseract();
    ui.recognitionStatus.textContent = 'OCR 준비 중… 첫 실행은 조금 더 걸릴 수 있습니다.';
    const result = await Tesseract.recognize(selectedPhoto, 'kor+eng', {
      logger: ({ status, progress }) => {
        if (status === 'recognizing text') ui.recognitionStatus.textContent = `사진 글자 읽는 중… ${Math.round((progress || 0) * 100)}%`;
      }
    });
    const raw = result?.data?.text || '';
    const query = bestOcrQuery(raw);
    if (!query) throw new Error('상품명을 읽지 못했습니다. 글자가 크게 보이도록 다시 촬영해 주세요.');
    await searchProducts(query, '사진 OCR', raw);
    ui.recognitionStatus.textContent = '인식 완료. 결과가 다르면 이름 검색으로 다시 확인해 주세요.';
  } catch (error) {
    ui.recognitionStatus.textContent = error.message;
    showToast(error.message);
  } finally {
    ui.runPhotoSearch.disabled = !selectedPhoto;
  }
}

async function submitManualSearch() {
  const value = ui.search.value.trim();
  if (!value) return showToast('검색어를 입력해 주세요.');
  await searchProducts(value, '직접 입력');
}

ui.tabs.forEach((button) => button.addEventListener('click', () => activateMode(button.dataset.mode)));
ui.searchButton.addEventListener('click', submitManualSearch);
ui.search.addEventListener('keydown', (event) => { if (event.key === 'Enter') submitManualSearch(); });
ui.startCamera.addEventListener('click', startCamera);
ui.stopCamera.addEventListener('click', stopCamera);
ui.barcodeImageInput.addEventListener('change', () => handleBarcodeImage(ui.barcodeImageInput.files?.[0]));
ui.photoInput.addEventListener('change', () => setPhoto(ui.photoInput.files?.[0]));
ui.runPhotoSearch.addEventListener('click', runOcr);
ui.clearPhoto.addEventListener('click', () => { ui.photoInput.value = ''; setPhoto(null); });
ui.recognizedQuery.addEventListener('input', updateMallLink);
ui.mallLink.addEventListener('click', (event) => { if (!ui.recognizedQuery.value.trim()) event.preventDefault(); });
ui.copyMallLink.addEventListener('click', async () => {
  const query = ui.recognizedQuery.value.trim();
  if (!query) return showToast('검색어를 입력해 주세요.');
  await navigator.clipboard.writeText(mallUrl(query));
  showToast('블루블랙몰 검색 링크를 복사했습니다.');
});
ui.resetResult.addEventListener('click', () => {
  ui.resultCard.hidden = true;
  ui.recognizedQuery.value = '';
  setRawText('');
  clearProductDetail();
  ui.resultCandidates.replaceChildren();
  ui.resultCandidates.hidden = true;
  currentProducts = [];
  selectedProductId = null;
});
window.addEventListener('pagehide', () => {
  stopCamera();
  if (selectedPhotoUrl) URL.revokeObjectURL(selectedPhotoUrl);
});

loadCatalogStatus();
