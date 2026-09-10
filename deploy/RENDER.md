Quick steps to deploy on Render (easy option)

1. Create a Render account at https://render.com and connect your Git repository hosting this project.

2. Create a new "Web Service":
   - Connect the repository and pick the branch to deploy.
   - Environment: `Python 3` (auto-detected).
   - Build Command: leave empty or `pip install -r requirements.txt` (Render runs pip automatically).
   - Start Command: leave empty (Render will use the `Procfile`) or set:
     ```
     gunicorn tools.admin_server:app --bind 0.0.0.0:$PORT
     ```
   - Instance type: free or small (depending on your needs).

3. Set environment variables in Render dashboard (Environment -> Environment Variables):
   - `SECRET_KEY` — set to a strong random string.
   - `SHARED_PASSWORD` — the admin password (overrides the default in code).
   - Optional SMTP vars for OTP emails: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`.

4. Deploy the service.

5. Configure a custom domain (optional):
   - In Render, add `iskconrajampet.org` as a custom domain for the web service.
   - Render will give you DNS records (CNAME/ALIAS) to add at your domain registrar.

6. Verify:
   - Visit `https://<your-render-domain>/admin/login` and test login POST.

Notes
- Render sets the `$PORT` environment variable automatically; the `Procfile` uses it.
- If you prefer using a subdomain like `admin.iskconrajampet.org`, add that as the custom domain on Render and update DNS accordingly.
