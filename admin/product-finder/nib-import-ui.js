import { readCatalogRows } from './catalog-parser.js';
import { classifyNibCatalogRows } from './nib-extractor.js';
import { nibRpc } from './nib-db-api.js';

const panel = document.querySelector('[data-panel="nib"] .nib-finder');
const toast = document.querySelector('#finderToast');
let analysis = null;

const css = document.createElement('link');
css.rel = 'stylesheet';
css.href = './nib-import.css';
document.head.append(css);

const card = document.createElement('section');
card.className = 'nib-import-card';
card.innerHTML = `<h3>펜촉 상품 데이터 업데이트</h3><p>재고현황 CSV·엑셀에서 상품명과 촉 규격을 자동 분류합니다. 업로드 완료 전에는 기존 DB를 변경하지 않습니다.</p><div class="nib-import-actions"><label class="nib-import-file">재고 파일 선택<input id="nibCatalogFile" type="file" accept=".csv,.txt,.xlsx,.xls"></label><button type="button" class="primary" id="uploadNibCatalog" disabled>분석 결과로 DB 업데이트</button></div><div class="nib-import-status" id="nibImportStatus">파일을 선택하면 자동 분류 건수를 먼저 보여드립니다.</div><div class="nib-analysis" id="nibAnalysis" hidden></div><details class="nib-unresolved" id="nibUnresolved" hidden><summary>촉 규격 미기재 상품 예시 보기</summary><ul></ul></details>`;
panel?.append(card);

const fileInput = card.querySelector('#nibCatalogFile');
const uploadButton = card.querySelector('#uploadNibCatalog');
const status = card.querySelector('#nibImportStatus');
const stats = card.querySelector('#nibAnalysis');
const unresolved = card.querySelector('#nibUnresolved');
const unresolvedList = unresolved.querySelector('ul');

function notify(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(notify.timer);
  notify.timer = setTimeout(() => toast.classList.remove('show'), 2800);
}

function showAnalysis(result) {
  stats.hidden = false;
  stats.innerHTML = `<div><small>만년필 후보</small><strong>${result.fountainPens.length.toLocaleString('ko-KR')}</strong></div><div><small>촉 자동 분류</small><strong>${result.classified.length.toLocaleString('ko-KR')}</strong></div><div><small>촉 미기재</small><strong>${result.unresolved.length.toLocaleString('ko-KR')}</strong></div><div><small>세트·용품 제외</small><strong>${(result.multiNibSets.length + result.excluded.length).toLocaleString('ko-KR')}</strong></div>`;
  unresolvedList.replaceChildren();
  result.unresolved.slice(0, 30).forEach((product) => {
    const item = document.createElement('li');
    item.textContent = `${product.product_name}${product.item_code ? ` · ${product.item_code}` : ''}`;
    unresolvedList.append(item);
  });
  unresolved.hidden = !result.unresolved.length;
}

async function analyze(file) {
  if (!file) return;
  analysis = null;
  uploadButton.disabled = true;
  stats.hidden = true;
  unresolved.hidden = true;
  status.className = 'nib-import-status';
  status.textContent = '파일을 읽고 펜촉 규격을 분석하고 있습니다…';

  try {
    analysis = classifyNibCatalogRows(await readCatalogRows(file));
    if (!analysis.classified.length) throw new Error('자동 분류할 펜촉 상품이 없습니다.');
    showAnalysis(analysis);
    uploadButton.disabled = false;
    status.className = 'nib-import-status success';
    status.textContent = `${analysis.classified.length.toLocaleString('ko-KR')}개 상품의 촉 규격을 확인했습니다.`;
  } catch (error) {
    analysis = null;
    status.className = 'nib-import-status error';
    status.textContent = error.message;
    notify(error.message);
  }
}

async function upload() {
  if (!analysis?.classified?.length) return;
  const products = analysis.classified.map(({ item_code, product_name, location, nib_sizes }) => ({ item_code, product_name, location, nib_sizes }));
  let importId = null;
  uploadButton.disabled = true;

  try {
    status.className = 'nib-import-status';
    status.textContent = '안전한 교체용 업로드 세션을 준비하고 있습니다…';
    importId = await nibRpc('internal_nib_import_start', { p_expected_count: products.length });

    for (let index = 0; index < products.length; index += 200) {
      const batch = products.slice(index, index + 200);
      await nibRpc('internal_nib_import_batch', { p_import_id: importId, p_rows: batch });
      const completed = Math.min(index + batch.length, products.length);
      status.textContent = `업로드 중… ${completed.toLocaleString('ko-KR')} / ${products.length.toLocaleString('ko-KR')}`;
    }

    const count = await nibRpc('internal_nib_import_finish', { p_import_id: importId });
    importId = null;
    status.className = 'nib-import-status success';
    status.textContent = `${Number(count).toLocaleString('ko-KR')}개 펜촉 상품을 비공개 DB에 등록했습니다.`;
    notify('펜촉 상품 DB 업데이트가 완료됐습니다.');
    document.dispatchEvent(new CustomEvent('nib-database-updated'));
  } catch (error) {
    if (importId) nibRpc('internal_nib_import_abort', { p_import_id: importId }).catch(() => {});
    status.className = 'nib-import-status error';
    status.textContent = `업데이트 실패: ${error.message} 기존 DB는 유지됩니다.`;
    notify(error.message);
  } finally {
    uploadButton.disabled = !analysis;
  }
}

fileInput?.addEventListener('change', () => analyze(fileInput.files?.[0]));
uploadButton?.addEventListener('click', upload);
