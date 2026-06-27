import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { parts, colors, defaultSelection } from './data.js';
import { buildPenModel } from './pen-model.js';
import { getLanguage, initializeLanguage, localizeColor, localizePart, setLanguage, t } from './i18n-v3.js';

initializeLanguage();

const STORE={
  ko:'서울특별시 종로구 사직로 109 (내자동)',
  en:'109 Sajik-ro, Jongno-gu, Seoul, Republic of Korea',
  ja:'韓国 ソウル特別市 鍾路区 社稷路109（内資洞）',
  'zh-Hans':'韩国首尔特别市钟路区社稷路109（内资洞）',
  'zh-Hant':'韓國首爾特別市鐘路區社稷路109（內資洞）',
  phone:'02-765-8868'
};
const PART_X={cap_end:-64,cap_body:-31,nib_grip:-8,metal_parts:-3,barrel_body:53,barrel_end:96};
const legacyKeys={cap_end:'cap_top',nib_grip:'grip_section'};
const mobileMedia=matchMedia('(max-width:699px)');
const reducedMotion=matchMedia('(prefers-reduced-motion:reduce)');
const $=selector=>document.querySelector(selector);

const state={
  activePartId:parts[0].id,
  selections:{...defaultSelection},
  viewMode:'assembled',
  fullscreen:false,
  root:null,
  groups:null,
  partMeshes:new Map(),
  ready:false,
  renderFailed:false
};

const initialQuery=new URLSearchParams(location.search);
for(const part of parts){
  const value=initialQuery.get(part.id)??initialQuery.get(legacyKeys[part.id]);
  if(colors.some(color=>color.id===value&&color.group===part.colorGroup))state.selections[part.id]=value;
}

const elements={
  viewerCard:$('#viewer-card'),stage:$('#viewer-stage'),canvas:$('#pen-canvas'),loading:$('#viewer-loading'),error:$('#viewer-error'),fallback:$('#static-pen-fallback'),partGrid:$('#part-grid'),palette:$('#palette'),summary:$('#summary-list'),staffSummary:$('#staff-summary'),staffDialog:$('#staff-dialog'),toast:$('#toast')
};

function colorById(id){return colors.find(color=>color.id===id)??colors[0];}
function partById(id){return parts.find(part=>part.id===id)??parts[0];}
function showToast(message){if(!elements.toast)return;elements.toast.textContent=message;clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>{if(elements.toast.textContent===message)elements.toast.textContent='';},2400);}

function persist(){
  const query=new URLSearchParams(location.search);
  query.delete('c');
  query.set('lang',getLanguage());
  for(const part of parts)query.set(part.id,state.selections[part.id]);
  history.replaceState(null,'',`${location.pathname}?${query}`);
  localStorage.setItem('blueblack-pen-combination-query',query.toString());
  dispatchEvent(new CustomEvent('combinationchange',{detail:{...state.selections}}));
}

function localizedAddress(){return STORE[getLanguage()]??STORE.ko;}

