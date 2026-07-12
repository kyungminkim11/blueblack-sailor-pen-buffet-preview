import { tourLanguage } from './store-tour-i18n.js';

const COPY = {
  ko: {
    prev: '이전 위치', next: '다음 위치', point: '현재 지점', fullscreen: '전체 화면', exitFullscreen: '전체 화면 종료',
    share: '현재 위치 공유', shared: '현재 위치 링크를 복사했습니다.', plan: '미니맵', hidePlan: '미니맵 접기',
    gesture: '사진을 드래그해 둘러보고, 화살표를 누르면 다음 위치로 이동합니다.', landscape: '휴대폰을 가로로 돌리면 더 넓게 볼 수 있어요.',
    nav: { tour: '360 투어', floor: '층별·브랜드 지도', visit: '방문 정보' },
  },
  en: {
    prev: 'Previous', next: 'Next', point: 'View point', fullscreen: 'Full screen', exitFullscreen: 'Exit full screen',
    share: 'Share this view', shared: 'Link copied.', plan: 'Mini map', hidePlan: 'Hide mini map',
    gesture: 'Drag to look around. Use the arrows to move to another point.', landscape: 'Rotate your phone for a wider view.',
    nav: { tour: '360 tour', floor: 'Floor & brand map', visit: 'Visit info' },
  },
  ja: {
    prev: '前の地点', next: '次の地点', point: '現在地', fullscreen: '全画面', exitFullscreen: '全画面を終了',
    share: '現在地を共有', shared: 'リンクをコピーしました。', plan: 'ミニマップ', hidePlan: 'ミニマップを閉じる',
    gesture: 'ドラッグして見渡し、矢印で次の地点へ移動できます。', landscape: '横向きにすると、より広く表示できます。',
    nav: { tour: '360°ツアー', floor: 'フロア・ブランド案内', visit: '来店情報' },
  },
  'zh-Hans': {
    prev: '上一位置', next: '下一位置', point: '当前位置', fullscreen: '全屏', exitFullscreen: '退出全屏',
    share: '分享当前位置', shared: '链接已复制。', plan: '迷你地图', hidePlan: '收起地图',
    gesture: '拖动画面查看四周，点击箭头移动到下一位置。', landscape: '横屏观看会更宽广。',
    nav: { tour: '360°导览', floor: '楼层与品牌地图', visit: '到店信息' },
  },
  'zh-Hant': {
    prev: '上一位置', next: '下一位置', point: '目前位置', fullscreen: '全螢幕', exitFullscreen: '離開全螢幕',
    share: '分享目前位置', shared: '連結已複製。', plan: '迷你地圖', hidePlan: '收合地圖',
    gesture: '拖動畫面查看四周，點擊箭頭移動到下一位置。', landscape: '橫向觀看會更寬廣。',
    nav: { tour: '360°導覽', floor: '樓層與品牌地圖', visit: '到店資訊' },
  },
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const lang = tourLanguage();
const copy = COPY[lang] || COPY.ko;

function localizeQuickNav() {
  const nav = $('.store-guide-quicknav');
  if (!nav) return;
  Object.entries(copy.nav).forEach(([key, value]) => {
    const node = $(`[data-store-nav="${key}"]`, nav);
    if (node) node.textContent = value;
  });
  const targets = $$('.store-guide-quicknav a').map((link) => $(link.getAttribute('href'))).filter(Boolean);
  if (!('IntersectionObserver' in window) || !targets.length) return;
  const observer = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    $$('.store-guide-quicknav a').forEach((link) => {
      link.classList.toggle('is-active', link.getAttribute('href') === `#${visible.target.id}`);
    });
  }, { rootMargin: '-18% 0px -68% 0px', threshold: [0, 0.1, 0.35, 0.6] });
  targets.forEach((target) => observer.observe(target));
}

function showToast(root, message) {
  let toast = $('.store-tour-action-toast', root);
  if (!toast) {
    toast = document.createElement('p');
    toast.className = 'store-tour-action-toast';
    toast.setAttribute('aria-live', 'polite');
    $('.store-tour-view-card', root)?.append(toast);
  }
  toast.textContent = message;
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => { toast.textContent = ''; }, 1800);
}

async function shareCurrent(root) {
  const title = $('[data-tour-title]', root)?.textContent?.trim() || document.title;
  const url = location.href;
  if (navigator.share) {
    try {
      await navigator.share({ title, text: title, url });
      return;
    } catch (error) {
      if (error?.name === 'AbortError') return;
    }
  }
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(url);
      showToast(root, copy.shared);
      return;
    } catch {}
  }
  window.prompt(copy.share, url);
}

function setPlanCollapsed(planCard, collapsed) {
  planCard.classList.toggle('is-collapsed', collapsed);
  const button = $('[data-tour-plan-toggle]', planCard);
  if (button) {
    button.setAttribute('aria-expanded', String(!collapsed));
    button.textContent = collapsed ? copy.plan : copy.hidePlan;
  }
}

function selectedButtons(root) {
  return $$('[data-tour-list] [data-spot-id]', root);
}

function selectedIndex(root) {
  return selectedButtons(root).findIndex((button) => button.classList.contains('is-selected'));
}

function moveBy(root, amount) {
  const buttons = selectedButtons(root);
  const current = selectedIndex(root);
  buttons[current + amount]?.click();
}

