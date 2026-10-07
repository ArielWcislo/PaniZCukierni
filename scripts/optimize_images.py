#!/usr/bin/env python3
"""Generate responsive WebP images for the gallery while preserving originals."""

import argparse
import sys
from pathlib import Path

ASSETS = Path(__file__).resolve().parent.parent / "assets"
OUTPUT = ASSETS / "optimized"
WIDTHS = (480, 768, 1080)
TEXT_QUALITY = 98
PHOTO_QUALITY = 90
EXCLUDED = {"logo.png", "zdjecie_profilowe.jpg"}
EXTENSIONS = {".png", ".jpg", ".jpeg"}


def select_sources(names):
    available = {
        entry.name: entry
        for entry in ASSETS.iterdir()
        if entry.is_file() and entry.suffix.lower() in EXTENSIONS
    }
    selected = sorted(set(names) if names else set(available) - EXCLUDED)
    sources = []
    stems = set()
    for name in selected:
        if name not in available:
            raise ValueError(f"PNG/JPG file not found in assets: {name}")
        source = available[name]
        # File names are case-insensitive on Windows.
        stem = source.stem.casefold()
        if stem in stems:
            raise ValueError(f"Duplicate output name: {source.stem}")
        stems.add(stem)
        sources.append(source)
    if not sources:
        raise ValueError("No images found to optimize.")
    return sources


def main():
    parser = argparse.ArgumentParser(
        description="Generate 480, 768 and 1080 px WebP images in assets/optimized.",
        epilog="Without arguments: process all PNG/JPG images in assets except the logo and profile photo.",
    )
    parser.add_argument("files", nargs="*", metavar="FILE", help="e.g. serniki_1.png serniki_2.png")
    args = parser.parse_args()

    try:
        from PIL import Image, ImageOps, features
    except ImportError:
        parser.exit(1, "Pillow is missing. Install it with: python -m pip install -r scripts/requirements.txt\n")
    if not features.check("webp"):
        parser.exit(1, "This Pillow installation does not support WebP. Install the official Pillow package from PyPI.\n")

    try:
        sources = select_sources(args.files)
        OUTPUT.mkdir(parents=True, exist_ok=True)
        original_bytes = 0
        full_bytes = 0
        count = 0

        for source in sources:
            original_bytes += source.stat().st_size
            is_text = source.stem.endswith("_1") or source.stem in {"pop_up", "jak_zamawiac"}
            quality = TEXT_QUALITY if is_text else PHOTO_QUALITY

            with Image.open(source) as original:
                # Apply phone photo orientation and preserve PNG transparency.
                oriented = ImageOps.exif_transpose(original)
                has_alpha = "A" in oriented.getbands() or "transparency" in oriented.info
                with oriented.convert("RGBA" if has_alpha else "RGB") as image:
                    for width in WIDTHS:
                        height = max(1, round(width * image.height / image.width))
                        destination = OUTPUT / f"{source.stem}-{width}.webp"
                        temporary = destination.with_suffix(".webp.tmp")
                        try:
                            with image.resize((width, height), Image.Resampling.LANCZOS) as resized:
                                resized.save(temporary, format="WEBP", quality=quality, method=6)
                            # Replace the existing variant only after the write completes.
                            temporary.replace(destination)
                        finally:
                            temporary.unlink(missing_ok=True)
                        size = destination.stat().st_size
                        count += 1
                        if width == WIDTHS[-1]:
                            full_bytes += size
                        print(f"{destination.name}: {size / 1000:.1f} KB")

        reduction = (1 - full_bytes / original_bytes) * 100
        print(
            f"Done: {count} files. 1080 px versions: "
            f"{original_bytes / 1e6:.2f} MB -> {full_bytes / 1e6:.2f} MB "
            f"({reduction:.0f}% smaller)."
        )
        return 0
    except (OSError, ValueError, Image.DecompressionBombError) as error:
        print(f"Error: {error}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
