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
╔══════════════╗               ║ isClub, isBookedOut, isIgnoreCalendar ║
║    Target    ║               ╚═╤══╤══╤════╤═════════════╤════════════╝
╠══════════════╣                 │  │  │    │             │
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

── Event (belongs to Room and/or Location) ─────────────────────────────

╔══════════════╗   0..1:n   ╔══════════════════════════╗
║     Room     ╠────────────╣          Event           ║
╚══════════════╝            ╠══════════════════════════╣
╔══════════════╗   0..1:n   ║ title, description       ║
║   Location   ╠────────────╣ date, icon, color[]      ║
╚══════════════╝            ║ address fields           ║
                            ║ roomId (opt.)            ║
                            ║ locationId (opt.)        ║
                            ╚══════════════════════════╝

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

── Standalone (no FK relations) ────────────────────────────────────────

╔════════════════╗
║  Registration  ║   (no relations — stores raw form submissions)
╚════════════════╝

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
| Target       | Category         | 1 : n          | `Category.targetId`             |                                   |
| Category     | Course           | 1 : n          | `Course.categoryId`             | required                          |
| Instructor   | Course           | 1 : n (opt.)   | `Course.instructorId`           |                                   |
| Room         | Course           | 1 : n (opt.)   | `Course.roomId`                 |                                   |
| Room         | Event            | 1 : n (opt.)   | `Event.roomId`                  |                                   |
| Location     | Event            | 1 : n (opt.)   | `Event.locationId`              |                                   |
| Text         | Course (terms)   | 1 : n (opt.)   | `Course.textTermsId`            | named relation `"textTerms"`      |
| Text         | Course (info)    | 1 : n (opt.)   | `Course.textInfoId`             | named relation `"textInfo"`       |
| Participant  | Course           | n : m          | `ParticipantCourse` join table  | explicit — carries `createdAt`, `tenantId` |
| User         | Location         | n : m          | Prisma implicit table           | `@relation("UserLocations")`      |
| User         | Module           | n : m          | Prisma implicit table           | `@relation("UserModules")`        |
| Registration | —                | none           | —                               | standalone, no FK relations       |
| Settings     | —                | none           | —                               | singleton per tenant              |
