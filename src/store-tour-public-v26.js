import { loadStoreMap } from './store-map-config.js?v=26';
import { loadPublicSpots } from './store-tour-public-api-v26.js?v=26';
import { defaultImage, sceneImage } from './store-tour-images-v26.js?v=26';
import { createPanoramaViewer } from './store-tour-viewer.js?v=26';
import { renderDirections, renderPlan } from './store-tour-ui.js?v=26';
import { publicTourShell } from './store-tour-public-shell.js?v=26';
import { tourCopy, tourLanguage, tourSpotTitle } from './store-tour-i18n.js?v=26';

function ensureHotfixStyle() {
  if (document.querySelector('link[data-store-tour-hotfix="26"]')) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = new URL('../store-guide/store-guide-tour-hotfix-v25.css?v=26', import.meta.url).href;
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
  const viewer = createPanoramaViewer(root.querySelector('[data-tour-viewer]'));
  const titleFor = (spot) => tourSpotTitle(spot, lang);

  if (!spots.length) {
    status.textContent = copy.loadError;
    return;
  }

  let selected = new URLSearchParams(location.search).get('tour');
  if (!byId.has(selected)) selected = spots[0].id;
  let selectionToken = 0;

  async function loadSpotImage(spot, token) {
    const title = `${titleFor(spot)} 360`;
    try {
      const primarySource = await sceneImage(spot);
      if (token !== selectionToken) return false;
      const primaryLoaded = await viewer.setSource(primarySource, title);
      if (primaryLoaded || token !== selectionToken) return primaryLoaded;
    } catch (error) {
      console.warn('primary tour image failed', error);
    }

    if (spot.imageMode === 'custom' && spot.imageUrl) {
      try {
        const fallbackSource = await defaultImage(spot.id);
        if (token !== selectionToken) return false;
        return await viewer.setSource(fallbackSource, title);
      } catch (error) {
        console.warn('default tour image failed', error);
      }
    }
    return false;
  }

  async function select(id) {
    const spot = byId.get(id);
    if (!spot) return;
    const token = ++selectionToken;

    root.querySelectorAll('[data-spot-id]').forEach((node) => {
      node.classList.toggle('is-selected', node.dataset.spotId === id);
    });
    const codeNode = root.querySelector('[data-tour-code]');
    const titleNode = root.querySelector('[data-tour-title]');
    if (codeNode) codeNode.textContent = spot.code || '';
    if (titleNode) titleNode.textContent = titleFor(spot);

    renderDirections(directions, spot, byId, select, { labels: copy.labels, titleFor });
    const loaded = await loadSpotImage(spot, token);
    if (token === selectionToken) status.textContent = loaded ? (result.online ? '' : copy.offline) : copy.loadError;

    const url = new URL(location.href);
    url.searchParams.set('tour', id);
    history.replaceState(null, '', url);
  }

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
