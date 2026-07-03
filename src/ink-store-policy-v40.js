function makeNotice(text){const node=document.createElement('div');node.className='ink-notice ink-store-policy';node.textContent=text;return node;}
function renderInkStorePolicy(){
  const notices=document.querySelector('.ink-notices');
  if(!notices||notices.querySelector('.ink-store-policy'))return;
  notices.prepend(
    makeNotice('소분 잉크는 5ml·10ml 구분 없이 병당 도장 1개가 적립되며, 도장 15개를 모으면 5ml 소분 잉크 1병으로 교환할 수 있습니다.'),
    makeNotice('컬러차트(발색표)는 2층 매장 테이블에 있습니다. 브랜드별·색상 추천별·블루블랙 펜샵 한정 잉크 차트를 참고하고, 찾기 어렵다면 직원에게 문의해 주세요.')
  );
}
function initInkStorePolicy(){renderInkStorePolicy();new MutationObserver(renderInkStorePolicy).observe(document.body,{childList:true,subtree:true});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initInkStorePolicy,{once:true});else initInkStorePolicy();
