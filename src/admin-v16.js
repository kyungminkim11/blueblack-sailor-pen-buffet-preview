import { parts, colors, defaultSelection } from './data.js';
import { INK_PRODUCTS, formatWon } from './ink-products-data.js';
import {
  DEFAULT_ADMIN_SETTINGS,
  buildCombinationUrl,
  readAdminSettings,
  resetAdminSettings,
  sanitizeAdminSettings,
  writeAdminSettings,
} from './admin-store-v16.js';
import {
  normalizeInkId,
  readInkAdminCatalog,
  resetInkAdminCatalog,
  sanitizeInkColor,
  sanitizeInkPriceItem,
  writeInkAdminCatalog,
} from './ink-admin-catalog.js';

const $ = (selector) => document.querySelector(selector);
const form = $('#admin-form');
const editor = $('#combination-editor');
const toastNode = $('#admin-toast');
let settings = readAdminSettings();
let inkCatalog = readInkAdminCatalog();

function showToast(message) {
  toastNode.textContent = message;
  toastNode.classList.add('is-visible');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toastNode.classList.remove('is-visible'), 2400);
}

function colorById(id) {
  return colors.find((color) => color.id === id);
}

function colorName(color) {
  return color?.nameKo || color?.nameEn || color?.id || '알 수 없음';
}

function optionList(part, selectedId) {
  return colors
    .filter((color) => color.group === part.colorGroup)
    .map((color) => `<option value="${color.id}" ${color.id === selectedId ? 'selected' : ''}>${colorName(color)} · ${color.code}</option>`)
    .join('');
}

function renderCombination(combination = defaultSelection) {
  editor.innerHTML = parts.map((part, index) => {
    const selectedId = combination[part.id] || defaultSelection[part.id];
    const selectedColor = colorById(selectedId);
    return `
      <div class="part-field" data-part-id="${part.id}">
        <div class="part-field-head">
          <span class="color-preview" style="background:${selectedColor?.hex || '#fff'}"></span>
          <div><small>${String(index + 1).padStart(2, '0')} · ${part.nameEn.toUpperCase()}</small><b>${part.nameKo}</b></div>
        </div>
        <select aria-label="${part.nameKo} 기본 색상">${optionList(part, selectedId)}</select>
      </div>
    `;
  }).join('');

  editor.querySelectorAll('.part-field').forEach((field) => {
    const select = field.querySelector('select');
    const preview = field.querySelector('.color-preview');
    select.addEventListener('change', () => {
      preview.style.background = colorById(select.value)?.hex || '#fff';
    });
  });
}

function readCombinationEditor() {
  const combination = {};
  editor.querySelectorAll('.part-field').forEach((field) => {
    combination[field.dataset.partId] = field.querySelector('select').value;
  });
  return combination;
}

function populateForm(next) {
  settings = sanitizeAdminSettings(next);
  $('#announcement-enabled').checked = settings.announcementEnabled;
  $('#announcement-text').value = settings.announcementText;
  $('#show-howto').checked = settings.showHowto;
  $('#show-guide').checked = settings.showGuide;
  $('#show-policy').checked = settings.showPolicy;
  $('#show-beverage').checked = settings.showBeverage;
  $('#show-visit').checked = settings.showVisit;
  $('#default-language').value = settings.defaultLanguage;

  const idleSelect = $('#idle-reset-minutes');
  const supportedIdle = [...idleSelect.options].some((option) => Number(option.value) === settings.idleResetMinutes);
  idleSelect.value = supportedIdle ? String(settings.idleResetMinutes) : '0';
  renderCombination(settings.defaultCombination);
  renderStatus();
  renderSession();
}

function collectForm() {
  return sanitizeAdminSettings({
    ...settings,
    announcementEnabled: $('#announcement-enabled').checked,
    announcementText: $('#announcement-text').value,
    showHowto: $('#show-howto').checked,
    showGuide: $('#show-guide').checked,
    showPolicy: $('#show-policy').checked,
    showBeverage: $('#show-beverage').checked,
    showVisit: $('#show-visit').checked,
    defaultLanguage: $('#default-language').value,
    idleResetMinutes: Number($('#idle-reset-minutes').value),
    defaultCombination: readCombinationEditor(),
  });
}

function saveAll(message = '관리자 설정을 저장했습니다.') {
  settings = writeAdminSettings(collectForm());
  populateForm(settings);
  showToast(message);
  return settings;
}

function storageAvailable() {
  try {
    localStorage.setItem('__bb_admin_test__', '1');
    localStorage.removeItem('__bb_admin_test__');
    return true;
  } catch {
    return false;
  }
}

