# Q&A

## Where in the code gets targets data fetched for the first time?
```
Read locationStore.ts
The trigger chain is:

locationStore uses Zustand persist — so selectedLocationId is restored from localStorage on page load (key: "locations-storage")
As soon as CourseTargetsLoader mounts and selectedLocationId is non-null, its useEffect fires and fetches:
CourseTargetsLoader.tsx:28


GET /locations/{selectedLocationId}/targets
So the first targets fetch happens when:

/src/components/nav/CourseTargetsLoader mounts and there's already a persisted location in localStorage
If no location is persisted yet, targets won't be fetched until the user selects a location (which calls setSelectedLocationId). Where is CourseTargetsLoader rendered?

Grep "CourseTargetsLoader" (in /Users/martin/dev/wbs/wbs-dancedesk/customerApp/src)
4 lines of output
It's rendered inside Sidebar.tsx:40.

Summary of first targets fetch:

Where: CourseTargetsLoader.tsx:28
When: The Sidebar mounts (after login), and selectedLocationId is available — either restored from localStorage (immediate) or set by the user picking a location for the first time
```

## where is the first code when we fetch data from the server?
```
Read App.tsx
Grep "fetch|axios|useQuery|useSWR|api\.|\.get\(|\.post\(" (in /Users/martin/dev/wbs/wbs-dancedesk/customerApp/src)
6 lines of output
Read fetchInterceptor.ts
Read auth.ts
Grep "me\(\)|useMe|authMe" (in /Users/martin/dev/wbs/wbs-dancedesk/customerApp/src)
2 lines of output
Read CourseTargetsLoader.tsx
Read AuthProvider.tsx
The first server fetch happens in AuthProvider.tsx:13 — the me() call inside the useEffect on mount.

Flow:

AuthProvider mounts → useEffect fires immediately (checkSession starts as true)
Calls me() from src/data/auth.ts:24 → GET /auth/me
This checks whether the user already has a valid session cookie
All fetches go through the interceptor in src/lib/fetchInterceptor.ts, which overrides window.fetch to attach credentials: 'include' and auto-refresh expired tokens.
```

## Do I have to create my Prisma schemas again as Zod schemas manually?

**No.** Use the `zod-prisma-types` generator — it reads your Prisma schema and auto-generates
Zod schemas for every model. Unfortunately, this packet is only available for older releases of prisma. so **Yes.** 

---

## What was set up

### 1. Installed the generator
```bash
npm install -D zod-prisma-types
```

### 2. Added a generator block to `prisma/schema.prisma`
```prisma
generator zod {
  provider = "zod-prisma-types"
  output   = "../src/schemas/zod"
}
```

### 3. Ran `npx prisma generate`
This generates `src/schemas/zod/index.ts` with a Zod schema for every model:
`AdminSchema`, `CustomerSchema`, `CourseSchema`, `CategorySchema`, `TextSchema`, etc.

---

## How to use the generated schemas

```ts
import { CustomerSchema, CourseSchema } from '../schemas/zod/index.js';

// Full schema (all DB fields)
CustomerSchema.parse(data);

// For create endpoints — strip server-managed fields
const CreateCustomerSchema = CustomerSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  isDeleted: true,
});
```

The generator also produces `CreateInput` and `UpdateInput` variants that align
with Prisma's own input types.

---

## Important note — Zod import version

The generated file uses `import { z } from 'zod'` but your existing `schemas.ts`
uses `import { z } from 'zod/v4'`. Both point to the same installed package,
but keep them consistent to avoid type mismatches when composing schemas across files.

---

## Re-generating after schema changes

Every time you change a `.prisma` model file, re-run:
```bash
npx prisma generate
```
Both the Prisma client (`generated/prisma/`) and the Zod schemas (`src/schemas/zod/`)
are regenerated together.

---

## What are the reasons for `GET http://localhost:8000/auth/me 401 (Unauthorized)`?

### Most likely causes

