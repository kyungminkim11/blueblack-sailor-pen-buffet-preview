import { getLanguage } from './i18n-v3.js';

const COPY = {
  ko: {
    kicker: 'PURCHASE & SERVICE',
    title: '구매·구성·A/S 안내',
    intro: '추가 섹션 구매 조건과 제품 구성, 사후 서비스 기준을 구매 전에 확인해 주세요.',
    important: '중요 안내',
    policies: [
      ['추가 섹션 구매', '캡·배럴·닙 등 추가 섹션은 펜뷔페 본품을 구매한 당일에 한해 함께 구매할 수 있습니다.'],
      ['A/S 접수처', '펜뷔페 제품의 A/S는 블루블랙 펜샵 매장에서만 가능합니다.'],
      ['A/S 기간과 비용', 'A/S 접수 기한은 없으며 기본 점검비는 없습니다. 단, 부품 교체가 발생하면 교체 부품 및 수리 비용이 발생할 수 있습니다.'],
      ['사은품 합산 제외', '펜뷔페 제품 구매 금액은 사은품 증정 기준의 합산 금액에서 제외됩니다.'],
      ['기본 구성품', '본품에는 컨버터가 포함되지 않습니다. 컨버터는 별도 구매이며, 블랙 잉크 카트리지 2개가 동봉됩니다.'],
    ],
    includedTitle: '기본 구성 안내',
    includedCopy: '컨버터는 본품에 포함되지 않는 별도 구매 상품이며, 블랙 잉크 카트리지 2개가 동봉됩니다.',
    note: 'A/S 시 제품 상태와 교체 부품에 따라 최종 비용이 달라질 수 있습니다. 접수 전 매장 직원에게 제품을 보여주세요.',
  },
  en: {
    kicker: 'PURCHASE & SERVICE',
    title: 'Purchase, contents and after-service',
    intro: 'Please review the conditions for buying additional sections, the included items and after-service policy before purchase.',
    important: 'Important',
    policies: [
      ['Additional sections', 'Additional cap, barrel or nib sections may be purchased only on the same day as the complete Pen Buffet fountain pen.'],
      ['After-service location', 'After-service for Pen Buffet products is available only at the BlueBlack Pen Shop store.'],
      ['Service period and fees', 'There is no service deadline and no basic inspection fee. Charges may apply when parts must be replaced or additional repair work is required.'],
      ['Gift threshold exclusion', 'Pen Buffet purchases are excluded from the combined purchase amount used to determine promotional gift eligibility.'],
      ['Included items', 'A converter is not included with the pen and must be purchased separately. Two black ink cartridges are included.'],
    ],
    includedTitle: 'Included items',
    includedCopy: 'The converter is sold separately and is not included with the pen. Two black ink cartridges are included.',
    note: 'The final after-service cost may vary depending on the condition of the pen and any replacement parts required. Please show the product to a store staff member before service.',
  },
  ja: {
    kicker: 'PURCHASE & SERVICE',
    title: '購入条件・付属品・A/Sのご案内',
    intro: '追加セクションの購入条件、付属品、アフターサービス基準を購入前にご確認ください。',
    important: '重要なご案内',
    policies: [
      ['追加セクションの購入', 'キャップ・胴軸・ペン先などの追加セクションは、ペンビュッフェ本体をご購入いただいた当日に限り追加購入できます。'],
      ['A/S受付店舗', 'ペンビュッフェ製品のA/Sは、BlueBlack Pen Shopの店頭でのみ受け付けています。'],
      ['A/S期間と費用', 'A/Sの受付期限はなく、基本点検料もかかりません。ただし、部品交換や追加修理が必要な場合は費用が発生することがあります。'],
      ['ノベルティー合算対象外', 'ペンビュッフェ製品の購入金額は、ノベルティー進呈条件の合算金額から除外されます。'],
      ['基本付属品', '本体にコンバーターは付属しません。コンバーターは別売りで、ブラックインクカートリッジ2本が付属します。'],
    ],
    includedTitle: '基本付属品',
    includedCopy: 'コンバーターは本体に含まれない別売り商品です。ブラックインクカートリッジ2本が付属します。',
    note: 'A/Sの最終費用は製品状態や交換部品によって異なる場合があります。受付前に店頭スタッフへ製品をお見せください。',
  },
  'zh-Hans': {
    kicker: 'PURCHASE & SERVICE',
    title: '购买条件、随附物品与售后服务',
    intro: '购买前请确认追加分区的购买条件、产品随附物品以及售后服务标准。',
    important: '重要提示',
    policies: [
      ['追加分区购买', '笔帽、笔杆、笔尖等追加分区仅可在购买钢笔自助搭配本品的当天一并购买。'],
      ['售后服务地点', '钢笔自助搭配产品的售后服务仅可在 BlueBlack Pen Shop 门店办理。'],
      ['服务期限与费用', '售后服务没有受理期限，也不收取基础检查费。如需更换部件或进行额外维修，可能会产生费用。'],
      ['不计入赠品门槛', '钢笔自助搭配产品的购买金额不计入赠品活动的合计消费金额。'],
      ['随附物品', '本品不含上墨器，上墨器需另行购买。随附2支黑色墨水芯。'],
    ],
    includedTitle: '随附物品',
    includedCopy: '上墨器不包含在本品内，需另行购买。随附2支黑色墨水芯。',
    note: '最终售后费用可能因产品状态及需要更换的部件而异。受理前请将产品交给门店店员确认。',
  },
  'zh-Hant': {
    kicker: 'PURCHASE & SERVICE',
    title: '購買條件、隨附物品與售後服務',
    intro: '購買前請確認追加分區的購買條件、產品隨附物品以及售後服務標準。',
    important: '重要提示',
    policies: [
      ['追加分區購買', '筆帽、筆桿、筆尖等追加分區僅可在購買鋼筆自助搭配本品的當天一併購買。'],
      ['售後服務地點', '鋼筆自助搭配產品的售後服務僅可在 BlueBlack Pen Shop 門市辦理。'],
      ['服務期限與費用', '售後服務沒有受理期限，也不收取基本檢查費。如需更換部件或進行額外維修，可能會產生費用。'],
      ['不計入贈品門檻', '鋼筆自助搭配產品的購買金額不計入贈品活動的合計消費金額。'],
      ['隨附物品', '本品不含吸墨器，吸墨器需另行購買。隨附2支黑色墨水芯。'],
    ],
    includedTitle: '隨附物品',
    includedCopy: '吸墨器不包含在本品內，需另行購買。隨附2支黑色墨水芯。',
    note: '最終售後費用可能因產品狀態及需要更換的部件而異。受理前請將產品交給門市店員確認。',
  },
};

