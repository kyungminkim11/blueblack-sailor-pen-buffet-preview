const STORE_CLOSING_COPY={
  ko:{title:'마감 전 이용 안내',body:'매장은 오후 6시에 마감합니다. 원활한 마감 정리와 전산 업무를 위해 오후 5시 40분부터는 구매 상담이 어려울 수 있습니다. 충분한 상담이 필요하신 경우 오후 5시 40분 이전에 방문해 주시거나, 다른 영업일에 여유 있게 방문해 주세요. 소분 잉크 주문은 오후 5시 40분에 마감됩니다. 너른 양해 부탁드립니다.'},
  en:{title:'Before closing',body:'The store closes at 6:00 PM. As closing preparation and system work begin, purchase consultations may be limited from 5:40 PM. For a detailed consultation, please arrive before 5:40 PM or visit on another business day. Ink decant orders also close at 5:40 PM. Thank you for your understanding.'},
  ja:{title:'閉店前のご利用案内',body:'当店は午後6時に閉店します。閉店準備およびシステム作業のため、午後5時40分以降は購入相談を承ることが難しい場合があります。詳しいご相談が必要な場合は午後5時40分までにご来店いただくか、別の営業日に余裕をもってお越しください。インク小分けのご注文も午後5時40分に締め切ります。ご了承ください。'},
  'zh-Hans':{title:'闭店前使用提示',body:'本店于下午6点闭店。因闭店整理和系统作业，下午5点40分以后可能无法提供充分的购买咨询。如需详细咨询，请在下午5点40分前到店，或选择其他营业日从容来访。墨水分装订单也于下午5点40分截止，敬请谅解。'},
  'zh-Hant':{title:'閉店前使用提醒',body:'本店於下午6點閉店。因閉店整理與系統作業，下午5點40分以後可能無法提供充分的購買諮詢。如需詳細諮詢，請於下午5點40分前到店，或選擇其他營業日從容來訪。墨水分裝訂單也於下午5點40分截止，敬請見諒。'}
};

function closingLanguage(){
  const value=(document.documentElement.lang||'ko').toLowerCase();
  if(value.includes('hant')||value.startsWith('zh-tw')||value.startsWith('zh-hk'))return'zh-Hant';
  if(value.startsWith('zh'))return'zh-Hans';
  if(value.startsWith('ja'))return'ja';
  if(value.startsWith('en'))return'en';
  return'ko';
}

function updateStoreClosingNotice(){
  const notice=document.querySelector('.store-closing-notice');
  if(!notice)return;
  const copy=STORE_CLOSING_COPY[closingLanguage()]||STORE_CLOSING_COPY.ko;
  notice.querySelector('strong').textContent=copy.title;
  notice.querySelector('p').textContent=copy.body;
}

function renderStoreClosingNotice(){
  const heading=document.querySelector('[data-portal-t="visitInfo"]');
  const section=heading?.closest('.detail-card');
  if(!section)return;
  if(!document.querySelector('style[data-store-closing-notice]')){
    const style=document.createElement('style');
    style.dataset.storeClosingNotice='true';
    style.textContent='.store-closing-notice{display:grid;grid-template-columns:42px minmax(0,1fr);gap:13px;align-items:start;margin-top:14px;padding:16px 17px;border:1px solid #d7c7a5;border-radius:15px;background:#fbf8f1}.store-closing-notice-icon{display:grid;place-items:center;width:42px;height:42px;border-radius:13px;background:#10233f;color:#fff;font-size:19px}.store-closing-notice strong{display:block;color:#10233f;font-size:13px}.store-closing-notice p{margin:6px 0 0;color:#5f6d7d;font-size:10px;line-height:1.75}@media(max-width:520px){.store-closing-notice{grid-template-columns:36px minmax(0,1fr);padding:14px}.store-closing-notice-icon{width:36px;height:36px;font-size:16px}}';
    document.head.appendChild(style);
  }
  let notice=section.querySelector('.store-closing-notice');
  if(!notice){
    notice=document.createElement('div');
    notice.className='store-closing-notice';
    notice.innerHTML='<span class="store-closing-notice-icon" aria-hidden="true">◷</span><div><strong></strong><p></p></div>';
    const grid=section.querySelector('.detail-grid');
    if(grid)grid.insertAdjacentElement('afterend',notice);else section.appendChild(notice);
  }
  updateStoreClosingNotice();
}

renderStoreClosingNotice();
new MutationObserver(()=>{renderStoreClosingNotice();updateStoreClosingNotice();}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});