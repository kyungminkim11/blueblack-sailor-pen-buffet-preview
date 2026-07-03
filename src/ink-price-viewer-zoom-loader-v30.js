try{
  const response=await fetch(new URL('./ink-price-viewer-zoom-v30.txt',import.meta.url));
  if(!response.ok)throw new Error(`HTTP ${response.status}`);
  const source=await response.text();
  const blobUrl=URL.createObjectURL(new Blob([source],{type:'text/javascript'}));
  try{await import(blobUrl);}finally{URL.revokeObjectURL(blobUrl);}
}catch(error){console.error('Enhanced ink price viewer controls failed to load',error);}
