import './nib-special-ui.js';
import './nib-import-ui.js';

const SUPABASE_URL = 'https://jnciddblcndmthmmvqrz.supabase.co';
const SUPABASE_KEY = 'sb_publishable_UUzSE7O9wqI0WN9cKG9OAQ_VleRkL4I';
const SESSION_KEY = 'blueblack-catalog-session';

const nibButtons = [...document.querySelectorAll('[data-nib]')];
const brandButtons = [...document.querySelectorAll('[data-brand]')];
const keywordInput = document.querySelector('#nibKeyword');
const searchButton = document.querySelector('#nibSearchButton');
const nibPanel = document.querySelector('[data-panel="nib"]');
const toast = document.querySelector('#finderToast');
const selectedNibs = new Set();
let searchTimer = 0;

const labelMap = {
  UEF:'UEF',SEF:'SEF',EFF:'EFF',EF:'EF',FF:'FF',F:'F',SF:'SF',SFM:'SFM',MF:'MF',FM:'FM',NMF:'NMF',M:'M',SM:'SM',SB:'SB',B:'B',BB:'BB',C:'Coarse',
  MS:'Music',Z:'Zoom',OMNIFLEX:'Omniflex',FLEX:'Flex',FUDE:'Fude',SCRIBE:'Scribe',TECHO:'Techo',JOURNALER:'Journaler',NEEDLEPOINT:'Needlepoint',
  NAGINATA_TOGI:'Naginata Togi',NAGINATA_CONCORD:'Naginata Concord',CROSS_POINT:'Cross Point',CROSS_CONCORD:'Cross Concord',NAGINATA_CALLI:'Naginata Calli',KING_EAGLE:'King Eagle',STUB:'Stub',
  'STUB_0.6':'0.6','STUB_0.85':'0.85','STUB_0.9':'0.9','STUB_1.0':'1.0','STUB_1.1':'1.1','STUB_1.3':'1.3','STUB_1.35':'1.35','STUB_1.4':'1.4','STUB_1.5':'1.5','STUB_1.6':'1.6','STUB_1.9':'1.9','STUB_2.0':'2.0','STUB_2.2':'2.2','STUB_2.3':'2.3','STUB_2.5':'2.5','STUB_2.7':'2.7','STUB_2.8':'2.8','STUB_3.2':'3.2'
};

const style = document.createElement('style');
style.textContent = `.nib-result-area{margin-top:18px;border-top:1px solid #e0e6ec;padding-top:18px}.nib-result-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:11px}.nib-result-head strong{color:#10233f;font-size:15px}.nib-result-head small{color:#718093;font-size:9px}.nib-result-list{display:grid;gap:9px}.nib-product-card{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:12px;padding:14px;border:1px solid #d9e1e8;border-radius:14px;background:#fff}.nib-product-card h3{margin:0;color:#10233f;font-size:13px;line-height:1.45}.nib-product-meta{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}.nib-product-meta span{padding:4px 7px;border-radius:999px;background:#f1f4f7;color:#5f7083;font-size:8px;font-weight:850}.nib-product-sizes{display:flex;align-content:flex-start;justify-content:flex-end;gap:5px;flex-wrap:wrap;max-width:180px}.nib-product-sizes b{display:grid;place-items:center;min-width:34px;height:30px;padding:0 7px;border-radius:9px;background:#102b4c;color:#fff;font-size:9px}.nib-result-empty{padding:24px 15px;border:1px dashed #cbd6e0;border-radius:14px;text-align:center;color:#65768a;font-size:10px;line-height:1.7}.nib-size-button.active::before{content:'✓';margin-right:5px}.nib-access-note{margin-bottom:10px;padding:10px 12px;border-radius:10px;background:#fff8eb;color:#795d35;font-size:9px;line-height:1.6}@media(max-width:600px){.nib-product-card{grid-template-columns:1fr}.nib-product-sizes{justify-content:flex-start;max-width:none}}`;
document.head.append(style);

const resultArea = document.createElement('div');
resultArea.className = 'nib-result-area';
resultArea.innerHTML = '<div class="nib-result-head"><strong>펜촉 상품 목록</strong><small id="nibResultCount">촉을 선택해 주세요.</small></div><div id="nibAccessNote" class="nib-access-note" hidden></div><div id="nibResultList" class="nib-result-list"><div class="nib-result-empty">한 개 이상의 펜촉을 선택하면 실제 등록 상품이 여기에 표시됩니다.<br>EF와 F처럼 여러 촉을 동시에 선택할 수 있습니다.</div></div>';
nibPanel?.querySelector('.nib-finder')?.append(resultArea);

