Lets create a plan to build a chat proxy for participants of dance courses asking for assistance.
Use cases: 
- help them find a follow-up course to the courses they already been part of
- show same-level courses that are missing dance-partners (too many female = not enough male)
- to help them find the next events matching their experience
- more to come...
Important: We are using POSTGRES, not MONGODB!
ParticipantId and TenantId will be provided by the Chat Client, when opening session.
Sample Chat Proxy can be seen here: /Users/martin/dev/wbs/wbs-chat/backend/src/app.ts. Suggest improvements where possible.
Target Client Implementation here: /Users/martin/dev/wbs/wbs-reactNative/app/(app)/(tabs)/chat.tsx
I think we need to register an MCP to connect to Postgres and fetch the data for the use cases
We will create a chat controller and an /chats endpoint as proxy
We will store the chat sessions in the Postgres database. So we need a chat.prisma schema and a zod schema for this. Important key is the chat id to feed the context.
As guard for the conversations, we only talk about dancing in general, the weather and courses of the customer (tenantId), we are connected to. Conversations should not exceed 5 minutes.
As system prompt, we use: "You are a friendly, always positive thinking and supportive assistant of the Dance School. You are in dance business for decades and know all dance styles in general but the ones offered at the Dance School in special. In Conversations you tend to come back to finding a good course match for the client."
Ask if design decisions are not clear.
Suggest improvements.
Append plan to this file.
---------------------

## Plan

### Context
Build a dance-school chat proxy integrated into the existing Express/Prisma/PostgreSQL server. Participants open a session (providing `participantId` + `tenantId`), exchange messages with an OpenAI-compatible LLM, and the proxy injects live course data as tool/context so the assistant can recommend follow-up courses, gender-balanced courses, and upcoming events. Chat sessions (history) are stored in Postgres, not MongoDB.

---

### 1. Prisma schema — `prisma/chat.prisma`

```prisma
model ChatSession {
  participantId String   @db.Uuid
  tenantId      String
  expiresAt     DateTime // now() + 5 minutes, updated on each message
  messages      ChatMessage[]

  id        String   @id @default(uuid()) @db.Uuid
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model ChatMessage {
  role    String  // "system" | "user" | "assistant"
  content String
  order   Int

  session   ChatSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  sessionId String      @db.Uuid

  id        String   @id @default(uuid()) @db.Uuid
  createdAt DateTime @default(now())
}
```

**Design notes:**
- `expiresAt` enforces the 5-minute guard server-side; checked on every message, returns 410 Gone when expired.
- Messages stored as rows (not a `Json[]` blob) so individual messages are addressable and the table stays queryable.
- `onDelete: Cascade` — deleting a session removes all its messages.
- No `isDeleted` flag needed; sessions expire, then can be hard-deleted by a cron job.

---

### 2. Zod schema — `src/schemas/chat.ts`

```ts
export const chatSessionSchema = z.object({
  participantId: z.uuid(),
  tenantId:      z.string().min(1),
});

export const chatMessageSchema = z.object({
  sessionId: z.uuid(),
  prompt:    z.string().min(1).max(2000),
});
```

Export both from `src/schemas/index.ts`.

---

### 3. Controller — `src/controllers/chat.ts`

**`POST /chats`** — `openSession`
- Validate body with `chatSessionSchema`.
- Create `ChatSession` with `expiresAt = now() + 5min`.
- Insert system prompt as first `ChatMessage` (role `"system"`, order `0`).
- Return `{ sessionId }`.

**`POST /chats/messages`** — `sendMessage` (SSE streaming)
- Validate body with `chatMessageSchema`.
- Load session; if `expiresAt < now()` → 410.
- Fetch **context data** from Postgres (see §4) and inject as a `"system"` message appended just before the user turn (not stored — ephemeral injection).
- Append user message row (order = last + 1).
- Set headers: `Content-Type: text/event-stream`, `x-session-id`.
- Stream OpenAI response token by token, writing each chunk as `data: <token>\n\n`.
- Assemble full reply, persist as assistant `ChatMessage` row.
- Bump `expiresAt` to `now() + 5min`.
- Send `data: [DONE]\n\n` and end the response.

**`GET /chats/:sessionId`** — `getSession` (optional, for chat history restore)
- Return all messages ordered by `order`.

**Guard middleware** — topic filter:
- Before forwarding to OpenAI, check that the user prompt doesn't attempt jailbreak or goes clearly off-topic (not dancing, weather, or course-related).
- Simple approach: add an off-topic instruction in the system prompt (cheaper than a separate LLM call).

---

### 4. Context injection (the "MCP" step)

Rather than a full MCP server, inject live data directly as a system message built in the controller. This avoids extra infra while keeping data fresh.

**Data fetched per message** (scoped to `tenantId`):

