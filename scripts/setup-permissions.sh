#!/usr/bin/env bash
# =============================================================================
# setup-permissions.sh
#
# Applies the ownership and permission model for /srv/dancedesk.
# Run once after initial clone, and again after any manual dist/ deletion.
#
# See docs/06_permissions.md for the full concept.
#
# Requires: root, acl package (apt install acl)
# =============================================================================
set -euo pipefail

# ── configuration ─────────────────────────────────────────────────────────────
ROOT="${ROOT:-/srv/dancedesk}"
DEPLOY_USER="martin"
SVC_USER="dancedesk"
SVC_GROUP="dancedesk"
NGINX_USER="www-data"

# ── helpers ───────────────────────────────────────────────────────────────────
info() { printf '\e[32m▸\e[0m %s\n' "$*"; }
warn() { printf '\e[33m⚠\e[0m %s\n' "$*" >&2; }
die()  { printf '\e[31m✗\e[0m %s\n' "$*" >&2; exit 1; }

[[ $EUID -eq 0 ]] || die "Must run as root (sudo $0)"
[[ -d "$ROOT" ]]   || die "Root directory $ROOT does not exist"

command -v setfacl >/dev/null 2>&1 || die "setfacl not found — run: apt install acl"
command -v getfacl >/dev/null 2>&1 || die "getfacl not found — run: apt install acl"

# ── 1. group and users ────────────────────────────────────────────────────────
info "Ensuring group '$SVC_GROUP' exists"
if ! getent group "$SVC_GROUP" >/dev/null 2>&1; then
    groupadd --system "$SVC_GROUP"
    info "  Created group $SVC_GROUP"
fi

info "Ensuring system user '$SVC_USER' exists"
if ! id "$SVC_USER" >/dev/null 2>&1; then
    useradd \
        --system \
        --no-create-home \
        --shell /usr/sbin/nologin \
        --gid "$SVC_GROUP" \
        "$SVC_USER"
    info "  Created system user $SVC_USER (gid=$SVC_GROUP)"
fi

info "Ensuring '$DEPLOY_USER' is in group '$SVC_GROUP'"
if ! id -nG "$DEPLOY_USER" | grep -qw "$SVC_GROUP"; then
    usermod -aG "$SVC_GROUP" "$DEPLOY_USER"
    warn "  Added $DEPLOY_USER to $SVC_GROUP — SSH session must re-login for group to take effect"
fi

# ── 2. repo root ──────────────────────────────────────────────────────────────
info "Root: $ROOT"
chown "$DEPLOY_USER:$SVC_GROUP" "$ROOT"
chmod 2750 "$ROOT"
# ACL: www-data gets traverse-only (no listing) to reach customerApp/dist/
setfacl -m "u:${NGINX_USER}:x" "$ROOT"

# ── 3. .git — deploy user only ────────────────────────────────────────────────
info ".git — deploy user only"
chown -R "$DEPLOY_USER:$DEPLOY_USER" "$ROOT/.git"
chmod 700 "$ROOT/.git"
# Recursively: owner rwX, no group, no world
find "$ROOT/.git" -mindepth 1 -type d -exec chmod u=rwx,g=,o= {} +
find "$ROOT/.git" -type f              -exec chmod u=rw,g=,o=  {} +

# ── 4. .github — CI config, deploy user only ──────────────────────────────────
if [[ -d "$ROOT/.github" ]]; then
    info ".github — deploy user only"
    chown -R "$DEPLOY_USER:$DEPLOY_USER" "$ROOT/.github"
    find "$ROOT/.github" -type d -exec chmod u=rwx,g=,o= {} +
    find "$ROOT/.github" -type f -exec chmod u=rw,g=,o=  {} +
fi

# ── 5. server/ ────────────────────────────────────────────────────────────────
info "server/ — martin:dancedesk, service reads"
chown -R "$DEPLOY_USER:$SVC_GROUP" "$ROOT/server"

# All server dirs: setgid + owner rwx, group rx, no world
find "$ROOT/server" -type d \
    ! -path "$ROOT/server/assets*" \
    ! -path "$ROOT/server/generated*" \
    -exec chmod 2750 {} +

# All server files: owner rw, group r, no world
find "$ROOT/server" -type f \
    ! -path "$ROOT/server/assets*" \
    ! -path "$ROOT/server/generated*" \
    -exec chmod 640 {} +

# .env: same as above but called out explicitly
info "server/.env — group readable by service"
[[ -f "$ROOT/server/.env" ]] && chmod 640 "$ROOT/server/.env"

