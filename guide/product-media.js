import { products as entryProducts } from './data/catalog.js';
import { premiumProducts } from './data/premium.js';
import { expandedProducts } from './data/expanded-products.js';
import { productImages } from './data/product-images.js';

const $=(selector,root=document)=>root.querySelector(selector);
const $$=(selector,root=document)=>[...root.querySelectorAll(selector)];
const allProducts=[...entryProducts,...premiumProducts,...expandedProducts];
const productMap=new Map(allProducts.map(product=>[product.id,product]));
const formatPrice=value=>new Intl.NumberFormat('ko-KR').format(value)+'원';
const escapeHtml=value=>String(value??'').replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
let activeProductId='';
let familyFilter='전체';

const FAMILY_FILTERS=['전체','입문용','업무용','선물용','포켓형','병 잉크','피스톤 필러','금닙·상위 닙','한정판','플래그십','우드 바디','레진 바디'];

function addStylesheet(){
  if(document.querySelector('link[href="./product-media.css"]'))return;
  const link=document.createElement('link');link.rel='stylesheet';link.href='./product-media.css';document.head.append(link);
}

function fallbackMarkup(product){
  return `<span class="media-placeholder" style="--media-accent:${product.accent||'#405d7b'}"><i></i><small>IMAGE PREPARING</small></span>`;
}

function getMedia(product){
  const item=productImages[product.id];
  if(!item)return {src:'',source:'',gallery:[],alt:product.name};
  const gallery=Array.isArray(item.gallery)&&item.gallery.length?item.gallery:[item.src].filter(Boolean);
  return {...item,gallery,alt:item.alt||product.name};
}

function imageMarkup(product,variant='card'){
  const media=getMedia(product);
  if(!media.src)return fallbackMarkup(product);
  return `<img class="official-product-image ${variant}" data-official-image="${product.id}" src="${escapeHtml(media.src)}" data-source="${escapeHtml(media.source||'')}" alt="${escapeHtml(media.alt)}" loading="lazy" decoding="async">`;
}

function bindImageFallback(root=document){
  $$('img[data-official-image]:not([data-image-bound])',root).forEach(image=>{
    image.dataset.imageBound='1';
    image.addEventListener('error',()=>{
      const source=image.dataset.source||'';
      if(source&&image.src!==source&&!image.dataset.sourceTried){
        image.dataset.sourceTried='1';image.src=source;return;
      }
      const product=productMap.get(image.dataset.officialImage);
      image.replaceWith(document.createRange().createContextualFragment(fallbackMarkup(product||{accent:'#405d7b'})));
    });
  });
}

function decorateExistingCards(){
  $$('.product-card').forEach(card=>{
    const id=card.querySelector('[data-product]')?.dataset.product;
    const product=productMap.get(id);const visual=card.querySelector('.product-visual');
    if(!product||!visual||visual.dataset.mediaReady)return;
    visual.dataset.mediaReady='1';visual.classList.add('has-official-media');visual.innerHTML=imageMarkup(product);
  });
  $$('[data-premium-card]').forEach(card=>{
    const product=productMap.get(card.dataset.premiumCard);const visual=card.querySelector('.premium-visual');
    if(!product||!visual||visual.dataset.mediaReady)return;
    visual.dataset.mediaReady='1';visual.classList.add('has-official-media');
    const tier=visual.querySelector('.premium-tier')?.outerHTML||'';
    visual.innerHTML=`${tier}${imageMarkup(product)}`;
  });
  bindImageFallback();
}

function tierLabel(product){
  if(product.tier==='entry')return '10만원 이하';
  if(product.tier==='100plus')return '100만원 이상';
  if(product.tier?.endsWith('s'))return `${product.tier.replace('s','')}만원대`;
  return product.price<100000?'10만원 이하':`${Math.floor(product.price/100000)*10}만원대`;
}

function mediaCard(product){
  return `<article class="media-product-card" data-media-card="${product.id}">
    <div class="media-card-visual"><span class="official-badge">OFFICIAL PHOTO</span>${imageMarkup(product)}</div>
    <div class="media-card-body">
      <div class="media-card-meta"><span>${escapeHtml(product.brand)}</span><small>${tierLabel(product)}</small></div>
      <h3>${escapeHtml(product.name)}</h3>
      <strong>${formatPrice(product.price)}</strong>
      <div class="media-family-tags">${(product.families||[]).slice(0,3).map(item=>`<span>${escapeHtml(item)}</span>`).join('')}</div>
      <p>${escapeHtml(product.note)}</p>
      <small class="media-stock">${escapeHtml(product.stock)}</small>
      <div class="premium-actions"><button type="button" data-media-product="${product.id}">사진·상세</button><a href="${product.url}" target="_blank" rel="noopener">공식몰 →</a></div>
    </div>
  </article>`;
}

