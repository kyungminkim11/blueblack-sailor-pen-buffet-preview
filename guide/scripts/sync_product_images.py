#!/usr/bin/env python3
"""Download official BlueBlack product galleries and generate the browser image map."""

from __future__ import annotations

import io
import json
import re
import sys
from pathlib import Path
from typing import Iterable
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[2]
GUIDE = ROOT / "guide"
DATA_EXPORTS = [
    (GUIDE / "data" / "catalog.js", "products"),
    (GUIDE / "data" / "premium.js", "premiumProducts"),
    (GUIDE / "data" / "expanded-products.js", "expandedProducts"),
]
OUTPUT_DIR = GUIDE / "assets" / "products"
OUTPUT_MAP = GUIDE / "data" / "product-images.js"
TIMEOUT = 30
MAX_IMAGES = 4
USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/126.0 Safari/537.36 BlueBlackGuideImageSync/2.1"
)

PRODUCT_PATTERN = re.compile(
    r"\{id:'(?P<id>[^']+)'.*?name:'(?P<name>[^']+)'.*?url:'(?P<url>https?://[^']+)'",
    re.DOTALL,
)


def extract_exported_array(text: str, export_name: str) -> str:
    """Return only one exported JS array, excluding guide and scenario objects."""
    marker = f"export const {export_name}=["
    start = text.find(marker)
    if start < 0:
        raise ValueError(f"export {export_name!r} was not found")
    content_start = start + len(marker)
    end = text.find("\n];", content_start)
    if end < 0:
        raise ValueError(f"export {export_name!r} has no closing array")
    return text[content_start:end]


def iter_products() -> Iterable[dict[str, str]]:
    seen: set[str] = set()
    for path, export_name in DATA_EXPORTS:
        if not path.exists():
            continue
        text = path.read_text(encoding="utf-8")
        section = extract_exported_array(text, export_name)
        for match in PRODUCT_PATTERN.finditer(section):
            item = match.groupdict()
            if item["id"] in seen:
                continue
            seen.add(item["id"])
            yield item


def valid_image_url(value: str, page_url: str) -> str | None:
    value = value.strip()
    if not value or value.startswith(("data:", "javascript:")):
        return None
    absolute = urljoin(page_url, value)
    parsed = urlparse(absolute)
    if parsed.scheme not in {"http", "https"}:
        return None
    lowered = absolute.lower()
    if any(token in lowered for token in ("icon", "logo", "btn_", "spinner", "loading", "blank.gif")):
        return None
    return absolute


def select_image_urls(html: str, page_url: str) -> list[str]:
    soup = BeautifulSoup(html, "html.parser")
    candidates: list[str] = []

    single_selectors = [
        ('meta[property="og:image"]', "content"),
        ('meta[name="twitter:image"]', "content"),
        ('link[rel="image_src"]', "href"),
        ("img.BigImage", "src"),
        ("img#zoom_image", "src"),
        (".keyImg img", "src"),
    ]
    for selector, attr in single_selectors:
        node = soup.select_one(selector)
        if node and node.get(attr):
            candidate = valid_image_url(str(node.get(attr)), page_url)
            if candidate:
                candidates.append(candidate)

    gallery_selectors = [
        ".xans-product-addimage img",
        ".xans-product-image img",
        ".thumbnail img",
        ".prdImg img",
        "ul.slides img",
    ]
    attributes = ("data-src", "ec-data-src", "data-original", "big", "src")
    for selector in gallery_selectors:
        for node in soup.select(selector):
            for attr in attributes:
                if not node.get(attr):
                    continue
                candidate = valid_image_url(str(node.get(attr)), page_url)
                if candidate:
                    candidates.append(candidate)
                    break

    unique: list[str] = []
    signatures: set[str] = set()
    for candidate in candidates:
        signature = re.sub(r"/(small|medium|big)/", "/SIZE/", candidate)
        signature = signature.split("?", 1)[0]
        if signature in signatures:
            continue
        signatures.add(signature)
        unique.append(candidate)
        if len(unique) >= MAX_IMAGES:
            break
    return unique


def download_image(session: requests.Session, image_url: str) -> Image.Image:
    response = session.get(image_url, timeout=TIMEOUT)
    response.raise_for_status()
    image = Image.open(io.BytesIO(response.content))
    image = ImageOps.exif_transpose(image).convert("RGBA")

    if image.getextrema()[3] == (255, 255):
        image = image.convert("RGB")
    else:
        canvas = Image.new("RGBA", image.size, (255, 255, 255, 0))
        canvas.alpha_composite(image)
        image = canvas

    image.thumbnail((1200, 1200), Image.Resampling.LANCZOS)
    return image


