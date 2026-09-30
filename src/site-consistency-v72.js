const SITE_ROOT=new URL('../',import.meta.url);

function isCustomerSite(){
  const path=location.pathname.toLowerCase();
  const query=new URLSearchParams(location.search);
  if(/\/(admin|staff)(\/|\.html|$)/.test(path))return false;
  if(query.get('admin')==='1'||query.get('staff')==='1'||query.get('mode')==='store')return false;
  return true;
}

function normalizeLanguage(value=''){
  const text=String(value).toLowerCase();
  if(text.includes('hant')||text.startsWith('zh-tw')||text.startsWith('zh-hk')||text.startsWith('zh-mo'))return'zh-Hant';
  if(text.startsWith('zh'))return'zh-Hans';
  if(text.startsWith('ja'))return'ja';
  if(text.startsWith('vi'))return'vi';
  if(text.startsWith('id'))return'id';
  if(text.startsWith('th'))return'th';
  if(text.startsWith('en'))return'en';
  return'ko';
}

function currentLanguage(){
  const query=new URLSearchParams(location.search);
  if(query.has('lang'))return normalizeLanguage(query.get('lang'));
  try{
    const saved=localStorage.getItem('blueblack-language');
    if(saved)return normalizeLanguage(saved);
  }catch{}
  return normalizeLanguage(document.documentElement.lang||navigator.language||'ko');
}

const COPY={
  ko:{
    intro:'매장 이용에 필요한 안내를 한곳에서 확인하세요.',
    experience:'매장 체험',pen:'세일러 펜뷔페',ink:'잉크 소분 안내',store:'매장 안내',review:'영수증 리뷰 이벤트',
    guides:'안내 서비스',first:'첫 만년필 가이드',official:'공식 정보 안내',engraving:'각인 안내',as:'A/S 안내',
    channels:'소식·채널',news:'블루블랙 최신 소식',website:'공식 홈페이지',blog:'블로그',instagram:'인스타그램',
    footer:'더 좋은 필기 경험을 위한 BlueBlack Pen Shop 디지털 가이드'
  },
  en:{
    intro:'Find the customer guides you need for your visit in one place.',
    experience:'In-store experience',pen:'Sailor Pen Buffet',ink:'Ink decant guide',store:'Store guide',review:'Receipt review event',
    guides:'Service guides',first:'First fountain pen guide',official:'Official information',engraving:'Engraving guide',as:'After-sales service',
    channels:'News & channels',news:'Latest BlueBlack news',website:'Official website',blog:'Blog',instagram:'Instagram',
    footer:'BlueBlack Pen Shop digital guide for a better writing experience'
  },
  ja:{
    intro:'ご来店時に必要な案内をひとつの場所で確認できます。',
    experience:'店頭体験',pen:'セーラー ペンビュッフェ',ink:'インク小分け案内',store:'店舗案内',review:'レシートレビューイベント',
    guides:'サービス案内',first:'はじめての万年筆ガイド',official:'公式情報案内',engraving:'名入れ案内',as:'A/S・修理案内',
    channels:'お知らせ・公式チャンネル',news:'BlueBlack最新情報',website:'公式サイト',blog:'ブログ',instagram:'Instagram',
    footer:'より良い筆記体験のためのBlueBlack Pen Shopデジタルガイド'
  },
  'zh-Hans':{
    intro:'在一个页面中查看到店所需的顾客指南。',
    experience:'门店体验',pen:'Sailor钢笔自助配色',ink:'墨水分装指南',store:'门店指南',review:'小票评价活动',
    guides:'服务指南',first:'第一支钢笔指南',official:'官方信息指南',engraving:'刻字指南',as:'售后服务指南',
    channels:'消息与官方频道',news:'BlueBlack最新消息',website:'官方网站',blog:'博客',instagram:'Instagram',
    footer:'为更好的书写体验准备的BlueBlack Pen Shop数字指南'
  },
  'zh-Hant':{
    intro:'在同一處查看到店所需的顧客指南。',
    experience:'門市體驗',pen:'Sailor鋼筆自助配色',ink:'墨水分裝指南',store:'門市指南',review:'收據評論活動',
    guides:'服務指南',first:'第一支鋼筆指南',official:'官方資訊指南',engraving:'刻字指南',as:'售後服務指南',
    channels:'消息與官方頻道',news:'BlueBlack最新消息',website:'官方網站',blog:'部落格',instagram:'Instagram',
    footer:'為更好的書寫體驗準備的BlueBlack Pen Shop數位指南'
  },
  vi:{
    intro:'Xem các hướng dẫn cần thiết cho chuyến ghé cửa hàng tại một nơi.',
    experience:'Trải nghiệm tại cửa hàng',pen:'Sailor Pen Buffet',ink:'Hướng dẫn mực chiết',store:'Hướng dẫn cửa hàng',review:'Sự kiện đánh giá hóa đơn',
    guides:'Hướng dẫn dịch vụ',first:'Hướng dẫn bút máy đầu tiên',official:'Thông tin chính thức',engraving:'Hướng dẫn khắc tên',as:'Hướng dẫn hậu mãi',
    channels:'Tin tức & kênh chính thức',news:'Tin mới từ BlueBlack',website:'Trang web chính thức',blog:'Blog',instagram:'Instagram',
    footer:'Cẩm nang số BlueBlack Pen Shop cho trải nghiệm viết tốt hơn'
  },
  id:{
    intro:'Temukan panduan pelanggan yang dibutuhkan untuk kunjungan toko di satu tempat.',
    experience:'Pengalaman di toko',pen:'Sailor Pen Buffet',ink:'Panduan tinta isi ulang',store:'Panduan toko',review:'Acara ulasan struk',
    guides:'Panduan layanan',first:'Panduan pena fountain pertama',official:'Informasi resmi',engraving:'Panduan ukiran',as:'Panduan purna jual',
    channels:'Berita & kanal resmi',news:'Berita terbaru BlueBlack',website:'Situs resmi',blog:'Blog',instagram:'Instagram',
    footer:'Panduan digital BlueBlack Pen Shop untuk pengalaman menulis yang lebih baik'
  },
  th:{
    intro:'รวมคู่มือสำหรับลูกค้าที่จำเป็นต่อการมาเยือนร้านไว้ในที่เดียว',
    experience:'ประสบการณ์ในร้าน',pen:'Sailor Pen Buffet',ink:'คู่มือแบ่งหมึก',store:'คู่มือร้าน',review:'กิจกรรมรีวิวใบเสร็จ',
    guides:'คู่มือบริการ',first:'คู่มือปากกาหมึกซึมด้ามแรก',official:'ข้อมูลทางการ',engraving:'คู่มือสลักข้อความ',as:'คู่มือบริการหลังการขาย',
    channels:'ข่าวสารและช่องทางทางการ',news:'ข่าวล่าสุดจาก BlueBlack',website:'เว็บไซต์ทางการ',blog:'บล็อก',instagram:'Instagram',
    footer:'คู่มือดิจิทัล BlueBlack Pen Shop เพื่อประสบการณ์การเขียนที่ดียิ่งขึ้น'
  }
};

