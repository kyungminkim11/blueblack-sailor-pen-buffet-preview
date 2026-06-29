from __future__ import annotations

import hashlib
import json
import math
import re
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from dataclasses import dataclass
from pathlib import Path
from urllib.parse import urljoin, urlparse, urlunparse

import requests
from bs4 import BeautifulSoup

BASE = "https://blueblack.co.kr"
CATEGORIES = [
    ("https://blueblack.co.kr/category/%EB%B3%91-%EC%9E%89%ED%81%AC/286/", "bottle"),
    ("https://blueblack.co.kr/category/%EC%B9%B4%ED%8A%B8%EB%A6%AC%EC%A7%80/201/", "cartridge"),
]
OUT = Path("src/ink-store-colors-generated.js")
REPORT = Path("ink-price/store-catalog-report.json")
HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; BlueBlackStoreGuide/2.0; +https://blueblack.co.kr/)",
    "Accept-Language": "ko-KR,ko;q=0.9,en;q=0.7",
}

BRANDS = [
    ("도미넌트 인더스트리", "Dominant Industry", ["DOMINANT INDUSTRY"]),
    ("페리스 휠 프레스", "Ferris Wheel Press", ["FERRIS WHEEL PRESS"]),
    ("그라폰 파버카스텔", "Graf von Faber-Castell", ["GRAF VON FABER CASTELL"]),
    ("잉크 인스티튜트", "Ink Institute", ["INK INSTITUTE"]),
    ("로버트 오스터", "Robert Oster", ["ROBERT OSTER"]),
    ("쟈크 에르뱅", "Jacques Herbin", ["JACQUES HERBIN"]),
    ("제이 에르뱅", "J. Herbin", ["J.HERBIN", "J.Herbin"]),
    ("칼라버스", "Colorverse", ["COLORVERSE", "컬러버스"]),
    ("글입다", "Wearingeul", ["WEARINGEUL", "웨어링글"]),
    ("세일러", "Sailor", ["SAILOR"]),
    ("디아민", "Diamine", ["DIAMINE"]),
    ("파이롯트", "Pilot", ["PILOT", "파일럿"]),
    ("플래티넘", "Platinum", ["PLATINUM"]),
    ("펠리칸", "Pelikan", ["PELIKAN"]),
    ("오로라", "Aurora", ["AURORA"]),
    ("비스콘티", "Visconti", ["VISCONTI"]),
    ("워터맨", "Waterman", ["WATERMAN"]),
    ("몬테베르데", "Monteverde", ["MONTEVERDE"]),
    ("몬테그라파", "Montegrappa", ["MONTEGRAPPA"]),
    ("누들러스", "Noodler's", ["NOODLER", "Noodler"]),
    ("카웨코", "Kaweco", ["KAWECO"]),
    ("파버카스텔", "Faber-Castell", ["FABER CASTELL", "Faber Castell"]),
    ("파카", "Parker", ["PARKER"]),
    ("쉐퍼", "Sheaffer", ["SHEAFFER", "셰퍼"]),
    ("수퍼5", "Super5", ["SUPER5", "슈퍼5"]),
    ("3오이스터스", "3 Oysters", ["3OYSTERS", "쓰리오이스터스"]),
    ("IWI", "IWI", ["아이더블유아이"]),
    ("잉크하우스", "INKHOUSE", ["INKHOUSE"]),
    ("잉크월", "INKWALL", ["INKWALL"]),
    ("빈타", "Vinta", ["VINTA"]),
    ("윙크", "Weenk", ["WEENK"]),
    ("태그 스테이셔너리", "TAG Stationery", ["TAG STATIONARY", "TAG Stationery"]),
    ("코베", "Kobe", ["KOBE"]),
    ("콘클린", "Conklin", ["CONKLIN"]),
    ("트위스비", "TWSBI", ["TWSBI"]),
    ("라미", "Lamy", ["LAMY"]),
    ("라반", "Laban", ["LABAN"]),
    ("디플로마트", "Diplomat", ["DIPLOMAT"]),
    ("프라이빗 리저브", "Private Reserve", ["PRIVATE RESERVE"]),
    ("오토후트", "Otto Hutt", ["OTTOHUTT"]),
    ("나왈", "Nahvalur", ["NAHVALUR"]),
    ("마존", "MAJOHN", ["MAJOHN"]),
    ("붕구박스", "BUNGUBOX", ["BUNGUBOX"]),
    ("펜하우스", "PENHOUSE", ["PENHOUSE"]),
    ("블루블랙펜샵", "BlueBlack", ["BLUEBLACK", "BlueBlack", "[BlueBlack]"]),
    ("오마스", "OMAS", ["OMAS"]),
    ("레논툴바", "Lennon Tool Bar", ["LENNON TOOL BAR"]),
]

