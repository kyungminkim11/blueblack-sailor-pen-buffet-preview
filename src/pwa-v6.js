const messages = {
  ko: {
    install: '매장 기기에 설치',
    installing: '설치 준비 중…',
    offline: '인터넷 연결이 끊겨 저장된 화면으로 전환했습니다.',
    online: '인터넷 연결이 복구되었습니다.',
    update: '새 버전을 사용할 수 있습니다.',
    refresh: '업데이트',
  },
  en: {
    install: 'Install on store device',
    installing: 'Preparing installation…',
    offline: 'Connection lost. Using the saved offline version.',
    online: 'Internet connection restored.',
    update: 'A new version is available.',
    refresh: 'Update',
  },
  ja: {
    install: '店舗端末にインストール',
    installing: 'インストール準備中…',
    offline: '接続が切れたため、保存済みのオフライン版に切り替えました。',
    online: 'インターネット接続が復旧しました。',
    update: '新しいバージョンがあります。',
    refresh: '更新',
  },
};

function language() {
  const value = document.documentElement.lang?.toLowerCase() ?? 'ko';
  if (value.startsWith('en')) return 'en';
  if (value.startsWith('ja')) return 'ja';
  return 'ko';
}

function text() {
  return messages[language()] ?? messages.ko;
}

function isStoreMode() {
  const query = new URLSearchParams(location.search);
  return query.get('mode') === 'store' || query.get('staff') === '1' || matchMedia('(display-mode: standalone)').matches;
}

function ensureMetadata() {
  if (!document.querySelector('link[data-pwa-v6-style]')) {
    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = './pwa-v6.css';
    style.dataset.pwaV6Style = 'true';
    document.head.append(style);
  }

  if (!document.querySelector('link[rel="manifest"]')) {
    const link = document.createElement('link');
    link.rel = 'manifest';
    link.href = './manifest.webmanifest';
    document.head.append(link);
  }

  if (!document.querySelector('link[rel="icon"]')) {
    const icon = document.createElement('link');
    icon.rel = 'icon';
    icon.href = './app-icon.svg';
    icon.type = 'image/svg+xml';
    document.head.append(icon);
  }

  const metadata = [
    ['apple-mobile-web-app-capable', 'yes'],
    ['apple-mobile-web-app-status-bar-style', 'black-translucent'],
    ['apple-mobile-web-app-title', 'Pen Buffet'],
  ];

  for (const [name, content] of metadata) {
    if (document.querySelector(`meta[name="${name}"]`)) continue;
    const meta = document.createElement('meta');
    meta.name = name;
    meta.content = content;
    document.head.append(meta);
  }
}

function showToast(message) {
  let target = document.querySelector('.network-toast');
  if (!target) {
    target = document.createElement('div');
    target.className = 'network-toast';
    target.setAttribute('role', 'status');
    document.body.append(target);
  }

  target.textContent = message;
  target.classList.add('is-visible');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => target.classList.remove('is-visible'), 3000);
}

function showUpdate(registration) {
  if (!isStoreMode() || document.querySelector('.update-banner')) return;

  const banner = document.createElement('div');
  banner.className = 'update-banner';
  banner.innerHTML = `<span>${text().update}</span><button type="button">${text().refresh}</button>`;
  banner.querySelector('button').addEventListener('click', () => {
    registration.waiting?.postMessage({ type: 'SKIP_WAITING' });
  });
  document.body.append(banner);
}

function setupInstallPrompt() {
  if (!isStoreMode()) return;
  const switcher = document.querySelector('.language-switcher');
  if (!switcher) return;

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'install-app-button';
  button.textContent = text().install;
  switcher.insertAdjacentElement('afterend', button);

  let installEvent = null;
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    installEvent = event;
    button.textContent = text().install;
    button.classList.add('is-visible');
  });

  button.addEventListener('click', async () => {
    if (!installEvent) return;
    button.textContent = text().installing;
    await installEvent.prompt();
    await installEvent.userChoice;
    installEvent = null;
    button.classList.remove('is-visible');
  });

  window.addEventListener('appinstalled', () => button.remove());
}

async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;

  try {
    const registration = await navigator.serviceWorker.register('./sw.js', { scope: './' });
    if (registration.waiting && navigator.serviceWorker.controller) showUpdate(registration);

    registration.addEventListener('updatefound', () => {
      const worker = registration.installing;
      worker?.addEventListener('statechange', () => {
        if (worker.state === 'installed' && navigator.serviceWorker.controller) showUpdate(registration);
      });
    });

    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (window.__blueblackReloading) return;
      window.__blueblackReloading = true;
      location.reload();
    });
  } catch (error) {
    console.warn('Service worker registration failed', error);
  }
}

ensureMetadata();
window.addEventListener('online', () => showToast(text().online));
window.addEventListener('offline', () => showToast(text().offline));
window.setTimeout(setupInstallPrompt, 0);
registerServiceWorker();
