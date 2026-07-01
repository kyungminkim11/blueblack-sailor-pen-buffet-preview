export function cleanCell(value = '') {
  return String(value ?? '')
    .replace(/^\uFEFF/, '')
    .replace(/\t/g, '')
    .trim();
}

export function normalize(value = '') {
  return String(value)
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[^0-9a-z가-힣ぁ-んァ-ヶ一-龠]+/g, '');
}

export function parseNumber(value) {
  const text = cleanCell(value).replace(/,/g, '');
  if (!text) return null;
  const number = Number(text);
  return Number.isFinite(number) ? number : null;
}

export function formatPrice(value) {
  if (!Number.isFinite(value)) return '확인 필요';
  return `${new Intl.NumberFormat('ko-KR').format(value)}원`;
}

export function formatStock(value) {
  if (!Number.isFinite(value)) return '확인 필요';
  return `${new Intl.NumberFormat('ko-KR').format(value)}개`;
}

export function escapeHtml(value = '') {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  return String(value).replace(/[&<>"']/g, (character) => map[character]);
}

export function initials(value = '') {
  const words = String(value).trim().split(/\s+/).filter(Boolean);
  return (words.slice(0, 2).map((word) => word[0]).join('') || 'BB').toUpperCase();
}

export function productSearchUrl(product) {
  if (product.url) return product.url;
  const keyword = product.name || product.code || '';
  return `https://blueblack.co.kr/product/search.html?keyword=${encodeURIComponent(keyword)}`;
}
