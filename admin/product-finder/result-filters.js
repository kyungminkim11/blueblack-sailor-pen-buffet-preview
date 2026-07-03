import{API_URL,API_KEY}from'../inventory-audit/audit-config.js';

const textPanel=document.querySelector('[data-panel="text"]');
const searchInput=document.querySelector('#productSearch');
const searchButton=document.querySelector('#searchButton');
if(!textPanel||!searchInput||!searchButton)throw new Error('이름 검색 화면을 찾지 못했습니다.');

searchInput.placeholder='상품명·모델명 검색 (예: 프로피트21, 사파리)';

const state={sort:'relevance',stock:'all',brand:'',type:'',material:'',karat:'',minPrice:'',maxPrice:'',nibs:new Set()};
const nibOptions=[['EF','EF'],['F','F'],['MF','MF'],['M','M'],['B','B'],['BB','BB'],['MS','뮤직'],['Z','줌'],['UEF','UEF'],['SF','SF'],['SM','SM'],['STUB','스텁'],['NAGINATA','나기나타']];
const productCache=new Map();
let interpretedMessage='';

const style=document.createElement('style');
style.textContent=`.result-filter{margin-top:13px;border:1px solid #d8e1e9;border-radius:15px;background:#f8fafc;overflow:hidden}.result-filter summary{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:13px 14px;cursor:pointer;list-style:none}.result-filter summary::-webkit-details-marker{display:none}.result-filter summary strong{color:#10233f;font-size:11px}.result-filter summary span{color:#718093;font-size:8px;font-weight:850}.result-filter-body{padding:0 13px 13px}.filter-guide{margin-bottom:11px;padding:10px 11px;border-radius:10px;background:#edf3f8;color:#41566e;font-size:8px;line-height:1.65}.filter-guide b{color:#102b4c}.filter-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:9px}.filter-field{display:grid;gap:5px}.filter-field label,.filter-label{color:#516277;font-size:8px;font-weight:900}.filter-field select,.filter-field input{width:100%;height:43px;padding:0 10px;border:1px solid #cbd6df;border-radius:10px;background:#fff;color:#18314e;font:inherit;font-size:10px}.price-pair{display:grid;grid-template-columns:1fr 1fr;gap:7px}.nib-filter{margin-top:11px}.nib-filter-buttons{display:flex;gap:6px;flex-wrap:wrap;margin-top:7px}.nib-filter-button{min-width:42px;min-height:35px;padding:0 10px;border:1px solid #cfd9e2;border-radius:999px;background:#fff;color:#31475f;font-size:8px;font-weight:900}.nib-filter-button.active{border-color:#102b4c;background:#102b4c;color:#fff}.filter-footer{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:11px}.filter-status{color:#68798b;font-size:8px;line-height:1.55}.filter-status.interpreted{color:#8a5a00;font-weight:900}.filter-reset{min-height:36px;padding:0 11px;border:1px solid #d0dae3;border-radius:10px;background:#fff;color:#344b64;font-size:8px;font-weight:900}.nib-material-badge{display:inline-flex!important;align-items:center;justify-content:center;width:auto!important;min-height:22px;margin-top:6px;padding:0 8px;border-radius:999px;font-size:7px!important;font-style:normal;font-weight:950;letter-spacing:.02em}.nib-material-badge.gold{background:#fff4d6!important;color:#8a5a00!important;border:1px solid #e4c77a}.nib-material-badge.steel{background:#edf2f6!important;color:#40566d!important;border:1px solid #c9d4de}.nib-material-badge.other{background:#fff0e8!important;color:#9b4e22!important;border:1px solid #e8c2aa}#productBrand .nib-material-badge{margin-left:7px;margin-top:0;vertical-align:middle}.candidate-button .nib-material-badge{align-self:flex-start}@media(max-width:780px){.filter-grid{grid-template-columns:1fr 1fr}}@media(max-width:480px){.filter-grid{grid-template-columns:1fr}.price-pair{grid-template-columns:1fr 1fr}.result-filter summary{padding:12px}.result-filter-body{padding:0 11px 12px}}`;
document.head.append(style);

