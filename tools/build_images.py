"""SugarNote グッズ画像の書き出し（共通ヘルパー）。

レシピは別ファイル:
    tools/run_build.py         2026-08「グッズまとめ」（初回。アー写・顔写真もここで作る）
    tools/run_build_online.py  2026-09「オンライン商品写真」（現行の商品画像・ブロマイド掲載画像）

使い方:
    GOODS_SRC=/path/to/素材フォルダ python3 tools/run_build_online.py out
    cp out/*.webp assets/img/goods/

入力: 透過PNG の商品画像 / JPEG の写真
出力: 保存形式は出力ファイル名の拡張子で決まる（.webp / .jpg）。
      商品画像は 1:1 — サイトの .goods-img / .pd-media が aspect-ratio:1 + cover のため。
      例外は group-* / member-*（トップの群像・円形の顔写真）と gallery-*（元の縦横比のまま）。

提供ZIPのファイル名は Shift-JIS のことがあるため、展開は `ditto -x -k`（macOS）か cp932 で decode する。
"""
from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont, ImageOps
import os, sys

# 素材フォルダ（提供ZIPを展開したパス）。環境変数 GOODS_SRC で差し替え可
SRC = os.environ.get("GOODS_SRC", os.path.join(os.path.dirname(os.path.abspath(__file__)), "src", "グッズまとめ"))
OUT = sys.argv[1] if len(sys.argv) > 1 else "out"
os.makedirs(OUT, exist_ok=True)

SIZE = 1080          # 書き出し正方形サイズ
QUALITY = 88

# 背景: ごく淡い縦グラデ + 中央の白いグロー。
# 白基調のアクリル（里莉穂＝White担当）が白背景で消えないよう、下端はしっかり色を残す。
BG_TOP = (255, 253, 254)
BG_BOTTOM = (243, 231, 237)
GLOW_ALPHA = 210


def make_bg(size, top=BG_TOP, bottom=BG_BOTTOM, glow=GLOW_ALPHA):
    base = Image.new("RGB", (size, size))
    d = ImageDraw.Draw(base)
    for y in range(size):
        t = y / (size - 1)
        d.line([(0, y), (size, y)], fill=tuple(round(top[i] + (bottom[i] - top[i]) * t) for i in range(3)))
    # 中央やや上に白いグロー（被写体を浮かせる）
    g = Image.new("L", (size, size), 0)
    gd = ImageDraw.Draw(g)
    r = int(size * 0.40)
    cx, cy = size // 2, int(size * 0.46)
    gd.ellipse([cx - r, cy - r, cx + r, cy + r], fill=glow)
    g = g.filter(ImageFilter.GaussianBlur(size * 0.16))
    base.paste(Image.new("RGB", (size, size), (255, 255, 255)), (0, 0), g)
    return base


def trim(im):
    """透過PNG を中身の外接矩形で切り出す。"""
    im = im.convert("RGBA")
    box = im.split()[-1].getbbox()
    return im.crop(box) if box else im


