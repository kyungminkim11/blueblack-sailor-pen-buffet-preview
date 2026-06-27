import { products as entryProducts } from './data/catalog.js';
import { premiumProducts } from './data/premium.js';

const $=(selector,root=document)=>root.querySelector(selector);
const $$=(selector,root=document)=>[...root.querySelectorAll(selector)];
const allProducts=[...entryProducts,...premiumProducts];
const productMap=new Map(allProducts.map(product=>[product.id,product]));
const compareIds=new Set(JSON.parse(localStorage.getItem('bb-compare-products')||'[]').filter(id=>productMap.has(id)).slice(0,3));
const favoriteIds=new Set(JSON.parse(localStorage.getItem('bb-favorite-products')||'[]').filter(id=>productMap.has(id)));
let activeProductId='';

const formatPrice=value=>new Intl.NumberFormat('ko-KR').format(value)+'원';
const escapeHtml=value=>String(value??'').replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
const nibLabel=product=>product.nibClass||product.nibs?.join(' · ')||'옵션 확인';
const tierLabel=product=>product.tier?`${product.tier.replace('s','')}만원대`:'입문 가격대';

function persist(){
  localStorage.setItem('bb-compare-products',JSON.stringify([...compareIds]));
  localStorage.setItem('bb-favorite-products',JSON.stringify([...favoriteIds]));
}
function ensureStyles(){if(document.querySelector('link[href="./collection-tools.css"]'))return;const link=document.createElement('link');link.rel='stylesheet';link.href='./collection-tools.css';document.head.append(link)}

function openDialog(title,subtitle,html){
  const dialog=$('#flow-dialog');if(!dialog)return;
  $('#dialog-title').textContent=title;$('#dialog-subtitle').textContent=subtitle;$('#dialog-body').innerHTML=html;
  if(!dialog.open)dialog.showModal();
}

function compareText(products){
  return `[블루블랙 제품 비교]\n${products.map((product,index)=>`${index+1}. ${product.name}\n- 가격: ${formatPrice(product.price)}\n- 닙: ${nibLabel(product)}\n- 충전: ${product.filling}\n- 무게: ${product.weight||'확인 필요'}\n- 용도: ${(product.purposes||[]).join(', ')}\n- 재고: ${product.stock}`).join('\n\n')}\n\n최종 가격·옵션·시필 가능 여부는 직원 확인이 필요합니다.`;
}

function renderDock(){
  let dock=$('#compare-dock');
  if(!dock){dock=document.createElement('aside');dock.id='compare-dock';dock.className='compare-dock';dock.setAttribute('aria-live','polite');document.body.append(dock)}
  const products=[...compareIds].map(id=>productMap.get(id)).filter(Boolean);
  dock.hidden=!products.length;
  if(!products.length){dock.innerHTML='';return}
  dock.innerHTML=`<div class="compare-dock-copy"><span>COMPARE</span><strong>${products.length}/3개 담김</strong><small>${products.map(product=>escapeHtml(product.name)).join(' · ')}</small></div><div class="compare-dock-actions"><button type="button" id="compare-clear">비우기</button><button type="button" id="compare-open">비교 보기</button></div>`;
  $('#compare-clear').addEventListener('click',()=>{compareIds.clear();persist();renderDock();syncButtons()});
  $('#compare-open').addEventListener('click',openCompare);
}

function toggleCompare(id){
  if(compareIds.has(id))compareIds.delete(id);
  else if(compareIds.size>=3){alert('제품 비교는 최대 3개까지 담을 수 있습니다.');return}
  else compareIds.add(id);
  persist();renderDock();syncButtons();
}
function toggleFavorite(id){
  favoriteIds.has(id)?favoriteIds.delete(id):favoriteIds.add(id);
  persist();renderFavoritesToolbar(true);syncButtons();
}

function syncButtons(){
  $$('[data-compare-toggle]').forEach(button=>{const active=compareIds.has(button.dataset.compareToggle);button.classList.toggle('active',active);button.textContent=active?'비교 제외':'비교 담기'});
  $$('[data-favorite-toggle]').forEach(button=>{const active=favoriteIds.has(button.dataset.favoriteToggle);button.classList.toggle('active',active);button.textContent=active?'관심 ♥':'관심 ♡'});
}

