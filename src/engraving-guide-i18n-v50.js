const ENGRAVING_EXTRA={
  ko:{meta:'블루블랙 각인 안내를 기준으로 각인 방식과 비용, 12가지 글꼴, 지원 문자와 각인 전 확인사항을 안내합니다.',filter:'문자 종류 필터',fonts:['돋움','바탕','휴먼편지','난초','나눔고딕','나눔붓','잉크버로우','필기체','브래들리','반흘림','해서','모노타입']},
  en:{meta:'Review BlueBlack engraving methods, prices, 12 fonts, supported characters and the checks required before engraving.',filter:'Character set filter',fonts:['Dotum','Batang','Human Letter','Orchid','Nanum Gothic','Nanum Brush','Ink Burrow','Cursive','Bradley','Semi-cursive','Haeseo','Monotype']},
  ja:{meta:'BlueBlackの名入れ方法、料金、12種類のフォント、対応文字、事前確認事項をご案内します。',filter:'文字種類フィルター',fonts:['ドトゥム','バタン','ヒューマンレター','ナンチョ','ナヌムゴシック','ナヌム筆','インクバロウ','筆記体','ブラッドリー','半草書','楷書','モノタイプ']},
  'zh-Hans':{meta:'查看BlueBlack刻字方式、费用、12种字体、支持字符及刻字前确认事项。',filter:'字符类型筛选',fonts:['Dotum','Batang','Human Letter','兰草体','Nanum Gothic','Nanum Brush','Ink Burrow','手写体','Bradley','半草书','楷书','Monotype']},
  'zh-Hant':{meta:'查看BlueBlack刻字方式、費用、12種字體、支援字元及刻字前確認事項。',filter:'字元類型篩選',fonts:['Dotum','Batang','Human Letter','蘭草體','Nanum Gothic','Nanum Brush','Ink Burrow','手寫體','Bradley','半草書','楷書','Monotype']}
};
function engravingExtraLang(){const value=(document.documentElement.lang||new URLSearchParams(location.search).get('lang')||'ko').toLowerCase();if(value.includes('hant')||value.startsWith('zh-tw')||value.startsWith('zh-hk'))return'zh-Hant';if(value.startsWith('zh'))return'zh-Hans';if(value.startsWith('ja'))return'ja';if(value.startsWith('en'))return'en';return'ko';}
function applyEngravingExtra(){
  const language=engravingExtraLang();
  const copy=ENGRAVING_EXTRA[language]||ENGRAVING_EXTRA.ko;
  document.querySelector('meta[name="description"]')?.setAttribute('content',copy.meta);
  document.querySelector('#engravingFilter')?.setAttribute('aria-label',copy.filter);
  document.querySelectorAll('#engravingFontGrid .engraving-font-card').forEach((card,index)=>{
    const node=card.querySelector('.engraving-font-head strong');
    if(!node)return;
    if(!node.dataset.officialKo)node.dataset.officialKo=ENGRAVING_EXTRA.ko.fonts[index]||node.textContent.trim();
    node.title=language==='ko'?'':node.dataset.officialKo;
    const value=copy.fonts[index]||node.dataset.officialKo;
    if(node.textContent!==value)node.textContent=value;
  });
  const group=document.querySelector('.engraving-topbar .portal-language');
  if(group)group.setAttribute('aria-label',language==='ko'?'언어 선택':language==='ja'?'言語を選択':language==='zh-Hans'?'选择语言':language==='zh-Hant'?'選擇語言':'Choose language');
}
let engravingExtraQueued=false;
function scheduleEngravingExtra(){if(engravingExtraQueued)return;engravingExtraQueued=true;requestAnimationFrame(()=>{engravingExtraQueued=false;applyEngravingExtra();});}
const engravingGrid=document.querySelector('#engravingFontGrid');
if(engravingGrid)new MutationObserver(scheduleEngravingExtra).observe(engravingGrid,{childList:true});
new MutationObserver(scheduleEngravingExtra).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
document.querySelectorAll('[data-portal-lang]').forEach(button=>button.addEventListener('click',()=>{setTimeout(applyEngravingExtra,20);setTimeout(applyEngravingExtra,120);}));
applyEngravingExtra();
