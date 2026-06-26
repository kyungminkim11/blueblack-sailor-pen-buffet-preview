import { parts, colors } from './data.js';
import { getLanguage } from './i18n-v3.js';

const copy = {
  ko: {
    kicker: 'RECOMMENDED', title: '추천 조합으로 빠르게 시작해보세요', subtitle: '마음에 드는 조합을 선택한 뒤 파츠별로 자유롭게 수정할 수 있습니다.',
    apply: '적용 중', jump: '이 파츠 다시 선택', restored: '이전에 만들던 조합을 불러왔습니다.', dismiss: '확인',
    presets: [
      ['클리어 클래식','투명 수지와 실버 메탈의 깔끔한 기본 조합'],
      ['블루블랙 시그니처','딥 블루와 차콜을 중심으로 한 차분한 조합'],
      ['사쿠라 골드','부드러운 핑크 계열과 골드 메탈 조합'],
      ['제이드 실버','청록과 옐로 포인트를 더한 산뜻한 조합'],
    ],
  },
  en: {
    kicker: 'RECOMMENDED', title: 'Start with a curated combination', subtitle: 'Choose a preset, then fine-tune each part and color.',
    apply: 'Applied', jump: 'Edit this part', restored: 'Your previous combination has been restored.', dismiss: 'Got it',
    presets: [
      ['Clear Classic','A clean combination of transparent resin and silver metal'],
      ['BlueBlack Signature','A calm palette built around deep blue and charcoal'],
      ['Sakura Gold','Soft pink tones paired with warm gold metal'],
      ['Jade Silver','Fresh jade tones with a yellow accent and silver metal'],
    ],
  },
  ja: {
    kicker: 'RECOMMENDED', title: 'おすすめの組み合わせから始める', subtitle: 'プリセットを選んだ後、各パーツの色を自由に変更できます。',
    apply: '適用中', jump: 'このパーツを変更', restored: '前回の組み合わせを復元しました。', dismiss: '確認',
    presets: [
      ['クリアクラシック','透明樹脂とシルバーメタルのすっきりした基本配色'],
      ['BlueBlack シグネチャー','ディープブルーとチャコールを中心にした落ち着いた配色'],
      ['サクラゴールド','柔らかなピンク系カラーとゴールドメタルの組み合わせ'],
      ['ジェイドシルバー','ジェイドとイエローのアクセントを加えた爽やかな配色'],
    ],
  },
};

const presets = [
  { id:'clear-classic', metal:'Silver', values:{ cap_body:'clear', cap_end:'clear', nib_grip:'clear', metal_parts:'silver', barrel_body:'clear', barrel_end:'clear' } },
  { id:'blueblack-signature', metal:'Silver', values:{ cap_body:'sapphire', cap_end:'wolf', nib_grip:'skeleton-flower', metal_parts:'silver', barrel_body:'sapphire', barrel_end:'wolf' } },
  { id:'sakura-gold', metal:'Gold', values:{ cap_body:'sakuramochi', cap_end:'strawberry', nib_grip:'rabbit', metal_parts:'gold', barrel_body:'sakuramochi', barrel_end:'strawberry' } },
  { id:'jade-silver', metal:'Silver', values:{ cap_body:'jade', cap_end:'ginkgo-nuts', nib_grip:'skeleton-flower', metal_parts:'silver', barrel_body:'jade', barrel_end:'ginkgo-nuts' } },
];

function text(){ return copy[getLanguage()] ?? copy.ko; }
function colorById(id){ return colors.find((color)=>color.id===id); }

function loadStyle(){
  if(document.querySelector('link[data-store-experience-v5]')) return;
  const link=document.createElement('link');
  link.rel='stylesheet';
  link.href='./store-experience-v5.css';
  link.dataset.storeExperienceV5='true';
  document.head.append(link);
}

function currentValues(){
  const query=new URLSearchParams(location.search);
  return Object.fromEntries(parts.map((part)=>[part.id,query.get(part.id)]));
}

function presetIsActive(preset){
  const values=currentValues();
  return parts.every((part)=>values[part.id]===preset.values[part.id]);
}

