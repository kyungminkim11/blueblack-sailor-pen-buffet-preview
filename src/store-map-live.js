import { loadStoreMap } from './store-map-config.js';

if (!document.querySelector('link[data-store-map-live]')) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = new URL('../store-tour/store-map-live.css', import.meta.url).href;
  link.dataset.storeMapLive = '';
  document.head.append(link);
}

let currentConfig = null;
let currentQuery = '';

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

function searchableText(zone) {
  return normalize([zone.label, zone.subLabel, zone.searchTerms].filter(Boolean).join(' '));
}

function updateSearchState() {
  const host = document.querySelector('#storeMap1FLive');
  if (!host) return;
  const query = normalize(currentQuery);
  const zones = [...host.querySelectorAll('.live-map-zone')];
  const result = host.querySelector('#storeMap1FResult');
  const clear = host.querySelector('#storeMap1FClear');

  clear?.classList.toggle('is-visible', Boolean(currentQuery));
  zones.forEach((zone) => zone.classList.remove('is-match', 'is-dimmed'));

  if (!query) {
    if (result) result.textContent = '브랜드명을 입력하면 해당 진열 위치가 강조됩니다.';
    return;
  }

  const matches = zones.filter((zone) => normalize(zone.dataset.search).includes(query));
  zones.forEach((zone) => zone.classList.add(matches.includes(zone) ? 'is-match' : 'is-dimmed'));
  if (result) result.textContent = matches.length ? `${matches.length}개 진열 구역을 찾았습니다.` : '일치하는 브랜드 또는 진열 구역이 없습니다.';
}

function bindSearch() {
  const host = document.querySelector('#storeMap1FLive');
  const input = host?.querySelector('#storeMap1FSearch');
  const clear = host?.querySelector('#storeMap1FClear');
  if (!input) return;

  input.value = currentQuery;
  input.addEventListener('input', () => {
    currentQuery = input.value;
    updateSearchState();
  });
  clear?.addEventListener('click', () => {
    currentQuery = '';
    input.value = '';
    input.focus();
    updateSearchState();
  });
  updateSearchState();
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

  const suggestions = config.zones
    .filter((zone) => zone.visible !== false && ['glass-a', 'glass-b', 'glass-c', 'pen-buffet'].includes(zone.id))
    .map((zone) => `<button type="button" class="live-map-chip" data-search-chip="${escapeHtml(zone.label)}">${escapeHtml(zone.label)}</button>`)
    .join('');

  host.innerHTML = `
    <div class="live-map-head">
      <small>1F STORE DIRECTORY</small>
      <h3>${escapeHtml(config.title)}</h3>
      <p>${escapeHtml(config.subtitle)}</p>
    </div>
    <div class="live-map-search-tools">
      <label class="live-map-search">
        <span>브랜드 찾기</span>
        <span class="live-map-search-field">
          <input id="storeMap1FSearch" type="search" autocomplete="off" enterkeyhint="search" placeholder="예: 세일러, 카웨코, Majohn" />
          <button id="storeMap1FClear" type="button" aria-label="검색 지우기">×</button>
        </span>
      </label>
      <div class="live-map-chips">${suggestions}</div>
      <p id="storeMap1FResult" class="live-map-result" aria-live="polite"></p>
    </div>
    <div class="live-map-board" role="img" aria-label="블루블랙 펜샵 1층 브랜드 안내도">
      <span class="live-map-orientation">입구에서 매장 안쪽 방향</span>
      ${zones}
      <span class="live-map-branding">BLUEBLACK PEN SHOP · STORE DIRECTORY</span>
    </div>
    <p class="live-map-note">ⓘ ${escapeHtml(config.note)}</p>
  `;

  host.querySelectorAll('[data-search-chip]').forEach((button) => {
    button.addEventListener('click', () => {
      currentQuery = button.dataset.searchChip || '';
      const input = host.querySelector('#storeMap1FSearch');
      if (input) input.value = currentQuery;
      updateSearchState();
    });
  });

  bindSearch();
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
