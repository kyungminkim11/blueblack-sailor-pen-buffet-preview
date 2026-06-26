import { parts } from './data.js';
import { getLanguage } from './i18n-v3.js';

const STORAGE_KEY = 'blueblack-pen-combination-query';
const TOUCHED_KEY = 'blueblack-pen-completed-parts';

const copy = {
  ko: {
    progress: '선택 완료',
    shareTitle: '조합을 휴대폰에 저장해보세요',
    shareCopy: 'QR 코드를 스캔하거나 공유 버튼을 눌러 현재 조합을 그대로 열 수 있습니다.',
    scan: '휴대폰 카메라로 QR 코드를 스캔해 주세요.',
    nativeShare: '공유창 열기',
    copyLink: '링크 복사',
    close: '닫기',
    copied: '조합 링크를 복사했습니다.',
    qrError: 'QR 코드를 만들지 못했습니다. 링크 복사를 이용해 주세요.',
    saveStarted: '조합 이미지를 저장했습니다.',
    imageTitle: '나의 세일러 펜뷔페 조합',
    imageSubtitle: 'BlueBlack Pen Shop · Combination Preview',
    imageNotice: '화면 색상은 실제 파츠와 다를 수 있습니다. 최종 선택 전 매장 실물을 확인해 주세요.',
  },
  en: {
    progress: 'Completed',
    shareTitle: 'Save this combination to your phone',
    shareCopy: 'Scan the QR code or use the share button to open the same combination on another device.',
    scan: 'Scan this QR code with your phone camera.',
    nativeShare: 'Open share menu',
    copyLink: 'Copy link',
    close: 'Close',
    copied: 'Combination link copied.',
    qrError: 'The QR code could not be created. Please use Copy link.',
    saveStarted: 'Combination image saved.',
    imageTitle: 'My Sailor Pen Buffet Combination',
    imageSubtitle: 'BlueBlack Pen Shop · Combination Preview',
    imageNotice: 'Screen colors may differ from the actual parts. Please confirm the physical parts in store.',
  },
  ja: {
    progress: '選択完了',
    shareTitle: '組み合わせをスマートフォンに保存',
    shareCopy: 'QRコードを読み取るか共有ボタンを使うと、同じ組み合わせを別の端末で開けます。',
    scan: 'スマートフォンのカメラでQRコードを読み取ってください。',
    nativeShare: '共有メニューを開く',
    copyLink: 'リンクをコピー',
    close: '閉じる',
    copied: '組み合わせリンクをコピーしました。',
    qrError: 'QRコードを作成できませんでした。リンクコピーをご利用ください。',
    saveStarted: '組み合わせ画像を保存しました。',
    imageTitle: 'マイ セーラー万年筆ビュッフェ',
    imageSubtitle: 'BlueBlack Pen Shop · Combination Preview',
    imageNotice: '画面の色は実物と異なる場合があります。最終選択前に店頭で実物をご確認ください。',
  },
};

function text() {
  return copy[getLanguage()] ?? copy.ko;
}

function restoreSavedQuery() {
  const query = new URLSearchParams(location.search);
  const hasPartSelection = parts.some((part) => query.has(part.id));
  if (hasPartSelection) return;

  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return;

  const savedQuery = new URLSearchParams(saved);
  for (const part of parts) {
    const value = savedQuery.get(part.id);
    if (value) query.set(part.id, value);
  }
  const language = savedQuery.get('lang');
  if (language && !query.has('lang')) query.set('lang', language);
  history.replaceState(null, '', `${location.pathname}?${query}`);
}

restoreSavedQuery();

function readTouched() {
  try {
    const saved = JSON.parse(localStorage.getItem(TOUCHED_KEY) ?? '[]');
    return new Set(saved.filter((id) => parts.some((part) => part.id === id)));
  } catch {
    return new Set();
  }
}

const touchedParts = readTouched();
const queryAtLoad = new URLSearchParams(location.search);
if (parts.every((part) => queryAtLoad.has(part.id))) {
  for (const part of parts) touchedParts.add(part.id);
}

function persistState() {
  localStorage.setItem(STORAGE_KEY, location.search.replace(/^\?/, ''));
  localStorage.setItem(TOUCHED_KEY, JSON.stringify([...touchedParts]));
}

function activePartId() {
  const buttons = [...document.querySelectorAll('#part-grid .part-button')];
  const index = buttons.findIndex((button) => button.getAttribute('aria-selected') === 'true');
  return parts[index]?.id ?? parts[0].id;
}

function ensureProgressUi() {
  const title = document.querySelector('.control-title');
  if (!title || document.querySelector('.completion-progress')) return;

  const progress = document.createElement('div');
  progress.className = 'completion-progress';
  progress.innerHTML = `
    <div class="completion-progress-head"><span></span><strong></strong></div>
    <div class="completion-track" role="progressbar" aria-valuemin="0" aria-valuemax="${parts.length}"><i></i></div>
  `;
  title.insertAdjacentElement('afterend', progress);
}

