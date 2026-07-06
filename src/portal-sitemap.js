const SITEMAP_COPY={
  ko:{title:'사이트맵',body:'고객용 안내 페이지를 목적별로 한눈에 확인하세요.',experience:'매장 체험',pen:'세일러 펜뷔페',ink:'잉크 소분 안내',store:'매장 안내',review:'영수증 리뷰 이벤트',service:'서비스 안내',official:'공식 정보 안내',engraving:'각인 안내',as:'A/S 안내',channel:'소식·채널',news:'블루블랙 최신 소식',website:'공식 홈페이지',instagram:'인스타그램'},
  en:{title:'Site map',body:'Browse all customer-facing guides by purpose.',experience:'In-store experience',pen:'Sailor Pen Buffet',ink:'Ink decant guide',store:'Store guide',review:'Receipt review event',service:'Service guides',official:'Official information',engraving:'Engraving guide',as:'After-sales service',channel:'News & channels',news:'Latest BlueBlack news',website:'Official website',instagram:'Instagram'},
  ja:{title:'サイトマップ',body:'お客様向けの案内ページを目的別にまとめてご覧いただけます。',experience:'店頭体験',pen:'セーラー ペンビュッフェ',ink:'インク小分け案内',store:'店舗案内',review:'レシートレビューイベント',service:'サービス案内',official:'公式情報案内',engraving:'名入れ案内',as:'A/S・修理案内',channel:'お知らせ・公式チャンネル',news:'BlueBlack最新情報',website:'公式サイト',instagram:'Instagram'},
  'zh-Hans':{title:'网站地图',body:'按用途查看所有面向顾客的指南页面。',experience:'门店体验',pen:'Sailor钢笔自助配色',ink:'墨水分装指南',store:'门店指南',review:'小票评价活动',service:'服务指南',official:'官方信息指南',engraving:'刻字指南',as:'售后服务指南',channel:'消息与官方频道',news:'BlueBlack最新消息',website:'官方网站',instagram:'Instagram'},
  'zh-Hant':{title:'網站地圖',body:'依用途查看所有顧客用指南頁面。',experience:'門市體驗',pen:'Sailor鋼筆自助配色',ink:'墨水分裝指南',store:'門市指南',review:'收據評論活動',service:'服務指南',official:'官方資訊指南',engraving:'刻字指南',as:'售後服務指南',channel:'消息與官方頻道',news:'BlueBlack最新消息',website:'官方網站',instagram:'Instagram'},
  vi:{title:'Sơ đồ trang',body:'Xem toàn bộ hướng dẫn dành cho khách hàng theo từng mục đích.',experience:'Trải nghiệm tại cửa hàng',pen:'Sailor Pen Buffet',ink:'Hướng dẫn mực chiết',store:'Hướng dẫn cửa hàng',review:'Sự kiện đánh giá hóa đơn',service:'Hướng dẫn dịch vụ',official:'Thông tin chính thức',engraving:'Hướng dẫn khắc tên',as:'Hướng dẫn hậu mãi',channel:'Tin tức & kênh chính thức',news:'Tin mới từ BlueBlack',website:'Trang web chính thức',instagram:'Instagram'},
  id:{title:'Peta situs',body:'Lihat semua panduan pelanggan berdasarkan tujuan.',experience:'Pengalaman di toko',pen:'Sailor Pen Buffet',ink:'Panduan tinta isi ulang',store:'Panduan toko',review:'Acara ulasan struk',service:'Panduan layanan',official:'Informasi resmi',engraving:'Panduan ukiran',as:'Panduan layanan purna jual',channel:'Berita & kanal resmi',news:'Berita terbaru BlueBlack',website:'Situs resmi',instagram:'Instagram'},
  th:{title:'แผนผังเว็บไซต์',body:'ดูหน้าคู่มือสำหรับลูกค้าทั้งหมดตามวัตถุประสงค์',experience:'ประสบการณ์ในร้าน',pen:'Sailor Pen Buffet',ink:'คู่มือแบ่งหมึก',store:'คู่มือร้าน',review:'กิจกรรมรีวิวใบเสร็จ',service:'คู่มือบริการ',official:'ข้อมูลทางการ',engraving:'คู่มือสลักข้อความ',as:'คู่มือบริการหลังการขาย',channel:'ข่าวสารและช่องทางทางการ',news:'ข่าวล่าสุดจาก BlueBlack',website:'เว็บไซต์ทางการ',instagram:'Instagram'}
};
function normalize(value=''){
  const text=String(value).toLowerCase();
  if(text.includes('hant')||text.startsWith('zh-tw')||text.startsWith('zh-hk'))return'zh-Hant';
  if(text.startsWith('zh'))return'zh-Hans';
  if(text.startsWith('ja'))return'ja';
  if(text.startsWith('vi'))return'vi';
  if(text.startsWith('id'))return'id';
  if(text.startsWith('th'))return'th';
  if(text.startsWith('en'))return'en';
  return'ko';
}
function apply(){
  const lang=normalize(document.documentElement.lang||localStorage.getItem('blueblack-language')||navigator.language);
  const copy=SITEMAP_COPY[lang]||SITEMAP_COPY.ko;
  document.querySelectorAll('[data-sitemap-t]').forEach(node=>{const value=copy[node.dataset.sitemapT];if(value)node.textContent=value;});
}
new MutationObserver(apply).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
apply();