function renderStaticText(){
  document.title=t('title');
  document.querySelectorAll('[data-t]').forEach(node=>{node.textContent=t(node.dataset.t);});
  document.querySelectorAll('[data-language]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.language===getLanguage())));
  const index=parts.findIndex(part=>part.id===state.activePartId);
  $('#progress-pill').textContent=t('partProgress',{current:String(index+1),total:String(parts.length)});
  $('#viewer-mode').textContent=state.viewMode==='assembled'?t('assembled'):t('exploded');
  $('#toggle-view').textContent=state.viewMode==='assembled'?t('exploded'):t('assembled');
  $('#toggle-fullscreen').textContent=state.fullscreen?t('close'):t('largeView');
  $('#store-address').textContent=localizedAddress();
  $('#store-phone').textContent=STORE.phone;
  updateActiveBadge();
}

function updateActiveBadge(){
  if(!elements.stage)return;
  let badge=$('#viewer-active-part');
  if(!badge){badge=document.createElement('div');badge.id='viewer-active-part';badge.className='viewer-active-part';elements.stage.append(badge);}
  const labels={ko:'현재 선택 중',en:'SELECTING',ja:'選択中','zh-Hans':'当前选择','zh-Hant':'目前選擇'};
  badge.innerHTML=`<small>${labels[getLanguage()]??labels.ko}</small><strong>${localizePart(partById(state.activePartId)).name}</strong>`;
}

function renderParts(){
  elements.partGrid?.replaceChildren(...parts.map((part,index)=>{
    const button=document.createElement('button');
    button.type='button';button.className='part-button';button.dataset.partId=part.id;button.setAttribute('role','tab');button.setAttribute('aria-selected',String(part.id===state.activePartId));
    button.innerHTML=`<span class="part-index">${index+1}</span><span>${localizePart(part).name}</span>`;
    button.addEventListener('click',()=>selectPart(part.id,true));
    return button;
  }));
}

function swatch(color,part){
  const name=localizeColor(color);const selected=state.selections[part.id]===color.id;
  const button=document.createElement('button');button.type='button';button.className='swatch';button.dataset.colorId=color.id;button.setAttribute('role','radio');button.setAttribute('aria-checked',String(selected));button.setAttribute('aria-label',name);
  button.innerHTML=`${color.isNew?'<span class="new-tag">NEW</span>':''}<span class="swatch-check">✓</span><span class="swatch-dot" style="background:${color.hex}"></span><span>${name}</span>`;
  button.addEventListener('click',()=>{state.selections[part.id]=color.id;persist();applyColors();renderCustomizer();pulsePart();});
  return button;
}

function paletteGroup(title,list,part){
  const section=document.createElement('section');section.className='palette-group';section.innerHTML=`<div class="palette-heading"><b>${title}</b><span>${list.length}</span></div>`;
  const grid=document.createElement('div');grid.className='swatch-grid';grid.setAttribute('role','radiogroup');grid.append(...list.map(color=>swatch(color,part)));section.append(grid);return section;
}

function renderPalette(){
  if(!elements.palette)return;
  const part=partById(state.activePartId);const list=colors.filter(color=>color.group===part.colorGroup);
  if(part.colorGroup==='metal'){elements.palette.replaceChildren(paletteGroup(t('metalColors'),list,part));return;}
  elements.palette.replaceChildren(paletteGroup(t('originalColors'),list.filter(color=>!color.isNew),part),paletteGroup(t('newColors'),list.filter(color=>color.isNew),part));
}

function fillSummary(target){
  if(!target)return;
  target.replaceChildren(...parts.map(part=>{
    const color=colorById(state.selections[part.id]);const item=document.createElement('div');item.className='summary-item';item.dataset.partId=part.id;
    item.innerHTML=`<span class="swatch-dot" style="background:${color.hex}"></span><div><small>${localizePart(part).name}</small><b>${localizeColor(color)}</b></div>`;
    item.tabIndex=0;item.setAttribute('role','button');item.addEventListener('click',()=>selectPart(part.id,true));item.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();selectPart(part.id,true);}});return item;
  }));
}

function renderCustomizer(){
  const index=parts.findIndex(part=>part.id===state.activePartId);const part=parts[index];const localized=localizePart(part);const color=colorById(state.selections[part.id]);
  $('#part-name-en').textContent=part.nameEn.toUpperCase();$('#part-name').textContent=localized.name;$('#part-description').textContent=localized.description;$('#selected-dot').style.background=color.hex;$('#selected-color').textContent=localizeColor(color);$('#previous-part').disabled=index===0;$('#next-part').textContent=index===parts.length-1?t('finishSelection'):t('nextPart');
  renderStaticText();renderParts();renderPalette();fillSummary(elements.summary);fillSummary(elements.staffSummary);
}

