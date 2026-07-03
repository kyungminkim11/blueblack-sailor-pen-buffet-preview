import {INK_I18N} from './ink-price-i18n-copy-v43.js';

Object.assign(INK_I18N.en,{listTitle:'Cart',listBody:'Change the size or quantity of any item, or remove it directly from the cart.'});
Object.assign(INK_I18N.ja,{listTitle:'カート',listBody:'カート内で容量・数量の変更や商品の削除ができます。'});
Object.assign(INK_I18N['zh-Hans'],{listTitle:'购物清单',listBody:'可直接在清单中更改容量和数量，或删除商品。'});
Object.assign(INK_I18N['zh-Hant'],{listTitle:'購物清單',listBody:'可直接在清單中變更容量和數量，或刪除商品。'});

function applyKoreanCartCopy(){
  if(!(document.documentElement.lang||'ko').toLowerCase().startsWith('ko'))return;
  const title=document.querySelector('[data-store-list-title]');
  const body=document.querySelector('[data-store-list-body]');
  const dock=document.querySelector('.ink-store-mobile-dock>span');
  if(title&&title.textContent!=='장바구니')title.textContent='장바구니';
  if(body&&body.textContent!=='담은 제품의 용량과 수량을 바로 변경하거나 삭제할 수 있습니다.')body.textContent='담은 제품의 용량과 수량을 바로 변경하거나 삭제할 수 있습니다.';
  if(dock&&dock.textContent!=='장바구니')dock.textContent='장바구니';
}
function initKoreanCartCopy(){applyKoreanCartCopy();new MutationObserver(()=>requestAnimationFrame(applyKoreanCartCopy)).observe(document.body,{childList:true,subtree:true});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initKoreanCartCopy,{once:true});else initKoreanCartCopy();