function matchesFamily(product,filter){
  if(filter==='전체')return true;
  const values=[...(product.families||[]),...(product.purposes||[]),product.filling,product.highlight,product.nibClass].join(' ');
  if(filter==='선물용')return /선물/.test(values);
  if(filter==='업무용')return /업무/.test(values);
  if(filter==='병 잉크')return /병 잉크|피스톤|진공/.test(values);
  if(filter==='한정판')return /한정|컬렉션/.test(values);
  return values.includes(filter);
}

function renderExpandedProducts(){
  const grid=$('#media-product-grid');if(!grid)return;
  const selected=expandedProducts.filter(product=>matchesFamily(product,familyFilter));
  grid.innerHTML=selected.map(mediaCard).join('')||'<div class="info-box">해당 제품군의 등록 상품을 준비하고 있습니다.</div>';
  $$('[data-media-product]',grid).forEach(button=>button.addEventListener('click',()=>openMediaProduct(button.dataset.mediaProduct)));
  bindImageFallback(grid);
  $$('[data-family-filter]').forEach(button=>{
    const active=button.dataset.familyFilter===familyFilter;
    button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));
  });
}

function insertProductFamilySection(){
  if($('#product-families'))return;
  const guideSection=$('#guide-library')||$('.guide-section');if(!guideSection)return;
  const section=document.createElement('section');section.id='product-families';section.className='product-family-section';
  section.innerHTML=`<div class="shell section-block"><div class="section-intro compact"><span class="section-index">06</span><div><span class="eyebrow">MORE PRODUCT FAMILIES</span><h2>입문부터 플래그십까지, 제품군으로 찾기.</h2><p>가격뿐 아니라 바디 소재, 충전 방식, 휴대성, 선물 목적과 상위 닙 기준으로 범위를 넓혔습니다.</p></div><div class="media-count"><strong>${expandedProducts.length}</strong><small>NEW PRODUCTS</small></div></div><div class="family-filter-row" id="family-filter-row">${FAMILY_FILTERS.map(item=>`<button type="button" data-family-filter="${item}" aria-pressed="${item==='전체'}">${item}</button>`).join('')}</div><div class="media-product-grid" id="media-product-grid"></div></div>`;
  guideSection.before(section);
  $$('[data-family-filter]',section).forEach(button=>button.addEventListener('click',()=>{familyFilter=button.dataset.familyFilter;renderExpandedProducts()}));
  const guideIndex=$('.guide-section .section-index');if(guideIndex)guideIndex.textContent='07';
  const nav=$('.desktop-nav');if(nav&&!nav.querySelector('a[href="#product-families"]'))nav.querySelector('a[href="#guide-library"]')?.insertAdjacentHTML('beforebegin','<a href="#product-families">제품군</a>');
  renderExpandedProducts();
}

function galleryMarkup(product){
  const media=getMedia(product);
  if(!media.gallery.length)return `<div class="dialog-main-media">${fallbackMarkup(product)}</div>`;
  return `<div class="dialog-media-gallery"><div class="dialog-main-media">${imageMarkup({...product,id:product.id},'detail')}</div>${media.gallery.length>1?`<div class="dialog-thumbnails">${media.gallery.map((src,index)=>`<button type="button" data-gallery-src="${escapeHtml(src)}" class="${index===0?'active':''}"><img src="${escapeHtml(src)}" alt="${escapeHtml(product.name)} 상품 이미지 ${index+1}" loading="lazy"></button>`).join('')}</div>`:''}</div>`;
}

function bindGallery(root,product){
  const main=$('.dialog-main-media img',root);
  $$('[data-gallery-src]',root).forEach(button=>button.addEventListener('click',()=>{
    if(main)main.src=button.dataset.gallerySrc;
    $$('[data-gallery-src]',root).forEach(item=>item.classList.toggle('active',item===button));
  }));
  bindImageFallback(root);
}

