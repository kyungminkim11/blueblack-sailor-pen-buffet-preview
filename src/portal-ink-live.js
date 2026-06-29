const COPY={
  ko:{status:'사용 가능',body:'공식 소분 안내와 브랜드별 5ml·10ml 가격표를 확대해서 확인합니다.'},
  en:{status:'Available',body:'View the official guidance and 5ml or 10ml prices by brand.'},
  ja:{status:'利用可能',body:'公式案内とブランド別5ml・10ml価格表を拡大して確認できます。'},
  'zh-Hans':{status:'可使用',body:'可放大查看官方说明及各品牌5ml、10ml分装价格。'},
  'zh-Hant':{status:'可使用',body:'可放大查看官方說明及各品牌5ml、10ml分裝價格。'}
};
function lang(){const value=document.documentElement.lang||'ko';if(value.startsWith('zh-Hant'))return'zh-Hant';if(value.startsWith('zh'))return'zh-Hans';if(value.startsWith('ja'))return'ja';if(value.startsWith('en'))return'en';return'ko';}
function apply(){const card=[...document.querySelectorAll('.tool-card')].find(node=>node.getAttribute('href')?.includes('ink-price'));if(!card)return;const copy=COPY[lang()]||COPY.ko;card.classList.remove('is-planned');const status=card.querySelector('.tool-status');if(status){status.removeAttribute('data-portal-t');status.textContent=copy.status;}const body=card.querySelector('.tool-copy p');if(body){body.removeAttribute('data-portal-t');body.textContent=copy.body;}}
document.querySelectorAll('[data-portal-lang]').forEach(button=>button.addEventListener('click',()=>setTimeout(apply,40)));
setTimeout(apply,0);