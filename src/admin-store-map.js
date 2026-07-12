import '../admin/admin-auth.js';
import {loadStoreMap,saveStoreMap,resetStoreMap} from './store-map-config.js';

function escapeHtml(value=''){return String(value).replace(/[&<>'"]/g,(char)=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));}

function buildEditor(){
  const grid=document.querySelector('.admin-grid');
  if(!grid||document.querySelector('#store-map-admin'))return;
  const section=document.createElement('section');
  section.className='admin-card full store-map-admin-card';
  section.id='store-map-admin';
  section.innerHTML=`
    <div class="admin-card-head">
      <div><small>STORE DIRECTORY</small><h2>매장 안내도 관리</h2><p>1층 안내도의 제목과 각 구역명을 수정합니다. 저장 내용은 현재 브라우저에만 적용됩니다.</p></div>
      <a class="admin-button" href="./store-tour/?floor=1" target="_blank" rel="noopener">고객 화면 열기</a>
    </div>
    <div class="store-map-admin-layout">
      <form id="store-map-form" class="store-map-editor-panel">
        <div class="field-grid">
          <div class="field full"><label for="map-title">안내도 제목</label><input id="map-title" type="text" maxlength="60" /></div>
          <div class="field full"><label for="map-subtitle">안내 문구</label><input id="map-subtitle" type="text" maxlength="120" /></div>
          <div class="field full"><label for="map-note">하단 안내 문구</label><input id="map-note" type="text" maxlength="160" /></div>
        </div>
        <div class="store-map-zone-editor" id="store-map-zone-editor"></div>
        <div class="admin-actions">
          <button class="admin-button primary" type="submit">안내도 저장</button>
          <button class="admin-button" type="button" id="store-map-preview">새 창에서 확인</button>
          <button class="admin-button danger" type="button" id="store-map-reset">기본값으로 초기화</button>
        </div>
      </form>
      <div class="store-map-preview-panel">
        <div class="ink-admin-panel-head"><b>미리보기</b><span>입력 즉시 반영됩니다.</span></div>
        <iframe id="store-map-preview-frame" title="1층 안내도 미리보기" src="./store-tour/?floor=1&adminPreview=1"></iframe>
      </div>
    </div>`;
  const backup=document.querySelector('#export-settings')?.closest('.admin-card');
  if(backup)grid.insertBefore(section,backup);else grid.append(section);
  bindEditor();
}

let state=loadStoreMap();

function fill(){
  document.querySelector('#map-title').value=state.title||'';
  document.querySelector('#map-subtitle').value=state.subtitle||'';
  document.querySelector('#map-note').value=state.note||'';
  const host=document.querySelector('#store-map-zone-editor');
  host.innerHTML=state.zones.map((zone)=>`
    <article class="store-map-zone-row" data-zone-id="${escapeHtml(zone.id)}">
      <div class="store-map-zone-name"><b>${escapeHtml(zone.id)}</b><span>${escapeHtml(zone.subLabel||'')}</span></div>
      <label><span>표시 이름</span><input type="text" data-zone-field="label" value="${escapeHtml(zone.label)}" maxlength="50" /></label>
      <label><span>보조 문구</span><input type="text" data-zone-field="subLabel" value="${escapeHtml(zone.subLabel||'')}" maxlength="40" /></label>
      <label class="store-map-visible"><span>표시</span><input type="checkbox" data-zone-field="visible" ${zone.visible!==false?'checked':''} /></label>
    </article>`).join('');
}

function readForm(){
  state.title=document.querySelector('#map-title').value.trim();
  state.subtitle=document.querySelector('#map-subtitle').value.trim();
  state.note=document.querySelector('#map-note').value.trim();
  document.querySelectorAll('.store-map-zone-row').forEach((row)=>{
    const zone=state.zones.find((item)=>item.id===row.dataset.zoneId);if(!zone)return;
    zone.label=row.querySelector('[data-zone-field="label"]').value.trim();
    zone.subLabel=row.querySelector('[data-zone-field="subLabel"]').value.trim();
    zone.visible=row.querySelector('[data-zone-field="visible"]').checked;
  });
}

function refreshPreview(){
  readForm();saveStoreMap(state);
  const frame=document.querySelector('#store-map-preview-frame');
  frame?.contentWindow?.location.reload();
}

function toast(message){
  const node=document.querySelector('#admin-toast');if(!node)return;
  node.textContent=message;node.classList.add('is-visible');setTimeout(()=>node.classList.remove('is-visible'),2200);
}

function bindEditor(){
  fill();
  const form=document.querySelector('#store-map-form');
  form.addEventListener('input',()=>{readForm();saveStoreMap(state)});
  form.addEventListener('submit',(event)=>{event.preventDefault();refreshPreview();toast('매장 안내도를 저장했습니다.')});
  document.querySelector('#store-map-preview').addEventListener('click',()=>window.open('./store-tour/?floor=1','_blank','noopener'));
  document.querySelector('#store-map-reset').addEventListener('click',()=>{
    if(!confirm('1층 안내도 설정을 기본값으로 초기화할까요?'))return;
    state=resetStoreMap();fill();refreshPreview();toast('안내도를 기본값으로 초기화했습니다.');
  });
}

buildEditor();
if(location.hash==='#store-map-admin')setTimeout(()=>document.querySelector('#store-map-admin')?.scrollIntoView({behavior:'smooth'}),100);
setTimeout(()=>import('./admin-organized-v2.js').catch((error)=>console.warn('Admin layout failed',error)),0);