function createPresetCard(preset,index){
  const label=text().presets[index];
  const card=document.createElement('button');
  card.type='button';
  card.className='preset-card';
  card.dataset.presetId=preset.id;
  card.setAttribute('aria-pressed',String(presetIsActive(preset)));
  if(presetIsActive(preset)) card.classList.add('is-active');
  const dotIds=parts.filter((part)=>part.id!=='metal_parts').map((part)=>preset.values[part.id]);
  card.innerHTML=`
    <span class="preset-metal">${preset.metal}</span>
    <b>${label[0]}</b>
    <p>${label[1]}</p>
    <span class="preset-dots">${dotIds.map((id)=>`<i class="preset-dot" style="background:${colorById(id)?.hex ?? '#ccc'}"></i>`).join('')}</span>
    <span class="preset-active-badge">${text().apply}</span>
  `;
  card.addEventListener('click',()=>applyPreset(preset));
  return card;
}

function applyPreset(preset){
  const query=new URLSearchParams(location.search);
  for(const part of parts) query.set(part.id,preset.values[part.id]);
  query.set('lang',getLanguage());
  localStorage.setItem('blueblack-pen-combination-query',query.toString());
  localStorage.setItem('blueblack-pen-completed-parts',JSON.stringify(parts.map((part)=>part.id)));
  sessionStorage.setItem('blueblack-scroll-after-preset','1');
  location.assign(`${location.pathname}?${query}`);
}

function renderPresets(){
  const control=document.querySelector('.control-card');
  const partGrid=document.querySelector('#part-grid');
  if(!control||!partGrid) return false;
  let section=document.querySelector('.preset-section');
  if(!section){
    section=document.createElement('section');
    section.className='preset-section';
    partGrid.insertAdjacentElement('beforebegin',section);
  }
  section.innerHTML=`<div class="preset-heading"><div><small>${text().kicker}</small><h3>${text().title}</h3></div><p>${text().subtitle}</p></div><div class="preset-grid"></div>`;
  section.querySelector('.preset-grid').append(...presets.map(createPresetCard));
  return true;
}

function selectPartByIndex(index){
  const button=document.querySelectorAll('#part-grid .part-button')[index];
  button?.click();
  document.querySelector('.control-card')?.scrollIntoView({behavior:'smooth',block:'start'});
}

function enhanceSummary(){
  for(const [targetIndex,target] of [...document.querySelectorAll('.summary-list')].entries()){
    [...target.querySelectorAll('.summary-item')].forEach((item,index)=>{
      if(item.dataset.jumpReady) return;
      item.dataset.jumpReady='true';
      item.classList.add('summary-jump');
      item.tabIndex=0;
      item.setAttribute('role','button');
      item.setAttribute('aria-label',`${item.textContent.trim()} · ${text().jump}`);
      const activate=()=>{
        if(targetIndex>0) document.querySelector('#staff-dialog')?.close();
        selectPartByIndex(index);
      };
      item.addEventListener('click',activate);
      item.addEventListener('keydown',(event)=>{
        if(event.key==='Enter'||event.key===' '){ event.preventDefault(); activate(); }
      });
    });
  }
}

function showResumeNote(){
  if(sessionStorage.getItem('blueblack-resume-note-shown')) return;
  const query=new URLSearchParams(location.search);
  const restored=parts.every((part)=>query.has(part.id))&&localStorage.getItem('blueblack-pen-combination-query');
  if(!restored) return;
  const main=document.querySelector('main');
  if(!main) return;
  const note=document.createElement('div');
  note.className='resume-note';
  note.innerHTML=`<strong>✓</strong><span>${text().restored}</span><button type="button">${text().dismiss}</button>`;
  main.prepend(note);
  note.querySelector('button').addEventListener('click',()=>note.remove());
  sessionStorage.setItem('blueblack-resume-note-shown','1');
}

function scrollAfterPreset(){
  if(sessionStorage.getItem('blueblack-scroll-after-preset')!=='1') return;
  sessionStorage.removeItem('blueblack-scroll-after-preset');
  window.setTimeout(()=>document.querySelector('.control-card')?.scrollIntoView({block:'start'}),120);
}

function initialize(){
  loadStyle();
  const ready=renderPresets();
  if(!ready){ window.setTimeout(initialize,80); return; }
  enhanceSummary();
  showResumeNote();
  scrollAfterPreset();
  const observer=new MutationObserver(()=>enhanceSummary());
  document.querySelectorAll('.summary-list').forEach((target)=>observer.observe(target,{childList:true}));
  document.querySelectorAll('[data-language]').forEach((button)=>button.addEventListener('click',()=>window.setTimeout(()=>{renderPresets();enhanceSummary();},0)));
}

window.setTimeout(initialize,0);
