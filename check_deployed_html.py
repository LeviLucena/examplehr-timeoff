import urllib.request, re, time

url = 'https://examplehr-timeoff-tau.vercel.app/storybook/?_t=' + str(int(time.time()))

resp = urllib.request.urlopen(url, timeout=20)
body = resp.read(10000).decode('utf-8', errors='replace')

# Find ALL src and href paths
paths = re.findall(r'(?:src|href)="(.*?)"', body)
print('=== Storybook paths ===')
for p in paths:
    print(f'  {p}')
    
print()
print(f'Cache header: {resp.headers.get("x-vercel-cache", "N/A")}')
print(f'Vercel ID: {resp.headers.get("x-vercel-id", "N/A")}')
