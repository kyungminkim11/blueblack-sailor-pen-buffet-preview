import {getLanguage,t} from './i18n-v3.js';

const PEN_EXTRA={
  ko:{meta:'블루블랙 펜샵 매장 상담용 세일러 펜뷔페 미리보기입니다. 여섯 개 파츠의 색상을 조합하고 완성된 만년필을 3D로 확인해 보세요.',language:'언어 선택',canvas:'3D 만년필 미리보기',closeDialog:'대화상자 닫기'},
  en:{meta:'Customize six Sailor Pen Buffet parts and preview the finished fountain pen in 3D for an in-store consultation at BlueBlack Pen Shop.',language:'Choose language',canvas:'3D fountain pen preview',closeDialog:'Close dialog'},
  ja:{meta:'セーラー ペンビュッフェの6つのパーツを組み合わせ、完成した万年筆を3Dで確認できるBlueBlack Pen Shop店頭ガイドです。',language:'言語を選択',canvas:'万年筆の3Dプレビュー',closeDialog:'ダイアログを閉じる'},
  'zh-Hans':{meta:'在BlueBlack Pen Shop门店咨询时，自由组合Sailor钢笔自助配色的六个部件，并通过3D查看完成效果。',language:'选择语言',canvas:'钢笔3D预览',closeDialog:'关闭对话框'},
  'zh-Hant':{meta:'在BlueBlack Pen Shop門市諮詢時，自由組合Sailor鋼筆自助配色的六個部件，並透過3D查看完成效果。',language:'選擇語言',canvas:'鋼筆3D預覽',closeDialog:'關閉對話框'}
};
function applyPenExtra(){
  const language=getLanguage();
  const copy=PEN_EXTRA[language]||PEN_EXTRA.ko;
  document.querySelector('meta[name="description"]')?.setAttribute('content',copy.meta);
  document.querySelector('meta[property="og:description"]')?.setAttribute('content',copy.meta);
  document.querySelector('.language-menu summary')?.setAttribute('aria-label',copy.language);
  document.querySelector('.language-switcher')?.setAttribute('aria-label',copy.language);
  document.querySelector('#pen-canvas')?.setAttribute('aria-label',copy.canvas);
  document.querySelector('#zoom-in')?.setAttribute('aria-label',t('zoomIn'));
  document.querySelector('#zoom-out')?.setAttribute('aria-label',t('zoomOut'));
  document.querySelector('#reset-view')?.setAttribute('aria-label',t('resetView'));
  document.querySelector('#fullscreen-close')?.setAttribute('aria-label',t('close'));
  document.querySelector('#staff-close')?.setAttribute('aria-label',copy.closeDialog);
}
document.querySelectorAll('[data-language]').forEach(button=>button.addEventListener('click',()=>setTimeout(applyPenExtra,40)));
new MutationObserver(applyPenExtra).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
applyPenExtra();
