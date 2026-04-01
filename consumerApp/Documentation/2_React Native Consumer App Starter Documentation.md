<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# React Native Consumer App Starter Documentation

This documentation describes the current software pack: a React Native mobile app starter built with Expo and a backend onboarding API implemented in Express with both a basic version and a Prisma + PostgreSQL version. React Native’s own docs recommend using a framework such as Expo for most new apps, while Expo documents that native Firebase integrations in Expo require custom native code through prebuild or development builds.[^1][^2]

## Overview

The mobile app starter is based on Expo, React Native, TypeScript, Expo Router, Firebase Auth, Firebase Cloud Messaging integration, camera, video playback, geolocation, TanStack Query, Zustand, React Hook Form, and Zod. Expo’s Firebase guide distinguishes the quick Firebase JS SDK path from React Native Firebase when native capabilities are needed, and React Native Firebase documents native messaging and social auth flows for mobile apps.[^3][^4][^1]

The backend pack includes an Express endpoint that verifies Firebase bearer tokens with Firebase Admin before accepting onboarding data, plus a second backend variant that persists the same onboarding data into PostgreSQL with Prisma. Firebase Admin’s token verification docs describe `verifyIdToken()` as the standard server-side validation flow for Firebase Authentication tokens, and Prisma’s PostgreSQL quickstart describes the schema, client generation, and migration workflow used in the database-backed version.[^5][^6]

## Pack contents

| Component | Purpose | Key technologies |
| :-- | :-- | :-- |
| Mobile app starter | Consumer mobile app foundation | Expo, React Native, TypeScript, Expo Router, Firebase, TanStack Query, Zustand, React Hook Form, Zod [^1][^7][^8] |
| Onboarding-enhanced app | Multi-step onboarding with animation and persistence | Reanimated, Gesture Handler, AsyncStorage-backed Zustand, SVG illustrations [^9][^10][^11][^12] |
| Express onboarding API | Authenticated onboarding endpoint | Express, Firebase Admin, Zod [^5][^13] |
| Prisma + PostgreSQL API | Persistent onboarding profile storage | Express, Prisma ORM, PostgreSQL, Firebase Admin [^6][^14] |

## Mobile architecture

The app uses Expo Router route groups for authentication separation and protected application areas. Expo Router documents authentication and protected route patterns around route groups such as `(auth)` and `(app)`, which is the basis for the app structure in this pack.[^7][^15]

The state architecture separates concerns across libraries: TanStack Query handles server data and mutations, while Zustand manages local UI and onboarding state. TanStack Query’s React Native documentation and examples support this provider-based approach for data synchronization and mutation state in mobile apps.[^8][^16]

### Core app stack

- Expo + React Native + TypeScript for the app foundation.[^2]
- Expo Router for file-based navigation and protected route layout organization.[^15][^7]
- React Native Firebase for Auth and Messaging where native integration is required.[^4][^3]
- TanStack Query for API reads and writes, including onboarding submission mutations.[^17][^18]
- Zustand for theme mode, onboarding progress, and lightweight client state.[^19][^20]
- React Hook Form + Zod for reusable validated form screens and multi-step onboarding validation.[^21][^22][^23]


### Feature modules

The app includes starter implementations for Google, Apple, and Facebook authentication, camera access, video playback, geolocation, push notification registration, and sample API screens. React Native Firebase’s social auth documentation covers Google, Apple, and Facebook provider credential exchange into Firebase Auth, while Expo and React Native Firebase documentation cover native messaging and platform-specific setup.[^1][^3][^4]

The onboarding experience is implemented as a multi-step flow before the main tab app becomes available. Multi-step React Hook Form patterns commonly pair per-step schemas with client state persistence, and Expo/React Native animation guidance supports Reanimated for polished animated transitions.[^9][^10][^22][^24]

## Onboarding flow

