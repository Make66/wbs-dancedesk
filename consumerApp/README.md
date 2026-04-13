# Consumer App

## Tech stack
* ReactNative + Expo Router/Native + TypeScript
* TanStack Query for API fetching/caching
* Zustand for UI/app state
* React Hook Form + Zod for forms and validation
* Firebase Auth/Session Backend
* Firebase Cloud Messaging

### Mobile Device native features
* 

# React Native Expo Consumer Starter V2

This version adds authenticated routing with Expo Router protected layouts, a persisted light/dark/system theme, sample API screens backed by TanStack Query, reusable form screen components with React Hook Form and Zod, and an enhanced multi-step onboarding flow with animation, custom SVG illustrations, swipe gestures, persistence, backend submission, and authenticated user metadata.

## Why this structure

React Native Firebase documents that backend authentication should use the user's Firebase ID token obtained via `getIdToken`, and specifically notes that the UID should not be used as the authentication credential by itself. [page:2]

Axios request interceptors are a standard way to attach headers globally to outgoing requests, which is why the API client now adds the bearer token and user metadata headers automatically for authenticated users. [web:144][web:132]

TanStack Query mutations remain the submission layer for the onboarding write because mutations are designed for create and update operations with server side-effects. [page:1]

## Added in v2

- Firebase ID token attached as `Authorization: Bearer ...` on authenticated API calls.
- `X-User-Id` header populated from the Firebase user UID.
- Onboarding payload now includes `firebaseUid`, `email`, and `displayName` from the authenticated user.
- Multi-step onboarding flow, persistence, swipe gestures, and backend submission remain in place.

## Backend note

Your backend should verify the Firebase bearer token server-side and treat that token as the authentication mechanism. The UID can still be included as metadata for convenience and auditing, but React Native Firebase documents that the token, not the UID alone, should be used for backend authentication. [page:2]

## Endpoint

The onboarding completion request posts to `/profiles/onboarding` using the app's configured API base URL. Update `expo.extra.apiBaseUrl` in `app.json` to point at your real backend before testing writes.
