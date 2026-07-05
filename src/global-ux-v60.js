const GLOBAL_UX_VERSION='60';

if(!window.__blueblackGlobalUxV60){
  window.__blueblackGlobalUxV60=true;

  const TEXT={
    ko:{
      customer:'고객 안내',staff:'직원 빠른 도구',useNow:'지금 매장에서 사용하기',useNowBody:'가장 자주 사용하는 안내와 도구를 바로 열어보세요.',services:'서비스 안내',servicesBody:'각인·A/S·브랜드 정보를 확인하세요.',news:'블루블랙 소식',newsBody:'신제품과 재입고, 공식 채널 소식을 확인하세요.',staffTitle:'매장 상담 빠른 도구',staffBody:'반복 설명은 줄이고 필요한 화면을 바로 열 수 있도록 정리했습니다.',newCustomer:'새 고객 펜뷔페 시작',newCustomerBody:'이전 조합을 지우고 처음부터 시작',inkSearch:'잉크 빠른 검색',inkSearchBody:'색상·브랜드·용량 확인',brandMap:'브랜드 위치 찾기',brandMapBody:'층과 진열 구역 바로 확인',asSearch:'A/S 접수처 찾기',asSearchBody:'브랜드별 연락처·주소 확인',engraving:'각인 문구 확인',engravingBody:'글꼴과 문자 지원 확인',review:'리뷰 이벤트 열기',reviewBody:'QR과 참여 조건 안내',recent:'최근 사용한 도구',floorFact:'건물 층 기준',floorFactBody:'B1 · 2F · 4F를 사용합니다. 아래 탭은 매장 안내도 구분입니다.',mapHelp:'지도는 화면에 맞춰 표시됩니다. 확대 버튼이나 크게 보기를 이용하면 세부 위치를 확인할 수 있습니다.',combinationCode:'조합 코드',copy:'복사',copied:'복사했습니다.',reviewCta:'포토리뷰 작성하기',reviewReminder:'리뷰 작성 완료 화면을 직원에게 보여주세요.',updated:'마지막 업데이트',cached:'저장된 최신 데이터를 표시 중입니다.',more:'도구 더보기',asPrompt:'브랜드명을 검색하거나 자주 찾는 브랜드를 선택하면 해당 접수처만 표시됩니다.',copyPhone:'전화번호 복사',copyAddress:'주소 복사',copyGuide:'고객 안내 복사',verified:'정보 확인일',characters:'글자 수',copyText:'문구 복사',uppercaseWarning:'필기체를 선택한 경우 연속 대문자는 사용할 수 없습니다.',symbolWarning:'일부 특수문자는 각인할 수 없을 수 있으니 직원 확인이 필요합니다.',retry3d:'3D 다시 불러오기',guideMap1:'매장 안내도 1',guideMap2:'매장 안내도 2'},
    en:{customer:'Customer guide',staff:'Staff quick tools',useNow:'Use in store now',useNowBody:'Open the most frequently used guides and tools.',services:'Service guides',servicesBody:'Check engraving, service and brand information.',news:'BlueBlack news',newsBody:'See new arrivals, restocks and official channels.',staffTitle:'Fast consultation tools',staffBody:'Open the right screen quickly and reduce repeated explanations.',newCustomer:'Start a new Pen Buffet',newCustomerBody:'Clear the previous combination and start again',inkSearch:'Quick ink search',inkSearchBody:'Check color, brand and volume',brandMap:'Find a brand location',brandMapBody:'Open the floor and display area',asSearch:'Find a service center',asSearchBody:'Check contacts and addresses by brand',engraving:'Check engraving text',engravingBody:'Review fonts and supported characters',review:'Open review event',reviewBody:'Show the QR code and participation rules',recent:'Recently used',floorFact:'Building floors',floorFactBody:'The store uses B1, 2F and 4F. The tabs below identify guide maps.',mapHelp:'The map is fitted to your screen. Use zoom or large view for details.',combinationCode:'Combination code',copy:'Copy',copied:'Copied.',reviewCta:'Write a photo review',reviewReminder:'Show the completed review screen to a staff member.',updated:'Last updated',cached:'Showing the most recently saved data.',more:'More tools',asPrompt:'Search for a brand or choose a popular brand to show the relevant service center.',copyPhone:'Copy phone',copyAddress:'Copy address',copyGuide:'Copy customer guide',verified:'Verified',characters:'Characters',copyText:'Copy text',uppercaseWarning:'Consecutive capital letters are not available with the cursive font.',symbolWarning:'Some special characters may not be supported. Please confirm with staff.',retry3d:'Reload 3D',guideMap1:'Store guide map 1',guideMap2:'Store guide map 2'},
    ja:{customer:'お客様案内',staff:'スタッフ用ツール',useNow:'店頭ですぐに使う',useNowBody:'よく使う案内とツールをすぐに開けます。',services:'サービス案内',servicesBody:'名入れ・修理・ブランド情報を確認できます。',news:'BlueBlackのお知らせ',newsBody:'新商品、再入荷、公式チャンネルをご覧ください。',staffTitle:'店頭接客クイックツール',staffBody:'必要な画面をすぐに開き、繰り返しの説明を減らします。',newCustomer:'新しいペンビュッフェを開始',newCustomerBody:'前の組み合わせを消して最初から開始',inkSearch:'インク検索',inkSearchBody:'色・ブランド・容量を確認',brandMap:'ブランドの場所を探す',brandMapBody:'フロアと陳列場所を確認',asSearch:'修理受付先を探す',asSearchBody:'ブランド別の連絡先・住所',engraving:'名入れ文字を確認',engravingBody:'フォントと対応文字を確認',review:'レビューイベント',reviewBody:'QRと参加条件を表示',recent:'最近使ったツール',floorFact:'建物の階',floorFactBody:'B1・2階・4階を使用しています。下のタブは案内図の区分です。',mapHelp:'地図は画面に合わせて表示されます。拡大または大きく表示をご利用ください。',combinationCode:'組み合わせコード',copy:'コピー',copied:'コピーしました。',reviewCta:'写真レビューを書く',reviewReminder:'レビュー完了画面をスタッフにお見せください。',updated:'最終更新',cached:'保存された最新データを表示しています。',more:'その他のツール',asPrompt:'ブランドを検索するか、よく探すブランドを選択してください。',copyPhone:'電話番号をコピー',copyAddress:'住所をコピー',copyGuide:'お客様案内をコピー',verified:'情報確認日',characters:'文字数',copyText:'文字をコピー',uppercaseWarning:'筆記体では連続した大文字は使用できません。',symbolWarning:'一部の特殊文字は対応していない場合があります。スタッフにご確認ください。',retry3d:'3Dを再読み込み',guideMap1:'店舗案内図 1',guideMap2:'店舗案内図 2'},
    'zh-Hans':{customer:'顾客指南',staff:'店员快捷工具',useNow:'现在在店内使用',useNowBody:'快速打开最常用的指南和工具。',services:'服务指南',servicesBody:'查看刻字、售后和品牌信息。',news:'BlueBlack消息',newsBody:'查看新品、补货和官方频道。',staffTitle:'门店咨询快捷工具',staffBody:'快速打开所需页面，减少重复说明。',newCustomer:'开始新的钢笔配色',newCustomerBody:'清除之前的组合并重新开始',inkSearch:'快速搜索墨水',inkSearchBody:'查看颜色、品牌和容量',brandMap:'查找品牌位置',brandMapBody:'查看楼层和陈列区域',asSearch:'查找售后中心',asSearchBody:'查看各品牌联系方式和地址',engraving:'检查刻字内容',engravingBody:'查看字体和支持字符',review:'打开评价活动',reviewBody:'显示二维码和参与条件',recent:'最近使用',floorFact:'建筑楼层',floorFactBody:'门店使用地下一层、2层和4层。下方标签用于区分导览图。',mapHelp:'地图会适配屏幕。可使用缩放或大图查看细节。',combinationCode:'组合代码',copy:'复制',copied:'已复制。',reviewCta:'撰写图片评价',reviewReminder:'请向店员出示评价完成页面。',updated:'最后更新',cached:'正在显示最近保存的数据。',more:'更多工具',asPrompt:'搜索品牌或选择常用品牌，即可显示相应售后中心。',copyPhone:'复制电话',copyAddress:'复制地址',copyGuide:'复制顾客说明',verified:'信息确认日期',characters:'字符数',copyText:'复制文字',uppercaseWarning:'使用手写体时不能连续输入大写字母。',symbolWarning:'部分特殊字符可能不支持，请向店员确认。',retry3d:'重新加载3D',guideMap1:'门店导览图 1',guideMap2:'门店导览图 2'},
    'zh-Hant':{customer:'顧客指南',staff:'店員快捷工具',useNow:'現在於門市使用',useNowBody:'快速開啟最常用的指南與工具。',services:'服務指南',servicesBody:'查看刻字、售後與品牌資訊。',news:'BlueBlack消息',newsBody:'查看新品、補貨與官方頻道。',staffTitle:'門市諮詢快捷工具',staffBody:'快速開啟所需頁面，減少重複說明。',newCustomer:'開始新的鋼筆配色',newCustomerBody:'清除之前的組合並重新開始',inkSearch:'快速搜尋墨水',inkSearchBody:'查看顏色、品牌與容量',brandMap:'查找品牌位置',brandMapBody:'查看樓層與陳列區域',asSearch:'查找售後中心',asSearchBody:'查看各品牌聯絡方式與地址',engraving:'檢查刻字內容',engravingBody:'查看字體與支援字元',review:'開啟評論活動',reviewBody:'顯示QR碼與參加條件',recent:'最近使用',floorFact:'建築樓層',floorFactBody:'門市使用地下一樓、2樓與4樓。下方標籤用於區分導覽圖。',mapHelp:'地圖會配合螢幕顯示。可使用縮放或大圖查看細節。',combinationCode:'組合代碼',copy:'複製',copied:'已複製。',reviewCta:'撰寫圖片評論',reviewReminder:'請向店員出示評論完成頁面。',updated:'最後更新',cached:'正在顯示最近儲存的資料。',more:'更多工具',asPrompt:'搜尋品牌或選擇常用品牌，即可顯示相應售後中心。',copyPhone:'複製電話',copyAddress:'複製地址',copyGuide:'複製顧客說明',verified:'資訊確認日期',characters:'字元數',copyText:'複製文字',uppercaseWarning:'使用手寫體時不能連續輸入大寫字母。',symbolWarning:'部分特殊字元可能不支援，請向店員確認。',retry3d:'重新載入3D',guideMap1:'門市導覽圖 1',guideMap2:'門市導覽圖 2'},
    vi:{customer:'Hướng dẫn khách hàng',staff:'Công cụ nhanh cho nhân viên',useNow:'Sử dụng tại cửa hàng',useNowBody:'Mở nhanh các hướng dẫn và công cụ thường dùng.',services:'Hướng dẫn dịch vụ',servicesBody:'Kiểm tra khắc tên, bảo hành và thông tin thương hiệu.',news:'Tin BlueBlack',newsBody:'Xem sản phẩm mới, hàng về lại và kênh chính thức.',staffTitle:'Công cụ tư vấn nhanh',staffBody:'Mở ngay màn hình cần thiết và giảm giải thích lặp lại.',newCustomer:'Bắt đầu Pen Buffet mới',newCustomerBody:'Xóa tổ hợp trước và bắt đầu lại',inkSearch:'Tìm mực nhanh',inkSearchBody:'Kiểm tra màu, thương hiệu và dung tích',brandMap:'Tìm vị trí thương hiệu',brandMapBody:'Xem tầng và khu trưng bày',asSearch:'Tìm trung tâm dịch vụ',asSearchBody:'Xem liên hệ và địa chỉ theo thương hiệu',engraving:'Kiểm tra nội dung khắc',engravingBody:'Xem phông chữ và ký tự hỗ trợ',review:'Mở sự kiện đánh giá',reviewBody:'Hiển thị QR và điều kiện tham gia',recent:'Đã dùng gần đây',floorFact:'Tầng của tòa nhà',floorFactBody:'Cửa hàng sử dụng B1, tầng 2 và tầng 4. Các tab bên dưới phân biệt bản đồ hướng dẫn.',mapHelp:'Bản đồ được vừa với màn hình. Dùng phóng to hoặc xem lớn để xem chi tiết.',combinationCode:'Mã phối màu',copy:'Sao chép',copied:'Đã sao chép.',reviewCta:'Viết đánh giá có ảnh',reviewReminder:'Vui lòng cho nhân viên xem màn hình đã hoàn tất đánh giá.',updated:'Cập nhật lần cuối',cached:'Đang hiển thị dữ liệu đã lưu gần nhất.',more:'Thêm công cụ',asPrompt:'Tìm kiếm hoặc chọn thương hiệu phổ biến để xem trung tâm dịch vụ.',copyPhone:'Sao chép số điện thoại',copyAddress:'Sao chép địa chỉ',copyGuide:'Sao chép hướng dẫn',verified:'Ngày xác nhận',characters:'Số ký tự',copyText:'Sao chép nội dung',uppercaseWarning:'Không thể dùng nhiều chữ in hoa liên tiếp với phông chữ viết tay.',symbolWarning:'Một số ký tự đặc biệt có thể không được hỗ trợ. Vui lòng hỏi nhân viên.',retry3d:'Tải lại 3D',guideMap1:'Bản đồ cửa hàng 1',guideMap2:'Bản đồ cửa hàng 2'},
    id:{customer:'Panduan pelanggan',staff:'Alat cepat staf',useNow:'Gunakan di toko',useNowBody:'Buka panduan dan alat yang paling sering digunakan.',services:'Panduan layanan',servicesBody:'Periksa ukiran, servis, dan informasi merek.',news:'Berita BlueBlack',newsBody:'Lihat produk baru, stok kembali, dan kanal resmi.',staffTitle:'Alat konsultasi cepat',staffBody:'Buka layar yang diperlukan dan kurangi penjelasan berulang.',newCustomer:'Mulai Pen Buffet baru',newCustomerBody:'Hapus kombinasi sebelumnya dan mulai lagi',inkSearch:'Cari tinta cepat',inkSearchBody:'Periksa warna, merek, dan volume',brandMap:'Cari lokasi merek',brandMapBody:'Lihat lantai dan area pajangan',asSearch:'Cari pusat servis',asSearchBody:'Lihat kontak dan alamat per merek',engraving:'Periksa teks ukiran',engravingBody:'Lihat font dan karakter yang didukung',review:'Buka acara ulasan',reviewBody:'Tampilkan QR dan ketentuan',recent:'Baru digunakan',floorFact:'Lantai gedung',floorFactBody:'Toko menggunakan B1, lantai 2, dan lantai 4. Tab di bawah membedakan peta panduan.',mapHelp:'Peta disesuaikan dengan layar. Gunakan zoom atau tampilan besar untuk detail.',combinationCode:'Kode kombinasi',copy:'Salin',copied:'Tersalin.',reviewCta:'Tulis ulasan foto',reviewReminder:'Tunjukkan layar ulasan selesai kepada staf.',updated:'Terakhir diperbarui',cached:'Menampilkan data tersimpan terbaru.',more:'Alat lainnya',asPrompt:'Cari atau pilih merek populer untuk menampilkan pusat servis terkait.',copyPhone:'Salin telepon',copyAddress:'Salin alamat',copyGuide:'Salin panduan pelanggan',verified:'Tanggal verifikasi',characters:'Jumlah karakter',copyText:'Salin teks',uppercaseWarning:'Huruf kapital berurutan tidak tersedia untuk font kursif.',symbolWarning:'Beberapa karakter khusus mungkin tidak didukung. Konfirmasikan dengan staf.',retry3d:'Muat ulang 3D',guideMap1:'Peta toko 1',guideMap2:'Peta toko 2'},
    th:{customer:'คู่มือลูกค้า',staff:'เครื่องมือด่วนพนักงาน',useNow:'ใช้ในร้านตอนนี้',useNowBody:'เปิดคู่มือและเครื่องมือที่ใช้บ่อยได้ทันที',services:'คู่มือบริการ',servicesBody:'ตรวจสอบการสลัก บริการหลังการขาย และข้อมูลแบรนด์',news:'ข่าว BlueBlack',newsBody:'ดูสินค้าใหม่ สินค้าเข้าอีกครั้ง และช่องทางทางการ',staffTitle:'เครื่องมือช่วยให้คำปรึกษา',staffBody:'เปิดหน้าที่ต้องใช้ได้เร็วและลดการอธิบายซ้ำ',newCustomer:'เริ่ม Pen Buffet ใหม่',newCustomerBody:'ล้างชุดเดิมและเริ่มใหม่',inkSearch:'ค้นหาหมึกด่วน',inkSearchBody:'ตรวจสอบสี แบรนด์ และปริมาณ',brandMap:'ค้นหาตำแหน่งแบรนด์',brandMapBody:'ดูชั้นและพื้นที่จัดแสดง',asSearch:'ค้นหาศูนย์บริการ',asSearchBody:'ดูข้อมูลติดต่อและที่อยู่ตามแบรนด์',engraving:'ตรวจสอบข้อความสลัก',engravingBody:'ดูแบบอักษรและอักขระที่รองรับ',review:'เปิดกิจกรรมรีวิว',reviewBody:'แสดง QR และเงื่อนไข',recent:'ใช้ล่าสุด',floorFact:'ชั้นของอาคาร',floorFactBody:'ร้านใช้ชั้น B1 ชั้น 2 และชั้น 4 แท็บด้านล่างใช้แยกแผนที่',mapHelp:'แผนที่จะพอดีกับหน้าจอ ใช้ซูมหรือดูขนาดใหญ่เพื่อดูรายละเอียด',combinationCode:'รหัสชุดสี',copy:'คัดลอก',copied:'คัดลอกแล้ว',reviewCta:'เขียนรีวิวพร้อมรูป',reviewReminder:'โปรดแสดงหน้าจอรีวิวที่เสร็จแล้วให้พนักงานดู',updated:'อัปเดตล่าสุด',cached:'กำลังแสดงข้อมูลล่าสุดที่บันทึกไว้',more:'เครื่องมือเพิ่มเติม',asPrompt:'ค้นหาหรือเลือกแบรนด์ยอดนิยมเพื่อแสดงศูนย์บริการ',copyPhone:'คัดลอกเบอร์โทร',copyAddress:'คัดลอกที่อยู่',copyGuide:'คัดลอกคำแนะนำ',verified:'วันที่ตรวจสอบ',characters:'จำนวนตัวอักษร',copyText:'คัดลอกข้อความ',uppercaseWarning:'แบบอักษรลายมือไม่รองรับตัวพิมพ์ใหญ่ต่อเนื่อง',symbolWarning:'อักขระพิเศษบางตัวอาจไม่รองรับ โปรดสอบถามพนักงาน',retry3d:'โหลด 3D ใหม่',guideMap1:'แผนที่ร้าน 1',guideMap2:'แผนที่ร้าน 2'}
  };

  function normalize(value=''){
    const text=String(value).toLowerCase();
    if(text.includes('hant')||text.startsWith('zh-tw')||text.startsWith('zh-hk'))return'zh-Hant';
    if(text.startsWith('zh'))return'zh-Hans';
    if(text.startsWith('ja'))return'ja';
    if(text.startsWith('en'))return'en';
    if(text.startsWith('vi'))return'vi';
    if(text.startsWith('id'))return'id';
    if(text.startsWith('th'))return'th';
    return'ko';
  }
  function language(){return normalize(document.documentElement.lang||new URLSearchParams(location.search).get('lang')||'ko');}
  function t(key){return TEXT[language()]?.[key]??TEXT.en[key]??TEXT.ko[key]??key;}
  function ensureStyle(){
    if(document.querySelector('link[data-bb-global-ux]'))return;
    const link=document.createElement('link');
    link.rel='stylesheet';
    link.href=new URL(`./global-ux-v60.css?v=${GLOBAL_UX_VERSION}`,import.meta.url).href;
    link.dataset.bbGlobalUx='true';
    document.head.append(link);
  }
  async function copyText(value){
    const text=String(value||'').trim();
    if(!text)return false;
    try{await navigator.clipboard.writeText(text);return true;}catch{}
    const area=document.createElement('textarea');
    area.value=text;area.style.position='fixed';area.style.opacity='0';document.body.append(area);area.select();
    let ok=false;try{ok=document.execCommand('copy');}catch{}area.remove();return ok;
  }
  function routeHref(fragment){
    const base=location.pathname.includes('/blueblack-sailor-pen-buffet-preview/')?'/blueblack-sailor-pen-buffet-preview/':'../';
    const url=new URL(fragment,base.startsWith('/')?location.origin+base:location.href);
    url.searchParams.set('lang',language());
    return url.href;
  }
  function clearPenSession(){
    try{
      Object.keys(localStorage).filter(key=>key.startsWith('blueblack-pen')||key.includes('combination')).forEach(key=>localStorage.removeItem(key));
    }catch{}
  }
  function cardByFragment(cards,fragment){return cards.find(card=>card.getAttribute('href')?.includes(fragment));}
  function homeGroup(kicker,title,body,cards,className=''){
    const section=document.createElement('section');
    section.className=`bb-home-group ${className}`.trim();
    section.innerHTML=`<div class="bb-home-group-head"><div><small>${kicker}</small><h2>${title}</h2></div><p>${body}</p></div><div class="tool-grid"></div>`;
    const grid=section.querySelector('.tool-grid');cards.filter(Boolean).forEach(card=>grid.append(card));
    return section;
  }
  function staffLink({href,title,body,primary=false,action=''}){
    const a=document.createElement('a');
    a.className=`bb-staff-link${primary?' is-primary':''}`;
    a.href=href;a.dataset.bbRecentTitle=title;if(action)a.dataset.bbAction=action;
    a.innerHTML=`<strong>${title}</strong><span>${body}</span>`;
    return a;
  }
  function recentTools(container){
    let items=[];try{items=JSON.parse(localStorage.getItem('bb-recent-tools-v60')||'[]');}catch{}
    const wrap=document.createElement('div');wrap.className='bb-recent-tools';wrap.innerHTML=`<strong>${t('recent')}</strong><div class="bb-recent-list"></div>`;
    const list=wrap.querySelector('.bb-recent-list');
    items.slice(0,4).forEach(item=>{const a=document.createElement('a');a.href=item.href;a.textContent=item.title;list.append(a);});
    if(!items.length)wrap.hidden=true;container.append(wrap);
  }
  function trackRecent(event){
    const link=event.target.closest('a.tool-card,a.bb-staff-link');if(!link||link.dataset.bbAction==='new-pen')return;
    const title=link.dataset.bbRecentTitle||link.querySelector('h3,strong')?.textContent?.trim();if(!title)return;
    let items=[];try{items=JSON.parse(localStorage.getItem('bb-recent-tools-v60')||'[]');}catch{}
    const href=link.href;items=[{title,href},...items.filter(item=>item.href!==href)].slice(0,4);
    try{localStorage.setItem('bb-recent-tools-v60',JSON.stringify(items));}catch{}
  }
  function enhanceHome(){
    const main=document.querySelector('.portal-main');
    const grid=main?.querySelector('.tool-grid');
    if(!main||!grid||main.dataset.bbHomeEnhanced)return;
    main.dataset.bbHomeEnhanced='true';
    const original=grid.closest('section');
    const cards=[...grid.querySelectorAll('.tool-card')];
    const primary=[cardByFragment(cards,'pen-buffet'),cardByFragment(cards,'ink-price'),cardByFragment(cards,'store-guide'),cardByFragment(cards,'review-event')];
    const services=[cardByFragment(cards,'engraving-guide'),cardByFragment(cards,'as-guide'),cardByFragment(cards,'official-guide')];
    const news=[cardByFragment(cards,'news')];
    const mode=document.createElement('div');mode.className='bb-home-mode';mode.setAttribute('role','tablist');
    mode.innerHTML=`<button type="button" role="tab" aria-selected="true" data-bb-home-mode="customer">${t('customer')}</button><button type="button" role="tab" aria-selected="false" data-bb-home-mode="staff">${t('staff')}</button>`;
    const customer=document.createElement('div');customer.className='bb-home-panel';customer.dataset.bbHomePanel='customer';
    customer.append(homeGroup('QUICK START',t('useNow'),t('useNowBody'),primary,'bb-home-group-primary'));
    customer.append(homeGroup('SERVICES',t('services'),t('servicesBody'),services));
    customer.append(homeGroup('NEWS & CHANNELS',t('news'),t('newsBody'),news));
    const staff=document.createElement('div');staff.className='bb-home-panel bb-staff-panel';staff.dataset.bbHomePanel='staff';staff.hidden=true;
    staff.innerHTML=`<div class="bb-staff-intro"><div><h2>${t('staffTitle')}</h2><p>${t('staffBody')}</p></div></div><div class="bb-staff-grid"></div>`;
    const staffGrid=staff.querySelector('.bb-staff-grid');
    staffGrid.append(
      staffLink({href:routeHref('pen-buffet/?reset=1'),title:t('newCustomer'),body:t('newCustomerBody'),primary:true,action:'new-pen'}),
      staffLink({href:routeHref('ink-price/'),title:t('inkSearch'),body:t('inkSearchBody')}),
      staffLink({href:routeHref('store-guide/#floor-guide'),title:t('brandMap'),body:t('brandMapBody')}),
      staffLink({href:routeHref('as-guide/#as-finder'),title:t('asSearch'),body:t('asSearchBody')}),
      staffLink({href:routeHref('engraving-guide/#font-guide'),title:t('engraving'),body:t('engravingBody')}),
      staffLink({href:routeHref('review-event/'),title:t('review'),body:t('reviewBody')})
    );
    recentTools(staff);
    original.replaceWith(mode,customer,staff);
    mode.addEventListener('click',event=>{
      const button=event.target.closest('[data-bb-home-mode]');if(!button)return;
      const value=button.dataset.bbHomeMode;
      mode.querySelectorAll('button').forEach(node=>node.setAttribute('aria-selected',String(node===button)));
      customer.hidden=value!=='customer';staff.hidden=value!=='staff';
      try{localStorage.setItem('bb-home-mode-v60',value);}catch{}
    });
    const saved=(()=>{try{return localStorage.getItem('bb-home-mode-v60');}catch{return'';}})();
    if(saved==='staff')mode.querySelector('[data-bb-home-mode="staff"]')?.click();
    staff.addEventListener('click',event=>{const action=event.target.closest('[data-bb-action]')?.dataset.bbAction;if(action==='new-pen')clearPenSession();});
    document.addEventListener('click',trackRecent,{capture:true});
  }
  function enhanceStore(){
    if(!location.pathname.includes('/store-guide/'))return;
    const floorCard=document.querySelector('#floor-guide');const interactive=document.querySelector('#store-map');
    if(!floorCard||floorCard.dataset.bbUnified)return;
    floorCard.dataset.bbUnified='true';floorCard.classList.add('bb-unified-floor-card');
    const heading=floorCard.querySelector('.merged-floor-heading');
    const fact=document.createElement('div');fact.className='bb-floor-facts';fact.innerHTML=`<strong>${t('floorFact')}</strong><span>${t('floorFactBody')}</span>`;heading?.after(fact);
    const tabs=[...floorCard.querySelectorAll('[data-merged-floor]')];
    tabs[0]?.querySelector('small')?.replaceChildren('GUIDE MAP 01');tabs[0]?.querySelector('strong')?.replaceChildren(t('guideMap1'));
    tabs[1]?.querySelector('small')?.replaceChildren('GUIDE MAP 02');tabs[1]?.querySelector('strong')?.replaceChildren(t('guideMap2'));
    const panel2=floorCard.querySelector('[data-merged-panel="2"]');
    if(panel2&&interactive){panel2.replaceChildren(interactive);interactive.classList.add('bb-embedded-map-card');}
    const help=document.createElement('p');help.className='bb-map-mobile-help';help.textContent=t('mapHelp');floorCard.append(help);
    tabs.forEach(tab=>tab.addEventListener('click',()=>{const url=new URL(location.href);url.searchParams.set('floor',tab.dataset.mergedFloor);history.replaceState(null,'',url);}));
  }
  function enhancePen(){
    if(!location.pathname.includes('/pen-buffet/'))return;
    document.body.classList.add('bb-page-pen');
    const mount=document.querySelector('.selected-bar')||document.querySelector('.control-card');if(!mount||document.querySelector('.bb-combination-code'))return;
    const box=document.createElement('div');box.className='bb-combination-code';box.innerHTML=`<div><small>${t('combinationCode')}</small><code>BB-SAILOR</code></div><button type="button">${t('copy')}</button><span class="bb-combination-code-status" aria-live="polite"></span>`;
    mount.after(box);
    let currentCode='BB-SAILOR';
    function updateCode(){
      const combination=window.blueblackPenApp?.getCombination?.();if(!Array.isArray(combination))return;
      currentCode=`BB-SAILOR-${combination.map(item=>item.color?.code||String(item.color?.id||'').slice(0,2).toUpperCase()).join('-')}`;
      box.querySelector('code').textContent=currentCode;
      const url=new URL(location.href);const detail=window.blueblackPenApp?.selections||{};
      const aliases={cap_end:'cap_top',nib_grip:'grip_section',metal_parts:'center_ring_or_connector'};
      Object.entries(aliases).forEach(([legacy,canonical])=>{if(detail[legacy])url.searchParams.set(canonical,detail[legacy]);});
      history.replaceState(null,'',url);
    }
    box.querySelector('button').addEventListener('click',async()=>{if(await copyText(currentCode)){const status=box.querySelector('.bb-combination-code-status');status.textContent=t('copied');setTimeout(()=>status.textContent='',1800);}});
    addEventListener('combinationchange',updateCode);addEventListener('partchange',event=>{if(event.detail?.partId==='barrel_end')document.body.classList.add('bb-share-ready');});
    const result=document.querySelector('#result-section');if(result&&'IntersectionObserver'in window)new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting))document.body.classList.add('bb-share-ready');},{threshold:.08}).observe(result);
    const error=document.querySelector('#viewer-error');if(error&&!error.querySelector('button')){const retry=document.createElement('button');retry.type='button';retry.textContent=t('retry3d');retry.addEventListener('click',()=>location.reload());error.append(document.createElement('br'),retry);}
    if(new URLSearchParams(location.search).get('reset')==='1'){
      let tries=0;const timer=setInterval(()=>{tries++;if(window.blueblackPenApp?.resetCombination){window.blueblackPenApp.resetCombination();const url=new URL(location.href);url.searchParams.delete('reset');history.replaceState(null,'',url);clearInterval(timer);}else if(tries>30)clearInterval(timer);},100);
    }
    setTimeout(updateCode,100);setTimeout(updateCode,700);
  }
  function enhanceReview(){
    if(!location.pathname.includes('/review-event/'))return;
    document.body.classList.add('bb-page-review');
    const link=document.querySelector('[data-review-link]')?.href;if(link&&!document.querySelector('.bb-review-mobile-cta')){const a=document.createElement('a');a.className='bb-review-mobile-cta';a.href=link;a.target='_blank';a.rel='noopener';a.textContent=t('reviewCta');document.body.append(a);}
    const guide=document.querySelector('.review-guide');if(guide&&!document.querySelector('.bb-review-reminder')){const reminder=document.createElement('div');reminder.className='bb-review-reminder';reminder.textContent=t('reviewReminder');guide.after(reminder);}
  }
  function enhanceNews(){
    if(!location.pathname.includes('/news/'))return;
    document.body.classList.add('bb-page-news');
    const shell=document.querySelector('[data-instagram-shell]');if(!shell||document.querySelector('.bb-news-updated'))return;
    const status=document.createElement('div');status.className='bb-news-updated';status.innerHTML=`<span><strong>${t('updated')}</strong> · <span data-bb-news-time>—</span></span><span data-bb-news-note></span>`;shell.before(status);
    addEventListener('bbnewsupdated',event=>{const date=event.detail?.updatedAt?new Date(event.detail.updatedAt):null;status.querySelector('[data-bb-news-time]').textContent=date&&!Number.isNaN(date.getTime())?new Intl.DateTimeFormat(document.documentElement.lang||'ko',{year:'numeric',month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}).format(date):'—';status.querySelector('[data-bb-news-note]').textContent=event.detail?.cached?t('cached'):'';status.classList.toggle('is-stale',Boolean(event.detail?.cached));});
  }
  function enhanceInk(){
    if(!location.pathname.includes('/ink-price/'))return;
    document.body.classList.add('bb-page-ink');
    const tools=document.querySelector('.ink-tools');if(!tools||tools.dataset.bbCompact)return;tools.dataset.bbCompact='true';
    const secondary=['.ink-zoom-out','.ink-zoom-in','.ink-zoom-reset','.ink-share-page'].map(selector=>tools.querySelector(selector)).filter(Boolean);
    if(!secondary.length)return;
    const details=document.createElement('details');details.className='bb-ink-more';details.innerHTML=`<summary>${t('more')}</summary><div class="bb-ink-more-panel"></div>`;secondary.forEach(node=>details.querySelector('.bb-ink-more-panel').append(node));tools.append(details);
  }
  function extractCardText(card){
    const phone=card.querySelector('a[href^="tel:"]')?.textContent?.trim()||'';
    const address=[...card.querySelectorAll('.as-center-meta strong')].map(node=>node.textContent.trim()).find(text=>text.length>15)||'';
    const brands=[...card.querySelectorAll('.as-brand-list span')].map(node=>node.textContent.trim()).join(', ');
    const center=card.querySelector('h3')?.textContent?.trim()||'';
    return{phone,address,brands,center};
  }
  function enhanceAs(){
    if(!location.pathname.includes('/as-guide/'))return;
    const shell=document.body;const search=document.querySelector('#asBrandSearch');if(!search||shell.dataset.bbAsEnhanced)return;shell.dataset.bbAsEnhanced='true';shell.classList.add('bb-as-awaiting-search');
    const prompt=document.createElement('div');prompt.className='bb-as-search-prompt';prompt.textContent=t('asPrompt');document.querySelector('#asResultSummary')?.after(prompt);
    const source=document.querySelector('.as-source-card');if(source&&!source.querySelector('.bb-verified-date')){const badge=document.createElement('span');badge.className='bb-verified-date';badge.textContent=`${t('verified')} · 2026-07-01`;source.append(badge);}
    const sync=()=>shell.classList.toggle('bb-as-awaiting-search',!search.value.trim());search.addEventListener('input',sync);document.querySelector('#asBrandClear')?.addEventListener('click',()=>setTimeout(sync,0));document.querySelectorAll('[data-as-quick]').forEach(button=>button.addEventListener('click',()=>setTimeout(sync,20)));
    document.querySelectorAll('.as-center-card').forEach(card=>{if(card.querySelector('.bb-copy-actions'))return;const data=extractCardText(card);const actions=document.createElement('div');actions.className='bb-copy-actions';
      const make=(label,value)=>{const button=document.createElement('button');button.type='button';button.textContent=label;button.addEventListener('click',async()=>{if(await copyText(value)){button.textContent=t('copied');setTimeout(()=>button.textContent=label,1500);}});return button;};
      if(data.phone)actions.append(make(t('copyPhone'),data.phone));if(data.address)actions.append(make(t('copyAddress'),data.address));actions.append(make(t('copyGuide'),`${data.brands}\n${data.center}\n${data.phone}\n${data.address}`));card.append(actions);
    });
  }
  function enhanceEngraving(){
    if(!location.pathname.includes('/engraving-guide/'))return;
    const input=document.querySelector('#engravingPreviewText');if(!input||document.querySelector('.bb-engraving-meta'))return;
    const meta=document.createElement('div');meta.className='bb-engraving-meta';meta.innerHTML=`<span><span data-bb-char-count>0</span> / ${input.maxLength||40} ${t('characters')}</span><button type="button" class="bb-engraving-copy">${t('copyText')}</button>`;
    const warning=document.createElement('div');warning.className='bb-engraving-warning';warning.setAttribute('aria-live','polite');input.parentElement.append(meta,warning);
    const update=()=>{const value=input.value;meta.querySelector('[data-bb-char-count]').textContent=String([...value].length);const warnings=[];if(/[A-Z]{2,}/.test(value))warnings.push(t('uppercaseWarning'));if(/[^\p{Script=Hangul}\p{Script=Han}A-Za-z0-9 .,&'()\-]/u.test(value))warnings.push(t('symbolWarning'));warning.textContent=warnings.join(' ');};
    input.addEventListener('input',update);meta.querySelector('button').addEventListener('click',async event=>{if(await copyText(input.value)){const original=t('copyText');event.currentTarget.textContent=t('copied');setTimeout(()=>event.currentTarget.textContent=original,1500);}});update();
  }
  function init(){
    ensureStyle();
    enhanceHome();enhanceStore();enhancePen();enhanceReview();enhanceNews();enhanceInk();enhanceAs();enhanceEngraving();
  }
  ensureStyle();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
}
