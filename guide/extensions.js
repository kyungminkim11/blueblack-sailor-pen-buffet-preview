import { products as entryProducts } from './data/catalog.js';
import { premiumProducts, priceBands, scenarios, PREMIUM_VERIFIED_AT } from './data/premium.js';
import { expandedProducts } from './data/expanded-products.js';

const $=(selector,root=document)=>root.querySelector(selector);
const $$=(selector,root=document)=>[...root.querySelectorAll(selector)];
const allProducts=[...entryProducts,...premiumProducts,...expandedProducts];
const priceProducts=[...premiumProducts,...expandedProducts];
const productMap=new Map(allProducts.map(product=>[product.id,product]));
const extendedPriceBands=[...priceBands,
  {key:'80s',label:'80만원대',range:'800,000–899,999원',summary:'대형 소버란과 한정 아트 컬렉션처럼 브랜드 상위 라인과 소장성을 함께 보는 구간.'},
  {key:'100plus',label:'100만원 이상',range:'1,000,000원 이상',summary:'우루시·이탈리아 플래그십처럼 소재, 대형 닙과 브랜드 대표성을 우선하는 구간.'}
];
const formatPrice=value=>new Intl.NumberFormat('ko-KR').format(value)+'원';
const escapeHtml=value=>String(value??'').replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));

function getTier(product){
  if(product.tier)return product.tier;
  if(product.price<100000)return 'entry';
  if(product.price>=1000000)return '100plus';
  return `${Math.floor(product.price/100000)*10}s`;
}
function tierLabel(product){
  const tier=getTier(product);
  if(tier==='entry')return '10만원 이하';
  if(tier==='100plus')return '100만원 이상';
  return `${tier.replace('s','')}만원대`;
}
function highlight(product){return product.highlight||product.purposes?.[0]||'입문 추천'}
function nibDirection(product){return product.nibClass||product.nibs?.join(' · ')||'옵션 확인'}
function verifiedAt(product){return product.verifiedAt||PREMIUM_VERIFIED_AT}

function addStylesheet(){
  if(document.querySelector('link[href="./extended.css"]'))return;
  const link=document.createElement('link');link.rel='stylesheet';link.href='./extended.css';document.head.append(link);
}

function openExtensionDialog(title,subtitle,html){
  const dialog=$('#flow-dialog');
  $('#dialog-title').textContent=title;
  $('#dialog-subtitle').textContent=subtitle;
  $('#dialog-body').innerHTML=html;
  if(!dialog.open)dialog.showModal();
}

function premiumCard(product,compact=false){
  return `<article class="premium-card ${compact?'compact':''}" data-premium-card="${product.id}">
    <div class="premium-visual" style="--premium-accent:${product.accent||'#304f73'}">
      <span class="premium-tier">${tierLabel(product)}</span>
      <span class="premium-pen"></span>
    </div>
    <div class="premium-card-body">
      <span class="premium-brand">${escapeHtml(product.brand)}</span>
      <h3>${escapeHtml(product.name)}</h3>
      <strong class="premium-price">${formatPrice(product.price)}</strong>
      <div class="premium-tags"><span>${escapeHtml(highlight(product))}</span><span>${escapeHtml(product.filling)}</span></div>
      <p>${escapeHtml(product.note)}</p>
      <small>${escapeHtml(product.stock)}</small>
      <div class="premium-actions"><button type="button" data-premium-detail="${product.id}">상세 비교</button><a href="${product.url}" target="_blank" rel="noopener">공식몰 →</a></div>
    </div>
  </article>`;
}

function openPremiumProduct(id){
  const product=productMap.get(id);if(!product)return;
  const label=tierLabel(product);
  openExtensionDialog(product.name,`${product.brand} · ${label} 추천 후보`,`
    <div class="premium-dialog-hero" style="--premium-accent:${product.accent||'#304f73'}">
      <div><span>${escapeHtml(highlight(product))}</span><h3>${formatPrice(product.price)}</h3><p>${escapeHtml(product.note)}</p></div><i class="premium-pen large"></i>
    </div>
    <div class="metric-grid">
      <div class="metric"><small>가격대</small><strong>${label}</strong></div>
      <div class="metric"><small>닙 방향</small><strong>${escapeHtml(nibDirection(product))}</strong></div>
      <div class="metric"><small>충전 방식</small><strong>${escapeHtml(product.filling)}</strong></div>
    </div>
    <div class="premium-purpose-list">${(product.purposes||[]).map(item=>`<span>${escapeHtml(item)}</span>`).join('')}</div>
    <div class="info-box"><strong>구매 전 확인:</strong> ${escapeHtml(product.stock)}<br>가격은 ${verifiedAt(product)} 공식몰 표시 기준이며 옵션·행사·재고에 따라 달라질 수 있습니다.</div>
    <div class="dialog-actions"><button class="button soft" type="button" id="premium-staff">직원에게 보여줄 내용</button><a class="button navy" href="${product.url}" target="_blank" rel="noopener">공식 상품 페이지</a></div>`);
  $('#premium-staff').addEventListener('click',()=>openRequestSheet(`${label} 관심 제품: ${product.name} / 확인 가격 ${formatPrice(product.price)}`));
  document.dispatchEvent(new CustomEvent('bb:product-open',{detail:{id}}));
}

