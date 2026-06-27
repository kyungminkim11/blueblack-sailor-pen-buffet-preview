import { parts } from './data.js';
import { getLanguage } from './i18n-v3.js';

const TOUCHED_KEY = 'blueblack-pen-completed-parts';
const copy = {
  ko: { progress:'선택 완료', shareTitle:'현재 조합을 휴대폰으로 가져가기', shareCopy:'QR 코드를 스캔하면 같은 색상 조합이 그대로 열립니다.', scan:'휴대폰 카메라로 QR 코드를 스캔해 주세요.', copy:'링크 복사', copied:'조합 링크를 복사했습니다.', qrError:'QR 코드를 만들지 못했습니다. 링크 복사를 이용해 주세요.', staffCheck:'실물 파츠 확인', staffReturn:'고객 화면으로 돌아가기', imageTitle:'나의 세일러 펜뷔페 조합', imageNotice:'화면 색상은 실제 파츠와 다를 수 있습니다. 최종 선택 전 매장 실물을 확인해 주세요.', saved:'조합 이미지를 저장했습니다.' },
  en: { progress:'Completed', shareTitle:'Open this combination on your phone', shareCopy:'Scan the QR code to open the same color combination.', scan:'Scan this QR code with your phone camera.', copy:'Copy link', copied:'Combination link copied.', qrError:'The QR code could not be created. Please copy the link.', staffCheck:'Physical part check', staffReturn:'Return to customer view', imageTitle:'My Sailor Pen Buffet Combination', imageNotice:'Screen colors may differ from the actual parts. Please confirm the physical parts in store.', saved:'Combination image saved.' },
  ja: { progress:'選択完了', shareTitle:'この組み合わせをスマートフォンで開く', shareCopy:'QRコードを読み取ると、同じ色の組み合わせが開きます。', scan:'スマートフォンのカメラでQRコードを読み取ってください。', copy:'リンクをコピー', copied:'組み合わせリンクをコピーしました。', qrError:'QRコードを作成できませんでした。リンクをコピーしてください。', staffCheck:'実物パーツ確認', staffReturn:'お客様画面に戻る', imageTitle:'マイ セーラー万年筆ビュッフェ', imageNotice:'画面の色は実物と異なる場合があります。最終選択前に店頭で実物をご確認ください。', saved:'組み合わせ画像を保存しました。' },
};

function text(){ return copy[getLanguage()] ?? copy.ko; }
function readTouched(){
  try { return new Set(JSON.parse(localStorage.getItem(TOUCHED_KEY) ?? '[]')); }
  catch { return new Set(); }
}
const touched = readTouched();

function activePartId(){ return window.blueblackPenApp?.activePartId ?? parts[0].id; }
function saveTouched(){ localStorage.setItem(TOUCHED_KEY, JSON.stringify([...touched])); }
function toast(message){
  const target=document.querySelector('#toast');
  if(!target) return;
  target.textContent=message;
  clearTimeout(toast.timer);
  toast.timer=setTimeout(()=>{ if(target.textContent===message) target.textContent=''; },2500);
}

function ensureProgress(){
  const title=document.querySelector('.control-title');
  if(!title) return null;
  let progress=document.querySelector('.completion-progress');
  if(!progress){
    progress=document.createElement('div');
    progress.className='completion-progress';
    progress.innerHTML=`<div class="completion-progress-head"><span></span><strong></strong></div><div class="completion-track" role="progressbar" aria-valuemin="0" aria-valuemax="${parts.length}"><i></i></div>`;
    title.insertAdjacentElement('afterend',progress);
  }
  return progress;
}

function updateProgress(){
  const progress=ensureProgress();
  if(!progress) return;
  const value=touched.size;
  progress.querySelector('span').textContent=text().progress;
  progress.querySelector('strong').textContent=`${value} / ${parts.length}`;
  const track=progress.querySelector('.completion-track');
  track.setAttribute('aria-valuenow',String(value));
  track.querySelector('i').style.width=`${value/parts.length*100}%`;
  [...document.querySelectorAll('#part-grid .part-button')].forEach((button,index)=>{
    const complete=touched.has(parts[index]?.id);
    button.classList.toggle('is-complete',complete);
    let badge=button.querySelector('.part-complete-check');
    if(complete&&!badge){ badge=document.createElement('span'); badge.className='part-complete-check'; badge.textContent='✓'; button.append(badge); }
    if(!complete) badge?.remove();
  });
}

function bindSelectionTracking(){
  document.querySelector('#palette')?.addEventListener('click',(event)=>{
    if(!event.target.closest('.swatch')) return;
    touched.add(activePartId());
    saveTouched();
    setTimeout(updateProgress);
  },true);
  document.querySelector('#next-part')?.addEventListener('click',()=>{
    touched.add(activePartId());
    saveTouched();
    setTimeout(updateProgress);
  },true);
}

