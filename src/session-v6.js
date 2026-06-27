const STORAGE_KEY='blueblack-pen-combination-query';
const TOUCHED_KEY='blueblack-pen-completed-parts';
const PART_IDS=['cap_body','cap_end','nib_grip','metal_parts','barrel_body','barrel_end'];

const copy={
  ko:{
    title:'새 조합을 시작할까요?',copy:'이 기기에 이전에 만들던 조합이 저장되어 있습니다.',newTitle:'새 조합 시작',newCopy:'기본 색상으로 초기화하고 처음부터 선택합니다.',continueTitle:'이전 조합 이어서',continueCopy:'마지막으로 선택한 색상 조합을 다시 불러옵니다.',
    idleTitle:'다음 고객을 위해 화면을 정리할까요?',idleCopy:'일정 시간 동안 조작이 없어 현재 조합을 초기화할 수 있습니다.',resetTitle:'새 고객 시작',resetCopy:'현재 조합을 지우고 기본 화면으로 돌아갑니다.',keepTitle:'현재 조합 유지',keepCopy:'지금 화면을 그대로 계속 사용합니다.'
  },
  en:{
    title:'Start a new combination?',copy:'A previous combination is saved on this device.',newTitle:'Start a new combination',newCopy:'Reset to the default colors and begin again.',continueTitle:'Continue previous combination',continueCopy:'Restore the last selected colors.',
    idleTitle:'Prepare the screen for the next customer?',idleCopy:'There has been no activity for a while. You can reset the current combination.',resetTitle:'Start for a new customer',resetCopy:'Clear the current combination and return to the default view.',keepTitle:'Keep current combination',keepCopy:'Continue using the current screen.'
  },
  ja:{
    title:'新しい組み合わせを始めますか？',copy:'この端末には前回作成した組み合わせが保存されています。',newTitle:'新しい組み合わせを始める',newCopy:'基本カラーに戻して最初から選択します。',continueTitle:'前回の組み合わせを続ける',continueCopy:'最後に選択した色の組み合わせを復元します。',
    idleTitle:'次のお客様のために画面を初期化しますか？',idleCopy:'しばらく操作がありませんでした。現在の組み合わせを初期化できます。',resetTitle:'新しいお客様を開始',resetCopy:'現在の組み合わせを消して基本画面に戻ります。',keepTitle:'現在の組み合わせを維持',keepCopy:'現在の画面をそのまま使用します。'
  }
};

function language(){const value=document.documentElement.lang?.toLowerCase()??'ko';if(value.startsWith('en'))return'en';if(value.startsWith('ja'))return'ja';return'ko';}
function text(){return copy[language()]??copy.ko;}
function hasCurrentSelection(){const query=new URLSearchParams(location.search);return PART_IDS.some((id)=>query.has(id));}
function savedQuery(){return localStorage.getItem(STORAGE_KEY);}

function clearCombination(){
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(TOUCHED_KEY);
  sessionStorage.removeItem('blueblack-resume-note-shown');
  window.blueblackPenApp?.resetCombination?.();
}

function continueCombination(){
  const saved=savedQuery();
  if(!saved)return;
  const query=new URLSearchParams(saved);
  location.assign(`${location.pathname}?${query}`);
}

function createDialog(){
  let dialog=document.querySelector('#session-dialog');
  if(dialog)return dialog;
  dialog=document.createElement('dialog');
  dialog.id='session-dialog';
  dialog.className='session-dialog';
  dialog.innerHTML=`<div class="session-dialog-body"><div class="session-dialog-head"><div><h2></h2><p></p></div></div><div class="session-choice"><button type="button" class="session-primary"><b></b><span></span></button><button type="button" class="session-secondary"><b></b><span></span></button></div><p class="idle-note"></p></div>`;
  document.body.append(dialog);
  return dialog;
}

function openSessionDialog(mode='resume'){
  const dialog=createDialog();
  const value=text();
  const primary=dialog.querySelector('.session-primary');
  const secondary=dialog.querySelector('.session-secondary');
  primary.replaceWith(primary.cloneNode(true));
  secondary.replaceWith(secondary.cloneNode(true));
  const nextPrimary=dialog.querySelector('.session-primary');
  const nextSecondary=dialog.querySelector('.session-secondary');

  if(mode==='idle'){
    dialog.querySelector('h2').textContent=value.idleTitle;
    dialog.querySelector('.session-dialog-head p').textContent=value.idleCopy;
    nextPrimary.querySelector('b').textContent=value.resetTitle;
    nextPrimary.querySelector('span').textContent=value.resetCopy;
    nextSecondary.querySelector('b').textContent=value.keepTitle;
    nextSecondary.querySelector('span').textContent=value.keepCopy;
    nextPrimary.addEventListener('click',()=>{clearCombination();dialog.close();});
    nextSecondary.addEventListener('click',()=>dialog.close());
    dialog.querySelector('.idle-note').textContent='';
  }else{
    dialog.querySelector('h2').textContent=value.title;
    dialog.querySelector('.session-dialog-head p').textContent=value.copy;
    nextPrimary.querySelector('b').textContent=value.newTitle;
    nextPrimary.querySelector('span').textContent=value.newCopy;
    nextSecondary.querySelector('b').textContent=value.continueTitle;
    nextSecondary.querySelector('span').textContent=value.continueCopy;
    nextPrimary.addEventListener('click',()=>{clearCombination();dialog.close();});
    nextSecondary.addEventListener('click',continueCombination);
    dialog.querySelector('.idle-note').textContent='';
  }
  dialog.showModal();
}

function setupResumeChoice(){
  if(hasCurrentSelection()||!savedQuery())return;
  openSessionDialog('resume');
}

function setupIdleReset(){
  const storeLike=matchMedia('(min-width:700px)').matches||new URLSearchParams(location.search).get('mode')==='store';
  if(!storeLike)return;
  let timer;
  const reset=()=>{
    clearTimeout(timer);
    timer=setTimeout(()=>{
      if(!document.hidden&&!document.querySelector('dialog[open]'))openSessionDialog('idle');
    },12*60*1000);
  };
  ['pointerdown','keydown','touchstart','wheel'].forEach((event)=>addEventListener(event,reset,{passive:true}));
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)reset();});
  reset();
}

setTimeout(()=>{setupResumeChoice();setupIdleReset();},0);
