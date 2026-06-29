from __future__ import annotations

import hashlib
import json
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
    "User-Agent": "Mozilla/5.0 (compatible; BlueBlackStoreGuide/1.0; +https://blueblack.co.kr/)",
    "Accept-Language": "ko-KR,ko;q=0.9,en;q=0.7",
}

BRANDS = [
    ("도미넌트 인더스트리", "Dominant Industry", ["DOMINANT INDUSTRY"]),
    ("페리스 휠 프레스", "Ferris Wheel Press", ["FERRIS WHEEL PRESS", "Ferris Wheel Press"]),
    ("그라폰 파버카스텔", "Graf von Faber-Castell", ["GRAF VON FABER CASTELL", "Graf von Faber-Castell"]),
    ("잉크 인스티튜트", "Ink Institute", ["INK INSTITUTE", "Ink Institute"]),
    ("로버트 오스터", "Robert Oster", ["ROBERT OSTER", "Robert Oster"]),
    ("쟈크 에르뱅", "Jacques Herbin", ["JACQUES HERBIN", "Jacques Herbin"]),
    ("제이 에르뱅", "J. Herbin", ["J.HERBIN", "J. Herbin", "J.Herbin"]),
    ("도미넌트", "Dominant Industry", []),
    ("칼라버스", "Colorverse", ["COLORVERSE", "Colorverse"]),
    ("컬러버스", "Colorverse", []),
    ("글입다", "Wearingeul", ["WEARINGEUL", "Wearingeul"]),
    ("웨어링글", "Wearingeul", []),
    ("세일러", "Sailor", ["SAILOR", "Sailor"]),
    ("디아민", "Diamine", ["DIAMINE", "Diamine"]),
    ("파이롯트", "Pilot", ["PILOT", "Pilot", "파일럿"]),
    ("플래티넘", "Platinum", ["PLATINUM", "Platinum"]),
    ("펠리칸", "Pelikan", ["PELIKAN", "Pelikan"]),
    ("오로라", "Aurora", ["AURORA", "Aurora"]),
    ("비스콘티", "Visconti", ["VISCONTI", "Visconti"]),
    ("워터맨", "Waterman", ["WATERMAN", "Waterman"]),
    ("몬테베르데", "Monteverde", ["MONTEVERDE", "Monteverde"]),
    ("몬테그라파", "Montegrappa", ["MONTEGRAPPA", "Montegrappa"]),
    ("누들러스", "Noodler's", ["NOODLER", "Noodler", "Noodler's"]),
    ("카웨코", "Kaweco", ["KAWECO", "Kaweco"]),
    ("파버카스텔", "Faber-Castell", ["FABER CASTELL", "Faber Castell", "Faber-Castell"]),
    ("파카", "Parker", ["PARKER", "Parker"]),
    ("쉐퍼", "Sheaffer", ["SHEAFFER", "Sheaffer", "셰퍼"]),
    ("수퍼5", "Super5", ["SUPER5", "Super5", "슈퍼5"]),
    ("3오이스터스", "3 Oysters", ["3OYSTERS", "3 Oysters", "쓰리오이스터스"]),
    ("IWI", "IWI", ["아이더블유아이"]),
    ("잉크하우스", "INKHOUSE", ["INKHOUSE", "Inkhouse"]),
    ("잉크월", "INKWALL", ["INKWALL", "Inkwall"]),
    ("빈타", "Vinta", ["VINTA", "Vinta"]),
    ("윙크", "Weenk", ["WEENK", "Weenk"]),
    ("태그 스테이셔너리", "TAG Stationery", ["TAG STATIONARY", "TAG Stationery"]),
    ("코베", "Kobe", ["KOBE", "Kobe"]),
    ("콘클린", "Conklin", ["CONKLIN", "Conklin"]),
    ("트위스비", "TWSBI", ["TWSBI"]),
    ("라미", "Lamy", ["LAMY", "Lamy"]),
    ("라반", "Laban", ["LABAN", "Laban"]),
    ("디플로마트", "Diplomat", ["DIPLOMAT", "Diplomat"]),
    ("프라이빗 리저브", "Private Reserve", ["PRIVATE RESERVE", "Private Reserve"]),
    ("오토후트", "Otto Hutt", ["OTTOHUTT", "Otto Hutt"]),
    ("나왈", "Nahvalur", ["NAHVALUR", "Nahvalur"]),
    ("마존", "MAJOHN", ["MAJOHN", "Majohn"]),
    ("붕구박스", "BUNGUBOX", ["BUNGUBOX", "Bungubox"]),
    ("펜하우스", "PENHOUSE", ["PENHOUSE", "Penhouse"]),
    ("블루블랙펜샵", "BlueBlack", ["BLUEBLACK", "BlueBlack", "[BlueBlack]"]),
    ("오마스", "OMAS", ["OMAS"]),
]

