import os
import re
import ssl
import json
import urllib.request
import urllib.parse
from html.parser import HTMLParser

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
}

TARGETS = [
    {
        'category': 'corporate',
        'url': 'https://citrusleisure.com/',
        'dir': 'assets/images/corporate'
    },
    {
        'category': 'waskaduwa',
        'url': 'https://waskaduwa.citrusleisure.com/',
        'dir': 'assets/images/waskaduwa'
    },
    {
        'category': 'hikkaduwa',
        'url': 'https://hikkaduwa.citrusleisure.com/',
        'dir': 'assets/images/hikkaduwa'
    },
    {
        'category': 'steuart',
        'url': 'https://steuart.citrusleisure.com/',
        'dir': 'assets/images/steuart'
    }
]

class ImageFinder(HTMLParser):
    def __init__(self, base_url):
        super().__init__()
        self.base_url = base_url
        self.images = []

    def handle_starttag(self, tag, attrs):
        attr_dict = dict(attrs)
        
        # Check standard img tags
        if tag == 'img':
            for attr in ['src', 'data-src', 'data-lazy-src', 'data-original']:
                val = attr_dict.get(attr)
                if val:
                    full_url = urllib.parse.urljoin(self.base_url, val)
                    self.images.append({
                        'url': full_url,
                        'alt': attr_dict.get('alt', ''),
                        'tag': tag
                    })
            # check srcset
            srcset = attr_dict.get('srcset') or attr_dict.get('data-srcset')
            if srcset:
                parts = srcset.split(',')
                for p in parts:
                    items = p.strip().split()
                    if items:
                        full_url = urllib.parse.urljoin(self.base_url, items[0])
                        self.images.append({
                            'url': full_url,
                            'alt': attr_dict.get('alt', ''),
                            'tag': 'srcset'
                        })

        # Check inline styles for background-image
        style = attr_dict.get('style', '')
        if 'url(' in style:
            matches = re.findall(r'url\([\'"]?([^\'")]+)[\'"]?\)', style)
            for m in matches:
                full_url = urllib.parse.urljoin(self.base_url, m)
                self.images.append({
                    'url': full_url,
                    'alt': attr_dict.get('class', 'bg-image'),
                    'tag': 'style-bg'
                })

def extract_and_download():
    manifest = []
    
    for target in TARGETS:
        print(f"\n==========================================")
        print(f"Scanning: {target['url']} ({target['category']})")
        print(f"==========================================")
        
        os.makedirs(target['dir'], exist_ok=True)
        
        try:
            req = urllib.request.Request(target['url'], headers=HEADERS)
            with urllib.request.urlopen(req, context=ctx, timeout=15) as resp:
                html = resp.read().decode('utf-8', errors='ignore')
        except Exception as e:
            print(f"Failed to fetch {target['url']}: {e}")
            continue

        parser = ImageFinder(target['url'])
        parser.feed(html)
        
        # Filter images
        valid_extensions = ('.jpg', '.jpeg', '.png', '.webp')
        seen_urls = set()
        filtered = []
        
        for item in parser.images:
            raw_url = item['url'].split('?')[0] # remove query params for extension check
            # Exclude tiny icons, tracking pixels, logos if too small
            if any(raw_url.lower().endswith(ext) for ext in valid_extensions):
                if item['url'] not in seen_urls:
                    seen_urls.add(item['url'])
                    filtered.append(item)

        print(f"Found {len(filtered)} valid images for {target['category']}.")

        # Download up to 25 top quality images per property
        count = 0
        for idx, item in enumerate(filtered):
            img_url = item['url']
            clean_name = os.path.basename(img_url.split('?')[0])
            if not clean_name or len(clean_name) < 4:
                clean_name = f"image_{idx:03d}.jpg"
            
            # sanitize filename
            clean_name = re.sub(r'[^a-zA-Z0-9_\-\.]', '_', clean_name)
            local_path = os.path.join(target['dir'], clean_name)
            
            try:
                img_req = urllib.request.Request(img_url, headers=HEADERS)
                with urllib.request.urlopen(img_req, context=ctx, timeout=12) as img_resp:
                    content = img_resp.read()
                    
                    # Ignore tiny images (under 5KB, likely spacer or tiny icon)
                    if len(content) < 5000:
                        continue
                    
                    with open(local_path, 'wb') as f:
                        f.write(content)
                    
                    count += 1
                    print(f"  [{count}] Saved: {clean_name} ({len(content)//1024} KB) - {item['alt'][:40]}")
                    
                    manifest.append({
                        'category': target['category'],
                        'original_url': img_url,
                        'local_path': local_path.replace('\\', '/'),
                        'filename': clean_name,
                        'alt': item['alt'],
                        'size_kb': len(content) // 1024
                    })
                    
                    if count >= 20: # limit per site to avoid massive clutter
                        break
            except Exception as e:
                # continue on failed single image
                pass

    with open('assets/images_manifest.json', 'w', encoding='utf-8') as f:
        json.dump(manifest, f, indent=2)

    print(f"\nFinished! Total images extracted: {len(manifest)}")

if __name__ == '__main__':
    extract_and_download()
