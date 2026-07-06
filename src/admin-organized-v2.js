const ADMIN_LAYOUT_VERSION='2';
const SECTION_KEY='blueblack-admin-section-v2';

const SECTION_CONFIG=[
  {id:'overview',icon:'⌂',label:'개요',hint:'빠른 실행',eyebrow:'CONTROL CENTER',title:'운영 관리 개요',description:'자주 쓰는 기능만 골라 바로 이동하세요.'},
  {id:'capture',icon:'360',label:'360 촬영',hint:'1·2층 촬영',eyebrow:'STORE CAPTURE',title:'360 촬영 관리',description:'촬영 위치 확인, 현장 메모와 사진 등록을 한곳에서 관리합니다.'},
  {id:'display',icon:'▣',label:'고객 화면',hint:'공지·조합',eyebrow:'CUSTOMER DISPLAY',title:'고객 화면 설정',description:'고객 화면 노출 항목, 기본 조합과 현재 상담 세션을 관리합니다.'},
  {id:'ink',icon:'●',label:'잉크',hint:'가격·색상',eyebrow:'INK CATALOG',title:'소분 잉크 카탈로그',description:'가격 구분과 색상 데이터를 등록하고 고객 화면에서 확인합니다.'},
  {id:'map',icon:'⌖',label:'안내도',hint:'구역·지도',eyebrow:'STORE DIRECTORY',title:'매장 안내도 관리',description:'층별 지도 문구와 구역 표시를 관리합니다.'},
  {id:'system',icon:'⚙',label:'시스템',hint:'상태·백업',eyebrow:'SYSTEM & BACKUP',title:'기기 상태와 백업',description:'현재 브라우저 상태를 확인하고 설정을 내보내거나 복원합니다.'}
];

function ensureStyle(){
  if(document.querySelector('link[data-admin-organized-v2]'))return;
  const link=document.createElement('link');
  link.rel='stylesheet';
  link.href=new URL('../admin-organized-v2.css?v='+ADMIN_LAYOUT_VERSION,import.meta.url).href;
  link.dataset.adminOrganizedV2='true';
  document.head.append(link);
}

function byClosest(selector,closest='.admin-card'){
  return document.querySelector(selector)?.closest(closest)||null;
}

function collectCards(){
  return{
    capture:[document.querySelector('#store-360-capture')].filter(Boolean),
    display:[
      document.querySelector('#admin-form'),
      byClosest('#combination-editor'),
      byClosest('#session-summary')
    ].filter(Boolean),
    ink:[document.querySelector('.ink-admin-card')].filter(Boolean),
    map:[document.querySelector('#store-map-admin')].filter(Boolean),
    system:[
      byClosest('#status-list'),
      byClosest('#export-settings')
    ].filter(Boolean)
  };
}

function sectionFromHash(){
  const hash=location.hash;
  if(hash==='#store-360-capture')return'capture';
  if(hash==='#store-map-admin')return'map';
  if(hash.includes('ink'))return'ink';
  if(hash.includes('combination')||hash.includes('display'))return'display';
  if(hash.includes('backup')||hash.includes('system'))return'system';
  if(hash.startsWith('#admin-section-'))return hash.replace('#admin-section-','');
  return'';
}

function savedSection(){
  try{return localStorage.getItem(SECTION_KEY)||'';}catch{return'';}
}

function rememberSection(section){
  try{localStorage.setItem(SECTION_KEY,section);}catch{}
}

function dashboardCard({section,icon,title,body,priority=false}){
  const button=document.createElement('button');
  button.type='button';
  button.className='admin-dashboard-card'+(priority?' is-priority':'');
  button.dataset.adminOpenSection=section;
  button.innerHTML=`<span class="admin-dashboard-card-icon">${icon}</span><span><b>${title}</b><span>${body}</span></span>`;
  return button;
}