**1. No `accessToken` cookie present**
The middleware checks `req.cookies.accessToken` first. If the cookie is missing (user never logged in, or cookie was cleared), you get an immediate 401.

**2. Access token is expired**
The access token has a 15-minute lifetime. When it expires, the middleware throws `ACCESS_TOKEN_EXPIRED`. The client should catch this and call `POST /auth/refresh` first — if it's not doing that, the `/auth/me` call will always 401.

**3. Invalid token signature**
The cookie exists but the JWT can't be verified against `ACCESS_JWT_SECRET` — could happen if the env var changed or the token was tampered with.

### Cross-origin / cookie issues (common in dev)

**4. `credentials: true` not set on the client fetch**
Since cookies are `httpOnly` and `sameSite: strict`, the client must include credentials in every request:
```js
fetch('http://localhost:8000/auth/me', { credentials: 'include' })
// or in axios: axios.defaults.withCredentials = true
```
Without this, the browser won't send the cookie at all.

**5. `sameSite: strict` blocking the cookie**
In development, if the client (`localhost:3000`) and server (`localhost:8000`) are on different ports, some browser/cookie configurations can still block `strict` cookies in certain navigation contexts.

### Less likely

**6. Token has no `sub` claim** → returns 403, not 401.

**7. User was soft-deleted** → the `/auth/me` handler returns 404 if `isDeleted: true`, not 401.

The most common culprit in a dev environment is **#4** (missing `credentials: 'include'`) or **#2** (expired token with no refresh logic running).

---

## Why does PATCH /targets/:id return 500 with no error message, and no update in Postman?

### Root cause: `id` and `tenantId` in the Zod body schema

`src/schemas/target.ts` includes:
```ts
id: z.uuid('ID must be a UUID').optional(),
tenantId: z.uuid('Tenant ID must be a UUID').optional(),
```

When Postman sends a full object with `id` in the body (common when copying a response to test an update), Zod validation passes it through and it ends up spread into Prisma's `data`:

```ts
// controllers/target.ts:45
data: { ...req.body, setSeqCategory: sequences }
```

Prisma rejects updating the primary key `id` → uncaught error → 500.

### Why there's no useful error message in the client

The client throws its own message before reading the body:
```ts
throw new Error(`Failed to update target: ${response.status}`);
```
The server's `{ message: "..." }` JSON is never read.

### Fix: remove `id` and `tenantId` from `targetSchema`

Both fields arrive through already-validated channels and must not come from the client body:

- **`id`** comes from `req.params.id` (the URL). Existence is validated by the `findFirst` check in the controller (→ 404 if missing).
- **`tenantId`** comes from `req.user!.tenantId`, set by the `authenticate` middleware from the JWT. Accepting it from the body is also a **security risk** — a malicious client could send a different `tenantId` and override tenant isolation via the `...req.body` spread.

### Secondary issues found

**Zod defaults swallow PATCH values**
`isActive: z.boolean().default(true)` fires before `.partial()`, so every PATCH sets `isActive=true` and `isDeleted=false` even when those fields are absent from the payload. Use `z.boolean().optional()` in the partial schema instead.

**Broken `.partial()` call in the schema file**
```ts
// result is discarded — this call has no effect
targetSchema.partial({ description: true, ... });
```
`.partial()` returns a new schema. The router correctly calls `.partial()` on its own copy, so this doesn't cause the 500, but the export is misleading.

---

## How do we support both User and Participant sign-in without repeating code?

### The problem

`issueTokens`, `login`, `refresh`, and `logout` all hardcoded `prisma.user.*`. Supporting participants requires the exact same flow — find record, compare password, sign tokens, store hash — just against a different Prisma model.

### Solution: role-dispatched helpers + a shared login function

**1. Add a `role` claim to both JWTs**

Every access token and refresh token now carries `role: 'user' | 'participant'`. This lets `refresh` and `logout` know which table to look up without trying both.

