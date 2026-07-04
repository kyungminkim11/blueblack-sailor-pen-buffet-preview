const reviewEventCopy={
  ko:{kicker:'STORE REVIEW EVENT',title:'영수증 리뷰 이벤트',body:'매장 리뷰를 남기고 완료 화면을 직원에게 보여주면 랜덤 5ml 소분 잉크 1병을 드립니다.',status:'진행 중'},
  en:{kicker:'STORE REVIEW EVENT',title:'Receipt Review Event',body:'Leave a store review, show the completed review to our staff, and receive one random 5ml ink sample.',status:'Ongoing'},
  ja:{kicker:'STORE REVIEW EVENT',title:'レシートレビューイベント',body:'店舗レビューを投稿し、完了画面をスタッフに見せると、ランダム5mlインクサンプルを1本プレゼントします。',status:'開催中'},
  'zh-Hans':{kicker:'STORE REVIEW EVENT',title:'小票评价活动',body:'留下门店评价并向店员出示完成页面，即可获赠随机5ml墨水分装1瓶。',status:'进行中'},
  'zh-Hant':{kicker:'STORE REVIEW EVENT',title:'發票評論活動',body:'留下門市評論並向店員出示完成頁面，即可獲贈隨機5ml墨水分裝1瓶。',status:'進行中'}
};
function reviewEventLanguage(){
  const value=(new URLSearchParams(location.search).get('lang')||localStorage.getItem('blueblack-language')||navigator.language||'ko').toLowerCase();
  if(value.includes('hant')||value.startsWith('zh-tw')||value.startsWith('zh-hk'))return'zh-Hant';
  if(value.startsWith('zh'))return'zh-Hans';
  if(value.startsWith('ja'))return'ja';
  if(value.startsWith('en'))return'en';
  return'ko';
}
function renderReviewEventCard(){
  const lang=reviewEventLanguage();
  const text=reviewEventCopy[lang]||reviewEventCopy.ko;
  const card=document.querySelector('[data-review-event-card]');
  if(!card)return;
  const kicker=card.querySelector('[data-review-event-kicker]');
  const title=card.querySelector('[data-review-event-title]');
  const body=card.querySelector('[data-review-event-body]');
  const status=card.querySelector('[data-review-event-status]');
  if(kicker)kicker.textContent=text.kicker;
  if(title)title.textContent=text.title;
  if(body)body.textContent=text.body;
  if(status)status.textContent=text.status;
  card.href=`./review-event/?lang=${encodeURIComponent(lang)}`;
}
document.querySelectorAll('[data-portal-lang]').forEach(button=>button.addEventListener('click',()=>setTimeout(renderReviewEventCard,0)));
window.addEventListener('storage',renderReviewEventCard);
renderReviewEventCard();