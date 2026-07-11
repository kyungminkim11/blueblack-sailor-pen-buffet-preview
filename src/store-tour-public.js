import { loadStoreMap } from './store-map-config.js';
import { loadPublicSpots } from './store-tour-public-api.js';
import { defaultImage, sceneImage } from './store-tour-images.js';
import { createPanoramaViewer } from './store-tour-viewer.js';
import { renderDirections, renderPlan } from './store-tour-ui.js';
import { publicTourShell } from './store-tour-public-shell.js';
import { tourCopy, tourLanguage, tourSpotTitle } from './store-tour-i18n.js';

function ensureHotfixStyle() {
  if (document.querySelector('link[data-store-tour-hotfix="26"]')) return;
  document.querySelectorAll('link[data-store-tour-hotfix]').forEach((node) => node.remove());
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = new URL('../store-guide/store-guide-tour-mobile-v26.css?v=26', import.meta.url).href;
  link.dataset.storeTourHotfix = '26';
  document.head.append(link);
}

async function mount() {
  const root = document.querySelector('#storeTour360');
  if (!root) return;

  ensureHotfixStyle();
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
  const viewShell = root.querySelector('.store-tour-view-shell');
  const startButton = root.querySelector('[data-tour-start]');
  const compact = matchMedia('(max-width: 760px), (pointer: coarse)').matches;
  let viewer = null;
  let viewerEnabled = !compact;
  let selected = new URLSearchParams(location.search).get('tour');
  const titleFor = (spot) => tourSpotTitle(spot, lang);
  const getViewer = () => {
    if (!viewer) viewer = createPanoramaViewer(viewerRoot, { compact });
    return viewer;
  };

  if (!spots.length) {
    status.textContent = copy.loadError;
    startButton?.remove();
    return;
  }

  if (!byId.has(selected)) selected = spots[0].id;
  if (!compact) {
    startButton?.remove();
    viewShell?.classList.add('is-ready');
  } else {
    status.textContent = copy.ready;
  }

  async function loadSpotImage(spot) {
    const currentViewer = getViewer();
    const title = `${titleFor(spot)} 360`;
    const primarySource = await sceneImage(spot);
    const primaryLoaded = await currentViewer.setSource(primarySource, title);
    if (primaryLoaded) return true;

    if (spot.imageMode === 'custom' && spot.imageUrl) {
      try {
        const fallbackSource = await defaultImage(spot.id);
        return await currentViewer.setSource(fallbackSource, title);
      } catch (error) {
        console.warn(error);
      }
    }
    return false;
  }

  async function select(id, options = {}) {
    const spot = byId.get(id);
    if (!spot) return;

    selected = id;
    root.querySelectorAll('[data-spot-id]').forEach((node) => {
      node.classList.toggle('is-selected', node.dataset.spotId === id);
    });

    const codeNode = root.querySelector('[data-tour-code]');
    const titleNode = root.querySelector('[data-tour-title]');
    if (codeNode) codeNode.textContent = spot.code || '';
    if (titleNode) titleNode.textContent = titleFor(spot);

    renderDirections(directions, spot, byId, select, { labels: copy.labels, titleFor });

    if (viewerEnabled || options.force) {
      viewerEnabled = true;
      viewShell?.classList.add('is-ready');
      if (startButton) startButton.hidden = true;
      status.textContent = '';
      try {
        const loaded = await loadSpotImage(spot);
        status.textContent = loaded ? (result.online ? '' : copy.offline) : copy.loadError;
      } catch (error) {
        console.warn(error);
        status.textContent = copy.loadError;
      }
    } else {
      status.textContent = copy.ready;
    }

    const url = new URL(location.href);
    url.searchParams.set('tour', id);
    history.replaceState(null, '', url);
  }

  startButton?.addEventListener('click', async () => {
    startButton.disabled = true;
    await select(selected, { force: true });
    startButton.disabled = false;
  });

  renderPlan(plan, loadStoreMap(), spots, select, { titleFor });
  list.replaceChildren(...spots.map((spot) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.spotId = spot.id;
    button.innerHTML = `<small>${spot.code || ''}</small><b>${titleFor(spot)}</b>`;
    button.addEventListener('click', () => select(spot.id));
    return button;
  }));

  await select(selected);
}

document.readyState === 'loading'
  ? document.addEventListener('DOMContentLoaded', mount, { once: true })
  : mount();