const details=document.createElement('details');
details.className='result-filter';
details.open=true;
details.innerHTML=`<summary><strong>검색된 상품 좁히기·정렬</strong><span id="activeFilterText">추천순 · 전체 재고</span></summary><div class="result-filter-body"><div class="filter-guide"><b>사용법:</b> 검색창에는 브랜드·모델명만 입력하고, 가격순·재고·촉·닙 소재는 아래에서 선택하세요. 예: <b>프로피트</b> 검색 → <b>14K</b> → <b>낮은 가격순</b></div><div class="filter-grid"><div class="filter-field"><label for="filterSort">결과 정렬</label><select id="filterSort"><option value="relevance">추천순</option><option value="price_asc">낮은 가격순</option><option value="price_desc">높은 가격순</option><option value="stock_desc">재고 많은 순</option><option value="name_asc">상품명순</option></select></div><div class="filter-field"><label for="filterStock">재고 상태</label><select id="filterStock"><option value="all">전체</option><option value="in_stock">재고 있음</option><option value="out_of_stock">재고 0개</option><option value="unknown">재고 정보 없음</option></select></div><div class="filter-field"><label for="filterBrand">브랜드</label><select id="filterBrand"><option value="">전체 브랜드</option></select></div><div class="filter-field"><label for="filterType">상품 종류</label><select id="filterType"><option value="">전체 종류</option><option value="만년필">만년필</option><option value="수성펜">수성펜</option><option value="볼펜">볼펜</option><option value="샤프">샤프</option><option value="잉크">잉크</option><option value="노트">노트</option><option value="촉">촉</option><option value="부품">부품</option><option value="리필">리필</option><option value="악세사리">악세사리</option></select></div><div class="filter-field"><label for="filterMaterial">닙 소재</label><select id="filterMaterial"><option value="">전체 닙 소재</option><option value="gold">금닙</option><option value="steel">스틸닙</option><option value="other">기타·확인 필요</option></select></div><div class="filter-field"><label for="filterKarat">금닙 함량</label><select id="filterKarat"><option value="">전체 금닙</option><option value="14K">14K</option><option value="18K">18K</option><option value="21K">21K</option></select></div><div class="filter-field" style="grid-column:span 2"><span class="filter-label">가격 범위</span><div class="price-pair"><input id="filterMinPrice" type="number" min="0" step="1000" inputmode="numeric" placeholder="최저 가격"><input id="filterMaxPrice" type="number" min="0" step="1000" inputmode="numeric" placeholder="최고 가격"></div></div></div><div class="nib-filter"><span class="filter-label">펜촉 규격 · 여러 개 선택 가능</span><div class="nib-filter-buttons" id="filterNibs"></div></div><div class="filter-footer"><span class="filter-status" id="filterStatus">검색 결과 전체에 선택한 정렬과 필터가 적용됩니다.</span><button type="button" class="filter-reset" id="filterReset">필터 초기화</button></div></div>`;

const searchRow=textPanel.querySelector('.main-search-row');
searchRow?.after(details);

const ui={sort:details.querySelector('#filterSort'),stock:details.querySelector('#filterStock'),brand:details.querySelector('#filterBrand'),type:details.querySelector('#filterType'),material:details.querySelector('#filterMaterial'),karat:details.querySelector('#filterKarat'),minPrice:details.querySelector('#filterMinPrice'),maxPrice:details.querySelector('#filterMaxPrice'),nibs:details.querySelector('#filterNibs'),status:details.querySelector('#filterStatus'),activeText:details.querySelector('#activeFilterText'),reset:details.querySelector('#filterReset')};

nibOptions.forEach(([value,label])=>{const button=document.createElement('button');button.type='button';button.className='nib-filter-button';button.dataset.value=value;button.textContent=label;button.onclick=()=>{state.nibs.has(value)?state.nibs.delete(value):state.nibs.add(value);button.classList.toggle('active',state.nibs.has(value));scheduleSearch()};ui.nibs.append(button)});

