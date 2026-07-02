import { cleanCell, parseNumber } from './catalog-utils.js';

const XLSX_MODULE = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/+esm';

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

function decodeCsv(buffer) {
  const utf8 = new TextDecoder('utf-8').decode(buffer);
  const replacementCount = (utf8.match(/�/g) || []).length;
  if (replacementCount < 3) return utf8;

  try {
    return new TextDecoder('euc-kr').decode(buffer);
  } catch {
    return utf8;
  }
}

export async function readCatalogRows(file) {
  const fileName = String(file?.name || '').toLowerCase();
  const buffer = await file.arrayBuffer();

  if (fileName.endsWith('.csv') || fileName.endsWith('.txt')) {
    return parseCsv(decodeCsv(buffer));
  }

  if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
    const module = await import(XLSX_MODULE);
    const XLSX = module.default || module;
    const workbook = XLSX.read(buffer, { type: 'array', cellDates: false });
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) throw new Error('엑셀 파일에서 첫 번째 시트를 찾지 못했습니다.');
    return XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
      header: 1,
      raw: false,
      defval: ''
    });
  }

  throw new Error('CSV, XLSX 또는 XLS 파일을 선택해 주세요.');
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

function cleanCode(value) {
  return cleanCell(value).slice(0, 100);
}

export function sourceDateFromRows(rows) {
  const firstLines = rows.slice(0, 6).flat().map(cleanCell).join(' ');
  const match = firstLines.match(/(20\d{2})[/\.\-](\d{1,2})[/\.\-](\d{1,2})/);
  if (!match) return '';
  return `${match[1]}-${match[2].padStart(2, '0')}-${match[3].padStart(2, '0')}`;
}

export function buildProducts(rows) {
  const headerIndex = rows.findIndex((row) => {
    const joined = row.map(cleanCell).join('|');
    return /(품목\s*코드|상품\s*코드|품명\s*및\s*규격|상품명|제품명)/i.test(joined);
  });

  if (headerIndex < 0) {
    throw new Error('품목코드와 상품명 열을 찾지 못했습니다.');
  }

  const headers = rows[headerIndex].map(cleanCell);
  const itemCodeColumn = findColumn(headers, [
    /품목\s*코드/i,
    /상품\s*코드/i,
    /^코드$/i,
    /item\s*code/i,
    /^sku$/i
  ]);
  const nameColumn = findColumn(headers, [
    /품명\s*및\s*규격/i,
    /상품명/i,
    /제품명/i,
    /^name$/i,
    /품명/i
  ]);
  const groupColumn = findColumn(headers, [/품목\s*그룹/i, /상품\s*그룹/i, /브랜드/i]);
  const barcodeColumn = findColumn(headers, [/바코드/i, /barcode/i, /jan/i, /ean/i, /gtin/i]);
  const consumerPriceColumn = findColumn(headers, [/소비자가/i, /정상가/i, /권장.*가격/i, /retail.*price/i]);
  const salePriceColumn = findColumn(headers, [/판매가/i, /매출.*단가/i, /sale.*price/i]);
  const stockColumn = findColumn(headers, [/재고\s*수량/i, /^재고$/i, /현재고/i, /stock/i]);
  const locationColumn = findColumn(headers, [/재고\s*위치/i, /보관\s*위치/i, /^위치$/i, /location/i]);

  if (nameColumn < 0 || (itemCodeColumn < 0 && barcodeColumn < 0)) {
    throw new Error('품목코드 또는 바코드와 상품명 열을 찾지 못했습니다.');
  }

  const products = [];

  rows.slice(headerIndex + 1).forEach((row, offset) => {
    const productName = cleanCell(row[nameColumn]);
    const itemCode = itemCodeColumn >= 0 ? cleanCode(row[itemCodeColumn]) : '';
    const barcodeInColumn = barcodeColumn >= 0 ? cleanCode(row[barcodeColumn]) : '';
    const barcode = barcodeInColumn || barcodeFromName(productName) || null;
    const consumerPriceRaw = consumerPriceColumn >= 0 ? cleanCell(row[consumerPriceColumn]) : '';
    const salePriceRaw = salePriceColumn >= 0 ? cleanCell(row[salePriceColumn]) : '';
    const stockRaw = stockColumn >= 0 ? cleanCell(row[stockColumn]) : '';
    const location = locationColumn >= 0 ? cleanCell(row[locationColumn]) || null : null;
    const group = groupColumn >= 0 ? cleanCell(row[groupColumn]) : '';

    if (!productName || (!itemCode && !barcode)) return;

    const hasProductData = Boolean(
      group || consumerPriceRaw || salePriceRaw || stockRaw || location || barcodeInColumn
    );
    if (!hasProductData) return;

    products.push({
      source_row: headerIndex + offset + 2,
      item_code: itemCode || null,
      barcode,
      product_name: productName,
      consumer_price: parseNumber(consumerPriceRaw),
      sale_price: parseNumber(salePriceRaw),
      stock_qty: parseNumber(stockRaw),
      location
    });
  });

  if (!products.length) {
    throw new Error('등록할 상품을 찾지 못했습니다. 파일 형식을 확인해 주세요.');
  }

  return products;
}
