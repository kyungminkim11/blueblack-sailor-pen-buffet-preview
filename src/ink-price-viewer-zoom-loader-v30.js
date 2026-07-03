import './ink-bottle-volume-rpc-v38.js?v=44';
import './ink-store-policy-v40.js?v=44';
import './ink-price-i18n-v43.js?v=44';

try{
  const files=['ink-price-viewer-zoom-v30.txt','ink-price-viewer-copy-v30.txt'];
  const parts=await Promise.all(files.map(async name=>{const url=new URL(`./${name}`,import.meta.url);url.searchParams.set('v','44');const response=await fetch(url,{cache:'no-store'});if(!response.ok)throw new Error(`HTTP ${response.status}`);return response.text();}));
  const blobUrl=URL.createObjectURL(new Blob([parts.join('\n')],{type:'text/javascript'}));
  try{await import(blobUrl);}finally{URL.revokeObjectURL(blobUrl);}
}catch(error){console.error('Enhanced ink price viewer controls failed to load',error);}