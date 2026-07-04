export const STORE_MAP_KEY='blueblack-store-map-v1';

export const DEFAULT_STORE_MAP={
  title:'블루블랙 펜샵 1층 안내도',
  subtitle:'매장 위치를 기준으로 구성한 안내도 · 실제 진열은 변경될 수 있습니다.',
  note:'브랜드 및 진열 상품은 매장 운영 상황에 따라 변경될 수 있습니다.',
  zones:[
    {id:'ink-top',label:'잉크 진열벽',subLabel:'INK WALL',x:12,y:5,w:76,h:9,type:'ink',visible:true},
    {id:'ink-left',label:'잉크 진열벽',subLabel:'INK WALL',x:3,y:18,w:10,h:62,type:'ink',visible:true},
    {id:'rear-right',label:'후면 진열장',subLabel:'REAR DISPLAY',x:90,y:18,w:7,h:62,type:'dark',visible:true},
    {id:'black-island',label:'블랙 디스플레이 아일랜드',subLabel:'DISPLAY ISLAND',x:22,y:25,w:21,h:16,type:'dark',visible:true},
    {id:'pen-buffet',label:'펜뷔페 아일랜드',subLabel:'PEN BUFFET',x:22,y:48,w:21,h:27,type:'warm',visible:true},
    {id:'glass-a',label:'화이트 유리 진열대 A',subLabel:'BRAND DISPLAY',x:53,y:25,w:29,h:12,type:'glass',visible:true},
    {id:'glass-b',label:'화이트 유리 진열대 B',subLabel:'BRAND DISPLAY',x:53,y:45,w:29,h:12,type:'glass',visible:true},
    {id:'glass-c',label:'화이트 유리 진열대 C',subLabel:'BRAND DISPLAY',x:53,y:65,w:29,h:12,type:'glass',visible:true},
    {id:'counter',label:'계산대',subLabel:'COUNTER',x:10,y:82,w:13,h:10,type:'dark',visible:true},
    {id:'stools',label:'스툴',subLabel:'SEATING',x:38,y:82,w:44,h:8,type:'seats',visible:true},
    {id:'entrance',label:'출입구',subLabel:'ENTRANCE',x:25,y:91,w:12,h:6,type:'entrance',visible:true},
    {id:'front-window',label:'전면 유리창',subLabel:'FRONT WINDOW',x:38,y:91,w:48,h:6,type:'glassline',visible:true}
  ]
};

export function loadStoreMap(){
  try{
    const parsed=JSON.parse(localStorage.getItem(STORE_MAP_KEY)||'null');
    if(!parsed||!Array.isArray(parsed.zones))return structuredClone(DEFAULT_STORE_MAP);
    return {...structuredClone(DEFAULT_STORE_MAP),...parsed,zones:DEFAULT_STORE_MAP.zones.map((base)=>({...base,...(parsed.zones.find((item)=>item.id===base.id)||{})}))};
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
