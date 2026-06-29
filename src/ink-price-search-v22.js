import {
  addColor,addPrice,brandGroups,brandName,clearList,colorById,colorName,copy,currentLang,formatPrice,formatWon,formName,getFavorites,getList,initials,isColorSelected,isPriceSelected,listTotal,matchedGroups,priceFor,priceItemById,removeListItem,seriesName,shareLines,toggleFavorite
} from './ink-catalog-model-v22.js';

let directoryOpen=false;
let query='';

function toast(message){
  let node=document.querySelector('.ink-search-toast');
  if(!node){node=document.createElement('div');node.className='ink-search-toast';node.setAttribute('aria-live','polite');document.body.append(node);}
  node.textContent=message;
  node.style.cssText='position:fixed;left:50%;bottom:82px;z-index:9000;transform:translateX(-50%);padding:10px 14px;border-radius:999px;background:#10233f;color:white;font-size:10px;font-weight:800;box-shadow:0 12px 30px rgba(16,35,63,.3)';
  clearTimeout(toast.timer);toast.timer=setTimeout(()=>node.remove(),2200);
}

function brandMark(group){return`<span class="ink-brand-mark" aria-hidden="true"><svg viewBox="0 0 40 46"><rect x="13" y="2" width="14" height="8" rx="2" fill="#d8c49d"/><path d="M9 10h22c3 0 5 2 5 5v24c0 3-2 5-5 5H9c-3 0-5-2-5-5V15c0-3 2-5 5-5Z" fill="#fff" opacity=".94"/><path d="M7 29h26v9c0 2-2 4-4 4H11c-2 0-4-2-4-4v-9Z" fill="#b58a4b"/></svg><span>${initials(group.brandEn)}</span></span>`;}
function refresh(){renderResults();renderList();}
function handleFavorite(id){toggleFavorite(id);renderResults();}
function handleColor(color){addColor(color);toast(copy().saved);refresh();}
function handlePrice(item,volume){addPrice(item,volume);toast(copy().saved);refresh();}

function colorChip(color){
  const value=copy();
  const selected=isColorSelected(color.id);
  const button=document.createElement('button');
  button.type='button';
  button.className=`ink-color-chip${selected?' is-selected':''}`;
  button.innerHTML=`<span class="ink-color-dot" style="--swatch:${color.hex}"></span><span class="ink-color-copy"><strong>${colorName(color)}</strong><small>${color.nameEn} · ${formName(color)}${color.volume?' '+color.volume:''}</small></span><span class="ink-color-action">${selected?'✓ '+value.selected:'+ '+value.addColor}</span>`;
  button.addEventListener('click',()=>handleColor(color));
  return button;
}

function colorSection(group){
  if(!group.visibleColors.length)return null;
  const value=copy();
  const section=document.createElement('section');
  section.className='ink-brand-colors';
  section.innerHTML=`<div class="ink-brand-section-head"><div><span>ECOUNT COLOR DATA</span><h4>${value.registeredColors}</h4></div><b>${group.visibleColors.length}${value.items}</b></div><div class="ink-color-groups"></div><p class="ink-color-disclaimer">${value.colorDisclaimer}</p>`;
  const root=section.querySelector('.ink-color-groups');
  ['bottle','cartridge'].forEach(form=>{
    const colors=group.visibleColors.filter(color=>color.form===form);
    if(!colors.length)return;
    const block=document.createElement('div');
    block.className='ink-color-group';
    block.innerHTML=`<div class="ink-color-group-title"><strong>${form==='bottle'?value.bottle:value.cartridge}</strong><span>${colors.length}</span></div><div class="ink-color-grid"></div>`;
    block.querySelector('.ink-color-grid').replaceChildren(...colors.map(colorChip));
    root.append(block);
  });
  return section;
}

