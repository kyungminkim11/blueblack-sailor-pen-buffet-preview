import {
  clearAccessToken,
  fetchCatalogStatus,
  getAccessToken,
  hasAccessToken,
  setAccessToken
} from './catalog-db.js';

let authorized = false;

const dbStatus = document.querySelector('#dbStatus');
const accessDialog = document.querySelector('#accessDialog');
const accessKey = document.querySelector('#accessKey');
const unlockAccess = document.querySelector('#unlockAccess');
const accessError = document.querySelector('#accessError');

export function isAuthorized() {
  return authorized && hasAccessToken();
}

export function updateDatabaseStatus(status) {
  if (!authorized) {
    dbStatus.classList.remove('ready');
    dbStatus.innerHTML = '<span></span><strong>접근 잠김</strong><small>관리자 접근키가 필요합니다.</small>';
    return;
  }

  const count = Number(status?.item_count || 0);
  const sourceDate = status?.source_date ? ` · ${status.source_date} 기준` : '';
  const updated = status?.updated_at
    ? new Date(status.updated_at).toLocaleString('ko-KR')
    : '업데이트 기록 없음';

  dbStatus.classList.toggle('ready', count > 0);
  dbStatus.innerHTML = `<span></span><strong>${count.toLocaleString('ko-KR')}개 상품${sourceDate}</strong><small>Supabase 비공개 DB · ${updated}</small>`;
}

export function openAccessDialog(message = '') {
  authorized = false;
  accessError.textContent = message;
  if (!accessDialog.open) accessDialog.showModal();
  setTimeout(() => accessKey.focus(), 50);
}

async function verifyAccess(token) {
  const status = await fetchCatalogStatus(token);
  setAccessToken(token);
  authorized = true;
  updateDatabaseStatus(status);
  return status;
}

async function unlock() {
  const token = accessKey.value.trim();
  if (!token) {
    accessError.textContent = '관리자 접근키를 입력해 주세요.';
    return;
  }

  unlockAccess.disabled = true;
  accessError.textContent = '접근 권한을 확인하고 있습니다.';

  try {
    const status = await verifyAccess(token);
    accessDialog.close();
    accessKey.value = '';
    accessError.textContent = '';
    document.dispatchEvent(new CustomEvent('product-access-ready', { detail: status }));
  } catch (error) {
    clearAccessToken();
    accessError.textContent = error.message || '접근키를 확인하지 못했습니다.';
  } finally {
    unlockAccess.disabled = false;
  }
}

export function forgetAccess() {
  clearAccessToken();
  authorized = false;
  updateDatabaseStatus(null);
  openAccessDialog('새 관리자 접근키를 입력해 주세요.');
}

export async function initializeAccess() {
  unlockAccess.addEventListener('click', unlock);
  accessKey.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      unlock();
    }
  });

  updateDatabaseStatus(null);

  if (!hasAccessToken()) {
    openAccessDialog();
    return null;
  }

  try {
    const status = await verifyAccess(getAccessToken());
    document.dispatchEvent(new CustomEvent('product-access-ready', { detail: status }));
    return status;
  } catch {
    clearAccessToken();
    openAccessDialog('저장된 접근키를 확인하지 못했습니다. 다시 입력해 주세요.');
    return null;
  }
}
