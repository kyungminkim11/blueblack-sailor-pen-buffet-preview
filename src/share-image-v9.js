import { t } from './i18n-v3.js';

function roundRect(ctx,x,y,w,h,r){if(ctx.roundRect){ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.closePath();return;}ctx.beginPath();ctx.rect(x,y,w,h);ctx.closePath();}

export async function createCombinationCard(){
  await document.fonts?.ready;
  window.blueblackPenApp?.render?.();
  const source=document.querySelector('#pen-canvas');
  const canvas=document.createElement('canvas');
  canvas.width=1080;canvas.height=1350;
  const ctx=canvas.getContext('2d');
  ctx.fillStyle='#f3f5f8';ctx.fillRect(0,0,1080,1350);
  ctx.fillStyle='#10233f';ctx.fillRect(0,0,1080,190);
  ctx.fillStyle='#fff';ctx.font='700 48px Arial, sans-serif';ctx.fillText(t('resultTitle'),64,82);
  ctx.fillStyle='#cbd6e4';ctx.font='500 23px Arial, sans-serif';ctx.fillText('BlueBlack Pen Shop · Pen Buffet Preview',64,132);
  roundRect(ctx,54,224,972,520,32);ctx.fillStyle='#fff';ctx.fill();
  if(source){const ratio=Math.min(916/source.width,464/source.height);const w=source.width*ratio,h=source.height*ratio;ctx.drawImage(source,82+(916-w)/2,252+(464-h)/2,w,h);}
  [...document.querySelectorAll('#summary-list .summary-item')].forEach((item,index)=>{
    const col=index%2,row=Math.floor(index/2),x=54+col*498,y=782+row*126;
    roundRect(ctx,x,y,474,102,22);ctx.fillStyle='#fff';ctx.fill();
    ctx.beginPath();ctx.arc(x+52,y+51,25,0,Math.PI*2);ctx.fillStyle=getComputedStyle(item.querySelector('.swatch-dot')).backgroundColor;ctx.fill();
    ctx.fillStyle='#7d8999';ctx.font='600 19px Arial, sans-serif';ctx.fillText(item.querySelector('small')?.textContent||'',x+92,y+38);
    ctx.fillStyle='#1b2738';ctx.font='700 27px Arial, sans-serif';ctx.fillText(item.querySelector('b')?.textContent||'',x+92,y+72);
  });
  ctx.fillStyle='#687487';ctx.font='500 18px Arial, sans-serif';ctx.textAlign='center';ctx.fillText(t('colorNotice'),540,1292);
  const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));
  return{canvas,blob};
}

export async function saveCombinationImage(){
  const{blob}=await createCombinationCard();
  if(!blob)return false;
  const link=document.createElement('a');
  link.href=URL.createObjectURL(blob);link.download='blueblack-pen-combination.png';link.click();
  setTimeout(()=>URL.revokeObjectURL(link.href),1200);
  return true;
}

export async function shareCombinationImage(){
  const{blob}=await createCombinationCard();
  if(!blob)return'failed';
  const file=new File([blob],'blueblack-pen-combination.png',{type:'image/png'});
  if(navigator.share&&navigator.canShare?.({files:[file]})){
    try{await navigator.share({title:document.title,text:t('resultTitle'),files:[file]});return'shared';}catch{return'cancelled';}
  }
  const link=document.createElement('a');link.href=URL.createObjectURL(blob);link.download=file.name;link.click();setTimeout(()=>URL.revokeObjectURL(link.href),1200);return'saved';
}
