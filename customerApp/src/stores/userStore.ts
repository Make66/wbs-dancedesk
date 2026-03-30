import { create } from "zustand";
import { persist } from "zustand/middleware";

type UserSettings = {
  targetStylesById?: Record<
    string,
    {
      color?: string;
      fontColor?: string;
      icon?: string;
    }
  >;
  targetOrderByLocation?: Record<string, string[]>;
};

export type UserLocation = {
  name: string;
  imageUrl: string;
  seq: number;
  active: boolean;
  street: string;
  city: string;
  zipCode: string;
  longitude: number;
  latitude: number;
  id: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
};

export type UserModule = {
  name: string;
  seq: number;
  color: string;
  active: boolean;
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
  active: boolean;
  settings: UserSettings;
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

  updateUserSettings: (settingsPatch: Partial<UserSettings>) => void;

  getActiveLocation: () => UserLocation | null;
  getLocations: () => UserLocation[];
  getModules: () => UserModule[];
};

const filterNotDeleted = <T extends { isDeleted: boolean }>(items: T[]) => {
  return items.filter((item) => !item.isDeleted);
};

const filterActive = <T extends { active: boolean }>(items: T[]) => {
  return items.filter((item) => item.active);
};

const sortBySeq = <T extends { seq: number }>(items: T[]) => {
  return [...items].sort((a, b) => a.seq - b.seq);
};

export const userStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      selectedLocationId: null,
      isLoading: false,
      error: null,
      isSidebarOpen: false,
      setUser: (user) =>
        set(() => {
          const validLocations = [...user.locations]
            .filter((location) => !location.isDeleted && location.active)
            .sort((a, b) => a.seq - b.seq);

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
          if (state.selectedLocationId === locationId) {
            return state;
          }

          if (!state.user) {
            return { selectedLocationId: null };
          }

          const validLocations = [...state.user.locations]
            .filter((location) => !location.isDeleted && location.active)
            .sort((a, b) => a.seq - b.seq);

          const isValidLocation = validLocations.some((location) => location.id === locationId);

          return {
            selectedLocationId: isValidLocation ? locationId : (validLocations[0]?.id ?? null),
          };
        }),

      initializeSelectedLocationId: () =>
        set((state) => {
          if (!state.user) return state;

          const validLocations = sortBySeq(filterActive(filterNotDeleted(state.user.locations)));

          if (
            state.selectedLocationId &&
            validLocations.some((location) => location.id === state.selectedLocationId)
          ) {
            return state;
          }

          return {
            selectedLocationId: validLocations[0]?.id ?? null,
          };
        }),

      updateUserSettings: (settingsPatch) =>
        set((state) => {
          if (!state.user) return state;

          return {
            user: {
              ...state.user,
              settings: {
                ...state.user.settings,
                ...settingsPatch,
              },
              updatedAt: new Date().toISOString(),
            },
          };
        }),

      getActiveLocation: () => {
        const { user, selectedLocationId } = get();
        if (!user || !selectedLocationId) return null;

        const validLocations = sortBySeq(filterActive(filterNotDeleted(user.locations)));

        return validLocations.find((location) => location.id === selectedLocationId) ?? null;
      },

      getLocations: () => {
        const { user } = get();
        if (!user) return [];

        return sortBySeq(filterActive(filterNotDeleted(user.locations)));
      },

      getModules: () => {
        const { user } = get();
        if (!user) return [];

        return sortBySeq(filterActive(filterNotDeleted(user.modules)));
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
