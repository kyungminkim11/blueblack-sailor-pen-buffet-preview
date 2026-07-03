import{API_URL,API_KEY}from'../inventory-audit/audit-config.js';

const panel=document.querySelector('[data-panel="text"]');
const searchInput=document.querySelector('#productSearch');
const searchButton=document.querySelector('#searchButton');
if(!panel||!searchInput||!searchButton)throw new Error('상품 검색 화면을 찾지 못했습니다.');

const brandLabels={
  SAILOR:'세일러',TWSBI:'트위스비',LAMY:'라미',PILOT:'파이롯트',KAWECO:'카웨코',PELIKAN:'펠리칸',PLATINUM:'플래티넘',AURORA:'오로라',MAJOHN:'마존',OPUS88:'오퍼스88',DIPLOMAT:'디플로마트',OTTOHUTT:'오토후트',LABAN:'라반',CONKLIN:'콘클린',MONTEVERDE:'몬테베르데','Nahvalur(Narwhal)':'나발루',PARKER:'파카','FABER CASTELL':'파버카스텔',ESTERBROOK:'에스터브룩',IWI:'IWI',OMAS:'오마스',WATERMAN:'워터맨',SHEAFFER:'쉐퍼',NAMIKI:'나미키','GRAF VON FABER CASTELL':'그라폰 파버카스텔',CROSS:'크로스',VISCONTI:'비스콘티','CARAN DACHE':'까렌다쉬','MONT BLANC':'몽블랑'
};

const families={
  SAILOR:[['프로피트21','세일러 프로피트21 만년필'],['프로피트21 스페셜닙','세일러 프로피트21 스페셜닙 만년필'],['프로피트21 리알로','세일러 프로피트21 리알로 만년필'],['프로기어21','세일러 프로기어21 만년필'],['프로기어 슬림','세일러 프로기어 슬림 만년필'],['프로피트 라이트','세일러 프로피트 라이트 만년필'],['프로피트 스탠다드','세일러 프로피트 스탠다드 만년필'],['프로피트 라지 14K','세일러 프로피트 라지 14K 만년필'],['프로피트 라지 18K','세일러 프로피트 라지 18K 만년필'],['프로피트 캐주얼','세일러 프로피트 캐주얼 만년필'],['투주 어저스트','세일러 투주 어저스트 만년필'],['실린트','세일러 실린트 만년필'],['에보나이트 스컬춰','세일러 에보나이트 스컬춰 만년필']],
  LAMY:[['사파리','라미 사파리 만년필'],['알스타','라미 알스타 만년필'],['스튜디오','라미 스튜디오 만년필'],['2000','라미 2000 만년필'],['룩스','라미 룩스 만년필'],['다이얼로그 CC','라미 다이얼로그 CC 만년필'],['조이','라미 조이 만년필'],['로고','라미 로고 만년필'],['임포리움','라미 임포리움 만년필']],
  PILOT:[['카쿠노','파이롯트 카쿠노 만년필'],['라이티브','파이롯트 라이티브 만년필'],['캡리스 데시모','파이롯트 캡리스 데시모 만년필'],['캡리스','파이롯트 캡리스 만년필'],['프레라','파이롯트 프레라 만년필'],['커스텀74','파이롯트 커스텀74 만년필'],['커스텀742','파이롯트 커스텀742 만년필'],['커스텀743','파이롯트 커스텀743 만년필'],['커스텀845','파이롯트 커스텀845 만년필'],['에라보','파이롯트 에라보 만년필'],['우루시','파이롯트 우루시 만년필']],
  PLATINUM:[['센츄리 3776','플래티넘 센츄리 만년필'],['프레피','플래티넘 프레피 만년필'],['뉴 프레피','플래티넘 뉴 프레피 만년필'],['스타렛','플래티넘 스타렛 만년필'],['비소','플래티넘 비소 만년필']],
  TWSBI:[['에코','트위스비 에코 만년필'],['DIA 580 ALR','트위스비 DIA 580 ALR 만년필'],['DIA 580','트위스비 DIA 580 만년필'],['DIA 미니','트위스비 DIA 미니 만년필'],['VAC 700R','트위스비 VAC 700R 만년필'],['VAC 미니','트위스비 VAC 미니 만년필'],['고','트위스비 고 만년필'],['프리시전','트위스비 프리시전 만년필'],['카이','트위스비 카이 만년필']],
  KAWECO:[['스포츠','카웨코 스포츠 만년필'],['알 스포츠','카웨코 알 스포츠 만년필'],['브라스 스포츠','카웨코 브라스 스포츠 만년필'],['아트 스포츠','카웨코 아트 스포츠 만년필'],['스튜던트','카웨코 스튜던트 만년필'],['릴리풋','카웨코 릴리풋 만년필'],['수프라','카웨코 수프라 만년필'],['페르케오','카웨코 페르케오 만년필'],['다이아2','카웨코 다이아2 만년필']],
  PELIKAN:[['M200','펠리칸 M200 만년필'],['M205','펠리칸 M205 만년필'],['M400','펠리칸 M400 만년필'],['M405','펠리칸 M405 만년필'],['M600','펠리칸 M600 만년필'],['M605','펠리칸 M605 만년필'],['M800','펠리칸 M800 만년필'],['M805','펠리칸 M805 만년필'],['M1000','펠리칸 M1000 만년필']],
  AURORA:[['88','오로라 88 만년필'],['옵티마','오로라 옵티마 만년필'],['탈렌튬','오로라 탈렌튬 만년필'],['입실론','오로라 입실론 만년필'],['인터나지오날','오로라 인터나지오날 만년필'],['단테','오로라 단테 만년필']],
  MAJOHN:[['P136','마존 P136 만년필'],['완차이2','마존 완차이2 만년필'],['뉴문3','마존 뉴문3 만년필'],['T5','마존 T5 만년필'],['M1','마존 M1 만년필'],['M800','마존 M800 만년필'],['M2','마존 M2 만년필'],['C3','마존 C3 만년필'],['C4','마존 C4 만년필']],
  OPUS88:[['재즈','오퍼스88 재즈 만년필'],['데모','오퍼스88 데모 만년필'],['코롤로','오퍼스88 코롤로 만년필'],['하모니','오퍼스88 하모니 만년필'],['쉘','오퍼스88 쉘 만년필'],['미니 포켓','오퍼스88 미니 포켓 만년필'],['오마르','오퍼스88 오마르 만년필'],['플로라','오퍼스88 플로라 만년필']],
  PARKER:[['소네트','파카 소네트 만년필'],['아이엠','파카 아이엠 만년필'],['어번','파카 어번 만년필'],['듀오폴드','파카 듀오폴드 만년필']],
  'FABER CASTELL':[['엠비션','파버카스텔 엠비션 만년필'],['이모션','파버카스텔 이모션 만년필'],['룸','파버카스텔 룸 만년필'],['헥소','파버카스텔 헥소 만년필'],['그립','파버카스텔 그립 만년필']]
};

