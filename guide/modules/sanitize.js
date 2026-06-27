const exportButton = document.querySelector('#export-log');
if (exportButton) {
  exportButton.hidden = new URLSearchParams(location.search).get('admin') !== '1';
}
const storeHourItems = document.querySelectorAll('.store-card li');
if (storeHourItems.length >= 3) {
  storeHourItems[2].textContent = '일요일 정기휴무 · 공휴일 운영 별도 확인';
}
const internalFooterLink = document.querySelector('footer a[href*="app.notion.com"]');
if (internalFooterLink) internalFooterLink.hidden = true;

export function escapeHtml(value='') {
  return String(value).replace(/[&<>'"]/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
}
export function safeText(value='', max=500) {
  return String(value).replace(/[\u0000-\u001F\u007F]/g, ' ').trim().slice(0, max);
}
