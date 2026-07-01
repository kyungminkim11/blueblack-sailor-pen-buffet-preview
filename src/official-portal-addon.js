const officialPortalCopy={
  ko:{title:'공식 홈페이지 정보',body:'취급 브랜드, 상품 카테고리, 각인 글꼴, 일반 A/S와 공식 콘텐츠를 확인합니다.'},
  en:{title:'Official website guide',body:'Browse stocked brands, product categories, engraving fonts, general service information and official content.'},
  ja:{title:'公式サイト情報',body:'取扱ブランド、商品カテゴリー、名入れフォント、一般修理案内、公式コンテンツを確認します。'},
  'zh-Hans':{title:'官方网站信息',body:'查看经销品牌、商品分类、刻字字体、普通售后服务和官方内容。'},
  'zh-Hant':{title:'官方網站資訊',body:'查看經銷品牌、商品分類、刻字字體、一般售後服務與官方內容。'}
};
function normalizeOfficialPortalLanguage(value=''){
  const v=String(value).toLowerCase();
  if(v.startsWith('zh-tw')||v.startsWith('zh-hk')||v.startsWith('zh-mo')||v.includes('hant'))return'zh-Hant';
  if(v.startsWith('zh'))return'zh-Hans';
  if(v.startsWith('ja'))return'ja';
  if(v.startsWith('ko'))return'ko';
  return'en';
}
function applyOfficialPortalCopy(){
  const query=new URLSearchParams(location.search).get('lang');
  const language=normalizeOfficialPortalLanguage(query||localStorage.getItem('blueblack-language')||navigator.language);
  document.querySelectorAll('[data-official-portal-t]').forEach(node=>{
    const value=officialPortalCopy[language]?.[node.dataset.officialPortalT]??officialPortalCopy.ko[node.dataset.officialPortalT];
    if(value)node.textContent=value;
  });
}
document.querySelectorAll('[data-portal-lang]').forEach(button=>button.addEventListener('click',()=>queueMicrotask(applyOfficialPortalCopy)));
applyOfficialPortalCopy();