function updateProgress() {
  ensureProgressUi();
  const value = touchedParts.size;
  const progress = document.querySelector('.completion-progress');
  if (!progress) return;

  progress.querySelector('span').textContent = text().progress;
  progress.querySelector('strong').textContent = `${value} / ${parts.length}`;
  const track = progress.querySelector('.completion-track');
  track.setAttribute('aria-valuenow', String(value));
  track.querySelector('i').style.width = `${(value / parts.length) * 100}%`;

  [...document.querySelectorAll('#part-grid .part-button')].forEach((button, index) => {
    const complete = touchedParts.has(parts[index]?.id);
    button.classList.toggle('is-complete', complete);
    let check = button.querySelector('.part-complete-check');
    if (complete && !check) {
      check = document.createElement('span');
      check.className = 'part-complete-check';
      check.textContent = '✓';
      button.append(check);
    } else if (!complete) {
      check?.remove();
    }
  });
}

function showToast(message) {
  const toast = document.querySelector('#toast');
  if (!toast) return;
  toast.textContent = message;
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    if (toast.textContent === message) toast.textContent = '';
  }, 2600);
}

function createShareDialog() {
  let dialog = document.querySelector('#share-dialog');
  if (dialog) return dialog;

  dialog = document.createElement('dialog');
  dialog.id = 'share-dialog';
  dialog.className = 'share-dialog';
  dialog.innerHTML = `
    <div class="share-dialog-body">
      <div class="share-dialog-head">
        <div><h2></h2><p></p></div>
        <button type="button" class="share-close" aria-label="Close">×</button>
      </div>
      <div class="qr-shell">
        <canvas id="share-qr" width="220" height="220"></canvas>
        <p class="qr-status"></p>
      </div>
      <p class="share-url"></p>
      <div class="share-dialog-actions">
        <button type="button" class="primary" id="native-share"></button>
        <button type="button" class="secondary" id="copy-share-link"></button>
      </div>
    </div>
  `;
  document.body.append(dialog);

  dialog.querySelector('.share-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.querySelector('#copy-share-link').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(location.href);
      showToast(text().copied);
      dialog.close();
    } catch {
      dialog.querySelector('.share-url').textContent = location.href;
    }
  });
  dialog.querySelector('#native-share').addEventListener('click', async () => {
    if (!navigator.share) {
      dialog.querySelector('#copy-share-link').click();
      return;
    }
    try {
      await navigator.share({ title: document.title, text: document.querySelector('[data-t="resultTitle"]')?.textContent ?? '', url: location.href });
      dialog.close();
    } catch {
      // The user may cancel the share sheet.
    }
  });

  return dialog;
}

async function renderQr(dialog) {
  const canvas = dialog.querySelector('#share-qr');
  const status = dialog.querySelector('.qr-status');
  status.textContent = text().scan;
  canvas.hidden = false;
  try {
    const module = await import('https://cdn.jsdelivr.net/npm/qrcode@1.5.4/+esm');
    const toCanvas = module.toCanvas ?? module.default?.toCanvas;
    if (!toCanvas) throw new Error('QR renderer unavailable');
    await toCanvas(canvas, location.href, {
      width: 220,
      margin: 1,
      color: { dark: '#10233f', light: '#ffffff' },
      errorCorrectionLevel: 'M',
    });
  } catch (error) {
    console.warn(error);
    canvas.hidden = true;
    status.textContent = text().qrError;
  }
}

function openShareDialog() {
  const dialog = createShareDialog();
  const value = text();
  dialog.querySelector('h2').textContent = value.shareTitle;
  dialog.querySelector('.share-dialog-head p').textContent = value.shareCopy;
  dialog.querySelector('#native-share').textContent = value.nativeShare;
  dialog.querySelector('#copy-share-link').textContent = value.copyLink;
  dialog.querySelector('.share-close').setAttribute('aria-label', value.close);
  dialog.querySelector('.share-url').textContent = location.href;
  dialog.showModal();
  renderQr(dialog);
}

function roundedRect(context, x, y, width, height, radius) {
  context.beginPath();
  context.roundRect(x, y, width, height, radius);
  context.closePath();
}

function drawContain(context, image, x, y, width, height) {
  const ratio = Math.min(width / image.width, height / image.height);
  const drawWidth = image.width * ratio;
  const drawHeight = image.height * ratio;
  context.drawImage(image, x + (width - drawWidth) / 2, y + (height - drawHeight) / 2, drawWidth, drawHeight);
}