function openRequestSheet(prefill){
  const text=`[블루블랙 제품 상담]\n${prefill}\n가격·옵션·매장 재고 확인을 요청합니다.`;
  openExtensionDialog('직원에게 보여줄 상담 메모','자동 호출이 아니라 화면 제시·복사용 메모입니다.',`
    <div class="ticket" id="extension-ticket"></div>
    <div class="dialog-actions"><button class="button soft" type="button" id="extension-copy">내용 복사</button><a class="button soft" href="tel:027658868">전화하기</a><a class="button navy" href="https://blueblack.co.kr/board/%EC%83%81%ED%92%88%EB%AC%B8%EC%9D%98/6/" target="_blank" rel="noopener">공식 문의</a></div>`);
  $('#extension-ticket').textContent=text;
  $('#extension-copy').addEventListener('click',async event=>{try{await navigator.clipboard.writeText(text);event.currentTarget.textContent='복사 완료'}catch{alert('복사할 수 없습니다. 화면을 직원에게 보여주세요.')}});
}

function openScenario(id){
  const scenario=scenarios.find(item=>item.id===id);if(!scenario)return;
  const candidates=scenario.productIds.map(productId=>productMap.get(productId)).filter(Boolean);
  openExtensionDialog(scenario.title,scenario.summary,`
    <div class="scenario-dialog-head"><span>${scenario.icon}</span><div><small>SITUATION GUIDE</small><h3>${escapeHtml(scenario.title)}</h3><p>${escapeHtml(scenario.summary)}</p></div></div>
    <div class="scenario-checks"><h4>매장에서 확인할 것</h4>${scenario.tips.map((tip,index)=>`<div><b>${index+1}</b><span>${escapeHtml(tip)}</span></div>`).join('')}</div>
    <h4 class="dialog-section-title">추천 비교 후보</h4>
    <div class="scenario-product-list">${candidates.map((product,index)=>`<button type="button" data-scenario-product="${product.id}"><span>${index+1}</span><div><strong>${escapeHtml(product.name)}</strong><small>${formatPrice(product.price)} · ${escapeHtml(highlight(product))}</small></div><i>→</i></button>`).join('')}</div>
    <div class="info-box">추천 순서는 절대적인 순위가 아니라 이 상황에서 먼저 비교할 후보입니다. 실제 닙 굵기, 무게와 재고는 매장에서 확인해 주세요.</div>
    <div class="dialog-actions"><button class="button navy" type="button" id="scenario-staff">이 상황으로 상담 메모 만들기</button></div>`);
  $$('[data-scenario-product]',$('#dialog-body')).forEach(button=>button.addEventListener('click',()=>openPremiumProduct(button.dataset.scenarioProduct)));
  $('#scenario-staff').addEventListener('click',()=>openRequestSheet(`상황: ${scenario.title}\n비교 후보: ${candidates.map(item=>item.name).join(', ')}`));
}

function renderScenarios(){
  const grid=$('#scenario-grid');
  grid.innerHTML=scenarios.map((scenario,index)=>`<button class="situation-card" type="button" data-scenario="${scenario.id}"><span class="situation-icon">${scenario.icon}</span><span class="situation-count">${String(index+1).padStart(2,'0')}</span><strong>${escapeHtml(scenario.title)}</strong><small>${escapeHtml(scenario.summary)}</small><em>상황별 추천 보기 →</em></button>`).join('');
  $$('[data-scenario]',grid).forEach(button=>button.addEventListener('click',()=>openScenario(button.dataset.scenario)));
}

function renderPriceBand(key='10s'){
  const band=extendedPriceBands.find(item=>item.key===key)||extendedPriceBands[0];
  const selected=priceProducts.filter(product=>getTier(product)===band.key);
  $('#price-band-title').textContent=`${band.label} 추천`;
  $('#price-band-range').textContent=band.range;
  $('#price-band-summary').textContent=band.summary;
  $('#price-product-grid').innerHTML=selected.map(product=>premiumCard(product,true)).join('')||'<div class="info-box">해당 가격대의 등록 상품을 준비하고 있습니다.</div>';
  $$('[data-premium-detail]',$('#price-product-grid')).forEach(button=>button.addEventListener('click',()=>openPremiumProduct(button.dataset.premiumDetail)));
  $$('[data-price-band]').forEach(button=>{const active=button.dataset.priceBand===band.key;button.classList.toggle('active',active);button.setAttribute('aria-selected',String(active))});
}

