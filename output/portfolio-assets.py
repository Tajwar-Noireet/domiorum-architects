from pathlib import Path
from PIL import Image, ImageOps, ImageDraw
import json

root = Path(__file__).resolve().parents[1]
source = root / 'drive-download-20261007T190141Z-1-001'
out = root / 'output' / 'portfolio-review'
out.mkdir(parents=True, exist_ok=True)
inventory = []
for folder in sorted(source.iterdir()):
    if not folder.is_dir(): continue
    files = sorted(p for p in folder.iterdir() if p.suffix.lower() in ['.png', '.jpg', '.jpeg'])
    sheet = Image.new('RGB', (1000, ((len(files)+3)//4)*185), '#eee8dc')
    draw = ImageDraw.Draw(sheet)
    for i, path in enumerate(files):
        with Image.open(path) as im:
            inventory.append({'folder':folder.name, 'file':path.name, 'size':im.size})
            thumb = ImageOps.contain(im.convert('RGB'), (240,150))
            x,y = (i%4)*250,(i//4)*185
            sheet.paste(thumb, (x,y))
            draw.text((x+4,y+152), f'{path.name} {im.width}x{im.height}',fill='#111')
    sheet.save(out / (folder.name + '.jpg'))
(out/'inventory.json').write_text(json.dumps(inventory,indent=2))
print(json.dumps(inventory))

selections = [
 ('Aftabnagar interior','aftabnagar-interior','Aftabnagar','Interiors',
  'Warm timber, pale stone and connected living spaces.',
  [('11a.png','Living room'),('33.png','Dining room'),('45.png','Bedroom'),('107.png','Family lounge'),('115.png','Kitchen'),('201.png','Staircase and storage'),('26.png','Bedroom and workspace'),('28.png','Fitted storage'),('48.png','Dressing area'),('9.png','Living room detail')]),
 ('Doctors Residence','doctors-residence','Doctors Residence','Architecture',
  'A residential building framed by planting and open balconies.',
  [('uuu.jpg','Exterior cover')]),
 ('Edison Interior','edison-interior','Edison','Interiors',
  'Rooms for gathering, reading and quieter everyday routines.',
  [('14bb.jpg','Living and dining'),('6d.jpg','Study and bookshelves'),('24.jpeg','Bedroom'),('11c.jpg','Dining room'),('1d.jpg','Kitchen'),('20a.jpeg','Bedroom and desk'),('23a.jpeg','Workspace and storage'),('3b.jpg','Bedroom with fitted storage'),('4c.jpg','Wardrobes'),('7.jpg','Bedroom library'),('26.jpeg','Bedroom detail')]),
 ('Mirpur Dohs Interior','mirpur-dohs-interior','Mirpur DOHS','Interiors',
  'Soft colour and timber detailing connect the private and shared rooms.',
  [('25.png','Living room'),('21.png','Dining room'),('6D.png','Bedroom'),('28a.png','Sitting room'),('30.png','Dining and display storage'),('34.png','Media wall'),('3A.png','Bedroom detail'),('7a.png','Kitchen'),('9.png','Kitchen storage'),('9A.png','Bedroom media and dressing area'),('33.png','Vanity')]),
 ('RUAP interior','ruap-interior','RUAP','Interiors',
  'Light interiors with sculpted seating and carefully integrated storage.',
  [('26.png','Living room'),('24A.png','Dining room and vanity'),('21.png','Dining room'),('22A.png','Media wall'),('25.png','Dining and kitchen connection'),('13A.png','Kitchen and laundry'),('14A.png','Kitchen workspace')]),
]
records = []
manifest = []
for folder,slug,title,category,summary,chosen in selections:
    dest = root/'website'/'public'/'images'/'projects'/slug
    dest.mkdir(parents=True,exist_ok=True)
    images = []
    for i,(filename,caption) in enumerate(chosen):
        path = source/folder/filename
        with Image.open(path) as im:
            im = ImageOps.exif_transpose(im).convert('RGB')
            original_size = im.size
            im.thumbnail((2400,2400),Image.Resampling.LANCZOS)
            export_name = f'{i+1:02}.webp'
            im.save(dest/export_name,'WEBP',quality=88,method=6)
            src = f'/images/projects/{slug}/{export_name}'
            alt = f'{caption} design visualization for {title}'
            images.append(dict(src=src,alt=alt,caption=caption))
            manifest.append(dict(project=slug,source=f'{folder}/{filename}',output=src,originalSize=original_size,exportSize=im.size))
    records.append(dict(slug=slug,title=title,category=category,location='',area='',areaLabel='',summary=summary,
        description=f'{title} brings together the spaces shown in this selection of residential design visualizations.',
        approach=summary,cover=images[0]['src'],coverAlt=images[0]['alt'],images=images if category=='Interiors' else []))
(root/'website'/'src'/'content'/'portfolio.json').write_text(json.dumps(records,indent=2)+'\n')
(root/'website'/'src'/'content'/'portfolio-assets.json').write_text(json.dumps(manifest,indent=2)+'\n')
print(f'Exported {len(manifest)} curated images for {len(records)} projects.')
