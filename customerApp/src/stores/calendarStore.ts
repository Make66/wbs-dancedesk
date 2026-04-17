import { create } from "zustand";
import { addDays, addMonths, addWeeks, startOfToday } from "date-fns";
import type {
  CalendarItem,
  CalendarItemDragEndPayload,
  CalendarItemResizeEndPayload,
  CalendarView,
  DraggedItemState,
  ResizingItemState,
} from "../types/calendar-types";

type CalendarStore = {
  currentView: CalendarView;
  currentDate: Date;

  selectedEventId: string | null;
  activeDragEventId: string | null;
  resizingEvent: ResizingItemState | null;
  isEventModalOpen: boolean;
  isEditMode: boolean;
  setEditMode: (value: boolean) => void;
  toggleEditMode: () => void;

  setCurrentView: (view: CalendarView) => void;
  setCurrentDate: (date: Date) => void;
  goToPrevious: () => void;
  goToNext: () => void;
  goToToday: () => void;

  selectEvent: (eventId: string | null) => void;
  openEventModal: (eventId?: string) => void;
  closeEventModal: () => void;
  setActiveDragEventId: (eventId: string | null) => void;

  draggedEvent: DraggedItemState | null;

  startDrag: (item: CalendarItem, pointerOffsetY: number) => void;
  updateDrag: (start: Date, end: Date) => void;
  endDrag: () => CalendarItemDragEndPayload | null;

  startResize: (item: CalendarItem) => void;
  updateResize: (end: Date) => void;
  endResize: () => CalendarItemResizeEndPayload | null;

};

export const calendarStore = create<CalendarStore>((set, get) => ({
  currentView: "week",
  currentDate: startOfToday(),

  selectedEventId: null,
  activeDragEventId: null,
  resizingEvent: null,
  draggedEvent: null,
  isEventModalOpen: false,
  isEditMode: false,

  setCurrentView: (view) => set({ currentView: view }),
  setCurrentDate: (date) => set({ currentDate: date }),
  setEditMode: (value) => set({ isEditMode: value }),
  toggleEditMode: () => set((state) => ({ isEditMode: !state.isEditMode })),

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

  openEventModal: (eventId) =>
    set({
      isEventModalOpen: true,
      selectedEventId: eventId ?? null,
    }),

  closeEventModal: () =>
    set({
      isEventModalOpen: false,
      selectedEventId: null,
    }),

  setActiveDragEventId: (eventId) => set({ activeDragEventId: eventId }),

  startDrag: (item, pointerOffsetY) =>
    set({
      draggedEvent: {
        itemId: item.id,
        itemKind: item.kind,
        originalStart: item.start,
        originalEnd: item.end,
        currentStart: item.start,
        currentEnd: item.end,
        pointerOffsetY,
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

    const payload: CalendarItemDragEndPayload = {
      itemId: draggedEvent.itemId,
      itemKind: draggedEvent.itemKind,
      originalStart: draggedEvent.originalStart,
      originalEnd: draggedEvent.originalEnd,
      start: draggedEvent.currentStart,
      end: draggedEvent.currentEnd,
    };

    set({ draggedEvent: null });
    return payload;
  },

  startResize: (item) =>
    set({
      selectedEventId: item.id,
      resizingEvent: {
        itemId: item.id,
        itemKind: item.kind,
        originalStart: item.start,
        originalEnd: item.end,
        currentStart: item.start,
        currentEnd: item.end,
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

    const payload: CalendarItemResizeEndPayload = {
      itemId: resizingEvent.itemId,
      itemKind: resizingEvent.itemKind,
      originalStart: resizingEvent.originalStart,
      originalEnd: resizingEvent.originalEnd,
      start: resizingEvent.currentStart,
      end: resizingEvent.currentEnd,
    };

    set({ resizingEvent: null });
    return payload;
  },

}));
