import { getLanguage } from './i18n-v3.js';

const COPY = {
  ko: {
    kicker: 'MOBILE CUSTOMIZER',
    title: '나만의 펜 만들기',
    description: '색상을 고르면 3D 미리보기에 바로 반영됩니다.',
    navigation: '주요 메뉴',
    tabs: [
      ['✦', '만들기', '.customizer'],
      ['✓', '조합', '.result-section'],
      ['i', '안내', '.booklet-guide'],
      ['⌖', '매장', '.visit-section'],
    ],
  },
  en: {
    kicker: 'MOBILE CUSTOMIZER',
    title: 'Build your pen',
    description: 'Your color choices appear in the 3D preview immediately.',
    navigation: 'Primary navigation',
    tabs: [
      ['✦', 'Build', '.customizer'],
      ['✓', 'Result', '.result-section'],
      ['i', 'Guide', '.booklet-guide'],
      ['⌖', 'Store', '.visit-section'],
    ],
  },
  ja: {
    kicker: 'MOBILE CUSTOMIZER',
    title: '自分だけの万年筆を作る',
    description: '選んだ色はすぐに3Dプレビューへ反映されます。',
    navigation: 'メインメニュー',
    tabs: [
      ['✦', '作る', '.customizer'],
      ['✓', '組合せ', '.result-section'],
      ['i', '案内', '.booklet-guide'],
      ['⌖', '店舗', '.visit-section'],
    ],
  },
  'zh-Hans': {
    kicker: 'MOBILE CUSTOMIZER',
    title: '制作专属钢笔',
    description: '选择颜色后会立即显示在3D预览中。',
    navigation: '主要菜单',
    tabs: [
      ['✦', '制作', '.customizer'],
      ['✓', '组合', '.result-section'],
      ['i', '指南', '.booklet-guide'],
      ['⌖', '门店', '.visit-section'],
    ],
  },
  'zh-Hant': {
    kicker: 'MOBILE CUSTOMIZER',
    title: '製作專屬鋼筆',
    description: '選擇顏色後會立即顯示在3D預覽中。',
    navigation: '主要選單',
    tabs: [
      ['✦', '製作', '.customizer'],
      ['✓', '組合', '.result-section'],
      ['i', '指南', '.booklet-guide'],
      ['⌖', '門市', '.visit-section'],
    ],
  },
};

const mobileQuery = matchMedia('(max-width: 899px)');
let observer;

function text() {
  return COPY[getLanguage()] ?? COPY.ko;
}

function ensureHeading() {
  const main = document.querySelector('main');
  const customizer = document.querySelector('.customizer');
  if (!main || !customizer) return;

  let heading = document.querySelector('.mobile-main-heading');
  if (!heading) {
    heading = document.createElement('div');
    heading.className = 'mobile-main-heading';
    main.insertBefore(heading, customizer);
  }

  const copy = text();
  heading.innerHTML = `
    <div><small>${copy.kicker}</small><h2>${copy.title}</h2></div>
    <p>${copy.description}</p>
  `;
}

function ensureNavigation() {
  let navigation = document.querySelector('.mobile-bottom-nav');
  if (!navigation) {
    navigation = document.createElement('nav');
    navigation.className = 'mobile-bottom-nav';
    document.body.append(navigation);
  }

  const copy = text();
  navigation.setAttribute('aria-label', copy.navigation);
  navigation.innerHTML = copy.tabs.map(([icon, label, selector], index) => `
    <button type="button" data-mobile-target="${selector}" class="${index === 0 ? 'is-active' : ''}" ${index === 0 ? 'aria-current="page"' : ''}>
      <span aria-hidden="true">${icon}</span><span>${label}</span>
    </button>
  `).join('');

  navigation.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', () => {
      const target = document.querySelector(button.dataset.mobileTarget);
      if (!target) return;
      target.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
      setActive(button.dataset.mobileTarget);
    });
  });
}

function setActive(selector) {
  document.querySelectorAll('.mobile-bottom-nav button').forEach((button) => {
    const active = button.dataset.mobileTarget === selector;
    button.classList.toggle('is-active', active);
    if (active) button.setAttribute('aria-current', 'page');
    else button.removeAttribute('aria-current');
  });
}

function observeSections() {
  observer?.disconnect();
  if (!mobileQuery.matches || !('IntersectionObserver' in window)) return;

  const sections = ['.customizer', '.result-section', '.booklet-guide', '.visit-section']
    .map((selector) => ({ selector, node: document.querySelector(selector) }))
    .filter((item) => item.node);

  observer = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    const item = sections.find(({ node }) => node === visible.target);
    if (item) setActive(item.selector);
  }, { rootMargin: '-20% 0px -58% 0px', threshold: [0.05, 0.2, 0.45] });

  sections.forEach(({ node }) => observer.observe(node));
}

function syncMode() {
  document.body.classList.toggle('mobile-main-app', mobileQuery.matches);
  if (mobileQuery.matches) {
    document.querySelector('.language-menu')?.removeAttribute('open');
  }
  observeSections();
}

function render() {
  ensureHeading();
  ensureNavigation();
  syncMode();
}

function init() {
  const stylesheet = new URL('./mobile-app-v15.css', import.meta.url).href;
  if (!document.querySelector(`link[href="${stylesheet}"]`)) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = stylesheet;
    document.head.append(link);
  }

  render();
  document.querySelectorAll('[data-language]').forEach((button) => {
    button.addEventListener('click', () => setTimeout(render, 130));
  });
  mobileQuery.addEventListener?.('change', syncMode);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(init, 80), { once: true });
else setTimeout(init, 80);