The onboarding flow currently supports profile setup, personalization, and permission preferences. It includes animated transitions, gesture-driven swiping between steps, custom SVG illustrations, and persistence across app restarts using AsyncStorage-backed Zustand state.[^11][^12][^20][^25]

On completion, the app submits the onboarding payload through a TanStack Query mutation to a backend endpoint. TanStack Query documents mutations as the standard mechanism for create and update requests with server side-effects, which is why onboarding completion is implemented as a mutation rather than a plain unmanaged request.[^18][^17]

### Onboarding payload

| Field | Source | Notes |
| :-- | :-- | :-- |
| `firstName`, `lastName`, `username` | User input | Captured in step 1 form validation flow [^22] |
| `interests` | User input | Captured in personalization step [^24] |
| `allowLocation`, `enableNotifications` | User input | Captured in permissions step [^11] |
| `onboardingCompletedAt` | App-generated | Sent as ISO timestamp during completion mutation [^18] |
| `firebaseUid`, `email`, `displayName` | Firebase authenticated user | Mapped from verified client auth state and sent with request metadata [^26][^5] |

## API integration

The mobile API client uses Axios with a request interceptor that attaches the Firebase ID token as a bearer token and also includes a user ID header. Axios request interceptors are a standard pattern for attaching authorization headers to outgoing requests, while Firebase guidance emphasizes using the verified ID token as the actual authentication credential for backend requests.[^27][^5]

The app’s onboarding mutation posts to `/profiles/onboarding` using the configured `apiBaseUrl`. The request includes authenticated headers, user metadata, and the structured onboarding payload required by the backend endpoint.[^5][^17][^18]

## Express backend

The basic Express backend variant verifies Firebase bearer tokens using Firebase Admin middleware, validates the JSON payload with Zod, and returns a normalized profile response. Firebase Admin setup docs explain that server credentials are required for initialization, and Firebase Auth docs describe token verification as the recommended backend authentication method.[^13][^5]

The endpoint does not trust client identity fields in isolation. Instead, it compares optional client-provided `firebaseUid` values to the UID decoded from the verified Firebase token before accepting the request, which aligns with server-side token verification practices described in Firebase documentation.[^28][^5]

### Express route summary

| Route | Method | Auth | Behavior |
| :-- | :-- | :-- | :-- |
| `/health` | GET | None | Returns service health response [^13] |
| `/profiles/onboarding` | POST | Firebase bearer token | Verifies token, validates payload, returns normalized onboarding profile [^5][^28] |

## Prisma + PostgreSQL backend

The Prisma-backed backend stores onboarding profiles in PostgreSQL using a `UserProfile` model with a unique `firebaseUid`. Prisma’s PostgreSQL quickstart uses a `DATABASE_URL`, Prisma schema, generated client, and migrations, and Prisma upsert behavior depends on a unique field such as the verified Firebase UID.[^6][^14]

The route uses Prisma `upsert` so first-time onboarding creates a record and later submissions update the existing record. This is a strong fit for onboarding because the verified Firebase user should have one canonical profile row that can be revised without duplicate-account drift.[^14]

### Database model summary

| Field | Type | Notes |
| :-- | :-- | :-- |
| `id` | String | Prisma-generated primary key [^6] |
| `firebaseUid` | String | Unique identity link to verified Firebase user [^5][^14] |
| `email`, `displayName` | String? | Derived from verified token claims or client payload fallback [^5] |
| `firstName`, `lastName`, `username`, `interests` | String | Onboarding profile data |
| `allowLocation`, `enableNotifications` | Boolean | Permission preferences |
| `onboardingCompletedAt` | DateTime | Completion timestamp |
| `createdAt`, `updatedAt` | DateTime | Database-managed record timestamps [^6] |

## Setup order

A practical local setup sequence is:

