import { loadStoreMap } from './store-map-config.js';

const DB_NAME = 'blueblack-360-roadview-v2';
const DB_VERSION = 1;
const PHOTO_STORE = 'photos';
const NOTE_KEY = 'blueblack-360-roadview-notes-v2';

const CAPTURE_SPOTS = [
  {
    id:'f1-01',floor:1,order:1,code:'1F-01',title:'출입구 안쪽',x:31,y:87,angle:-90,priority:'required',role:'start',
    direction:'매장 중앙 통로 방향',purpose:'1층 로드뷰의 시작 장면입니다.',
    tip:'출입문에서 약 1m 안쪽, 카메라 높이 1.5m를 기준으로 촬영하세요.',fileName:'blueblack-1f-01-entrance.jpg',
    links:[{id:'f1-02',type:'main'}]
  },
  {
    id:'f1-02',floor:1,order:2,code:'1F-02',title:'전면 중앙 분기점',x:48,y:81,angle:-90,priority:'required',role:'junction',
    direction:'펜뷔페 방향',purpose:'입구에서 중앙 통로와 양쪽 구역으로 갈라지는 기준 장면입니다.',
    tip:'전면 스툴과 펜뷔페 통로가 동시에 보이는 중앙에 놓으세요.',fileName:'blueblack-1f-02-front-junction.jpg',
    links:[{id:'f1-03',type:'main'},{id:'f1-10',type:'branch'}]
  },
  {
    id:'f1-03',floor:1,order:3,code:'1F-03',title:'펜뷔페 하단 통로',x:48,y:68,angle:-90,priority:'required',role:'route',
    direction:'매장 안쪽',purpose:'입구와 펜뷔페 중앙 구역을 자연스럽게 연결합니다.',
    tip:'다음 지점인 1F-04 위치가 사진 안에서 보이도록 통로 중심을 맞추세요.',fileName:'blueblack-1f-03-pen-buffet-lower.jpg',
    links:[{id:'f1-04',type:'main'}]
  },
  {
    id:'f1-04',floor:1,order:4,code:'1F-04',title:'펜뷔페·카웨코 사이',x:48,y:52,angle:-90,priority:'required',role:'junction',
    direction:'블랙 아일랜드 방향',purpose:'펜뷔페와 오른쪽 유리 진열장을 함께 보여주는 핵심 교차 장면입니다.',
    tip:'양쪽 진열대 모서리가 과도하게 겹치지 않도록 정중앙에서 촬영하세요.',fileName:'blueblack-1f-04-center-crossing.jpg',
    links:[{id:'f1-05',type:'main'}]
  },
  {
    id:'f1-05',floor:1,order:5,code:'1F-05',title:'블랙 아일랜드·세일러 사이',x:48,y:35,angle:-90,priority:'required',role:'route',
    direction:'상단 잉크 진열벽 방향',purpose:'블랙 디스플레이 아일랜드와 세일러 진열 구역을 연결합니다.',
    tip:'다음 촬영 지점과 양쪽 진열대가 모두 보이게 수평을 맞추세요.',fileName:'blueblack-1f-05-black-island-aisle.jpg',
    links:[{id:'f1-06',type:'main'}]
  },
  {
    id:'f1-06',floor:1,order:6,code:'1F-06',title:'상단 잉크벽 중앙',x:48,y:18,angle:-90,priority:'required',role:'junction',
    direction:'상단 잉크 진열벽 정면',purpose:'매장 안쪽에서 좌측과 우측 동선이 갈라지는 장면입니다.',
    tip:'벽에 너무 가까이 붙지 말고 양쪽 통로 입구가 함께 보이게 촬영하세요.',fileName:'blueblack-1f-06-upper-ink-wall.jpg',
    links:[{id:'f1-07',type:'branch'},{id:'f1-11',type:'main'}]
  },
  {
    id:'f1-07',floor:1,order:7,code:'1F-07',title:'좌측 상단 코너',x:18,y:30,angle:90,priority:'required',role:'junction',
    direction:'좌측 잉크 진열벽 아래쪽',purpose:'상단 잉크벽에서 좌측 진열벽으로 꺾이는 전환 장면입니다.',
    tip:'코너를 너무 바짝 붙이지 말고 앞·뒤 지점이 모두 보이는 위치를 잡으세요.',fileName:'blueblack-1f-07-left-upper-corner.jpg',
    links:[{id:'f1-08',type:'branch'}]
  },
  {
    id:'f1-08',floor:1,order:8,code:'1F-08',title:'좌측 잉크벽 중앙',x:18,y:59,angle:90,priority:'required',role:'route',
    direction:'계산대 방향',purpose:'긴 좌측 잉크 진열벽을 따라 이동하는 장면입니다.',
    tip:'벽과 카메라 사이 간격을 일정하게 유지하고 진열병 수평을 확인하세요.',fileName:'blueblack-1f-08-left-ink-wall.jpg',
    links:[{id:'f1-09',type:'branch'}]
  },
  {
    id:'f1-09',floor:1,order:9,code:'1F-09',title:'좌측 하단 전환 지점',x:18,y:78,angle:90,priority:'optional',role:'junction',
    direction:'계산대와 출입구 방향',purpose:'좌측 잉크벽에서 전면 구역으로 돌아오는 보조 장면입니다.',
    tip:'계산대 화면이나 개인정보가 보이지 않도록 먼저 확인하세요.',fileName:'blueblack-1f-09-left-lower-turn.jpg',
    links:[{id:'f1-10',type:'branch'}]
  },
  {
    id:'f1-10',floor:1,order:10,code:'1F-10',title:'계산대 앞 통로',x:27,y:82,angle:0,priority:'optional',role:'branch',
    direction:'출입구와 중앙 통로 방향',purpose:'계산대 위치를 보여주고 입구 장면으로 되돌아가는 보조 노드입니다.',
    tip:'직원 모니터, 영수증, 개인정보가 노출되지 않게 정리한 뒤 촬영하세요.',fileName:'blueblack-1f-10-counter-front.jpg',
    links:[{id:'f1-01',type:'branch'}]
  },
  {
    id:'f1-11',floor:1,order:11,code:'1F-11',title:'우측 상단 코너',x:84,y:31,angle:90,priority:'required',role:'junction',
    direction:'후면 진열장 아래쪽',purpose:'상단 잉크벽에서 우측 후면 진열장으로 이동하는 전환 장면입니다.',
    tip:'유리 반사에 촬영자가 비치지 않는 각도를 잡으세요.',fileName:'blueblack-1f-11-right-upper-corner.jpg',
    links:[{id:'f1-12',type:'main'}]
  },
  {
    id:'f1-12',floor:1,order:12,code:'1F-12',title:'후면 진열장·후문 통로',x:84,y:67,angle:90,priority:'required',role:'junction',
    direction:'전면 중앙 통로 방향',purpose:'후면 진열장과 후문 구역을 보여주고 전면 동선으로 연결합니다.',
    tip:'후면 진열장 전체가 보이면서 1F-02 방향이 확인되는 위치를 선택하세요.',fileName:'blueblack-1f-12-rear-display-aisle.jpg',
    links:[{id:'f1-02',type:'main'}]
  },

  {
    id:'f2-01',floor:2,order:1,code:'2F-01',title:'2층 출입문 안쪽',x:91,y:26,angle:180,priority:'required',role:'start',
    direction:'상단 메인 통로 왼쪽',purpose:'2층 로드뷰의 시작 장면입니다.',
    tip:'문틀이 크게 보이지 않도록 출입문에서 약 1m 안쪽에 설치하세요.',fileName:'blueblack-2f-01-entrance.jpg',
    links:[{id:'f2-02',type:'main'}]
  },
  {
    id:'f2-02',floor:2,order:2,code:'2F-02',title:'출입구 앞 전환 지점',x:82,y:26,angle:180,priority:'required',role:'junction',
    direction:'상단 벽면 왼쪽',purpose:'출입구에서 우측 벽면과 상단 메인 통로를 연결합니다.',
    tip:'출입문과 다음 촬영 지점이 모두 보이는 위치를 잡으세요.',fileName:'blueblack-2f-02-entry-transition.jpg',
    links:[{id:'f2-03',type:'main'}]
  },
  {
    id:'f2-03',floor:2,order:3,code:'2F-03',title:'상단 우측 통로',x:68,y:26,angle:180,priority:'required',role:'route',
    direction:'상단 중앙 통로',purpose:'오른쪽 브랜드 구역과 상단 중앙 구역을 연결합니다.',
    tip:'벽면과 중앙 진열대 사이 통로의 중심을 유지하세요.',fileName:'blueblack-2f-03-upper-right.jpg',
    links:[{id:'f2-04',type:'main'}]
  },
  {
    id:'f2-04',floor:2,order:4,code:'2F-04',title:'상단 중앙 통로',x:54,y:26,angle:180,priority:'required',role:'junction',
    direction:'상단 왼쪽 통로',purpose:'상단 벽면 전체와 중앙 진열대를 확인하는 핵심 장면입니다.',
    tip:'좌우 벽면이 한쪽으로 치우치지 않게 매장 폭 중앙을 맞추세요.',fileName:'blueblack-2f-04-upper-center.jpg',
    links:[{id:'f2-05',type:'main'}]
  },
  {
    id:'f2-05',floor:2,order:5,code:'2F-05',title:'상단 좌측 분기점',x:38,y:26,angle:180,priority:'required',role:'junction',
    direction:'좌측 상단 코너',purpose:'상단 통로와 중앙 왼쪽 통로가 갈라지는 분기 장면입니다.',
    tip:'좌측 코너와 중앙 교차 지점이 사진 안에서 모두 확인되게 촬영하세요.',fileName:'blueblack-2f-05-upper-left-junction.jpg',
    links:[{id:'f2-06',type:'main'},{id:'f2-10',type:'main'}]
  },
  {
    id:'f2-06',floor:2,order:6,code:'2F-06',title:'좌측 상단 코너',x:17,y:26,angle:90,priority:'required',role:'junction',
    direction:'좌측 벽면 아래쪽',purpose:'상단 벽면에서 좌측 세로 통로로 꺾이는 장면입니다.',
    tip:'코너 가까이 붙지 말고 앞·뒤 촬영 위치가 동시에 보이게 하세요.',fileName:'blueblack-2f-06-left-upper-corner.jpg',
    links:[{id:'f2-07',type:'main'}]
  },
  {
    id:'f2-07',floor:2,order:7,code:'2F-07',title:'좌측 벽면 중앙',x:17,y:50,angle:90,priority:'required',role:'route',
    direction:'좌측 하단',purpose:'좌측 브랜드 진열벽을 따라 이동하는 장면입니다.',
    tip:'벽에 너무 가까이 붙지 말고 진열과 통로를 함께 담으세요.',fileName:'blueblack-2f-07-left-wall-center.jpg',
    links:[{id:'f2-08',type:'branch'}]
  },
  {
    id:'f2-08',floor:2,order:8,code:'2F-08',title:'좌측 하단 코너',x:17,y:73,angle:0,priority:'optional',role:'branch',
    direction:'하단 왼쪽 통로',purpose:'좌측 하단 진열 구역을 보완하는 선택 촬영 장면입니다.',
    tip:'하단 통로가 좁으면 안전한 통행 공간을 먼저 확보하세요.',fileName:'blueblack-2f-08-left-lower-corner.jpg',
    links:[{id:'f2-09',type:'branch'}]
  },
  {
    id:'f2-09',floor:2,order:9,code:'2F-09',title:'잉크 차트·테이블 앞',x:40,y:73,angle:0,priority:'required',role:'junction',
    direction:'하단 중앙 통로',purpose:'실물 컬러차트와 체험 테이블 위치를 안내하는 장면입니다.',
    tip:'테이블 상판 왜곡을 줄이도록 카메라 높이를 1.5m 안팎으로 유지하세요.',fileName:'blueblack-2f-09-ink-chart-table.jpg',
    links:[{id:'f2-10',type:'main'},{id:'f2-15',type:'main'}]
  },
  {
    id:'f2-10',floor:2,order:10,code:'2F-10',title:'중앙 왼쪽 교차 지점',x:40,y:50,angle:0,priority:'required',role:'junction',
    direction:'중앙 통로 오른쪽',purpose:'세일러·파이롯트·플래티넘 구역 사이의 주요 교차 장면입니다.',
    tip:'네 방향 통로가 고르게 보이도록 진열대 모서리에서 조금 떨어져 촬영하세요.',fileName:'blueblack-2f-10-center-left.jpg',
    links:[{id:'f2-11',type:'main'}]
  },
  {
    id:'f2-11',floor:2,order:11,code:'2F-11',title:'중앙 중앙 통로',x:55,y:50,angle:0,priority:'required',role:'route',
    direction:'중앙 오른쪽 교차 지점',purpose:'중앙 진열대 사이를 자연스럽게 이동시키는 연결 장면입니다.',
    tip:'앞뒤 촬영 지점이 모두 사진 안에서 보이는지 확인하세요.',fileName:'blueblack-2f-11-center-aisle.jpg',
    links:[{id:'f2-12',type:'main'}]
  },
  {
    id:'f2-12',floor:2,order:12,code:'2F-12',title:'중앙 오른쪽 교차 지점',x:70,y:50,angle:0,priority:'required',role:'junction',
    direction:'우측 벽면 방향',purpose:'중앙 구역과 우측 브랜드·노트 구역을 연결합니다.',
    tip:'오른쪽 벽면과 하단 통로가 함께 보이도록 촬영하세요.',fileName:'blueblack-2f-12-center-right.jpg',
    links:[{id:'f2-13',type:'main'},{id:'f2-15',type:'main'}]
  },
  {
    id:'f2-13',floor:2,order:13,code:'2F-13',title:'우측 벽면 중앙',x:85,y:50,angle:90,priority:'required',role:'junction',
    direction:'출입구 또는 카운터 방향',purpose:'우측 벽면 구역에서 출입구와 하단 구역으로 갈라지는 장면입니다.',
    tip:'고객 동선과 출입구를 막지 않는 위치에서 촬영하세요.',fileName:'blueblack-2f-13-right-wall-center.jpg',
    links:[{id:'f2-01',type:'main'},{id:'f2-14',type:'branch'}]
  },
  {
    id:'f2-14',floor:2,order:14,code:'2F-14',title:'카운터 앞 통로',x:84,y:75,angle:180,priority:'optional',role:'branch',
    direction:'하단 중앙 통로',purpose:'카운터와 하단 구역을 보완하는 선택 촬영 장면입니다.',
    tip:'모니터, 영수증, 개인정보가 보이지 않도록 정리한 뒤 촬영하세요.',fileName:'blueblack-2f-14-counter-front.jpg',
    links:[{id:'f2-15',type:'branch'}]
  },
  {
    id:'f2-15',floor:2,order:15,code:'2F-15',title:'하단 중앙 통로',x:62,y:73,angle:0,priority:'required',role:'junction',
    direction:'잉크 차트 또는 카운터 방향',purpose:'하단 좌우 구역을 연결해 순간이동처럼 보이는 구간을 줄입니다.',
    tip:'2F-09와 2F-14가 사진 안에서 확인되는 중앙 지점을 선택하세요.',fileName:'blueblack-2f-15-lower-center.jpg',
    links:[]
  }
];

