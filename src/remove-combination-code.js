const style = document.createElement('style');
style.textContent = `
  #combination-code,
  .code-card > [data-i18n="result.code"],
  .code-card > [data-i18n="result.codeCopy"] {
    display: none !important;
  }
`;
document.head.appendChild(style);

function removeCombinationCode() {
  document.querySelector('.code-card > [data-i18n="result.code"]')?.remove();
  document.querySelector('.code-card > [data-i18n="result.codeCopy"]')?.remove();

  const code = document.querySelector('#combination-code');
  if (code) {
    code.textContent = '';
    code.hidden = true;
    code.setAttribute('aria-hidden', 'true');
  }
}

removeCombinationCode();

const observer = new MutationObserver(removeCombinationCode);
observer.observe(document.body, { childList: true, subtree: true, characterData: true });
