import urllib.request, urllib.error, time

time.sleep(15)

url = 'https://examplehr-timeoff-tau.vercel.app/storybook/'
resp = urllib.request.urlopen(url, timeout=20)
body = resp.read(5000).decode('utf-8', errors='replace')

cache = resp.headers.get('x-vercel-cache', 'N/A')
print('Cache:', cache)

if 'href="/storybook/' in body:
    print('FIXED: paths use /storybook/ prefix')
elif 'href="./' in body:
    print('OLD: paths still relative ./')
elif 'href="/' in body:
    print('BROKEN: absolute paths without prefix')

# Check the redirect
try:
    r2 = urllib.request.urlopen('https://examplehr-timeoff-tau.vercel.app/storybook', timeout=15)
    if r2.url.endswith('/'):
        print('Redirect OK: /storybook -> /storybook/')
    else:
        print('NO redirect: final URL =', r2.url)
except urllib.error.HTTPError as e:
    print('Redirect check:', e.code)
except Exception as e:
    print('Redirect error:', type(e).__name__, e)
