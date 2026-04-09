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

# Endpoints

## Auth

POST   /auth/register   body: { firstName, lastName, email, password, tenantId }

POST   /auth/login      body: { email, password }

POST   /auth/refresh    (reads refreshToken cookie)

DELETE /auth/logout     (reads refreshToken cookie)

GET    /auth/me         (requires accessToken cookie)


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

/registrations  GET, POST, GET/:id, PUT/:id, PATCH /:id, DELETE/:id

/settings  GET, PUT, PATCH

/rooms          GET, POST, GET/:id, PUT/:id, PATCH /:id, DELETE/:id

/texts          GET, POST, GET/:id, PUT/:id, PATCH /:id, DELETE/:id

/user          GET, POST, GET/:id, PUT/:id, PATCH /:id, DELETE/:id

## Nested routes

GET /locations/:id/events     — events belonging to a location

GET /locations/:id/rooms       — rooms belonging to a location

GET /locations/:id/targets     — targets belonging to a location

GET /targets/:id/categories    — categories belonging to a target

GET /targets/:id/courses       — returns target + categories + their courses (nested)

GET /categories/:id/courses    — courses belonging to a category

GET /courses/week              - all courses this week, starting with 0: monday

GET /courses/week/:number      - all courses in week n, (54 % 53) = 1st week next year

GET /courses/:id/dates         - delivers possible event dates for a course

GET /courses/:id/participants  - all participants of a certain course

GET /participants/:id/courses  - all courses of a certain participant

GET /rooms/:id/events          - all events of a certain room

GET /users/:id                 — returns user with included locations and modules