function priceButton(item,volume){
  const value=copy();
  const selected=isPriceSelected(item.id,volume);
  return`<button type="button" class="ink-series-price${selected?' is-selected':''}" data-volume="${volume}"><span>${volume}</span><strong>${formatPrice(priceFor(item,volume))}</strong><small>${selected?'✓ '+value.selected:value.addPrice}</small></button>`;
}
function priceRow(item){
  const row=document.createElement('div');
  row.className='ink-series-row';
  row.innerHTML=`<div class="ink-series-copy"><strong>${seriesName(item)}</strong><small>${item.productEn}</small></div>${priceButton(item,'5ml')}${priceButton(item,'10ml')}`;
  row.querySelectorAll('.ink-series-price').forEach(button=>button.addEventListener('click',()=>handlePrice(item,button.dataset.volume)));
  return row;
}
function priceSection(group){
  const value=copy();
  const section=document.createElement('section');
  section.className='ink-brand-prices';
  if(!group.visiblePrices.length){section.innerHTML=`<div class="ink-no-price"><strong>${value.noPrice}</strong><span>${value.noPriceBody}</span></div>`;return section;}
  section.innerHTML=`<div class="ink-brand-section-head"><div><span>DECANT PRICE</span><h4>${value.priceSeries}</h4></div><b>${group.visiblePrices.length}${value.seriesCount}</b></div><div class="ink-price-series-list"></div>`;
  section.querySelector('.ink-price-series-list').replaceChildren(...group.visiblePrices.map(priceRow));
  return section;
}
function brandCard(group){
  const value=copy();
  const fav=getFavorites().has(group.id);
  const card=document.createElement('article');
  card.className=`ink-result ink-brand-card${fav?' is-favorite':''}`;
  card.innerHTML=`<div class="ink-brand-head">${brandMark(group)}<div class="ink-brand-copy"><span class="ink-brand-label">${value.brand}</span><h3>${brandName(group)}</h3><p>${group.brandEn}${group.colors.length?` · ${group.colors.length}${value.items}`:''}${group.priceItems.length?` · ${group.priceItems.length}${value.seriesCount}`:''}</p></div><button type="button" class="ink-brand-fav" aria-label="${value.favorite}">${fav?'★':'☆'}</button></div><div class="ink-brand-content"></div>`;
  card.querySelector('.ink-brand-fav').addEventListener('click',()=>handleFavorite(group.id));
  const content=card.querySelector('.ink-brand-content');
  const colors=colorSection(group);
  if(colors)content.append(colors);
  content.append(priceSection(group));
  return card;
}

function renderResults(){
  const root=document.querySelector('.ink-search-results');
  if(!root)return;
  const groups=matchedGroups(query);
  const count=document.querySelector('[data-search-count]');
  if(count)count.textContent=`${groups.length} / ${brandGroups().length}`;
  if(!groups.length){root.innerHTML=`<div class="ink-empty-results"><b>${copy().noTitle}</b>${copy().noBody}</div>`;return;}
  root.replaceChildren(...groups.map(brandCard));
}
function filterByBrand(group){query=currentLang()==='ko'?group.brandKo:group.brandEn;const input=document.querySelector('.ink-brand-search');if(input)input.value=query;renderResults();}
function renderQuick(){
  const root=document.querySelector('.ink-quick-brands');
  if(!root)return;
  const preferred=['OMAS','Sailor','Diamine','Pilot','Pelikan','Platinum'];
  const groups=brandGroups();
  root.replaceChildren(...preferred.map(name=>groups.find(group=>group.brandEn===name)).filter(Boolean).map(group=>{const button=document.createElement('button');button.type='button';button.textContent=brandName(group);button.addEventListener('click',()=>filterByBrand(group));return button;}));
}
function renderDirectory(){
  const toggle=document.querySelector('.ink-directory-toggle');
  const grid=document.querySelector('.ink-directory-grid');
  if(!toggle||!grid)return;
  toggle.textContent=directoryOpen?copy().hide:copy().all;
  grid.hidden=!directoryOpen;
  if(directoryOpen)grid.replaceChildren(...brandGroups().sort((a,b)=>brandName(a).localeCompare(brandName(b))).map(group=>{const button=document.createElement('button');button.type='button';button.textContent=brandName(group);button.addEventListener('click',()=>filterByBrand(group));return button;}));
}

function renderList(){
  const value=copy();
  const root=document.querySelector('.ink-list');
  const items=getList();
  document.querySelectorAll('.ink-list-count').forEach(node=>node.textContent=String(items.length));
  document.querySelectorAll('[data-ink-list-total]').forEach(node=>node.textContent=formatWon(listTotal()));
  if(!root)return;
  if(!items.length){root.innerHTML=`<div class="ink-list-empty">${value.empty}</div>`;return;}
  root.replaceChildren(...items.map((entry,index)=>{
    const row=document.createElement('div');
    row.className='ink-list-item ink-brand-list-item';
    if(entry.type==='color'){
      const color=colorById(entry.colorId);
      row.innerHTML=`<span class="ink-list-color" style="--swatch:${color?.hex||'#888'}"></span><div><b>${color?(currentLang()==='ko'?color.brandKo:color.brandEn)+' · '+colorName(color):entry.colorId}</b><span>${color?formName(color)+(color.volume?' '+color.volume:''):''} · ${value.unknownPrice}</span></div><button type="button" aria-label="${value.remove}">×</button>`;
    }else{
      const item=priceItemById(entry.itemId);
      row.innerHTML=`<span class="ink-list-brand-mark">${item?initials(item.brandEn):'INK'}</span><div><b>${item?(currentLang()==='ko'?item.brandKo:item.brandEn)+' · '+seriesName(item):entry.itemId}</b><span>${entry.volume} · ${formatPrice(entry.price)}</span></div><button type="button" aria-label="${value.remove}">×</button>`;
    }
    row.querySelector('button').addEventListener('click',()=>{removeListItem(index);refresh();});
    return row;
  }));
}

