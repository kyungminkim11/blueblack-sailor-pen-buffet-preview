import { parts, colors, defaultSelection } from './data.js';
import { getLanguage, localizePart } from './i18n-v3.js';

const copy = {
  ko: {
    kicker: 'PEN PARTS GUIDE',
    title: '파츠 위치를 먼저 확인해보세요',
    intro: '아래 그림은 캡을 벗겨 놓은 모습입니다. 번호나 파츠 이름을 누르면 해당 부분이 바로 선택됩니다.',
    note: '메탈파츠는 한 곳이 아니라 펜촉·클립·금속 링 전체를 뜻합니다.',
    help: '그림과 설명 버튼 모두 눌러서 파츠를 선택할 수 있습니다.',
    where: '위치',
    locations: {
      cap_body: '펜을 닫았을 때 펜촉을 덮는 큰 뚜껑',
      cap_end: '캡 맨 끝에 붙는 작은 마감 파츠',
      nib_grip: '펜촉 바로 뒤, 글을 쓸 때 손가락으로 잡는 부분',
      metal_parts: '펜촉·클립·캡 밴드·연결 링 등 반짝이는 금속 부분 전체',
      barrel_body: '글을 쓸 때 손바닥에 닿는 길고 넓은 몸통',
      barrel_end: '배럴 맨 뒤를 마감하는 작은 끝 파츠',
    },
  },
  en: {
    kicker: 'PEN PARTS GUIDE',
    title: 'See where each part is located',
    intro: 'The diagram shows the pen with its cap removed. Tap a number or part name to select that area.',
    note: 'Metal Parts refers to several areas: the nib, clip, cap bands and connecting rings.',
    help: 'Both the diagram and the description buttons are interactive.',
    where: 'Location',
    locations: {
      cap_body: 'The large cover that protects the nib when the pen is closed',
      cap_end: 'The small finishing piece at the far end of the cap',
      nib_grip: 'The section directly behind the nib where your fingers rest while writing',
      metal_parts: 'All shiny metal areas, including the nib, clip, cap bands and rings',
      barrel_body: 'The long main body that rests in your hand while writing',
      barrel_end: 'The small finishing piece at the far end of the barrel',
    },
  },
  ja: {
    kicker: 'PEN PARTS GUIDE',
    title: '各パーツの位置を確認しましょう',
    intro: '下の図はキャップを外した状態です。番号またはパーツ名を押すと、その部分をすぐ選択できます。',
    note: '金属パーツは一か所ではなく、ペン先・クリップ・キャップリング・接続リング全体を指します。',
    help: '図と説明ボタンのどちらからでもパーツを選択できます。',
    where: '位置',
    locations: {
      cap_body: 'ペンを閉じたときにペン先を覆う大きなキャップ部分',
      cap_end: 'キャップのいちばん端に付く小さな仕上げパーツ',
      nib_grip: 'ペン先のすぐ後ろにあり、筆記時に指で持つ部分',
      metal_parts: 'ペン先・クリップ・キャップリング・接続リングなどの金属部分全体',
      barrel_body: '筆記時に手のひらに触れる長く広い胴軸部分',
      barrel_end: '胴軸のいちばん後ろを仕上げる小さなパーツ',
    },
  },
};

function text() {
  return copy[getLanguage()] ?? copy.ko;
}

function colorById(id) {
  return colors.find((color) => color.id === id) ?? colors[0];
}

function currentSelections() {
  if (window.blueblackPenApp?.selections) return window.blueblackPenApp.selections;
  const query = new URLSearchParams(location.search);
  return Object.fromEntries(parts.map((part) => [part.id, query.get(part.id) ?? defaultSelection[part.id]]));
}

function activePartId() {
  return window.blueblackPenApp?.activePartId ?? parts[0].id;
}

function partName(id) {
  return localizePart(parts.find((part) => part.id === id)).name;
}

