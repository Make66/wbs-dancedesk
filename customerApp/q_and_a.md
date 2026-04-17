### Q: How do we deploy the customerApp (React/Vite SPA)?

**Setup:** Monorepo at `/srv/dancedesk` on a Linux server. Backend already deployed via `.github/workflows/deploy-server.yml` using `appleboy/ssh-action`.

**Answer:** A matching workflow `.github/workflows/deploy-customer-app.yml` triggers on push to `main` when files under `customerApp/**` change. It SSHs into the server, runs `git pull`, then `npm ci && npm run build` inside `customerApp/`. The output lands in `/srv/dancedesk/customerApp/dist`.

**Serving:** Nginx serves the static files at `https://admin.kurstool.de` (port 443, Let's Encrypt TLS). Key Nginx config:
- `root /srv/dancedesk/customerApp/dist`
- `try_files $uri $uri/ /index.html` — required for React Router SPA fallback
- `location /api/` proxied to `http://localhost:8000/api/` (the backend service)
- Port 80 redirects to 443

**API URL:** Was hardcoded to `http://localhost:8000` in `.env`. Fixed by adding `.env.production` with `VITE_APP_AUTH_SERVER_URL=https://admin.kurstool.de`. Vite automatically picks this up during `npm run build`, so local dev keeps using localhost and production builds use the live domain.

---

### Q: How does the customerApp access the server API in production?

**Setup:** customerApp is a Vite/React SPA. Server runs Express on `http://127.0.0.1:8000`. Both live on the same host behind nginx.

**How API calls are made:** All API calls use `import.meta.env.VITE_APP_AUTH_SERVER_URL` as the base URL (e.g. `${VITE_APP_AUTH_SERVER_URL}/api/courses`). Vite bakes this variable into the JS bundle at build time.

**Which .env files are read:**
- `.env` — always loaded (dev + build). Contains `http://localhost:8000` for local dev.
- `.env.production` — loaded only during `vite build`, takes priority over `.env`. Should contain the production base URL.

**nginx role:** nginx terminates TLS on port 443 and proxies `location /api/` to `http://127.0.0.1:8000`. The browser never talks to port 8000 directly.

**Why a direct connection (bypassing nginx) isn't practical in production:**
- The app is served over HTTPS. A direct call to `http://...:8000` would be blocked by browsers as mixed content.
- Port 8000 isn't publicly reachable.
- Alternatives (TLS on Express, Express serving static files) add complexity with no real benefit.

**Bug fixed:** `.env.production` had `VITE_APP_AUTH_SERVER_URL=https://admin.kurstool.de:8000` — two problems:
1. Wrong hostname (`admin.kurstool.de` instead of `gui4.kurstool.de`)
2. Wrong port (`:8000` is internal; nginx handles routing via standard port 443)

**Fixed value:** `VITE_APP_AUTH_SERVER_URL=https://gui4.kurstool.de`

---

### Q: Where in the code gets targets data fetched for the first time?

The trigger chain is:

locationStore uses Zustand persist — so selectedLocationId is restored from localStorage on page load (key: "locations-storage")
As soon as CourseTargetsLoader mounts and selectedLocationId is non-null, its useEffect fires and fetches:
CourseTargetsLoader.tsx:28

GET /locations/{selectedLocationId}/targets
So the first targets fetch happens when:

CourseTargetsLoader mounts and there's already a persisted location in localStorage
If no location is persisted yet, targets won't be fetched until the user selects a location (which calls setSelectedLocationId). Where is CourseTargetsLoader rendered?

Grep "CourseTargetsLoader" (in /Users/martin/dev/wbs/wbs-dancedesk/customerApp/src)
4 lines of output
It's rendered inside Sidebar.tsx:40.

Summary of first targets fetch:

Where: CourseTargetsLoader.tsx:28
When: The Sidebar mounts (after login), and selectedLocationId is available — either restored from localStorage (immediate) or set by the user picking a location for the first time

### Q:  What is the best strategy to keep a session alive between the app and the server?

**Setup:** Access token (15 min, httpOnly cookie) + Refresh token (7 days, httpOnly cookie, bcrypt-hashed in DB).

**Answer:** Two-layer strategy:

1. **Reactive refresh (already complete):** Any request with an expired access token causes `authenticate.ts` to throw `ACCESS_TOKEN_EXPIRED` → `errorHandler.ts` sets `WWW-Authenticate: Bearer error="token_expired"` → `fetchInterceptor.ts` catches it, calls `POST /auth/refresh`, retries the original request transparently.

2. **Proactive keepalive (`keepSessionAlive`):** A `setInterval` fires at 80% of `VITE_ACCESS_TOKEN_TTL` (12 min for 900s) to preemptively refresh the access token. This avoids the double-request latency when a user idles on a page for >15 min without making any API calls (e.g. filling a long form). Returns a cleanup function for use in React's `useEffect`. On failed refresh (refresh token also expired), the interval clears itself and lets the app redirect to login.

The reactive interceptor alone is sufficient for typical navigation patterns. Proactive keepalive adds value only for long-idle pages.