async function saveCombinationCard() {
  await document.fonts?.ready;
  const source = document.querySelector('#pen-canvas');
  if (!source) return;

  const output = document.createElement('canvas');
  output.width = 1080;
  output.height = 1350;
  const context = output.getContext('2d');
  const value = text();

  context.fillStyle = '#f3f5f8';
  context.fillRect(0, 0, output.width, output.height);
  context.fillStyle = '#10233f';
  context.fillRect(0, 0, output.width, 190);
  context.fillStyle = '#ffffff';
  context.font = '700 52px Pretendard, Arial, sans-serif';
  context.fillText(value.imageTitle, 64, 84);
  context.fillStyle = '#cbd6e4';
  context.font = '500 24px Pretendard, Arial, sans-serif';
  context.fillText(value.imageSubtitle, 64, 132);

  roundedRect(context, 54, 224, 972, 520, 32);
  context.fillStyle = '#ffffff';
  context.fill();
  drawContain(context, source, 82, 252, 916, 464);

  const items = [...document.querySelectorAll('#summary-list .summary-item')];
  items.forEach((item, index) => {
    const column = index % 2;
    const row = Math.floor(index / 2);
    const x = 54 + column * 498;
    const y = 782 + row * 126;
    const width = 474;
    const height = 102;

    roundedRect(context, x, y, width, height, 22);
    context.fillStyle = '#ffffff';
    context.fill();

    const dot = item.querySelector('.swatch-dot');
    const color = getComputedStyle(dot).backgroundColor;
    context.beginPath();
    context.arc(x + 52, y + 51, 25, 0, Math.PI * 2);
    context.fillStyle = color;
    context.fill();
    context.strokeStyle = 'rgba(16,35,63,.18)';
    context.lineWidth = 2;
    context.stroke();

    context.fillStyle = '#7d8999';
    context.font = '600 19px Pretendard, Arial, sans-serif';
    context.fillText(item.querySelector('small')?.textContent ?? '', x + 92, y + 38);
    context.fillStyle = '#1b2738';
    context.font = '700 27px Pretendard, Arial, sans-serif';
    context.fillText(item.querySelector('b')?.textContent ?? '', x + 92, y + 72);
  });

  context.fillStyle = '#687487';
  context.font = '500 18px Pretendard, Arial, sans-serif';
  context.textAlign = 'center';
  context.fillText(value.imageNotice, output.width / 2, 1292);
  context.textAlign = 'start';

  output.toBlob((blob) => {
    if (!blob) return;
    const anchor = document.createElement('a');
    anchor.href = URL.createObjectURL(blob);
    anchor.download = 'blueblack-pen-combination.png';
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(anchor.href), 1200);
    showToast(value.saveStarted);
  }, 'image/png');
}

function replaceActionButton(id, handler) {
  const original = document.querySelector(id);
  if (!original) return;
  const replacement = original.cloneNode(true);
  original.replaceWith(replacement);
  replacement.addEventListener('click', handler);
}

function bindProgressEvents() {
  document.querySelector('#palette')?.addEventListener('click', (event) => {
    if (!event.target.closest('.swatch')) return;
    touchedParts.add(activePartId());
    window.setTimeout(() => {
      persistState();
      updateProgress();
    });
  }, true);

  document.querySelector('#next-part')?.addEventListener('click', () => {
    touchedParts.add(activePartId());
    window.setTimeout(() => {
      persistState();
      updateProgress();
    });
  }, true);

  document.querySelector('#reset-combination')?.addEventListener('click', () => {
    touchedParts.clear();
    window.setTimeout(() => {
      persistState();
      updateProgress();
    });
  }, true);

  document.querySelectorAll('[data-language]').forEach((button) => {
    button.addEventListener('click', () => window.setTimeout(() => {
      persistState();
      updateProgress();
    }));
  });
}

function applyAccessibility() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) document.querySelector('#pen-canvas')?.dispatchEvent(new PointerEvent('pointerdown'));

  const labels = {
    '#zoom-in': getLanguage() === 'ja' ? '拡大' : getLanguage() === 'en' ? 'Zoom in' : '확대',
    '#zoom-out': getLanguage() === 'ja' ? '縮小' : getLanguage() === 'en' ? 'Zoom out' : '축소',
    '#reset-view': getLanguage() === 'ja' ? '視点をリセット' : getLanguage() === 'en' ? 'Reset view' : '시점 초기화',
    '#fullscreen-close': text().close,
  };
  for (const [selector, label] of Object.entries(labels)) document.querySelector(selector)?.setAttribute('aria-label', label);
}

function initialize() {
  ensureProgressUi();
  updateProgress();
  bindProgressEvents();
  replaceActionButton('#share-combination', openShareDialog);
  replaceActionButton('#save-image', saveCombinationCard);
  applyAccessibility();

  const observer = new MutationObserver(() => updateProgress());
  const partGrid = document.querySelector('#part-grid');
  if (partGrid) observer.observe(partGrid, { childList: true, subtree: true, attributes: true, attributeFilter: ['aria-selected'] });

  persistState();
}

window.setTimeout(initialize, 0);
