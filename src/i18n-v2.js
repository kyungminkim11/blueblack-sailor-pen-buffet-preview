const LANGUAGES = ['ko', 'en', 'ja'];

const copy = {
  ko: {
    'header.title': '세일러 펜뷔페 조합 미리보기',
    'header.copy': '원하는 색을 골라 여섯 개 파츠를 조합해보세요. 완성 모습은 3D로 확인하고, 최종 선택은 매장에서 실물 파츠와 함께 도와드릴게요.',
    'header.status': '매장 상담용 미리보기',
    'guide.kicker': '이용 방법',
    'guide.title': '원하는 조합을 세 단계로 확인해보세요',
    'guide.subtitle': '화면에서 조합한 뒤, 매장에서 실물 색상과 투명도를 최종 확인해 주세요.',
    'guide.step1.title': '파츠와 색상 고르기',
    'guide.step1.copy': '6개 파츠를 차례로 선택하고 원하는 색상을 골라주세요.',
    'guide.step2.title': '완성 모습 확인하기',
    'guide.step2.copy': '3D 화면을 돌리거나 확대해 전체 색상 균형을 살펴보세요.',
    'guide.step3.title': '매장에서 최종 확인하기',
    'guide.step3.copy': '저장한 링크 또는 조합 코드를 직원에게 보여주세요.',
    'viewer.openTitle': '파츠를 나누어 보기',
    'viewer.closedTitle': '완성된 모습 보기',
    'viewer.autoOn': '자동 회전 켜짐',
    'viewer.autoOff': '자동 회전 꺼짐',
    'viewer.showClosed': '완성 모습 보기',
    'viewer.showOpen': '파츠 나누어 보기',
    'viewer.loading': '선택 화면을 준비하고 있습니다',
    'viewer.preparing': '잠시만 기다려 주세요',
    'viewer.errorTitle': '3D 미리보기를 불러오지 못했습니다.',
    'viewer.errorCopy': '페이지를 새로고침하거나 다른 브라우저에서 다시 확인해 주세요.',
    'viewer.hint': '손가락으로 돌려보기 · 두 손가락으로 확대·축소',
    'customize.title': '파츠별 색상을 골라주세요',
    'customize.selected': '선택한 색상',
    'palette.existing': '기존 컬러',
    'palette.new': '신규 컬러',
    'palette.ten': '10가지',
    'palette.newCaption': '2026.06.15 추가 · 10가지',
    'palette.metal': '메탈 컬러',
    'palette.two': '실버 · 골드',
    'palette.note': '화면 색상은 조명과 디스플레이 환경에 따라 실제 파츠와 다르게 보일 수 있습니다. 최종 선택 전 매장 실물을 확인해 주세요.',
    'converter.label': '컨버터 안내',
    'converter.copy': '잉크 컨버터는 펜뷔페 기본 구성에 포함되지 않는 별도 구매 상품입니다. 3D 화면에 보이는 컨버터는 내부 구조를 이해하기 위한 참고 표현입니다.',
    'store.kicker': '매장 이용 안내',
    'store.title': '매장에서는 실물 확인부터 조립까지 도와드려요',
    'store.subtitle': '이 화면은 원하는 조합을 미리 살펴보는 도구입니다. 실제 색상과 투명도를 확인한 뒤 선택을 확정해 주세요.',
    'store.step1.title': '화면에서 조합 만들기',
    'store.step1.copy': '마음에 드는 색을 조합하고 링크 또는 조합 코드를 저장해 주세요.',
    'store.step2.title': '실물 파츠 비교하기',
    'store.step2.copy': '같은 색도 파츠 두께와 조명에 따라 다르게 보일 수 있어 매장 실물을 함께 확인합니다.',
    'store.step3.title': '선택 내용 확정하기',
    'store.step3.copy': '수지 컬러와 실버·골드 메탈파츠를 직원과 함께 최종 확인합니다.',
    'store.step4.title': '직원이 조립하기',
    'store.step4.copy': '확정한 파츠는 직원이 조립해 완성 상태를 확인해 드립니다.',
    'store.fact1.title': '컨버터는 별도 구매',
    'store.fact1.copy': '펜뷔페 기본 구성에는 포함되지 않습니다.',
    'store.fact2.title': '최종 색상은 실물 기준',
    'store.fact2.copy': '3D 화면은 조합 참고용이며 실제 파츠 색상을 우선해 주세요.',
    'store.fact3.title': '재고는 방문 시 확인',
    'store.fact3.copy': '색상별 준비 수량은 매장 상황에 따라 달라질 수 있습니다.',
    'result.title': '선택한 조합을 확인해 주세요',
    'result.subtitle': '현재 선택은 링크와 조합 코드에 자동으로 저장됩니다.',
    'result.code': '매장 확인용 조합 코드',
    'result.codeCopy': '매장 직원에게 이 코드를 보여주시면 선택한 파츠와 색상을 빠르게 확인할 수 있습니다.',
    'result.copyLink': '이 조합 링크 복사',
    'result.saveImage': '3D 이미지 저장',
    'result.reset': '새 조합 만들기',
    'notice.display': '화면 색상은 디스플레이 환경에 따라 실제 색상과 다를 수 있습니다. 최종 선택 전 매장 실물 파츠를 함께 확인해 주세요.',
    'footer.copy': '본 페이지는 블루블랙 펜샵 매장 상담을 위한 조합 미리보기 도구입니다. 화면에 표시된 색상은 실제 파츠와 차이가 있을 수 있습니다.',
    'toast.linkCopied': '현재 조합 링크를 복사했습니다.',
    'toast.linkFailed': '링크를 복사하지 못했습니다. 주소창의 링크를 직접 복사해 주세요.',
    'toast.imageSaved': '현재 3D 화면을 이미지로 저장했습니다.',
    'toast.reset': '새 조합을 만들 수 있도록 기본 상태로 초기화했습니다.',
    'badge.new': 'NEW',
  },
  en: {
    'header.title': 'Sailor Pen Buffet Combination Preview',
    'header.copy': 'Choose colors for six individual parts and preview the finished pen in 3D. Confirm the physical parts with our staff before making your final selection.',
    'header.status': 'In-store consultation preview',
    'guide.kicker': 'HOW TO USE',
    'guide.title': 'Review your combination in three simple steps',
    'guide.subtitle': 'Create a combination on screen, then confirm the actual color and translucency in store.',
    'guide.step1.title': 'Choose parts and colors',
    'guide.step1.copy': 'Select each of the six parts and choose the color you prefer.',
    'guide.step2.title': 'Review the finished look',
    'guide.step2.copy': 'Rotate and zoom the 3D model to check the overall color balance.',
    'guide.step3.title': 'Confirm it in store',
    'guide.step3.copy': 'Show the saved link or combination code to a member of staff.',
    'viewer.openTitle': 'Exploded parts view',
    'viewer.closedTitle': 'Finished pen view',
    'viewer.autoOn': 'Auto-rotate on',
    'viewer.autoOff': 'Auto-rotate off',
    'viewer.showClosed': 'View finished pen',
    'viewer.showOpen': 'View separate parts',
    'viewer.loading': 'Preparing your 3D preview',
    'viewer.preparing': 'Please wait a moment',
    'viewer.errorTitle': 'The 3D preview could not be loaded.',
    'viewer.errorCopy': 'Please refresh the page or try another browser.',
    'viewer.hint': 'Drag to rotate · Pinch with two fingers to zoom',
    'customize.title': 'Choose a color for each part',
    'customize.selected': 'Selected color',
    'palette.existing': 'Original colors',
    'palette.new': 'New colors',
    'palette.ten': '10 colors',
    'palette.newCaption': 'Added 2026.06.15 · 10 colors',
    'palette.metal': 'Metal finish',
    'palette.two': 'Silver · Gold',
    'palette.note': 'Colors may appear different depending on lighting and your display. Please confirm the physical parts in store before making your final choice.',
    'converter.label': 'Converter information',
    'converter.copy': 'The ink converter is sold separately and is not included in the Pen Buffet base set. The converter shown in 3D is for structural reference only.',
    'store.kicker': 'IN-STORE GUIDE',
    'store.title': 'We will help you confirm the parts and complete the assembly',
    'store.subtitle': 'This page is a preview tool. Please confirm the actual color and translucency before finalizing your selection.',
    'store.step1.title': 'Create your combination',
    'store.step1.copy': 'Choose your preferred colors and save the link or combination code.',
    'store.step2.title': 'Compare the physical parts',
    'store.step2.copy': 'The same color may look different depending on part thickness and lighting, so compare the actual parts in store.',
    'store.step3.title': 'Confirm your selection',
    'store.step3.copy': 'Review the resin colors and silver or gold metal finish together with our staff.',
    'store.step4.title': 'Staff assembly',
    'store.step4.copy': 'Once confirmed, a member of staff will assemble the parts and check the finished pen.',
    'store.fact1.title': 'Converter sold separately',
    'store.fact1.copy': 'It is not included in the Pen Buffet base set.',
    'store.fact2.title': 'Physical colors take priority',
    'store.fact2.copy': 'The 3D preview is a guide only. Please base your final choice on the actual parts.',
    'store.fact3.title': 'Check stock when visiting',
    'store.fact3.copy': 'Availability may vary by color and store inventory.',
    'result.title': 'Review your selected combination',
    'result.subtitle': 'Your selections are saved automatically in the link and combination code.',
    'result.code': 'In-store combination code',
    'result.codeCopy': 'Show this code to store staff so they can quickly identify your selected parts and colors.',
    'result.copyLink': 'Copy this combination link',
    'result.saveImage': 'Save 3D image',
    'result.reset': 'Create a new combination',
    'notice.display': 'Screen colors may differ from the actual parts. Please confirm the physical parts in store before making your final selection.',
    'footer.copy': 'This page is a combination preview tool for in-store consultation at BlueBlack Pen Shop. Screen colors may differ from the physical parts.',
    'toast.linkCopied': 'Combination link copied.',
    'toast.linkFailed': 'The link could not be copied. Please copy it directly from the address bar.',
    'toast.imageSaved': 'The current 3D view has been saved as an image.',
    'toast.reset': 'The preview has been reset for a new combination.',
    'badge.new': 'NEW',
  },
  ja: {
    'header.title': 'セーラー万年筆ビュッフェ 組み合わせプレビュー',
    'header.copy': '6つのパーツにお好みの色を選び、完成イメージを3Dでご確認いただけます。最終選択前に店頭で実物パーツをご確認ください。',
    'header.status': '店頭接客用プレビュー',
    'guide.kicker': 'ご利用方法',
    'guide.title': '3つのステップで組み合わせを確認できます',
    'guide.subtitle': '画面上で組み合わせた後、店頭で実物の色と透明感をご確認ください。',
    'guide.step1.title': 'パーツと色を選ぶ',
    'guide.step1.copy': '6つのパーツを順番に選び、お好みの色を指定してください。',
    'guide.step2.title': '完成イメージを確認する',
    'guide.step2.copy': '3Dモデルを回転・拡大して、全体の色のバランスをご確認ください。',
    'guide.step3.title': '店頭で最終確認する',
    'guide.step3.copy': '保存したリンクまたは組み合わせコードをスタッフにお見せください。',
    'viewer.openTitle': 'パーツ分解表示',
    'viewer.closedTitle': '完成イメージ',
    'viewer.autoOn': '自動回転 オン',
    'viewer.autoOff': '自動回転 オフ',
    'viewer.showClosed': '完成イメージを見る',
    'viewer.showOpen': 'パーツを分けて見る',
    'viewer.loading': '3Dプレビューを準備しています',
    'viewer.preparing': '少々お待ちください',
    'viewer.errorTitle': '3Dプレビューを読み込めませんでした。',
    'viewer.errorCopy': 'ページを再読み込みするか、別のブラウザでお試しください。',
    'viewer.hint': '指で回転 · 2本指で拡大・縮小',
    'customize.title': 'パーツごとに色をお選びください',
    'customize.selected': '選択中の色',
    'palette.existing': '既存カラー',
    'palette.new': '新色',
    'palette.ten': '10色',
    'palette.newCaption': '2026.06.15追加 · 10色',
    'palette.metal': '金属カラー',
    'palette.two': 'シルバー · ゴールド',
    'palette.note': '照明やディスプレイ環境により、画面の色は実物パーツと異なる場合があります。最終選択前に店頭で実物をご確認ください。',
    'converter.label': 'コンバーターについて',
    'converter.copy': 'インクコンバーターは基本セットに含まれない別売り商品です。3D画面のコンバーターは内部構造を分かりやすくするための参考表現です。',
    'store.kicker': '店頭でのご案内',
    'store.title': '実物確認から組み立てまでスタッフがお手伝いします',
    'store.subtitle': 'この画面は組み合わせを事前に確認するためのツールです。実物の色と透明感をご確認の上、最終選択をお決めください。',
    'store.step1.title': '画面で組み合わせを作る',
    'store.step1.copy': 'お好みの色を組み合わせ、リンクまたは組み合わせコードを保存してください。',
    'store.step2.title': '実物パーツを比べる',
    'store.step2.copy': '同じ色でも厚みや照明で見え方が変わるため、店頭で実物をご確認いただきます。',
    'store.step3.title': '選択内容を確定する',
    'store.step3.copy': '樹脂カラーとシルバー・ゴールドの金属パーツをスタッフと一緒に最終確認します。',
    'store.step4.title': 'スタッフが組み立てる',
    'store.step4.copy': '選択が確定したパーツはスタッフが組み立て、完成状態をご確認いただきます。',
    'store.fact1.title': 'コンバーターは別売り',
    'store.fact1.copy': '基本セットには含まれていません。',
    'store.fact2.title': '最終的な色は実物を基準に',
    'store.fact2.copy': '3D画面は参考用です。最終選択は実物パーツを基準にしてください。',
    'store.fact3.title': '在庫はご来店時に確認',
    'store.fact3.copy': '色ごとの在庫数は店舗状況により異なる場合があります。',
    'result.title': '選択した組み合わせをご確認ください',
    'result.subtitle': '現在の選択内容はリンクと組み合わせコードに自動保存されます。',
    'result.code': '店頭確認用 組み合わせコード',
    'result.codeCopy': 'このコードをスタッフにお見せいただくと、選択したパーツと色をすぐ確認できます。',
    'result.copyLink': 'この組み合わせのリンクをコピー',
    'result.saveImage': '3D画像を保存',
    'result.reset': '新しい組み合わせを作る',
    'notice.display': '画面の色は実物と異なる場合があります。最終選択前に店頭で実物パーツをご確認ください。',
    'footer.copy': '本ページはBlueBlack Pen Shopの店頭接客用組み合わせプレビューツールです。画面の色は実物パーツと異なる場合があります。',
    'toast.linkCopied': '現在の組み合わせリンクをコピーしました。',
    'toast.linkFailed': 'リンクをコピーできませんでした。アドレスバーのURLを直接コピーしてください。',
    'toast.imageSaved': '現在の3D画面を画像として保存しました。',
    'toast.reset': '新しい組み合わせを作れるよう初期状態に戻しました。',
    'badge.new': 'NEW',
  },
};

