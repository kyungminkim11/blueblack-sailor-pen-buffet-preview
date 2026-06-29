const shop = (path) => `https://blueblack.co.kr${path}`;

function sampleColor({
  id,
  brandKo,
  brandEn,
  form = 'bottle',
  volume = '50ml',
  nameKo,
  nameEn,
  hex,
  productTitle,
  productUrl
}) {
  return {
    id,
    brandKo,
    brandEn,
    form,
    volume,
    nameKo,
    nameEn,
    nameJa: nameEn || nameKo,
    nameZhHans: nameKo,
    nameZhHant: nameKo,
    hex,
    productTitle,
    productUrl
  };
}

const pilotIroshizuku = [
  ['take-sumi', '죽탄 Take sumi', 'Take sumi', '#242424', '/product/파이롯트-이로시주쿠-병-잉크-죽탄-take-sumi/1028/category/193/display/1/'],
  ['fuyu-gaki', '겨울감 Fuyu gaki', 'Fuyu gaki', '#d3612e', '/product/파이롯트-이로시주쿠-병-잉크-겨울감-fuyu-gaki/1029/category/193/display/1/'],
  ['syo-ro', '송로 Syo ro', 'Syo ro', '#2f5f5b', '/product/파이롯트-이로시주쿠-병-잉크-송로-syo-ro/1025/category/193/display/1/'],
  ['yama-budo', '산머루 Yama budo', 'Yama budo', '#8a315d', '/product/파이롯트-이로시주쿠-병-잉크-산머루-yama-budo/1035/category/193/display/1/'],
  ['murasaki-shikibu', '작살나무열매 Murasaki shikibu', 'Murasaki shikibu', '#68448a', '/product/파이롯트-이로시주쿠-병-잉크-작살나무열매-murasaki-shikibu/1037/category/193/display/1/'],
  ['momiji', '단풍 Momiji', 'Momiji', '#b73543', '/product/파이롯트-이로시주쿠-병-잉크-단풍-momiji/1038/category/193/display/1/'],
  ['asa-gao', '나팔꽃 Asa gao', 'Asa gao', '#28519a', '/product/파이롯트-이로시주쿠-병-잉크-나팔꽃-asa-gao/1017/category/193/display/1/'],
  ['kosumosu', '코스모스 Kosumosu', 'Kosumosu', '#c75a88', '/product/파이롯트-이로시주쿠-병-잉크-코스모스-kosumosu/1031/category/193/display/1/'],
  ['ama-iro', '맑은하늘 Ama iro', 'Ama iro', '#4aa7d8', '/product/파이롯트-이로시주쿠-병-잉크-맑은하늘-ama-iro/1021/category/193/display/1/'],
  ['tsukiyo', '월야 Tsukiyo', 'Tsukiyo', '#26516a', '/product/파이롯트-이로시주쿠-병-잉크-월야-tsukiyo/2066/category/555/display/1/'],
  ['shinkai', '깊은바다 Shinkai', 'Shinkai', '#27394f', '/product/파이롯트-이로시주쿠-병-잉크-깊은바다-shinkai/1022/category/193/display/1/'],
  ['aji-sai', '수국 Aji sai', 'Aji sai', '#5968af', '/product/파이롯트-이로시주쿠-병-잉크-수국-aji-sai/1018/category/193/display/1/'],
  ['ku-jaku', '공작 Ku jaku', 'Ku jaku', '#007c7d', '/product/파이롯트-이로시주쿠-병-잉크-공작-ku-jaku/1023/category/193/display/1/'],
  ['shin-ryoku', '심록 Shin ryoku', 'Shin ryoku', '#216947', '/product/파이롯트-이로시주쿠-병-잉크-심록-shin-ryoku/1024/category/193/display/1/'],
  ['chiku-rin', '죽림 Chiku rin', 'Chiku rin', '#7d9b47', '/product/파이롯트-이로시주쿠-병-잉크-죽림-chiku-rin/1026/category/193/display/1/'],
  ['yuyake', '저녁노을 Yuyake', 'Yuyake', '#d56f31', '/product/파이롯트-이로시주쿠-병-잉크-저녁노을-yuyake/1034/category/193/display/1/'],
  ['kon-peki', '감청 Kon peki', 'Kon peki', '#136ca8', '/product/파이롯트-이로시주쿠-병-잉크-감청-kon-peki/1020/category/193/display/1/'],
  ['fuyu-syogun', '동장군 Fuyu syogun', 'Fuyu syogun', '#6f7e88', '/product/파이롯트-이로시주쿠-병-잉크-동장군-fuyu-syogun/1027/category/193/display/1/'],
  ['yama-guri', '산밤 Yama guri', 'Yama guri', '#5d463c', '/product/파이롯트-이로시주쿠-병-잉크-산밤-yama-guri/1036/category/193/display/1/']
].map(([slug, nameKo, nameEn, hex, path]) => sampleColor({
  id: `pilot-iroshizuku-${slug}`,
  brandKo: '파이롯트',
  brandEn: 'Pilot',
  nameKo,
  nameEn,
  hex,
  productTitle: `파이롯트 이로시주쿠 병 잉크 ${nameKo}`,
  productUrl: shop(path)
}));

