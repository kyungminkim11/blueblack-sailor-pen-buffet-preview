const asCopy={
ko:{title:'브랜드별 A/S 안내',intro:'사용 중인 브랜드를 검색하면 공식 접수처, 연락처, 주소와 비용 관련 주의사항을 확인할 수 있습니다.',search:'브랜드 검색',placeholder:'예: 라미, Lamy, 세일러, Sailor',shown:n=>`${n}개 접수처가 표시됩니다.`,empty:'일치하는 브랜드를 찾지 못했습니다.'},
en:{title:'Brand After-Sales Service Guide',intro:'Search your brand to find the official service center, contact details, address and cost notices.',search:'Search brand',placeholder:'e.g. Lamy, Sailor, Pilot, Parker',shown:n=>`${n} service centers shown.`,empty:'No matching brand was found.'},
ja:{title:'ブランド別修理案内',intro:'ブランドを検索すると、公式受付先、連絡先、住所、費用に関する注意事項を確認できます。',search:'ブランド検索',placeholder:'例：ラミー、セーラー、パイロット',shown:n=>`${n}件の受付先を表示しています。`,empty:'該当するブランドがありません。'},
'zh-Hans':{title:'品牌售后服务指南',intro:'搜索品牌即可查看官方受理中心、联系方式、地址和费用注意事项。',search:'搜索品牌',placeholder:'例如 Lamy、Sailor、Pilot、Parker',shown:n=>`显示${n}个受理中心。`,empty:'未找到匹配品牌。'},
'zh-Hant':{title:'品牌售後服務指南',intro:'搜尋品牌即可查看官方受理中心、聯絡方式、地址與費用注意事項。',search:'搜尋品牌',placeholder:'例如 Lamy、Sailor、Pilot、Parker',shown:n=>`顯示${n}個受理中心。`,empty:'未找到符合品牌。'}
};
function asLang(){const raw=(new URLSearchParams(location.search).get('lang')||localStorage.getItem('blueblack-language')||navigator.language||'ko').toLowerCase();if(raw.includes('hant')||raw.startsWith('zh-tw')||raw.startsWith('zh-hk'))return'zh-Hant';if(raw.startsWith('zh'))return'zh-Hans';if(raw.startsWith('ja'))return'ja';if(raw.startsWith('en'))return'en';return'ko';}
function asNorm(value=''){return String(value).normalize('NFKC').toLowerCase().replace(/[^0-9a-z가-힣ぁ-んァ-ヶ一-龠]+/g,'');}
const input=document.querySelector('#asBrandSearch');
const clearButton=document.querySelector('#asBrandClear');
const summary=document.querySelector('#asResultSummary');
const cards=[...document.querySelectorAll('[data-as-search]')];
function renderAs(){const term=asNorm(input?.value||'');let count=0;cards.forEach(card=>{const visible=!term||asNorm(card.dataset.asSearch).includes(term);card.hidden=!visible;if(visible)count+=1;});const t=asCopy[asLang()]||asCopy.ko;if(summary)summary.textContent=count?t.shown(count):t.empty;}
function applyAsLanguage(){const t=asCopy[asLang()]||asCopy.ko;document.querySelector('[data-as-title]')?.replaceChildren(t.title);document.querySelector('[data-as-intro]')?.replaceChildren(t.intro);document.querySelector('[data-as-search-label]')?.replaceChildren(t.search);if(input)input.placeholder=t.placeholder;document.title=t.title;renderAs();}
input?.addEventListener('input',renderAs);clearButton?.addEventListener('click',()=>{if(input){input.value='';renderAs();input.focus();}});document.querySelectorAll('[data-as-quick]').forEach(button=>button.addEventListener('click',()=>{if(input){input.value=button.dataset.asQuick||'';renderAs();input.focus({preventScroll:true});}}));document.querySelectorAll('[data-portal-lang]').forEach(button=>button.addEventListener('click',()=>queueMicrotask(applyAsLanguage)));applyAsLanguage();