const style=document.createElement('style');
style.textContent=`.fp-catalog{margin-top:16px;padding-top:16px;border-top:1px solid #e0e7ed}.fp-catalog-head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start}.fp-catalog-head small{display:block;color:#a77a3d;font-size:8px;font-weight:900;letter-spacing:.1em}.fp-catalog-head strong{display:block;margin-top:5px;color:#10233f;font-size:16px}.fp-catalog-head p{margin:5px 0 0;color:#68798b;font-size:9px;line-height:1.6}.fp-toggle{min-height:36px;padding:0 11px;border:1px solid #d2dce5;border-radius:10px;background:#fff;color:#354b64;font-size:8px;font-weight:900}.fp-examples,.fp-brands,.fp-families{display:flex;gap:7px;flex-wrap:wrap}.fp-examples{margin-top:11px}.fp-example{min-height:34px;padding:0 11px;border:1px solid #d7e0e8;border-radius:999px;background:#f7f9fb;color:#43566c;font-size:8px;font-weight:900}.fp-brands{margin-top:13px}.fp-brand{display:grid;gap:3px;min-width:116px;padding:10px 12px;border:1px solid #d7e0e8;border-radius:12px;background:#fff;text-align:left}.fp-brand strong{color:#10233f;font-size:10px}.fp-brand span{color:#758496;font-size:7px}.fp-brand.active{border-color:#102b4c;background:#102b4c}.fp-brand.active strong,.fp-brand.active span{color:#fff}.fp-family-box{margin-top:12px;padding:13px;border-radius:13px;background:#f4f7fa}.fp-family-head{display:flex;justify-content:space-between;gap:10px;align-items:center;margin-bottom:9px}.fp-family-head strong{font-size:11px}.fp-family-head button{min-height:32px;padding:0 10px;border:0;border-radius:9px;background:#102b4c;color:#fff;font-size:8px;font-weight:900}.fp-family{min-height:34px;padding:0 11px;border:1px solid #cfd9e2;border-radius:999px;background:#fff;color:#273e59;font-size:8px;font-weight:900}.fp-loading{margin-top:12px;padding:14px;border:1px dashed #cbd6df;border-radius:12px;color:#68798b;font-size:9px;text-align:center}@media(max-width:600px){.fp-catalog-head{display:block}.fp-toggle{margin-top:9px}.fp-brand{min-width:calc(50% - 4px);flex:1}.fp-family-box{margin-left:-2px;margin-right:-2px}}`;
document.head.append(style);

