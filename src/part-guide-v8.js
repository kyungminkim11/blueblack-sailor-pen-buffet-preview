import { parts, colors, defaultSelection } from './data.js';
import { getLanguage, localizePart } from './i18n-v3.js';

const ORDER = [
  { id: 'cap_end', number: 1 },
  { id: 'cap_body', number: 2 },
  { id: 'nib_grip', number: 3 },
  { id: 'metal_parts', number: 4 },
  { id: 'barrel_body', number: 5 },
  { id: 'barrel_end', number: 6 },
];

const COPY = {
  ko: {
    kicker: 'PARTS GUIDE',
    title: '파츠 위치를 한눈에 확인해보세요',
    subtitle: '실제 만년필 비율에 가깝게 그린 안내도입니다. 번호나 설명을 누르면 해당 파츠가 바로 선택됩니다.',
    closed: 'CLOSED · 캡 닫힘',
    open: 'OPEN · 캡 분리',
    current: '현재 파츠 위치',
    note: '메탈파츠는 펜촉, 클립, 캡 링, 연결 링 등 금속 부분 전체를 뜻합니다.',
    locations: {
      cap_end: '캡 맨 끝의 둥근 마감 파츠',
      cap_body: '펜촉을 덮는 큰 캡 본체',
      nib_grip: '펜촉 바로 뒤, 손가락으로 잡는 부분',
      metal_parts: '펜촉·클립·금속 링 전체',
      barrel_body: '손에 쥐는 길고 넓은 몸통',
      barrel_end: '배럴 맨 끝의 작은 마감 파츠',
    },
  },
  en: {
    kicker: 'PARTS GUIDE',
    title: 'See where each part is located',
    subtitle: 'This guide uses proportions close to the real pen. Tap a number or description to select that part.',
    closed: 'CLOSED',
    open: 'OPEN',
    current: 'Current part location',
    note: 'Metal Parts means the nib, clip, cap bands and connecting rings together.',
    locations: {
      cap_end: 'Rounded finishing piece at the end of the cap',
      cap_body: 'Main cap body that covers the nib',
      nib_grip: 'Section directly behind the nib where your fingers rest',
      metal_parts: 'Nib, clip and all metal rings together',
      barrel_body: 'Long main body that rests in your hand',
      barrel_end: 'Small finishing piece at the end of the barrel',
    },
  },
  ja: {
    kicker: 'PARTS GUIDE',
    title: '各パーツの位置をひと目で確認できます',
    subtitle: '実物に近い比率で描いた案内図です。番号または説明を押すと、そのパーツをすぐ選択できます。',
    closed: 'CLOSED · キャップ装着',
    open: 'OPEN · キャップ分離',
    current: '現在のパーツ位置',
    note: '金属パーツは、ペン先・クリップ・キャップリング・接続リング全体を指します。',
    locations: {
      cap_end: 'キャップのいちばん端にある丸い仕上げパーツ',
      cap_body: 'ペン先を覆う大きなキャップ本体',
      nib_grip: 'ペン先のすぐ後ろで指が触れる部分',
      metal_parts: 'ペン先・クリップ・金属リング全体',
      barrel_body: '手に持つ長く広い胴軸部分',
      barrel_end: '胴軸のいちばん後ろにある小さな仕上げパーツ',
    },
  },
};

function text() {
  return COPY[getLanguage()] ?? COPY.ko;
}

function colorById(id) {
  return colors.find((color) => color.id === id) ?? colors[0];
}

function selections() {
  if (window.blueblackPenApp?.selections) return window.blueblackPenApp.selections;
  const query = new URLSearchParams(location.search);
  return Object.fromEntries(parts.map((part) => [part.id, query.get(part.id) ?? defaultSelection[part.id]]));
}

function activePartId() {
  return window.blueblackPenApp?.activePartId ?? 'cap_body';
}

function partName(id) {
  const part = parts.find((item) => item.id === id);
  return part ? localizePart(part).name : id;
}

function numberFor(id) {
  return ORDER.find((item) => item.id === id)?.number ?? 0;
}

function metalPalette() {
  const value = colorById(selections().metal_parts).hex.toLowerCase();
  const gold = value.includes('c9a') || value.includes('c7a') || value.includes('b88');
  return gold
    ? { light: '#f6e9bc', base: '#c9a246', dark: '#896b27' }
    : { light: '#f4f6f8', base: '#bcc5cd', dark: '#77838e' };
}

function activeClass(id) {
  return activePartId() === id ? 'is-active' : '';
}

