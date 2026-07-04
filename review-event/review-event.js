const languages=['ko','en','ja','zh-Hans','zh-Hant'];
const reviewLinks={ko:'https://m.site.naver.com/242PR',en:'https://m.site.naver.com/2430v',ja:'https://m.site.naver.com/2430v','zh-Hans':'https://m.site.naver.com/2430v','zh-Hant':'https://m.site.naver.com/2430v'};
const copy={
  ko:{pageTitle:'포토리뷰 이벤트 | BlueBlack Pen Shop',back:'디지털 가이드로 돌아가기',eyebrow:'BLUEBLACK STORE EVENT',title:'포토리뷰를 남기고 잉크를 받아보세요',intro:'매장에서 구매한 상품의 포토리뷰를 남긴 뒤 완료 화면을 직원에게 보여주세요.',rewardLabel:'PHOTO REVIEW GIFT',rewardLead:'포토리뷰 완료 시',rewardMain:'랜덤 5ml 소분 잉크 1병',primary:'네이버 지도 포토리뷰 열기',ruleTitle:'참여 전 확인해 주세요',rules:['포토리뷰이므로 리뷰에 사진을 함께 올려주세요.','이벤트는 하루에 한 분당 한 번 참여하실 수 있습니다.','다른 고객님이나 직원의 얼굴이 사진에 나오지 않도록 부탁드립니다.'],sectionEyebrow:'HOW TO PARTICIPATE',guideTitle:'참여 방법',guideBody:'휴대폰에서는 아래 버튼을 누르면 리뷰 페이지로 바로 이동합니다.',steps:['결제 후 직원에게 영수증 발급을 요청해 주세요.','네이버 지도 리뷰 페이지로 이동해 주세요.','구매 인증 후 사진과 함께 리뷰를 작성해 주세요.','작성 완료 화면을 직원에게 보여주세요.'],qrTitle:'네이버 지도 포토리뷰',qrBody:'다른 기기로 보고 있다면 QR을 스캔해 주세요.',secondary:'포토리뷰 페이지 열기',footer:'BlueBlack Pen Shop 매장 이벤트 안내'},
  en:{pageTitle:'Photo Review Event | BlueBlack Pen Shop',back:'Back to the digital guide',eyebrow:'BLUEBLACK STORE EVENT',title:'Leave a photo review and receive an ink sample',intro:'Post a photo review of your purchase and show the completed screen to our staff.',rewardLabel:'PHOTO REVIEW GIFT',rewardLead:'After completing a photo review',rewardMain:'One random 5ml ink sample',primary:'Open Google Maps photo reviews',ruleTitle:'Please check before participating',rules:['Please include a photo with your review.','The event is limited to once per person per day.','Please make sure other customers and staff members are not visible in your photo.'],sectionEyebrow:'HOW TO PARTICIPATE',guideTitle:'How to participate',guideBody:'On your phone, use the button below to open the review page directly.',steps:['Ask our staff for a receipt after payment.','Open the BlueBlack review page on Google Maps.','Verify your purchase and write a review with a photo.','Show the completed review screen to our staff.'],qrTitle:'Google Maps photo reviews',qrBody:'Scan this QR code when viewing the guide on another device.',secondary:'Open photo review page',footer:'BlueBlack Pen Shop Store Event'},
  ja:{pageTitle:'フォトレビューイベント | BlueBlack Pen Shop',back:'デジタルガイドに戻る',eyebrow:'BLUEBLACK STORE EVENT',title:'フォトレビュー投稿でインクサンプルをプレゼント',intro:'ご購入商品のフォトレビューを投稿し、完了画面をスタッフにお見せください。',rewardLabel:'PHOTO REVIEW GIFT',rewardLead:'フォトレビュー完了で',rewardMain:'ランダム5mlインクサンプル 1本',primary:'Googleマップのフォトレビューを開く',ruleTitle:'参加前にご確認ください',rules:['レビューに写真を添付してください。','イベントへの参加はお一人様1日1回までです。','ほかのお客様やスタッフの顔が写真に写らないようお願いいたします。'],sectionEyebrow:'HOW TO PARTICIPATE',guideTitle:'参加方法',guideBody:'スマートフォンでは、下のボタンからレビューページを直接開けます。',steps:['お会計後、スタッフにレシートの発行をお申し付けください。','GoogleマップのBlueBlackレビューページを開いてください。','購入を証明し、写真付きレビューを投稿してください。','完了画面をスタッフにお見せください。'],qrTitle:'Googleマップ フォトレビュー',qrBody:'別の端末で表示している場合はQRを読み取ってください。',secondary:'フォトレビューページを開く',footer:'BlueBlack Pen Shop 店頭イベント'},
  'zh-Hans':{pageTitle:'图片评价活动 | BlueBlack Pen Shop',back:'返回数字指南',eyebrow:'BLUEBLACK STORE EVENT',title:'留下图片评价，领取墨水分装礼品',intro:'完成所购商品的图片评价后，请向店员出示完成页面。',rewardLabel:'PHOTO REVIEW GIFT',rewardLead:'完成图片评价即可获得',rewardMain:'随机5ml墨水分装 1瓶',primary:'打开 Google 地图图片评价',ruleTitle:'参与前请确认',rules:['请在评价中一同上传照片。','每人每天仅限参与一次。','请注意不要拍到其他顾客或店员的脸。'],sectionEyebrow:'HOW TO PARTICIPATE',guideTitle:'参与方法',guideBody:'使用手机时，可直接点击下方按钮打开评价页面。',steps:['付款后请向店员索取小票。','打开 Google 地图上的 BlueBlack 评价页面。','验证购买记录并上传照片后完成评价。','向店员出示评价完成页面。'],qrTitle:'Google 地图图片评价',qrBody:'使用其他设备查看时，可扫描此二维码。',secondary:'打开图片评价页面',footer:'BlueBlack Pen Shop 门店活动'},
  'zh-Hant':{pageTitle:'照片評論活動 | BlueBlack Pen Shop',back:'返回數位指南',eyebrow:'BLUEBLACK STORE EVENT',title:'留下照片評論，領取墨水分裝贈品',intro:'完成所購商品的照片評論後，請向店員出示完成頁面。',rewardLabel:'PHOTO REVIEW GIFT',rewardLead:'完成照片評論即可獲得',rewardMain:'隨機5ml墨水分裝 1瓶',primary:'開啟 Google 地圖照片評論',ruleTitle:'參與前請確認',rules:['請在評論中一同上傳照片。','每人每天僅限參與一次。','請注意不要拍到其他顧客或店員的臉。'],sectionEyebrow:'HOW TO PARTICIPATE',guideTitle:'參與方式',guideBody:'使用手機時，可直接點擊下方按鈕開啟評論頁面。',steps:['付款後請向店員索取收據。','開啟 Google 地圖上的 BlueBlack 評論頁面。','驗證購買紀錄並上傳照片後完成評論。','向店員出示評論完成頁面。'],qrTitle:'Google 地圖照片評論',qrBody:'使用其他裝置查看時，可掃描此QR碼。',secondary:'開啟照片評論頁面',footer:'BlueBlack Pen Shop 門市活動'}
};
function normalizeLanguage(value){
  const language=(value||'ko').toLowerCase();
  if(language.includes('hant')||language.startsWith('zh-tw')||language.startsWith('zh-hk'))return'zh-Hant';
  if(language.startsWith('zh'))return'zh-Hans';
  if(language.startsWith('ja'))return'ja';
  if(language.startsWith('en'))return'en';
  return'ko';
}
function getLanguage(){return normalizeLanguage(new URLSearchParams(location.search).get('lang')||localStorage.getItem('blueblack-language')||navigator.language);}
function applyLanguage(language,{replaceUrl=false}={}){
  const lang=languages.includes(language)?language:'ko';
  const text=copy[lang]||copy.ko;
  document.documentElement.lang=lang;
  document.title=text.pageTitle;
  localStorage.setItem('blueblack-language',lang);
  document.querySelectorAll('[data-copy]').forEach(node=>{const key=node.dataset.copy;if(text[key])node.textContent=text[key];});
  document.querySelectorAll('[data-step]').forEach(node=>{node.textContent=text.steps[Number(node.dataset.step)]||'';});
  document.querySelectorAll('[data-rule]').forEach(node=>{node.textContent=text.rules[Number(node.dataset.rule)]||'';});
  document.querySelectorAll('[data-review-link]').forEach(node=>{node.href=reviewLinks[lang];});
  document.querySelectorAll('[data-review-qr]').forEach(qr=>{qr.src=lang==='ko'?'./review-qr-ko.svg':'./review-qr-en.svg';qr.alt=text.qrTitle;});
  const back=document.querySelector('[data-review-back]');
  if(back)back.href=`../?lang=${encodeURIComponent(lang)}`;
  document.querySelectorAll('[data-review-lang]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.reviewLang===lang)));
  if(replaceUrl){const url=new URL(location.href);url.searchParams.set('lang',lang);history.replaceState(null,'',url);}
}
document.querySelectorAll('[data-review-lang]').forEach(button=>button.addEventListener('click',()=>applyLanguage(button.dataset.reviewLang,{replaceUrl:true})));
applyLanguage(getLanguage());