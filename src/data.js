export const parts = [
  {
    id: 'cap_body', canonicalId: 'cap_body', meshName: 'cap_body', legacyMeshName: 'cap_body',
    nameKo: '캡', nameEn: 'Cap', nameJa: 'キャップ',
    descriptionKo: '펜을 닫았을 때 닙을 보호하는 상단 파츠입니다. 면적이 넓어 배럴과 함께 완성된 펜의 첫인상을 결정합니다.',
    descriptionEn: 'The upper part that protects the nib when the pen is closed. Together with the barrel, it defines the overall look of the finished pen.',
    descriptionJa: 'ペンを閉じたときにペン先を保護する上部パーツです。胴軸とともに、完成した万年筆の印象を大きく左右します。',
    colorGroup: 'resin', description: 'Main cap body'
  },
  {
    id: 'cap_end', canonicalId: 'cap_top', meshName: 'cap_top', legacyMeshName: 'cap_end',
    nameKo: '캡탑', nameEn: 'Cap Top', nameJa: 'キャップトップ',
    descriptionKo: '캡 끝을 마감하는 작은 포인트 파츠입니다. 캡과 같은 색으로 자연스럽게 연결하거나 대비되는 색으로 포인트를 줄 수 있습니다.',
    descriptionEn: 'A small accent piece at the top of the cap. Match it with the cap for a seamless look, or choose a contrasting color for an accent.',
    descriptionJa: 'キャップ上端を仕上げる小さなアクセントパーツです。キャップと同色でまとめることも、対照色でポイントを加えることもできます。',
    colorGroup: 'resin', description: 'Cap top accent'
  },
  {
    id: 'nib_grip', canonicalId: 'grip_section', meshName: 'grip_section', legacyMeshName: 'nib_grip',
    nameKo: '그립 섹션', nameEn: 'Grip Section', nameJa: 'グリップセクション',
    descriptionKo: '글을 쓸 때 손가락이 닿는 그립 파츠입니다. 캡을 열었을 때 바로 보이는 부분이라 작은 색상 차이도 인상에 크게 영향을 줍니다.',
    descriptionEn: 'The grip section held while writing. Because it is immediately visible when the cap is removed, even a subtle color choice can change the pen’s character.',
    descriptionJa: '筆記時に指が触れるグリップパーツです。キャップを外すとすぐ見えるため、わずかな色の違いでも印象が大きく変わります。',
    colorGroup: 'resin', description: 'Writing grip section'
  },
  {
    id: 'metal_parts', canonicalId: 'center_ring_or_connector', meshName: 'center_ring_or_connector', legacyMeshName: 'metal_parts',
    nameKo: '중앙 연결 파츠', nameEn: 'Center Connector', nameJa: '中央接続パーツ',
    descriptionKo: '캡과 배럴 사이의 인상을 정리하는 연결 파츠입니다. 현재 상담 모델에서는 실버 또는 골드 계열로 비교할 수 있습니다.',
    descriptionEn: 'The connector that visually links the cap and barrel. The current consultation model compares silver and gold finishes.',
    descriptionJa: 'キャップと胴軸の印象をつなぐ中央パーツです。現在の接客モデルではシルバーとゴールドを比較できます。',
    colorGroup: 'metal', description: 'Center connector finish'
  },
  {
    id: 'barrel_body', canonicalId: 'barrel_body', meshName: 'barrel_body', legacyMeshName: 'barrel_body',
    nameKo: '배럴', nameEn: 'Barrel', nameJa: '胴軸',
    descriptionKo: '손으로 잡는 몸통의 중심이 되는 파츠입니다. 가장 넓은 면적을 차지해 완성된 펜의 주된 색상을 결정합니다.',
    descriptionEn: 'The main body of the pen. As the largest visible resin part, it determines the dominant color of the finished design.',
    descriptionJa: '万年筆の胴体となる中心パーツです。見える面積が最も広く、完成したペンのメインカラーを決めます。',
    colorGroup: 'resin', description: 'Main barrel body'
  },
  {
    id: 'barrel_end', canonicalId: 'barrel_end', meshName: 'barrel_end', legacyMeshName: 'barrel_end',
    nameKo: '배럴엔드', nameEn: 'Barrel End', nameJa: '胴軸エンド',
    descriptionKo: '배럴 끝을 마감하는 작은 포인트 파츠입니다. 캡탑과 같은 색으로 맞추면 통일감을, 다른 색으로 고르면 개성을 더할 수 있습니다.',
    descriptionEn: 'A small accent piece at the end of the barrel. Match it with the cap top for balance, or choose a different color for a distinctive finish.',
    descriptionJa: '胴軸後端を仕上げる小さなアクセントパーツです。キャップトップと色を合わせると統一感が生まれ、異なる色にすると個性が際立ちます。',
    colorGroup: 'resin', description: 'Barrel end accent'
  }
];

