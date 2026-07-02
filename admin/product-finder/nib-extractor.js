const FOUNTAIN_PEN_PATTERN = /만년필|(?<![A-Za-z])FP(?![A-Za-z])|fountain\s*pen/i;
const ACCESSORY_PATTERN = /(A\/S|세척\s*(키트|액|제)|펜\s*솝|만년필\s*파우치|마스킹\s*테이프.*만년필|루즈\s*시트|와시\s*노트|종이\s*컬렉션|서랍장|카웨코\s*클립|만년필\s*잉크\s*세트|헌터스\s*FP[^\n]*잉크\s*세트|만년필용|만년필\s*제작\s*샘플)/i;
const MULTI_NIB_PATTERN = /(\[SET\]|(?:^|\s)SET(?:$|\s)|\d+\s*닙|트리오\s*이탤릭)/i;

const NAMED_NIBS = [
  ['NAGINATA_CONCORD', /나기나타\s*(콘코드|콩코드)|naginata\s*concord/i],
  ['CROSS_CONCORD', /크로스\s*(콘코드|콩코드)|cross\s*concord/i],
  ['CROSS_POINT', /크로스\s*포인트|cross\s*point/i],
  ['NAGINATA_CALLI', /나기나타\s*(캘리|칼리|calli)/i],
  ['NAGINATA_TOGI', /나기나타\s*토기|naginata\s*togi/i],
  ['KING_EAGLE', /킹\s*이글|king\s*eagle/i],
  ['OMNIFLEX', /옴니\s*플렉스|omniflex/i],
  ['NEEDLEPOINT', /니들\s*포인트|needle\s*point/i],
  ['JOURNALER', /저널러|journaler/i],
  ['SCRIBE', /스크라이브|scribe/i],
  ['TECHO', /테코|techo/i],
  ['FUDE', /후데|fude/i],
  ['MS', /뮤직|music/i],
  ['FLEX', /(?<!omni)\s*flex\b|플렉스/i]
];

const CODE_NIBS = [
  ['UEF', 'UEF'], ['SEF', 'SEF'], ['EFF', 'EFF'], ['SFM', 'SFM'],
  ['NMF', 'NMF'], ['MF', 'MF'], ['FM', 'FM'], ['FF', 'FF'],
  ['SF', 'SF'], ['SM', 'SM'], ['SB', 'SB'], ['BB', 'BB'],
  ['EF', 'EF'], ['MS', 'MS'], ['MUSIC', 'MS'], ['ZOOM', 'Z'],
  ['Z', 'Z'], ['COARSE', 'C'], ['C', 'C'], ['F', 'F'], ['M', 'M'], ['B', 'B']
];

function cleanCell(value) {
  return String(value ?? '').replace(/\t/g, '').trim();
}

function findColumn(headers, patterns) {
  return headers.findIndex((header) => patterns.some((pattern) => pattern.test(header)));
}

function normalizedName(name) {
  return name
    .replace(/\[[^\]]*\]/g, ' ')
    .replace(/\{[^}]*\}/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function nibSearchWindow(name) {
  const clean = normalizedName(name);
  const marker = clean.search(FOUNTAIN_PEN_PATTERN);
  return marker >= 0 ? clean.slice(Math.max(0, marker - 40)) : clean;
}

function add(result, value) {
  if (value && !result.includes(value)) result.push(value);
}

export function isFountainPenName(productName) {
  const name = cleanCell(productName);
  return Boolean(name && FOUNTAIN_PEN_PATTERN.test(name));
}

export function catalogRowKind(productName) {
  const name = cleanCell(productName);
  if (!isFountainPenName(name) || /만년필\s*제작\s*샘플/i.test(name)) return 'excluded';
  if (ACCESSORY_PATTERN.test(name) || name === '만년필') return 'excluded';
  if (MULTI_NIB_PATTERN.test(name) || /FP\/BP\/MP/i.test(name)) return 'multi';
  return 'pen';
}

export function extractNibSizes(productName) {
  const name = cleanCell(productName);
  if (catalogRowKind(name) !== 'pen') return [];

  const fullName = normalizedName(name);
  const windowText = nibSearchWindow(name);
  const result = [];

  NAMED_NIBS.forEach(([id, pattern]) => {
    if (pattern.test(fullName)) add(result, id);
  });

  let numericStubFound = false;
  for (const match of windowText.matchAll(/(?:^|[\s(/,+-])(0\.6|0\.85|0\.9|1\.0|1\.1|1\.3|1\.35|1\.4|1\.5|1\.6|1\.9|2\.0|2\.2|2\.3|2\.5|2\.7|2\.8|3\.2)(?:\s*mm)?(?=$|[\s()\],/+~★-])/gi)) {
    add(result, `STUB_${match[1]}`);
    numericStubFound = true;
  }

  if (!numericStubFound && (/\b(?:stub|italic)\b/i.test(windowText) || /이탤릭/i.test(windowText))) {
    add(result, 'STUB');
  }

  for (const [token, id] of CODE_NIBS) {
    const pattern = new RegExp(`(?:^|[^A-Za-z0-9])${token}(?:촉|닙|nib)?(?=$|[^A-Za-z0-9])`, 'i');
    if (pattern.test(windowText)) add(result, id);
  }

  return result;
}

export function classifyNibCatalogRows(rows) {
  const headerIndex = rows.findIndex((row) => {
    const joined = row.map(cleanCell).join('|');
    return /(품목\s*코드|상품\s*코드|품명\s*및\s*규격|상품명|제품명)/i.test(joined);
  });
  if (headerIndex < 0) throw new Error('상품명과 품목코드가 있는 헤더를 찾지 못했습니다.');

  const headers = rows[headerIndex].map(cleanCell);
  const itemCodeColumn = findColumn(headers, [/품목\s*코드/i, /상품\s*코드/i, /^코드$/i, /item\s*code/i, /^sku$/i]);
  const nameColumn = findColumn(headers, [/품명\s*및\s*규격/i, /상품명/i, /제품명/i, /^name$/i, /품명/i]);
  const locationColumn = findColumn(headers, [/재고\s*위치/i, /보관\s*위치/i, /^위치$/i, /location/i]);
  if (itemCodeColumn < 0 || nameColumn < 0) throw new Error('품목코드와 상품명 열을 찾지 못했습니다.');

  const fountainPens = [];
  const classified = [];
  const unresolved = [];
  const excluded = [];
  const multiNibSets = [];

  rows.slice(headerIndex + 1).forEach((row, offset) => {
    const productName = cleanCell(row[nameColumn]);
    if (!isFountainPenName(productName) || /만년필\s*제작\s*샘플/i.test(productName)) return;

    const product = {
      source_row: headerIndex + offset + 2,
      item_code: cleanCell(row[itemCodeColumn]) || null,
      product_name: productName,
      location: locationColumn >= 0 ? cleanCell(row[locationColumn]) || null : null
    };
    fountainPens.push(product);

    const kind = catalogRowKind(productName);
    if (kind === 'excluded') {
      excluded.push(product);
      return;
    }
    if (kind === 'multi') {
      multiNibSets.push(product);
      return;
    }

    const nibSizes = extractNibSizes(productName);
    if (nibSizes.length) classified.push({ ...product, nib_sizes: nibSizes });
    else unresolved.push(product);
  });

  return { fountainPens, classified, unresolved, excluded, multiNibSets };
}
