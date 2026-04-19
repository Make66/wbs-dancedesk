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
});

export const contractConfigSchema = z.array(z.string().min(1)).min(1).default([]);

export const formFieldConfigSchema = z.array(z.object({
  field: z.string().min(1),
  display: z.boolean().default(true),
  default: z.string().optional()
})).optional();

export const schoolHolidaysSchema = z.record(z.string(), z.array(z.object({
  start: z.object({
    dateTime: z.string(),
  }),
  end: z.object({
    dateTime: z.string(),
  }),
  title: z.string(),
}))).optional();

export const holidaysSchema = z.object({
  federal: z.array(z.unknown()).optional(),
  school: schoolHolidaysSchema,
}).optional();

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

export const otherConfigSchema = z.object({
  apiKey: z.string().optional(),
  signInKey: z.string().optional(),
  signInKeyUrl: z.url().optional(),
}).optional();

export const settingsSchema = z.object({
  basic:        basicConfigSchema,
  calendar:     calendarConfigSchema,
  contracts:    contractConfigSchema,
  formFields:   formFieldConfigSchema,
  holidays:     holidaysSchema,
  rebates:      rebateConfigSchema,
  registration: registrationConfigSchema,
  terms:        termsConfigSchema,
  voucher:      voucherConfigSchema,
  other:        otherConfigSchema,

  id: z.string().uuid(),
  tenantId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
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
export type Holidays = z.infer<typeof holidaysSchema>;
export type BasicConfig = z.infer<typeof basicConfigSchema>;
export type CalendarConfig = z.infer<typeof calendarConfigSchema>;
export type ContractConfig = z.infer<typeof contractConfigSchema>;
export type FormFieldConfig = z.infer<typeof formFieldConfigSchema>;
export type RebateConfig = z.infer<typeof rebateConfigSchema>;
export type RegistrationConfig = z.infer<typeof registrationConfigSchema>;
export type TermsConfig = z.infer<typeof termsConfigSchema>;
export type VoucherConfig = z.infer<typeof voucherConfigSchema>;
export type FederalState = z.infer<typeof federalStateSchema>;
export type SchoolHolidays = z.infer<typeof schoolHolidaysSchema>;
