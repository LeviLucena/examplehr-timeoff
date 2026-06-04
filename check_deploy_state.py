import urllib.request

resp = urllib.request.urlopen('https://examplehr-timeoff-tau.vercel.app/storybook/', timeout=20)
body = resp.read(5000).decode('utf-8', errors='replace')

# Check if paths are relative or absolute
if 'href="./' in body:
    print("PATHS ARE RELATIVE (fix deployed)")
elif 'href="/' in body:
    print("PATHS ARE ABSOLUTE (old build still live)")
    
# Find the first few href/src to show
import re
paths = re.findall(r'(?:src|href)="(.*?)"', body)
for p in paths[:8]:
    print(f'  -> {p}')
