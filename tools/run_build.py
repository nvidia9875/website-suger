import sys, os
sys.argv = ["x", sys.argv[1] if len(sys.argv) > 1 else "out"]
exec(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "build_images.py")).read())

S = SRC
STAND = f"{S}/アクスタ70"
CHARM = f"{S}/アクキーチャーム付き"
PHOTO = f"{S}/アー写・ポスター"

# ---- アクリルスタンド（約70mm・星形メンバーカラー台座） ----
stands = {"fuka": "05ふうか", "airi": "02あいり", "nanako": "04ななこ",
          "hinata": "01ひなた", "ririho": "03りりほ", "rana": "06らな"}
for mid, f in stands.items():
    place(f"{STAND}/{f}.png", f"stand-{mid}.jpg", fill=0.86, center_y=0.52)
# 商品カードの代表画像は 6 種を 3×3 で並べた一覧（元の横一列だと正方形枠で極端に小さくなるため）
grid([f"{STAND}/{stands[m]}.png" for m in ["fuka", "airi", "nanako", "hinata", "ririho", "rana"]],
     "stand-main.jpg")

# ---- アクリルキーホルダー（星型チャーム付き） ----
charms = {"hinata": "02_HINATA", "airi": "03_AIRI", "ririho": "04_RIRIHO",
          "nanako": "05_NANAKO", "fuka": "06_FUKA", "rana": "07_RANA"}
for mid, f in charms.items():
    place(f"{CHARM}/{f}.png", f"charm-{mid}.jpg", fill=0.84, shadow=False)
place(f"{CHARM}/01_6人.png", "charm-all.jpg", fill=0.88, shadow=False)

# ---- Tシャツ（前面のみ切り出し。元素材は前後 2 面が横並び） ----
tmp = os.path.join(OUT, "_tshirt-front.png")
Image.open(f"{S}/Tシャツ/SugarNote Tシャツ.png").convert("RGBA").crop((258, 0, 2341, 3580)).save(tmp)
place(tmp, "tshirt-main.jpg", fill=0.86, shadow=False)
os.remove(tmp)

# ---- 衣装ビジュアルポスター MV衣装（アー写）: 正方形カード用 ----
# 提供素材のアー写は公式 poster-mv-* と同じ撮影（白衣装）。通常衣装のアー写は未提供。
posters = {"hinata": ("01_HINATA", 0.00), "airi": ("02_AIRI", 0.00), "ririho": ("03_RIRIHO", 0.033),
           "nanako": ("04_NANAKO", 0.012), "fuka": ("05_FUKA", 0.00), "rana": ("06_RANA", 0.058)}
for mid, (f, top) in posters.items():
    photo_square(f"{PHOTO}/{f}.jpg", f"poster-mv-{mid}.jpg", top_frac=top)
photo_crop(f"{PHOTO}/00_6人.jpg", "poster-mv-all.jpg", (0.203, 0.060, 0.807, 0.960), (1080, 1080))

# ---- 6人アー写: A案ヒーロー / B案カバー共用（元画像と同じ 1.49:1） ----
photo_crop(f"{PHOTO}/00_6人.jpg", "group-main.jpg", (0.0, 0.0, 1.0, 1.0), (1400, 938), quality=76)
photo_crop(f"{PHOTO}/00_6人.jpg", "group-sp.jpg", (0.0, 0.0, 1.0, 1.0), (760, 509), quality=78)

# ---- メンバー顔（推しの棚の見出し用・円形） ----
avatars = {"hinata": ("01_HINATA", 0.501, 0.173, 0.54), "airi": ("02_AIRI", 0.482, 0.208, 0.62),
           "ririho": ("03_RIRIHO", 0.520, 0.185, 0.46), "nanako": ("04_NANAKO", 0.516, 0.245, 0.60),
           "fuka": ("05_FUKA", 0.451, 0.203, 0.62), "rana": ("06_RANA", 0.532, 0.264, 0.46)}
for mid, (f, fx, fy, frac) in avatars.items():
    im = Image.open(f"{PHOTO}/{f}.jpg")
    w, h = im.size
    side = w * frac
    x0 = min(max(0, fx * w - side / 2), w - side)
    y0 = min(max(0, fy * h - side * 0.42), h - side)
    photo_crop(f"{PHOTO}/{f}.jpg", f"member-{mid}.jpg",
               (x0 / w, y0 / h, (x0 + side) / w, (y0 + side) / h), (480, 480), quality=84)
