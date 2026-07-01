const supportedLanguages=['ko','en','ja','zh-Hans','zh-Hant'];

const copy={
  ko:{pageTitle:'공식 홈페이지 정보 가이드',pageIntro:'블루블랙 공식 홈페이지의 정보를 매장 상담에 맞게 다시 정리했습니다. 상품 구매 기능이 아니라 빠른 안내와 공식 페이지 연결에 집중합니다.',verifiedTitle:'공식 홈페이지 기준 정보',verifiedBody:'카테고리, 브랜드 목록, 각인과 A/S 정보는 blueblack.co.kr을 기준으로 구성했습니다. 가격·재고·프로모션은 변동될 수 있으므로 최종 확인은 공식 홈페이지 또는 매장 직원에게 문의해 주세요.',openOfficial:'공식 홈페이지 열기',categoriesTitle:'공식 카테고리 바로가기',categoriesBody:'고객이 찾는 품목에 맞춰 공식 홈페이지의 해당 카테고리를 바로 열 수 있습니다.',newIn:'신상품',brandCategory:'브랜드별 보기',writingCategory:'만년필·필기구',inkCategory:'병잉크·카트리지',paperCategory:'노트·종이',deskCategory:'데스크 소품',blueblackCategory:'블루블랙 기획 상품',popularSearches:'공식 홈페이지 인기 검색어',brandsTitle:'취급 브랜드 찾기',brandsBody:'한국어 또는 영문 브랜드명을 입력하면 공식 홈페이지에 등록된 브랜드 목록에서 빠르게 찾을 수 있습니다.',brandSearchLabel:'브랜드 검색',brandPlaceholder:'예: 세일러, Sailor, 라미, Lamy',searchOfficial:'공식몰에서 검색',allBrandsOfficial:'공식 브랜드 전체 목록',engravingTitle:'각인 글꼴 안내',engravingBody:'공식 홈페이지에는 12가지 각인 글꼴과 글꼴별 지원 문자가 안내되어 있습니다. 제품에 따라 각인 가능 여부와 위치가 다를 수 있습니다.',cursiveNote:'연속 대문자 불가',engravingCautionTitle:'매장 안내 포인트',engravingCautionBody:'각인 전 철자, 대소문자, 지원 문자와 제품별 각인 가능 여부를 직원과 함께 최종 확인해 주세요.',engravingOfficial:'공식 각인 샘플 보기',serviceStoriesTitle:'A/S와 블루블랙 콘텐츠',serviceStoriesBody:'일반 브랜드 A/S는 제조사·수입사별 절차가 다르므로 보증서와 구매 정보를 준비한 뒤 공식 안내를 확인하는 것이 가장 정확합니다.',generalAsTitle:'일반 브랜드 A/S',asWarranty:'구매 시 동봉된 보증서를 함께 준비합니다.',asAgency:'브랜드별 공식 에이전시가 있는 경우 직접 접수가 원칙입니다.',asShop:'펜샵을 통한 접수는 추가 택배비와 기간이 발생할 수 있습니다.',openAsOfficial:'공식 A/S 안내',penBuffetService:'펜뷔페 전용 안내',latestStories:'최근 공식 콘텐츠',allStories:'공식 스토리 전체 보기',notices:'공지사항',guidePurposeTitle:'이 페이지의 역할',guidePurposeBody:'이 디지털 가이드는 매장 상담을 돕는 안내 화면입니다. 회원가입, 결제, 장바구니, 주문 기능은 제공하지 않으며 구매가 필요한 경우 공식 홈페이지 또는 매장에서 진행합니다.',all:'전체',brandCount:n=>`${n}개 브랜드`,noBrands:'일치하는 브랜드가 없습니다.'},
  en:{pageTitle:'Official Website Information Guide',pageIntro:'Official BlueBlack website information reorganized for in-store consultations. This guide focuses on quick explanations and official links rather than shopping functions.',verifiedTitle:'Based on the official website',verifiedBody:'Categories, brands, engraving and after-sales information are based on blueblack.co.kr. Prices, availability and promotions may change, so please confirm with the official website or store staff.',openOfficial:'Open official website',categoriesTitle:'Official category shortcuts',categoriesBody:'Open the relevant official category according to what the customer is looking for.',newIn:'New arrivals',brandCategory:'Browse by brand',writingCategory:'Fountain pens & writing',inkCategory:'Bottled ink & cartridges',paperCategory:'Notebooks & paper',deskCategory:'Desk accessories',blueblackCategory:'BlueBlack selections',popularSearches:'Popular searches on the official site',brandsTitle:'Find a stocked brand',brandsBody:'Search the official brand list using a Korean or English brand name.',brandSearchLabel:'Search brands',brandPlaceholder:'e.g. Sailor, Lamy, Pelikan',searchOfficial:'Search official shop',allBrandsOfficial:'Full official brand list',engravingTitle:'Engraving font guide',engravingBody:'The official website lists 12 engraving fonts and their supported characters. Availability and engraving position vary by product.',cursiveNote:'Consecutive capitals unavailable',engravingCautionTitle:'Before engraving',engravingCautionBody:'Confirm spelling, capitalization, supported characters and product eligibility with staff before engraving.',engravingOfficial:'View official engraving samples',serviceStoriesTitle:'Service and BlueBlack content',serviceStoriesBody:'General brand service procedures differ by manufacturer and distributor. Prepare the warranty and purchase information, then check the official instructions.',generalAsTitle:'General brand service',asWarranty:'Bring the warranty supplied with the product.',asAgency:'Direct submission is the standard process when an official brand agency exists.',asShop:'Submitting through the pen shop may add shipping costs and processing time.',openAsOfficial:'Official service guide',penBuffetService:'Pen Buffet service guide',latestStories:'Latest official content',allStories:'View all official stories',notices:'Notices',guidePurposeTitle:'Purpose of this page',guidePurposeBody:'This digital guide supports in-store consultations. It does not provide account, payment, cart or ordering functions. Purchases are completed on the official website or in store.',all:'All',brandCount:n=>`${n} brands`,noBrands:'No matching brands found.'},
  ja:{pageTitle:'公式サイト情報ガイド',pageIntro:'BlueBlack公式サイトの情報を店頭接客向けに整理しました。購入機能ではなく、素早い案内と公式ページへのリンクに特化しています。',verifiedTitle:'公式サイト基準の情報',verifiedBody:'カテゴリー、取扱ブランド、名入れ、修理情報はblueblack.co.krを基準にしています。価格・在庫・キャンペーンは変更される場合があります。',openOfficial:'公式サイトを開く',categoriesTitle:'公式カテゴリー',categoriesBody:'お探しの商品に合わせて公式サイトの該当カテゴリーを開けます。',newIn:'新商品',brandCategory:'ブランド別',writingCategory:'万年筆・筆記具',inkCategory:'ボトルインク・カートリッジ',paperCategory:'ノート・紙製品',deskCategory:'デスク用品',blueblackCategory:'BlueBlack企画商品',popularSearches:'公式サイトの人気検索',brandsTitle:'取扱ブランド検索',brandsBody:'韓国語または英語のブランド名で公式取扱ブランドを検索できます。',brandSearchLabel:'ブランド検索',brandPlaceholder:'例：セーラー、Sailor、ラミー、Lamy',searchOfficial:'公式サイトで検索',allBrandsOfficial:'公式ブランド一覧',engravingTitle:'名入れフォント案内',engravingBody:'公式サイトでは12種類の名入れフォントと対応文字を案内しています。商品により名入れ可否と位置が異なります。',cursiveNote:'大文字の連続不可',engravingCautionTitle:'名入れ前の確認',engravingCautionBody:'スペル、大文字・小文字、対応文字、商品ごとの名入れ可否をスタッフと最終確認してください。',engravingOfficial:'公式サンプルを見る',serviceStoriesTitle:'修理案内と公式コンテンツ',serviceStoriesBody:'一般ブランドの修理手順はメーカー・輸入元により異なります。保証書と購入情報をご用意のうえ公式案内をご確認ください。',generalAsTitle:'一般ブランド修理',asWarranty:'購入時に付属した保証書をご用意ください。',asAgency:'公式代理店があるブランドは代理店への直接受付が原則です。',asShop:'ペンショップ経由の場合、追加送料と日数がかかる場合があります。',openAsOfficial:'公式修理案内',penBuffetService:'ペンビュッフェ専用案内',latestStories:'最新公式コンテンツ',allStories:'公式ストーリー一覧',notices:'お知らせ',guidePurposeTitle:'このページの役割',guidePurposeBody:'このデジタルガイドは店頭接客用です。会員登録、決済、カート、注文機能はなく、購入は公式サイトまたは店頭で行います。',all:'すべて',brandCount:n=>`${n}ブランド`,noBrands:'該当するブランドがありません。'},
  'zh-Hans':{pageTitle:'官方网站信息指南',pageIntro:'将BlueBlack官方网站信息重新整理为门店咨询指南。本页面专注于快速说明和官方页面链接，不提供购物功能。',verifiedTitle:'以官方网站为准',verifiedBody:'分类、品牌、刻字与售后信息以blueblack.co.kr为准。价格、库存和活动可能变化，请在官网或向店员最终确认。',openOfficial:'打开官方网站',categoriesTitle:'官方分类快捷入口',categoriesBody:'根据顾客需要直接打开官方网站相应分类。',newIn:'新品',brandCategory:'按品牌查看',writingCategory:'钢笔与书写工具',inkCategory:'瓶装墨水与墨囊',paperCategory:'笔记本与纸品',deskCategory:'桌面用品',blueblackCategory:'BlueBlack企划商品',popularSearches:'官网热门搜索',brandsTitle:'查找经销品牌',brandsBody:'可使用韩文或英文品牌名搜索官方网站品牌列表。',brandSearchLabel:'搜索品牌',brandPlaceholder:'例如 Sailor、Lamy、Pelikan',searchOfficial:'在官网搜索',allBrandsOfficial:'官方完整品牌列表',engravingTitle:'刻字字体指南',engravingBody:'官方网站列出12种刻字字体及其支持字符。不同产品的可刻字情况和位置可能不同。',cursiveNote:'不可连续使用大写字母',engravingCautionTitle:'刻字前确认',engravingCautionBody:'刻字前请与店员确认拼写、大小写、支持字符及产品是否可刻字。',engravingOfficial:'查看官方刻字示例',serviceStoriesTitle:'售后服务与官方内容',serviceStoriesBody:'普通品牌售后流程因制造商和进口商而异。请准备保修卡和购买信息后查看官方说明。',generalAsTitle:'普通品牌售后',asWarranty:'请准备购买时随附的保修卡。',asAgency:'如品牌有官方代理，原则上直接向代理商申请。',asShop:'通过门店申请可能增加运费和处理时间。',openAsOfficial:'官方售后说明',penBuffetService:'Pen Buffet专用说明',latestStories:'最新官方内容',allStories:'查看全部官方故事',notices:'公告',guidePurposeTitle:'本页面用途',guidePurposeBody:'本数字指南用于门店咨询，不提供注册、支付、购物车或下单功能。购买请在官方网站或门店完成。',all:'全部',brandCount:n=>`${n}个品牌`,noBrands:'没有匹配的品牌。'},
  'zh-Hant':{pageTitle:'官方網站資訊指南',pageIntro:'將BlueBlack官方網站資訊重新整理為門市諮詢指南。本頁專注於快速說明與官方頁面連結，不提供購物功能。',verifiedTitle:'以官方網站為準',verifiedBody:'分類、品牌、刻字與售後資訊以blueblack.co.kr為準。價格、庫存與活動可能變動，請於官網或向店員最終確認。',openOfficial:'開啟官方網站',categoriesTitle:'官方分類快速入口',categoriesBody:'依照顧客需要直接開啟官方網站相應分類。',newIn:'新品',brandCategory:'依品牌查看',writingCategory:'鋼筆與書寫工具',inkCategory:'瓶裝墨水與墨囊',paperCategory:'筆記本與紙品',deskCategory:'桌面用品',blueblackCategory:'BlueBlack企劃商品',popularSearches:'官網熱門搜尋',brandsTitle:'查找經銷品牌',brandsBody:'可使用韓文或英文品牌名搜尋官方網站品牌列表。',brandSearchLabel:'搜尋品牌',brandPlaceholder:'例如 Sailor、Lamy、Pelikan',searchOfficial:'在官網搜尋',allBrandsOfficial:'官方完整品牌列表',engravingTitle:'刻字字體指南',engravingBody:'官方網站列出12種刻字字體及其支援字元。不同產品的可刻字情況與位置可能不同。',cursiveNote:'不可連續使用大寫字母',engravingCautionTitle:'刻字前確認',engravingCautionBody:'刻字前請與店員確認拼寫、大小寫、支援字元及產品是否可刻字。',engravingOfficial:'查看官方刻字範例',serviceStoriesTitle:'售後服務與官方內容',serviceStoriesBody:'一般品牌售後流程因製造商與進口商而異。請準備保固卡與購買資訊後查看官方說明。',generalAsTitle:'一般品牌售後',asWarranty:'請準備購買時隨附的保固卡。',asAgency:'若品牌有官方代理，原則上直接向代理商申請。',asShop:'透過門市申請可能增加運費與處理時間。',openAsOfficial:'官方售後說明',penBuffetService:'Pen Buffet專用說明',latestStories:'最新官方內容',allStories:'查看全部官方故事',notices:'公告',guidePurposeTitle:'本頁面用途',guidePurposeBody:'本數位指南用於門市諮詢，不提供註冊、付款、購物車或下單功能。購買請於官方網站或門市完成。',all:'全部',brandCount:n=>`${n}個品牌`,noBrands:'沒有符合的品牌。'}
};

