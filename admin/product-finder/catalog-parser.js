import { cleanCell, normalize, parseNumber } from './catalog-utils.js';

export function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];

    if (quoted) {
      if (character === '"' && text[index + 1] === '"') {
        cell += '"';
        index += 1;
      } else if (character === '"') {
        quoted = false;
      } else {
        cell += character;
      }
      continue;
    }

    if (character === '"') {
      quoted = true;
    } else if (character === ',') {
      row.push(cell);
      cell = '';
    } else if (character === '\n') {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
    } else if (character !== '\r') {
      cell += character;
    }
  }

  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }

  return rows;
}

function findColumn(headers, patterns, excludedPatterns = []) {
  return headers.findIndex((header) => {
    const matches = patterns.some((pattern) => pattern.test(header));
    const excluded = excludedPatterns.some((pattern) => pattern.test(header));
    return matches && !excluded;
  });
}

export function buildProducts(rows) {
  const headerIndex = rows.findIndex((row) => {
    const joined = row.map(cleanCell).join('|');
    const hasCode = /(품목코드|상품코드|제품코드|바코드|barcode|sku)/i.test(joined);
    const hasName = /(품명|상품명|제품명|name)/i.test(joined);
    return hasCode && hasName;
  });

  if (headerIndex < 0) {
    throw new Error('품목코드와 상품명 열을 찾지 못했습니다.');
  }

  const headers = rows[headerIndex].map(cleanCell);
  const columns = {
    code: findColumn(headers, [/품목코드/i, /상품코드/i, /제품코드/i, /^sku$/i, /^code$/i]),
    barcode: findColumn(headers, [/바코드/i, /barcode/i, /jan/i, /ean/i]),
    brand: findColumn(headers, [/품목그룹1명/i, /브랜드/i, /brand/i, /제조사/i]),
    name: findColumn(headers, [/품명\s*및\s*규격/i, /상품명/i, /제품명/i, /^name$/i, /품명/i]),
    stock: findColumn(headers, [/재고수량/i, /현재재고/i, /^재고$/i, /stock/i]),
    retail: findColumn(headers, [/소비자가/i, /정가/i, /retail/i]),
    sale: findColumn(headers, [/판매가/i, /할인가/i, /sale/i, /price/i], [/소비자/i]),
    location: findColumn(headers, [/재고\s*위치/i, /보관\s*위치/i, /location/i]),
    note: findColumn(headers, [/적요/i, /메모/i, /비고/i, /note/i]),
    url: findColumn(headers, [/상품\s*링크/i, /상품\s*url/i, /product\s*url/i, /^url$/i]),
    image: findColumn(headers, [/이미지/i, /image/i, /사진/i])
  };

  if (columns.name < 0) {
    throw new Error('상품명 열을 찾지 못했습니다.');
  }

  const products = [];
  const seen = new Set();

  rows.slice(headerIndex + 1).forEach((row, rowIndex) => {
    const name = cleanCell(row[columns.name]);
    const code = columns.code >= 0 ? cleanCell(row[columns.code]) : '';
    const barcode = columns.barcode >= 0 ? cleanCell(row[columns.barcode]) : '';

    if (!name || (!code && !barcode)) return;

    const uniqueKey = `${code}|${barcode}|${name}`;
    if (seen.has(uniqueKey)) return;
    seen.add(uniqueKey);

    const product = {
      id: `product-${rowIndex}-${normalize(code || barcode || name).slice(0, 28)}`,
      code,
      barcode,
      brand: columns.brand >= 0 ? cleanCell(row[columns.brand]) : '',
      name,
      stock: columns.stock >= 0 ? parseNumber(row[columns.stock]) : null,
      retailPrice: columns.retail >= 0 ? parseNumber(row[columns.retail]) : null,
      salePrice: columns.sale >= 0 ? parseNumber(row[columns.sale]) : null,
      location: columns.location >= 0 ? cleanCell(row[columns.location]) : '',
      note: columns.note >= 0 ? cleanCell(row[columns.note]) : '',
      url: columns.url >= 0 ? cleanCell(row[columns.url]) : '',
      image: columns.image >= 0 ? cleanCell(row[columns.image]) : ''
    };

    product.searchText = normalize([
      product.code,
      product.barcode,
      product.brand,
      product.name,
      product.location,
      product.note
    ].join(' '));

    products.push(product);
  });

  return products;
}