const section=document.createElement('section');
section.className='fp-catalog';
section.innerHTML=`<div class="fp-catalog-head"><div><small>FOUNTAIN PEN CATALOG</small><strong>브랜드·제품군으로 빠르게 찾기</strong><p>띄어쓰기와 일부 한글·영문 별칭을 자동으로 보정합니다. 재고가 있는 상품이 먼저 표시됩니다.</p></div><button type="button" class="fp-toggle" id="fpToggle">전체 브랜드 보기</button></div><div class="fp-examples" id="fpExamples"></div><div id="fpBrands" class="fp-brands"><div class="fp-loading">보유 만년필 브랜드를 불러오고 있습니다…</div></div><div id="fpFamilyBox" class="fp-family-box" hidden><div class="fp-family-head"><strong id="fpFamilyTitle"></strong><button type="button" id="fpBrandAll">브랜드 전체 보기</button></div><div id="fpFamilies" class="fp-families"></div></div>`;
panel.append(section);

const brandBox=section.querySelector('#fpBrands');
const familyBox=section.querySelector('#fpFamilyBox');
const familyTitle=section.querySelector('#fpFamilyTitle');
const familyList=section.querySelector('#fpFamilies');
const brandAll=section.querySelector('#fpBrandAll');
const toggle=section.querySelector('#fpToggle');
const exampleBox=section.querySelector('#fpExamples');
let brandRows=[];
let expanded=false;
let activeBrand='';

const examples=[['프로피트 21','프로피트 21'],['프로핏21 금촉','프로핏21 금촉'],['사파리','라미 사파리 만년필'],['3776','플래티넘 3776 만년필'],['커스텀 74','파이롯트 커스텀 74 만년필']];
examples.forEach(([label,query])=>{const button=document.createElement('button');button.type='button';button.className='fp-example';button.textContent=label;button.onclick=()=>runSearch(query);exampleBox.append(button)});

function runSearch(query){searchInput.value=query;searchInput.dispatchEvent(new Event('input',{bubbles:true}));searchButton.click()}
function brandLabel(value){return brandLabels[value]||value}
function visibleBrands(){return expanded?brandRows:brandRows.slice(0,12)}

function renderBrands(){
  brandBox.replaceChildren();
  visibleBrands().forEach(row=>{
    const button=document.createElement('button');
    button.type='button';button.className='fp-brand';button.classList.toggle('active',row.manufacturer===activeBrand);
    button.innerHTML=`<strong>${brandLabel(row.manufacturer)}</strong><span>재고 ${Number(row.in_stock_count).toLocaleString('ko-KR')} · 등록 ${Number(row.product_count).toLocaleString('ko-KR')}</span>`;
    button.onclick=()=>selectBrand(row.manufacturer);
    brandBox.append(button);
  });
  toggle.hidden=brandRows.length<=12;
  toggle.textContent=expanded?'주요 브랜드만 보기':`전체 ${brandRows.length}개 브랜드 보기`;
}

function selectBrand(brand){
  activeBrand=brand;renderBrands();
  const label=brandLabel(brand),items=families[brand]||[];
  familyTitle.textContent=`${label} 제품군`;
  brandAll.textContent=`${label} 만년필 전체 보기`;
  brandAll.onclick=()=>runSearch(`${label} 만년필`);
  familyList.replaceChildren();
  if(items.length){items.forEach(([name,query])=>{const button=document.createElement('button');button.type='button';button.className='fp-family';button.textContent=name;button.onclick=()=>runSearch(query);familyList.append(button)})}
  else{const note=document.createElement('span');note.className='muted';note.textContent='이 브랜드는 전체 상품 검색으로 확인해 주세요.';familyList.append(note)}
  familyBox.hidden=false;
  runSearch(`${label} 만년필`);
}

toggle.onclick=()=>{expanded=!expanded;renderBrands()};

async function loadBrands(){
  try{
    const response=await fetch(`${API_URL}/rest/v1/rpc/internal_fountain_pen_brand_summary_public`,{method:'POST',headers:{apikey:API_KEY,Authorization:`Bearer ${API_KEY}`,'Content-Type':'application/json'},body:'{}'});
    const data=await response.json();
    if(!response.ok)throw new Error(data?.message||'브랜드 목록을 불러오지 못했습니다.');
    brandRows=Array.isArray(data)?data:[];
    renderBrands();
  }catch(error){brandBox.innerHTML=`<div class="fp-loading">${error.message}</div>`}
}

loadBrands();