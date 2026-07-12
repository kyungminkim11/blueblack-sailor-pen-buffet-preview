import { loadStoreMap } from './store-map-config.js?v=28';
import { loadPublicSpots } from './store-tour-public-api-v26.js?v=28';
import { defaultImage, sceneImage } from './store-tour-images-v26.js?v=28';
import { createPanoramaViewer } from './store-tour-viewer.js?v=28';
import { renderDirections, renderPlan } from './store-tour-ui.js?v=28';
import { publicTourShell } from './store-tour-public-shell.js?v=28';
import { tourCopy, tourLanguage, tourSpotTitle } from './store-tour-i18n.js?v=28';

const preloadCache = new Map();

function ensureRoadviewStyle() {
  if (document.querySelector('link[data-store-roadview="28"]')) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = new URL('../store-guide/store-guide-roadview-v28.css?v=28', import.meta.url).href;
  link.dataset.storeRoadview = '28';
  document.head.append(link);
}

function shouldDeferInitialLoad() {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  return Boolean(connection?.saveData || (navigator.deviceMemory && navigator.deviceMemory <= 2));
}

function installLowMemoryStart(root, onStart) {
  const shell = root.querySelector('.store-tour-view-shell');
  if (!shell || shell.querySelector('.store-tour-mobile-start')) return null;
  const overlay = document.createElement('div');
  overlay.className = 'store-tour-mobile-start';
  overlay.innerHTML = `
    <div class="store-tour-mobile-start-box">
      <small>DATA SAVING MODE</small>
      <strong>360 사진을 열 준비가 됐습니다.</strong>
      <p>기기의 데이터 절약 설정을 고려해 사진을 자동으로 불러오지 않았습니다.</p>
      <button type="button">360 투어 시작</button>
    </div>
  `;
  overlay.querySelector('button').addEventListener('click', () => {
    overlay.remove();
    onStart();
  });
  shell.append(overlay);
  return overlay;
}

function preloadImage(source) {
  if (!source) return Promise.resolve(false);
  if (preloadCache.has(source)) return preloadCache.get(source);
  const promise = new Promise((resolve) => {
    const image = new Image();
    image.decoding = 'async';
    image.onload = () => resolve(true);
    image.onerror = () => resolve(false);
    image.src = source;
  });
  preloadCache.set(source, promise);
  return promise;
}

async function preloadSpot(spot) {
  if (!spot) return false;
  try {
    return await preloadImage(await sceneImage(spot));
  } catch {
    return false;
  }
}

function setStatus(status, message = '', { retry } = {}) {
  status.replaceChildren();
  if (!message && !retry) return;
  const text = document.createElement('span');
  text.textContent = message;
  status.append(text);
  if (retry) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'tour-retry-button';
    button.textContent = '다시 불러오기';
    button.addEventListener('click', retry, { once: true });
    status.append(button);
  }
}

