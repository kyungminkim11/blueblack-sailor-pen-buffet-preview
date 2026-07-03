const DESKTOP_PAGE_SIZE=12;
const MOBILE_PAGE_SIZE=8;

function waitFor(selector,timeout=8000){
  return new Promise(resolve=>{
    const found=document.querySelector(selector);
    if(found)return resolve(found);
    const observer=new MutationObserver(()=>{
      const node=document.querySelector(selector);
      if(node){observer.disconnect();resolve(node);}
    });
    observer.observe(document.body,{childList:true,subtree:true});
    setTimeout(()=>{observer.disconnect();resolve(document.querySelector(selector));},timeout);
  });
}

function langCopy(){
  const lang=document.documentElement.lang||'ko';
  if(lang.startsWith('en'))return{prev:'Previous',next:'Next',page:(a,b)=>`${a} / ${b}`};
  if(lang.startsWith('ja'))return{prev:'前へ',next:'次へ',page:(a,b)=>`${a} / ${b}`};
  if(lang.startsWith('zh'))return{prev:'上一页',next:'下一页',page:(a,b)=>`${a} / ${b}`};
  return{prev:'이전',next:'다음',page:(a,b)=>`${a} / ${b}`};
}

function addStyles(){
  if(document.querySelector('[data-brand-picker-fix-v33]'))return;
  const style=document.createElement('style');
  style.dataset.brandPickerFixV33='';
  style.textContent=`
.ink-brand-picker-dialog{overflow:hidden!important}
.ink-brand-picker-shell{display:flex!important;flex-direction:column!important;max-height:min(84dvh,820px)!important;overflow:hidden!important}
.ink-brand-picker-list{flex:0 1 auto!important;min-height:0!important;max-height:none!important;overflow-y:auto!important;overscroll-behavior:contain!important;scrollbar-width:thin!important}
.ink-brand-picker-item[hidden]{display:none!important}
.ink-brand-picker-pager{display:flex;align-items:center;justify-content:center;gap:10px;margin-top:14px;padding-top:13px;border-top:1px solid #ded5c7}
.ink-brand-picker-pager button{min-width:78px;min-height:42px;padding:0 14px;border:1px solid #d8cfc2;border-radius:12px;background:#fff;color:#10233f;font-size:12px;font-weight:900}
.ink-brand-picker-pager button:hover,.ink-brand-picker-pager button:focus-visible{border-color:#10233f;outline:none}
.ink-brand-picker-pager button:disabled{opacity:.35;cursor:default}
.ink-brand-picker-page{min-width:62px;color:#657488;font-size:12px;font-weight:900;text-align:center}
@media(min-width:681px){
  .ink-store-quick-shell{grid-template-columns:minmax(0,1fr) auto!important;align-items:start!important}
  .ink-store-quick-nav{display:block!important;border:0!important;border-radius:0!important;background:transparent!important;overflow:visible!important}
  .ink-store-quick-arrow{display:none!important}
  .ink-store-quick-nav:before,.ink-store-quick-nav:after{display:none!important}
  .ink-store-quick-nav .ink-store-quick{display:flex!important;flex-wrap:wrap!important;gap:8px!important;margin:0!important;padding:0!important;overflow:visible!important;scroll-snap-type:none!important}
  .ink-store-quick-nav .ink-store-quick>button:nth-child(n+9){display:none!important}
  .ink-store-all-brands{min-height:44px!important}
}
@media(max-width:680px){
  .ink-brand-picker-dialog{
    position:fixed!important;
    inset:0!important;
    width:calc(100% - 20px)!important;
    max-width:620px!important;
    max-height:calc(100dvh - 28px - env(safe-area-inset-top) - env(safe-area-inset-bottom))!important;
    margin:auto!important;
    border-radius:24px!important;
    overflow:hidden!important;
  }
  .ink-brand-picker-shell{
    box-sizing:border-box!important;
    width:100%!important;
    max-height:calc(100dvh - 28px - env(safe-area-inset-top) - env(safe-area-inset-bottom))!important;
    padding:17px 15px 14px!important;
    border-radius:24px!important;
    overflow:hidden!important;
  }
  .ink-brand-picker-head{flex:0 0 auto!important}
  .ink-brand-picker-search{flex:0 0 auto!important;margin-top:14px!important}
  .ink-brand-picker-meta{flex:0 0 auto!important}
  .ink-brand-picker-list{flex:1 1 auto!important;min-height:0!important;max-height:none!important;overflow-y:auto!important;padding-bottom:6px!important}
  .ink-brand-picker-pager{position:static!important;flex:0 0 auto!important;margin:10px -1px 0!important;padding:11px 0 calc(2px + env(safe-area-inset-bottom))!important;background:#fbf8f2!important}
}
@media(max-width:390px){
  .ink-brand-picker-dialog{width:calc(100% - 14px)!important;max-height:calc(100dvh - 18px - env(safe-area-inset-top) - env(safe-area-inset-bottom))!important}
  .ink-brand-picker-shell{max-height:calc(100dvh - 18px - env(safe-area-inset-top) - env(safe-area-inset-bottom))!important;padding:14px 12px 12px!important}
  .ink-brand-picker-head h2{font-size:22px!important}
  .ink-brand-picker-head p{font-size:11px!important}
  .ink-brand-picker-search input{height:46px!important}
}
`;
  document.head.append(style);
}

