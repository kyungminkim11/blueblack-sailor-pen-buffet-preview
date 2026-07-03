try{
  const files=['ink-price-viewer-zoom-v30.txt','ink-price-viewer-copy-v30.txt'];
  const parts=await Promise.all(files.map(async name=>{const response=await fetch(new URL(`./${name}`,import.meta.url));if(!response.ok)throw new Error(`HTTP ${response.status}`);return response.text();}));
  const blobUrl=URL.createObjectURL(new Blob([parts.join('\n')],{type:'text/javascript'}));
  try{await import(blobUrl);}finally{URL.revokeObjectURL(blobUrl);}
}catch(error){console.error('Enhanced ink price viewer controls failed to load',error);}