```ts
jwt.sign({ sub: entity.id, tenantId: entity.tenantId, role }, ACCESS_SECRET!, ...)
jwt.sign({ sub: entity.id, role }, REFRESH_SECRET!, ...)
```

**2. Two small role-dispatching helpers replace all hardcoded model calls**

```ts
function updateRefreshToken(id: string, hash: string | null, role: Role) {
  if (role === 'user')
    return prisma.user.updateMany({ where: { id }, data: { refreshToken: hash } });
  return prisma.participant.updateMany({ where: { id }, data: { refreshToken: hash } });
}

function findEntityById(id: string, role: Role) {
  if (role === 'user')
    return prisma.user.findFirst({ where: { id, isDeleted: false } });
  return prisma.participant.findFirst({ where: { id, isDeleted: false } });
}
```

`updateRefreshToken` is used by `issueTokens` (to store the new hash) and `logout` (to clear it).
`findEntityById` is used by `refresh` and `logout`.

**3. `performLogin<T>` extracts the shared credential-check logic**

```ts
async function performLogin<T extends { id: string; tenantId: string; password: string }>(
  inputPassword: string,
  find: () => Promise<T | null>,
  role: Role,
  res: Response
): Promise<T> {
  const entity = await find();
  const match = await bcrypt.compare(inputPassword, entity?.password ?? DUMMY_HASH);
  if (!entity || !match) throw new Error('Invalid credentials', { cause: { status: 401 } });
  await issueTokens(entity, role, res);
  return entity;
}
```

Each handler passes its own `find()` callback; `performLogin` owns the timing-safe compare, the 401, and token issuance.

**4. Route handlers become thin**

```ts
export const login: RequestHandler = async (req, res) => {
  const { email, password } = req.body;
  const user = await performLogin(
    password,
    () => prisma.user.findFirst({ where: { email, isDeleted: false } }),
    'user', res
  );
  res.json({ id: user.id, email: user.email, ... });
};

export const participantLogin: RequestHandler = async (req, res) => {
  const { email, password, tenantId } = req.body;
  // tenantId required: participant email is not globally unique
  const p = await performLogin(
    password,
    () => prisma.participant.findFirst({ where: { email, tenantId, isDeleted: false } }),
    'participant', res
  );
  res.json({ id: p.id, email: p.email, ... });
};
```

**5. `refresh` and `logout` decode `role` from the token**

```ts
const decoded = jwt.verify(token, REFRESH_SECRET!) as jwt.JwtPayload;
const role = (decoded.role ?? 'user') as Role; // fallback for old tokens
const entity = await findEntityById(decoded.sub, role);
```

The `?? 'user'` fallback means existing sessions keep working after the deploy.

**6. `authenticate` middleware forwards `role` on `req.user`**

```ts
req.user = {
  id: decoded.sub as string,
  tenantId: decoded.tenantId as string,
  role: (decoded.role ?? 'user') as 'user' | 'participant',
};
```

This lets downstream handlers and future middleware guard routes by role.

### New routes

| Method | Path | Handler |
|--------|------|---------|
| POST | `/auth/participant-login` | `participantLogin` |
| GET | `/auth/participant-me` | `participantMe` (behind `authenticate`) |

### What is shared vs. per-entity

| Concern | Shared | Per-entity |
|---------|--------|------------|
| Token signing | `issueTokens` | — |
| Password check + 401 | `performLogin` | `find()` callback |
| Refresh token store / clear | `updateRefreshToken(role)` | — |
| Entity lookup by id | `findEntityById(role)` | — |
| Response shape | — | each handler |

## How to deal with Prisma error P3009 (failed migration)?

Prisma records the migration as failed in `_prisma_migrations` and won't proceed until resolved.

**Option A — Dev database: reset everything**
```sh
npx prisma migrate reset
```
Drops and recreates the DB, re-runs all migrations from scratch.

**Option B — Production / keep data**

Check whether the migration actually applied:
```sh
psql $DATABASE_URL -c "\dt"
```

