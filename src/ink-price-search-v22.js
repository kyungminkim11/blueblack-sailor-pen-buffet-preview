import {
  COUNTRY_KEYS,TYPE_KEYS,addColor,addColorPrice,addPrice,allColors,brandGroups,brandName,clearList,colorById,colorName,colorProductUrl,copy,currentLang,formatPrice,formatWon,formName,getFavorites,getList,groupCountryKey,initials,isColorPriceSelected,isColorSelected,isPriceSelected,itemTypeKeys,listTotal,matchedGroups,normalize,priceFor,priceItemById,priceItemForColor,removeListItem,seriesName,shareLines,toggleFavorite
} from './ink-catalog-model-v22.js';

let directoryOpen=false;
let query='';
let countryFilter='all';
let typeFilter='all';

function toast(message){
  let node=document.querySelector('.ink-search-toast');
  if(!node){node=document.createElement('div');node.className='ink-search-toast';node.setAttribute('aria-live','polite');document.body.append(node);}
  node.textContent=message;
  node.style.cssText='position:fixed;left:50%;bottom:82px;z-index:9000;transform:translateX(-50%);padding:10px 14px;border-radius:999px;background:#10233f;color:white;font-size:10px;font-weight:800;box-shadow:0 12px 30px rgba(16,35,63,.3)';
  clearTimeout(toast.timer);toast.timer=setTimeout(()=>node.remove(),2200);
}

