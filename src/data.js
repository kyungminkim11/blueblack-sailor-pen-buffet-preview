import './ui-enhancements.js';

export const parts = [
  { id: 'cap_body', nameKo: '캡', nameEn: 'CAP', description: '클립과 캡 밴드가 장착되는 캡 본체입니다.', colorGroup: 'resin' },
  { id: 'cap_end', nameKo: '캡앤드', nameEn: 'CAP END', description: '캡 끝을 마감하는 독립 파츠입니다.', colorGroup: 'resin' },
  { id: 'nib_grip', nameKo: '닙그립', nameEn: 'NIB GRIP', description: '닙과 피드를 고정하며 배럴에 결합되는 그립 파츠입니다.', colorGroup: 'resin' },
  { id: 'metal_parts', nameKo: '메탈파츠', nameEn: 'METAL PARTS', description: '닙, 클립, 캡 밴드, 섹션 링 등 금속 파츠입니다.', colorGroup: 'metal' },
  { id: 'barrel_body', nameKo: '배럴', nameEn: 'BARREL', description: '잉크 카트리지 또는 컨버터를 감싸는 몸통 파츠입니다.', colorGroup: 'resin' },
  { id: 'barrel_end', nameKo: '배럴앤드', nameEn: 'BARREL END', description: '배럴 끝을 마감하는 독립 파츠입니다.', colorGroup: 'resin' },
];

export const colors = [
  { id: 'clear', code: 'CL', nameKo: '클리어', nameEn: 'Clear', hex: '#dce8ee', group: 'resin', transparent: true, opacity: 0.38, isNew: false, market: 'KR' },
  { id: 'white', code: 'WH', nameKo: '화이트', nameEn: 'White', hex: '#f4f2eb', group: 'resin', transparent: true, opacity: 0.68, isNew: false, market: 'KR' },
  { id: 'black', code: 'BK', nameKo: '블랙', nameEn: 'Black', hex: '#17191d', group: 'resin', transparent: true, opacity: 0.84, isNew: false, market: 'KR' },
  { id: 'navy', code: 'NV', nameKo: '네이비', nameEn: 'Navy', hex: '#203452', group: 'resin', transparent: true, opacity: 0.8, isNew: false, market: 'KR' },
  { id: 'blue', code: 'BL', nameKo: '블루', nameEn: 'Blue', hex: '#3b72a6', group: 'resin', transparent: true, opacity: 0.76, isNew: false, market: 'KR' },
  { id: 'sky', code: 'SB', nameKo: '스카이 블루', nameEn: 'Sky Blue', hex: '#82b9cf', group: 'resin', transparent: true, opacity: 0.66, isNew: false, market: 'KR' },
  { id: 'green', code: 'GN', nameKo: '그린', nameEn: 'Green', hex: '#47745c', group: 'resin', transparent: true, opacity: 0.76, isNew: false, market: 'KR' },
  { id: 'yellow', code: 'YL', nameKo: '옐로', nameEn: 'Yellow', hex: '#d9b84d', group: 'resin', transparent: true, opacity: 0.7, isNew: false, market: 'KR' },
  { id: 'pink', code: 'PK', nameKo: '핑크', nameEn: 'Pink', hex: '#d89aad', group: 'resin', transparent: true, opacity: 0.66, isNew: false, market: 'KR' },
  { id: 'red', code: 'RD', nameKo: '레드', nameEn: 'Red', hex: '#a64649', group: 'resin', transparent: true, opacity: 0.78, isNew: false, market: 'KR' },
  { id: 'skeleton-flower', code: 'SF', nameKo: '스켈레톤 플라워', nameEn: 'Skeleton Flower', hex: '#e1e1ec', group: 'resin', transparent: true, opacity: 0.44, isNew: true, availableFrom: '2026-06-15', market: 'KR' },
  { id: 'rabbit', code: 'RB', nameKo: '래빗', nameEn: 'Rabbit', hex: '#bcafaf', group: 'resin', transparent: true, opacity: 0.62, isNew: true, availableFrom: '2026-06-15', market: 'KR' },
  { id: 'sakuramochi', code: 'SM', nameKo: '사쿠라모찌', nameEn: 'Sakuramochi', hex: '#e5bdc8', group: 'resin', transparent: true, opacity: 0.58, isNew: true, availableFrom: '2026-06-15', market: 'KR' },
  { id: 'strawberry', code: 'ST', nameKo: '스트로베리', nameEn: 'Strawberry', hex: '#c05b6b', group: 'resin', transparent: true, opacity: 0.78, isNew: true, availableFrom: '2026-06-15', market: 'KR' },
  { id: 'apricot', code: 'AP', nameKo: '애프리콧', nameEn: 'Apricot', hex: '#de9160', group: 'resin', transparent: true, opacity: 0.74, isNew: true, availableFrom: '2026-06-15', market: 'KR' },
  { id: 'ginkgo-nuts', code: 'GI', nameKo: '징코 넛츠', nameEn: 'Ginkgo Nuts', hex: '#d3b34c', group: 'resin', transparent: true, opacity: 0.74, isNew: true, availableFrom: '2026-06-15', market: 'KR' },
  { id: 'jade', code: 'JD', nameKo: '제이드', nameEn: 'Jade', hex: '#4e987b', group: 'resin', transparent: true, opacity: 0.76, isNew: true, availableFrom: '2026-06-15', market: 'KR' },
  { id: 'sapphire', code: 'SP', nameKo: '사파이어', nameEn: 'Sapphire', hex: '#325ca6', group: 'resin', transparent: true, opacity: 0.82, isNew: true, availableFrom: '2026-06-15', market: 'KR' },
  { id: 'akebia', code: 'AK', nameKo: '아케비아', nameEn: 'Akebia', hex: '#6f6581', group: 'resin', transparent: true, opacity: 0.76, isNew: true, availableFrom: '2026-06-15', market: 'KR' },
  { id: 'wolf', code: 'WF', nameKo: '울프', nameEn: 'Wolf', hex: '#68615e', group: 'resin', transparent: true, opacity: 0.8, isNew: true, availableFrom: '2026-06-15', market: 'KR' },
  { id: 'silver', code: 'SV', nameKo: '실버', nameEn: 'Silver', hex: '#c8ccd1', group: 'metal', metalness: 0.92, roughness: 0.18, isNew: false, market: 'KR' },
  { id: 'gold', code: 'GD', nameKo: '골드', nameEn: 'Gold', hex: '#d2ae62', group: 'metal', metalness: 0.9, roughness: 0.2, isNew: false, market: 'KR' },
];

export const defaultSelection = Object.fromEntries(parts.map((part) => [part.id, part.colorGroup === 'metal' ? 'silver' : 'clear']));
