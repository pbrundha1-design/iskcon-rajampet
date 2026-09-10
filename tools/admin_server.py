from flask import Flask, request, jsonify, send_from_directory, redirect, session
from werkzeug.utils import secure_filename
import os, json, random, time, smtplib
from email.message import EmailMessage

APP_ROOT = os.path.dirname(os.path.dirname(__file__))
MAIN_SITE = os.path.join(APP_ROOT, 'main website')
IMAGES_DIR = os.path.join(MAIN_SITE, 'assets', 'images')
DATA_DIR = os.path.join(MAIN_SITE, 'data')
PHOTOS_FILE = os.path.join(DATA_DIR, 'photos.json')
EVENTS_FILE = os.path.join(DATA_DIR, 'events.json')

os.makedirs(IMAGES_DIR, exist_ok=True)
os.makedirs(DATA_DIR, exist_ok=True)
for path in [PHOTOS_FILE, EVENTS_FILE]:
    if not os.path.exists(path):
        with open(path, 'w', encoding='utf-8') as f:
            json.dump([], f, ensure_ascii=False, indent=2)

app = Flask(__name__, static_folder=None)
# Allow overriding secret values via environment variables for hosted deployments
app.secret_key = os.getenv('SECRET_KEY', 'iskcon-admin-secret-key')
SHARED_PASSWORD = os.getenv('SHARED_PASSWORD', 'RadhaKrishna@rjpt12')
ALLOWED_EMAILS = {
    'pseenu303@gmail.com',
    'iskconrajampet@gmail.com',
    'pbrindavandas@gmail.com'
}
OTP_EXPIRY_SECONDS = 180


@app.route('/')
def root():
    return redirect('/admin/')


@app.route('/admin/')
def admin_index():
    if not session.get('admin_logged_in'):
        return redirect('/admin/login')
    return send_from_directory(os.path.join(MAIN_SITE, 'admin'), 'index.html')


@app.route('/admin')
def admin_index_no_slash():
    return redirect('/admin/')


@app.route('/admin/index.html')
def admin_index_html():
    return redirect('/admin/')


@app.route('/admin/login.html')
def admin_login_html():
    return redirect('/admin/login')


def generate_otp():
    return f"{random.randint(100000, 999999)}"


def send_otp_email(email, otp):
    host = os.getenv('SMTP_HOST')
    port = int(os.getenv('SMTP_PORT', '587'))
    user = os.getenv('SMTP_USER')
    password = os.getenv('SMTP_PASS')
    if host and user and password:
        msg = EmailMessage()
        msg['Subject'] = 'ISKCON Rajampet admin OTP'
        msg['From'] = user
        msg['To'] = email
        msg.set_content(f'Your ISKCON Rajampet admin OTP is: {otp}\nIt expires in 3 minutes.')
        try:
            with smtplib.SMTP(host, port) as smtp:
                smtp.starttls()
                smtp.login(user, password)
                smtp.send_message(msg)
            return True, 'OTP sent to your email.'
        except Exception as exc:
            print(f'OTP email failed: {exc}')
    print(f'[OTP] {email}: {otp}')
    return False, 'OTP generated. It has been printed to the server console for local testing.'


@app.route('/admin/login', methods=['GET', 'POST'])
def admin_login():
    if session.get('admin_logged_in'):
        return redirect('/admin/')

    if request.method == 'POST':
        email = request.form.get('email', '').strip().lower()
        password = request.form.get('password', '').strip()

        if email not in ALLOWED_EMAILS or password != SHARED_PASSWORD:
            return jsonify({'error': 'Access denied'}), 401

        session['admin_logged_in'] = True
        session['admin_email'] = email
        return redirect('/admin/')

    return send_from_directory(os.path.join(MAIN_SITE, 'admin'), 'login.html')


@app.route('/admin/style.css')
def admin_style():
    return send_from_directory(os.path.join(MAIN_SITE, 'admin'), 'style.css')


@app.route('/admin/logout')
def admin_logout():
    session.clear()
    return redirect('/admin/login')


@app.route('/admin/upload-photos', methods=['POST'])
def upload_photos():
    name = request.form.get('name', '').strip()
    caption = request.form.get('caption', '').strip()
    files = request.files.getlist('photos')

    if not name:
        return jsonify({'error': 'name required'}), 400
    if not files:
        return jsonify({'error': 'select at least one photo'}), 400

    saved = []
    for f in files:
        if not f.filename:
            continue
        filename = secure_filename(f.filename)
        dest = os.path.join(IMAGES_DIR, filename)
        f.save(dest)
        saved.append({
            'name': name,
            'caption': caption,
            'filename': filename,
            'url': f'assets/images/{filename}'
        })

    with open(PHOTOS_FILE, 'r+', encoding='utf-8') as fh:
        data = json.load(fh)
        data = saved + data
        fh.seek(0)
        json.dump(data, fh, ensure_ascii=False, indent=2)
        fh.truncate()

    return jsonify({'status': 'ok', 'uploaded': saved})


@app.route('/admin/add-event', methods=['POST'])
def add_event():
    event = {
        'name': request.form.get('name', '').strip(),
        'date': request.form.get('date', '').strip(),
        'time': request.form.get('time', '').strip(),
        'place': request.form.get('place', '').strip(),
        'description': request.form.get('description', '').strip()
    }
    if not event['name'] or not event['date']:
        return jsonify({'error': 'name and date required'}), 400

    with open(EVENTS_FILE, 'r+', encoding='utf-8') as fh:
        data = json.load(fh)
        data.insert(0, event)
        fh.seek(0)
        json.dump(data, fh, ensure_ascii=False, indent=2)
        fh.truncate()

    return jsonify({'status': 'ok', 'event': event})


@app.route('/api/photos')
def api_photos():
    with open(PHOTOS_FILE, 'r', encoding='utf-8') as fh:
        return jsonify(json.load(fh))


@app.route('/api/events')
def api_events():
    with open(EVENTS_FILE, 'r', encoding='utf-8') as fh:
        return jsonify(json.load(fh))


@app.errorhandler(405)
def method_not_allowed(e):
    # Log the method and path for easier debugging when a 405 occurs
    print(f'405 Method Not Allowed: {request.method} {request.path}')
    return jsonify({'error': 'Method Not Allowed', 'method': request.method, 'path': request.path}), 405


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
