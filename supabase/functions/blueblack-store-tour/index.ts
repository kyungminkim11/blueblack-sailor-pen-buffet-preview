import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const BUCKET = 'blueblack-store-tour';
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
const origins = new Set([
  'https://kyungminkim11.github.io',
  'http://localhost:3000', 'http://127.0.0.1:3000',
  'http://localhost:4173', 'http://127.0.0.1:4173',
  'http://localhost:5173', 'http://127.0.0.1:5173',
]);
const ids = new Set(Array.from({ length: 11 }, (_, index) => `f1-${String(index + 1).padStart(2, '0')}`));
const defaults = [
  ['f1-01', '출입구·계산대 앞', 31, 87, 1, { straight: 'f1-02' }],
  ['f1-02', '입구 중앙', 48, 81, 2, { straight: 'f1-03', right: 'f1-09', back: 'f1-01' }],
  ['f1-03', '전면 기둥·안내대', 40, 72, 3, { straight: 'f1-04', back: 'f1-02' }],
  ['f1-04', '전면 중앙 교차점', 48, 64, 4, { straight: 'f1-05', left: 'f1-06', right: 'f1-07', back: 'f1-03' }],
  ['f1-05', '중앙 진열 통로', 48, 52, 5, { straight: 'f1-11', left: 'f1-06', right: 'f1-07', back: 'f1-04' }],
  ['f1-06', '좌측 잉크 진열벽 앞', 32, 40, 6, { straight: 'f1-10', right: 'f1-05', back: 'f1-04' }],
  ['f1-07', '우측 잉크 진열벽 앞', 65, 40, 7, { straight: 'f1-08', left: 'f1-05', back: 'f1-04' }],
  ['f1-08', '후면 블랙 진열장', 82, 55, 8, { straight: 'f1-09', left: 'f1-07', back: 'f1-07' }],
  ['f1-09', '후문·블랙 진열장', 84, 72, 9, { straight: 'f1-02', left: 'f1-08', back: 'f1-08' }],
  ['f1-10', '핑크·오렌지 잉크벽', 30, 28, 10, { straight: 'f1-11', right: 'f1-06', back: 'f1-06' }],
  ['f1-11', '옐로 잉크벽·블랙 아일랜드', 48, 20, 11, { left: 'f1-10', right: 'f1-07', back: 'f1-05' }],
].map(([id, title, x, y, sortOrder, connections]) => ({
  id,
  title,
  data: { floor: 1, code: String(id).toUpperCase(), x, y, sortOrder, connections, imageMode: 'default', isPublic: true },
}));

