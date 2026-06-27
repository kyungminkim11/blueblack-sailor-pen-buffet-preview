import '../advanced-search.js';
import '../extensions.js';
import '../additional-situations.js';
import '../collection-tools.js';
import '../result-tools.js';

const visualStyle = document.createElement('style');
visualStyle.textContent = `
  .topbar { transition: background .25s ease, box-shadow .25s ease; }
  .topbar.scrolled { background: rgba(245,241,233,.96); box-shadow: 0 10px 30px rgba(11,27,49,.07); }
  .reveal { opacity: 0; transform: translateY(24px); transition: opacity .62s ease var(--reveal-delay,0ms), transform .62s cubic-bezier(.2,.7,.2,1) var(--reveal-delay,0ms); }
  .reveal.is-visible { opacity: 1; transform: translateY(0); }
  @media (prefers-reduced-motion: reduce) { .reveal { opacity: 1; transform: none; } }
`;
document.head.append(visualStyle);

const exportButton = document.querySelector('#export-log');
if (exportButton) {
  exportButton.hidden = new URLSearchParams(location.search).get('admin') !== '1';
}
const internalFooterLink = document.querySelector('footer a[href*="app.notion.com"]');
if (internalFooterLink) internalFooterLink.hidden = true;

const topbar = document.querySelector('.topbar');
const syncTopbar = () => topbar?.classList.toggle('scrolled', window.scrollY > 12);
window.addEventListener('scroll', syncTopbar, { passive: true });
syncTopbar();

setTimeout(() => {
  const version = document.querySelector('#app-version');
  if (version) version.textContent = 'Guide v4.2.0 · 비교·저장·공유·인쇄·24개 상황 2026-06-28';

  const targets = document.querySelectorAll('.section-intro, .journey-card, .nib-lab-copy, .nib-samples, .product-card, .guide-card, .store-card, .situation-card, .premium-card');
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px' });
  targets.forEach((el, index) => {
    el.classList.add('reveal');
    el.style.setProperty('--reveal-delay', `${Math.min(index % 6, 5) * 45}ms`);
    observer.observe(el);
  });
}, 220);

export function escapeHtml(value='') {
  return String(value).replace(/[&<>'"]/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
}
export function safeText(value='', max=500) {
  return String(value).replace(/[\u0000-\u001F\u007F]/g, ' ').trim().slice(0, max);
}
