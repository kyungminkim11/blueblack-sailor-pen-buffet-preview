import {INK_I18N} from './ink-price-i18n-copy-v43.js';

const KO_COUNTRIES={kr:'한국',jp:'일본',de:'독일',fr:'프랑스',it:'이탈리아',uk:'영국',us:'미국',tw:'대만',ph:'필리핀',au:'호주',ca:'캐나다',other:'기타'};
const KO_TYPES={standard:'기본/스탠다드',shimmer:'쉬머·펄',pigment:'피그먼트/방수',scented:'향 잉크',calligraphy:'캘리그라피',special:'스페셜',other:'기타'};
const EXTRA={
  en:{zoomOut:'Zoom out',zoomIn:'Zoom in',fit:'Fit to screen',large:'Enlarge',sharePage:'Share this page',resultCount:'results',seriesBody:'Select a series to view only its colors and decant prices.'},
  ja:{zoomOut:'縮小',zoomIn:'拡大',fit:'画面に合わせる',large:'大きく表示',sharePage:'このページを共有',resultCount:'件',seriesBody:'シリーズを選ぶと、そのシリーズの色と小分け価格だけを表示します。'},
  'zh-Hans':{zoomOut:'缩小',zoomIn:'放大',fit:'适应画面',large:'放大查看',sharePage:'分享当前页面',resultCount:'项',seriesBody:'选择系列后，仅显示该系列的颜色和分装价格。'},
  'zh-Hant':{zoomOut:'縮小',zoomIn:'放大',fit:'適應畫面',large:'放大查看',sharePage:'分享目前頁面',resultCount:'項',seriesBody:'選擇系列後，僅顯示該系列的顏色和分裝價格。'}
};

let queued=false;
let applying=false;

function language(){
  const value=(document.documentElement.lang||'ko').toLowerCase();
  if(value.includes('hant')||value.includes('tw')||value.includes('hk'))return'zh-Hant';
  if(value.startsWith('zh'))return'zh-Hans';
  if(value.startsWith('ja'))return'ja';
  if(value.startsWith('en'))return'en';
  return'ko';
}
function copy(){return INK_I18N[language()]||null;}
function extra(){return EXTRA[language()]||null;}
function setText(target,value){
  if(value==null)return;
  const nodes=typeof target==='string'?[...document.querySelectorAll(target)]:Array.isArray(target)?target:[target];
  nodes.filter(Boolean).forEach(node=>{if(node.textContent!==String(value))node.textContent=String(value);});
}
function setAttr(target,name,value){if(target&&value!=null&&target.getAttribute(name)!==String(value))target.setAttribute(name,String(value));}
function numbers(value=''){return String(value).match(/\d+/g)?.map(Number)||[];}
function reverseMap(kind){
  const base=kind==='country'?KO_COUNTRIES:KO_TYPES;
  const result=new Map();
  Object.entries(base).forEach(([key,label])=>result.set(label,key));
  Object.values(INK_I18N).forEach(locale=>Object.entries(kind==='country'?locale.countries:locale.types).forEach(([key,label])=>result.set(label,key)));
  return result;
}
const COUNTRY_REVERSE=reverseMap('country');
const TYPE_REVERSE=reverseMap('type');

