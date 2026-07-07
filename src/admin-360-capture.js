const TOUR_SESSION_KEY='blueblack-catalog-session';
function ensureAdminGate(){
  const existing=[...document.scripts].find(script=>script.src.includes('/admin/admin-auth.js'));
  if(existing)return Promise.resolve(existing);
  return new Promise((resolve,reject)=>{
    const script=document.createElement('script');
    script.src=new URL('../admin/admin-auth.js?v=3',import.meta.url).href;
    script.dataset.blueblackAdminAuth='true';
    script.onload=()=>resolve(script);
    script.onerror=()=>reject(new Error('관리자 인증 도구를 불러오지 못했습니다.'));
    document.head.append(script);
  });
}
function waitForAdminSession(){
  if(sessionStorage.getItem(TOUR_SESSION_KEY))return Promise.resolve();
  return new Promise(resolve=>{
    const timer=setInterval(()=>{
      if(!sessionStorage.getItem(TOUR_SESSION_KEY))return;
      clearInterval(timer);
      resolve();
    },180);
  });
}
async function mountTourManager(){
  const grid=document.querySelector('.admin-grid');
  if(!grid)return;
  let section=document.querySelector('#store-360-capture');
  if(!section){
    section=document.createElement('section');
    section.id='store-360-capture';
    section.className='admin-card full';
    section.innerHTML='<div class="store-tour-admin-error"><strong>관리자 인증을 기다리고 있습니다.</strong><p>암호 확인 후 360 관리 도구가 자동으로 열립니다.</p></div>';
    const map=document.querySelector('#store-map-admin');
    const backup=document.querySelector('#export-settings')?.closest('.admin-card');
    if(map)grid.insertBefore(section,map);
    else if(backup)grid.insertBefore(section,backup);
    else grid.append(section);
  }
  try{
    await ensureAdminGate();
    await waitForAdminSession();
    section.innerHTML='<div class="store-tour-admin-error"><strong>360 매장 관리 도구를 불러오는 중입니다.</strong></div>';
    await import('./store-tour-admin.js?v=5');
  }catch(error){
    console.error('Store tour admin failed',error);
    section.innerHTML=`<div class="store-tour-admin-error"><strong>360 관리 도구를 불러오지 못했습니다.</strong><p>${error.message}</p></div>`;
  }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mountTourManager,{once:true});else mountTourManager();
