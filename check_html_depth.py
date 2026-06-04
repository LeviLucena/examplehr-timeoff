import urllib.request

resp = urllib.request.urlopen('https://examplehr-timeoff-tau.vercel.app/storybook/?cb=1', timeout=20)
body = resp.read(20000).decode('utf-8', errors='replace')

# Check for base tag
if '<base' in body.lower():
    print('BASE TAG FOUND')
    import re
    base = re.search(r'<base[^>]*>', body, re.IGNORECASE)
    if base: print(f'  {base.group(0)}')
else:
    print('No base tag')

# Check for any hardcoded root paths in JS (not in src/href)
import re
# Look for patterns like /sb-addons or /assets in inline scripts
root_refs = re.findall(r'["\']/(?:sb-addons|sb-manager|assets)/[^"\']*["\']', body)
if root_refs:
    print(f'Root-absolute refs in JS: {len(root_refs)}')
    for r in root_refs[:5]:
        print(f'  {r}')
else:
    print('No root-absolute refs in JS')
