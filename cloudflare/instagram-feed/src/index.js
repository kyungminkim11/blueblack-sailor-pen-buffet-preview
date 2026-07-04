const FEED_OBJECT_KEY = 'feed.json';
const MEDIA_PREFIX = 'media/';
const DEFAULT_ITEM_LIMIT = 9;
const MAX_ITEM_LIMIT = 12;

export default {
  async fetch(request, env, context) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(env) });
    }

    if (request.method === 'GET' && (url.pathname === '/' || url.pathname === '/feed.json')) {
      return serveFeed(env);
    }

    if (request.method === 'GET' && url.pathname.startsWith('/media/')) {
      return serveMedia(url.pathname, env);
    }

    if (request.method === 'GET' && url.pathname === '/health') {
      const feed = await readStoredFeed(env);
      return jsonResponse(
        {
          ok: Boolean(feed?.items?.length),
          updatedAt: feed?.updatedAt || null,
          itemCount: Array.isArray(feed?.items) ? feed.items.length : 0,
        },
        feed?.items?.length ? 200 : 503,
        env,
      );
    }

    if (request.method === 'POST' && url.pathname === '/refresh') {
      if (!env.REFRESH_SECRET || request.headers.get('authorization') !== `Bearer ${env.REFRESH_SECRET}`) {
        return jsonResponse({ ok: false, error: 'Unauthorized' }, 401, env);
      }

      try {
        const result = await syncInstagramFeed(env);
        return jsonResponse({ ok: true, ...result }, 200, env);
      } catch (error) {
        console.error('Manual Instagram refresh failed', error);
        return jsonResponse({ ok: false, error: errorMessage(error) }, 500, env);
      }
    }

    return jsonResponse({ ok: false, error: 'Not found' }, 404, env);
  },

  async scheduled(_controller, env, context) {
    context.waitUntil(
      syncInstagramFeed(env).catch((error) => {
        console.error('Scheduled Instagram refresh failed', error);
      }),
    );
  },
};