function pageKey(){
  let relative=location.pathname.replace(SITE_ROOT.pathname,'').replace(/^\/+|\/+$/g,'').toLowerCase();
  relative=relative.replace(/\/index\.html$/,'').replace(/^index\.html$/,'');
  return relative.split('/')[0]||'home';
}

function siteLink(path,lang){
  const url=new URL(path,SITE_ROOT);
  url.searchParams.set('lang',lang);
  return url.href;
}

function injectStyles(){
  if(document.querySelector('link[data-bb-site-consistency]'))return;
  const link=document.createElement('link');
  link.rel='stylesheet';
  link.href=new URL('./site-consistency-v72.css?v=72',import.meta.url).href;
  link.dataset.bbSiteConsistency='true';
  document.head.append(link);
}

function footerGroup(label,items){
  return `<nav class="bb-site-footer__group" aria-label="${label}"><small>BLUEBLACK</small><h2>${label}</h2>${items.map(item=>`<a href="${item.href}"${item.external?' target="_blank" rel="noopener"':''}>${item.label}</a>`).join('')}</nav>`;
}

function buildFooter(){
  const lang=currentLanguage();
  const copy=COPY[lang]||COPY.ko;
  document.querySelectorAll('footer').forEach(node=>node.remove());

  const footer=document.createElement('footer');
  footer.className='bb-site-footer';
  footer.id='site-map';
  footer.innerHTML=`
    <div class="bb-site-footer__inner">
      <div class="bb-site-footer__head">
        <div class="bb-site-footer__brand"><small>BLUEBLACK PEN SHOP</small><strong>Digital Guide</strong></div>
        <p>${copy.intro}</p>
      </div>
      <div class="bb-site-footer__grid">
        ${footerGroup(copy.experience,[
          {href:siteLink('pen-buffet/',lang),label:copy.pen},
          {href:siteLink('ink-price/',lang),label:copy.ink},
          {href:siteLink('store-guide/',lang),label:copy.store},
          {href:siteLink('review-event/',lang),label:copy.review}
        ])}
        ${footerGroup(copy.guides,[
          {href:siteLink('guide/',lang),label:copy.first},
          {href:siteLink('official-guide/',lang),label:copy.official},
          {href:siteLink('engraving-guide/',lang),label:copy.engraving},
          {href:siteLink('as-guide/',lang),label:copy.as}
        ])}
        ${footerGroup(copy.channels,[
          {href:siteLink('news/',lang),label:copy.news},
          {href:'https://blueblack.co.kr/',label:copy.website,external:true},
          {href:'https://blog.naver.com/paikorea',label:copy.blog,external:true},
          {href:'https://www.instagram.com/blueblack_korea/',label:copy.instagram,external:true}
        ])}
      </div>
      <div class="bb-site-footer__bottom">
        <span>${copy.footer}</span>
        <span class="bb-site-footer__links"><a href="https://blueblack.co.kr/" target="_blank" rel="noopener">blueblack.co.kr</a><a href="tel:027658868">02-765-8868</a></span>
      </div>
    </div>`;

  const anchor=document.querySelector('.mobile-app-nav')||document.querySelector('dialog');
  if(anchor)anchor.before(footer);
  else document.body.append(footer);
}

function markLayout(){
  const key=pageKey().replace(/[^a-z0-9-]/g,'-');
  document.body.classList.add('bb-customer-site',`bb-site-page-${key}`);
  document.querySelector('.portal-header,.detail-header,.app-header,.news-topbar,.review-topbar,.topbar')?.classList.add('bb-site-banner');
}

function sync(){
  if(!isCustomerSite())return;
  injectStyles();
  markLayout();
  if(['service','store-tour'].includes(pageKey()))return;
  buildFooter();
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',sync,{once:true});
else sync();

window.addEventListener('bb:languagechange',()=>{if(isCustomerSite()&&!['service','store-tour'].includes(pageKey()))buildFooter();});
