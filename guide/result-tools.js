const $=(selector,root=document)=>root.querySelector(selector);

function resultText(){
  const title=$('#dialog-title')?.textContent?.trim()||'블루블랙 만년필 가이드';
  const subtitle=$('#dialog-subtitle')?.textContent?.trim()||'';
  const body=$('#dialog-body')?.innerText?.trim()||'';
  return `[블루블랙 펜샵]\n${title}${subtitle?`\n${subtitle}`:''}\n\n${body}\n\n가격·옵션·매장 재고와 시필 가능 여부는 직원에게 최종 확인해 주세요.`;
}

async function shareResult(){
  const text=resultText();
  if(navigator.share){await navigator.share({title:$('#dialog-title')?.textContent||'블루블랙 가이드',text}).catch(()=>{});return}
  await navigator.clipboard.writeText(text).catch(()=>{});alert('결과 내용을 복사했습니다.');
}

function printResult(){
  const title=$('#dialog-title')?.textContent||'블루블랙 가이드';
  const text=resultText();
  const popup=window.open('','_blank','width=800,height=760');
  if(!popup){alert('팝업이 차단되었습니다. 브라우저에서 팝업을 허용해 주세요.');return}
  popup.opener=null;
  const safe=value=>String(value).replace(/[&<>]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[char]));
  popup.document.write(`<!doctype html><html lang="ko"><head><meta charset="utf-8"><title>${safe(title)}</title><style>body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#172033;padding:40px;line-height:1.7}header{padding-bottom:18px;border-bottom:2px solid #0b1b31;margin-bottom:24px}small{letter-spacing:.12em;color:#6d7685}h1{font-family:Georgia,"Noto Serif KR",serif;font-size:34px;margin:8px 0}pre{white-space:pre-wrap;font:inherit}.notice{margin-top:28px;padding:15px;background:#f5f1e9;border-radius:12px}</style></head><body><header><small>BLUEBLACK PEN SHOP</small><h1>${safe(title)}</h1></header><pre>${safe(text)}</pre><div class="notice">본 출력물은 상담 보조 자료입니다. 구매 전 가격, 옵션, 재고와 시필 가능 여부를 확인해 주세요.</div><script>window.onload=()=>window.print()<\/script></body></html>`);popup.document.close();
}

function enhance(){
  const body=$('#dialog-body');if(!body||body.dataset.resultTools==='1')return;
  const isRecommendation=Boolean(body.querySelector('.recommend-products'));
  const isSituation=Boolean(body.querySelector('.scenario-dialog-head'));
  if(!isRecommendation&&!isSituation)return;
  body.dataset.resultTools='1';
  const existingActions=body.querySelector('.dialog-actions');if(!existingActions)return;
  const tools=document.createElement('div');tools.className='collection-result-actions';
  tools.innerHTML=`<button type="button" class="button soft" data-result-share>결과 공유</button><button type="button" class="button soft" data-result-copy>결과 복사</button><button type="button" class="button navy" data-result-print>결과 인쇄</button>`;
  existingActions.before(tools);
  $('[data-result-share]',tools).addEventListener('click',shareResult);
  $('[data-result-copy]',tools).addEventListener('click',async event=>{try{await navigator.clipboard.writeText(resultText());event.currentTarget.textContent='복사 완료'}catch{alert('복사할 수 없습니다. 화면을 직원에게 보여주세요.')}});
  $('[data-result-print]',tools).addEventListener('click',printResult);
}

new MutationObserver(enhance).observe(document.body,{childList:true,subtree:true});
setTimeout(enhance,0);
