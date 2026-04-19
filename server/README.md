# WBS Graduation Project DanceDesk - Server

## Editor settings
- for VSCode, install https://marketplace.visualstudio.com/items?itemName=Prisma.prisma

## Features
- authentication/authorization

## API endpoints (WIP)
- course tree
- modules
- registration


## tables & schemas
- customer => Tanzschule
- user => Clerks that administer data; role based on modules
- modules => areas in which clerks have access
- registrations
- participant (from registrations)
- location => course venue
- target
- category
- course
- instructor
- text
- settings

# Project setup

```
// https://www.postgresql.org/
// Mac: brew install postgresql@18 && brew services start postgresql@18
// Linux: apt install postgresql
psql postgres
>
CREATE USER yourusername WITH PASSWORD 'yourpassword';
ALTER ROLE yourusername CREATEDB;  // Allow creating databases
CREATE DATABASE mydb OWNER yourusername;

npm install prisma @types/pg --save-dev
npm install prisma --save-dev
npm install @prisma/client @prisma/adapter-pg pg

// This will create a generated directory based on where you set the output to in 
the Prisma Schema. Any time your import Prisma Client, it will need to come from 
this generated client API 

npx prisma generate
npx prisma init --datasource-provider postgresql --output ../generated/prisma
```

# Database

## Accessing the database
```
npx prisma studio --config prisma.config.ts
´´´

## Create the first user
POST http://localhost:8000/auth/register
```
{
  "firstName": "Max",
  "lastName": "Mustermann",
  "email": "max@test.de",
  "password": "Test1234!",
  "tenantId": "seed"
}
´´´

## Procedure after changing schema
```
# generate the client from new schema
npx prisma generate

# create a migration and apply the new schema to the db
npx prisma migrate dev --name <description>

# populate db with data from ./prisma/seed.ts
npx prisma db seed
# user / pass is now admin@test.de/test123

-- or --
npx prisma migrate reset && npx prisma migrate dev --name init && npx prisma generate && npx prisma db seed


```

# Database Relations — WBS DanceDesk

