import { title } from 'process';
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

export const contractSchema = z.array(z.string().min(1)).min(1).default([]);

export const formFieldSchema = z.array(z.object({
  field: z.string().min(1),
  display: z.boolean().default(true),
  default: z.string().optional()
})).optional();

export const rebateConfigSchema = z.array(z.object({
  title: z.string().min(1),
  tn1Percent: z.number().min(0).max(100).optional(),
  tn1Value: z.number().min(0).max(100).optional(),
  tn2Percent: z.number().min(0).max(100).optional(),
  tn2Value: z.number().min(0).max(100).optional(),
  category: z.string().optional(),
})).optional();

export const registrationConfigSchema = z.object({
  titleCol1:    z.string().optional(),
  titleCol2:    z.string().optional(),
  delTime:      z.number().optional(),
  checkSeats:   z.boolean().optional(),
  waitingList:  z.boolean().optional(),
  displayPastNumber: z.number().optional(),
  displayNumberOccurrences: z.number().optional(),
});

export const termsConfigSchema = z.array(z.object({
  title: z.string().min(1),
  text: z.string().min(1).optional(),
})).optional();

export const voucherConfigSchema = z.object({
  description: z.string().min(1),
  vouchers: z.array(z.object({
    name: z.string().min(1),
    value: z.number().min(0).optional(),
    acceptForClub: z.boolean().default(false),
    acceptForCourse: z.boolean().default(false),
  })).optional(),
});

export const settingsSchema = z.object({
  id:           z.string().uuid(),
  tenantId:     z.string(),
  createdAt:    z.coerce.date(),
  updatedAt:    z.coerce.date(),
  basic:        basicConfigSchema,
  calendar:     calendarConfigSchema,
  contracts:    contractSchema,
  formFields:   formFieldSchema,
  rebates:      rebateConfigSchema,
  registration: registrationConfigSchema,
  terms:        termsConfigSchema,
  voucher:      voucherConfigSchema,
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
