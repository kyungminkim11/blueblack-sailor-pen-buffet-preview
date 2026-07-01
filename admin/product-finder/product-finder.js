import { isAuthorized, showToast } from './product-finder-ui.js';
import './product-finder-scan.js';

const openImport = document.querySelector('#openImport');
const importDialog = document.querySelector('#importDialog');
const accessDialog = document.querySelector('#accessDialog');

openImport.addEventListener('click', () => {
  if (isAuthorized()) {
    importDialog.showModal();
    return;
  }
  accessDialog.showModal();
  showToast('관리자 접근키를 먼저 입력해 주세요.');
});