function numberOrNull(value){const parsed=Number(value);return value!==''&&Number.isFinite(parsed)?parsed:null}
function activeText(){const parts=[];const sortLabels={relevance:'추천순',price_asc:'낮은 가격순',price_desc:'높은 가격순',stock_desc:'재고 많은 순',name_asc:'상품명순'};const stockLabels={all:'전체 재고',in_stock:'재고 있음',out_of_stock:'재고 0개',unknown:'재고 정보 없음'};const materialLabels={gold:'금닙',steel:'스틸닙',other:'기타 닙'};parts.push(sortLabels[state.sort],stockLabels[state.stock]);if(state.brand)parts.push(ui.brand.selectedOptions[0]?.textContent||state.brand);if(state.type)parts.push(state.type);if(state.material)parts.push(materialLabels[state.material]);if(state.karat)parts.push(state.karat);if(state.minPrice||state.maxPrice)parts.push('가격 범위');if(state.nibs.size)parts.push([...state.nibs].join('·'));return parts.join(' · ')}
function updateActiveText(){ui.activeText.textContent=activeText();const count=(state.sort!=='relevance'?1:0)+(state.stock!=='all'?1:0)+(state.brand?1:0)+(state.type?1:0)+(state.material?1:0)+(state.karat?1:0)+(state.minPrice||state.maxPrice?1:0)+(state.nibs.size?1:0);ui.status.classList.toggle('interpreted',Boolean(interpretedMessage));ui.status.textContent=interpretedMessage||(count?`${count}개 조건을 검색 결과 전체에 적용합니다.`:'검색 결과 전체에 선택한 정렬과 필터가 적용됩니다.')}

function interpretQuery(raw){
  interpretedMessage='';
  const trimmed=String(raw||'').trim();
  const exact=trimmed.match(/^(14|18|21)\s*(?:k|금)?$/i);
  const explicit=trimmed.match(/(?:^|\s)(14|18|21)\s*(?:k|금)(?=\s|$)/i);
  const match=exact||explicit;
  if(!match)return trimmed;
  const karat=`${match[1]}K`;
  state.karat=karat;state.material='gold';state.type='만년필';
  ui.karat.value=karat;ui.material.value='gold';ui.type.value='만년필';
  let remaining=trimmed;
  if(explicit&&!exact)remaining=trimmed.replace(explicit[0],' ').replace(/\s+/g,' ').trim();
  else remaining='';
  interpretedMessage=`‘${trimmed}’를 ${karat} 금닙 조건으로 적용했습니다. 가격 정렬은 해당 결과 전체에 적용됩니다.`;
  updateActiveText();
  return remaining.length>=2?remaining:'만년필';
}

let timer=0;
function scheduleSearch(){interpretedMessage='';updateActiveText();clearTimeout(timer);timer=setTimeout(()=>{if(document.querySelector('[data-panel="text"]')?.classList.contains('active')&&searchInput.value.trim().length>=2)searchButton.click()},180)}

ui.sort.onchange=()=>{state.sort=ui.sort.value;scheduleSearch()};
ui.stock.onchange=()=>{state.stock=ui.stock.value;scheduleSearch()};
ui.brand.onchange=()=>{state.brand=ui.brand.value;scheduleSearch()};
ui.type.onchange=()=>{state.type=ui.type.value;if(state.type!=='만년필'){state.material='';state.karat='';ui.material.value='';ui.karat.value=''}scheduleSearch()};
ui.material.onchange=()=>{state.material=ui.material.value;if(state.material){state.type='만년필';ui.type.value='만년필'}if(state.material!=='gold'){state.karat='';ui.karat.value=''}scheduleSearch()};
ui.karat.onchange=()=>{state.karat=ui.karat.value;if(state.karat){state.material='gold';state.type='만년필';ui.material.value='gold';ui.type.value='만년필'}scheduleSearch()};
ui.minPrice.oninput=()=>{state.minPrice=ui.minPrice.value;scheduleSearch()};
ui.maxPrice.oninput=()=>{state.maxPrice=ui.maxPrice.value;scheduleSearch()};
ui.reset.onclick=()=>{state.sort='relevance';state.stock='all';state.brand='';state.type='';state.material='';state.karat='';state.minPrice='';state.maxPrice='';state.nibs.clear();interpretedMessage='';ui.sort.value='relevance';ui.stock.value='all';ui.brand.value='';ui.type.value='';ui.material.value='';ui.karat.value='';ui.minPrice.value='';ui.maxPrice.value='';ui.nibs.querySelectorAll('button').forEach(button=>button.classList.remove('active'));scheduleSearch()};

