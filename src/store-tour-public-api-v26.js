import { ENDPOINT, SPOTS } from './store-tour-config.js?v=26';

const DEFAULT_IMAGE_IDS = new Set(Array.from({ length: 9 }, (_, index) => `f1-${String(index + 1).padStart(2, '0')}`));

function usableText(value) {
  return typeof value === 'string' && value.trim() ? value.trim() : '';
}

function canRenderSpot(spot) {
  if (!spot || spot.isPublic === false || spot.imageMode === 'hidden') return false;
  if (spot.imageMode === 'custom' && usableText(spot.imageUrl)) return true;
  return DEFAULT_IMAGE_IDS.has(spot.id);
}

function removeUnavailableConnections(spots) {
  const visibleIds = new Set(spots.map((spot) => spot.id));
  return spots.map((spot) => ({
    ...spot,
    connections: Object.fromEntries(
      Object.entries(spot.connections || {}).filter(([, targetId]) => visibleIds.has(targetId))
    ),
  }));
}

export function mergeSpots(remote, available = true) {
  const remoteItems = available && Array.isArray(remote) ? remote : [];
  const remoteById = new Map(remoteItems.filter((item) => item?.id).map((item) => [item.id, item]));

  const merged = SPOTS.map((baseSpot) => {
    const remoteSpot = remoteById.get(baseSpot.id);
    if (!remoteSpot) return structuredClone(baseSpot);
    const item = {
      ...baseSpot,
      ...remoteSpot,
      connections: {
        ...baseSpot.connections,
        ...(remoteSpot.connections || {}),
      },
    };
    item.title = usableText(remoteSpot.title) || baseSpot.title;
    item.code = usableText(remoteSpot.code) || baseSpot.code;
    item.sortOrder = Number.isFinite(Number(remoteSpot.sortOrder)) ? Number(remoteSpot.sortOrder) : baseSpot.sortOrder;
    return item;
  }).filter(canRenderSpot).sort((a, b) => a.sortOrder - b.sortOrder);

  return removeUnavailableConnections(merged);
}

export async function loadPublicSpots() {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 4500);
  try {
    const response = await fetch(ENDPOINT, { cache: 'no-store', signal: controller.signal });
    const body = await response.json();
    if (!response.ok || body.ok === false) throw new Error('load');
    return { spots: mergeSpots(body.spots, true), online: true };
  } catch (error) {
    console.warn('store tour API fallback', error);
    return { spots: mergeSpots([], false), online: false };
  } finally {
    clearTimeout(timer);
  }
}