const sailorManyo = [
  ['yomogi', '요모기 Yomogi', 'Yomogi', '#2f6f63', '/product/세일러-만요-병잉크-요모기-yomogi/2269/category/193/display/1/'],
  ['kikyou', '키쿄우 Kikyou', 'Kikyou', '#374279', '/product/세일러-만요-병잉크-키쿄우-kikyou/2271/category/555/display/1/'],
  ['sumire', '스미레 Sumire', 'Sumire', '#355a9b', '/product/세일러-만요-병잉크-스미레-sumire/2270/category/193/display/1/'],
  ['yamabuki', '야마부키 Yamabuki', 'Yamabuki', '#d6a637', '/product/세일러-만요-병잉크-야마부키-yamabuki/2288/category/193/display/1/'],
  ['kuzu', '쿠주 Kuzu', 'Kuzu', '#77496b', '/product/세일러-만요-병잉크-쿠주-kuzu/2266/category/193/display/1/'],
  ['nadeshiko', '나데시코', 'Nadeshiko', '#7c7dac', '/product/세일러-만요-병잉크-나데시코/3317/category/203/display/1/'],
  ['ume', '우메', 'Ume', '#b44b58', '/product/세일러-만요-병잉크-우메/3318/category/203/display/1/'],
  ['sakura', '사쿠라', 'Sakura', '#c87e91', '/product/세일러-만요-병잉크-사쿠라/3319/category/203/display/1/'],
  ['akebi', '아케비 Akebi', 'Akebi', '#6b3c84', '/product/세일러-만요-병잉크-아케비-akebi/2267/category/193/display/1/'],
  ['nekoyanagi', '네코야나기 Nekoyanagi', 'Nekoyanagi', '#8f86a9', '/product/세일러-만요-병잉크-네코야나기-nekoyanagi/2268/category/193/display/1/'],
  ['chigaya', '치가야', 'Chigaya', '#9a6f5a', '/product/세일러-만요-병잉크-치가야/3313/category/203/display/1/'],
  ['haha', '하하 Haha', 'Haha', '#8fb8ba', '/product/세일러-만요-병잉크-하하-haha/2272/category/193/display/1/'],
  ['kakitsubata', '카키추바타', 'Kakitsubata', '#4b5e86', '/product/세일러-만요-병잉크-카키추바타/3315/category/203/display/1/']
].map(([slug, nameKo, nameEn, hex, path]) => sampleColor({
  id: `sailor-manyo-${slug}`,
  brandKo: '세일러',
  brandEn: 'Sailor',
  nameKo,
  nameEn,
  hex,
  productTitle: `세일러 만요 병잉크 ${nameKo}`,
  productUrl: shop(path)
}));

export const INK_SAMPLE_COLORS = [
  ...pilotIroshizuku,
  ...sailorManyo
];
