const SUPABASE_URL = 'https://jnciddblcndmthmmvqrz.supabase.co';
const SUPABASE_KEY = 'sb_publishable_UUzSE7O9wqI0WN9cKG9OAQ_VleRkL4I';
const ACCESS_KEY = 'blueblack-product-access-key';

function getToken() {
  let value = sessionStorage.getItem(ACCESS_KEY) || '';
  if (!value) value = window.prompt('비공개 상품 DB 접근키를 입력해 주세요.')?.trim() || '';
  if (value) sessionStorage.setItem(ACCESS_KEY, value);
  return value;
}

export async function nibRpc(name, parameters, retry = true) {
  const token = getToken();
  if (!token) throw new Error('상품 DB 접근키가 필요합니다.');

  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${name}`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ p_token: token, ...parameters })
  });
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = String(data?.message || data?.error || '요청에 실패했습니다.');
    if (retry && /authorized|42501|permission/i.test(message)) {
      sessionStorage.removeItem(ACCESS_KEY);
      return nibRpc(name, parameters, false);
    }
    throw new Error(message);
  }
  return data;
}
