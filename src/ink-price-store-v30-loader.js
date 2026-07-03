const VERSION='44';
const decode=value=>decodeURIComponent(escape(atob(value.trim())));
const read=async name=>{const url=new URL(`./${name}`,import.meta.url);url.searchParams.set('v',VERSION);const response=await fetch(url,{cache:'no-store'});if(!response.ok)throw new Error(`HTTP ${response.status}`);return response.text();};
try{
  const encoded=await Promise.all(['ink-price-store-v30-1.b64','ink-price-store-v30-2.b64'].map(read));
  const prefix=await Promise.all(['ink-price-store-v30.part3.txt','ink-price-store-v30.part4a.txt'].map(read));
  const ranked=JSON.parse(await read('ink-price-store-v30.part4b.json'));
  const suffix=await Promise.all(['ink-price-store-v30.part5.txt','ink-price-store-v30.part6.txt','ink-price-store-v30.part7.txt','ink-price-store-v30.part8.txt'].map(read));
  const source=[...encoded.map(decode),...prefix,ranked,...suffix].join('');
  const blobUrl=URL.createObjectURL(new Blob([source],{type:'text/javascript'}));
  try{await import(blobUrl);}finally{URL.revokeObjectURL(blobUrl);}
}catch(error){
  console.error('Ink store UI failed to load',error);
  const root=document.querySelector('#ink-store-app');
  if(root)root.innerHTML='<div class="ink-store-load-error">잉크 가격 검색 화면을 불러오지 못했습니다. 페이지를 새로고침해 주세요.</div>';
}