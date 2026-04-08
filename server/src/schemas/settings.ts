import { z } from 'zod/v4';

export const registrationSettingsSchema = z.object({
  titleCol1:  z.string(),
  titleCol2:  z.string(),
  delTime:    z.number(),
  checkSeats: z.boolean(),
  waitingList:   z.boolean(),
});

registrationSettingsSchema.partial({
  titleCol1: true,
  titleCol2: true,
  delTime: true,
  checkSeats: true,
  waitingList: true
});

export const calendarConfigSchema = z.object({
  startHour: z.number().min(0).max(23).default(10),
  endHour: z.number().min(1).max(24).default(20),
  slotHeight: z.number().min(1).default(20),
  minutesPerSlot: z.number().min(1).default(15)
});

export const settingsSchema = z.object({
  colTitles:           z.record(z.string(), z.unknown()).optional,
  holidays:            z.array(z.unknown()).optional(),
  schoolHolidays:      z.record(z.string(), z.array(z.unknown())).optional(),
  rebates:             z.record(z.string(), z.unknown()).optional(),
  voucher:             z.record(z.string(), z.unknown()).optional(),
  calendarPast:        z.boolean().optional(),
  calendarOccurrences: z.number().optional(),
  calendarLength:      z.number().optional(),
  formFields:          z.record(z.string(), z.unknown()).optional(),
  domain:              z.string().optional(),
  federalState:        z.string().optional(),
  legalResources:      z.string().optional(),
  contracts:           z.array(z.string()).default([]),
  registration:        registrationSettingsSchema,
  calendarConfig: calendarConfigSchema
});

export type Settings = z.infer<typeof settingsSchema>;