let currentLanguage = 'ko';

function resolveLanguage() {
  const queryLanguage = new URLSearchParams(location.search).get('lang');
  if (LANGUAGES.includes(queryLanguage)) return queryLanguage;
  const savedLanguage = localStorage.getItem('blueblack-language');
  if (LANGUAGES.includes(savedLanguage)) return savedLanguage;
  const browserLanguage = navigator.language.toLowerCase();
  if (browserLanguage.startsWith('ja')) return 'ja';
  if (browserLanguage.startsWith('en')) return 'en';
  return 'ko';
}

export function t(key) {
  return copy[currentLanguage]?.[key] ?? copy.ko[key] ?? key;
}

export function getLanguage() {
  return currentLanguage;
}

export function setLanguage(language, { updateUrl = true } = {}) {
  if (!LANGUAGES.includes(language)) return;
  currentLanguage = language;
  localStorage.setItem('blueblack-language', language);
  document.documentElement.lang = language;
  if (updateUrl) {
    const query = new URLSearchParams(location.search);
    query.set('lang', language);
    history.replaceState(null, '', `${location.pathname}?${query.toString()}`);
  }
  applyStaticTranslations();
  updateLanguageButtons();
  window.dispatchEvent(new CustomEvent('languagechange', { detail: { language } }));
}

export function localizePart(part) {
  const suffix = currentLanguage === 'ko' ? 'Ko' : currentLanguage === 'ja' ? 'Ja' : 'En';
  return {
    name: part[`name${suffix}`] ?? part.nameKo,
    description: part[`description${suffix}`] ?? part.descriptionKo,
  };
}

export function localizeColor(color) {
  if (currentLanguage === 'ja') return color.nameJa ?? color.nameEn ?? color.nameKo;
  if (currentLanguage === 'en') return color.nameEn ?? color.nameKo;
  return color.nameKo;
}

export function applyStaticTranslations() {
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });
}

function updateLanguageButtons() {
  document.querySelectorAll('[data-language]').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.language === currentLanguage));
  });
}

export function initI18n() {
  currentLanguage = resolveLanguage();
  document.documentElement.lang = currentLanguage;
  document.querySelectorAll('[data-language]').forEach((button) => {
    button.addEventListener('click', () => setLanguage(button.dataset.language));
  });
  applyStaticTranslations();
  updateLanguageButtons();
}