function enhanceActions(){
  $$('.premium-actions').forEach(actions=>{
    if(actions.dataset.collectionReady)return;
    const card=actions.closest('[data-premium-card]');const id=card?.dataset.premiumCard;if(!id)return;
    actions.dataset.collectionReady='1';
    const compare=document.createElement('button');compare.type='button';compare.className='collection-action';compare.dataset.compareToggle=id;
    const favorite=document.createElement('button');favorite.type='button';favorite.className='collection-action';favorite.dataset.favoriteToggle=id;
    actions.prepend(favorite,compare);
  });
  $$('.product-actions').forEach(actions=>{
    if(actions.dataset.collectionReady)return;
    const source=actions.querySelector('[data-product]');const id=source?.dataset.product;if(!id)return;
    actions.dataset.collectionReady='1';
    const compare=document.createElement('button');compare.type='button';compare.className='button soft collection-action';compare.dataset.compareToggle=id;
    const favorite=document.createElement('button');favorite.type='button';favorite.className='button soft collection-action';favorite.dataset.favoriteToggle=id;
    actions.append(compare,favorite);
  });
  syncButtons();
}

function enhanceDialog(){
  const body=$('#dialog-body');if(!body||!activeProductId||body.dataset.collectionProduct===activeProductId)return;
  if(!body.querySelector('.premium-dialog-hero,.result-hero'))return;
  const actions=body.querySelector('.dialog-actions');if(!actions)return;
  body.dataset.collectionProduct=activeProductId;
  const tools=document.createElement('div');tools.className='collection-detail-actions';
  tools.innerHTML=`<button type="button" data-compare-toggle="${activeProductId}">비교 담기</button><button type="button" data-favorite-toggle="${activeProductId}">관심 ♡</button>`;
  actions.before(tools);syncButtons();
}

function renderFavoritesToolbar(force=false){
  const section=$('#price-guide .section-block');if(!section)return;
  let toolbar=$('#collection-toolbar');
  if(!toolbar){toolbar=document.createElement('div');toolbar.id='collection-toolbar';toolbar.className='collection-toolbar';const tabs=$('#price-tier-tabs');tabs?.before(toolbar)}
  const state=String(favoriteIds.size);
  if(!force&&toolbar.dataset.favoriteCount===state)return;
  toolbar.dataset.favoriteCount=state;
  toolbar.innerHTML=`<div><span>MY PEN LIST</span><strong>관심 제품 ${favoriteIds.size}개</strong><small>이 브라우저에만 저장됩니다.</small></div><button type="button" id="favorites-open" ${favoriteIds.size?'':'disabled'}>관심 제품 보기</button>`;
  $('#favorites-open')?.addEventListener('click',openFavorites);
}

function openFavorites(){
  const products=[...favoriteIds].map(id=>productMap.get(id)).filter(Boolean);
  openDialog('관심 제품','브라우저에 저장한 제품입니다. 최대 3개를 비교함에 담아보세요.',products.length?`
    <div class="saved-product-list">${products.map(product=>`<article><div><span>${escapeHtml(product.brand)}</span><strong>${escapeHtml(product.name)}</strong><small>${formatPrice(product.price)} · ${escapeHtml(product.filling)}</small></div><div><button type="button" data-compare-toggle="${product.id}">${compareIds.has(product.id)?'비교 제외':'비교 담기'}</button><a href="${product.url}" target="_blank" rel="noopener">공식몰</a><button type="button" data-favorite-toggle="${product.id}">삭제</button></div></article>`).join('')}</div>
    <div class="dialog-actions"><button class="button soft" type="button" id="favorites-copy">목록 복사</button><button class="button navy" type="button" id="favorites-compare" ${compareIds.size?'':'disabled'}>비교 보기</button></div>`:'<div class="info-box">저장한 관심 제품이 없습니다.</div>');
  $('#favorites-copy')?.addEventListener('click',async event=>{const text=products.map((product,index)=>`${index+1}. ${product.name} · ${formatPrice(product.price)}`).join('\n');try{await navigator.clipboard.writeText(text);event.currentTarget.textContent='복사 완료'}catch{}});
  $('#favorites-compare')?.addEventListener('click',openCompare);syncButtons();
}

