const style = document.createElement('style');
style.textContent = `
  .swatch-grid.is-grouped { display: grid; grid-template-columns: 1fr; gap: 18px; }
  .color-section { display: grid; gap: 10px; }
  .color-section + .color-section { padding-top: 4px; }
  .color-section-title { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding-bottom: 8px; border-bottom: 1px solid #e6e9ee; color: #344055; font-size: 12px; font-weight: 900; }
  .color-section-title small { color: #7b8798; font-size: 10px; font-weight: 700; }
  .color-section-grid { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 14px 8px; }
  .swatch-button { position: relative; min-height: 72px; }
  .swatch-button > span:last-of-type { max-width: 68px; line-height: 1.25; text-align: center; word-break: keep-all; }
  .new-badge { position: absolute; top: -5px; right: 0; padding: 2px 5px; border-radius: 999px; background: #b83d54; color: #fff; font-size: 8px; font-weight: 900; letter-spacing: .05em; box-shadow: 0 2px 6px rgba(184,61,84,.24); }
  .palette-note { margin: 0; padding: 10px 12px; border: 1px solid #e8dfcf; border-radius: 12px; background: #f7f3eb; color: #6f6250; font-size: 11px; line-height: 1.5; }
  .selected-color-bar { position: sticky; bottom: 10px; z-index: 4; background: #fff; box-shadow: 0 8px 24px rgba(16,35,63,.09); }
  @media (max-width: 640px) {
    .color-section-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 13px 5px; }
    .swatch-button { min-height: 68px; }
  }
`;
document.head.appendChild(style);

function updateStaticCopy() {
  const header = document.querySelector('.header-copy');
  if (header) header.textContent = '캡·캡앤드·닙그립·메탈파츠·배럴·배럴앤드 6개 파츠와 총 20가지 수지 색상을 조합해보세요.';

  const status = document.querySelector('.status-pill');
  if (status?.lastChild) status.lastChild.textContent = ' 한국 매장 상담용';

  const guide = document.querySelector('.guide-grid li span');
  if (guide) guide.innerHTML = '<b>파츠 선택</b>6개 파츠와 20가지 색상을 선택';

  const footer = document.querySelector('footer span');
  if (footer) footer.textContent = '블루블랙 펜샵의 실제 6개 파츠 구성과 한국 판매 색상표를 기준으로 한 매장 상담용 중립 3D 모델입니다.';
}

function addNewBadges(buttons) {
  buttons.slice(10).forEach((button) => {
    if (button.querySelector('.new-badge')) return;
    const badge = document.createElement('small');
    badge.className = 'new-badge';
    badge.textContent = 'NEW';
    button.appendChild(badge);
  });
}

function makeSection(title, caption, buttons) {
  const section = document.createElement('section');
  section.className = 'color-section';

  const heading = document.createElement('div');
  heading.className = 'color-section-title';
  heading.innerHTML = `<span>${title}</span><small>${caption}</small>`;

  const grid = document.createElement('div');
  grid.className = 'color-section-grid';
  grid.append(...buttons);
  section.append(heading, grid);
  return section;
}

function groupPalette() {
  const grid = document.querySelector('#swatch-grid');
  if (!grid || grid.dataset.enhancing === 'true') return;

  const directButtons = [...grid.children].filter((node) => node.classList?.contains('swatch-button'));
  if (!directButtons.length) return;

  grid.dataset.enhancing = 'true';
  try {
    if (directButtons.length === 20) {
      addNewBadges(directButtons);
      const note = document.createElement('p');
      note.className = 'palette-note';
      note.textContent = '화면 색상은 조명과 디스플레이 환경에 따라 실제 반투명 파츠와 다르게 보일 수 있습니다.';
      grid.replaceChildren(
        makeSection('기존 색상', '10가지', directButtons.slice(0, 10)),
        makeSection('신규 색상', '2026.06.15 · 10가지', directButtons.slice(10)),
        note,
      );
      grid.classList.add('is-grouped');
    } else {
      grid.classList.remove('is-grouped');
    }
  } finally {
    grid.dataset.enhancing = 'false';
  }
}

updateStaticCopy();
const observer = new MutationObserver(() => queueMicrotask(groupPalette));
const palette = document.querySelector('#swatch-grid');
if (palette) observer.observe(palette, { childList: true });
queueMicrotask(groupPalette);
