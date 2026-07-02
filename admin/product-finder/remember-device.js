export function readRememberedValue(name) {
  try {
    return window.localStorage.getItem(name) || '';
  } catch {
    return '';
  }
}

export function rememberValue(name, value) {
  try {
    if (value) window.localStorage.setItem(name, value);
    else window.localStorage.removeItem(name);
  } catch {
    // Storage can be unavailable in private browsing mode.
  }
}