COLOR_HEX = {
    "black": "#22252A", "블랙": "#22252A", "검정": "#22252A",
    "blueblack": "#243B5A", "블루블랙": "#243B5A", "blue black": "#243B5A",
    "blue": "#315E91", "블루": "#315E91", "파랑": "#315E91",
    "navy": "#273D66", "네이비": "#273D66",
    "turquoise": "#2F8D91", "터키옥": "#2F8D91", "터콰이즈": "#2F8D91",
    "green": "#3F704D", "그린": "#3F704D", "초록": "#3F704D",
    "olive": "#687144", "올리브": "#687144",
    "red": "#A84045", "레드": "#A84045", "빨강": "#A84045",
    "pink": "#C66A85", "핑크": "#C66A85",
    "orange": "#D06A2D", "오렌지": "#D06A2D",
    "yellow": "#D0A536", "옐로": "#D0A536", "노랑": "#D0A536",
    "purple": "#6F4A8E", "퍼플": "#6F4A8E", "violet": "#6F4A8E", "바이올렛": "#6F4A8E", "보라": "#6F4A8E",
    "brown": "#704A35", "브라운": "#704A35", "세피아": "#704A35",
    "grey": "#626B74", "gray": "#626B74", "그레이": "#626B74", "회색": "#626B74",
    "gold": "#A77B32", "골드": "#A77B32",
}

GENERIC_TERMS = [
    r"\[[^\]]*\]", r"\([^)]*개입[^)]*\)", r"\b\d+(?:\.\d+)?\s*ml\b",
    r"병\s*잉크", r"병잉크", r"잉크\s*카트리지", r"카트리지", r"만년필용", r"리필", r"잉크",
    r"샘플", r"한정판", r"신제품", r"신형", r"세트", r"컬렉션",
    r"스탠다드", r"쉬머링", r"쉬머", r"펄", r"캘리그라피", r"피그먼트", r"센티드",
]
GENERIC_SERIES = [
    "만요", "이로시주쿠", "시키오리", "잉크 스튜디오", "딥톤", "유라메쿠", "젠틀",
    "세계문학", "한국문학", "그리스 신화", "매직 포춘", "타이완 티", "인디고", "시리즈",
    "160주년", "150주년", "100주년", "4001", "에델슈타인", "클래식", "스탠다드",
]
EXCLUDE = ["샘플", "공병", "컨버터", "세척", "딥펜", "흐름 개선제", "아트 카드"]


@dataclass(frozen=True)
class Product:
    title: str
    url: str
    image: str
    form: str


def clean_space(value: str) -> str:
    return re.sub(r"\s+", " ", value or "").strip()


def absolute_url(value: str, base: str = BASE) -> str:
    if not value:
        return ""
    if value.startswith("//"):
        return "https:" + value
    return urljoin(base, value)


def canonical_url(value: str) -> str:
    parsed = urlparse(absolute_url(value))
    return urlunparse((parsed.scheme or "https", parsed.netloc or "blueblack.co.kr", parsed.path, "", "", ""))


def get(url: str, attempts: int = 4) -> str:
    last = None
    for attempt in range(attempts):
        try:
            response = requests.get(url, headers=HEADERS, timeout=30)
            response.raise_for_status()
            response.encoding = response.apparent_encoding or "utf-8"
            return response.text
        except Exception as exc:
            last = exc
            time.sleep(0.8 + attempt)
    raise RuntimeError(f"Failed to fetch {url}: {last}")


