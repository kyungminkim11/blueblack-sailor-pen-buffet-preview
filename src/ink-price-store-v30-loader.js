const VERSION='61';
const CACHE_KEY='blueblack-ink-store-source-v61';
const LEGACY_CACHE_KEYS=['blueblack-ink-store-source-v60'];

const decode=value=>decodeURIComponent(escape(atob(value.trim())));
const root=()=>document.querySelector('#ink-store-app');

async function read(name,attempt=0){
  const url=new URL(`./${name}`,import.meta.url);
  url.searchParams.set('v',VERSION);
  url.searchParams.set('attempt',String(attempt));
  const response=await fetch(url,{cache:'no-store'});
  if(!response.ok)throw new Error(`${name}: HTTP ${response.status}`);
  return response.text();
}

async function buildSource(attempt=0){
  const encoded=await Promise.all([
    'ink-price-store-v30-1.b64',
    'ink-price-store-v30-2.b64',
  ].map(name=>read(name,attempt)));
  const prefix=await Promise.all([
    'ink-price-store-v30.part3.txt',
    'ink-price-store-v30.part4a.txt',
  ].map(name=>read(name,attempt)));
  const ranked=JSON.parse(await read('ink-price-store-v30.part4b.json',attempt));
  const suffix=await Promise.all([
    'ink-price-store-v30.part5.txt',
    'ink-price-store-v30.part6.txt',
    'ink-price-store-v30.part7.txt',
    'ink-price-store-v30.part8.txt',
  ].map(name=>read(name,attempt)));
  return [...encoded.map(decode),...prefix,ranked,...suffix].join('');
}

async function run(source){
  const blobUrl=URL.createObjectURL(new Blob([source],{type:'text/javascript'}));
  try{
    await import(blobUrl);
    await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
    if(!root()?.children.length)throw new Error('Ink app rendered no content');
  }finally{
    URL.revokeObjectURL(blobUrl);
  }
}

function save(source){
  try{
    localStorage.setItem(CACHE_KEY,source);
    LEGACY_CACHE_KEYS.forEach(key=>localStorage.removeItem(key));
  }catch{}
}

function cachedSource(){
  try{return localStorage.getItem(CACHE_KEY)||'';}catch{return'';}
}

function showError(error){
  console.error('Ink store UI failed to load',error);
  const mount=root();
  if(!mount)return;
  mount.innerHTML=`
    <div class="ink-store-load-error" role="alert">
      <strong>소분 잉크 검색 화면을 불러오지 못했습니다.</strong>
      <span>저장된 이전 파일을 정리한 뒤 다시 불러와 주세요.</span>
      <button type="button" data-ink-app-retry>다시 불러오기</button>
    </div>`;
  mount.querySelector('[data-ink-app-retry]')?.addEventListener('click',()=>{
    try{
      localStorage.removeItem(CACHE_KEY);
      LEGACY_CACHE_KEYS.forEach(key=>localStorage.removeItem(key));
    }catch{}
    location.reload();
  });
}

async function load(){
  let lastError;
  for(let attempt=0;attempt<2;attempt+=1){
    try{
      const source=await buildSource(attempt);
      await run(source);
      save(source);
      document.documentElement.dataset.inkApp='ready';
      return;
    }catch(error){
      lastError=error;
      console.warn(`Ink app network load attempt ${attempt+1} failed`,error);
      root()?.replaceChildren();
    }
  }

  const cached=cachedSource();
  if(cached){
    try{
      await run(cached);
      document.documentElement.dataset.inkApp='cached';
      return;
    }catch(error){
      lastError=error;
      console.warn('Cached ink app failed',error);
      root()?.replaceChildren();
    }
  }
  showError(lastError||new Error('Unknown ink app loading error'));
}

load();
