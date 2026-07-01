const engravingPortalCopy={
ko:{title:'각인 안내',body:'12가지 각인 글꼴과 지원 문자를 확인하고 각인 전 문구를 점검합니다.'},
en:{title:'Engraving guide',body:'Review 12 engraving fonts, supported characters and pre-engraving checks.'},
ja:{title:'名入れ案内',body:'12種類のフォント、対応文字、名入れ前の確認事項を案内します。'},
'zh-Hans':{title:'刻字指南',body:'查看12种刻字字体、支持字符及刻字前确认事项。'},
'zh-Hant':{title:'刻字指南',body:'查看12種刻字字體、支援字元及刻字前確認事項。'}
};
function engravingPortalLanguage(){const raw=(new URLSearchParams(location.search).get('lang')||localStorage.getItem('blueblack-language')||navigator.language||'ko').toLowerCase();if(raw.includes('hant')||raw.startsWith('zh-tw')||raw.startsWith('zh-hk'))return'zh-Hant';if(raw.startsWith('zh'))return'zh-Hans';if(raw.startsWith('ja'))return'ja';if(raw.startsWith('en'))return'en';return'ko';}
function applyEngravingPortalCopy(){const value=engravingPortalCopy[engravingPortalLanguage()]||engravingPortalCopy.ko;document.querySelectorAll('[data-engraving-portal-t]').forEach(node=>{const text=value[node.dataset.engravingPortalT];if(text)node.textContent=text;});}
document.querySelectorAll('[data-portal-lang]').forEach(button=>button.addEventListener('click',()=>queueMicrotask(applyEngravingPortalCopy)));applyEngravingPortalCopy();
