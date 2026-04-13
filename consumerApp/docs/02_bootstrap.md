what is the flow of files in this app? I dont see any login

app/
├── _layout.tsx          ← Root: wraps everything in AppProviders
├── index.tsx            ← Entry: redirects based on auth state
│
├── (auth)/              ← Unauthenticated group
│   ├── _layout.tsx      ← Guard: if already logged in → redirect to /(app)/(tabs)
│   └── login.tsx        ← Email/password form
│
└── (app)/               ← Protected group
    ├── _layout.tsx      ← Guard: if NOT logged in → redirect to /(auth)/login
    └── (tabs)/
        ├── _layout.tsx  ← Tab bar: Home | Chat | Profile
        ├── index.tsx    ← Home tab
        ├── chat.tsx     ← Chat tab
        └── profile.tsx  ← Profile tab (has Sign out button)
Boot sequence:

_layout.tsx renders, Zustand rehydrates accessToken from AsyncStorage
index.tsx waits for initializing: false (hydration done), then:
No user → redirects to /(auth)/login ← this is your login screen
Has user → redirects to /(app)/(tabs)
(auth)/_layout.tsx double-checks: if user somehow arrives here while logged in, bounces them back to tabs
(app)/_layout.tsx double-checks: if not logged in, bounces to login
Why you might not be seeing login: on first run, the Zustand store hydrates from AsyncStorage. If there's a stale accessToken stored from a previous test, user will be non-null and the app skips the login screen directly to tabs. Clear the app's storage (or call logout() from the Profile tab) to reset.