"""2026-11-01 公開予定のコメントなし版3商品（黒ゴシック衣装チェキ・ブロマイド、レトロワンピースデコチェキ）の商品画像。

    GOODS_SRC="$PWD/tools/src/shopify-2026-10" python3 tools/run_build_1101.py out
    cp out/*.webp assets/img/goods/

素材は 10/26 特典会用のコメント付き版の Shopify 商品画像（1080角の透過PNG、2026-10-24 取得）。
写真にコメントは写っていないので、コメントなし版にも使える前提。差し替えが来たら同じ名前で置き直す。
ファイル名は <商品>-<メンバー id | main | all>.png（Shopify の画像に紐づくバリアントのメンバー名から付けた）。
"""
import os
import sys

sys.argv = ["x", sys.argv[1] if len(sys.argv) > 1 else "out"]
exec(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "build_images.py")).read())

MEMBER_IDS = ["ririho", "nanako", "fuka", "hinata", "airi", "rana"]

for prefix in ["gothic-cheki", "gothic-brm", "retro-deco"]:
    names = ["main"] + MEMBER_IDS + (["all"] if prefix == "gothic-brm" else [])
    for n in names:
        place(f"{SRC}/{prefix}-{n}.png", f"{prefix}-{n}.webp", fill=0.94, shadow=False)
