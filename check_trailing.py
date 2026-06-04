import urllib.request, urllib.error

# Check with trailing slash
r1 = urllib.request.urlopen('https://examplehr-timeoff-tau.vercel.app/storybook/', timeout=15)
body1 = r1.read(500).decode('utf-8', errors='replace')
cache1 = r1.headers.get('x-vercel-cache', 'N/A')
print(f'With slash /storybook/:')
print(f'  Status: {r1.status}')
print(f'  Cache: {cache1}')
if '<title' in body1:
    start = body1.find('<title')
    end = body1.find('>', start) + 1
    end2 = body1.find('</title>', end)
    print(f'  Title: {body1[end:end2]}')

# Check without trailing slash
try:
    r2 = urllib.request.urlopen('https://examplehr-timeoff-tau.vercel.app/storybook', timeout=15)
    body2 = r2.read(500).decode('utf-8', errors='replace')
    cache2 = r2.headers.get('x-vercel-cache', 'N/A')
    print(f'\nWithout slash /storybook:')
    print(f'  Status: {r2.status}')
    print(f'  Cache: {cache2}')
    print(f'  Final URL: {r2.url}')
    if '<title' in body2:
        start = body2.find('<title')
        end = body2.find('>', start) + 1
        end2 = body2.find('</title>', end)
        print(f'  Title: {body2[end:end2]}')
except urllib.error.HTTPError as e:
    print(f'\nWithout slash /storybook: {e.code}')
except Exception as e:
    print(f'\nWithout slash /storybook: Error: {e}')
