#!/bin/bash
# 公開時の検索避け解除（手順書: docs/CUTOVER-2026-10-01.md 手順7）
#   本体4ページ（index・member・terms・privacy）・記事15ページ・記事テンプレートから noindex を外し、robots.txt を開放する。
#   旧URL用の転送ページ9つ（ja/en/th の index・privacy・terms）は noindex のまま残す。
#   goods.html / legal.html はグッズ公開（2026-11、SN.goodsLive = true）まで noindex のまま（README「グッズの公開」で外す）。
#   commit / push はしない（結果を見てから手で行う）。2回実行しても結果は同じ。
set -euo pipefail
cd "$(dirname "$0")/.."

FILES=(index.html member.html terms.html privacy.html tools/build_news.py)
for lang in ja en th; do
  for f in "${lang}"/information/*/index.html; do FILES+=("${f}"); done
done
if [ "${#FILES[@]}" -ne 20 ]; then
  echo "対象が ${#FILES[@]} 件（期待 20 件）。記事の数が変わっていないか確認して中止" >&2
  exit 1
fi

for f in "${FILES[@]}"; do
  sed -i '' -e '/公開時に外す: 検索避け/d' -e '/<meta name="robots" content="noindex">/d' "${f}"
done
printf 'User-agent: *\nAllow: /\n' > robots.txt

echo "== noindex が残っているファイル（転送ページ9つ＋goods.html＋legal.html＋build_redirects.py の12件なら正しい）"
LEFT="$(grep -rl 'content="noindex"' --include="*.html" --include="*.py" . | grep -v '^\./out/' | sort)"
echo "${LEFT}"
if [ "$(echo "${LEFT}" | wc -l | tr -d ' ')" -ne 12 ]; then
  echo "件数が 12 ではない。git diff で確認すること" >&2
  exit 1
fi
echo
echo "== 変更（21ファイル: 20件＋robots.txt のはず）"
git diff --stat