function buildOverview(){
  const host=document.createElement('div');
  host.className='admin-organized-dashboard';

  const banner=document.createElement('section');
  banner.className='admin-dashboard-banner';
  banner.innerHTML=`<div><small>BLUEBLACK OPERATIONS</small><h2>관리 기능을 메뉴별로 정리했습니다</h2><p>긴 페이지를 계속 내리지 않아도 됩니다. 촬영, 고객 화면, 잉크, 안내도, 백업 중 필요한 작업만 열어 사용하세요.</p></div><div class="admin-dashboard-badge">BB</div>`;

  const grid=document.createElement('div');
  grid.className='admin-dashboard-grid';
  grid.append(
    dashboardCard({section:'capture',icon:'360',title:'360 촬영 준비',body:'1·2층 촬영 위치 확인과 사진 등록',priority:true}),
    dashboardCard({section:'display',icon:'▣',title:'고객 화면 설정',body:'공지, 노출 항목과 기본 펜 조합'}),
    dashboardCard({section:'ink',icon:'●',title:'소분 잉크 관리',body:'가격 구분과 색상 카탈로그'}),
    dashboardCard({section:'map',icon:'⌖',title:'매장 안내도',body:'구역 이름과 지도 표시 관리'}),
    dashboardCard({section:'system',icon:'⚙',title:'상태·백업',body:'기기 상태 확인과 설정 파일 백업'})
  );

  const links=document.createElement('div');
  links.className='admin-dashboard-links';
  links.innerHTML=`
    <a href="./" target="_blank" rel="noopener">고객 화면 열기</a>
    <a href="./admin/product-finder/">상품 빠른찾기</a>
    <a href="./admin/">관리자 도구 홈</a>
  `;

  const note=document.createElement('div');
  note.className='admin-dashboard-note';
  note.innerHTML='<strong>저장 방식 안내</strong> · 이 페이지의 설정과 360 사진은 현재 브라우저에 저장됩니다. 다른 기기와 자동 동기화되지 않으므로 중요한 설정과 원본 사진은 별도로 보관하세요.';

  host.append(banner,grid,links,note);
  return host;
}

function buildPanel(config,cards){
  const panel=document.createElement('section');
  panel.className='admin-organized-panel';
  panel.dataset.adminSection=config.id;
  panel.id='admin-section-'+config.id;
  panel.hidden=config.id!=='overview';
  panel.tabIndex=-1;

  const head=document.createElement('div');
  head.className='admin-organized-panel-head';
  head.innerHTML=`<div><small>${config.eyebrow}</small><h2>${config.title}</h2></div><p>${config.description}</p>`;
  panel.append(head);

  if(config.id==='overview'){
    panel.append(buildOverview());
    return panel;
  }

  const grid=document.createElement('div');
  grid.className='admin-organized-panel-grid';
  if(cards.length){
    cards.forEach(card=>grid.append(card));
  }else{
    const empty=document.createElement('div');
    empty.className='admin-section-empty';
    empty.textContent='이 관리 기능을 불러오는 중입니다.';
    grid.append(empty);
  }
  panel.append(grid);
  return panel;
}

function buildSidebar(){
  const aside=document.createElement('aside');
  aside.className='admin-organized-sidebar';
  aside.innerHTML='<div class="admin-organized-mobile-label">관리 메뉴</div><div class="admin-organized-sidebar-head"><small>ADMIN MENU</small><strong>운영 관리</strong></div>';

  const nav=document.createElement('nav');
  nav.className='admin-organized-nav';
  nav.setAttribute('aria-label','관리 기능');
  nav.setAttribute('role','tablist');
  SECTION_CONFIG.forEach(config=>{
    const button=document.createElement('button');
    button.type='button';
    button.role='tab';
    button.dataset.section=config.id;
    button.setAttribute('aria-controls','admin-section-'+config.id);
    button.setAttribute('aria-selected',String(config.id==='overview'));
    button.innerHTML=`<span class="admin-organized-nav-icon">${config.icon}</span><span class="admin-organized-nav-copy"><b>${config.label}</b><span>${config.hint}</span></span>`;
    nav.append(button);
  });

  const links=document.createElement('div');
  links.className='admin-organized-sidebar-links';
  links.innerHTML=`<a href="./admin/">관리자 도구 홈 <span>→</span></a><a href="./" target="_blank" rel="noopener">고객 화면 <span>↗</span></a>`;
  aside.append(nav,links);
  return aside;
}

function updateHeader(section){
  const save=document.querySelector('#header-save');
  if(save){
    save.textContent='고객 화면 저장';
    save.classList.toggle('is-context-hidden',section!=='display');
  }
  const captureLink=document.querySelector('.capture-jump-link');
  if(captureLink){
    captureLink.href='#admin-section-capture';
    captureLink.dataset.adminOpenSection='capture';
  }
}

