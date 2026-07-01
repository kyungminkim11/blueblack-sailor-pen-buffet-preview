import { INK_INVENTORY_COLORS_PART as PART1 } from './ink-inventory-colors-v26-part1.js';
import { INK_INVENTORY_COLORS_PART as PART2 } from './ink-inventory-colors-v26-part2.js';

function cleanInventoryColorName(value = '') {
  return String(value)
    .replace(/\bPer nkle\b/gi, 'Periwinkle')
    .replace(/\bIRIS SAGESS\b/gi, 'IRIS SAGESSE')
    .replace(/^미니\s+/i, '')
    .replace(/^(?:150주년|160주년)\s+/i, '')
    .replace(/^\(\s*\)\s*/, '')
    .replace(/^오너먼트 글라스 병\s+/i, '')
    .replace(/\s*·\s*미니병\s*·\s*문서보존용\s*$/i, '')
    .replace(/\s*·\s*13-9121-231\s*$/i, '')
    .replace(/\*/g, '')
    .replace(/\(\s*\)/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function isActualDecantColor(item) {
  const text = `${item.nameKo || ''} ${item.productTitle || ''}`;
  return !/(?:^|\s)SET(?:\s|$)|세트|캘린더\s*20\d{2}|만년필|볼펜|샤프|수성펜|프리젠터|디스플레이|트래블링|펜레스트겸용/i.test(text);
}

const seen = new Set();
export const INK_INVENTORY_COLORS = [...PART1, ...PART2]
  .map((item) => {
    const name = cleanInventoryColorName(item.nameKo || item.nameEn);
    return {
      ...item,
      nameKo: name,
      nameEn: name,
      productTitle: `${item.brandKo || item.brandEn} ${name}`,
    };
  })
  .filter((item) => item.nameKo && isActualDecantColor(item))
  .filter((item) => {
    const key = `${item.priceItemId}|${item.nameKo.toLocaleLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  })
  .map((item, index) => ({ ...item, id: `inventory-decant-${index}` }));
