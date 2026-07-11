import { ENDPOINT, SPOTS } from './store-tour-config.js';

function usableText(value) {
  return typeof value === 'string' && value.trim() ? value.trim() : '';
}

export function mergeSpots(remote, available = true) {
  const remoteItems = available && Array.isArray(remote) ? remote : [];
  const remoteById = new Map(remoteItems.filter((item) => item?.id).map((item) => [item.id, item]));

  return SPOTS.map((baseSpot) => {
    const remoteSpot = remoteById.get(baseSpot.id);
    if (!remoteSpot) return structuredClone(baseSpot);

    const merged = {
      ...baseSpot,
      ...remoteSpot,
      connections: {
        ...baseSpot.connections,
        ...(remoteSpot.connections || {}),
      },
    };

    // Incomplete online rows must not erase the labels and navigation metadata
    // bundled with the customer guide.
    merged.title = usableText(remoteSpot.title) || baseSpot.title;
    merged.code = usableText(remoteSpot.code) || baseSpot.code;
    merged.sortOrder = Number.isFinite(Number(remoteSpot.sortOrder))
      ? Number(remoteSpot.sortOrder)
      : baseSpot.sortOrder;

    return merged;
  }).sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function loadPublicSpots() {
  try {
    const response = await fetch(ENDPOINT, { cache: 'no-store' });
    const body = await response.json();
    if (!response.ok || body.ok === false) throw new Error('load');
    return { spots: mergeSpots(body.spots, true), online: true };
  } catch (error) {
    console.warn(error);
    return { spots: mergeSpots([], false), online: false };
  }
}
