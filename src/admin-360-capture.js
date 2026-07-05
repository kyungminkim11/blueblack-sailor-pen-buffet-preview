import { loadStoreMap } from './store-map-config.js';

const DB_NAME = 'blueblack-360-capture-v1';
const DB_VERSION = 1;
const PHOTO_STORE = 'photos';
const STATUS_KEY = 'blueblack-360-capture-notes-v1';

const CAPTURE_SPOTS = [
  {
    id: 'f1-01', floor: 1, order: 1, code: '1F-01', title: '출입구 안쪽',
    x: 31, y: 87, angle: -90, priority: 'required',
    direction: '매장 안쪽 중앙 통로 방향',
    purpose: '고객이 1층에 들어왔을 때 보게 될 시작 장면입니다.',
    tip: '출입구에서 약 1~1.5m 안쪽에 세우고, 문이 닫힌 상태에서 촬영하세요.',
    fileName: 'blueblack-1f-01-entrance.jpg'
  },
  {
    id: 'f1-02', floor: 1, order: 2, code: '1F-02', title: '전면 중앙 통로',
    x: 48, y: 79, angle: -90, priority: 'required',
    direction: '블랙 아일랜드와 펜뷔페 방향',
    purpose: '입구 장면과 1층 중앙 장면을 자연스럽게 연결합니다.',
    tip: '스툴이나 고객 동선에 너무 붙지 않도록 통로 정중앙을 기준으로 촬영하세요.',
    fileName: 'blueblack-1f-02-front-aisle.jpg'
  },
  {
    id: 'f1-03', floor: 1, order: 3, code: '1F-03', title: '펜뷔페 옆 중앙 통로',
    x: 49, y: 65, angle: -90, priority: 'required',
    direction: '상단 잉크 진열벽 방향',
    purpose: '펜뷔페 아일랜드와 오른쪽 진열장을 한 장면에 담습니다.',
    tip: '펜뷔페 아일랜드 모서리와 유리 진열장 사이의 통로 폭이 균형 있게 보이게 하세요.',
    fileName: 'blueblack-1f-03-pen-buffet-aisle.jpg'
  },
  {
    id: 'f1-04', floor: 1, order: 4, code: '1F-04', title: '블랙 아일랜드 옆 중앙 통로',
    x: 49, y: 39, angle: -90, priority: 'required',
    direction: '상단 잉크 진열벽 방향',
    purpose: '블랙 디스플레이 아일랜드와 주요 유리 진열장을 연결합니다.',
    tip: '아일랜드 정면이 과도하게 가려지지 않도록 통로 중심에서 수평을 맞추세요.',
    fileName: 'blueblack-1f-04-black-island-aisle.jpg'
  },
  {
    id: 'f1-05', floor: 1, order: 5, code: '1F-05', title: '상단 잉크 진열벽 앞',
    x: 49, y: 19, angle: -90, priority: 'required',
    direction: '상단 잉크 진열벽 정면',
    purpose: '1층의 대표적인 잉크 진열벽과 매장 깊이를 보여줍니다.',
    tip: '벽에서 너무 가깝게 촬영하지 말고 진열벽 전체가 자연스럽게 보이는 거리를 확보하세요.',
    fileName: 'blueblack-1f-05-upper-ink-wall.jpg'
  },
  {
    id: 'f1-06', floor: 1, order: 6, code: '1F-06', title: '좌측 잉크 진열벽 중앙',
    x: 18, y: 48, angle: 180, priority: 'required',
    direction: '좌측 잉크 진열벽 정면',
    purpose: '긴 잉크 진열벽을 가까이에서 확인할 수 있는 장면입니다.',
    tip: '카메라와 벽의 거리를 일정하게 두고, 진열병 라인이 기울지 않도록 수평을 확인하세요.',
    fileName: 'blueblack-1f-06-left-ink-wall.jpg'
  },
  {
    id: 'f1-07', floor: 1, order: 7, code: '1F-07', title: '후면 진열장 앞 통로',
    x: 84, y: 48, angle: 0, priority: 'required',
    direction: '후면 진열장 정면',
    purpose: '후면 진열장과 중앙 진열 구역을 함께 확인하는 장면입니다.',
    tip: '진열장 유리에 카메라나 촬영자가 강하게 반사되지 않는 위치를 선택하세요.',
    fileName: 'blueblack-1f-07-rear-display.jpg'
  },
  {
    id: 'f1-08', floor: 1, order: 8, code: '1F-08', title: '후면 이동 지점',
    x: 84, y: 82, angle: 180, priority: 'optional',
    direction: '매장 중앙 방향',
    purpose: '후면에서 입구 쪽으로 돌아보는 보조 연결 장면입니다.',
    tip: '필수 지점을 모두 촬영한 뒤 동선 연결이 끊겨 보일 때 추가로 촬영하세요.',
    fileName: 'blueblack-1f-08-rear-transition.jpg'
  },
  {
    id: 'f2-01', floor: 2, order: 1, code: '2F-01', title: '2층 출입문 안쪽',
    x: 90, y: 26, angle: 180, priority: 'required',
    direction: '매장 왼쪽 메인 통로 방향',
    purpose: '2층에 들어온 고객의 첫 장면이 되는 기준 위치입니다.',
    tip: '출입문을 지나 약 1m 안쪽에서 촬영하고, 문틀이 지나치게 크게 보이지 않게 하세요.',
    fileName: 'blueblack-2f-01-entrance.jpg'
  },
  {
    id: 'f2-02', floor: 2, order: 2, code: '2F-02', title: '상단 우측 통로',
    x: 81, y: 27, angle: 180, priority: 'required',
    direction: '상단 벽면과 중앙 진열대 방향',
    purpose: '출입문 장면을 중앙 전시 구역으로 연결합니다.',
    tip: '벽면 진열과 중앙 진열대 사이 통로의 중심에 카메라를 놓으세요.',
    fileName: 'blueblack-2f-02-upper-right-aisle.jpg'
  },
  {
    id: 'f2-03', floor: 2, order: 3, code: '2F-03', title: '상단 중앙 통로',
    x: 55, y: 27, angle: 180, priority: 'required',
    direction: '상단 브랜드 벽면 방향',
    purpose: '상단 벽면 브랜드와 2층 전체 폭을 보여주는 핵심 장면입니다.',
    tip: '벽면 진열이 한쪽으로 쏠리지 않도록 매장 폭의 중앙을 맞추세요.',
    fileName: 'blueblack-2f-03-upper-center-aisle.jpg'
  },
  {
    id: 'f2-04', floor: 2, order: 4, code: '2F-04', title: '좌측 벽면 중앙 통로',
    x: 17, y: 49, angle: 180, priority: 'required',
    direction: '좌측 브랜드 진열벽 정면',
    purpose: '좌측 세로 진열 구역과 중앙 진열대를 함께 확인합니다.',
    tip: '벽에 너무 붙지 말고 왼쪽 진열 전체와 통로가 함께 보이는 위치를 잡으세요.',
    fileName: 'blueblack-2f-04-left-wall-aisle.jpg'
  },
  {
    id: 'f2-05', floor: 2, order: 5, code: '2F-05', title: '중앙 왼쪽 교차 지점',
    x: 40, y: 49, angle: 0, priority: 'required',
    direction: '중앙 진열대와 오른쪽 구역 방향',
    purpose: '세일러·파이롯트·플래티넘 구역 사이를 연결하는 장면입니다.',
    tip: '진열대 모서리에 너무 가까이 붙지 말고 네 방향 통로가 고르게 보이게 촬영하세요.',
    fileName: 'blueblack-2f-05-center-left.jpg'
  },
  {
    id: 'f2-06', floor: 2, order: 6, code: '2F-06', title: '중앙 오른쪽 교차 지점',
    x: 70, y: 49, angle: 0, priority: 'required',
    direction: '오른쪽 브랜드·노트 구역 방향',
    purpose: '중앙 진열대와 오른쪽 브랜드 구역의 이동 연결점을 만듭니다.',
    tip: '오른쪽 벽면과 중앙 테이블이 동시에 보이도록 약간 넓은 통로 중앙에서 촬영하세요.',
    fileName: 'blueblack-2f-06-center-right.jpg'
  },
  {
    id: 'f2-07', floor: 2, order: 7, code: '2F-07', title: '잉크 차트·테이블 앞',
    x: 42, y: 72, angle: 90, priority: 'required',
    direction: '잉크 차트와 테이블 방향',
    purpose: '2층 체험 테이블과 실물 컬러차트 위치를 안내합니다.',
    tip: '테이블 상판이 과도하게 왜곡되지 않도록 카메라 높이를 1.5m 안팎으로 유지하세요.',
    fileName: 'blueblack-2f-07-ink-chart-table.jpg'
  },
  {
    id: 'f2-08', floor: 2, order: 8, code: '2F-08', title: '카운터 앞 통로',
    x: 83, y: 75, angle: 90, priority: 'optional',
    direction: '카운터와 매장 중앙 방향',
    purpose: '카운터 위치와 하단 구역을 보완하는 마무리 장면입니다.',
    tip: '직원 모니터, 영수증, 개인정보가 보이지 않도록 화면과 서류를 먼저 정리하세요.',
    fileName: 'blueblack-2f-08-counter-front.jpg'
  }
];

