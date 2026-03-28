import { create } from "zustand";
import { persist } from "zustand/middleware";

type LocationsStore = {
  selectedLocationId: string | null;
  setSelectedLocationId: (id: string) => void;
};

export const useLocationsStore = create<LocationsStore>()(
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
