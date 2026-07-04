const reviewEventCopy={
  ko:{kicker:'PHOTO REVIEW EVENT',title:'포토리뷰 이벤트',body:'제품 사진이 포함된 리뷰를 남기면 랜덤 5ml 소분 잉크 1병을 드립니다. 참여는 1일 1인 1회입니다.',status:'진행 중'},
  en:{kicker:'PHOTO REVIEW EVENT',title:'Photo Review Event',body:'Post a review with a product photo and receive one random 5ml ink sample. One entry per person per day.',status:'Ongoing'},
  ja:{kicker:'PHOTO REVIEW EVENT',title:'フォトレビューイベント',body:'商品写真付きレビューでランダム5mlインクサンプルを1本プレゼント。1日1名様1回までです。',status:'開催中'},
  'zh-Hans':{kicker:'PHOTO REVIEW EVENT',title:'图片评价活动',body:'附上商品照片并完成评价，即可获赠随机5ml墨水分装1瓶。每人每天限一次。',status:'进行中'},
  'zh-Hant':{kicker:'PHOTO REVIEW EVENT',title:'照片評論活動',body:'附上商品照片並完成評論，即可獲贈隨機5ml墨水分裝1瓶。每人每天限一次。',status:'進行中'}
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