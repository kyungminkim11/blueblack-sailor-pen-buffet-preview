import { loadStoreMap } from './store-map-config.js';

if (!document.querySelector('link[data-store-map-live]')) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = new URL('../store-tour/store-map-live.css', import.meta.url).href;
  link.dataset.storeMapLive = '';
  document.head.append(link);
}

function escapeHtml(value = '') {
  const temp = document.createElement('div');
  temp.textContent = String(value);
  return temp.innerHTML;
}

function renderMap(config) {
  const host = document.querySelector('#storeMap1FLive');
  if (!host) return;

  const zones = config.zones
    .filter((zone) => zone.visible !== false)
    .map((zone) => `
      <article class="live-map-zone type-${zone.type || 'brand'}" style="left:${zone.x}%;top:${zone.y}%;width:${zone.w}%;height:${zone.h}%;">
        <strong>${escapeHtml(zone.label)}</strong>
        ${zone.subLabel ? `<small>${escapeHtml(zone.subLabel)}</small>` : ''}
      </article>
    `)
    .join('');

  host.innerHTML = `
    <div class="live-map-head">
      <small>1F STORE DIRECTORY</small>
      <h3>${escapeHtml(config.title)}</h3>
      <p>${escapeHtml(config.subtitle)}</p>
    </div>
    <div class="live-map-board" role="img" aria-label="블루블랙 펜샵 1층 안내도">
      <span class="live-map-orientation">입구에서 매장 안쪽 방향</span>
      ${zones}
      <span class="live-map-branding">BLUEBLACK PEN SHOP · STORE DIRECTORY</span>
    </div>
    <p class="live-map-note">ⓘ ${escapeHtml(config.note)}</p>
  `;
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
window.addEventListener('blueblack-store-map-updated', (event) => renderMap(event.detail || loadStoreMap()));
window.addEventListener('storage', (event) => {
  if (event.key === 'blueblack-store-map-v2') renderMap(loadStoreMap());
});
