import '../src/public-ui-v52.js';

const CACHE_KEY='blueblack-instagram-feed-v61';
const REFRESH_MS=3*60*60*1000;

const feedCopy={
  ko:{intro:'신제품, 재입고, 기존 제품 소개와 매장 소식을 한곳에서 확인하세요.',feedBody:'인스타그램에 게시된 최신 소식을 불러옵니다.',fallbackTitle:'공식 인스타그램에서 최신 소식을 확인하세요',fallbackBody:'자동 게시물 목록 연결이 지연될 때도 아래 공식 프로필에서 최신 게시물을 바로 확인할 수 있습니다.',blogTitle:'네이버 블로그',blogBody:'신제품과 브랜드 이야기를 자세히 살펴봅니다.',retry:'다시 불러오기',profileTitle:'BlueBlack Pen Shop 인스타그램 프로필'},
  en:{intro:'See new arrivals, restocks, product highlights and store news in one place.',feedBody:'Loads the latest updates published on Instagram.',fallbackTitle:'See the latest updates on our official Instagram',fallbackBody:'If the automatic post list is delayed, you can still view the latest posts in the official profile below.',blogTitle:'Naver Blog',blogBody:'Read detailed stories about new products and brands.',retry:'Try again',profileTitle:'BlueBlack Pen Shop Instagram profile'},
  ja:{intro:'新商品、再入荷、商品紹介、店舗のお知らせをまとめて確認できます。',feedBody:'Instagramに投稿された最新情報を読み込みます。',fallbackTitle:'公式Instagramで最新情報をご確認ください',fallbackBody:'自動投稿一覧の接続が遅れている場合も、下の公式プロフィールから最新投稿を確認できます。',blogTitle:'NAVERブログ',blogBody:'新商品やブランドの詳しい情報をご覧ください。',retry:'再読み込み',profileTitle:'BlueBlack Pen Shop Instagramプロフィール'},
  'zh-Hans':{intro:'集中查看新品、补货、产品介绍和门店消息。',feedBody:'加载 Instagram 上发布的最新内容。',fallbackTitle:'请在官方 Instagram 查看最新消息',fallbackBody:'自动帖子列表连接延迟时，也可以通过下方官方主页查看最新帖子。',blogTitle:'NAVER 博客',blogBody:'查看新品和品牌的详细介绍。',retry:'重新加载',profileTitle:'BlueBlack Pen Shop Instagram 主页'},
  'zh-Hant':{intro:'集中查看新品、補貨、產品介紹與門市消息。',feedBody:'載入 Instagram 上發布的最新內容。',fallbackTitle:'請在官方 Instagram 查看最新消息',fallbackBody:'自動貼文列表連線延遲時，也可以透過下方官方個人檔案查看最新貼文。',blogTitle:'NAVER 部落格',blogBody:'查看新品與品牌的詳細介紹。',retry:'重新載入',profileTitle:'BlueBlack Pen Shop Instagram 個人檔案'}
};

function lang(){
  const value=(document.documentElement.lang||'ko').toLowerCase();
  if(value.includes('hant')||value.startsWith('zh-tw')||value.startsWith('zh-hk'))return'zh-Hant';
  if(value.startsWith('zh'))return'zh-Hans';
  if(value.startsWith('ja'))return'ja';
  if(value.startsWith('en'))return'en';
  return'ko';
}

function copy(){return feedCopy[lang()]||feedCopy.ko;}
function applyFeedCopy(){
  const text=copy();
  const set=(key,value)=>{const node=document.querySelector(`[data-news-copy="${key}"]`);if(node)node.textContent=value;};
  set('intro',text.intro);set('feedBody',text.feedBody);set('fallbackTitle',text.fallbackTitle);set('fallbackBody',text.fallbackBody);set('blogTitle',text.blogTitle);set('blogBody',text.blogBody);set('retry',text.retry);
  const iframe=document.querySelector('[data-instagram-profile-iframe]');if(iframe)iframe.title=text.profileTitle;
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
  img.addEventListener('error',()=>a.classList.add('is-image-error'),{once:true});
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
  try{const response=await fetch(`./feed-config.json?v=61&t=${Date.now()}`,{cache:'no-store'});if(!response.ok)return'';const config=await response.json();return typeof config.endpoint==='string'?config.endpoint.trim():'';}catch{return'';}
}
async function fetchFeed(url){
  const separator=url.includes('?')?'&':'?';
  const slot=Math.floor(Date.now()/REFRESH_MS);
  const response=await fetch(`${url}${separator}slot=${slot}`,{cache:'no-store',headers:{Accept:'application/json'}});
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

function showProfileFallback(){
  const fallback=document.querySelector('[data-instagram-fallback]');
  const iframe=document.querySelector('[data-instagram-profile-iframe]');
  fallback?.classList.add('is-visible');
  if(iframe&&!iframe.getAttribute('src')){
    iframe.addEventListener('load',()=>iframe.closest('[data-instagram-profile-frame]')?.classList.add('is-loaded'),{once:true});
    iframe.setAttribute('src','https://www.instagram.com/blueblack_korea/embed/');
  }
}

let loadingPromise=null;
async function loadFeed({force=false}={}){
  if(loadingPromise&&!force)return loadingPromise;
  loadingPromise=(async()=>{
    const loading=document.querySelector('[data-instagram-loading]');const grid=document.querySelector('[data-instagram-feed]');const fallback=document.querySelector('[data-instagram-fallback]');
    if(loading)loading.hidden=false;
    fallback?.classList.remove('is-visible');
    const cached=readCache();let hasContent=false;
    if(cached)hasContent=renderFeed(cached,{cached:true});
    try{
      const externalEndpoint=await loadFeedConfig();
      const candidates=[externalEndpoint,`./feed-data.json?v=61&t=${Math.floor(Date.now()/60000)}`].filter(Boolean);let loadedFeed=null;
      for(const candidate of candidates){try{loadedFeed=await fetchFeed(candidate);break;}catch(error){console.warn(`Instagram feed source failed: ${candidate}`,error);}}
      if(!loadedFeed)throw new Error('All Instagram feed sources failed.');
      const stored={...loadedFeed,updatedAt:loadedFeed.updatedAt||new Date().toISOString()};writeCache(stored);renderFeed(stored,{cached:false});hasContent=true;
    }catch(error){
      console.warn('Instagram feed update failed',error);
      if(!hasContent){if(grid)grid.hidden=true;showProfileFallback();}
    }finally{if(loading)loading.hidden=true;loadingPromise=null;}
  })();
  return loadingPromise;
}

function setupRetry(){
  document.querySelector('[data-instagram-retry]')?.addEventListener('click',event=>{
    const button=event.currentTarget;button.disabled=true;
    loadFeed({force:true}).finally(()=>{button.disabled=false;});
  });
}

document.querySelectorAll('[data-news-lang]').forEach(button=>button.addEventListener('click',()=>setTimeout(applyFeedCopy,0)));
applyFeedCopy();setupRetry();loadFeed();
