const COPY={
  ko:{status:'사용 가능',body:'브랜드 검색, 5ml·10ml 확인 목록과 공식 소분 가격표 확대 보기를 지원합니다.'},
  en:{status:'Available',body:'Search brands, build a 5ml or 10ml check list and view the official price sheets.'},
  ja:{status:'利用可能',body:'ブランド検索、5ml・10ml確認リスト、公式価格表の拡大表示に対応します。'},
  'zh-Hans':{status:'可使用',body:'支持品牌搜索、5ml或10ml确认清单及官方价格表放大查看。'},
  'zh-Hant':{status:'可使用',body:'支援品牌搜尋、5ml或10ml確認清單及官方價格表放大查看。'}
};
function lang(){const value=document.documentElement.lang||'ko';if(value.startsWith('zh-Hant'))return'zh-Hant';if(value.startsWith('zh'))return'zh-Hans';if(value.startsWith('ja'))return'ja';if(value.startsWith('en'))return'en';return'ko';}
function apply(){const card=[...document.querySelectorAll('.tool-card')].find(node=>node.getAttribute('href')?.includes('ink-price'));if(!card)return;const copy=COPY[lang()]||COPY.ko;card.classList.remove('is-planned');const status=card.querySelector('.tool-status');if(status){status.removeAttribute('data-portal-t');status.textContent=copy.status;}const body=card.querySelector('.tool-copy p');if(body){body.removeAttribute('data-portal-t');body.textContent=copy.body;}}
document.querySelectorAll('[data-portal-lang]').forEach(button=>button.addEventListener('click',()=>setTimeout(apply,40)));
setTimeout(apply,0);