async function syncInstagramFeed(env) {
  const accessToken = String(env.INSTAGRAM_ACCESS_TOKEN || '').trim();
  const userId = String(env.INSTAGRAM_USER_ID || '').trim();
  const account = String(env.INSTAGRAM_ACCOUNT_USERNAME || 'blueblack_korea').trim();
  const itemLimit = clampItemLimit(env.INSTAGRAM_ITEM_LIMIT);

  if (!accessToken) {
    throw new Error('INSTAGRAM_ACCESS_TOKEN is not configured.');
  }

  const apiUrl = buildInstagramApiUrl({ accessToken, userId, itemLimit });
  const response = await fetch(apiUrl, {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'BlueBlack-Instagram-Feed/1.0',
    },
  });

  const payload = await parseJsonResponse(response, 'Instagram API');
  if (!response.ok || payload?.error) {
    throw new Error(payload?.error?.message || `Instagram API request failed with status ${response.status}.`);
  }

  const mediaItems = Array.isArray(payload?.data) ? payload.data : [];
  if (!mediaItems.length) {
    throw new Error('Instagram API returned no media. Existing feed data was preserved.');
  }

  const previousFeed = await readStoredFeed(env);
  const previousById = new Map(
    (Array.isArray(previousFeed?.items) ? previousFeed.items : []).map((item) => [String(item.id || ''), item]),
  );
  const nextItems = [];
  const keepMediaKeys = new Set();

  for (const media of mediaItems) {
    if (nextItems.length >= itemLimit) break;
    if (!media?.id || !media?.permalink) continue;

    const mediaId = String(media.id);
    const mediaKey = `${MEDIA_PREFIX}${sanitizeMediaId(mediaId)}`;
    const sourceImageUrl = media.thumbnail_url || media.media_url;
    const previousItem = previousById.get(mediaId);
    let hasStoredImage = Boolean(await env.INSTAGRAM_BUCKET.head(mediaKey));

    if (!hasStoredImage && sourceImageUrl) {
      try {
        await cacheInstagramImage(sourceImageUrl, mediaKey, env);
        hasStoredImage = true;
      } catch (error) {
        console.warn(`Could not cache Instagram media ${mediaId}: ${errorMessage(error)}`);
      }
    }

    if (!hasStoredImage && previousItem?.imageUrl) {
      const previousKey = mediaKeyFromUrl(previousItem.imageUrl);
      if (previousKey && (await env.INSTAGRAM_BUCKET.head(previousKey))) {
        keepMediaKeys.add(previousKey);
        nextItems.push({ ...previousItem });
        continue;
      }
    }

    if (!hasStoredImage) continue;

    keepMediaKeys.add(mediaKey);
    nextItems.push({
      id: mediaId,
      caption: String(media.caption || ''),
      mediaType: String(media.media_type || '').toUpperCase(),
      mediaProductType: String(media.media_product_type || ''),
      permalink: String(media.permalink),
      timestamp: String(media.timestamp || ''),
      imageUrl: `/media/${encodeURIComponent(sanitizeMediaId(mediaId))}`,
    });
  }

  if (!nextItems.length) {
    throw new Error('No displayable Instagram media could be prepared. Existing feed data was preserved.');
  }

  const previousComparable = JSON.stringify(previousFeed?.items || []);
  const nextComparable = JSON.stringify(nextItems);

  if (previousComparable === nextComparable) {
    return {
      changed: false,
      itemCount: nextItems.length,
      updatedAt: previousFeed?.updatedAt || null,
    };
  }

  const nextFeed = {
    updatedAt: new Date().toISOString(),
    account,
    items: nextItems,
  };

  await env.INSTAGRAM_BUCKET.put(FEED_OBJECT_KEY, JSON.stringify(nextFeed), {
    httpMetadata: {
      contentType: 'application/json; charset=utf-8',
      cacheControl: 'public, max-age=300, stale-while-revalidate=3600',
    },
  });

  await removeUnusedMedia(keepMediaKeys, env);

  return {
    changed: true,
    itemCount: nextItems.length,
    updatedAt: nextFeed.updatedAt,
  };
}

function buildInstagramApiUrl({ accessToken, userId, itemLimit }) {
  const fields = [
    'id',
    'caption',
    'media_type',
    'media_product_type',
    'media_url',
    'permalink',
    'thumbnail_url',
    'timestamp',
  ].join(',');

  const baseUrl = userId ? 'https://graph.facebook.com' : 'https://graph.instagram.com';
  const pathname = userId ? `/${encodeURIComponent(userId)}/media` : '/me/media';
  const url = new URL(pathname, baseUrl);
  url.searchParams.set('fields', fields);
  url.searchParams.set('limit', String(Math.max(itemLimit, MAX_ITEM_LIMIT)));
  url.searchParams.set('access_token', accessToken);
  return url;
}

async function cacheInstagramImage(sourceUrl, mediaKey, env) {
  const response = await fetch(sourceUrl, {
    headers: {
      Accept: 'image/avif,image/webp,image/png,image/jpeg,*/*;q=0.8',
      'User-Agent': 'Mozilla/5.0 BlueBlack-Instagram-Feed/1.0',
    },
    redirect: 'follow',
  });

  if (!response.ok || !response.body) {
    throw new Error(`Image download failed with status ${response.status}.`);
  }

  const contentType = String(response.headers.get('content-type') || '').split(';')[0].trim().toLowerCase();
  if (!contentType.startsWith('image/')) {
    throw new Error(`Unsupported media content type: ${contentType || 'unknown'}.`);
  }

  await env.INSTAGRAM_BUCKET.put(mediaKey, response.body, {
    httpMetadata: {
      contentType,
      cacheControl: 'public, max-age=2592000, immutable',
    },
  });
}

