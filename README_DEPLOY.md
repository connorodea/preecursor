# Preecursor — Deployment Setup (~10 min)

Static Next.js 16 site. GitHub Actions builds `out/` and rsyncs it to the
connorodea Hetzner VPS (`5.161.239.237`). Nginx serves the files; no Node
runtime runs in production.

---

## (a) GitHub Repository Secrets

Go to **Settings > Secrets and variables > Actions > New repository secret**
and add the four secrets below. All are required; the deploy job fails with a
clear error message if any are missing.

| Secret name          | Value                                         |
|----------------------|-----------------------------------------------|
| `HETZNER_CO_HOST`    | `5.161.239.237`                               |
| `HETZNER_CO_USER`    | `deploy` (or `root` if not using deploy user) |
| `HETZNER_CO_SSH_KEY` | Contents of the private key (~/.ssh/id_...)   |
| `HETZNER_CO_PORT`    | `22` (optional — omit to use default 22)      |

Optional repository **variable** (not secret):

| Variable name | Value                   | Default              |
|---------------|-------------------------|----------------------|
| `APP_DIR`     | `/var/www/preecursor`   | `/var/www/preecursor`|

Set variables under **Settings > Secrets and variables > Actions > Variables**.

---

## (b) One-Time VPS Bootstrap (run once on 5.161.239.237)

SSH in as root (`ssh hetznerCO` or `ssh root@5.161.239.237`), then:

```bash
# 1. Create a dedicated deploy user with limited sudo access
adduser --disabled-password --gecos "" deploy
mkdir -p /home/deploy/.ssh
# Paste the *public* key that matches HETZNER_CO_SSH_KEY:
echo "ssh-ed25519 AAAA... deploy@github-actions" >> /home/deploy/.ssh/authorized_keys
chmod 700 /home/deploy/.ssh && chmod 600 /home/deploy/.ssh/authorized_keys
chown -R deploy:deploy /home/deploy/.ssh

# 2. Grant deploy user NOPASSWD sudo for nginx operations only
cat > /etc/sudoers.d/deploy-nginx << 'EOF'
deploy ALL=(ALL) NOPASSWD: /usr/sbin/nginx -t, /bin/systemctl reload nginx
EOF
chmod 440 /etc/sudoers.d/deploy-nginx

# 3. Create the web root and set ownership
mkdir -p /var/www/preecursor
chown deploy:deploy /var/www/preecursor

# 4. Install nginx
apt update && apt install -y nginx

# 5. Install the site config
cp /path/to/repo/deploy/nginx.preecursor.conf /etc/nginx/sites-available/preecursor.conf
ln -sf /etc/nginx/sites-available/preecursor.conf /etc/nginx/sites-enabled/preecursor.conf
# Optionally disable the default site:
# rm -f /etc/nginx/sites-enabled/default

# 6. Test and start nginx
nginx -t && systemctl enable nginx && systemctl start nginx

# 7. Install certbot and obtain TLS certificates (after DNS is live — see below)
apt install -y certbot python3-certbot-nginx
certbot --nginx -d preecursor.com -d www.preecursor.com
# certbot adds the 443 block and HTTP->HTTPS redirect automatically.
# It also installs a cron/systemd timer for auto-renewal.
```

---

## (c) DNS — Namecheap (manual, user-approved step)

This is a **manual action**. Do not perform DNS changes automatically.

Log into Namecheap under the `connorodea` account and add:

| Type | Host | Value            | TTL  |
|------|------|------------------|------|
| A    | @    | `5.161.239.237`  | 300  |
| A    | www  | `5.161.239.237`  | 300  |

Notes:
- Use a short TTL (300 s / 5 min) while cutting over; raise to 3600 after confirming the site loads.
- API access uses `$NAMECHEAP_API_KEY` with ClientIp `75.70.129.239` (whitelisted).
- DNS propagation typically takes 5–30 minutes but can take up to 48 hours.

---

## (d) Triggering a Deploy & Rollback

### Normal deploy
Push to `main` (or merge a PR into `main`). The workflow runs automatically.
You can also trigger manually: **Actions > CI / Deploy > Run workflow**.

### Rollback procedure

**Option 1 — Re-deploy a previous commit (preferred)**

```bash
# Find the commit you want to revert to
git log --oneline -10

# Create a revert commit (preserves history)
git revert <bad-commit-sha>
git push origin main
# The workflow re-runs and deploys the reverted state.
```

**Option 2 — Emergency: restore from timestamped backup on the box**

If you want to keep a timestamped copy of each deploy on the VPS, add this
to the `ssh ...` reload step in the workflow (before `nginx -t`):

```bash
# On the VPS, snapshot the current live files before overwriting:
cp -a /var/www/preecursor /var/www/preecursor.$(date +%Y%m%d-%H%M%S)
```

To restore: `ssh hetznerCO` then `rsync -a /var/www/preecursor.20260615-143022/ /var/www/preecursor/`
followed by `sudo nginx -t && sudo systemctl reload nginx`.

---

## Quick health check

```bash
# From your local machine
curl -I https://preecursor.com

# On the VPS
sudo nginx -t
sudo systemctl status nginx
ls -lh /var/www/preecursor/index.html
```
