# Public API

The public API exposes read-only access to a customer's data for use in external websites (e.g. a course browser or booking widget). Access is controlled by an API key — no user login required.

---

## API Key Concept

Pattern: **generate-on-demand, rotate-to-revoke** (same approach as Stripe, GitHub, SendGrid).

- Each `Customer` record holds one `apiKey` field (64-char hex string).
- New customers start with `apiKey: ""` — no public access until a key is explicitly generated.
- The key is stored **plaintext** in the database. Justification: if a key is compromised, you rotate it and it stops working immediately. Unlike passwords, the recovery path is rotation rather than reset, so bcrypt hashing adds complexity without meaningful benefit.
- The API key uniquely identifies the tenant — no separate tenant ID is needed in requests.

### Generate / Rotate

```
POST /api/customers/:id/rotate-api-key
Authorization: cookie-based JWT (same as all other admin routes)
```

Response:
```json
{ "apiKey": "a3f9...64-char-hex...b7c2" }
```

The key is returned once. Copy it into your widget configuration. If the key is lost or compromised, call rotate again — the old key stops working immediately.

---

## Authentication

All public endpoints require the `X-API-Key` header:

```
X-API-Key: <your-api-key>
```

Why a header and not a query parameter? Headers stay out of server access logs, browser history, and CDN cache keys — safer for long-lived credentials.

Responses for missing or invalid keys:
```
401 Unauthorized  →  { "error": "Missing API key" }
401 Unauthorized  →  { "error": "Invalid API key" }
```

---

## Endpoints

### `GET /api/public/bootstrap`

One-time initialisation call. Returns the customer's branding and the full navigation tree (locations → targets → categories). Designed to be fetched once on widget load.

**Request:**
```
GET /api/public/bootstrap
X-API-Key: <key>
```

**Response:**
```json
{
  "customer": {
    "id": "uuid",
    "name": "DanceSchool Example",
    "email": "info@example.de",
    "website": "https://www.example.de",
    "logoUrl": "https://...",
    "primary": "#B80000",
    "secondary": "#5F0000",
    "tertiary": "#565656",
    "quaternary": "#BABABA",
    "street": "Hauptstr. 1",
    "city": "Berlin",
    "zipCode": "10115",
    "longitude": 13.4050,
    "latitude": 52.5200
  },
  "locations": [
    { "id": "uuid", "name": "Studio Nord", "description": "", "imageUrl": "...", "street": "...", "city": "...", "zipCode": "...", "state": "...", "longitude": 0.0, "latitude": 0.0 }
  ],
  "targets": [
    { "id": "uuid", "name": "Erwachsene", "description": "", "icon": "", "color": ["#000", "#FFF"], "locationId": "uuid", "setSeqCategory": ["uuid", "uuid"] }
  ],
  "categories": [
    { "id": "uuid", "name": "Salsa Beginners", "description": "", "icon": "", "color": ["#000", "#FFF"], "targetId": "uuid", "setSeqCourse": ["uuid"] }
  ]
}
```

Only records with `isActive=true` are returned. The category list only includes categories whose parent target is also active.

---

### `GET /api/public/courses`

Returns courses. Designed to be called lazily — either once on widget init, or per-category as the user navigates.

**Request:**
```
GET /api/public/courses
GET /api/public/courses?categoryId=<uuid>
GET /api/public/courses?locationId=<uuid>
X-API-Key: <key>
```

Query parameters (both optional):

| Parameter | Description |
|-----------|-------------|
| `categoryId` | Return courses for a specific category (direct FK, no join) |
| `locationId` | Return courses at a specific location (direct FK, no join) |

`targetId` is intentionally **not** a supported filter — the client already has the target→category mapping from the bootstrap call and can filter client-side.

**Response:**
```json
{
  "courses": [
    {
      "id": "uuid",
      "name": "Salsa Beginners 1",
      "description": "",
      "startsAt": "2026-09-01T18:00:00.000Z",
      "endsAt": "2026-11-30T19:30:00.000Z",
      "frequency": "weekly",
      "dates": [{ "date": "2026-09-01T18:00:00.000Z", "isStart": true }],
      "seatsCurrent": 12,
      "seatsMax": 16,
      "isBookedOut": false,
      "options": 0,
      "categoryId": "uuid",
      "locationId": "uuid",
      "instructor": { "id": "uuid", "name": "Jane Doe", "imageUrl": "..." }
    }
  ]
}
```

Only courses with `isActive=true` are returned, and only for categories that are themselves active.

---

### `GET /api/public/news`

Returns news content for the tenant. The data is cached in the `News` database record and refreshed automatically when stale.

**Request:**
```
GET /api/public/news
X-API-Key: <key>
```

**Response:**
```json
{
  "news": [ ... ]
}
```

The shape of the `news` array is determined by whatever the upstream `/api/news` endpoint returns — the server stores and forwards it as-is.

**Caching behaviour:**

The server caches news per tenant in the `News` table.

| Condition | Behaviour |
|-----------|-----------|
| No `News` record exists | Fetches from `<settings.basic.domain>/api/news`, creates record |
| Record exists, `updatedAt` < 86 400 s ago | Serves cached data immediately |
| Record exists, `updatedAt` ≥ 86 400 s ago | Re-fetches from upstream, updates record, serves fresh data |
| Upstream fetch fails | Logs error, serves last cached data (or empty array if no record) |
| `settings.basic.domain` not configured | Logs warning, serves cached data or empty array |

The upstream URL is `<settings.basic.domain>/api/news` — set the domain in **Settings → Basic**.

Only records with `isActive=true` and `isDeleted=false` are returned.

---

## `isActive` Cascade

`isActive` is the single public-visibility switch on every model. The cascade works as follows:

| Action | Effect on public API |
|--------|---------------------|
| Set Target `isActive=false` | Target hidden; all its categories and their courses disappear from public API |
| Set Category `isActive=false` | Category hidden; all its courses disappear from public API |
| Set Course `isActive=false` | Course hidden from public API |
| Set Location `isActive=false` | Location hidden from public API |

No separate "hidden" flag is needed — deactivating a target is sufficient to remove its entire subtree from public view.

---

## Typical Widget Flow

```
1. Widget initialises
   → GET /api/public/bootstrap
   → Renders location selector, target tabs, category list

2. Widget loads news (e.g. home page banner)
   → GET /api/public/news
   → Server refreshes from upstream if data is older than 24 h

3. User selects a category
   → GET /api/public/courses?categoryId=<uuid>
   → Renders course cards with dates and seat availability

4. User navigates to another category
   → GET /api/public/courses?categoryId=<other-uuid>
   → (or: load all courses once on init and filter client-side)
```