def identify_brand(title: str) -> tuple[str, str]:
    folded = title.casefold()
    for ko, en, aliases in sorted(BRANDS, key=lambda row: max([len(row[0]), len(row[1]), *map(len, row[2])]), reverse=True):
        for alias in [ko, en, *aliases]:
            if alias and alias.casefold() in folded:
                return ko, en
    first = clean_space(title).split(" ", 1)[0]
    return first or "기타", first or "Other"


def strip_brand(title: str, brand_ko: str, brand_en: str) -> str:
    value = title
    aliases = [brand_ko, brand_en]
    for row in BRANDS:
        if row[0] == brand_ko and row[1] == brand_en:
            aliases += row[2]
            break
    for alias in aliases:
        value = re.sub(re.escape(alias), " ", value, flags=re.I)
    return clean_space(value)


def clean_color_name(title: str, brand_ko: str, brand_en: str) -> str:
    value = strip_brand(title, brand_ko, brand_en)
    for pattern in GENERIC_TERMS:
        value = re.sub(pattern, " ", value, flags=re.I)
    value = clean_space(value.strip("-–—·/ "))
    return value


def infer_hex(name: str) -> str | None:
    folded = name.casefold()
    for key, value in COLOR_HEX.items():
        if key.casefold() in folded:
            return value
    return None


def listing_products(html: str, form: str) -> list[Product]:
    soup = BeautifulSoup(html, "html.parser")
    nodes = soup.select("li[id^='anchorBoxId_']") or soup.select("ul.prdList > li")
    products = []
    for node in nodes:
        name_link = next((a for a in node.select("a[href*='/product/']") if clean_space(a.get_text(" ", strip=True))), None)
        if not name_link:
            continue
        title = clean_space(name_link.get_text(" ", strip=True)).replace("상품명 :", "").strip()
        if not title or any(word in title for word in EXCLUDE):
            continue
        image_node = node.select_one("img")
        image = absolute_url((image_node.get("data-original") or image_node.get("data-src") or image_node.get("src") or "") if image_node else "")
        products.append(Product(title=title, url=canonical_url(name_link.get("href", "")), image=image, form=form))
    return products


def category_page_count(first_html: str) -> int:
    text = BeautifulSoup(first_html, "html.parser").get_text(" ", strip=True)
    match = re.search(r"등록\s*제품\s*:\s*([\d,]+)\s*개", text)
    total = int(match.group(1).replace(",", "")) if match else 120
    return min(120, max(1, math.ceil(total / 12)))


def crawl_category(category_url: str, form: str) -> list[Product]:
    first_url = category_url + ("&" if "?" in category_url else "?") + "page=1"
    first_html = get(first_url)
    pages = category_page_count(first_html)
    found = {product.url: product for product in listing_products(first_html, form)}
    print(f"[{form}] expected pages: {pages}")
    with ThreadPoolExecutor(max_workers=12) as executor:
        futures = {}
        for page in range(2, pages + 1):
            url = category_url + ("&" if "?" in category_url else "?") + f"page={page}"
            futures[executor.submit(get, url)] = page
        for future in as_completed(futures):
            page = futures[future]
            try:
                for product in listing_products(future.result(), form):
                    found[product.url] = product
            except Exception as exc:
                print(f"listing page {page} failed: {exc}")
    print(f"[{form}] collected products: {len(found)}")
    return list(found.values())


def clean_option(value: str) -> str:
    value = clean_space(value)
    value = re.sub(r"^[\-–—·•\s]+", "", value)
    value = re.sub(r"\s*[\(\[]?[+\-]?\s*[\d,]+\s*원[\)\]]?\s*$", "", value)
    value = re.sub(r"\s*\(품절\)\s*$", "", value)
    value = re.sub(r"^\d+[.)]\s*", "", value)
    return clean_space(value)


