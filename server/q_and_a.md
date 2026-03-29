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
Zod schemas for every model.

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

