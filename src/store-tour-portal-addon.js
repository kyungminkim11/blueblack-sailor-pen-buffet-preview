const COPY={
  ko:{title:'매장 둘러보기',body:'1층과 2층의 매장 사진, 브랜드·제품 안내와 2층 안내도를 미리 확인하세요.'},
  en:{title:'Explore the Store',body:'Preview first- and second-floor photos, brand and product guides, and the second-floor map.'},
  ja:{title:'店舗を見てみる',body:'1階・2階の店舗写真、ブランド・商品案内、2階案内図を事前に確認できます。'},
  'zh-Hans':{title:'提前逛店',body:'提前查看一楼和二楼照片、品牌与商品指南以及二楼导览图。'},
  'zh-Hant':{title:'提前逛店',body:'提前查看一樓和二樓照片、品牌與商品指南以及二樓導覽圖。'}
};
function language(){const value=document.documentElement.lang||'ko';if(value.startsWith('zh-Hant')||value.startsWith('zh-TW')||value.startsWith('zh-HK'))return'zh-Hant';if(value.startsWith('zh'))return'zh-Hans';if(value.startsWith('ja'))return'ja';if(value.startsWith('en'))return'en';return'ko'}
function apply(){const copy=COPY[language()]||COPY.ko;document.querySelectorAll('[data-tour-portal-t]').forEach((node)=>{const value=copy[node.dataset.tourPortalT];if(value)node.textContent=value})}
apply();new MutationObserver(apply).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
