import { readFile } from 'node:fs/promises';

const pages=[
  'index.html',
  'news/index.html',
  'review-event/index.html',
  'pen-buffet/index.html',
  'store-guide/index.html',
  'official-guide/index.html',
  'engraving-guide/index.html',
  'as-guide/index.html',
  'ink-price/index.html'
];

const translationFiles=[
  'src/portal.js',
  'news/news.js',
  'review-event/review-event.js',
  'src/official-guide.js',
  'src/engraving-guide-i18n-v50.js',
  'src/as-guide-i18n-v50.js',
  'src/pen-buffet-i18n-v50.js',
  'src/ink-price-i18n-v43.js',
  'src/store-map-foreign-v20.js'
];

const requiredLocales=['ko','en','ja','zh-Hans','zh-Hant'];
const failures=[];

for(const page of pages){
  const html=await readFile(page,'utf8');
  if(!/<html\s+lang="ko"/i.test(html))failures.push(`${page}: missing base html lang`);
  if(!/name="viewport"[^>]*width=device-width/i.test(html))failures.push(`${page}: missing responsive viewport`);
  if(!html.includes('public-ui-v52.js'))failures.push(`${page}: unified public UI is not connected`);
}

for(const file of translationFiles){
  const source=await readFile(file,'utf8');
  for(const locale of requiredLocales){
    if(!source.includes(locale))failures.push(`${file}: missing locale ${locale}`);
  }
}

const css=await readFile('src/public-ui-v52.css','utf8');
for(const required of ['@media(max-width:820px)','@media(max-width:560px)','overflow-x:clip','minmax(0,1fr)']){
  if(!css.includes(required))failures.push(`src/public-ui-v52.css: missing responsive rule ${required}`);
}

const ui=await readFile('src/public-ui-v52.js','utf8');
for(const locale of requiredLocales){
  if(!ui.includes(locale))failures.push(`src/public-ui-v52.js: missing language option ${locale}`);
}

if(failures.length){
  console.error('Public UI validation failed:');
  failures.forEach(item=>console.error(`- ${item}`));
  process.exit(1);
}

console.log(`Validated ${pages.length} public pages and ${requiredLocales.length} languages.`);