const spotById = new Map(CAPTURE_SPOTS.map((spot) => [spot.id, spot]));
const photos = new Map();
let activeFloor = 1;
let selectedSpotId = CAPTURE_SPOTS[0].id;
let previewUrl = '';
let dbPromise;
let notes = loadNotes();

function escapeHtml(value = '') {
  return String(value).replace(/[&<>'"]/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[char]));
}

function formatBytes(bytes = 0) {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / (1024 ** index)).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

function formatDate(value) {
  if (!value) return '';
  try {
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
    }).format(new Date(value));
  } catch {
    return '';
  }
}

function loadNotes() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STATUS_KEY) || '{}');
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function saveNotes() {
  localStorage.setItem(STATUS_KEY, JSON.stringify(notes));
}

function openDatabase() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject(new Error('이 브라우저는 사진 저장 기능을 지원하지 않습니다.'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(PHOTO_STORE)) {
        db.createObjectStore(PHOTO_STORE, { keyPath: 'spotId' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('사진 저장소를 열지 못했습니다.'));
  });
  return dbPromise;
}

async function getAllPhotos() {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(PHOTO_STORE, 'readonly');
    const request = transaction.objectStore(PHOTO_STORE).getAll();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error || new Error('촬영 사진을 불러오지 못했습니다.'));
  });
}

