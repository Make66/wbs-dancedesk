import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

export type TenantCustomer = {
  tenantId: string;
  name: string;
  email: string;
  website: string;
  logoUrl: string;
  primary: string;
  secondary: string;
  signInKey: string;
  apiKey: string;
  street: string;
  zipCode: string;
  city: string;
  longitude: number;
  latitude: number;
};

type TenantState = {
  customer: TenantCustomer | null;
  hydrated: boolean;
  setHydrated: (value: boolean) => void;
  setCustomer: (customer: TenantCustomer) => void;
  clearCustomer: () => void;
};

export const useTenantStore = create<TenantState>()(
  devtools(
    persist(
      (set) => ({
        customer: null,
        hydrated: false,
        setHydrated: (value) => set({ hydrated: value }),
        setCustomer: (customer) => set({ customer }),
        clearCustomer: () => set({ customer: null }),
      }),
      {
        name: 'tenant-store',
        storage: createJSONStorage(() => AsyncStorage),
        onRehydrateStorage: () => (state) => {
          state?.setHydrated(true);
        },
        partialize: (state) => ({ customer: state.customer }),
      }
    ),
    { name: 'tenantStore' }
  )
);
