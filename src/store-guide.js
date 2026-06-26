function storeGuideMarkup(t) {
  return `
    <div class="store-guide-head">
      <div><p>${t('store.kicker')}</p><h2>${t('store.title')}</h2></div>
      <span>${t('store.subtitle')}</span>
    </div>
    <div class="store-steps">
      <article class="store-step"><strong>01</strong><b>${t('store.step1.title')}</b><span>${t('store.step1.copy')}</span></article>
      <article class="store-step"><strong>02</strong><b>${t('store.step2.title')}</b><span>${t('store.step2.copy')}</span></article>
      <article class="store-step"><strong>03</strong><b>${t('store.step3.title')}</b><span>${t('store.step3.copy')}</span></article>
      <article class="store-step"><strong>04</strong><b>${t('store.step4.title')}</b><span>${t('store.step4.copy')}</span></article>
    </div>
    <div class="store-facts">
      <div class="store-fact"><b>${t('store.fact1.title')}</b>${t('store.fact1.copy')}</div>
      <div class="store-fact"><b>${t('store.fact2.title')}</b>${t('store.fact2.copy')}</div>
      <div class="store-fact"><b>${t('store.fact3.title')}</b>${t('store.fact3.copy')}</div>
    </div>
  `;
}

export function renderStoreGuide(t) {
  const resultSection = document.querySelector('.result-section');
  if (!resultSection) return;

  let section = document.querySelector('.store-guide');
  if (!section) {
    section = document.createElement('section');
    section.className = 'store-guide';
    resultSection.insertAdjacentElement('beforebegin', section);
  }
  section.innerHTML = storeGuideMarkup(t);
}
