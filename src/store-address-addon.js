function applyStoreFloorInformation(){
  const address=document.querySelector('[data-map-i18n="addressValue"]');
  if(!address)return;
  const language=document.documentElement.lang||'ko';
  if(language.startsWith('ko'))address.textContent='서울특별시 종로구 사직로 109 · B1, 2F, 4F';
  else address.textContent=`${address.textContent.replace(/\s*[·,]?\s*B1.*$/,'')} · B1, 2F, 4F`;
}
document.querySelectorAll('[data-portal-lang]').forEach(button=>button.addEventListener('click',()=>queueMicrotask(applyStoreFloorInformation)));
applyStoreFloorInformation();
import('./store-guide-merged.js');
import('./store-map-dedupe.js');
