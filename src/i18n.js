const SUPPORTED_LANGUAGES = ['ko', 'en', 'ja'];

const messages = {
  ko: {
    'header.title': '세일러 펜뷔페 미리보기',
    'header.copy': '캡·캡앤드·닙그립·메탈파츠·배럴·배럴앤드 6개 파츠와 총 20가지 수지 색상을 조합해보세요.',
    'header.status': '한국 매장 상담용',
    'guide.kicker': '이용 방법',
    'guide.title': '세 단계면 완성됩니다',
    'guide.subtitle': '한국 판매 색상 선택 → 3D 확인 → 매장 실물 파츠 확인',
    'guide.step1.title': '파츠 선택',
    'guide.step1.copy': '6개 파츠와 20가지 색상을 선택',
    'guide.step2.title': '3D 미리보기',
    'guide.step2.copy': '분리 상태와 완성 상태 확인',
    'guide.step3.title': '매장 제작',
    'guide.step3.copy': '조합 코드로 직원과 상담',
    'viewer.openTitle': '파츠 분리 보기',
    'viewer.closedTitle': '완성 상태 보기',
    'viewer.autoOn': '자동 회전 켬',
    'viewer.autoOff': '자동 회전 끔',
    'viewer.showClosed': '완성 상태 보기',
    'viewer.showOpen': '파츠 분리 보기',
    'viewer.loading': '3D 모델을 구성하는 중입니다',
    'viewer.preparing': '준비 중',
    'viewer.errorTitle': '3D 모델을 표시하지 못했습니다.',
    'viewer.errorCopy': '브라우저의 WebGL 지원 여부를 확인해 주세요.',
    'viewer.hint': '드래그하여 회전 · 두 손가락 또는 휠로 확대',
    'customize.title': '파츠와 색상 선택',
    'customize.selected': '현재 선택',
    'palette.existing': '기존 색상',
    'palette.new': '신규 색상',
    'palette.ten': '10가지',
    'palette.newCaption': '2026.06.15 · 10가지',
    'palette.metal': '메탈 컬러',
    'palette.two': '2가지',
    'palette.note': '화면 색상은 조명과 디스플레이 환경에 따라 실제 반투명 파츠와 다르게 보일 수 있습니다.',
    'converter.label': '안내',
    'converter.copy': '잉크 컨버터는 펜뷔페 기본 구성에 포함되지 않으며 별도 구매 상품입니다. 3D 화면의 내부 컨버터는 구조 이해를 돕기 위한 참고 표현입니다.',
    'store.kicker': '매장 이용 안내',
    'store.title': '매장에서는 이렇게 진행돼요',
    'store.subtitle': '웹에서 조합한 뒤 매장에서 실물 색상과 완성 결과를 최종 확인해 주세요.',
    'store.step1.title': '실물 색상 확인',
    'store.step1.copy': '파츠 보드에서 실제 반투명 색상과 투명도를 확인합니다.',
    'store.step2.title': '6개 파츠 선택',
    'store.step2.copy': '캡, 캡앤드, 닙그립, 메탈파츠, 배럴, 배럴앤드를 고릅니다.',
    'store.step3.title': '메탈파츠 선택',
    'store.step3.copy': '실버 또는 골드 계열의 닙, 클립, 캡 밴드와 링을 선택합니다.',
    'store.step4.title': '직원 조립·점검',
    'store.step4.copy': '선택한 파츠를 직원이 조립하고 결합 상태와 닙 정렬을 확인합니다.',
    'store.fact1.title': '컨버터는 별도 구매',
    'store.fact1.copy': '펜뷔페 기본 구성에는 포함되지 않습니다.',
    'store.fact2.title': '화면은 사전 미리보기',
    'store.fact2.copy': '최종 선택은 매장 실물 파츠를 확인한 뒤 진행해 주세요.',
    'store.fact3.title': '색상·재고는 변동 가능',
    'store.fact3.copy': '운영 시기와 매장 상황에 따라 준비 수량이 달라질 수 있습니다.',
    'result.title': '현재 완성 조합',
    'result.subtitle': '선택 내용은 주소에 자동 저장됩니다.',
    'result.code': '조합 코드',
    'result.codeCopy': '매장 직원에게 이 코드를 보여주시면 선택한 조합을 빠르게 확인할 수 있습니다.',
    'result.copyLink': '조합 링크 복사',
    'result.saveImage': '이미지 저장',
    'result.reset': '처음부터 다시',
    'notice.display': '화면 색상은 디스플레이 환경에 따라 실제 색상과 다를 수 있습니다. 최종 선택 전 매장 실물 파츠를 함께 확인해 주세요.',
    'footer.copy': '블루블랙 펜샵의 실제 6개 파츠 구성과 한국 판매 색상표를 기준으로 한 매장 상담용 중립 3D 모델입니다.',
    'toast.linkCopied': '조합 링크를 복사했습니다.',
    'toast.linkFailed': '주소창의 링크를 직접 복사해 주세요.',
    'toast.imageSaved': '현재 3D 화면을 이미지로 저장했습니다.',
    'toast.reset': '기본 조합으로 초기화했습니다.',
    'badge.new': 'NEW',
  },
  en: {
    'header.title': 'Sailor Pen Buffet Preview',
    'header.copy': 'Combine six parts—cap, cap end, nib grip, metal parts, barrel and barrel end—with 20 resin colors.',
    'header.status': 'In-store consultation · Korea',
    'guide.kicker': 'HOW TO USE',
    'guide.title': 'Create yours in three steps',
    'guide.subtitle': 'Choose Korean colors → Check in 3D → Confirm the real parts in store',
    'guide.step1.title': 'Choose parts',
    'guide.step1.copy': 'Select six parts and 20 colors',
    'guide.step2.title': '3D preview',
    'guide.step2.copy': 'Check exploded and assembled views',
    'guide.step3.title': 'In-store assembly',
    'guide.step3.copy': 'Show the combination code to staff',
    'viewer.openTitle': 'Exploded parts view',
    'viewer.closedTitle': 'Assembled view',
    'viewer.autoOn': 'Auto-rotate on',
    'viewer.autoOff': 'Auto-rotate off',
    'viewer.showClosed': 'View assembled',
    'viewer.showOpen': 'View parts',
    'viewer.loading': 'Building the 3D model',
    'viewer.preparing': 'Preparing',
    'viewer.errorTitle': 'The 3D model could not be displayed.',
    'viewer.errorCopy': 'Please check whether your browser supports WebGL.',
    'viewer.hint': 'Drag to rotate · Pinch or scroll to zoom',
    'customize.title': 'Choose parts and colors',
    'customize.selected': 'Selected',
    'palette.existing': 'Original colors',
    'palette.new': 'New colors',
    'palette.ten': '10 colors',
    'palette.newCaption': '2026.06.15 · 10 colors',
    'palette.metal': 'Metal colors',
    'palette.two': '2 colors',
    'palette.note': 'Colors may look different from the translucent physical parts depending on lighting and your display.',
    'converter.label': 'Note',
    'converter.copy': 'The ink converter is sold separately and is not included in the Pen Buffet base set. The converter shown in 3D is only a structural reference.',
    'store.kicker': 'IN-STORE EXPERIENCE',
    'store.title': 'How it works in store',
    'store.subtitle': 'Create a combination online, then confirm the physical colors and finished result in store.',
    'store.step1.title': 'Check real colors',
    'store.step1.copy': 'Compare the translucency and color of the physical parts on the display board.',
    'store.step2.title': 'Choose six parts',
    'store.step2.copy': 'Choose the cap, cap end, nib grip, metal parts, barrel and barrel end.',
    'store.step3.title': 'Choose metal parts',
    'store.step3.copy': 'Select silver or gold-tone nib, clip, cap bands and rings.',
    'store.step4.title': 'Staff assembly and check',
    'store.step4.copy': 'Staff assemble the selected parts and check the fit and nib alignment.',
    'store.fact1.title': 'Converter sold separately',
    'store.fact1.copy': 'It is not included in the Pen Buffet base set.',
    'store.fact2.title': 'Preview only',
    'store.fact2.copy': 'Please confirm the physical parts in store before making the final choice.',
    'store.fact3.title': 'Colors and stock may vary',
    'store.fact3.copy': 'Availability may change depending on timing and store inventory.',
    'result.title': 'Current combination',
    'result.subtitle': 'Your selections are saved automatically in the URL.',
    'result.code': 'Combination code',
    'result.codeCopy': 'Show this code to store staff so they can quickly check your selected combination.',
    'result.copyLink': 'Copy combination link',
    'result.saveImage': 'Save image',
    'result.reset': 'Start over',
    'notice.display': 'Screen colors may differ from the actual parts. Please confirm the physical parts in store before your final selection.',
    'footer.copy': 'A neutral in-store 3D preview based on BlueBlack Pen Shop’s six-part structure and Korean color selection.',
    'toast.linkCopied': 'Combination link copied.',
    'toast.linkFailed': 'Please copy the URL directly from the address bar.',
    'toast.imageSaved': 'The current 3D view has been saved.',
    'toast.reset': 'Reset to the default combination.',
    'badge.new': 'NEW',
  },
  ja: {
    'header.title': 'セーラー万年筆ビュッフェ プレビュー',
    'header.copy': 'キャップ・キャップエンド・ペン先グリップ・金属パーツ・胴軸・胴軸エンドの6パーツと、樹脂20色を組み合わせて確認できます。',
    'header.status': '韓国店舗 接客用',
    'guide.kicker': 'ご利用方法',
    'guide.title': '3ステップで完成',
    'guide.subtitle': '韓国販売色を選択 → 3Dで確認 → 店頭の実物パーツを確認',
    'guide.step1.title': 'パーツを選ぶ',
    'guide.step1.copy': '6パーツと20色を選択',
    'guide.step2.title': '3Dプレビュー',
    'guide.step2.copy': '分解表示と完成表示を確認',
    'guide.step3.title': '店頭で組み立て',
    'guide.step3.copy': '組み合わせコードをスタッフに提示',
    'viewer.openTitle': 'パーツ分解表示',
    'viewer.closedTitle': '完成状態',
    'viewer.autoOn': '自動回転 オン',
    'viewer.autoOff': '自動回転 オフ',
    'viewer.showClosed': '完成状態を見る',
    'viewer.showOpen': 'パーツ表示に戻る',
    'viewer.loading': '3Dモデルを準備しています',
    'viewer.preparing': '準備中',
    'viewer.errorTitle': '3Dモデルを表示できませんでした。',
    'viewer.errorCopy': 'ブラウザがWebGLに対応しているかご確認ください。',
    'viewer.hint': 'ドラッグで回転 · ピンチまたはホイールで拡大',
    'customize.title': 'パーツとカラーを選択',
    'customize.selected': '現在の選択',
    'palette.existing': '既存カラー',
    'palette.new': '新色',
    'palette.ten': '10色',
    'palette.newCaption': '2026.06.15 · 10色',
    'palette.metal': '金属カラー',
    'palette.two': '2色',
    'palette.note': '照明やディスプレイ環境により、画面の色は実物の半透明パーツと異なって見える場合があります。',
    'converter.label': 'ご案内',
    'converter.copy': 'インクコンバーターは基本セットに含まれず、別売りです。3D表示内のコンバーターは構造説明用の参考表現です。',
    'store.kicker': '店頭での流れ',
    'store.title': '店頭ではこのように進みます',
    'store.subtitle': 'ウェブで組み合わせた後、店頭で実物の色と完成状態をご確認ください。',
    'store.step1.title': '実物カラーを確認',
    'store.step1.copy': 'パーツボードで実物の半透明色と透明感を確認します。',
    'store.step2.title': '6パーツを選択',
    'store.step2.copy': 'キャップ、キャップエンド、ペン先グリップ、金属パーツ、胴軸、胴軸エンドを選びます。',
    'store.step3.title': '金属パーツを選択',
    'store.step3.copy': 'シルバーまたはゴールド系のペン先、クリップ、リングを選びます。',
    'store.step4.title': 'スタッフが組み立て・確認',
    'store.step4.copy': 'スタッフがパーツを組み立て、結合状態とペン先の位置を確認します。',
    'store.fact1.title': 'コンバーターは別売り',
    'store.fact1.copy': '基本セットには含まれていません。',
    'store.fact2.title': '画面は事前プレビュー',
    'store.fact2.copy': '最終選択前に店頭で実物パーツをご確認ください。',
    'store.fact3.title': '色・在庫は変動します',
    'store.fact3.copy': '時期や店舗在庫により用意できる数量が異なる場合があります。',
    'result.title': '現在の組み合わせ',
    'result.subtitle': '選択内容はURLに自動保存されます。',
    'result.code': '組み合わせコード',
    'result.codeCopy': 'このコードをスタッフに見せると、選択した組み合わせをすぐ確認できます。',
    'result.copyLink': '組み合わせリンクをコピー',
    'result.saveImage': '画像を保存',
    'result.reset': '最初からやり直す',
    'notice.display': '画面の色は実物と異なる場合があります。最終選択前に店頭で実物パーツをご確認ください。',
    'footer.copy': 'BlueBlack Pen Shopの6パーツ構成と韓国販売カラーを基準にした店頭接客用3Dプレビューです。',
    'toast.linkCopied': '組み合わせリンクをコピーしました。',
    'toast.linkFailed': 'アドレスバーのURLを直接コピーしてください。',
    'toast.imageSaved': '現在の3D画面を保存しました。',
    'toast.reset': '初期の組み合わせに戻しました。',
    'badge.new': 'NEW',
  },
};