const resin=(value)=>({available:true,availableFrom:null,transparent:false,isNew:false,group:'resin',...value});
const metal=(value)=>({available:true,availableFrom:null,transparent:false,isNew:false,group:'metal',...value});

export const colors = [
  resin({id:'clear',code:'SE',nameKo:'세피아',nameEn:'Sepia',nameJa:'セピア',hex:'#4b4740',transparent:true,transmission:.46,roughness:.1,attenuationDistance:.75,thickness:1.35,market:'KR'}),
  resin({id:'white',code:'NI',nameKo:'나이트',nameEn:'Night',nameJa:'ナイト',hex:'#292b50',transparent:true,transmission:.38,roughness:.1,attenuationDistance:.55,thickness:1.4,market:'KR'}),
  resin({id:'black',code:'PC',nameKo:'피콕',nameEn:'Peacock',nameJa:'ピーコック',hex:'#167792',transparent:true,transmission:.56,roughness:.08,attenuationDistance:1,thickness:1.25,market:'KR'}),
  resin({id:'navy',code:'ME',nameKo:'멜론',nameEn:'Melon',nameJa:'メロン',hex:'#8dce78',transparent:true,transmission:.52,roughness:.1,attenuationDistance:1.8,thickness:1.2,market:'KR'}),
  resin({id:'blue',code:'CA',nameKo:'캐롯',nameEn:'Carrot',nameJa:'キャロット',hex:'#ed8435',transparent:true,transmission:.58,roughness:.08,attenuationDistance:1.2,thickness:1.2,market:'KR'}),
  resin({id:'sky',code:'SU',nameKo:'썬플라워',nameEn:'Sunflower',nameJa:'サンフラワー',hex:'#f0c329',transparent:true,transmission:.62,roughness:.08,attenuationDistance:1.4,thickness:1.18,market:'KR'}),
  resin({id:'green',code:'FL',nameKo:'플라밍고',nameEn:'Flamingo',nameJa:'フラミンゴ',hex:'#eca08f',transparent:true,transmission:.44,roughness:.13,attenuationDistance:1.3,thickness:1.2,market:'KR'}),
  resin({id:'yellow',code:'WI',nameKo:'위스테리아',nameEn:'Wisteria',nameJa:'ウィステリア',hex:'#b9afd3',transparent:true,transmission:.35,roughness:.18,attenuationDistance:1.6,thickness:1.25,market:'KR'}),
  resin({id:'pink',code:'LC',nameKo:'라벤더 캔디',nameEn:'Lavender Candy',nameJa:'ラベンダーキャンディ',hex:'#c9ddef',transparent:true,transmission:.28,roughness:.22,attenuationDistance:1.8,thickness:1.25,market:'KR'}),
  resin({id:'red',code:'MI',nameKo:'밀크',nameEn:'Milk',nameJa:'ミルク',hex:'#f1f0e7',transparent:true,transmission:.1,roughness:.26,attenuationDistance:1.2,thickness:1.3,market:'KR'}),
  resin({id:'skeleton-flower',code:'SF',nameKo:'스켈레톤 플라워',nameEn:'Skeleton Flower',nameJa:'スケルトンフラワー',hex:'#e1e1ec',transparent:true,transmission:.78,roughness:.12,attenuationDistance:3.5,thickness:1.1,isNew:true,availableFrom:'2026-06-15',market:'KR'}),
  resin({id:'rabbit',code:'RB',nameKo:'래빗',nameEn:'Rabbit',nameJa:'ラビット',hex:'#bcafaf',transparent:true,transmission:.28,roughness:.2,attenuationDistance:1.5,thickness:1.25,isNew:true,availableFrom:'2026-06-15',market:'KR'}),
  resin({id:'sakuramochi',code:'SM',nameKo:'사쿠라모찌',nameEn:'Sakuramochi',nameJa:'サクラモチ',hex:'#e5bdc8',transparent:true,transmission:.32,roughness:.18,attenuationDistance:1.6,thickness:1.2,isNew:true,availableFrom:'2026-06-15',market:'KR'}),
  resin({id:'strawberry',code:'ST',nameKo:'스트로베리',nameEn:'Strawberry',nameJa:'ストロベリー',hex:'#c05b6b',transparent:true,transmission:.48,roughness:.11,attenuationDistance:.9,thickness:1.25,isNew:true,availableFrom:'2026-06-15',market:'KR'}),
  resin({id:'apricot',code:'AP',nameKo:'애프리콧',nameEn:'Apricot',nameJa:'アプリコット',hex:'#de9160',transparent:true,transmission:.56,roughness:.09,attenuationDistance:1.2,thickness:1.2,isNew:true,availableFrom:'2026-06-15',market:'KR'}),
  resin({id:'ginkgo-nuts',code:'GI',nameKo:'징코 넛츠',nameEn:'Ginkgo Nuts',nameJa:'ギンコーナッツ',hex:'#d3b34c',transparent:true,transmission:.56,roughness:.09,attenuationDistance:1.2,thickness:1.2,isNew:true,availableFrom:'2026-06-15',market:'KR'}),
  resin({id:'jade',code:'JD',nameKo:'제이드',nameEn:'Jade',nameJa:'ジェイド',hex:'#4e987b',transparent:true,transmission:.52,roughness:.09,attenuationDistance:1,thickness:1.25,isNew:true,availableFrom:'2026-06-15',market:'KR'}),
  resin({id:'sapphire',code:'SP',nameKo:'사파이어',nameEn:'Sapphire',nameJa:'サファイア',hex:'#325ca6',transparent:true,transmission:.44,roughness:.08,attenuationDistance:.7,thickness:1.35,isNew:true,availableFrom:'2026-06-15',market:'KR'}),
  resin({id:'akebia',code:'AK',nameKo:'아케비아',nameEn:'Akebia',nameJa:'アケビア',hex:'#6f6581',transparent:true,transmission:.36,roughness:.14,attenuationDistance:.85,thickness:1.3,isNew:true,availableFrom:'2026-06-15',market:'KR'}),
  resin({id:'wolf',code:'WF',nameKo:'울프',nameEn:'Wolf',nameJa:'ウルフ',hex:'#68615e',transparent:true,transmission:.34,roughness:.12,attenuationDistance:.65,thickness:1.35,isNew:true,availableFrom:'2026-06-15',market:'KR'}),
  metal({id:'silver',code:'SV',nameKo:'실버',nameEn:'Silver',nameJa:'シルバー',hex:'#c8ccd1',metalness:.92,roughness:.18,market:'KR'}),
  metal({id:'gold',code:'GD',nameKo:'골드',nameEn:'Gold',nameJa:'ゴールド',hex:'#d2ae62',metalness:.9,roughness:.2,market:'KR'})
];

export const defaultSelection=Object.fromEntries(parts.map(part=>[part.id,part.colorGroup==='metal'?'silver':'clear']));
export const canonicalPartIds=Object.fromEntries(parts.map(part=>[part.id,part.canonicalId]));
export const meshNameMap=Object.fromEntries(parts.map(part=>[part.canonicalId,part.meshName]));