def detail_options(product: Product) -> tuple[list[str], str]:
    try:
        soup = BeautifulSoup(get(product.url), "html.parser")
    except Exception as exc:
        print(f"detail failed: {product.url}: {exc}")
        return [], product.image
    values = []
    for node in soup.select(".xans-product-option select option, select[id^='product_option_id'] option, .ec-product-button li a span, .xans-product-option .ec-product-button li"):
        value = clean_option(node.get_text(" ", strip=True))
        if not value or "옵션을 선택" in value or value in {"옵션선택", "선택", "필수"}:
            continue
        if re.fullmatch(r"[A-Z]-[A-Z]", value) or re.fullmatch(r"\d+\s*(?:개|ml)", value, re.I):
            continue
        values.append(value)
    image_node = soup.select_one("meta[property='og:image'], #bigImage, .keyImg img")
    image = product.image
    if image_node:
        image = absolute_url(image_node.get("content") or image_node.get("src") or image)
    deduped = []
    seen = set()
    for value in values:
        key = value.casefold()
        if key not in seen:
            seen.add(key)
            deduped.append(value)
    return deduped, image


def needs_detail(product: Product, cleaned: str) -> bool:
    if not cleaned or len(cleaned) < 3:
        return True
    if any(term.casefold() in product.title.casefold() for term in GENERIC_SERIES):
        return True
    return False


def make_row(product: Product, name: str, image: str, brand_ko: str, brand_en: str) -> dict:
    fingerprint = f"{brand_en}|{product.form}|{name}|{product.url}".casefold()
    volume_match = re.search(r"\b\d+(?:\.\d+)?\s*ml\b", product.title, re.I)
    return {
        "id": "store-" + hashlib.sha1(fingerprint.encode("utf-8")).hexdigest()[:14],
        "brandKo": brand_ko,
        "brandEn": brand_en,
        "form": product.form,
        "volume": volume_match.group(0).lower() if volume_match else None,
        "nameKo": name,
        "nameEn": name,
        "nameJa": name,
        "nameZhHans": name,
        "nameZhHant": name,
        "hex": infer_hex(name),
        "image": image,
        "productTitle": product.title,
        "productUrl": product.url,
        "source": "blueblack-store",
    }


def build_rows(products: list[Product]) -> list[dict]:
    rows = []
    generic = []
    for product in products:
        brand_ko, brand_en = identify_brand(product.title)
        cleaned = clean_color_name(product.title, brand_ko, brand_en)
        if needs_detail(product, cleaned):
            generic.append((product, brand_ko, brand_en, cleaned))
        else:
            rows.append(make_row(product, cleaned, product.image, brand_ko, brand_en))
    print(f"Generic products requiring option lookup: {len(generic)}")
    with ThreadPoolExecutor(max_workers=14) as executor:
        futures = {executor.submit(detail_options, product): (product, brand_ko, brand_en, cleaned) for product, brand_ko, brand_en, cleaned in generic}
        for future in as_completed(futures):
            product, brand_ko, brand_en, cleaned = futures[future]
            options, image = future.result()
            names = options or ([cleaned] if cleaned else [])
            for name in names:
                rows.append(make_row(product, name, image, brand_ko, brand_en))
    return rows


def dedupe(rows: list[dict]) -> list[dict]:
    result = []
    seen = set()
    for row in rows:
        key = (row["brandEn"].casefold(), row["form"], clean_space(row["nameKo"]).casefold())
        if not row["nameKo"] or key in seen:
            continue
        seen.add(key)
        result.append(row)
    return sorted(result, key=lambda row: (row["brandEn"].casefold(), row["form"], row["nameKo"].casefold()))


def main() -> None:
    products = {}
    for category_url, form in CATEGORIES:
        for product in crawl_category(category_url, form):
            products[product.url] = product
    rows = dedupe(build_rows(list(products.values())))
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text("// Auto-generated from BlueBlack bottle-ink and cartridge pages.\nexport const INK_STORE_COLORS = " + json.dumps(rows, ensure_ascii=False, indent=2) + ";\n", encoding="utf-8")
    brands = sorted({row["brandEn"] for row in rows})
    REPORT.parent.mkdir(parents=True, exist_ok=True)
    REPORT.write_text(json.dumps({"products": len(products), "colors": len(rows), "brands": brands}, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Generated {len(rows)} colors across {len(brands)} brands from {len(products)} products")


if __name__ == "__main__":
    main()
