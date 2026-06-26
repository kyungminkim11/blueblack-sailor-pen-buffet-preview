const LANGUAGES = ['ko', 'en', 'ja'];

const messages = {
  ko: {
    title: '세일러 펜뷔페 미리보기',
    intro: '여섯 개 파츠의 색상을 직접 조합하고 완성 모습을 3D로 확인해보세요. 최종 선택은 매장에서 실물 파츠와 함께 확인해 드립니다.',
    storePreview: '매장 상담용 미리보기',
    howTo: '이용 방법',
    howToCopy: '파츠와 색상을 고른 뒤 3D로 확인하고, 마음에 드는 조합은 링크나 이미지로 저장해 주세요.',
    step1: '파츠 선택',
    step1Copy: '캡부터 배럴앤드까지 6개 파츠를 차례로 선택합니다.',
    step2: '색상 선택',
    step2Copy: '각 파츠에 원하는 수지 컬러 또는 메탈 컬러를 적용합니다.',
    step3: '실물 확인',
    step3Copy: '매장에서 실제 색상과 투명도를 확인한 뒤 조립을 진행합니다.',
    preview: '3D 미리보기',
    assembled: '완성 모습',
    exploded: '파츠 분리',
    largeView: '크게 보기',
    close: '닫기',
    resetView: '시점 초기화',
    zoomIn: '확대',
    zoomOut: '축소',
    viewerHint: '한 손가락으로 회전 · 두 손가락으로 확대·축소',
    loading: '3D 미리보기를 준비하고 있습니다.',
    error: '3D 미리보기를 불러오지 못했습니다. 페이지를 새로고침해 주세요.',
    customize: '파츠별 색상을 골라주세요',
    partProgress: '{current} / {total}',
    selectedColor: '선택한 색상',
    originalColors: '기존 컬러',
    newColors: '신규 컬러',
    metalColors: '메탈 컬러',
    nextPart: '다음 파츠',
    previousPart: '이전 파츠',
    finishSelection: '선택 결과 확인',
    colorNotice: '화면 색상은 조명과 디스플레이 환경에 따라 실제 파츠와 다르게 보일 수 있습니다. 최종 선택 전 매장 실물을 확인해 주세요.',
    converterTitle: '컨버터 안내',
    converterCopy: '잉크 컨버터는 펜뷔페 기본 구성에 포함되지 않는 별도 구매 상품입니다.',
    resultTitle: '선택한 조합',
    resultCopy: '아래 목록을 매장 실물 파츠와 비교해 주세요.',
    share: '조합 공유하기',
    saveImage: '3D 이미지 저장',
    staffView: '직원과 함께 확인',
    reset: '새 조합 만들기',
    shared: '조합 링크를 공유했습니다.',
    copied: '조합 링크를 복사했습니다.',
    imageSaved: '3D 이미지를 저장했습니다.',
    resetDone: '기본 조합으로 초기화했습니다.',
    staffTitle: '선택 파츠 확인',
    staffCopy: '고객님이 선택한 색상입니다. 실물 파츠와 하나씩 비교해 주세요.',
    visitTitle: '블루블랙 펜샵 방문 안내',
    visitCopy: '특정 색상을 찾으신다면 방문 전 재고 문의를 권장드립니다.',
    address: '매장 주소',
    hours: '영업시간',
    phone: '전화 문의',
    weekday: '월–금 10:00–18:00',
    saturday: '토요일 12:00–18:00',
    closed: '일요일·공휴일 휴무',
    map: '네이버지도',
    call: '전화하기',
    website: '공식 홈페이지',
    instagram: '인스타그램',
    visitNote: '영업시간·휴무일·재고는 변경될 수 있습니다. 방문 전 공식 채널에서 최신 안내를 확인해 주세요.',
    footer: '본 페이지는 블루블랙 펜샵 매장 상담을 위한 조합 미리보기 도구입니다.',
  },
  en: {
    title: 'Sailor Pen Buffet Preview',
    intro: 'Choose colors for six individual parts and review the finished pen in 3D. Please confirm the physical parts in store before making your final selection.',
    storePreview: 'In-store consultation preview',
    howTo: 'How to use',
    howToCopy: 'Choose the parts and colors, review the pen in 3D, then save your preferred combination as a link or image.',
    step1: 'Choose a part', step1Copy: 'Select the six parts in order, from the cap to the barrel end.',
    step2: 'Choose a color', step2Copy: 'Apply a resin or metal color to each selected part.',
    step3: 'Confirm in store', step3Copy: 'Compare the physical color and translucency before assembly.',
    preview: '3D preview', assembled: 'Finished pen', exploded: 'Separate parts', largeView: 'Large view', close: 'Close', resetView: 'Reset view', zoomIn: 'Zoom in', zoomOut: 'Zoom out',
    viewerHint: 'Drag to rotate · Pinch with two fingers to zoom', loading: 'Preparing the 3D preview.', error: 'The 3D preview could not be loaded. Please refresh the page.',
    customize: 'Choose a color for each part', partProgress: '{current} / {total}', selectedColor: 'Selected color', originalColors: 'Original colors', newColors: 'New colors', metalColors: 'Metal colors',
    nextPart: 'Next part', previousPart: 'Previous part', finishSelection: 'Review selection',
    colorNotice: 'Colors may appear different depending on lighting and your display. Please confirm the physical parts in store before making your final choice.',
    converterTitle: 'Converter information', converterCopy: 'The ink converter is sold separately and is not included in the Pen Buffet base set.',
    resultTitle: 'Your selected combination', resultCopy: 'Compare this list with the physical parts in store.', share: 'Share combination', saveImage: 'Save 3D image', staffView: 'Review with staff', reset: 'Create a new combination',
    shared: 'Combination shared.', copied: 'Combination link copied.', imageSaved: '3D image saved.', resetDone: 'Reset to the default combination.',
    staffTitle: 'Selected parts', staffCopy: 'These are the selected colors. Please compare each item with the physical parts.',
    visitTitle: 'Visit BlueBlack Pen Shop', visitCopy: 'We recommend checking stock before visiting if you are looking for a specific color.', address: 'Store address', hours: 'Opening hours', phone: 'Phone',
    weekday: 'Mon–Fri 10:00–18:00', saturday: 'Saturday 12:00–18:00', closed: 'Closed Sundays and public holidays', map: 'Naver Map', call: 'Call', website: 'Official website', instagram: 'Instagram',
    visitNote: 'Opening hours, closing days and stock may change. Please check the official channels before visiting.', footer: 'This page is a combination preview tool for in-store consultation at BlueBlack Pen Shop.',
  },
  ja: {
    title: 'セーラー万年筆ビュッフェ プレビュー',
    intro: '6つのパーツにお好みの色を組み合わせ、完成イメージを3Dでご確認いただけます。最終選択前に店頭で実物パーツをご確認ください。',
    storePreview: '店頭接客用プレビュー', howTo: 'ご利用方法', howToCopy: 'パーツと色を選び、3Dで確認した後、お好みの組み合わせをリンクまたは画像で保存してください。',
    step1: 'パーツを選ぶ', step1Copy: 'キャップから胴軸エンドまで6つのパーツを順番に選びます。',
    step2: '色を選ぶ', step2Copy: '各パーツに樹脂カラーまたは金属カラーを適用します。',
    step3: '店頭で確認', step3Copy: '実物の色と透明感を確認してから組み立てを行います。',
    preview: '3Dプレビュー', assembled: '完成イメージ', exploded: 'パーツ分解', largeView: '大きく見る', close: '閉じる', resetView: '視点をリセット', zoomIn: '拡大', zoomOut: '縮小',
    viewerHint: '指で回転 · 2本指で拡大・縮小', loading: '3Dプレビューを準備しています。', error: '3Dプレビューを読み込めませんでした。ページを再読み込みしてください。',
    customize: 'パーツごとに色をお選びください', partProgress: '{current} / {total}', selectedColor: '選択中の色', originalColors: '既存カラー', newColors: '新色', metalColors: '金属カラー',
    nextPart: '次のパーツ', previousPart: '前のパーツ', finishSelection: '選択結果を確認',
    colorNotice: '照明やディスプレイ環境により、画面の色は実物と異なる場合があります。最終選択前に店頭で実物をご確認ください。',
    converterTitle: 'コンバーターについて', converterCopy: 'インクコンバーターは基本セットに含まれない別売り商品です。',
    resultTitle: '選択した組み合わせ', resultCopy: '店頭の実物パーツと下記の内容を比較してください。', share: '組み合わせを共有', saveImage: '3D画像を保存', staffView: 'スタッフと確認', reset: '新しい組み合わせを作る',
    shared: '組み合わせを共有しました。', copied: '組み合わせリンクをコピーしました。', imageSaved: '3D画像を保存しました。', resetDone: '初期の組み合わせに戻しました。',
    staffTitle: '選択パーツの確認', staffCopy: 'お客様が選択した色です。実物パーツと一つずつ比較してください。',
    visitTitle: 'BlueBlack Pen Shop 店舗案内', visitCopy: '特定の色をご希望の場合は、ご来店前の在庫確認をおすすめします。', address: '店舗住所', hours: '営業時間', phone: '電話',
    weekday: '月〜金 10:00–18:00', saturday: '土曜日 12:00–18:00', closed: '日曜・祝日休業', map: 'NAVERマップ', call: '電話する', website: '公式サイト', instagram: 'Instagram',
    visitNote: '営業時間・休業日・在庫は変更される場合があります。ご来店前に公式情報をご確認ください。', footer: '本ページはBlueBlack Pen Shopの店頭接客用組み合わせプレビューツールです。',
  },
};