```ts
// Courses the participant has completed
const pastCourses = await prisma.participantCourse.findMany({
  where: { participantId, course: { tenantId } },
  include: { course: { include: { category: true } } }
});

// Follow-up courses at same or next level, not yet enrolled
const followUpCourses = await prisma.course.findMany({
  where: {
    tenantId,
    isDeleted: false,
    isActive: true,
    endsAt: { gt: new Date() },
    category: { /* same category group */ },
    NOT: { participants: { some: { id: participantId } } }
  }
});

// Gender-imbalanced courses (too many of one gender)
// ParticipantCourse → Participant.gender aggregation

// when are my next course dates?
// ParticipantCourse → Course.dates > yesterday

// Upcoming events (next 30 days)
const upcomingEvents = await prisma.event.findMany({
  where: { tenantId, startsAt: { gte: new Date(), lte: add30days } }
});
```

Serialize to a compact string and prepend as a `"system"` message (not persisted — fresh on every turn).

**Improvement over sample proxy:** The sample `app.ts` stores the system prompt in history (wastes tokens on every call). Better: keep only `user`/`assistant` messages in history, and re-inject `system` + context fresh each call. This also means the context stays current.

---

### 5. Router — `src/routes/chatRouter.ts`

```ts
chatRouter.post('/',           authenticate, validateZod(chatSessionSchema),  openSession);
chatRouter.post('/messages',   authenticate, validateZod(chatMessageSchema),  sendMessage);
chatRouter.get('/:sessionId',  authenticate, getSession);
```

`authenticate` middleware already reads `req.user` from JWT — but `participantId` and `tenantId` come from the **body** (as specified), so no changes needed to the auth layer.

Register in `src/routes/index.ts` and wire in `app.ts`/`server.ts` at `/chats`.

---

### 6. System prompt (final)

```
You are a friendly, always positive thinking and supportive assistant of the Dance School.
You are in dance business for decades and know all dance styles in general but the ones
offered at the Dance School in special. In conversations you tend to come back to finding
a good course match for the client.

You ONLY discuss: dance in general, the weather, and courses/events of this dance school.
If the user steers off-topic, gently redirect to dancing or courses.
Keep responses concise. This conversation will end after 5 minutes of inactivity.
```

---

### 7. React Native client — `app/(app)/(tabs)/chat.tsx`

Replace the placeholder with a full chat UI:
- On mount: `POST /chats` with `participantId` + `tenantId` → store `sessionId`.
- On send: `POST /chats/messages` with `{ sessionId, prompt }`.
- Render message bubbles (user right, assistant left).
- Show "Session expired" notice when server returns 410.
- Reconnect button creates a new session.

---

### 8. Files to create / modify

| Action | File |
|--------|------|
| Create | `server/prisma/chat.prisma` |
| Create | `server/src/schemas/chat.ts` |
| Modify | `server/src/schemas/index.ts` |
| Create | `server/src/controllers/chat.ts` |
| Modify | `server/src/controllers/index.ts` |
| Create | `server/src/routes/chatRouter.ts` |
| Modify | `server/src/routes/index.ts` |
| Modify | `server/src/app.ts` (or server entry) — mount `/chats` |
| Modify | `server/.env` — add `OPENAI_API_URL`, `OPENAI_API_KEY`, `OPENAI_MODEL` |
| Modify | `wbs-reactNative/app/(app)/(tabs)/chat.tsx` |

---

### 9. Decisions

1. **Auth**: JWT available on the mobile client — use existing `authenticate` middleware on all `/chats` routes.
2. **Model**: `gpt-4o-mini` via `OPENAI_MODEL` env var.
3. **Streaming**: SSE (chunked). `POST /chats/messages` sets `Content-Type: text/event-stream`, streams tokens, then persists the full assembled reply to the DB once the stream ends.
4. **Session expiry**: Lazy — checked on first message after timeout, returns 410 Gone.

---

### 10. Verification

1. Run migration: `npx prisma migrate dev --name add-chat`
2. `POST /chats` with a valid `participantId` + `tenantId` → get back `sessionId`.
3. `POST /chats/messages` with `{ sessionId, prompt: "Was gibt es für Anfängerkurse?" }` → get assistant reply with course context.
4. Wait 5 min, send again → expect 410.
5. Send off-topic prompt → assert assistant redirects to dancing.
6. React Native: verify message bubbles render and session reconnects after expiry.

---

## Summary — What was built

A dance-school chat proxy integrated into the existing Express/Prisma/PostgreSQL server (`wbs-dancedesk/server`).

### New files
| File | Purpose |
|------|---------|
| `prisma/chat.prisma` | `ChatSession` + `ChatMessage` Prisma models |
| `prisma/migrations/20260413100228_add_chat/` | DB migration for the two tables |
| `src/schemas/chat.ts` | Zod schemas for session creation and message sending |
| `src/controllers/chat.ts` | `openSession`, `sendMessage` (SSE), `getSession` |
| `src/routes/chatRouter.ts` | Router mounted at `/chats` |

### Modified files
| File | Change |
|------|--------|
| `src/schemas/index.ts` | Re-exports `chat.ts` |
| `src/controllers/index.ts` | Re-exports `chat.ts` |
| `src/routes/index.ts` | Re-exports `chatRouter.ts` |
| `src/index.ts` | Mounts `chatRouter` at `/chats` |

### How it works

