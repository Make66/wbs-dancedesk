import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

export type AuthUser = {
  id: string;
  tenantId: string;
};

type AuthState = {
  user: AuthUser | null;
  hydrated: boolean;
  setHydrated: (value: boolean) => void;
  setAuth: (user: AuthUser) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        hydrated: false,
        setHydrated: (value) => set({ hydrated: value }),
        setAuth: (user) => set({ user }),
        clearAuth: () => set({ user: null }),
      }),
      {
        name: 'auth-store',
        storage: createJSONStorage(() => AsyncStorage),
        onRehydrateStorage: () => (state) => {
          state?.setHydrated(true);
        },
        partialize: (state) => ({ user: state.user }),
      }
    ),
    { name: 'authStore' }
  )
);
