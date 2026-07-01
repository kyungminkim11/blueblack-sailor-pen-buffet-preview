const SUPABASE_MODULE = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
const SESSION_KEY = 'blueblack-product-access-key';

let clientPromise;

async function client() {
  const config = window.WORKSHOP_SUPABASE;
  if (!config?.url || !config?.key) {
    throw new Error('Supabase 연결 설정을 불러오지 못했습니다.');
  }

  if (!clientPromise) {
    clientPromise = import(SUPABASE_MODULE).then(({ createClient }) => createClient(
      config.url,
      config.key,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false
        }
      }
    ));
  }
  return clientPromise;
}

function rpcError(error) {
  const message = String(error?.message || 'Supabase 요청에 실패했습니다.');
  if (/not authorized|42501|permission/i.test(message)) {
    return new Error('관리자 접근키가 올바르지 않습니다.');
  }
  return new Error(message);
}

async function callRpc(name, parameters) {
  const supabase = await client();
  const { data, error } = await supabase.rpc(name, parameters);
  if (error) throw rpcError(error);
  return data;
}

export function getAccessToken() {
  return sessionStorage.getItem(SESSION_KEY) || '';
}

export function setAccessToken(token) {
  sessionStorage.setItem(SESSION_KEY, String(token || '').trim());
}

export function clearAccessToken() {
  sessionStorage.removeItem(SESSION_KEY);
}

export function hasAccessToken() {
  return Boolean(getAccessToken());
}

export async function fetchCatalogStatus(token = getAccessToken()) {
  const rows = await callRpc('internal_product_status', { p_token: token });
  return Array.isArray(rows) ? rows[0] || null : rows;
}

export async function searchRemoteProducts(query, limit = 30, token = getAccessToken()) {
  const rows = await callRpc('internal_product_search', {
    p_token: token,
    p_query: String(query || '').trim(),
    p_limit: Math.max(1, Math.min(Number(limit) || 30, 50))
  });
  return Array.isArray(rows) ? rows : [];
}

export async function replaceRemoteCatalog(products, sourceDate, onProgress, token = getAccessToken()) {
  await callRpc('internal_product_replace_start', { p_token: token });

  const batchSize = 400;
  let uploaded = 0;

  for (let index = 0; index < products.length; index += batchSize) {
    const batch = products.slice(index, index + batchSize);
    await callRpc('internal_product_insert_batch', {
      p_token: token,
      p_rows: batch
    });
    uploaded += batch.length;
    onProgress?.(uploaded, products.length);
  }

  const total = await callRpc('internal_product_replace_finish', {
    p_token: token,
    p_source_date: sourceDate || null
  });

  return Number(total) || products.length;
}
