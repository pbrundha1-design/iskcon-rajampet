import urllib.request, urllib.parse, ssl, http.cookiejar

base = 'https://iskconrajampet.org'
cj = http.cookiejar.CookieJar()
opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))

print('GET /admin/login')
try:
    req = urllib.request.Request(base + '/admin/login', method='GET')
    resp = opener.open(req, timeout=20)
    print('status', resp.status)
    body = resp.read(1000)
    print(body.decode(errors='ignore'))
except urllib.error.HTTPError as e:
    print('status', e.code)
    print('body', e.read().decode(errors='ignore'))
except Exception as e:
    print('error', e)

print('\nPOST /admin/login')
try:
    data = urllib.parse.urlencode({'email':'test','password':'x'}).encode('utf-8')
    req = urllib.request.Request(base + '/admin/login', data=data, method='POST')
    req.add_header('Content-Type','application/x-www-form-urlencoded')
    resp = opener.open(req, timeout=20)
    print('status', resp.status)
    print('location', resp.getheader('Location'))
    body = resp.read(1000)
    print(body.decode(errors='ignore'))
except urllib.error.HTTPError as e:
    print('status', e.code)
    print('body', e.read().decode(errors='ignore'))
except Exception as e:
    print('error', e)