function enhanceDialog(dialog){
  if(dialog.dataset.pagedBrandPicker==='true')return;
  dialog.dataset.pagedBrandPicker='true';
  const list=dialog.querySelector('.ink-brand-picker-list');
  const input=dialog.querySelector('.ink-brand-picker-search input');
  if(!list)return;

  const copy=langCopy();
  const pager=document.createElement('div');
  pager.className='ink-brand-picker-pager';
  pager.innerHTML=`<button type="button" data-brand-page-prev>${copy.prev}</button><span class="ink-brand-picker-page" data-brand-page-label></span><button type="button" data-brand-page-next>${copy.next}</button>`;
  list.after(pager);

  const prev=pager.querySelector('[data-brand-page-prev]');
  const next=pager.querySelector('[data-brand-page-next]');
  const label=pager.querySelector('[data-brand-page-label]');
  let page=0;
  let rendering=false;

  const pageSize=()=>matchMedia('(max-width:680px)').matches?MOBILE_PAGE_SIZE:DESKTOP_PAGE_SIZE;
  const render=()=>{
    if(rendering)return;
    rendering=true;
    const items=[...list.querySelectorAll('.ink-brand-picker-item')];
    const size=pageSize();
    const pages=Math.max(1,Math.ceil(items.length/size));
    page=Math.min(page,pages-1);
    items.forEach((item,index)=>{item.hidden=index<page*size||index>=(page+1)*size;});
    pager.hidden=items.length<=size;
    prev.disabled=page<=0;
    next.disabled=page>=pages-1;
    label.textContent=copy.page(page+1,pages);
    list.scrollTop=0;
    rendering=false;
  };

  prev.addEventListener('click',()=>{page=Math.max(0,page-1);render();});
  next.addEventListener('click',()=>{page+=1;render();});
  input?.addEventListener('input',()=>{page=0;queueMicrotask(render);},{capture:true});
  const observer=new MutationObserver(()=>{page=0;queueMicrotask(render);});
  observer.observe(list,{childList:true});
  window.addEventListener('resize',render,{passive:true});
  render();
}

async function init(){
  addStyles();
  const existing=document.querySelector('.ink-brand-picker-dialog');
  if(existing)enhanceDialog(existing);
  const observer=new MutationObserver(()=>{
    const dialog=document.querySelector('.ink-brand-picker-dialog');
    if(dialog)enhanceDialog(dialog);
  });
  observer.observe(document.body,{childList:true,subtree:true});
  await waitFor('.ink-store-quick-shell');
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
else init();
