const BRAND_META=[
  {keys:['3oysters','3 oysters','3오이스터스','쓰리오이스터스'],search:'3 Oysters',label:'3·OYSTERS',ko:'3오이스터스',country:'KR',tone:'navy'},
  {keys:['iwi','아이더블유아이'],search:'IWI',label:'IWI',ko:'IWI',country:'TW',tone:'blue',image:'https://static.wixstatic.com/media/00ae17_9ce33891036248fb9c041d48c70e48a8~mv2.png/v1/crop/x_0,y_13,w_231,h_210/fill/w_182,h_164,al_c,q_90/icon_iwi%20logo.png',site:'https://www.iwic.com/'},
  {keys:['kyotoink','kyoto ink','교토','교토잉크'],search:'Kyoto Ink',label:'KYOTO TAG',ko:'교토',country:'JP',tone:'burgundy',site:'https://www.tagstationery.jp/'},
  {keys:['grafvonfabercastell','graf von faber-castell','그라폰파버카스텔','그라폰 파버카스텔'],search:'Graf von Faber-Castell',label:'GRAF VON FABER-CASTELL',ko:'그라폰 파버카스텔',country:'DE',tone:'green',site:'https://www.graf-von-faber-castell.com/'},
  {keys:['noodlers','noodler’s','noodler\'s','누들러스'],search:"Noodler's",label:"NOODLER'S",ko:'누들러스',country:'US',tone:'black',site:'https://noodlersink.com/'},
  {keys:['dominantindustry','dominant industry','도미넌트인더스트리','도미넌트 인더스트리'],search:'Dominant Industry',label:'DOMINANT INDUSTRY',ko:'도미넌트 인더스트리',country:'KR',tone:'gold',site:'https://dominantindustry.com/'},
  {keys:['diamine','디아민'],search:'Diamine',label:'DIAMINE',ko:'디아민',country:'UK',tone:'purple',site:'https://www.diamineinks.co.uk/'},
  {keys:['inkvent','잉크벤트'],search:'Inkvent',label:'INKVENT',ko:'잉크벤트',country:'UK',tone:'purple',site:'https://www.diamineinks.co.uk/'},
  {keys:['lamy','라미'],search:'LAMY',label:'LAMY',ko:'라미',country:'DE',tone:'black',image:'https://a.storyblok.com/f/302549/378x87/fa8f9a5c70/lamy-logo.svg/m/500x',site:'https://www.lamy.com/'},
  {keys:['laban','라반'],search:'Laban',label:'LABAN',ko:'라반',country:'TW',tone:'gold',site:'https://laban.com/'},
  {keys:['lennontoolbar','lennon tool bar','레논툴바','레논 툴바'],search:'Lennon Tool Bar',label:'Lennon Tool Bar',ko:'레논툴바',country:'TW',tone:'teal',site:'https://www.lennontoolbar.com/'},
  {keys:['robertoster','robert oster','로버트오스터','로버트 오스터'],search:'Robert Oster',label:'ROBERT OSTER',ko:'로버트 오스터',country:'AU',tone:'blue',site:'https://robertoster.com/'},
  {keys:['monteverde','몬테베르데'],search:'Monteverde',label:'MONTEVERDE',ko:'몬테베르데',country:'US',tone:'green',site:'https://monteverdepens.com/'},
  {keys:['visconti','비스콘티'],search:'Visconti',label:'VISCONTI',ko:'비스콘티',country:'IT',tone:'black',site:'https://www.visconti.it/'},
  {keys:['vinta','빈타'],search:'Vinta',label:'VINTA INKS',ko:'빈타',country:'PH',tone:'gold',site:'https://vintainks.com/'},
  {keys:['sailor','세일러'],search:'Sailor',label:'SAILOR',ko:'세일러',country:'JP',tone:'navy',image:'https://sailor.co.jp/wp-content/themes/sailor-wordpress/img/header/HeaderMainMenu__logo.png',site:'https://sailor.co.jp/',forceDark:true,plate:'contrast'},
  {keys:['super5','수퍼5','슈퍼5'],search:'Super5',label:'SUPER5',ko:'수퍼5',country:'DE',tone:'red',site:'https://www.rohrer-klingner.de/'},
  {keys:['sheaffer','쉐퍼','셰퍼'],search:'Sheaffer',label:'SHEAFFER',ko:'쉐퍼',country:'US',tone:'black',site:'https://sheaffer.com/'},
  {keys:['aurora','오로라'],search:'Aurora',label:'AURORA',ko:'오로라',country:'IT',tone:'black',site:'https://www.aurorapen.it/'},
  {keys:['waterman','워터맨'],search:'Waterman',label:'WATERMAN',ko:'워터맨',country:'FR',tone:'blue',site:'https://www.waterman.com/'},
  {keys:['inkinstitute','ink institute','잉크인스티튜트','잉크 인스티튜트'],search:'Ink Institute',label:'INK INSTITUTE',ko:'잉크 인스티튜트',country:'TW',tone:'teal',site:'https://ink-institute.com/'},
  {keys:['inkhouse','ink house','잉크하우스','잉크 하우스'],search:'Ink House',label:'INK HOUSE',ko:'잉크하우스',country:'HK',tone:'black',image:'https://images.squarespace-cdn.com/content/v1/638367b05ddb8e3232ffb349/3e70c454-acfd-4bc0-99f8-1465c5c3eb50/Ink%2BHouse%2B-%2BLogo.png',site:'https://ink-house.com/',forceDark:true,plate:'contrast'},
  {keys:['jacquesherbin','jacques herbin','자끄허빈','자끄 허빈','쟈크에르뱅','쟈크 에르뱅'],search:'Jacques Herbin',label:'JACQUES HERBIN',ko:'쟈크 에르뱅',country:'FR',tone:'red',site:'https://www.jacquesherbin.com/'},
  {keys:['jherbin','j. herbin','제이허빈','제이 허빈','제이에르뱅','제이 에르뱅'],search:'J. Herbin',label:'J. HERBIN',ko:'제이 에르뱅',country:'FR',tone:'red',site:'https://www.jacquesherbin.com/'},
  {keys:['kaweco','카웨코'],search:'Kaweco',label:'Kaweco',ko:'카웨코',country:'DE',tone:'black',site:'https://www.kaweco-pen.com/'},
  {keys:['kakimori','카키모리'],search:'Kakimori',label:'KAKIMORI',ko:'카키모리',country:'JP',tone:'navy',site:'https://kakimori.com/'},
  {keys:['conklin','콘클린'],search:'Conklin',label:'CONKLIN',ko:'콘클린',country:'US',tone:'gold',site:'https://conklinpens.com/'},
  {keys:['fabercastell','faber-castell','파버카스텔','파버 카스텔'],search:'Faber-Castell',label:'FABER-CASTELL',ko:'파버카스텔',country:'DE',tone:'green',site:'https://www.faber-castell.com/'},
  {keys:['pilot','파이롯트','파일럿'],search:'Pilot',label:'PILOT',ko:'파이롯트',country:'JP',tone:'blue',image:'https://www.pilot.co.jp/asset_new2026/image/common/header_01.svg',site:'https://www.pilot.co.jp/'},
  {keys:['parker','파카'],search:'Parker',label:'PARKER',ko:'파카',country:'UK',tone:'black',site:'https://www.parkerpen.com/'},
  {keys:['ferriswheelpress','ferris wheel press','페리스휠프레스','페리스 휠 프레스'],search:'Ferris Wheel Press',label:'FERRIS WHEEL PRESS',ko:'페리스 휠 프레스',country:'CA',tone:'blue',site:'https://ferriswheelpress.com/'},
  {keys:['pelikan','펠리칸'],search:'Pelikan',label:'PELIKAN',ko:'펠리칸',country:'DE',tone:'green',image:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Pelikan-Logo.svg',site:'https://www.pelikan.com/'},
  {keys:['platinum','플래티넘'],search:'Platinum',label:'PLATINUM',ko:'플래티넘',country:'JP',tone:'black',image:'https://www.platinum-pen.co.jp/common/img/parts/logo.svg',site:'https://www.platinum-pen.co.jp/',forceDark:true,plate:'contrast'}
];

const normalize=value=>String(value||'').toLowerCase().normalize('NFKC').replace(/[\s._&()\-·'’]/g,'');
const byKey=new Map();
for(const item of BRAND_META)for(const key of item.keys)byKey.set(normalize(key),item);

function initials(name='INK'){
  const words=String(name).replace(/[.']/g,' ').trim().split(/\s+/).filter(Boolean);
  return words.map(word=>word[0]).join('').slice(0,3).toUpperCase()||'INK';
}
function metaFor(name=''){
  const key=normalize(name);
  if(byKey.has(key))return byKey.get(key);
  for(const [candidate,meta] of byKey)if(key.includes(candidate)||candidate.includes(key))return meta;
  return{search:String(name||'INK').trim(),label:String(name||'INK').trim(),ko:String(name||'INK').trim(),country:'',tone:'navy'};
}
function siteIcon(site=''){
  return site?`https://www.google.com/s2/favicons?sz=128&domain_url=${encodeURIComponent(site)}`:'';
}
function logoMarkup(name,size='normal'){
  const meta=metaFor(name);
  const primary=meta.image||siteIcon(meta.site);
  const fallback=meta.image&&meta.site?siteIcon(meta.site):'';
  const word=size==='quick'?meta.label:initials(meta.label);
  const classes=['ink-brand-logo',`ink-brand-logo-${size}`,`tone-${meta.tone}`,`plate-${meta.plate||'light'}`];
  if(meta.forceDark)classes.push('force-dark');
  const image=primary?`<img src="${primary}" data-fallback-src="${fallback}" alt="" loading="${size==='quick'?'eager':'lazy'}" decoding="async" referrerpolicy="no-referrer">`:'';
  return`<span class="${classes.join(' ')}" data-ink-brand-logo data-brand-key="${normalize(meta.search)}" aria-hidden="true">${image}<span class="ink-brand-logo-fallback">${word}</span></span>`;
}
function bindImageFallback(root=document){
  root.querySelectorAll('.ink-brand-logo img:not([data-bound])').forEach(image=>{
    image.dataset.bound='true';
    image.addEventListener('load',()=>image.closest('.ink-brand-logo')?.classList.add('has-image'));
    image.addEventListener('error',()=>{
      const fallback=image.dataset.fallbackSrc||'';
      if(fallback&&!image.dataset.fallbackTried){image.dataset.fallbackTried='true';image.src=fallback;return;}
      image.closest('.ink-brand-logo')?.classList.add('image-failed');
    });
    if(image.complete&&image.naturalWidth>0)image.closest('.ink-brand-logo')?.classList.add('has-image');
  });
}
function renderBrandDirectory(){
  const root=document.querySelector('.ink-store-quick');
  if(!root)return;
  const complete=root.querySelectorAll('[data-brand-card-v65]').length===BRAND_META.length;
  if(!complete){
    root.innerHTML=BRAND_META.map(meta=>`<button type="button" data-brand-card-v65 data-brand="${meta.search}" title="${meta.label}" aria-pressed="false">${logoMarkup(meta.search,'quick')}<span class="ink-brand-card-name">${meta.label}</span><small>${meta.country}</small></button>`).join('');
  }
  if(!root.dataset.directoryBound){
    root.dataset.directoryBound='true';
    root.addEventListener('click',event=>{
      const button=event.target.closest('button[data-brand]');if(!button)return;
      const input=document.querySelector('.ink-store-search');if(!input)return;
      input.value=button.dataset.brand||'';
      input.dispatchEvent(new Event('input',{bubbles:true}));
      input.focus();
      setTimeout(syncCurrent,20);
    });
  }
}
function enhanceResults(root=document){
  root.querySelectorAll('.ink-store-result .ink-store-brand:not([data-logo-ready])').forEach(label=>{
    const name=label.textContent.trim();const meta=metaFor(name);
    label.dataset.logoReady='true';
    label.innerHTML=`${logoMarkup(name,'result')}<span><b>${meta.label}</b>${meta.country?`<small>${meta.country}</small>`:''}</span>`;
  });
}
function enhanceCart(root=document){
  root.querySelectorAll('.ink-store-cart-main>b:not([data-logo-ready]),.ink-store-dialog-list b:not([data-logo-ready])').forEach(label=>{
    const full=label.textContent.trim();const brand=full.split('·')[0]?.trim()||full;
    label.dataset.logoReady='true';label.innerHTML=`${logoMarkup(brand,'mini')}<span>${full}</span>`;
  });
}
function addGuideNote(){
  const head=document.querySelector('.ink-store-quick-head');if(!head)return;
  let note=head.querySelector('.ink-brand-guide-note');if(!note){note=document.createElement('small');note.className='ink-brand-guide-note';head.querySelector('span')?.after(note);}
  note.textContent=document.documentElement.lang?.startsWith('ko')?`소분 가능한 ${BRAND_META.length}개 브랜드입니다. 로고를 누르면 해당 브랜드만 볼 수 있어요.`:`${BRAND_META.length} decant brands. Tap a logo to filter.`;
  const title=head.querySelector('[data-store-quick]');if(title&&document.documentElement.lang?.startsWith('ko'))title.textContent='브랜드 선택';
}
function syncCurrent(){
  const value=normalize(document.querySelector('.ink-store-search')?.value||'');
  document.querySelectorAll('.ink-store-quick button[data-brand]').forEach(button=>{
    const meta=metaFor(button.dataset.brand||'');
    const active=Boolean(value)&&[meta.search,meta.ko,meta.label,...meta.keys].some(key=>normalize(key)===value);
    button.classList.toggle('is-current',active);button.setAttribute('aria-pressed',String(active));
  });
}
function enhance(){renderBrandDirectory();enhanceResults();enhanceCart();addGuideNote();bindImageFallback();syncCurrent();}
function init(){
  const app=document.querySelector('#ink-store-app');if(!app)return;
  enhance();new MutationObserver(()=>requestAnimationFrame(enhance)).observe(app,{childList:true,subtree:true});
  document.addEventListener('input',event=>{if(event.target.matches('.ink-store-search'))syncCurrent()});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
