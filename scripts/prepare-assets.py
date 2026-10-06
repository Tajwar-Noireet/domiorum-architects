"""Create website-sized copies while keeping all client originals untouched."""
from pathlib import Path
from PIL import Image, ImageOps
from pypdf import PdfReader
import json

root = Path(__file__).resolve().parents[1]
out = root / 'website/public'
manifest = []

def export(image, path, source, max_size=(1920, 1920)):
    target = out / path
    target.parent.mkdir(parents=True, exist_ok=True)
    image = ImageOps.exif_transpose(image).convert('RGB')
    image.thumbnail(max_size, Image.Resampling.LANCZOS)
    image.save(target, 'WEBP', quality=86, method=6)
    manifest.append({'asset': path, 'source': source, 'width': image.width, 'height': image.height})

images = {
    '11a.png': 'images/home/living-overview.webp',
    '6.png': 'images/home/living-detail.webp',
    '201.png': 'images/home/stair.webp',
    '24A.png': 'images/home/living-dining.webp',
    '11c.jpg': 'images/projects/selim/dining-view.webp',
    '14bb.jpg': 'images/projects/selim/shared.webp',
    '6d.jpg': 'images/projects/selim/study.webp',
    '1d.jpg': 'images/projects/selim/kitchen.webp',
    '24.jpeg': 'images/projects/selim/bedroom.webp',
    '3A.png': 'images/interiors/bedroom.webp',
    '6D.png': 'images/interiors/bedroom-angle.webp',
    '7a.png': 'images/interiors/kitchen.webp',
    '13A.png': 'images/interiors/utility.webp',
    '25.png': 'images/interiors/dining.webp',
}
for name, dest in images.items():
    export(Image.open(root / 'Pics' / name), dest, f'Pics/{name}')

pdf = PdfReader(root / 'Zarin Nawar_Portfolio 2026_Large.pdf')
for page, index, dest in [(1, 0, 'images/studio/zarin-nawar.webp')]:
    im = list(pdf.pages[page].images)[index]
    export(im.image, dest, f'Zarin Nawar_Portfolio 2026_Large.pdf, page {page+1}, {im.name}')

export(Image.open(root / 'output/assets/Domiorum_Horizontal_Logo.png'),
       'brand/domiorum-banner.webp', 'output/assets/Domiorum_Horizontal_Logo.png', (1000, 1000))
mark = Image.open(root / 'output/assets/Domiorum_Horizontal_Logo.png').crop((68, 61, 355, 403)).convert('RGB')
mark.thumbnail((175, 195), Image.Resampling.LANCZOS)
icon = Image.new('RGB', (256, 256), '#08182E')
icon.paste(mark, ((256-mark.width)//2, (256-mark.height)//2))
icon.convert('RGBA').save(root / 'website/src/app/favicon.ico', sizes=[(16,16),(32,32),(48,48),(64,64)])
icon.resize((180,180), Image.Resampling.LANCZOS).save(out / 'brand/apple-touch-icon.png')
(root / 'website/src/content').mkdir(parents=True, exist_ok=True)
(root / 'website/src/content/asset-manifest.json').write_text(json.dumps(manifest, indent=2))
print(f'Exported {len(manifest)} assets; total {sum(p.stat().st_size for p in out.rglob("*.webp")) / 1024 / 1024:.2f} MB')