function text() {
  return COPY[getLanguage()] ?? COPY.ko;
}

function loadStyles() {
  const href = new URL('./store-policy-v14.css', import.meta.url).href;
  if (document.querySelector(`link[href="${href}"]`)) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  document.head.append(link);
}

function updateConverterNotices(copy) {
  document.querySelectorAll('.converter').forEach((node) => {
    node.innerHTML = `<b>${copy.includedTitle}</b><br><span>${copy.includedCopy}</span>`;
  });
}

function render() {
  const copy = text();
  const visitSection = document.querySelector('.visit-section');
  if (!visitSection) return;

  let section = document.querySelector('.store-policy-guide');
  if (!section) {
    section = document.createElement('section');
    section.className = 'store-policy-guide';
    const booklet = document.querySelector('.booklet-guide');
    if (booklet) booklet.insertAdjacentElement('afterend', section);
    else visitSection.insertAdjacentElement('beforebegin', section);
  }

  section.setAttribute('aria-labelledby', 'store-policy-title');
  section.innerHTML = `
    <div class="store-policy-head">
      <small>${copy.kicker}</small>
      <h2 id="store-policy-title">${copy.title}</h2>
      <p>${copy.intro}</p>
    </div>
    <div class="store-policy-grid">
      ${copy.policies.map(([title, description], index) => `
        <article class="store-policy-card${index === 0 || index === 4 ? ' is-emphasis' : ''}">
          <span>${String(index + 1).padStart(2, '0')}</span>
          <div><small>${copy.important}</small><h3>${title}</h3><p>${description}</p></div>
        </article>
      `).join('')}
    </div>
    <p class="store-policy-note">${copy.note}</p>
  `;

  updateConverterNotices(copy);
}

function init() {
  loadStyles();
  render();
  document.querySelectorAll('[data-language]').forEach((button) => {
    button.addEventListener('click', () => setTimeout(render, 100));
  });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(init, 40), { once: true });
else setTimeout(init, 40);