const spotById = new Map(CAPTURE_SPOTS.map((spot) => [spot.id, spot]));
const photos = new Map();
let activeFloor = 1;
let selectedSpotId = CAPTURE_SPOTS[0].id;
let previewUrl = '';
let dbPromise;
let notes = loadNotes();

function ensureStyle(){
  if(document.querySelector('link[data-roadview-capture-v2]'))return;
  const link=document.createElement('link');
  link.rel='stylesheet';
  link.href=new URL('../admin-360-roadview-v2.css?v=2',import.meta.url).href;
  link.dataset.roadviewCaptureV2='true';
  document.head.append(link);
}

function escapeHtml(value=''){
  return String(value).replace(/[&<>'"]/g,(char)=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
}

function formatBytes(bytes=0){
  if(!Number.isFinite(bytes)||bytes<=0)return'0 B';
  const units=['B','KB','MB','GB'];
  const index=Math.min(Math.floor(Math.log(bytes)/Math.log(1024)),units.length-1);
  return`${(bytes/(1024**index)).toFixed(index===0?0:1)} ${units[index]}`;
}

function formatDate(value){
  if(!value)return'';
  try{return new Intl.DateTimeFormat('ko-KR',{year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'}).format(new Date(value));}catch{return'';}
}

function loadNotes(){
  try{const parsed=JSON.parse(localStorage.getItem(NOTE_KEY)||'{}');return parsed&&typeof parsed==='object'?parsed:{}}catch{return{}}
}
function saveNotes(){try{localStorage.setItem(NOTE_KEY,JSON.stringify(notes))}catch{}}

function openDatabase(){
  if(dbPromise)return dbPromise;
  dbPromise=new Promise((resolve,reject)=>{
    if(!('indexedDB'in window)){reject(new Error('이 브라우저는 사진 저장 기능을 지원하지 않습니다.'));return;}
    const request=indexedDB.open(DB_NAME,DB_VERSION);
    request.onupgradeneeded=()=>{const db=request.result;if(!db.objectStoreNames.contains(PHOTO_STORE))db.createObjectStore(PHOTO_STORE,{keyPath:'spotId'});};
    request.onsuccess=()=>resolve(request.result);
    request.onerror=()=>reject(request.error||new Error('사진 저장소를 열지 못했습니다.'));
  });
  return dbPromise;
}

async function getAllPhotos(){
  const db=await openDatabase();
  return new Promise((resolve,reject)=>{const tx=db.transaction(PHOTO_STORE,'readonly');const request=tx.objectStore(PHOTO_STORE).getAll();request.onsuccess=()=>resolve(request.result||[]);request.onerror=()=>reject(request.error||new Error('촬영 사진을 불러오지 못했습니다.'));});
}
async function savePhoto(record){
  const db=await openDatabase();
  return new Promise((resolve,reject)=>{const tx=db.transaction(PHOTO_STORE,'readwrite');tx.objectStore(PHOTO_STORE).put(record);tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error||new Error('사진을 저장하지 못했습니다.'));tx.onabort=()=>reject(tx.error||new Error('사진 저장이 중단되었습니다.'));});
}
async function removePhoto(spotId){
  const db=await openDatabase();
  return new Promise((resolve,reject)=>{const tx=db.transaction(PHOTO_STORE,'readwrite');tx.objectStore(PHOTO_STORE).delete(spotId);tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error||new Error('사진을 삭제하지 못했습니다.'));});
}

async function getImageSize(file){
  if('createImageBitmap'in window){const bitmap=await createImageBitmap(file);const size={width:bitmap.width,height:bitmap.height};bitmap.close?.();return size;}
  return new Promise((resolve,reject)=>{const url=URL.createObjectURL(file);const image=new Image();image.onload=()=>{const result={width:image.naturalWidth,height:image.naturalHeight};URL.revokeObjectURL(url);resolve(result)};image.onerror=()=>{URL.revokeObjectURL(url);reject(new Error('이미지 크기를 확인하지 못했습니다.'))};image.src=url;});
}

function isEquirectangular(record){if(!record?.width||!record?.height)return false;const ratio=record.width/record.height;return ratio>=1.85&&ratio<=2.15;}
function currentSpots(){return CAPTURE_SPOTS.filter((spot)=>spot.floor===activeFloor);}
function photoCount(spots=CAPTURE_SPOTS){return spots.reduce((count,spot)=>count+(photos.has(spot.id)?1:0),0);}
function requiredCount(spots=CAPTURE_SPOTS){return spots.filter((spot)=>spot.priority==='required').length;}
function requiredDoneCount(spots=CAPTURE_SPOTS){return spots.filter((spot)=>spot.priority==='required'&&photos.has(spot.id)).length;}
function roleLabel(role){return{start:'시작점',junction:'분기점',route:'이동점',branch:'보조점'}[role]||'이동점';}
function neighborsFor(spot){
  const result=[];
  spot.links.forEach((link)=>{const target=spotById.get(link.id);if(target)result.push({spot:target,type:link.type});});
  CAPTURE_SPOTS.forEach((candidate)=>candidate.links.forEach((link)=>{if(link.id===spot.id&&!result.some((item)=>item.spot.id===candidate.id))result.push({spot:candidate,type:link.type});}));
  return result.sort((a,b)=>a.spot.order-b.spot.order);
}
function routePairs(spots=currentSpots()){
  const allowed=new Set(spots.map((spot)=>spot.id));
  const pairs=[];const seen=new Set();
  spots.forEach((spot)=>spot.links.forEach((link)=>{
    if(!allowed.has(link.id))return;
    const key=[spot.id,link.id].sort().join('|');
    if(seen.has(key))return;
    seen.add(key);pairs.push({from:spot,to:spotById.get(link.id),type:link.type||'main'});
  }));
  return pairs;
}

function buildPlanner(){
  const grid=document.querySelector('.admin-grid');
  if(!grid||document.querySelector('#store-360-capture'))return;
  const section=document.createElement('section');
  section.className='admin-card full capture-admin-card';
  section.id='store-360-capture';
  section.innerHTML=`
    <div class="admin-card-head capture-admin-head">
      <div><small>ROADVIEW CAPTURE MAP</small><h2>1·2층 로드뷰 촬영 위치도</h2><p>다음 촬영 지점이 눈에 보이도록 연결한 로드뷰용 촬영 경로입니다.</p></div>
      <span class="capture-private-badge">관리자 전용 · 고객 미공개</span>
    </div>
    <div class="capture-notice"><strong>촬영 위치를 로드뷰 이동 기준으로 다시 구성했습니다.</strong><span>실선은 기본 이동 경로, 점선은 보조 구역입니다. 각 위치에서 연결된 다음 지점이 사진 안에 보이도록 촬영하세요.</span></div>
    <div class="capture-roadview-guide">
      <div><b>1</b><span><strong>같은 높이 유지</strong><span>카메라 높이 약 1.5m</span></span></div>
      <div><b>2</b><span><strong>다음 지점 노출</strong><span>앞·뒤 마커 위치가 보여야 함</span></span></div>
      <div><b>3</b><span><strong>2:1 사진 출력</strong><span>DJI Mimo에서 JPG로 저장</span></span></div>
    </div>
    <div class="capture-summary" id="capture-summary"></div>
    <div class="capture-floor-tabs" role="tablist" aria-label="360 촬영 층 선택">
      <button type="button" data-capture-floor="1" role="tab">1층 로드뷰 지도</button>
      <button type="button" data-capture-floor="2" role="tab">2층 로드뷰 지도</button>
    </div>
    <div class="capture-workspace">
      <div class="capture-map-panel">
        <div class="capture-panel-title"><b id="capture-map-title">1층 촬영 위치</b><span>번호 또는 연결선을 따라 순서대로 촬영하세요.</span></div>
        <div class="capture-map-wrap" id="capture-map-wrap"></div>
        <div class="capture-map-legend">
          <span><i class="route"></i>기본 이동 경로</span>
          <span><i class="branch-route"></i>보조 경로</span>
          <span><i class="required"></i>필수 촬영</span>
          <span><i class="optional"></i>선택 촬영</span>
          <span><i class="complete"></i>사진 등록 완료</span>
        </div>
      </div>
      <aside class="capture-detail-panel" id="capture-detail-panel"></aside>
    </div>
    <div class="capture-route-block">
      <div class="capture-panel-title"><b id="capture-list-title">1층 촬영 순서</b><span>번호는 현장 촬영 권장 순서입니다.</span></div>
      <div class="capture-spot-list" id="capture-spot-list"></div>
    </div>
    <div class="capture-storage" id="capture-storage">사진 저장공간을 확인하는 중입니다.</div>
    <input class="hidden-input" id="capture-file-input" type="file" accept="image/jpeg,image/png,image/webp,image/*" />
    <div class="capture-toast" id="capture-toast" role="status" aria-live="polite"></div>`;
  grid.insertBefore(section,grid.firstElementChild);
  addJumpLink();bindPlanner(section);
}

function addJumpLink(){
  const actions=document.querySelector('.admin-header-actions');
  if(!actions||actions.querySelector('[data-capture-jump]'))return;
  const link=document.createElement('a');link.className='admin-link capture-jump-link';link.href='#store-360-capture';link.dataset.captureJump='true';link.textContent='360 촬영';actions.insertBefore(link,actions.firstElementChild);
}

function renderSummary(){
  const host=document.querySelector('#capture-summary');if(!host)return;
  const spots=currentSpots();const required=requiredCount(spots);const done=requiredDoneCount(spots);const percent=Math.round(done/Math.max(1,required)*100);const pairs=routePairs(spots);
  host.innerHTML=`
    <div class="capture-progress-card primary"><span>${activeFloor}층 필수 촬영</span><strong>${done} / ${required}</strong><div class="capture-progress-bar"><i style="width:${percent}%"></i></div></div>
    <div class="capture-progress-card"><span>${activeFloor}층 전체 노드</span><strong>${photoCount(spots)} / ${spots.length}</strong></div>
    <div class="capture-progress-card"><span>로드뷰 이동 연결</span><strong>${pairs.length}개</strong></div>`;
}

function renderFloorTabs(){
  document.querySelectorAll('[data-capture-floor]').forEach((button)=>{const selected=Number(button.dataset.captureFloor)===activeFloor;button.classList.toggle('is-active',selected);button.setAttribute('aria-selected',String(selected));});
  document.querySelector('#capture-map-title').textContent=`${activeFloor}층 로드뷰 촬영 위치`;
  document.querySelector('#capture-list-title').textContent=`${activeFloor}층 촬영 순서`;
}

function routeSvg(spots){
  const pairs=routePairs(spots);
  return `<svg class="capture-route-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${pairs.map((pair)=>{
    const selected=pair.from.id===selectedSpotId||pair.to.id===selectedSpotId;
    return `<line class="capture-route-line ${pair.type==='branch'?'is-branch':''} ${selected?'is-selected':''}" x1="${pair.from.x}" y1="${pair.from.y}" x2="${pair.to.x}" y2="${pair.to.y}" />`;
  }).join('')}</svg>`;
}

function markerHtml(spot){
  const complete=photos.has(spot.id);const selected=selectedSpotId===spot.id;
  const classes=['capture-marker',spot.priority==='required'?'is-required':'is-optional',spot.role==='start'?'is-start':'',spot.role==='junction'?'is-junction':'',complete?'is-complete':'',selected?'is-selected':''].filter(Boolean).join(' ');
  return `<button class="${classes}" type="button" data-capture-spot="${spot.id}" style="left:${spot.x}%;top:${spot.y}%;--capture-angle:${spot.angle}deg" aria-label="${escapeHtml(spot.code)} ${escapeHtml(spot.title)}${complete?', 사진 등록 완료':''}"><span>${spot.order}</span><i aria-hidden="true">➜</i><small class="capture-marker-code">${escapeHtml(spot.code)}</small></button>`;
}

function renderFloorOneMap(spots){
  const map=loadStoreMap();
  const zones=(map?.zones||[]).filter((zone)=>zone.visible!==false).map((zone)=>`<div class="capture-floor1-zone zone-${escapeHtml(zone.type||'brand')}" style="left:${zone.x}%;top:${zone.y}%;width:${zone.w}%;height:${zone.h}%"><span>${escapeHtml(zone.label||'')}</span></div>`).join('');
  return `<div class="capture-map capture-map-floor1" aria-label="1층 로드뷰 촬영 위치 지도"><div class="capture-floor-label">1F · ROADVIEW ROUTE</div>${zones}${routeSvg(spots)}${spots.map(markerHtml).join('')}</div>`;
}
function renderFloorTwoMap(spots){
  return `<div class="capture-map capture-map-floor2" aria-label="2층 로드뷰 촬영 위치 지도"><img src="./store-guide/store-map.svg" alt="블루블랙 펜샵 2층 안내도" /><div class="capture-floor-label">2F · ROADVIEW ROUTE</div>${routeSvg(spots)}${spots.map(markerHtml).join('')}</div>`;
}
function renderMap(){const host=document.querySelector('#capture-map-wrap');if(!host)return;const spots=currentSpots();host.innerHTML=activeFloor===1?renderFloorOneMap(spots):renderFloorTwoMap(spots);}

function renderDetail(){
  const host=document.querySelector('#capture-detail-panel');if(!host)return;
  const spot=spotById.get(selectedSpotId)||currentSpots()[0];if(!spot)return;
  const record=photos.get(spot.id);if(previewUrl){URL.revokeObjectURL(previewUrl);previewUrl='';}
  const statusBadge=record?'<span class="capture-status-badge complete">사진 등록 완료</span>':'<span class="capture-status-badge pending">미등록</span>';
  const priorityBadge=spot.priority==='required'?'<span class="capture-priority-badge required">필수</span>':'<span class="capture-priority-badge optional">선택</span>';
  const roleBadge=`<span class="capture-node-role-badge ${escapeHtml(spot.role)}">${roleLabel(spot.role)}</span>`;
  const connections=neighborsFor(spot);
  const connectionHtml=connections.length?connections.map((item)=>`<button type="button" class="capture-connection-button" data-capture-spot="${item.spot.id}">${escapeHtml(item.spot.code)} · ${escapeHtml(item.spot.title)}</button>`).join(''):'<span>연결 지점 없음</span>';
  let photoArea='';
  if(record?.blob){
    previewUrl=URL.createObjectURL(record.blob);const ratioOk=isEquirectangular(record);
    photoArea=`<div class="capture-photo-preview"><img src="${previewUrl}" alt="${escapeHtml(spot.title)} 등록 사진 미리보기" /><span class="capture-ratio-badge ${ratioOk?'ok':'warn'}">${ratioOk?'2:1 비율 확인':'360 출력 비율 확인 필요'}</span></div><dl class="capture-photo-meta"><div><dt>파일</dt><dd>${escapeHtml(record.name||'사진')}</dd></div><div><dt>크기</dt><dd>${record.width||'-'} × ${record.height||'-'} · ${formatBytes(record.size)}</dd></div><div><dt>등록</dt><dd>${formatDate(record.updatedAt)}</dd></div></dl><div class="capture-photo-actions"><button class="admin-button primary" type="button" data-capture-action="choose">사진 교체</button><button class="admin-button" type="button" data-capture-action="download">사진 내려받기</button><button class="admin-button danger" type="button" data-capture-action="delete">사진 삭제</button></div>`;
  }else{
    photoArea=`<button class="capture-upload-zone" type="button" data-capture-action="choose"><b>이 위치의 360 사진 선택</b><span>DJI Mimo에서 2:1 JPG로 출력한 사진을 올리세요.</span></button><p class="capture-file-hint">권장 파일명: <code>${escapeHtml(spot.fileName)}</code></p>`;
  }
  host.innerHTML=`
    <div class="capture-detail-top"><div><small>${escapeHtml(spot.code)}</small><h3>${escapeHtml(spot.title)}</h3></div><div class="capture-badge-row">${roleBadge}${priorityBadge}${statusBadge}</div></div>
    <div class="capture-direction-card"><span>카메라 첫 시선</span><strong>${escapeHtml(spot.direction)}</strong><p>${escapeHtml(spot.purpose)}</p></div>
    <div class="capture-connections"><b>로드뷰 연결 지점</b><div class="capture-connection-list">${connectionHtml}</div><div class="capture-shot-distance">이 지점에서 연결된 마커 위치가 실제 사진 안에 보이는지 확인하세요. 보이지 않으면 두 지점 사이에 보조 촬영 위치를 하나 더 추가해야 합니다.</div></div>
    <div class="capture-tip-card"><b>현장 팁</b><p>${escapeHtml(spot.tip)}</p></div>
    <label class="capture-note-field"><span>현장 메모</span><textarea id="capture-note" rows="2" maxlength="300" placeholder="예: 다음 위치가 진열대에 가림, 보조 지점 필요">${escapeHtml(notes[spot.id]||'')}</textarea></label>
    <div class="capture-checklist"><b>공통 확인</b><span>모든 지점의 카메라 높이를 일정하게 유지</span><span>수평·노출·화이트밸런스 고정</span><span>고객 얼굴·직원 화면·개인정보 제거</span><span>촬영 후 앞·뒤 연결 지점이 보이는지 확인</span></div>
    <div class="capture-photo-area">${photoArea}</div>`;
}

function renderList(){
  const host=document.querySelector('#capture-spot-list');if(!host)return;
  host.innerHTML=currentSpots().map((spot)=>{const complete=photos.has(spot.id);const selected=selectedSpotId===spot.id;const routeType=spot.priority==='required'?'기본 경로':'보조 경로';return `<button class="capture-spot-row ${complete?'is-complete':''} ${selected?'is-selected':''}" type="button" data-capture-spot="${spot.id}"><span class="capture-spot-number">${spot.order}</span><span class="capture-spot-copy"><b>${escapeHtml(spot.title)}</b><small>${escapeHtml(spot.direction)}</small><em><span class="capture-route-tag ${spot.priority==='required'?'':'branch'}">${routeType}</span><span class="capture-route-tag">${roleLabel(spot.role)}</span></em></span><span class="capture-spot-state">${complete?'완료':spot.priority==='required'?'필수':'선택'}</span></button>`;}).join('');
}

async function renderStorage(){
  const host=document.querySelector('#capture-storage');if(!host)return;
  const bytes=[...photos.values()].reduce((sum,record)=>sum+(record.size||0),0);let suffix='';
  try{if(navigator.storage?.estimate){const estimate=await navigator.storage.estimate();if(estimate.quota)suffix=` · 브라우저 사용 가능 예상 ${formatBytes(Math.max(0,estimate.quota-(estimate.usage||0)))}`;}}catch{}
  host.innerHTML=`<strong>등록 사진 ${photoCount()}장 · ${formatBytes(bytes)}</strong><span>${suffix||'사진은 현재 기기 브라우저에만 저장됩니다.'}</span>`;
}

function renderAll(){
  const spots=currentSpots();if(!spots.some((spot)=>spot.id===selectedSpotId))selectedSpotId=spots[0]?.id||CAPTURE_SPOTS[0].id;
  renderFloorTabs();renderSummary();renderMap();renderDetail();renderList();renderStorage();
}

function showToast(message,tone='default'){
  const node=document.querySelector('#capture-toast');if(!node)return;node.textContent=message;node.dataset.tone=tone;node.classList.add('is-visible');clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>node.classList.remove('is-visible'),2600);
}
async function requestPersistentStorage(){try{if(navigator.storage?.persist)await navigator.storage.persist();}catch{}}

async function handlePhotoFile(file){
  const spot=spotById.get(selectedSpotId);if(!spot||!file)return;
  if(!file.type.startsWith('image/')){showToast('이미지 파일을 선택해 주세요.','error');return;}
  const input=document.querySelector('#capture-file-input');
  try{await requestPersistentStorage();showToast('사진 정보를 확인하는 중입니다.');const{width,height}=await getImageSize(file);const record={spotId:spot.id,floor:spot.floor,name:file.name||spot.fileName,type:file.type||'image/jpeg',size:file.size||0,width,height,updatedAt:Date.now(),blob:file};await savePhoto(record);photos.set(spot.id,record);renderAll();showToast(`${spot.code} 사진을 저장했습니다.`,'success');}
  catch(error){console.error(error);showToast(error?.name==='QuotaExceededError'?'브라우저 저장공간이 부족합니다. 원본을 별도로 보관하고 기존 사진을 정리해 주세요.':error?.message||'사진을 저장하지 못했습니다.','error');}
  finally{if(input)input.value='';}
}

function downloadSelectedPhoto(){
  const spot=spotById.get(selectedSpotId);const record=photos.get(selectedSpotId);if(!spot||!record?.blob)return;
  const url=URL.createObjectURL(record.blob);const link=document.createElement('a');link.href=url;link.download=spot.fileName||record.name||'blueblack-360-photo.jpg';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);
}
async function deleteSelectedPhoto(){
  const spot=spotById.get(selectedSpotId);if(!spot||!photos.has(spot.id))return;if(!confirm(`${spot.code} ${spot.title} 사진을 이 기기에서 삭제할까요?`))return;
  try{await removePhoto(spot.id);photos.delete(spot.id);renderAll();showToast(`${spot.code} 사진을 삭제했습니다.`);}catch(error){console.error(error);showToast('사진을 삭제하지 못했습니다.','error');}
}

function bindPlanner(section){
  const fileInput=section.querySelector('#capture-file-input');
  section.addEventListener('click',(event)=>{
    const floorButton=event.target.closest('[data-capture-floor]');if(floorButton){activeFloor=Number(floorButton.dataset.captureFloor)===2?2:1;selectedSpotId=currentSpots()[0]?.id||selectedSpotId;renderAll();return;}
    const spotButton=event.target.closest('[data-capture-spot]');if(spotButton){selectedSpotId=spotButton.dataset.captureSpot;const spot=spotById.get(selectedSpotId);if(spot)activeFloor=spot.floor;renderAll();document.querySelector('#capture-detail-panel')?.scrollIntoView({behavior:'smooth',block:'nearest'});return;}
    const action=event.target.closest('[data-capture-action]')?.dataset.captureAction;if(action==='choose')fileInput?.click();if(action==='download')downloadSelectedPhoto();if(action==='delete')deleteSelectedPhoto();
  });
  section.addEventListener('input',(event)=>{if(event.target.id!=='capture-note')return;notes[selectedSpotId]=event.target.value;saveNotes();});
  fileInput?.addEventListener('change',()=>handlePhotoFile(fileInput.files?.[0]));
  section.addEventListener('dragover',(event)=>{const zone=event.target.closest('.capture-upload-zone');if(!zone)return;event.preventDefault();zone.classList.add('is-dragging');});
  section.addEventListener('dragleave',(event)=>event.target.closest('.capture-upload-zone')?.classList.remove('is-dragging'));
  section.addEventListener('drop',(event)=>{const zone=event.target.closest('.capture-upload-zone');if(!zone)return;event.preventDefault();zone.classList.remove('is-dragging');handlePhotoFile(event.dataTransfer?.files?.[0]);});
}

async function initialise(){
  ensureStyle();buildPlanner();
  try{const records=await getAllPhotos();records.forEach((record)=>{if(record?.spotId&&spotById.has(record.spotId))photos.set(record.spotId,record);});}catch(error){console.error(error);showToast(error?.message||'사진 저장소를 열지 못했습니다.','error');}
  const requested=new URLSearchParams(location.search).get('captureSpot');if(requested&&spotById.has(requested)){selectedSpotId=requested;activeFloor=spotById.get(requested).floor;}
  renderAll();
  if(location.hash==='#store-360-capture')setTimeout(()=>document.querySelector('#store-360-capture')?.scrollIntoView({behavior:'smooth'}),120);
}

initialise();
