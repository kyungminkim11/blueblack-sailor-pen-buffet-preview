const MALL_SEARCH_BASE = 'https://blueblack.co.kr/product/search.html?keyword=';

const nibButtons = [...document.querySelectorAll('[data-nib]')];
const brandButtons = [...document.querySelectorAll('[data-brand]')];
const keywordInput = document.querySelector('#nibKeyword');
const searchButton = document.querySelector('#nibSearchButton');
const resultCard = document.querySelector('#resultCard');
const resultHeading = document.querySelector('#resultHeading');
const productIdentity = document.querySelector('#productIdentity');
const recognizedQuery = document.querySelector('#recognizedQuery');
const recognizedRaw = document.querySelector('#recognizedRaw');
const mallLink = document.querySelector('#mallLink');
const webLookupLink = document.querySelector('#webLookupLink');
const resultNote = document.querySelector('#resultNote');
const toast = document.querySelector('#finderToast');

let selectedNib = '';

function showNibToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showNibToast.timer);
  showNibToast.timer = setTimeout(() => toast.classList.remove('show'), 2800);
}

function mallUrl(query) {
  return `${MALL_SEARCH_BASE}${encodeURIComponent(String(query || '').trim())}`;
}

function setSelectedNib(value) {
  selectedNib = value;
  nibButtons.forEach((button) => {
    const active = button.dataset.nib === value;
    button.classList.toggle('active', active);
    button.setAttribute('aria-checked', String(active));
  });
}

function buildNibQuery() {
  const keyword = keywordInput?.value.trim() || '';
  return [keyword, selectedNib].filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
}

function submitNibSearch() {
  if (!selectedNib) {
    showNibToast('먼저 찾을 펜촉 규격을 선택해 주세요.');
    nibButtons[0]?.focus();
    return;
  }

  const query = buildNibQuery();
  if (!query) return;

  if (productIdentity) productIdentity.hidden = true;
  if (resultHeading) resultHeading.textContent = `${selectedNib}촉 상품 검색 준비 완료`;
  if (recognizedQuery) recognizedQuery.value = query;
  if (recognizedRaw) {
    recognizedRaw.textContent = `선택 촉: ${selectedNib}\n추가 검색어: ${keywordInput?.value.trim() || '전체 브랜드'}`;
    recognizedRaw.hidden = false;
  }
  if (webLookupLink) webLookupLink.hidden = true;
  if (mallLink) {
    mallLink.href = mallUrl(query);
    mallLink.setAttribute('aria-disabled', 'false');
  }
  if (resultNote) {
    resultNote.textContent = `${selectedNib} 촉 표기가 상품명에 포함된 상품을 찾습니다. 검색 결과에서 실제 촉 옵션과 판매 상태를 최종 확인해 주세요.`;
  }
  if (resultCard) {
    resultCard.hidden = false;
    resultCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  showNibToast(`${selectedNib}촉 검색어를 만들었습니다.`);
}

nibButtons.forEach((button) => {
  button.addEventListener('click', () => {
    setSelectedNib(button.dataset.nib || '');
    if (window.matchMedia('(max-width: 600px)').matches && keywordInput && !keywordInput.value) {
      keywordInput.focus({ preventScroll: true });
    }
  });
});

brandButtons.forEach((button) => {
  button.addEventListener('click', () => {
    if (!keywordInput) return;
    keywordInput.value = button.dataset.brand || '';
    keywordInput.focus();
  });
});

searchButton?.addEventListener('click', submitNibSearch);
keywordInput?.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') submitNibSearch();
});
