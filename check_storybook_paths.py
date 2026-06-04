import urllib.request, re

resp = urllib.request.urlopen('https://examplehr-timeoff-tau.vercel.app/storybook/', timeout=20)
body = resp.read(5000).decode('utf-8', errors='replace')

paths = re.findall(r'(?:src|href)="(.*?)"', body)
for p in paths[:8]:
    print(p)

if re.search(r'href="/storybook/', body):
    print('OK: /storybook/ prefix detected')
elif re.search(r'href="./', body):
    print('OK: relative prefix detected')
else:
    print('WARNING: unexpected path format')