def cutout_white(src, tol=14, feather=0.6):
    """白背景のまま届いた素材を切り抜く（外周からのフラッドフィル）。

    商品自体が白いときに中まで抜けないよう、しきい値は低め。
    本来は切り抜き済みPNGを支給してもらうのが正で、これは暫定の当て物。
    """
    im = (src if isinstance(src, Image.Image) else Image.open(src)).convert("RGB")
    w, h = im.size
    work = im.copy()
    seeds = [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1),
             (w // 2, 0), (w // 2, h - 1), (0, h // 2), (w - 1, h // 2)]
    for s in seeds:
        ImageDraw.floodfill(work, s, (255, 0, 255), thresh=tol)
    filled = ImageChops.difference(work, Image.new("RGB", (w, h), (255, 0, 255))).convert("L")
    mask = filled.point(lambda v: 0 if v == 0 else 255).filter(ImageFilter.GaussianBlur(feather))
    out = im.convert("RGBA")
    out.putalpha(mask)
    return out


def contact_shadow(canvas, x0, y0, w, h):
    """接地影。アクスタ・Tシャツを板に置いたように見せる。"""
    s = Image.new("L", canvas.size, 0)
    sd = ImageDraw.Draw(s)
    ew, eh = int(w * 0.62), max(10, int(h * 0.045))
    cx, cy = x0 + w // 2, y0 + h - int(eh * 0.35)
    sd.ellipse([cx - ew // 2, cy - eh // 2, cx + ew // 2, cy + eh // 2], fill=70)
    s = s.filter(ImageFilter.GaussianBlur(canvas.size[0] * 0.022))
    canvas.paste(Image.new("RGB", canvas.size, (150, 115, 130)), (0, 0), s)


def place(src_png, out_name, fill=0.80, center_y=0.50, shadow=True, size=SIZE, bg=None):
    """透過PNG を正方形キャンバスに配置して JPEG 書き出し。"""
    art = trim(src_png if isinstance(src_png, Image.Image) else Image.open(src_png))
    canvas = bg.copy() if bg else make_bg(size)
    limit = size * fill
    scale = min(limit / art.width, limit / art.height)
    w, h = max(1, round(art.width * scale)), max(1, round(art.height * scale))
    art = art.resize((w, h), Image.LANCZOS)
    x0, y0 = (size - w) // 2, round(size * center_y - h / 2)
    if shadow:
        contact_shadow(canvas, x0, y0, w, h)
    canvas.paste(art, (x0, y0), art)
    save(canvas, out_name)


def grid(src_pngs, out_name, cols=3, fill=0.90, gap=0.035, size=SIZE, shadow=True):
    """複数の透過PNG を格子状に並べて 1 枚の正方形に（アクスタ 6 種の全体像用）。"""
    arts = [trim(p if isinstance(p, Image.Image) else Image.open(p)) for p in src_pngs]
    rows = -(-len(arts) // cols)
    cw = size * fill / cols
    gap_px = size * gap
    ch = (size * fill - gap_px * (rows - 1)) / rows
    scale = min(min(cw / a.width, ch / a.height) for a in arts)
    canvas = make_bg(size)
    cell_w = size * fill / cols
    total_h = rows * ch + gap_px * (rows - 1)
    top = (size - total_h) / 2
    for i, a in enumerate(arts):
        w, h = max(1, round(a.width * scale)), max(1, round(a.height * scale))
        a = a.resize((w, h), Image.LANCZOS)
        r, c = divmod(i, cols)
        cx = (size - size * fill) / 2 + cell_w * (c + 0.5)
        y_base = top + r * (ch + gap_px) + ch          # 各段の底に揃える（アクスタは台座が接地）
        x0, y0 = round(cx - w / 2), round(y_base - h)
        if shadow:
            contact_shadow(canvas, x0, y0, w, h)
        canvas.paste(a, (x0, y0), a)
    save(canvas, out_name)


def photo_square(src, out_name, top_frac=0.0, size=SIZE, quality=82):
    """縦位置写真から正方形を切り出す。top_frac は上端を下げる割合（元画像の高さ比）。"""
    im = Image.open(src).convert("RGB")
    w, h = im.size
    side = min(w, h)
    y0 = min(max(0, round(h * top_frac)), h - side)
    x0 = (w - side) // 2
    save(im.crop((x0, y0, x0 + side, y0 + side)).resize((size, size), Image.LANCZOS), out_name, quality)


def photo_crop(src, out_name, box, size, quality=82):
    """(x0,y0,x1,y1) を割合で指定して切り出す。"""
    im = Image.open(src).convert("RGB")
    w, h = im.size
    x0, y0, x1, y1 = box
    save(im.crop((round(x0 * w), round(y0 * h), round(x1 * w), round(y1 * h))).resize(size, Image.LANCZOS), out_name, quality)


def save(im, name, quality=QUALITY):
    """出力形式は拡張子で決まる。.webp は method=6（最遅・最小）で書き出す。"""
    p = os.path.join(OUT, name)
    os.makedirs(os.path.dirname(p), exist_ok=True) if os.path.dirname(p) else None
    im = im.convert("RGB")
    if name.lower().endswith(".webp"):
        im.save(p, "WEBP", quality=quality, method=6)
    else:
        im.save(p, "JPEG", quality=quality, optimize=True, progressive=True, subsampling=1)
    print(f"{name:28s} {im.size[0]}x{im.size[1]}  {os.path.getsize(p)//1024}KB")


# ---- SAMPLE 透かし ----
# 提供素材のうち「まとめ画像」には先方が SAMPLE を入れているが、ブロマイド1枚ずつのJPEGは素のまま。
# 商品そのもの（＝絵柄）を透かし無しの高解像度で載せると買わずに複製できてしまうため、
# 掲載用に同じ体裁の透かしを重ねる。
WM_FONT = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"


def watermark_sample(im, text="SAMPLE", cols=4.2, alpha=62, angle=8):
    """写真にタイル状の SAMPLE を重ねる（白の淡い塗り＋縁取り。明暗どちらの写真でも読める）。

    回転で四隅が欠けないよう、キャンバスより大きい層に敷きつめてから回して中央を切り出す。
    """
    im = im.convert("RGB")
    w, h = im.size
    pad = round(max(w, h) * 0.45)
    lw, lh = w + pad * 2, h + pad * 2
    layer = Image.new("RGBA", (lw, lh), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    size = max(14, round(w / cols / 4.6))
    try:
        font = ImageFont.truetype(WM_FONT, size)
    except OSError:                      # フォントが無い環境では透かし無しで通す
        return im
    step_x = d.textlength(text, font=font) * 1.7
    step_y = size * 3.2
    for row, y in enumerate(range(0, lh, max(1, round(step_y)))):
        offset = step_x / 2 if row % 2 else 0
        x = offset
        while x < lw:
            d.text((x, y), text, font=font, fill=(255, 255, 255, alpha),
                   stroke_width=max(1, size // 20), stroke_fill=(255, 255, 255, min(255, alpha + 34)))
            x += step_x
    layer = layer.rotate(angle, resample=Image.BICUBIC).crop((pad, pad, pad + w, pad + h))
    im.paste(Image.new("RGB", (w, h), (255, 255, 255)), (0, 0), layer.split()[-1])
    return im


def photo_fit(src, out_name, max_side=1200, quality=80, mark=True):
    """写真を縦横比そのままで長辺 max_side に収める（ブロマイドの掲載用ギャラリー）。"""
    im = Image.open(src)
    im = ImageOps.exif_transpose(im).convert("RGB")
    scale = min(1.0, max_side / max(im.size))
    if scale < 1.0:
        im = im.resize((max(1, round(im.width * scale)), max(1, round(im.height * scale))), Image.LANCZOS)
    if mark:
        im = watermark_sample(im)
    save(im, out_name, quality)