async function shareList(){
  if(!getList().length)return;
  const value=copy();
  const body=`BlueBlack Ink Check List\n${shareLines().join('\n')}\n\n${value.total}: ${formatWon(listTotal())}\n${value.official}`;
  if(navigator.share){try{await navigator.share({title:value.listTitle,text:body});return;}catch{}}
  try{await navigator.clipboard.writeText(body);toast(value.shared);}catch{window.prompt(value.shared,body);}
}
function renderCopy(){
  const value=copy();
  document.querySelector('[data-search-title]').textContent=value.title;
  document.querySelector('[data-search-body]').textContent=value.body;
  document.querySelector('.ink-brand-search').placeholder=value.placeholder;
  document.querySelector('[data-search-label]').textContent=value.count;
  document.querySelector('[data-quick-label]').textContent=value.quick;
  document.querySelector('[data-list-title]').textContent=value.listTitle;
  document.querySelector('[data-list-body]').textContent=value.listBody;
  document.querySelector('[data-list-total-label]').textContent=value.total;
  document.querySelector('.ink-list-share').textContent=value.share;
  document.querySelector('.ink-list-clear').textContent=value.clear;
  document.querySelector('.ink-sticky-list-label').textContent=value.sticky;
}
function renderAll(){renderCopy();renderResults();renderQuick();renderDirectory();renderList();}

function mount(){
  if(document.querySelector('.ink-customer-tools'))return;
  const section=document.createElement('section');
  section.className='ink-customer-tools';
  section.innerHTML=`<article class="ink-search-card"><span class="ink-card-kicker">INK CATALOG</span><h2 data-search-title></h2><p data-search-body></p><div class="ink-search-box"><div class="ink-search-field"><input class="ink-brand-search" type="search" autocomplete="off" spellcheck="false"><button type="button" class="ink-search-clear" aria-label="Clear">×</button></div></div><div class="ink-search-meta"><span><span data-search-label></span> <strong data-search-count></strong></span><span data-quick-label></span></div><div class="ink-quick-brands"></div><div class="ink-search-results"></div><div class="ink-brand-directory"><button type="button" class="ink-directory-toggle"></button><div class="ink-directory-grid" hidden></div></div></article><aside class="ink-list-card"><span class="ink-card-kicker">CHECK LIST</span><h2><span data-list-title></span><span class="ink-list-count">0</span></h2><p data-list-body></p><div class="ink-list-total"><span data-list-total-label></span><strong data-ink-list-total>0원</strong></div><div class="ink-list-toolbar"><button type="button" class="primary ink-list-share"></button><button type="button" class="ink-list-clear"></button></div><div class="ink-list"></div></aside>`;
  document.querySelector('.ink-summary')?.insertAdjacentElement('afterend',section);
  const sticky=document.createElement('button');
  sticky.type='button';sticky.className='ink-sticky-list';sticky.innerHTML='<span class="ink-sticky-list-label"></span><span class="ink-list-count">0</span>';
  document.body.append(sticky);
  sticky.addEventListener('click',()=>document.querySelector('.ink-list-card')?.scrollIntoView({behavior:'smooth',block:'center'}));
  const input=section.querySelector('.ink-brand-search');
  input.addEventListener('input',()=>{query=input.value;renderResults();});
  section.querySelector('.ink-search-clear').addEventListener('click',()=>{query='';input.value='';input.focus();renderResults();});
  section.querySelector('.ink-directory-toggle').addEventListener('click',()=>{directoryOpen=!directoryOpen;renderDirectory();});
  section.querySelector('.ink-list-share').addEventListener('click',shareList);
  section.querySelector('.ink-list-clear').addEventListener('click',()=>{if(getList().length&&confirm(copy().clearConfirm)){clearList();refresh();}});
  renderAll();
}

for(const [href,key] of [['../ink-price/ink-search.css','base'],['../ink-price/ink-brand-catalog-v21.css','brand'],['../ink-price/ink-inventory-colors-v22.css','colors']]){
  if(!document.querySelector(`link[data-ink-style="${key}"]`)){const link=document.createElement('link');link.rel='stylesheet';link.href=new URL(href,import.meta.url).href;link.dataset.inkStyle=key;document.head.append(link);}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();