"""Build dist/leftover-chef.html: one self-contained file with every style,
script, font and documentation screenshot inlined. No other files needed.

Run from the project folder:  python3 scripts/build-single.py
"""
import base64, io, pathlib, re
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "dist" / "leftover-chef.html"


def b64(data):
    return base64.b64encode(data).decode("ascii")


# 1. CSS with fonts as data URIs
css = (ROOT / "css" / "styles.css").read_text(encoding="utf-8")
def font_uri(m):
    path = (ROOT / "css" / m.group(1)).resolve()
    return 'url("data:font/woff2;base64,' + b64(path.read_bytes()) + '")'
css, n_fonts = re.subn(r'url\("(\.\./fonts/[^"]+\.woff2)"\)', font_uri, css)
assert n_fonts == css.count("data:font/woff2") and n_fonts >= 1, n_fonts
assert "</style" not in css

# 2. Screenshots used by the docs page -> small WebP data URIs
shots = {}
for png in sorted((ROOT / "proof").glob("*.png")):
    img = Image.open(png).convert("RGB")
    if img.width > 900:
        img = img.resize((900, round(img.height * 900 / img.width)), Image.LANCZOS)
    buf = io.BytesIO()
    img.save(buf, "WEBP", quality=72, method=6)
    shots["proof/" + png.name] = "data:image/webp;base64," + b64(buf.getvalue())

# 3. Scripts, in the same order as index.html
html = (ROOT / "index.html").read_text(encoding="utf-8")
order = re.findall(r'<script src="(js/[^"]+)"></script>', html)
assert order == ["js/config.js", "js/data.js", "js/engine.js", "js/twists.js",
                 "js/storage.js", "js/pages.js", "js/app.js"], order
js_parts = []
for src in order:
    code = (ROOT / src).read_text(encoding="utf-8")
    if src == "js/pages.js":
        for path, uri in shots.items():
            assert code.count('"' + path + '"') == 1, path
            code = code.replace('"' + path + '"', '"' + uri + '"')
    assert "</script" not in code.lower(), src
    js_parts.append(f"/* ===== {src} ===== */\n{code}")

# 4. Assemble
html = html.replace('<link rel="stylesheet" href="css/styles.css">', "<style>\n" + css + "\n</style>")
html = re.sub(r'\s*<script src="js/[^"]+"></script>', "", html)
html = html.replace("</body>", "  <script>\n" + "\n".join(js_parts) + "\n  </script>\n</body>")
assert 'src="js/' not in html and 'href="css/' not in html and "../fonts/" not in html

OUT.parent.mkdir(exist_ok=True)
OUT.write_text(html, encoding="utf-8")
print(f"Wrote {OUT.relative_to(ROOT)}: {OUT.stat().st_size / 1024:.0f} KB, {n_fonts} fonts, {len(shots)} screenshots inlined")
