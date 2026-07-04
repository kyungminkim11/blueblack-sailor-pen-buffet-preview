export const STORE_MAP_KEY='blueblack-store-map-v2';

export const DEFAULT_STORE_MAP={
  title:'블루블랙 펜샵 1층 브랜드 안내도',
  subtitle:'1층 주요 브랜드와 진열 구역 위치를 확인하세요.',
  note:'브랜드 및 진열 상품은 매장 운영 상황에 따라 변경될 수 있습니다.',
  zones:[
    {id:'ink-top',label:'잉크 진열벽',subLabel:'INK WALL',searchTerms:'잉크 ink bottle ink',x:14,y:4,w:72,h:10,type:'brand',visible:true},
    {id:'ink-left',label:'잉크 진열벽',subLabel:'INK WALL',searchTerms:'잉크 ink bottle ink',x:3,y:17,w:11,h:62,type:'brand',visible:true},
    {id:'rear-right',label:'후면 진열장',subLabel:'REAR DISPLAY',searchTerms:'후면 진열장 rear display',x:88,y:17,w:9,h:62,type:'brand',visible:true},
    {id:'black-island',label:'블랙 디스플레이 아일랜드',subLabel:'DISPLAY ISLAND',searchTerms:'블랙 디스플레이 아일랜드 display island',x:22,y:25,w:23,h:17,type:'brand',visible:true},
    {id:'pen-buffet',label:'펜뷔페 아일랜드',subLabel:'PEN BUFFET',searchTerms:'세일러 펜뷔페 sailor pen buffet',x:22,y:50,w:23,h:25,type:'table',visible:true},
    {id:'glass-a',label:'세일러',subLabel:'Sailor',searchTerms:'세일러 sailor',x:54,y:25,w:27,h:13,type:'brand',visible:true},
    {id:'glass-b',label:'카웨코',subLabel:'Kaweco',searchTerms:'카웨코 kaweco',x:54,y:46,w:27,h:13,type:'brand',visible:true},
    {id:'glass-c',label:'마존',subLabel:'Majohn',searchTerms:'마존 majohn moonman',x:54,y:67,w:27,h:13,type:'brand',visible:true},
    {id:'counter',label:'계산대',subLabel:'COUNTER',searchTerms:'계산대 카운터 counter checkout',x:10,y:82,w:15,h:10,type:'service',visible:true},
    {id:'stools',label:'스툴',subLabel:'SEATING',searchTerms:'스툴 좌석 seating stool',x:37,y:82,w:43,h:9,type:'paper',visible:true},
    {id:'entrance',label:'출입구',subLabel:'ENTRANCE',searchTerms:'출입구 입구 entrance',x:25,y:91,w:12,h:6,type:'service',visible:true},
    {id:'front-window',label:'전면 유리창',subLabel:'FRONT WINDOW',searchTerms:'전면 유리창 window',x:38,y:91,w:43,h:6,type:'paper',visible:true},
    {id:'rear-door',label:'후문',subLabel:'REAR DOOR',searchTerms:'후문 rear door',x:83,y:89,w:12,h:8,type:'service',visible:true}
  ]
};

export function loadStoreMap(){
  try{
    const parsed=JSON.parse(localStorage.getItem(STORE_MAP_KEY)||'null');
    if(!parsed||!Array.isArray(parsed.zones))return structuredClone(DEFAULT_STORE_MAP);
    const merged={...structuredClone(DEFAULT_STORE_MAP),...parsed,zones:DEFAULT_STORE_MAP.zones.map((base)=>({...base,...(parsed.zones.find((item)=>item.id===base.id)||{})}))};
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
