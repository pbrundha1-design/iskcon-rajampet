import urllib.request
import urllib.parse
import http.cookiejar

cj = http.cookiejar.CookieJar()
opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))
base = 'http://127.0.0.1:5000'

print('GET /admin/login')
try:
    req = urllib.request.Request(base + '/admin/login', method='GET')
    resp = opener.open(req, timeout=10)
    print('status', resp.status)
except Exception as e:
    print('error', e)

print('\nPOST /admin/login')
try:
    data = urllib.parse.urlencode({'email':'pseenu303@gmail.com', 'password':'RadhaKrishna@rjpt12'}).encode('utf-8')
    req = urllib.request.Request(base + '/admin/login', data=data, method='POST')
    req.add_header('Content-Type','application/x-www-form-urlencoded')
    resp = opener.open(req, timeout=10)
    print('status', resp.status)
    print('location', resp.getheader('Location'))
except urllib.error.HTTPError as e:
    print('status', e.code)
    print('body', e.read().decode())
except Exception as e:
    print('error', e)

print('\nPOST /admin/upload-photos (dummy file)')
try:
    boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW'
    parts = []
    parts.append('--' + boundary)
    parts.append('Content-Disposition: form-data; name="name"')
    parts.append('')
    parts.append('Test Photo')
    parts.append('--' + boundary)
    parts.append('Content-Disposition: form-data; name="caption"')
    parts.append('')
    parts.append('Dummy caption')
    parts.append('--' + boundary)
    parts.append('Content-Disposition: form-data; name="photos"; filename="test.jpg"')
    parts.append('Content-Type: image/jpeg')
    parts.append('')
    parts.append('JPEGDATA')
    parts.append('--' + boundary + '--')
    body = '\r\n'.join(parts) + '\r\n'
    data = body.encode('utf-8')
    req = urllib.request.Request(base + '/admin/upload-photos', data=data, method='POST')
    req.add_header('Content-Type', 'multipart/form-data; boundary=' + boundary)
    resp = opener.open(req, timeout=10)
    print('status', resp.status)
    print(resp.read().decode())
except urllib.error.HTTPError as e:
    print('status', e.code)
    print('body', e.read().decode())
except Exception as e:
    print('error', e)
