const PEN_SERVICE_COPY={
  ko:{title:'펜뷔페 A/S·구매 안내',intro:'세일러 펜뷔페 구매와 사후 서비스에 관한 주요 조건을 한눈에 확인하세요.',asTitle:'펜뷔페 전용 A/S',generalTitle:'일반 브랜드 A/S를 찾고 계신가요?',generalBody:'파카, 워터맨, 세일러, 라미, 트위스비 등 일반 브랜드는 제조사·수입사별 접수 절차가 다릅니다. 공식 홈페이지 정보 가이드에서 보증서와 접수 방법을 확인해 주세요.',generalButton:'일반 브랜드 A/S 안내'},
  en:{title:'Pen Buffet Service & Purchase Guide',intro:'Review the main purchase and after-sales conditions for the Sailor Pen Buffet.',asTitle:'Pen Buffet after-sales service',generalTitle:'Looking for general brand service?',generalBody:'General brands such as Parker, Waterman, Sailor, Lamy and TWSBI follow different manufacturer or distributor procedures. Check warranty and submission details in the official website guide.',generalButton:'General brand service guide'},
  ja:{title:'ペンビュッフェ 修理・購入案内',intro:'セーラー ペンビュッフェの購入条件とアフターサービスをご確認ください。',asTitle:'ペンビュッフェ専用アフターサービス',generalTitle:'一般ブランドの修理案内をお探しですか？',generalBody:'Parker、Waterman、Sailor、Lamy、TWSBIなど一般ブランドは、メーカー・輸入元ごとに受付方法が異なります。公式サイト情報ガイドで保証書と受付方法をご確認ください。',generalButton:'一般ブランド修理案内'},
  'zh-Hans':{title:'Pen Buffet售后与购买指南',intro:'查看Sailor Pen Buffet的主要购买与售后条件。',asTitle:'Pen Buffet专用售后',generalTitle:'需要普通品牌售后说明吗？',generalBody:'Parker、Waterman、Sailor、Lamy、TWSBI等普通品牌的流程因制造商和进口商而异。请在官方网站信息指南中查看保修卡和申请方式。',generalButton:'普通品牌售后指南'},
  'zh-Hant':{title:'Pen Buffet售後與購買指南',intro:'查看Sailor Pen Buffet的主要購買與售後條件。',asTitle:'Pen Buffet專用售後',generalTitle:'需要一般品牌售後說明嗎？',generalBody:'Parker、Waterman、Sailor、Lamy、TWSBI等一般品牌的流程因製造商與進口商而異。請在官方網站資訊指南中查看保固卡與申請方式。',generalButton:'一般品牌售後指南'}
};
function penServiceLanguage(){
  const value=document.documentElement.lang||'ko';
  if(value.startsWith('zh-Hant')||value.startsWith('zh-TW')||value.startsWith('zh-HK'))return'zh-Hant';
  if(value.startsWith('zh'))return'zh-Hans';
  if(value.startsWith('ja'))return'ja';
  if(value.startsWith('en'))return'en';
  return'ko';
}
function applyPenServiceCopy(){
  const dictionary=PEN_SERVICE_COPY[penServiceLanguage()]||PEN_SERVICE_COPY.ko;
  document.querySelectorAll('[data-pen-service-t]').forEach(node=>{
    const value=dictionary[node.dataset.penServiceT];
    if(value)node.textContent=value;
  });
}
document.querySelectorAll('[data-portal-lang]').forEach(button=>button.addEventListener('click',()=>queueMicrotask(applyPenServiceCopy)));
applyPenServiceCopy();
