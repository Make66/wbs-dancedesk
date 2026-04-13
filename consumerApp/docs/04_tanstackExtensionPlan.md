# TanStack Query Extension Plan — Offline-Safe Profile Updates

## Current state

- `@tanstack/react-query` v5 is installed and `QueryClientProvider` is already wired in `AppProviders.tsx`
- `queryClient.ts` configures `refetchOnReconnect: true` but no persistence
- `ParticipantUpdateForm` calls `api.patch(...)` directly — if offline, the request throws and the update is lost
- App data (courses, events, courseWeek) is fetched imperatively in `authApi.ts` and written directly into Zustand — TanStack Query is not used for fetching yet

---

## Goal

Replace the direct `api.patch` call with a `useMutation` that:
1. Updates the local store optimistically
2. Queues the request if offline
3. Retries automatically on reconnect
4. Rolls back on failure

Extend to also use `useQuery` for participant data fetching, so the query cache can be persisted and rehydrated from AsyncStorage across reloads.

---

## Step 1 — Install missing packages

```bash
npx expo install @tanstack/query-async-storage-persister @tanstack/react-query-persist-client @react-native-community/netinfo
```

| Package | Purpose |
|---|---|
| `@tanstack/query-async-storage-persister` | Serialize the query cache to AsyncStorage |
| `@tanstack/react-query-persist-client` | `PersistQueryClientProvider` wrapper that rehydrates cache on startup |
| `@react-native-community/netinfo` | Detect online/offline state so TanStack Query can pause mutations |

---

## Step 2 — Persist the query cache

**Replace `QueryClientProvider` in `AppProviders.tsx`** with `PersistQueryClientProvider`:

```tsx
// src/providers/AppProviders.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { queryClient } from '@/lib/queryClient';

const persister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: 'QUERY_CACHE',
});

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister, maxAge: 24 * 60 * 60 * 1000 }}
    >
      <ThemeProvider>{children}</ThemeProvider>
    </PersistQueryClientProvider>
  );
}
```

**Update `queryClient.ts`** to tell TanStack Query to pause mutations when offline:

```ts
import NetInfo from '@react-native-community/netinfo';
import { onlineManager } from '@tanstack/react-query';

// Wire the native network state into TanStack Query's online manager
onlineManager.setEventListener((setOnline) => {
  return NetInfo.addEventListener((state) => {
    setOnline(state.isConnected ?? false);
  });
});

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
      gcTime: 24 * 60 * 60 * 1000, // keep cache for persister
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 3,
    },
  },
});
```

> `gcTime` must be at least as long as `maxAge` on the persister, otherwise the cache is garbage-collected before it can be saved.

---

## Step 3 — Add a mutation cache with persistence

For mutations to survive an app restart while offline, they must be stored too. Add a `MutationCache` with an `onMutate` that re-queues pending mutations on rehydration:

```ts
// src/lib/queryClient.ts (addition)
import { MutationCache } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['participant'] }),
  }),
  ...
});
```

TanStack Query v5's `persistQueryClient` also persists the mutation queue by default — pending mutations are re-fired when the app comes back online.

---

## Step 4 — Create a query key factory

```ts
// src/lib/queryKeys.ts
export const participantKeys = {
  me: () => ['participant', 'me'] as const,
};
```

---

## Step 5 — Replace imperative fetch with `useQuery`

Create a hook for the participant profile:

```ts
// src/features/participant/useParticipant.ts
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { participantKeys } from '@/lib/queryKeys';
import type { Participant } from '@/store/user';

export function useParticipant() {
  return useQuery({
    queryKey: participantKeys.me(),
    queryFn: async () => {
      const res = await api.get('/auth/participant-me');
      return res.data.participant as Participant;
    },
  });
}
```

The query cache is now persisted — on CMD-R the cached value renders immediately while a background refetch runs.

---

## Step 6 — Replace `api.patch` in the form with `useMutation`

```ts
// src/features/participant/useUpdateParticipant.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { participantKeys } from '@/lib/queryKeys';
import { useUserStore } from '@/store/user';
import type { Participant } from '@/store/user';

type UpdatePayload = Partial<Omit<Participant, 'id' | 'email' | 'tenantId'>>;

export function useUpdateParticipant(participantId: string) {
  const qc = useQueryClient();
  const setParticipant = useUserStore((s) => s.setParticipant);

  return useMutation({
    mutationKey: ['participant', 'update', participantId],
    mutationFn: (data: UpdatePayload) =>
      api.patch(`/participants/${participantId}`, data).then((r) => r.data as Participant),

    // 1. Optimistically update the cache immediately
    onMutate: async (data) => {
      await qc.cancelQueries({ queryKey: participantKeys.me() });
      const previous = qc.getQueryData<Participant>(participantKeys.me());
      qc.setQueryData(participantKeys.me(), (old: Participant) => ({ ...old, ...data }));
      return { previous }; // context for rollback
    },

    // 2. On success, sync Zustand store with the server response
    onSuccess: (updated) => {
      setParticipant(updated);
      qc.setQueryData(participantKeys.me(), updated);
    },

    // 3. Roll back cache on failure
    onError: (_err, _data, context) => {
      if (context?.previous) {
        qc.setQueryData(participantKeys.me(), context.previous);
      }
    },
  });
}
```

**Update `ParticipantUpdateForm.tsx`**:

```tsx
const { mutateAsync, isPending, isSuccess, isError } = useUpdateParticipant(participant.id);

const onSubmit = async (data: FormData) => {
  await mutateAsync(data);
};
```

When offline: `mutateAsync` throws immediately but the mutation is queued. On reconnect TanStack Query retries it automatically (up to `retry: 3` times) without any user action.

---

## Step 7 — Remove `validateSession` hydration from `useAuthState`

Once participant data comes from the query cache, the manual `hydrateAppData` call in `validateSession` can be reduced. `useQuery` hooks handle their own refetch on reconnect and cache rehydration on startup.

The auth store retains `user` (identity + tenantId) — TanStack Query owns the server state.

---

## Migration order

1. Install packages
2. Wire `onlineManager` + `gcTime` in `queryClient.ts`
3. Switch to `PersistQueryClientProvider` in `AppProviders.tsx`
4. Add `useParticipant` query and replace `fetchParticipantMe` in `validateSession`
5. Add `useUpdateParticipant` mutation and update `ParticipantUpdateForm`
6. Extend the same pattern to `myCourses`, `events`, and `courseWeek`