async function savePhoto(record) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(PHOTO_STORE, 'readwrite');
    transaction.objectStore(PHOTO_STORE).put(record);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error || new Error('사진을 저장하지 못했습니다.'));
    transaction.onabort = () => reject(transaction.error || new Error('사진 저장이 중단되었습니다.'));
  });
}

async function removePhoto(spotId) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(PHOTO_STORE, 'readwrite');
    transaction.objectStore(PHOTO_STORE).delete(spotId);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error || new Error('사진을 삭제하지 못했습니다.'));
  });
}

async function getImageSize(file) {
  if ('createImageBitmap' in window) {
    const bitmap = await createImageBitmap(file);
    const size = { width: bitmap.width, height: bitmap.height };
    bitmap.close?.();
    return size;
  }
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      const result = { width: image.naturalWidth, height: image.naturalHeight };
      URL.revokeObjectURL(url);
      resolve(result);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('이미지 크기를 확인하지 못했습니다.'));
    };
    image.src = url;
  });
}

function isEquirectangular(record) {
  if (!record?.width || !record?.height) return false;
  const ratio = record.width / record.height;
  return ratio >= 1.85 && ratio <= 2.15;
}

function currentSpots() {
  return CAPTURE_SPOTS.filter((spot) => spot.floor === activeFloor);
}

function photoCount(spots = CAPTURE_SPOTS) {
  return spots.reduce((count, spot) => count + (photos.has(spot.id) ? 1 : 0), 0);
}

function requiredCount(spots = CAPTURE_SPOTS) {
  return spots.filter((spot) => spot.priority === 'required').length;
}

function requiredDoneCount(spots = CAPTURE_SPOTS) {
  return spots.filter((spot) => spot.priority === 'required' && photos.has(spot.id)).length;
}

