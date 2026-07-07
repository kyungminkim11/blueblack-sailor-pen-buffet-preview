const DB_NAME='blueblack-360-roadview-v2';
const DB_VERSION=1;
const PHOTO_STORE='photos';

const FILE_TO_SPOT=new Map([
  ['blueblack-1f-01-entrance.webp','f1-01'],['1000021639.jpg','f1-01'],
  ['blueblack-1f-02-front-junction.webp','f1-02'],['1000021642.jpg','f1-02'],
  ['blueblack-1f-03-pen-buffet-lower.webp','f1-03'],['1000021636.jpg','f1-03'],
  ['blueblack-1f-04-center-crossing.webp','f1-04'],['1000021641.jpg','f1-04'],
  ['blueblack-1f-05-black-island-aisle.webp','f1-05'],['1000021638.jpg','f1-05'],
  ['blueblack-1f-06-upper-ink-wall.webp','f1-06'],['1000021646.jpg','f1-06'],
  ['blueblack-1f-07-left-upper-corner.webp','f1-07'],['1000021640.jpg','f1-07'],
  ['blueblack-1f-08-left-ink-wall.webp','f1-08'],['1000021645.jpg','f1-08'],
  ['blueblack-1f-12-rear-display-aisle.webp','f1-12'],['1000021637.jpg','f1-12']
]);

function openDatabase(){
  return new Promise((resolve,reject)=>{
    const request=indexedDB.open(DB_NAME,DB_VERSION);
    request.onupgradeneeded=()=>{
      const db=request.result;
      if(!db.objectStoreNames.contains(PHOTO_STORE))db.createObjectStore(PHOTO_STORE,{keyPath:'spotId'});
    };
    request.onsuccess=()=>resolve(request.result);
    request.onerror=()=>reject(request.error||new Error('360 사진 저장소를 열지 못했습니다.'));
  });
}

function getImageSize(file){
  return new Promise((resolve,reject)=>{
    const url=URL.createObjectURL(file);
    const image=new Image();
    image.onload=()=>{const size={width:image.naturalWidth,height:image.naturalHeight};URL.revokeObjectURL(url);resolve(size);};
    image.onerror=()=>{URL.revokeObjectURL(url);reject(new Error(`${file.name} 크기를 확인하지 못했습니다.`));};
    image.src=url;
  });
}

function saveRecords(db,records){
  return new Promise((resolve,reject)=>{
    const tx=db.transaction(PHOTO_STORE,'readwrite');
    const store=tx.objectStore(PHOTO_STORE);
    records.forEach((record)=>store.put(record));
    tx.oncomplete=()=>resolve();
    tx.onerror=()=>reject(tx.error||new Error('사진을 저장하지 못했습니다.'));
    tx.onabort=()=>reject(tx.error||new Error('사진 저장이 중단되었습니다.'));
  });
}

function showToast(message,tone='success'){
  const toast=document.querySelector('#capture-toast');
  if(!toast)return;
  toast.textContent=message;
  toast.dataset.tone=tone;
  toast.classList.add('is-visible');
}

async function importFiles(fileList,button){
  const files=[...fileList].filter((file)=>file.type.startsWith('image/'));
  const matched=files.map((file)=>({file,spotId:FILE_TO_SPOT.get(file.name.toLowerCase())})).filter((item)=>item.spotId);
  if(!matched.length){showToast('파일명이 촬영 위치와 일치하지 않습니다. 제공된 1층 사진 묶음을 선택해 주세요.','error');return;}
  button.disabled=true;
  button.textContent=`${matched.length}장 확인 중…`;
  try{
    const db=await openDatabase();
    const records=[];
    for(const {file,spotId} of matched){
      const {width,height}=await getImageSize(file);
      records.push({spotId,floor:1,name:file.name,type:file.type||'image/webp',size:file.size,width,height,updatedAt:Date.now(),blob:file,source:'batch-import-2026-07-07',privacyProcessed:true});
    }
    await saveRecords(db,records);
    showToast(`1층 360 사진 ${records.length}장을 지도 위치에 등록했습니다.`,'success');
    setTimeout(()=>location.reload(),900);
  }catch(error){
    console.error(error);
    showToast(error?.message||'사진을 일괄 등록하지 못했습니다.','error');
    button.disabled=false;
    button.textContent='1층 사진 9장 일괄 등록';
  }
}

function initialise(){
  const section=document.querySelector('#store-360-capture');
  if(!section){setTimeout(initialise,100);return;}
  if(section.querySelector('[data-batch-360-import]'))return;
  const badge=section.querySelector('.capture-private-badge');
  const wrap=document.createElement('div');
  wrap.className='capture-batch-tools';
  wrap.innerHTML='<button class="admin-button primary" type="button" data-batch-360-import>1층 사진 9장 일괄 등록</button><input type="file" hidden multiple accept="image/jpeg,image/png,image/webp,image/*" data-batch-360-input><small>촬영자 비노출 처리된 사진 묶음을 한 번에 선택합니다.</small>';
  badge?.parentElement?.insertBefore(wrap,badge);
  const button=wrap.querySelector('[data-batch-360-import]');
  const input=wrap.querySelector('[data-batch-360-input]');
  button.addEventListener('click',()=>input.click());
  input.addEventListener('change',()=>importFiles(input.files,button));

  const style=document.createElement('style');
  style.textContent='.capture-batch-tools{display:grid;justify-items:end;gap:5px;margin-left:auto}.capture-batch-tools small{max-width:210px;color:#738195;font-size:8px;line-height:1.35;text-align:right}@media(max-width:760px){.capture-batch-tools{justify-items:start;margin-left:0}.capture-batch-tools small{text-align:left}}';
  document.head.append(style);
}

initialise();
