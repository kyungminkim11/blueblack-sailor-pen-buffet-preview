import { getLanguage } from './i18n-v3.js';

const meta={
  ko:{flag:'\ud83c\uddf0\ud83c\uddf7',label:'\ud55c\uad6d\uc5b4'},
  en:{flag:'\ud83c\uddfa\ud83c\uddf8',label:'English'},
  ja:{flag:'\ud83c\uddef\ud83c\uddf5',label:'\u65e5\u672c\u8a9e'},
  'zh-Hans':{flag:'\ud83c\udde8\ud83c\uddf3',label:'\u7b80\u4f53\u4e2d\u6587'},
  'zh-Hant':{flag:'\ud83c\uddf9\ud83c\uddfc',label:'\u7e41\u9ad4\u4e2d\u6587'}
};

function update(){
  const menu=document.querySelector('.language-menu');
  if(!menu)return;
  const current=meta[getLanguage()]||meta.en;
  const flag=menu.querySelector('.language-current-flag');
  const label=menu.querySelector('.language-current-label');
  if(flag)flag.textContent=current.flag;
  if(label)label.textContent=current.label;
  menu.querySelectorAll('[data-language]').forEach(button=>{
    button.setAttribute('aria-pressed',String(button.dataset.language===getLanguage()));
  });
}

function init(){
  const menu=document.querySelector('.language-menu');
  if(!menu)return;
  update();
  menu.querySelectorAll('[data-language]').forEach(button=>button.addEventListener('click',()=>setTimeout(()=>{update();menu.open=false;},30)));
  document.addEventListener('click',event=>{if(menu.open&&!menu.contains(event.target))menu.open=false;});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menu.open)menu.open=false;});
}

setTimeout(init,0);
