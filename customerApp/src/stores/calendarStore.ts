import { create } from "zustand";
import { addDays, addMonths, addWeeks, startOfToday } from "date-fns";
import type {
  CalendarConfig,
  CalendarEvent,
  CalendarEventResizeEndPayload,
  CalendarView,
  DraggedEventState,
  ResizingEventState,
} from "../types/calendar-types";
import { DEFAULT_CALENDAR_CONFIG } from "../lib/constants/calendar-constants";

type CalendarStore = {
  currentView: CalendarView;
  currentDate: Date;
  config: CalendarConfig;

  selectedEventId: string | null;
  activeDragEventId: string | null;
  resizingEvent: ResizingEventState | null;

  setCurrentView: (view: CalendarView) => void;
  setCurrentDate: (date: Date) => void;
  goToPrevious: () => void;
  goToNext: () => void;
  goToToday: () => void;

  selectEvent: (eventId: string) => void;
  setActiveDragEventId: (eventId: string | null) => void;

  draggedEvent: DraggedEventState | null;

  startDrag: (event: CalendarEvent) => void;
  updateDrag: (start: Date, end: Date) => void;
  endDrag: () => {
    eventId: string;
    originalStart: Date;
    originalEnd: Date;
    start: Date;
    end: Date;
  } | null;

  startResize: (event: CalendarEvent) => void;
  updateResize: (end: Date) => void;
  endResize: () => CalendarEventResizeEndPayload | null;

  setConfig: (config: Partial<CalendarConfig>) => void;
};

export const calendarStore = create<CalendarStore>((set, get) => ({
  currentView: "week",
  currentDate: startOfToday(),
  config: DEFAULT_CALENDAR_CONFIG,

  selectedEventId: null,
  activeDragEventId: null,
  resizingEvent: null,
  draggedEvent: null,

  setCurrentView: (view) => set({ currentView: view }),
  setCurrentDate: (date) => set({ currentDate: date }),

  goToPrevious: () =>
    set((state) => {
      if (state.currentView === "day") {
        return { currentDate: addDays(state.currentDate, -1) };
      }
      if (state.currentView === "month") {
        return { currentDate: addMonths(state.currentDate, -1) };
      }
      return { currentDate: addWeeks(state.currentDate, -1) };
    }),

  goToNext: () =>
    set((state) => {
      if (state.currentView === "day") {
        return { currentDate: addDays(state.currentDate, 1) };
      }
      if (state.currentView === "month") {
        return { currentDate: addMonths(state.currentDate, 1) };
      }
      return { currentDate: addWeeks(state.currentDate, 1) };
    }),

  goToToday: () => set({ currentDate: startOfToday() }),

  selectEvent: (eventId) => set({ selectedEventId: eventId }),
  setActiveDragEventId: (eventId) => set({ activeDragEventId: eventId }),

  startDrag: (event) =>
    set({
      draggedEvent: {
        eventId: event.id,
        originalStart: event.start,
        originalEnd: event.end,
        currentStart: event.start,
        currentEnd: event.end,
      },
    }),

  updateDrag: (start, end) =>
    set((state) => {
      if (!state.draggedEvent) return state;
      return {
        draggedEvent: {
          ...state.draggedEvent,
          currentStart: start,
          currentEnd: end,
        },
      };
    }),

  endDrag: () => {
    const draggedEvent = get().draggedEvent;
    if (!draggedEvent) return null;

    const payload = {
      eventId: draggedEvent.eventId,
      originalStart: draggedEvent.originalStart,
      originalEnd: draggedEvent.originalEnd,
      start: draggedEvent.currentStart,
      end: draggedEvent.currentEnd,
    };

    set({ draggedEvent: null });
    return payload;
  },

  startResize: (event) =>
    set({
      selectedEventId: event.id,
      resizingEvent: {
        eventId: event.id,
        originalStart: event.start,
        originalEnd: event.end,
        currentStart: event.start,
        currentEnd: event.end,
      },
    }),

  updateResize: (end) =>
    set((state) => {
      if (!state.resizingEvent) return state;
      return {
        resizingEvent: {
          ...state.resizingEvent,
          currentEnd: end,
        },
      };
    }),

  endResize: () => {
    const resizingEvent = get().resizingEvent;
    if (!resizingEvent) return null;

    const payload: CalendarEventResizeEndPayload = {
      eventId: resizingEvent.eventId,
      originalStart: resizingEvent.originalStart,
      originalEnd: resizingEvent.originalEnd,
      start: resizingEvent.currentStart,
      end: resizingEvent.currentEnd,
    };

    set({ resizingEvent: null });
    return payload;
  },

  setConfig: (config) =>
    set((state) => ({
      config: {
        ...state.config,
        ...config,
      },
    })),
}));
