const COPY={
  ko:{
    steps:[['1','브랜드·색상 검색','브랜드나 색상명을 입력하세요.'],['2','용량 선택','5ml·10ml·본병 가격을 비교하세요.'],['3','직원 확인','담은 목록을 직원에게 보여주세요.']],
    popular:'추천 브랜드',all:'전체 브랜드',showAll:n=>`전체 ${n}개 브랜드 보기`,showPopular:'추천 브랜드만 보기',
    active:'현재 검색',clear:'조건 지우기',cartClose:'목록 닫기',cartHint:'담은 잉크를 한눈에 확인하세요',
    results:'조건에 맞는 잉크',tip:'색상은 화면과 실물이 다를 수 있어요. 매장 발색표와 함께 확인해 주세요.'
  },
  en:{
    steps:[['1','Search','Enter a brand, series or color.'],['2','Choose a size','Compare 5ml, 10ml and bottle prices.'],['3','Show staff','Open your saved list at the counter.']],
    popular:'Recommended',all:'All brands',showAll:n=>`View all ${n} brands`,showPopular:'Show recommended only',
    active:'Current search',clear:'Clear filters',cartClose:'Close list',cartHint:'Review your selected inks',
    results:'Matching inks',tip:'Screen colors may differ from the actual ink. Please check the store swatch chart.'
  }
};