function renderPriceBands(){
  $('#price-tier-tabs').innerHTML=extendedPriceBands.map((band,index)=>`<button type="button" role="tab" aria-selected="${index===0}" class="price-tier-tab ${index===0?'active':''}" data-price-band="${band.key}"><strong>${band.label}</strong><small>${band.range}</small></button>`).join('');
  $$('[data-price-band]').forEach(button=>button.addEventListener('click',()=>renderPriceBand(button.dataset.priceBand)));
  renderPriceBand();
}

function insertSections(){
  const productSection=$('#products-section');if(!productSection||$('#situations'))return;
  const scenarioSection=document.createElement('section');scenarioSection.className='situation-section';scenarioSection.id='situations';scenarioSection.innerHTML=`<div class="shell section-block"><div class="section-intro compact"><span class="section-index">03</span><div><span class="eyebrow">SITUATION RECOMMENDATION</span><h2>가격보다 먼저, 쓰는 상황을 골라보세요.</h2><p>입문, 학생 필기, 업무, 왼손잡이, 선물과 업그레이드까지 실제 매장에서 자주 만나는 상황을 준비했습니다.</p></div></div><div class="situation-grid" id="scenario-grid"></div></div>`;
  const priceSection=document.createElement('section');priceSection.className='price-guide-section';priceSection.id='price-guide';priceSection.innerHTML=`<div class="shell section-block"><div class="section-intro compact"><span class="section-index light">04</span><div><span class="eyebrow gold-text">PRICE GUIDE</span><h2>10만원대부터 100만원 이상까지.</h2><p>각 구간에서 무엇이 달라지고 어떤 제품부터 비교할지 한눈에 확인하세요.</p></div></div><div class="price-tier-tabs" id="price-tier-tabs" role="tablist" aria-label="가격대 선택"></div><div class="price-band-panel"><div class="price-band-copy"><span id="price-band-range"></span><h3 id="price-band-title"></h3><p id="price-band-summary"></p><small>가격 확인 기준 ${PREMIUM_VERIFIED_AT} · 재고와 옵션은 별도 확인</small></div><div class="premium-grid" id="price-product-grid"></div></div></div>`;
  productSection.before(scenarioSection,priceSection);
  const productIndex=$('.products-section .section-index');if(productIndex)productIndex.textContent='05';
  const guideIndex=$('.guide-section .section-index');if(guideIndex)guideIndex.textContent='06';
  const nav=$('.desktop-nav');if(nav&&!nav.querySelector('a[href="#situations"]'))nav.querySelector('a[href="#products-section"]')?.insertAdjacentHTML('beforebegin','<a href="#situations">상황별</a><a href="#price-guide">가격대별</a>');
  const proof=$$('.hero-proof span');
  if(proof[1]){proof[1].querySelector('b').textContent=allProducts.length;proof[1].querySelector('small').textContent='개 비교 후보'}
  if(proof[2]){proof[2].querySelector('b').textContent=scenarios.length;proof[2].querySelector('small').textContent='개 사용 상황'}
}

function handleExtendedSearch(query){
  const normalized=String(query||'').replace(/\s+/g,'').toLowerCase();
  const priceMatch=normalized.match(/(10|20|30|40|50|60|80|100)만원/);
  if(priceMatch){const value=priceMatch[1];const bandKey=value==='100'?'100plus':`${value}s`;renderPriceBand(bandKey);$('#price-guide').scrollIntoView({behavior:'smooth'});return true}
  if(normalized.includes('백만원')||normalized.includes('100만이상')){renderPriceBand('100plus');$('#price-guide').scrollIntoView({behavior:'smooth'});return true}
  const scenario=scenarios.find(item=>normalized.includes(item.title.replace(/\s+/g,'').toLowerCase())||item.title.split(/[· ]/).some(token=>token.length>1&&normalized.includes(token.toLowerCase())));
  if(scenario){openScenario(scenario.id);return true}
  if(normalized.includes('입문용')||normalized==='입문'){openScenario('first-pen');return true}
  if(normalized.includes('선물')){openScenario(normalized.includes('10만원')?'gift-10':'business-gift');return true}
  if(normalized.includes('금닙')||normalized.includes('상위모델')){openScenario('upgrade');return true}
  return false;
}

function interceptSearch(){
  const button=$('#search-button'),input=$('#global-search');
  button?.addEventListener('click',event=>{if(handleExtendedSearch(input.value)){event.preventDefault();event.stopImmediatePropagation()}},true);
  input?.addEventListener('keydown',event=>{if(event.key==='Enter'&&handleExtendedSearch(input.value)){event.preventDefault();event.stopImmediatePropagation()}},true);
}

function init(){
  addStylesheet();insertSections();renderScenarios();renderPriceBands();interceptSearch();
}

init();
