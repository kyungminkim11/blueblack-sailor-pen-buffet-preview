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
import { escapeHtml, initials } from './catalog-utils.js';

let authorized = false;
let currentResults = [];
let selectedProductId = '';
let searchTimer = 0;

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const ui = {
  dbStatus: $('#dbStatus'),
  search: $('#productSearch'),
  searchButton: $('#searchButton'),
  resultList: $('#resultList'),
  resultTitle: $('#resultTitle'),
  resultSummary: $('#resultSummary'),
  detail: $('#productDetail'),
  openImport: $('#openImport'),
  importDialog: $('#importDialog'),
  catalogFile: $('#catalogFile'),
  importCatalog: $('#importCatalog'),
  importProgress: $('#importProgress'),
  importProgressTitle: $('#importProgressTitle'),
  importProgressDetail: $('#importProgressDetail'),
  changeAccess: $('#changeAccess'),
  focusScanner: $('#focusScanner'),
  accessDialog: $('#accessDialog'),
  accessKey: $('#accessKey'),
  unlockAccess: $('#unlockAccess'),
  accessError: $('#accessError'),
  toast: $('#finderToast')
};

export function showToast(message) {
  ui.toast.textContent = message;
  ui.toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => ui.toast.classList.remove('show'), 2800);
}

export function isAuthorized() {
  return authorized && hasAccessToken();
}

export function activateMode(mode) {
  $$('[data-mode]').forEach((button) => button.classList.toggle('active', button.dataset.mode === mode));
  $$('[data-panel]').forEach((panel) => panel.classList.toggle('active', panel.dataset.panel === mode));
  if (mode === 'text') setTimeout(() => ui.search.focus(), 40);
  document.dispatchEvent(new CustomEvent('finder-mode-change', { detail: { mode } }));
}

export async function runSearch() {
  return [];
}

export async function handleScannedCode() {
  return [];
}