const brands=[
['어프로치','APPROACH'],['오로라','AURORA'],['벨로모','BELOMO'],['블랙윙','BLACK WING'],['블루블랙','BLUEBLACK'],['클레르퐁텐','CLAIREFONTAINE'],['칼라버스','COLORVERSE'],['코니퍼','CONIFER'],['콘클린','CONKLIN'],['크로스','CROSS'],['디아민','DIAMINE'],['델타','DELTA'],['디플로마트','DIPLOMAT'],['도미넌트 인더스트리','DOMINANT INDUSTRY'],['에고이스타','EGOISTAR'],['파버카스텔','FABER-CASTELL'],['페리스휠 프레스','FERRIS WHEEL PRESS'],['그라폰','GRAF VON FABER-CASTELL'],['잉크하우스','INKHOUSE'],['잉크월','INKWALL'],['아이더블유아이','IWI'],['제이허빈','J.HERBIN'],['쟈크허빈','JACQUES HERBIN'],['카웨코','KAWECO'],['고베','KOBE'],['라반','LABAN'],['라미','LAMY'],['라이프','LIFE'],['매뉴스크립트','MANUSCRIPT'],['모나미','MONAMI'],['몽블랑','MONTBLANC'],['몰스킨','MOLESKINE'],['몬테베르데','MONTEVERDE'],['무스비메','MUSUBIME'],['네뷸라','NEBULA'],['네오 스마트펜','NEO SMARTPEN'],['네투노 1911','NETTUNO 1911'],['오퍼스88','OPUS 88'],['오토후트','OTTO HUTT'],['파카','PARKER'],['페이퍼메이트','PAPERMATE'],['펠리칸','PELIKAN'],['파이롯트','PILOT'],['플래티넘','PLATINUM'],['프라이빗 리저브','PRIVATE RESERVE'],['로디아','RHODIA'],['로버트 오스터','ROBERT OSTER'],['로트링','ROTRING'],['세일러','SAILOR'],['쉐퍼','SHEAFFER'],['스타빌로','STABILO'],['수퍼파이브','SUPER5'],['스와로브스키','SWAROVSKI'],['톰보우','TOMBOW'],['트위스비','TWSBI'],['교토 TAG 문구점','TAG STATIONERY'],['빈타','VINTA'],['비스콘티','VISCONTI'],['워터맨','WATERMAN'],['글입다','WEARINGEUL'],['지그·쿠레타케','ZIG KURETAKE'],['3오이스터스','3 OYSTERS']
].map(([ko,en])=>({ko,en,initial:(en.match(/[A-Z]/i)?.[0]||'#').toUpperCase()}));

