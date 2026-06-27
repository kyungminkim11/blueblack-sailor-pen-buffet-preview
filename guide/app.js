import { APP_VERSION, VERIFIED_AT, store, guides, products, troubleTree, troubleResults } from './data/catalog.js';
import { buildIndex, searchIndex, normalize } from './modules/search.js';
import { questions, recommend } from './modules/recommendation.js';
import { escapeHtml, safeText } from './modules/sanitize.js';

const $ = (selector, root=document) => root.querySelector(selector);
const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
const guideIndex = buildIndex(guides);
const state = { category:'전체', productFilter:'all', dialogTrigger:null, recommendation:null };
const isKiosk = new URLSearchParams(location.search).get('mode') === 'kiosk';
const source = new URLSearchParams(location.search).get('source') || 'direct';

function track(event, detail={}) {
  const logs = JSON.parse(localStorage.getItem('bb-guide-events') || '[]');
  logs.push({event, detail, source, at:new Date().toISOString(), version:APP_VERSION});
  localStorage.setItem('bb-guide-events', JSON.stringify(logs.slice(-500)));
}
function formatPrice(value) { return new Intl.NumberFormat('ko-KR').format(value) + '원'; }
function setTrustedHtml(el, html) { el.innerHTML = html; }

function renderProducts(list=products) {
  const grid = $('#product-grid');
  if (!list.length) { grid.innerHTML='<div class="info-box">조건에 맞는 상품이 없습니다. 다른 필터를 선택해 주세요.</div>'; return; }
  setTrustedHtml(grid, list.map(p=>`
    <article class="product-card">
      <div class="product-visual" style="background:linear-gradient(145deg,${p.accent}22,#f4f6f8)"><div class="pen-art" style="--accent:${p.accent}"></div></div>
      <span class="product-brand">${escapeHtml(p.brand)}</span>
      <h3>${escapeHtml(p.name)}</h3>
      <div class="product-price">${formatPrice(p.price)}</div>
      <div class="product-meta"><div><small>닙</small><strong>${escapeHtml(p.nibs.join(' · '))}</strong></div><div><small>충전</small><strong>${escapeHtml(p.filling)}</strong></div></div>
      <p class="product-note">${escapeHtml(p.note)}</p>
      <p class="product-note">${escapeHtml(p.priceNote)} · ${p.verifiedAt} 확인<br><strong>${escapeHtml(p.stock)}</strong></p>
      <div class="product-actions"><button class="button soft" type="button" data-product="${p.id}">상세</button><a class="button navy" href="${p.url}" target="_blank" rel="noopener">공식몰</a></div>
    </article>`).join(''));
  $$('[data-product]', grid).forEach(btn=>btn.addEventListener('click',()=>openProduct(products.find(p=>p.id===btn.dataset.product))));
}
function filterProducts(filter) {
  const filtered=products.filter(p=>{
    if(filter==='all')return true;
    if(filter==='under3')return p.price<30000;
    if(filter==='3to7')return p.price>=30000&&p.price<70000;
    if(filter==='bottle')return p.filling.includes('피스톤')||p.filling.includes('컨버터');
    if(filter==='portable')return p.weight.includes('가벼운')||p.purposes.includes('휴대');
    return true;
  });
  renderProducts(filtered); track('product_filter',{filter,count:filtered.length});
}
function renderCategories() {
  const cats=['전체',...new Set(guides.map(g=>g.category))];
  setTrustedHtml($('#category-tabs'), cats.map(c=>`<button class="category-tab ${c==='전체'?'active':''}" role="tab" aria-selected="${c==='전체'}" data-category="${escapeHtml(c)}">${escapeHtml(c)}</button>`).join(''));
  $$('[data-category]').forEach(btn=>btn.addEventListener('click',()=>{
    state.category=btn.dataset.category;
    $$('[data-category]').forEach(x=>{x.classList.toggle('active',x===btn);x.setAttribute('aria-selected',x===btn?'true':'false')});
    renderGuides(); track('guide_category',{category:state.category});
  }));
}
function renderGuides() {
  const list=state.category==='전체'?guides:guides.filter(g=>g.category===state.category);
  setTrustedHtml($('#guide-grid'), list.map(g=>`<button class="guide-card" type="button" data-guide="${g.id}"><span class="guide-icon">${g.icon}</span><h3>${escapeHtml(g.title)}</h3><p>${escapeHtml(g.summary)}</p><small>${escapeHtml(g.category)} · 읽기 →</small></button>`).join(''));
  $$('[data-guide]').forEach(btn=>btn.addEventListener('click',()=>openGuide(btn.dataset.guide)));
}
function openDialog(title, subtitle='', trigger=document.activeElement) {
  state.dialogTrigger=trigger;
  $('#dialog-title').textContent=title;
  $('#dialog-subtitle').textContent=subtitle;
  if (!$('#flow-dialog').open) $('#flow-dialog').showModal();
  $('#dialog-close').focus();
}
function closeDialog() { $('#flow-dialog').close(); state.dialogTrigger?.focus?.(); }
function openGuide(id) {
  const g=guides.find(x=>x.id===id); if(!g)return;
  openDialog(g.title,g.summary);
  setTrustedHtml($('#dialog-body'), `<article class="guide-detail">${g.sections.map(([title,items])=>`<h3>${escapeHtml(title)}</h3><ul>${items.map(item=>`<li>${escapeHtml(item)}</li>`).join('')}</ul>`).join('')}<div class="related-row">${(g.related||[]).map(r=>{const item=guides.find(x=>x.id===r);return item?`<button type="button" data-related="${item.id}">${item.icon} ${escapeHtml(item.title)}</button>`:''}).join('')}</div><div class="dialog-actions"><button class="button soft" type="button" data-action="staff">상담 요청서 만들기</button><button class="button navy" type="button" id="guide-close">확인</button></div></article>`);
  $$('[data-related]',$('#dialog-body')).forEach(btn=>btn.addEventListener('click',()=>openGuide(btn.dataset.related)));
  $('[data-action="staff"]',$('#dialog-body')).addEventListener('click',()=>openStaff(`관심 가이드: ${g.title}`));
  $('#guide-close').addEventListener('click',closeDialog); track('guide_open',{id:g.id,title:g.title});
}
function openProduct(p) {
  openDialog(p.name,`${p.brand} · ${p.priceNote}`);
  setTrustedHtml($('#dialog-body'),`<div class="result-hero"><span class="eyebrow">PRODUCT CHECK</span><h3>${formatPrice(p.price)}</h3><p>${escapeHtml(p.note)}</p></div><div class="metric-grid"><div class="metric"><small>닙 옵션</small><strong>${escapeHtml(p.nibs.join(' · '))}</strong></div><div class="metric"><small>충전 방식</small><strong>${escapeHtml(p.filling)}</strong></div><div class="metric"><small>재고</small><strong>${escapeHtml(p.stock)}</strong></div></div><div class="info-box">가격은 ${p.verifiedAt} 공식몰 확인 기준입니다. 옵션별 판매 여부와 매장 재고는 실시간으로 달라질 수 있습니다.</div><div class="dialog-actions"><button class="button soft" type="button" id="product-staff">직원에게 보여줄 요청서</button><a class="button navy" href="${p.url}" target="_blank" rel="noopener">공식 상품 페이지</a></div>`);
  $('#product-staff').addEventListener('click',()=>openStaff(`관심 제품: ${p.name} / 확인 가격: ${formatPrice(p.price)}`));
  track('product_open',{id:p.id,name:p.name});
}
function showSearch(query) {
  const safe=safeText(query,80); if(!safe)return;
  const results=searchIndex(guideIndex,safe);
  $('#search-title').textContent=`“${safe}” 검색 결과`;
  const list=$('#result-list');
  if(results.length){
    setTrustedHtml(list,results.slice(0,8).map(g=>`<article class="result-card"><div><h3>${g.icon} ${escapeHtml(g.title)}</h3><p>${escapeHtml(g.summary)}</p></div><button type="button" data-result="${g.id}">열기 →</button></article>`).join(''));
    $$('[data-result]',list).forEach(btn=>btn.addEventListener('click',()=>openGuide(btn.dataset.result)));
  } else {
    setTrustedHtml(list,`<div class="info-box">관련 안내를 찾지 못했습니다. “촉”, “잉크 안 나옴”, “각인”처럼 짧게 검색하거나 상담 요청서를 만들어 주세요.<div class="dialog-actions"><button class="button navy" type="button" id="search-staff">상담 요청서</button></div></div>`);
    $('#search-staff').addEventListener('click',()=>openStaff(`검색어: ${safe}`));
  }
  $('#search-results').hidden=false; $('#search-results').scrollIntoView({behavior:'smooth',block:'start'});
  track('search',{query:safe,count:results.length});
}
function startRecommendation() {
  const answers={}; let step=0;
  const render=()=>{
    const q=questions[step]; openDialog('내 첫 만년필 찾기',`${step+1} / ${questions.length} · 답변은 기기에 저장되지 않습니다.`);
    setTrustedHtml($('#dialog-body'),`<div class="progress"><span style="width:${((step+1)/questions.length)*100}%"></span></div><div class="question"><h3>${escapeHtml(q.title)}</h3>${q.help?`<p>${escapeHtml(q.help)}</p>`:''}<div class="option-grid">${q.options.map(([value,label,desc])=>`<button class="option-button ${answers[q.key]===value?'selected':''}" type="button" data-answer="${value}"><strong>${escapeHtml(label)}</strong><small>${escapeHtml(desc)}</small></button>`).join('')}</div></div><div class="dialog-actions">${step?'<button class="button soft" type="button" id="rec-back">이전</button>':''}<button class="button navy next" type="button" id="rec-next" ${answers[q.key]?'':'disabled'}>${step===questions.length-1?'결과 보기':'다음'}</button></div>`);
    $$('[data-answer]',$('#dialog-body')).forEach(btn=>btn.addEventListener('click',()=>{answers[q.key]=btn.dataset.answer;render()}));
    $('#rec-back')?.addEventListener('click',()=>{step--;render()});
    $('#rec-next').addEventListener('click',()=>{if(!answers[q.key])return;if(step<questions.length-1){step++;render()}else showRecommendation(answers)});
  }; render(); track('recommend_start');
}
function showRecommendation(answers) {
  const result=recommend(products,answers); state.recommendation={answers,result};
  openDialog('맞춤 추천 결과','제품을 단정하기보다 시필 후보를 좁히는 결과입니다.');
  setTrustedHtml($('#dialog-body'),`<div class="result-hero"><span class="eyebrow">YOUR PEN PROFILE</span><h3>${escapeHtml(result.nib)}부터 비교해 보세요.</h3><p>${escapeHtml(result.caution)}</p></div><div class="metric-grid"><div class="metric"><small>추천 닙</small><strong>${escapeHtml(result.nib)}</strong></div><div class="metric"><small>추천 상품 수</small><strong>${result.products.length}개</strong></div><div class="metric"><small>가격 기준일</small><strong>${VERIFIED_AT}</strong></div></div><div class="recommend-products">${result.products.map((p,i)=>`<article class="recommend-row"><span class="rank">${i+1}</span><div><h4>${escapeHtml(p.name)} · ${formatPrice(p.price)}</h4><p>${escapeHtml(p.reasons.join(' · ')||p.note)}<br>${escapeHtml(p.stock)}</p></div><a href="${p.url}" target="_blank" rel="noopener">공식몰 →</a></article>`).join('')}</div><div class="info-box">화면 가격은 공식몰 확인 기준이며 할인·옵션·재고는 달라질 수 있습니다. 결과를 직원에게 보여주고 실제 무게와 그립을 시필하세요.</div><div class="dialog-actions"><button class="button soft" type="button" id="rec-restart">다시 하기</button><button class="button navy" type="button" id="rec-staff">상담 요청서 만들기</button></div>`);
  $('#rec-restart').addEventListener('click',startRecommendation);
  $('#rec-staff').addEventListener('click',()=>openStaff(`추천 닙: ${result.nib}\n추천 후보: ${result.products.map(p=>p.name).join(', ')}`));
  track('recommend_complete',{nib:result.nib,products:result.products.map(p=>p.id)});
}
function startTrouble() {
  let node='start';
  const render=()=>{
    const item=troubleTree[node]; openDialog('만년필 안전 점검','자가수리가 아니라 안전한 분기 확인입니다.');
    setTrustedHtml($('#dialog-body'),`<div class="question"><h3>${escapeHtml(item.question)}</h3><p>상태를 눈으로 확인한 뒤 선택해 주세요.</p><div class="option-grid"><button class="option-button" type="button" data-trouble="yes"><strong>예</strong><small>해당합니다</small></button><button class="option-button" type="button" data-trouble="no"><strong>아니요</strong><small>해당하지 않습니다</small></button></div></div><div class="danger-box"><strong>항상 금지:</strong> 닙을 손으로 벌리기, 바늘·칼날 사용, 뜨거운 물·세제·알코올 사용</div>`);
    $$('[data-trouble]',$('#dialog-body')).forEach(btn=>btn.addEventListener('click',()=>{const next=item[btn.dataset.trouble];if(troubleTree[next]){node=next;render()}else showTroubleResult(next)}));
  }; render(); track('trouble_start');
}
function showTroubleResult(key) {
  const r=troubleResults[key]; const guide=guides.find(g=>g.id===r.guide);
  openDialog('점검 결과',r.level==='danger'?'추가 사용 전에 직원 확인이 필요합니다.':'안전한 기본 조치부터 진행하세요.');
  setTrustedHtml($('#dialog-body'),`<div class="result-hero"><span class="eyebrow">SAFE CHECK</span><h3>${escapeHtml(r.title)}</h3><p>${escapeHtml(r.body)}</p></div>${r.level==='danger'?'<div class="danger-box"><strong>즉시 중단 기준:</strong> 낙하 후 닙 변형, 균열, 비정상 누출, 갑작스러운 금속성 긁힘</div>':'<div class="info-box">조치 후에도 증상이 반복되면 임의 분해하지 말고 직원에게 보여주세요.</div>'}<div class="dialog-actions"><button class="button soft" type="button" id="trouble-guide">${guide.icon} 상세 가이드</button><button class="button navy" type="button" id="trouble-staff">상담 요청서</button></div>`);
  $('#trouble-guide').addEventListener('click',()=>openGuide(guide.id));
  $('#trouble-staff').addEventListener('click',()=>openStaff(`문제 점검 결과: ${r.title}`)); track('trouble_complete',{result:key});
}
function openService() {
  openDialog('각인·AS·매장 서비스','최신 비용·일정·보증 여부는 접수 전 확인해 주세요.');
  setTrustedHtml($('#dialog-body'),`<div class="guide-grid"><button class="guide-card" type="button" data-service-guide="engrave"><span class="guide-icon">✨</span><h3>각인 안내</h3><p>방식, 문구, 일정과 주문제작 주의사항</p><small>열기 →</small></button><button class="guide-card" type="button" data-service-guide="as"><span class="guide-icon">🔧</span><h3>AS·교환</h3><p>접수 자료와 자가 조정 금지 기준</p><small>열기 →</small></button><button class="guide-card" type="button" data-service-guide="storage"><span class="guide-icon">🏷️</span><h3>보관·휴대</h3><p>가방과 비행기, 장기 보관 기준</p><small>열기 →</small></button></div><div class="dialog-actions"><a class="button soft" href="${store.mapUrl}" target="_blank" rel="noopener">지도 보기</a><button class="button navy" type="button" id="service-staff">상담 요청서</button></div>`);
  $$('[data-service-guide]',$('#dialog-body')).forEach(btn=>btn.addEventListener('click',()=>openGuide(btn.dataset.serviceGuide)));
  $('#service-staff').addEventListener('click',()=>openStaff('각인·AS·매장 서비스 문의'));
}
function createTicketId() { return `BB-${new Date().toISOString().slice(2,10).replaceAll('-','')}-${String(Math.floor(Math.random()*900)+100)}`; }
function openStaff(prefill='') {
  openDialog('상담 요청서 만들기','요청서는 직원에게 보여주거나 전화·문의 게시판으로 전달할 수 있습니다. 자동 호출 기능은 아닙니다.');
  const form=document.createElement('form'); form.className='staff-form'; form.id='staff-form';
  form.innerHTML=`<label>현재 위치<select name="location"><option>1층</option><option>2층</option><option>시필대</option><option>카운터</option><option>기타</option></select></label><label>문의 유형<select name="type"><option>제품 추천</option><option>재고 확인</option><option>잉크 추천</option><option>각인</option><option>AS</option><option>기타</option></select></label><label>예산<select name="budget"><option>미정</option><option>3만원 이하</option><option>3–7만원</option><option>7–15만원</option><option>15–30만원</option><option>30만원 이상</option></select></label><label>연락처 <small>(선택, 문의 게시판 전달 시에만)</small><input name="contact" maxlength="60" autocomplete="tel" placeholder="전화번호 또는 이메일"></label><label>상세 내용<textarea name="detail" maxlength="500" placeholder="찾는 제품, 용도, 증상을 적어주세요."></textarea></label><label><span><input type="checkbox" name="privacy"> 연락처를 입력한 경우 상담 목적의 이용에 동의합니다.</span></label><button class="button navy" type="submit">요청서 생성</button><div id="staff-output"></div>`;
  $('#dialog-body').replaceChildren(form); form.elements.detail.value=safeText(prefill,500);
  form.addEventListener('submit',e=>{
    e.preventDefault(); const fd=new FormData(form); const contact=safeText(fd.get('contact'),60);
    if(contact && !fd.get('privacy')){alert('연락처를 입력했다면 상담 목적 이용 동의를 확인해 주세요.');return;}
    const ticket={id:createTicketId(),location:safeText(fd.get('location'),30),type:safeText(fd.get('type'),30),budget:safeText(fd.get('budget'),30),contact,detail:safeText(fd.get('detail'),500),createdAt:new Date().toISOString()};
    const text=`[블루블랙 매장 상담 요청]\n접수번호: ${ticket.id}\n위치: ${ticket.location}\n유형: ${ticket.type}\n예산: ${ticket.budget}\n내용: ${ticket.detail||'없음'}${ticket.contact?`\n연락처: ${ticket.contact}`:''}`;
    const output=$('#staff-output'); output.replaceChildren(); const box=document.createElement('div'); box.className='ticket'; box.textContent=text; output.append(box);
    const actions=document.createElement('div'); actions.className='dialog-actions'; const copy=document.createElement('button'); copy.type='button'; copy.className='button soft'; copy.textContent='내용 복사';
    copy.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(text);copy.textContent='복사 완료'}catch{alert('복사할 수 없습니다. 화면을 직원에게 보여주세요.')}});
    const call=document.createElement('a'); call.className='button soft'; call.href=`tel:${store.tel}`; call.textContent='전화하기';
    const inquiry=document.createElement('a'); inquiry.className='button navy'; inquiry.href=store.inquiryUrl; inquiry.target='_blank'; inquiry.rel='noopener'; inquiry.textContent='공식 문의 게시판';
    actions.append(copy,call,inquiry); output.append(actions);
    if(navigator.share){const share=document.createElement('button');share.type='button';share.className='button soft';share.textContent='공유';share.addEventListener('click',()=>navigator.share({title:'블루블랙 상담 요청',text}).catch(()=>{}));actions.prepend(share)}
    track('staff_ticket_created',{id:ticket.id,type:ticket.type,location:ticket.location,hasContact:Boolean(ticket.contact)});
  });
  if(!sessionStorage.getItem('privacy-seen')){$('#privacy-toast').hidden=false;} track('staff_form_open');
}
function assistantReply(query) {
  const q=safeText(query,160); const n=normalize(q);
  if(/가격|재고|품절|있나요|있어/.test(n)) return {text:'가격과 재고는 실시간으로 바뀔 수 있어요. 공식몰 상품 페이지 또는 직원 확인이 필요합니다.',actions:[['공식몰',store.shopUrl,'link'],['상담 요청서','staff','action']]};
  if(/직원|상담|문의/.test(n)) return {text:'자동 호출이 아니라 직원에게 보여줄 상담 요청서를 만들어 드립니다.',actions:[['요청서 만들기','staff','action']]};
  const results=searchIndex(guideIndex,q).slice(0,3);
  if(!results.length)return {text:'관련 가이드를 찾지 못했습니다. “촉”, “잉크 안 나옴”, “각인”처럼 짧게 표현하거나 상담 요청서를 만들어 주세요.',actions:[['상담 요청서','staff','action']]};
  return {text:results[0].summary,actions:results.map(r=>[`${r.icon} ${r.title}`,r.id,'guide'])};
}
function addMessage(text,type='bot',actions=[]) {
  const msg=document.createElement('div'); msg.className=`message ${type}`; msg.textContent=text; $('#assistant-log').append(msg);
  if(actions.length){const wrap=document.createElement('div');wrap.className=`message ${type}`;actions.forEach(([label,target,kind])=>{const b=document.createElement('button');b.type='button';b.textContent=label;b.addEventListener('click',()=>{if(kind==='guide')openGuide(target);else if(kind==='action')openStaff('가이드 도우미에서 요청');else window.open(target,'_blank','noopener')});wrap.append(b,document.createElement('br'))});$('#assistant-log').append(wrap)}
  $('#assistant-log').scrollTop=$('#assistant-log').scrollHeight;
}
function updateNetwork() {const online=navigator.onLine;$('#network-status').textContent=online?'온라인':'오프라인';$('#network-status').classList.toggle('offline',!online)}
function setupKiosk() {
  if(!isKiosk)return; document.body.classList.add('kiosk'); let timer;
  const reset=()=>{clearTimeout(timer);timer=setTimeout(()=>{if($('#flow-dialog').open)closeDialog();$('#assistant-panel').hidden=true;location.hash='#home';window.scrollTo({top:0,behavior:'smooth'});track('kiosk_idle_reset')},120000)};
  ['pointerdown','keydown','touchstart'].forEach(e=>addEventListener(e,reset,{passive:true})); reset();
  $$('a[target="_blank"]').forEach(a=>a.addEventListener('click',e=>{if(!confirm('외부 페이지를 열까요? 키오스크로 돌아오려면 뒤로 가기를 눌러주세요.'))e.preventDefault()}));
}
function exportLogs() {const data=localStorage.getItem('bb-guide-events')||'[]';const blob=new Blob([data],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`blueblack-guide-events-${new Date().toISOString().slice(0,10)}.json`;a.click();URL.revokeObjectURL(a.href)}
function init() {
  $('#app-version').textContent=`Guide v${APP_VERSION} · 콘텐츠 확인 ${VERIFIED_AT}`;
  renderProducts(); renderCategories(); renderGuides(); updateNetwork(); setupKiosk(); track('page_view',{kiosk:isKiosk});
  $$('[data-action]').forEach(btn=>btn.addEventListener('click',()=>({recommend:startRecommendation,trouble:startTrouble,service:openService,staff:()=>openStaff()}[btn.dataset.action]?.())));
  $$('.filter-chip').forEach(btn=>btn.addEventListener('click',()=>{$$('.filter-chip').forEach(x=>x.classList.toggle('active',x===btn));filterProducts(btn.dataset.filter)}));
  $('#search-button').addEventListener('click',()=>showSearch($('#global-search').value)); $('#global-search').addEventListener('keydown',e=>{if(e.key==='Enter')showSearch(e.currentTarget.value)});
  $$('[data-query]').forEach(btn=>btn.addEventListener('click',()=>{$('#global-search').value=btn.dataset.query;showSearch(btn.dataset.query)})); $('#clear-search').addEventListener('click',()=>$('#search-results').hidden=true);
  $('#dialog-close').addEventListener('click',closeDialog); $('#flow-dialog').addEventListener('click',e=>{if(e.target===$('#flow-dialog'))closeDialog()});
  $('#assistant-launcher').addEventListener('click',()=>{$('#assistant-panel').hidden=false;$('#assistant-launcher').setAttribute('aria-expanded','true');if(!$('#assistant-log').children.length)addMessage('안녕하세요. 만년필 선택, 닙, 잉크, 세척, 각인과 AS를 물어보세요.')});
  $('#assistant-close').addEventListener('click',()=>{$('#assistant-panel').hidden=true;$('#assistant-launcher').setAttribute('aria-expanded','false');$('#assistant-launcher').focus()});
  $('#assistant-form').addEventListener('submit',e=>{e.preventDefault();const input=$('#assistant-input'),q=safeText(input.value,160);if(!q)return;addMessage(q,'user');input.value='';const reply=assistantReply(q);setTimeout(()=>addMessage(reply.text,'bot',reply.actions),120);track('assistant_query',{query:q})});
  $('#text-size').addEventListener('click',()=>{document.body.classList.toggle('large-text');localStorage.setItem('bb-large-text',document.body.classList.contains('large-text')?'1':'0')});
  $('#contrast').addEventListener('click',()=>{document.body.classList.toggle('high-contrast');localStorage.setItem('bb-contrast',document.body.classList.contains('high-contrast')?'1':'0')});
  if(localStorage.getItem('bb-large-text')==='1')document.body.classList.add('large-text');if(localStorage.getItem('bb-contrast')==='1')document.body.classList.add('high-contrast');
  $('#privacy-ok').addEventListener('click',()=>{$('#privacy-toast').hidden=true;sessionStorage.setItem('privacy-seen','1')}); $('#export-log').addEventListener('click',exportLogs); addEventListener('online',updateNetwork);addEventListener('offline',updateNetwork);
  if('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').then(reg=>{reg.addEventListener('updatefound',()=>{const worker=reg.installing;worker?.addEventListener('statechange',()=>{if(worker.state==='installed'&&navigator.serviceWorker.controller)$('#update-banner').hidden=false})});$('#update-now').addEventListener('click',()=>{reg.waiting?.postMessage({type:'SKIP_WAITING'});location.reload()})}).catch(()=>{});
}
init();
