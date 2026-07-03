try{
  const files=[1,2,3,4,5,6].map(number=>new URL(`./ink-price-style-v30.part${number}.txt`,import.meta.url));
  const parts=await Promise.all(files.map(async url=>{const response=await fetch(url);if(!response.ok)throw new Error(`HTTP ${response.status}`);return response.text();}));
  const style=document.createElement('style');
  style.dataset.inkStoreStyle='v30';
  style.textContent=parts.join('');
  document.head.append(style);
}catch(error){console.error('Ink price styles failed to load',error);}
