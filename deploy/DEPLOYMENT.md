This document describes deploying the Flask admin app (`tools/admin_server.py`) to a Linux VPS using gunicorn + systemd and nginx as a reverse proxy.

Prerequisites
- A Linux VPS (Ubuntu 20.04+ recommended) with `sudo` access.
- Domain DNS pointing `iskconrajampet.org` to the VPS public IP.

Steps
1. SSH into the VPS:

   ssh user@your_server_ip

2. Install system packages (Debian/Ubuntu):

   sudo apt update
   sudo apt install -y python3 python3-venv python3-pip nginx

3. Copy the repository to the server (git clone or upload).

4. Create a Python virtual environment and install dependencies:

   cd /path/to/iskcon_rajampet
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt

5. Test locally with gunicorn:

   source venv/bin/activate
   gunicorn --workers 3 --bind 127.0.0.1:5000 tools.admin_server:app

   Visit http://127.0.0.1:5000/admin/login on the server (use curl or a browser via port-forwarding) to confirm.

6. Create the systemd service (see `deploy/admin_server.service`) and enable it:

   sudo cp deploy/admin_server.service /etc/systemd/system/admin_server.service
   sudo systemctl daemon-reload
   sudo systemctl enable --now admin_server.service
   sudo systemctl status admin_server.service

7. Configure nginx (see `deploy/iskcon_nginx.conf`):

   sudo cp deploy/iskcon_nginx.conf /etc/nginx/sites-available/iskcon
   sudo ln -s /etc/nginx/sites-available/iskcon /etc/nginx/sites-enabled/iskcon
   sudo nginx -t
   sudo systemctl reload nginx

8. Ensure firewall allows HTTP/HTTPS and configure SSL (recommended via Let's Encrypt):

   sudo apt install -y certbot python3-certbot-nginx
   sudo certbot --nginx -d iskconrajampet.org

Notes and tips
- The nginx config proxies `/admin/` and `/api/` to gunicorn on `127.0.0.1:5000`. Static files for the public site can still be served by nginx directly from your repository `main website` directory if desired.
- If you use a platform like Render or Fly, follow their web service instructions and point your domain there instead of configuring nginx.
