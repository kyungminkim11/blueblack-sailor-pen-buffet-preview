export const parts = [
  { id: 'cap_top', nameKo: '캡탑', nameEn: 'CAP TOP', description: '캡 상단에 끼워지는 작은 돔형 마감 파츠입니다.' },
  { id: 'cap_body', nameKo: '캡', nameEn: 'CAP', description: '클립과 금속 밴드가 장착되는 긴 캡 본체입니다.' },
  { id: 'grip_section', nameKo: '그립 섹션', nameEn: 'SECTION', description: '닙과 피드를 고정하며 배럴에 나사로 결합되는 파츠입니다.' },
  { id: 'barrel_body', nameKo: '배럴', nameEn: 'BARREL', description: '잉크 카트리지 또는 컨버터를 감싸는 긴 몸통 파츠입니다.' },
  { id: 'barrel_end', nameKo: '배럴엔드', nameEn: 'TAIL PLUG', description: '배럴 뒤쪽 구멍에 끼워지는 작은 꼬리 마감 파츠입니다.' },
];

// 한국 블루블랙 펜샵용 색상 데이터입니다.
// 실제 매장 운영 색상은 이 배열만 교체하면 모델 구조 변경 없이 반영됩니다.
export const colors = [
  { id: 'clear', code: 'CL', nameKo: '클리어', nameEn: 'Clear', hex: '#dce8ee', transparent: true, market: 'KR' },
  { id: 'white', code: 'WH', nameKo: '화이트', nameEn: 'White', hex: '#f4f2eb', market: 'KR' },
  { id: 'black', code: 'BK', nameKo: '블랙', nameEn: 'Black', hex: '#17191d', market: 'KR' },
  { id: 'navy', code: 'NV', nameKo: '네이비', nameEn: 'Navy', hex: '#203452', market: 'KR' },
  { id: 'blue', code: 'BL', nameKo: '블루', nameEn: 'Blue', hex: '#3b72a6', market: 'KR' },
  { id: 'sky', code: 'SB', nameKo: '스카이 블루', nameEn: 'Sky Blue', hex: '#82b9cf', market: 'KR' },
  { id: 'green', code: 'GN', nameKo: '그린', nameEn: 'Green', hex: '#47745c', market: 'KR' },
  { id: 'yellow', code: 'YL', nameKo: '옐로', nameEn: 'Yellow', hex: '#d9b84d', market: 'KR' },
  { id: 'pink', code: 'PK', nameKo: '핑크', nameEn: 'Pink', hex: '#d89aad', market: 'KR' },
  { id: 'red', code: 'RD', nameKo: '레드', nameEn: 'Red', hex: '#a64649', market: 'KR' },
];

export const defaultSelection = Object.fromEntries(parts.map((part) => [part.id, 'clear']));
