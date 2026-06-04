import urllib.request, json

req = urllib.request.Request('https://api.github.com/repos/LeviLucena/examplehr-timeoff/deployments?per_page=5')
req.add_header('Accept', 'application/vnd.github.v3+json')
resp = urllib.request.urlopen(req, timeout=10)
deployments = json.loads(resp.read())

for d in deployments:
    sha = d['sha'][:8]
    print(f'SHA: {sha}')
    req2 = urllib.request.Request(d['statuses_url'])
    req2.add_header('Accept', 'application/vnd.github.v3+json')
    resp2 = urllib.request.urlopen(req2, timeout=10)
    statuses = json.loads(resp2.read())
    if statuses:
        print(f'  State: {statuses[0]["state"]}')
        print(f'  Created: {d["created_at"]}')
    print()
