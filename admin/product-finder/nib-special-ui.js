import './fountain-pen-catalog.js';
import '../admin-auth.js';

const originalFetch = window.fetch.bind(window);
window.fetch = async (...args) => {
  const response = await originalFetch(...args);
  const requestUrl = String(args[0] instanceof Request ? args[0].url : args[0] || '');
  if (!requestUrl.includes('/rest/v1/rpc/internal_product_search_public')) return response;

  try {
    const rows = await response.clone().json();
    if (!Array.isArray(rows)) return response;
    const normalized = rows.map((product) => ({
      ...product,
      sale_price: product.consumer_price,
      store_price: null
    }));
    return new Response(JSON.stringify(normalized), {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers
    });
  } catch {
    return response;
  }
};

function cleanPriceFields() {
  const fields = [...document.querySelectorAll('#productFields .detail-field')];
  fields.forEach((field) => {
    const label = field.querySelector('small');
    if (!label) return;
    if (label.textContent === '판매가' || label.textContent === '매장가') {
      field.remove();
    } else if (label.textContent === '소비자가') {
      label.textContent = '매장 판매가';
    }
  });
  document.querySelectorAll('#productPrice span').forEach((element) => element.remove());
}

new MutationObserver(cleanPriceFields).observe(document.documentElement, { childList: true, subtree: true });
document.addEventListener('DOMContentLoaded', cleanPriceFields);

const music = document.querySelector('[data-nib="MUSIC"]');
const zoom = document.querySelector('[data-nib="ZOOM"]');
if (music) music.dataset.nib = 'MS';
if (zoom) zoom.dataset.nib = 'Z';

const definitions = [
  ['UEF','UEF'],['SEF','SEF'],['SF','SF'],['SFM','SFM'],['SM','SM'],['FM','FM'],['NMF','NMF'],['C','Coarse'],
  ['OMNIFLEX','Omniflex'],['FLEX','Flex'],['FUDE','Fude'],['SCRIBE','Scribe'],['TECHO','Techo'],
  ['JOURNALER','Journaler'],['NEEDLEPOINT','Needlepoint'],['STUB','Stub'],['STUB_1.1','1.1'],
  ['STUB_1.4','1.4'],['STUB_1.5','1.5'],['STUB_1.9','1.9'],['NAGINATA_TOGI','Naginata Togi'],
  ['NAGINATA_CONCORD','Naginata Concord'],['CROSS_POINT','Cross Point'],['CROSS_CONCORD','Cross Concord'],
  ['NAGINATA_CALLI','Naginata Calli'],['KING_EAGLE','King Eagle']
];

const style = document.createElement('style');
style.textContent = '.nib-special{margin-top:12px;border:1px solid #dbe3eb;border-radius:14px;background:#fafbfd}.nib-special summary{cursor:pointer;padding:13px 14px;color:#31475f;font-size:10px;font-weight:900}.nib-special .nib-size-grid{padding:0 12px 12px}';
document.head.append(style);

const details = document.createElement('details');
details.className = 'nib-special';
details.innerHTML = '<summary>특수촉·소프트촉·캘리그라피 촉 보기</summary><div class="nib-size-grid"></div>';
const grid = details.querySelector('.nib-size-grid');

definitions.forEach(([id, label]) => {
  if (document.querySelector(`[data-nib="${id}"]`)) return;
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'nib-size-button';
  button.dataset.nib = id;
  button.innerHTML = `${label}<small>특수촉</small>`;
  grid.append(button);
});

document.querySelector('#nibSizeGrid')?.parentElement?.after(details);