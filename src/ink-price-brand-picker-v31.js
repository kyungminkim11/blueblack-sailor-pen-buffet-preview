import {brandGroups,brandName,currentLang,normalize} from './ink-catalog-model-v22.js';

const COPY={
  ko:{open:'전체 브랜드',title:'브랜드 전체 보기',body:'원하는 브랜드를 선택하면 해당 브랜드의 소분 가능 잉크만 바로 보여줍니다.',search:'브랜드 검색',placeholder:'브랜드명을 입력하세요',count:n=>`${n}개 브랜드`,close:'닫기',empty:'일치하는 브랜드가 없습니다.'},
  en:{open:'All brands',title:'Browse all brands',body:'Choose a brand to show only its decantable inks.',search:'Search brands',placeholder:'Type a brand name',count:n=>`${n} brands`,close:'Close',empty:'No matching brands.'},
  ja:{open:'全ブランド',title:'ブランド一覧',body:'ブランドを選ぶと、小分け可能なインクだけを表示します。',search:'ブランド検索',placeholder:'ブランド名を入力',count:n=>`${n}ブランド`,close:'閉じる',empty:'一致するブランドがありません。'},
  'zh-Hans':{open:'全部品牌',title:'查看全部品牌',body:'选择品牌后，仅显示该品牌可分装的墨水。',search:'搜索品牌',placeholder:'输入品牌名称',count:n=>`${n}个品牌`,close:'关闭',empty:'没有匹配的品牌。'},
  'zh-Hant':{open:'全部品牌',title:'查看全部品牌',body:'選擇品牌後，僅顯示該品牌可分裝的墨水。',search:'搜尋品牌',placeholder:'輸入品牌名稱',count:n=>`${n}個品牌`,close:'關閉',empty:'沒有符合的品牌。'}
};

let dialog;
let brands=[];