function openMediaProduct(id){
  const product=productMap.get(id);if(!product)return;
  activeProductId=id;
  const dialog=$('#flow-dialog');$('#dialog-title').textContent=product.name;$('#dialog-subtitle').textContent=`${product.brand} · ${tierLabel(product)} · 공식 상품 사진`;
  $('#dialog-body').innerHTML=`<div class="media-product-dialog">${galleryMarkup(product)}<div class="media-dialog-copy"><span class="eyebrow">${escapeHtml(product.highlight||product.families?.[0]||'PRODUCT')}</span><h3>${formatPrice(product.price)}</h3><p>${escapeHtml(product.note)}</p><div class="metric-grid"><div class="metric"><small>닙</small><strong>${escapeHtml(product.nibClass||product.nibs?.join(' · ')||'옵션 확인')}</strong></div><div class="metric"><small>충전</small><strong>${escapeHtml(product.filling)}</strong></div><div class="metric"><small>무게</small><strong>${escapeHtml(product.weight||'확인 필요')}</strong></div></div><div class="premium-purpose-list">${[...(product.families||[]),...(product.purposes||[])].slice(0,7).map(item=>`<span>${escapeHtml(item)}</span>`).join('')}</div><div class="info-box">${escapeHtml(product.stock)}<br>가격과 판매 상태는 ${escapeHtml(product.verifiedAt||'최근')} 공식몰 확인 기준입니다.</div><div class="dialog-actions"><a class="button navy" href="${product.url}" target="_blank" rel="noopener">공식 상품 페이지</a></div></div></div>`;
  if(!dialog.open)dialog.showModal();bindGallery($('#dialog-body'),product);
  document.dispatchEvent(new CustomEvent('bb:product-open',{detail:{id}}));
}

function enhanceOpenDialog(){
  if(!activeProductId)return;
  const product=productMap.get(activeProductId);const body=$('#dialog-body');
  if(!product||!body||body.dataset.officialMedia===activeProductId||body.querySelector('.media-product-dialog'))return;
  const hero=body.querySelector('.premium-dialog-hero,.result-hero');if(!hero)return;
  body.dataset.officialMedia=activeProductId;
  const media=document.createElement('div');media.className='embedded-official-media';media.innerHTML=galleryMarkup(product);
  hero.before(media);bindGallery(media,product);
}

function bindProductTracking(){
  document.addEventListener('click',event=>{
    const source=event.target.closest('[data-product],[data-premium-detail],[data-scenario-product],[data-extra-product],[data-media-product]');
    if(source)activeProductId=source.dataset.product||source.dataset.premiumDetail||source.dataset.scenarioProduct||source.dataset.extraProduct||source.dataset.mediaProduct||'';
  },true);
}

function bindSearch(){
  const handle=query=>{
    const normalized=String(query||'').replace(/\s+/g,'').toLowerCase();if(!normalized)return false;
    const product=expandedProducts.find(item=>[item.name,item.brand,...(item.families||[]),...(item.purposes||[])].some(value=>String(value).replace(/\s+/g,'').toLowerCase().includes(normalized)||normalized.includes(String(value).replace(/\s+/g,'').toLowerCase())));
    if(product){openMediaProduct(product.id);return true}
    const family=FAMILY_FILTERS.find(item=>item!=='전체'&&normalized.includes(item.replace(/\s+/g,'').toLowerCase()));
    if(family){familyFilter=family;renderExpandedProducts();$('#product-families')?.scrollIntoView({behavior:'smooth'});return true}
    return false;
  };
  $('#search-button')?.addEventListener('click',event=>{if(handle($('#global-search')?.value)){event.preventDefault();event.stopImmediatePropagation()}},true);
  $('#global-search')?.addEventListener('keydown',event=>{if(event.key==='Enter'&&handle(event.currentTarget.value)){event.preventDefault();event.stopImmediatePropagation()}},true);
}

function updateCounts(){
  const proof=$$('.hero-proof span');if(proof[1]){proof[1].querySelector('b').textContent=allProducts.length;proof[1].querySelector('small').textContent='개 비교 후보'}
}

function initObserver(){
  const observer=new MutationObserver(()=>{decorateExistingCards();enhanceOpenDialog()});
  observer.observe(document.body,{childList:true,subtree:true});
}

function init(){
  addStylesheet();bindProductTracking();insertProductFamilySection();decorateExistingCards();bindSearch();updateCounts();initObserver();
}

init();
