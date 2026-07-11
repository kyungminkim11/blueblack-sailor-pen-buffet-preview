import { tourLanguage } from './store-tour-i18n.js';

const COPY={
  ko:{prev:'이전 위치',next:'다음 위치',point:'현재 지점',fullscreen:'전체 화면',exitFullscreen:'전체 화면 종료',share:'현재 위치 링크',shared:'링크를 복사했습니다.',plan:'도면 보기',hidePlan:'도면 접기',gesture:'사진을 좌우로 드래그해 360도로 둘러보세요.',nav:{tour:'360 투어',floor:'층별 지도',visit:'방문 정보',brands:'브랜드 지도'}},
  en:{prev:'Previous',next:'Next',point:'View point',fullscreen:'Full screen',exitFullscreen:'Exit full screen',share:'Share this view',shared:'Link copied.',plan:'Show floor plan',hidePlan:'Hide floor plan',gesture:'Drag the image to look around in 360°.',nav:{tour:'360 tour',floor:'Floor guide',visit:'Visit info',brands:'Brand map'}},
  ja:{prev:'前の地点',next:'次の地点',point:'現在地',fullscreen:'全画面',exitFullscreen:'全画面を終了',share:'現在地リンク',shared:'リンクをコピーしました。',plan:'案内図を見る',hidePlan:'案内図を閉じる',gesture:'写真を左右にドラッグして360°見渡せます。',nav:{tour:'360°ツアー',floor:'フロア案内',visit:'来店情報',brands:'ブランド地図'}},
  'zh-Hans':{prev:'上一位置',next:'下一位置',point:'当前位置',fullscreen:'全屏',exitFullscreen:'退出全屏',share:'分享当前位置',shared:'链接已复制。',plan:'查看平面图',hidePlan:'收起平面图',gesture:'左右拖动画面即可360°查看周围。',nav:{tour:'360°导览',floor:'楼层地图',visit:'到店信息',brands:'品牌地图'}},
  'zh-Hant':{prev:'上一位置',next:'下一位置',point:'目前位置',fullscreen:'全螢幕',exitFullscreen:'離開全螢幕',share:'分享目前位置',shared:'連結已複製。',plan:'查看平面圖',hidePlan:'收合平面圖',gesture:'左右拖動畫面即可360°查看周圍。',nav:{tour:'360°導覽',floor:'樓層地圖',visit:'到店資訊',brands:'品牌地圖'}}
};
const $=(selector,root=document)=>root.querySelector(selector);
const $$=(selector,root=document)=>[...root.querySelectorAll(selector)];
const lang=tourLanguage();
const copy=COPY[lang]||COPY.ko;
let lastSelected='';
let enhanced=false;

function localizeQuickNav(){
  const nav=$('.store-guide-quicknav');
  if(!nav)return;
  Object.entries(copy.nav).forEach(([key,value])=>{const node=$(`[data-store-nav="${key}"]`,nav);if(node)node.textContent=value;});
  const targets=$$('.store-guide-quicknav a').map(link=>$(link.getAttribute('href'))).filter(Boolean);
  if(!('IntersectionObserver'in window)||!targets.length)return;
  const observer=new IntersectionObserver(entries=>{
    const visible=entries.filter(entry=>entry.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
    if(!visible)return;
    $$('.store-guide-quicknav a').forEach(link=>link.classList.toggle('is-active',link.getAttribute('href')===`#${visible.target.id}`));
  },{rootMargin:'-18% 0px -68% 0px',threshold:[0,.1,.35,.6]});
  targets.forEach(target=>observer.observe(target));
}

function shareCurrent(){
  const title=$('[data-tour-title]')?.textContent?.trim()||document.title;
  const url=location.href;
  if(navigator.share)return navigator.share({title,text:title,url}).catch(()=>{});
  return navigator.clipboard?.writeText(url).then(()=>showToast(copy.shared)).catch(()=>window.prompt(copy.share,url));
}

function showToast(message){
  let toast=$('.store-tour-action-toast');
  if(!toast){toast=document.createElement('p');toast.className='store-tour-action-toast';toast.setAttribute('aria-live','polite');$('.store-tour-view-card')?.append(toast);}
  toast.textContent=message;
  clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>toast.textContent='',1800);
}

function selectedIndex(listButtons){return listButtons.findIndex(button=>button.classList.contains('is-selected'));}

