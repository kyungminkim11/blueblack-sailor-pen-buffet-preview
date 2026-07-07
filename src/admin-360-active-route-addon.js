const ACTIVE_SCENES=['f1-01','f1-02','f1-03','f1-04','f1-05','f1-06','f1-07','f1-08','f1-12'];
const ACTIVE_SET=new Set(ACTIVE_SCENES);
const SUMMARY_HTML='<div data-roadview-summary="true" class="capture-progress-card primary"><span>1층 등록 장면</span><strong>9 / 9</strong><div class="capture-progress-bar"><i style="width:100%"></i></div></div><div class="capture-progress-card"><span>촬영자 비노출 처리</span><strong>완료</strong></div><div class="capture-progress-card"><span>공개 범위</span><strong>관리자</strong></div>';

function setText(node,text){if(node&&node.textContent!==text)node.textContent=text;}
function selectedScene(section){return section.querySelector('.capture-marker.is-selected[data-capture-spot]')?.dataset.captureSpot||ACTIVE_SCENES[0];}
function navHtml(sceneId){const index=Math.max(0,ACTIVE_SCENES.indexOf(sceneId));const previous=ACTIVE_SCENES[(index-1+ACTIVE_SCENES.length)%ACTIVE_SCENES.length];const next=ACTIVE_SCENES[(index+1)%ACTIVE_SCENES.length];return `<div class="admin-roadview-nav" aria-label="로드뷰 장면 이동"><button type="button" data-capture-spot="${previous}"><span>←</span><b>이전 위치</b></button><strong>${index+1} / ${ACTIVE_SCENES.length}</strong><button type="button" data-capture-spot="${next}"><b>다음 위치</b><span>→</span></button></div>`;}

function sync(section){
  setText(section.querySelector('.capture-admin-head h2'),'1층 매장 360 로드뷰');
  setText(section.querySelector('.capture-admin-head p'),'지도에서 위치를 선택하고 360 사진을 회전하며 매장 동선을 확인하세요.');
  setText(section.querySelector('.capture-private-badge'),'관리자 전용 · 고객 미공개');
  setText(section.querySelector('[data-capture-floor="1"]'),'1층 로드뷰');
  const floor2=section.querySelector('[data-capture-floor="2"]');if(floor2&&!floor2.hidden)floor2.hidden=true;
  section.querySelectorAll('[data-capture-spot]').forEach((node)=>{const id=node.dataset.captureSpot;if(id&&!ACTIVE_SET.has(id)&&!node.hidden)node.hidden=true;});
  const summary=section.querySelector('#capture-summary');if(summary&&!summary.querySelector('[data-roadview-summary]'))summary.innerHTML=SUMMARY_HTML;
  setText(section.querySelector('#capture-map-title'),'1층 지도에서 위치 선택');
  setText(section.querySelector('#capture-list-title'),'1층 로드뷰 장면');
  const detail=section.querySelector('#capture-detail-panel');if(detail&&!detail.querySelector('.admin-roadview-nav'))detail.insertAdjacentHTML('beforeend',navHtml(selectedScene(section)));
}

function initialise(){
  const section=document.querySelector('#store-360-capture');if(!section){setTimeout(initialise,80);return;}if(section.dataset.activeRoadview==='true')return;section.dataset.activeRoadview='true';
  const style=document.createElement('style');style.textContent=`#store-360-capture .capture-route-svg{display:none}#store-360-capture [hidden]{display:none!important}#store-360-capture .capture-floor-tabs{grid-template-columns:1fr}#store-360-capture .capture-notice strong{font-size:0}#store-360-capture .capture-notice strong::after{content:'1층 360 로드뷰가 등록되었습니다.';font-size:12px}#store-360-capture .capture-notice span{font-size:0}#store-360-capture .capture-notice span::after{content:'파란 지도 마커 또는 이전·다음 위치 버튼을 눌러 장면을 이동할 수 있습니다.';font-size:10px}.admin-roadview-nav{display:grid;grid-template-columns:minmax(0,1fr) auto minmax(0,1fr);gap:8px;align-items:center;margin-top:13px;padding-top:12px;border-top:1px solid #dce4eb}.admin-roadview-nav button{display:flex;align-items:center;justify-content:center;gap:7px;min-height:42px;padding:0 12px;border:1px solid #b9cad9;border-radius:11px;background:#f1f6fa;color:#173a5b;font:inherit;cursor:pointer}.admin-roadview-nav button:hover{border-color:#1f5f97;background:#e8f2fa}.admin-roadview-nav button span{font-size:16px}.admin-roadview-nav button b{font-size:9px}.admin-roadview-nav strong{color:#6d7b8d;font-size:9px;white-space:nowrap}@media(max-width:520px){.admin-roadview-nav{grid-template-columns:1fr 1fr}.admin-roadview-nav strong{display:none}.admin-roadview-nav button{min-height:44px}}`;
  document.head.append(style);
  let scheduled=false;const observer=new MutationObserver(()=>{if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;sync(section);});});observer.observe(section,{childList:true,subtree:true});sync(section);
}

initialise();
