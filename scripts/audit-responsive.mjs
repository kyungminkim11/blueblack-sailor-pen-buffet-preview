import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const baseUrl=process.env.AUDIT_BASE_URL||'http://127.0.0.1:4173';
const pages=[
  {name:'home',path:'/'},
  {name:'news',path:'/news/'},
  {name:'review-event',path:'/review-event/'},
  {name:'pen-buffet',path:'/pen-buffet/'},
  {name:'store-guide',path:'/store-guide/'},
  {name:'official-guide',path:'/official-guide/'},
  {name:'engraving-guide',path:'/engraving-guide/'},
  {name:'as-guide',path:'/as-guide/'},
  {name:'ink-price',path:'/ink-price/'}
];
const viewports=[
  {name:'desktop',width:1440,height:1000},
  {name:'tablet',width:768,height:1024},
  {name:'mobile',width:390,height:844}
];
const languages=['ko','en','ja','zh-Hans','zh-Hant'];
const failures=[];
const hangul=/[가-힣]/;
await mkdir('artifacts/responsive',{recursive:true});

const browser=await chromium.launch({headless:true});

async function openPage(context,pageInfo,language){
  const page=await context.newPage();
  const url=new URL(pageInfo.path,baseUrl);
  url.searchParams.set('lang',language);
  await page.goto(url.href,{waitUntil:'domcontentloaded',timeout:45000});
  await page.waitForTimeout(1400);
  return page;
}

for(const viewport of viewports){
  const context=await browser.newContext({viewport:{width:viewport.width,height:viewport.height},deviceScaleFactor:1});
  for(const pageInfo of pages){
    const page=await openPage(context,pageInfo,'ko');
    const result=await page.evaluate(()=>{
      const root=document.documentElement;
      const body=document.body;
      const menu=document.querySelector('.bb-language-menu');
      const summary=menu?.querySelector('summary');
      const oldSelectors=[...document.querySelectorAll('.portal-language,.news-language,.review-language,.language-menu,.detail-language-menu')];
      return{
        htmlLang:root.lang,
        rootOverflow:root.scrollWidth-root.clientWidth,
        bodyOverflow:body.scrollWidth-body.clientWidth,
        menuExists:Boolean(menu),
        menuVisible:Boolean(menu&&getComputedStyle(menu).display!=='none'&&menu.getBoundingClientRect().width>0),
        summaryHeight:summary?.getBoundingClientRect().height||0,
        oldVisible:oldSelectors.some(node=>getComputedStyle(node).display!=='none'&&node.getBoundingClientRect().width>0)
      };
    });
    if(result.htmlLang!=='ko')failures.push(`${pageInfo.name}/${viewport.name}: expected ko, received ${result.htmlLang}`);
    if(result.rootOverflow>2||result.bodyOverflow>2)failures.push(`${pageInfo.name}/${viewport.name}: horizontal overflow root=${result.rootOverflow}, body=${result.bodyOverflow}`);
    if(!result.menuExists||!result.menuVisible)failures.push(`${pageInfo.name}/${viewport.name}: unified language menu is missing or hidden`);
    if(result.oldVisible)failures.push(`${pageInfo.name}/${viewport.name}: old language selector is still visible`);
    if(viewport.name==='mobile'&&result.summaryHeight<42)failures.push(`${pageInfo.name}/${viewport.name}: language button touch height is ${result.summaryHeight}px`);
    await page.screenshot({path:`artifacts/responsive/${pageInfo.name}-${viewport.name}.png`,fullPage:true});
    await page.close();
  }
  await context.close();
}

const languageContext=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1});
for(const pageInfo of pages){
  for(const language of languages){
    const page=await openPage(languageContext,pageInfo,language);
    const result=await page.evaluate(()=>{
      const menu=document.querySelector('.bb-language-menu');
      if(menu&&!menu.open)menu.querySelector('summary')?.click();
      const buttons=[...document.querySelectorAll('.bb-language-panel button')];
      return{
        htmlLang:document.documentElement.lang,
        title:document.title.trim(),
        heading:(document.querySelector('h1')?.textContent||'').trim(),
        options:buttons.map(button=>button.dataset.bbLanguage),
        heights:buttons.map(button=>button.getBoundingClientRect().height),
        selected:buttons.filter(button=>button.getAttribute('aria-pressed')==='true').map(button=>button.dataset.bbLanguage)
      };
    });
    if(result.htmlLang!==language)failures.push(`${pageInfo.name}/${language}: html lang is ${result.htmlLang}`);
    if(result.options.join(',')!==languages.join(','))failures.push(`${pageInfo.name}/${language}: language option order is ${result.options.join(',')}`);
    if(result.selected.length!==1||result.selected[0]!==language)failures.push(`${pageInfo.name}/${language}: selected language state is ${result.selected.join(',')}`);
    if(result.heights.some(height=>height<42))failures.push(`${pageInfo.name}/${language}: a language option is under 42px high`);
    if(language!=='ko'&&hangul.test(result.title))failures.push(`${pageInfo.name}/${language}: Korean remains in page title: ${result.title}`);
    if(language!=='ko'&&hangul.test(result.heading))failures.push(`${pageInfo.name}/${language}: Korean remains in main heading: ${result.heading}`);
    await page.close();
  }
}
await languageContext.close();
await browser.close();

if(failures.length){
  console.error('Responsive browser audit failed:');
  failures.forEach(failure=>console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Browser audit passed for ${pages.length} pages, ${viewports.length} viewports and ${languages.length} languages.`);