function sync(root, detail = null) {
  const buttons = selectedButtons(root);
  if (!buttons.length) return;
  const index = detail?.index ?? Math.max(0, selectedIndex(root));
  const total = detail?.total ?? buttons.length;
  const current = buttons[index];
  const id = detail?.id || current?.dataset.spotId || '';

  const progress = $('[data-tour-progress]', root);
  if (progress) progress.textContent = `${index + 1} / ${total}`;
  const prev = $('[data-tour-prev]', root);
  const next = $('[data-tour-next]', root);
  if (prev) prev.disabled = index <= 0;
  if (next) next.disabled = index >= total - 1;

  buttons.forEach((button, buttonIndex) => {
    button.setAttribute('aria-current', buttonIndex === index ? 'location' : 'false');
    button.setAttribute('aria-pressed', String(buttonIndex === index));
  });
  $$('.store-tour-marker[data-spot-id]', root).forEach((marker) => {
    const active = marker.dataset.spotId === id;
    marker.setAttribute('aria-current', active ? 'location' : 'false');
    marker.setAttribute('aria-pressed', String(active));
  });
  $$('.store-tour-direction', root).forEach((button) => {
    const label = [button.querySelector('b')?.textContent, button.querySelector('small')?.textContent].filter(Boolean).join(' · ');
    if (label) button.setAttribute('aria-label', label);
  });
  current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
}

function toggleFullscreen(root) {
  const shell = $('.store-tour-view-shell', root);
  if (!shell) return;
  if (document.fullscreenElement) document.exitFullscreen?.();
  else shell.requestFullscreen?.();
}

function addOrientationHint(viewShell) {
  if (!matchMedia('(max-width:760px) and (orientation:portrait)').matches) return;
  const hint = document.createElement('button');
  hint.type = 'button';
  hint.className = 'tour-orientation-hint';
  hint.textContent = copy.landscape;
  hint.addEventListener('click', () => hint.remove());
  viewShell.append(hint);
  setTimeout(() => hint.classList.add('is-visible'), 900);
  setTimeout(() => hint.remove(), 6500);
}

function enhance(root) {
  if (root.dataset.experienceEnhanced === '28') return true;
  const viewCard = $('.store-tour-view-card', root);
  const planCard = $('[data-tour-plan-panel]', root);
  const viewShell = $('.store-tour-view-shell', root);
  const list = $('[data-tour-list]', root);
  if (!viewCard || !planCard || !viewShell || !list) return false;

  root.dataset.experienceEnhanced = '28';
  root.classList.add('is-store-tour-enhanced', 'is-roadview-experience');

  const bar = document.createElement('div');
  bar.className = 'tour-experience-bar';
  bar.innerHTML = `
    <button type="button" data-tour-prev>← ${copy.prev}</button>
    <div class="tour-experience-progress"><small>${copy.point}</small><strong data-tour-progress>1 / 1</strong></div>
    <button type="button" data-tour-next>${copy.next} →</button>
  `;
  $('.store-tour-card-head', viewCard)?.after(bar);

  const fullscreen = document.createElement('button');
  fullscreen.type = 'button';
  fullscreen.className = 'tour-view-fullscreen';
  fullscreen.textContent = copy.fullscreen;
  viewShell.append(fullscreen);

  const gesture = document.createElement('div');
  gesture.className = 'tour-gesture-hint';
  gesture.textContent = copy.gesture;
  viewShell.append(gesture);

  const utility = document.createElement('div');
  utility.className = 'tour-utility-row';
  utility.innerHTML = `<button type="button" data-tour-share>${copy.share}</button><button type="button" data-tour-map>${copy.plan}</button>`;
  $('.store-tour-hint', viewCard)?.after(utility);

  $('[data-tour-prev]', root)?.addEventListener('click', () => moveBy(root, -1));
  $('[data-tour-next]', root)?.addEventListener('click', () => moveBy(root, 1));
  fullscreen.addEventListener('click', () => toggleFullscreen(root));
  $('[data-tour-share]', root)?.addEventListener('click', () => shareCurrent(root));
  $('[data-tour-map]', root)?.addEventListener('click', () => setPlanCollapsed(planCard, !planCard.classList.contains('is-collapsed')));
  $('[data-tour-plan-toggle]', root)?.addEventListener('click', () => setPlanCollapsed(planCard, !planCard.classList.contains('is-collapsed')));

  const hideGesture = () => gesture.classList.add('is-hidden');
  viewShell.addEventListener('pointerdown', hideGesture, { once: true });
  viewShell.addEventListener('wheel', hideGesture, { once: true, passive: true });
  viewShell.addEventListener('dblclick', () => toggleFullscreen(root));
  setTimeout(hideGesture, 6500);

  setPlanCollapsed(planCard, matchMedia('(max-width:760px)').matches);
  addOrientationHint(viewShell);

  root.addEventListener('blueblack-tour-selected', (event) => sync(root, event.detail));
  new MutationObserver(() => sync(root)).observe(list, { subtree: true, attributes: true, attributeFilter: ['class'] });
  document.addEventListener('fullscreenchange', () => {
    fullscreen.textContent = document.fullscreenElement ? copy.exitFullscreen : copy.fullscreen;
  });
  document.addEventListener('keydown', (event) => {
    if (!root.matches(':hover') && !root.contains(document.activeElement)) return;
    if (event.key === 'ArrowLeft') moveBy(root, -1);
    if (event.key === 'ArrowRight') moveBy(root, 1);
  });

  sync(root);
  const params = new URLSearchParams(location.search);
  if (params.has('tour') && !location.hash && !root.dataset.autoFocused) {
    root.dataset.autoFocused = 'true';
    setTimeout(() => root.scrollIntoView({ behavior: 'smooth', block: 'start' }), 350);
  }
  return true;
}

function init() {
  localizeQuickNav();
  const root = $('#storeTour360');
  if (!root) return;
  if (enhance(root)) return;
  const observer = new MutationObserver(() => {
    if (enhance(root)) observer.disconnect();
  });
  observer.observe(root, { subtree: true, childList: true });
}

document.readyState === 'loading'
  ? document.addEventListener('DOMContentLoaded', init, { once: true })
  : init();
