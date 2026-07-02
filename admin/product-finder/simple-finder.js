const MALL_SEARCH_BASE = 'https://blueblack.co.kr/product/search.html?keyword=';

const ui = {
  tabs: [...document.querySelectorAll('[data-mode]')],
  panels: [...document.querySelectorAll('[data-panel]')],
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
  recognizedQuery: document.querySelector('#recognizedQuery'),
  recognizedRaw: document.querySelector('#recognizedRaw'),
  mallLink: document.querySelector('#mallLink'),
  copyMallLink: document.querySelector('#copyMallLink'),
  resetResult: document.querySelector('#resetResult'),
  toast: document.querySelector('#finderToast')
};

let cameraStream = null;
let nativeFrame = 0;
let zxingControls = null;
let selectedPhoto = null;
let selectedPhotoUrl = '';
let tesseractPromise = null;
let zxingPromise = null;

function showToast(message) {
  ui.toast.textContent = message;
  ui.toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => ui.toast.classList.remove('show'), 2800);
}

function activateMode(mode) {
  ui.tabs.forEach((button) => button.classList.toggle('active', button.dataset.mode === mode));
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

function showResult(query, source, rawText = '') {
  const clean = String(query || '').replace(/\s+/g, ' ').trim();
  if (!clean) {
    showToast('인식된 검색어가 없습니다. 다시 촬영해 주세요.');
    return;
  }
  ui.resultHeading.textContent = `${source} 인식 결과`;
  ui.recognizedQuery.value = clean;
  ui.recognizedRaw.textContent = rawText.trim();
  ui.recognizedRaw.hidden = !rawText.trim() || rawText.trim() === clean;
  ui.resultCard.hidden = false;
  updateMallLink();
  ui.resultCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function scoreOcrLine(line) {
  let score = 0;
  if (/[가-힣A-Za-z]/.test(line)) score += 8;
  if (/[A-Za-z]{2,}/.test(line)) score += 4;
  if (/\d/.test(line)) score += 2;
  if (line.length >= 4 && line.length <= 45) score += 5;
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

  const ranked = lines
    .map((line) => ({ line, score: scoreOcrLine(line) }))
    .sort((a, b) => b.score - a.score || a.line.length - b.line.length)
    .filter((item) => item.score > 0);

  return ranked.slice(0, 2).map((item) => item.line).join(' ').slice(0, 100);
}

async function loadZXing() {
  if (!zxingPromise) {
    zxingPromise = import('https://cdn.jsdelivr.net/npm/@zxing/browser@0.1.5/+esm');
  }
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
  const detector = new BarcodeDetector({
    formats: ['ean_13', 'ean_8', 'code_128', 'code_39', 'upc_a', 'upc_e', 'itf', 'qr_code']
  });
  cameraStream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 } },
    audio: false
  });
  ui.video.srcObject = cameraStream;
  await ui.video.play();
  ui.cameraEmpty.hidden = true;

  const scan = async () => {
    if (!cameraStream) return;
    const codes = await detector.detect(ui.video).catch(() => []);
    if (codes[0]?.rawValue) {
      const value = codes[0].rawValue;
      stopCamera();
      showResult(value, '바코드');
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
    showResult(value, '바코드');
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
    showResult(value, '바코드 사진');
    ui.scannerMessage.textContent = `바코드 ${value}를 인식했습니다.`;
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
  ui.recognitionStatus.textContent = file
    ? '사진이 준비됐습니다. 글자 읽기를 눌러 주세요.'
    : '사진은 서버에 저장하지 않고 현재 브라우저에서만 OCR 처리합니다.';
}

async function runOcr() {
  if (!selectedPhoto) return;
  ui.runPhotoSearch.disabled = true;
  try {
    const Tesseract = await loadTesseract();
    ui.recognitionStatus.textContent = 'OCR 준비 중… 첫 실행은 조금 더 걸릴 수 있습니다.';
    const result = await Tesseract.recognize(selectedPhoto, 'kor+eng', {
      logger: ({ status, progress }) => {
        if (status === 'recognizing text') {
          ui.recognitionStatus.textContent = `사진 글자 읽는 중… ${Math.round((progress || 0) * 100)}%`;
        }
      }
    });
    const raw = result?.data?.text || '';
    const query = bestOcrQuery(raw);
    if (!query) throw new Error('상품명을 읽지 못했습니다. 글자가 크게 보이도록 다시 촬영해 주세요.');
    showResult(query, '사진 OCR', raw);
    ui.recognitionStatus.textContent = '인식 완료. 검색어가 다르면 결과 칸에서 수정해 주세요.';
  } catch (error) {
    ui.recognitionStatus.textContent = error.message;
    showToast(error.message);
  } finally {
    ui.runPhotoSearch.disabled = !selectedPhoto;
  }
}

ui.tabs.forEach((button) => button.addEventListener('click', () => activateMode(button.dataset.mode)));
ui.searchButton.addEventListener('click', () => showResult(ui.search.value, '직접 입력'));
ui.search.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') showResult(ui.search.value, '직접 입력');
});
ui.startCamera.addEventListener('click', startCamera);
ui.stopCamera.addEventListener('click', stopCamera);
ui.barcodeImageInput.addEventListener('change', () => handleBarcodeImage(ui.barcodeImageInput.files?.[0]));
ui.photoInput.addEventListener('change', () => setPhoto(ui.photoInput.files?.[0]));
ui.runPhotoSearch.addEventListener('click', runOcr);
ui.clearPhoto.addEventListener('click', () => {
  ui.photoInput.value = '';
  setPhoto(null);
});
ui.recognizedQuery.addEventListener('input', updateMallLink);
ui.mallLink.addEventListener('click', (event) => {
  if (!ui.recognizedQuery.value.trim()) event.preventDefault();
});
ui.copyMallLink.addEventListener('click', async () => {
  const query = ui.recognizedQuery.value.trim();
  if (!query) return showToast('검색어를 입력해 주세요.');
  await navigator.clipboard.writeText(mallUrl(query));
  showToast('블루블랙몰 검색 링크를 복사했습니다.');
});
ui.resetResult.addEventListener('click', () => {
  ui.resultCard.hidden = true;
  ui.recognizedQuery.value = '';
  ui.recognizedRaw.textContent = '';
});
window.addEventListener('pagehide', () => {
  stopCamera();
  if (selectedPhotoUrl) URL.revokeObjectURL(selectedPhotoUrl);
});
