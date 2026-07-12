const newsPortalCopy={
  ko:{kicker:'LATEST FROM BLUEBLACK',title:'블루블랙 최신 소식',body:'신제품, 재입고와 제품 소개를 블루블랙 공식 인스타그램에서 확인하세요.'},
  en:{kicker:'LATEST FROM BLUEBLACK',title:'BlueBlack News',body:'See new arrivals, restocks and product highlights on BlueBlack’s official Instagram.'},
  ja:{kicker:'LATEST FROM BLUEBLACK',title:'BlueBlack 最新情報',body:'新商品、再入荷、商品紹介をBlueBlack公式Instagramでご確認ください。'},
  'zh-Hans':{kicker:'LATEST FROM BLUEBLACK',title:'BlueBlack 最新消息',body:'在BlueBlack官方Instagram查看新品、补货和产品介绍。'},
  'zh-Hant':{kicker:'LATEST FROM BLUEBLACK',title:'BlueBlack 最新消息',body:'在BlueBlack官方Instagram查看新品、補貨與產品介紹。'},
  vi:{kicker:'LATEST FROM BLUEBLACK',title:'Tin mới BlueBlack',body:'Xem sản phẩm mới, hàng về lại và nội dung giới thiệu sản phẩm trên Instagram chính thức của BlueBlack.'},
  id:{kicker:'LATEST FROM BLUEBLACK',title:'Berita BlueBlack',body:'Lihat produk baru, stok masuk kembali, dan sorotan produk di Instagram resmi BlueBlack.'},
  th:{kicker:'LATEST FROM BLUEBLACK',title:'ข่าวล่าสุดจาก BlueBlack',body:'ดูสินค้าใหม่ สินค้าที่กลับเข้าสต็อก และข้อมูลแนะนำสินค้าบน Instagram อย่างเป็นทางการของ BlueBlack'}
};
function newsPortalLanguage(){const value=(new URLSearchParams(location.search).get('lang')||localStorage.getItem('blueblack-language')||navigator.language||'ko').toLowerCase();if(value.includes('hant')||value.startsWith('zh-tw')||value.startsWith('zh-hk'))return'zh-Hant';if(value.startsWith('zh'))return'zh-Hans';if(value.startsWith('vi'))return'vi';if(value.startsWith('id'))return'id';if(value.startsWith('th'))return'th';if(value.startsWith('ja'))return'ja';if(value.startsWith('en'))return'en';return'ko';}
function applyNewsPortalCopy(){const lang=newsPortalLanguage();const text=newsPortalCopy[lang]||newsPortalCopy.ko;const card=document.querySelector('[data-news-portal-card]');if(!card)return;card.href=`./news/?lang=${encodeURIComponent(lang)}`;const kicker=card.querySelector('[data-news-portal-kicker]');const title=card.querySelector('[data-news-portal-title]');const body=card.querySelector('[data-news-portal-body]');if(kicker)kicker.textContent=text.kicker;if(title)title.textContent=text.title;if(body)body.textContent=text.body;}
document.querySelectorAll('[data-portal-lang]').forEach(button=>button.addEventListener('click',()=>setTimeout(applyNewsPortalCopy,0)));
applyNewsPortalCopy();