# pgAdmin 4 — Server Mode Deployment (SSH-accessible host)

Reference: https://www.pgadmin.org/docs/pgadmin4/9.14/server_deployment.html

---

## Overview

pgAdmin 4 is installed via the official APT repository. Because `setup-web.sh` defaults to
Apache + mod_wsgi, we skip it and wire up **gunicorn + nginx** manually instead.
The APT package provides all pgAdmin files under `/usr/pgadmin4/`.

Access is secured via SSH tunnelling — pgAdmin is not exposed to the public internet directly.

---

## Todo List

### 1. Install pgAdmin 4 via APT

- [ ] Add the pgAdmin signing key:
  ```sh
  curl -fsS https://www.pgadmin.org/static/packages_pgadmin_org.pub | \
    sudo gpg --dearmor -o /usr/share/keyrings/packages-pgadmin-org.gpg
  ```
- [ ] Add the pgAdmin APT source:
  ```sh
  sudo sh -c 'echo "deb [signed-by=/usr/share/keyrings/packages-pgadmin-org.gpg] \
    https://ftp.postgresql.org/pub/pgadmin/pgadmin4/apt/$(lsb_release -cs) pgadmin4 main" \
    > /etc/apt/sources.list.d/pgadmin4.list && apt update'
  ```
- [ ] Install the web package (do **not** run `setup-web.sh`):
  ```sh
  sudo apt install pgadmin4-web
  ```
- [ ] Install gunicorn into the pgAdmin venv:
  ```sh
  sudo /usr/pgadmin4/venv/bin/pip install gunicorn
  ```
- [ ] Install nginx:
  ```sh
  sudo apt install -y nginx
  ```

### 2. Create system user and data directories

`setup-web.sh` would normally do this — we do it manually instead.

- [ ] Create a non-login system user:
  ```sh
  sudo useradd --system --no-create-home --shell /usr/sbin/nologin pgadmin
  ```
- [ ] Create data directories and set ownership:
  ```sh
  sudo mkdir -p /var/lib/pgadmin4/sessions /var/lib/pgadmin4/storage
  sudo mkdir -p /var/log/pgadmin4
  sudo chown -R pgadmin:pgadmin /var/lib/pgadmin4 /var/log/pgadmin4
  sudo chmod 700 /var/lib/pgadmin4/sessions
  ```

### 3. Configure pgAdmin (`config_local.py`)

- [ ] Create `/usr/pgadmin4/web/config_local.py`:
  ```python
  SERVER_MODE = True
  DEFAULT_SERVER = '127.0.0.1'

  DATA_DIR        = '/var/lib/pgadmin4'
  LOG_FILE        = '/var/log/pgadmin4/pgadmin4.log'
  SQLITE_PATH     = '/var/lib/pgadmin4/pgadmin4.db'
  SESSION_DB_PATH = '/var/lib/pgadmin4/sessions'
  STORAGE_DIR     = '/var/lib/pgadmin4/storage'

  MAX_LOGIN_ATTEMPTS       = 5
  ENHANCED_COOKIE_PROTECTION = True
  SESSION_COOKIE_SECURE    = False   # no HTTPS in SSH-tunnel pattern
  ENABLE_PSQL              = False   # disable shell access in server mode
  ALLOW_SAVE_PASSWORD      = True
  ```

### 4. Initialise the database and create the first admin user

- [ ] Run setup as the `pgadmin` user:
  ```sh
  sudo -u pgadmin /usr/pgadmin4/venv/bin/python \
    /usr/pgadmin4/web/setup.py setup-db
  ```
  You will be prompted for an admin e-mail and password.

### 5. Set up gunicorn as a systemd service

- [ ] Create `/etc/systemd/system/pgadmin4.service`:
  ```ini
  [Unit]
  Description=pgAdmin 4 web interface
  After=network.target

  [Service]
  User=pgadmin
  Group=pgadmin
  Environment=HOME=/var/lib/pgadmin4
  ExecStart=/usr/pgadmin4/venv/bin/gunicorn \
      --workers=1 \
      --threads=25 \
      --bind=unix:/run/pgadmin4/pgadmin4.sock \
      --chdir /usr/pgadmin4/web \
      pgAdmin4:app
  RuntimeDirectory=pgadmin4
  RuntimeDirectoryMode=0755
  Restart=always

  [Install]
  WantedBy=multi-user.target
  ```
- [ ] Enable and start the service:
  ```sh
  sudo systemctl daemon-reload
  sudo systemctl enable pgadmin4
  sudo systemctl start pgadmin4
  sudo systemctl status pgadmin4
  ```

### 6. Configure nginx as reverse proxy

- [ ] Create `/etc/nginx/sites-available/pgadmin4`:
  ```nginx
  server {
      listen 127.0.0.1:5050;   # localhost only — accessed via SSH tunnel
      server_name localhost;

      location /pgadmin4/ {
          proxy_pass       http://unix:/run/pgadmin4/pgadmin4.sock;
          proxy_set_header Host $host;
          proxy_set_header X-Real-IP $remote_addr;
          proxy_set_header X-Script-Name /pgadmin4;
          proxy_redirect   off;
      }
  }
  ```
