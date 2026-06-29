from __future__ import annotations

import json
import re
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from urllib.parse import urljoin

import requests
from bs4 import BeautifulSoup

PATH = Path('src/ink-store-colors-generated.js')
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (compatible; BlueBlackStoreGuide/2.2; +https://blueblack.co.kr/)',
    'Accept-Language': 'ko-KR,ko;q=0.9,en;q=0.7',
}

BRAND_RULES = [
    ('모나미', '모나미', 'Monami'),
    ('교토', '교토 TAG', 'TAG Stationery'),
    ('그라폰', '그라폰 파버카스텔', 'Graf von Faber-Castell'),
    ('매뉴스크립트', '매뉴스크립트', 'Manuscript'),
    ('쓰리오', '3오이스터스', '3 Oysters'),
    ('자크허빈(쟈크허빈)', '쟈크 에르뱅', 'Jacques Herbin'),
    ('쟈크허빈', '쟈크 에르뱅', 'Jacques Herbin'),
    ('자크허빈(제이허빈)', '제이 에르뱅', 'J. Herbin'),
    ('제이허빈', '제이 에르뱅', 'J. Herbin'),
    ('페리스휠', '페리스 휠 프레스', 'Ferris Wheel Press'),
]

BAD_IMAGE_TOKENS = (
    'store_logo', '/web/upload/icon_', 'blank.gif', 'spacer.gif', 'common/',
    'btn_', 'ico_', 'icon_', 'loading', 'logo.', 'logo_', 'ec-base',
)
PREFERRED_IMAGE_TOKENS = ('/web/product/', '/web/upload/nneditor/', '/web/upload/product/', '/product/')


def load_rows():
    text = PATH.read_text(encoding='utf-8')
    match = re.search(r'export const INK_STORE_COLORS\s*=\s*(\[.*\]);\s*$', text, re.S)
    if not match:
        raise RuntimeError('Could not parse generated ink catalog')
    return json.loads(match.group(1))


def save_rows(rows):
    PATH.write_text(
        '// Auto-generated from BlueBlack bottle-ink and cartridge pages.\n'
        'export const INK_STORE_COLORS = ' + json.dumps(rows, ensure_ascii=False, indent=2) + ';\n',
        encoding='utf-8',
    )


def normalize_brand(row):
    title = ' '.join(str(row.get(key, '')) for key in ('productTitle', 'brandKo', 'brandEn'))
    for needle, ko, en in BRAND_RULES:
        if needle.casefold() in title.casefold():
            row['brandKo'] = ko
            row['brandEn'] = en
            break


def image_value(node, page_url):
    value = node.get('content') or node.get('data-original') or node.get('data-src') or node.get('src') or ''
    if not value:
        return ''
    if value.startswith('//'):
        value = 'https:' + value
    else:
        value = urljoin(page_url, value)
    value = value.replace('http://blueblack.co.kr', 'https://blueblack.co.kr')
    lowered = value.casefold()
    if any(token in lowered for token in BAD_IMAGE_TOKENS):
        return ''
    return value


def fetch_image(url):
    try:
        response = requests.get(url, headers=HEADERS, timeout=25)
        response.raise_for_status()
        response.encoding = response.apparent_encoding or 'utf-8'
        soup = BeautifulSoup(response.text, 'html.parser')
        selectors = [
            '.xans-product-detail .keyImg img', '.keyImg img', '#bigImage', 'img.BigImage',
            '.xans-product-detail .thumbnail img', '.thumbnail img',
            "meta[property='og:image']", "meta[name='twitter:image']",
        ]
        candidates = []
        for selector in selectors:
            for node in soup.select(selector):
                value = image_value(node, url)
                if value and value not in candidates:
                    candidates.append(value)
        if not candidates:
            for node in soup.select('img'):
                value = image_value(node, url)
                if value:
                    candidates.append(value)
        if not candidates:
            return url, ''
        preferred = next((value for value in candidates if any(token in value.casefold() for token in PREFERRED_IMAGE_TOKENS)), '')
        return url, preferred or candidates[0]
    except Exception as exc:
        print(f'image fetch failed: {url}: {exc}')
        return url, ''


def main():
    rows = load_rows()
    for row in rows:
        normalize_brand(row)
    urls = sorted({row.get('productUrl') for row in rows if row.get('productUrl')})
    images = {}
    with ThreadPoolExecutor(max_workers=14) as executor:
        futures = [executor.submit(fetch_image, url) for url in urls]
        for future in as_completed(futures):
            url, image = future.result()
            if image:
                images[url] = image
    fixed = 0
    for row in rows:
        image = images.get(row.get('productUrl'))
        if image:
            row['image'] = image
            fixed += 1
        elif any(token in str(row.get('image', '')).casefold() for token in BAD_IMAGE_TOKENS):
            row['image'] = ''
        elif str(row.get('image', '')).startswith('http://'):
            row['image'] = row['image'].replace('http://', 'https://', 1)
    rows.sort(key=lambda row: (str(row.get('brandEn', '')).casefold(), row.get('form', ''), str(row.get('nameKo', '')).casefold()))
    save_rows(rows)
    print(f'Normalized {len(rows)} catalog rows and refreshed {fixed} product images')


if __name__ == '__main__':
    main()