function replaceButton(selector,handler){
  const original=document.querySelector(selector);
  if(!original) return null;
  const button=original.cloneNode(true);
  original.replaceWith(button);
  button.addEventListener('click',handler);
  return button;
}

function isPhoneShare(){ return matchMedia('(max-width: 699px)').matches && typeof navigator.share==='function'; }
async function nativeShare(){
  try { await navigator.share({ title:document.title, text:document.querySelector('[data-t="resultTitle"]')?.textContent ?? '', url:location.href }); }
  catch { /* User cancellation is not an error. */ }
}

function shareDialog(){
  let dialog=document.querySelector('#share-dialog');
  if(dialog) return dialog;
  dialog=document.createElement('dialog');
  dialog.id='share-dialog';
  dialog.className='share-dialog';
  dialog.innerHTML=`<div class="share-dialog-body"><div class="share-dialog-head"><div><h2></h2><p></p></div><button type="button" class="share-close">×</button></div><div class="qr-shell"><canvas width="220" height="220"></canvas><p class="qr-status"></p></div><p class="share-url"></p><div class="share-dialog-actions"><button type="button" class="primary native-share"></button><button type="button" class="secondary copy-link"></button></div></div>`;
  document.body.append(dialog);
  dialog.querySelector('.share-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',(event)=>{ if(event.target===dialog) dialog.close(); });
  dialog.querySelector('.native-share').addEventListener('click',nativeShare);
  dialog.querySelector('.copy-link').addEventListener('click',async()=>{
    try { await navigator.clipboard.writeText(location.href); toast(text().copied); dialog.close(); }
    catch { dialog.querySelector('.share-url').textContent=location.href; }
  });
  return dialog;
}

async function openQrShare(){
  const dialog=shareDialog();
  const value=text();
  dialog.querySelector('h2').textContent=value.shareTitle;
  dialog.querySelector('.share-dialog-head p').textContent=value.shareCopy;
  dialog.querySelector('.qr-status').textContent=value.scan;
  dialog.querySelector('.copy-link').textContent=value.copy;
  dialog.querySelector('.native-share').textContent=getLanguage()==='ja'?'共有メニュー':getLanguage()==='en'?'Share menu':'공유창 열기';
  dialog.querySelector('.native-share').hidden=typeof navigator.share!=='function';
  dialog.querySelector('.share-url').textContent=location.href;
  dialog.showModal();
  const canvas=dialog.querySelector('canvas');
  canvas.hidden=false;
  try {
    const module=await import('https://cdn.jsdelivr.net/npm/qrcode@1.5.4/+esm');
    const toCanvas=module.toCanvas ?? module.default?.toCanvas;
    if(!toCanvas) throw new Error('QR unavailable');
    await toCanvas(canvas,location.href,{width:220,margin:1,color:{dark:'#10233f',light:'#ffffff'},errorCorrectionLevel:'M'});
  } catch(error){
    console.warn(error);
    canvas.hidden=true;
    dialog.querySelector('.qr-status').textContent=value.qrError;
  }
}

function handleShare(){ if(isPhoneShare()) nativeShare(); else openQrShare(); }

function roundedRect(ctx,x,y,w,h,r){
  if(typeof ctx.roundRect==='function'){ ctx.beginPath(); ctx.roundRect(x,y,w,h,r); ctx.closePath(); return; }
  const radius=Math.min(r,w/2,h/2); ctx.beginPath(); ctx.moveTo(x+radius,y); ctx.arcTo(x+w,y,x+w,y+h,radius); ctx.arcTo(x+w,y+h,x,y+h,radius); ctx.arcTo(x,y+h,x,y,radius); ctx.arcTo(x,y,x+w,y,radius); ctx.closePath();
}
function drawContain(ctx,image,x,y,w,h){ const ratio=Math.min(w/image.width,h/image.height); const dw=image.width*ratio; const dh=image.height*ratio; ctx.drawImage(image,x+(w-dw)/2,y+(h-dh)/2,dw,dh); }