```
╔══════════════╗          ╔══════════════╗
║   Customer   ║          ║   Settings   ║  (isolated, tenantId only)
╠══════════════╣          ╚══════════════╝
║ name         ║
║ email        ║  1               n  ╔══════════════╗
║ primary …    ╠═════════════════════╣  Instructor  ║
║ colors       ║                     ╠══════════════╣
╚══════╤═══════╝                     ║ name         ║
       │                             ║ skills[]     ║
       │ 1:n                         ╚══════╤═══════╝
       │                                    │
       ▼                                    │ 0..1 : n
╔══════════════╗                            │
║   Location   ║                            │
╠══════════════╣                            │
║ name         ║  1         n  ╔═══════════╧═══════════════════════════╗
║ address      ╠═══════════════╣                 Course                ║
╚══════╤═══════╝               ╠═══════════════════════════════════════╣
       │                       ║ name, description                     ║
       │ 1:n                   ║ startsAt / endsAt                     ║
       │                       ║ frequency, dates (JSON)               ║
       ▼                       ║ seatsCurrent / seatsMax               ║
╔══════════════╗               ║ color (JSON?)                         ║
║    Target    ║               ║ isClub, isBookedOut, isIgnoreCalendar ║
╠══════════════╣               ╚═╤══╤══╤════╤═════════════╤════════════╝
║ name         ║  1:n            │  │  │    │             │
║ color[]      ╠─────────────────┘  │  │    │             │
╚══════╤═══════╝                    │  │    │             │
       │ 1:n                        │  │    │             │
       ▼                            │  │    │             │
╔══════════════╗                    │  │    │             │
║   Category   ║  1:n               │  │    │             │
╠══════════════╣                    │  │    │             │
║ name         ╠────────────────────┘  │    │             │
║ color[]      ║                       │    │             │
╚══════════════╝                       │    │             │
                                       │    │             │
                          0..1:n       │    │             │ 0..1:n
╔══════════════╗                       │    │             │
║     Room     ╠───────────────────────┘    │             │
╠══════════════╣                            │             │
║ name         ║                            │ 1:n         │ 1:n
║ capacity     ║◄──────────────┐            │             │
╚══════════════╝               │            ▼             ▼
       ▲                       │  ╔══════════════╗ ╔══════════════╗
       │ 1:n                   │  ║  Text        ║ ║  Text        ║
╔══════╧═══════╗               │  ║ (textTerms)  ║ ║ (textInfo)   ║
║   Location   ║               │  ╠══════════════╣ ╠══════════════╣
╚══════════════╝               │  ║ type = 0     ║ ║ type = 1     ║
                               │  ║ text (AGB)   ║ ║ text (Info)  ║
                               │  ╚══════════════╝ ╚══════════════╝
    Location ──────────────────┘
    (Room belongs to Location)

── Event (belongs to Room, Location, and Target) ───────────────────────

╔══════════════╗   0..1:n   ╔══════════════════════════╗
║     Room     ╠────────────╣          Event           ║
╚══════════════╝            ╠══════════════════════════╣
╔══════════════╗   0..1:n   ║ title, description       ║
║   Location   ╠────────────╣ date, icon, color[]      ║
╚══════════════╝            ║ address fields           ║
╔══════════════╗   n:m      ║ roomId (opt.)            ║
║    Target    ╠────────────╣ locationId (opt.)        ║
╚══════════════╝            ╚══════════════════════════╝
 ("EventTargets")

── Attendance (join: Participant × Course × date) ──────────────────────

╔═══════════════╗  1:n  ╔══════════════════════╗  n:1  ╔══════════════╗
║  Participant  ╠───────╣      Attendance       ╠───────╣    Course    ║
╚═══════════════╝       ╠══════════════════════╣       ╚══════════════╝
                        ║ date                 ║
                        ║ status (enum)        ║
                        ║ comment              ║
                        ╚══════════════════════╝

── Many-to-Many (explicit join table) ──────────────────────────────────

╔═══════════════╗         ╔══════════════════════╗         ╔══════════╗
║  Participant  ║  n      ║   ParticipantCourse   ║      n  ║  Course  ║
╠═══════════════╣─────────╠══════════════════════╣─────────╠══════════╣
║ firstName     ║         ║ participantId (PK)    ║         ║ id       ║
║ lastName      ║         ║ courseId      (PK)    ║         ║ ...      ║
║ email         ║         ║ tenantId              ║         ╚══════════╝
║ birthDate     ║         ║ createdAt             ║
║ address …     ║         ╚══════════════════════╝
╚═══════════════╝

── Many-to-Many (implicit, Prisma-managed) ─────────────────────────────

╔══════════╗    n : n    ╔══════════╗
║   User   ╠────────────╣ Location ║   @relation("UserLocations")
╚══════════╝            ╚══════════╝

╔══════════╗    n : n    ╔══════════╗
║   User   ╠────────────╣  Module  ║   @relation("UserModules")
╚══════════╝            ╚══════════╝

── FK relations (no back-relation shown above) ──────────────────────────

╔══════════════╗  n:1  ╔══════════╗
║ Registration ╠───────╣  Course  ║   courseId FK (raw form submissions)
╚══════════════╝       ╚══════════╝

── Standalone (no FK relations) ────────────────────────────────────────

╔════════════════╗
║    Settings    ║   (singleton per tenant — no FK, keyed by tenantId)
╚════════════════╝
```

## Relation summary table