function normalizeLanguage(value=''){
  const v=String(value).toLowerCase();
  if(v.startsWith('zh-tw')||v.startsWith('zh-hk')||v.startsWith('zh-mo')||v.includes('hant'))return'zh-Hant';
  if(v.startsWith('zh'))return'zh-Hans';
  if(v.startsWith('ja'))return'ja';
  if(v.startsWith('ko'))return'ko';
  if(v.startsWith('en'))return'en';
  return'';
}
function getLanguage(){
  const query=normalizeLanguage(new URLSearchParams(location.search).get('lang'));
  const saved=normalizeLanguage(localStorage.getItem('blueblack-language'));
  const browser=(navigator.languages||[navigator.language]).map(normalizeLanguage).find(Boolean);
  return supportedLanguages.includes(query)?query:supportedLanguages.includes(saved)?saved:browser||'en';
}
function normalizeSearch(value=''){return String(value).trim().toLowerCase().replace(/[·.\-_'’]/g,'').replace(/\s+/g,'');}

let language=getLanguage();
let activeInitial='ALL';
const searchInput=document.querySelector('#officialBrandSearch');
const searchLink=document.querySelector('#officialBrandSearchLink');
const alpha=document.querySelector('#officialBrandAlpha');
const grid=document.querySelector('#officialBrandGrid');
const summary=document.querySelector('#officialBrandSummary');

function officialSearchUrl(keyword){return `https://blueblack.co.kr/product/search.html?keyword=${encodeURIComponent(keyword)}`;}
function updateOfficialSearchLink(){
  if(!searchLink)return;
  const value=searchInput?.value.trim();
  searchLink.href=value?officialSearchUrl(value):'https://blueblack.co.kr/jwgbox/add_page/brand_list.html';
}
function renderAlpha(){
  if(!alpha)return;
  const initials=['ALL',...Array.from(new Set(brands.map(item=>item.initial))).sort()];
  alpha.innerHTML='';
  initials.forEach(initial=>{
    const button=document.createElement('button');
    button.type='button';
    button.textContent=initial==='ALL'?copy[language].all:initial;
    button.setAttribute('aria-pressed',String(activeInitial===initial));
    button.addEventListener('click',()=>{activeInitial=initial;renderAlpha();renderBrands();});
    alpha.append(button);
  });
}
function matchingBrands(){
  const term=normalizeSearch(searchInput?.value||'');
  return brands.filter(item=>{
    const initialMatch=activeInitial==='ALL'||item.initial===activeInitial;
    const textMatch=!term||normalizeSearch(item.ko).includes(term)||normalizeSearch(item.en).includes(term);
    return initialMatch&&textMatch;
  });
}
function renderBrands(){
  if(!grid||!summary)return;
  const items=matchingBrands();
  summary.textContent=items.length?copy[language].brandCount(items.length):copy[language].noBrands;
  grid.innerHTML='';
  items.forEach(item=>{
    const link=document.createElement('a');
    link.href=officialSearchUrl(item.ko);
    link.target='_blank';
    link.rel='noopener';
    link.innerHTML=`<strong>${item.ko}</strong><span>${item.en}</span>`;
    link.setAttribute('aria-label',`${item.ko} ${item.en}`);
    grid.append(link);
  });
}
function applyLanguage(){
  language=getLanguage();
  document.querySelectorAll('[data-official-t]').forEach(node=>{
    const value=copy[language]?.[node.dataset.officialT]??copy.ko[node.dataset.officialT];
    if(typeof value==='string')node.textContent=value;
  });
  document.querySelectorAll('[data-official-placeholder]').forEach(node=>{
    const value=copy[language]?.[node.dataset.officialPlaceholder]??copy.ko[node.dataset.officialPlaceholder];
    if(typeof value==='string')node.setAttribute('placeholder',value);
  });
  renderAlpha();
  renderBrands();
}

searchInput?.addEventListener('input',()=>{activeInitial='ALL';updateOfficialSearchLink();renderAlpha();renderBrands();});
searchInput?.addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();updateOfficialSearchLink();searchLink?.click();}});
document.querySelectorAll('[data-portal-lang]').forEach(button=>button.addEventListener('click',()=>{queueMicrotask(applyLanguage);}));
updateOfficialSearchLink();
applyLanguage();
