import '../src/public-ui-v52.js';

const languages=['ko','en','ja','zh-Hans','zh-Hant'];
const copy={
  ko:{pageTitle:'블루블랙 최신 소식 | BlueBlack Pen Shop',back:'디지털 가이드로 돌아가기',title:'블루블랙의 새로운 소식을 만나보세요',intro:'신제품, 재입고, 기존 제품 소개와 매장 소식을 한곳에서 확인하세요.',feedTitle:'인스타그램 최신 소식',feedBody:'최신 게시물은 공식 인스타그램에서 바로 확인할 수 있습니다.',instagramLinkTitle:'블루블랙 공식 인스타그램',instagramLinkBody:'신제품, 재입고, 제품 소개와 매장 소식을 인스타그램에서 확인하세요.',instagram:'최신 게시물 보기',channelsTitle:'다른 채널에서도 확인하세요',channelsBody:'채널별 최신 소식과 자세한 제품 이야기를 확인할 수 있습니다.',xTitle:'X 소식',xBody:'제품 소개와 빠른 매장 소식을 확인합니다.',naverTitle:'네이버 지도 소식',naverBody:'매장 방문 전 공지와 새로운 소식을 확인합니다.',blogTitle:'네이버 블로그',blogBody:'신제품과 브랜드 이야기를 자세히 살펴봅니다.',websiteTitle:'공식 홈페이지',websiteBody:'신제품과 상품 정보를 확인합니다.',footer:'BlueBlack Pen Shop 최신 소식'},
  en:{pageTitle:'BlueBlack News | BlueBlack Pen Shop',back:'Back to the digital guide',title:'See what is new at BlueBlack',intro:'See new arrivals, restocks, product highlights and store news in one place.',feedTitle:'Latest Instagram updates',feedBody:'View the latest posts directly on our official Instagram account.',instagramLinkTitle:'BlueBlack official Instagram',instagramLinkBody:'See new arrivals, restocks, product highlights and store news on Instagram.',instagram:'View latest posts',channelsTitle:'See more channels',channelsBody:'Find quick updates and detailed product stories across our channels.',xTitle:'Updates on X',xBody:'See quick product and store updates.',naverTitle:'Naver Map updates',naverBody:'Check store notices before your visit.',blogTitle:'Naver Blog',blogBody:'Read detailed stories about new products and brands.',websiteTitle:'Official website',websiteBody:'Browse new arrivals and product information.',footer:'BlueBlack Pen Shop News'},
  ja:{pageTitle:'BlueBlack 最新情報 | BlueBlack Pen Shop',back:'デジタルガイドに戻る',title:'BlueBlackの最新情報をご覧ください',intro:'新商品、再入荷、商品紹介、店舗のお知らせをまとめて確認できます。',feedTitle:'Instagram 最新情報',feedBody:'最新投稿は公式Instagramで直接ご確認いただけます。',instagramLinkTitle:'BlueBlack 公式Instagram',instagramLinkBody:'新商品、再入荷、商品紹介、店舗のお知らせをInstagramでご覧ください。',instagram:'最新投稿を見る',channelsTitle:'ほかのチャンネル',channelsBody:'各チャンネルで最新情報や詳しい商品紹介をご覧いただけます。',xTitle:'Xのお知らせ',xBody:'商品紹介や店舗の最新情報を確認できます。',naverTitle:'NAVERマップのお知らせ',naverBody:'ご来店前に店舗のお知らせをご確認ください。',blogTitle:'NAVERブログ',blogBody:'新商品やブランドの詳しい情報をご覧ください。',websiteTitle:'公式サイト',websiteBody:'新商品と商品情報をご確認ください。',footer:'BlueBlack Pen Shop 最新情報'},
  'zh-Hans':{pageTitle:'BlueBlack 最新消息 | BlueBlack Pen Shop',back:'返回数字指南',title:'查看 BlueBlack 的最新消息',intro:'集中查看新品、补货、产品介绍和门店消息。',feedTitle:'Instagram 最新消息',feedBody:'请直接前往官方 Instagram 查看最新帖子。',instagramLinkTitle:'BlueBlack 官方 Instagram',instagramLinkBody:'在 Instagram 查看新品、补货、产品介绍和门店消息。',instagram:'查看最新帖子',channelsTitle:'其他官方渠道',channelsBody:'可在各渠道查看最新消息和更详细的产品介绍。',xTitle:'X 最新消息',xBody:'查看产品介绍和门店即时消息。',naverTitle:'NAVER 地图消息',naverBody:'到店前查看门店通知和最新消息。',blogTitle:'NAVER 博客',blogBody:'查看新品和品牌的详细介绍。',websiteTitle:'官方网站',websiteBody:'查看新品和商品信息。',footer:'BlueBlack Pen Shop 最新消息'},
  'zh-Hant':{pageTitle:'BlueBlack 最新消息 | BlueBlack Pen Shop',back:'返回數位指南',title:'查看 BlueBlack 的最新消息',intro:'集中查看新品、補貨、產品介紹與門市消息。',feedTitle:'Instagram 最新消息',feedBody:'請直接前往官方 Instagram 查看最新貼文。',instagramLinkTitle:'BlueBlack 官方 Instagram',instagramLinkBody:'在 Instagram 查看新品、補貨、產品介紹與門市消息。',instagram:'查看最新貼文',channelsTitle:'其他官方頻道',channelsBody:'可在各頻道查看最新消息與更詳細的產品介紹。',xTitle:'X 最新消息',xBody:'查看產品介紹與門市即時消息。',naverTitle:'NAVER 地圖消息',naverBody:'到店前查看門市公告與最新消息。',blogTitle:'NAVER 部落格',blogBody:'查看新品與品牌的詳細介紹。',websiteTitle:'官方網站',websiteBody:'查看新品與商品資訊。',footer:'BlueBlack Pen Shop 最新消息'}
};

function normalize(value){
  const lang=(value||'ko').toLowerCase();
  if(lang.includes('hant')||lang.startsWith('zh-tw')||lang.startsWith('zh-hk'))return'zh-Hant';
  if(lang.startsWith('zh'))return'zh-Hans';
  if(lang.startsWith('ja'))return'ja';
  if(lang.startsWith('en'))return'en';
  return'ko';
}

function currentLanguage(){
  let saved='';
  try{saved=localStorage.getItem('blueblack-language')||'';}catch{}
  return normalize(new URLSearchParams(location.search).get('lang')||saved||navigator.language);
}

function applyLanguage(language,{replaceUrl=false}={}){
  const lang=languages.includes(language)?language:'ko';
  const text=copy[lang]||copy.ko;
  document.documentElement.lang=lang;
  document.title=text.pageTitle;
  try{localStorage.setItem('blueblack-language',lang);}catch{}
  document.querySelectorAll('[data-news-copy]').forEach(node=>{
    const value=text[node.dataset.newsCopy];
    if(value)node.textContent=value;
  });
  const back=document.querySelector('[data-news-back]');
  if(back)back.href=`../?lang=${encodeURIComponent(lang)}`;
  document.querySelectorAll('[data-news-lang]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.newsLang===lang)));
  if(replaceUrl){
    const url=new URL(location.href);
    url.searchParams.set('lang',lang);
    history.replaceState(null,'',url);
  }
}

document.querySelectorAll('[data-news-lang]').forEach(button=>button.addEventListener('click',()=>applyLanguage(button.dataset.newsLang,{replaceUrl:true})));
applyLanguage(currentLanguage());