| From         | To               | Type           | Via / FK                        | Note                              |
|--------------|------------------|----------------|---------------------------------|-----------------------------------|
| Customer     | Instructor       | 1 : n          | `Instructor.customerId`         |                                   |
| Customer     | Location         | 1 : n          | `Location.customerId`           |                                   |
| Location     | Target           | 1 : n (opt.)   | `Target.locationId`             |                                   |
| Location     | Room             | 1 : n (opt.)   | `Room.locationId`               |                                   |
| Location     | Course           | 1 : n (opt.)   | `Course.locationId`             |                                   |
| Location     | Event            | 1 : n (opt.)   | `Event.locationId`              |                                   |
| Target       | Category         | 1 : n          | `Category.targetId`             |                                   |
| Target       | Event            | n : m          | Prisma implicit table           | `@relation("EventTargets")`       |
| Category     | Course           | 1 : n          | `Course.categoryId`             | required                          |
| Instructor   | Course           | 1 : n (opt.)   | `Course.instructorId`           |                                   |
| Room         | Course           | 1 : n (opt.)   | `Course.roomId`                 |                                   |
| Room         | Event            | 1 : n (opt.)   | `Event.roomId`                  |                                   |
| Text         | Course (terms)   | 1 : n (opt.)   | `Course.textTermsId`            | named relation `"textTerms"`      |
| Text         | Course (info)    | 1 : n (opt.)   | `Course.textInfoId`             | named relation `"textInfo"`       |
| Course       | Attendance       | 1 : n          | `Attendance.courseId`           |                                   |
| Participant  | Attendance       | 1 : n          | `Attendance.participantId`      |                                   |
| Participant  | Course           | n : m          | `ParticipantCourse` join table  | explicit — carries `createdAt`, `tenantId` |
| Registration | Course           | n : 1          | `Registration.courseId`         | raw form submissions              |
| User         | Location         | n : m          | Prisma implicit table           | `@relation("UserLocations")`      |
| User         | Module           | n : m          | Prisma implicit table           | `@relation("UserModules")`        |
| Settings     | —                | none           | —                               | singleton per tenant              |


# Endpoints

## Auth
```
POST   /auth/register             body: { firstName, lastName, email, password, tenantId }
POST   /auth/login                body: { email, password }
POST   /auth/refresh              (reads refreshToken cookie)
DELETE /auth/logout               (reads refreshToken cookie)
GET    /auth/me                   (requires accessToken cookie)
POST   /auth/participant-login    body: { email, password }
POST   /auth/participant-me       (requires accessToken cookie)
```

## CRUD for models
```
/auth           POST register, login, refresh  |  DELETE logout  |  GET me
/targets        GET, POST, GET/:id, PUT/:id, PATCH /:id, DELETE/:id
/categories     GET, POST, GET/:id, PUT/:id, PATCH /:id, DELETE/:id
/courses        GET, POST, GET/:id, PUT/:id, PATCH /:id, DELETE/:id
/customers      GET, POST, GET/:id, PUT/:id, PATCH /:id, DELETE/:id
/events         GET, POST, GET/:id, PUT/:id, PATCH /:id, DELETE/:id
/instructors    GET, POST, GET/:id, PUT/:id, PATCH /:id, DELETE/:id
/locations      GET, POST, GET/:id, PUT/:id, PATCH /:id, DELETE/:id
/modules        GET, POST, GET/:id, PUT/:id, PATCH /:id, DELETE/:id
/participants   GET, POST, GET/:id, PUT/:id, PATCH /:id, DELETE/:id
/registrations  GET, POST, GET/:id, PUT/:id, PATCH /:id, DELETE/:id
/settings       GET, PUT, PATCH
/rooms          GET, POST, GET/:id, PUT/:id, PATCH /:id, DELETE/:id
/texts          GET, POST, GET/:id, PUT/:id, PATCH /:id, DELETE/:id
/user           GET, POST, GET/:id, PUT/:id, PATCH /:id, DELETE/:id
```

## Public API (no login required)

Unauthenticated access for external widgets. Identify the tenant via `X-API-Key` header.
Only `isActive=true` records are returned. The filter cascades: an inactive Target hides its Categories and their Courses.

Generate / rotate the API key (authenticated admin call):
```
POST /customers/:id/rotate-api-key   → { apiKey }
```
The key is returned once — copy it into the widget config. Calling rotate again invalidates the old key immediately.

```
GET  /public/bootstrap               → { customer, locations[], targets[], categories[] }
GET  /public/courses                 → { courses[] }
GET  /public/courses?categoryId=uuid → courses for one category
GET  /public/courses?locationId=uuid → courses at one location
GET  /public/news                    - X-API-Key: <key>, news stored on server, fetches/updates when outdated/empty (86400)
```

See [docs/08_publicApi.md](../docs/08_publicApi.md) for full request/response examples and the `isActive` cascade table.

