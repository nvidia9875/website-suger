#!/bin/bash
# 公開時の検索避け解除（手順書: docs/CUTOVER-2026-10-01.md 手順7）
#   本体6ページ・記事15ページ・記事テンプレートから noindex を外し、robots.txt を開放する。
#   旧URL用の転送ページ9つ（ja/en/th の index・privacy・terms）は noindex のまま残す。
#   commit / push はしない（結果を見てから手で行う）。2回実行しても結果は同じ。
set -euo pipefail
cd "$(dirname "$0")/.."

FILES=(index.html member.html goods.html terms.html privacy.html legal.html tools/build_news.py)
for lang in ja en th; do
  for f in "${lang}"/information/*/index.html; do FILES+=("${f}"); done
done
if [ "${#FILES[@]}" -ne 22 ]; then
  echo "対象が ${#FILES[@]} 件（期待 22 件）。記事の数が変わっていないか確認して中止" >&2
  exit 1
fi

for f in "${FILES[@]}"; do
  sed -i '' -e '/公開時に外す: 検索避け/d' -e '/<meta name="robots" content="noindex">/d' "${f}"
done
printf 'User-agent: *\nAllow: /\n' > robots.txt

echo "== noindex が残っているファイル（転送ページ9つ＋build_redirects.py の10件なら正しい）"
LEFT="$(grep -rl 'content="noindex"' --include="*.html" --include="*.py" . | grep -v '^\./out/' | sort)"
echo "${LEFT}"
if [ "$(echo "${LEFT}" | wc -l | tr -d ' ')" -ne 10 ]; then
  echo "件数が 10 ではない。git diff で確認すること" >&2
  exit 1
fi
echo
echo "== 変更（23ファイル: 22件＋robots.txt のはず）"
git diff --stat
