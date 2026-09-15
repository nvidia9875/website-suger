"""2026-09-09（改訂版）提供「オンライン商品写真」から商品画像を書き出す。

    GOODS_SRC="$PWD/tools/src/オンライン商品写真" python3 tools/run_build_online.py out
    cp out/*.webp assets/img/goods/

先方素材は 1080角（アクスタ・アクキーの一部は 874角）の透過PNG。背景と接地影はこちら側で合成する
（サイト内の見え方を揃えるため。tools/build_images.py の place / grid）。
"""
import os
import sys

sys.argv = ["x", sys.argv[1] if len(sys.argv) > 1 else "out"]
exec(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "build_images.py")).read())

S = SRC
STAND = f"{S}/アクスタ70"
CHARM = f"{S}/アクキー"
POSTER = f"{S}/ビジュアルポスター"
TEE = f"{S}/Tシャツ"
BRM = f"{S}/ランダムブロマイド"
HINA = f"{S}/ひなふう生誕祭"

# 先方のフォルダ／ファイル名は「番号.メンバー名」。拡張子が付いていないものがあるので綴りを正とする
MEMBERS = {"ririho": "1.RIRIHO", "nanako": "2.NANAKO", "fuka": "3.FUKA",
           "hinata": "4.HINATA", "airi": "5.AIRI", "rana": "6.RANA"}
ORDER = ["fuka", "airi", "nanako", "hinata", "ririho", "rana"]   # stand-main の並び


# ---- メンバーアクリルスタンド（約70mm・星形メンバーカラー台座） ----
for mid, f in MEMBERS.items():
    place(f"{STAND}/{f}", f"stand-{mid}.webp", fill=0.86, center_y=0.52)
grid([f"{STAND}/{MEMBERS[m]}" for m in ORDER], "stand-main.webp")

# ---- メンバーキャラクターアクリルキーホルダー（星型チャーム付き） ----
for mid, f in MEMBERS.items():
    place(f"{CHARM}/{f}", f"charm-{mid}.webp", fill=0.84, shadow=False)
place(f"{CHARM}/7. All member.png", "charm-all.webp", fill=0.86, shadow=False)
# 商品カードの代表画像は 7 種を 3 列に並べ直したもの。
# 先方の「掲載画像.png」は横一列なので、正方形の枠に入れると1点ずつが極端に小さくなる（stand-main と同じ理由）
grid([f"{CHARM}/{MEMBERS[m]}" for m in ORDER] + [f"{CHARM}/7. All member.png"],
     "charm-main.webp", fill=0.88, shadow=False)

# ---- オリジナルTシャツ（前後2面が横並びの1枚。カードは正方形なので前面だけ使う） ----
tee = trim(Image.open(f"{TEE}/1.png"))
tmp = os.path.join(OUT, "_tee-front.png")
tee.crop((0, 0, round(tee.width * 0.505), tee.height)).save(tmp)
place(tmp, "tshirt-main.webp", fill=0.84, shadow=False)
os.remove(tmp)

# ---- 衣装ビジュアルポスター（MV衣装6種＋ALL の7種。通常衣装5種は掲載しない＝先方指定） ----
for mid, f in MEMBERS.items():
    place(f"{POSTER}/{f}.png", f"poster-mv-{mid}.webp", fill=0.94, shadow=False)
place(f"{POSTER}/7.All member.png", "poster-mv-all.webp", fill=0.94, shadow=False)
place(f"{POSTER}/130.png", "poster-main.webp", fill=0.94, shadow=False)      # 7種の一覧（商品カード用）

# ---- ランダムブロマイド（絵柄一覧） ----
for folder, name in [("制服", "seifuku"), ("ダンプラ", "danpra"), ("浴衣", "yukata"),
                     ("レトロワンピース", "retro"), ("MV", "debut")]:
    place(f"{BRM}/{folder}/掲載用.png", f"{name}-main.webp", fill=0.94, shadow=False)

# ---- ひなふうらんど ----
BR = f"{HINA}/ブロマイド "                                       # 末尾に半角スペースあり（先方のフォルダ名のまま）
place(f"{BR}/掲載用.png", "hinafu-brm-main.webp", fill=0.94, shadow=False)
place(f"{BR}/ひなた掲載用.png", "hinafu-brm-hinata.webp", fill=0.94, shadow=False)
place(f"{BR}/ふうか掲載用.png", "hinafu-brm-fuka.webp", fill=0.94, shadow=False)
place(f"{BR}/ひなふう掲載用.png", "hinafu-brm-pair.webp", fill=0.94, shadow=False)
place(f"{HINA}/アクキー/掲載用.png", "hinafu-charm-main.webp", fill=0.92, shadow=False)
place(f"{HINA}/アクキー/1.FUKA", "hinafu-charm-fuka.webp", fill=0.84, shadow=False)
place(f"{HINA}/アクキー/2.HINATA", "hinafu-charm-hinata.webp", fill=0.84, shadow=False)
place(f"{HINA}/アクキー/3.ひなふうペア", "hinafu-charm-pair.webp", fill=0.84, shadow=False)
place(f"{HINA}/アクリルスタンド/ひなふうアクリルスタンド.png", "hinafu-stand.webp", fill=0.88)
place(f"{HINA}/Tシャツ/Tシャツ.png", "hinafu-tshirt.webp", fill=0.88, shadow=False)
place(f"{HINA}/ランダムトレカ/ランダムトレカ.png", "hinafu-tcard.webp", fill=0.94, shadow=False)