let currentLanguage = 'ko';

function resolveLanguage() {
  const queryLanguage = new URLSearchParams(location.search).get('lang');
  if (SUPPORTED_LANGUAGES.includes(queryLanguage)) return queryLanguage;

  const savedLanguage = localStorage.getItem('blueblack-language');
  if (SUPPORTED_LANGUAGES.includes(savedLanguage)) return savedLanguage;

  const browserLanguage = navigator.language.toLowerCase();
  if (browserLanguage.startsWith('ja')) return 'ja';
  if (browserLanguage.startsWith('en')) return 'en';
  return 'ko';
}

export function t(key) {
  return messages[currentLanguage]?.[key] ?? messages.ko[key] ?? key;
}

export function getLanguage() {
  return currentLanguage;
}

export function setLanguage(language, { updateUrl = true } = {}) {
  if (!SUPPORTED_LANGUAGES.includes(language)) return;
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
    description: part[`description${suffix}`] ?? part.descriptionKo ?? part.description,
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
  document.querySelectorAll('[data-i18n-aria]').forEach((element) => {
    element.setAttribute('aria-label', t(element.dataset.i18nAria));
  });
}

function updateLanguageButtons() {
  document.querySelectorAll('[data-language]').forEach((button) => {
    const selected = button.dataset.language === currentLanguage;
    button.setAttribute('aria-pressed', String(selected));
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
