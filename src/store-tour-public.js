import { loadStoreMap } from './store-map-config.js';
import { loadPublicSpots } from './store-tour-public-api.js';
import { defaultImage, sceneImage } from './store-tour-images.js';
import { createPanoramaViewer } from './store-tour-viewer.js';
import { renderDirections, renderPlan } from './store-tour-ui.js';
import { publicTourShell } from './store-tour-public-shell.js';
import { tourCopy, tourLanguage, tourSpotTitle } from './store-tour-i18n.js';

const preloadCache = new Map();

function ensureRoadviewStyle() {
  if (document.querySelector('link[data-store-roadview="28"]')) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = new URL('../store-guide/store-guide-roadview-v28.css?v=28', import.meta.url).href;
  link.dataset.storeRoadview = '28';
  document.head.append(link);
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

  async function loadSpotImage(spot) {
    const title = `${titleFor(spot)} 360`;
    let primarySource = '';
    try {
      primarySource = await sceneImage(spot);
      if (await viewer.setSource(primarySource, title)) return true;
    } catch (error) {
      console.warn(error);
    }

    if (spot.imageMode === 'custom' && spot.imageUrl) {
      try {
        const fallbackSource = await defaultImage(spot.id);
        return await viewer.setSource(fallbackSource, title);
      } catch (error) {
        console.warn(error);
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
      .slice(0, 5);
  }

  function warmNearby(spot) {
    const schedule = () => nearbySpots(spot).forEach((item) => preloadSpot(item));
    if ('requestIdleCallback' in window) requestIdleCallback(schedule, { timeout: 1800 });
    else setTimeout(schedule, 250);
  }

  async function select(id, { retry = false } = {}) {
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

    const url = new URL(location.href);
    url.searchParams.set('tour', id);
    history.replaceState(null, '', url);

    const index = spots.findIndex((item) => item.id === id);
    root.dispatchEvent(new CustomEvent('blueblack-tour-selected', {
      detail: { id, spot, index, total: spots.length },
    }));
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

  root.addEventListener('blueblack-tour-request', (event) => {
    if (event.detail?.id) select(event.detail.id);
  });

  await select(selected);
}

document.readyState === 'loading'
  ? document.addEventListener('DOMContentLoaded', mount, { once: true })
  : mount();
