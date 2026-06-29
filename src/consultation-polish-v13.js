import { parts, colors } from './data.js';
import { getLanguage, localizeColor, localizePart } from './i18n-v3.js';

const copy={
  ko:{guide:'드래그로 회전 · 파츠를 눌러 바로 선택',section:'구매·이용 안내',title:'매장에서 함께 확인해 주세요',body:'구성과 서비스 조건을 확인한 뒤 실물 파츠와 최종 색상을 비교해 주세요.',badge:'상담 필수 안내',mobileShare:'조합 공유',mobileStaff:'직원 확인',items:[['✒','펜촉','MF 단일촉으로 제공됩니다.'],['▣','기본 구성','블랙 색상 카트리지 2개가 동봉됩니다.'],['＋','컨버터','기본 구성에 포함되지 않으며 별도 구매 상품입니다.'],['◷','추가 색상','본품 구매 당일에 한해 추가 색상 파츠를 구매할 수 있습니다.'],['✓','A/S 안내','블루블랙 펜샵에서만 가능하며 기한과 점검비는 없습니다. 부품 교체 시 비용이 발생합니다.'],['※','사은품 기준','펜뷔페 제품 금액은 사은품 합산 금액에서 제외됩니다.']]},
  en:{guide:'Drag to rotate · Tap the pen to select a part',section:'Purchase information',title:'Please review these details in store',body:'Confirm the included items and service terms, then compare the final colors with the physical parts.',badge:'Important consultation notes',mobileShare:'Share',mobileStaff:'Staff check',items:[['✒','Nib','Available with an MF nib only.'],['▣','Included','Two black ink cartridges are included.'],['＋','Converter','Not included and sold separately.'],['◷','Additional colors','Additional color parts may be purchased only on the same day as the main pen.'],['✓','After-sales service','Available only at BlueBlack Pen Shop, with no time limit or inspection fee. Replacement parts may incur a charge.'],['※','Gift calculation','Pen Buffet purchases are excluded from the gift-amount calculation.']]},
  ja:{guide:'ドラッグで回転 · 万年筆を押してパーツを選択',section:'購入・ご利用案内',title:'店頭で一緒にご確認ください',body:'構成品とサービス条件を確認し、実物パーツと最終カラーを比較してください。',badge:'接客時の重要案内',mobileShare:'共有',mobileStaff:'スタッフ確認',items:[['✒','ペン先','MFのみです。'],['▣','基本構成','ブラックのカートリッジ2本が付属します。'],['＋','コンバーター','基本構成には含まれず、別売りです。'],['◷','追加カラー','本体購入当日に限り、追加カラーパーツを購入できます。'],['✓','アフターサービス','BlueBlack Pen Shopのみで対応します。期限と点検費はありませんが、部品交換時は費用が発生します。'],['※','ノベルティ基準','ペンビュッフェ製品はノベルティ合算金額の対象外です。']]},
  'zh-Hans':{guide:'拖动旋转 · 点击钢笔可直接选择部件',section:'购买与使用说明',title:'请在店内一同确认',body:'请先确认配置与服务条件，再将最终颜色与实物部件进行比较。',badge:'咨询重要说明',mobileShare:'分享组合',mobileStaff:'店员确认',items:[['✒','笔尖','仅提供 MF 笔尖。'],['▣','基本配置','随附2支黑色墨囊。'],['＋','上墨器','不含在基本配置内，需另行购买。'],['◷','追加颜色','仅限购买钢笔本体当天购买追加颜色部件。'],['✓','售后服务','仅限 BlueBlack Pen Shop 提供，不限期限且免检测费；更换部件时会产生费用。'],['※','赠品金额','Pen Buffet 产品金额不计入赠品累计金额。']]},
  'zh-Hant':{guide:'拖曳旋轉 · 點擊鋼筆可直接選擇部件',section:'購買與使用說明',title:'請在店內一同確認',body:'請先確認配置與服務條件，再將最終顏色與實物部件進行比較。',badge:'諮詢重要說明',mobileShare:'分享組合',mobileStaff:'店員確認',items:[['✒','筆尖','僅提供 MF 筆尖。'],['▣','基本配置','隨附2支黑色墨囊。'],['＋','吸墨器','不含在基本配置內，需另行購買。'],['◷','追加顏色','僅限購買鋼筆本體當天購買追加顏色部件。'],['✓','售後服務','僅限 BlueBlack Pen Shop 提供，不限期限且免檢測費；更換部件時會產生費用。'],['※','贈品金額','Pen Buffet 產品金額不計入贈品累計金額。']]}
};

