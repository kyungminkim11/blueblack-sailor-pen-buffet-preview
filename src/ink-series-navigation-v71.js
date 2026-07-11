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
    body: count => `전체 ${count}색을 한꺼번에 펼치지 않고, 선택한 시리즈의 색상만 보여드려요.`,
    colors: count => `${count}색`,
    manual: '색상은 직원 확인',
    price: (p5, p10) => `5ml ${p5} · 10ml ${p10}`,
    all: '전체 색상 보기',
    allBody: count => `${count}개 색상을 한 번에 확인`,
    back: '브랜드 다시 선택',
    selected: '선택됨',
    chooseFirst: '시리즈를 선택하면 해당 색상만 표시됩니다.',
    loading: '해당 시리즈 색상을 정리하고 있어요.',
    stats: (brand, series, count) => `${brand} · ${series} · ${count}개 색상`,
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
    chooseFirst: 'Choose a series to see its colors.',
    loading: 'Preparing colors for this series.',
    stats: (brand, series, count) => `${brand} · ${series} · ${count} colors`,
    workflow: [['1','Choose a brand','Pick the brand you want.'],['2','Choose a series','Narrow colors by collection.'],['3','Choose a size','Compare 5ml, 10ml and bottles.'],['4','Show staff','Open your saved list at the counter.']]
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
    chooseFirst: 'シリーズを選ぶと該当カラーが表示されます。',
    loading: 'シリーズの色を準備しています。',
    stats: (brand, series, count) => `${brand}・${series}・${count}色`,
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
    chooseFirst: '选择系列后，将只显示该系列颜色。',
    loading: '正在整理该系列颜色。',
    stats: (brand, series, count) => `${brand} · ${series} · ${count}种颜色`,
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
    chooseFirst: '選擇系列後，將只顯示該系列顏色。',
    loading: '正在整理該系列顏色。',
    stats: (brand, series, count) => `${brand} · ${series} · ${count}種顏色`,
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
let selectedItemId = '';
let lastInputValue = '';
let filterTimer = 0;
let filterPasses = 0;

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
  const key = normalize(exact.brandEn || exact.brandKo);
  if (key === 'inkvent') {
    return brandGroups().find(group => normalize(group.brandEn || group.brandKo) === 'diamine') || exact;
  }
  return exact;
}

function familyGroups(parent) {
  const keys = new Set(familyKeys(parent));
  return brandGroups().filter(group => keys.has(normalize(group.brandEn || group.brandKo)));
}

function seriesEntries(parent) {
  const result = [];
  for (const group of familyGroups(parent)) {
    for (const item of group.priceItems || []) {
      const colors = (group.colors || []).filter(color => priceItemForColor(color, group)?.id === item.id);
      result.push({
        key: `${normalize(group.brandEn || group.brandKo)}:${item.id}`,
        group,
        item,
        colors,
        colorCount: colors.length
      });
    }
  }
  return result;
}

function totalColors(entries) {
  return new Set(entries.flatMap(entry => entry.colors.map(color => color.id))).size;
}

function setText(node, value) {
  if (node && node.textContent !== value) node.textContent = value;
}

function updateWorkflowSteps(app) {
  const steps = $('.ink-consumer-steps', app);
  if (!steps) return;
  const signature = `${currentLang()}:series-v71`;
  if (steps.dataset.seriesWorkflow === signature) return;
  steps.dataset.seriesWorkflow = signature;
  steps.innerHTML = copy().workflow.map(([no, title, body]) =>
    `<div><b>${no}</b><span><strong>${title}</strong><small>${body}</small></span></div>`
  ).join('');
}