function resinMaterial(){return new THREE.MeshPhysicalMaterial({color:'#ffffff',roughness:.12,metalness:0,transmission:.25,thickness:1.2,transparent:true,opacity:.96,ior:1.48,clearcoat:.7,clearcoatRoughness:.12,side:THREE.DoubleSide});}
const fixedMetal=new THREE.MeshStandardMaterial({color:'#c8ccd1',metalness:.92,roughness:.18});
const darkInset=new THREE.MeshStandardMaterial({color:'#090b0e',metalness:.05,roughness:.45});
const feedMaterial=new THREE.MeshStandardMaterial({color:'#111419',metalness:.04,roughness:.34});

let renderer,scene,camera,controls,resizeObserver,animationId,raycaster,pointerDown;

function configureResin(material,color,highlight=false){
  material.color.set(color.hex);material.metalness=0;material.roughness=color.roughness??.13;material.transparent=Boolean(color.transparent);material.opacity=color.transparent?.93:1;material.transmission=color.transparent?(color.transmission??.35):0;material.thickness=color.thickness??1.2;material.ior=1.48;material.depthWrite=true;material.emissive?.set(highlight?'#4b3819':'#000000');material.emissiveIntensity=highlight?.12:0;material.needsUpdate=true;
}
function configureMetal(material,color,meshName,highlight=false){
  const dark=/slit|breather|feed|channel/i.test(meshName);
  material.color.set(dark?'#111419':color.hex);material.metalness=dark?.08:(color.metalness??.9);material.roughness=dark?.38:(color.roughness??.2);material.transparent=false;material.opacity=1;material.transmission=0;material.emissive?.set(highlight&&!dark?'#3e2e15':'#000000');material.emissiveIntensity=highlight&&!dark?.14:0;material.needsUpdate=true;
}

function applyColors(){
  if(!state.ready)return;
  for(const part of parts){
    const selected=colorById(state.selections[part.id]);const active=part.id===state.activePartId;
    for(const mesh of state.partMeshes.get(part.id)??[]){
      const materials=Array.isArray(mesh.material)?mesh.material:[mesh.material];
      for(const material of materials){if(part.colorGroup==='metal')configureMetal(material,selected,mesh.name,active);else configureResin(material,selected,active);}
    }
  }
}

function applyViewMode(){
  if(!state.groups)return;
  const exploded=state.viewMode==='exploded';
  const positions={
    capEndGroup:exploded?[-25,20,0]:[0,0,0],capBodyGroup:exploded?[-18,20,0]:[0,0,0],nibGripGroup:exploded?[-5,-6,0]:[0,0,0],barrelGroup:exploded?[13,-6,0]:[0,0,0],barrelEndGroup:exploded?[28,-6,0]:[0,0,0]
  };
  for(const[name,position]of Object.entries(positions)){const group=state.groups[name];if(!group)continue;group.position.set(...position);}
  focusPart(state.activePartId,false);
}

function focusPart(id,animate=true){
  if(!controls||!camera)return;
  const target=new THREE.Vector3(PART_X[id]??15,state.viewMode==='exploded'?(id.startsWith('cap')?18:-5):0,0);
  if(!animate||reducedMotion.matches){controls.target.copy(target);camera.position.set(target.x+10,target.y+18,mobileMedia.matches?235:205);controls.update();return;}
  const startTarget=controls.target.clone();const startPosition=camera.position.clone();const endPosition=new THREE.Vector3(target.x+10,target.y+18,mobileMedia.matches?235:205);const start=performance.now();
  const step=now=>{const progress=Math.min(1,(now-start)/320);const eased=1-Math.pow(1-progress,3);controls.target.lerpVectors(startTarget,target,eased);camera.position.lerpVectors(startPosition,endPosition,eased);controls.update();if(progress<1)requestAnimationFrame(step);};requestAnimationFrame(step);
}

