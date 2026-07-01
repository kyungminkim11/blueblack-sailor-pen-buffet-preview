import { cleanCell } from './catalog-utils.js';

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

function findColumn(headers, patterns) {
  return headers.findIndex((header) => patterns.some((pattern) => pattern.test(header)));
}

function isValidGtin(value) {
  if (!/^\d{8}$|^\d{12}$|^\d{13}$|^\d{14}$/.test(value)) return false;

  const digits = [...value].map(Number);
  const checkDigit = digits.pop();
  const total = digits
    .reverse()
    .reduce((sum, digit, index) => sum + digit * (index % 2 === 0 ? 3 : 1), 0);

  return (10 - (total % 10)) % 10 === checkDigit;
}

function verifiedBarcode(value) {
  const digits = cleanCell(value).replace(/[^0-9]/g, '');
  return isValidGtin(digits) ? digits : '';
}

function barcodeFromName(name) {
  for (const match of name.matchAll(/(?<!\d)(\d{8}|\d{12,14})(?!\d)/g)) {
    const barcode = verifiedBarcode(match[1]);
    if (barcode) return barcode;
  }
  return '';
}

export function sourceDateFromRows(rows) {
  const firstLines = rows.slice(0, 5).flat().map(cleanCell).join(' ');
  const match = firstLines.match(/(20\d{2})[/.\-](\d{1,2})[/.\-](\d{1,2})/);
  if (!match) return '';
  return `${match[1]}-${match[2].padStart(2, '0')}-${match[3].padStart(2, '0')}`;
}

export function buildProducts(rows) {
  const headerIndex = rows.findIndex((row) => {
    const joined = row.map(cleanCell).join('|');
    return /(품명\s*및\s*규격|상품명|제품명|^name$)/i.test(joined);
  });

  if (headerIndex < 0) {
    throw new Error('상품명 열을 찾지 못했습니다.');
  }

  const headers = rows[headerIndex].map(cleanCell);
  const nameColumn = findColumn(headers, [
    /품명\s*및\s*규격/i,
    /상품명/i,
    /제품명/i,
    /^name$/i,
    /품명/i
  ]);
  const barcodeColumn = findColumn(headers, [/바코드/i, /barcode/i, /jan/i, /ean/i, /gtin/i]);
  const locationColumn = findColumn(headers, [/재고\s*위치/i, /보관\s*위치/i, /^위치$/i, /location/i]);

  if (nameColumn < 0) {
    throw new Error('상품명 열을 찾지 못했습니다.');
  }

  const products = [];
  const seen = new Set();

  rows.slice(headerIndex + 1).forEach((row) => {
    const productName = cleanCell(row[nameColumn]);
    if (!productName) return;

    const barcodeInColumn = barcodeColumn >= 0 ? verifiedBarcode(row[barcodeColumn]) : '';
    const barcode = barcodeInColumn || barcodeFromName(productName) || null;
    const location = locationColumn >= 0 ? cleanCell(row[locationColumn]) || null : null;
    const uniqueKey = `${barcode || ''}\u001f${productName}\u001f${location || ''}`;

    if (seen.has(uniqueKey)) return;
    seen.add(uniqueKey);

    products.push({
      barcode,
      product_name: productName,
      location
    });
  });

  return products;
}
