import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

const rootDir = process.cwd();
const feedPath = path.join(rootDir, 'news', 'feed-data.json');
const cacheDir = path.join(rootDir, 'news', 'instagram-cache');
const accountUsername = process.env.INSTAGRAM_ACCOUNT_USERNAME?.trim() || 'blueblack_korea';
const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN?.trim();
const userId = process.env.INSTAGRAM_USER_ID?.trim();
const itemLimit = Math.max(1, Math.min(Number(process.env.INSTAGRAM_ITEM_LIMIT || 9), 12));

if (!accessToken) {
  throw new Error('INSTAGRAM_ACCESS_TOKEN is required. Add it as a GitHub Actions repository secret.');
}

await mkdir(cacheDir, { recursive: true });

const previousFeed = await readJson(feedPath, { updatedAt: null, items: [] });
const previousItems = Array.isArray(previousFeed.items) ? previousFeed.items : [];
const previousById = new Map(previousItems.map((item) => [String(item.id || ''), item]));
const existingCacheFiles = await safeReadDir(cacheDir);

const apiUrl = buildApiUrl();
const apiPayload = await fetchJson(apiUrl, 'Instagram API');
const rawItems = Array.isArray(apiPayload?.data) ? apiPayload.data : [];

if (!rawItems.length) {
  throw new Error('Instagram API returned no media. Existing feed data was preserved.');
}

const normalizedItems = [];

for (const media of rawItems) {
  if (normalizedItems.length >= itemLimit) break;
  if (!media?.id || !media?.permalink) continue;

  const mediaType = String(media.media_type || '').toUpperCase();
  const sourceImageUrl = media.thumbnail_url || media.media_url;
  const previous = previousById.get(String(media.id));

  if (!sourceImageUrl && !previous?.imageUrl) continue;

  let imageUrl = findExistingCacheUrl(media.id, existingCacheFiles);

  if (!imageUrl) {
    try {
      imageUrl = await downloadImage(media.id, sourceImageUrl);
      existingCacheFiles.push(path.basename(imageUrl));
    } catch (error) {
      if (previous?.imageUrl) {
        imageUrl = previous.imageUrl;
      } else {
        imageUrl = sourceImageUrl;
      }
      console.warn(`Could not cache media ${media.id}: ${error.message}`);
    }
  }

  normalizedItems.push({
    id: String(media.id),
    caption: String(media.caption || ''),
    mediaType,
    mediaProductType: String(media.media_product_type || ''),
    permalink: String(media.permalink),
    timestamp: String(media.timestamp || ''),
    imageUrl,
    thumbnailUrl: imageUrl,
    mediaUrl: imageUrl,
  });
}

if (!normalizedItems.length) {
  throw new Error('No displayable Instagram media was found. Existing feed data was preserved.');
}

await removeUnusedCacheFiles(normalizedItems);

const previousComparable = JSON.stringify(previousItems);
const nextComparable = JSON.stringify(normalizedItems);

if (previousComparable === nextComparable) {
  console.log(`Instagram feed is already current (${normalizedItems.length} posts).`);
  process.exit(0);
}

const nextFeed = {
  updatedAt: new Date().toISOString(),
  account: accountUsername,
  items: normalizedItems,
};

await writeFile(feedPath, `${JSON.stringify(nextFeed, null, 2)}\n`, 'utf8');
console.log(`Instagram feed updated with ${normalizedItems.length} posts.`);

function buildApiUrl() {
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
  url.searchParams.set('limit', String(Math.max(itemLimit, 12)));
  url.searchParams.set('access_token', accessToken);
  return url;
}

async function fetchJson(url, label) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25_000);

  try {
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'BlueBlack-Pen-Shop-Instagram-Sync/1.0',
      },
      signal: controller.signal,
    });

    const text = await response.text();
    let payload;

    try {
      payload = JSON.parse(text);
    } catch {
      throw new Error(`${label} returned an invalid JSON response.`);
    }

    if (!response.ok || payload?.error) {
      const message = payload?.error?.message || `${label} request failed with status ${response.status}.`;
      throw new Error(message);
    }

    return payload;
  } finally {
    clearTimeout(timeout);
  }
}

async function downloadImage(mediaId, sourceUrl) {
  if (!sourceUrl) throw new Error('No image or video thumbnail URL was provided.');

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);

  try {
    const response = await fetch(sourceUrl, {
      headers: {
        Accept: 'image/avif,image/webp,image/png,image/jpeg,*/*;q=0.8',
        'User-Agent': 'Mozilla/5.0 BlueBlack-Pen-Shop-Instagram-Sync/1.0',
      },
      redirect: 'follow',
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Image download failed with status ${response.status}.`);
    }

    const contentType = String(response.headers.get('content-type') || '').split(';')[0].trim().toLowerCase();
    const extension = extensionForContentType(contentType);

    if (!extension) {
      throw new Error(`Unsupported media content type: ${contentType || 'unknown'}.`);
    }

    const filename = `${sanitizeMediaId(mediaId)}.${extension}`;
    const targetPath = path.join(cacheDir, filename);
    const buffer = Buffer.from(await response.arrayBuffer());
    await writeFile(targetPath, buffer);
    return `./instagram-cache/${filename}`;
  } finally {
    clearTimeout(timeout);
  }
}

function extensionForContentType(contentType) {
  if (contentType === 'image/jpeg') return 'jpg';
  if (contentType === 'image/png') return 'png';
  if (contentType === 'image/webp') return 'webp';
  if (contentType === 'image/avif') return 'avif';
  return null;
}

function sanitizeMediaId(value) {
  return String(value).replace(/[^a-zA-Z0-9_-]/g, '_');
}

function findExistingCacheUrl(mediaId, files) {
  const prefix = `${sanitizeMediaId(mediaId)}.`;
  const filename = files.find((file) => file.startsWith(prefix));
  return filename ? `./instagram-cache/${filename}` : '';
}

async function removeUnusedCacheFiles(items) {
  const keep = new Set(
    items
      .map((item) => String(item.imageUrl || ''))
      .filter((url) => url.startsWith('./instagram-cache/'))
      .map((url) => path.basename(url)),
  );

  for (const filename of await safeReadDir(cacheDir)) {
    if (!keep.has(filename)) {
      await rm(path.join(cacheDir, filename), { force: true });
    }
  }
}

async function safeReadDir(directory) {
  try {
    return await readdir(directory);
  } catch {
    return [];
  }
}

async function readJson(filePath, fallback) {
  try {
    return JSON.parse(await readFile(filePath, 'utf8'));
  } catch {
    return fallback;
  }
}
