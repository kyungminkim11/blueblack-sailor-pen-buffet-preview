function applyFriendlyReviewCopy(){
  if(!(document.documentElement.lang||'ko').startsWith('ko'))return;
  const rules=[
    '포토리뷰 이벤트이므로 리뷰에 사진을 함께 올려주세요.',
    '이벤트는 하루에 한 분당 한 번 참여하실 수 있습니다.',
    '촬영하실 때 다른 고객님이나 직원이 사진에 나오지 않도록 부탁드립니다.'
  ];
  const title=document.querySelector('[data-copy="ruleTitle"]');
  if(title)title.textContent='참여 전 확인해 주세요';
  document.querySelectorAll('[data-rule]').forEach(node=>{node.textContent=rules[Number(node.dataset.rule)]||'';});
  document.querySelectorAll('[data-step="2"]').forEach(node=>{node.textContent='구매 인증 후 리뷰에 상품 사진을 함께 올려주세요. 촬영 시 다른 고객님이나 직원이 사진에 나오지 않도록 부탁드립니다.';});
  document.querySelectorAll('[data-copy="notice"]').forEach(node=>{node.textContent='포토리뷰 이벤트이므로 리뷰에 사진을 함께 올려주세요. 이벤트는 하루에 한 분당 한 번 참여하실 수 있으며, 촬영하실 때 다른 고객님이나 직원이 사진에 나오지 않도록 부탁드립니다.';});
}
document.querySelectorAll('[data-review-lang]').forEach(button=>button.addEventListener('click',()=>setTimeout(applyFriendlyReviewCopy,0)));
applyFriendlyReviewCopy();