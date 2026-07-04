export const STORE_MAP_KEY='blueblack-store-map-v2';

const DISPLAY_INK_NOTICE='전시용 잉크병입니다. 공병에 잉크가 들어 있지만 실제 잉크 색상과 유사할 뿐 동일하지 않을 수 있습니다.';

export const DEFAULT_STORE_MAP={
  title:'블루블랙 펜샵 1층 브랜드 안내도',
  subtitle:'1층 주요 브랜드와 진열 구역 위치를 확인하세요.',
  note:'브랜드 및 진열 상품은 매장 운영 상황에 따라 변경될 수 있습니다.',
  zones:[
    {
      id:'ink-top',label:'상단 잉크 진열벽',subLabel:'INK DISPLAY',
      searchTerms:'전시용 잉크병 공병 잉크 display ink bottle',
      description:DISPLAY_INK_NOTICE,
      items:['전시용 잉크병'],
      x:14,y:4,w:72,h:10,type:'brand',visible:true
    },
    {
      id:'ink-left',label:'좌측 잉크 진열벽',subLabel:'INK DISPLAY',
      searchTerms:'전시용 잉크병 공병 잉크 display ink bottle',
      description:DISPLAY_INK_NOTICE,
      items:['전시용 잉크병'],
      x:3,y:17,w:11,h:62,type:'brand',visible:true
    },
    {
      id:'rear-right',label:'후면 진열장',subLabel:'REAR DISPLAY',
      searchTerms:'블랙윙 Blackwing 메시지 카드 키레나 형광펜 톤랜드 펜코 Penco 하이타이드 Hightide',
      description:'문구와 소품 브랜드를 함께 확인할 수 있는 후면 진열 구역입니다.',
      items:['블랙윙','메시지 카드','키레나 형광펜','톤랜드','펜코','하이타이드'],
      x:88,y:17,w:9,h:62,type:'brand',visible:true
    },
    {
      id:'black-island',label:'블랙 디스플레이 아일랜드',subLabel:'DISPLAY ISLAND',
      searchTerms:'글라스펜 시필 세일러 블루블랙 콜라보 잉크 음료 시리즈 제이허빈 J Herbin 10ml 쥬스업 Juice Up 볼펜 잉크 발색 카드',
      description:'시필과 잉크 관련 소품을 중심으로 구성된 디스플레이 아일랜드입니다.',
      items:['글라스펜 시필','세일러 × 블루블랙 펜샵 콜라보 잉크(음료 시리즈)','제이허빈 10ml','쥬스업 볼펜','잉크 발색 카드'],
      x:22,y:25,w:23,h:17,type:'brand',visible:true
    },
    {
      id:'pen-buffet',label:'펜뷔페 아일랜드',subLabel:'PEN BUFFET',
      searchTerms:'세일러 Sailor 펜뷔페 컨버터 converter 카트리지 cartridge 시키오리 Shikiori 일반 극흑 Kiwaguro 만요 Manyo 시필',
      description:'세일러 펜뷔페 구성품과 잉크, 시필펜을 확인하는 구역입니다.',
      items:['세일러 펜뷔페','세일러 컨버터','세일러 카트리지(시키오리·일반·극흑)','세일러 만요','세일러 펜뷔페 펜 시필'],
      x:22,y:50,w:23,h:25,type:'table',visible:true
    },
    {
      id:'glass-a',label:'세일러',subLabel:'Sailor',
      searchTerms:'세일러 Sailor 투주 Tuzu 만년필 수성펜 시필펜 캐주얼 만년필 1층 2층',
      description:'세일러 제품은 1층과 2층에 나뉘어 진열되어 있습니다.',
      items:['세일러 일부 제품','세일러 투주 만년필','수성펜 시필펜','세일러 캐주얼 만년필 시필'],
      x:54,y:25,w:27,h:13,type:'brand',visible:true
    },
    {
      id:'glass-b',label:'카웨코',subLabel:'Kaweco',
      searchTerms:'카웨코 Kaweco 전제품 스포츠 클래식 Sport Classic 시필펜',
      description:'카웨코 제품과 대표 시필펜을 확인할 수 있는 진열대입니다.',
      items:['카웨코 전제품','카웨코 스포츠 클래식 시필펜'],
      x:54,y:46,w:27,h:13,type:'brand',visible:true
    },
    {
      id:'glass-c',label:'마존',subLabel:'Majohn',
      searchTerms:'마존 Majohn Moonman 전제품 잉크월 Ink Wall 잉크 비스콘티 Visconti 만년필 시필',
      description:'마존 제품과 잉크월 잉크, 비스콘티 만년필을 함께 확인할 수 있습니다.',
      items:['마존 전제품','잉크월 잉크','비스콘티 만년필','마존 만년필 시필'],
      x:54,y:67,w:27,h:13,type:'brand',visible:true
    },
    {id:'counter',label:'계산대',subLabel:'COUNTER',searchTerms:'계산대 카운터 counter checkout',items:[],x:10,y:82,w:15,h:10,type:'service',visible:true},
    {id:'stools',label:'스툴',subLabel:'SEATING',searchTerms:'스툴 좌석 seating stool',items:[],x:37,y:82,w:43,h:9,type:'paper',visible:true},
    {id:'entrance',label:'출입구',subLabel:'ENTRANCE',searchTerms:'출입구 입구 entrance',items:[],x:25,y:91,w:12,h:6,type:'service',visible:true},
    {id:'front-window',label:'전면 유리창',subLabel:'FRONT WINDOW',searchTerms:'전면 유리창 window',items:[],x:38,y:91,w:43,h:6,type:'paper',visible:true},
    {id:'rear-door',label:'후문',subLabel:'REAR DOOR',searchTerms:'후문 rear door',items:[],x:83,y:89,w:12,h:8,type:'service',visible:true}
  ]
};

export function loadStoreMap(){
  try{
    const parsed=JSON.parse(localStorage.getItem(STORE_MAP_KEY)||'null');
    if(!parsed||!Array.isArray(parsed.zones))return structuredClone(DEFAULT_STORE_MAP);
    const merged={
      ...structuredClone(DEFAULT_STORE_MAP),
      ...parsed,
      zones:DEFAULT_STORE_MAP.zones.map((base)=>({...base,...(parsed.zones.find((item)=>item.id===base.id)||{})}))
    };
    if(merged.title==='블루블랙 펜샵 1층 안내도')merged.title=DEFAULT_STORE_MAP.title;
    if(merged.subtitle==='1층 주요 진열 구역과 편의시설 위치를 확인하세요.')merged.subtitle=DEFAULT_STORE_MAP.subtitle;
    return merged;
  }catch{return structuredClone(DEFAULT_STORE_MAP)}
}

export function saveStoreMap(value){
  localStorage.setItem(STORE_MAP_KEY,JSON.stringify(value));
  window.dispatchEvent(new CustomEvent('blueblack-store-map-updated',{detail:value}));
}

export function resetStoreMap(){
  localStorage.removeItem(STORE_MAP_KEY);
  const value=structuredClone(DEFAULT_STORE_MAP);
  window.dispatchEvent(new CustomEvent('blueblack-store-map-updated',{detail:value}));
  return value;
}
