import './public-ui-v52.js';
import './ink-price-i18n-completion-v50.js?v=50';

const VERSION='52';
try{
  const files=[1,2,3,4,5,6].map(number=>{const url=new URL(`./ink-price-style-v30.part${number}.txt`,import.meta.url);url.searchParams.set('v',VERSION);return url;});
  const parts=await Promise.all(files.map(async url=>{const response=await fetch(url,{cache:'no-store'});if(!response.ok)throw new Error(`HTTP ${response.status}`);return response.text();}));
  const style=document.createElement('style');
  style.dataset.inkStoreStyle='v52';
  style.textContent=parts.join('');
  document.head.append(style);
}catch(error){console.error('Ink price styles failed to load',error);}