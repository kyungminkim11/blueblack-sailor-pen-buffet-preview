const PAGES=[
  {src:'./source/price-list-1.png',key:'guide'},
  {src:'./source/price-list-2.png',key:'price1'},
  {src:'./source/price-list-3.png',key:'price2'},
  {src:'./source/price-list-4.png',key:'price3'}
];

const COPY={
  ko:{title:'공식 잉크 소분 가격표',intro:'매장 소분 안내와 브랜드별 5ml·10ml 가격을 원본 이미지 기준으로 확인할 수 있습니다.',tabs:['이용 안내','가격표 1','가격표 2','가격표 3'],zoomOut:'축소',zoomIn:'확대',reset:'맞춤',full:'크게 보기',loading:'',page:'현재 페이지',source:'원본 안내',sourceCopy:'가격과 소분 가능 여부는 변경될 수 있습니다. 결제 전 직원과 색상·용량·금액을 함께 확인해 주세요.',previous:'이전',next:'다음',share:'현재 페이지 공유',shared:'현재 가격표 링크를 복사했습니다.',notices:['소분은 5ml와 10ml 두 가지 용량으로 준비됩니다.','10ml 가격은 5ml 두 병 금액에서 1,500원을 할인한 금액입니다.','가격표에 없는 브랜드, 한정 잉크, 일부 세트·특수 잉크는 소분 판매가 불가능할 수 있습니다.','결제 전 잉크 색상, 용량, 금액과 용기 밀폐 상태를 직원과 함께 확인해 주세요.']},
  en:{title:'Official ink decant price list',intro:'Review the in-store guidance and official 5ml and 10ml prices by brand.',tabs:['Guide','Price list 1','Price list 2','Price list 3'],zoomOut:'Zoom out',zoomIn:'Zoom in',reset:'Fit',full:'Large view',loading:'',page:'Current page',source:'Original guide',sourceCopy:'Prices and availability may change. Confirm the color, volume and final price with a staff member before payment.',previous:'Previous',next:'Next',share:'Share page',shared:'Price sheet link copied.',notices:['Decants are available in two volumes: 5ml and 10ml.','10ml is priced as two 5ml portions minus 1,500 KRW.','Brands not listed, limited inks and some set or specialty inks may not be available for decanting.','Before payment, confirm the ink color, volume, price and container seal with a staff member.']},
  ja:{title:'公式インク小分け価格表',intro:'店頭案内とブランド別の5ml・10ml価格を原本画像で確認できます。',tabs:['ご利用案内','価格表 1','価格表 2','価格表 3'],zoomOut:'縮小',zoomIn:'拡大',reset:'画面に合わせる',full:'大きく表示',loading:'',page:'現在のページ',source:'原本案内',sourceCopy:'価格と小分け可否は変更される場合があります。お会計前に色・容量・金額をスタッフとご確認ください。',previous:'前へ',next:'次へ',share:'現在のページを共有',shared:'価格表リンクをコピーしました。',notices:['価格表にないブランド、一部の限定品・セット商品は小分け対象外です。','混雑時や在庫不足時は準備に時間がかかったり、販売容量が変わる場合があります。','価格は5mlと10mlで表示されています。','お会計前にインク色、金額、容器の密閉状態をスタッフとご確認ください。']},
  'zh-Hans':{title:'官方墨水分装价格表',intro:'可通过官方原图查看门店说明及各品牌5ml、10ml分装价格。',tabs:['使用说明','价格表 1','价格表 2','价格表 3'],zoomOut:'缩小',zoomIn:'放大',reset:'适应画面',full:'大图查看',loading:'',page:'当前页面',source:'原始说明',sourceCopy:'价格与可分装情况可能会变更。付款前请与店员确认颜色、容量和最终金额。',previous:'上一页',next:'下一页',share:'分享当前页面',shared:'价格表链接已复制。',notices:['价格表中未列出的品牌以及部分限定款、套装不提供分装。','门店繁忙或库存不足时，准备时间可能延长，销售容量也可能调整。','价格按5ml和10ml标示。','付款前请与店员确认墨水颜色、金额及容器密封状态。']},
  'zh-Hant':{title:'官方墨水分裝價格表',intro:'可透過官方原圖查看門市說明及各品牌5ml、10ml分裝價格。',tabs:['使用說明','價格表 1','價格表 2','價格表 3'],zoomOut:'縮小',zoomIn:'放大',reset:'適應畫面',full:'大圖查看',loading:'',page:'目前頁面',source:'原始說明',sourceCopy:'價格與可分裝情況可能會變更。付款前請與店員確認顏色、容量和最終金額。',previous:'上一頁',next:'下一頁',share:'分享目前頁面',shared:'價格表連結已複製。',notices:['價格表中未列出的品牌以及部分限定款、套裝不提供分裝。','門市繁忙或庫存不足時，準備時間可能延長，銷售容量也可能調整。','價格按5ml和10ml標示。','付款前請與店員確認墨水顏色、金額及容器密封狀態。']}
};

