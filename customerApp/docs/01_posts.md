# Posts / News Module

## Overview

The News module allows studio staff to create, edit, and manage news posts. Posts can optionally be linked to a Course or Event, have an image, and carry a validity window (`startsAt` / `endsAt`). Each post can be toggled active or archived independently.

---

## Architecture

### Data flow

```
PostsPage / PostDetailPage
  ↓
customerApp/src/data/post.ts   (fetch wrapper)
  ↓
server/src/routes/postRouter.ts
  → formidableMiddleware → cloudUploader → validateZod(postSchema) → controller
  ↓
server/src/controllers/post.ts
  ↓
Prisma → Post table
```

---

## Files

### Server (pre-existing, updated)

| File | Change |
|---|---|
| `server/prisma/post.prisma` | Prisma model (pre-existing) |
| `server/src/schemas/post.ts` | Zod schema incl. `isActive`, `isArchived` (pre-existing) |
| `server/src/controllers/post.ts` | CRUD handlers (pre-existing) |
| `server/src/routes/postRouter.ts` | **Added** `formidableMiddleware, cloudUploader` for image upload support |

### Client (new)

| File | Purpose |
|---|---|
| `customerApp/src/types/post-types.ts` | `Post` TypeScript type |
| `customerApp/src/data/post.ts` | `getPosts`, `getPostById`, `createPostDB`, `updatePostDB`, `deletePostDB` |
| `customerApp/src/components/post/PostItem.tsx` | List card: thumbnail, title, teaser, author, date, status badges |
| `customerApp/src/components/post/PostForm.tsx` | Create/edit form (react-hook-form); `text` field uses `RichTextEditor` |
| `customerApp/src/components/ui/RichTextEditor.tsx` | Tiptap-based RTE with toolbar (Bold, Italic, lists, Link); outputs HTML |
| `customerApp/src/pages/PostsPage.tsx` | List page at `/posts` |
| `customerApp/src/pages/PostDetailPage.tsx` | Detail/create page at `/post` and `/post/:postId` |

### Client (modified)

| File | Change |
|---|---|
| `customerApp/src/pages/index.tsx` | Export `PostsPage`, `PostDetailPage` |
| `customerApp/src/App.tsx` | Routes: `/posts`, `/post`, `/post/:postId` |
| `customerApp/src/components/nav/Sidebar.tsx` | "News" entry with `FaNewspaper` icon, after Teilnehmer |
| `customerApp/src/components/nav/SidebarMin.tsx` | `FaNewspaper` icon in collapsed nav array |
| `customerApp/src/data/course.ts` | Added `getCoursesDB()` for course dropdown |
| `customerApp/src/data/event.ts` | Added `Event` type + `getEventsDB()` for event dropdown |

---

## Post Schema

```prisma
model Post {
  title    String?   // Post headline
  teaser   String?   // Short summary shown in list
  text     String?   // Full body content
  imageUrl String    // Cloud URL (set by cloudUploader middleware)
  author   String
  date     DateTime  // Publication date
  startsAt DateTime  // Validity start ("Gültig von")
  endsAt   DateTime  // Validity end  ("Gültig bis")

  courseId String?   // Optional relation to Course
  eventId  String?   // Optional relation to Event

  id        String   @id @default(uuid())
  tenantId  String
  isActive  Boolean  @default(true)
  isArchived Boolean @default(false)
  isDeleted Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

---

## PostForm Fields

| Field | Input type | Notes |
|---|---|---|
| Image | ProfileImageUploader | File upload via formidable + Cloudinary |
| Titel | text input | `title` |
| Teaser | text input | `teaser` |
| Autor | text input | `author` |
| Datum | datetime-local | `date` |
| Gültig von | datetime-local | `startsAt` |
| Gültig bis | datetime-local | `endsAt` |
| Aktiv | Switch toggle | `isActive` |
| Archiviert | Switch toggle | `isArchived` |
| Text | RichTextEditor (Tiptap) | `text` — HTML string; toolbar: Bold, Italic, Bullet list, Ordered list, Link |
| Kurs | select dropdown | `courseId` — populated from `/api/courses` |
| Event | select dropdown | `eventId` — populated from `/api/events` |

---

## Navigation

Sidebar order: Dashboard → Kurse → Kalender → Teilnehmer → **News** → Einstellungen

Icon: `FaNewspaper` from `react-icons/fa`

---

## API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/posts` | List all posts (tenant-scoped, ordered by date desc) |
| POST | `/api/posts` | Create post (multipart/form-data) |
| GET | `/api/posts/:id` | Get single post |
| PATCH | `/api/posts/:id` | Partial update (multipart/form-data) |
| PUT | `/api/posts/:id` | Full update (multipart/form-data) |
| DELETE | `/api/posts/:id` | Soft delete (`isDeleted = true`) |

All routes require authentication (`authenticate` middleware).

---

## Verification

1. `cd customerApp && npm run dev`
2. Log in → "News" appears in sidebar after "Teilnehmer"
3. `/posts` → list renders, empty state "Keine Beiträge gefunden."
4. Click Add → `/post` → form renders with all fields and toggles
5. Fill fields, upload image, Save → toast success, item appears in list
6. Click item → `/post/:id` → form pre-populated, changes persist after save
7. Collapsed sidebar shows newspaper icon at correct position