async function serveFeed(env) {
  const object = await env.INSTAGRAM_BUCKET.get(FEED_OBJECT_KEY);
  if (!object) {
    return jsonResponse(
      {
        updatedAt: null,
        account: String(env.INSTAGRAM_ACCOUNT_USERNAME || 'blueblack_korea'),
        items: [],
      },
      503,
      env,
    );
  }

  const headers = new Headers(corsHeaders(env));
  object.writeHttpMetadata(headers);
  headers.set('content-type', 'application/json; charset=utf-8');
  headers.set('cache-control', 'public, max-age=300, stale-while-revalidate=3600');
  headers.set('etag', object.httpEtag);
  return new Response(object.body, { status: 200, headers });
}

async function serveMedia(pathname, env) {
  const encodedKey = pathname.slice('/media/'.length);
  let mediaId;

  try {
    mediaId = decodeURIComponent(encodedKey);
  } catch {
    return jsonResponse({ ok: false, error: 'Invalid media path' }, 400, env);
  }

  if (!mediaId || !/^[a-zA-Z0-9_-]+$/.test(mediaId)) {
    return jsonResponse({ ok: false, error: 'Invalid media path' }, 400, env);
  }

  const object = await env.INSTAGRAM_BUCKET.get(`${MEDIA_PREFIX}${mediaId}`);
  if (!object) {
    return jsonResponse({ ok: false, error: 'Media not found' }, 404, env);
  }

  const headers = new Headers(corsHeaders(env));
  object.writeHttpMetadata(headers);
  headers.set('cache-control', 'public, max-age=2592000, immutable');
  headers.set('etag', object.httpEtag);
  return new Response(object.body, { status: 200, headers });
}

async function readStoredFeed(env) {
  const object = await env.INSTAGRAM_BUCKET.get(FEED_OBJECT_KEY);
  if (!object) return null;

  try {
    return JSON.parse(await object.text());
  } catch {
    return null;
  }
}

async function removeUnusedMedia(keepMediaKeys, env) {
  let cursor;

  do {
    const result = await env.INSTAGRAM_BUCKET.list({ prefix: MEDIA_PREFIX, cursor });
    const staleKeys = result.objects.map((object) => object.key).filter((key) => !keepMediaKeys.has(key));

    if (staleKeys.length) {
      await env.INSTAGRAM_BUCKET.delete(staleKeys);
    }

    cursor = result.truncated ? result.cursor : undefined;
  } while (cursor);
}

function mediaKeyFromUrl(value) {
  const match = String(value || '').match(/\/media\/([a-zA-Z0-9_-]+)$/);
  return match ? `${MEDIA_PREFIX}${match[1]}` : '';
}

function sanitizeMediaId(value) {
  return String(value).replace(/[^a-zA-Z0-9_-]/g, '_');
}

function clampItemLimit(value) {
  const parsed = Number(value || DEFAULT_ITEM_LIMIT);
  if (!Number.isFinite(parsed)) return DEFAULT_ITEM_LIMIT;
  return Math.max(1, Math.min(Math.floor(parsed), MAX_ITEM_LIMIT));
}

async function parseJsonResponse(response, label) {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`${label} returned invalid JSON.`);
  }
}

function corsHeaders(env) {
  return {
    'access-control-allow-origin': String(env.ALLOWED_ORIGIN || '*'),
    'access-control-allow-methods': 'GET, POST, OPTIONS',
    'access-control-allow-headers': 'authorization, content-type',
    'access-control-max-age': '86400',
    'x-content-type-options': 'nosniff',
  };
}

function jsonResponse(payload, status, env) {
  const headers = new Headers(corsHeaders(env));
  headers.set('content-type', 'application/json; charset=utf-8');
  headers.set('cache-control', status === 200 ? 'no-store' : 'no-store');
  return new Response(JSON.stringify(payload), { status, headers });
}

function errorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}
