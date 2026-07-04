const floorGuide=document.querySelector('#floor-guide');
const secondFloorPanel=floorGuide?.querySelector('[data-merged-panel="2"]');
const interactiveMap=document.querySelector('#store-map');

function activateSecondFloor(){
  if(!floorGuide)return;
  floorGuide.querySelectorAll('[data-merged-floor]').forEach((tab)=>{
    const active=tab.dataset.mergedFloor==='2';
    tab.classList.toggle('is-active',active);
    tab.setAttribute('aria-selected',String(active));
  });
  floorGuide.querySelectorAll('[data-merged-panel]').forEach((panel)=>{
    panel.hidden=panel.dataset.mergedPanel!=='2';
  });
}

if(secondFloorPanel&&interactiveMap){
  secondFloorPanel.replaceChildren(interactiveMap);
  interactiveMap.classList.add('merged-store-map');
  const kicker=interactiveMap.querySelector('.store-map-kicker');
  const title=interactiveMap.querySelector('[data-map-i18n="title"]');
  const intro=interactiveMap.querySelector('[data-map-i18n="intro"]');
  if(kicker)kicker.textContent='2F STORE DIRECTORY';
  if(title)title.textContent='2층 브랜드 안내도';
  if(intro)intro.textContent='2층의 브랜드 진열 위치와 주요 체험 공간을 검색하고 확인하세요.';
}

document.querySelectorAll('a[href="#store-map"]').forEach((link)=>{
  link.addEventListener('click',activateSecondFloor);
});

if(location.hash==='#store-map')activateSecondFloor();