COLOR_HEX = {
    "black": "#22252A", "블랙": "#22252A", "검정": "#22252A",
    "blueblack": "#243B5A", "블루블랙": "#243B5A",
    "blue": "#315E91", "블루": "#315E91", "파랑": "#315E91", "청색": "#315E91",
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

GENERIC_OPTION_WORDS = {
    "옵션선택", "옵션 선택", "필수", "선택", "품절", "선택하세요", "- [필수] 옵션을 선택해 주세요 -",
}
GENERIC_TITLE_PATTERNS = [
    r"\[[^\]]*\]", r"\([^)]*개입[^)]*\)", r"\b\d+(?:\.\d+)?\s*(?:ml|ML)\b",
    r"병\s*잉크", r"병잉크", r"잉크\s*카트리지", r"카트리지", r"만년필용", r"리필",
    r"샘플", r"한정판", r"신제품", r"신형", r"세트", r"컬렉션",
]


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


def canonical_product_url(value: str) -> str:
    parsed = urlparse(absolute_url(value))
    return urlunparse((parsed.scheme or "https", parsed.netloc or "blueblack.co.kr", parsed.path, "", "", ""))


def get(session: requests.Session, url: str, attempts: int = 4) -> requests.Response:
    last = None
    for attempt in range(attempts):
        try:
            response = session.get(url, headers=HEADERS, timeout=25)
            response.raise_for_status()
            response.encoding = response.apparent_encoding or "utf-8"
            return response
        except Exception as exc:
            last = exc
            time.sleep(1.0 + attempt * 1.5)
    raise RuntimeError(f"Failed to fetch {url}: {last}")


def product_nodes(soup: BeautifulSoup):
    selectors = [
        "li[id^='anchorBoxId_']",
        ".xans-product-listnormal li.xans-record-",
        "ul.prdList > li",
        ".prdList > li",
    ]
    for selector in selectors:
        nodes = soup.select(selector)
        if nodes:
            return nodes
    return []


def extract_listing_product(node, form: str) -> Product | None:
    links = node.select("a[href*='/product/']")
    if not links:
        links = node.select("a[href*='product_no=']")
    if not links:
        return None
    link = next((a for a in links if clean_space(a.get_text(" ", strip=True))), links[0])
    title = clean_space(link.get_text(" ", strip=True))
    image = node.select_one("img")
    if not title and image:
        title = clean_space(image.get("alt", ""))
    if not title:
        name_node = node.select_one(".name, .description .name, strong.name")
        title = clean_space(name_node.get_text(" ", strip=True) if name_node else "")
    if not title or "상품명" == title:
        return None
    if any(word in title for word in ("샘플", "공병", "컨버터", "세척", "딥펜")):
        return None
    href = canonical_product_url(link.get("href", ""))
    image_url = absolute_url((image.get("data-original") or image.get("data-src") or image.get("src") or "") if image else "")
    return Product(title=title.replace("상품명 :", "").strip(), url=href, image=image_url, form=form)


def crawl_category(session: requests.Session, category_url: str, form: str) -> list[Product]:
    found: dict[str, Product] = {}
    empty_pages = 0
    for page in range(1, 101):
        separator = "&" if "?" in category_url else "?"
        url = f"{category_url}{separator}page={page}"
        soup = BeautifulSoup(get(session, url).text, "html.parser")
        before = len(found)
        for node in product_nodes(soup):
            product = extract_listing_product(node, form)
            if product and product.url:
                found[product.url] = product
        if len(found) == before:
            empty_pages += 1
        else:
            empty_pages = 0
        print(f"[{form}] page {page}: total {len(found)}")
        if empty_pages >= 2:
            break
    return list(found.values())


def identify_brand(title: str) -> tuple[str, str]:
    folded = title.casefold()
    for ko, en, aliases in sorted(BRANDS, key=lambda row: max([len(row[0]), len(row[1]), *map(len, row[2])]), reverse=True):
        for alias in [ko, en, *aliases]:
            if alias and alias.casefold() in folded:
                return ko, en
    first = clean_space(title).split(" ", 1)[0]
    return first or "기타", first or "Other"


def clean_option(text: str) -> str:
    value = clean_space(text)
    value = re.sub(r"^[\-–—·•\s]+", "", value)
    value = re.sub(r"\s*[\(\[]?[+\-]?\s*[\d,]+\s*원[\)\]]?\s*$", "", value)
    value = re.sub(r"\s*\(품절\)\s*$", "", value)
    value = re.sub(r"^\d+[.)]\s*", "", value)
    return clean_space(value)


def extract_options(soup: BeautifulSoup) -> list[str]:
    values: list[str] = []
    selectors = [
        ".xans-product-option select option",
        "select[option_product_no] option",
        "select[id^='product_option_id'] option",
        ".ec-product-button li a span",
        ".xans-product-option .ec-product-button li",
    ]
    for selector in selectors:
        for node in soup.select(selector):
            value = clean_option(node.get_text(" ", strip=True))
            if not value or value in GENERIC_OPTION_WORDS:
                continue
            if any(token in value for token in ("옵션을 선택", "선택해 주세요", "품절")):
                continue
            if re.fullmatch(r"\d+\s*(개|ml|ML)", value):
                continue
            values.append(value)
    # Some Cafe24 themes serialize option names inside scripts.
    script_text = "\n".join(script.get_text(" ", strip=True) for script in soup.select("script"))
    for match in re.finditer(r'"option_name"\s*:\s*"([^"]+)"', script_text):
        value = clean_option(match.group(1).encode("utf-8").decode("unicode_escape", errors="ignore"))
        if value:
            values.append(value)
    deduped: list[str] = []
    seen = set()
    for value in values:
        key = value.casefold()
        if key not in seen:
            seen.add(key)
            deduped.append(value)
    return deduped


def strip_brand(title: str, brand_ko: str, brand_en: str) -> str:
    value = title
    for alias in [brand_ko, brand_en, *next((row[2] for row in BRANDS if row[0] == brand_ko and row[1] == brand_en), [])]:
        value = re.sub(re.escape(alias), " ", value, flags=re.I)
    return clean_space(value)


def title_color_name(title: str, brand_ko: str, brand_en: str) -> str:
    value = strip_brand(title, brand_ko, brand_en)
    for pattern in GENERIC_TITLE_PATTERNS:
        value = re.sub(pattern, " ", value, flags=re.I)
    value = re.sub(r"\b(?:standard|shimmer(?:ing)?|pigment|scented|pearl|calligraphy)\b", " ", value, flags=re.I)
    value = clean_space(value.strip("-–—·/ "))
    return value or clean_space(strip_brand(title, brand_ko, brand_en))


def infer_hex(name: str) -> str | None:
    folded = name.casefold()
    for key, value in COLOR_HEX.items():
        if key.casefold() in folded:
            return value
    return None


def product_detail(session: requests.Session, product: Product) -> list[dict]:
    try:
        soup = BeautifulSoup(get(session, product.url).text, "html.parser")
    except Exception as exc:
        print(f"detail failed: {product.url}: {exc}")
        soup = BeautifulSoup("", "html.parser")
    title = product.title
    title_node = soup.select_one(".xans-product-detail .headingArea h2, .headingArea h2, meta[property='og:title']")
    if title_node:
        title = clean_space(title_node.get("content") if title_node.name == "meta" else title_node.get_text(" ", strip=True)) or title
    brand_ko, brand_en = identify_brand(title)
    image_node = soup.select_one("meta[property='og:image'], #bigImage, .BigImage, .keyImg img")
    image = product.image
    if image_node:
        image = absolute_url(image_node.get("content") or image_node.get("src") or image)
    options = extract_options(soup)
    if options:
        names = options
    else:
        names = [title_color_name(title, brand_ko, brand_en)]
    rows = []
    for name in names:
        if not name or len(name) > 180:
            continue
        fingerprint = f"{brand_en}|{product.form}|{name}|{product.url}".casefold()
        rows.append({
            "id": "store-" + hashlib.sha1(fingerprint.encode("utf-8")).hexdigest()[:14],
            "brandKo": brand_ko,
            "brandEn": brand_en,
            "form": product.form,
            "volume": next((m.group(0).lower() for m in [re.search(r"\b\d+(?:\.\d+)?\s*ml\b", title, re.I)] if m), None),
            "nameKo": name,
            "nameEn": name,
            "nameJa": name,
            "nameZhHans": name,
            "nameZhHant": name,
            "hex": infer_hex(name),
            "image": image,
            "productTitle": title,
            "productUrl": product.url,
            "source": "blueblack-store",
        })
    return rows


def dedupe(rows: list[dict]) -> list[dict]:
    result = []
    seen = set()
    for row in rows:
        key = (row["brandEn"].casefold(), row["form"], clean_space(row["nameKo"]).casefold())
        if key in seen:
            continue
        seen.add(key)
        result.append(row)
    return sorted(result, key=lambda row: (row["brandEn"].casefold(), row["form"], row["nameKo"].casefold()))


def main() -> None:
    session = requests.Session()
    products: dict[str, Product] = {}
    for category_url, form in CATEGORIES:
        for product in crawl_category(session, category_url, form):
            products[product.url] = product
    print(f"Collected {len(products)} product pages")
    rows: list[dict] = []
    with ThreadPoolExecutor(max_workers=8) as executor:
        futures = {executor.submit(product_detail, requests.Session(), product): product for product in products.values()}
        for index, future in enumerate(as_completed(futures), start=1):
            try:
                rows.extend(future.result())
            except Exception as exc:
                print(f"worker failed: {futures[future].url}: {exc}")
            if index % 50 == 0:
                print(f"Processed {index}/{len(futures)}")
    rows = dedupe(rows)
    payload = json.dumps(rows, ensure_ascii=False, indent=2)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text("// Auto-generated from BlueBlack bottle-ink and cartridge product pages.\nexport const INK_STORE_COLORS = " + payload + ";\n", encoding="utf-8")
    brands = sorted({row["brandEn"] for row in rows})
    REPORT.parent.mkdir(parents=True, exist_ok=True)
    REPORT.write_text(json.dumps({"products": len(products), "colors": len(rows), "brands": brands}, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Generated {len(rows)} color entries across {len(brands)} brands")


if __name__ == "__main__":
    main()
