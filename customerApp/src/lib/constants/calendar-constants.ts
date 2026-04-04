export const START_HOUR = 8;
export const END_HOUR = 17;

export const SLOT_HEIGHT = 20;

export const MINUTES_PER_SLOT = 15;
export const SLOTS_PER_HOUR = 60 / MINUTES_PER_SLOT;

export const START_SLOT = START_HOUR * SLOTS_PER_HOUR;
export const END_SLOT = END_HOUR * SLOTS_PER_HOUR;
export const VISIBLE_SLOT_COUNT = END_SLOT - START_SLOT;
