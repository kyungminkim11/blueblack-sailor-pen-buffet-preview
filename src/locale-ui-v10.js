import './booklet-guide-v13.js';
import { getLanguage } from './i18n-v3.js';

const meta={
  ko:{flag:'🇰🇷',label:'한국어'},
  en:{flag:'🇺🇸',label:'English'},
  ja:{flag:'🇯🇵',label:'日本語'},
  'zh-Hans':{flag:'🇨🇳',label:'简体中文'},
  'zh-Hant':{flag:'🇹🇼',label:'繁體中文'}
};

const desktopQuery=window.matchMedia('(min-width:900px)');

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

function syncViewport(menu){
  if(desktopQuery.matches){
    menu.open=true;
    menu.setAttribute('data-desktop-open','true');
  }else{
    menu.removeAttribute('data-desktop-open');
    menu.open=false;
  }
}

function init(){
  const menu=document.querySelector('.language-menu');
  if(!menu)return;
  syncViewport(menu);
  update();

  menu.querySelectorAll('[data-language]').forEach(button=>button.addEventListener('click',()=>setTimeout(()=>{
    update();
    if(desktopQuery.matches)menu.open=true;
    else menu.open=false;
  },30)));

  document.addEventListener('click',event=>{
    if(!desktopQuery.matches&&menu.open&&!menu.contains(event.target))menu.open=false;
  });

  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'&&!desktopQuery.matches&&menu.open)menu.open=false;
  });

  desktopQuery.addEventListener?.('change',()=>syncViewport(menu));
}

setTimeout(init,0);
