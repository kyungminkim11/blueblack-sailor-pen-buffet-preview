import { loadStoreMap } from './store-map-config.js';

if (!document.querySelector('link[data-store-map-live]')) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = new URL('../store-tour/store-map-live.css?v=7', import.meta.url).href;
  link.dataset.storeMapLive = '';
  document.head.append(link);
}

let currentConfig = null;
let currentQuery = '';
let zoom = 1;

function escapeHtml(value = '') {
  const temp = document.createElement('div');
  temp.textContent = String(value);
  return temp.innerHTML;
}

function normalize(value = '') {
  return String(value)
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[^0-9a-z가-힣ぁ-んァ-ヶ一-龠]+/g, '');
}

function brandZones(config) {
  const preferred = ['glass-a', 'glass-b', 'glass-c', 'pen-buffet'];
  return config.zones.filter((zone) => zone.visible !== false && preferred.includes(zone.id));
}

function clearSelection({ focus = false } = {}) {
  currentQuery = '';
  const host = document.querySelector('#storeMap1FLive');
  const input = host?.querySelector('#storeMap1FSearch');
  if (input) input.value = '';
  updateSearchState();
  if (focus) input?.focus();
}

function selectQuery(value) {
  const next = String(value || '');
  if (normalize(currentQuery) === normalize(next)) {
    clearSelection();
    return;
  }
  currentQuery = next;
  const input = document.querySelector('#storeMap1FSearch');
  if (input) input.value = currentQuery;
  updateSearchState();
}

function updateSearchState() {
  const host = document.querySelector('#storeMap1FLive');
  if (!host) return;
  const query = normalize(currentQuery);
  const zones = [...host.querySelectorAll('.live-map-zone')];
  const result = host.querySelector('#storeMap1FResult');
  const clear = host.querySelector('#storeMap1FClear');
  const selection = host.querySelector('#storeMap1FSelection');
  const selectionLabel = host.querySelector('#storeMap1FSelectionLabel');

  clear?.classList.toggle('is-visible', Boolean(currentQuery));
  if (selection) selection.hidden = !query;
  if (selectionLabel) selectionLabel.textContent = currentQuery;

  host.querySelectorAll('[data-search-chip]').forEach((button) => {
    button.classList.toggle('is-selected', Boolean(query) && normalize(button.dataset.searchChip) === query);
    button.setAttribute('aria-pressed', String(Boolean(query) && normalize(button.dataset.searchChip) === query));
  });

  zones.forEach((zone) => zone.classList.remove('is-match', 'is-dimmed'));

  if (!query) {
    if (result) result.textContent = '브랜드나 제품명을 입력하면 해당 진열 구역이 강조됩니다.';
    return;
  }

  const matches = zones.filter((zone) => normalize(zone.dataset.search).includes(query));
  zones.forEach((zone) => zone.classList.add(matches.includes(zone) ? 'is-match' : 'is-dimmed'));
  if (result) result.textContent = matches.length ? `${matches.length}개 진열 구역을 강조했습니다.` : '일치하는 브랜드 또는 제품 진열 구역을 찾지 못했습니다.';
}

function viewport() {
  return document.querySelector('#storeMap1FViewport');
}

function canvas() {
  return document.querySelector('#storeMap1FCanvas');
}

function baseWidth() {
  return Math.max(viewport()?.clientWidth || 0, 760);
}

function applyZoom(next) {
  const node = canvas();
  if (!node) return;
  zoom = Math.min(2.2, Math.max(0.65, next));
  node.style.minWidth = '0';
  node.style.width = `${Math.round(baseWidth() * zoom)}px`;
}

function fitMap() {
  const node = canvas();
  if (!node) return;
  zoom = 1;
  node.style.minWidth = '0';
  node.style.width = '100%';
  const view = viewport();
  if (view) {
    view.scrollLeft = 0;
    view.scrollTop = 0;
  }
}

async function toggleFullscreen() {
  const view = viewport();
  if (!view) return;
  if (document.fullscreenElement) await document.exitFullscreen?.();
  else await view.requestFullscreen?.();
}

