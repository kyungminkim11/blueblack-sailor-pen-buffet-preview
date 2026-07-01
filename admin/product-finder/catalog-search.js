import { normalize } from './catalog-utils.js';

function directScore(product, query, ocrMode) {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return 0;

  const code = normalize(product.code);
  const barcode = normalize(product.barcode);
  const name = normalize(product.name);
  const brand = normalize(product.brand);
  let score = 0;

  if (normalizedQuery === barcode || normalizedQuery === code) score += 20000;
  if (barcode && barcode.startsWith(normalizedQuery)) score += 9000;
  if (code && code.startsWith(normalizedQuery)) score += 8500;
  if (normalizedQuery === name) score += 7000;
  if (name.startsWith(normalizedQuery)) score += 4500;
  if (name.includes(normalizedQuery)) score += 3200;
  if (brand === normalizedQuery) score += 2200;
  if (brand.includes(normalizedQuery)) score += 1000;
  if (product.searchText.includes(normalizedQuery)) score += 1200;

  const tokens = String(query)
    .normalize('NFKC')
    .toLowerCase()
    .split(/[^0-9a-z가-힣ぁ-んァ-ヶ一-龠]+/)
    .filter((token) => normalize(token).length >= 2);

  let matches = 0;

  tokens.forEach((token) => {
    const normalizedToken = normalize(token);
    if (code === normalizedToken || barcode === normalizedToken) {
      score += 5000;
      matches += 1;
    } else if (name.includes(normalizedToken)) {
      score += ocrMode ? 620 : 280;
      matches += 1;
    } else if (brand.includes(normalizedToken)) {
      score += ocrMode ? 400 : 180;
      matches += 1;
    } else if (product.searchText.includes(normalizedToken)) {
      score += ocrMode ? 170 : 70;
      matches += 1;
    }
  });

  if (tokens.length && matches === tokens.length) score += 900;
  if (ocrMode) score += matches * matches * 90;
  return score;
}

function makeBigrams(value) {
  const text = normalize(value);
  const bigrams = new Set();
  for (let index = 0; index < text.length - 1; index += 1) {
    bigrams.add(text.slice(index, index + 2));
  }
  return bigrams;
}

function similarity(first, second) {
  const firstBigrams = makeBigrams(first);
  const secondBigrams = makeBigrams(second);
  if (!firstBigrams.size || !secondBigrams.size) return 0;

  let matches = 0;
  firstBigrams.forEach((bigram) => {
    if (secondBigrams.has(bigram)) matches += 1;
  });

  return (2 * matches) / (firstBigrams.size + secondBigrams.size);
}

export function searchCatalog(products, query, options = {}) {
  const value = String(query || '').trim();
  const ocrMode = options.ocr === true;
  if (!value) return [];

  const scored = products
    .map((product) => ({ product, score: directScore(product, value, ocrMode) }))
    .filter((item) => item.score > 0);

  if (scored.length < 20 && !ocrMode && normalize(value).length >= 3) {
    const existing = new Set(scored.map((item) => item.product.id));

    products.forEach((product) => {
      if (existing.has(product.id)) return;

      const fuzzyScore = Math.max(
        similarity(value, product.name),
        similarity(value, `${product.brand} ${product.name}`)
      );

      if (fuzzyScore >= 0.42) {
        scored.push({ product, score: Math.round(fuzzyScore * 900) });
      }
    });
  }

  return scored
    .sort((first, second) => {
      if (second.score !== first.score) return second.score - first.score;
      return String(first.product.name).localeCompare(String(second.product.name), 'ko');
    })
    .slice(0, 100)
    .map((item) => item.product);
}
