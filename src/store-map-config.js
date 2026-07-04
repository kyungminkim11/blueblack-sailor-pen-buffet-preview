export const STORE_MAP_KEY='blueblack-store-map-v2';

const DISPLAY_INK_NOTICE='전시용 잉크병입니다. 공병에 잉크가 들어 있지만 실제 잉크 색상과 유사할 뿐 동일하지 않을 수 있습니다.';

export const DEFAULT_STORE_MAP={
  title:'블루블랙 펜샵 1층 브랜드 안내도',
  subtitle:'1층 주요 브랜드와 진열 구역 위치를 확인하세요.',
  note:'브랜드 및 진열 상품은 매장 운영 상황에 따라 변경될 수 있습니다.',
  zones:[
    {id:'ink-top',label:'상단 잉크 진열벽',subLabel:'INK DISPLAY',searchTerms:'전시용 잉크병 공병 잉크 display ink bottle',description:DISPLAY_INK_NOTICE,items:['전시용 잉크병'],x:14,y:4,w:72,h:10,type:'brand',visible:true},
    {id:'ink-left',label:'좌측 잉크 진열벽',subLabel:'INK DISPLAY',searchTerms:'전시용 잉크병 공병 잉크 display ink bottle',description:DISPLAY_INK_NOTICE,items:['전시용 잉크병'],x:3,y:17,w:11,h:62,type:'brand',visible:true},
    {id:'rear-right',label:'후면 진열장',subLabel:'REAR DISPLAY',searchTerms:'블랙윙 Blackwing 메시지 카드 키레나 형광펜 톤랜드 펜코 Penco 하이타이드 Hightide',description:'문구와 소품 브랜드를 함께 확인할 수 있는 후면 진열 구역입니다.',items:['블랙윙','메시지 카드','키레나 형광펜','톤랜드','펜코','하이타이드'],x:88,y:17,w:9,h:62,type:'brand',visible:true},
    {id:'black-island',label:'블랙 디스플레이 아일랜드',subLabel:'DISPLAY ISLAND',searchTerms:'글라스펜 시필 세일러 블루블랙 콜라보 잉크 음료 시리즈 제이허빈 J Herbin 10ml 쥬스업 Juice Up 볼펜 잉크 발색 카드',description:'시필과 잉크 관련 소품을 중심으로 구성된 디스플레이 아일랜드입니다.',items:['글라스펜 시필','세일러 × 블루블랙 펜샵 콜라보 잉크(음료 시리즈)','제이허빈 10ml','쥬스업 볼펜','잉크 발색 카드'],x:22,y:25,w:23,h:17,type:'brand',visible:true},
    {id:'pen-buffet',label:'펜뷔페 아일랜드',subLabel:'PEN BUFFET',searchTerms:'세일러 Sailor 펜뷔페 컨버터 converter 카트리지 cartridge 시키오리 Shikiori 일반 극흑 Kiwaguro 만요 Manyo 시필',description:'세일러 펜뷔페 구성품과 잉크, 시필펜을 확인하는 구역입니다.',items:['세일러 펜뷔페','세일러 컨버터','세일러 카트리지(시키오리·일반·극흑)','세일러 만요','세일러 펜뷔페 펜 시필'],x:22,y:50,w:23,h:25,type:'table',visible:true},
    {id:'glass-a',label:'세일러',subLabel:'Sailor',searchTerms:'세일러 Sailor 투주 Tuzu 만년필 수성펜 시필펜 캐주얼 만년필 1층 2층',description:'세일러 제품은 1층과 2층에 나뉘어 진열되어 있습니다.',items:['세일러 일부 제품','세일러 투주 만년필','수성펜 시필펜','세일러 캐주얼 만년필 시필'],x:54,y:25,w:27,h:13,type:'brand',visible:true},
    {id:'glass-b',label:'카웨코',subLabel:'Kaweco',searchTerms:'카웨코 Kaweco 전제품 스포츠 클래식 Sport Classic 시필펜',description:'카웨코 제품과 대표 시필펜을 확인할 수 있는 진열대입니다.',items:['카웨코 전제품','카웨코 스포츠 클래식 시필펜'],x:54,y:46,w:27,h:13,type:'brand',visible:true},
    {id:'glass-c',label:'마존',subLabel:'Majohn',searchTerms:'마존 Majohn Moonman 전제품 잉크월 Ink Wall 잉크 비스콘티 Visconti 만년필 시필',description:'마존 제품과 잉크월 잉크, 비스콘티 만년필을 함께 확인할 수 있습니다.',items:['마존 전제품','잉크월 잉크','비스콘티 만년필','마존 만년필 시필'],x:54,y:67,w:27,h:13,type:'brand',visible:true},
    {id:'counter',label:'계산대',subLabel:'COUNTER',searchTerms:'계산대 카운터 counter checkout',items:[],x:10,y:82,w:15,h:10,type:'service',visible:true},
    {id:'stools',label:'스툴',subLabel:'SEATING',searchTerms:'스툴 좌석 seating stool',items:[],x:37,y:82,w:43,h:9,type:'paper',visible:true},
    {id:'entrance',label:'출입구',subLabel:'ENTRANCE',searchTerms:'출입구 입구 entrance',items:[],x:25,y:91,w:12,h:6,type:'service',visible:true},
    {id:'front-window',label:'전면 유리창',subLabel:'FRONT WINDOW',searchTerms:'전면 유리창 window',items:[],x:38,y:91,w:43,h:6,type:'paper',visible:true},
    {id:'rear-door',label:'후문',subLabel:'REAR DOOR',searchTerms:'후문 rear door',items:[],x:83,y:89,w:12,h:8,type:'service',visible:true}
  ]
};

