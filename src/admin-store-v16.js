import { parts, colors, defaultSelection } from './data.js';

export const ADMIN_SETTINGS_KEY = 'blueblack-admin-settings-v1';

export const DEFAULT_ADMIN_SETTINGS = Object.freeze({
  announcementEnabled: false,
  announcementText: '',
  showHowto: true,
  showGuide: true,
  showPolicy: true,
  showBeverage: true,
  showVisit: true,
  defaultLanguage: 'auto',
  idleResetMinutes: 0,
  defaultCombination: { ...defaultSelection },
  updatedAt: null,
});

const LANGUAGES = new Set(['auto', 'ko', 'en', 'ja', 'zh-Hans', 'zh-Hant']);

function validColorForPart(part, colorId) {
  return colors.some((color) => color.id === colorId && color.group === part.colorGroup);
}

export function sanitizeAdminSettings(value = {}) {
  const source = value && typeof value === 'object' ? value : {};
  const combination = { ...defaultSelection };

  for (const part of parts) {
    const candidate = source.defaultCombination?.[part.id];
    if (validColorForPart(part, candidate)) combination[part.id] = candidate;
  }

  const idle = Number(source.idleResetMinutes);
  return {
    announcementEnabled: Boolean(source.announcementEnabled),
    announcementText: String(source.announcementText ?? '').trim().slice(0, 240),
    showHowto: source.showHowto !== false,
    showGuide: source.showGuide !== false,
    showPolicy: source.showPolicy !== false,
    showBeverage: source.showBeverage !== false,
    showVisit: source.showVisit !== false,
    defaultLanguage: LANGUAGES.has(source.defaultLanguage) ? source.defaultLanguage : 'auto',
    idleResetMinutes: Number.isFinite(idle) ? Math.min(120, Math.max(0, Math.round(idle))) : 0,
    defaultCombination: combination,
    updatedAt: source.updatedAt ? String(source.updatedAt) : null,
  };
}

export function readAdminSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(ADMIN_SETTINGS_KEY) || 'null');
    return sanitizeAdminSettings({ ...DEFAULT_ADMIN_SETTINGS, ...(saved || {}) });
  } catch {
    return sanitizeAdminSettings(DEFAULT_ADMIN_SETTINGS);
  }
}

export function writeAdminSettings(value) {
  const next = sanitizeAdminSettings({ ...value, updatedAt: new Date().toISOString() });
  localStorage.setItem(ADMIN_SETTINGS_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent('blueblackadminsettingschange', { detail: next }));
  return next;
}

export function resetAdminSettings() {
  localStorage.removeItem(ADMIN_SETTINGS_KEY);
  const next = sanitizeAdminSettings(DEFAULT_ADMIN_SETTINGS);
  window.dispatchEvent(new CustomEvent('blueblackadminsettingschange', { detail: next }));
  return next;
}

export function buildCombinationUrl(combination, language = 'ko') {
  const url = new URL('./', location.href);
  url.search = '';
  for (const part of parts) {
    const colorId = validColorForPart(part, combination?.[part.id])
      ? combination[part.id]
      : defaultSelection[part.id];
    url.searchParams.set(part.id, colorId);
  }
  url.searchParams.set('lang', LANGUAGES.has(language) && language !== 'auto' ? language : 'ko');
  return url.href;
}
