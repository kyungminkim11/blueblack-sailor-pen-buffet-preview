import { getLanguage } from './i18n.js';
import './combination-actions.js';

const STORE = {
  addressKo: '서울특별시 종로구 사직로 109 (내자동)',
  addressEn: '109 Sajik-ro, Jongno-gu, Seoul (Naeja-dong)',
  addressJa: 'ソウル特別市 鍾路区 社稷路109（内資洞）',
  phone: '02-765-8868',
  website: 'https://blueblack.co.kr/',
  instagram: 'https://www.instagram.com/blueblack_korea/',
  naverMap: 'https://map.naver.com/p/search/%EB%B8%94%EB%A3%A8%EB%B8%94%EB%9E%99%20%ED%8E%9C%EC%83%B5',
  kakaoMap: 'https://map.kakao.com/link/search/%EB%B8%94%EB%A3%A8%EB%B8%94%EB%9E%99%20%ED%8E%9C%EC%83%B5',
};

const COPY = {
  ko: {
    kicker: 'VISIT BLUEBLACK',
    title: '블루블랙 펜샵에서 실물로 확인해보세요',
    subtitle: '마음에 드는 조합을 저장해 오시면 직원이 실물 파츠 확인과 조립 상담을 도와드립니다.',
    addressLabel: '매장 주소',
    hoursLabel: '영업시간',
    weekday: '월–금 10:00–18:00',
    saturday: '토요일 12:00–18:00',
    closed: '일요일·공휴일 휴무',
    contactLabel: '방문 전 문의',
    phoneHint: '특정 색상을 찾으신다면 방문 전 재고 문의를 권장드립니다.',
    naver: '네이버지도에서 보기',
    kakao: '카카오맵에서 보기',
    call: '매장에 전화하기',
    copy: '주소 복사',
    instagram: '인스타그램 보기',
    website: '공식 홈페이지',
    note: '영업시간·휴무일·재고는 변경될 수 있습니다. 방문 전 공식 홈페이지 또는 인스타그램에서 최신 안내를 확인해 주세요.',
    copied: '매장 주소를 복사했습니다.',
    copyFailed: '주소를 복사하지 못했습니다. 표시된 주소를 길게 눌러 복사해 주세요.',
  },
  en: {
    kicker: 'VISIT BLUEBLACK',
    title: 'See the actual parts at BlueBlack Pen Shop',
    subtitle: 'Save your preferred combination and our staff will help you confirm the physical parts and complete your in-store consultation.',
    addressLabel: 'Store address',
    hoursLabel: 'Opening hours',
    weekday: 'Mon–Fri 10:00–18:00',
    saturday: 'Saturday 12:00–18:00',
    closed: 'Closed Sundays and public holidays',
    contactLabel: 'Contact before visiting',
    phoneHint: 'We recommend checking stock before visiting if you are looking for a specific color.',
    naver: 'View on Naver Map',
    kakao: 'View on Kakao Map',
    call: 'Call the store',
    copy: 'Copy address',
    instagram: 'View Instagram',
    website: 'Official website',
    note: 'Opening hours, closing days and stock may change. Please check the official website or Instagram before visiting.',
    copied: 'Store address copied.',
    copyFailed: 'The address could not be copied. Please press and hold the displayed address to copy it.',
  },
  ja: {
    kicker: 'VISIT BLUEBLACK',
    title: 'BlueBlack Pen Shopで実物をご確認ください',
    subtitle: 'お好みの組み合わせを保存してご来店いただくと、スタッフが実物パーツの確認と組み立てのご案内をいたします。',
    addressLabel: '店舗住所',
    hoursLabel: '営業時間',
    weekday: '月〜金 10:00–18:00',
    saturday: '土曜日 12:00–18:00',
    closed: '日曜・祝日休業',
    contactLabel: 'ご来店前のお問い合わせ',
    phoneHint: '特定の色をご希望の場合は、ご来店前の在庫確認をおすすめします。',
    naver: 'NAVERマップで見る',
    kakao: 'Kakaoマップで見る',
    call: '店舗に電話する',
    copy: '住所をコピー',
    instagram: 'Instagramを見る',
    website: '公式サイト',
    note: '営業時間・休業日・在庫は変更される場合があります。ご来店前に公式サイトまたはInstagramで最新情報をご確認ください。',
    copied: '店舗住所をコピーしました。',
    copyFailed: '住所をコピーできませんでした。表示された住所を長押ししてコピーしてください。',
  },
};

function text() {
  return COPY[getLanguage()] ?? COPY.ko;
}

function addressForLanguage() {
  if (getLanguage() === 'en') return STORE.addressEn;
  if (getLanguage() === 'ja') return STORE.addressJa;
  return STORE.addressKo;
}

function button({ href, label, className = '', external = true }) {
  const attributes = external ? 'target="_blank" rel="noopener noreferrer"' : '';
  return `<a class="store-info-button ${className}" href="${href}" ${attributes}>${label}</a>`;
}

function markup() {
  const copy = text();
  const address = addressForLanguage();

  return `
    <div class="store-info-head">
      <div>
        <p class="store-info-kicker">${copy.kicker}</p>
        <h2>${copy.title}</h2>
      </div>
      <p class="store-info-subtitle">${copy.subtitle}</p>
    </div>

    <div class="store-info-grid">
      <article class="store-info-card">
        <small>${copy.addressLabel}</small>
        <strong class="store-address-text">${address}</strong>
      </article>
      <article class="store-info-card">
        <small>${copy.hoursLabel}</small>
        <strong class="store-info-hours">
          <span>${copy.weekday}</span>
          <span>${copy.saturday}</span>
          <span>${copy.closed}</span>
        </strong>
      </article>
      <article class="store-info-card">
        <small>${copy.contactLabel}</small>
        <strong>${STORE.phone}</strong>
        <span>${copy.phoneHint}</span>
      </article>
    </div>

    <div class="store-info-actions">
      ${button({ href: STORE.naverMap, label: copy.naver, className: 'primary' })}
      ${button({ href: STORE.kakaoMap, label: copy.kakao })}
      ${button({ href: `tel:${STORE.phone.replaceAll('-', '')}`, label: copy.call, external: false })}
      <button type="button" class="store-info-button" data-copy-store-address>${copy.copy}</button>
      ${button({ href: STORE.instagram, label: copy.instagram })}
      ${button({ href: STORE.website, label: copy.website })}
    </div>

    <p class="store-info-note">${copy.note}</p>
    <p class="store-info-toast" aria-live="polite"></p>
  `;
}

async function copyAddress(section) {
  const copy = text();
  const toast = section.querySelector('.store-info-toast');
  try {
    await navigator.clipboard.writeText(STORE.addressKo);
    toast.textContent = copy.copied;
  } catch {
    toast.textContent = copy.copyFailed;
  }
  window.setTimeout(() => {
    if (toast.textContent === copy.copied || toast.textContent === copy.copyFailed) toast.textContent = '';
  }, 2600);
}

function renderStoreInfo() {
  const displayNotice = document.querySelector('.display-notice');
  if (!displayNotice) return;

  let section = document.querySelector('.store-info-section');
  if (!section) {
    section = document.createElement('section');
    section.className = 'store-info-section';
    section.setAttribute('aria-label', 'BlueBlack Pen Shop');
    displayNotice.insertAdjacentElement('beforebegin', section);
  }

  section.innerHTML = markup();
  section.querySelector('[data-copy-store-address]')?.addEventListener('click', () => copyAddress(section));
}

renderStoreInfo();
window.addEventListener('languagechange', renderStoreInfo);