- [ ] Enable the site and reload nginx:
  ```sh
  sudo ln -s /etc/nginx/sites-available/pgadmin4 /etc/nginx/sites-enabled/
  sudo nginx -t
  sudo systemctl reload nginx
  ```

### 7. Access via SSH tunnel

pgAdmin is intentionally **not** exposed to the public internet.

#### One-off manual tunnel

```sh
ssh -L 5050:127.0.0.1:5050 user@your-server-hostname -N
```

Then open `http://localhost:5050/pgadmin4/` and log in with the credentials from step 4.

#### Persistent tunnel on macOS (auto-start on network connectivity)

Use `autossh` (restarts the tunnel on drop) managed by a LaunchAgent (starts on login, stays up).

- [ ] Install autossh:
  ```sh
  brew install autossh
  ```
- [ ] Create `~/Library/LaunchAgents/local.pgadmin.tunnel.plist`:
  ```xml
  <?xml version="1.0" encoding="UTF-8"?>
  <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
    "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
  <plist version="1.0">
  <dict>
      <key>Label</key>
      <string>local.pgadmin.tunnel</string>
      <key>ProgramArguments</key>
      <array>
          <string>/opt/homebrew/bin/autossh</string>
          <string>-M</string><string>0</string>
          <string>-o</string><string>ServerAliveInterval=30</string>
          <string>-o</string><string>ServerAliveCountMax=3</string>
          <string>-o</string><string>ExitOnForwardFailure=yes</string>
          <string>-o</string><string>StrictHostKeyChecking=no</string>
          <string>-N</string>
          <string>-L</string><string>5050:127.0.0.1:5050</string>
          <string>user@your-server-hostname</string>
      </array>
      <key>RunAtLoad</key><true/>
      <key>KeepAlive</key><true/>
  </dict>
  </plist>
  ```
  > Note: use `/usr/local/bin/autossh` on Intel Macs instead of `/opt/homebrew/bin/autossh`.

- [ ] Load the agent (takes effect immediately, survives reboots):
  ```sh
  launchctl load ~/Library/LaunchAgents/local.pgadmin.tunnel.plist
  ```
- [ ] Verify the tunnel is up:
  ```sh
  curl -s -o /dev/null -w "%{http_code}" http://localhost:5050/pgadmin4/
  # expect 200 or 302
  ```

To stop/start manually:
```sh
launchctl unload ~/Library/LaunchAgents/local.pgadmin.tunnel.plist
launchctl load   ~/Library/LaunchAgents/local.pgadmin.tunnel.plist
```

### Q and A
#### Q: my user is being asked for a password while I usually access using public key. No prompt - am I connected?

A: The -N flag opens the tunnel but gives no output — silence means it's working. To confirm:

* in a second terminal, while the tunnel is open:
curl -s -o /dev/null -w "%{http_code}" http://localhost:5050/pgadmin4/
You should get 200 (or 301/302). If you get 000 or Connection refused, the tunnel isn't forwarding correctly.

* Also double-check the ssh command used the right username — the password prompt suggests it may have defaulted to a different user than your key is registered for:

ssh -L 5050:127.0.0.1:5050 your-actual-username@your-server-hostname -N

#### Q: how to restart the sshd on ubuntu 24?

A: sudo systemctl restart ssh

Note: the service is named ssh on Ubuntu (not sshd).

#### Q: my ubuntu 24 sshd does not accept command Port 222 in sshd_config

Ubuntu 24.04 uses systemd socket activation for SSH — the port is controlled by ssh.socket, not sshd_config. The Port directive is ignored because the socket is bound before sshd starts.

Fix by overriding the socket unit:

```
sudo systemctl edit ssh.socket
# Add this (the blank ListenStream= clears the default port 22 first):


[Socket]
ListenStream=
ListenStream=222
# Then apply:


sudo systemctl daemon-reload
sudo systemctl restart ssh.socket
sudo systemctl restart ssh
# Verify it's listening on 222:


ss -tlnp | grep 222
Before disconnecting, make sure to allow the new port in the firewall and keep your current session open until you've confirmed the new port works:


sudo ufw allow 222/tcp
# test from a second terminal before closing this one:
ssh -p 222 user@your-server-hostname
```

### 8. Smoke test

- [ ] Verify the service is running: `sudo systemctl status pgadmin4`
- [ ] Verify the socket exists: `ls -la /run/pgadmin4/`
- [ ] Verify nginx is proxying (on the server): `curl -s http://127.0.0.1:5050/pgadmin4/`
- [ ] Open the SSH tunnel from your local machine and load the UI in the browser
- [ ] Add a server connection in pgAdmin pointing to `localhost` (or the DB host)
- [ ] Run a simple query to confirm connectivity

---

## Security notes

| Topic | Recommendation |
|-------|---------------|
| Exposure | Bind nginx only to `127.0.0.1` — never `0.0.0.0` |
| SSH access | Restrict to key-based auth; disable password login |
| TLS | Not required for the SSH-tunnel pattern |
| pgAdmin password | Use a strong password; `MAX_LOGIN_ATTEMPTS` is set in `config_local.py` |
| System user | `pgadmin` is a no-login system account — cannot be used for interactive SSH sessions |