function renderMap(config) {
  currentConfig = config;
  const host = document.querySelector('#storeMap1FLive');
  if (!host) return;

  const zones = config.zones
    .filter((zone) => zone.visible !== false)
    .map((zone) => `
      <article class="live-map-zone type-${zone.type || 'brand'}" data-search="${escapeHtml([zone.label, zone.subLabel, zone.searchTerms].filter(Boolean).join(' '))}" style="left:${zone.x}%;top:${zone.y}%;width:${zone.w}%;height:${zone.h}%;">
        <strong>${escapeHtml(zone.label)}</strong>
        ${zone.subLabel ? `<small>${escapeHtml(zone.subLabel)}</small>` : ''}
      </article>
    `)
    .join('');

  const knownBrands = brandZones(config);
  const popularChips = knownBrands.map((zone) => `<button type="button" class="live-map-chip" data-search-chip="${escapeHtml(zone.label)}" aria-pressed="false">${escapeHtml(zone.label)}</button>`).join('');
  const allChips = knownBrands.map((zone) => `<button type="button" class="live-map-chip" data-search-chip="${escapeHtml(zone.label)}" aria-pressed="false"><b>${escapeHtml(zone.label)}</b>${zone.subLabel ? `<span>${escapeHtml(zone.subLabel)}</span>` : ''}</button>`).join('');
  const standalone = location.pathname.includes('/store-map-1f/');
  const largeViewHref = new URL('../store-map-1f/', import.meta.url).href;

  host.innerHTML = `
    <div class="live-map-head live-map-heading-row">
      <div>
        <small>1F STORE DIRECTORY</small>
        <h3>${escapeHtml(config.title)}</h3>
        <p>${escapeHtml(config.subtitle)}</p>
      </div>
      ${standalone ? '' : `<a class="live-map-new-window" href="${largeViewHref}" target="_blank" rel="noopener">새 창에서 크게 보기</a>`}
    </div>

    <div class="live-map-tools" aria-label="1층 브랜드 지도 도구">
      <label class="live-map-search">
        <span>브랜드·제품 찾기</span>
        <span class="live-map-search-field">
          <input id="storeMap1FSearch" type="search" autocomplete="off" enterkeyhint="search" placeholder="예: 세일러, 블랙윙, 제이허빈 10ml" />
          <button id="storeMap1FClear" type="button" aria-label="검색 지우기">×</button>
        </span>
      </label>
      <div class="live-map-buttons">
        <button type="button" id="storeMap1FZoomOut" aria-label="지도 축소">−</button>
        <button type="button" id="storeMap1FFit">맞춤</button>
        <button type="button" id="storeMap1FZoomIn" aria-label="지도 확대">＋</button>
        <button type="button" id="storeMap1FFullscreen">전체 화면</button>
      </div>
    </div>

    <p class="live-map-language-hint">브랜드명·제품명으로 검색하거나 아래 구역을 눌러보세요.</p>
    <p id="storeMap1FResult" class="live-map-result" aria-live="polite"></p>

    <div class="live-map-selection" id="storeMap1FSelection" hidden>
      <div>
        <small>현재 선택</small>
        <strong id="storeMap1FSelectionLabel"></strong>
      </div>
      <button type="button" id="storeMap1FClearSelection">선택 해제</button>
    </div>

    <div class="live-map-brand-picker">
      <div class="live-map-popular">
        <strong>자주 찾는 구역</strong>
        <div class="live-map-chip-row">${popularChips}</div>
      </div>
      <details class="live-map-all-brands">
        <summary>주요 브랜드 구역 보기</summary>
        <div class="live-map-chip-grid">${allChips}</div>
      </details>
    </div>

    <div class="live-map-viewport" id="storeMap1FViewport" tabindex="0" aria-label="블루블랙 펜샵 1층 브랜드 안내도">
      <div class="live-map-canvas" id="storeMap1FCanvas">
        <div class="live-map-board" role="img" aria-label="블루블랙 펜샵 1층 브랜드 안내도">
          <span class="live-map-orientation">입구에서 매장 안쪽 방향</span>
          ${zones}
          <span class="live-map-branding">BLUEBLACK PEN SHOP · STORE DIRECTORY</span>
        </div>
      </div>
    </div>
    <div class="live-map-legend" aria-label="지도 범례">
      <span><i class="legend-brand"></i><b>브랜드 진열</b></span>
      <span><i class="legend-table"></i><b>테이블·체험</b></span>
      <span><i class="legend-service"></i><b>카운터·출입구</b></span>
    </div>
    <p class="live-map-note">ⓘ ${escapeHtml(config.note)}</p>
  `;

  const input = host.querySelector('#storeMap1FSearch');
  const clear = host.querySelector('#storeMap1FClear');
  const clearSelectionButton = host.querySelector('#storeMap1FClearSelection');
  input.value = currentQuery;
  input.addEventListener('input', () => {
    currentQuery = input.value;
    updateSearchState();
  });
  clear.addEventListener('click', () => clearSelection({ focus: true }));
  clearSelectionButton.addEventListener('click', () => clearSelection({ focus: true }));

  host.querySelectorAll('[data-search-chip]').forEach((button) => {
    button.addEventListener('click', () => selectQuery(button.dataset.searchChip || ''));
  });

  host.querySelector('#storeMap1FZoomOut')?.addEventListener('click', () => applyZoom(zoom - 0.2));
  host.querySelector('#storeMap1FFit')?.addEventListener('click', fitMap);
  host.querySelector('#storeMap1FZoomIn')?.addEventListener('click', () => applyZoom(zoom + 0.2));
  host.querySelector('#storeMap1FFullscreen')?.addEventListener('click', toggleFullscreen);

  updateSearchState();
  fitMap();
  document.querySelectorAll('[data-merged-floor="1"] strong').forEach((node) => {
    node.textContent = '1층 브랜드 안내도';
  });
}

function insertMap() {
  let host = document.querySelector('#storeMap1FLive');
  if (!host) {
    const firstPanel = document.querySelector('[data-floor-panel="1"]');
    if (!firstPanel) return;
    const section = document.createElement('section');
    section.className = 'tour-card live-map-card';
    section.id = 'storeMap1FLive';
    firstPanel.querySelector('.floor-intro-card')?.insertAdjacentElement('afterend', section);
    host = section;
  }
  renderMap(loadStoreMap());
}

insertMap();
window.addEventListener('blueblack-store-map-updated', (event) => renderMap(event.detail || currentConfig || loadStoreMap()));
window.addEventListener('storage', (event) => {
  if (event.key === 'blueblack-store-map-v2') renderMap(loadStoreMap());
});
document.addEventListener('fullscreenchange', () => {
  const button = document.querySelector('#storeMap1FFullscreen');
  if (button) button.textContent = document.fullscreenElement ? '전체 화면 종료' : '전체 화면';
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && currentQuery && !document.fullscreenElement) clearSelection();
});

import('./store-map-1f-details.js?v=2');
