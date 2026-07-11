import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const changed = [];

async function update(relativePath, transform) {
  const filePath = path.join(root, relativePath);
  const before = await readFile(filePath, 'utf8');
  const after = transform(before);
  if (after === before) return;
  await writeFile(filePath, after, 'utf8');
  changed.push(relativePath);
}

await update('src/portal-mobile-app.js', (source) => {
  let next = source
    .replace("  if(path.includes('/pen-buffet/'))return false;\n", '')
    .replace("  link.href=new URL('src/portal-mobile-app.css?v=3',APP_ROOT).href;", "  link.href=new URL('src/portal-mobile-app.css?v=4',APP_ROOT).href;")
    .replace("  if(!relative)return'home';\n  if(relative.startsWith('store-guide')", "  if(!relative)return'home';\n  if(relative.startsWith('pen-buffet'))return'pen';\n  if(relative.startsWith('store-guide')");

  if (!next.includes('function setupContextNavigation()')) {
    const helper = `\nfunction setupContextNavigation(){\n  const move=()=>{\n    const header=document.querySelector('.app-header,.topbar,.detail-header,.news-topbar,.review-topbar,header');\n    if(!header)return;\n    document.querySelectorAll('.mobile-bottom-nav,.mobile-dock').forEach(navigation=>{\n      if(navigation.classList.contains('mobile-app-nav'))return;\n      navigation.classList.add('mobile-context-nav');\n      if(navigation.previousElementSibling!==header)header.insertAdjacentElement('afterend',navigation);\n    });\n  };\n  move();\n  const observer=new MutationObserver(move);\n  observer.observe(document.body,{childList:true});\n  setTimeout(()=>observer.disconnect(),4000);\n}\n`;
    next = next.replace('\nfunction init(){', `${helper}\nfunction init(){`);
  }

  next = next.replace(
    "function init(){\n  if(!isCustomerPage())return;\n  ensureStyles();",
    "function init(){\n  if(!isCustomerPage())return;\n  if(window.__blueblackMobileAppShellInitialized)return;\n  window.__blueblackMobileAppShellInitialized=true;\n  ensureStyles();",
  );
  next = next.replace(
    "  const language=currentLanguage();\n  const nav=ensureNavigation();",
    "  const language=currentLanguage();\n  setupContextNavigation();\n  const nav=ensureNavigation();",
  );
  return next;
});

await update('src/public-ui-v52.js', (source) => source.replace("import './portal-mobile-app.js?v=3';", "import './portal-mobile-app.js?v=4';"));

await update('src/portal-mobile-app.css', (source) => {
  let next = source.replace('@media (max-width:760px){', '@media (max-width:899px){');
  if (!next.includes('GLOBAL MOBILE CONTEXT NAV')) {
    next += `\n\n/* GLOBAL MOBILE CONTEXT NAV */\n@media (max-width:899px){\n  .mobile-context-nav{\n    position:sticky!important;\n    z-index:9500!important;\n    top:calc(64px + env(safe-area-inset-top))!important;\n    right:auto!important;\n    bottom:auto!important;\n    left:auto!important;\n    display:grid!important;\n    width:calc(100% - 20px)!important;\n    max-width:720px!important;\n    min-height:54px!important;\n    margin:8px auto 10px!important;\n    padding:5px!important;\n    border:1px solid rgba(208,218,228,.94)!important;\n    border-radius:17px!important;\n    background:rgba(255,255,255,.96)!important;\n    box-shadow:0 10px 28px rgba(17,34,54,.13)!important;\n    backdrop-filter:blur(18px)!important;\n    -webkit-backdrop-filter:blur(18px)!important;\n  }\n  .mobile-bottom-nav.mobile-context-nav,.mobile-dock.mobile-context-nav{grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:4px!important}\n  .mobile-context-nav a,.mobile-context-nav button{min-height:44px!important;border-radius:12px!important}\n  html.mobile-keyboard-open .mobile-context-nav{display:none!important}\n}\n`;
  }
  return next;
});

await update('sw.js', (source) => source
  .replace("const CACHE_NAME = 'blueblack-store-guide-v39-20260711';", "const CACHE_NAME = 'blueblack-store-guide-v40-20260711';")
  .replace("'./src/portal-mobile-app.js?v=3'", "'./src/portal-mobile-app.js?v=4'")
  .replace("'./src/portal-mobile-app.css?v=3'", "'./src/portal-mobile-app.css?v=4'"));

const skipped = new Set([
  'admin.html',
  'admin-store-map.html',
  'guide/print-qr.html',
  'ink-price/debug-category.html',
]);

async function walk(directory = root) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name === '.git' || entry.name === 'node_modules') continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(absolute));
    else if (entry.isFile() && entry.name.endsWith('.html')) files.push(absolute);
  }
  return files;
}

for (const absolute of await walk()) {
  const relative = path.relative(root, absolute).replaceAll('\\', '/');
  if (skipped.has(relative) || relative.startsWith('admin/') || relative.startsWith('staff/')) continue;
  await update(relative, (html) => {
    if (html.includes('portal-mobile-app.js')) return html;
    if (!html.includes('</body>')) return html;
    let scriptPath = path.relative(path.dirname(absolute), path.join(root, 'src', 'portal-mobile-app.js')).replaceAll('\\', '/');
    if (!scriptPath.startsWith('.')) scriptPath = `./${scriptPath}`;
    return html.replace('</body>', `  <script type="module" src="${scriptPath}?v=4"></script>\n</body>`);
  });
}

console.log(changed.length ? `Updated ${changed.length} files:\n${changed.join('\n')}` : 'No mobile bottom bar changes were needed.');
