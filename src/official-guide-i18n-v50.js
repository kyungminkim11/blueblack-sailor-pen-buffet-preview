import './public-ui-v52.js';

const OFFICIAL_EXTRA={
  ko:{
    meta:'블루블랙 공식 홈페이지의 브랜드, 상품 카테고리, 각인, A/S와 콘텐츠를 매장 상담용으로 정리한 디지털 가이드입니다.',
    popular:['라미 사파리','트위스비 에코','디아민','로디아 패드','플래티넘 센츄리','한정판'],
    stories:['블블 워크샵 감사 이벤트','트위스비 만년필 올바른 조립법','만년필 잉크 곰팡이 알아보기'],
    fonts:['돋움','바탕','휴먼편지','난초','나눔고딕','나눔붓','잉크버로우','필기체','브래들리','반흘림','해서','모노타입'],
    script:{hangul:'한글',hanja:'한문',latin:'English',number:'123'}
  },
  en:{
    meta:'A customer-facing guide to BlueBlack Pen Shop brands, product categories, engraving, after-sales service and official content.',
    popular:['LAMY Safari','TWSBI ECO','Diamine','Rhodia Pad','Platinum Century','Limited Editions'],
    stories:['BlueBlack Workshop Thank-you Event','How to Assemble a TWSBI Fountain Pen Correctly','Understanding Mold in Fountain Pen Ink'],
    fonts:['Dotum','Batang','Human Letter','Orchid','Nanum Gothic','Nanum Brush','Ink Burrow','Cursive','Bradley','Semi-cursive','Haeseo','Monotype'],
    script:{hangul:'Korean',hanja:'Hanja',latin:'English',number:'123'}
  },
  ja:{
    meta:'BlueBlack Pen Shopの取扱ブランド、商品カテゴリー、名入れ、修理、公式コンテンツを店頭向けにまとめたガイドです。',
    popular:['ラミー サファリ','TWSBI ECO','ダイアミン','ロディア パッド','プラチナ センチュリー','限定品'],
    stories:['BlueBlackワークショップ感謝イベント','TWSBI万年筆の正しい組み立て方','万年筆インクのカビについて'],
    fonts:['ドトゥム','バタン','ヒューマンレター','ナンチョ','ナヌムゴシック','ナヌム筆','インクバロウ','筆記体','ブラッドリー','半草書','楷書','モノタイプ'],
    script:{hangul:'韓国語',hanja:'漢字',latin:'英語',number:'123'}
  },
  'zh-Hans':{
    meta:'面向顾客整理BlueBlack Pen Shop经销品牌、商品分类、刻字、售后服务及官方内容的数字指南。',
    popular:['LAMY Safari','TWSBI ECO','Diamine','Rhodia Pad','Platinum Century','限定款'],
    stories:['BlueBlack工作坊感谢活动','TWSBI钢笔正确组装方法','了解钢笔墨水发霉问题'],
    fonts:['Dotum','Batang','Human Letter','兰草体','Nanum Gothic','Nanum Brush','Ink Burrow','手写体','Bradley','半草书','楷书','Monotype'],
    script:{hangul:'韩文',hanja:'汉字',latin:'英文',number:'123'}
  },
  'zh-Hant':{
    meta:'面向顧客整理BlueBlack Pen Shop經銷品牌、商品分類、刻字、售後服務及官方內容的數位指南。',
    popular:['LAMY Safari','TWSBI ECO','Diamine','Rhodia Pad','Platinum Century','限定款'],
    stories:['BlueBlack工作坊感謝活動','TWSBI鋼筆正確組裝方法','了解鋼筆墨水發霉問題'],
    fonts:['Dotum','Batang','Human Letter','蘭草體','Nanum Gothic','Nanum Brush','Ink Burrow','手寫體','Bradley','半草書','楷書','Monotype'],
    script:{hangul:'韓文',hanja:'漢字',latin:'英文',number:'123'}
  }
};

