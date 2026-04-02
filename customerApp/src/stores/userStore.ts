import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserLocation = {
  name: string;
  imageUrl: string;
  isActive: boolean;
  street: string;
  city: string;
  zipCode: string;
  longitude: number;
  latitude: number;
  customerId: string | null;
  setSeqTarget?: string[];
  setSeqCategory?: string[];
  id: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
};

export type UserModule = {
  name: string;
  color: string;
  isActive: boolean;
  id: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
};

export type User = {
  firstName: string;
  lastName: string;
  email: string;
  imageUrl: string;
  isActive: boolean;
  setSeqTarget?: string[];
  setSeqCategory?: unknown;
  setSeqCourse?: unknown;
  id: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  locations: UserLocation[];
  modules: UserModule[];
};

type UserStore = {
  user: User | null;
  selectedLocationId: string | null;
  isLoading: boolean;
  isSidebarOpen: boolean;
  error: string | null;

  setUser: (user: User) => void;
  clearUser: () => void;

  setLoading: (value: boolean) => void;
  setError: (value: string | null) => void;

  setSelectedLocationId: (locationId: string | null) => void;
  initializeSelectedLocationId: () => void;

  updateLocationTargetOrder: (locationId: string, orderedIds: string[]) => void;

  getActiveLocation: () => UserLocation | null;
  getLocations: () => UserLocation[];
  getModules: () => UserModule[];
};

const filterNotDeleted = <T extends { isDeleted: boolean }>(items: T[]) => {
  return items.filter((item) => !item.isDeleted);
};

const filterActive = <T extends { isActive: boolean }>(items: T[]) => {
  return items.filter((item) => item.isActive);
};

export const userStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      selectedLocationId: null,
      isLoading: false,
      error: null,
      isSidebarOpen: true,

      setUser: (user) =>
        set(() => {
          const validLocations = filterActive(filterNotDeleted(user.locations));

          return {
            user,
            selectedLocationId: validLocations[0]?.id ?? null,
            error: null,
          };
        }),

      clearUser: () =>
        set({
          user: null,
          selectedLocationId: null,
          isLoading: false,
          error: null,
        }),

      setLoading: (value) =>
        set({
          isLoading: value,
        }),

      setError: (value) =>
        set({
          error: value,
        }),

      setSelectedLocationId: (locationId) =>
        set((state) => {
          if (state.selectedLocationId === locationId) return state;
          if (!state.user) return { selectedLocationId: null };

          const validLocations = filterActive(filterNotDeleted(state.user.locations));
          const isValid = validLocations.some((loc) => loc.id === locationId);

          return {
            selectedLocationId: isValid ? locationId : (validLocations[0]?.id ?? null),
          };
        }),

      initializeSelectedLocationId: () =>
        set((state) => {
          if (!state.user) return state;

          const validLocations = filterActive(filterNotDeleted(state.user.locations));

          if (
            state.selectedLocationId &&
            validLocations.some((loc) => loc.id === state.selectedLocationId)
          ) {
            return state;
          }

          return {
            selectedLocationId: validLocations[0]?.id ?? null,
          };
        }),

      updateLocationTargetOrder: (locationId, orderedIds) =>
        set((state) => {
          if (!state.user) return state;

          return {
            user: {
              ...state.user,
              locations: state.user.locations.map((location) =>
                location.id === locationId
                  ? {
                      ...location,
                      setSeqTarget: orderedIds,
                      updatedAt: new Date().toISOString(),
                    }
                  : location,
              ),
              updatedAt: new Date().toISOString(),
            },
          };
        }),

      getActiveLocation: () => {
        const { user, selectedLocationId } = get();
        if (!user || !selectedLocationId) return null;

        return (
          filterActive(filterNotDeleted(user.locations)).find(
            (loc) => loc.id === selectedLocationId,
          ) ?? null
        );
      },

      getLocations: () => {
        const { user } = get();
        if (!user) return [];
        return filterActive(filterNotDeleted(user.locations));
      },

      getModules: () => {
        const { user } = get();
        if (!user) return [];
        return filterActive(filterNotDeleted(user.modules));
      },
    }),
    {
      name: "user-storage",
      partialize: (state) => ({
        user: state.user,
        selectedLocationId: state.selectedLocationId,
      }),
    },
  ),
);
