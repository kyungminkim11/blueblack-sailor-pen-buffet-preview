import './public-ui-v52.js';
import './as-guide-i18n-v50.js?v=52';

const asCopy={
  ko:{title:'A/S 안내',intro:'펜뷔페 전용 안내와 브랜드별 공식 접수처, 연락처, 주소와 비용 관련 주의사항을 확인할 수 있습니다.',search:'브랜드 검색',placeholder:'예: 라미, Lamy, 세일러, Sailor',shown:n=>`${n}개 접수처가 표시됩니다.`,empty:'일치하는 브랜드를 찾지 못했습니다.',quickTitle:'주요 브랜드',quickHint:'자주 찾는 브랜드를 빠르게 선택하세요.',showAll:'전체 브랜드 보기',hideAll:'전체 브랜드 닫기',allTitle:'전체 브랜드 25개',allHint:'브랜드를 누르면 해당 공식 접수처만 표시됩니다.',penTitle:'펜뷔페 A/S·구매 안내',penIntro:'펜뷔페는 일반 브랜드 A/S와 별도의 블루블랙 전용 기준을 적용합니다.',nib:'펜촉',nibBody:'MF 단일촉으로 제공됩니다.',included:'기본 구성',includedBody:'블랙 색상 카트리지 2개가 동봉됩니다.',converter:'컨버터',converterBody:'기본 구성에 포함되지 않으며 별도 구매 상품입니다.',extra:'추가 색상 파츠',extraBody:'본품 구매 당일에 한해 추가 색상 파츠를 구매할 수 있습니다.',service:'전용 A/S',serviceBody:'블루블랙 펜샵에서만 가능하며 기한과 점검비는 없습니다. 부품 교체 시 비용이 발생합니다.',gift:'사은품 기준',giftBody:'펜뷔페 제품 금액은 사은품 합산 금액에서 제외됩니다.',openPen:'펜뷔페 미리보기',call:'전화 문의'},
  en:{title:'After-Sales Service Guide',intro:'Review the Pen Buffet policy and official service centers, contacts, addresses and cost notices by brand.',search:'Search brand',placeholder:'e.g. Lamy, Sailor, Pilot, Parker',shown:n=>`${n} service centers shown.`,empty:'No matching brand was found.',quickTitle:'Popular brands',quickHint:'Choose a frequently requested brand.',showAll:'View all brands',hideAll:'Close all brands',allTitle:'All 25 brands',allHint:'Select a brand to show only its official service center.',penTitle:'Pen Buffet service & purchase guide',penIntro:'Pen Buffet products follow a separate BlueBlack service policy.',nib:'Nib',nibBody:'Available with an MF nib only.',included:'Included',includedBody:'Two black ink cartridges are included.',converter:'Converter',converterBody:'Not included and sold separately.',extra:'Additional color parts',extraBody:'Additional color parts may be purchased only on the same day as the main pen.',service:'Dedicated service',serviceBody:'Available only at BlueBlack Pen Shop with no time limit or inspection fee. Replacement parts may incur a charge.',gift:'Gift calculation',giftBody:'Pen Buffet purchases are excluded from the gift-amount calculation.',openPen:'Open Pen Buffet',call:'Call the store'},
  ja:{title:'A/S・修理案内',intro:'ペンビュッフェ専用案内とブランド別の公式受付先、連絡先、住所、費用上の注意を確認できます。',search:'ブランド検索',placeholder:'例：ラミー、セーラー、パイロット',shown:n=>`${n}件の受付先を表示しています。`,empty:'該当するブランドがありません。',quickTitle:'主要ブランド',quickHint:'よく検索されるブランドをすぐに選択できます。',showAll:'全ブランドを見る',hideAll:'全ブランドを閉じる',allTitle:'全25ブランド',allHint:'ブランドを選択すると、該当する公式受付先のみ表示します。',penTitle:'ペンビュッフェ A/S・購入案内',penIntro:'ペンビュッフェには一般ブランド修理とは別のBlueBlack専用基準があります。',nib:'ペン先',nibBody:'MFのみです。',included:'基本構成',includedBody:'ブラックのカートリッジ2本が付属します。',converter:'コンバーター',converterBody:'付属せず別売りです。',extra:'追加カラーパーツ',extraBody:'本体購入当日に限り追加パーツを購入できます。',service:'専用A/S',serviceBody:'BlueBlack Pen Shopのみで対応します。期限と点検費はありませんが、部品交換時は費用が発生します。',gift:'ノベルティ基準',giftBody:'ペンビュッフェ製品はノベルティ合算金額の対象外です。',openPen:'ペンビュッフェを開く',call:'店舗へ電話'},
  'zh-Hans':{title:'售后服务指南',intro:'查看钢笔自助配色专用说明及各品牌官方受理中心、联系方式、地址和费用注意事项。',search:'搜索品牌',placeholder:'例如 Lamy、Sailor、Pilot、Parker',shown:n=>`显示${n}个受理中心。`,empty:'未找到匹配品牌。',quickTitle:'常用品牌',quickHint:'快速选择常被查询的品牌。',showAll:'查看全部品牌',hideAll:'收起全部品牌',allTitle:'全部25个品牌',allHint:'选择品牌后，仅显示对应的官方受理中心。',penTitle:'钢笔自助配色售后与购买说明',penIntro:'钢笔自助配色产品适用BlueBlack专用服务标准。',nib:'笔尖',nibBody:'仅提供MF笔尖。',included:'基本配置',includedBody:'随附2支黑色墨囊。',converter:'上墨器',converterBody:'不包含，需另行购买。',extra:'追加颜色部件',extraBody:'仅限购买本体当天追加购买。',service:'专用售后',serviceBody:'仅限BlueBlack Pen Shop受理，不限期限且免检测费；更换部件时会产生费用。',gift:'赠品金额',giftBody:'Pen Buffet产品金额不计入赠品累计金额。',openPen:'打开配色预览',call:'致电门店'},
  'zh-Hant':{title:'售後服務指南',intro:'查看鋼筆自助配色專用說明及各品牌官方受理中心、聯絡方式、地址與費用注意事項。',search:'搜尋品牌',placeholder:'例如 Lamy、Sailor、Pilot、Parker',shown:n=>`顯示${n}個受理中心。`,empty:'未找到符合品牌。',quickTitle:'常用品牌',quickHint:'快速選擇常被查詢的品牌。',showAll:'查看全部品牌',hideAll:'收合全部品牌',allTitle:'全部25個品牌',allHint:'選擇品牌後，只顯示對應的官方受理中心。',penTitle:'鋼筆自助配色售後與購買說明',penIntro:'鋼筆自助配色產品適用BlueBlack專用服務標準。',nib:'筆尖',nibBody:'僅提供MF筆尖。',included:'基本配置',includedBody:'隨附2支黑色墨囊。',converter:'吸墨器',converterBody:'不包含，需另行購買。',extra:'追加顏色部件',extraBody:'僅限購買本體當天追加購買。',service:'專用售後',serviceBody:'僅限BlueBlack Pen Shop受理，不限期限且免檢測費；更換部件時會產生費用。',gift:'贈品金額',giftBody:'Pen Buffet產品金額不計入贈品累計金額。',openPen:'開啟配色預覽',call:'致電門市'}
};

