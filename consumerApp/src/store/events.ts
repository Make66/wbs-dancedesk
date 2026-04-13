import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type Event = {
  id: string;
  title: string;
  [key: string]: unknown;
};

type EventsState = {
  events: Event[];
  setEvents: (events: Event[]) => void;
  clearEvents: () => void;
};

export const useEventsStore = create<EventsState>()(
  devtools(
    (set) => ({
      events: [],
      setEvents: (events) => set({ events }),
      clearEvents: () => set({ events: [] }),
    }),
    { name: 'eventsStore' }
  )
);