1. Start the Express backend or Prisma backend with Firebase Admin credentials configured. Firebase Admin requires server credentials such as a service account or deployment identity.[^13]
2. If using Prisma, set `DATABASE_URL`, generate the Prisma client, and run migrations against PostgreSQL. Prisma’s PostgreSQL setup docs use this workflow.[^6]
3. Point the mobile app’s `apiBaseUrl` at the backend URL.
4. Add Firebase native files to the Expo app and configure provider credentials for Google, Apple, and Facebook login. Expo and React Native Firebase document these native setup requirements for production mobile auth and messaging.[^3][^4][^1]
5. Run Expo prebuild or native run commands so native Firebase dependencies and mobile capabilities are installed properly. Expo documents the need for dev builds or prebuild when native modules are involved.[^1]

## Trade-offs and next steps

The current pack is a strong starter foundation, but several production-oriented improvements would still be useful. On the mobile side, a production app would typically add stronger API error handling, refresh token behavior, analytics, crash reporting, and deeper environment separation. On the backend side, a production deployment would usually add structured logging, rate limiting, database migrations in CI/CD, and stronger conflict handling for unique fields like `username`.[^29][^14][^6]

Recommended next enhancements:

- Add Docker Compose for PostgreSQL plus the Prisma API for one-command local startup.[^6]
- Add username availability checks and uniqueness-friendly error mapping in the onboarding flow.[^14]
- Add server-side profile read/update routes beyond onboarding completion.[^6]
- Add request logging, validation telemetry, and observability around failed token verification and failed writes.[^5][^13]


## Included artifacts

The following generated artifacts are part of the current software pack.

<div align="center">⁂</div>

[^1]: https://docs.expo.dev/guides/using-firebase/

[^2]: https://stackoverflow.com/questions/32836101/facebook-login-for-react-native-app-on-android

[^3]: https://rnfirebase.io/messaging/usage

[^4]: https://github.com/invertase/react-native-firebase/blob/main/docs/auth/social-auth.md

[^5]: https://firebase.google.com/docs/auth/admin/verify-id-tokens

[^6]: https://www.prisma.io/docs/getting-started/prisma-orm/quickstart/postgresql

[^7]: https://docs.expo.dev/router/advanced/authentication/

[^8]: https://tanstack.com/query/v5/docs/framework/react/examples/react-native

[^9]: https://docs.expo.dev/develop/user-interface/animation/

[^10]: https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started/

[^11]: https://docs.expo.dev/versions/latest/sdk/async-storage/

[^12]: https://docs.swmansion.com/react-native-gesture-handler/docs/2.x/components/reanimated_swipeable/

[^13]: https://firebase.google.com/docs/admin/setup

[^14]: https://stackoverflow.com/questions/73905852/how-to-use-upsert-with-prisma

[^15]: https://docs.expo.dev/router/advanced/protected/

[^16]: https://tanstack.com/query/v5/docs/react/react-native

[^17]: https://tanstack.com/query/v5/docs/react/guides/mutations

[^18]: https://tanstack.com/query/v5/docs/react/reference/useMutation

[^19]: https://github.com/pmndrs/zustand/discussions/2763

[^20]: https://github.com/pmndrs/zustand/issues/394

[^21]: https://reactnativerelay.com/article/building-type-safe-forms-react-native-react-hook-form-zod

[^22]: https://blog.logrocket.com/building-reusable-multi-step-form-react-hook-form-zod/

[^23]: https://dev.to/marufrahmanlive/react-hook-form-with-zod-complete-guide-for-2026-1em1

[^24]: https://www.buildwithmatija.com/blog/master-multi-step-forms-build-a-dynamic-react-form-in-6-simple-steps

[^25]: https://www.animatereactnative.com/blog/animated-onboarding-with-react-native-reanimated

[^26]: https://rnfirebase.io/auth/usage

[^27]: https://stackoverflow.com/questions/43051291/attach-authorization-header-for-all-axios-requests

[^28]: https://oneuptime.com/blog/post/2026-02-17-firebase-auth-token-verification-express-middleware-cloud-run/view

[^29]: https://blog.logrocket.com/axios-post-requests/

