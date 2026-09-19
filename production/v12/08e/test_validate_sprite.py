from pathlib import Path
from tempfile import TemporaryDirectory
from PIL import Image
from validate_sprite import inspect

with TemporaryDirectory() as folder:
    root = Path(folder)
    def fixture(name, mode, size, transparent):
        p = root / name
        color = (0, 0, 0, 0) if transparent else ((12, 12, 12, 255) if mode == 'RGBA' else (12, 12, 12))
        im = Image.new(mode, size, color)
        if transparent:
            im.paste((200, 100, 150, 255), (100, 100, size[0]-100, size[1]-100))
        im.save(p)
        return inspect(p)
    a = fixture('valid_geometry.png', 'RGBA', (1024, 1536), True)
    assert a['file_gates_pass'] and not a['runtime_ready']
    b = fixture('opaque.png', 'RGBA', (1024, 1536), False)
    assert not b['file_gates']['transparent_background_present']
    c = fixture('poster.png', 'RGBA', (1536, 1024), True)
    assert not c['file_gates']['requested_individual_canvas']
    d = fixture('rgb.png', 'RGB', (1024, 1536), False)
    assert not d['file_gates']['actual_rgba']
    p = root / 'clipped.png'
    im = Image.new('RGBA', (1024, 1536), (0, 0, 0, 0))
    im.paste((200, 100, 150, 255), (0, 200, 300, 900))
    im.save(p)
    assert not inspect(p)['file_gates']['outer_margin_clear']
    assert all(value == 'PENDING' for value in a['manual_gates'].values())
print('6 file-gate assertions passed. This does not certify any character art.')
