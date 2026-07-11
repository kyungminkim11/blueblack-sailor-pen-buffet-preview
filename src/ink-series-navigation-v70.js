import {
  brandGroups,
  brandName,
  currentLang,
  formatPrice,
  normalize,
  priceFor,
  priceItemForColor,
  seriesName
} from './ink-catalog-model-v22.js';

const COPY = {
  ko: {
    eyebrow: '2단계 · 시리즈 선택',
    title: brand => `${brand} 시리즈를 선택해 주세요`,
    body: count => `시리즈를 고르면 ${count}개의 색상을 한꺼번에 펼치지 않고 해당 색상만 보여드려요.`,
    colors: count => `${count}색`,
    manual: '색상은 직원 확인',
    price: (p5, p10) => `5ml ${p5} · 10ml ${p10}`,
    all: '전체 색상 보기',
    allBody: count => `${count}개 색상을 한 번에 확인`,
    back: '브랜드 다시 선택',
    selected: '선택됨',
    resultTitle: (brand, series) => `${brand} · ${series}`,
    chooseFirst: '시리즈를 선택하면 해당 색상만 표시됩니다.',
    workflow: [['1','브랜드 선택','원하는 브랜드를 고르세요.'],['2','시리즈 선택','라인별로 색상을 좁혀보세요.'],['3','용량 선택','5ml·10ml·본병을 비교하세요.'],['4','직원 확인','담은 목록을 직원에게 보여주세요.']]
  },
  en: {
    eyebrow: 'Step 2 · Choose a series',
    title: brand => `Choose a ${brand} series`,
    body: count => `Choose a series instead of opening all ${count} colors at once.`,
    colors: count => `${count} colors`,
    manual: 'Ask staff for colors',
    price: (p5, p10) => `5ml ${p5} · 10ml ${p10}`,
    all: 'View all colors',
    allBody: count => `Show all ${count} colors`,
    back: 'Choose another brand',
    selected: 'Selected',
    resultTitle: (brand, series) => `${brand} · ${series}`,
    chooseFirst: 'Choose a series to see its colors.',
    workflow: [['1','Choose a brand','Pick the brand you want.'],['2','Choose a series','Narrow the colors by collection.'],['3','Choose a size','Compare 5ml, 10ml and bottles.'],['4','Show staff','Open your saved list at the counter.']]
  },
  ja: {
    eyebrow: 'ステップ2・シリーズ選択',
    title: brand => `${brand}のシリーズを選択してください`,
    body: count => `${count}色を一度に表示せず、選んだシリーズの色だけを表示します。`,
    colors: count => `${count}色`,
    manual: '色はスタッフ確認',
    price: (p5, p10) => `5ml ${p5}・10ml ${p10}`,
    all: '全色を見る',
    allBody: count => `${count}色をすべて表示`,
    back: 'ブランドを選び直す',
    selected: '選択中',
    resultTitle: (brand, series) => `${brand}・${series}`,
    chooseFirst: 'シリーズを選ぶと該当カラーが表示されます。',
    workflow: [['1','ブランド選択','ブランドを選びます。'],['2','シリーズ選択','コレクション別に絞ります。'],['3','容量選択','5ml・10ml・本瓶を比較します。'],['4','スタッフ確認','選択リストをスタッフに見せます。']]
  },
  'zh-Hans': {
    eyebrow: '第2步 · 选择系列',
    title: brand => `请选择 ${brand} 系列`,
    body: count => `无需一次展开${count}种颜色，只显示所选系列的颜色。`,
    colors: count => `${count}色`,
    manual: '颜色请咨询店员',
    price: (p5, p10) => `5ml ${p5} · 10ml ${p10}`,
    all: '查看全部颜色',
    allBody: count => `一次查看${count}种颜色`,
    back: '重新选择品牌',
    selected: '已选择',
    resultTitle: (brand, series) => `${brand} · ${series}`,
    chooseFirst: '选择系列后，将只显示该系列颜色。',
    workflow: [['1','选择品牌','选择想查看的品牌。'],['2','选择系列','按系列缩小颜色范围。'],['3','选择容量','比较5ml、10ml和整瓶。'],['4','店员确认','向店员出示已选列表。']]
  },
  'zh-Hant': {
    eyebrow: '第2步 · 選擇系列',
    title: brand => `請選擇 ${brand} 系列`,
    body: count => `不必一次展開${count}種顏色，只顯示所選系列的顏色。`,
    colors: count => `${count}色`,
    manual: '顏色請洽店員',
    price: (p5, p10) => `5ml ${p5} · 10ml ${p10}`,
    all: '查看全部顏色',
    allBody: count => `一次查看${count}種顏色`,
    back: '重新選擇品牌',
    selected: '已選擇',
    resultTitle: (brand, series) => `${brand} · ${series}`,
    chooseFirst: '選擇系列後，將只顯示該系列顏色。',
    workflow: [['1','選擇品牌','選擇想查看的品牌。'],['2','選擇系列','依系列縮小顏色範圍。'],['3','選擇容量','比較5ml、10ml與整瓶。'],['4','店員確認','向店員出示已選清單。']]
  }
};

