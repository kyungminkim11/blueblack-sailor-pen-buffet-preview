import './detail-language.js';

// Customer-facing language completion for the ink decant search page.
const INK_EXTRA={
  ko:{meta:'블루블랙에서 취급하는 잉크를 브랜드·시리즈·색상명으로 검색하고 5ml·10ml 소분 가격과 본병 정보를 확인하세요.',app:'잉크 소분 가격 검색',notices:'잉크 소분 이용 안내',viewer:'공식 잉크 소분 가격표',tabs:'가격표 페이지',sheet:'블루블랙 잉크 소분 가격표',expanded:'확대한 잉크 소분 가격표',close:'확대 화면 닫기'},
  en:{meta:'Search BlueBlack Pen Shop inks by brand, series or color and compare 5ml and 10ml decant prices with full-bottle information.',app:'Ink decant price search',notices:'Ink decant guidance',viewer:'Official ink decant price sheets',tabs:'Price sheet pages',sheet:'BlueBlack ink decant price sheet',expanded:'Enlarged ink decant price sheet',close:'Close enlarged view'},
  ja:{meta:'BlueBlack Pen Shopのインクをブランド・シリーズ・色名から検索し、5ml・10mlの小分け価格とボトル情報を確認できます。',app:'インク小分け価格検索',notices:'インク小分けのご案内',viewer:'公式インク小分け価格表',tabs:'価格表ページ',sheet:'BlueBlackインク小分け価格表',expanded:'拡大したインク小分け価格表',close:'拡大画面を閉じる'},
  'zh-Hans':{meta:'按品牌、系列或颜色搜索BlueBlack Pen Shop墨水，并比较5ml、10ml分装价格与原装瓶信息。',app:'墨水分装价格查询',notices:'墨水分装说明',viewer:'官方墨水分装价格表',tabs:'价格表页面',sheet:'BlueBlack墨水分装价格表',expanded:'放大的墨水分装价格表',close:'关闭放大画面'},
  'zh-Hant':{meta:'依品牌、系列或顏色搜尋BlueBlack Pen Shop墨水，並比較5ml、10ml分裝價格與原裝瓶資訊。',app:'墨水分裝價格查詢',notices:'墨水分裝說明',viewer:'官方墨水分裝價格表',tabs:'價格表頁面',sheet:'BlueBlack墨水分裝價格表',expanded:'放大的墨水分裝價格表',close:'關閉放大畫面'}
};
function inkExtraLang(){const value=(document.documentElement.lang||new URLSearchParams(location.search).get('lang')||'ko').toLowerCase();if(value.includes('hant')||value.startsWith('zh-tw')||value.startsWith('zh-hk'))return'zh-Hant';if(value.startsWith('zh'))return'zh-Hans';if(value.startsWith('ja'))return'ja';if(value.startsWith('en'))return'en';return'ko';}
function applyInkExtra(){
  const copy=INK_EXTRA[inkExtraLang()]||INK_EXTRA.ko;
  document.querySelector('meta[name="description"]')?.setAttribute('content',copy.meta);
  document.querySelector('meta[property="og:description"]')?.setAttribute('content',copy.meta);
  document.querySelector('#ink-store-app')?.setAttribute('aria-label',copy.app);
  document.querySelector('.ink-notices')?.setAttribute('aria-label',copy.notices);
  document.querySelector('.ink-viewer')?.setAttribute('aria-label',copy.viewer);
  document.querySelector('.ink-tabs')?.setAttribute('aria-label',copy.tabs);
  document.querySelector('.ink-sheet')?.setAttribute('alt',copy.sheet);
  document.querySelector('.ink-image-dialog img')?.setAttribute('alt',copy.expanded);
  document.querySelector('.ink-dialog-close')?.setAttribute('aria-label',copy.close);
}
new MutationObserver(applyInkExtra).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
applyInkExtra();
