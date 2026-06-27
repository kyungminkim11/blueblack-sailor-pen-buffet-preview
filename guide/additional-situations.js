import { products as entryProducts } from './data/catalog.js';
import { premiumProducts } from './data/premium.js';
import { expandedProducts } from './data/expanded-products.js';

const $=(selector,root=document)=>root.querySelector(selector);
const $$=(selector,root=document)=>[...root.querySelectorAll(selector)];
const productMap=new Map([...entryProducts,...premiumProducts,...expandedProducts].map(product=>[product.id,product]));
const formatPrice=value=>new Intl.NumberFormat('ko-KR').format(value)+'원';
const escapeHtml=value=>String(value??'').replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));

export const additionalSituations=[
{id:'korean-small',icon:'한',title:'한글 작은 글씨',summary:'받침과 획이 많은 한글을 또렷하게 쓰는 방향입니다.',tips:['EF·F를 같은 종이에서 비교','획 뭉침과 번짐 확인','너무 건조한 조합은 끊김 여부 확인'],productIds:['pilot-lightive','pilot-custom74','platinum-3776-kasumi']},
{id:'strong-pressure',icon:'↘️',title:'필압이 강한 사용자',summary:'굵은 촉보다 힘을 빼는 습관과 안정적인 그립을 먼저 봅니다.',tips:['스틸닙 입문 모델부터 비교','삼각·가이드 그립 적응 확인','닙을 눌러 벌리는 시필은 금지'],productIds:['lamy-safari','lamy-alstar-pine','sailor-tuzu']},
{id:'small-hands',icon:'🤏',title:'손이 작은 사용자',summary:'짧고 가벼운 바디와 좁은 그립을 우선합니다.',tips:['캡을 뒤에 꽂지 않은 상태도 비교','그립 지름과 단차 확인','포켓형 모델은 사용 길이 확인'],productIds:['kaweco-sport-luna','esterbrook-jr-pocket','pilot-decimo']},
{id:'large-hands',icon:'🖐️',title:'손이 큰 사용자',summary:'그립 지름과 전체 길이, 캡 게시 시 균형을 확인합니다.',tips:['바디가 짧아 손 안에 숨지 않는지 확인','굵은 그립과 긴 바디 비교','10분 이상 연속 필기'],productIds:['pilot-custom742','pilot-custom743','twsbi-vac700r']},
{id:'easy-care',icon:'🧼',title:'관리 쉬운 구성',summary:'세척 부담과 소모품 구입 난이도를 낮추는 방향입니다.',tips:['카트리지로 먼저 시작','쉬머·안료 잉크는 뒤로 미루기','분해가 필요한 구조보다 단순한 구조 우선'],productIds:['pilot-lightive','lamy-safari','cross-foundry']},
{id:'first-gold',icon:'✨',title:'첫 금닙·상위 닙',summary:'가격보다 현재 펜과 어떤 차이를 원하는지 먼저 확인합니다.',tips:['현재 펜과 같은 닙 굵기로 비교','부드러움과 탄성을 따로 확인','금 함량만으로 필기감을 단정하지 않기'],productIds:['pilot-custom74','pilot-decimo','sailor-profit14k']},
{id:'mentor-gift',icon:'🎓',title:'부모님·은사 선물',summary:'격식, 읽기 쉬운 닙과 사후 서비스를 함께 고려합니다.',tips:['받는 분의 필기 습관 확인','F·M 중심으로 비교','각인·포장·AS 안내를 함께 준비'],productIds:['faber-ambition-walnut','parker-sonnet-matte','pelikan-m400']},
{id:'frequent-ink-change',icon:'🔄',title:'잉크를 자주 바꾸는 사용자',summary:'세척 시간과 잔량, 색상 전환 편의성을 우선합니다.',tips:['컨버터식과 피스톤식 세척 시간 비교','쉬머 사용 후 세척 주기 확인','투명 바디의 잔색 여부 확인'],productIds:['sailor-tuzu','twsbi-eco-white','twsbi-580alr']}
];

function productLabel(product){return product.highlight||product.purposes?.[0]||'추천 후보'}
function nibLabel(product){return product.nibClass||product.nibs?.join(' · ')||'옵션 확인'}

function openDialog(title,subtitle,html){
  const dialog=$('#flow-dialog');if(!dialog)return;
  $('#dialog-title').textContent=title;
  $('#dialog-subtitle').textContent=subtitle;
  $('#dialog-body').innerHTML=html;
  if(!dialog.open)dialog.showModal();
}

