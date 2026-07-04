import {loadStoreMap} from './store-map-config.js';

if(!document.querySelector('link[data-store-map-live]')){
  const link=document.createElement('link');
  link.rel='stylesheet';
  link.href=new URL('../store-tour/store-map-live.css',import.meta.url).href;
  link.dataset.storeMapLive='';
  document.head.append(link);
}

function zonePattern(type){
  if(type==='ink')return '<span class="map-zone-pattern ink-pattern" aria-hidden="true"></span>';
  if(type==='seats')return '<span class="map-seat-row" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></span>';
  return '';
}

function renderMap(config){
  const host=document.querySelector('#storeMap1FLive');
  if(!host)return;
  host.innerHTML=`
    <div class="live-map-head">
      <div><small>1F STORE DIRECTORY</small><h3>${escapeHtml(config.title)}</h3><p>${escapeHtml(config.subtitle)}</p></div>
      <a href="../admin-store-map.html" class="live-map-admin-link">안내도 관리</a>
    </div>
    <div class="live-map-board" role="img" aria-label="블루블랙 펜샵 1층 안내도">
      <div class="live-map-path path-a"></div><div class="live-map-path path-b"></div>
      ${config.zones.filter(z=>z.visible!==false).map((z)=>`
        <article class="live-map-zone type-${z.type||'plain'}" style="left:${z.x}%;top:${z.y}%;width:${z.w}%;height:${z.h}%;">
          ${zonePattern(z.type)}
          <strong>${escapeHtml(z.label)}</strong>
          ${z.subLabel?`<small>${escapeHtml(z.subLabel)}</small>`:''}
        </article>`).join('')}
    </div>
    <p class="live-map-note">ⓘ ${escapeHtml(config.note)}</p>`;
}

function escapeHtml(value=''){return String(value).replace(/[&<>'"]/g,(char)=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));}

function insertMap(){
  let host=document.querySelector('#storeMap1FLive');
  if(!host){
    const firstPanel=document.querySelector('[data-floor-panel="1"]');
    if(!firstPanel)return;
    const section=document.createElement('section');
    section.className='tour-card live-map-card';
    section.id='storeMap1FLive';
    firstPanel.querySelector('.floor-intro-card')?.insertAdjacentElement('afterend',section);
    host=section;
  }
  renderMap(loadStoreMap());
}

insertMap();
window.addEventListener('blueblack-store-map-updated',(event)=>renderMap(event.detail||loadStoreMap()));
window.addEventListener('storage',(event)=>{if(event.key==='blueblack-store-map-v1')renderMap(loadStoreMap())});