const allBrands=[
  ['파카','Parker'],['워터맨','Waterman'],['세일러','Sailor'],['카웨코','Kaweco'],['나왈','Nahvalur'],['디플로마트','Diplomat'],['IWI','IWI'],['콘클린','Conklin'],['몬테베르데','Monteverde'],['오로라','Aurora'],['플래티넘','Platinum'],['펠리칸','Pelikan'],['크로스','Cross'],['쉐퍼','Sheaffer'],['로트링','Rotring'],['파이롯트','Pilot'],['파버카스텔','Faber-Castell'],['그라폰파버카스텔','Graf von Faber-Castell'],['모나미','Monami'],['라미','Lamy'],['트위스비','TWSBI'],['오퍼스88','Opus 88'],['라반','Laban'],['비스콘티','Visconti'],['마존','Majohn']
];

function asLang(){const raw=(new URLSearchParams(location.search).get('lang')||localStorage.getItem('blueblack-language')||navigator.language||'ko').toLowerCase();if(raw.includes('hant')||raw.startsWith('zh-tw')||raw.startsWith('zh-hk'))return'zh-Hant';if(raw.startsWith('zh'))return'zh-Hans';if(raw.startsWith('ja'))return'ja';if(raw.startsWith('en'))return'en';return'ko';}
function asNorm(value=''){return String(value).normalize('NFKC').toLowerCase().replace(/[^0-9a-z가-힣ぁ-んァ-ヶ一-龠]+/g,'');}
function brandLabel(brand){return asLang()==='ko'&&brand[0]!==brand[1]?`${brand[0]} / ${brand[1]}`:brand[1];}

const input=document.querySelector('#asBrandSearch');
const clearButton=document.querySelector('#asBrandClear');
const summary=document.querySelector('#asResultSummary');
const cards=[...document.querySelectorAll('[data-as-search]')];
let allBrandsOpen=false;

function installPenBuffetGuide(){const section=document.querySelector('.as-related');if(!section)return;section.id='pen-buffet-service';const finder=document.querySelector('#as-finder');finder?.before(section);section.className='detail-card as-precheck';}
function renderPenBuffetGuide(){const section=document.querySelector('#pen-buffet-service');if(!section)return;const t=asCopy[asLang()]||asCopy.ko;section.innerHTML=`<div class="as-section-heading"><div><small>PEN BUFFET SERVICE</small><h2>${t.penTitle}</h2></div><p>${t.penIntro}</p></div><div class="detail-grid"><article class="detail-item"><small>NIB</small><strong>${t.nib}</strong><span>${t.nibBody}</span></article><article class="detail-item"><small>INCLUDED</small><strong>${t.included}</strong><span>${t.includedBody}</span></article><article class="detail-item"><small>CONVERTER</small><strong>${t.converter}</strong><span>${t.converterBody}</span></article><article class="detail-item"><small>EXTRA PARTS</small><strong>${t.extra}</strong><span>${t.extraBody}</span></article><article class="detail-item"><small>A/S</small><strong>${t.service}</strong><span>${t.serviceBody}</span></article><article class="detail-item"><small>GIFT</small><strong>${t.gift}</strong><span>${t.giftBody}</span></article></div><div class="detail-actions"><a class="primary" href="../pen-buffet/" data-preserve-lang>${t.openPen}</a><a href="tel:027658868">${t.call}</a></div>`;}

