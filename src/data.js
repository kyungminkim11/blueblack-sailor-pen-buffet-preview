import './ui-enhancements.js';
import './store-guide.js';

export const parts = [
  { id: 'cap_body', nameKo: '캡', nameEn: 'CAP', description: '클립과 캡 밴드가 장착되는 캡 본체입니다.', colorGroup: 'resin' },
  { id: 'cap_end', nameKo: '캡앤드', nameEn: 'CAP END', description: '캡 끝을 마감하는 독립 파츠입니다.', colorGroup: 'resin' },
  { id: 'nib_grip', nameKo: '닙그립', nameEn: 'NIB GRIP', description: '닙과 피드를 고정하며 배럴에 결합되는 그립 파츠입니다.', colorGroup: 'resin' },
  { id: 'metal_parts', nameKo: '메탈파츠', nameEn: 'METAL PARTS', description: '닙, 클립, 캡 밴드, 섹션 링 등 금속 파츠입니다.', colorGroup: 'metal' },
  { id: 'barrel_body', nameKo: '배럴', nameEn: 'BARREL', description: '잉크 카트리지 또는 컨버터를 감싸는 몸통 파츠입니다.', colorGroup: 'resin' },
  { id: 'barrel_end', nameKo: '배럴앤드', nameEn: 'BARREL END', description: '배럴 끝을 마감하는 독립 파츠입니다.', colorGroup: 'resin' },
];

export const colors = [
  { id: 'clear', code: 'SE', nameKo: '세피아', nameEn: 'Sepia', hex: '#4b4740', group: 'resin', transparent: true, opacity: 0.78, isNew: false, market: 'KR' },
  { id: 'white', code: 'NI', nameKo: '나이트', nameEn: 'Night', hex: '#292b50', group: 'resin', transparent: true, opacity: 0.82, isNew: false, market: 'KR' },
  { id: 'black', code: 'PC', nameKo: '피콕', nameEn: 'Peacock', hex: '#167792', group: 'resin', transparent: true, opacity: 0.8, isNew: false, market: 'KR' },
  { id: 'navy', code: 'ME', nameKo: '멜론', nameEn: 'Melon', hex: '#8dce78', group: 'resin', transparent: true, opacity: 0.7, isNew: false, market: 'KR' },
  { id: 'blue', code: 'CA', nameKo: '캐롯', nameEn: 'Carrot', hex: '#ed8435', group: 'resin', transparent: true, opacity: 0.75, isNew: false, market: 'KR' },
  { id: 'sky', code: 'SU', nameKo: '썬플라워', nameEn: 'Sunflower', hex: '#f0c329', group: 'resin', transparent: true, opacity: 0.72, isNew: false, market: 'KR' },
  { id: 'green', code: 'FL', nameKo: '플라밍고', nameEn: 'Flamingo', hex: '#eca08f', group: 'resin', transparent: true, opacity: 0.68, isNew: false, market: 'KR' },
  { id: 'yellow', code: 'WI', nameKo: '위스테리아', nameEn: 'Wisteria', hex: '#b9afd3', group: 'resin', transparent: true, opacity: 0.64, isNew: false, market: 'KR' },
  { id: 'pink', code: 'LC', nameKo: '라벤더 캔디', nameEn: 'Lavender Candy', hex: '#c9ddef', group: 'resin', transparent: true, opacity: 0.58, isNew: false, market: 'KR' },
  { id: 'red', code: 'MI', nameKo: '밀크', nameEn: 'Milk', hex: '#f1f0e7', group: 'resin', transparent: true, opacity: 0.7, isNew: false, market: 'KR' },
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