function setSection(section,{focus=false,updateUrl=true}={}){
  const valid=SECTION_CONFIG.some(item=>item.id===section)?section:'overview';
  document.querySelectorAll('.admin-organized-nav button').forEach(button=>{
    const selected=button.dataset.section===valid;
    button.setAttribute('aria-selected',String(selected));
    button.tabIndex=selected?0:-1;
  });
  document.querySelectorAll('.admin-organized-panel').forEach(panel=>{
    panel.hidden=panel.dataset.adminSection!==valid;
  });
  updateHeader(valid);
  rememberSection(valid);
  if(updateUrl){
    const url=new URL(location.href);
    url.hash=valid==='overview'?'':'admin-section-'+valid;
    history.replaceState(null,'',url);
  }
  const panel=document.querySelector(`[data-admin-section="${valid}"]`);
  if(focus){
    panel?.focus({preventScroll:true});
    panel?.scrollIntoView({behavior:'smooth',block:'start'});
  }
}

function bindWorkspace(workspace){
  workspace.addEventListener('click',event=>{
    const trigger=event.target.closest('[data-section],[data-admin-open-section]');
    if(!trigger)return;
    const section=trigger.dataset.section||trigger.dataset.adminOpenSection;
    if(!section)return;
    event.preventDefault();
    setSection(section,{focus:true});
  });

  const nav=workspace.querySelector('.admin-organized-nav');
  nav?.addEventListener('keydown',event=>{
    if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(event.key))return;
    const buttons=[...nav.querySelectorAll('button')];
    const current=buttons.indexOf(document.activeElement);
    if(current<0)return;
    event.preventDefault();
    let next=current;
    if(event.key==='Home')next=0;
    else if(event.key==='End')next=buttons.length-1;
    else if(event.key==='ArrowRight'||event.key==='ArrowDown')next=(current+1)%buttons.length;
    else next=(current-1+buttons.length)%buttons.length;
    buttons[next].focus();
    setSection(buttons[next].dataset.section);
  });

  document.addEventListener('click',event=>{
    const trigger=event.target.closest('[data-admin-open-section]');
    if(!trigger||workspace.contains(trigger))return;
    const section=trigger.dataset.adminOpenSection;
    if(!section)return;
    event.preventDefault();
    setSection(section,{focus:true});
  });

  addEventListener('hashchange',()=>{
    const section=sectionFromHash();
    if(section)setSection(section,{updateUrl:false});
  });
}

function organize(){
  if(document.documentElement.dataset.adminOrganizedV2)return true;
  const original=document.querySelector('.admin-grid');
  if(!original)return false;
  const cards=collectCards();
  if(!cards.capture.length||!cards.map.length)return false;

  document.documentElement.dataset.adminOrganizedV2='true';
  ensureStyle();
  document.title='블루블랙 운영 관리 · BlueBlack Pen Shop';
  const brandTitle=document.querySelector('.admin-brand h1');
  if(brandTitle)brandTitle.textContent='블루블랙 운영 관리';
  const heroKicker=document.querySelector('.admin-hero small');
  const heroTitle=document.querySelector('.admin-hero h2');
  const heroBody=document.querySelector('.admin-hero p');
  if(heroKicker)heroKicker.textContent='STORE OPERATIONS';
  if(heroTitle)heroTitle.textContent='필요한 관리 기능만 빠르게 열어보세요';
  if(heroBody)heroBody.textContent='360 촬영, 고객 화면, 잉크 카탈로그, 매장 안내도와 백업 기능을 업무별 메뉴로 분리했습니다.';

  const workspace=document.createElement('div');
  workspace.className='admin-organized-workspace';
  const sidebar=buildSidebar();
  const content=document.createElement('div');
  content.className='admin-organized-content';

  SECTION_CONFIG.forEach(config=>{
    content.append(buildPanel(config,cards[config.id]||[]));
  });
  workspace.append(sidebar,content);
  original.replaceWith(workspace);
  bindWorkspace(workspace);

  const initial=sectionFromHash()||savedSection()||'overview';
  setSection(initial,{updateUrl:false});
  return true;
}

function start(){
  ensureStyle();
  if(organize())return;
  let attempts=0;
  const timer=setInterval(()=>{
    attempts+=1;
    if(organize()||attempts>40)clearInterval(timer);
  },100);
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