const text=()=>copy[getLanguage()]||copy.ko;
const colorById=id=>colors.find(color=>color.id===id)||colors[0];

function ensureRibbon(){
  const viewer=document.querySelector('#viewer-card');
  if(!viewer)return null;
  let ribbon=viewer.querySelector('.combination-ribbon');
  if(!ribbon){ribbon=document.createElement('div');ribbon.className='combination-ribbon';ribbon.setAttribute('aria-label','Current combination');viewer.append(ribbon);}
  return ribbon;
}

function renderRibbon(){
  const ribbon=ensureRibbon();
  if(!ribbon||!window.blueblackPenApp)return;
  const selections=window.blueblackPenApp.selections;
  const active=window.blueblackPenApp.activePartId;
  ribbon.replaceChildren(...parts.map((part,index)=>{
    const color=colorById(selections[part.id]);
    const button=document.createElement('button');
    button.type='button';
    button.dataset.partId=part.id;
    button.setAttribute('aria-current',String(part.id===active));
    button.innerHTML=`<span class="combination-ribbon-dot" style="background:${color.hex}"></span><span class="combination-ribbon-copy"><small>${index+1}. ${localizePart(part).name}</small><b>${localizeColor(color)}</b></span>`;
    button.addEventListener('click',()=>window.blueblackPenApp.selectPart(part.id,true));
    return button;
  }));
}

function ensureGuidance(){
  const stage=document.querySelector('#viewer-stage');
  if(!stage)return;
  let node=stage.querySelector('.viewer-guidance');
  if(!node){node=document.createElement('div');node.className='viewer-guidance';stage.append(node);}
  node.textContent=text().guide;
}

function ensurePolicy(){
  let section=document.querySelector('.consultation-section');
  if(!section){
    section=document.createElement('section');
    section.className='consultation-section';
    const result=document.querySelector('#result-section');
    result?.insertAdjacentElement('beforebegin',section);
  }
  const value=text();
  section.innerHTML=`<div class="consultation-card"><div class="consultation-card-head"><div><small>${value.section}</small><h2>${value.title}</h2><p>${value.body}</p></div><span class="consultation-badge">${value.badge}</span></div><div class="consultation-grid"></div></div>`;
  const grid=section.querySelector('.consultation-grid');
  value.items.forEach((item,index)=>{
    const article=document.createElement('article');
    article.className=`consultation-item${index===3||index===4?' is-important':''}`;
    article.innerHTML=`<span class="consultation-icon">${item[0]}</span><div><b>${item[1]}</b><p>${item[2]}</p></div>`;
    grid.append(article);
  });
}

function ensureMobileActions(){
  let bar=document.querySelector('.mobile-primary-actions');
  if(!bar){
    bar=document.createElement('div');
    bar.className='mobile-primary-actions';
    bar.innerHTML='<button type="button" class="primary mobile-share-v13"></button><button type="button" class="secondary mobile-staff-v13"></button>';
    document.body.append(bar);
    bar.querySelector('.mobile-share-v13').addEventListener('click',()=>document.querySelector('#share-combination')?.click());
    bar.querySelector('.mobile-staff-v13').addEventListener('click',()=>document.querySelector('#staff-view')?.click());
  }
  bar.querySelector('.mobile-share-v13').textContent=text().mobileShare;
  bar.querySelector('.mobile-staff-v13').textContent=text().mobileStaff;
}

function ensureStaffPolicy(){
  const body=document.querySelector('#staff-dialog .staff-dialog-body');
  if(!body)return;
  let box=body.querySelector('.staff-policy-v13');
  if(!box){box=document.createElement('section');box.className='staff-policy-v13';body.append(box);}
  const value=text();
  box.innerHTML=`<h3>${value.badge}</h3><ul>${value.items.map(item=>`<li>${item[1]} · ${item[2]}</li>`).join('')}</ul>`;
}

function renderAll(){renderRibbon();ensureGuidance();ensurePolicy();ensureMobileActions();ensureStaffPolicy();}

addEventListener('combinationchange',renderRibbon);
addEventListener('partchange',renderRibbon);
document.querySelectorAll('[data-language]').forEach(button=>button.addEventListener('click',()=>setTimeout(renderAll,60)));
document.querySelector('#staff-view')?.addEventListener('click',()=>setTimeout(ensureStaffPolicy,80));
const observer=new MutationObserver(()=>{if(document.querySelector('#staff-dialog[open]'))ensureStaffPolicy();});
observer.observe(document.body,{subtree:true,attributes:true,attributeFilter:['open']});
setTimeout(renderAll,180);
