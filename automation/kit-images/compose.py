# Camera + Solar Panel 2 product image, built only from our existing product photos (white background, 980x980 like the rest).
# Rotem 6.10.2026: when the price includes a solar panel, the picture must show the panel too.
import sys
from PIL import Image, ImageChops, ImageDraw

SRC = sys.argv[1] if len(sys.argv) > 1 else "public/store-images"  # run from the repo root
PANEL = f"{SRC}/reolink-solar-panel-2-v2.webp"
JOBS = [  # (camera image, output name)
    ("reolink-go-ultra-v2.webp", "reolink-go-ultra-solar-kit.webp"),
    ("reolink-trackmix-lte-v2.webp", "reolink-trackmix-lte-solar-kit.webp"),
    ("reolink-go-pt-ultra-v2.webp", "reolink-go-pt-ultra-solar-kit.webp"),
]
S = 980


def content(path):
    im = Image.open(path).convert("RGB")
    diff = ImageChops.difference(im, Image.new("RGB", im.size, (255, 255, 255))).convert("L").point(lambda v: 255 if v > 10 else 0)
    box = diff.getbbox()
    return im.crop(box)


def fit(im, w, h):
    r = min(w / im.width, h / im.height)
    return im.resize((max(1, round(im.width * r)), max(1, round(im.height * r))), Image.LANCZOS)


panel_src = content(PANEL)
for cam_name, out in JOBS:
    cam = fit(content(f"{SRC}/{cam_name}"), 440, 640)
    panel = fit(panel_src, 400, 520)
    gap = 90
    # scale the whole group up to fill the square like the single-product photos (max 920 wide, 820 high)
    k = min(920 / (panel.width + gap + cam.width), 820 / max(panel.height, cam.height))
    if k > 1:
        cam, panel, gap = cam.resize((round(cam.width * k), round(cam.height * k)), Image.LANCZOS), panel.resize((round(panel.width * k), round(panel.height * k)), Image.LANCZOS), round(gap * k)
    canvas = Image.new("RGB", (S, S), (255, 255, 255))
    total = panel.width + gap + cam.width
    x0 = (S - total) // 2
    # camera on the right (read first in RTL), panel on the left, both centred vertically
    canvas.paste(panel, (x0, (S - panel.height) // 2 + 30))
    canvas.paste(cam, (x0 + panel.width + gap, (S - cam.height) // 2))
    d = ImageDraw.Draw(canvas)
    cx, cy, a = x0 + panel.width + gap // 2, S // 2, 18
    d.line((cx - a, cy, cx + a, cy), fill=(150, 150, 160), width=7)
    d.line((cx, cy - a, cx, cy + a), fill=(150, 150, 160), width=7)
    canvas.save(f"{SRC}/{out}", "WEBP", quality=88, method=6)
    print(out, cam.size, panel.size)
