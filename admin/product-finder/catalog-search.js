import { searchRemoteProducts } from './catalog-db.js';

function ocrQueries(text) {
  const lines = String(text || '')
    .split(/[\r\n]+/)
    .map((line) => line.trim())
    .filter(Boolean);
  const tokens = String(text || '')
    .split(/[^0-9a-zA-Z가-힣ぁ-んァ-ヶ一-龠]+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= 2);

  return [...new Set([...lines, ...tokens])]
    .sort((first, second) => second.length - first.length)
    .slice(0, 8);
}

export async function searchCatalog(query, options = {}) {
  const value = String(query || '').trim();
  if (!value) return [];

  if (!options.ocr) {
    return searchRemoteProducts(value, 50);
  }

  const merged = new Map();
  for (const candidate of ocrQueries(value)) {
    const rows = await searchRemoteProducts(candidate, 12);
    rows.forEach((row) => merged.set(row.id, row));
    if (merged.size >= 50) break;
  }
  return [...merged.values()].slice(0, 50);
}
