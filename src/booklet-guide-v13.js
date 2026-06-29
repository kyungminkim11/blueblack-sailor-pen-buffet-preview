import { getLanguage } from './i18n-v3.js';

const COPY = {
  ko: {
    kicker: 'IN-STORE GUIDE',
    title: '매장 책자 안내',
    intro: '매장에 비치된 펜뷔페 책자의 핵심 정보를 웹에서 보기 쉽게 정리했습니다.',
    source: '매장 비치 책자 기준',
    processEyebrow: 'HOW TO USE A PEN BUFFET',
    processTitle: '펜뷔페 이용 순서',
    processIntro: '파츠는 고객님이 직접 고르고, 조립과 최종 확인은 매장 직원이 진행합니다.',
    steps: [
      ['도구 준비', '매장에 비치된 그릇과 핀셋을 한 개씩 챙겨주세요. 도구가 부족하면 직원을 불러주세요.'],
      ['만년필 파츠 고르기', '캡앤드, 캡, 메탈 파츠, 닙, 배럴앤드, 배럴을 취향에 맞게 골라주세요.'],
      ['만년필 조립', '파츠를 모두 고른 뒤 직원에게 조립을 요청해 주세요. 대기가 발생하면 순서대로 안내드립니다.'],
      ['확인 및 포장', '조립이 완료되면 직원과 제품을 함께 확인합니다. 이후 보증서 작성과 포장이 진행됩니다.'],
    ],
    ruleTitle: '선택 전 확인',
    rule: '메탈 파츠와 닙의 금속 색상은 동일하게 선택해야 합니다.',
    priceEyebrow: 'MAIN DISH · SIDE DISH',
    priceTitle: '구성별 가격 안내',
    priceIntro: '완성 만년필 본품과 섹션별 구성을 확인해 보세요.',
    prices: [
      ['MAIN DISH', '완성 만년필 본품', '내 취향에 맞는 조합으로 완성하는 펜뷔페 본품', '58,000원'],
      ['SIDE DISH', '캡 섹션', '캡앤드 · 캡 · 파츠 구성', '31,000원'],
      ['SIDE DISH', '배럴 섹션', '배럴앤드 · 배럴 구성', '11,000원'],
      ['SIDE DISH', '닙 섹션', '닙 · 그립 구성', '28,000원'],
    ],
    beverageEyebrow: 'BEVERAGE',
    beverageTitle: '음료 시리즈 병잉크',
    beverageIntro: '완성한 만년필과 어울리는 음료 콘셉트의 잉크 색상을 함께 골라보세요.',
    beverageName: '[BB Limited] 음료 시리즈 병잉크',
    beveragePrice: '30,400원',
    inkLabel: '16가지 음료 컬러',
    inks: ['블루 하와이안', '스트로베리 밀크쉐이크', '말차라떼', '쿠키앤크림 프라페', '미숫가루', '피스타치오 쉐이크', '라벤더 밀크', '더블초코 스무디', '레몬 아이스티', '애플주스', '체리콕', '블루 멜로우티', '요구르트', '메론 소다', '하이볼', '에너지 드링크'],
    disclaimer: '표시 가격과 구성은 매장 비치 책자 기준입니다. 재고와 판매 조건은 변경될 수 있으므로 결제 전 직원에게 확인해 주세요.',
  },
  en: {
    kicker: 'IN-STORE GUIDE',
    title: 'Pen Buffet store guide',
    intro: 'The key information from the in-store booklet, reorganized for quick reference on this page.',
    source: 'Based on the in-store booklet',
    processEyebrow: 'HOW TO USE A PEN BUFFET',
    processTitle: 'How the Pen Buffet works',
    processIntro: 'You choose the parts, and a store staff member handles assembly and the final check.',
    steps: [
      ['Prepare the tools', 'Take one bowl and one pair of tweezers provided in the store. Ask a staff member if more tools are needed.'],
      ['Choose the parts', 'Choose a cap end, cap, metal parts, nib, barrel end and barrel to suit your taste.'],
      ['Ask for assembly', 'After choosing all parts, ask a staff member to assemble the pen. Customers are assisted in order if there is a queue.'],
      ['Check and pack', 'Review the assembled pen with a staff member. The warranty card is then completed and the pen is packed.'],
    ],
    ruleTitle: 'Before choosing',
    rule: 'The metal parts and the nib must be selected in the same metal color.',
    priceEyebrow: 'MAIN DISH · SIDE DISH',
    priceTitle: 'Configuration and price guide',
    priceIntro: 'Review the complete pen and the individual section configurations.',
    prices: [
      ['MAIN DISH', 'Complete fountain pen', 'A complete Pen Buffet fountain pen made in your preferred combination', '₩58,000'],
      ['SIDE DISH', 'Cap section', 'Cap end · cap · related parts', '₩31,000'],
      ['SIDE DISH', 'Barrel section', 'Barrel end · barrel', '₩11,000'],
      ['SIDE DISH', 'Nib section', 'Nib · grip section', '₩28,000'],
    ],
    beverageEyebrow: 'BEVERAGE',
    beverageTitle: 'Beverage Series bottled inks',
    beverageIntro: 'Pair your finished pen with an ink inspired by a favorite drink.',
    beverageName: '[BB Limited] Beverage Series bottled ink',
    beveragePrice: '₩30,400',
    inkLabel: '16 beverage-inspired colors',
    inks: ['Blue Hawaiian', 'Strawberry Milkshake', 'Matcha Latte', 'Cookies & Cream Frappe', 'Misutgaru', 'Pistachio Shake', 'Lavender Milk', 'Double Chocolate Smoothie', 'Lemon Iced Tea', 'Apple Juice', 'Cherry Coke', 'Blue Mallow Tea', 'Yogurt', 'Melon Soda', 'Highball', 'Energy Drink'],
    disclaimer: 'Prices and configurations are based on the booklet currently available in store. Stock and sales conditions may change, so please confirm with a staff member before purchase.',
  },
  ja: {
    kicker: 'IN-STORE GUIDE',
    title: '店頭パンフレット案内',
    intro: '店頭に設置されているペンビュッフェの案内を、ウェブで見やすくまとめました。',
    source: '店頭パンフレット基準',
    processEyebrow: 'HOW TO USE A PEN BUFFET',
    processTitle: 'ペンビュッフェのご利用手順',
    processIntro: 'パーツはお客様が選び、組み立てと最終確認はスタッフが行います。',
    steps: [
      ['道具を準備', '店頭にあるトレーとピンセットを1つずつお取りください。不足している場合はスタッフにお声がけください。'],
      ['パーツを選ぶ', 'キャップエンド、キャップ、金属パーツ、ペン先、胴軸エンド、胴軸をお好みでお選びください。'],
      ['組み立てを依頼', 'すべてのパーツを選んだら、スタッフに組み立てをご依頼ください。混雑時は順番にご案内します。'],
      ['確認と包装', '組み立て後、スタッフと一緒に製品を確認します。その後、保証書の記入と包装を行います。'],
    ],
    ruleTitle: '選択前のご確認',
    rule: '金属パーツとペン先は、同じ金属色を選ぶ必要があります。',
    priceEyebrow: 'MAIN DISH · SIDE DISH',
    priceTitle: '構成別価格案内',
    priceIntro: '完成品と各セクションの構成をご確認ください。',
    prices: [
      ['MAIN DISH', '完成万年筆', 'お好みの組み合わせで仕上げるペンビュッフェ本体', '58,000ウォン'],
      ['SIDE DISH', 'キャップセクション', 'キャップエンド・キャップ・関連パーツ', '31,000ウォン'],
      ['SIDE DISH', '胴軸セクション', '胴軸エンド・胴軸', '11,000ウォン'],
      ['SIDE DISH', 'ペン先セクション', 'ペン先・グリップ', '28,000ウォン'],
    ],
    beverageEyebrow: 'BEVERAGE',
    beverageTitle: 'ドリンクシリーズ ボトルインク',
    beverageIntro: '完成した万年筆に合う、ドリンクをテーマにしたインクもお選びいただけます。',
    beverageName: '[BB Limited] ドリンクシリーズ ボトルインク',
    beveragePrice: '30,400ウォン',
    inkLabel: '16種類のドリンクカラー',
    inks: ['ブルーハワイアン', 'ストロベリーミルクシェイク', '抹茶ラテ', 'クッキー＆クリームフラッペ', 'ミスッカル', 'ピスタチオシェイク', 'ラベンダーミルク', 'ダブルチョコスムージー', 'レモンアイスティー', 'アップルジュース', 'チェリーコーク', 'ブルーマロウティー', 'ヨーグルト', 'メロンソーダ', 'ハイボール', 'エナジードリンク'],
    disclaimer: '表示価格と構成は店頭パンフレット基準です。在庫や販売条件は変更される場合がありますので、ご購入前にスタッフへご確認ください。',
  },
  'zh-Hans': {
    kicker: 'IN-STORE GUIDE',
    title: '店内手册指南',
    intro: '将店内钢笔自助搭配手册的主要信息整理成更便于浏览的网页内容。',
    source: '依据店内现行手册',
    processEyebrow: 'HOW TO USE A PEN BUFFET',
    processTitle: '钢笔自助搭配流程',
    processIntro: '顾客自行选择部件，组装与最终确认由店员完成。',
    steps: [
      ['准备工具', '请各取一个店内提供的托盘和镊子。如工具不足，请联系店员。'],
      ['选择钢笔部件', '按喜好选择笔帽尾端、笔帽、金属部件、笔尖、笔杆尾端和笔杆。'],
      ['请求组装', '选好全部部件后，请店员进行组装。如需排队，将按顺序为您服务。'],
      ['确认与包装', '组装完成后与店员一同确认产品，随后填写保修卡并进行包装。'],
    ],
    ruleTitle: '选择前请确认',
    rule: '金属部件与笔尖必须选择相同的金属颜色。',
    priceEyebrow: 'MAIN DISH · SIDE DISH',
    priceTitle: '配置与价格',
    priceIntro: '可查看完整钢笔及各分区配置。',
    prices: [
      ['MAIN DISH', '完整钢笔', '按个人喜好组合完成的钢笔自助搭配本品', '58,000韩元'],
      ['SIDE DISH', '笔帽区', '笔帽尾端・笔帽・相关部件', '31,000韩元'],
      ['SIDE DISH', '笔杆区', '笔杆尾端・笔杆', '11,000韩元'],
      ['SIDE DISH', '笔尖区', '笔尖・握位', '28,000韩元'],
    ],
    beverageEyebrow: 'BEVERAGE',
    beverageTitle: '饮品系列瓶装墨水',
    beverageIntro: '还可为完成的钢笔搭配以饮品为灵感的墨水颜色。',
    beverageName: '[BB Limited] 饮品系列瓶装墨水',
    beveragePrice: '30,400韩元',
    inkLabel: '16种饮品灵感颜色',
    inks: ['蓝色夏威夷', '草莓奶昔', '抹茶拿铁', '曲奇奶油冰沙', '炒米粉饮', '开心果奶昔', '薰衣草牛奶', '双重巧克力冰沙', '柠檬冰茶', '苹果汁', '樱桃可乐', '蓝锦葵茶', '酸奶', '蜜瓜苏打', '高球', '能量饮料'],
    disclaimer: '所示价格与配置依据店内现行手册。库存和销售条件可能变更，购买前请向店员确认。',
  },
  'zh-Hant': {
    kicker: 'IN-STORE GUIDE',
    title: '店內手冊指南',
    intro: '將店內鋼筆自助搭配手冊的主要資訊整理成更便於瀏覽的網頁內容。',
    source: '依據店內現行手冊',
    processEyebrow: 'HOW TO USE A PEN BUFFET',
    processTitle: '鋼筆自助搭配流程',
    processIntro: '顧客自行選擇部件，組裝與最終確認由店員完成。',
    steps: [
      ['準備工具', '請各取一個店內提供的托盤和鑷子。如工具不足，請聯絡店員。'],
      ['選擇鋼筆部件', '按喜好選擇筆帽尾端、筆帽、金屬部件、筆尖、筆桿尾端和筆桿。'],
      ['請求組裝', '選好全部部件後，請店員進行組裝。如需排隊，將按順序為您服務。'],
      ['確認與包裝', '組裝完成後與店員一同確認產品，隨後填寫保固卡並進行包裝。'],
    ],
    ruleTitle: '選擇前請確認',
    rule: '金屬部件與筆尖必須選擇相同的金屬顏色。',
    priceEyebrow: 'MAIN DISH · SIDE DISH',
    priceTitle: '配置與價格',
    priceIntro: '可查看完整鋼筆及各分區配置。',
    prices: [
      ['MAIN DISH', '完整鋼筆', '依個人喜好組合完成的鋼筆自助搭配本品', '58,000韓元'],
      ['SIDE DISH', '筆帽區', '筆帽尾端・筆帽・相關部件', '31,000韓元'],
      ['SIDE DISH', '筆桿區', '筆桿尾端・筆桿', '11,000韓元'],
      ['SIDE DISH', '筆尖區', '筆尖・握位', '28,000韓元'],
    ],
    beverageEyebrow: 'BEVERAGE',
    beverageTitle: '飲品系列瓶裝墨水',
    beverageIntro: '還可為完成的鋼筆搭配以飲品為靈感的墨水顏色。',
    beverageName: '[BB Limited] 飲品系列瓶裝墨水',
    beveragePrice: '30,400韓元',
    inkLabel: '16種飲品靈感顏色',
    inks: ['藍色夏威夷', '草莓奶昔', '抹茶拿鐵', '曲奇奶油冰沙', '炒米粉飲', '開心果奶昔', '薰衣草牛奶', '雙重巧克力冰沙', '檸檬冰茶', '蘋果汁', '櫻桃可樂', '藍錦葵茶', '優格', '蜜瓜蘇打', '高球', '能量飲料'],
    disclaimer: '所示價格與配置依據店內現行手冊。庫存和銷售條件可能變更，購買前請向店員確認。',
  },
};