const STORE_MAP_I18N={
  en:{title:'BlueBlack Pen Shop First-floor Brand Map',subtitle:'Find the main brands and display areas on the first floor.',note:'Brands and displayed products may change according to store operations.',zones:{
    'ink-top':{label:'Upper ink display wall',description:'These are display ink bottles. The bottles contain ink, but the displayed color is only similar to the actual ink and may not be identical.',items:['Display ink bottles']},
    'ink-left':{label:'Left ink display wall',description:'These are display ink bottles. The bottles contain ink, but the displayed color is only similar to the actual ink and may not be identical.',items:['Display ink bottles']},
    'rear-right':{label:'Rear display cabinet',description:'A rear display area featuring stationery and accessory brands.',items:['Blackwing','Message cards','Kirena highlighters','Toneland','Penco','Hightide']},
    'black-island':{label:'Black display island',description:'A display island centered on writing trials and ink-related accessories.',items:['Glass pen testing','Sailor × BlueBlack collaboration inks (beverage series)','J. Herbin 10ml','Juice Up pens','Ink swatch cards']},
    'pen-buffet':{label:'Pen Buffet island',description:'Explore Sailor Pen Buffet parts, inks and sample pens here.',items:['Sailor Pen Buffet','Sailor converters','Sailor cartridges (Shikiori, standard and Kiwaguro)','Sailor Manyo','Pen Buffet sample pens']},
    'glass-a':{label:'Sailor',description:'Sailor products are displayed across both the first and second floors.',items:['Selected Sailor products','Sailor TUZU fountain pens','Rollerball sample pens','Sailor casual fountain pen samples']},
    'glass-b':{label:'Kaweco',description:'Browse Kaweco products and representative sample pens.',items:['Kaweco product range','Kaweco Sport Classic sample pen']},
    'glass-c':{label:'Majohn',description:'Browse Majohn products, Ink Wall inks and Visconti fountain pens together.',items:['Majohn product range','Ink Wall inks','Visconti fountain pens','Majohn fountain pen samples']},
    counter:{label:'Checkout counter'},stools:{label:'Stools'},entrance:{label:'Entrance'},'front-window':{label:'Front window'},'rear-door':{label:'Rear door'}
  }},
  ja:{title:'BlueBlack Pen Shop 1階ブランド案内図',subtitle:'1階の主なブランドと陳列エリアをご確認ください。',note:'ブランドや陳列商品は店舗運営状況により変更される場合があります。',zones:{
    'ink-top':{label:'上部インク展示壁',description:'展示用のインクボトルです。ボトルにはインクが入っていますが、実際のインク色に近い表示であり、完全に同じではない場合があります。',items:['展示用インクボトル']},
    'ink-left':{label:'左側インク展示壁',description:'展示用のインクボトルです。ボトルにはインクが入っていますが、実際のインク色に近い表示であり、完全に同じではない場合があります。',items:['展示用インクボトル']},
    'rear-right':{label:'後方陳列棚',description:'文具と小物ブランドをまとめてご覧いただける後方の陳列エリアです。',items:['Blackwing','メッセージカード','キレーナ蛍光ペン','Toneland','Penco','Hightide']},
    'black-island':{label:'ブラック・ディスプレイアイランド',description:'試筆とインク関連小物を中心に構成したディスプレイです。',items:['ガラスペンの試筆','Sailor × BlueBlack コラボインク（ドリンクシリーズ）','J. Herbin 10ml','Juice Up ボールペン','インク色見本カード']},
    'pen-buffet':{label:'ペンビュッフェ・アイランド',description:'Sailorペンビュッフェのパーツ、インク、試筆ペンをご確認いただけます。',items:['Sailor ペンビュッフェ','Sailor コンバーター','Sailor カートリッジ（四季織・一般・極黒）','Sailor 万葉','ペンビュッフェ試筆ペン']},
    'glass-a':{label:'Sailor',description:'Sailor製品は1階と2階に分けて陳列しています。',items:['Sailor 一部商品','Sailor TUZU 万年筆','ローラーボール試筆ペン','Sailor カジュアル万年筆の試筆']},
    'glass-b':{label:'Kaweco',description:'Kaweco製品と代表的な試筆ペンをご覧いただけます。',items:['Kaweco 全商品','Kaweco Sport Classic 試筆ペン']},
    'glass-c':{label:'Majohn',description:'Majohn製品、Ink Wallインク、Visconti万年筆をまとめてご覧いただけます。',items:['Majohn 全商品','Ink Wall インク','Visconti 万年筆','Majohn 万年筆の試筆']},
    counter:{label:'レジ'},stools:{label:'スツール'},entrance:{label:'入口'},'front-window':{label:'正面ガラス窓'},'rear-door':{label:'裏口'}
  }},
  'zh-Hans':{title:'BlueBlack Pen Shop 一楼品牌地图',subtitle:'查看一楼主要品牌和陈列区域的位置。',note:'品牌及陈列商品可能会根据门店运营情况调整。',zones:{
    'ink-top':{label:'上方墨水展示墙',description:'这里展示的是装有墨水的展示瓶。展示颜色仅与实际墨水颜色相近，可能并不完全一致。',items:['展示用墨水瓶']},
    'ink-left':{label:'左侧墨水展示墙',description:'这里展示的是装有墨水的展示瓶。展示颜色仅与实际墨水颜色相近，可能并不完全一致。',items:['展示用墨水瓶']},
    'rear-right':{label:'后方陈列柜',description:'可集中查看文具与小物品牌的后方陈列区域。',items:['Blackwing','留言卡','Kirena 荧光笔','Toneland','Penco','Hightide']},
    'black-island':{label:'黑色展示岛台',description:'以试写体验和墨水相关用品为主的展示岛台。',items:['玻璃笔试写','Sailor × BlueBlack 联名墨水（饮品系列）','J. Herbin 10ml','Juice Up 圆珠笔','墨水色卡']},
    'pen-buffet':{label:'钢笔自助配色岛台',description:'可查看Sailor钢笔自助配色零件、墨水和试写笔。',items:['Sailor 钢笔自助配色','Sailor 上墨器','Sailor 墨囊（四季织、普通、极黑）','Sailor 万叶','钢笔自助配色试写笔']},
    'glass-a':{label:'Sailor',description:'Sailor商品分别陈列在一楼和二楼。',items:['部分 Sailor 商品','Sailor TUZU 钢笔','水性笔试写','Sailor 休闲钢笔试写']},
    'glass-b':{label:'Kaweco',description:'可查看Kaweco商品及代表性试写笔。',items:['Kaweco 全系列商品','Kaweco Sport Classic 试写笔']},
    'glass-c':{label:'Majohn',description:'可一同查看Majohn商品、Ink Wall墨水和Visconti钢笔。',items:['Majohn 全系列商品','Ink Wall 墨水','Visconti 钢笔','Majohn 钢笔试写']},
    counter:{label:'收银台'},stools:{label:'座椅'},entrance:{label:'出入口'},'front-window':{label:'正面玻璃窗'},'rear-door':{label:'后门'}
  }},
  'zh-Hant':{title:'BlueBlack Pen Shop 一樓品牌地圖',subtitle:'查看一樓主要品牌與陳列區域的位置。',note:'品牌及陳列商品可能會依門市營運情況調整。',zones:{
    'ink-top':{label:'上方墨水展示牆',description:'這裡展示的是裝有墨水的展示瓶。展示顏色僅與實際墨水顏色相近，可能並不完全一致。',items:['展示用墨水瓶']},
    'ink-left':{label:'左側墨水展示牆',description:'這裡展示的是裝有墨水的展示瓶。展示顏色僅與實際墨水顏色相近，可能並不完全一致。',items:['展示用墨水瓶']},
    'rear-right':{label:'後方陳列櫃',description:'可集中查看文具與小物品牌的後方陳列區域。',items:['Blackwing','留言卡','Kirena 螢光筆','Toneland','Penco','Hightide']},
    'black-island':{label:'黑色展示島台',description:'以試寫體驗與墨水相關用品為主的展示島台。',items:['玻璃筆試寫','Sailor × BlueBlack 聯名墨水（飲品系列）','J. Herbin 10ml','Juice Up 原子筆','墨水色卡']},
    'pen-buffet':{label:'鋼筆自助配色島台',description:'可查看Sailor鋼筆自助配色零件、墨水與試寫筆。',items:['Sailor 鋼筆自助配色','Sailor 吸墨器','Sailor 墨囊（四季織、一般、極黑）','Sailor 萬葉','鋼筆自助配色試寫筆']},
    'glass-a':{label:'Sailor',description:'Sailor商品分別陳列於一樓與二樓。',items:['部分 Sailor 商品','Sailor TUZU 鋼筆','水性筆試寫','Sailor 休閒鋼筆試寫']},
    'glass-b':{label:'Kaweco',description:'可查看Kaweco商品及代表性試寫筆。',items:['Kaweco 全系列商品','Kaweco Sport Classic 試寫筆']},
    'glass-c':{label:'Majohn',description:'可一同查看Majohn商品、Ink Wall墨水與Visconti鋼筆。',items:['Majohn 全系列商品','Ink Wall 墨水','Visconti 鋼筆','Majohn 鋼筆試寫']},
    counter:{label:'收銀台'},stools:{label:'座椅'},entrance:{label:'出入口'},'front-window':{label:'正面玻璃窗'},'rear-door':{label:'後門'}
  }}
};