const FONT_SCRIPTS=[
  ['hangul','hanja','latin','number'],['hangul','hanja','latin','number'],['hangul','hanja','latin','number'],
  ['hangul','latin','number'],['hangul','latin','number'],['hangul','latin','number'],['latin','number'],['latin','number'],
  ['latin','number'],['hangul','latin','number'],['hangul','hanja','latin','number'],['latin','number']
];

function officialExtraLang(){
  const value=(document.documentElement.lang||new URLSearchParams(location.search).get('lang')||'ko').toLowerCase();
  if(value.includes('hant')||value.startsWith('zh-tw')||value.startsWith('zh-hk'))return'zh-Hant';
  if(value.startsWith('zh'))return'zh-Hans';
  if(value.startsWith('ja'))return'ja';
  if(value.startsWith('en'))return'en';
  return'ko';
}
function officialSet(node,value){if(node&&value!=null&&node.textContent!==String(value))node.textContent=String(value);}
function officialApplyBrandOrder(language){
  document.querySelectorAll('#officialBrandGrid a').forEach(link=>{
    const strong=link.querySelector('strong');
    const span=link.querySelector('span');
    if(!strong||!span)return;
    if(!link.dataset.brandKo){
      link.dataset.brandKo=strong.textContent.trim();
      link.dataset.brandEn=span.textContent.trim();
    }
    const primary=language==='ko'?link.dataset.brandKo:link.dataset.brandEn;
    const secondary=language==='ko'?link.dataset.brandEn:link.dataset.brandKo;
    officialSet(strong,primary);
    officialSet(span,secondary);
    span.lang=language==='ko'?'en':'ko';
    link.setAttribute('aria-label',`${primary} ${secondary}`);
  });
}
function officialApplyExtra(){
  const language=officialExtraLang();
  const copy=OFFICIAL_EXTRA[language]||OFFICIAL_EXTRA.ko;
  const meta=document.querySelector('meta[name="description"]');
  if(meta)meta.setAttribute('content',copy.meta);
  document.querySelectorAll('.official-popular-searches a').forEach((link,index)=>officialSet(link,copy.popular[index]?`# ${copy.popular[index]}`:link.textContent));
  document.querySelectorAll('.official-story-card > a strong').forEach((node,index)=>officialSet(node,copy.stories[index]||node.textContent));
  document.querySelectorAll('.engraving-grid article').forEach((article,index)=>{
    const name=article.querySelector('strong');
    const support=article.querySelector('span');
    if(name){
      if(!name.dataset.officialKo)name.dataset.officialKo=OFFICIAL_EXTRA.ko.fonts[index]||name.textContent.trim();
      name.title=language==='ko'?'':name.dataset.officialKo;
      officialSet(name,copy.fonts[index]||name.dataset.officialKo);
    }
    if(support){
      const scripts=FONT_SCRIPTS[index]||[];
      officialSet(support,scripts.map(key=>copy.script[key]).join(' · '));
    }
  });
  officialApplyBrandOrder(language);
  const group=document.querySelector('.official-topbar .portal-language');
  if(group)group.setAttribute('aria-label',language==='ko'?'언어 선택':language==='ja'?'言語を選択':language==='zh-Hans'?'选择语言':language==='zh-Hant'?'選擇語言':'Choose language');
}
let officialExtraQueued=false;
function officialExtraSchedule(){
  if(officialExtraQueued)return;
  officialExtraQueued=true;
  requestAnimationFrame(()=>{officialExtraQueued=false;officialApplyExtra();});
}
const officialGrid=document.querySelector('#officialBrandGrid');
if(officialGrid)new MutationObserver(officialExtraSchedule).observe(officialGrid,{childList:true});
new MutationObserver(officialExtraSchedule).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
document.querySelectorAll('[data-portal-lang]').forEach(button=>button.addEventListener('click',()=>{setTimeout(officialApplyExtra,20);setTimeout(officialApplyExtra,120);}));
officialApplyExtra();