import {
  brandGroups,
  brandName,
  currentLang,
  formatPrice,
  priceFor,
  priceItemForColor,
  seriesName
} from './ink-catalog-model-v22.js';

const COPY={
  ko:{step:'2단계 · 시리즈 선택',title:brand=>`${brand} 시리즈를 선택해 주세요`,body:'시리즈를 고르면 해당 시리즈의 색상과 소분 가격만 보여드립니다.',colors:n=>`${n}가지 색상`,manual:'색상은 매장에서 확인',choose:'시리즈 선택',change:'다른 시리즈 선택',brandAgain:'브랜드 다시 선택',selected:'선택한 시리즈',result:n=>`${n}가지 색상 · 5ml / 10ml 가격`,noSeries:'선택할 수 있는 시리즈가 없습니다.'},
  en:{step:'STEP 2 · CHOOSE A SERIES',title:brand=>`Choose a ${brand} series`,body:'Select a series to show only its colors and decant prices.',colors:n=>`${n} colors`,manual:'Confirm colors in store',choose:'Choose series',change:'Change series',brandAgain:'Choose another brand',selected:'Selected series',result:n=>`${n} colors · 5ml / 10ml prices`,noSeries:'No series are available.'},
  ja:{step:'ステップ2 · シリーズ選択',title:brand=>`${brand}のシリーズを選択`,body:'シリーズを選ぶと、そのシリーズの色と小分け価格だけを表示します。',colors:n=>`${n}色`,manual:'色は店頭で確認',choose:'シリーズを選択',change:'別のシリーズ',brandAgain:'ブランドを選び直す',selected:'選択中のシリーズ',result:n=>`${n}色 · 5ml / 10ml価格`,noSeries:'選択できるシリーズがありません。'},
  'zh-Hans':{step:'第2步 · 选择系列',title:brand=>`选择${brand}系列`,body:'选择系列后，仅显示该系列的颜色和分装价格。',colors:n=>`${n}种颜色`,manual:'请在店内确认颜色',choose:'选择系列',change:'更换系列',brandAgain:'重新选择品牌',selected:'已选系列',result:n=>`${n}种颜色 · 5ml / 10ml价格`,noSeries:'没有可选系列。'},
  'zh-Hant':{step:'第2步 · 選擇系列',title:brand=>`選擇${brand}系列`,body:'選擇系列後，僅顯示該系列的顏色和分裝價格。',colors:n=>`${n}種顏色`,manual:'請在店內確認顏色',choose:'選擇系列',change:'更換系列',brandAgain:'重新選擇品牌',selected:'已選系列',result:n=>`${n}種顏色 · 5ml / 10ml價格`,noSeries:'沒有可選系列。'}
};

let groups=[];
let panel;
let activeGroup=null;
let activeItem=null;
let programmaticInput=false;
let resultObserver;

