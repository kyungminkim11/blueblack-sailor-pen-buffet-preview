export const parts = [
  { id: 'cap_body', nameKo: '캡', nameEn: 'CAP', description: '클립과 캡 밴드가 장착되는 캡 본체입니다.', colorGroup: 'resin' },
  { id: 'cap_end', nameKo: '캡앤드', nameEn: 'CAP END', description: '캡 끝을 마감하는 독립 파츠입니다.', colorGroup: 'resin' },
  { id: 'nib_grip', nameKo: '닙그립', nameEn: 'NIB GRIP', description: '닙과 피드를 고정하며 배럴에 결합되는 그립 파츠입니다.', colorGroup: 'resin' },
  { id: 'metal_parts', nameKo: '메탈파츠', nameEn: 'METAL PARTS', description: '닙, 클립, 캡 밴드, 섹션 링 등 금속 파츠입니다.', colorGroup: 'metal' },
  { id: 'barrel_body', nameKo: '배럴', nameEn: 'BARREL', description: '잉크 카트리지 또는 컨버터를 감싸는 몸통 파츠입니다.', colorGroup: 'resin' },
  { id: 'barrel_end', nameKo: '배럴앤드', nameEn: 'BARREL END', description: '배럴 끝을 마감하는 독립 파츠입니다.', colorGroup: 'resin' },
];

// 한국 블루블랙 펜샵용 색상 데이터입니다.
// 실제 운영 색상은 이 배열만 교체하면 모델 구조 변경 없이 반영됩니다.
export const colors = [
  { id: 'clear', code: 'CL', nameKo: '클리어', nameEn: 'Clear', hex: '#dce8ee', transparent: true, group: 'resin', market: 'KR' },
  { id: 'white', code: 'WH', nameKo: '화이트', nameEn: 'White', hex: '#f4f2eb', group: 'resin', market: 'KR' },
  { id: 'black', code: 'BK', nameKo: '블랙', nameEn: 'Black', hex: '#17191d', group: 'resin', market: 'KR' },
  { id: 'navy', code: 'NV', nameKo: '네이비', nameEn: 'Navy', hex: '#203452', group: 'resin', market: 'KR' },
  { id: 'blue', code: 'BL', nameKo: '블루', nameEn: 'Blue', hex: '#3b72a6', group: 'resin', market: 'KR' },
  { id: 'sky', code: 'SB', nameKo: '스카이 블루', nameEn: 'Sky Blue', hex: '#82b9cf', group: 'resin', market: 'KR' },
  { id: 'green', code: 'GN', nameKo: '그린', nameEn: 'Green', hex: '#47745c', group: 'resin', market: 'KR' },
  { id: 'yellow', code: 'YL', nameKo: '옐로', nameEn: 'Yellow', hex: '#d9b84d', group: 'resin', market: 'KR' },
  { id: 'pink', code: 'PK', nameKo: '핑크', nameEn: 'Pink', hex: '#d89aad', group: 'resin', market: 'KR' },
  { id: 'red', code: 'RD', nameKo: '레드', nameEn: 'Red', hex: '#a64649', group: 'resin', market: 'KR' },
  { id: 'silver', code: 'SV', nameKo: '실버', nameEn: 'Silver', hex: '#c8ccd1', group: 'metal', metalness: 0.92, roughness: 0.18, market: 'KR' },
  { id: 'gold', code: 'GD', nameKo: '골드', nameEn: 'Gold', hex: '#d2ae62', group: 'metal', metalness: 0.9, roughness: 0.2, market: 'KR' },
];

export const defaultSelection = Object.fromEntries(
  parts.map((part) => [part.id, part.colorGroup === 'metal' ? 'silver' : 'clear']),
);
