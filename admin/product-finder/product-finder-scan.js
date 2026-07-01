import { handleScannedCode, isAuthorized, showToast } from './product-finder-ui.js';

const video = document.querySelector('#barcodeVideo');
const start = document.querySelector('#startCamera');
const stop = document.querySelector('#stopCamera');
let stream;
let frame;

function closeCamera() {
  if (frame) cancelAnimationFrame(frame);
  stream?.getTracks?.().forEach((track) => track.stop());
  stream = null;
  video.srcObject = null;
  start.disabled = false;
  stop.disabled = true;
}

async function openCamera() {
  if (!isAuthorized()) return showToast('관리자 접근키를 먼저 입력해 주세요.');
  if (!('BarcodeDetector' in window)) return showToast('이 브라우저는 바코드 인식을 지원하지 않습니다.');

  const detector = new BarcodeDetector();
  stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: { ideal: 'environment' } },
    audio: false
  });
  video.srcObject = stream;
  await video.play();
  start.disabled = true;
  stop.disabled = false;

  const scan = async () => {
    if (!stream) return;
    const codes = await detector.detect(video).catch(() => []);
    if (codes[0]?.rawValue) {
      closeCamera();
      await handleScannedCode(codes[0].rawValue, '카메라');
      return;
    }
    frame = requestAnimationFrame(scan);
  };
  scan();
}

start.addEventListener('click', () => openCamera().catch(() => showToast('카메라 권한을 확인해 주세요.')));
stop.addEventListener('click', closeCamera);
window.addEventListener('pagehide', closeCamera);
