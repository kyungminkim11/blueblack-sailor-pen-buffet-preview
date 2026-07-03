const decode=value=>decodeURIComponent(escape(atob(value.trim())));
try{
  const encodedFiles=['ink-price-store-v30-1.b64','ink-price-store-v30-2.b64','ink-price-store-v30-3-4.b64'];
  const rawFiles=['ink-price-store-v30.part5.txt','ink-price-store-v30.part6.txt','ink-price-store-v30.part7.txt','ink-price-store-v30.part8.txt'];
  const encoded=await Promise.all(encodedFiles.map(async name=>{const response=await fetch(new URL(`./${name}`,import.meta.url));if(!response.ok)throw new Error(`HTTP ${response.status}`);return response.text();}));
  const raw=await Promise.all(rawFiles.map(async name=>{const response=await fetch(new URL(`./${name}`,import.meta.url));if(!response.ok)throw new Error(`HTTP ${response.status}`);return response.text();}));
  const source=[...encoded.flatMap(value=>value.trim().split(/\s+/)).map(decode),...raw].join('');
  const blobUrl=URL.createObjectURL(new Blob([source],{type:'text/javascript'}));
  try{await import(blobUrl);}finally{URL.revokeObjectURL(blobUrl);}
}catch(error){
  console.error('Ink store UI failed to load',error);
  const root=document.querySelector('#ink-store-app');
  if(root)root.innerHTML='<div class="ink-store-load-error">잉크 가격 검색 화면을 불러오지 못했습니다. 페이지를 새로고침해 주세요.</div>';
}
