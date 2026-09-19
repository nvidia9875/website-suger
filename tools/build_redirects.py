"""旧 sugarnote.jp の言語付きURLを新サイトの対応ページへ転送する。

    python3 tools/build_redirects.py

旧サイトに実在し、SNS や検索から参照され得るパス（/{ja,en,th} と その配下の privacy / terms）を
同じパスに置いた転送ページで受ける。GitHub Pages は 301 を返せないため meta refresh を使う。
記事（/{lang}/information/<uuid>）は tools/build_news.py が実ページを生成するのでここでは扱わない。
"""
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LANGS = ("ja", "en", "th")
# (旧パスの続き, 出力先からのルート相対深さ, 転送先ファイル)
TARGETS = [("", 1, "index.html"), ("privacy", 2, "privacy.html"), ("terms", 2, "terms.html")]

TPL = """<!DOCTYPE html>
<html lang="{lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self'; font-src 'self'; img-src 'self'; base-uri 'self'; object-src 'none'; upgrade-insecure-requests">
<meta http-equiv="refresh" content="0; url={up}{target}">
<link rel="canonical" href="{up}{target}">
<!-- 転送用ページ。公開後も noindex のまま残す（本体ページと重複させないため） -->
<meta name="robots" content="noindex">
<title>移動しました | SugarNote Official Website</title>
<link rel="icon" href="{up}assets/img/logo-heart.png">
<link rel="stylesheet" href="{up}assets/css/fonts.css?v=1">
<link rel="stylesheet" href="{up}assets/css/site.css?v=5">
</head>
<body>
<main id="main">
  <section class="subpage">
    <div class="subpage-body">
      <p>ページの場所が変わりました。自動で移動します。</p>
      <p>The page has moved. Redirecting…</p>
      <p><a href="{up}{target}">こちらをクリック / Click here</a></p>
    </div>
  </section>
</main>
</body>
</html>
"""

n = 0
for lang in LANGS:
    for sub, depth, target in TARGETS:
        d = os.path.join(ROOT, lang, sub) if sub else os.path.join(ROOT, lang)
        os.makedirs(d, exist_ok=True)
        open(os.path.join(d, "index.html"), "w", encoding="utf-8").write(
            TPL.format(lang=lang, up="../" * depth, target=target))
        n += 1
print(f"転送ページ: {n} 件（{len(LANGS)} 言語 × {len(TARGETS)} パス）")