function makeSvg() {
  const selections = currentSelections();
  const resin = (id) => colorById(selections[id]).hex;
  const metal = resin('metal_parts');

  return `
    <svg viewBox="0 0 760 330" role="img" aria-label="Fountain pen parts diagram">
      <defs>
        <linearGradient id="guide-shine" x1="0" x2="1"><stop stop-color="#fff" stop-opacity=".7"/><stop offset=".48" stop-color="#fff" stop-opacity=".08"/><stop offset="1" stop-color="#26384a" stop-opacity=".12"/></linearGradient>
        <linearGradient id="guide-metal" x1="0" x2="1"><stop stop-color="#fff" stop-opacity=".72"/><stop offset=".5" stop-color="${metal}"/><stop offset="1" stop-color="#59636c" stop-opacity=".45"/></linearGradient>
      </defs>

      <text class="part-map-caption" x="205" y="25">${getLanguage() === 'ja' ? '外したキャップ' : getLanguage() === 'en' ? 'CAP REMOVED' : '분리한 캡'}</text>
      <g class="part-map-region" data-part-id="cap_end" tabindex="0" role="button" aria-label="2. ${partName('cap_end')}">
        <rect class="part-map-outline" data-fill-part="cap_end" x="48" y="61" width="60" height="68" rx="27" fill="${resin('cap_end')}"/>
        <rect x="48" y="61" width="60" height="68" rx="27" fill="url(#guide-shine)"/>
        <g class="part-map-number"><circle cx="64" cy="53" r="14"/><text x="64" y="53">2</text></g>
      </g>
      <g class="part-map-region" data-part-id="cap_body" tabindex="0" role="button" aria-label="1. ${partName('cap_body')}">
        <rect class="part-map-outline" data-fill-part="cap_body" x="96" y="49" width="257" height="92" rx="43" fill="${resin('cap_body')}"/>
        <rect x="96" y="49" width="257" height="92" rx="43" fill="url(#guide-shine)"/>
        <g class="part-map-number"><circle cx="210" cy="45" r="14"/><text x="210" y="45">1</text></g>
      </g>
      <g class="part-map-region" data-part-id="metal_parts" tabindex="0" role="button" aria-label="4. ${partName('metal_parts')}">
        <path class="part-map-outline" d="M131 65h150c18 0 32 12 36 28h-10c-4-10-14-17-27-17H131z" fill="url(#guide-metal)"/>
        <rect class="part-map-outline" x="110" y="46" width="9" height="98" rx="4.5" fill="url(#guide-metal)"/>
        <rect class="part-map-outline" x="329" y="45" width="9" height="100" rx="4.5" fill="url(#guide-metal)"/>
        <path class="part-map-outline" d="M66 219l82-37 39 37-39 37z" fill="url(#guide-metal)"/>
        <path d="M91 219l54-23 22 23-22 23z" fill="#f2f5f7" fill-opacity=".65"/>
        <rect class="part-map-outline" x="296" y="184" width="14" height="70" rx="5" fill="url(#guide-metal)"/>
        <g class="part-map-number"><circle cx="111" cy="178" r="14"/><text x="111" y="178">4</text></g>
      </g>

      <text class="part-map-caption" x="396" y="168">${getLanguage() === 'ja' ? 'キャップを外した本体' : getLanguage() === 'en' ? 'PEN BODY WITH CAP OFF' : '캡을 벗긴 펜 본체'}</text>
      <g class="part-map-region" data-part-id="nib_grip" tabindex="0" role="button" aria-label="3. ${partName('nib_grip')}">
        <path class="part-map-outline" data-fill-part="nib_grip" d="M176 187h124v64H176l-34-32z" fill="${resin('nib_grip')}"/>
        <path d="M176 187h124v64H176l-34-32z" fill="url(#guide-shine)"/>
        <g class="part-map-number"><circle cx="225" cy="274" r="14"/><text x="225" y="274">3</text></g>
      </g>
      <g class="part-map-region" data-part-id="barrel_body" tabindex="0" role="button" aria-label="5. ${partName('barrel_body')}">
        <rect class="part-map-outline" data-fill-part="barrel_body" x="306" y="181" width="342" height="76" rx="37" fill="${resin('barrel_body')}"/>
        <rect x="306" y="181" width="342" height="76" rx="37" fill="url(#guide-shine)"/>
        <g class="part-map-number"><circle cx="476" cy="274" r="14"/><text x="476" y="274">5</text></g>
      </g>
      <g class="part-map-region" data-part-id="barrel_end" tabindex="0" role="button" aria-label="6. ${partName('barrel_end')}">
        <rect class="part-map-outline" data-fill-part="barrel_end" x="632" y="185" width="75" height="68" rx="29" fill="${resin('barrel_end')}"/>
        <rect x="632" y="185" width="75" height="68" rx="29" fill="url(#guide-shine)"/>
        <g class="part-map-number"><circle cx="680" cy="274" r="14"/><text x="680" y="274">6</text></g>
      </g>
      <text class="part-map-caption part-map-metal-caption" x="112" y="307">${partName('metal_parts')}</text>
    </svg>
  `;
}

