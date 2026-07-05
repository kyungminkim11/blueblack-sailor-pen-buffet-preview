import '../src/public-ui-v52.js';

const CACHE_KEY='blueblack-instagram-feed-v60';
const REFRESH_MS=3*60*60*1000;

const feedCopy={
  ko:{intro:'신제품, 재입고, 기존 제품 소개와 매장 소식을 한곳에서 확인하세요.',feedBody:'인스타그램에 게시된 최신 소식을 불러옵니다.',fallbackTitle:'인스타그램 최신 게시물을 표시하지 못했습니다',fallbackBody:'인스타그램에서 블루블랙의 최신 소식을 확인해 주세요.',blogTitle:'네이버 블로그',blogBody:'신제품과 브랜드 이야기를 자세히 살펴봅니다.'},
  en:{intro:'See new arrivals, restocks, product highlights and store news in one place.',feedBody:'Loads the latest updates published on Instagram.',fallbackTitle:'Latest Instagram posts could not be displayed',fallbackBody:'Open Instagram to see the latest BlueBlack updates.',blogTitle:'Naver Blog',blogBody:'Read detailed stories about new products and brands.'},
  ja:{intro:'新商品、再入荷、商品紹介、店舗のお知らせをまとめて確認できます。',feedBody:'Instagramに投稿された最新情報を読み込みます。',fallbackTitle:'Instagramの最新投稿を表示できませんでした',fallbackBody:'InstagramでBlueBlackの最新情報をご確認ください。',blogTitle:'NAVERブログ',blogBody:'新商品やブランドの詳しい情報をご覧ください。'},
  'zh-Hans':{intro:'集中查看新品、补货、产品介绍和门店消息。',feedBody:'加载 Instagram 上发布的最新内容。',fallbackTitle:'无法显示 Instagram 最新内容',fallbackBody:'请前往 Instagram 查看 BlueBlack 的最新消息。',blogTitle:'NAVER 博客',blogBody:'查看新品和品牌的详细介绍。'},
  'zh-Hant':{intro:'集中查看新品、補貨、產品介紹與門市消息。',feedBody:'載入 Instagram 上發布的最新內容。',fallbackTitle:'無法顯示 Instagram 最新內容',fallbackBody:'請前往 Instagram 查看 BlueBlack 的最新消息。',blogTitle:'NAVER 部落格',blogBody:'查看新品與品牌的詳細介紹。'}
};

function lang(){
  const value=(document.documentElement.lang||'ko').toLowerCase();
  if(value.includes('hant')||value.startsWith('zh-tw')||value.startsWith('zh-hk'))return'zh-Hant';
  if(value.startsWith('zh'))return'zh-Hans';
  if(value.startsWith('ja'))return'ja';
  if(value.startsWith('en'))return'en';
  return'ko';
}

function applyFeedCopy(){
  const text=feedCopy[lang()]||feedCopy.ko;
  const set=(key,value)=>{const node=document.querySelector(`[data-news-copy="${key}"]`);if(node)node.textContent=value;};
  set('intro',text.intro);set('feedBody',text.feedBody);set('fallbackTitle',text.fallbackTitle);set('fallbackBody',text.fallbackBody);set('blogTitle',text.blogTitle);set('blogBody',text.blogBody);
}