const BRAND_FAMILIES = {
  diamine: ['diamine', 'inkvent']
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const copy = () => COPY[currentLang()] || COPY.en;

let selectedBrandKey = '';
let selectedSeriesKey = '';
let allowAll = false;
let lastInputValue = '';
let rendering = false;

function familyKeys(group) {
  const key = normalize(group?.brandEn || group?.brandKo || '');
  return BRAND_FAMILIES[key] || [key];
}

function findBrandGroup(value = '') {
  const key = normalize(value);
  if (!key) return null;
  return brandGroups().find(group => {
    const candidates = [group.brandKo, group.brandEn, ...(group.keywords || [])].map(normalize);
    return candidates.some(candidate => candidate === key);
  }) || null;
}

function findParentGroup(value = '') {
  const exact = findBrandGroup(value);
  if (!exact) return null;
  const exactKey = normalize(exact.brandEn || exact.brandKo);
  if (exactKey === 'inkvent') {
    return brandGroups().find(group => normalize(group.brandEn || group.brandKo) === 'diamine') || exact;
  }
  return exact;
}

function familyGroups(parent) {
  if (!parent) return [];
  const keys = new Set(familyKeys(parent));
  return brandGroups().filter(group => keys.has(normalize(group.brandEn || group.brandKo)));
}

function seriesEntries(parent) {
  const entries = [];
  for (const group of familyGroups(parent)) {
    for (const item of group.priceItems || []) {
      const colors = (group.colors || []).filter(color => priceItemForColor(color, group)?.id === item.id);
      entries.push({
        key: `${normalize(group.brandEn || group.brandKo)}:${item.id}`,
        group,
        item,
        colors,
        colorCount: colors.length
      });
    }
  }
  return entries;
}

function totalColors(entries) {
  return new Set(entries.flatMap(entry => entry.colors.map(color => color.id))).size;
}

function displayBrand(parent) {
  return brandName(parent);
}

function queryFor(entry) {
  return [brandName(entry.group), seriesName(entry.item)].filter(Boolean).join(' ');
}

function updateWorkflowSteps(app) {
  const steps = $('.ink-consumer-steps', app);
  if (!steps) return;
  const signature = `${currentLang()}:series-v70`;
  if (steps.dataset.seriesWorkflow === signature) return;
  steps.dataset.seriesWorkflow = signature;
  steps.innerHTML = copy().workflow.map(([no, title, body]) => `
    <div><b>${no}</b><span><strong>${title}</strong><small>${body}</small></span></div>
  `).join('');
}

function ensureShell(app) {
  let shell = $('.ink-series-nav', app);
  if (shell) return shell;

  const brandSection = $('.ink-store-quick', app)?.closest('section,div');
  const resultHead = $('.ink-store-result-head', app);
  if (!resultHead) return null;

  shell = document.createElement('section');
  shell.className = 'ink-series-nav';
  shell.hidden = true;
  shell.setAttribute('aria-live', 'polite');
  shell.innerHTML = `
    <div class="ink-series-nav-head">
      <div>
        <span class="ink-series-eyebrow"></span>
        <h2></h2>
        <p></p>
      </div>
      <button type="button" class="ink-series-back"></button>
    </div>
    <div class="ink-series-grid" role="list"></div>
  `;
  resultHead.before(shell);

  $('.ink-series-back', shell).addEventListener('click', () => {
    selectedBrandKey = '';
    selectedSeriesKey = '';
    allowAll = false;
    shell.hidden = true;
    app.classList.remove('is-awaiting-series');
    $$('.ink-store-quick button[data-brand]', app).forEach(button => {
      button.classList.remove('is-series-parent');
    });
    const input = $('.ink-store-search', app);
    if (input) {
      input.value = '';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.focus({ preventScroll: true });
    }
    brandSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  return shell;
}

function setResultsVisibility(app, show) {
  app.classList.toggle('is-awaiting-series', !show);
  const more = $('.ink-store-more', app);
  if (!show && more) more.hidden = true;
}

function selectSeries(app, entry) {
  selectedSeriesKey = entry.key;
  allowAll = false;
  const input = $('.ink-store-search', app);
  if (!input) return;
  input.value = queryFor(entry);
  lastInputValue = input.value;
  setResultsVisibility(app, true);
  input.dispatchEvent(new Event('input', { bubbles: true }));
  renderSeries(app);
  setTimeout(() => {
    $('.ink-store-result-head', app)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 80);
}

function selectAll(app, parent) {
  selectedSeriesKey = 'all';
  allowAll = true;
  const input = $('.ink-store-search', app);
  if (!input) return;
  input.value = brandName(parent);
  lastInputValue = input.value;
  setResultsVisibility(app, true);
  input.dispatchEvent(new Event('input', { bubbles: true }));
  renderSeries(app);
}

function renderSeries(app) {
  if (rendering || !selectedBrandKey) return;
  const parent = findParentGroup(selectedBrandKey);
  if (!parent) return;

  rendering = true;
  try {
    const shell = ensureShell(app);
    if (!shell) return;
    const entries = seriesEntries(parent);
    const count = totalColors(entries);
    const c = copy();

    shell.hidden = false;
    $('.ink-series-eyebrow', shell).textContent = c.eyebrow;
    $('h2', shell).textContent = c.title(displayBrand(parent));
    $('p', shell).textContent = c.body(count);
    $('.ink-series-back', shell).textContent = c.back;

    const grid = $('.ink-series-grid', shell);
    grid.innerHTML = entries.map(entry => {
      const selected = selectedSeriesKey === entry.key;
      const groupLabel = normalize(entry.group.brandEn || entry.group.brandKo) === normalize(parent.brandEn || parent.brandKo)
        ? ''
        : brandName(entry.group);
      const name = seriesName(entry.item);
      const countLabel = entry.colorCount ? c.colors(entry.colorCount) : c.manual;
      return `
        <button type="button" class="ink-series-card${selected ? ' is-selected' : ''}" data-series-key="${entry.key}" role="listitem" aria-pressed="${selected}">
          <span class="ink-series-card-top">
            ${groupLabel ? `<small>${groupLabel}</small>` : '<small>&nbsp;</small>'}
            ${selected ? `<em>${c.selected}</em>` : ''}
          </span>
          <strong>${name}</strong>
          <span>${countLabel}</span>
          <small>${c.price(formatPrice(priceFor(entry.item, '5ml')), formatPrice(priceFor(entry.item, '10ml')))}</small>
        </button>
      `;
    }).join('') + `
      <button type="button" class="ink-series-card ink-series-all${selectedSeriesKey === 'all' ? ' is-selected' : ''}" data-series-all role="listitem" aria-pressed="${selectedSeriesKey === 'all'}">
        <span class="ink-series-card-top"><small>ALL</small>${selectedSeriesKey === 'all' ? `<em>${c.selected}</em>` : ''}</span>
        <strong>${c.all}</strong>
        <span>${c.allBody(count)}</span>
        <small>${displayBrand(parent)}</small>
      </button>
    `;

    $$('.ink-series-card[data-series-key]', grid).forEach(button => {
      button.addEventListener('click', () => {
        const entry = entries.find(item => item.key === button.dataset.seriesKey);
        if (entry) selectSeries(app, entry);
      });
    });
    $('[data-series-all]', grid)?.addEventListener('click', () => selectAll(app, parent));

    $$('.ink-store-quick button[data-brand]', app).forEach(button => {
      const key = normalize(button.dataset.brand || '');
      const parentKeys = new Set(familyKeys(parent));
      button.classList.toggle('is-series-parent', parentKeys.has(key));
    });

    if (!selectedSeriesKey) {
      setResultsVisibility(app, false);
      const stats = $('[data-ink-store-stats]', app);
      if (stats) stats.textContent = c.chooseFirst;
    }
  } finally {
    rendering = false;
  }
}

function handleBrandSelection(app, value) {
  const parent = findParentGroup(value);
  if (!parent) return false;
  selectedBrandKey = parent.brandEn || parent.brandKo;
  selectedSeriesKey = '';
  allowAll = false;
  lastInputValue = String(value || '');
  renderSeries(app);
  return true;
}

function bind(app) {
  if (app.dataset.seriesNavBound) return;
  app.dataset.seriesNavBound = 'true';

  app.addEventListener('click', event => {
    const brandButton = event.target.closest('.ink-store-quick button[data-brand]');
    if (!brandButton) return;
    setTimeout(() => handleBrandSelection(app, brandButton.dataset.brand || ''), 0);
  });

  app.addEventListener('input', event => {
    if (!event.target.matches('.ink-store-search')) return;
    const value = event.target.value.trim();
    if (value === lastInputValue) return;
    lastInputValue = value;

    if (!value) {
      selectedBrandKey = '';
      selectedSeriesKey = '';
      allowAll = false;
      const shell = $('.ink-series-nav', app);
      if (shell) shell.hidden = true;
      setResultsVisibility(app, true);
      return;
    }

    const parent = findParentGroup(value);
    if (parent) {
      handleBrandSelection(app, value);
      return;
    }

    if (selectedSeriesKey || allowAll) {
      const parentGroup = findParentGroup(selectedBrandKey);
      const entries = parentGroup ? seriesEntries(parentGroup) : [];
      const matchesCurrentSeries = selectedSeriesKey === 'all'
        ? normalize(value) === normalize(brandName(parentGroup))
        : entries.some(entry => entry.key === selectedSeriesKey && normalize(value) === normalize(queryFor(entry)));
      if (matchesCurrentSeries) return;
    }

    selectedBrandKey = '';
    selectedSeriesKey = '';
    allowAll = false;
    const shell = $('.ink-series-nav', app);
    if (shell) shell.hidden = true;
    setResultsVisibility(app, true);
  });
}

function init() {
  const app = document.querySelector('#ink-store-app');
  if (!app) return;
  ensureShell(app);
  updateWorkflowSteps(app);
  bind(app);

  new MutationObserver(() => {
    requestAnimationFrame(() => {
      updateWorkflowSteps(app);
      if (selectedBrandKey) renderSeries(app);
    });
  }).observe(app, { childList: true, subtree: true });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
