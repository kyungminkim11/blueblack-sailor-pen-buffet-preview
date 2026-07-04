import { readFile } from 'node:fs/promises';

const pages={
  'index.html':['portal.js','public-portal-copy.js'],
  'news/index.html':['news-feed.js'],
  'review-event/index.html':['public-ui-v52.js'],
  'pen-buffet/index.html':['locale-ui-v10.js'],
  'store-guide/index.html':['portal.js','store-address-addon.js'],
  'official-guide/index.html':['portal.js','official-guide-i18n-v50.js'],
  'engraving-guide/index.html':['portal.js'],
  'as-guide/index.html':['portal.js','as-guide.js'],
  'ink-price/index.html':['portal.js','ink-price-style-v30-loader.js']
};

const baseTranslationFiles=[
  'src/portal.js',
  'news/news.js',
  'review-event/review-event.js',
  'src/official-guide.js',
  'src/engraving-guide.js',
  'src/as-guide.js',
  'src/pen-buffet-i18n-v50.js',
  'src/ink-price-i18n-v43.js',
  'src/store-map-foreign-v20.js'
];

const baseLocales=['ko','en','ja','zh-Hans','zh-Hant'];
const extraLocales=['vi','id','th'];
const allLocales=[...baseLocales,...extraLocales];
const failures=[];

for(const [page,entryModules] of Object.entries(pages)){
  const html=await readFile(page,'utf8');
  if(!/<html\s+lang="ko"/i.test(html))failures.push(`${page}: missing base html lang`);
  if(!/name="viewport"[^>]*width=device-width/i.test(html))failures.push(`${page}: missing responsive viewport`);
  if(!entryModules.some(module=>html.includes(module)))failures.push(`${page}: no shared public UI entry module found`);
}

for(const file of baseTranslationFiles){
  const source=await readFile(file,'utf8');
  for(const locale of baseLocales){
    if(!source.includes(locale))failures.push(`${file}: missing locale ${locale}`);
  }
}

const extraSource=await readFile('src/public-extra-locales-v53.js','utf8');
for(const locale of extraLocales){
  if(!extraSource.includes(locale))failures.push(`src/public-extra-locales-v53.js: missing locale ${locale}`);
}

const css=await readFile('src/public-ui-v52.css','utf8');
for(const required of ['@media(max-width:820px)','@media(max-width:560px)','overflow-x:clip','minmax(0,1fr)']){
  if(!css.includes(required))failures.push(`src/public-ui-v52.css: missing responsive rule ${required}`);
}

const ui=await readFile('src/public-ui-v52.js','utf8');
for(const locale of allLocales){
  if(!ui.includes(locale))failures.push(`src/public-ui-v52.js: missing language option ${locale}`);
}
for(const flag of ['🇰🇷','🇺🇸','🇯🇵','🇨🇳','🇹🇼','🇻🇳','🇮🇩','🇹🇭']){
  if(!ui.includes(flag))failures.push(`src/public-ui-v52.js: missing flag ${flag}`);
}
if(!ui.includes('public-extra-locales-v53.js'))failures.push('src/public-ui-v52.js: extra locale module is not connected');

const sharedEntryFiles=[
  'src/portal.js',
  'src/public-portal-copy.js',
  'news/news-feed.js',
  'src/locale-ui-v10.js',
  'src/store-address-addon.js',
  'src/official-guide-i18n-v50.js',
  'src/as-guide.js',
  'src/ink-price-style-v30-loader.js'
];
for(const file of sharedEntryFiles){
  const source=await readFile(file,'utf8');
  if(!source.includes('public-ui-v52.js'))failures.push(`${file}: does not import shared public UI`);
}

if(failures.length){
  console.error('Public UI validation failed:');
  failures.forEach(item=>console.error(`- ${item}`));
  process.exit(1);
}

console.log(`Validated ${Object.keys(pages).length} public pages and ${allLocales.length} languages.`);
