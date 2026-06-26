const copy = {
  ko: { install:'홈 화면에 추가', installing:'추가 중…', offline:'오프라인 모드로 전환되었습니다.', online:'인터넷 연결이 복구되었습니다.', update:'새 버전을 사용할 수 있습니다.', refresh:'업데이트' },
  en: { install:'Add to Home Screen', installing:'Adding…', offline:'You are now using offline mode.', online:'Internet connection restored.', update:'A new version is available.', refresh:'Update' },
  ja: { install:'ホーム画面に追加', installing:'追加中…', offline:'オフラインモードに切り替わりました。', online:'インターネット接続が復旧しました。', update:'新しいバージョンがあります。', refresh:'更新' },
};

function language(){
  const value=document.documentElement.lang?.toLowerCase() ?? 'ko';
  if(value.startsWith('en')) return 'en';
  if(value.startsWith('ja')) return 'ja';
  return 'ko';
}
function text(){ return copy[language()] ?? copy.ko; }

function ensureManifest(){
  if(!document.querySelector('link[rel="manifest"]')){
    const link=document.createElement('link');
    link.rel='manifest';
    link.href='./manifest.webmanifest';
    document.head.append(link);
  }
  if(!document.querySelector('link[rel="icon"]')){
    const icon=document.createElement('link');
    icon.rel='icon';
    icon.href='./app-icon.svg';
    icon.type='image/svg+xml';
    document.head.append(icon);
  }
  const metas=[
    ['apple-mobile-web-app-capable','yes'],
    ['apple-mobile-web-app-status-bar-style','black-translucent'],
    ['apple-mobile-web-app-title','Pen Buffet'],
  ];
  for(const [name,content] of metas){
    if(document.querySelector(`meta[name="${name}"]`)) continue;
    const meta=document.createElement('meta');
    meta.name=name;
    meta.content=content;
    document.head.append(meta);
  }
}

function networkToast(message){
  let toast=document.querySelector('.network-toast');
  if(!toast){
    toast=document.createElement('div');
    toast.className='network-toast';
    toast.setAttribute('role','status');
    document.body.append(toast);
  }
  toast.textContent=message;
  toast.classList.add('is-visible');
  window.clearTimeout(networkToast.timer);
  networkToast.timer=window.setTimeout(()=>toast.classList.remove('is-visible'),2800);
}

function showUpdate(registration){
  if(document.querySelector('.update-banner')) return;
  const banner=document.createElement('div');
  banner.className='update-banner';
  banner.innerHTML=`<span>${text().update}</span><button type="button">${text().refresh}</button>`;
  banner.querySelector('button').addEventListener('click',()=>{
    registration.waiting?.postMessage({type:'SKIP_WAITING'});
    location.reload();
  });
  document.body.append(banner);
}

function setupInstallPrompt(){
  const switcher=document.querySelector('.language-switcher');
  if(!switcher) return;
  const button=document.createElement('button');
  button.type='button';
  button.className='install-app-button';
  button.textContent=text().install;
  switcher.insertAdjacentElement('afterend',button);

  let promptEvent=null;
  window.addEventListener('beforeinstallprompt',(event)=>{
    event.preventDefault();
    promptEvent=event;
    button.textContent=text().install;
    button.classList.add('is-visible');
  });
  button.addEventListener('click',async()=>{
    if(!promptEvent) return;
    button.textContent=text().installing;
    await promptEvent.prompt();
    await promptEvent.userChoice;
    promptEvent=null;
    button.classList.remove('is-visible');
  });
  window.addEventListener('appinstalled',()=>button.remove());
  document.querySelectorAll('[data-language]').forEach((languageButton)=>languageButton.addEventListener('click',()=>window.setTimeout(()=>{
    if(button.isConnected) button.textContent=text().install;
  })));
}

async function registerServiceWorker(){
  if(!('serviceWorker' in navigator)) return;
  try{
    const registration=await navigator.serviceWorker.register('./sw.js',{scope:'./'});
    if(registration.waiting && navigator.serviceWorker.controller) showUpdate(registration);
    registration.addEventListener('updatefound',()=>{
      const worker=registration.installing;
      worker?.addEventListener('statechange',()=>{
        if(worker.state==='installed' && navigator.serviceWorker.controller) showUpdate(registration);
      });
    });
    navigator.serviceWorker.addEventListener('controllerchange',()=>{
      if(!window.__blueblackReloading){
        window.__blueblackReloading=true;
        location.reload();
      }
    });
  }catch(error){
    console.warn('Service worker registration failed',error);
  }
}

ensureManifest();
window.addEventListener('online',()=>networkToast(text().online));
window.addEventListener('offline',()=>networkToast(text().offline));
window.setTimeout(setupInstallPrompt,0);
registerServiceWorker();
