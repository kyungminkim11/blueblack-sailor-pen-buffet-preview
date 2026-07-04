import { loadStoreMap } from './store-map-config.js';

if (!document.querySelector('link[data-store-map-details]')) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = new URL('../store-tour/store-map-1f-details.css?v=2', import.meta.url).href;
  link.dataset.storeMapDetails = '';
  document.head.append(link);
}

const DETAIL_COPY={
  ko:{selected:'SELECTED ZONE',closeAria:'구역 정보 닫기',close:'닫기 ×',empty:'이 구역의 상세 정보는 준비 중입니다.',items:'이 구역에서 확인할 수 있어요',details:'1층 구역별 브랜드·제품 안내',body:'구역명이나 제품명을 누르면 지도에서 해당 위치가 강조됩니다.',view:label=>`${label} 정보 보기`},
  en:{selected:'SELECTED ZONE',closeAria:'Close zone information',close:'Close ×',empty:'Detailed information for this area is being prepared.',items:'Available in this area',details:'First-floor brands and products by area',body:'Select an area or product name to highlight its location on the map.',view:label=>`View information for ${label}`},
  ja:{selected:'選択したエリア',closeAria:'エリア情報を閉じる',close:'閉じる ×',empty:'このエリアの詳細情報は準備中です。',items:'このエリアで確認できます',details:'1階エリア別ブランド・商品案内',body:'エリア名または商品名を選ぶと、地図上の位置が強調表示されます。',view:label=>`${label}の情報を見る`},
  'zh-Hans':{selected:'已选区域',closeAria:'关闭区域信息',close:'关闭 ×',empty:'该区域的详细信息正在准备中。',items:'此区域可查看',details:'一楼各区域品牌与商品指南',body:'点击区域名称或商品名称，可在地图上突出显示相应位置。',view:label=>`查看${label}信息`},
  'zh-Hant':{selected:'已選區域',closeAria:'關閉區域資訊',close:'關閉 ×',empty:'此區域的詳細資訊正在準備中。',items:'此區域可查看',details:'一樓各區域品牌與商品指南',body:'點擊區域名稱或商品名稱，可在地圖上醒目顯示相應位置。',view:label=>`查看${label}資訊`}
};

const host = document.querySelector('#storeMap1FLive');
let selectedZoneId = '';

function detailLanguage(){
  const raw=(new URLSearchParams(location.search).get('lang')||document.documentElement.lang||localStorage.getItem('blueblack-language')||'ko').toLowerCase();
  if(raw.includes('hant')||raw.startsWith('zh-tw')||raw.startsWith('zh-hk'))return'zh-Hant';
  if(raw.startsWith('zh'))return'zh-Hans';
  if(raw.startsWith('ja'))return'ja';
  if(raw.startsWith('en'))return'en';
  return'ko';
}

function t(){return DETAIL_COPY[detailLanguage()]||DETAIL_COPY.ko;}

function escapeHtml(value = '') {
  const node = document.createElement('div');
  node.textContent = String(value);
  return node.innerHTML;
}

function normalize(value = '') {
  return String(value).normalize('NFKC').toLowerCase().replace(/[^0-9a-z가-힣ぁ-んァ-ヶ一-龠]+/g, '');
}

function getConfigZones() {
  return loadStoreMap().zones.filter((zone) => zone.visible !== false);
}

function setSearch(value) {
  const input = host?.querySelector('#storeMap1FSearch');
  if (!input) return;
  input.value = value || '';
  input.dispatchEvent(new Event('input', { bubbles: true }));
}

function hideSelectedInfo() {
  selectedZoneId = '';
  const panel = host?.querySelector('#storeMap1FSelectedInfo');
  if (panel) panel.hidden = true;
  host?.querySelectorAll('.live-map-zone').forEach((zone) => zone.classList.remove('is-info-selected'));
}