const POPULAR=['sailor','pilot','platinum','diamine','pelikan','lamy','dominantindustry','ferriswheelpress','lennontoolbar','jherbin','kakimori','colorverse'];
const q=(s,r=document)=>r.querySelector(s),qa=(s,r=document)=>[...r.querySelectorAll(s)];
const lang=()=>document.documentElement.lang?.toLowerCase().startsWith('ko')?'ko':'en';
const t=()=>COPY[lang()];
const normalize=v=>String(v||'').toLowerCase().normalize('NFKC').replace(/[\s._&()\-·'’]/g,'');
let brandMode='popular';
let observerQueued=false;

function ensureSteps(app){
  const intro=q('.ink-store-search-card>p',app);
  if(!intro||q('.ink-consumer-steps',app))return;
  const wrap=document.createElement('div');
  wrap.className='ink-consumer-steps';
  wrap.setAttribute('aria-label',lang()==='ko'?'이용 순서':'How it works');
  wrap.innerHTML=t().steps.map(([no,title,body])=>`<div><b>${no}</b><span><strong>${title}</strong><small>${body}</small></span></div>`).join('');
  intro.after(wrap);
}

function ensureBrandControls(app){
  const head=q('.ink-store-quick-head',app),grid=q('.ink-store-quick',app);
  if(!head||!grid)return;
  let controls=q('.ink-consumer-brand-controls',head);
  if(!controls){
    controls=document.createElement('div');
    controls.className='ink-consumer-brand-controls';
    controls.innerHTML=`<div role="group" aria-label="Brand display"><button type="button" data-brand-mode="popular"></button><button type="button" data-brand-mode="all"></button></div><button type="button" class="ink-consumer-brand-toggle"></button>`;
    const note=q('.ink-brand-guide-note',head);
    (note||q('[data-store-quick]',head))?.after(controls);
    controls.addEventListener('click',event=>{
      const mode=event.target.closest('[data-brand-mode]')?.dataset.brandMode;
      if(mode){brandMode=mode;applyBrandMode(app);return;}
      if(event.target.closest('.ink-consumer-brand-toggle')){brandMode=brandMode==='all'?'popular':'all';applyBrandMode(app);}
    });
  }
  applyBrandMode(app);
}

function applyBrandMode(app){
  const cards=qa('.ink-store-quick button[data-brand]',app);
  if(!cards.length)return;
  cards.forEach(card=>{
    const key=normalize(card.dataset.brand||card.textContent);
    const popular=POPULAR.some(name=>key.includes(name)||name.includes(key));
    card.classList.toggle('is-consumer-hidden',brandMode==='popular'&&!popular);
  });
  qa('[data-brand-mode]',app).forEach(button=>{
    const selected=button.dataset.brandMode===brandMode;
    button.classList.toggle('is-selected',selected);
    button.setAttribute('aria-pressed',String(selected));
    button.textContent=button.dataset.brandMode==='popular'?t().popular:t().all;
  });
  const toggle=q('.ink-consumer-brand-toggle',app);
  if(toggle)toggle.textContent=brandMode==='all'?t().showPopular:t().showAll(cards.length);
  q('.ink-store-quick',app)?.classList.toggle('is-all-brands',brandMode==='all');
}

function ensureActiveSummary(app){
  const search=q('.ink-store-search-field',app);
  if(!search)return;
  let bar=q('.ink-consumer-active',app);
  if(!bar){
    bar=document.createElement('div');
    bar.className='ink-consumer-active';
    bar.innerHTML='<span></span><button type="button"></button>';
    search.after(bar);
    q('button',bar).addEventListener('click',()=>{
      const input=q('.ink-store-search',app);
      if(input){input.value='';input.dispatchEvent(new Event('input',{bubbles:true}));}
      qa('.ink-store-filter-buttons button',app).filter(button=>button.dataset.filter==='all').forEach(button=>button.click());
    });
  }
  updateActiveSummary(app);
}

function updateActiveSummary(app){
  const bar=q('.ink-consumer-active',app);if(!bar)return;
  const input=q('.ink-store-search',app)?.value.trim()||'';
  const selected=qa('.ink-store-filter-buttons button.is-selected',app).map(button=>button.textContent.trim()).filter(text=>text&&text!=='전체'&&text!=='All');
  const pieces=[input?`“${input}”`:'',...selected].filter(Boolean);
  bar.hidden=!pieces.length;
  q('span',bar).textContent=pieces.length?`${t().active} · ${pieces.join(' · ')}`:'';
  q('button',bar).textContent=t().clear;
}

function ensureResultTip(app){
  const head=q('.ink-store-result-head',app);if(!head)return;
  let tip=q('.ink-consumer-result-tip',app);
  if(!tip){
    tip=document.createElement('p');tip.className='ink-consumer-result-tip';head.after(tip);
  }
  tip.textContent=t().tip;
}

function ensureCartDrawer(app){
  const aside=q('.ink-store-list-card',app),dock=q('.ink-store-mobile-dock');
  if(!aside)return;
  let close=q('.ink-consumer-cart-close',aside);
  if(!close){
    close=document.createElement('button');
    close.type='button';close.className='ink-consumer-cart-close';close.setAttribute('aria-label',t().cartClose);close.textContent='×';
    aside.prepend(close);close.addEventListener('click',closeCart);
  }
  let hint=q('.ink-consumer-cart-hint',aside);
  if(!hint){hint=document.createElement('small');hint.className='ink-consumer-cart-hint';hint.textContent=t().cartHint;q('.ink-store-list-card>p',aside)?.after(hint);}
  let overlay=q('.ink-consumer-overlay');
  if(!overlay){overlay=document.createElement('button');overlay.type='button';overlay.className='ink-consumer-overlay';overlay.setAttribute('aria-label',t().cartClose);overlay.addEventListener('click',closeCart);document.body.append(overlay);}
  if(dock&&!dock.dataset.consumerBound){
    dock.dataset.consumerBound='true';
    dock.addEventListener('click',event=>{
      if(!matchMedia('(max-width:760px)').matches)return;
      event.preventDefault();event.stopImmediatePropagation();openCart();
    },true);
  }
  syncDockState(app);
}

function openCart(){
  const aside=q('.ink-store-list-card');if(!aside)return;
  aside.classList.add('is-consumer-open');document.body.classList.add('ink-consumer-cart-open');
  q('.ink-consumer-cart-close',aside)?.focus({preventScroll:true});
}
function closeCart(){q('.ink-store-list-card')?.classList.remove('is-consumer-open');document.body.classList.remove('ink-consumer-cart-open');}
function syncDockState(app){
  const dock=q('.ink-store-mobile-dock');if(!dock)return;
  const count=Number(q('[data-ink-store-count]',dock)?.textContent||0);
  dock.classList.toggle('has-items',count>0);
}

function bindInteractions(app){
  if(app.dataset.consumerUxBound)return;
  app.dataset.consumerUxBound='true';
  app.addEventListener('input',()=>requestAnimationFrame(()=>updateActiveSummary(app)));
  app.addEventListener('click',()=>setTimeout(()=>{updateActiveSummary(app);syncDockState(app);},30));
  window.addEventListener('resize',()=>{if(!matchMedia('(max-width:760px)').matches)closeCart();});
  document.addEventListener('keydown',event=>{if(event.key==='Escape')closeCart();});
}

function enhance(){
  const app=q('#ink-store-app');if(!app)return;
  ensureSteps(app);ensureBrandControls(app);ensureActiveSummary(app);ensureResultTip(app);ensureCartDrawer(app);bindInteractions(app);
  updateActiveSummary(app);syncDockState(app);
  document.documentElement.dataset.consumerUx='ready';
}

function scheduleEnhance(){if(observerQueued)return;observerQueued=true;requestAnimationFrame(()=>{observerQueued=false;enhance();});}
function init(){
  enhance();
  const app=q('#ink-store-app');if(app)new MutationObserver(scheduleEnhance).observe(app,{childList:true,subtree:true,characterData:true});
  new MutationObserver(scheduleEnhance).observe(document.body,{childList:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
