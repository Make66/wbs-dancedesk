import { create } from "zustand";

export const DEFAULT_SETTINGS: Settings = {
  calendar: {
    startHour: 13,
    endHour: 22,
    slotHeight: 20,
    minutesPerSlot: 15,
  },
};

type CalendarSettings = {
  startHour: number;
  endHour: number;
  slotHeight: number;
  minutesPerSlot: number;
};

type Settings = {
  calendar: CalendarSettings;
};

type SettingsStore = {
  settings: Settings;
  isLoading: boolean;
  error: string | null;

  setSettings: (settings: Partial<Settings>) => void;
  clearSettings: () => void;
  setLoading: (value: boolean) => void;
  setError: (value: string | null) => void;

  getSlotsPerHour: () => number;
  getStartSlot: () => number;
  getEndSlot: () => number;
  getVisibleSlotCount: () => number;
};

export const settingsStore = create<SettingsStore>()((set, get) => ({
  settings: DEFAULT_SETTINGS,
  isLoading: false,
  error: null,

  setSettings: (settings) =>
    set((state) => ({
      settings: {
        ...state.settings,
        ...settings,
        calendar: {
          ...state.settings.calendar,
          ...(settings.calendar ?? {}),
        },
      },
      error: null,
    })),

  clearSettings: () =>
    set({
      settings: DEFAULT_SETTINGS,
      isLoading: false,
      error: null,
    }),

  setLoading: (value) => set({ isLoading: value }),

  setError: (value) => set({ error: value }),

  getSlotsPerHour: () => 60 / get().settings.calendar.minutesPerSlot,
  getStartSlot: () =>
    get().settings.calendar.startHour * (60 / get().settings.calendar.minutesPerSlot),
  getEndSlot: () => get().settings.calendar.endHour * (60 / get().settings.calendar.minutesPerSlot),
  getVisibleSlotCount: () => {
    const { startHour, endHour, minutesPerSlot } = get().settings.calendar;
    const slotsPerHour = 60 / minutesPerSlot;
    return (endHour - startHour) * slotsPerHour;
  },
}));
