(() => {
  const SESSION_KEY = 'blueblack-admin-unlocked';
  const PASSWORD_HASH = 'd7df029962b16bc7d8ff27f78dd6303e68c0a21a97690b832e3bb256e9ccbcd6';

  const style = document.createElement('style');
  style.textContent = `
    .bb-admin-lock{position:fixed;inset:0;z-index:2147483647;display:grid;place-items:center;padding:22px;background:linear-gradient(135deg,#071629,#102b4c);font-family:Pretendard,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#10233f}
    .bb-admin-lock-card{width:min(420px,100%);padding:26px;border-radius:22px;background:#fff;box-shadow:0 24px 80px rgba(0,0,0,.28)}
    .bb-admin-lock-card small{display:block;color:#a77a3d;font-size:10px;font-weight:900;letter-spacing:.08em}.bb-admin-lock-card h1{margin:8px 0 8px;font-size:24px}.bb-admin-lock-card p{margin:0 0 18px;color:#64758a;font-size:13px;line-height:1.7}
    .bb-admin-lock-card input{width:100%;height:52px;padding:0 14px;border:1px solid #ccd8e3;border-radius:13px;font-size:16px}.bb-admin-lock-card button{width:100%;height:52px;margin-top:10px;border:0;border-radius:13px;background:#102b4c;color:#fff;font-weight:900;font-size:15px}.bb-admin-lock-error{min-height:20px;margin-top:10px;color:#b42318;font-size:12px;font-weight:800}
  `;
  document.head.append(style);

  function bytesToHex(buffer) {
    return [...new Uint8Array(buffer)].map((value) => value.toString(16).padStart(2, '0')).join('');
  }

  async function sha256(value) {
    const buffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
    return bytesToHex(buffer);
  }

  function unlock() {
    sessionStorage.setItem(SESSION_KEY, '1');
    document.querySelector('.bb-admin-lock')?.remove();
  }

  if (sessionStorage.getItem(SESSION_KEY) === '1') return;

  const overlay = document.createElement('div');
  overlay.className = 'bb-admin-lock';
  overlay.innerHTML = `
    <form class="bb-admin-lock-card" autocomplete="off">
      <small>BLUEBLACK PEN SHOP · ADMIN</small>
      <h1>관리자 암호 확인</h1>
      <p>매장 내부용 도구입니다. 암호를 입력하면 현재 브라우저 세션 동안 관리자 페이지를 사용할 수 있습니다.</p>
      <input type="password" name="password" placeholder="관리자 암호" autofocus />
      <button type="submit">관리자 페이지 열기</button>
      <div class="bb-admin-lock-error" role="alert"></div>
    </form>
  `;

  overlay.querySelector('form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const input = overlay.querySelector('input');
    const error = overlay.querySelector('.bb-admin-lock-error');
    const value = input.value.trim();
    if (!value) {
      error.textContent = '암호를 입력해 주세요.';
      return;
    }
    if (await sha256(value) === PASSWORD_HASH) unlock();
    else {
      input.value = '';
      input.focus();
      error.textContent = '암호가 맞지 않습니다.';
    }
  });

  document.addEventListener('DOMContentLoaded', () => document.body.append(overlay));
})();
