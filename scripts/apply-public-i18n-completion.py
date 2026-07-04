from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

I18N_SCRIPTS = {
    "official-guide/index.html": '<script type="module" src="../src/official-guide-i18n-v50.js?v=50"></script>',
    "engraving-guide/index.html": '<script type="module" src="../src/engraving-guide-i18n-v50.js?v=50"></script>',
    "as-guide/index.html": '<script type="module" src="../src/as-guide-i18n-v50.js?v=50"></script>',
    "pen-buffet/index.html": '<script type="module" src="../src/pen-buffet-i18n-v50.js?v=50"></script>',
    "ink-price/index.html": '<script type="module" src="../src/ink-price-i18n-completion-v50.js?v=50"></script>',
}

PUBLIC_UI_SCRIPTS = {
    "index.html": '<script type="module" src="./src/public-ui-v52.js?v=52"></script>',
    "news/index.html": '<script type="module" src="../src/public-ui-v52.js?v=52"></script>',
    "review-event/index.html": '<script type="module" src="../src/public-ui-v52.js?v=52"></script>',
    "pen-buffet/index.html": '<script type="module" src="../src/public-ui-v52.js?v=52"></script>',
    "store-guide/index.html": '<script type="module" src="../src/public-ui-v52.js?v=52"></script>',
    "official-guide/index.html": '<script type="module" src="../src/public-ui-v52.js?v=52"></script>',
    "engraving-guide/index.html": '<script type="module" src="../src/public-ui-v52.js?v=52"></script>',
    "as-guide/index.html": '<script type="module" src="../src/public-ui-v52.js?v=52"></script>',
    "ink-price/index.html": '<script type="module" src="../src/public-ui-v52.js?v=52"></script>',
}


def insert_before_body(path: Path, script: str) -> None:
    text = path.read_text(encoding="utf-8")
    if script in text:
        return
    if "</body>" not in text:
        raise RuntimeError(f"Missing </body> in {path}")
    text = text.replace("</body>", f"  {script}\n</body>", 1)
    path.write_text(text, encoding="utf-8")


for relative, script in I18N_SCRIPTS.items():
    insert_before_body(ROOT / relative, script)

for relative, script in PUBLIC_UI_SCRIPTS.items():
    insert_before_body(ROOT / relative, script)

# The ink page is a search and comparison tool, not only a static price list.
detail_language = ROOT / "src/detail-language.js"
text = detail_language.read_text(encoding="utf-8")
text = text.replace("BlueBlack Ink Decant Price List", "BlueBlack Ink Decant Price Search")
text = text.replace("BlueBlack インク小分け価格表", "BlueBlack インク小分け価格検索")
text = text.replace("BlueBlack 墨水分装价格表", "BlueBlack 墨水分装价格查询")
text = text.replace("BlueBlack 墨水分裝價格表", "BlueBlack 墨水分裝價格查詢")
detail_language.write_text(text, encoding="utf-8")

# Keep the platform validation workflow aware of the shared public UI modules.
workflow = ROOT / ".github/workflows/validate-platform.yml"
text = workflow.read_text(encoding="utf-8")
anchor = "          node --check src/portal-ink-live.js\n"
checks = "".join(
    f"          node --check src/{name}\n"
    for name in [
        "public-ui-v52.js",
        "official-guide-i18n-v50.js",
        "engraving-guide-i18n-v50.js",
        "as-guide-i18n-v50.js",
        "pen-buffet-i18n-v50.js",
        "ink-price-i18n-completion-v50.js",
    ]
)
if checks not in text:
    text = text.replace(anchor, anchor + checks)
workflow.write_text(text, encoding="utf-8")
