let paletteObserver;

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

function renderConverterNotice(t) {
  const guideSection = document.querySelector('.guide-section');
  if (!guideSection) return;

  let notice = document.querySelector('.converter-notice');
  if (!notice) {
    notice = document.createElement('p');
    notice.className = 'converter-notice';
    guideSection.insertAdjacentElement('afterend', notice);
  }
  notice.innerHTML = `<strong>${t('converter.label')}</strong> · ${t('converter.copy')}`;
}

function groupPalette(t) {
  const grid = document.querySelector('#swatch-grid');
  if (!grid || grid.dataset.enhancing === 'true') return;

  const directButtons = [...grid.children].filter((node) => node.classList?.contains('swatch-button'));
  if (!directButtons.length) return;

  grid.dataset.enhancing = 'true';
  try {
    if (directButtons.length === 20) {
      const note = document.createElement('p');
      note.className = 'palette-note';
      note.textContent = t('palette.note');
      grid.replaceChildren(
        makeSection(t('palette.existing'), t('palette.ten'), directButtons.slice(0, 10)),
        makeSection(t('palette.new'), t('palette.newCaption'), directButtons.slice(10)),
        note,
      );
      grid.classList.add('is-grouped');
    } else if (directButtons.length === 2) {
      grid.replaceChildren(makeSection(t('palette.metal'), t('palette.two'), directButtons));
      grid.classList.add('is-grouped');
    } else {
      grid.classList.remove('is-grouped');
    }
  } finally {
    grid.dataset.enhancing = 'false';
  }
}

export function initUiEnhancements(t) {
  renderConverterNotice(t);

  const palette = document.querySelector('#swatch-grid');
  if (palette) {
    paletteObserver?.disconnect();
    paletteObserver = new MutationObserver(() => queueMicrotask(() => groupPalette(t)));
    paletteObserver.observe(palette, { childList: true });
  }

  queueMicrotask(() => groupPalette(t));
}

export function refreshUiEnhancements(t) {
  renderConverterNotice(t);
  queueMicrotask(() => groupPalette(t));
}