# ── 6. server/assets and server/generated — service writes here ───────────────
for WRITE_DIR in "$ROOT/server/assets" "$ROOT/server/generated" "$ROOT/server/prisma/generated"; do
    [[ -d "$WRITE_DIR" ]] || { warn "  $WRITE_DIR not found, skipping"; continue; }
    info "$(realpath --relative-to="$ROOT" "$WRITE_DIR")/ — group-writable (service writes)"
    chown -R "$DEPLOY_USER:$SVC_GROUP" "$WRITE_DIR"
    find "$WRITE_DIR" -type d -exec chmod 2770 {} +
    find "$WRITE_DIR" -type f -exec chmod 660  {} +
    # Default ACL: newly created files/dirs inherit group write
    setfacl -d -m "u::rwX" "$WRITE_DIR"
    setfacl -d -m "g::rwX" "$WRITE_DIR"
    setfacl -d -m "o::0"   "$WRITE_DIR"
done

# ── 7. customerApp/ source (not served) ───────────────────────────────────────
info "customerApp/ source — martin:dancedesk"
chown -R "$DEPLOY_USER:$SVC_GROUP" "$ROOT/customerApp"

find "$ROOT/customerApp" -type d \
    ! -path "$ROOT/customerApp/dist*" \
    -exec chmod 2750 {} +
find "$ROOT/customerApp" -type f \
    ! -path "$ROOT/customerApp/dist*" \
    -exec chmod 640 {} +

# ACL: www-data traverse-only to reach dist/
setfacl -m "u:${NGINX_USER}:x" "$ROOT/customerApp"

# ── 8. customerApp/dist — nginx serves from here ──────────────────────────────
# Create dist if it doesn't exist yet (first deploy)
mkdir -p "$ROOT/customerApp/dist"

info "customerApp/dist — martin:www-data, nginx reads"
chown -R "$DEPLOY_USER:$NGINX_USER" "$ROOT/customerApp/dist"
find "$ROOT/customerApp/dist" -type d -exec chmod 2750 {} +
find "$ROOT/customerApp/dist" -type f -exec chmod 640  {} +

# Default ACL: vite-created files automatically get www-data read permission.
# owner default: rw on files, rwx on dirs
# group (www-data) default: r on files, rx on dirs
# no world
setfacl -d -m "u::rwX"              "$ROOT/customerApp/dist"
setfacl -d -m "g::rX"               "$ROOT/customerApp/dist"
setfacl -d -m "o::0"                "$ROOT/customerApp/dist"
setfacl -d -m "u:${NGINX_USER}:rX"  "$ROOT/customerApp/dist"

# ── 9. consumerApp/ — source only, no server role ─────────────────────────────
if [[ -d "$ROOT/consumerApp" ]]; then
    info "consumerApp/ — source only"
    chown -R "$DEPLOY_USER:$SVC_GROUP" "$ROOT/consumerApp"
    find "$ROOT/consumerApp" -type d -exec chmod 2750 {} +
    find "$ROOT/consumerApp" -type f -exec chmod 640  {} +
fi

# ── 10. docs / documentation / top-level files ────────────────────────────────
info "docs, documentation — readable by group"
for DIR in docs documentation; do
    [[ -d "$ROOT/$DIR" ]] || continue
    chown -R "$DEPLOY_USER:$SVC_GROUP" "$ROOT/$DIR"
    find "$ROOT/$DIR" -type d -exec chmod 2750 {} +
    find "$ROOT/$DIR" -type f -exec chmod 640  {} +
done

for FILE in README.md package.json package-lock.json .gitignore; do
    [[ -f "$ROOT/$FILE" ]] || continue
    chown "$DEPLOY_USER:$SVC_GROUP" "$ROOT/$FILE"
    chmod 640 "$ROOT/$FILE"
done

# ── 11. summary ───────────────────────────────────────────────────────────────
info "Done."
echo
echo "── Root ──────────────────────────────────────────────────────"
ls -la "$ROOT"
echo
echo "── customerApp/dist ACL ──────────────────────────────────────"
getfacl "$ROOT/customerApp/dist"
echo
echo "── Root ACL (www-data traverse) ─────────────────────────────"
getfacl "$ROOT"
echo
echo "── customerApp ACL (www-data traverse) ──────────────────────"
getfacl "$ROOT/customerApp"
echo
warn "If this is a first-run, 'martin' must log out and back in for the"
warn "'$SVC_GROUP' group membership to be active in the SSH session."