function buildPlanner() {
  const grid = document.querySelector('.admin-grid');
  if (!grid || document.querySelector('#store-360-capture')) return;

  const section = document.createElement('section');
  section.className = 'admin-card full capture-admin-card';
  section.id = 'store-360-capture';
  section.innerHTML = `
    <div class="admin-card-head capture-admin-head">
      <div>
        <small>360 CAPTURE PLAN</small>
        <h2>1·2층 360 촬영 준비</h2>
        <p>지도에 표시된 번호 순서대로 촬영하고, 각 위치에 결과 사진을 연결하세요.</p>
      </div>
      <span class="capture-private-badge">관리자 전용 · 고객 미공개</span>
    </div>

    <div class="capture-notice">
      <strong>지금 올리는 사진은 고객용 지도에 표시되지 않습니다.</strong>
      <span>원본은 이 브라우저의 기기 저장소에만 보관됩니다. 다른 휴대폰·PC와 자동 동기화되지 않으므로 카메라 원본도 별도로 보관하세요.</span>
    </div>

    <div class="capture-summary" id="capture-summary"></div>

    <div class="capture-floor-tabs" role="tablist" aria-label="360 촬영 층 선택">
      <button type="button" data-capture-floor="1" role="tab">1층 촬영 지도</button>
      <button type="button" data-capture-floor="2" role="tab">2층 촬영 지도</button>
    </div>

    <div class="capture-workspace">
      <div class="capture-map-panel">
        <div class="capture-panel-title"><b id="capture-map-title">1층 촬영 위치</b><span>번호를 누르면 촬영 안내와 사진 업로드가 열립니다.</span></div>
        <div class="capture-map-wrap" id="capture-map-wrap"></div>
        <div class="capture-map-legend">
          <span><i class="required"></i>필수 촬영</span>
          <span><i class="optional"></i>보조 촬영</span>
          <span><i class="complete"></i>사진 등록 완료</span>
        </div>
      </div>

      <aside class="capture-detail-panel" id="capture-detail-panel"></aside>
    </div>

    <div class="capture-route-block">
      <div class="capture-panel-title"><b id="capture-list-title">1층 촬영 순서</b><span>지도 번호와 같은 순서입니다.</span></div>
      <div class="capture-spot-list" id="capture-spot-list"></div>
    </div>

    <div class="capture-storage" id="capture-storage">사진 저장공간을 확인하는 중입니다.</div>
    <input class="hidden-input" id="capture-file-input" type="file" accept="image/jpeg,image/png,image/webp,image/*" />
    <div class="capture-toast" id="capture-toast" role="status" aria-live="polite"></div>
  `;

  grid.insertBefore(section, grid.firstElementChild);
  addJumpLink();
  bindPlanner(section);
}

function addJumpLink() {
  const actions = document.querySelector('.admin-header-actions');
  if (!actions || actions.querySelector('[data-capture-jump]')) return;
  const link = document.createElement('a');
  link.className = 'admin-link capture-jump-link';
  link.href = '#store-360-capture';
  link.dataset.captureJump = 'true';
  link.textContent = '360 촬영';
  actions.insertBefore(link, actions.firstElementChild);
}

function renderSummary() {
  const host = document.querySelector('#capture-summary');
  if (!host) return;
  const floorSpots = currentSpots();
  const allDone = photoCount();
  const floorDone = photoCount(floorSpots);
  const floorRequiredDone = requiredDoneCount(floorSpots);
  const floorRequired = requiredCount(floorSpots);
  const percent = Math.round((floorRequiredDone / Math.max(1, floorRequired)) * 100);
  host.innerHTML = `
    <div class="capture-progress-card primary">
      <span>${activeFloor}층 필수 촬영</span>
      <strong>${floorRequiredDone} / ${floorRequired}</strong>
      <div class="capture-progress-bar"><i style="width:${percent}%"></i></div>
    </div>
    <div class="capture-progress-card"><span>${activeFloor}층 사진 등록</span><strong>${floorDone} / ${floorSpots.length}</strong></div>
    <div class="capture-progress-card"><span>전체 사진 등록</span><strong>${allDone} / ${CAPTURE_SPOTS.length}</strong></div>
  `;
}

function renderFloorTabs() {
  document.querySelectorAll('[data-capture-floor]').forEach((button) => {
    const selected = Number(button.dataset.captureFloor) === activeFloor;
    button.classList.toggle('is-active', selected);
    button.setAttribute('aria-selected', String(selected));
  });
  const mapTitle = document.querySelector('#capture-map-title');
  const listTitle = document.querySelector('#capture-list-title');
  if (mapTitle) mapTitle.textContent = `${activeFloor}층 촬영 위치`;
  if (listTitle) listTitle.textContent = `${activeFloor}층 촬영 순서`;
}