function brandMark(group){return`<span class="ink-brand-mark" aria-hidden="true"><svg viewBox="0 0 40 46"><rect x="13" y="2" width="14" height="8" rx="2" fill="#d8c49d"/><path d="M9 10h22c3 0 5 2 5 5v24c0 3-2 5-5 5H9c-3 0-5-2-5-5V15c0-3 2-5 5-5Z" fill="#fff" opacity=".94"/><path d="M7 29h26v9c0 2-2 4-4 4H11c-2 0-4-2-4-4v-9Z" fill="#b58a4b"/></svg><span>${initials(group.brandEn)}</span></span>`;}
function colorVisual(color,small=false){
  const classes=`ink-color-image${small?' is-small':''}${color.image?'':' is-swatch'}`;
  if(color.image)return`<span class="${classes}"><img src="${color.image}" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer"><i style="--swatch:${color.hex||'#d8d2c8'}"></i></span>`;
  return`<span class="${classes}"><i style="--swatch:${color.hex||'#d8d2c8'}"></i></span>`;
}
function colorShopLink(color,label){
  const value=copy();
  return`<a class="ink-color-shop-link" href="${colorProductUrl(color)}" target="_blank" rel="noopener noreferrer">${label||value.shopLink||'상품 보기'}</a>`;
}
function labelFrom(map,key){return(map&&map[key])||key;}
function countryLabel(key){return key==='all'?copy().allFilter:labelFrom(copy().countryNames,key);}
function typeLabel(key){return key==='all'?copy().allFilter:labelFrom(copy().typeNames,key);}
function decantGroups(){return brandGroups().filter(group=>group.priceItems.length);}
function groupHasType(group,key){return key==='all'||group.priceItems.some(item=>itemTypeKeys(item).includes(key));}
function groupMatchesCurrentFilters(group){return(countryFilter==='all'||groupCountryKey(group)===countryFilter)&&groupHasType(group,typeFilter);}
function applyFilters(groups){
  return groups.map(group=>{
    if(countryFilter!=='all'&&groupCountryKey(group)!==countryFilter)return null;
    let visiblePrices=group.visiblePrices;
    let visibleColors=group.visibleColors;
    if(typeFilter!=='all'){
      visiblePrices=visiblePrices.filter(item=>itemTypeKeys(item).includes(typeFilter));
      const ids=new Set(visiblePrices.map(item=>item.id));
      visibleColors=visibleColors.filter(color=>ids.has(priceItemForColor(color,group)?.id));
    }
    if(!visiblePrices.length&&!visibleColors.length)return null;
    return{...group,visiblePrices,visibleColors};
  }).filter(Boolean);
}
function detailDialog(){
  let dialog=document.querySelector('.ink-detail-dialog');
  if(dialog)return dialog;
  dialog=document.createElement('dialog');
  dialog.className='ink-detail-dialog';
  dialog.innerHTML='<div class="ink-detail-shell"><button type="button" class="ink-detail-close" aria-label="Close">×</button><div class="ink-detail-body"></div></div>';
  document.body.append(dialog);
  dialog.querySelector('.ink-detail-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
  return dialog;
}
function detailPriceButtons(item,color){
  const value=copy();
  return`<div class="ink-detail-actions"><button type="button" data-detail-volume="5ml"><span>5ml</span><strong>${formatPrice(priceFor(item,'5ml'))}</strong></button><button type="button" data-detail-volume="10ml"><span>10ml</span><strong>${formatPrice(priceFor(item,'10ml'))}</strong></button></div><p>${value.detailNotice}</p>`;
}
function openSeriesDetail(item,group){
  const value=copy();
  const dialog=detailDialog();
  const colors=colorsForPriceItem(item,group);
  const country=countryLabel(groupCountryKey(group));
  const types=itemTypeKeys(item).map(typeLabel).join(' · ');
  dialog.querySelector('.ink-detail-body').innerHTML=`<span class="ink-card-kicker">INK DETAIL</span><h2>${brandName(group)} · ${seriesName(item)}</h2><div class="ink-detail-meta"><span>${country}</span><span>${types}</span><span>5ml ${formatPrice(priceFor(item,'5ml'))}</span><span>10ml ${formatPrice(priceFor(item,'10ml'))}</span></div><p>${value.seriesDetailIntro}</p><dl><div><dt>${value.detailCountry}</dt><dd>${country}</dd></div><div><dt>${value.detailType}</dt><dd>${types}</dd></div><div><dt>${value.detailColors}</dt><dd>${colors.length?colors.length+value.items:value.priceNoColors}</dd></div></dl>${colors.length?`<div class="ink-detail-color-list">${colors.slice(0,24).map(color=>`<a href="${colorProductUrl(color)}" target="_blank" rel="noopener noreferrer"><i style="--swatch:${color.hex||'#d8d2c8'}"></i><span>${colorName(color)}</span></a>`).join('')}</div>`:''}<p>${value.seriesDetailColorHelp}</p>`;
  if(!dialog.open)dialog.showModal();
}
function openColorDetail(color,item,group){
  const value=copy();
  const dialog=detailDialog();
  const country=countryLabel(groupCountryKey(group));
  const types=item?itemTypeKeys(item).map(typeLabel).join(' · '):value.colorNeedsCheck;
  dialog.querySelector('.ink-detail-body').innerHTML=`<span class="ink-card-kicker">COLOR DETAIL</span><div class="ink-detail-color-head">${colorVisual(color)}<div><h2>${colorName(color)}</h2><p>${brandName(group)}${item?' · '+seriesName(item):''}</p></div></div><div class="ink-detail-meta"><span>${country}</span><span>${types}</span><span>${formName(color)}${color.volume?' '+color.volume:''}</span></div><p>${value.colorDetailIntro}</p><dl><div><dt>${value.detailCountry}</dt><dd>${country}</dd></div><div><dt>${value.detailType}</dt><dd>${types}</dd></div><div><dt>${value.detailSource}</dt><dd>${color.productTitle||color.nameEn||colorName(color)}</dd></div></dl>${colorShopLink(color)}${item?detailPriceButtons(item,color):`<p>${value.colorNeedsCheck}</p>`}`;
  dialog.querySelectorAll('[data-detail-volume]').forEach(button=>button.addEventListener('click',()=>{addColorPrice(color,item,button.dataset.detailVolume);toast(value.saved);dialog.close();refresh();}));
  if(!dialog.open)dialog.showModal();
}
function refresh(){renderResults();renderList();}
function saveColor(color){addColor(color);toast(copy().saved);refresh();}
function saveColorPrice(color,item,volume){addColorPrice(color,item,volume);toast(copy().saved);refresh();}
function saveSeriesPrice(item,volume,colorValue=''){addPrice(item,volume,colorValue);toast(copy().saved);refresh();}

function colorPriceButton(color,item,volume){
  const value=copy();
  const selected=isColorPriceSelected(color.id,volume,item.id);
  return`<button type="button" class="ink-color-price${selected?' is-selected':''}" data-volume="${volume}"><span>${volume}</span><strong>${formatPrice(priceFor(item,volume))}</strong><small>${selected?'✓ '+value.selected:value.addPrice}</small></button>`;
}
function colorCard(color,group){
  const value=copy();
  const item=priceItemForColor(color,group);
  const selected=isColorSelected(color.id);
  const card=document.createElement('article');
  card.className=`ink-color-chip${selected?' is-selected':''}`;
  const priceArea=item
    ? `<div class="ink-color-price-grid">${colorPriceButton(color,item,'5ml')}${colorPriceButton(color,item,'10ml')}</div><span class="ink-color-series">${seriesName(item)}</span>`
    : `<button type="button" class="ink-color-add${selected?' is-selected':''}">${selected?'✓ '+value.selected:'+ '+value.addColor}</button><span class="ink-color-series is-unpriced">${value.unknownPrice}</span>`;
  card.innerHTML=`<a class="ink-color-image-link" href="${colorProductUrl(color)}" target="_blank" rel="noopener noreferrer">${colorVisual(color)}</a><div class="ink-color-copy"><a href="${colorProductUrl(color)}" target="_blank" rel="noopener noreferrer"><strong>${colorName(color)}</strong><small>${color.nameEn||color.productTitle||colorName(color)} · ${formName(color)}${color.volume?' '+color.volume:''}</small></a></div>${priceArea}`;
  if(item){card.querySelectorAll('.ink-color-price').forEach(button=>button.addEventListener('click',()=>saveColorPrice(color,item,button.dataset.volume)));}
  else card.querySelector('.ink-color-add').addEventListener('click',()=>saveColor(color));
  return card;
}

function colorSection(group){
  if(!group.visibleColors.length)return null;
  const value=copy();
  const section=document.createElement('section');
  section.className='ink-brand-colors';
  section.innerHTML=`<div class="ink-brand-section-head"><div><span>STORE COLOR DATA</span><h4>${value.registeredColors}</h4></div><b>${group.visibleColors.length}${value.items}</b></div><div class="ink-color-groups"></div><p class="ink-color-disclaimer">${value.colorDisclaimer}</p>`;
  const root=section.querySelector('.ink-color-groups');
  ['bottle'].forEach(form=>{
    const colors=group.visibleColors.filter(color=>color.form===form);
    if(!colors.length)return;
    const block=document.createElement('div');
    block.className='ink-color-group';
    block.innerHTML=`<div class="ink-color-group-title"><strong>${form==='bottle'?value.bottle:value.cartridge}</strong><span>${colors.length}</span></div><div class="ink-color-grid"></div>`;
    block.querySelector('.ink-color-grid').replaceChildren(...colors.map(color=>colorCard(color,group)));
    root.append(block);
  });
  return section;
}

function seriesPriceButton(item,volume){
  const value=copy();
  const selected=isPriceSelected(item.id,volume);
  return`<button type="button" class="ink-series-price is-${volume.toLowerCase()}${selected?' is-selected':''}" data-volume="${volume}"><span>${volume}</span><strong>${formatPrice(priceFor(item,volume))}</strong><small>${selected?'✓ '+value.selected:value.addPrice}</small></button>`;
}
function seriesColorEntry(){
  const value=copy();
  return`<label class="ink-series-color-entry"><span>${value.colorEntryLabel}</span><input type="text" class="ink-series-color-input" autocomplete="off" spellcheck="false" placeholder="${value.colorEntryPlaceholder}"></label><div class="ink-series-color-suggestions" hidden></div>`;
}
function colorsForPriceItem(item,group){
  return group.colors.filter(color=>priceItemForColor(color,group)?.id===item.id);
}
function colorSearchText(color){return normalize([color.brandKo,color.brandEn,color.nameKo,color.nameEn,color.nameJa,color.nameZhHans,color.nameZhHant,color.productTitle||''].join(' '));}
function colorSuggestionScore(color,item,group,term){
  const haystack=colorSearchText(color);
  const value=normalize(term);
  const sameBrand=normalize(color.brandEn||color.brandKo)===normalize(group.brandEn||group.brandKo);
  const sameSeries=priceItemForColor(color,group)?.id===item.id||color.priceItemId===item.id;
  if(value&&!haystack.includes(value))return -1;
  return(sameSeries?80:0)+(sameBrand?35:0)+(normalize(colorName(color)).startsWith(value)?20:0)+(color.productUrl?4:0);
}
function manualColorSuggestions(item,group,term){
  const pool=new Map();
  const brandKey=normalize(group.brandEn||group.brandKo);
  [...group.colors,...allColors().filter(color=>normalize(color.brandEn||color.brandKo)===brandKey)].forEach(color=>pool.set(color.id,color));
  return[...pool.values()]
    .map(color=>({color,score:colorSuggestionScore(color,item,group,term)}))
    .filter(entry=>entry.score>=0)
    .sort((a,b)=>b.score-a.score||colorName(a.color).localeCompare(colorName(b.color)))
    .slice(0,8)
    .map(entry=>entry.color);
}
function renderManualColorSuggestions(row,item,group,term=''){
  const root=row.querySelector('.ink-series-color-suggestions');
  if(!root)return;
  const colors=manualColorSuggestions(item,group,term);
  if(!colors.length){root.hidden=true;root.innerHTML='';return;}
  const value=copy();
  root.hidden=false;
  root.replaceChildren(...colors.map(color=>{
    const button=document.createElement('button');
    button.type='button';
    button.className='ink-series-color-suggestion';
    button.dataset.colorId=color.id;
    button.innerHTML=`<i style="--swatch:${color.hex||'#d8d2c8'}"></i><span><strong>${colorName(color)}</strong><small>${color.brandKo||color.brandEn}${color.productTitle?' · '+color.productTitle:''}</small></span><b>${value.selectColor||'선택'}</b>`;
    button.addEventListener('click',()=>{
      row.dataset.selectedColorId=color.id;
      const input=row.querySelector('.ink-series-color-input');
      if(input)input.value=colorName(color);
      root.querySelectorAll('.ink-series-color-suggestion').forEach(node=>node.classList.toggle('is-selected',node===button));
    });
    return button;
  }));
}
function seriesColorPicker(item,group,colors=colorsForPriceItem(item,group)){
  const value=copy();
  if(!colors.length)return`<details class="ink-series-colors is-empty is-manual"><summary class="ink-series-picker-head"><span>${value.priceNoColors}</span><small>${value.priceNoColorsBody}</small></summary>${seriesColorEntry()}</details>`;
  return`<details class="ink-series-colors"><summary class="ink-series-picker-head"><span>${value.colorPickerLabel}</span><small>${colors.length}${value.items} · ${value.colorPickerHelp}</small></summary><div class="ink-series-color-choices">${colors.map(color=>`<div class="ink-series-color-choice" data-color-id="${color.id}"><button type="button" class="ink-series-color-select" data-color-id="${color.id}" aria-pressed="false"><i style="--swatch:${color.hex||'#d8d2c8'}"></i><span>${value.selectColor||'선택'}</span></button><a class="ink-series-color-link" href="${colorProductUrl(color)}" target="_blank" rel="noopener noreferrer"><strong>${colorName(color)}</strong><small>${value.shopLink||'상품 보기'}</small></a></div>`).join('')}</div></details>`;
}
function priceRow(item,group){
  const colors=colorsForPriceItem(item,group);
  const row=document.createElement('div');
  row.className=`ink-series-row${colors.length?' has-color-picker':' is-manual-color'}`;
  row.innerHTML=`<button type="button" class="ink-series-copy ink-series-detail-trigger"><strong>${seriesName(item)}</strong><small>${item.productEn}</small><em>${copy().detail}</em></button>${seriesPriceButton(item,'5ml')}${seriesPriceButton(item,'10ml')}${colors.length?'<input type="hidden" class="ink-series-color-input">':''}${seriesColorPicker(item,group,colors)}`;
  row.querySelector('.ink-series-detail-trigger').addEventListener('click',()=>openSeriesDetail(item,group));
  row.querySelectorAll('.ink-series-color-select').forEach(button=>button.addEventListener('click',()=>{
    const color=colorById(button.dataset.colorId);
    row.dataset.selectedColorId=button.dataset.colorId;
    row.querySelector('.ink-series-color-input').value=color?colorName(color):'';
    row.querySelectorAll('.ink-series-color-choice').forEach(choice=>choice.classList.toggle('is-selected',choice.dataset.colorId===button.dataset.colorId));
    row.querySelectorAll('.ink-series-color-select').forEach(choice=>choice.setAttribute('aria-pressed',String(choice===button)));
  }));
  const manualInput=row.querySelector('.ink-series-color-input');
  if(manualInput&&!colors.length){
    renderManualColorSuggestions(row,item,group,'');
    manualInput.addEventListener('input',()=>{
      delete row.dataset.selectedColorId;
      renderManualColorSuggestions(row,item,group,manualInput.value);
    });
    manualInput.addEventListener('focus',()=>renderManualColorSuggestions(row,item,group,manualInput.value));
  }
  row.querySelectorAll('.ink-series-price').forEach(button=>button.addEventListener('click',()=>{
    const color=row.dataset.selectedColorId?colorById(row.dataset.selectedColorId):null;
    if(color)saveColorPrice(color,item,button.dataset.volume);
    else if(colors.length){
      row.querySelector('.ink-series-colors')?.setAttribute('open','');
      toast(copy().pickColorFirst||'먼저 색상을 선택해 주세요.');
    }else{
      const input=row.querySelector('.ink-series-color-input');
      if(input?.value.trim())saveSeriesPrice(item,button.dataset.volume,input.value);
      else{
        row.querySelector('.ink-series-colors')?.setAttribute('open','');
        input?.focus();
        toast(copy().typeColorFirst||'색상명을 먼저 입력해 주세요.');
      }
    }
  }));
  return row;
}
function priceSection(group){
  const value=copy();
  const section=document.createElement('section');
  section.className='ink-brand-prices';
  if(!group.visiblePrices.length){section.innerHTML=`<div class="ink-no-price"><strong>${value.noPrice}</strong><span>${value.noPriceBody}</span></div>`;return section;}
  section.innerHTML=`<div class="ink-brand-section-head"><div><span>DECANT PRICE</span><h4>${value.priceSeries}</h4></div><b>${group.visiblePrices.length}${value.seriesCount}</b></div><div class="ink-price-series-list"></div>`;
  section.querySelector('.ink-price-series-list').replaceChildren(...group.visiblePrices.map(item=>priceRow(item,group)));
  return section;
}
function brandCard(group){
  const value=copy();
  const fav=getFavorites().has(group.id);
  const card=document.createElement('article');
  card.className=`ink-result ink-brand-card${fav?' is-favorite':''}`;
  card.innerHTML=`<div class="ink-brand-head">${brandMark(group)}<div class="ink-brand-copy"><span class="ink-brand-label">${value.brand}</span><h3>${brandName(group)}</h3><p>${group.brandEn}${group.colors.length?` · ${group.colors.length}${value.items}`:''}${group.priceItems.length?` · ${group.priceItems.length}${value.seriesCount}`:''}</p></div><button type="button" class="ink-brand-fav" aria-label="${value.favorite}">${fav?'★':'☆'}</button></div><div class="ink-brand-content"></div>`;
  card.querySelector('.ink-brand-fav').addEventListener('click',()=>{toggleFavorite(group.id);renderResults();});
  const content=card.querySelector('.ink-brand-content');
  content.append(priceSection(group));
  return card;
}

function renderResults(){
  const root=document.querySelector('.ink-search-results');
  if(!root)return;
  const groups=applyFilters(matchedGroups(query));
  const count=document.querySelector('[data-search-count]');
  if(count)count.textContent=`${groups.length} / ${decantGroups().filter(groupMatchesCurrentFilters).length}`;
  if(!groups.length){root.innerHTML=`<div class="ink-empty-results"><b>${copy().noTitle}</b>${copy().noBody}</div>`;return;}
  root.replaceChildren(...groups.map(brandCard));
}
function filterByBrand(group){query=currentLang()==='ko'?group.brandKo:group.brandEn;const input=document.querySelector('.ink-brand-search');if(input)input.value=query;renderResults();}
function renderQuick(){
  const root=document.querySelector('.ink-quick-brands');
  if(!root)return;
  const preferred=['Sailor','Diamine','Pilot','Pelikan','Platinum','Dominant Industry','Lennon Tool Bar','Ferris Wheel Press'];
  const groups=brandGroups().filter(group=>group.priceItems.length);
  root.replaceChildren(...preferred.map(name=>groups.find(group=>group.brandEn===name)).filter(Boolean).map(group=>{const button=document.createElement('button');button.type='button';button.textContent=brandName(group);button.addEventListener('click',()=>filterByBrand(group));return button;}));
}
function renderDirectory(){
  const toggle=document.querySelector('.ink-directory-toggle');
  const grid=document.querySelector('.ink-directory-grid');
  if(!toggle||!grid)return;
  toggle.textContent=directoryOpen?copy().hide:copy().all;
  grid.hidden=!directoryOpen;
  if(directoryOpen)grid.replaceChildren(...decantGroups().filter(groupMatchesCurrentFilters).sort((a,b)=>brandName(a).localeCompare(brandName(b))).map(group=>{const button=document.createElement('button');button.type='button';button.textContent=brandName(group);button.addEventListener('click',()=>filterByBrand(group));return button;}));
}
function applyRecommendation(item){
  query=item.query||item.label||'';
  const input=document.querySelector('.ink-brand-search');
  if(input){input.value=query;input.focus();}
  renderResults();
}
function renderRecommendations(){
  const root=document.querySelector('.ink-recommendation-list');
  if(!root)return;
  const value=copy();
  root.replaceChildren(...(value.recommendations||[]).map(item=>{
    const button=document.createElement('button');
    button.type='button';
    button.innerHTML=`<strong>${item.label}</strong><span>${item.note}</span>`;
    button.addEventListener('click',()=>applyRecommendation(item));
    return button;
  }));
}
function renderFilterButtons(root,keys,active,labeler,onSelect){
  root.replaceChildren(...keys.map(key=>{
    const button=document.createElement('button');
    button.type='button';
    button.dataset.filterKey=key;
    button.className=key===active?'is-selected':'';
    button.setAttribute('aria-pressed',String(key===active));
    button.textContent=labeler(key);
    button.addEventListener('click',()=>{onSelect(key);renderFilters();renderResults();renderDirectory();});
    return button;
  }));
}
function renderFilters(){
  const countryRoot=document.querySelector('.ink-country-filters');
  const typeRoot=document.querySelector('.ink-type-filters');
  if(!countryRoot||!typeRoot)return;
  const groups=decantGroups();
  const countryKeys=['all',...COUNTRY_KEYS.filter(key=>groups.some(group=>groupCountryKey(group)===key))];
  const typeKeys=['all',...TYPE_KEYS.filter(key=>groups.some(group=>groupHasType(group,key)))];
  renderFilterButtons(countryRoot,countryKeys,countryFilter,countryLabel,key=>{countryFilter=key;});
  renderFilterButtons(typeRoot,typeKeys,typeFilter,typeLabel,key=>{typeFilter=key;});
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
    if(entry.type==='color'||entry.type==='color-price'){
      const color=colorById(entry.colorId);
      const item=entry.type==='color-price'?priceItemById(entry.itemId):null;
      const detail=entry.type==='color-price'?`${entry.volume} · ${formatPrice(entry.price)}`:`${color?formName(color)+(color.volume?' '+color.volume:''):''} · ${value.unknownPrice}`;
      row.innerHTML=`${color?colorVisual(color,true):'<span class="ink-list-color"></span>'}<div><b>${color?(currentLang()==='ko'?color.brandKo:color.brandEn)+(item?' · '+seriesName(item):'')+' · '+colorName(color):entry.colorId}</b><span>${detail}</span></div><button type="button" aria-label="${value.remove}">×</button>`;
    }else{
      const item=priceItemById(entry.itemId);
      const title=item?(currentLang()==='ko'?item.brandKo:item.brandEn)+' · '+seriesName(item)+(entry.colorName?' · '+entry.colorName:''):entry.itemId;
      const detail=`${entry.volume} · ${formatPrice(entry.price)}${entry.colorName?'':' · '+value.colorNeedsCheck}`;
      row.innerHTML=`<span class="ink-list-brand-mark">${item?initials(item.brandEn):'INK'}</span><div><b>${title}</b><span>${detail}</span></div><button type="button" aria-label="${value.remove}">×</button>`;
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
  document.querySelector('[data-recommend-label]').textContent=value.recommendLabel;
  document.querySelector('[data-country-filter-label]').textContent=value.countryFilterLabel;
  document.querySelector('[data-type-filter-label]').textContent=value.typeFilterLabel;
  document.querySelector('[data-list-title]').textContent=value.listTitle;
  document.querySelector('[data-list-body]').textContent=value.listBody;
  document.querySelector('[data-list-total-label]').textContent=value.total;
  document.querySelector('.ink-list-share').textContent=value.share;
  document.querySelector('.ink-list-clear').textContent=value.clear;
  document.querySelector('.ink-sticky-list-label').textContent=value.sticky;
}
function renderAll(){renderCopy();renderResults();renderQuick();renderRecommendations();renderFilters();renderDirectory();renderList();}

function mount(){
  if(document.querySelector('.ink-customer-tools'))return;
  const section=document.createElement('section');
  section.className='ink-customer-tools';
  section.innerHTML=`<article class="ink-search-card"><span class="ink-card-kicker">SAMPLE INK</span><h2 data-search-title></h2><p data-search-body></p><div class="ink-search-box"><div class="ink-search-field"><input class="ink-brand-search" type="search" autocomplete="off" spellcheck="false"><button type="button" class="ink-search-clear" aria-label="Clear">×</button></div></div><div class="ink-search-meta"><span><span data-search-label></span> <strong data-search-count></strong></span><span data-quick-label></span></div><div class="ink-quick-brands"></div><div class="ink-filter-panel"><div><span data-country-filter-label></span><div class="ink-filter-buttons ink-country-filters"></div></div><div><span data-type-filter-label></span><div class="ink-filter-buttons ink-type-filters"></div></div></div><div class="ink-recommendations"><div class="ink-recommend-title" data-recommend-label></div><div class="ink-recommendation-list"></div></div><div class="ink-search-results"></div><div class="ink-brand-directory"><button type="button" class="ink-directory-toggle"></button><div class="ink-directory-grid" hidden></div></div></article><aside class="ink-list-card"><span class="ink-card-kicker">ORDER SHEET</span><h2><span data-list-title></span><span class="ink-list-count">0</span></h2><p data-list-body></p><div class="ink-list-total"><span data-list-total-label></span><strong data-ink-list-total>0원</strong></div><div class="ink-list-toolbar"><button type="button" class="primary ink-list-share"></button><button type="button" class="ink-list-clear"></button></div><div class="ink-list"></div></aside>`;
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