function sync(root){
  const list=$('[data-tour-list]',root);if(!list)return;
  const buttons=$$('[data-spot-id]',list);
  if(!buttons.length)return;
  const index=Math.max(0,selectedIndex(buttons));
  const current=buttons[index];
  const id=current?.dataset.spotId||'';
  const progress=$('[data-tour-progress]',root);
  if(progress)progress.textContent=`${index+1} / ${buttons.length}`;
  const prev=$('[data-tour-prev]',root),next=$('[data-tour-next]',root);
  if(prev)prev.disabled=index<=0;
  if(next)next.disabled=index>=buttons.length-1;
  buttons.forEach((button,i)=>{button.setAttribute('aria-current',i===index?'location':'false');button.setAttribute('aria-pressed',String(i===index));});
  $$('.store-tour-marker[data-spot-id]',root).forEach(marker=>{const active=marker.dataset.spotId===id;marker.setAttribute('aria-current',active?'location':'false');marker.setAttribute('aria-pressed',String(active));});
  $$('.store-tour-direction',root).forEach(button=>{const label=[button.querySelector('b')?.textContent,button.querySelector('small')?.textContent].filter(Boolean).join(' · ');if(label)button.setAttribute('aria-label',label);});
  if(id&&id!==lastSelected){lastSelected=id;current?.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'});}
}

function toggleFullscreen(root){
  const shell=$('.store-tour-view-shell',root);if(!shell)return;
  if(document.fullscreenElement)document.exitFullscreen?.();else shell.requestFullscreen?.();
}

function setPlanCollapsed(planCard,collapsed){
  planCard.classList.toggle('is-collapsed',collapsed);
  const button=$('[data-tour-plan-toggle]',planCard);
  if(button){button.setAttribute('aria-expanded',String(!collapsed));button.textContent=collapsed?copy.plan:copy.hidePlan;}
}

function enhance(root){
  if(enhanced)return true;
  const workspace=$('.store-tour-workspace',root),viewCard=$('.store-tour-view-card',root),planCard=$('.store-tour-plan-card',root),viewShell=$('.store-tour-view-shell',root),list=$('[data-tour-list]',root);
  if(!workspace||!viewCard||!planCard||!viewShell||!list)return false;
  enhanced=true;root.classList.add('is-store-tour-enhanced');

  const bar=document.createElement('div');bar.className='tour-experience-bar';bar.innerHTML=`<button type="button" data-tour-prev>← ${copy.prev}</button><div class="tour-experience-progress"><small>${copy.point}</small><strong data-tour-progress>1 / 1</strong></div><button type="button" data-tour-next>${copy.next} →</button>`;
  $('.store-tour-card-head',viewCard)?.after(bar);

  const fullscreen=document.createElement('button');fullscreen.type='button';fullscreen.className='tour-view-fullscreen';fullscreen.dataset.tourFullscreen='';fullscreen.textContent=copy.fullscreen;viewShell.append(fullscreen);
  const gesture=document.createElement('div');gesture.className='tour-gesture-hint';gesture.textContent=copy.gesture;viewShell.append(gesture);

  const utility=document.createElement('div');utility.className='tour-utility-row';utility.innerHTML=`<button type="button" data-tour-share>${copy.share}</button><button type="button" data-tour-plan-jump>${copy.plan}</button>`;
  $('.store-tour-hint',viewCard)?.after(utility);

  const planHead=$('.store-tour-card-head',planCard);if(planHead){const toggle=document.createElement('button');toggle.type='button';toggle.className='tour-plan-toggle';toggle.dataset.tourPlanToggle='';toggle.setAttribute('aria-expanded','true');toggle.textContent=copy.hidePlan;planHead.append(toggle);}

  $('[data-tour-prev]',root)?.addEventListener('click',()=>{const buttons=$$('[data-spot-id]',list),index=selectedIndex(buttons);buttons[index-1]?.click();});
  $('[data-tour-next]',root)?.addEventListener('click',()=>{const buttons=$$('[data-spot-id]',list),index=selectedIndex(buttons);buttons[index+1]?.click();});
  fullscreen.addEventListener('click',()=>toggleFullscreen(root));
  $('[data-tour-share]',root)?.addEventListener('click',shareCurrent);
  $('[data-tour-plan-jump]',root)?.addEventListener('click',()=>{setPlanCollapsed(planCard,false);planCard.scrollIntoView({behavior:'smooth',block:'center'});});
  $('[data-tour-plan-toggle]',root)?.addEventListener('click',()=>setPlanCollapsed(planCard,!planCard.classList.contains('is-collapsed')));

  const hideGesture=()=>gesture.classList.add('is-hidden');
  viewShell.addEventListener('pointerdown',hideGesture,{once:true});
  viewShell.addEventListener('wheel',hideGesture,{once:true,passive:true});
  viewShell.addEventListener('click',event=>{if(event.target.closest('button'))hideGesture();});
  setTimeout(hideGesture,6500);

  if(matchMedia('(max-width:760px)').matches)setPlanCollapsed(planCard,true);
  new MutationObserver(()=>sync(root)).observe(root,{subtree:true,attributes:true,attributeFilter:['class'],childList:true,characterData:true});
  document.addEventListener('fullscreenchange',()=>{fullscreen.textContent=document.fullscreenElement?copy.exitFullscreen:copy.fullscreen;});
  sync(root);

  const params=new URLSearchParams(location.search);
  if(params.has('tour')&&!location.hash&&!root.dataset.autoFocused){root.dataset.autoFocused='true';setTimeout(()=>root.scrollIntoView({behavior:'smooth',block:'start'}),450);}
  return true;
}

function init(){
  localizeQuickNav();
  const root=$('#storeTour360');if(!root)return;
  if(enhance(root))return;
  const observer=new MutationObserver(()=>{if(enhance(root))observer.disconnect();});
  observer.observe(root,{subtree:true,childList:true});
}

document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init,{once:true}):init();
