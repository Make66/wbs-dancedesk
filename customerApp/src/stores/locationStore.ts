import { create } from "zustand";
import { persist } from "zustand/middleware";

type LocationStore = {
  selectedLocationId: string | null;
  setSelectedLocationId: (id: string) => void;
};

export const locationStore = create<LocationStore>()(
  persist(
    (set) => ({
      selectedLocationId: null,
      setSelectedLocationId: (id) => set({ selectedLocationId: id }),
    }),
    {
      name: "locations-storage",
    },
  ),
);