- Schema **did not apply** (tables missing) — mark as rolled back and re-run:
  ```sh
  npx prisma migrate resolve --rolled-back <migration_name>
  npx prisma migrate deploy
  ```
- Schema **did apply** (tables exist despite the error) — mark as applied:
  ```sh
  npx prisma migrate resolve --applied <migration_name>
  ```

For an `_init` migration on a fresh database, Option A is almost always the right call.

---

## What is `$DATABASE_URL`?

It's the full PostgreSQL connection string from your `.env` file — the value of `DATABASE_URL`:
```
postgresql://user:password@localhost:5432/dbname?schema=public
```

Use the variable directly in commands (as long as `.env` is loaded in your shell):
```sh
psql $DATABASE_URL -c "\dt"
```
If the env var isn't loaded, substitute the actual values from `.env`.

---

## How do I make the `dancedesk` deploy user (no shell, system user) use Node 24 by default?

The user has no login shell, so `.bashrc` / `.zshrc` are never sourced. Options ranked by simplicity:

### Option 1 — Replace system Node via NodeSource (simplest)

```bash
# on the server as root
curl -fsSL https://deb.nodesource.com/setup_24.x | bash -
apt-get install -y nodejs
node --version   # v24.x
```

Replaces the system-wide `node` binary. Works for all users including no-shell system users. No per-user config needed.

### Option 2 — Install nvm system-wide, prepend path in `/etc/environment`

```bash
export NVM_DIR="/usr/local/nvm"
mkdir -p $NVM_DIR
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.2/install.sh | NVM_DIR=$NVM_DIR bash
source $NVM_DIR/nvm.sh
nvm install 24
nvm alias default 24
```

Then in `/etc/environment`:
```
PATH="/usr/local/nvm/versions/node/v24.x.x/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
```

### Option 3 — Set `Environment=` in the systemd unit file

```ini
[Service]
User=dancedesk
Environment=PATH=/usr/local/nvm/versions/node/v24.x.x/bin:/usr/bin:/bin
ExecStart=node /app/server.js
```

```bash
systemctl daemon-reload && systemctl restart dancedesk
```

### Option 4 — Set PATH in `~dancedesk/.profile`

Works when deploy commands are run via `ssh dancedesk@host cmd` or `sudo -u dancedesk cmd`:

```bash
# /home/dancedesk/.profile
export PATH="/usr/local/nvm/versions/node/v24.x.x/bin:$PATH"
```

**Recommendation:** Option 1 (NodeSource) is the cleanest if only one Node version is needed on the machine. Use Option 3 if you need Node 20 for other services.

---

## How do I access static web content from the server?

### Using express.static

app.use("/assets", express.static(join(__dirname, "..", "assets")));

=> http://localhost:8000/assets/images/flipnbit2_xs.png

How it resolves in both modes:

dev (src/index.ts) — __dirname → server/src/, ../assets → server/assets/ ✓

prod (dist/index.js) — __dirname → server/dist/, ../assets → server/assets/ ✓

## Q: how can I manage the postgres db on the server?

