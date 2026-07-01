import {
  activateMode,
  getProducts,
  handleScannedCode,
  runSearch,
  showToast
} from './product-finder-ui.js';

const ZXING_URL = 'https://cdn.jsdelivr.net/npm/@zxing/browser@0.1.5/+esm';
const TESSERACT_URL = 'https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.esm.min.js';

const video = document.querySelector('#barcodeVideo');
const cameraEmpty = document.querySelector('#cameraEmpty');
const scannerMessage = document.querySelector('#scannerMessage');
const startCameraButton = document.querySelector('#startCamera');
const stopCameraButton = document.querySelector('#stopCamera');
const barcodeImageInput = document.querySelector('#barcodeImageInput');
const photoInput = document.querySelector('#photoInput');
const photoPreview = document.querySelector('#photoPreview');
const runPhotoButton = document.querySelector('#runPhotoSearch');
const clearPhotoButton = document.querySelector('#clearPhoto');
const recognitionStatus = document.querySelector('#recognitionStatus');

let cameraStream = null;
let cameraFrame = 0;
let zxingControls = null;
let selectedPhoto = null;
let scannerBuffer = '';
let scannerLastKeyTime = 0;

async function createNativeDetector() {
  if (!('BarcodeDetector' in window)) return null;

  try {
    const formats = await BarcodeDetector.getSupportedFormats();
    return new BarcodeDetector({ formats });
  } catch {
    try {
      return new BarcodeDetector();
    } catch {
      return null;
    }
  }
}

export function stopCameraScan() {
  if (cameraFrame) cancelAnimationFrame(cameraFrame);
  cameraFrame = 0;

  if (cameraStream?.getTracks) {
    cameraStream.getTracks().forEach((track) => track.stop());
  }
  cameraStream = null;

  if (zxingControls?.stop) zxingControls.stop();
  zxingControls = null;

  video.srcObject = null;
  cameraEmpty.hidden = false;
  startCameraButton.disabled = false;
  stopCameraButton.disabled = true;
}

async function startNativeCamera(detector) {
  cameraStream = await navigator.mediaDevices.getUserMedia({
    video: {
      facingMode: { ideal: 'environment' },
      width: { ideal: 1280 },
      height: { ideal: 720 }
    },
    audio: false
  });

  video.srcObject = cameraStream;
  await video.play();
  cameraEmpty.hidden = true;
  startCameraButton.disabled = true;
  stopCameraButton.disabled = false;
  scannerMessage.textContent = '바코드를 화면 중앙에 맞춰 주세요.';

  const detect = async () => {
    if (!cameraStream) return;

    try {
      const codes = await detector.detect(video);
      if (codes.length) {
        handleScannedCode(codes[0].rawValue, '카메라');
        stopCameraScan();
        return;
      }
    } catch {
      // 다음 프레임에서 다시 시도합니다.
    }

    cameraFrame = requestAnimationFrame(detect);
  };

  detect();
}

async function startFallbackCamera() {
  const zxing = await import(ZXING_URL);
  const reader = new zxing.BrowserMultiFormatReader();

  zxingControls = await reader.decodeFromVideoDevice(
    undefined,
    video,
    (result, error, controls) => {
      if (!result) return;
      handleScannedCode(result.getText(), '카메라');
      controls.stop();
      stopCameraScan();
    }
  );

  cameraStream = true;
  cameraEmpty.hidden = true;
  startCameraButton.disabled = true;
  stopCameraButton.disabled = false;
  scannerMessage.textContent = '바코드를 화면 중앙에 맞춰 주세요.';
}

async function startCameraScan() {
  if (!getProducts().length) {
    showToast('먼저 재고 CSV를 불러와 주세요.');
    return;
  }

  stopCameraScan();
  scannerMessage.textContent = '카메라 권한을 요청하고 있습니다.';

  try {
    const detector = await createNativeDetector();
    if (detector) {
      await startNativeCamera(detector);
    } else {
      await startFallbackCamera();
    }
  } catch (error) {
    console.error(error);
    stopCameraScan();
    scannerMessage.textContent = '카메라를 시작하지 못했습니다. 권한을 확인하거나 바코드 사진을 선택해 주세요.';
    showToast('카메라 사용을 시작하지 못했습니다.');
  }
}

async function detectBarcodeInFile(file) {
  const detector = await createNativeDetector();

  if (detector) {
    const bitmap = await createImageBitmap(file);
    try {
      const codes = await detector.detect(bitmap);
      return codes[0]?.rawValue || '';
    } finally {
      bitmap.close?.();
    }
  }

  try {
    const zxing = await import(ZXING_URL);
    const reader = new zxing.BrowserMultiFormatReader();
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.src = url;
    await image.decode();

    try {
      const result = await reader.decodeFromImageElement(image);
      return result?.getText?.() || '';
    } finally {
      URL.revokeObjectURL(url);
      reader.reset?.();
    }
  } catch {
    return '';
  }
}

