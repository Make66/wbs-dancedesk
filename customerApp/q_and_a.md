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
