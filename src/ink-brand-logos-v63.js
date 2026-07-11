const BRAND_META=[
  {keys:['sailor','세일러'],label:'SAILOR',country:'JP',tone:'navy',image:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Sailor%20pen%20co%20logo.png'},
  {keys:['pilot','파이롯트','파일럿'],label:'PILOT',country:'JP',tone:'blue',image:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Pilot%20pen%20co%20logo.svg'},
  {keys:['pelikan','펠리칸'],label:'PELIKAN',country:'DE',tone:'green',image:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Pelikan-Logo.svg'},
  {keys:['lamy','라미'],label:'LAMY',country:'DE',tone:'black',image:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Lamy%20Logo.svg'},
  {keys:['platinum','플래티넘'],label:'PLATINUM',country:'JP',tone:'black'},
  {keys:['diamine','디아민'],label:'DIAMINE',country:'UK',tone:'purple'},
  {keys:['dominantindustry','dominant industry','도미넌트인더스트리','도미넌트 인더스트리'],label:'DOMINANT INDUSTRY',country:'KR',tone:'gold'},
  {keys:['wearingeul','글입다'],label:'Wearingeul',country:'KR',tone:'burgundy'},
  {keys:['lennontoolbar','lennon tool bar','레논툴바','레논 툴바'],label:'Lennon Tool Bar',country:'TW',tone:'teal'},
  {keys:['ferriswheelpress','ferris wheel press','페리스휠프레스','페리스 휠 프레스'],label:'FERRIS WHEEL PRESS',country:'CA',tone:'blue'},
  {keys:['colorverse','컬러버스'],label:'COLORVERSE',country:'KR',tone:'violet'},
  {keys:['jherbin','j. herbin','제이허빈','제이 허빈'],label:'J. HERBIN',country:'FR',tone:'red'},
  {keys:['jacquesherbin','jacques herbin','자끄허빈','자끄 허빈'],label:'JACQUES HERBIN',country:'FR',tone:'red'},
  {keys:['robertoster','robert oster','로버트오스터','로버트 오스터'],label:'ROBERT OSTER',country:'AU',tone:'blue'},
  {keys:['monteverde','몬테베르데'],label:'MONTEVERDE',country:'US',tone:'green'},
  {keys:['kaweco','카웨코'],label:'Kaweco',country:'DE',tone:'black'},
  {keys:['waterman','워터맨'],label:'WATERMAN',country:'FR',tone:'blue'},
  {keys:['parker','파카'],label:'PARKER',country:'UK',tone:'black'},
  {keys:['aurora','오로라'],label:'AURORA',country:'IT',tone:'black'},
  {keys:['visconti','비스콘티'],label:'VISCONTI',country:'IT',tone:'black'},
  {keys:['noodlers','noodler’s','noodler\'s','누들러스'],label:"NOODLER'S",country:'US',tone:'black'},
  {keys:['vinta','빈타'],label:'VINTA',country:'PH',tone:'gold'},
  {keys:['inkinstitute','ink institute','잉크인스티튜트','잉크 인스티튜트'],label:'INK INSTITUTE',country:'TW',tone:'teal'},
  {keys:['3oysters','3 oysters','쓰리오','3오이스터스'],label:'3 OYSTERS',country:'KR',tone:'blue'}
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
  return{label:String(name||'INK').trim(),country:'',tone:'navy'};
}
function logoMarkup(name,size='normal'){
  const meta=metaFor(name);
  const image=meta.image?`<img src="${meta.image}" alt="" loading="${size==='quick'?'eager':'lazy'}" decoding="async" referrerpolicy="no-referrer">`:'';
  return`<span class="ink-brand-logo ink-brand-logo-${size} tone-${meta.tone}" data-ink-brand-logo aria-hidden="true">${image}<span class="ink-brand-logo-fallback">${initials(meta.label)}</span></span>`;
}
function bindImageFallback(root=document){
  root.querySelectorAll('.ink-brand-logo img:not([data-bound])').forEach(image=>{
    image.dataset.bound='true';
    image.addEventListener('load',()=>image.closest('.ink-brand-logo')?.classList.add('has-image'));
    image.addEventListener('error',()=>image.closest('.ink-brand-logo')?.classList.add('image-failed'));
    if(image.complete&&image.naturalWidth>0)image.closest('.ink-brand-logo')?.classList.add('has-image');
  });
}
function enhanceQuick(root=document){
  root.querySelectorAll('.ink-store-quick button[data-brand]:not([data-logo-ready])').forEach(button=>{
    const name=button.dataset.brand||button.textContent.trim();
    const meta=metaFor(name);
    button.dataset.logoReady='true';
    button.title=meta.label;
    button.innerHTML=`${logoMarkup(name,'quick')}<span class="ink-brand-card-name">${meta.label}</span>${meta.country?`<small>${meta.country}</small>`:''}`;
  });
}
function enhanceResults(root=document){
  root.querySelectorAll('.ink-store-result .ink-store-brand:not([data-logo-ready])').forEach(label=>{
    const name=label.textContent.trim();
    const meta=metaFor(name);
    label.dataset.logoReady='true';
    label.innerHTML=`${logoMarkup(name,'result')}<span><b>${meta.label}</b>${meta.country?`<small>${meta.country}</small>`:''}</span>`;
  });
}
function enhanceCart(root=document){
  root.querySelectorAll('.ink-store-cart-main>b:not([data-logo-ready])').forEach(label=>{
    const full=label.textContent.trim();
    const brand=full.split('·')[0]?.trim()||full;
    label.dataset.logoReady='true';
    label.innerHTML=`${logoMarkup(brand,'mini')}<span>${full}</span>`;
  });
  root.querySelectorAll('.ink-store-dialog-list b:not([data-logo-ready])').forEach(label=>{
    const full=label.textContent.trim();
    const brand=full.split('·')[0]?.trim()||full;
    label.dataset.logoReady='true';
    label.innerHTML=`${logoMarkup(brand,'mini')}<span>${full}</span>`;
  });
}
function addGuideNote(){
  const head=document.querySelector('.ink-store-quick-head');
  if(!head||head.querySelector('.ink-brand-guide-note'))return;
  const note=document.createElement('small');
  note.className='ink-brand-guide-note';
  note.textContent=document.documentElement.lang?.startsWith('ko')?'로고를 누르면 해당 브랜드만 바로 볼 수 있어요.':'Tap a logo to view that brand.';
  head.querySelector('span')?.after(note);
}
function syncCurrent(){
  const input=document.querySelector('.ink-store-search');
  const value=normalize(input?.value||'');
  document.querySelectorAll('.ink-store-quick button[data-brand]').forEach(button=>{
    const active=value&&value===normalize(button.dataset.brand);
    button.classList.toggle('is-current',Boolean(active));
    button.setAttribute('aria-pressed',String(Boolean(active)));
  });
}
function enhance(){
  enhanceQuick();
  enhanceResults();
  enhanceCart();
  addGuideNote();
  bindImageFallback();
  syncCurrent();
}
function init(){
  const app=document.querySelector('#ink-store-app');
  if(!app)return;
  enhance();
  new MutationObserver(()=>requestAnimationFrame(enhance)).observe(app,{childList:true,subtree:true});
  document.addEventListener('input',event=>{if(event.target.matches('.ink-store-search'))syncCurrent()});
  document.addEventListener('click',event=>{if(event.target.closest('.ink-store-quick button'))setTimeout(syncCurrent,20)});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