function text(){return COPY[currentLang()]||COPY.ko;}
function escapeHtml(value=''){return String(value).replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));}
function waitFor(selector,timeout=5000){return new Promise(resolve=>{const existing=document.querySelector(selector);if(existing)return resolve(existing);const observer=new MutationObserver(()=>{const node=document.querySelector(selector);if(node){observer.disconnect();resolve(node);}});observer.observe(document.body,{childList:true,subtree:true});setTimeout(()=>{observer.disconnect();resolve(document.querySelector(selector));},timeout);});}
function selectBrand(group){
  const input=document.querySelector('.ink-store-search');
  if(!input)return;
  input.value=brandName(group);
  input.dispatchEvent(new Event('input',{bubbles:true}));
  dialog?.close();
  document.querySelector('.ink-store-result-head')?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth',block:'start'});
}
function filteredBrands(value=''){
  const query=normalize(value);
  if(!query)return brands;
  return brands.filter(group=>normalize([group.brandKo,group.brandEn].join(' ')).includes(query));
}
function renderButtons(value=''){
  const list=dialog.querySelector('.ink-brand-picker-list');
  const count=dialog.querySelector('[data-brand-picker-count]');
  const values=filteredBrands(value);
  count.textContent=text().count(values.length);
  if(!values.length){list.innerHTML=`<div class="ink-brand-picker-empty">${escapeHtml(text().empty)}</div>`;return;}
  list.replaceChildren(...values.map(group=>{
    const button=document.createElement('button');
    button.type='button';
    button.className='ink-brand-picker-item';
    button.innerHTML=`<span>${escapeHtml(brandName(group))}</span><small>${escapeHtml(currentLang()==='ko'?group.brandEn:group.brandKo||group.brandEn)}</small>`;
    button.addEventListener('click',()=>selectBrand(group));
    return button;
  }));
}
function ensureDialog(){
  if(dialog)return dialog;
  dialog=document.createElement('dialog');
  dialog.className='ink-brand-picker-dialog';
  dialog.innerHTML=`<div class="ink-brand-picker-shell"><div class="ink-brand-picker-head"><div><span class="ink-store-kicker">BRAND DIRECTORY</span><h2>${escapeHtml(text().title)}</h2><p>${escapeHtml(text().body)}</p></div><button type="button" class="ink-brand-picker-close" aria-label="${escapeHtml(text().close)}">×</button></div><label class="ink-brand-picker-search"><span>${escapeHtml(text().search)}</span><input type="search" placeholder="${escapeHtml(text().placeholder)}" autocomplete="off" spellcheck="false"></label><div class="ink-brand-picker-meta"><strong data-brand-picker-count></strong></div><div class="ink-brand-picker-list"></div></div>`;
  document.body.append(dialog);
  const input=dialog.querySelector('input');
  input.addEventListener('input',()=>renderButtons(input.value));
  dialog.querySelector('.ink-brand-picker-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
  return dialog;
}
function openDialog(){
  const node=ensureDialog();
  const input=node.querySelector('input');
  input.value='';
  renderButtons();
  node.showModal();
  requestAnimationFrame(()=>input.focus({preventScroll:true}));
}
function addStyles(){
  if(document.querySelector('[data-ink-brand-picker-style]'))return;
  const style=document.createElement('style');style.dataset.inkBrandPickerStyle='v31';style.textContent=`
.ink-store-all-brands{flex:0 0 auto;min-height:44px;padding:0 15px;border:1px solid #10233f;border-radius:999px;background:#10233f;color:#fff;font-size:12px;font-weight:900;box-shadow:0 7px 16px rgba(16,35,63,.14)}
.ink-store-all-brands:hover,.ink-store-all-brands:focus-visible{background:#1d385c;outline:none}
.ink-brand-picker-dialog{width:min(760px,calc(100% - 24px));max-height:min(84dvh,820px);padding:0;border:0;border-radius:26px;background:transparent}
.ink-brand-picker-dialog::backdrop{background:rgba(8,20,36,.62);backdrop-filter:blur(4px)}
.ink-brand-picker-shell{padding:22px;border:1px solid #e0d7ca;border-radius:26px;background:#fbf8f2;box-shadow:0 24px 70px rgba(8,20,36,.3)}
.ink-brand-picker-head{display:flex;align-items:flex-start;justify-content:space-between;gap:18px}.ink-brand-picker-head h2{margin:7px 0 0;color:#10233f;font-family:Georgia,serif;font-size:28px;letter-spacing:-.03em}.ink-brand-picker-head p{margin:8px 0 0;color:#68778a;font-size:13px;line-height:1.6}
.ink-brand-picker-close{flex:0 0 auto;width:44px;height:44px;border:0;border-radius:13px;background:#eee7dc;color:#10233f;font-size:22px}
.ink-brand-picker-search{display:grid;gap:7px;margin-top:18px}.ink-brand-picker-search span{color:#8c6734;font-size:11px;font-weight:900}.ink-brand-picker-search input{width:100%;height:50px;padding:0 14px;border:1px solid #d8cfc2;border-radius:14px;background:#fff;color:#10233f;font-size:15px;font-weight:700;outline:none}.ink-brand-picker-search input:focus{border-color:#10233f;box-shadow:0 0 0 4px rgba(16,35,63,.08)}
.ink-brand-picker-meta{display:flex;justify-content:flex-end;margin-top:10px;color:#718095;font-size:11px}.ink-brand-picker-list{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px;margin-top:10px;max-height:48dvh;overflow:auto;padding:1px 3px 4px 1px}
.ink-brand-picker-item{display:grid;gap:3px;min-height:58px;padding:10px 12px;border:1px solid #ddd4c8;border-radius:14px;background:#fff;color:#10233f;text-align:left}.ink-brand-picker-item span{overflow-wrap:anywhere;font-size:13px;font-weight:900}.ink-brand-picker-item small{overflow:hidden;color:#7b8795;font-size:10px;text-overflow:ellipsis;white-space:nowrap}.ink-brand-picker-item:hover,.ink-brand-picker-item:focus-visible{border-color:#10233f;background:#f4f7fa;outline:none;box-shadow:0 0 0 3px rgba(16,35,63,.06)}
.ink-brand-picker-empty{grid-column:1/-1;padding:34px 12px;border:1px dashed #cbbda9;border-radius:15px;background:#fff;color:#788596;text-align:center}
@media(max-width:680px){.ink-brand-picker-dialog{width:100%;max-height:88dvh;margin:auto 0 0;border-radius:24px 24px 0 0}.ink-brand-picker-shell{padding:17px 15px calc(17px + env(safe-area-inset-bottom));border-radius:24px 24px 0 0}.ink-brand-picker-head h2{font-size:24px}.ink-brand-picker-head p{font-size:12px}.ink-brand-picker-list{grid-template-columns:repeat(2,minmax(0,1fr));max-height:56dvh}.ink-brand-picker-item{min-height:56px}.ink-store-all-brands{min-height:42px}}
@media(max-width:390px){.ink-brand-picker-list{grid-template-columns:1fr}.ink-brand-picker-item{min-height:52px}}
`;document.head.append(style);
}
async function init(){
  brands=brandGroups().filter(group=>group.priceItems.length).sort((a,b)=>brandName(a).localeCompare(brandName(b),currentLang()==='ko'?'ko':'en'));
  const quick=await waitFor('.ink-store-quick');if(!quick)return;
  addStyles();
  if(quick.querySelector('.ink-store-all-brands'))return;
  const button=document.createElement('button');button.type='button';button.className='ink-store-all-brands';button.textContent=text().open;button.addEventListener('click',openDialog);quick.append(button);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