async function mount() {
  const root = document.querySelector('#storeTour360');
  if (!root) return;

  ensureRoadviewStyle();
  const lang = tourLanguage();
  const copy = tourCopy(lang);
  publicTourShell(root, copy);

  const result = await loadPublicSpots();
  const spots = Array.isArray(result.spots) ? result.spots : [];
  const byId = new Map(spots.map((spot) => [spot.id, spot]));
  const plan = root.querySelector('[data-tour-plan]');
  const directions = root.querySelector('[data-tour-directions]');
  const list = root.querySelector('[data-tour-list]');
  const status = root.querySelector('[data-tour-status]');
  const viewerRoot = root.querySelector('[data-tour-viewer]');
  const network = root.querySelector('[data-tour-network]');
  const count = root.querySelector('[data-tour-count]');
  const viewer = createPanoramaViewer(viewerRoot);
  const titleFor = (spot) => tourSpotTitle(spot, lang);

  if (network) {
    network.textContent = result.online ? 'ONLINE' : 'OFFLINE';
    network.dataset.state = result.online ? 'online' : 'offline';
  }
  if (count) count.textContent = `${spots.length} VIEW POINTS`;

  if (!spots.length) {
    setStatus(status, copy.loadError);
    return;
  }

  let selected = new URLSearchParams(location.search).get('tour');
  if (!byId.has(selected)) selected = spots[0].id;
  let selectionToken = 0;
  let imageLoadEnabled = !shouldDeferInitialLoad();

  async function loadSpotImage(spot) {
    const title = `${titleFor(spot)} 360`;
    try {
      if (await viewer.setSource(await sceneImage(spot), title)) return true;
    } catch (error) {
      console.warn('primary tour image failed', error);
    }
    if (spot.imageMode === 'custom' && spot.imageUrl) {
      try {
        return await viewer.setSource(await defaultImage(spot.id), title);
      } catch (error) {
        console.warn('default tour image failed', error);
      }
    }
    return false;
  }

  function nearbySpots(spot) {
    const linked = Object.values(spot.connections || {}).map((id) => byId.get(id));
    const index = spots.findIndex((item) => item.id === spot.id);
    return [spots[index - 1], spots[index + 1], ...linked]
      .filter(Boolean)
      .filter((item, itemIndex, array) => array.findIndex((candidate) => candidate.id === item.id) === itemIndex)
      .slice(0, 4);
  }

  function warmNearby(spot) {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection?.saveData || (navigator.deviceMemory && navigator.deviceMemory <= 2)) return;
    const schedule = () => nearbySpots(spot).forEach((item) => preloadSpot(item));
    if ('requestIdleCallback' in window) requestIdleCallback(schedule, { timeout: 1800 });
    else setTimeout(schedule, 300);
  }

  async function select(id, { retry = false, skipImage = false } = {}) {
    const spot = byId.get(id);
    if (!spot) return;
    const currentToken = ++selectionToken;
    selected = id;
    root.dataset.selectedSpot = id;
    root.classList.add('is-changing-scene');

    root.querySelectorAll('[data-spot-id]').forEach((node) => {
      node.classList.toggle('is-selected', node.dataset.spotId === id);
    });
    const codeNode = root.querySelector('[data-tour-code]');
    const titleNode = root.querySelector('[data-tour-title]');
    if (codeNode) codeNode.textContent = spot.code || '';
    if (titleNode) titleNode.textContent = titleFor(spot);
    renderDirections(directions, spot, byId, (targetId) => select(targetId), { labels: copy.labels, titleFor });

    const url = new URL(location.href);
    url.searchParams.set('tour', id);
    history.replaceState(null, '', url);

    const index = spots.findIndex((item) => item.id === id);
    root.dispatchEvent(new CustomEvent('blueblack-tour-selected', { detail: { id, spot, index, total: spots.length } }));

    if (!imageLoadEnabled || skipImage) {
      root.classList.remove('is-changing-scene');
      setStatus(status, '데이터 절약 모드입니다. 시작 버튼을 누르면 360 사진을 불러옵니다.');
      return;
    }

    setStatus(status, retry ? '사진을 다시 불러오고 있습니다.' : '');
    let loaded = false;
    try {
      loaded = await loadSpotImage(spot);
    } catch (error) {
      console.warn(error);
    }
    if (currentToken !== selectionToken) return;

    root.classList.remove('is-changing-scene');
    if (loaded) {
      setStatus(status, result.online ? '' : copy.offline);
      warmNearby(spot);
    } else {
      setStatus(status, copy.loadError, { retry: () => select(id, { retry: true }) });
    }
  }

  renderPlan(plan, loadStoreMap(), spots, (id) => select(id), { titleFor });
  list.replaceChildren(...spots.map((spot) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.spotId = spot.id;
    button.innerHTML = `<small>${spot.code || ''}</small><b>${titleFor(spot)}</b>`;
    button.addEventListener('click', () => select(spot.id));
    return button;
  }));

  if (!imageLoadEnabled) {
    installLowMemoryStart(root, async () => {
      imageLoadEnabled = true;
      await select(selected, { retry: true });
    });
  }
  await select(selected, { skipImage: !imageLoadEnabled });
}

document.readyState === 'loading'
  ? document.addEventListener('DOMContentLoaded', mount, { once: true })
  : mount();
