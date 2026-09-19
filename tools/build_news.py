"""旧 sugarnote.jp から回収したお知らせ記事を、同じURLのまま新サイトに書き出す。

    python3 tools/build_news.py

入力: tools/news-archive.json（旧サイトから取得した本文。5記事 × ja/en/th）
出力: <lang>/information/<uuid>/index.html （旧URLと同じパス。SNS の既存リンクが生きる）

記事は3言語とも同一内容（翻訳されていない）ことを確認済みなので、本文は使い回す。
画像は assets/img/news/news-<uuid先頭8桁>.webp に取り込み済み（CSP が img-src 'self' のため自前ホスト必須）。
"""
import json, os, re, html

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ART = json.load(open(os.path.join(ROOT, "tools/news-archive.json"), encoding="utf-8"))
LANGS = ("ja", "en", "th")
UP = "../../../"

ALLOWED = re.compile(r"</?(?:p|br|strong|em|b|i|ul|ol|li|h2|h3|a)(?:\s[^>]*)?>", re.I)

def clean(body):
    """許可タグ以外を落とし、リンクに rel/target を付け直す。"""
    body = re.sub(r"<(?!/?(?:p|br|strong|em|b|i|ul|ol|li|h2|h3|a)\b)[^>]*>", "", body)
    def fix_a(m):
        href = (re.search(r'href="([^"]*)"', m.group(0)) or [None, "#"])[1]
        ext = href.startswith("http")
        return f'<a href="{html.escape(href, quote=True)}"' + (' target="_blank" rel="noopener noreferrer"' if ext else "") + ">"
    return re.sub(r"<a\s[^>]*>", fix_a, body)

TPL = """<!DOCTYPE html>
<html lang="{lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self'; font-src 'self'; img-src 'self'; frame-src https://www.youtube-nocookie.com https://timetreeapp.com; connect-src 'self' https://api.web3forms.com; form-action 'self'; base-uri 'self'; object-src 'none'; upgrade-insecure-requests">
<meta name="referrer" content="strict-origin-when-cross-origin">
<title>{title} | SugarNote Official Website</title>
<meta name="description" content="{desc}">
<!-- 公開時に外す: 検索避け（README「公開前チェック」） -->
<meta name="robots" content="noindex">
<meta name="theme-color" content="#F4F3F1">
<link rel="icon" href="{up}assets/img/logo-heart.png">
<link rel="stylesheet" href="{up}assets/css/fonts.css?v=1">
<link rel="stylesheet" href="{up}assets/css/site.css?v=5">
</head>
<body data-page="news">
<a class="skip" href="#main">本文へスキップ</a>

<header class="head">
  <a class="head-logo" href="{up}index.html" aria-label="SugarNote">
    <img class="logo-mark" src="{up}assets/img/logo-ribbon.png" alt="SugarNote" width="800" height="800">
  </a>
  <button type="button" class="head-menu" id="menu-btn" aria-expanded="false" aria-controls="head-nav" data-i18n-attr="aria-label:menu.label">MENU</button>
  <nav class="head-nav" id="head-nav" aria-label="サイトナビゲーション">
    <a href="{up}index.html#concept" data-i18n="nav.concept">CONCEPT</a>
    <a href="{up}index.html#members" data-i18n="nav.member">MEMBER</a>
    <a href="{up}index.html#news" data-i18n="nav.information">INFORMATION</a>
    <a href="{up}index.html#schedule" data-i18n="nav.schedule">SCHEDULE</a>
    <a href="{up}goods.html" data-i18n="nav.goods">GOODS</a>
    <a href="{up}index.html#contact" data-i18n="nav.contact">CONTACT</a>
  </nav>
  <div class="head-tools">
    <div class="lang" role="group" aria-label="Language">
      <button type="button" data-lang-switch="ja">JP</button>
      <button type="button" data-lang-switch="en">EN</button>
      <button type="button" data-lang-switch="th">TH</button>
    </div>
  </div>
</header>

<main id="main">
  <section class="subpage" aria-labelledby="h-page">
    <header class="sec-head">
      <p class="article-meta"><time datetime="{date}">{date_dot}</time><span class="article-cat">{cat}</span></p>
      <h1 class="sec-title article-title" id="h-page">{title}</h1>
    </header>
    <figure class="article-hero"><img src="{up}assets/img/news/{img}" alt="" width="{iw}" height="{ih}"></figure>
    <div class="subpage-body article-body">{body}</div>
    <p class="article-back"><a href="{up}index.html#news" data-i18n="news.back">お知らせ一覧へ戻る</a></p>
  </section>
</main>

<footer class="foot">
  <div class="foot-in">
    <p class="foot-logo">
      <img class="logo-mark" src="{up}assets/img/logo-ribbon.png" alt="SugarNote" width="800" height="800" loading="lazy">
    </p>
    <ul class="foot-sns" id="foot-sns" role="list"></ul>
    <nav class="foot-nav" aria-label="フッターナビゲーション">
      <a href="{up}index.html" data-i18n="foot.backHome">トップへ戻る</a>
      <a href="{up}terms.html" data-i18n="foot.terms">利用規約</a>
      <a href="{up}privacy.html" data-i18n="foot.privacy">プライバシーポリシー</a>
      <a href="{up}legal.html" data-i18n="foot.legal">特定商取引法に基づく表記</a>
      <a href="https://flapinc.jp/" target="_blank" rel="noopener" data-i18n="foot.company">運営会社</a>
    </nav>
    <p class="foot-copy" data-i18n="foot.copyright">© 2026 SugarNote Official. All Rights Reserved.</p>
  </div>
</footer>

<script src="{up}assets/js/data.js?v=3" defer></script>
<script src="{up}assets/js/goods-data.js?v=6" defer></script>
<script src="{up}assets/js/i18n.js?v=9" defer></script>
<script src="{up}assets/js/site.js?v=3" defer></script>
<script src="{up}assets/js/oshi.js?v=3" defer></script>
<script src="{up}assets/js/page.js?v=1" defer></script>
</body>
</html>
"""

CATS = {}
data_js = open(os.path.join(ROOT, "assets/js/data.js"), encoding="utf-8").read()
for m in re.finditer(r'category: "([^"]+)", title: "[^"]*", url: "[^"]*information/([0-9a-f-]+)"', data_js):
    CATS[m.group(2)] = m.group(1)

from PIL import Image
n = 0
for uu, langs in ART.items():
    a = langs["ja"]
    img = f"news-{uu[:8]}.webp"
    iw, ih = Image.open(os.path.join(ROOT, "assets/img/news", img)).size
    body = clean(a["body_html"])
    desc = html.escape(re.sub(r"<[^>]+>", " ", body))[:110].strip()
    for lang in LANGS:
        d = os.path.join(ROOT, lang, "information", uu)
        os.makedirs(d, exist_ok=True)
        open(os.path.join(d, "index.html"), "w", encoding="utf-8").write(TPL.format(
            lang=lang, up=UP, title=html.escape(a["title"]), desc=desc, date=a["date"],
            date_dot=a["date"].replace("-", "."), cat=CATS.get(uu, "NEWS"),
            img=img, iw=iw, ih=ih, body=body))
        n += 1
print(f"生成: {n} ページ（{len(ART)} 記事 × {len(LANGS)} 言語）")
