const ACTIVE_SCENES=['f1-01','f1-02','f1-03','f1-04','f1-05','f1-06','f1-07','f1-08','f1-12'];
const ACTIVE_SET=new Set(ACTIVE_SCENES);
const TITLES={
  'f1-01':'출입구 안쪽','f1-02':'전면 중앙 분기점','f1-03':'펜뷔페 하단 통로',
  'f1-04':'펜뷔페·카웨코 사이','f1-05':'블랙 아일랜드·세일러 사이',
  'f1-06':'상단 잉크벽 중앙','f1-07':'좌측 상단 코너','f1-08':'좌측 잉크벽 중앙',
  'f1-12':'후면 진열장·후문 통로'
};
const NAV={
  'f1-01':{straight:'f1-02'},
  'f1-02':{straight:'f1-03',right:'f1-12',back:'f1-01'},
  'f1-03':{straight:'f1-04',back:'f1-02'},
  'f1-04':{straight:'f1-05',back:'f1-03'},
  'f1-05':{straight:'f1-06',back:'f1-04'},
  'f1-06':{left:'f1-07',right:'f1-12',back:'f1-05'},
  'f1-07':{straight:'f1-08',right:'f1-06'},
  'f1-08':{straight:'f1-01',right:'f1-07'},
  'f1-12':{straight:'f1-02',left:'f1-06'}
};
const SUMMARY_HTML='<div data-roadview-summary="true" class="capture-progress-card primary"><span>1층 등록 장면</span><strong>9 / 9</strong><div class="capture-progress-bar"><i style="width:100%"></i></div></div><div class="capture-progress-card"><span>도면 연동</span><strong>완료</strong></div><div class="capture-progress-card"><span>공개 범위</span><strong>관리자</strong></div>';

function setText(node,text){if(node&&node.textContent!==text)node.textContent=text;}
function selectedScene(section){return section.querySelector('.capture-marker.is-selected[data-capture-spot]')?.dataset.captureSpot||ACTIVE_SCENES[0];}
function directionButton(direction,target){
  const meta={left:['←','좌측'],straight:['↑','직진'],right:['→','우측'],back:['↓','뒤로']}[direction];
  return `<button type="button" class="roadview-direction roadview-${direction}" data-capture-spot="${target}" aria-label="${meta[1]} ${TITLES[target]}로 이동"><span>${meta[0]}</span><b>${meta[1]}</b><small>${TITLES[target]}</small></button>`;
}
function directionPad(sceneId){
  const links=NAV[sceneId]||{};
  return `<div class="roadview-direction-pad" aria-label="로드뷰 이동 방향">${['left','straight','right','back'].filter((key)=>links[key]).map((key)=>directionButton(key,links[key])).join('')}</div>`;
}

function prepareDetail(section){
  const detail=section.querySelector('#capture-detail-panel');
  if(!detail)return;
  const top=detail.querySelector('.capture-detail-top');
  const photoArea=detail.querySelector('.capture-photo-area');
  if(top&&photoArea&&top.nextElementSibling!==photoArea)top.after(photoArea);
  detail.querySelectorAll('.capture-direction-card,.capture-connections,.capture-tip-card,.capture-note-field,.capture-checklist,.capture-photo-actions,.capture-file-hint,.capture-photo-meta').forEach((node)=>node.hidden=true);
  detail.querySelector('.admin-roadview-nav')?.remove();
  const viewer=detail.querySelector('.capture-panorama-viewer');
  if(viewer){
    const sceneId=selectedScene(section);
    const current=viewer.querySelector('.roadview-direction-pad');
    if(!current||current.dataset.scene!==sceneId){
      current?.remove();
      viewer.insertAdjacentHTML('beforeend',directionPad(sceneId));
      const created=viewer.querySelector('.roadview-direction-pad');
      if(created)created.dataset.scene=sceneId;
    }
  }
}

function sync(section){
  setText(section.querySelector('.capture-admin-head h2'),'1층 도면 기반 360 로드뷰');
  setText(section.querySelector('.capture-admin-head p'),'1층 도면의 위치를 누르면 해당 장소의 360뷰가 열립니다. 화면 안의 직진·좌측·우측 화살표로 이동하세요.');
  setText(section.querySelector('.capture-private-badge'),'관리자 전용 · 고객 미공개');
  setText(section.querySelector('[data-capture-floor="1"]'),'1층 도면 로드뷰');
  const floor2=section.querySelector('[data-capture-floor="2"]');if(floor2&&!floor2.hidden)floor2.hidden=true;
  section.querySelectorAll('[data-capture-spot]').forEach((node)=>{const id=node.dataset.captureSpot;if(!id)return;node.hidden=!ACTIVE_SET.has(id);});
  const summary=section.querySelector('#capture-summary');if(summary&&!summary.querySelector('[data-roadview-summary]'))summary.innerHTML=SUMMARY_HTML;
  setText(section.querySelector('#capture-map-title'),'1층 도면에서 보고 싶은 위치를 선택하세요');
  setText(section.querySelector('#capture-list-title'),'1층 360 로드뷰 위치');
  prepareDetail(section);
}

