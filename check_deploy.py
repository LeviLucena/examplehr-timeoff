import urllib.request, json

req = urllib.request.Request('https://api.github.com/repos/LeviLucena/examplehr-timeoff/deployments?per_page=1')
req.add_header('Accept', 'application/vnd.github.v3+json')
resp = urllib.request.urlopen(req, timeout=10)
deployments = json.loads(resp.read())

d = deployments[0]
sha = d['sha'][:8]
print(f'Latest deployed SHA: {sha} from {d["created_at"]}')

req2 = urllib.request.Request(d['statuses_url'])
req2.add_header('Accept', 'application/vnd.github.v3+json')
resp2 = urllib.request.urlopen(req2, timeout=10)
statuses = json.loads(resp2.read())
print(f'Status: {statuses[0]["state"]}')
if statuses[0]['state'] != 'success':
    print(f'Target URL: {statuses[0].get("target_url", "N/A")}')