function openProduct(id){
  const product=productMap.get(id);if(!product)return;
  openDialog(product.name,`${product.brand} · 상황별 비교 후보`,`
    <div class="premium-dialog-hero" style="--premium-accent:${product.accent||'#304f73'}">
      <div><span>${escapeHtml(productLabel(product))}</span><h3>${formatPrice(product.price)}</h3><p>${escapeHtml(product.note)}</p></div><i class="premium-pen large"></i>
    </div>
    <div class="metric-grid"><div class="metric"><small>닙 방향</small><strong>${escapeHtml(nibLabel(product))}</strong></div><div class="metric"><small>충전 방식</small><strong>${escapeHtml(product.filling)}</strong></div><div class="metric"><small>무게</small><strong>${escapeHtml(product.weight||'확인 필요')}</strong></div></div>
    <div class="premium-purpose-list">${[...(product.families||[]),...(product.purposes||[])].slice(0,7).map(item=>`<span>${escapeHtml(item)}</span>`).join('')}</div>
    <div class="info-box"><strong>구매 전 확인:</strong> ${escapeHtml(product.stock)}<br>가격·옵션·시필 가능 여부는 직원에게 최종 확인해 주세요.</div>
    <div class="dialog-actions"><a class="button navy" href="${product.url}" target="_blank" rel="noopener">공식 상품 페이지</a></div>`);
  document.dispatchEvent(new CustomEvent('bb:product-open',{detail:{id}}));
}

function openSituation(id){
  const situation=additionalSituations.find(item=>item.id===id);if(!situation)return;
  const candidates=situation.productIds.map(productId=>productMap.get(productId)).filter(Boolean);
  openDialog(situation.title,situation.summary,`
    <div class="scenario-dialog-head"><span>${situation.icon}</span><div><small>ADVANCED SITUATION</small><h3>${escapeHtml(situation.title)}</h3><p>${escapeHtml(situation.summary)}</p></div></div>
    <div class="scenario-checks"><h4>매장에서 확인할 것</h4>${situation.tips.map((tip,index)=>`<div><b>${index+1}</b><span>${escapeHtml(tip)}</span></div>`).join('')}</div>
    <h4 class="dialog-section-title">추천 비교 후보</h4>
    <div class="scenario-product-list">${candidates.map((product,index)=>`<button type="button" data-extra-product="${product.id}"><span>${index+1}</span><div><strong>${escapeHtml(product.name)}</strong><small>${formatPrice(product.price)} · ${escapeHtml(productLabel(product))}</small></div><i>→</i></button>`).join('')}</div>
    <div class="info-box">제품 가격보다 손 크기, 필압, 종이와 관리 습관을 먼저 확인합니다. 추천 후보는 실제 시필 범위를 좁히기 위한 시작점입니다.</div>
    <div class="dialog-actions"><button class="button soft" type="button" id="extra-share">상황 요약 공유</button><button class="button navy" type="button" id="extra-copy">직원용 메모 복사</button></div>`);
  $$('[data-extra-product]',$('#dialog-body')).forEach(button=>button.addEventListener('click',()=>openProduct(button.dataset.extraProduct)));
  const text=`[블루블랙 상황별 상담]\n상황: ${situation.title}\n확인 항목: ${situation.tips.join(' / ')}\n비교 후보: ${candidates.map(product=>product.name).join(', ')}`;
  $('#extra-copy').addEventListener('click',async event=>{try{await navigator.clipboard.writeText(text);event.currentTarget.textContent='복사 완료'}catch{alert('복사할 수 없습니다. 화면을 직원에게 보여주세요.')}});
  $('#extra-share').addEventListener('click',async()=>{if(navigator.share){await navigator.share({title:`블루블랙 · ${situation.title}`,text}).catch(()=>{})}else{await navigator.clipboard.writeText(text).catch(()=>{});alert('공유 내용을 복사했습니다.')}});
}

function render(){
  const grid=$('#scenario-grid');if(!grid)return false;
  additionalSituations.forEach((situation,index)=>{
    if(grid.querySelector(`[data-extra-scenario="${situation.id}"]`))return;
    const button=document.createElement('button');button.className='situation-card advanced';button.type='button';button.dataset.extraScenario=situation.id;
    button.innerHTML=`<span class="situation-icon">${situation.icon}</span><span class="situation-count">${String(index+17).padStart(2,'0')}</span><strong>${escapeHtml(situation.title)}</strong><small>${escapeHtml(situation.summary)}</small><em>상황별 추천 보기 →</em>`;
    button.addEventListener('click',()=>openSituation(situation.id));grid.append(button);
  });
  const proof=$$('.hero-proof span');
  if(proof[2]){proof[2].querySelector('b').textContent='24';proof[2].querySelector('small').textContent='개 사용 상황'}
  return true;
}

function bindSearch(){
  const aliases=new Map([
    ['한글','korean-small'],['작은글씨','korean-small'],['필압','strong-pressure'],['손이작','small-hands'],['손이큰','large-hands'],['관리쉬운','easy-care'],['세척쉬운','easy-care'],['금닙','first-gold'],['부모님','mentor-gift'],['은사','mentor-gift'],['잉크자주','frequent-ink-change']
  ]);
  const handle=query=>{const normalized=String(query||'').replace(/\s+/g,'').toLowerCase();for(const [term,id] of aliases){if(normalized.includes(term)){openSituation(id);return true}}return false};
  $('#search-button')?.addEventListener('click',event=>{if(handle($('#global-search').value)){event.preventDefault();event.stopImmediatePropagation()}},true);
  $('#global-search')?.addEventListener('keydown',event=>{if(event.key==='Enter'&&handle(event.currentTarget.value)){event.preventDefault();event.stopImmediatePropagation()}},true);
}

let attempts=0;
function init(){
  if(render()){bindSearch();return}
  if(attempts++<30)setTimeout(init,100);
}
init();