function callout(id) {
  return `<button type="button" class="guide-card ${activeClass(id)}" data-part-id="${id}"><span class="guide-card-no">${numberFor(id)}</span><span class="guide-card-copy"><b>${partName(id)}</b><small>${text().locations[id]}</small></span></button>`;
}

function spot(id, x, y) {
  return `<button type="button" class="guide-spot ${activeClass(id)}" data-part-id="${id}" style="left:${x}%;top:${y}%"><span>${numberFor(id)}</span></button>`;
}

function closedPenSvg() {
  const s = selections();
  const cap = colorById(s.cap_body).hex;
  const capEnd = colorById(s.cap_end).hex;
  const barrel = colorById(s.barrel_body).hex;
  const barrelEnd = colorById(s.barrel_end).hex;
  const metal = metalPalette();
  return `<svg viewBox="0 0 760 190" aria-hidden="true"><defs>
    <linearGradient id="v8-cap" x1="0" x2="1"><stop stop-color="${cap}"/><stop offset=".5" stop-color="${cap}" stop-opacity=".82"/><stop offset="1" stop-color="${cap}"/></linearGradient>
    <linearGradient id="v8-cap-end" x1="0" x2="1"><stop stop-color="${capEnd}"/><stop offset="1" stop-color="${capEnd}" stop-opacity=".76"/></linearGradient>
    <linearGradient id="v8-barrel" x1="0" x2="1"><stop stop-color="${barrel}" stop-opacity=".52"/><stop offset=".5" stop-color="${barrel}" stop-opacity=".25"/><stop offset="1" stop-color="${barrel}" stop-opacity=".52"/></linearGradient>
    <linearGradient id="v8-barrel-end" x1="0" x2="1"><stop stop-color="${barrelEnd}" stop-opacity=".78"/><stop offset="1" stop-color="${barrelEnd}"/></linearGradient>
    <linearGradient id="v8-metal" x1="0" x2="1"><stop stop-color="${metal.light}"/><stop offset=".5" stop-color="${metal.base}"/><stop offset="1" stop-color="${metal.dark}"/></linearGradient>
  </defs><g>
    <path class="guide-part ${activeClass('cap_end')}" data-part-id="cap_end" d="M66 112c0-18 15-32 35-32 10 0 19 3 27 9v46c-8 6-17 9-27 9-20 0-35-14-35-32Z" fill="url(#v8-cap-end)"/>
    <path class="guide-part ${activeClass('cap_body')}" data-part-id="cap_body" d="M116 79h253c19 0 35 15 35 33s-16 33-35 33H116c-6 0-10-4-10-10V89c0-6 4-10 10-10Z" fill="url(#v8-cap)"/>
    <path d="M152 92h193c14 0 26 9 29 20-3 12-15 22-29 22H152Z" fill="#fff" opacity=".09"/>
    <path class="guide-part ${activeClass('metal_parts')}" data-part-id="metal_parts" d="M122 80h14c4 0 6 3 6 6v52c0 4-2 6-6 6h-14Z" fill="url(#v8-metal)"/>
    <rect class="guide-part ${activeClass('metal_parts')}" data-part-id="metal_parts" x="371" y="79" width="8" height="66" rx="3" fill="url(#v8-metal)"/>
    <rect class="guide-part ${activeClass('metal_parts')}" data-part-id="metal_parts" x="384" y="79" width="14" height="66" rx="4" fill="url(#v8-metal)"/>
    <rect class="guide-part ${activeClass('metal_parts')}" data-part-id="metal_parts" x="403" y="79" width="8" height="66" rx="3" fill="url(#v8-metal)"/>
    <path class="guide-part ${activeClass('metal_parts')}" data-part-id="metal_parts" d="M155 95h152c8 0 14 5 17 13l7 17-7 8H156c-6 0-11-4-11-10v-18c0-6 4-10 10-10Z" fill="url(#v8-metal)"/>
    <path class="guide-part ${activeClass('barrel_body')}" data-part-id="barrel_body" d="M412 83h292c42 0 59 16 59 29s-17 29-59 29H412Z" fill="url(#v8-barrel)"/>
    <path d="M420 91h275c31 0 47 8 47 21s-16 21-47 21H420Z" fill="#fff" opacity=".2"/>
    <path class="guide-part ${activeClass('barrel_end')}" data-part-id="barrel_end" d="M699 83h31c20 0 30 13 30 29s-10 29-30 29h-31c8-8 12-18 12-29s-4-21-12-29Z" fill="url(#v8-barrel-end)"/>
  </g></svg>`;
}

