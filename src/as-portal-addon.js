const asPortalCopy={
  ko:{title:'A/S 안내',body:'펜뷔페 전용 안내와 브랜드별 공식 접수처, 비용과 준비사항을 확인합니다.'},
  en:{title:'After-sales service guide',body:'Review the Pen Buffet policy and official service centers, costs and required documents by brand.'},
  ja:{title:'A/S・修理案内',body:'ペンビュッフェ専用案内とブランド別の公式受付先、費用、必要事項を確認します。'},
  'zh-Hans':{title:'售后服务指南',body:'查看钢笔自助配色专用说明及各品牌官方受理中心、费用和所需资料。'},
  'zh-Hant':{title:'售後服務指南',body:'查看鋼筆自助配色專用說明及各品牌官方受理中心、費用與所需資料。'}
};
function asPortalLanguage(){const raw=(new URLSearchParams(location.search).get('lang')||localStorage.getItem('blueblack-language')||navigator.language||'ko').toLowerCase();if(raw.includes('hant')||raw.startsWith('zh-tw')||raw.startsWith('zh-hk'))return'zh-Hant';if(raw.startsWith('zh'))return'zh-Hans';if(raw.startsWith('ja'))return'ja';if(raw.startsWith('en'))return'en';return'ko';}
function applyAsPortalCopy(){const value=asPortalCopy[asPortalLanguage()]||asPortalCopy.ko;document.querySelectorAll('[data-as-portal-t]').forEach(node=>{const text=value[node.dataset.asPortalT];if(text)node.textContent=text;});}
document.querySelectorAll('[data-portal-lang]').forEach(button=>button.addEventListener('click',()=>queueMicrotask(applyAsPortalCopy)));applyAsPortalCopy();