function comparisonTable(products){
  const rows=[
    ['가격',product=>formatPrice(product.price)],['가격대',tierLabel],['닙',nibLabel],['충전 방식',product=>product.filling],['무게',product=>product.weight||'확인 필요'],['추천 용도',product=>(product.purposes||[]).join(' · ')||'확인 필요'],['재고',product=>product.stock]
  ];
  return `<div class="compare-table-wrap"><table class="compare-table"><thead><tr><th>비교 항목</th>${products.map(product=>`<th>${escapeHtml(product.name)}</th>`).join('')}</tr></thead><tbody>${rows.map(([label,getValue])=>`<tr><th>${label}</th>${products.map(product=>`<td>${escapeHtml(getValue(product))}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}

function openCompare(){
  const products=[...compareIds].map(id=>productMap.get(id)).filter(Boolean);
  if(!products.length)return;
  openDialog('제품 비교',`${products.length}개 제품을 같은 기준으로 비교합니다.`,`${comparisonTable(products)}
    <div class="info-box">가격이나 닙 소재만으로 결정하지 말고, 실제 글씨 크기와 손의 피로도를 매장에서 시필해 확인하세요.</div>
    <div class="compare-links">${products.map(product=>`<a href="${product.url}" target="_blank" rel="noopener">${escapeHtml(product.name)} 공식몰 →</a>`).join('')}</div>
    <div class="dialog-actions"><button class="button soft" type="button" id="compare-copy">직원용 요약 복사</button><button class="button soft" type="button" id="compare-share">공유</button><button class="button navy" type="button" id="compare-print">인쇄</button></div>`);
  const text=compareText(products);
  $('#compare-copy').addEventListener('click',async event=>{try{await navigator.clipboard.writeText(text);event.currentTarget.textContent='복사 완료'}catch{alert('복사할 수 없습니다. 화면을 직원에게 보여주세요.')}});
  $('#compare-share').addEventListener('click',async()=>{if(navigator.share)await navigator.share({title:'블루블랙 제품 비교',text}).catch(()=>{});else{await navigator.clipboard.writeText(text).catch(()=>{});alert('비교 내용을 복사했습니다.')}});
  $('#compare-print').addEventListener('click',()=>printComparison(products));
}

function printComparison(products){
  const popup=window.open('','_blank','width=900,height=760');if(!popup){alert('팝업이 차단되었습니다. 브라우저의 팝업 허용 후 다시 눌러주세요.');return}
  popup.opener=null;
  popup.document.write(`<!doctype html><html lang="ko"><head><meta charset="utf-8"><title>블루블랙 제품 비교</title><style>body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#172033;padding:32px}h1{font-family:Georgia,serif}table{width:100%;border-collapse:collapse;margin-top:24px}th,td{border:1px solid #ccd3dc;padding:12px;text-align:left;vertical-align:top}thead th{background:#0b1b31;color:white}tbody th{background:#f1ede4;width:120px}.note{margin-top:22px;padding:14px;background:#f5f1e9}.meta{color:#6d7685;font-size:12px}</style></head><body><p class="meta">BLUEBLACK PEN SHOP</p><h1>만년필 제품 비교</h1>${comparisonTable(products)}<div class="note">표시 가격과 재고는 확인 시점 기준입니다. 실제 닙, 무게와 그립은 매장에서 시필해 주세요.</div><script>window.onload=()=>window.print()<\/script></body></html>`);popup.document.close();
}

function bindClicks(){
  document.addEventListener('click',event=>{
    const source=event.target.closest('[data-product],[data-premium-detail],[data-scenario-product],[data-extra-product]');
    if(source)activeProductId=source.dataset.product||source.dataset.premiumDetail||source.dataset.scenarioProduct||source.dataset.extraProduct||'';
    const compare=event.target.closest('[data-compare-toggle]');if(compare){event.preventDefault();event.stopPropagation();toggleCompare(compare.dataset.compareToggle);return}
    const favorite=event.target.closest('[data-favorite-toggle]');if(favorite){event.preventDefault();event.stopPropagation();toggleFavorite(favorite.dataset.favoriteToggle);if($('#dialog-title')?.textContent==='관심 제품')openFavorites();return}
  },true);
  document.addEventListener('bb:product-open',event=>{activeProductId=event.detail?.id||'';setTimeout(enhanceDialog,0)});
}

function initObserver(){
  const observer=new MutationObserver(()=>{enhanceActions();enhanceDialog();if(!$('#collection-toolbar'))renderFavoritesToolbar()});
  observer.observe(document.body,{childList:true,subtree:true});
}

function init(){ensureStyles();bindClicks();initObserver();enhanceActions();renderDock();renderFavoritesToolbar(true)}
init();
