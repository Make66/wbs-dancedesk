# plan for settings
create a schema for settings based on the way we created the target schema. Prisma schema, zod schema, controller, route. 
Suggest optimisations and ask if things are note totally clear.

The following fields should be available with the table settings:

colTitles json
holidays json
rebates json
voucher json
calendarPast bool
calendarOccurrences number
calendarLength number
formFields json
domain text
legalResources string default "https://domain/fileadmin/kunden/mandant/rechtstexte/"
contracts json
regTitleCol1 string
regTitleCol2 string
regTitleDelTime number
regCheckSeats bool
regWaitlist bool

create the plan and add it to this file

1. settings is one row per tenant.
2. Option A:
3. A literal default that gets manually overridden per tenant
4. rebates
5. no. not needed for settings
6. grouped into one JSON field

---

# Implementation Plan

## Decisions
- Settings is a **singleton per tenant** — `tenantId` is `@unique` in Prisma
- JSON fields use `z.record(z.unknown())` in Zod (flexible, no shape validation)
- `legalResources` default is a literal string, overridden per tenant manually
- Field corrected: `rabates` → `rebates`
- No `isDeleted` — settings are never deleted, only updated
- `reg*` fields grouped into a single `registration` JSON field
- Units for `calendarOccurrences` and `regTitleDelTime` are TBD — document when known

---

## 1. Prisma — `prisma/settings.prisma`

```prisma
model Settings {
  colTitles          Json?
  holidays           Json?
  rebates            Json?
  voucher            Json?
  calendarPast       Boolean  @default(false)
  calendarOccurrences Int      @default(0)   // unit: TBD
  calendarLength     Int      @default(12)  // unit: TBD
  formFields         Json?
  domain             String?
  legalResources     String   @default("https://domain/fileadmin/kunden/mandant/rechtstexte/")
  contracts          Json?
  registration       Json?    // contains: regTitleCol1, regTitleCol2, regTitleDelTime, regCheckSeats, regWaitlist

  // Common fields
  id        String   @id @default(uuid()) @db.Uuid
  tenantId  String   @unique               // singleton per tenant
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

Add `prisma/settings.prisma` to the list of files included by `prisma/schema.prisma` if using multi-file Prisma setup.

---

## 2. Zod — `src/schemas/settings.ts`

```ts
import { z } from 'zod/v4';

export const registrationSchema = z.object({
  titleCol1:   z.string().optional(),
  titleCol2:   z.string().optional(),
  delTime:     z.number().optional(),   // unit: TBD
  checkSeats:  z.boolean().optional(),
  waitlist:    z.boolean().optional(),
});

export const settingsSchema = z.object({
  colTitles:          z.record(z.unknown()).optional(),
  holidays:           z.record(z.unknown()).optional(),
  rebates:            z.record(z.unknown()).optional(),
  voucher:            z.record(z.unknown()).optional(),
  calendarPast:       z.boolean().optional(),
  calendarOccurrences: z.number().optional(),
  calendarLength:     z.number().optional(),
  formFields:         z.record(z.unknown()).optional(),
  domain:             z.string().optional(),
  legalResources:     z.string().optional(),
  contracts:          z.record(z.unknown()).optional(),
  registration:       registrationSchema.optional(),

  id:       z.uuid(),
  tenantId: z.uuid(),
});

export type Settings = z.infer<typeof settingsSchema>;
```

Wire into `src/schemas/index.ts`.

---

## 3. Controller — `src/controllers/settings.ts`

Two endpoints: read and upsert (no create/delete, no `:id`).

```ts
// GET /settings — return tenant's settings (or null if not yet created)
export const getSettings: RequestHandler = async (req, res) => { … }

// PUT /settings — full upsert
export const upsertSettings: RequestHandler = async (req, res) => { … }

// PATCH /settings — partial upsert
export const patchSettings: RequestHandler = async (req, res) => { … }
```

Use `prisma.settings.upsert({ where: { tenantId }, create: { …body, tenantId }, update: { …body } })`.

Wire into `src/controllers/index.ts`.

---

## 4. Route — `src/routes/settingsRouter.ts`

```ts
const settingsInputSchema = settingsSchema.omit({ id: true, tenantId: true });

settingsRouter
  .route('/')
  .get(authenticate, getSettings)
  .put(authenticate, validateZod(settingsInputSchema), upsertSettings)
  .patch(authenticate, validateZod(settingsInputSchema.partial()), patchSettings);
```

Register in `src/routes/index.ts` as `/settings`.

---

## 5. Implementation order

1. `prisma/settings.prisma` → run `prisma migrate dev`
2. `src/schemas/settings.ts` → export from index
3. `src/controllers/settings.ts` → export from index
4. `src/routes/settingsRouter.ts` → register in index

