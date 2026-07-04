import { loadStoreMap } from './store-map-config.js';

if (!document.querySelector('link[data-store-map-details]')) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = new URL('../store-tour/store-map-1f-details.css?v=1', import.meta.url).href;
  link.dataset.storeMapDetails = '';
  document.head.append(link);
}

const host = document.querySelector('#storeMap1FLive');

function escapeHtml(value = '') {
  const node = document.createElement('div');
  node.textContent = String(value);
  return node.innerHTML;
}

function normalize(value = '') {
  return String(value).normalize('NFKC').toLowerCase().replace(/[^0-9a-z가-힣ぁ-んァ-ヶ一-龠]+/g, '');
}

function syncHighlights() {
  if (!host) return;
  const query = normalize(host.querySelector('#storeMap1FSearch')?.value || '');
  host.querySelectorAll('.live-map-detail-card').forEach((card) => {
    card.classList.remove('is-match', 'is-dimmed');
    if (!query) return;
    card.classList.add(normalize(card.textContent).includes(query) ? 'is-match' : 'is-dimmed');
  });
}

function renderDetails() {
  if (!host || host.querySelector('.live-map-details')) return;
  const config = loadStoreMap();
  const zones = config.zones.filter((zone) => zone.visible !== false && (zone.description || zone.items?.length));
  if (!zones.length) return;

  const section = document.createElement('section');
  section.className = 'live-map-details';
  section.innerHTML = `
    <div class="live-map-details-head">
      <small>ZONE DETAILS</small>
      <h4>1층 구역별 브랜드·제품 안내</h4>
      <p>구역명이나 제품명을 누르면 지도에서 해당 위치가 강조됩니다.</p>
    </div>
    <div class="live-map-detail-grid">
      ${zones.map((zone) => `
        <article class="live-map-detail-card" data-zone-id="${escapeHtml(zone.id)}">
          <button type="button" class="live-map-detail-title" data-map-search="${escapeHtml(zone.label)}">
            <span>${escapeHtml(zone.label)}</span>
            ${zone.subLabel ? `<small>${escapeHtml(zone.subLabel)}</small>` : ''}
          </button>
          ${zone.description ? `<p>${escapeHtml(zone.description)}</p>` : ''}
          ${zone.items?.length ? `<ul>${zone.items.map((item) => `<li><button type="button" data-map-search="${escapeHtml(item)}">${escapeHtml(item)}</button></li>`).join('')}</ul>` : ''}
        </article>
      `).join('')}
    </div>`;

  const note = host.querySelector('.live-map-note');
  if (note) note.before(section);
  else host.append(section);

  section.querySelectorAll('[data-map-search]').forEach((button) => {
    button.addEventListener('click', () => {
      const input = host.querySelector('#storeMap1FSearch');
      if (!input) return;
      input.value = button.dataset.mapSearch || '';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      host.querySelector('.live-map-board')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });

  const input = host.querySelector('#storeMap1FSearch');
  if (input && input.dataset.detailsBound !== 'true') {
    input.dataset.detailsBound = 'true';
    input.addEventListener('input', syncHighlights);
  }
  syncHighlights();
}

if (host) {
  const observer = new MutationObserver(renderDetails);
  observer.observe(host, { childList: true });
  renderDetails();
}
