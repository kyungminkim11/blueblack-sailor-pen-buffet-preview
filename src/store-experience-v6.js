import { parts, colors } from './data.js';
import { getLanguage } from './i18n-v3.js';

const copy={
  ko:{summary:'추천 조합으로 시작하기',title:'추천 조합 예시',subtitle:'원하는 조합을 선택한 뒤 각 파츠를 자유롭게 수정할 수 있습니다.',active:'적용 중',jump:'이 파츠 다시 선택',presets:[['클리어 클래식','투명 수지와 실버 메탈의 깔끔한 기본 조합'],['딥 블루 추천 조합','딥 블루와 차콜을 중심으로 한 차분한 조합'],['사쿠라 골드','부드러운 핑크 계열과 골드 메탈 조합'],['제이드 실버','청록과 옐로 포인트를 더한 산뜻한 조합']]},
  en:{summary:'Start with a recommended combination',title:'Recommended combinations',subtitle:'Choose an example, then fine-tune every part and color.',active:'Applied',jump:'Edit this part',presets:[['Clear Classic','A clean combination of transparent resin and silver metal'],['Deep Blue Combination','A calm palette built around deep blue and charcoal'],['Sakura Gold','Soft pink tones paired with warm gold metal'],['Jade Silver','Fresh jade tones with a yellow accent and silver metal']]},
  ja:{summary:'おすすめの組み合わせから始める',title:'おすすめ配色例',subtitle:'配色例を選んだ後、各パーツの色を自由に変更できます。',active:'適用中',jump:'このパーツを変更',presets:[['クリアクラシック','透明樹脂とシルバーメタルのすっきりした基本配色'],['ディープブルー配色','ディープブルーとチャコールを中心にした落ち着いた配色'],['サクラゴールド','柔らかなピンク系カラーとゴールドメタルの組み合わせ'],['ジェイドシルバー','ジェイドとイエローを加えた爽やかな配色']]}
};

const presets=[
  {id:'clear-classic',metal:'Silver',values:{cap_body:'clear',cap_end:'clear',nib_grip:'clear',metal_parts:'silver',barrel_body:'clear',barrel_end:'clear'}},
  {id:'deep-blue',metal:'Silver',values:{cap_body:'sapphire',cap_end:'wolf',nib_grip:'skeleton-flower',metal_parts:'silver',barrel_body:'sapphire',barrel_end:'wolf'}},
  {id:'sakura-gold',metal:'Gold',values:{cap_body:'sakuramochi',cap_end:'strawberry',nib_grip:'rabbit',metal_parts:'gold',barrel_body:'sakuramochi',barrel_end:'strawberry'}},
  {id:'jade-silver',metal:'Silver',values:{cap_body:'jade',cap_end:'ginkgo-nuts',nib_grip:'skeleton-flower',metal_parts:'silver',barrel_body:'jade',barrel_end:'ginkgo-nuts'}}
];

function text(){return copy[getLanguage()]??copy.ko;}
function colorById(id){return colors.find((color)=>color.id===id);}
function currentValues(){const query=new URLSearchParams(location.search);return Object.fromEntries(parts.map((part)=>[part.id,query.get(part.id)]));}
function active(preset){const values=currentValues();return parts.every((part)=>values[part.id]===preset.values[part.id]);}

function applyPreset(preset){
  const query=new URLSearchParams(location.search);
  for(const part of parts)query.set(part.id,preset.values[part.id]);
  query.set('lang',getLanguage());
  localStorage.setItem('blueblack-pen-combination-query',query.toString());
  localStorage.setItem('blueblack-pen-completed-parts',JSON.stringify(parts.map((part)=>part.id)));
  location.assign(`${location.pathname}?${query}`);
}

function card(preset,index){
  const labels=text().presets[index];
  const button=document.createElement('button');
  button.type='button';
  button.className='preset-card';
  if(active(preset))button.classList.add('is-active');
  button.setAttribute('aria-pressed',String(active(preset)));
  const dots=parts.filter((part)=>part.id!=='metal_parts').map((part)=>preset.values[part.id]);
  button.innerHTML=`<span class="preset-metal">${preset.metal}</span><b>${labels[0]}</b><p>${labels[1]}</p><span class="preset-dots">${dots.map((id)=>`<i class="preset-dot" style="background:${colorById(id)?.hex??'#ccc'}"></i>`).join('')}</span><span class="preset-active-badge">${text().active}</span>`;
  button.addEventListener('click',()=>applyPreset(preset));
  return button;
}

function render(){
  const grid=document.querySelector('#part-grid');
  if(!grid)return false;
  let details=document.querySelector('.preset-details');
  if(!details){details=document.createElement('details');details.className='preset-details';grid.insertAdjacentElement('beforebegin',details);}
  const wasOpen=details.open;
  details.innerHTML=`<summary>${text().summary}</summary><div class="preset-section"><div class="preset-heading"><div><small>RECOMMENDED</small><h3>${text().title}</h3></div><p>${text().subtitle}</p></div><div class="preset-grid"></div></div>`;
  details.open=wasOpen||presets.some(active);
  details.querySelector('.preset-grid').append(...presets.map(card));
  return true;
}

function enhanceSummary(){
  document.querySelectorAll('.summary-list').forEach((target)=>{
    [...target.querySelectorAll('.summary-item')].forEach((item,index)=>{
      if(item.dataset.jumpReady)return;
      item.dataset.jumpReady='true';item.classList.add('summary-jump');item.tabIndex=0;item.setAttribute('role','button');item.setAttribute('aria-label',`${item.textContent.trim()} · ${text().jump}`);
      const activate=()=>{document.querySelector('#staff-dialog')?.close();window.blueblackPenApp?.selectPart?.(parts[index].id,true);document.querySelector('.control-card')?.scrollIntoView({behavior:'smooth',block:'start'});};
      item.addEventListener('click',activate);item.addEventListener('keydown',(event)=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();activate();}});
    });
  });
}

function initialize(){
  if(!render()){setTimeout(initialize,80);return;}
  enhanceSummary();
  const observer=new MutationObserver(enhanceSummary);document.querySelectorAll('.summary-list').forEach((target)=>observer.observe(target,{childList:true}));
  document.querySelectorAll('[data-language]').forEach((button)=>button.addEventListener('click',()=>setTimeout(()=>{render();enhanceSummary();})));
}
setTimeout(initialize,0);