function markerHtml(spot) {
  const complete = photos.has(spot.id);
  const selected = selectedSpotId === spot.id;
  const classes = [
    'capture-marker',
    spot.priority === 'required' ? 'is-required' : 'is-optional',
    complete ? 'is-complete' : '',
    selected ? 'is-selected' : ''
  ].filter(Boolean).join(' ');
  return `
    <button class="${classes}" type="button" data-capture-spot="${spot.id}" style="left:${spot.x}%;top:${spot.y}%;--capture-angle:${spot.angle}deg" aria-label="${escapeHtml(spot.code)} ${escapeHtml(spot.title)}${complete ? ', 사진 등록 완료' : ''}">
      <span>${spot.order}</span><i aria-hidden="true">➜</i>
    </button>
  `;
}

function renderFloorOneMap(spots) {
  const map = loadStoreMap();
  const zones = (map?.zones || []).filter((zone) => zone.visible !== false).map((zone) => `
    <div class="capture-floor1-zone zone-${escapeHtml(zone.type || 'brand')}" style="left:${zone.x}%;top:${zone.y}%;width:${zone.w}%;height:${zone.h}%">
      <span>${escapeHtml(zone.label || '')}</span>
    </div>
  `).join('');
  return `
    <div class="capture-map capture-map-floor1" aria-label="1층 360 촬영 위치 지도">
      <div class="capture-floor-label">1F · 360 CAPTURE</div>
      ${zones}
      ${spots.map(markerHtml).join('')}
    </div>
  `;
}

function renderFloorTwoMap(spots) {
  return `
    <div class="capture-map capture-map-floor2" aria-label="2층 360 촬영 위치 지도">
      <img src="./store-guide/store-map.svg" alt="블루블랙 펜샵 2층 안내도" />
      <div class="capture-floor-label">2F · 360 CAPTURE</div>
      ${spots.map(markerHtml).join('')}
    </div>
  `;
}

function renderMap() {
  const host = document.querySelector('#capture-map-wrap');
  if (!host) return;
  const spots = currentSpots();
  host.innerHTML = activeFloor === 1 ? renderFloorOneMap(spots) : renderFloorTwoMap(spots);
}

function renderDetail() {
  const host = document.querySelector('#capture-detail-panel');
  if (!host) return;
  const spot = spotById.get(selectedSpotId) || currentSpots()[0];
  if (!spot) return;
  const record = photos.get(spot.id);
  if (previewUrl) {
    URL.revokeObjectURL(previewUrl);
    previewUrl = '';
  }

  const statusBadge = record
    ? '<span class="capture-status-badge complete">사진 등록 완료</span>'
    : '<span class="capture-status-badge pending">미등록</span>';
  const priorityBadge = spot.priority === 'required'
    ? '<span class="capture-priority-badge required">필수</span>'
    : '<span class="capture-priority-badge optional">보조</span>';

  let photoArea;
  if (record?.blob) {
    previewUrl = URL.createObjectURL(record.blob);
    const ratioText = isEquirectangular(record) ? '2:1 비율 확인' : '360 출력 비율 확인 필요';
    const ratioClass = isEquirectangular(record) ? 'ok' : 'warn';
    photoArea = `
      <div class="capture-photo-preview">
        <img src="${previewUrl}" alt="${escapeHtml(spot.title)} 등록 사진 미리보기" />
        <span class="capture-ratio-badge ${ratioClass}">${ratioText}</span>
      </div>
      <dl class="capture-photo-meta">
        <div><dt>파일</dt><dd>${escapeHtml(record.name || '사진')}</dd></div>
        <div><dt>크기</dt><dd>${record.width || '-'} × ${record.height || '-'} · ${formatBytes(record.size)}</dd></div>
        <div><dt>등록</dt><dd>${formatDate(record.updatedAt)}</dd></div>
      </dl>
      <div class="capture-photo-actions">
        <button class="admin-button primary" type="button" data-capture-action="choose">사진 교체</button>
        <button class="admin-button" type="button" data-capture-action="download">사진 내려받기</button>
        <button class="admin-button danger" type="button" data-capture-action="delete">사진 삭제</button>
      </div>
    `;
  } else {
    photoArea = `
      <button class="capture-upload-zone" type="button" data-capture-action="choose">
        <b>이 위치의 360 사진 선택</b>
        <span>DJI Mimo에서 360 사진으로 출력한 JPG 파일을 올리세요.</span>
      </button>
      <p class="capture-file-hint">권장 파일명: <code>${escapeHtml(spot.fileName)}</code></p>
    `;
  }

  host.innerHTML = `
    <div class="capture-detail-top">
      <div><small>${escapeHtml(spot.code)}</small><h3>${escapeHtml(spot.title)}</h3></div>
      <div class="capture-badge-row">${priorityBadge}${statusBadge}</div>
    </div>
    <div class="capture-direction-card">
      <span>촬영 방향</span>
      <strong>${escapeHtml(spot.direction)}</strong>
      <p>${escapeHtml(spot.purpose)}</p>
    </div>
    <div class="capture-tip-card"><b>현장 팁</b><p>${escapeHtml(spot.tip)}</p></div>
    <label class="capture-note-field">
      <span>현장 메모</span>
      <textarea id="capture-note" rows="2" maxlength="300" placeholder="예: 손님 이동 후 재촬영, 조명 반사 확인">${escapeHtml(notes[spot.id] || '')}</textarea>
    </label>
    <div class="capture-checklist">
      <b>공통 확인</b>
      <span>카메라 높이 약 1.4~1.6m</span>
      <span>수평·노출·화이트밸런스 고정</span>
      <span>고객 얼굴·직원 화면·개인정보 제거</span>
      <span>셀프타이머 후 카메라 시야 밖으로 이동</span>
    </div>
    <div class="capture-photo-area">${photoArea}</div>
  `;
}