function pulsePart(){elements.viewerCard?.classList.remove('part-pulse');requestAnimationFrame(()=>elements.viewerCard?.classList.add('part-pulse'));setTimeout(()=>elements.viewerCard?.classList.remove('part-pulse'),520);}
function selectPart(id,focus=false){if(!parts.some(part=>part.id===id))return;state.activePartId=id;applyColors();renderCustomizer();if(focus)focusPart(id,true);dispatchEvent(new CustomEvent('partchange',{detail:{partId:id}}));}
function movePart(direction){const index=parts.findIndex(part=>part.id===state.activePartId);const next=index+direction;if(next>=0&&next<parts.length){selectPart(parts[next].id,true);$('.control-card')?.scrollIntoView({behavior:reducedMotion.matches?'auto':'smooth',block:'start'});}else if(direction>0){$('#result-section')?.scrollIntoView({behavior:reducedMotion.matches?'auto':'smooth',block:'start'});}}

function resize(){if(!renderer||!camera||!elements.stage)return;const width=Math.max(1,elements.stage.clientWidth);const height=Math.max(1,elements.stage.clientHeight);renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();}
function renderFrame(){if(renderer&&scene&&camera)renderer.render(scene,camera);}
function loop(){animationId=requestAnimationFrame(loop);if(document.hidden)return;controls?.update();renderFrame();}

function init3D(){
  if(!elements.canvas)return;
  try{
    renderer=new THREE.WebGLRenderer({canvas:elements.canvas,antialias:true,alpha:true,preserveDrawingBuffer:true,powerPreference:'high-performance'});
    renderer.setPixelRatio(Math.min(devicePixelRatio,mobileMedia.matches?1.25:1.7));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;renderer.shadowMap.enabled=!mobileMedia.matches;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    scene=new THREE.Scene();camera=new THREE.PerspectiveCamera(31,1,.1,2000);camera.position.set(20,18,mobileMedia.matches?235:205);
    controls=new OrbitControls(camera,elements.canvas);controls.enableDamping=true;controls.dampingFactor=.07;controls.enablePan=false;controls.minDistance=120;controls.maxDistance=360;controls.autoRotate=!reducedMotion.matches;controls.autoRotateSpeed=.34;controls.target.set(12,0,0);
    const pmrem=new THREE.PMREMGenerator(renderer);const room=new RoomEnvironment();scene.environment=pmrem.fromScene(room,.04).texture;room.dispose();pmrem.dispose();
    scene.add(new THREE.HemisphereLight(0xffffff,0x8390a0,1.35));const key=new THREE.DirectionalLight(0xffffff,2.1);key.position.set(-20,55,90);key.castShadow=!mobileMedia.matches;scene.add(key);const fill=new THREE.DirectionalLight(0xc5d9ff,1.1);fill.position.set(80,-30,60);scene.add(fill);
    const model=buildPenModel({customMaterial:resinMaterial,fixedMetal,darkInset,feedMaterial});state.root=model.root;state.groups=model.groups;state.partMeshes=model.partMeshes;scene.add(state.root);state.ready=true;
    applyColors();applyViewMode();resize();focusPart(state.activePartId,false);
    elements.loading.hidden=true;elements.error.hidden=true;elements.fallback?.classList.remove('is-visible');
    resizeObserver=new ResizeObserver(resize);resizeObserver.observe(elements.stage);loop();setupCanvasPicking();
    renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();state.renderFailed=true;elements.error.hidden=false;elements.fallback?.classList.add('is-visible');dispatchEvent(new CustomEvent('viewerstatus',{detail:{status:'error'}}));});
    dispatchEvent(new Event('penviewerready'));dispatchEvent(new CustomEvent('viewerstatus',{detail:{status:'ready'}}));
  }catch(error){console.error(error);state.renderFailed=true;elements.loading.hidden=true;elements.error.hidden=false;elements.fallback?.classList.add('is-visible');dispatchEvent(new CustomEvent('viewerstatus',{detail:{status:'error'}}));}
}

