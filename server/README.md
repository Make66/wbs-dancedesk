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