function renderList() {
  const host = document.querySelector('#capture-spot-list');
  if (!host) return;
  host.innerHTML = currentSpots().map((spot) => {
    const complete = photos.has(spot.id);
    const selected = selectedSpotId === spot.id;
    return `
      <button class="capture-spot-row ${complete ? 'is-complete' : ''} ${selected ? 'is-selected' : ''}" type="button" data-capture-spot="${spot.id}">
        <span class="capture-spot-number">${spot.order}</span>
        <span class="capture-spot-copy"><b>${escapeHtml(spot.title)}</b><small>${escapeHtml(spot.direction)}</small></span>
        <span class="capture-spot-state">${complete ? '완료' : spot.priority === 'required' ? '필수' : '보조'}</span>
      </button>
    `;
  }).join('');
}

async function renderStorage() {
  const host = document.querySelector('#capture-storage');
  if (!host) return;
  const storedBytes = [...photos.values()].reduce((sum, record) => sum + (record.size || 0), 0);
  let suffix = '';
  try {
    if (navigator.storage?.estimate) {
      const estimate = await navigator.storage.estimate();
      if (estimate.quota) {
        suffix = ` · 브라우저 사용 가능 예상 ${formatBytes(Math.max(0, estimate.quota - (estimate.usage || 0)))}`;
      }
    }
  } catch {
    suffix = '';
  }
  host.innerHTML = `<strong>현재 등록 사진 ${photoCount()}장 · ${formatBytes(storedBytes)}</strong><span>${suffix || '브라우저 저장공간은 기기 환경에 따라 달라집니다.'}</span>`;
}

function renderAll() {
  const floorSpots = currentSpots();
  if (!floorSpots.some((spot) => spot.id === selectedSpotId)) {
    selectedSpotId = floorSpots[0]?.id || CAPTURE_SPOTS[0].id;
  }
  renderFloorTabs();
  renderSummary();
  renderMap();
  renderDetail();
  renderList();
  renderStorage();
}

function showToast(message, tone = 'default') {
  const node = document.querySelector('#capture-toast');
  if (!node) return;
  node.textContent = message;
  node.dataset.tone = tone;
  node.classList.add('is-visible');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => node.classList.remove('is-visible'), 2600);
}

async function requestPersistentStorage() {
  try {
    if (navigator.storage?.persist) await navigator.storage.persist();
  } catch {
    // 브라우저가 지원하지 않아도 사진 업로드는 계속 진행합니다.
  }
}