function activatePart(id) {
  const guide = document.querySelector('.part-map-guide');
  guide.open = true;
  window.blueblackPenApp?.selectPart?.(id, true);
  window.setTimeout(() => {
    updateActiveState();
    document.querySelector('.part-description')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 80);
}

function locationButton(part, index) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'part-location-button';
  button.dataset.partId = part.id;
  button.innerHTML = `<span class="part-location-number">${index + 1}</span><span><b>${localizePart(part).name}</b><span>${text().locations[part.id]}</span></span>`;
  button.addEventListener('click', () => activatePart(part.id));
  return button;
}

function ensureWhereRow() {
  const description = document.querySelector('.part-description');
  if (!description) return;
  let row = description.querySelector('.part-where-row');
  if (!row) {
    row = document.createElement('div');
    row.className = 'part-where-row';
    row.innerHTML = '<span class="part-where-label"></span><span class="part-where-text"></span>';
    description.append(row);
  }
  row.querySelector('.part-where-label').textContent = text().where;
  row.querySelector('.part-where-text').textContent = text().locations[activePartId()];
}

function updateActiveState() {
  const id = activePartId();
  document.querySelectorAll('.part-map-region,.part-location-button').forEach((element) => {
    const active = element.dataset.partId === id;
    element.classList.toggle('is-active', active);
    if (element.matches('.part-location-button')) element.setAttribute('aria-pressed', String(active));
  });
  ensureWhereRow();
}

function updateDiagramColors() {
  const guide = document.querySelector('.part-map-guide');
  if (!guide) return;
  const open = guide.open;
  guide.querySelector('.part-map-visual').innerHTML = makeSvg();
  guide.open = open;
  bindDiagramEvents();
  updateActiveState();
}

function bindDiagramEvents() {
  const visual = document.querySelector('.part-map-visual');
  if (!visual || visual.dataset.bound === 'true') return;
  visual.dataset.bound = 'true';
  visual.addEventListener('click', (event) => {
    const region = event.target.closest('[data-part-id]');
    if (region) activatePart(region.dataset.partId);
  });
  visual.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const region = event.target.closest('[data-part-id]');
    if (!region) return;
    event.preventDefault();
    activatePart(region.dataset.partId);
  });
}

function renderGuide() {
  const partGrid = document.querySelector('#part-grid');
  if (!partGrid) return false;
  let guide = document.querySelector('.part-map-guide');
  const wasOpen = guide?.open ?? true;
  if (!guide) {
    guide = document.createElement('details');
    guide.className = 'part-map-guide';
    partGrid.insertAdjacentElement('beforebegin', guide);
  }

  guide.innerHTML = `
    <summary><span class="part-map-summary-copy"><small>${text().kicker}</small><strong>${text().title}</strong></span></summary>
    <div class="part-map-body">
      <p class="part-map-intro">${text().intro}</p>
      <div class="part-map-visual">${makeSvg()}</div>
      <p class="part-map-note">${text().note}</p>
      <div class="part-location-list"></div>
      <p class="part-map-help">${text().help}</p>
    </div>
  `;
  guide.open = wasOpen;
  guide.querySelector('.part-location-list').append(...parts.map(locationButton));
  bindDiagramEvents();
  updateActiveState();

  if (!sessionStorage.getItem('blueblack-part-guide-seen')) {
    sessionStorage.setItem('blueblack-part-guide-seen', '1');
    window.setTimeout(() => guide.classList.add('guide-pulse'), 350);
    window.setTimeout(() => guide.classList.remove('guide-pulse'), 950);
  }
  return true;
}

function initialize() {
  if (!renderGuide()) {
    window.setTimeout(initialize, 80);
    return;
  }

  const grid = document.querySelector('#part-grid');
  const observer = new MutationObserver(() => window.setTimeout(updateActiveState));
  observer.observe(grid, { childList: true, subtree: true, attributes: true, attributeFilter: ['aria-selected'] });

  window.addEventListener('combinationchange', updateDiagramColors);
  document.querySelectorAll('[data-language]').forEach((button) => {
    button.addEventListener('click', () => window.setTimeout(renderGuide));
  });
}

window.setTimeout(initialize, 0);
