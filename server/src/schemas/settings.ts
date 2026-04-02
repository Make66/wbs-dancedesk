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
  contracts:           z.record(z.string(), z.unknown()).optional(),
  registration:        registrationSettingsSchema,
});

export type Settings = z.infer<typeof settingsSchema>;