function openPenSvg() {
  const s = selections();
  const cap = colorById(s.cap_body).hex;
  const capEnd = colorById(s.cap_end).hex;
  const grip = colorById(s.nib_grip).hex;
  const barrel = colorById(s.barrel_body).hex;
  const barrelEnd = colorById(s.barrel_end).hex;
  const metal = metalPalette();
  return `<svg viewBox="0 0 760 280" aria-hidden="true"><defs>
    <linearGradient id="v8-cap2" x1="0" x2="1"><stop stop-color="${cap}"/><stop offset=".5" stop-color="${cap}" stop-opacity=".82"/><stop offset="1" stop-color="${cap}"/></linearGradient>
    <linearGradient id="v8-cap-end2" x1="0" x2="1"><stop stop-color="${capEnd}"/><stop offset="1" stop-color="${capEnd}" stop-opacity=".76"/></linearGradient>
    <linearGradient id="v8-grip" x1="0" x2="1"><stop stop-color="${grip}"/><stop offset="1" stop-color="${grip}" stop-opacity=".74"/></linearGradient>
    <linearGradient id="v8-barrel2" x1="0" x2="1"><stop stop-color="${barrel}" stop-opacity=".52"/><stop offset=".5" stop-color="${barrel}" stop-opacity=".25"/><stop offset="1" stop-color="${barrel}" stop-opacity=".52"/></linearGradient>
    <linearGradient id="v8-barrel-end2" x1="0" x2="1"><stop stop-color="${barrelEnd}" stop-opacity=".78"/><stop offset="1" stop-color="${barrelEnd}"/></linearGradient>
    <linearGradient id="v8-metal2" x1="0" x2="1"><stop stop-color="${metal.light}"/><stop offset=".5" stop-color="${metal.base}"/><stop offset="1" stop-color="${metal.dark}"/></linearGradient>
  </defs>
  <g transform="translate(118 6)">
    <path class="guide-part ${activeClass('cap_end')}" data-part-id="cap_end" d="M22 61c0-15 14-27 32-27 9 0 18 3 24 8v38c-6 5-15 8-24 8-18 0-32-12-32-27Z" fill="url(#v8-cap-end2)"/>
    <path class="guide-part ${activeClass('cap_body')}" data-part-id="cap_body" d="M66 33h213c16 0 29 13 29 28s-13 28-29 28H66c-6 0-10-4-10-10V43c0-6 4-10 10-10Z" fill="url(#v8-cap2)"/>
    <path class="guide-part ${activeClass('metal_parts')}" data-part-id="metal_parts" d="M70 34h12c3 0 5 2 5 5v44c0 3-2 5-5 5H70Z" fill="url(#v8-metal2)"/>
    <rect class="guide-part ${activeClass('metal_parts')}" data-part-id="metal_parts" x="276" y="33" width="8" height="56" rx="3" fill="url(#v8-metal2)"/>
    <rect class="guide-part ${activeClass('metal_parts')}" data-part-id="metal_parts" x="289" y="33" width="13" height="56" rx="4" fill="url(#v8-metal2)"/>
    <rect class="guide-part ${activeClass('metal_parts')}" data-part-id="metal_parts" x="306" y="33" width="8" height="56" rx="3" fill="url(#v8-metal2)"/>
    <path class="guide-part ${activeClass('metal_parts')}" data-part-id="metal_parts" d="M88 46h138c8 0 14 5 16 11l5 11-5 6H88c-5 0-8-4-8-8V54c0-4 4-8 8-8Z" fill="url(#v8-metal2)"/>
  </g>
  <g transform="translate(30 112)">
    <path class="guide-part ${activeClass('metal_parts')}" data-part-id="metal_parts" d="M0 82h26l47 15v16l-47 15H0c9-13 14-28 14-46S9 95 0 82Z" fill="url(#v8-metal2)"/>
    <path d="M11 107h22" stroke="#343d45" stroke-width="5" stroke-linecap="round"/>
    <path d="M18 118h31" stroke="#343d45" stroke-width="5" stroke-linecap="round"/>
    <path d="M24 129h29" stroke="#343d45" stroke-width="5" stroke-linecap="round"/>
    <path class="guide-part ${activeClass('nib_grip')}" data-part-id="nib_grip" d="M73 81h109c11 0 19 11 19 25s-8 25-19 25H73c-7 0-12-5-12-12V93c0-7 5-12 12-12Z" fill="url(#v8-grip)"/>
    <rect x="122" y="81" width="6" height="50" fill="#07131f" opacity=".23"/>
    <rect x="132" y="81" width="5" height="50" fill="#07131f" opacity=".16"/>
    <rect x="141" y="81" width="5" height="50" fill="#07131f" opacity=".12"/>
    <rect class="guide-part ${activeClass('metal_parts')}" data-part-id="metal_parts" x="201" y="81" width="8" height="50" rx="3" fill="url(#v8-metal2)"/>
    <rect class="guide-part ${activeClass('metal_parts')}" data-part-id="metal_parts" x="214" y="81" width="13" height="50" rx="4" fill="url(#v8-metal2)"/>
    <path class="guide-part ${activeClass('barrel_body')}" data-part-id="barrel_body" d="M227 84h305c41 0 59 14 59 25s-18 25-59 25H227Z" fill="url(#v8-barrel2)"/>
    <path d="M238 91h284c30 0 46 7 46 18s-16 18-46 18H238Z" fill="#fff" opacity=".2"/>
    <path class="guide-part ${activeClass('barrel_end')}" data-part-id="barrel_end" d="M521 84h31c19 0 29 12 29 25s-10 25-29 25h-31c8-7 12-16 12-25s-4-18-12-25Z" fill="url(#v8-barrel-end2)"/>
  </g></svg>`;
}