let currentLanguage = 'ko';

export function initializeLanguage() {
  const query = new URLSearchParams(location.search).get('lang');
  const saved = localStorage.getItem('blueblack-language');
  const browser = navigator.language.toLowerCase();
  currentLanguage = LANGUAGES.includes(query) ? query : LANGUAGES.includes(saved) ? saved : browser.startsWith('ja') ? 'ja' : browser.startsWith('en') ? 'en' : 'ko';
  document.documentElement.lang = currentLanguage;
  return currentLanguage;
}

export function getLanguage() { return currentLanguage; }

export function setLanguage(language) {
  if (!LANGUAGES.includes(language)) return;
  currentLanguage = language;
  document.documentElement.lang = language;
  localStorage.setItem('blueblack-language', language);
  const query = new URLSearchParams(location.search);
  query.set('lang', language);
  history.replaceState(null, '', `${location.pathname}?${query}`);
}

export function t(key, variables = {}) {
  let value = messages[currentLanguage]?.[key] ?? messages.ko[key] ?? key;
  for (const [name, replacement] of Object.entries(variables)) value = value.replace(`{${name}}`, replacement);
  return value;
}

export function localizePart(part) {
  const suffix = currentLanguage === 'ja' ? 'Ja' : currentLanguage === 'en' ? 'En' : 'Ko';
  return { name: part[`name${suffix}`] ?? part.nameKo, description: part[`description${suffix}`] ?? part.descriptionKo };
}

export function localizeColor(color) {
  if (currentLanguage === 'ja') return color.nameJa ?? color.nameEn;
  if (currentLanguage === 'en') return color.nameEn;
  return color.nameKo;
}
