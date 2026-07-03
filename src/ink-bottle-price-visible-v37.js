const COPY={
  ko:{label:'본병',loading:'조회 중',missing:'정보 확인'},
  en:{label:'Bottle',loading:'Loading',missing:'Check info'},
  ja:{label:'本体',loading:'照会中',missing:'要確認'},
  'zh-Hans':{label:'整瓶',loading:'查询中',missing:'请确认'},
  'zh-Hant':{label:'整瓶',loading:'查詢中',missing:'請確認'}
};

function lang(){
  const value=document.documentElement.lang||'ko';
  if(value.startsWith('zh-Hant'))return'zh-Hant';
  if(value.startsWith('zh'))return'zh-Hans';
  if(value.startsWith('ja'))return'ja';
  if(value.startsWith('en'))return'en';
  return'ko';
}
function text(){return COPY[lang()]||COPY.ko;}
function ensureBadge(card){
  const copy=card.querySelector('.ink-store-result-copy');
  if(!copy||copy.querySelector('.ink-bottle-info'))return;
  const badge=document.createElement('aside');
  badge.className='ink-bottle-info is-loading';
  badge.dataset.createdAt=String(Date.now());
  badge.innerHTML=`<span>${text().label}</span><strong>—</strong><em>${text().loading}</em>`;
  copy.classList.add('has-bottle-info');
  copy.append(badge);
  setTimeout(()=>{
    if(!badge.isConnected||!badge.classList.contains('is-loading'))return;
    badge.classList.remove('is-loading');
    badge.classList.add('is-missing');
    badge.querySelector('em').textContent=text().missing;
  },6000);
}
function scan(){
  document.querySelectorAll('.ink-store-result[data-color-id]:not([hidden])').forEach(ensureBadge);
}
function addStyles(){
  if(document.querySelector('[data-ink-bottle-visible-style]'))return;
  const style=document.createElement('style');
  style.dataset.inkBottleVisibleStyle='v37';
  style.textContent=`
.ink-store-result-copy{position:relative;min-width:0}
.ink-store-result-copy.has-bottle-info{padding-right:116px}
.ink-bottle-info{position:absolute;top:0;right:0;display:grid;grid-template-columns:auto auto;grid-template-areas:'label volume' 'price price';align-items:center;gap:1px 6px;min-width:96px;padding:8px 9px;border:1px solid #ded5c7;border-radius:12px;background:linear-gradient(180deg,#fff,#f7f2e9);box-shadow:0 5px 14px rgba(16,35,63,.055);text-align:right;pointer-events:none}
.ink-bottle-info span{grid-area:label;color:#9a7138;font-size:9px;font-weight:900}.ink-bottle-info strong{grid-area:volume;color:#566477;font-size:10px;font-weight:900}.ink-bottle-info em{grid-area:price;color:#10233f;font-size:12px;font-style:normal;font-weight:950;white-space:nowrap}
.ink-bottle-info.is-loading,.ink-bottle-info.is-missing{box-shadow:none;opacity:.75}.ink-bottle-info.is-loading em,.ink-bottle-info.is-missing em{font-size:10px;color:#718095}
@media(max-width:680px){.ink-store-result-copy.has-bottle-info{padding-right:108px}.ink-bottle-info{min-width:90px;padding:7px 8px}.ink-bottle-info em{font-size:11px}}
@media(max-width:390px){.ink-store-result-copy.has-bottle-info{padding-right:0;padding-top:50px}.ink-bottle-info{left:0;right:auto;top:0;grid-template-columns:auto auto auto;grid-template-areas:'label volume price';min-width:0;text-align:left}.ink-bottle-info em{font-size:10px}}
`;
  document.head.append(style);
}
function init(){
  addStyles();
  scan();
  new MutationObserver(()=>requestAnimationFrame(scan)).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden']});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
