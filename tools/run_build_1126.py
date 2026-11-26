"""2026-11-26 販売のパジャマパーティー（コメント付き）チェキ・ランダムブロマイドの商品画像。

    GOODS_SRC="$PWD/tools/src/shopify-2026-11-pajama" uv run --with pillow python3 tools/run_build_1126.py out
    cp out/pajama-*.webp assets/img/goods/

素材は Shopify の商品画像（2250角の透過PNG、2026-11-26 取得）。ブロマイドの main だけ集合写真の JPEG。
メンバーとの対応は、Shopify の管理画面で各バリアントに付いた画像を見て決めた（月城さんの分は無い）。
"""
import os
import sys

sys.argv = ["x", sys.argv[1] if len(sys.argv) > 1 else "out"]
exec(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "build_images.py")).read())

MEMBER_IDS = ["ririho", "nanako", "fuka", "hinata", "airi"]

for n in ["main"] + MEMBER_IDS:
    place(f"{SRC}/pajama-cheki-{n}.png", f"pajama-cheki-{n}.webp", fill=0.94, shadow=False)
for n in MEMBER_IDS + ["all"]:
    place(f"{SRC}/pajama-brm-{n}.png", f"pajama-brm-{n}.webp", fill=0.94, shadow=False)
place(Image.open(f"{SRC}/pajama-brm-main.jpg").convert("RGBA"), "pajama-brm-main.webp", fill=0.90, shadow=False)
