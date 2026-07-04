const copy={
  title:'마감 전 이용 안내',
  body:'매장은 오후 6시에 마감합니다. 원활한 마감 정리와 전산 업무를 위해 오후 5시 40분부터는 구매 상담이 어려울 수 있습니다. 충분한 상담이 필요하신 경우 오후 5시 40분 이전에 방문해 주시거나, 다른 영업일에 여유 있게 방문해 주세요. 소분 잉크 주문은 오후 5시 40분에 마감됩니다. 너른 양해 부탁드립니다.'
};
function renderStoreClosingNotice(){
  const heading=document.querySelector('[data-portal-t="visitInfo"]');
  const section=heading?.closest('.detail-card');
  if(!section||section.querySelector('.store-closing-notice'))return;
  const style=document.createElement('style');
  style.textContent='.store-closing-notice{display:grid;grid-template-columns:42px minmax(0,1fr);gap:13px;align-items:start;margin-top:14px;padding:16px 17px;border:1px solid #d7c7a5;border-radius:15px;background:#fbf8f1}.store-closing-notice-icon{display:grid;place-items:center;width:42px;height:42px;border-radius:13px;background:#10233f;color:#fff;font-size:19px}.store-closing-notice strong{display:block;color:#10233f;font-size:13px}.store-closing-notice p{margin:6px 0 0;color:#5f6d7d;font-size:10px;line-height:1.75}@media(max-width:520px){.store-closing-notice{grid-template-columns:36px minmax(0,1fr);padding:14px}.store-closing-notice-icon{width:36px;height:36px;font-size:16px}}';
  document.head.appendChild(style);
  const notice=document.createElement('div');
  notice.className='store-closing-notice';
  notice.innerHTML='<span class="store-closing-notice-icon" aria-hidden="true">◷</span><div><strong></strong><p></p></div>';
  notice.querySelector('strong').textContent=copy.title;
  notice.querySelector('p').textContent=copy.body;
  const grid=section.querySelector('.detail-grid');
  if(grid)grid.insertAdjacentElement('afterend',notice);else section.appendChild(notice);
}
renderStoreClosingNotice();