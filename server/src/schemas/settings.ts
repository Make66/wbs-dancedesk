import { z } from 'zod/v4';

export const basicConfigSchema = z.object({
  domain: z.string().optional(),
  federalState: z.string().optional(),
  termsUri: z.string().optional(),
  privacyUri: z.string().optional(),
  cancellationUri: z.string().optional(),
  cancellationSampleUri: z.string().optional(),
});

export const calendarConfigSchema = z.object({
  startHour: z.number().min(0).max(23).default(10),
  endHour: z.number().min(1).max(24).default(20),
  slotHeight: z.number().min(1).default(20),
  minutesPerSlot: z.number().min(1).default(15),
  federalHolidays: z.array(z.unknown()).optional(),
  schoolHolidays: z.record(z.string(), z.array(z.unknown())).optional(),
});

export const formFieldSchema = z.object({
  name: z.string().min(1),
});

export const registrationConfigSchema = z.object({
  titleCol1:    z.string().optional(),
  titleCol2:    z.string().optional(),
  delTime:      z.number().optional(),
  checkSeats:   z.boolean().optional(),
  waitingList:  z.boolean().optional(),
  displayPastNumber: z.number().optional(),
  displayNumberOccurrences: z.number().optional(),
});

export const settingsSchema = z.object({
  basic:        basicConfigSchema,
  calendar:     calendarConfigSchema,
  contracts:    z.array(z.string()).default([]),
  formFields:   formFieldSchema,
  rebates:      z.record(z.string(), z.unknown()).optional(),
  registration: registrationConfigSchema,
  voucher:      z.record(z.string(), z.unknown()).optional(),
  other:        z.record(z.string(), z.unknown()).optional(),
});

export const federalStateSchema = z.enum([
  'BW', // Baden-Württemberg
  'BY', // Bayern
  'BE', // Berlin
  'BB', // Brandenburg
  'HB', // Bremen
  'HH', // Hamburg
  'HE', // Hessen
  'MV', // Mecklenburg-Vorpommern
  'NI', // Niedersachsen
  'NW', // Nordrhein-Westfalen
  'RP', // Rheinland-Pfalz
  'SL', // Saarland
  'SN', // Sachsen
  'ST', // Sachsen-Anhalt
  'SH', // Schleswig-Holstein
  'TH'  // Thüringen
]);

export type Settings = z.infer<typeof settingsSchema>;
