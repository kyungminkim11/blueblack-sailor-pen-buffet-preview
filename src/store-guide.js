const style = document.createElement('style');
style.textContent = `
.store-guide{margin:0 0 34px;padding:24px;border:1px solid #dde3ec;border-radius:20px;background:linear-gradient(180deg,#fff 0%,#fafbfc 100%);box-shadow:0 12px 34px rgba(16,35,63,.06)}
.store-guide-head{display:flex;align-items:end;justify-content:space-between;gap:20px;margin-bottom:18px}
.store-guide-head p{margin:0 0 6px;color:#8a6d49;font-size:11px;font-weight:900;letter-spacing:.12em}
.store-guide-head h2{margin:0;color:#10233f;font-size:clamp(22px,3vw,30px)}
.store-guide-head>span{max-width:430px;color:#687488;font-size:13px;line-height:1.6}
.store-steps{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:10px}
.store-step{min-height:150px;padding:16px;border:1px solid #e5e9ef;border-radius:16px;background:#fff}
.store-step strong{display:inline-grid;place-items:center;width:30px;height:30px;margin-bottom:18px;border-radius:999px;background:#10233f;color:#fff;font-size:12px}
.store-step b{display:block;margin-bottom:8px;color:#182942;font-size:14px}
.store-step span{color:#6d7888;font-size:12px;line-height:1.6}
.store-facts{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-top:14px}
.store-fact{padding:14px 15px;border-radius:14px;background:#f4f6f9;color:#566277;font-size:12px;line-height:1.6}
.store-fact b{display:block;margin-bottom:3px;color:#1c2d47}
@media(max-width:920px){.store-steps{grid-template-columns:repeat(2,minmax(0,1fr))}.store-facts{grid-template-columns:1fr}}
@media(max-width:640px){.store-guide{padding:18px;border-radius:18px}.store-guide-head{display:grid}.store-steps{grid-template-columns:1fr}.store-step{min-height:0}}
`;
document.head.appendChild(style);

function addStoreGuide() {
  const resultSection = document.querySelector('.result-section');
  if (!resultSection || document.querySelector('.store-guide')) return;

  const section = document.createElement('section');
  section.className = 'store-guide';
  section.innerHTML = `
    <div class="store-guide-head">
      <div><p>IN-STORE EXPERIENCE</p><h2>매장에서는 이렇게 진행돼요</h2></div>
      <span>웹에서 조합한 뒤 매장에서 실물 색상과 필기감을 최종 확인해 주세요.</span>
    </div>
    <div class="store-steps">
      <article class="store-step"><strong>01</strong><b>실물 색상 확인</b><span>파츠 보드에서 실제 반투명 색상과 투명도를 확인합니다.</span></article>
      <article class="store-step"><strong>02</strong><b>6개 파츠 선택</b><span>캡, 캡앤드, 닙그립, 메탈파츠, 배럴, 배럴앤드를 고릅니다.</span></article>
      <article class="store-step"><strong>03</strong><b>메탈파츠 선택</b><span>실버 또는 골드 계열의 닙, 클립, 캡 밴드와 링을 선택합니다.</span></article>
      <article class="store-step"><strong>04</strong><b>직원 조립·점검</b><span>선택한 파츠를 조립하고 결합 상태와 닙 정렬을 확인합니다.</span></article>
      <article class="store-step"><strong>05</strong><b>필기 테스트·수령</b><span>완성 후 필기감을 확인하고 패키지에 담긴 결과물을 수령합니다.</span></article>
    </div>
    <div class="store-facts">
      <div class="store-fact"><b>컨버터는 별도 구매</b>펜뷔페 기본 구성에는 포함되지 않습니다.</div>
      <div class="store-fact"><b>화면은 사전 미리보기</b>최종 선택은 매장 실물 파츠를 확인한 뒤 진행해 주세요.</div>
      <div class="store-fact"><b>색상·재고는 변동 가능</b>운영 시기와 매장 상황에 따라 준비 수량이 달라질 수 있습니다.</div>
    </div>
  `;
  resultSection.insertAdjacentElement('beforebegin', section);
}

queueMicrotask(addStoreGuide);