async function handlePhotoFile(file) {
  const spot = spotById.get(selectedSpotId);
  if (!spot || !file) return;
  if (!file.type.startsWith('image/')) {
    showToast('이미지 파일을 선택해 주세요.', 'error');
    return;
  }

  const input = document.querySelector('#capture-file-input');
  try {
    await requestPersistentStorage();
    showToast('사진 정보를 확인하는 중입니다.');
    const { width, height } = await getImageSize(file);
    const record = {
      spotId: spot.id,
      floor: spot.floor,
      name: file.name || spot.fileName,
      type: file.type || 'image/jpeg',
      size: file.size || 0,
      width,
      height,
      updatedAt: Date.now(),
      blob: file
    };
    await savePhoto(record);
    photos.set(spot.id, record);
    renderAll();
    showToast(`${spot.code} 사진을 저장했습니다.`, 'success');
  } catch (error) {
    console.error(error);
    const quotaMessage = error?.name === 'QuotaExceededError'
      ? '브라우저 저장공간이 부족합니다. 원본을 별도로 보관한 뒤 기존 사진을 정리해 주세요.'
      : (error?.message || '사진을 저장하지 못했습니다.');
    showToast(quotaMessage, 'error');
  } finally {
    if (input) input.value = '';
  }
}

function downloadSelectedPhoto() {
  const spot = spotById.get(selectedSpotId);
  const record = photos.get(selectedSpotId);
  if (!spot || !record?.blob) return;
  const url = URL.createObjectURL(record.blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = spot.fileName || record.name || 'blueblack-360-photo.jpg';
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

async function deleteSelectedPhoto() {
  const spot = spotById.get(selectedSpotId);
  if (!spot || !photos.has(spot.id)) return;
  if (!confirm(`${spot.code} ${spot.title} 사진을 이 기기에서 삭제할까요?`)) return;
  try {
    await removePhoto(spot.id);
    photos.delete(spot.id);
    renderAll();
    showToast(`${spot.code} 사진을 삭제했습니다.`);
  } catch (error) {
    console.error(error);
    showToast('사진을 삭제하지 못했습니다.', 'error');
  }
}

function bindPlanner(section) {
  const fileInput = section.querySelector('#capture-file-input');

  section.addEventListener('click', (event) => {
    const floorButton = event.target.closest('[data-capture-floor]');
    if (floorButton) {
      activeFloor = Number(floorButton.dataset.captureFloor) === 2 ? 2 : 1;
      selectedSpotId = currentSpots()[0]?.id || selectedSpotId;
      renderAll();
      return;
    }

    const spotButton = event.target.closest('[data-capture-spot]');
    if (spotButton) {
      selectedSpotId = spotButton.dataset.captureSpot;
      const spot = spotById.get(selectedSpotId);
      if (spot) activeFloor = spot.floor;
      renderAll();
      document.querySelector('#capture-detail-panel')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      return;
    }

    const action = event.target.closest('[data-capture-action]')?.dataset.captureAction;
    if (action === 'choose') fileInput?.click();
    if (action === 'download') downloadSelectedPhoto();
    if (action === 'delete') deleteSelectedPhoto();
  });

  section.addEventListener('input', (event) => {
    if (event.target.id !== 'capture-note') return;
    notes[selectedSpotId] = event.target.value;
    saveNotes();
  });

  fileInput?.addEventListener('change', () => handlePhotoFile(fileInput.files?.[0]));

  section.addEventListener('dragover', (event) => {
    if (!event.target.closest('.capture-upload-zone')) return;
    event.preventDefault();
    event.target.closest('.capture-upload-zone').classList.add('is-dragging');
  });
  section.addEventListener('dragleave', (event) => {
    event.target.closest('.capture-upload-zone')?.classList.remove('is-dragging');
  });
  section.addEventListener('drop', (event) => {
    const zone = event.target.closest('.capture-upload-zone');
    if (!zone) return;
    event.preventDefault();
    zone.classList.remove('is-dragging');
    handlePhotoFile(event.dataTransfer?.files?.[0]);
  });
}

async function initialise() {
  buildPlanner();
  try {
    const records = await getAllPhotos();
    records.forEach((record) => {
      if (record?.spotId && spotById.has(record.spotId)) photos.set(record.spotId, record);
    });
  } catch (error) {
    console.error(error);
    showToast(error?.message || '사진 저장소를 열지 못했습니다.', 'error');
  }

  const hashSpot = new URLSearchParams(location.search).get('captureSpot');
  if (hashSpot && spotById.has(hashSpot)) {
    selectedSpotId = hashSpot;
    activeFloor = spotById.get(hashSpot).floor;
  }
  renderAll();
  if (location.hash === '#store-360-capture') {
    setTimeout(() => document.querySelector('#store-360-capture')?.scrollIntoView({ behavior: 'smooth' }), 120);
  }
}

initialise();