const MIN_ZOOM=.75;
const FIT_ZOOM=1;
let currentPage=0;
let zoom=FIT_ZOOM;

function language(){const value=document.documentElement.lang||'ko';if(value.startsWith('zh-Hant'))return'zh-Hant';if(value.startsWith('zh'))return'zh-Hans';if(value.startsWith('ja'))return'ja';if(value.startsWith('en'))return'en';return'ko';}
function text(){return COPY[language()]||COPY.ko;}
function $(selector){return document.querySelector(selector);}
function toast(message){let node=document.querySelector('.ink-viewer-toast');if(!node){node=document.createElement('div');node.className='ink-viewer-toast';document.body.append(node);}node.textContent=message;node.style.cssText='position:fixed;left:50%;bottom:24px;z-index:9000;transform:translateX(-50%);padding:10px 14px;border-radius:999px;background:#10233f;color:#fff;font-size:10px;font-weight:800;box-shadow:0 12px 30px rgba(16,35,63,.3)';clearTimeout(toast.timer);toast.timer=setTimeout(()=>node.remove(),2200);}

function renderCopy(){
  const value=text();
  document.querySelectorAll('[data-ink-title]').forEach(node=>node.textContent=value.title);
  document.querySelectorAll('[data-ink-intro]').forEach(node=>node.textContent=value.intro);
  const loading=$('[data-ink-loading]');
  if(loading){loading.textContent='';loading.hidden=true;}
  $('[data-ink-page-label]').textContent=value.page;
  $('[data-ink-source-label]').textContent=value.source;
  $('[data-ink-source-copy]').textContent=value.sourceCopy;
  $('.ink-zoom-out').setAttribute('aria-label',value.zoomOut);
  $('.ink-zoom-in').setAttribute('aria-label',value.zoomIn);
  $('.ink-zoom-reset').textContent=value.reset;
  $('.ink-fullscreen').textContent=value.full;
  $('.ink-prev-page').textContent=`← ${value.previous}`;
  $('.ink-next-page').textContent=`${value.next} →`;
  $('.ink-share-page').textContent=value.share;
  const notices=$('.ink-notices');
  notices.replaceChildren(...value.notices.map(item=>{const node=document.createElement('div');node.className='ink-notice';node.textContent=item;return node;}));
  document.querySelectorAll('.ink-tabs button').forEach((button,index)=>button.textContent=value.tabs[index]);
  updateMeta();
}

