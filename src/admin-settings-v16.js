import { parts } from './data.js';
import { ADMIN_SETTINGS_KEY, readAdminSettings } from './admin-store-v16.js';

let settings = readAdminSettings();
let idleTimer = 0;
let observer;
let mutationFrame = 0;

window.__bbAdminSettings = settings;

function hasCombinationInUrl() {
  const query = new URLSearchParams(location.search);
  if (query.has('c')) return true;
  return parts.some((part) => query.has(part.id));
}

function applyInitialQuery() {
  const query = new URLSearchParams(location.search);
  let changed = false;

  if (!hasCombinationInUrl()) {
    for (const part of parts) {
      const value = settings.defaultCombination?.[part.id];
      if (value) {
        query.set(part.id, value);
        changed = true;
      }
    }
  }

  if (!query.has('lang') && settings.defaultLanguage !== 'auto') {
    query.set('lang', settings.defaultLanguage);
    changed = true;
  }

  if (!changed) return;

  const suffix = query.toString();
  const nextUrl = `${location.pathname}${suffix ? `?${suffix}` : ''}${location.hash}`;
  if (window.blueblackPenApp) location.replace(nextUrl);
  else history.replaceState(null, '', nextUrl);
}

function ensureRuntimeStyles() {
  if (document.getElementById('admin-runtime-v16-style')) return;
  const style = document.createElement('style');
  style.id = 'admin-runtime-v16-style';
  style.textContent = `
    .admin-announcement-v16{display:flex;align-items:center;justify-content:center;gap:10px;padding:10px 16px;background:#102b4c;color:#fff;font-size:.82rem;font-weight:750;line-height:1.45;text-align:center}
    .admin-announcement-v16::before{content:'NOTICE';padding:4px 7px;border-radius:999px;background:rgba(255,255,255,.16);font-size:.58rem;letter-spacing:.12em}
    [data-admin-hidden='true']{display:none!important}
    @media(max-width:699px){.admin-announcement-v16{padding:9px 12px;font-size:.75rem}.admin-announcement-v16::before{display:none}}
  `;
  document.head.append(style);
}

function applyVisibility(selector, visible) {
  document.querySelectorAll(selector).forEach((node) => {
    const next = visible ? 'false' : 'true';
    if (node.dataset.adminHidden !== next) node.dataset.adminHidden = next;
  });
}

function applyAnnouncement() {
  let banner = document.querySelector('.admin-announcement-v16');
  const shouldShow = settings.announcementEnabled && settings.announcementText;

  if (!shouldShow) {
    banner?.remove();
    return;
  }

  if (!banner) {
    banner = document.createElement('div');
    banner.className = 'admin-announcement-v16';
    banner.setAttribute('role', 'status');
    document.querySelector('.app-header')?.insertAdjacentElement('afterend', banner);
  }
  if (banner && banner.textContent !== settings.announcementText) banner.textContent = settings.announcementText;
}

function applySettingsToDom() {
  ensureRuntimeStyles();
  applyAnnouncement();
  applyVisibility('.howto', settings.showHowto);
  applyVisibility('.booklet-guide', settings.showGuide);
  applyVisibility('.store-policy-guide', settings.showPolicy);
  applyVisibility('.booklet-beverage-panel', settings.showBeverage);
  applyVisibility('.visit-section', settings.showVisit);
}

function openAdminDefaultCombination() {
  const query = new URLSearchParams(location.search);
  for (const part of parts) query.set(part.id, settings.defaultCombination?.[part.id]);
  if (settings.defaultLanguage !== 'auto') query.set('lang', settings.defaultLanguage);
  location.replace(`${location.pathname}?${query.toString()}`);
}

function resetIdleTimer() {
  clearTimeout(idleTimer);
  const minutes = Number(settings.idleResetMinutes || 0);
  if (!minutes) return;

  idleTimer = window.setTimeout(() => {
    openAdminDefaultCombination();
  }, minutes * 60 * 1000);
}

function bindIdleReset() {
  ['pointerdown', 'keydown', 'touchstart'].forEach((eventName) => {
    document.addEventListener(eventName, resetIdleTimer, { passive: true });
  });
  resetIdleTimer();
}

function watchDynamicSections() {
  observer?.disconnect();
  observer = new MutationObserver(() => {
    cancelAnimationFrame(mutationFrame);
    mutationFrame = requestAnimationFrame(applySettingsToDom);
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

function refresh(nextSettings) {
  settings = nextSettings || readAdminSettings();
  window.__bbAdminSettings = settings;
  applySettingsToDom();
  resetIdleTimer();
}

applyInitialQuery();

function init() {
  applySettingsToDom();
  watchDynamicSections();
  bindIdleReset();
}

window.addEventListener('blueblackadminsettingschange', (event) => refresh(event.detail));
window.addEventListener('storage', (event) => {
  if (event.key === ADMIN_SETTINGS_KEY) refresh();
});

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
else init();