function ensureShell(app) {
  let shell = $('.ink-series-nav', app);
  if (shell) return shell;
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
    <div class="ink-series-loading" hidden><i></i><span></span></div>
  `;
  resultHead.before(shell);

  $('.ink-series-back', shell).addEventListener('click', () => resetToBrands(app, true));
  return shell;
}

function clearResultFilter(app) {
  clearTimeout(filterTimer);
  filterPasses = 0;
  app.classList.remove('is-series-resolving');
  $$('.ink-store-result.is-series-filter-hidden', app).forEach(card => {
    card.classList.remove('is-series-filter-hidden');
  });
  const loading = $('.ink-series-loading', app);
  if (loading) loading.hidden = true;
}

function resetToBrands(app, focus = false) {
  selectedBrandKey = '';
  selectedSeriesKey = '';
  selectedItemId = '';
  clearResultFilter(app);
  app.classList.remove('is-awaiting-series');
  const shell = $('.ink-series-nav', app);
  if (shell) shell.hidden = true;
  $$('.ink-store-quick button[data-brand]', app).forEach(button => {
    button.classList.remove('is-series-parent');
  });
  const input = $('.ink-store-search', app);
  if (input) {
    input.value = '';
    lastInputValue = '';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    if (focus) input.focus({ preventScroll: true });
  }
  if (focus) $('.ink-store-quick-head', app)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function setResultsVisibility(app, show) {
  app.classList.toggle('is-awaiting-series', !show);
  if (!show) {
    const more = $('.ink-store-more', app);
    if (more) more.hidden = true;
  }
}

function selectedEntry(parent) {
  return seriesEntries(parent).find(entry => entry.key === selectedSeriesKey) || null;
}

function renderSeries(app) {
  if (!selectedBrandKey) return;
  const parent = findParentGroup(selectedBrandKey);
  if (!parent) return;
  const shell = ensureShell(app);
  if (!shell) return;

  const entries = seriesEntries(parent);
  const count = totalColors(entries);
  const c = copy();
  shell.hidden = false;

  setText($('.ink-series-eyebrow', shell), c.eyebrow);
  setText($('.ink-series-nav-head h2', shell), c.title(brandName(parent)));
  setText($('.ink-series-nav-head p', shell), c.body(count));
  setText($('.ink-series-back', shell), c.back);
  setText($('.ink-series-loading span', shell), c.loading);

  const signature = `${currentLang()}|${selectedBrandKey}|${selectedSeriesKey}|${entries.map(entry => `${entry.key}:${entry.colorCount}`).join(',')}`;
  const grid = $('.ink-series-grid', shell);
  if (grid.dataset.signature !== signature) {
    grid.dataset.signature = signature;
    grid.innerHTML = entries.map(entry => {
      const selected = selectedSeriesKey === entry.key;
      const childBrand = normalize(entry.group.brandEn || entry.group.brandKo) === normalize(parent.brandEn || parent.brandKo)
        ? ''
        : brandName(entry.group);
      return `
        <button type="button" class="ink-series-card${selected ? ' is-selected' : ''}" data-series-key="${entry.key}" role="listitem" aria-pressed="${selected}">
          <span class="ink-series-card-top">
            <small>${childBrand || '&nbsp;'}</small>
            ${selected ? `<em>${c.selected}</em>` : ''}
          </span>
          <strong>${seriesName(entry.item)}</strong>
          <span>${entry.colorCount ? c.colors(entry.colorCount) : c.manual}</span>
          <small>${c.price(formatPrice(priceFor(entry.item, '5ml')), formatPrice(priceFor(entry.item, '10ml')))}</small>
        </button>
      `;
    }).join('') + `
      <button type="button" class="ink-series-card ink-series-all${selectedSeriesKey === 'all' ? ' is-selected' : ''}" data-series-all role="listitem" aria-pressed="${selectedSeriesKey === 'all'}">
        <span class="ink-series-card-top"><small>ALL</small>${selectedSeriesKey === 'all' ? `<em>${c.selected}</em>` : ''}</span>
        <strong>${c.all}</strong>
        <span>${c.allBody(count)}</span>
        <small>${brandName(parent)}</small>
      </button>
    `;

    $$('.ink-series-card[data-series-key]', grid).forEach(button => {
      button.addEventListener('click', () => {
        const entry = entries.find(item => item.key === button.dataset.seriesKey);
        if (entry) selectSeries(app, entry);
      });
    });
    $('[data-series-all]', grid)?.addEventListener('click', () => selectAll(app, parent));
  }

  const parentKeys = new Set(familyKeys(parent));
  $$('.ink-store-quick button[data-brand]', app).forEach(button => {
    button.classList.toggle('is-series-parent', parentKeys.has(normalize(button.dataset.brand || '')));
  });

  if (!selectedSeriesKey) {
    setResultsVisibility(app, false);
    setText($('[data-ink-store-stats]', app), c.chooseFirst);
  }
}

function selectSeries(app, entry) {
  selectedSeriesKey = entry.key;
  selectedItemId = entry.item.id;
  filterPasses = 0;
  const input = $('.ink-store-search', app);
  if (!input) return;

  clearResultFilter(app);
  app.classList.add('is-series-resolving');
  const loading = $('.ink-series-loading', app);
  if (loading) loading.hidden = false;

  input.value = seriesName(entry.item);
  lastInputValue = input.value;
  setResultsVisibility(app, true);
  renderSeries(app);
  input.dispatchEvent(new Event('input', { bubbles: true }));
  scheduleSeriesFilter(app);
}

function selectAll(app, parent) {
  selectedSeriesKey = 'all';
  selectedItemId = '';
  clearResultFilter(app);
  const input = $('.ink-store-search', app);
  if (!input) return;
  input.value = brandName(parent);
  lastInputValue = input.value;
  setResultsVisibility(app, true);
  renderSeries(app);
  input.dispatchEvent(new Event('input', { bubbles: true }));
}

function scheduleSeriesFilter(app) {
  clearTimeout(filterTimer);
  filterTimer = setTimeout(() => applySeriesFilter(app), 24);
}

function applySeriesFilter(app) {
  if (!selectedItemId || selectedSeriesKey === 'all') {
    clearResultFilter(app);
    return;
  }

  const more = $('.ink-store-more', app);
  if (more && !more.hidden && filterPasses < 20) {
    filterPasses += 1;
    more.click();
    return;
  }

  const parent = findParentGroup(selectedBrandKey);
  const entry = parent ? selectedEntry(parent) : null;
  let visible = 0;
  $$('.ink-store-result', app).forEach(card => {
    const match = card.dataset.itemId === selectedItemId;
    card.classList.toggle('is-series-filter-hidden', !match);
    if (match) visible += 1;
  });

  app.classList.remove('is-series-resolving');
  const loading = $('.ink-series-loading', app);
  if (loading) loading.hidden = true;

  if (entry) {
    setText($('[data-store-result]', app), `${brandName(entry.group)} · ${seriesName(entry.item)}`);
    setText($('[data-ink-store-stats]', app), copy().stats(brandName(entry.group), seriesName(entry.item), entry.colorCount || visible));
  }
  $('.ink-store-result-head', app)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function handleBrandSelection(app, value) {
  const parent = findParentGroup(value);
  if (!parent) return false;
  selectedBrandKey = parent.brandEn || parent.brandKo;
  selectedSeriesKey = '';
  selectedItemId = '';
  clearResultFilter(app);
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
      resetToBrands(app, false);
      return;
    }

    const parent = findParentGroup(value);
    if (parent) {
      handleBrandSelection(app, value);
      return;
    }

    if (selectedSeriesKey && selectedSeriesKey !== 'all') {
      const currentParent = findParentGroup(selectedBrandKey);
      const entry = currentParent ? selectedEntry(currentParent) : null;
      if (entry && normalize(value) === normalize(seriesName(entry.item))) return;
    }

    if (selectedSeriesKey === 'all') {
      const currentParent = findParentGroup(selectedBrandKey);
      if (currentParent && normalize(value) === normalize(brandName(currentParent))) return;
    }

    selectedBrandKey = '';
    selectedSeriesKey = '';
    selectedItemId = '';
    clearResultFilter(app);
    const shell = $('.ink-series-nav', app);
    if (shell) shell.hidden = true;
    setResultsVisibility(app, true);
  });

  window.addEventListener('blueblack:ink-results-rendered', () => {
    updateWorkflowSteps(app);
    if (selectedBrandKey) renderSeries(app);
    if (selectedItemId) scheduleSeriesFilter(app);
  });
}

function init() {
  const app = document.querySelector('#ink-store-app');
  if (!app) return;
  ensureShell(app);
  updateWorkflowSteps(app);
  bind(app);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