function installBrandExplorer(){
  const quick=document.querySelector('.as-quick-brands');
  if(!quick||document.querySelector('.as-brand-explorer'))return;
  const explorer=document.createElement('section');
  explorer.className='as-brand-explorer';
  explorer.innerHTML=`<div class="as-brand-shortcut-head"><div><strong data-as-quick-title></strong><span data-as-quick-hint></span></div></div><button type="button" class="as-all-brands-toggle" id="asAllBrandsToggle" aria-expanded="false" aria-controls="asAllBrandsPanel"><span data-as-all-toggle></span><b>${allBrands.length}</b><i aria-hidden="true">⌄</i></button><div class="as-all-brands-panel" id="asAllBrandsPanel" hidden><div class="as-all-brands-head"><strong data-as-all-title></strong><span data-as-all-hint></span></div><div class="as-all-brand-grid"></div></div>`;
  quick.before(explorer);
  explorer.querySelector('.as-brand-shortcut-head').after(quick);
  const grid=explorer.querySelector('.as-all-brand-grid');
  allBrands.forEach(([value,en])=>{const button=document.createElement('button');button.type='button';button.dataset.brandValue=value;button.dataset.brandEn=en;grid.append(button);});
  explorer.querySelector('#asAllBrandsToggle')?.addEventListener('click',()=>{allBrandsOpen=!allBrandsOpen;renderBrandExplorer();});
  explorer.querySelectorAll('[data-brand-value]').forEach(button=>button.addEventListener('click',()=>selectBrand(button.dataset.brandValue||'')));
}

function selectBrand(value){if(!input)return;input.value=value;renderAs();input.focus({preventScroll:true});document.querySelector('#asCenterGrid')?.scrollIntoView({behavior:'smooth',block:'start'});}

function renderBrandExplorer(){
  const t=asCopy[asLang()]||asCopy.ko;
  document.querySelector('[data-as-quick-title]')?.replaceChildren(t.quickTitle);
  document.querySelector('[data-as-quick-hint]')?.replaceChildren(t.quickHint);
  document.querySelector('[data-as-all-title]')?.replaceChildren(t.allTitle);
  document.querySelector('[data-as-all-hint]')?.replaceChildren(t.allHint);
  const toggle=document.querySelector('#asAllBrandsToggle');
  const panel=document.querySelector('#asAllBrandsPanel');
  toggle?.setAttribute('aria-expanded',String(allBrandsOpen));
  toggle?.classList.toggle('is-open',allBrandsOpen);
  toggle?.querySelector('[data-as-all-toggle]')?.replaceChildren(allBrandsOpen?t.hideAll:t.showAll);
  if(panel)panel.hidden=!allBrandsOpen;
  document.querySelectorAll('[data-brand-value]').forEach(button=>{const brand=[button.dataset.brandValue||'',button.dataset.brandEn||''];button.replaceChildren(brandLabel(brand));});
}

function renderAs(){
  const term=asNorm(input?.value||'');
  let count=0;
  cards.forEach(card=>{const visible=!term||asNorm(card.dataset.asSearch).includes(term);card.hidden=!visible;if(visible)count+=1;});
  document.querySelectorAll('[data-as-quick],[data-brand-value]').forEach(button=>{const value=button.dataset.asQuick||button.dataset.brandValue||'';button.classList.toggle('is-active',Boolean(term)&&asNorm(value)===term);});
  const t=asCopy[asLang()]||asCopy.ko;
  if(summary)summary.textContent=count?t.shown(count):t.empty;
}

function applyAsLanguage(){
  const t=asCopy[asLang()]||asCopy.ko;
  document.querySelector('[data-as-title]')?.replaceChildren(t.title);
  document.querySelector('[data-as-intro]')?.replaceChildren(t.intro);
  document.querySelector('[data-as-search-label]')?.replaceChildren(t.search);
  if(input)input.placeholder=t.placeholder;
  document.title=t.title;
  renderPenBuffetGuide();
  renderBrandExplorer();
  renderAs();
}

installPenBuffetGuide();
installBrandExplorer();
input?.addEventListener('input',renderAs);
clearButton?.addEventListener('click',()=>{if(input){input.value='';renderAs();input.focus();}});
document.querySelectorAll('[data-as-quick]').forEach(button=>button.addEventListener('click',()=>selectBrand(button.dataset.asQuick||'')));
document.querySelectorAll('[data-portal-lang]').forEach(button=>button.addEventListener('click',()=>queueMicrotask(applyAsLanguage)));
applyAsLanguage();
