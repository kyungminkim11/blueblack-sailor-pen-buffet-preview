const sourceUrl=new URL('./public-extra-locales-v53.js',import.meta.url);

async function loadLocaleData(){
  const response=await fetch(sourceUrl,{cache:'force-cache'});
  if(!response.ok)throw new Error(`Locale data unavailable: ${response.status}`);
  const source=await response.text();
  const cutoff=source.indexOf('function normalize');
  if(cutoff<0)throw new Error('Locale data format is invalid');
  const declarations=source.slice(0,cutoff).replace(/^const /gm,'var ');
  return Function(`${declarations};return {EXTRA_LANGUAGES,PAGE_TITLES,COPY,ATTRIBUTE_COPY};`)();
}

function normalize(value=''){
  const language=String(value).toLowerCase();
  if(language.startsWith('vi'))return'vi';
  if(language.startsWith('id'))return'id';
  if(language.startsWith('th'))return'th';
  return'';
}

function requestedLanguage(){
  const query=normalize(new URLSearchParams(location.search).get('lang'));
  let saved='';
  try{saved=normalize(localStorage.getItem('blueblack-language'));}catch{}
  return query||saved;
}

function cleanPath(){
  let path=location.pathname.replace(/index\.html$/,'');
  if(!path.endsWith('/'))path+='/';
  const base='/blueblack-sailor-pen-buffet-preview';
  if(path.startsWith(base))path=path.slice(base.length)||'/';
  return path;
}

function translateTextNode(node,dictionary){
  if(!node.parentElement||['SCRIPT','STYLE','NOSCRIPT','TEXTAREA'].includes(node.parentElement.tagName))return;
  const value=node.nodeValue;
  const trimmed=value.trim();
  if(!trimmed)return;
  const translated=dictionary[trimmed];
  if(translated&&translated!==trimmed)node.nodeValue=value.replace(trimmed,translated);
}

function translateAttributes(root,dictionary){
  root.querySelectorAll?.('[placeholder],[aria-label],[title],[alt]').forEach(element=>{
    for(const attribute of ['placeholder','aria-label','title','alt']){
      const value=element.getAttribute(attribute);
      const translated=value&&dictionary[value];
      if(translated&&translated!==value)element.setAttribute(attribute,translated);
    }
  });
}

function updateLanguageLinks(language){
  document.querySelectorAll('a[data-preserve-lang],[data-news-back],[data-review-back]').forEach(link=>{
    try{
      const url=new URL(link.href,location.href);
      url.searchParams.set('lang',language);
      if(link.href!==url.href)link.href=url.href;
    }catch{}
  });
}

function updateMenu(language){
  const menu=document.querySelector('.bb-language-menu');
  if(!menu)return;
  menu.querySelectorAll('[data-bb-language]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.bbLanguage===language)));
  const item={vi:{flag:'🇻🇳',label:'Tiếng Việt'},id:{flag:'🇮🇩',label:'Bahasa Indonesia'},th:{flag:'🇹🇭',label:'ไทย'}}[language];
  const flag=menu.querySelector('.bb-language-current-flag');
  const label=menu.querySelector('.bb-language-current-label');
  if(flag&&flag.textContent!==item.flag)flag.textContent=item.flag;
  if(label&&label.textContent!==item.label)label.textContent=item.label;
}

const language=requestedLanguage();
if(['vi','id','th'].includes(language)){
  loadLocaleData().then(data=>{
    const dictionary=data.COPY[language]||{};
    const attributeDictionary=data.ATTRIBUTE_COPY[language]||{};
    const path=cleanPath();
    let applying=false;
    let timer=0;

    function apply(){
      if(applying)return;
      applying=true;
      try{
        if(document.documentElement.lang!==language)document.documentElement.lang=language;
        try{localStorage.setItem('blueblack-language',language);}catch{}
        const title=data.PAGE_TITLES[language]?.[path];
        if(title&&document.title!==title)document.title=title;
        const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
        const nodes=[];
        while(walker.nextNode())nodes.push(walker.currentNode);
        nodes.forEach(node=>translateTextNode(node,dictionary));
        translateAttributes(document,attributeDictionary);
        updateLanguageLinks(language);
        updateMenu(language);
      }finally{applying=false;}
    }

    function schedule(){
      clearTimeout(timer);
      timer=setTimeout(apply,60);
    }

    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
    const startObserver=()=>{
      if(!document.body)return;
      new MutationObserver(schedule).observe(document.body,{subtree:true,childList:true,characterData:true});
    };
    if(document.body)startObserver();else document.addEventListener('DOMContentLoaded',startObserver,{once:true});
    setTimeout(apply,300);
    setTimeout(apply,1200);
    setTimeout(apply,2600);
  }).catch(error=>console.warn('Extra public translations failed',error));
}