function webglAvailable() {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

function formatDate(value) {
  if (!value) return '아직 저장하지 않음';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '알 수 없음';
  return new Intl.DateTimeFormat('ko-KR', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

function statusItem(label, value, good = true) {
  return `<div class="status-item"><span>${label}</span><strong>${good ? '<i class="status-dot"></i>' : ''}${value}</strong></div>`;
}

function renderStatus() {
  const online = navigator.onLine;
  $('#status-list').innerHTML = [
    statusItem('인터넷 연결', online ? '온라인' : '오프라인', online),
    statusItem('3D WebGL', webglAvailable() ? '사용 가능' : '지원 안 됨', webglAvailable()),
    statusItem('브라우저 저장소', storageAvailable() ? '정상' : '사용 불가', storageAvailable()),
    statusItem('화면 크기', `${window.innerWidth} × ${window.innerHeight}`),
    statusItem('마지막 설정 저장', formatDate(settings.updatedAt), false),
  ].join('');
}

function readStoredSession() {
  try {
    const saved = localStorage.getItem('blueblack-pen-combination-query');
    if (!saved) return null;
    const query = new URLSearchParams(saved);
    const combination = {};
    for (const part of parts) {
      const colorId = query.get(part.id);
      const valid = colors.some((color) => color.id === colorId && color.group === part.colorGroup);
      if (!valid) return null;
      combination[part.id] = colorId;
    }
    return { query, combination };
  } catch {
    return null;
  }
}

function combinationCode(combination) {
  return `BB-SAILOR-${parts.map((part) => colorById(combination[part.id])?.code || 'NA').join('-')}`;
}

function renderSession() {
  const session = readStoredSession();
  const summary = $('#session-summary');
  if (!session) {
    summary.textContent = '저장된 조합 없음';
    return;
  }
  summary.textContent = combinationCode(session.combination);
}

function currentSessionUrl() {
  const session = readStoredSession();
  if (!session) return null;
  const url = new URL('./', location.href);
  url.search = session.query.toString();
  return url.href;
}

async function copyText(value, message) {
  try {
    await navigator.clipboard.writeText(value);
    showToast(message);
  } catch {
    window.prompt('아래 내용을 복사해 주세요.', value);
  }
}

function inkPriceMap() {
  const map = new Map(INK_PRODUCTS.map((item) => [item.id, { ...item }]));
  inkCatalog.priceItems.forEach((item) => map.set(item.id, { ...map.get(item.id), ...item }));
  return map;
}

function inkPriceItems() {
  return [...inkPriceMap().values()].sort((a, b) => `${a.brandKo} ${a.productKo}`.localeCompare(`${b.brandKo} ${b.productKo}`));
}

function inkPriceLabel(item) {
  return `${item.brandKo} · ${item.productKo} · 5ml ${formatWon(item.price5)} / 10ml ${formatWon(item.price10)}`;
}

function fillInkPriceForm(item = null) {
  $('#ink-price-template').value = item?.id || '';
  $('#ink-price-brand-ko').value = item?.brandKo || '';
  $('#ink-price-brand-en').value = item?.brandEn || '';
  $('#ink-price-series-ko').value = item?.productKo || '';
  $('#ink-price-series-en').value = item?.productEn || '';
  $('#ink-price-5').value = item?.price5 ?? '';
  $('#ink-price-10').value = item?.price10 ?? '';
  $('#ink-price-keywords').value = (item?.keywords || []).join(', ');
}

function fillInkColorForm(color = null) {
  $('#ink-color-id').value = color?.id || '';
  $('#ink-color-brand-ko').value = color?.brandKo || '';
  $('#ink-color-brand-en').value = color?.brandEn || '';
  $('#ink-color-price-item').value = color?.priceItemId || inkPriceItems()[0]?.id || '';
  $('#ink-color-name-ko').value = color?.nameKo || '';
  $('#ink-color-name-en').value = color?.nameEn || '';
  $('#ink-color-hex').value = color?.hex || '#6d7484';
  $('#ink-color-volume').value = color?.volume || '50ml';
  $('#ink-color-url').value = color?.productUrl || '';
}

function renderInkSelects() {
  const items = inkPriceItems();
  $('#ink-price-template').innerHTML = `<option value="">새 가격 구분 만들기</option>${items.map((item) => `<option value="${item.id}">${inkPriceLabel(item)}</option>`).join('')}`;
  $('#ink-color-price-item').innerHTML = items.map((item) => `<option value="${item.id}">${item.brandKo} · ${item.productKo}</option>`).join('');
}

function renderInkPriceList() {
  const root = $('#ink-price-list');
  $('#ink-price-count').textContent = `${inkCatalog.priceItems.length}개`;
  if (!inkCatalog.priceItems.length) {
    root.innerHTML = '<div class="ink-admin-empty">아직 관리자에서 수정한 가격 구분이 없습니다.</div>';
    return;
  }
  root.replaceChildren(...inkCatalog.priceItems.map((item) => {
    const row = document.createElement('div');
    row.className = 'ink-admin-row';
    row.innerHTML = `<div><strong>${item.brandKo} · ${item.productKo}</strong><small>${item.productEn} · 5ml ${formatWon(item.price5)} / 10ml ${formatWon(item.price10)}</small></div><div class="ink-admin-row-actions"><button type="button">수정</button><button type="button" class="danger">삭제</button></div>`;
    row.querySelector('button').addEventListener('click', () => fillInkPriceForm(item));
    row.querySelector('.danger').addEventListener('click', () => {
      inkCatalog = writeInkAdminCatalog({ ...inkCatalog, priceItems: inkCatalog.priceItems.filter((candidate) => candidate.id !== item.id) });
      renderInkCatalog();
      showToast('가격 구분을 삭제했습니다.');
    });
    return row;
  }));
}

function renderInkColorList() {
  const root = $('#ink-color-list');
  $('#ink-color-count').textContent = `${inkCatalog.colors.length}개`;
  if (!inkCatalog.colors.length) {
    root.innerHTML = '<div class="ink-admin-empty">아직 관리자에서 등록한 색상이 없습니다.</div>';
    return;
  }
  root.replaceChildren(...inkCatalog.colors.map((color) => {
    const item = inkPriceMap().get(color.priceItemId);
    const row = document.createElement('div');
    row.className = 'ink-admin-row';
    row.innerHTML = `<div><strong>${color.brandKo} · ${color.nameKo}</strong><small>${item ? item.productKo + ' · ' : ''}${color.productUrl || '상품 링크 없음'}</small></div><div class="ink-admin-row-actions"><button type="button">수정</button><button type="button" class="danger">삭제</button></div>`;
    row.querySelector('button').addEventListener('click', () => fillInkColorForm(color));
    row.querySelector('.danger').addEventListener('click', () => {
      inkCatalog = writeInkAdminCatalog({ ...inkCatalog, colors: inkCatalog.colors.filter((candidate) => candidate.id !== color.id) });
      renderInkCatalog();
      showToast('색상을 삭제했습니다.');
    });
    return row;
  }));
}

function renderInkCatalog() {
  renderInkSelects();
  renderInkPriceList();
  renderInkColorList();
}

function collectInkPriceForm() {
  const id = $('#ink-price-template').value || normalizeInkId([$('#ink-price-brand-en').value, $('#ink-price-series-en').value || $('#ink-price-series-ko').value].join('-'));
  return sanitizeInkPriceItem({
    id,
    brandKo: $('#ink-price-brand-ko').value,
    brandEn: $('#ink-price-brand-en').value,
    productKo: $('#ink-price-series-ko').value,
    productEn: $('#ink-price-series-en').value,
    price5: $('#ink-price-5').value,
    price10: $('#ink-price-10').value,
    keywords: $('#ink-price-keywords').value,
  });
}

function collectInkColorForm() {
  const item = inkPriceMap().get($('#ink-color-price-item').value);
  const id = $('#ink-color-id').value || normalizeInkId([$('#ink-color-brand-en').value || item?.brandEn, $('#ink-color-price-item').value, $('#ink-color-name-en').value || $('#ink-color-name-ko').value].join('-'));
  return sanitizeInkColor({
    id,
    brandKo: $('#ink-color-brand-ko').value || item?.brandKo,
    brandEn: $('#ink-color-brand-en').value || item?.brandEn,
    priceItemId: $('#ink-color-price-item').value,
    nameKo: $('#ink-color-name-ko').value,
    nameEn: $('#ink-color-name-en').value,
    hex: $('#ink-color-hex').value,
    volume: $('#ink-color-volume').value,
    productUrl: $('#ink-color-url').value,
    productTitle: [$('#ink-color-brand-ko').value || item?.brandKo, $('#ink-color-name-ko').value].filter(Boolean).join(' '),
  });
}

function downloadJson() {
  const payload = JSON.stringify({
    product: 'BlueBlack Sailor Pen Buffet Preview',
    version: 1,
    exportedAt: new Date().toISOString(),
    settings: collectForm(),
    inkCatalog,
  }, null, 2);
  const blob = new Blob([payload], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `blueblack-pen-buffet-settings-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);
  showToast('설정 파일을 저장했습니다.');
}

async function importJson(file) {
  try {
    const payload = JSON.parse(await file.text());
    const imported = sanitizeAdminSettings(payload.settings || payload);
    settings = writeAdminSettings(imported);
    if (payload.inkCatalog) inkCatalog = writeInkAdminCatalog(payload.inkCatalog);
    populateForm(settings);
    renderInkCatalog();
    showToast('설정 파일을 불러왔습니다.');
  } catch {
    showToast('올바른 관리자 설정 파일이 아닙니다.');
  }
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  saveAll();
});

$('#header-save').addEventListener('click', () => form.requestSubmit());

$('#save-combination').addEventListener('click', () => {
  saveAll('기본 조합을 저장했습니다.');
});

$('#preview-settings').addEventListener('click', () => {
  const saved = saveAll('설정을 저장하고 고객 화면을 엽니다.');
  window.open(buildCombinationUrl(saved.defaultCombination, saved.defaultLanguage), '_blank', 'noopener');
});

$('#copy-preview-link').addEventListener('click', () => {
  const draft = collectForm();
  copyText(buildCombinationUrl(draft.defaultCombination, draft.defaultLanguage), '기본 조합 링크를 복사했습니다.');
});

$('#use-current-combination').addEventListener('click', () => {
  const session = readStoredSession();
  if (!session) {
    showToast('현재 기기에 저장된 고객 조합이 없습니다.');
    return;
  }
  renderCombination(session.combination);
  showToast('현재 고객 조합을 불러왔습니다. 저장 버튼을 눌러 적용해 주세요.');
});

$('#open-current-session').addEventListener('click', () => {
  const url = currentSessionUrl();
  if (!url) {
    showToast('현재 기기에 저장된 고객 조합이 없습니다.');
    return;
  }
  window.open(url, '_blank', 'noopener');
});

$('#clear-current-session').addEventListener('click', () => {
  if (!confirm('현재 기기에 저장된 고객 조합을 삭제할까요?')) return;
  localStorage.removeItem('blueblack-pen-combination-query');
  renderSession();
  showToast('저장된 고객 조합을 삭제했습니다.');
});

$('#reset-settings').addEventListener('click', () => {
  if (!confirm('공지와 화면 설정, 기본 조합을 모두 초기화할까요?')) return;
  settings = resetAdminSettings();
  populateForm(settings);
  showToast('관리자 설정을 기본값으로 초기화했습니다.');
});

$('#export-settings').addEventListener('click', downloadJson);
$('#import-settings').addEventListener('click', () => $('#import-file').click());
$('#import-file').addEventListener('change', (event) => {
  const [file] = event.target.files;
  if (file) importJson(file);
  event.target.value = '';
});

$('#ink-price-template').addEventListener('change', () => {
  const item = inkPriceItems().find((candidate) => candidate.id === $('#ink-price-template').value);
  fillInkPriceForm(item || null);
});

$('#ink-price-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const item = collectInkPriceForm();
  inkCatalog = writeInkAdminCatalog({
    ...inkCatalog,
    priceItems: [...inkCatalog.priceItems.filter((candidate) => candidate.id !== item.id), item],
  });
  renderInkCatalog();
  fillInkPriceForm(item);
  showToast('잉크 가격 구분을 저장했습니다.');
});

$('#ink-color-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const color = collectInkColorForm();
  inkCatalog = writeInkAdminCatalog({
    ...inkCatalog,
    colors: [...inkCatalog.colors.filter((candidate) => candidate.id !== color.id), color],
  });
  renderInkCatalog();
  fillInkColorForm(color);
  showToast('잉크 색상을 저장했습니다.');
});

$('#ink-price-new').addEventListener('click', () => fillInkPriceForm(null));
$('#ink-color-new').addEventListener('click', () => fillInkColorForm(null));
$('#open-ink-preview').addEventListener('click', () => window.open('./ink-price/?lang=ko', '_blank', 'noopener'));
$('#reset-ink-catalog').addEventListener('click', () => {
  if (!confirm('관리자에서 수정한 잉크 가격과 색상을 모두 초기화할까요?')) return;
  inkCatalog = resetInkAdminCatalog();
  renderInkCatalog();
  fillInkPriceForm(null);
  fillInkColorForm(null);
  showToast('잉크 설정을 초기화했습니다.');
});

window.addEventListener('online', renderStatus);
window.addEventListener('offline', renderStatus);
window.addEventListener('resize', () => {
  clearTimeout(renderStatus.resizeTimer);
  renderStatus.resizeTimer = setTimeout(renderStatus, 120);
});

populateForm(settings || DEFAULT_ADMIN_SETTINGS);
renderInkCatalog();
fillInkPriceForm(null);
fillInkColorForm(null);