async function loadBrands(){try{const response=await fetch(`${API_URL}/rest/v1/rpc/internal_fountain_pen_brand_summary_public`,{method:'POST',headers:{apikey:API_KEY,Authorization:`Bearer ${API_KEY}`,'Content-Type':'application/json'},body:'{}'});const rows=await response.json();if(!response.ok)throw new Error();rows.forEach(row=>{const option=document.createElement('option');option.value=row.manufacturer;option.textContent=`${row.manufacturer} · ${Number(row.product_count).toLocaleString('ko-KR')}개`;ui.brand.append(option)})}catch{ui.brand.disabled=true}}

function rememberProducts(rows){if(!Array.isArray(rows))return;rows.forEach(row=>{if(row?.id!==undefined)productCache.set(String(row.id),row)})}
function badgeFor(product){if(!product?.nib_material)return null;const badge=document.createElement('em');badge.className=`nib-material-badge ${product.nib_material}`;if(product.nib_material==='gold'&&product.nib_karat)badge.textContent=`${product.nib_karat} 금닙`;else badge.textContent=product.nib_material_label||({gold:'금닙',steel:'스틸닙',other:'기타·확인 필요'}[product.nib_material]||'닙 확인 필요');return badge}
function decorateResults(){
  document.querySelectorAll('.candidate-button').forEach(button=>{if(button.querySelector('.nib-material-badge'))return;const product=productCache.get(String(button.dataset.id));const badge=badgeFor(product);if(badge)(button.firstElementChild||button).append(badge)});
  const brand=document.querySelector('#productBrand');
  if(!brand)return;
  brand.querySelector('.nib-material-badge')?.remove();
  const active=document.querySelector('.candidate-button.active');
  let product=active?productCache.get(String(active.dataset.id)):null;
  if(!product){const name=document.querySelector('#productName')?.textContent?.trim();product=[...productCache.values()].find(row=>row.product_name===name)}
  const badge=badgeFor(product);if(badge)brand.append(badge);
}
new MutationObserver(decorateResults).observe(document.documentElement,{childList:true,subtree:true,characterData:true});

const originalFetch=window.fetch.bind(window);
window.fetch=async(...args)=>{
  const input=args[0];
  const requestUrl=String(input instanceof Request?input.url:input||'');
  if(!requestUrl.includes('/rest/v1/rpc/internal_product_search_public'))return originalFetch(...args);
  const options=args[1]||{};
  let body={};
  try{body=JSON.parse(options.body||'{}')}catch{return originalFetch(...args)}
  const rawQuery=String(body.p_query||'').trim();
  const isTextSearch=document.querySelector('[data-panel="text"]')?.classList.contains('active')&&rawQuery&&rawQuery===searchInput.value.trim();
  const query=isTextSearch?interpretQuery(rawQuery):rawQuery;
  const targetUrl=isTextSearch?requestUrl.replace('internal_product_search_public','internal_product_search_filtered_v3_public'):requestUrl.replace('internal_product_search_public','internal_product_search_with_nib_v2_public');
  const payload=isTextSearch?{p_query:query,p_limit:300,p_sort:state.sort,p_min_price:numberOrNull(state.minPrice),p_max_price:numberOrNull(state.maxPrice),p_nibs:[...state.nibs],p_stock:state.stock,p_brand:state.brand||null,p_product_type:state.type||null,p_nib_material:state.material||null,p_gold_karat:state.karat||null}:{p_query:query,p_limit:body.p_limit||50};
  const response=await originalFetch(targetUrl,{...options,body:JSON.stringify(payload)});
  try{rememberProducts(await response.clone().json());queueMicrotask(decorateResults)}catch{}
  return response;
};

updateActiveText();
loadBrands();