"""Verify preserved source bytes. This does not certify animation or remove backgrounds."""
from __future__ import annotations
import hashlib
import json
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent

def inspect(path: Path) -> dict:
    with Image.open(path) as image:
        image.load()
        alpha = image.getchannel('A') if 'A' in image.getbands() else None
        return {
            'sha256': hashlib.sha256(path.read_bytes()).hexdigest(),
            'size': list(image.size),
            'mode': image.mode,
            'fullyTransparentPixels': alpha.histogram()[0] if alpha else 0,
        }

def main() -> None:
    manifest = json.loads((ROOT / 'SOURCE-INTAKE.json').read_text())
    results = []
    for record in manifest['sources']:
        path = (ROOT / record['file']).resolve()
        if not path.is_relative_to(ROOT.resolve()):
            raise ValueError('Source path escaped package')
        actual = inspect(path)
        for field in ('sha256', 'size', 'mode', 'fullyTransparentPixels'):
            if actual[field] != record[field]:
                raise ValueError(f"Source changed: {record['id']} / {field}")
        results.append({'id': record['id'], 'bytesVerified': True,
                        'transparentSpriteExport': False,
                        'animationValidated': False, 'runtimeInstalled': False})
    print(json.dumps({'sourceChecks': results, 'scope': 'Source preservation only'}, indent=2))

if __name__ == '__main__':
    main()