async function saveCard(){
  await document.fonts?.ready;
  window.blueblackPenApp?.render?.();
  const source=document.querySelector('#pen-canvas');
  if(!source) return;
  const output=document.createElement('canvas'); output.width=1080; output.height=1350;
  const ctx=output.getContext('2d'); const value=text();
  ctx.fillStyle='#f3f5f8'; ctx.fillRect(0,0,1080,1350); ctx.fillStyle='#10233f'; ctx.fillRect(0,0,1080,190);
  ctx.fillStyle='#fff'; ctx.font='700 50px Arial, sans-serif'; ctx.fillText(value.imageTitle,64,84);
  ctx.fillStyle='#cbd6e4'; ctx.font='500 23px Arial, sans-serif'; ctx.fillText('BlueBlack Pen Shop · Combination Preview',64,132);
  roundedRect(ctx,54,224,972,520,32); ctx.fillStyle='#fff'; ctx.fill(); drawContain(ctx,source,82,252,916,464);
  [...document.querySelectorAll('#summary-list .summary-item')].forEach((item,index)=>{
    const col=index%2,row=Math.floor(index/2),x=54+col*498,y=782+row*126;
    roundedRect(ctx,x,y,474,102,22); ctx.fillStyle='#fff'; ctx.fill();
    ctx.beginPath(); ctx.arc(x+52,y+51,25,0,Math.PI*2); ctx.fillStyle=getComputedStyle(item.querySelector('.swatch-dot')).backgroundColor; ctx.fill();
    ctx.fillStyle='#7d8999'; ctx.font='600 19px Arial, sans-serif'; ctx.fillText(item.querySelector('small')?.textContent ?? '',x+92,y+38);
    ctx.fillStyle='#1b2738'; ctx.font='700 27px Arial, sans-serif'; ctx.fillText(item.querySelector('b')?.textContent ?? '',x+92,y+72);
  });
  ctx.fillStyle='#687487'; ctx.font='500 18px Arial, sans-serif'; ctx.textAlign='center'; ctx.fillText(value.imageNotice,540,1292);
  output.toBlob((blob)=>{ if(!blob) return; const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='blueblack-pen-combination.png'; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),1200); toast(value.saved); },'image/png');
}

function decorateStaffDialog(){
  const dialog=document.querySelector('#staff-dialog');
  const body=dialog?.querySelector('.staff-dialog-body');
  if(!body) return;
  let preview=body.querySelector('.staff-preview');
  if(!preview){ preview=document.createElement('div'); preview.className='staff-preview'; preview.innerHTML='<img alt="3D combination preview">'; body.querySelector('.staff-dialog-head').insertAdjacentElement('afterend',preview); }
  try { window.blueblackPenApp?.render?.(); preview.querySelector('img').src=document.querySelector('#pen-canvas').toDataURL('image/png'); } catch {}
  let title=body.querySelector('.staff-check-title');
  if(!title){ title=document.createElement('h3'); title.className='staff-check-title'; body.querySelector('#staff-summary').insertAdjacentElement('afterend',title); }
  title.textContent=text().staffCheck;
  let list=body.querySelector('.staff-checklist');
  if(!list){ list=document.createElement('div'); list.className='staff-checklist'; title.insertAdjacentElement('afterend',list); }
  list.replaceChildren(...[...document.querySelectorAll('#staff-summary .summary-item')].map((item)=>{
    const label=document.createElement('label'); label.className='staff-check'; label.innerHTML=`<input type="checkbox"><span>${item.textContent.trim()}</span>`; return label;
  }));
  let back=body.querySelector('.staff-return');
  if(!back){ back=document.createElement('button'); back.type='button'; back.className='staff-return'; body.append(back); back.addEventListener('click',()=>dialog.close()); }
  back.textContent=text().staffReturn;
}

function setupActions(){
  replaceButton('#share-combination',handleShare);
  replaceButton('#save-image',saveCard);
  replaceButton('#staff-view',()=>{ decorateStaffDialog(); document.querySelector('#staff-dialog')?.showModal(); });
  replaceButton('#reset-combination',()=>{ touched.clear(); saveTouched(); window.blueblackPenApp?.resetCombination?.(); updateProgress(); });
}

function setupCompactViewer(){
  const viewer=document.querySelector('#viewer-card');
  const control=document.querySelector('.control-card');
  if(!viewer||!control) return;
  let queued=false;
  const update=()=>{
    queued=false;
    if(!matchMedia('(max-width:699px)').matches||viewer.classList.contains('viewer-fullscreen')){ viewer.classList.remove('is-compact'); return; }
    const threshold=control.getBoundingClientRect().top + scrollY - 80;
    viewer.classList.toggle('is-compact',scrollY>threshold);
  };
  addEventListener('scroll',()=>{ if(!queued){ queued=true; requestAnimationFrame(update); } },{passive:true});
  addEventListener('resize',update); update();
}

function initialize(){
  ensureProgress(); updateProgress(); bindSelectionTracking(); setupActions(); setupCompactViewer();
  const observer=new MutationObserver(updateProgress); const grid=document.querySelector('#part-grid'); if(grid) observer.observe(grid,{childList:true});
  document.querySelectorAll('[data-language]').forEach((button)=>button.addEventListener('click',()=>setTimeout(()=>{ updateProgress(); decorateStaffDialog(); })));
}

setTimeout(initialize,0);
