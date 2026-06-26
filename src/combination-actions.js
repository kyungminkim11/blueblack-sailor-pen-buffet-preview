import './remove-combination-code.js';

const COPY = {
  ko: {
    guide: '저장한 조합 링크를 직원에게 보여주세요.',
    store: '마음에 드는 색을 조합한 뒤 링크를 복사하거나 3D 이미지를 저장해 주세요.',
    subtitle: '현재 선택은 조합 링크에 자동으로 저장됩니다.',
    title: '조합 저장 및 공유',
    description: '선택한 조합은 링크로 저장하거나 3D 이미지로 보관할 수 있습니다.',
  },
  en: {
    guide: 'Show the saved combination link to a member of staff.',
    store: 'Choose your preferred colors, then copy the link or save the 3D image.',
    subtitle: 'Your current selections are saved automatically in the combination link.',
    title: 'Save and share your combination',
    description: 'Keep your selected combination as a link or save the current 3D view as an image.',
  },
  ja: {
    guide: '保存した組み合わせリンクをスタッフにお見せください。',
    store: 'お好みの色を組み合わせた後、リンクをコピーするか3D画像を保存してください。',
    subtitle: '現在の選択内容は組み合わせリンクに自動保存されます。',
    title: '組み合わせを保存・共有',
    description: '選択した組み合わせはリンクで保存するか、現在の3D表示を画像として保存できます。',
  },
};

let applying = false;

function language() {
  const value = document.documentElement.lang?.toLowerCase() ?? 'ko';
  if (value.startsWith('en')) return 'en';
  if (value.startsWith('ja')) return 'ja';
  return 'ko';
}

function setElementText(element, value) {
  if (element && element.textContent !== value) element.textContent = value;
}

function ensureActionCopy(card) {
  let block = card.querySelector('.combination-actions-copy');
  if (block) return block;

  block = document.createElement('div');
  block.className = 'combination-actions-copy';
  block.innerHTML = '<strong></strong><p></p>';

  const actions = card.querySelector('.result-actions');
  card.insertBefore(block, actions ?? card.firstChild);
  return block;
}

function applyCopy() {
  if (applying) return;
  applying = true;

  const text = COPY[language()];

  setElementText(document.querySelector('.guide-grid li:nth-child(3) span > span'), text.guide);
  setElementText(document.querySelector('.result-heading > p'), text.subtitle);
  setElementText(document.querySelector('.store-guide .store-step:first-child span'), text.store);

  const card = document.querySelector('.code-card');
  if (card) {
    const block = ensureActionCopy(card);
    setElementText(block.querySelector('strong'), text.title);
    setElementText(block.querySelector('p'), text.description);
  }

  applying = false;
}

queueMicrotask(applyCopy);
window.addEventListener('languagechange', () => queueMicrotask(applyCopy));

const observer = new MutationObserver(() => queueMicrotask(applyCopy));
observer.observe(document.body, { childList: true, subtree: true });
