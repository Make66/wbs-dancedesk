# File Ownership & Permission Concept

## Actors

| Actor | Type | Role |
|---|---|---|
| `martin` | login user | deploy via GitHub Actions SSH; git operations |
| `dancedesk` | system user | runs the Node.js server via systemd |
| `www-data` | system user | nginx worker; serves static files |

## Groups

| Group | Members | Purpose |
|---|---|---|
| `dancedesk` | `martin`, `dancedesk` | owns the entire repo tree; allows deploy user and service to share files |
| `www-data` | `www-data` (nginx) | separate group; access limited to `customerApp/dist/` only |

`www-data` is deliberately NOT added to the `dancedesk` group to prevent nginx from
reading `server/.env` (DB credentials, JWT secrets, etc.).

## Permission Values

| Mode | Octal | Meaning |
|---|---|---|
| `rwxr-x---` | `0750` | owner rw+x, group r+x, no world |
| `rwxrwx---` | `0770` | owner rw+x, group rw+x, no world (write-shared dirs) |
| `rw-r-----` | `0640` | owner rw, group r, no world |
| `rw-rw----` | `0660` | owner rw, group rw, no world (write-shared files) |
| `2750` | setgid + `0750` | new entries inherit the group |
| `2770` | setgid + `0770` | new entries inherit the group, group can write |

Setgid (`2xxx`) on directories ensures files created by `martin` during deploy
automatically belong to the `dancedesk` group without requiring `martin` to manually
`chown` after each `npm ci` / `npm run build`.

## Directory Tree

```
/srv/dancedesk/                    martin:dancedesk  2750
│  ACL: u:www-data:x (traverse only, no listing)
│
├── .git/                          martin:martin     0700   ← deploy user only; no group
├── .github/                       martin:martin     u=rwX  ← CI config; no service access
│
├── server/                        martin:dancedesk  2750
│   ├── .env                       martin:dancedesk  0640   ← read by service; no others
│   ├── src/                       martin:dancedesk  2750
│   ├── dist/                      martin:dancedesk  2750   ← compiled output; node reads
│   ├── node_modules/              martin:dancedesk  2750
│   ├── prisma/                    martin:dancedesk  2750   ← martin runs migrations
│   ├── generated/                 martin:dancedesk  2770   ← prisma generate writes here
│   └── assets/images/             martin:dancedesk  2770   ← service writes uploads here
│
├── customerApp/                   martin:dancedesk  2750
│   ACL: u:www-data:x (traverse only)
│   ├── src/                       martin:dancedesk  2750
│   ├── node_modules/              martin:dancedesk  2750
│   └── dist/                      martin:www-data   2750   ← nginx reads here
│       default ACL: u::rwX, g:www-data:rX, o::0
│       (vite-created files automatically inherit www-data read)
│
├── consumerApp/                   martin:dancedesk  2750   ← source only; not served
├── docs/                          martin:dancedesk  2750
└── documentation/                 martin:dancedesk  2750
```

## Access Matrix

| Path | martin | dancedesk svc | www-data |
|---|---|---|---|
| `/srv/dancedesk/` | rwx (owner) | r-x (group) | --x (ACL, traverse only) |
| `.git/` | rwx (owner) | none | none |
| `.github/` | rwx (owner) | none | none |
| `server/` | rwx (owner) | r-x (group) | none |
| `server/.env` | rw- (owner) | r-- (group) | none |
| `server/dist/` files | rw- (owner) | r-- (group) | none |
| `server/assets/images/` | rwx (owner) | rwx (group) | none |
| `server/generated/` | rwx (owner) | rwx (group) | none |
| `customerApp/` | rwx (owner) | r-x (group) | --x (ACL, traverse only) |
| `customerApp/dist/` | rwx (owner) | none | r-x (group owner) |
| `customerApp/dist/` files | rw- (owner) | none | r-- (group) |

## Why ACLs for www-data path traversal?

For nginx to `stat()` `/srv/dancedesk/customerApp/dist/index.html` it must be able
to traverse every directory in the path. Without world-execute bits and without adding
`www-data` to `dancedesk` group, POSIX ACLs are the only way to grant a targeted
`--x` on the two parent directories while keeping group `dancedesk` private.

```
setfacl -m u:www-data:x /srv/dancedesk
setfacl -m u:www-data:x /srv/dancedesk/customerApp
```

This gives `www-data` the ability to traverse the path but NOT to list directory
contents (`r` is absent).

## Deploy workflow notes

The GitHub Actions workflow deploys as `martin` via SSH. After `npm run build` in
`customerApp/`, vite empties and repopulates `dist/` but does NOT delete the
directory itself. The default ACL on `dist/` therefore survives each deploy and
newly created files automatically inherit `www-data` group read access.

If the `dist/` directory is ever deleted and recreated (e.g. manual cleanup), run
`scripts/setup-permissions.sh` again to restore its ACL and group ownership.

## systemd service requirements

The `dancedesk` service user needs:
- `r-x` on `server/dist/` (read + execute JS files)
- `r--` on `server/.env`
- `r-x` on `server/node_modules/`
- `rwx` on `server/assets/images/` (uploaded files)
- `rwx` on `server/generated/` (prisma generate output)

`sudo systemctl restart dancedesk` is granted to `martin` via a targeted sudoers
entry (not blanket sudo):
```
martin ALL=(ALL) NOPASSWD: /bin/systemctl restart dancedesk, /bin/systemctl status dancedesk
```
