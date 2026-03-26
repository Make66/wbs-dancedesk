# Q&A

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