### A: install pgadmin4 with gunicorn to tunnel it to your PC (is this information anywhere else in the docs?)
````
# pgadmin requires python
python3 --version
    sudo apt update
    sudo apt install -y python3-pip python3-venv nginx git

    # create system user
    sudo useradd --system --no-create-home --shell /usr/sbin/nologin pgadmin

    # add pgadmin to package repo
    curl -fsS https://www.pgadmin.org/static/packages_pgadmin_org.pub | sudo gpg --dearmor -o /usr/share/keyrings/packages-pgadmin-org.gpg
    sudo sh -c 'echo "deb [signed-by=/usr/share/keyrings/packages-pgadmin-org.gpg] \
    https://ftp.postgresql.org/pub/pgadmin/pgadmin4/apt/$(lsb_release -cs) pgadmin4 main" \
    > /etc/apt/sources.list.d/pgadmin4.list && apt update'

    # install and configure pgadmin
    sudo apt install pgadmin4-web
    sudo mkdir -p /var/log/pgadmin4
    sudo mkdir -p /var/lib/pgadmin4/sessions
    sudo mkdir -p /var/lib/pgadmin4/storage
    sudo chown -R pgadmin:pgadmin /var/log/pgadmin4
    sudo chown -R pgadmin:pgadmin /var/lib/pgadmin4
    sudo chmod 700 /var/lib/pgadmin4/sessions
    sudo vim /opt/pgadmin4/venv/lib/python3.x/site-packages/pgadmin4/config_local.py
    cd /opt/
    mkdir -p import os
    SERVER_MODE = True                          # required for multi-user web deployment
    DEFAULT_SERVER = '127.0.0.1'               # listen locally only (nginx proxies)
    DATA_DIR = '/var/lib/pgadmin4'
    LOG_FILE = '/var/log/pgadmin4/pgadmin4.log'
    SQLITE_PATH = '/var/lib/pgadmin4/pgadmin4.db'
    SESSION_DB_PATH = '/var/lib/pgadmin4/sessions'
    STORAGE_DIR = '/var/lib/pgadmin4/storage'
    # Security
    MAX_LOGIN_ATTEMPTS = 5
    ENHANCED_COOKIE_PROTECTION = True
    SESSION_COOKIE_SECURE = True               # set False if not using HTTPS locally
    ENABLE_PSQL = False                        # disable shell access in server mode
    ALLOW_SAVE_PASSWORD = True
    python -v
    py -v
    python3 --version
    sudo /usr/pgadmin4/bin/setup-web.sh
    cd /usr/pgadmin4/web/
    sudo vim /usr/pgadmin4/web/config_local.py

    # setup pgadmin for postgres and start
    sudo -u pgadmin /usr/pgadmin4/venv/bin/python   /usr/pgadmin4/web/setup.py setup-db
    sudo vim /etc/systemd/system/pgadmin4.service
    sudo systemctl daemon-reload
    sudo systemctl enable pgadmin4
    sudo systemctl start pgadmin4
    sudo systemctl status pgadmin4

  # 
    sudo ls /usr/pgadmin4/venv/bin/gunicorn
    sudo /usr/pgadmin4/venv/bin/pip install gunicorn
    sudo ls /usr/pgadmin4/venv/bin/gunicorn
    sudo systemctl start pgadmin4
    sudo systemctl status pgadmin4
    sudo vim /etc/systemd/system/pgadmin4.service
    sudo systemctl daemon-reload
    sudo systemctl restart pgadmin4
    sudo systemctl status pgadmin4
  ````

## Q: How can I configure pgadmin4 to be available as service?

### A: create a service configuration and start it...

sudo vim /etc/systemd/system/pgadmin4.service

´´´´
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
´´´´

## Q: How do I use pgadmin4 securely over the internet?

### A: Using a tunnel avoids exposing pgadmin4 to the internet and makes it available on your local machine.

* On the server, create a nginx config for the tunnel and activate it:
````
# /etc/nginx/sites-available/pgadmin4 
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
````

activate config, test it and reload nginx:
`````
sudo ln -s /etc/nginx/sites-available/pgadmin4 /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
`````

* On MacOS, create a file ~/Library/LaunchAgents/local.pgadmin.tunnel.plist
````
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
        <string>-p 222 -i ~/cert/h18_ed25519 martin@gui4.kurstool.de</string>
    </array>
    <key>RunAtLoad</key><true/>
    <key>KeepAlive</key><true/>
</dict>
</plist>
```
Then, to start the tunnel (survives temporary offline times and system restart)
```
launchctl load ~/Library/LaunchAgents/local.pgadmin.tunnel.plist  
```
To stop the tunnel, use 
```
launchctl unload ~/Library/LaunchAgents/local.pgadmin.tunnel.plist  
```
To test communication over the tunnel use: (answers a HTTP code, 000 means fail)
```
curl -s -o /dev/null -w "%{http_code}" http://localhost:5050/pgadmin4/
```