function setupCanvasPicking(){
  raycaster=new THREE.Raycaster();const pointer=new THREE.Vector2();
  elements.canvas.addEventListener('pointerdown',event=>{pointerDown={x:event.clientX,y:event.clientY};});
  elements.canvas.addEventListener('pointerup',event=>{
    if(!pointerDown||Math.hypot(event.clientX-pointerDown.x,event.clientY-pointerDown.y)>8)return;
    const rect=elements.canvas.getBoundingClientRect();pointer.x=((event.clientX-rect.left)/rect.width)*2-1;pointer.y=-((event.clientY-rect.top)/rect.height)*2+1;raycaster.setFromCamera(pointer,camera);
    const hits=raycaster.intersectObjects(state.root.children,true);const hit=hits.find(item=>item.object.userData.partId);if(hit)selectPart(hit.object.userData.partId,true);
  });
}

function toggleView(){state.viewMode=state.viewMode==='assembled'?'exploded':'assembled';applyViewMode();renderStaticText();}
async function toggleFullscreen(){
  const card=elements.viewerCard;if(!card)return;
  if(!document.fullscreenElement){try{await card.requestFullscreen?.();}catch{card.classList.add('viewer-fullscreen');state.fullscreen=true;renderStaticText();resize();}}else await document.exitFullscreen?.();
}
function resetView(){controls?.reset();camera.position.set(20,18,mobileMedia.matches?235:205);controls?.target.set(12,0,0);controls?.update();}
function resetCombination(){state.selections={...defaultSelection};state.activePartId=parts[0].id;state.viewMode='assembled';persist();applyViewMode();applyColors();renderCustomizer();focusPart(state.activePartId,false);showToast(t('resetDone'));}

function bind(){
  $('#previous-part')?.addEventListener('click',()=>movePart(-1));$('#next-part')?.addEventListener('click',()=>movePart(1));$('#toggle-view')?.addEventListener('click',toggleView);$('#toggle-fullscreen')?.addEventListener('click',toggleFullscreen);$('#fullscreen-close')?.addEventListener('click',toggleFullscreen);$('#zoom-in')?.addEventListener('click',()=>{if(camera){camera.position.multiplyScalar(.86);controls.update();}});$('#zoom-out')?.addEventListener('click',()=>{if(camera){camera.position.multiplyScalar(1.16);controls.update();}});$('#reset-view')?.addEventListener('click',resetView);$('#staff-close')?.addEventListener('click',()=>elements.staffDialog?.close());
  document.addEventListener('fullscreenchange',()=>{state.fullscreen=Boolean(document.fullscreenElement);elements.viewerCard?.classList.toggle('viewer-fullscreen',state.fullscreen);renderStaticText();resize();});
  document.querySelectorAll('[data-language]').forEach(button=>button.addEventListener('click',()=>{setLanguage(button.dataset.language);persist();renderCustomizer();applyColors();}));
  addEventListener('keydown',event=>{if(event.target.matches('input,textarea,select'))return;if(event.key==='ArrowRight')movePart(1);if(event.key==='ArrowLeft')movePart(-1);if(event.key.toLowerCase()==='e')toggleView();if(event.key.toLowerCase()==='r')resetView();});
  mobileMedia.addEventListener?.('change',()=>{renderer?.setPixelRatio(Math.min(devicePixelRatio,mobileMedia.matches?1.25:1.7));resize();});
}

window.blueblackPenApp={
  get selections(){return{...state.selections};},get activePartId(){return state.activePartId;},get ready(){return state.ready;},get viewMode(){return state.viewMode;},selectPart,resetCombination,render:renderFrame,toggleView,focusPart,getCanvas:()=>elements.canvas,getCombination:()=>parts.map(part=>({part,color:colorById(state.selections[part.id])}))
};

renderCustomizer();bind();init3D();
