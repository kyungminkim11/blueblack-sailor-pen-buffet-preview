import{parseProductFile,parseStockFile}from'./catalog-parser.js';
import{updateCatalog}from'./catalog-api.js';

const SESSION_KEY='blueblack-catalog-session';
const ui={infoFile:document.querySelector('#infoFile'),stockFile:document.querySelector('#stockFile'),infoCard:document.querySelector('#infoCard'),stockCard:document.querySelector('#stockCard'),infoState:document.querySelector('#infoState'),stockState:document.querySelector('#stockState'),infoCount:document.querySelector('#infoCount'),stockCount:document.querySelector('#stockCount'),matchCount:document.querySelector('#matchCount'),clear:document.querySelector('#clearFiles'),run:document.querySelector('#runUpdate'),progress:document.querySelector('#progress'),progressTitle:document.querySelector('#progressTitle'),progressPercent:document.querySelector('#progressPercent'),progressBar:document.querySelector('#progressBar'),progressDetail:document.querySelector('#progressDetail'),success:document.querySelector('#success')};

let infoRows=[];
let stockRows=[];

const count=value=>Number(value||0).toLocaleString('ko-KR');
const time=value=>value?new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',dateStyle:'medium',timeStyle:'short'}).format(new Date(value)):'기록 없음';

function setCard(card,state,message){card.classList.remove('ready','error');if(state)card.classList.add(state);return message}
function updateSummary(){
  ui.infoCount.textContent=count(infoRows.length);
  ui.stockCount.textContent=count(stockRows.length);
  const stockCodes=new Set(stockRows.map(row=>row.item_code));
  ui.matchCount.textContent=count(infoRows.reduce((sum,row)=>sum+(stockCodes.has(row.item_code)?1:0),0));
  ui.run.disabled=!(infoRows.length&&stockRows.length);
}
function showProgress(current,total,title,detail=''){
  const percent=total?Math.round(current/total*100):0;
  ui.progress.hidden=false;
  ui.progressTitle.textContent=title;
  ui.progressPercent.textContent=`${percent}%`;
  ui.progressBar.style.width=`${percent}%`;
  ui.progressDetail.textContent=`${count(current)} / ${count(total)}행${detail?`\n${detail}`:''}`;
}

ui.infoFile.addEventListener('change',async()=>{
  const file=ui.infoFile.files?.[0];if(!file)return;
  infoRows=[];ui.infoCard.classList.remove('ready','error');ui.infoState.textContent='파일을 확인하고 있습니다…';updateSummary();
  try{const result=await parseProductFile(file);infoRows=result.rows;ui.infoState.textContent=setCard(ui.infoCard,'ready',`${file.name}\n${result.sheetName} 시트 · ${count(infoRows.length)}행 확인`)}
  catch(error){ui.infoState.textContent=setCard(ui.infoCard,'error',error.message)}
  updateSummary();
});

ui.stockFile.addEventListener('change',async()=>{
  const file=ui.stockFile.files?.[0];if(!file)return;
  stockRows=[];ui.stockCard.classList.remove('ready','error');ui.stockState.textContent='파일을 확인하고 있습니다…';updateSummary();
  try{const result=await parseStockFile(file);stockRows=result.rows;ui.stockState.textContent=setCard(ui.stockCard,'ready',`${file.name}\n${result.sheetName} 시트 · ${count(stockRows.length)}행 확인`)}
  catch(error){ui.stockState.textContent=setCard(ui.stockCard,'error',error.message)}
  updateSummary();
});

ui.clear.addEventListener('click',()=>{
  infoRows=[];stockRows=[];ui.infoFile.value='';ui.stockFile.value='';
  ui.infoCard.classList.remove('ready','error');ui.stockCard.classList.remove('ready','error');
  ui.infoState.textContent='아직 파일을 선택하지 않았습니다.';ui.stockState.textContent='아직 파일을 선택하지 않았습니다.';
  ui.progress.hidden=true;ui.success.hidden=true;updateSummary();
});

ui.run.addEventListener('click',async()=>{
  if(!infoRows.length||!stockRows.length)return;
  if(!confirm(`상품·바코드 ${count(infoRows.length)}행과 재고 ${count(stockRows.length)}행을 DB에 업데이트할까요?`))return;
  const session=sessionStorage.getItem(SESSION_KEY);
  if(!session){alert('관리자 인증이 만료되었습니다. 관리자 페이지에서 다시 로그인해 주세요.');location.href='../';return}
  const total=infoRows.length+stockRows.length;
  ui.run.disabled=true;ui.clear.disabled=true;ui.success.hidden=true;
  try{
    showProgress(0,total,'업데이트를 준비하고 있습니다…');
    const result=await updateCatalog({session,infoRows,stockRows,onStage:(stage,current)=>{
      if(stage==='info-upload')showProgress(current,total,'상품·바코드 정보 전송 중…');
      if(stage==='info-finish')showProgress(infoRows.length,total,'상품·바코드 정보를 검증하고 반영 중…');
      if(stage==='stock-upload')showProgress(infoRows.length+current,total,'재고 정보 전송 중…');
      if(stage==='stock-finish')showProgress(total,total,'재고 정보를 검증하고 반영 중…');
    }});
    showProgress(total,total,'업데이트 완료','상품 빠른찾기와 재고 조사에 새 데이터가 반영되었습니다.');
    ui.success.hidden=false;
    ui.success.innerHTML=`<strong>업데이트가 완료되었습니다.</strong><br>최종 상품 ${count(result.stock?.item_count)}개<br>상품·바코드 ${time(result.info?.info_updated_at)}<br>재고 ${time(result.stock?.stock_updated_at)}`;
  }catch(error){
    ui.progress.hidden=false;ui.progressTitle.textContent='업데이트하지 못했습니다';ui.progressPercent.textContent='0%';ui.progressBar.style.width='0%';ui.progressDetail.textContent=error.message;
  }finally{ui.run.disabled=!(infoRows.length&&stockRows.length);ui.clear.disabled=false}
});

updateSummary();