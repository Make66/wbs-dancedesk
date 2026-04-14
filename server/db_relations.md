# Database Relations — WBS DanceDesk

```
╔══════════════╗          ╔══════════════╗
║   Customer   ║          ║   Settings   ║  (isolated, tenantId only)
╠══════════════╣          ╚══════════════╝
║ name         ║
║ email        ║  1               n  ╔══════════════╗
║ primary …    ╠═════════════════════╣  Instructor  ║
║ colors       ║                     ╠══════════════╣
╚══════╤═══════╝                     ║ name         ║
       │                             ║ skills[]     ║
       │ 1:n                         ╚══════╤═══════╝
       │                                    │
       ▼                                    │ 0..1 : n
╔══════════════╗                            │
║   Location   ║                            │
╠══════════════╣                            │
║ name         ║  1         n  ╔═══════════╧═══════════════════════════╗
║ address      ╠═══════════════╣                 Course                ║
╚══════╤═══════╝               ╠═══════════════════════════════════════╣
       │                       ║ name, description                     ║
       │ 1:n                   ║ startsAt / endsAt                     ║
       │                       ║ frequency, dates (JSON)               ║
       ▼                       ║ seatsCurrent / seatsMax               ║
╔══════════════╗               ║ color (JSON?)                         ║
║    Target    ║               ║ isClub, isBookedOut, isIgnoreCalendar ║
╠══════════════╣               ╚═╤══╤══╤════╤═════════════╤════════════╝
║ name         ║  1:n            │  │  │    │             │
║ color[]      ╠─────────────────┘  │  │    │             │
╚══════╤═══════╝                    │  │    │             │
       │ 1:n                        │  │    │             │
       ▼                            │  │    │             │
╔══════════════╗                    │  │    │             │
║   Category   ║  1:n               │  │    │             │
╠══════════════╣                    │  │    │             │
║ name         ╠────────────────────┘  │    │             │
║ color[]      ║                       │    │             │
╚══════════════╝                       │    │             │
                                       │    │             │
                          0..1:n       │    │             │ 0..1:n
╔══════════════╗                       │    │             │
║     Room     ╠───────────────────────┘    │             │
╠══════════════╣                            │             │
║ name         ║                            │ 1:n         │ 1:n
║ capacity     ║◄──────────────┐            │             │
╚══════════════╝               │            ▼             ▼
       ▲                       │  ╔══════════════╗ ╔══════════════╗
       │ 1:n                   │  ║  Text        ║ ║  Text        ║
╔══════╧═══════╗               │  ║ (textTerms)  ║ ║ (textInfo)   ║
║   Location   ║               │  ╠══════════════╣ ╠══════════════╣
╚══════════════╝               │  ║ type = 0     ║ ║ type = 1     ║
                               │  ║ text (AGB)   ║ ║ text (Info)  ║
                               │  ╚══════════════╝ ╚══════════════╝
    Location ──────────────────┘
    (Room belongs to Location)

── Event (belongs to Room, Location, and Target) ───────────────────────

╔══════════════╗   0..1:n   ╔══════════════════════════╗
║     Room     ╠────────────╣          Event           ║
╚══════════════╝            ╠══════════════════════════╣
╔══════════════╗   0..1:n   ║ title, description       ║
║   Location   ╠────────────╣ date, icon, color[]      ║
╚══════════════╝            ║ address fields           ║
╔══════════════╗   n:m      ║ roomId (opt.)            ║
║    Target    ╠────────────╣ locationId (opt.)        ║
╚══════════════╝            ╚══════════════════════════╝
 ("EventTargets")

── Attendance (join: Participant × Course × date) ──────────────────────

╔═══════════════╗  1:n  ╔══════════════════════╗  n:1  ╔══════════════╗
║  Participant  ╠───────╣      Attendance       ╠───────╣    Course    ║
╚═══════════════╝       ╠══════════════════════╣       ╚══════════════╝
                        ║ date                 ║
                        ║ status (enum)        ║
                        ║ comment              ║
                        ╚══════════════════════╝

── Many-to-Many (explicit join table) ──────────────────────────────────

╔═══════════════╗         ╔══════════════════════╗         ╔══════════╗
║  Participant  ║  n      ║   ParticipantCourse   ║      n  ║  Course  ║
╠═══════════════╣─────────╠══════════════════════╣─────────╠══════════╣
║ firstName     ║         ║ participantId (PK)    ║         ║ id       ║
║ lastName      ║         ║ courseId      (PK)    ║         ║ ...      ║
║ email         ║         ║ tenantId              ║         ╚══════════╝
║ birthDate     ║         ║ createdAt             ║
║ address …     ║         ╚══════════════════════╝
╚═══════════════╝

── Many-to-Many (implicit, Prisma-managed) ─────────────────────────────

╔══════════╗    n : n    ╔══════════╗
║   User   ╠────────────╣ Location ║   @relation("UserLocations")
╚══════════╝            ╚══════════╝

╔══════════╗    n : n    ╔══════════╗
║   User   ╠────────────╣  Module  ║   @relation("UserModules")
╚══════════╝            ╚══════════╝

── FK relations (no back-relation shown above) ──────────────────────────

╔══════════════╗  n:1  ╔══════════╗
║ Registration ╠───────╣  Course  ║   courseId FK (raw form submissions)
╚══════════════╝       ╚══════════╝

── Standalone (no FK relations) ────────────────────────────────────────

╔════════════════╗
║    Settings    ║   (singleton per tenant — no FK, keyed by tenantId)
╚════════════════╝
```

## Relation summary table

| From         | To               | Type           | Via / FK                        | Note                              |
|--------------|------------------|----------------|---------------------------------|-----------------------------------|
| Customer     | Instructor       | 1 : n          | `Instructor.customerId`         |                                   |
| Customer     | Location         | 1 : n          | `Location.customerId`           |                                   |
| Location     | Target           | 1 : n (opt.)   | `Target.locationId`             |                                   |
| Location     | Room             | 1 : n (opt.)   | `Room.locationId`               |                                   |
| Location     | Course           | 1 : n (opt.)   | `Course.locationId`             |                                   |
| Location     | Event            | 1 : n (opt.)   | `Event.locationId`              |                                   |
| Target       | Category         | 1 : n          | `Category.targetId`             |                                   |
| Target       | Event            | n : m          | Prisma implicit table           | `@relation("EventTargets")`       |
| Category     | Course           | 1 : n          | `Course.categoryId`             | required                          |
| Instructor   | Course           | 1 : n (opt.)   | `Course.instructorId`           |                                   |
| Room         | Course           | 1 : n (opt.)   | `Course.roomId`                 |                                   |
| Room         | Event            | 1 : n (opt.)   | `Event.roomId`                  |                                   |
| Text         | Course (terms)   | 1 : n (opt.)   | `Course.textTermsId`            | named relation `"textTerms"`      |
| Text         | Course (info)    | 1 : n (opt.)   | `Course.textInfoId`             | named relation `"textInfo"`       |
| Course       | Attendance       | 1 : n          | `Attendance.courseId`           |                                   |
| Participant  | Attendance       | 1 : n          | `Attendance.participantId`      |                                   |
| Participant  | Course           | n : m          | `ParticipantCourse` join table  | explicit — carries `createdAt`, `tenantId` |
| Registration | Course           | n : 1          | `Registration.courseId`         | raw form submissions              |
| User         | Location         | n : m          | Prisma implicit table           | `@relation("UserLocations")`      |
| User         | Module           | n : m          | Prisma implicit table           | `@relation("UserModules")`        |
| Settings     | —                | none           | —                               | singleton per tenant              |