function text(){return COPY[currentLang()]||COPY.ko;}
function escapeHtml(value=''){return String(value).replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));}
function waitFor(selector,timeout=8000){return new Promise(resolve=>{const found=document.querySelector(selector);if(found)return resolve(found);const observer=new MutationObserver(()=>{const node=document.querySelector(selector);if(node){observer.disconnect();resolve(node);}});observer.observe(document.body,{childList:true,subtree:true});setTimeout(()=>{observer.disconnect();resolve(document.querySelector(selector));},timeout);});}
function colorCount(group,item){return group.colors.filter(color=>priceItemForColor(color,group)?.id===item.id).length;}
function groupFromButton(button){
  const brandEn=button.dataset.brand;
  if(brandEn)return groups.find(group=>group.brandEn===brandEn);
  const label=button.querySelector('span')?.textContent?.trim()||button.textContent?.trim()||'';
  return groups.find(group=>[brandName(group),group.brandKo,group.brandEn].some(name=>String(name||'').trim()===label));
}
function setQuery(value){
  const input=document.querySelector('.ink-store-search');
  if(!input)return;
  programmaticInput=true;
  input.value=value;
  input.dispatchEvent(new Event('input',{bubbles:true}));
  programmaticInput=false;
}
function clearSeriesParams(){
  const url=new URL(location.href);
  url.searchParams.delete('brand');
  url.searchParams.delete('series');
  history.replaceState(null,'',url);
}
function saveSeriesParams(group,item){
  const url=new URL(location.href);
  url.searchParams.set('brand',group.brandEn);
  url.searchParams.set('series',item.id);
  history.replaceState(null,'',url);
}
function seriesButton(group,item){
  const count=colorCount(group,item);
  const button=document.createElement('button');
  button.type='button';
  button.className='ink-series-option';
  button.dataset.seriesId=item.id;
  button.innerHTML=`<span class="ink-series-option-name">${escapeHtml(seriesName(item))}</span><small>${escapeHtml(count?text().colors(count):text().manual)}</small><strong><i>5ml</i> ${escapeHtml(formatPrice(priceFor(item,'5ml')))} <em>·</em> <i>10ml</i> ${escapeHtml(formatPrice(priceFor(item,'10ml')))}</strong>`;
  button.addEventListener('click',()=>selectSeries(group,item));
  return button;
}
function renderChoosing(group){
  activeGroup=group;
  activeItem=null;
  document.body.classList.add('ink-series-choosing');
  document.body.classList.remove('ink-series-selected');
  panel.hidden=false;
  panel.className='ink-series-step is-choosing';
  panel.innerHTML=`<div class="ink-series-step-head"><div><span>${escapeHtml(text().step)}</span><h3>${escapeHtml(text().title(brandName(group)))}</h3><p>${escapeHtml(text().body)}</p></div><button type="button" class="ink-series-brand-again">${escapeHtml(text().brandAgain)}</button></div><div class="ink-series-options"></div>`;
  const root=panel.querySelector('.ink-series-options');
  const items=[...group.priceItems].sort((a,b)=>seriesName(a).localeCompare(seriesName(b),currentLang()==='ko'?'ko':'en'));
  if(!items.length)root.innerHTML=`<div class="ink-series-empty">${escapeHtml(text().noSeries)}</div>`;
  else root.replaceChildren(...items.map(item=>seriesButton(group,item)));
  panel.querySelector('.ink-series-brand-again').addEventListener('click',resetSeriesStep);
  requestAnimationFrame(()=>{
    panel.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth',block:'nearest'});
    panel.querySelector('.ink-series-option')?.focus({preventScroll:true});
  });
}
function renderSelected(group,item){
  const count=colorCount(group,item);
  panel.hidden=false;
  panel.className='ink-series-step is-selected';
  panel.innerHTML=`<div class="ink-series-selected-copy"><span>${escapeHtml(text().selected)}</span><strong>${escapeHtml(brandName(group))} <i>›</i> ${escapeHtml(seriesName(item))}</strong><small>${escapeHtml(text().result(count))}</small></div><button type="button" class="ink-series-change">${escapeHtml(text().change)}</button>`;
  panel.querySelector('.ink-series-change').addEventListener('click',()=>renderChoosing(group));
}
function applySelectedFilter(){
  if(!activeItem)return;
  const results=document.querySelector('.ink-store-results');
  if(!results)return;
  results.querySelectorAll('.ink-store-result').forEach(card=>{card.hidden=card.dataset.itemId!==activeItem.id;});
  const count=colorCount(activeGroup,activeItem);
  const stats=document.querySelector('[data-ink-store-stats]');
  const heading=document.querySelector('[data-store-result]');
  if(stats)stats.textContent=text().result(count);
  if(heading)heading.textContent=`${brandName(activeGroup)} · ${seriesName(activeItem)}`;
}
function selectSeries(group,item,{restore=false}={}){
  activeGroup=group;
  activeItem=item;
  document.body.classList.remove('ink-series-choosing');
  document.body.classList.add('ink-series-selected');
  renderSelected(group,item);
  setQuery(seriesName(item));
  saveSeriesParams(group,item);
  queueMicrotask(applySelectedFilter);
  if(!restore)requestAnimationFrame(()=>document.querySelector('.ink-store-result-head')?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth',block:'start'}));
}
function chooseBrand(group){
  if(!group)return;
  document.querySelector('.ink-brand-picker-dialog[open]')?.close();
  setQuery('');
  clearSeriesParams();
  renderChoosing(group);
}
function resetSeriesStep(){
  activeGroup=null;
  activeItem=null;
  document.body.classList.remove('ink-series-choosing','ink-series-selected');
  panel.hidden=true;
  panel.innerHTML='';
  clearSeriesParams();
  setQuery('');
  document.querySelector('.ink-store-quick-head')?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth',block:'center'});
}
function addStyles(){
  if(document.querySelector('[data-ink-series-step-style]'))return;
  const style=document.createElement('style');
  style.dataset.inkSeriesStepStyle='v34';
  style.textContent=`
.ink-series-step{margin-top:15px;padding:16px;border:1px solid #cfc2ae;border-radius:19px;background:linear-gradient(145deg,#fffdf9,#f5efe5);box-shadow:0 10px 24px rgba(16,35,63,.06)}
.ink-series-step[hidden]{display:none!important}.ink-series-step-head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px}.ink-series-step-head span,.ink-series-selected-copy>span{display:block;color:#9a6d2e;font-size:10px;font-weight:900;letter-spacing:.11em}.ink-series-step-head h3{margin:5px 0 0;color:#10233f;font-size:19px;line-height:1.3}.ink-series-step-head p{margin:6px 0 0;color:#68778a;font-size:12px;line-height:1.55}
.ink-series-brand-again,.ink-series-change{flex:0 0 auto;min-height:42px;padding:0 13px;border:1px solid #d6c9b7;border-radius:12px;background:#fff;color:#40516a;font-size:11px;font-weight:900}.ink-series-brand-again:hover,.ink-series-change:hover,.ink-series-brand-again:focus-visible,.ink-series-change:focus-visible{border-color:#10233f;color:#10233f;outline:none}
.ink-series-options{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px;margin-top:13px;max-height:360px;overflow-y:auto;padding:1px 3px 3px 1px;scrollbar-width:thin}.ink-series-option{display:grid;grid-template-columns:minmax(0,1fr) auto;grid-template-areas:'name meta' 'price price';gap:5px 10px;min-height:72px;padding:12px 13px;border:1px solid #ded4c7;border-radius:14px;background:#fff;color:#10233f;text-align:left}.ink-series-option:hover,.ink-series-option:focus-visible{border-color:#10233f;outline:none;box-shadow:0 0 0 3px rgba(16,35,63,.06)}.ink-series-option-name{grid-area:name;overflow-wrap:anywhere;font-size:13px;font-weight:900}.ink-series-option small{grid-area:meta;color:#788596;font-size:10px;text-align:right}.ink-series-option strong{grid-area:price;color:#7b5a2b;font-size:11px}.ink-series-option strong i{color:#10233f;font-style:normal}.ink-series-option strong em{margin:0 4px;color:#c1b5a4;font-style:normal}.ink-series-empty{grid-column:1/-1;padding:26px;border:1px dashed #cfc2ae;border-radius:14px;background:#fff;color:#778496;text-align:center}
.ink-series-step.is-selected{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:13px 15px;border-color:#b7c4d5;background:#f5f8fb}.ink-series-selected-copy{display:grid;gap:3px;min-width:0}.ink-series-selected-copy strong{overflow-wrap:anywhere;color:#10233f;font-size:14px}.ink-series-selected-copy strong i{margin:0 5px;color:#a77b3b;font-style:normal}.ink-series-selected-copy small{color:#68778a;font-size:10px}
body.ink-series-choosing .ink-store-result-head,body.ink-series-choosing .ink-store-results,body.ink-series-choosing .ink-store-more{display:none!important}.ink-store-result[hidden]{display:none!important}
@media(max-width:680px){.ink-series-step{padding:14px;border-radius:16px}.ink-series-step-head{display:block}.ink-series-brand-again{width:100%;margin-top:10px}.ink-series-options{grid-template-columns:1fr;max-height:52dvh}.ink-series-option{min-height:68px}.ink-series-step.is-selected{align-items:stretch;flex-direction:column}.ink-series-change{width:100%}}
`;
  document.head.append(style);
}
function installResultObserver(){
  const results=document.querySelector('.ink-store-results');
  if(!results||resultObserver)return;
  resultObserver=new MutationObserver(()=>queueMicrotask(applySelectedFilter));
  resultObserver.observe(results,{childList:true,subtree:true});
}
async function init(){
  groups=brandGroups().filter(group=>group.priceItems.length);
  const quickHead=await waitFor('.ink-store-quick-head');
  if(!quickHead)return;
  addStyles();
  panel=document.createElement('section');
  panel.className='ink-series-step';
  panel.hidden=true;
  panel.setAttribute('aria-live','polite');
  quickHead.after(panel);
  installResultObserver();

  document.addEventListener('click',event=>{
    const target=event.target instanceof Element?event.target:null;
    const quickButton=target?.closest('.ink-store-quick button[data-brand]');
    const pickerButton=target?.closest('.ink-brand-picker-item');
    const button=quickButton||pickerButton;
    if(!button)return;
    const group=groupFromButton(button);
    if(!group)return;
    event.preventDefault();
    event.stopImmediatePropagation();
    chooseBrand(group);
  },true);

  const input=document.querySelector('.ink-store-search');
  input?.addEventListener('input',()=>{
    if(programmaticInput)return;
    activeGroup=null;
    activeItem=null;
    document.body.classList.remove('ink-series-choosing','ink-series-selected');
    panel.hidden=true;
    clearSeriesParams();
  },true);
  document.querySelector('.ink-store-search-clear')?.addEventListener('click',()=>{
    activeGroup=null;activeItem=null;panel.hidden=true;document.body.classList.remove('ink-series-choosing','ink-series-selected');clearSeriesParams();
  },true);

  const params=new URLSearchParams(location.search);
  const brand=params.get('brand');
  const series=params.get('series');
  if(brand&&series){
    const group=groups.find(candidate=>candidate.brandEn===brand);
    const item=group?.priceItems.find(candidate=>candidate.id===series);
    if(group&&item)selectSeries(group,item,{restore:true});
  }
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
else init();