function mapLanguage(){
  const raw=(new URLSearchParams(location.search).get('lang')||document.documentElement.lang||localStorage.getItem('blueblack-language')||'ko').toLowerCase();
  if(raw.includes('hant')||raw.startsWith('zh-tw')||raw.startsWith('zh-hk'))return'zh-Hant';
  if(raw.startsWith('zh'))return'zh-Hans';
  if(raw.startsWith('ja'))return'ja';
  if(raw.startsWith('en'))return'en';
  return'ko';
}

function localizeMap(config){
  const language=mapLanguage();
  if(language==='ko')return config;
  const translation=STORE_MAP_I18N[language];
  if(!translation)return config;
  const localized=structuredClone(config);
  localized.title=translation.title;
  localized.subtitle=translation.subtitle;
  localized.note=translation.note;
  localized.zones=localized.zones.map(zone=>{
    const copy=translation.zones[zone.id];
    return copy?{...zone,...copy}:zone;
  });
  return localized;
}

function mergeZone(base,saved={}){
  const merged={...base,...saved};
  merged.searchTerms=base.searchTerms;
  merged.description=base.description;
  merged.items=base.items;
  if((base.id==='ink-top'||base.id==='ink-left')&&saved.label==='잉크 진열벽')merged.label=base.label;
  if((base.id==='ink-top'||base.id==='ink-left')&&saved.subLabel==='INK WALL')merged.subLabel=base.subLabel;
  return merged;
}

export function loadStoreMap(){
  try{
    const parsed=JSON.parse(localStorage.getItem(STORE_MAP_KEY)||'null');
    let value;
    if(!parsed||!Array.isArray(parsed.zones))value=structuredClone(DEFAULT_STORE_MAP);
    else{
      value={
        ...structuredClone(DEFAULT_STORE_MAP),
        ...parsed,
        zones:DEFAULT_STORE_MAP.zones.map((base)=>mergeZone(base,parsed.zones.find((item)=>item.id===base.id)))
      };
      if(value.title==='블루블랙 펜샵 1층 안내도')value.title=DEFAULT_STORE_MAP.title;
      if(value.subtitle==='1층 주요 진열 구역과 편의시설 위치를 확인하세요.')value.subtitle=DEFAULT_STORE_MAP.subtitle;
    }
    return localizeMap(value);
  }catch{return localizeMap(structuredClone(DEFAULT_STORE_MAP));}
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