function setPhoto(file) {
  selectedPhoto = file || null;

  if (!file) {
    photoPreview.innerHTML = '<span>선택한 사진이 여기에 표시됩니다.</span>';
    runPhotoButton.disabled = true;
    clearPhotoButton.disabled = true;
    return;
  }

  const url = URL.createObjectURL(file);
  photoPreview.innerHTML = `<img src="${url}" alt="검색할 제품 사진">`;
  photoPreview.querySelector('img').addEventListener('load', () => URL.revokeObjectURL(url), { once: true });
  runPhotoButton.disabled = false;
  clearPhotoButton.disabled = false;
  recognitionStatus.textContent = '사진이 준비되었습니다. ‘사진으로 검색’을 눌러 주세요.';
}

async function runPhotoSearch() {
  if (!selectedPhoto) return;
  if (!getProducts().length) {
    showToast('먼저 재고 CSV를 불러와 주세요.');
    return;
  }

  runPhotoButton.disabled = true;

  try {
    recognitionStatus.textContent = '1단계: 사진 속 바코드를 찾고 있습니다.';
    const barcode = await detectBarcodeInFile(selectedPhoto);

    if (barcode) {
      handleScannedCode(barcode, '사진 바코드');
      recognitionStatus.textContent = `바코드 ${barcode}를 인식했습니다.`;
      return;
    }

    recognitionStatus.textContent = '2단계: 사진 속 상품명과 모델명을 읽고 있습니다. 최초 실행은 조금 오래 걸릴 수 있습니다.';
    const tesseract = await import(TESSERACT_URL);
    const worker = await tesseract.createWorker('kor+eng', 1, {
      logger(message) {
        if (message.status === 'recognizing text') {
          recognitionStatus.textContent = `문자 인식 중 ${Math.round((message.progress || 0) * 100)}%`;
        }
      }
    });

    const result = await worker.recognize(selectedPhoto);
    await worker.terminate();
    const recognizedText = String(result.data?.text || '').trim();

    if (!recognizedText) {
      recognitionStatus.textContent = '사진에서 읽을 수 있는 글자를 찾지 못했습니다.';
      runSearch('', { label: '사진 속 문자', ocr: true });
      return;
    }

    const compactText = recognizedText.replace(/\s+/g, ' ').slice(0, 120);
    recognitionStatus.textContent = `인식한 문자: ${compactText}${recognizedText.length > 120 ? '…' : ''}`;
    runSearch(recognizedText, { label: '사진 속 문자', ocr: true });
  } catch (error) {
    console.error(error);
    recognitionStatus.textContent = '사진 분석에 실패했습니다. 더 밝고 글자가 선명한 사진으로 다시 시도해 주세요.';
    showToast('사진 검색에 실패했습니다.');
  } finally {
    runPhotoButton.disabled = false;
  }
}

startCameraButton.addEventListener('click', startCameraScan);
stopCameraButton.addEventListener('click', stopCameraScan);

barcodeImageInput.addEventListener('change', async () => {
  const file = barcodeImageInput.files?.[0];
  if (!file) return;

  scannerMessage.textContent = '사진에서 바코드를 찾고 있습니다.';
  const code = await detectBarcodeInFile(file);

  if (code) {
    handleScannedCode(code, '사진 바코드');
  } else {
    scannerMessage.textContent = '바코드를 찾지 못했습니다. 사진 검색에서 상품명 인식을 사용해 보세요.';
    showToast('사진에서 바코드를 찾지 못했습니다.');
  }

  barcodeImageInput.value = '';
});

photoInput.addEventListener('change', () => setPhoto(photoInput.files?.[0]));
runPhotoButton.addEventListener('click', runPhotoSearch);
clearPhotoButton.addEventListener('click', () => {
  photoInput.value = '';
  setPhoto(null);
  recognitionStatus.textContent = '사진은 외부 서버에 저장되지 않으며 브라우저에서 분석됩니다.';
});

document.addEventListener('finder-mode-change', (event) => {
  if (event.detail.mode !== 'barcode') stopCameraScan();
});

document.addEventListener('keydown', (event) => {
  const activeTag = document.activeElement?.tagName;
  if (['INPUT', 'TEXTAREA', 'SELECT'].includes(activeTag)) return;

  const now = Date.now();
  if (now - scannerLastKeyTime > 120) scannerBuffer = '';
  scannerLastKeyTime = now;

  if (event.key === 'Enter') {
    if (scannerBuffer.length >= 4) handleScannedCode(scannerBuffer, 'USB 스캐너');
    scannerBuffer = '';
    return;
  }

  if (event.key.length === 1) scannerBuffer += event.key;
});

window.addEventListener('pagehide', stopCameraScan);
