"""File-level gates for one V12 character-only source candidate.

Passing this script is NOT animation/art approval. Identity, anatomy, weapon
continuity and absence of scenery require recorded visual review.
Never resize or erase source pixels to make a failing file appear to pass.
"""
from pathlib import Path
import argparse
import hashlib
import json
from PIL import Image

TARGET = (1024, 1536)


def inspect(path: Path) -> dict:
    original = path.read_bytes()
    with Image.open(path) as image:
        image.load()
        alpha = image.convert("RGBA").getchannel("A")
        histogram = alpha.histogram()
        bounds = alpha.point(lambda value: 255 if value > 8 else 0).getbbox()
        edge_pixels = sum(value > 8 for value in
            list(alpha.crop((0, 0, image.width, 1)).getdata()) +
            list(alpha.crop((0, image.height-1, image.width, image.height)).getdata()) +
            list(alpha.crop((0, 1, 1, image.height-1)).getdata()) +
            list(alpha.crop((image.width-1, 1, image.width, image.height-1)).getdata()))
        gates = {
            "png": image.format == "PNG",
            "actual_rgba": image.mode == "RGBA",
            "requested_individual_canvas": image.size == TARGET,
            "transparent_background_present": histogram[0] > image.width*image.height*.05,
            "visible_art_present": sum(histogram[9:]) > 0,
            "outer_margin_clear": edge_pixels == 0,
        }
        return {
            "file": path.name, "sha256": hashlib.sha256(original).hexdigest(),
            "bytes": len(original), "size": list(image.size), "mode": image.mode,
            "alpha_extrema": list(alpha.getextrema()), "fully_transparent_pixels": histogram[0],
            "visible_alpha_bounds": list(bounds) if bounds else None,
            "edge_pixels_above_8": edge_pixels, "file_gates": gates,
            "file_gates_pass": all(gates.values()),
            "manual_gates": {key: "PENDING" for key in
                ("identity", "biomechanics", "continuity", "gameplay_registration", "render_content")},
            "runtime_ready": False,
        }


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("files", nargs="+", type=Path)
    parser.add_argument("--report", type=Path)
    args = parser.parse_args()
    results = [inspect(path) for path in args.files]
    payload = json.dumps(results, indent=2)
    if args.report:
        args.report.parent.mkdir(parents=True, exist_ok=True)
        args.report.write_text(payload + "\n")
    else:
        print(payload)
    raise SystemExit(0 if all(item["file_gates_pass"] for item in results) else 1)
