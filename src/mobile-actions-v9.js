import { parts } from './data.js';
import { getLanguage, t } from './i18n-v3.js';
import { shareCombinationImage, saveCombinationImage } from './share-image-v9.js';

const labels={
ko:['\uacf5\uc720','\ubcf5\uc0ac','\uc774\ubbf8\uc9c0','\ub9c1\ud06c \ubcf5\uc0ac','\uc870\ud569 \ub9c1\ud06c\ub97c \ubcf5\uc0ac\ud588\uc2b5\ub2c8\ub2e4.'],
en:['Share','Copy','Image','Copy link','Combination link copied.'],
ja:['\u5171\u6709','\u30b3\u30d4\u30fc','\u753b\u50cf','\u30ea\u30f3\u30af\u3092\u30b3\u30d4\u30fc','\u7d44\u307f\u5408\u308f\u305b\u30ea\u30f3\u30af\u3092\u30b3\u30d4\u30fc\u3057\u307e\u3057\u305f\u3002'],
'zh-Hans':['\u5206\u4eab','\u590d\u5236','\u56fe\u7247','\u590d\u5236\u94fe\u63a5','\u7ec4\u5408\u94fe\u63a5\u5df2\u590d\u5236\u3002'],
'zh-Hant':['\u5206\u4eab','\u8907\u88fd','\u5716\u7247','\u8907\u88fd\u9023\u7d50','\u7d44\u5408\u9023\u7d50\u5df2\u8907\u88fd\u3002']
};
const words=()=>labels[getLanguage()]||labels.ko;
function url(){const selected=window.blueblackPenApp?.selections||{};const code=parts.map(part=>selected[part.id]).filter(Boolean).join('.');const next=new URL(location.href);next.search='';if(code)next.searchParams.set('c',code);next.searchParams.set('lang',getLanguage());return next.href;}
function toast(message){const node=document.querySelector('#toast');if(!node)return;node.textContent=message;clearTimeout(toast.timer);toast.timer=setTimeout(()=>{if(node.textContent===message)node.textContent='';},2300);}
async function shareLink(){const link=url();if(navigator.share){try{await navigator.share({title:document.title,text:t('resultTitle'),url:link});return;}catch{}}copyLink();}
async function copyLink(){try{await navigator.clipboard.writeText(url());toast(words()[4]);}catch{location.hash='';}}
async function shareImage(){const result=await shareCombinationImage();if(result==='saved')toast(t('imageSaved'));}
function setupMain(){const share=document.querySelector('#share-combination');if(share&&matchMedia('(max-width:699px)').matches){const next=share.cloneNode(true);share.replaceWith(next);next.addEventListener('click',shareLink);}const grid=document.querySelector('.action-grid');if(grid&&!grid.querySelector('.copy-combination-link')){const button=document.createElement('button');button.type='button';button.className='secondary copy-combination-link';button.textContent=words()[3];button.addEventListener('click',copyLink);grid.insertBefore(button,grid.querySelector('#staff-view'));}}
function setupDock(){let dock=document.querySelector('.mobile-share-dock');if(!dock){dock=document.createElement('div');dock.className='mobile-share-dock';dock.innerHTML='<button type="button" class="dock-share"></button><button type="button" class="dock-copy"></button><button type="button" class="dock-image"></button>';document.body.append(dock);dock.querySelector('.dock-share').addEventListener('click',shareLink);dock.querySelector('.dock-copy').addEventListener('click',copyLink);dock.querySelector('.dock-image').addEventListener('click',shareImage);}const value=words();dock.querySelector('.dock-share').textContent=value[0];dock.querySelector('.dock-copy').textContent=value[1];dock.querySelector('.dock-image').textContent=value[2];const copyButton=document.querySelector('.copy-combination-link');if(copyButton)copyButton.textContent=value[3];}
function setupSave(){const save=document.querySelector('#save-image');if(!save)return;const next=save.cloneNode(true);save.replaceWith(next);next.addEventListener('click',saveCombinationImage);}
function init(){setupMain();setupDock();setupSave();document.querySelectorAll('[data-language]').forEach(button=>button.addEventListener('click',()=>setTimeout(setupDock,20)));}
setTimeout(init,60);
