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
  colTitles:           z.record(z.string(), z.unknown()),
  holidays:            z.array(z.unknown()),
  schoolHolidays:      z.record(z.string(), z.array(z.unknown())),
  rebates:             z.record(z.string(), z.unknown()),
  voucher:             z.record(z.string(), z.unknown()),
  calendarPast:        z.boolean(),
  calendarOccurrences: z.number(),
  calendarLength:      z.number(),
  formFields:          z.record(z.string(), z.unknown()),
  domain:              z.string(),
  federalState:        z.string(),
  legalResources:      z.string(),
  contracts:           z.record(z.string(), z.unknown()),
  registration:        registrationSettingsSchema,

  id:       z.uuid('Id given is not a valid UUID'),
  tenantId: z.uuid('Id given is not a valid UUID'),
});

settingsSchema.partial({
  colTitles: true,
  holidays: true,
  schoolHolidays: true,
  rebates: true,
  voucher: true,
  calendarPast: true,
  calendarOccurrences: true,
  calendarLength: true,
  formFields: true,
  domain: true,
  federalState: true,
  legalResources: true,
  contracts: true,
  registration: true
});

export type Settings = z.infer<typeof settingsSchema>;
