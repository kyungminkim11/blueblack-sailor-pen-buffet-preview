export const parts = [
  { id: 'cap_top', nameKo: '캡탑', nameEn: 'CAP TOP', description: '캡의 가장 위쪽을 둥글게 마감하는 파츠입니다.' },
  { id: 'cap_body', nameKo: '캡', nameEn: 'CAP BODY', description: '프로피트 주니어 특유의 완만한 곡선을 만드는 캡 본체입니다.' },
  { id: 'grip_section', nameKo: '그립 섹션', nameEn: 'GRIP SECTION', description: '필기할 때 손가락이 닿는 테이퍼형 파츠입니다.' },
  { id: 'center_ring_or_connector', nameKo: '중앙 연결 파츠', nameEn: 'CENTER CONNECTOR', description: '그립 섹션과 배럴을 연결하며 조합의 경계를 만드는 파츠입니다.' },
  { id: 'barrel_body', nameKo: '배럴', nameEn: 'BARREL BODY', description: '만년필 몸통의 가장 넓은 면적을 차지하는 메인 파츠입니다.' },
  { id: 'barrel_end', nameKo: '배럴엔드', nameEn: 'BARREL END', description: '배럴 끝을 둥글게 마감하여 전체 실루엣을 완성합니다.' },
];

export const colors = [
  { id: 'clear', code: 'CL', nameKo: '클리어', nameEn: 'Clear', hex: '#dce8ee', transparent: true },
  { id: 'white', code: 'WH', nameKo: '화이트', nameEn: 'White', hex: '#f4f2eb' },
  { id: 'black', code: 'BK', nameKo: '블랙', nameEn: 'Black', hex: '#17191d' },
  { id: 'navy', code: 'NV', nameKo: '네이비', nameEn: 'Navy', hex: '#203452' },
  { id: 'blue', code: 'BL', nameKo: '블루', nameEn: 'Blue', hex: '#3b72a6' },
  { id: 'sky', code: 'SB', nameKo: '스카이 블루', nameEn: 'Sky Blue', hex: '#82b9cf' },
  { id: 'green', code: 'GN', nameKo: '그린', nameEn: 'Green', hex: '#47745c' },
  { id: 'yellow', code: 'YL', nameKo: '옐로', nameEn: 'Yellow', hex: '#d9b84d' },
  { id: 'pink', code: 'PK', nameKo: '핑크', nameEn: 'Pink', hex: '#d89aad' },
  { id: 'red', code: 'RD', nameKo: '레드', nameEn: 'Red', hex: '#a64649' },
];

export const defaultSelection = Object.fromEntries(parts.map((part) => [part.id, 'clear']));
