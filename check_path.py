import urllib.request

resp = urllib.request.urlopen('https://examplehr-timeoff-tau.vercel.app/storybook/', timeout=20)
body = resp.read(5000).decode('utf-8', errors='replace')

idx = body.find('href="/storybook/')
if idx >= 0:
    print('EXPLICIT /storybook/ PREFIX FOUND')
else:
    print('NO explicit /storybook/ prefix - checking for ./')
    if 'href="./' in body:
        print('Relative ./ paths found instead')
    elif 'href="/' in body:
        print('Absolute / paths found')
