import type { CalendarConfig } from "../../types/calendar-types";

export const DEFAULT_CALENDAR_CONFIG: CalendarConfig = {
  startHour: 8,
  endHour: 19,
  slotHeight: 20,
  minutesPerSlot: 15,
};

export function getSlotsPerHour(config: CalendarConfig) {
  return 60 / config.minutesPerSlot;
}

export function getStartSlot(config: CalendarConfig) {
  return config.startHour * getSlotsPerHour(config);
}

export function getEndSlot(config: CalendarConfig) {
  return config.endHour * getSlotsPerHour(config);
}

export function getVisibleSlotCount(config: CalendarConfig) {
  return getEndSlot(config) - getStartSlot(config);
}