function text() {
  return COPY[getLanguage()] ?? COPY.ko;
}

function loadStyles() {
  const href = new URL('./booklet-guide-v13.css', import.meta.url).href;
  if (document.querySelector(`link[href="${href}"]`)) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  document.head.append(link);
}

function priceCards(items) {
  return items.map(([label, title, description, price], index) => `
    <article class="booklet-price-card${index === 0 ? ' is-featured' : ''}">
      <div class="booklet-price-copy">
        <small>${label}</small>
        <h4>${title}</h4>
        <p>${description}</p>
      </div>
      <strong>${price}</strong>
    </article>
  `).join('');
}

function render() {
  const copy = text();
  const visitSection = document.querySelector('.visit-section');
  if (!visitSection) return;

  let section = document.querySelector('.booklet-guide');
  if (!section) {
    section = document.createElement('section');
    section.className = 'booklet-guide';
    visitSection.insertAdjacentElement('beforebegin', section);
  }

  section.setAttribute('aria-labelledby', 'booklet-guide-title');
  section.innerHTML = `
    <div class="booklet-guide-head">
      <div>
        <small>${copy.kicker}</small>
        <h2 id="booklet-guide-title">${copy.title}</h2>
        <p>${copy.intro}</p>
      </div>
      <span>${copy.source}</span>
    </div>

    <div class="booklet-guide-grid">
      <article class="booklet-panel booklet-process-panel">
        <div class="booklet-panel-head">
          <small>${copy.processEyebrow}</small>
          <h3>${copy.processTitle}</h3>
          <p>${copy.processIntro}</p>
        </div>
        <ol class="booklet-steps">
          ${copy.steps.map(([title, description], index) => `
            <li>
              <span>${String(index + 1).padStart(2, '0')}</span>
              <div><h4>${title}</h4><p>${description}</p></div>
            </li>
          `).join('')}
        </ol>
        <div class="booklet-rule"><small>${copy.ruleTitle}</small><strong>${copy.rule}</strong></div>
      </article>

      <article class="booklet-panel booklet-price-panel">
        <div class="booklet-panel-head">
          <small>${copy.priceEyebrow}</small>
          <h3>${copy.priceTitle}</h3>
          <p>${copy.priceIntro}</p>
        </div>
        <div class="booklet-price-list">${priceCards(copy.prices)}</div>
      </article>

      <article class="booklet-panel booklet-beverage-panel">
        <div class="booklet-panel-head">
          <small>${copy.beverageEyebrow}</small>
          <h3>${copy.beverageTitle}</h3>
          <p>${copy.beverageIntro}</p>
        </div>
        <div class="booklet-beverage-product">
          <div><small>${copy.beverageName}</small><strong>${copy.beveragePrice}</strong></div>
          <span>${copy.inkLabel}</span>
        </div>
        <ul class="booklet-ink-list">
          ${copy.inks.map((name, index) => `<li><span>${String(index + 1).padStart(2, '0')}</span>${name}</li>`).join('')}
        </ul>
      </article>
    </div>

    <p class="booklet-disclaimer">${copy.disclaimer}</p>
  `;
}

function init() {
  loadStyles();
  render();
  document.querySelectorAll('[data-language]').forEach((button) => {
    button.addEventListener('click', () => setTimeout(render, 60));
  });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
else setTimeout(init, 0);