1. **Session** — `POST /chats` creates a `ChatSession` (5-minute TTL) and inserts the system prompt as the first `ChatMessage`. Returns `{ sessionId }`.
2. **Message** — `POST /chats/messages` loads history, injects a fresh **ephemeral context block** (enrolled courses, upcoming course dates, available courses, upcoming events) and streams the LLM reply token-by-token as SSE (`data: "<token>"\n\n`), then persists the assembled reply and bumps the TTL.
3. **Expiry** — If `expiresAt < now` on any message call, the server returns `410 Gone`. Client should open a new session.
4. **Context use cases covered**:
   - Follow-up / same-level courses the participant hasn't joined yet
   - Gender-seat imbalance visible via `seatsCurrent` vs `seatsMax`
   - Upcoming events (next 30 days)
   - Next dates for enrolled courses (`Course.dates[] > yesterday`)

### Environment variables required
```
OPENAI_API_KEY=...
OPENAI_MODEL=gpt-4o-mini
OPENAI_API_URL=https://api.openai.com/v1   # optional, for self-hosted
```

### API quick reference
```
POST   /chats                  { participantId, tenantId }        → { sessionId }
POST   /chats/messages         { sessionId, prompt }              → SSE stream + [DONE]
GET    /chats/:sessionId                                          → { session, messages[] }
```
All routes require a valid participant JWT cookie (`accessToken`).

---

## Summary — React Native Chat Client

### New / modified files

| Action | File |
|--------|------|
| Create | `src/components/Chat.tsx` |
| Modify | `app/(app)/(tabs)/chat.tsx` |
| Modify | `src/config/env.ts` |
| Modify | `.env` |

### How it works

1. **Session** — On mount, `Chat` calls `POST /chats` with `participantId` + `tenantId` taken from the Zustand auth store (`useAuthState`). Returns `sessionId` stored in local state.
2. **Streaming** — `sendMessage` uses `XMLHttpRequest` (no extra dependencies) with `onprogress` to read SSE chunks as they arrive. Each `data: <token>` line is parsed (JSON.parse with raw-string fallback) and appended to the assistant bubble in real time.
3. **Expiry** — HTTP 410 from the server sets `expired` state, showing a banner with a "Reconnect" button that calls `openSession` again.
4. **New Chat** — Header button resets state and opens a fresh session.
5. **Keyboard** — `KeyboardAvoidingView` keeps the input bar above the keyboard on iOS.

### Environment variable

`.env` uses `EXPO_PUBLIC_CHAT_PROXY_URL` (renamed from `CHAT_PROXY_URL` — Expo requires the `EXPO_PUBLIC_` prefix to expose variables to the client bundle). Default: `http://localhost:8000/chats`.

`src/config/env.ts` exposes it as `env.chatProxyUrl`.
---

## Additions to chat client
- default language is informal german
- When talking about course registrations, hint the website  link "{{domain}}/anmeldung" from settings or offer to register the participant
- when user wants to get registered to a certain course, we can take use endpoint POST /registrations of the chat proxy server to register using the data from GET /participant/:id. Then we congratulate the participant and tell him all course dates (isClub=false) or the next 5 course dates (isClub=true)
- add summary to this file.

---

### Summary — Chat client additions

#### Client changes (`src/components/Chat.tsx`)

| What | How |
|------|-----|
| **Informal German UI** | All labels, placeholders, banners, and empty-state text switched to informal German ("du"-form) |
| **Tenant domain** | On mount, `GET /settings` is fetched first; `basic.domain` is stored in state and passed to `POST /chats` as `domain` so the server can inject `{{domain}}/anmeldung` into the system prompt context |
| **Registration action** | LLM emits `[REGISTER:<courseId>]` marker (invisible to user) → client strips it from the bubble, calls `POST /registrations` with participant data from the Zustand user store, appends a synthetic confirmation bubble |
| **Registering state** | `registering` flag blocks new messages and shows a progress bar while the API call is in flight |
| **Sequenced init** | `initialize()` fetches domain once, then opens the session — no race condition. Cached domain is reused on "Neuer Chat" / reconnect |

#### Required server-side changes (`src/controllers/chat.ts`)

The following additions must be made to the server to activate all features:

1. **Accept `domain` in session creation body** — extend `chatSessionSchema` with `domain?: z.string().url().optional()` and store it on `ChatSession` (or pass it through to the system prompt builder).

2. **Informal German system prompt** — prepend to the existing system prompt:
   ```
   Antworte immer auf Deutsch und duze den Nutzer.
   ```

3. **Registration link hint** — add to the system prompt context block (ephemeral injection per message):
   ```
   Wenn nach Kursanmeldungen gefragt wird, weise auf {{domain}}/anmeldung hin
   oder biete an, die Anmeldung direkt durchzuführen.
   ```

4. **Registration action signal** — add to the system prompt:
   ```
   Wenn ein Teilnehmer sich für einen Kurs anmelden möchte und du die Kurs-ID kennst,
   füge am Ende deiner Antwort exakt dieses Token ein (keine weitere Erklärung):
   [REGISTER:<courseId>]
   Nach der Anmeldung (bestätigt durch eine Folgemeldung) nenne alle Kurstermine
   (isClub=false) bzw. die nächsten 5 Kurstermine (isClub=true).
   ```