## Nested routes
```
GET  /categories/:id/courses    — courses belonging to a category
POST /chats                  { participantId, tenantId }        → { sessionId }
POST /chats/messages         { sessionId, prompt }              → SSE stream + [DONE]
GET  /chats/:sessionId                                          → { session, messages[] }
GET  /courses/month             - all courses this month, starting with 0: monday
GET  /courses/month/:number     - all courses in month n, (13 % 12) = 1st month next year
GET  /courses/week              - all courses this week, starting with 0: monday
GET  /courses/week/:number      - all courses in week n, (54 % 53) = 1st week next year
GET  /courses/week/:year/:week  - Hi Adrian!
GET  /courses/:id/dates         - delivers possible event dates for a course
GET  /courses/:id/participants  - all participants of a certain course
GET  /customers/by-tenant/:tenantId - no auth required, only branding fields. Created for 1st logins
POST /customers/:id/rotate-api-key - create a new key and so invalidate the old one
POST /customers/:id/rotate-signin-key - create a new key and so invalidate the old one
GET  /events/month              - returns events where startsAt >= 1st day of month, limited to this month
GET  /events/month/:number      - returns events from a certain month
GET  /events/upcoming           - returns events where startsAt > yesterday at midnight, ordered ascending, limited to this week
GET /instructors/:id/courses   - returns all non-deleted courses for the given instructor within the tenant.
GET /locations/:id/events     — events belonging to a location
GET  /locations/:id/rooms       — rooms belonging to a location
GET  /locations/:id/targets     — targets belonging to a location
POST /news/refresh             - forces re-read news from external source instead of keeping it for 24h
GET  /settings/holidays/federal/:state'  - official state holidays of a given state (2-letter capital)
GET  /settings/holidays/school/:state'  - official school holidays of a given state (2-letter capital)
GET  /targets/:id/categories    — categories belonging to a target
GET  /targets/:id/courses       — returns target + categories + their courses (nested)
GET  /participants/:id/courses  - all courses of a certain participant
GET  /rooms/:id/events          - all events of a certain room
GET  /users/:id                 — returns user with included locations and modules
```

# Deployment

## Server code location

Place the server code at `/srv/dancedesk/server` — the `/srv` directory is defined by the Linux FHS specifically for data served by the system.

```
/srv/dancedesk/
  server/          ← Express app
  logs/            ← created automatically by the logger
```

## Creating a dedicated system user on Ubuntu

### 1. Create the user
```bash
sudo useradd --system --no-create-home --shell /usr/sbin/nologin dancedesk
```
- `--system` — marks it as a system account (UID < 1000, no password, no aging)
- `--no-create-home` — no `/home/dancedesk` directory
- `--shell /usr/sbin/nologin` — nobody can log in as this user interactively

### 2. Create and own the app directory
```bash
sudo mkdir -p /srv/dancedesk/server
sudo chown -R dancedesk:dancedesk /srv/dancedesk
```

### 3. Create the systemd service
```bash
sudo nano /etc/systemd/system/dancedesk.service
```

```ini
[Unit]
Description=DanceDesk API Server
After=network.target postgresql.service

[Service]
Type=simple
User=dancedesk
Group=dancedesk
WorkingDirectory=/srv/dancedesk/server
EnvironmentFile=/srv/dancedesk/server/.env
ExecStart=/usr/bin/node --env-file=.env dist/index.js
Restart=on-failure
RestartSec=5

# Security hardening
NoNewPrivileges=true
# PrivateTmp and ProtectSystem require Linux user-namespace support.
# Remove the comment on a host that supports it (bare-metal, full VM).
# Leave commented on VPS / LXC containers — they cause exit status 226/NAMESPACE.
#PrivateTmp=true
#ProtectSystem=strict
#ReadWritePaths=/srv/dancedesk/server/logs

[Install]
WantedBy=multi-user.target
```

### 4. Enable and start
```bash
sudo systemctl daemon-reload
sudo systemctl enable dancedesk    # start on boot
sudo systemctl start dancedesk
sudo systemctl status dancedesk
```

### 5. View logs
```bash
# File-based logs (written by the app logger):
tail -f /srv/dancedesk/server/logs/$(date +%F).log

# systemd also captures stdout/stderr:
sudo journalctl -u dancedesk -f
```

### Security benefits