function markup() {
  const value = text();
  const active = activePartId();
  return `<summary><span class="part-real-summary-copy"><small>${value.kicker}</small><strong>${value.title}</strong></span></summary>
  <div class="part-real-body">
    <p class="part-real-subtitle">${value.subtitle}</p>
    <div class="part-real-figure">
      <div class="part-real-state">${value.closed}</div>
      <div class="part-real-stage">${closedPenSvg()}${spot('cap_end',8,20)}${spot('cap_body',29,20)}${spot('metal_parts',49,20)}${spot('barrel_body',74,20)}${spot('barrel_end',95,20)}</div>
      <div class="part-real-callouts compact">${['cap_end','cap_body','metal_parts','barrel_body','barrel_end'].map(callout).join('')}</div>
    </div>
    <div class="part-real-divider"></div>
    <div class="part-real-figure">
      <div class="part-real-state soft">${value.open}</div>
      <div class="part-real-stage open-stage">${openPenSvg()}${spot('nib_grip',25,80)}${spot('metal_parts',47,80)}${spot('barrel_body',71,80)}${spot('barrel_end',94,80)}</div>
      <div class="part-real-callouts">${['nib_grip','metal_parts','barrel_body','barrel_end'].map(callout).join('')}</div>
    </div>
    <div class="part-real-current"><span class="part-real-current-label">${value.current}</span><strong>${partName(active)}</strong><p>${value.locations[active]}</p></div>
    <p class="part-real-note">${value.note}</p>
  </div>`;
}

function activate(id) {
  window.blueblackPenApp?.selectPart?.(id, true);
  document.querySelector('.part-real-guide').open = true;
  window.setTimeout(() => {
    render();
    document.querySelector('.control-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 60);
}

function bind(root) {
  root.querySelectorAll('[data-part-id]').forEach((element) => {
    element.addEventListener('click', () => activate(element.dataset.partId));
  });
}

function render() {
  const grid = document.querySelector('#part-grid');
  if (!grid) return false;
  let guide = document.querySelector('.part-real-guide');
  const wasOpen = guide?.open ?? true;
  if (!guide) {
    guide = document.createElement('details');
    guide.className = 'part-real-guide';
    grid.insertAdjacentElement('beforebegin', guide);
  }
  guide.innerHTML = markup();
  guide.open = wasOpen;
  bind(guide);
  if (!sessionStorage.getItem('blueblack-real-guide-seen')) {
    sessionStorage.setItem('blueblack-real-guide-seen', '1');
    guide.classList.add('guide-intro-pulse');
    window.setTimeout(() => guide.classList.remove('guide-intro-pulse'), 1200);
  }
  return true;
}

function refreshSoon() {
  window.clearTimeout(refreshSoon.timer);
  refreshSoon.timer = window.setTimeout(render, 40);
}

function initialize() {
  if (!render()) {
    window.setTimeout(initialize, 80);
    return;
  }
  document.querySelectorAll('[data-language]').forEach((button) => button.addEventListener('click', () => window.setTimeout(render, 40)));
  document.querySelector('#palette')?.addEventListener('click', refreshSoon, true);
  document.querySelector('#part-grid')?.addEventListener('click', refreshSoon, true);
  document.querySelector('#previous-part')?.addEventListener('click', refreshSoon, true);
  document.querySelector('#next-part')?.addEventListener('click', refreshSoon, true);
  window.addEventListener('combinationchange', refreshSoon);
}

window.setTimeout(initialize, 0);