function showSelectedInfo(zone, mapNode) {
  const panel = host?.querySelector('#storeMap1FSelectedInfo');
  if (!panel || !zone) return;

  if (selectedZoneId === zone.id) {
    hideSelectedInfo();
    setSearch('');
    return;
  }

  const copy=t();
  selectedZoneId = zone.id;
  host.querySelectorAll('.live-map-zone').forEach((node) => node.classList.toggle('is-info-selected', node === mapNode));

  panel.innerHTML = `
    <div class="live-map-selected-info-head">
      <div>
        <small>${escapeHtml(copy.selected)}</small>
        <h4>${escapeHtml(zone.label)}</h4>
        ${zone.subLabel ? `<span>${escapeHtml(zone.subLabel)}</span>` : ''}
      </div>
      <button type="button" id="storeMap1FInfoClose" aria-label="${escapeHtml(copy.closeAria)}">${escapeHtml(copy.close)}</button>
    </div>
    ${zone.description ? `<p>${escapeHtml(zone.description)}</p>` : `<p>${escapeHtml(copy.empty)}</p>`}
    ${zone.items?.length ? `<div class="live-map-selected-items"><strong>${escapeHtml(copy.items)}</strong><ul>${zone.items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul></div>` : ''}
  `;
  panel.hidden = false;
  panel.querySelector('#storeMap1FInfoClose')?.addEventListener('click', () => {
    hideSelectedInfo();
    setSearch('');
  });
  setSearch(zone.label);
  panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function bindMapZones() {
  if (!host) return;
  const mapNodes = [...host.querySelectorAll('.live-map-zone')];
  const zones = getConfigZones();
  const copy=t();

  mapNodes.forEach((node, index) => {
    if (node.dataset.infoBound === 'true') return;
    const zone = zones[index];
    if (!zone) return;

    node.dataset.infoBound = 'true';
    node.dataset.zoneId = zone.id;
    node.setAttribute('role', 'button');
    node.setAttribute('tabindex', '0');
    node.setAttribute('aria-label', copy.view(zone.label));

    const open = () => showSelectedInfo(zone, node);
    node.addEventListener('click', open);
    node.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        open();
      }
    });
  });
}

function syncHighlights() {
  if (!host) return;
  const query = normalize(host.querySelector('#storeMap1FSearch')?.value || '');
  host.querySelectorAll('.live-map-detail-card').forEach((card) => {
    card.classList.remove('is-match', 'is-dimmed');
    if (!query) return;
    card.classList.add(normalize(card.textContent).includes(query) ? 'is-match' : 'is-dimmed');
  });
  if (!query) hideSelectedInfo();
}

function renderDetails() {
  if (!host) return;
  const config = loadStoreMap();
  const zones = config.zones.filter((zone) => zone.visible !== false && (zone.description || zone.items?.length));
  const copy=t();

  if (!host.querySelector('#storeMap1FSelectedInfo')) {
    const panel = document.createElement('section');
    panel.className = 'live-map-selected-info';
    panel.id = 'storeMap1FSelectedInfo';
    panel.hidden = true;
    const viewport = host.querySelector('.live-map-viewport');
    if (viewport) viewport.insertAdjacentElement('afterend', panel);
  }

  if (!host.querySelector('.live-map-details') && zones.length) {
    const section = document.createElement('section');
    section.className = 'live-map-details';
    section.innerHTML = `
      <div class="live-map-details-head">
        <small>ZONE DETAILS</small>
        <h4>${escapeHtml(copy.details)}</h4>
        <p>${escapeHtml(copy.body)}</p>
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
        const value = button.dataset.mapSearch || '';
        setSearch(value);
        const zone = config.zones.find((item) => item.label === value || item.items?.includes(value));
        const mapNode = zone ? host.querySelector(`.live-map-zone[data-zone-id="${zone.id}"]`) : null;
        if (zone && mapNode) showSelectedInfo(zone, mapNode);
        host.querySelector('.live-map-board')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    });
  }

  const input = host.querySelector('#storeMap1FSearch');
  if (input && input.dataset.detailsBound !== 'true') {
    input.dataset.detailsBound = 'true';
    input.addEventListener('input', syncHighlights);
  }

  bindMapZones();
  syncHighlights();
}

if (host) {
  const observer = new MutationObserver(renderDetails);
  observer.observe(host, { childList: true, subtree: true });
  renderDetails();
}
