function mountTourManager(){
  const grid=document.querySelector('.admin-grid');
  if(!grid)return;
  let section=document.querySelector('#store-360-capture');
  if(!section){
    section=document.createElement('section');
    section.id='store-360-capture';
    section.className='admin-card full';
    section.innerHTML='<div class="store-tour-admin-error"><strong>360 매장 관리 도구를 불러오는 중입니다.</strong></div>';
    const map=document.querySelector('#store-map-admin');
    const backup=document.querySelector('#export-settings')?.closest('.admin-card');
    if(map)grid.insertBefore(section,map);
    else if(backup)grid.insertBefore(section,backup);
    else grid.append(section);
  }
  import('./store-tour-admin.js').catch(error=>{
    console.error('Store tour admin failed',error);
    section.innerHTML=`<div class="store-tour-admin-error"><strong>360 관리 도구를 불러오지 못했습니다.</strong><p>${error.message}</p></div>`;
  });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mountTourManager,{once:true});else mountTourManager();