function applyHeader(value){
  document.title=`BlueBlack · ${value.title}`;
  setText('[data-ink-title]',value.title);
  setText('[data-ink-intro]',value.intro);
}
function applyStore(value){
  setText('[data-store-title]',value.storeTitle);
  setText('[data-store-body]',value.storeBody);
  const input=document.querySelector('.ink-store-search');
  setAttr(input,'placeholder',value.placeholder);
  setText('[data-store-quick]',value.quick);
  setText('[data-store-filter-summary]',value.filters);
  setText('[data-store-country]',value.country);
  setText('[data-store-type]',value.type);
  if(!document.body.classList.contains('ink-series-selected'))setText('[data-store-result]',input?.value?.trim()?value.result:value.initialTitle);
  setText('[data-store-list-title]',value.listTitle);
  setText('[data-store-list-body]',value.listBody);
  setText('[data-store-total-label]',value.total);
  setText('.ink-store-share',value.share);
  setText('.ink-store-show',value.showStaff);
  setText('.ink-store-reset',value.newCustomer);
  setText('.ink-store-pricing-note',value.pricing);
  setText('.ink-store-disclaimer',value.disclaimer);
  setText('[data-store-notice-summary]',value.noticeSummary);
  setText('[data-store-original-summary]',value.originalSummary);
  setText('.ink-store-mobile-dock > span',value.listTitle);

  document.querySelectorAll('.ink-store-country button[data-filter]').forEach(button=>setText(button,button.dataset.filter==='all'?value.all:value.countries[button.dataset.filter]||button.textContent));
  document.querySelectorAll('.ink-store-type button[data-filter]').forEach(button=>setText(button,button.dataset.filter==='all'?value.all:value.types[button.dataset.filter]||button.textContent));

  const stats=document.querySelector('[data-ink-store-stats]');
  if(stats){const nums=numbers(stats.textContent);if(nums.length>=3)setText(stats,value.stats(nums[0],nums[1],nums[2]));else if(!input?.value?.trim())setText(stats,value.initialBody);}
  const empty=document.querySelector('.ink-store-empty');
  if(empty){setText(empty.querySelector('strong'),value.emptyTitle);setText(empty.querySelector('span'),value.emptyBody);}
  setText('.ink-store-list-empty',value.emptyList);
  document.querySelectorAll('.ink-store-volume').forEach(button=>setText(button.querySelector('small'),button.classList.contains('is-selected')?`✓ ${value.selected}`:value.add));
  document.querySelectorAll('.ink-store-manual').forEach(label=>{setText(label.querySelector('span'),value.manualColor);setAttr(label.querySelector('input'),'placeholder',value.manualPlaceholder);});
  document.querySelectorAll('[data-remove-index]').forEach(button=>setAttr(button,'aria-label',value.remove));

  const more=document.querySelector('.ink-store-more');
  if(more&&!more.hidden){const n=numbers(more.textContent).pop();if(Number.isFinite(n))more.innerHTML=`${value.more}<small>${value.remaining(n)}</small>`;else setText(more,value.more);}
  const dialog=document.querySelector('.ink-store-dialog');
  if(dialog){setText(dialog.querySelector('h2'),value.listTitle);setText(dialog.querySelector('.ink-store-dialog-total span'),value.total);setText(dialog.querySelector('.ink-store-dialog-share'),value.share);setText(dialog.querySelector('.ink-store-dialog-print'),value.print);setAttr(dialog.querySelector('.ink-store-dialog-close'),'aria-label',value.close);}
}
function applyTags(value){
  document.querySelectorAll('.ink-store-tags').forEach(tags=>{
    const spans=tags.querySelectorAll('span');
    const countryKey=COUNTRY_REVERSE.get(spans[0]?.textContent?.trim());
    if(countryKey)setText(spans[0],value.countries[countryKey]);
    if(spans[1]){
      const translated=spans[1].textContent.split('·').map(part=>part.trim()).map(label=>{const key=TYPE_REVERSE.get(label);return key?value.types[key]:label;}).join(' · ');
      setText(spans[1],translated);
    }
  });
}
function applyBrandPicker(value){
  setText('.ink-store-all-brands',value.allBrands);
  const dialog=document.querySelector('.ink-brand-picker-dialog');
  if(!dialog)return;
  setText(dialog.querySelector('.ink-brand-picker-head h2'),value.brandTitle);
  setText(dialog.querySelector('.ink-brand-picker-head p'),value.brandBody);
  setText(dialog.querySelector('.ink-brand-picker-search span'),value.brandSearch);
  setAttr(dialog.querySelector('.ink-brand-picker-search input'),'placeholder',value.brandPlaceholder);
  const count=dialog.querySelector('[data-brand-picker-count]');
  if(count){const n=numbers(count.textContent)[0];if(Number.isFinite(n))setText(count,value.brandCount(n));}
  setAttr(dialog.querySelector('.ink-brand-picker-close'),'aria-label',value.close);
  setText(dialog.querySelector('[data-brand-page-prev]'),value.previous);
  setText(dialog.querySelector('[data-brand-page-next]'),value.next);
}
function applySeries(value,aux){
  const panel=document.querySelector('.ink-series-step');
  if(!panel)return;
  setText(panel.querySelector('.ink-series-step-head > div > span'),value.seriesStep);
  setText(panel.querySelector('.ink-series-step-head p'),aux.seriesBody);
  setText(panel.querySelector('.ink-series-brand-again'),value.chooseOtherBrand);
  setText(panel.querySelector('.ink-series-change'),value.changeSeries);
  setText(panel.querySelector('.ink-series-selected-copy > span'),value.selectedSeries);
  panel.querySelectorAll('.ink-series-option small').forEach(node=>{const n=numbers(node.textContent)[0];setText(node,Number.isFinite(n)?value.colors(n):value.manual);});
}
function applyBottle(value){
  document.querySelectorAll('.ink-bottle-info').forEach(node=>{
    setText(node.querySelector('span'),value.bottle);
    const status=node.querySelector('em');
    if(!status)return;
    const current=status.textContent.trim();
    const loadingWords=['조회 중','Loading','照会中','確認中','查询中','查詢中'];
    const missingWords=['정보 확인','Check info','要確認','请确认','請確認','가격 확인','Ask staff','スタッフ確認','请咨询店员','請詢問店員'];
    if(loadingWords.includes(current))setText(status,value.loading);
    if(missingWords.includes(current))setText(status,value.missing);
  });
}
function applyViewer(value,aux){
  document.querySelectorAll('.ink-tabs button').forEach((button,index)=>setText(button,value.viewerTabs[index]));
  setText('[data-ink-page-label]',value.page);
  const selected=[...document.querySelectorAll('.ink-tabs button')].findIndex(button=>button.getAttribute('aria-selected')==='true');
  if(selected>=0)setText('[data-ink-current]',value.viewerTabs[selected]);
  setText('[data-ink-source-label]',value.source);
  setText('[data-ink-source-copy]',value.sourceCopy);
  setText('.ink-prev-page',`← ${value.previous}`);
  setText('.ink-next-page',`${value.next} →`);
  setText('.ink-zoom-reset',aux.fit);
  setText('.ink-fullscreen',aux.large);
  setText('.ink-share-page',aux.sharePage);
  setAttr(document.querySelector('.ink-zoom-out'),'aria-label',aux.zoomOut);
  setAttr(document.querySelector('.ink-zoom-in'),'aria-label',aux.zoomIn);
  const notices=[...document.querySelectorAll('.ink-notices .ink-notice:not(.ink-store-policy)')];
  value.viewerNotices.forEach((text,index)=>setText(notices[index],text));
}
function applyPolicy(value){
  const cards=document.querySelectorAll('.ink-store-policy-card > div');
  if(cards[0]){setText(cards[0].querySelector('strong'),value.stampTitle);setText(cards[0].querySelector('span'),value.stampText);}
  if(cards[1]){setText(cards[1].querySelector('strong'),value.chartTitle);setText(cards[1].querySelector('span'),value.chartText);}
  const notices=document.querySelectorAll('.ink-notices .ink-store-policy');
  if(notices[0])setText(notices[0],value.stampText);
  if(notices[1])setText(notices[1],value.chartText);
}
function apply(){
  if(applying)return;
  const value=copy();const aux=extra();
  if(!value||!aux)return;
  applying=true;
  try{applyHeader(value);applyStore(value);applyTags(value);applyBrandPicker(value);applySeries(value,aux);applyBottle(value);applyViewer(value,aux);applyPolicy(value);}finally{applying=false;}
}
function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;apply();});}
function init(){
  apply();
  new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class','hidden','aria-selected']});
  new MutationObserver(schedule).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  document.querySelectorAll('[data-portal-lang]').forEach(button=>button.addEventListener('click',()=>{setTimeout(apply,40);setTimeout(apply,180);}));
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
