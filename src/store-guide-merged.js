const main=document.querySelector('.detail-main');
const visitCard=main?.querySelector('.detail-card');

if(main&&visitCard&&!document.querySelector('#floor-guide')){
  const section=document.createElement('section');
  section.className='detail-card merged-floor-card';
  section.id='floor-guide';
  section.innerHTML=`
    <div class="merged-floor-heading">
      <div><small>EXPLORE THE STORE</small><h2>층별 매장 안내</h2><p>1층과 2층의 주요 진열 구역과 매장 동선을 미리 확인하세요.</p></div>
    </div>
    <div class="merged-floor-tabs" role="tablist" aria-label="층 선택">
      <button class="merged-floor-tab is-active" type="button" data-merged-floor="1" aria-selected="true"><small>FLOOR 01</small><strong>1층 안내도</strong></button>
      <button class="merged-floor-tab" type="button" data-merged-floor="2" aria-selected="false"><small>FLOOR 02</small><strong>2층 브랜드 안내도</strong></button>
    </div>
    <div class="merged-floor-panel" data-merged-panel="1">
      <div id="storeMap1FLive"></div>
    </div>
    <div class="merged-floor-panel" data-merged-panel="2" hidden>
      <div class="merged-floor-panel-head"><div><h3>2층 브랜드 안내도</h3><p>브랜드 위치와 주요 체험 공간을 확인하세요.</p></div><a class="merged-floor-link" href="#store-map">브랜드 검색 지도 열기</a></div>
      <div class="merged-floor-map"><object type="image/svg+xml" data="./store-map.svg"><img src="./store-map.svg" alt="블루블랙 펜샵 2층 브랜드 안내도" /></object></div>
      <p class="merged-floor-note">브랜드와 진열 위치는 매장 운영 상황에 따라 변경될 수 있습니다.</p>
    </div>`;
  main.insertBefore(section,visitCard);

  const tabs=[...section.querySelectorAll('[data-merged-floor]')];
  const panels=[...section.querySelectorAll('[data-merged-panel]')];
  const setFloor=(value)=>{
    const floor=String(value)==='2'?'2':'1';
    tabs.forEach((tab)=>{const active=tab.dataset.mergedFloor===floor;tab.classList.toggle('is-active',active);tab.setAttribute('aria-selected',String(active));});
    panels.forEach((panel)=>{panel.hidden=panel.dataset.mergedPanel!==floor;});
    const url=new URL(location.href);url.searchParams.set('floor',floor);history.replaceState(null,'',url);
  };
  tabs.forEach((tab)=>tab.addEventListener('click',()=>setFloor(tab.dataset.mergedFloor)));
  setFloor(new URLSearchParams(location.search).get('floor')||'1');
  import('./store-map-live.js');
}