def save_webp(image: Image.Image, destination: Path) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    image.save(destination, "WEBP", quality=88, method=6)


def js_string(value: object) -> str:
    return json.dumps(value, ensure_ascii=False, separators=(",", ":"))


def write_map(records: list[dict[str, object]]) -> None:
    lines = [
        "// Generated by guide/scripts/sync_product_images.py",
        "// Do not edit image paths manually; update the product URL and rerun the workflow.",
        "export const productImages={",
    ]
    for record in sorted(records, key=lambda item: str(item["id"])):
        lines.append(
            f"  {js_string(record['id'])}:{{"
            f"src:{js_string(record['src'])},"
            f"source:{js_string(record['source'])},"
            f"gallery:{js_string(record['gallery'])},"
            f"alt:{js_string(record['name'])}"
            "},"
        )
    lines.append("};")
    lines.append("")
    OUTPUT_MAP.write_text("\n".join(lines), encoding="utf-8")


def gallery_files(product_id: str) -> list[Path]:
    pattern = re.compile(rf"^{re.escape(product_id)}(?:-(\d+))?\.webp$")
    matches = [path for path in OUTPUT_DIR.glob("*.webp") if pattern.match(path.name)]

    def order(path: Path) -> tuple[int, str]:
        match = pattern.match(path.name)
        number = int(match.group(1)) if match and match.group(1) else 1
        return number, path.name

    return sorted(matches, key=order)


def existing_gallery(product_id: str) -> list[str]:
    return [f"./assets/products/{path.name}" for path in gallery_files(product_id)]


def remove_stale_images(valid_ids: set[str]) -> None:
    valid_paths = {path for product_id in valid_ids for path in gallery_files(product_id)}
    for path in OUTPUT_DIR.glob("*.webp"):
        if path in valid_paths:
            continue
        print(f"Removing stale image: {path.name}")
        path.unlink()


def main() -> int:
    products = list(iter_products())
    if not products:
        print("No product records found", file=sys.stderr)
        return 1

    valid_ids = {product["id"] for product in products}
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    remove_stale_images(valid_ids)

    session = requests.Session()
    session.headers.update({
        "User-Agent": USER_AGENT,
        "Accept-Language": "ko-KR,ko;q=0.9,en;q=0.7",
    })

    records: list[dict[str, object]] = []
    failures: list[str] = []

    for index, product in enumerate(products, start=1):
        product_id = product["id"]
        print(f"[{index}/{len(products)}] {product_id}")
        try:
            page = session.get(product["url"], timeout=TIMEOUT)
            page.raise_for_status()
            image_urls = select_image_urls(page.text, product["url"])
            if not image_urls:
                raise RuntimeError("official product image was not found")

            local_gallery: list[str] = []
            successful_sources: list[str] = []
            for image_index, image_url in enumerate(image_urls, start=1):
                suffix = "" if image_index == 1 else f"-{image_index}"
                destination = OUTPUT_DIR / f"{product_id}{suffix}.webp"
                try:
                    image = download_image(session, image_url)
                    save_webp(image, destination)
                    local_gallery.append(f"./assets/products/{destination.name}")
                    successful_sources.append(image_url)
                except Exception as image_error:
                    print(f"  gallery warning ({image_index}): {image_error}", file=sys.stderr)

            if not local_gallery:
                raise RuntimeError("all official image downloads failed")

            keep_names = {Path(item).name for item in local_gallery}
            for old_path in gallery_files(product_id):
                if old_path.name not in keep_names:
                    old_path.unlink()

            records.append({
                "id": product_id,
                "name": product["name"],
                "src": local_gallery[0],
                "source": successful_sources[0] if successful_sources else "",
                "gallery": local_gallery,
            })
        except Exception as exc:
            print(f"  warning: {exc}", file=sys.stderr)
            failures.append(product_id)
            gallery = existing_gallery(product_id)
            if gallery:
                records.append({
                    "id": product_id,
                    "name": product["name"],
                    "src": gallery[0],
                    "source": "",
                    "gallery": gallery[:MAX_IMAGES],
                })

    write_map(records)
    print(f"Synced {len(records)} of {len(products)} product galleries")
    if failures:
        print("Failed: " + ", ".join(failures), file=sys.stderr)

    return 0 if records else 1


if __name__ == "__main__":
    raise SystemExit(main())