function updateMeta(){const value=text();$('[data-ink-current]').textContent=value.tabs[currentPage];$('.ink-dialog-head strong').textContent=value.tabs[currentPage];$('.ink-prev-page').disabled=currentPage===0;$('.ink-next-page').disabled=currentPage===PAGES.length-1;}
function updateZoomControls(){
  const out=$('.ink-zoom-out');
  const zoomIn=$('.ink-zoom-in');
  if(out)out.disabled=zoom<=MIN_ZOOM+.001;
  if(zoomIn)zoomIn.disabled=zoom>=FIT_ZOOM-.001;
}
function applyZoom(){const image=$('.ink-sheet');image.style.width=`${Math.round(zoom*100)}%`;$('.ink-canvas').dataset.zoom=Math.round(zoom*100);updateZoomControls();}
function selectPage(index,options={}){
  currentPage=Math.max(0,Math.min(PAGES.length-1,Number(index)||0));
  const image=$('.ink-sheet');
  const loading=$('.ink-loading');
  if(loading)loading.hidden=true;
  image.style.visibility='visible';
  image.src=PAGES[currentPage].src;
  image.alt=text().tabs[currentPage];
  document.querySelectorAll('.ink-tabs button').forEach((button,buttonIndex)=>{button.setAttribute('aria-selected',String(buttonIndex===currentPage));button.tabIndex=buttonIndex===currentPage?0:-1;});
  $('.ink-canvas').scrollTo({top:0,left:0});
  updateMeta();
  if(options.updateUrl!==false){const url=new URL(location.href);url.searchParams.set('page',String(currentPage));history.replaceState(null,'',url);}
  dispatchEvent(new CustomEvent('inkpagechange',{detail:{page:currentPage}}));
}
function changeZoom(delta){zoom=Math.max(MIN_ZOOM,Math.min(FIT_ZOOM,zoom+delta));applyZoom();}
function resetZoom(){zoom=FIT_ZOOM;applyZoom();$('.ink-canvas').scrollTo({top:0,left:0,behavior:'smooth'});}
function openLarge(){const dialog=$('.ink-image-dialog');const image=dialog.querySelector('img');image.src=PAGES[currentPage].src;image.alt=text().tabs[currentPage];updateMeta();dialog.showModal();}
async function shareCurrent(){const url=new URL(location.href);url.searchParams.set('page',String(currentPage));const payload={title:`BlueBlack · ${text().tabs[currentPage]}`,text:text().sourceCopy,url:url.href};if(navigator.share){try{await navigator.share(payload);return;}catch{}}try{await navigator.clipboard.writeText(url.href);toast(text().shared);}catch{window.prompt(text().shared,url.href);}}

function init(){
  const tabs=$('.ink-tabs');
  PAGES.forEach((page,index)=>{const button=document.createElement('button');button.type='button';button.setAttribute('role','tab');button.addEventListener('click',()=>selectPage(index));button.addEventListener('keydown',event=>{if(event.key==='ArrowRight')selectPage((index+1)%PAGES.length);if(event.key==='ArrowLeft')selectPage((index-1+PAGES.length)%PAGES.length);});tabs.append(button);});
  $('.ink-sheet').addEventListener('load',()=>{const loading=$('.ink-loading');if(loading)loading.hidden=true;$('.ink-sheet').style.visibility='visible';applyZoom();});
  $('.ink-zoom-out').addEventListener('click',()=>changeZoom(-.2));
  $('.ink-zoom-in').addEventListener('click',()=>changeZoom(.2));
  $('.ink-zoom-reset').addEventListener('click',resetZoom);
  $('.ink-fullscreen').addEventListener('click',openLarge);
  $('.ink-prev-page').addEventListener('click',()=>selectPage(currentPage-1));
  $('.ink-next-page').addEventListener('click',()=>selectPage(currentPage+1));
  $('.ink-share-page').addEventListener('click',shareCurrent);
  $('.ink-dialog-close').addEventListener('click',()=>$('.ink-image-dialog').close());
  $('.ink-image-dialog').addEventListener('click',event=>{if(event.target===$('.ink-image-dialog'))$('.ink-image-dialog').close();});
  document.querySelectorAll('[data-portal-lang]').forEach(button=>button.addEventListener('click',()=>setTimeout(renderCopy,30)));
  const requested=Number(new URLSearchParams(location.search).get('page'));
  renderCopy();
  selectPage(Number.isFinite(requested)?requested:0,{updateUrl:false});
}

window.blueblackInkViewer={selectPage,get currentPage(){return currentPage;},get pageCount(){return PAGES.length;},shareCurrent,resetZoom};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