const resultList = resultArea.querySelector('#nibResultList');
const resultCount = resultArea.querySelector('#nibResultCount');
const accessNote = resultArea.querySelector('#nibAccessNote');

nibButtons.forEach((button) => {
  button.setAttribute('role', 'checkbox');
  button.setAttribute('aria-checked', 'false');
});

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 2800);
}

function getSession() {
  return sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY) || '';
}

async function fetchProducts() {
  if (!selectedNibs.size) return [];
  const session = getSession();
  if (!session) throw new Error('관리자 세션이 만료되었습니다. 관리자 페이지에서 다시 로그인해 주세요.');

  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/internal_catalog_session_nib_search`, {
    method: 'POST',
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ p_session: session, p_nib_sizes: [...selectedNibs], p_query: keywordInput?.value.trim() || '', p_limit: 2500 })
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    if (response.status === 401 || response.status === 403 || /authorized|42501|permission|session/i.test(String(data?.message || data?.error || ''))) {
      sessionStorage.removeItem(SESSION_KEY);
      throw new Error('관리자 세션이 만료되었습니다. 관리자 페이지에서 다시 로그인해 주세요.');
    }
    throw new Error(data?.message || '펜촉 상품을 불러오지 못했습니다.');
  }
  return Array.isArray(data) ? data : [];
}

function renderProducts(products) {
  resultList.replaceChildren();
  const selectedText = [...selectedNibs].map((value) => labelMap[value] || value).join(' · ');
  resultCount.textContent = `${selectedText} · ${products.length.toLocaleString('ko-KR')}개 표시`;
  accessNote.hidden = true;

  if (!products.length) {
    const empty = document.createElement('div');
    empty.className = 'nib-result-empty';
    empty.textContent = '선택한 촉과 검색어에 맞는 등록 상품이 없습니다.';
    resultList.append(empty);
    return;
  }

  const fragment = document.createDocumentFragment();
  products.forEach((product) => {
    const card = document.createElement('article');
    card.className = 'nib-product-card';
    const copy = document.createElement('div');
    const title = document.createElement('h3');
    const meta = document.createElement('div');
    const sizes = document.createElement('div');
    title.textContent = product.product_name;
    meta.className = 'nib-product-meta';
    sizes.className = 'nib-product-sizes';
    if (product.item_code) {
      const code = document.createElement('span');
      code.textContent = `품목코드 ${product.item_code}`;
      meta.append(code);
    }
    const location = document.createElement('span');
    location.textContent = product.location ? `위치 ${product.location}` : '위치 미등록';
    meta.append(location);
    (product.nib_sizes || []).forEach((size) => {
      const badge = document.createElement('b');
      badge.textContent = labelMap[size] || size;
      sizes.append(badge);
    });
    copy.append(title, meta);
    card.append(copy, sizes);
    fragment.append(card);
  });
  resultList.append(fragment);
}

async function searchProducts() {
  if (!selectedNibs.size) {
    resultCount.textContent = '촉을 선택해 주세요.';
    resultList.innerHTML = '<div class="nib-result-empty">한 개 이상의 펜촉을 선택해 주세요.</div>';
    return;
  }
  searchButton.disabled = true;
  resultCount.textContent = '상품을 불러오는 중…';
  resultList.innerHTML = '<div class="nib-result-empty">비공개 상품 DB에서 실제 상품을 조회하고 있습니다.</div>';
  try {
    renderProducts(await fetchProducts());
  } catch (error) {
    resultCount.textContent = '조회 실패';
    accessNote.hidden = false;
    accessNote.textContent = error.message;
    resultList.innerHTML = '<div class="nib-result-empty">관리자 로그인 상태와 상품 DB 등록 상태를 확인해 주세요.</div>';
    showToast(error.message);
  } finally {
    searchButton.disabled = false;
  }
}

function scheduleSearch() {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(searchProducts, 220);
}

nibButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const value = button.dataset.nib || '';
    if (selectedNibs.has(value)) selectedNibs.delete(value);
    else selectedNibs.add(value);
    const active = selectedNibs.has(value);
    button.classList.toggle('active', active);
    button.setAttribute('aria-checked', String(active));
    scheduleSearch();
  });
});

brandButtons.forEach((button) => {
  button.addEventListener('click', () => {
    if (!keywordInput) return;
    keywordInput.value = button.dataset.brand || '';
    scheduleSearch();
  });
});

searchButton?.addEventListener('click', searchProducts);
keywordInput?.addEventListener('input', scheduleSearch);
keywordInput?.addEventListener('keydown', (event) => { if (event.key === 'Enter') searchProducts(); });
document.addEventListener('nib-database-updated', () => { if (selectedNibs.size) searchProducts(); });