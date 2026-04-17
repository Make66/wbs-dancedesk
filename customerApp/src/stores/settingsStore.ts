import { create } from "zustand";

// ── Types (spiegeln server/src/schemas/settings.ts) ──────────────────────────

type BasicConfig = {
  domain?: string;
  federalState?: string;
  termsUri?: string;
  privacyUri?: string;
  cancellationUri?: string;
  cancellationSampleUri?: string;
};

type CalendarConfig = {
  startHour: number;
  endHour: number;
  slotHeight: number;
  minutesPerSlot: number;
};

type FormField = {
  name: string;
};

export type Holiday = {
  start: { dateTime: string };
  end: { dateTime: string };
  title: string;
};

type Holidays = {
  federal?: Holiday[];
  school?: Record<string, Holiday[]>;
};

type Rebate = {
  title: string;
  tn1Percent?: number;
  tn1Value?: number;
  tn2Percent?: number;
  tn2Value?: number;
  category?: string;
};

type RegistrationConfig = {
  titleCol1?: string;
  titleCol2?: string;
  delTime?: number;
  checkSeats?: boolean;
  waitingList?: boolean;
  displayPastNumber?: number;
  displayNumberOccurrences?: number;
};

type Term = {
  title: string;
  text?: string;
};

type VoucherConfig = {
  description: string;
  vouchers?: Array<{
    name: string;
    value?: number;
    acceptForClub: boolean;
    acceptForCourse: boolean;
  }>;
};

export type Settings = {
  basic: BasicConfig;
  calendar: CalendarConfig;
  contracts: string[];
  formFields?: FormField[];
  holidays?: Holidays;
  rebates?: Rebate[];
  registration: RegistrationConfig;
  terms?: Term[];
  voucher?: VoucherConfig;
  other?: Record<string, unknown>;
};

// ── Defaults (entsprechen den Server-Defaults) ────────────────────────────────

export const DEFAULT_SETTINGS: Settings = {
  basic: {},
  calendar: {
    startHour: 10,
    endHour: 20,
    slotHeight: 20,
    minutesPerSlot: 15,
  },
  contracts: [],
  registration: {},
};

// ── Store ─────────────────────────────────────────────────────────────────────

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
      settings: { ...state.settings, ...settings },
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
  getEndSlot: () =>
    get().settings.calendar.endHour * (60 / get().settings.calendar.minutesPerSlot),
  getVisibleSlotCount: () => {
    const { startHour, endHour, minutesPerSlot } = get().settings.calendar;
    return (endHour - startHour) * (60 / minutesPerSlot);
  },
}));