function initialise(){
  const section=document.querySelector('#store-360-capture');if(!section){setTimeout(initialise,80);return;}if(section.dataset.activeRoadview==='true')return;section.dataset.activeRoadview='true';
  const style=document.createElement('style');style.textContent=`
    #store-360-capture .capture-route-svg{display:none}#store-360-capture [hidden]{display:none!important}
    #store-360-capture .capture-floor-tabs{grid-template-columns:1fr}
    #store-360-capture .capture-workspace{grid-template-columns:minmax(340px,.9fr) minmax(420px,1.1fr);align-items:start}
    #store-360-capture .capture-detail-panel{padding:14px;background:#fff}
    #store-360-capture .capture-photo-area{margin-top:12px}
    #store-360-capture .capture-photo-preview{border-radius:16px;box-shadow:0 16px 36px rgba(16,35,63,.18)}
    #store-360-capture .capture-panorama-viewer{aspect-ratio:16/10;min-height:420px}
    #store-360-capture .capture-notice strong{font-size:0}#store-360-capture .capture-notice strong::after{content:'도면을 누르고, 360뷰 안에서 방향을 선택해 이동합니다.';font-size:12px}
    #store-360-capture .capture-notice span{font-size:0}#store-360-capture .capture-notice span::after{content:'선택한 위치는 도면에서 파란 테두리로 표시됩니다.';font-size:10px}
    .roadview-direction-pad{position:absolute;inset:0;z-index:8;pointer-events:none}
    .roadview-direction{position:absolute;display:grid;grid-template-columns:32px auto;grid-template-rows:auto auto;align-items:center;gap:0 7px;min-width:118px;padding:8px 11px;border:1px solid rgba(255,255,255,.65);border-radius:14px;background:rgba(7,22,37,.78);backdrop-filter:blur(9px);color:#fff;box-shadow:0 8px 22px rgba(0,0,0,.28);font:inherit;text-align:left;cursor:pointer;pointer-events:auto;transition:transform .16s ease,background .16s ease}
    .roadview-direction:hover,.roadview-direction:focus-visible{background:rgba(22,82,127,.94);transform:scale(1.04);outline:3px solid rgba(255,255,255,.35)}
    .roadview-direction span{grid-row:1/3;display:grid;place-items:center;width:32px;height:32px;border-radius:50%;background:#fff;color:#123c5c;font-size:22px;font-weight:950}
    .roadview-direction b{font-size:10px;line-height:1.1}.roadview-direction small{max-width:100px;overflow:hidden;color:#dceaf5;font-size:7px;line-height:1.2;text-overflow:ellipsis;white-space:nowrap}
    .roadview-straight{left:50%;top:12px;transform:translateX(-50%)}.roadview-straight:hover,.roadview-straight:focus-visible{transform:translateX(-50%) scale(1.04)}
    .roadview-left{left:12px;top:50%;transform:translateY(-50%)}.roadview-left:hover,.roadview-left:focus-visible{transform:translateY(-50%) scale(1.04)}
    .roadview-right{right:12px;top:50%;transform:translateY(-50%)}.roadview-right:hover,.roadview-right:focus-visible{transform:translateY(-50%) scale(1.04)}
    .roadview-back{left:50%;bottom:58px;transform:translateX(-50%)}.roadview-back:hover,.roadview-back:focus-visible{transform:translateX(-50%) scale(1.04)}
    @media(max-width:1050px){#store-360-capture .capture-workspace{grid-template-columns:1fr}#store-360-capture .capture-panorama-viewer{min-height:440px}}
    @media(max-width:520px){#store-360-capture .capture-panorama-viewer{min-height:330px;aspect-ratio:4/3}.roadview-direction{min-width:88px;padding:6px 8px;grid-template-columns:27px auto}.roadview-direction span{width:27px;height:27px;font-size:18px}.roadview-direction small{display:none}.roadview-left{left:6px}.roadview-right{right:6px}.roadview-straight{top:7px}.roadview-back{bottom:50px}}
  `;document.head.append(style);
  let scheduled=false;const observer=new MutationObserver(()=>{if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;sync(section);});});observer.observe(section,{childList:true,subtree:true});sync(section);
}
initialise();