function trim(value,max=90){const text=String(value||'').replace(/\s+/g,' ').trim();return text.length>max?`${text.slice(0,max).trim()}…`:text;}
function resolveMediaUrl(item,feedUrl){
  const value=item.imageUrl||item.thumbnailUrl||item.mediaUrl;if(!value)return'';
  try{return new URL(value,feedUrl).href;}catch{return value;}
}
function card(item,feedUrl){
  const a=document.createElement('a');a.className='instagram-post-card';a.href=item.permalink;a.target='_blank';a.rel='noopener';
  const media=document.createElement('div');media.className='instagram-post-media';
  const img=document.createElement('img');img.loading='lazy';img.decoding='async';img.src=resolveMediaUrl(item,feedUrl);img.alt=trim(item.caption,60)||'BlueBlack Instagram post';media.append(img);
  if(item.mediaType==='VIDEO'){const badge=document.createElement('span');badge.className='instagram-post-badge';badge.textContent='VIDEO';media.append(badge);}
  const body=document.createElement('div');body.className='instagram-post-body';
  const date=document.createElement('small');
  try{date.textContent=new Intl.DateTimeFormat(document.documentElement.lang||'ko',{year:'numeric',month:'short',day:'numeric'}).format(new Date(item.timestamp));}catch{date.textContent='';}
  const p=document.createElement('p');p.textContent=trim(item.caption)||'BlueBlack Pen Shop';body.append(date,p);a.append(media,body);return a;
}

function readCache(){
  try{const value=JSON.parse(localStorage.getItem(CACHE_KEY)||'null');return value&&Array.isArray(value.items)?value:null;}catch{return null;}
}
function writeCache(value){try{localStorage.setItem(CACHE_KEY,JSON.stringify(value));}catch{}}
function announce(updatedAt,cached){window.dispatchEvent(new CustomEvent('bbnewsupdated',{detail:{updatedAt,cached}}));}

async function loadFeedConfig(){
  try{const response=await fetch('./feed-config.json?v=60',{cache:'force-cache'});if(!response.ok)return'';const config=await response.json();return typeof config.endpoint==='string'?config.endpoint.trim():'';}catch{return'';}
}
async function fetchFeed(url){
  const separator=url.includes('?')?'&':'?';
  const slot=Math.floor(Date.now()/REFRESH_MS);
  const response=await fetch(`${url}${separator}slot=${slot}`,{cache:'default',headers:{Accept:'application/json'}});
  if(!response.ok)throw new Error(`Feed request failed: ${response.status}`);
  const data=await response.json();
  const items=(Array.isArray(data.items)?data.items:[]).filter(item=>item?.permalink&&(item.imageUrl||item.thumbnailUrl||item.mediaUrl));
  if(!items.length)throw new Error('Feed has no displayable items.');
  return{items,sourceUrl:response.url||url,updatedAt:data.updatedAt||new Date().toISOString()};
}
function renderFeed(feed,{cached=false}={}){
  const grid=document.querySelector('[data-instagram-feed]');const fallback=document.querySelector('[data-instagram-fallback]');
  if(!grid||!feed?.items?.length)return false;
  grid.replaceChildren(...feed.items.slice(0,9).map(item=>card(item,feed.sourceUrl||location.href)));
  grid.hidden=false;fallback?.classList.remove('is-visible');announce(feed.updatedAt||Date.now(),cached);return true;
}

async function loadFeed(){
  const loading=document.querySelector('[data-instagram-loading]');const grid=document.querySelector('[data-instagram-feed]');const fallback=document.querySelector('[data-instagram-fallback]');
  const cached=readCache();let hasContent=false;
  if(cached)hasContent=renderFeed(cached,{cached:true});
  try{
    const externalEndpoint=await loadFeedConfig();
    const candidates=[externalEndpoint,'./feed-data.json'].filter(Boolean);let loadedFeed=null;
    for(const candidate of candidates){try{loadedFeed=await fetchFeed(candidate);break;}catch(error){console.warn(`Instagram feed source failed: ${candidate}`,error);}}
    if(!loadedFeed)throw new Error('All Instagram feed sources failed.');
    const stored={...loadedFeed,updatedAt:loadedFeed.updatedAt||new Date().toISOString()};writeCache(stored);renderFeed(stored,{cached:false});hasContent=true;
  }catch(error){
    console.warn('Instagram feed update failed',error);
    if(!hasContent){fallback?.classList.add('is-visible');if(grid)grid.hidden=true;}
  }finally{if(loading)loading.hidden=true;}
}

document.querySelectorAll('[data-news-lang]').forEach(button=>button.addEventListener('click',()=>setTimeout(applyFeedCopy,0)));
applyFeedCopy();loadFeed();
