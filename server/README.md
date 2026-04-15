# WBS Graduation Project DanceDesk - Server

## Editor settings
- for VSCode, install https://marketplace.visualstudio.com/items?itemName=Prisma.prisma

## Features
- authentication/authorization

## API endpoints (WIP)
- course tree
- modules
- registration


## tables & schemas
- customer => Tanzschule
- user => Clerks that administer data; role based on modules
- modules => areas in which clerks have access
- registrations
- participant (from registrations)
- location => course venue
- target
- category
- course
- instructor
- text
- settings

# Project setup

```
// https://www.postgresql.org/
// Mac: brew install postgresql@18 && brew services start postgresql@18
// Linux: apt install postgresql
psql postgres
>
CREATE USER yourusername WITH PASSWORD 'yourpassword';
ALTER ROLE yourusername CREATEDB;  // Allow creating databases
CREATE DATABASE mydb OWNER yourusername;

npm install prisma @types/pg --save-dev
npm install prisma --save-dev
npm install @prisma/client @prisma/adapter-pg pg

// This will create a generated directory based on where you set the output to in 
the Prisma Schema. Any time your import Prisma Client, it will need to come from 
this generated client API 

npx prisma generate
npx prisma init --datasource-provider postgresql --output ../generated/prisma
```

# Database

## Accessing the database
```
npx prisma studio --config prisma.config.ts
´´´

## Create the first user
POST http://localhost:8000/auth/register
```
{
  "firstName": "Max",
  "lastName": "Mustermann",
  "email": "max@test.de",
  "password": "Test1234!",
  "tenantId": "seed"
}
´´´

## Procedure after changing schema
```
# generate the client from new schema
npx prisma generate

# create a migration and apply the new schema to the db
npx prisma migrate dev --name <description>

# populate db with data from ./prisma/seed.ts
npx prisma db seed
# user / pass is now admin@test.de/test123

-- or --
npx prisma migrate reset && npx prisma migrate dev --name init && npx prisma generate && npx prisma db seed


```

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


# Endpoints

## Auth

POST   /auth/register             body: { firstName, lastName, email, password, tenantId }

POST   /auth/login                body: { email, password }

POST   /auth/refresh              (reads refreshToken cookie)

DELETE /auth/logout               (reads refreshToken cookie)

GET    /auth/me                   (requires accessToken cookie)

POST   /auth/participant-login    body: { email, password }

POST   /auth/participant-me       (requires accessToken cookie)


## CRUD for models

/auth           POST register, login, refresh  |  DELETE logout  |  GET me

/targets        GET, POST, GET/:id, PUT/:id, PATCH /:id, DELETE/:id

/categories     GET, POST, GET/:id, PUT/:id, PATCH /:id, DELETE/:id

/courses        GET, POST, GET/:id, PUT/:id, PATCH /:id, DELETE/:id

/customers      GET, POST, GET/:id, PUT/:id, PATCH /:id, DELETE/:id

/events         GET, POST, GET/:id, PUT/:id, PATCH /:id, DELETE/:id

/instructors    GET, POST, GET/:id, PUT/:id, PATCH /:id, DELETE/:id

/locations      GET, POST, GET/:id, PUT/:id, PATCH /:id, DELETE/:id

/modules        GET, POST, GET/:id, PUT/:id, PATCH /:id, DELETE/:id

/participants   GET, POST, GET/:id, PUT/:id, PATCH /:id, DELETE/:id

/registrations  GET, POST, GET/:id, PUT/:id, PATCH /:id, DELETE/:id

/settings  GET, PUT, PATCH

/rooms          GET, POST, GET/:id, PUT/:id, PATCH /:id, DELETE/:id

/texts          GET, POST, GET/:id, PUT/:id, PATCH /:id, DELETE/:id

/user          GET, POST, GET/:id, PUT/:id, PATCH /:id, DELETE/:id

## Nested routes

GET /categories/:id/courses    — courses belonging to a category

POST /chats                  { participantId, tenantId }        → { sessionId }

POST /chats/messages         { sessionId, prompt }              → SSE stream + [DONE]

GET  /chats/:sessionId                                          → { session, messages[] }

GET /courses/month             - all courses this month, starting with 0: monday

GET /courses/month/:number     - all courses in month n, (13 % 12) = 1st month next year

GET /courses/week              - all courses this week, starting with 0: monday

GET /courses/week/:number      - all courses in week n, (54 % 53) = 1st week next year

GET /courses/week/:year/:week  - Hi Adrian!

GET /courses/:id/dates         - delivers possible event dates for a course

GET /courses/:id/participants  - all participants of a certain course

GET /customers/by-tenant/:tenantId - no auth required, only branding fields. Created for 1st logins

GET /events/month              - returns events where startsAt >= 1st day of month, limited to this month

GET /events/month/:number      - returns events from a certain month

GET /events/upcoming           - returns events where startsAt > yesterday at midnight, ordered ascending, limited to this week

GET /instructors/:id/courses   - returns all non-deleted courses for the given instructor within the tenant.

GET /locations/:id/events     — events belonging to a location

GET /locations/:id/rooms       — rooms belonging to a location

GET /locations/:id/targets     — targets belonging to a location

GET /settings/holidays/:state  - official school holidays of a given state (2-letter capital)

GET /targets/:id/categories    — categories belonging to a target

GET /targets/:id/courses       — returns target + categories + their courses (nested)

GET /participants/:id/courses  - all courses of a certain participant

GET /rooms/:id/events          - all events of a certain room

GET /users/:id                 — returns user with included locations and modules
