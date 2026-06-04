import urllib.request, re

resp = urllib.request.urlopen('https://examplehr-timeoff-tau.vercel.app/storybook/', timeout=20)
body = resp.read(5000).decode('utf-8', errors='replace')
cache = resp.headers.get('x-vercel-cache', 'N/A')
print('Cache:', cache)

hrefs = re.findall(r'href="([^"]*)"', body)
for p in hrefs[:6]:
    print(p)
