#!/usr/bin/env python3
"""Regenerate the favicon set and the in-page logo from the OasisXVII mark.

Source: https://ik.imagekit.io/pxus1osjev/OasisXVII/IMG_6961.PNG
        2500x2500 RGBA, a pure-black glyph on a fully transparent background.

Run by hand when the mark changes; the outputs are committed. Needs Pillow,
which is a dev-time dependency only and deliberately not in package.json:

    python3 scripts/generate-icons.py

Black on transparent is invisible in a dark tab strip and on this site's own
#0F0F14 background, so the glyph is recoloured to the `on-surface` token and —
for the icon slots, which have no page behind them — composited onto a solid
tile. CSS `filter: invert(1)` is not an option: it yields pure #FFFFFF, which
tailwind.config.ts rules out.
"""

import io
import urllib.request
from pathlib import Path

from PIL import Image

SOURCE = "https://ik.imagekit.io/pxus1osjev/OasisXVII/IMG_6961.PNG"
GLYPH = (0xE4, 0xE1, 0xE9)  # on-surface
TILE = (0x0F, 0x0F, 0x14)  # background

ROOT = Path(__file__).resolve().parent.parent

# (path, size, inset, tile) — inset is the share of the canvas left as margin
# on each side; tile None means keep the background transparent.
OUTPUTS = [
    ("src/app/icon.png", 32, 0.10, TILE),
    ("src/app/icon1.png", 192, 0.10, TILE),
    # iOS rounds the corners and composites transparency onto black, so this
    # one needs both the opaque tile and a wider margin than the tab icons.
    ("src/app/apple-icon.png", 180, 0.14, TILE),
    # The navbar and footer already supply a dark surface behind the mark.
    ("public/oasisxvii-mark.png", 256, 0.04, None),
]


def load_glyph() -> Image.Image:
    """Fetch the source, trim its dead margin, and recolour it."""
    with urllib.request.urlopen(SOURCE) as response:
        source = Image.open(io.BytesIO(response.read())).convert("RGBA")

    alpha = source.getchannel("A")
    glyph = source.crop(alpha.getbbox())

    # Replace the RGB wholesale but keep the alpha, so the anti-aliased edges
    # survive as partial coverage of the new colour rather than grey fringing.
    recoloured = Image.new("RGBA", glyph.size, (*GLYPH, 0))
    recoloured.putalpha(glyph.getchannel("A"))
    return recoloured


def render(glyph: Image.Image, size: int, inset: float, tile) -> Image.Image:
    canvas = Image.new("RGBA", (size, size), (*tile, 255) if tile else (0, 0, 0, 0))
    box = round(size * (1 - 2 * inset))
    scaled = glyph.resize((box, box), Image.LANCZOS)
    offset = (size - box) // 2
    canvas.alpha_composite(scaled, (offset, offset))
    return canvas


def main() -> None:
    glyph = load_glyph()
    print(f"source glyph trimmed to {glyph.size[0]}x{glyph.size[1]}")

    for name, size, inset, tile in OUTPUTS:
        path = ROOT / name
        path.parent.mkdir(parents=True, exist_ok=True)
        render(glyph, size, inset, tile).save(path, optimize=True)
        backing = "transparent" if tile is None else "#%02X%02X%02X" % tile
        print(f"  {name}  {size}x{size}  {backing}  {path.stat().st_size}B")


if __name__ == "__main__":
    main()
