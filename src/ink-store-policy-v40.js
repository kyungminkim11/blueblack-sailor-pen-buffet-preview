const stampText='소분 잉크는 5ml·10ml 구분 없이 병당 도장 1개가 적립되며, 도장 15개를 모으면 5ml 소분 잉크 1병으로 교환할 수 있습니다.';
const chartText='컬러차트(발색표)는 2층 매장 테이블에 있습니다. 브랜드별·색상 추천별·블루블랙 펜샵 한정 잉크 차트를 참고하고, 찾기 어렵다면 직원에게 문의해 주세요.';
function makeNotice(text){const node=document.createElement('div');node.className='ink-notice ink-store-policy';node.textContent=text;return node;}
function renderPolicyCard(){
  const anchor=document.querySelector('.ink-store-search-field');
  if(!anchor||document.querySelector('.ink-store-policy-card'))return;
  const card=document.createElement('section');
  card.className='ink-store-policy-card';
  card.innerHTML=`<div><b>15</b><p><strong>소분 잉크 도장 적립</strong><span>${stampText}</span></p></div><div><b>2F</b><p><strong>컬러차트 안내</strong><span>${chartText}</span></p></div>`;
  anchor.after(card);
}
function renderInkStorePolicy(){
  renderPolicyCard();
  const notices=document.querySelector('.ink-notices');
  if(!notices||notices.querySelector('.ink-store-policy'))return;
  notices.prepend(makeNotice(stampText),makeNotice(chartText));
}
function addPolicyStyle(){
  if(document.querySelector('[data-ink-store-policy-style]'))return;
  const style=document.createElement('style');
  style.dataset.inkStorePolicyStyle='v40';
  style.textContent='.ink-store-policy-card{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:14px}.ink-store-policy-card>div{display:grid;grid-template-columns:42px 1fr;gap:10px;padding:12px;border:1px solid #d8ccb9;border-radius:15px;background:#fffaf2}.ink-store-policy-card>div+div{border-color:#c9d4e0;background:#f5f8fb}.ink-store-policy-card b{display:grid;place-items:center;width:40px;height:40px;border:2px dashed #a87938;border-radius:50%;background:#fff;color:#10233f;font-size:13px}.ink-store-policy-card p{margin:0}.ink-store-policy-card strong,.ink-store-policy-card span{display:block}.ink-store-policy-card strong{color:#10233f;font-size:12px}.ink-store-policy-card span{margin-top:4px;color:#5f6d7e;font-size:10px;line-height:1.5}.ink-store-policy{font-weight:800!important}@media(max-width:680px){.ink-store-policy-card{grid-template-columns:1fr}}';
  document.head.append(style);
}
function initInkStorePolicy(){addPolicyStyle();renderInkStorePolicy();new MutationObserver(renderInkStorePolicy).observe(document.body,{childList:true,subtree:true});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initInkStorePolicy,{once:true});else initInkStorePolicy();
