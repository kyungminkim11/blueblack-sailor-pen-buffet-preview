import {
  fetchCatalogStatus,
  getAccessToken,
  hasAccessToken,
  replaceRemoteCatalog,
  setAccessToken,
  clearAccessToken
} from './catalog-db.js';
import { buildProducts, parseCsv, sourceDateFromRows } from './catalog-parser.js';
import { searchCatalog } from './catalog-search.js';

let authorized = false;
let searchTimer = 0;
let currentResults = [];

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
  showToast.timer = setTimeout(() => ui.toast.classList.remove('show'), 2500);
}

export function isAuthorized() {
  return authorized && hasAccessToken();
}

function setStatus(status) {
  ui.dbStatus.replaceChildren();
  const dot = document.createElement('span');
  const title = document.createElement('strong');
  const description = document.createElement('small');
  ui.dbStatus.append(dot, title, description);

  if (!authorized) {
    ui.dbStatus.classList.remove('ready');
    title.textContent = '접근 잠김';
    description.textContent = '관리자 접근키가 필요합니다.';
    return;
  }

  const count = Number(status?.item_count || 0);
  const date = status?.source_date ? ` · ${status.source_date} 기준` : '';
  ui.dbStatus.classList.toggle('ready', count > 0);
  title.textContent = `${count.toLocaleString('ko-KR')}개 상품${date}`;
  description.textContent = 'Supabase 비공개 DB';
  ui.resultSummary.textContent = count ? '상품명이나 바코드를 입력하세요.' : 'CSV 업로드가 필요합니다.';
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

export async function runSearch() {
  return [];
}

export async function handleScannedCode() {
  return [];
}

ui.unlockAccess?.addEventListener('click', unlock);
ui.accessKey?.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    unlock();
  }
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