| What | Why |
|------|-----|
| No login shell | Even if compromised, attacker can't get an interactive shell |
| `NoNewPrivileges` | Process can't escalate to root via setuid binaries |
| `ProtectSystem=strict` | Filesystem is read-only except for `ReadWritePaths` — requires namespace support (bare-metal/full VM only) |
| `PrivateTmp` | Isolated `/tmp` — requires namespace support; omit on VPS/LXC or you get exit 226/NAMESPACE |

### Deploying updates
```bash
# As your personal user (has sudo), not as dancedesk:
cd /srv/dancedesk/server
sudo -u dancedesk git pull
sudo -u dancedesk npm ci
sudo -u dancedesk npm run build
sudo systemctl restart dancedesk
```

## GitHub Actions — Automated Deploy

The workflow at [`.github/workflows/deploy-server.yml`](../.github/workflows/deploy-server.yml) triggers on every push to `main` that touches the `server/` directory. It builds the project locally on the runner, then SSHs into the production host and runs the deploy steps there.

### Prerequisites on the remote host

1. The `dancedesk` user and `/srv/dancedesk/server` directory are set up (see above)
2. The repo is cloned into `/srv/dancedesk/server` and the `dancedesk` user owns it:
   ```bash
   sudo -u dancedesk git clone git@github.com:Make66/wbs-dancedesk.git /srv/dancedesk
   ```
3. The `.env` file is in place at `/srv/dancedesk/server/.env`
4. The `dancedesk` user can run `systemctl restart dancedesk` without a password prompt:
   ```bash
   # Add this line via: sudo visudo
   dancedesk ALL=(ALL) NOPASSWD: /bin/systemctl restart dancedesk, /bin/systemctl status dancedesk
   ```

### GitHub repository variables (`Settings → Secrets and variables → Actions → Variables`)

| Variable | Value |
|----------|-------|
| `DEPLOY_HOST` | `gui4.kurstool.de` |
| `DEPLOY_USER` | `dancedesk` |
| `DEPLOY_PORT` | `22` |

### GitHub repository secrets (`Settings → Secrets and variables → Actions → Secrets`)

| Secret | Description |
|--------|-------------|
| `SSH_PRIVATE_KEY` | Private SSH key whose public key is in `/home/dancedesk/.ssh/authorized_keys` on the host |

### `.env` file on the production host

The following variables must be set in `/srv/dancedesk/server/.env`:

```bash
NODE_ENV=production
PORT=8000

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dancedesk"

# CORS — comma-separated list of allowed origins
CORS_ORIGINS="https://yourdomain.com"

# JWT — generate with: openssl rand -base64 32
ACCESS_JWT_SECRET=
REFRESH_JWT_SECRET=
REFRESH_TOKEN_TTL=86400
ACCESS_TOKEN_TTL=900
SALT_ROUNDS=10

# Cloudinary (image uploads)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# OpenAI (chat feature)
OPENAI_API_URL=https://api.openai.com/v1
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
```

### Generating the SSH key pair

`dancedesk` is a system user with no home directory, so `ssh-copy-id` won't work. Place the key manually.

```bash
# 1. On your local machine — generate a dedicated deploy key
ssh-keygen -t ed25519 -C "github-deploy-dancedesk" -f ~/.ssh/dancedesk_deploy

# 2. Print the public key and copy it to your clipboard
cat ~/.ssh/dancedesk_deploy.pub

# 3. On the remote host (as a sudo user) — create the .ssh dir for the system user
sudo mkdir -p /srv/dancedesk/.ssh
sudo touch /srv/dancedesk/.ssh/authorized_keys
sudo chmod 700 /srv/dancedesk/.ssh
sudo chmod 600 /srv/dancedesk/.ssh/authorized_keys
sudo chown -R dancedesk:dancedesk /srv/dancedesk/.ssh

# 4. Paste the public key into authorized_keys
sudo nano /srv/dancedesk/.ssh/authorized_keys

# 5. Tell sshd where to find the key (since there is no /home/dancedesk).
#    Add this block to /etc/ssh/sshd_config:
#
#      Match User dancedesk
#        AuthorizedKeysFile /srv/dancedesk/.ssh/authorized_keys
#
sudo nano /etc/ssh/sshd_config
sudo systemctl reload sshd

# 6. Copy the private key content into the GitHub secret SSH_PRIVATE_KEY
cat ~/.ssh/dancedesk_deploy
```
