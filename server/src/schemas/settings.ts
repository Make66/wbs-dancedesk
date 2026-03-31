import { z } from 'zod/v4';

export const registrationSettingsSchema = z.object({
  titleCol1:  z.string().optional(),
  titleCol2:  z.string().optional(),
  delTime:    z.number().optional(),
  checkSeats: z.boolean().optional(),
  waitlist:   z.boolean().optional(),
});

export const settingsSchema = z.object({
  colTitles:           z.record(z.string(), z.unknown()).optional(),
  holidays:            z.record(z.string(), z.unknown()).optional(),
  rebates:             z.record(z.string(), z.unknown()).optional(),
  voucher:             z.record(z.string(), z.unknown()).optional(),
  calendarPast:        z.boolean().optional(),
  calendarOccurrences: z.number().optional(),
  calendarLength:      z.number().optional(),
  formFields:          z.record(z.string(), z.unknown()).optional(),
  domain:              z.string().optional(),
  legalResources:      z.string().optional(),
  contracts:           z.record(z.string(), z.unknown()).optional(),
  registration:        registrationSettingsSchema.optional(),

  id:       z.uuid(),
  tenantId: z.uuid(),
});

export type Settings = z.infer<typeof settingsSchema>;