function cors(request: Request) {
  const origin = request.headers.get('origin') ?? '';
  return {
    'Access-Control-Allow-Origin': origins.has(origin) ? origin : 'https://kyungminkim11.github.io',
    'Access-Control-Allow-Headers': 'content-type, authorization, apikey',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Cache-Control': 'no-store',
    'Vary': 'Origin',
  };
}
function json(request: Request, body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...cors(request), 'Content-Type': 'application/json; charset=utf-8' } });
}
function text(value: unknown, max = 240) { return String(value ?? '').trim().slice(0, max); }
function number(value: unknown, fallback: number, min: number, max: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(min, Math.min(max, parsed)) : fallback;
}
function cleanConnections(value: unknown) {
  const source = value && typeof value === 'object' ? value as Record<string, unknown> : {};
  const result: Record<string, string> = {};
  for (const key of ['left', 'straight', 'right', 'back']) {
    const target = text(source[key], 12);
    if (ids.has(target)) result[key] = target;
  }
  return result;
}
async function authorized(session: string) {
  if (!session || session.length < 32) return false;
  const { data, error } = await supabase.rpc('internal_catalog_update_session_ok', { p_session: session });
  return !error && Boolean(data);
}
async function ensureResources() {
  const { error: seedError } = await supabase.from('blueblack_store_tour_spots').upsert(defaults, { onConflict: 'id', ignoreDuplicates: true });
  if (seedError) throw seedError;
  const { data: bucket } = await supabase.storage.getBucket(BUCKET);
  if (!bucket) {
    const { error } = await supabase.storage.createBucket(BUCKET, { public: true, fileSizeLimit: 15728640, allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'] });
    if (error && !String(error.message).toLowerCase().includes('already')) throw error;
  }
}
function publicUrl(path: string) { return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl; }
async function rows(admin = false) {
  await ensureResources();
  const { data, error } = await supabase.from('blueblack_store_tour_spots').select('id,title,data,updated_at');
  if (error) throw error;
  const mapped = (data ?? []).map((row: any) => {
    const meta = row.data ?? {};
    return {
      id: row.id,
      title: row.title,
      updatedAt: row.updated_at,
      ...meta,
      imageUrl: meta.imageMode === 'custom' && meta.imagePath ? publicUrl(meta.imagePath) : null,
    };
  }).sort((a: any, b: any) => Number(a.sortOrder) - Number(b.sortOrder));
  if (admin) return mapped;
  return mapped.map((row: any) => {
    const { imagePath, imageName, imageSize, imageWidth, imageHeight, ...publicRow } = row;
    return publicRow;
  });
}
async function getSpot(id: string) {
  const { data, error } = await supabase.from('blueblack_store_tour_spots').select('id,title,data').eq('id', id).maybeSingle();
  if (error) throw error;
  return data;
}
async function saveSpot(id: string, title: string, data: Record<string, unknown>) {
  const { error } = await supabase.from('blueblack_store_tour_spots').upsert({ id, title, data, updated_at: new Date().toISOString() }, { onConflict: 'id' });
  if (error) throw error;
}
async function deleteObject(path: unknown) {
  const value = text(path, 500);
  if (value) await supabase.storage.from(BUCKET).remove([value]);
}

Deno.serve(async (request: Request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: cors(request) });
  try {
    if (request.method === 'GET') return json(request, { ok: true, spots: await rows(false) });
    if (request.method !== 'POST') return json(request, { ok: false, error: 'method_not_allowed' }, 405);

    const contentType = request.headers.get('content-type') ?? '';
    if (contentType.includes('multipart/form-data')) {
      const form = await request.formData();
      const action = text(form.get('action'), 30);
      const session = text(form.get('session'), 256);
      if (!await authorized(session)) return json(request, { ok: false, error: 'unauthorized' }, 401);
      if (action !== 'upload') return json(request, { ok: false, error: 'unknown_action' }, 400);
      const id = text(form.get('spotId'), 12);
      const file = form.get('file');
      if (!ids.has(id) || !(file instanceof File) || !file.type.startsWith('image/')) return json(request, { ok: false, error: 'invalid_upload' }, 400);
      if (file.size > 15728640) return json(request, { ok: false, error: 'file_too_large' }, 413);
      await ensureResources();
      const before = await getSpot(id);
      if (!before) return json(request, { ok: false, error: 'spot_not_found' }, 404);
      const extension = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg';
      const path = `1f/${id}-${Date.now()}.${extension}`;
      const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, { contentType: file.type, upsert: false, cacheControl: '3600' });
      if (uploadError) throw uploadError;
      const old = before.data?.imagePath;
      const next = { ...(before.data ?? {}), imageMode: 'custom', imagePath: path, imageName: text(file.name, 240), imageSize: file.size, imageWidth: number(form.get('width'), 0, 0, 30000), imageHeight: number(form.get('height'), 0, 0, 30000), isPublic: true };
      await saveSpot(id, before.title, next);
      if (old && old !== path) await deleteObject(old);
      return json(request, { ok: true, spot: { id, title: before.title, ...next, imageUrl: publicUrl(path) } });
    }

    const body = await request.json().catch(() => ({}));
    const action = text(body.action, 30);
    if (action === 'list') return json(request, { ok: true, spots: await rows(false) });
    const session = text(body.session, 256);
    if (!await authorized(session)) return json(request, { ok: false, error: 'unauthorized' }, 401);
    if (action === 'admin_list') return json(request, { ok: true, spots: await rows(true) });
    const id = text(body.spotId, 12);
    if (!ids.has(id)) return json(request, { ok: false, error: 'invalid_spot' }, 400);
    const before = await getSpot(id);
    if (!before) return json(request, { ok: false, error: 'spot_not_found' }, 404);

    if (action === 'save') {
      const patch = body.patch && typeof body.patch === 'object' ? body.patch : {};
      const old = before.data ?? {};
      const next = { ...old, x: number(patch.x, Number(old.x) || 50, 0, 100), y: number(patch.y, Number(old.y) || 50, 0, 100), sortOrder: number(patch.sortOrder, Number(old.sortOrder) || 1, 1, 99), connections: cleanConnections(patch.connections ?? old.connections), isPublic: patch.isPublic !== false };
      const title = text(patch.title ?? before.title, 120) || before.title;
      await saveSpot(id, title, next);
      return json(request, { ok: true, spot: { id, title, ...next, imageUrl: next.imageMode === 'custom' && next.imagePath ? publicUrl(String(next.imagePath)) : null } });
    }
    if (action === 'delete') {
      await deleteObject(before.data?.imagePath);
      const next = { ...(before.data ?? {}), imageMode: 'hidden', imagePath: null, imageName: null, imageSize: null, imageWidth: null, imageHeight: null, isPublic: false };
      await saveSpot(id, before.title, next);
      return json(request, { ok: true });
    }
    if (action === 'restore') {
      await deleteObject(before.data?.imagePath);
      const next = { ...(before.data ?? {}), imageMode: 'default', imagePath: null, imageName: null, imageSize: null, imageWidth: 3072, imageHeight: 1536, isPublic: true };
      await saveSpot(id, before.title, next);
      return json(request, { ok: true });
    }
    return json(request, { ok: false, error: 'unknown_action' }, 400);
  } catch (error) {
    console.error('blueblack-store-tour', error);
    return json(request, { ok: false, error: 'server_error', message: String((error as Error)?.message ?? error) }, 500);
  }
});
