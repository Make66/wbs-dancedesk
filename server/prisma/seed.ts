import { PrismaClient } from '../generated/prisma/client.ts';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcrypt';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// --- JSON types ---

interface CitiTermin {
  datum_ts: number;
  datum: string;
  is_start: number;
}

interface CitiKurs {
  id: number;
  kursbezeichnung: string;
  is_visible: number;
  standort: string;
  startdatum: string;
  anfangszeit: string;
  endezeit: string;
  frequenz: number;
  kalenderignorieren: number;
  seats_cur: number;
  termine: CitiTermin[];
  categoryId: string;
  isActive:boolean;
}

interface CitiZielseite {
  id: number;
  headline: string;
  is_visible: string | number;
  sequence: string | number;
  kurse: CitiKurs[];
}

interface CitiZielgruppe {
  headline: string;
  is_visible: number;
  sequence: number;
  zielseiten: CitiZielseite[];
}

interface CitiLocation {
  id: number;
  title: string;
  is_visible: number;
  sequence: number;
  zielgruppen: CitiZielgruppe[];
}

// --- helpers ---

function createRotator(arr: string[]) {
  let i = 0;
  return {
    next: () => {
      const val = arr[i];
      i = (i + 1) % arr.length;
      return val;
    },
    reset: () => { i = 0; }
  };
}
const colors = ['#DB2777', '#86198F', '#333333', '#800000', '#D0872E', '#1A7595', '#1F7A55', '#9F0712', '#9f6767',  '#E7180B', '#16168e', '#98980c', '#5e8b83' ];
const rotator = createRotator(colors);

function toBool(val: string | number): boolean {
  return Number(val) === 1;
}

function parseDate(datumDDMMYYYY: string, time: string): Date {
  if (!datumDDMMYYYY) return new Date();
  const [day, month, year] = datumDDMMYYYY.split('.');
  if (!day || !month || !year) return new Date();
  const [rawH, rawM] = time?.split(':') ?? [];
  const hours   = Number(rawH);
  const minutes = Number(rawM);
  const h = Number.isFinite(hours)   ? hours   : 0;
  const m = Number.isFinite(minutes) ? minutes : 0;
  // use numeric constructor to avoid locale/timezone parsing issues
  return new Date(Number(year), Number(month) - 1, Number(day), h, m);
}

// --- school holidays (approximate) for all 16 German Bundesländer, 2026-2028 ---
// Easter: 2026-04-05  2027-03-28  2028-04-16
// Sources: KMK framework + state education ministries (approximate)

type HolidayEntry = { start: { dateTime: string }; end?: { dateTime: string }; title: string };
type SchoolHolidays = Record<string, HolidayEntry[]>;

const schoolHolidays: SchoolHolidays = {
  BW: [
    // 2026
    { start: { dateTime: '2026-01-01' }, end: { dateTime: '2026-01-06' }, title: 'Weihnachtsferien' },
    { start: { dateTime: '2026-04-09' }, end: { dateTime: '2026-04-17' }, title: 'Osterferien' },
    { start: { dateTime: '2026-05-26' }, end: { dateTime: '2026-06-05' }, title: 'Pfingstferien' },
    { start: { dateTime: '2026-07-30' }, end: { dateTime: '2026-09-12' }, title: 'Sommerferien' },
    { start: { dateTime: '2026-10-26' }, end: { dateTime: '2026-10-30' }, title: 'Herbstferien' },
    { start: { dateTime: '2026-12-23' }, end: { dateTime: '2027-01-08' }, title: 'Weihnachtsferien' },
    // 2027
    { start: { dateTime: '2027-04-01' }, end: { dateTime: '2027-04-09' }, title: 'Osterferien' },
    { start: { dateTime: '2027-05-18' }, end: { dateTime: '2027-05-28' }, title: 'Pfingstferien' },
    { start: { dateTime: '2027-07-29' }, end: { dateTime: '2027-09-11' }, title: 'Sommerferien' },
    { start: { dateTime: '2027-10-25' }, end: { dateTime: '2027-10-29' }, title: 'Herbstferien' },
    { start: { dateTime: '2027-12-22' }, end: { dateTime: '2028-01-06' }, title: 'Weihnachtsferien' },
    // 2028
    { start: { dateTime: '2028-04-18' }, end: { dateTime: '2028-04-29' }, title: 'Osterferien' },
    { start: { dateTime: '2028-06-06' }, end: { dateTime: '2028-06-16' }, title: 'Pfingstferien' },
    { start: { dateTime: '2028-07-26' }, end: { dateTime: '2028-09-07' }, title: 'Sommerferien' },
    { start: { dateTime: '2028-10-28' }, end: { dateTime: '2028-11-01' }, title: 'Herbstferien' },
    { start: { dateTime: '2028-12-22' }, end: { dateTime: '2029-01-05' }, title: 'Weihnachtsferien' },
  ],
  BY: [
    // 2026
    { start: { dateTime: '2026-01-01' }, end: { dateTime: '2026-01-05' }, title: 'Weihnachtsferien' },
    { start: { dateTime: '2026-02-23' }, end: { dateTime: '2026-02-27' }, title: 'Winterferien' },
    { start: { dateTime: '2026-04-06' }, end: { dateTime: '2026-04-17' }, title: 'Osterferien' },
    { start: { dateTime: '2026-05-26' }, end: { dateTime: '2026-06-05' }, title: 'Pfingstferien' },
    { start: { dateTime: '2026-07-30' }, end: { dateTime: '2026-09-14' }, title: 'Sommerferien' },
    { start: { dateTime: '2026-10-31' }, end: { dateTime: '2026-11-07' }, title: 'Herbstferien' },
    { start: { dateTime: '2026-12-24' }, end: { dateTime: '2027-01-05' }, title: 'Weihnachtsferien' },
    // 2027
    { start: { dateTime: '2027-02-22' }, end: { dateTime: '2027-02-26' }, title: 'Winterferien' },
    { start: { dateTime: '2027-03-29' }, end: { dateTime: '2027-04-09' }, title: 'Osterferien' },
    { start: { dateTime: '2027-05-18' }, end: { dateTime: '2027-05-28' }, title: 'Pfingstferien' },
    { start: { dateTime: '2027-07-29' }, end: { dateTime: '2027-09-13' }, title: 'Sommerferien' },
    { start: { dateTime: '2027-10-30' }, end: { dateTime: '2027-11-05' }, title: 'Herbstferien' },
    { start: { dateTime: '2027-12-24' }, end: { dateTime: '2028-01-05' }, title: 'Weihnachtsferien' },
    // 2028
    { start: { dateTime: '2028-02-19' }, end: { dateTime: '2028-02-23' }, title: 'Winterferien' },
    { start: { dateTime: '2028-04-15' }, end: { dateTime: '2028-04-26' }, title: 'Osterferien' },
    { start: { dateTime: '2028-06-05' }, end: { dateTime: '2028-06-16' }, title: 'Pfingstferien' },
    { start: { dateTime: '2028-07-26' }, end: { dateTime: '2028-09-09' }, title: 'Sommerferien' },
    { start: { dateTime: '2028-10-28' }, end: { dateTime: '2028-11-03' }, title: 'Herbstferien' },
    { start: { dateTime: '2028-12-22' }, end: { dateTime: '2029-01-04' }, title: 'Weihnachtsferien' },
  ],
  BE: [
    // 2026
    { start: { dateTime: '2026-01-01' }, end: { dateTime: '2026-01-03' }, title: 'Weihnachtsferien' },
    { start: { dateTime: '2026-02-02' }, end: { dateTime: '2026-02-07' }, title: 'Winterferien' },
    { start: { dateTime: '2026-03-30' }, end: { dateTime: '2026-04-11' }, title: 'Osterferien' },
    { start: { dateTime: '2026-06-25' }, end: { dateTime: '2026-08-07' }, title: 'Sommerferien' },
    { start: { dateTime: '2026-10-12' }, end: { dateTime: '2026-10-24' }, title: 'Herbstferien' },
    { start: { dateTime: '2026-12-22' }, end: { dateTime: '2027-01-03' }, title: 'Weihnachtsferien' },
    // 2027
    { start: { dateTime: '2027-02-01' }, end: { dateTime: '2027-02-06' }, title: 'Winterferien' },
    { start: { dateTime: '2027-03-22' }, end: { dateTime: '2027-04-02' }, title: 'Osterferien' },
    { start: { dateTime: '2027-06-24' }, end: { dateTime: '2027-08-06' }, title: 'Sommerferien' },
    { start: { dateTime: '2027-10-11' }, end: { dateTime: '2027-10-23' }, title: 'Herbstferien' },
    { start: { dateTime: '2027-12-21' }, end: { dateTime: '2028-01-03' }, title: 'Weihnachtsferien' },
    // 2028
    { start: { dateTime: '2028-01-31' }, end: { dateTime: '2028-02-05' }, title: 'Winterferien' },
    { start: { dateTime: '2028-04-10' }, end: { dateTime: '2028-04-22' }, title: 'Osterferien' },
    { start: { dateTime: '2028-06-27' }, end: { dateTime: '2028-08-09' }, title: 'Sommerferien' },
    { start: { dateTime: '2028-10-13' }, end: { dateTime: '2028-10-25' }, title: 'Herbstferien' },
    { start: { dateTime: '2028-12-21' }, end: { dateTime: '2029-01-02' }, title: 'Weihnachtsferien' },
  ],
  BB: [
    // 2026
    { start: { dateTime: '2026-01-01' }, end: { dateTime: '2026-01-03' }, title: 'Weihnachtsferien' },
    { start: { dateTime: '2026-02-02' }, end: { dateTime: '2026-02-07' }, title: 'Winterferien' },
    { start: { dateTime: '2026-03-30' }, end: { dateTime: '2026-04-11' }, title: 'Osterferien' },
    { start: { dateTime: '2026-06-25' }, end: { dateTime: '2026-08-07' }, title: 'Sommerferien' },
    { start: { dateTime: '2026-10-12' }, end: { dateTime: '2026-10-23' }, title: 'Herbstferien' },
    { start: { dateTime: '2026-12-22' }, end: { dateTime: '2027-01-02' }, title: 'Weihnachtsferien' },
    // 2027
    { start: { dateTime: '2027-02-01' }, end: { dateTime: '2027-02-06' }, title: 'Winterferien' },
    { start: { dateTime: '2027-03-22' }, end: { dateTime: '2027-04-02' }, title: 'Osterferien' },
    { start: { dateTime: '2027-06-24' }, end: { dateTime: '2027-08-06' }, title: 'Sommerferien' },
    { start: { dateTime: '2027-10-11' }, end: { dateTime: '2027-10-22' }, title: 'Herbstferien' },
    { start: { dateTime: '2027-12-21' }, end: { dateTime: '2028-01-02' }, title: 'Weihnachtsferien' },
    // 2028
    { start: { dateTime: '2028-01-31' }, end: { dateTime: '2028-02-05' }, title: 'Winterferien' },
    { start: { dateTime: '2028-04-10' }, end: { dateTime: '2028-04-22' }, title: 'Osterferien' },
    { start: { dateTime: '2028-06-27' }, end: { dateTime: '2028-08-09' }, title: 'Sommerferien' },
    { start: { dateTime: '2028-10-13' }, end: { dateTime: '2028-10-25' }, title: 'Herbstferien' },
    { start: { dateTime: '2028-12-21' }, end: { dateTime: '2029-01-02' }, title: 'Weihnachtsferien' },
  ],
  HB: [
    // 2026
    { start: { dateTime: '2026-01-01' }, end: { dateTime: '2026-01-05' }, title: 'Weihnachtsferien' },
    { start: { dateTime: '2026-03-30' }, end: { dateTime: '2026-04-10' }, title: 'Osterferien' },
    { start: { dateTime: '2026-06-25' }, end: { dateTime: '2026-08-05' }, title: 'Sommerferien' },
    { start: { dateTime: '2026-10-19' }, end: { dateTime: '2026-10-31' }, title: 'Herbstferien' },
    { start: { dateTime: '2026-12-21' }, end: { dateTime: '2027-01-04' }, title: 'Weihnachtsferien' },
    // 2027
    { start: { dateTime: '2027-03-22' }, end: { dateTime: '2027-04-01' }, title: 'Osterferien' },
    { start: { dateTime: '2027-06-24' }, end: { dateTime: '2027-08-04' }, title: 'Sommerferien' },
    { start: { dateTime: '2027-10-18' }, end: { dateTime: '2027-10-30' }, title: 'Herbstferien' },
    { start: { dateTime: '2027-12-20' }, end: { dateTime: '2028-01-03' }, title: 'Weihnachtsferien' },
    // 2028
    { start: { dateTime: '2028-04-10' }, end: { dateTime: '2028-04-21' }, title: 'Osterferien' },
    { start: { dateTime: '2028-06-27' }, end: { dateTime: '2028-08-07' }, title: 'Sommerferien' },
    { start: { dateTime: '2028-10-21' }, end: { dateTime: '2028-11-02' }, title: 'Herbstferien' },
    { start: { dateTime: '2028-12-20' }, end: { dateTime: '2029-01-03' }, title: 'Weihnachtsferien' },
  ],
  HH: [
    // 2026
    { start: { dateTime: '2026-01-01' }, end: { dateTime: '2026-01-03' }, title: 'Weihnachtsferien' },
    { start: { dateTime: '2026-03-02' }, end: { dateTime: '2026-03-06' }, title: 'Winterferien' },
    { start: { dateTime: '2026-03-30' }, end: { dateTime: '2026-04-11' }, title: 'Osterferien' },
    { start: { dateTime: '2026-06-18' }, end: { dateTime: '2026-07-29' }, title: 'Sommerferien' },
    { start: { dateTime: '2026-10-05' }, end: { dateTime: '2026-10-16' }, title: 'Herbstferien' },
    { start: { dateTime: '2026-12-22' }, end: { dateTime: '2027-01-04' }, title: 'Weihnachtsferien' },
    // 2027
    { start: { dateTime: '2027-03-01' }, end: { dateTime: '2027-03-05' }, title: 'Winterferien' },
    { start: { dateTime: '2027-03-22' }, end: { dateTime: '2027-04-01' }, title: 'Osterferien' },
    { start: { dateTime: '2027-06-17' }, end: { dateTime: '2027-07-28' }, title: 'Sommerferien' },
    { start: { dateTime: '2027-10-04' }, end: { dateTime: '2027-10-15' }, title: 'Herbstferien' },
    { start: { dateTime: '2027-12-21' }, end: { dateTime: '2028-01-03' }, title: 'Weihnachtsferien' },
    // 2028
    { start: { dateTime: '2028-02-28' }, end: { dateTime: '2028-03-03' }, title: 'Winterferien' },
    { start: { dateTime: '2028-04-10' }, end: { dateTime: '2028-04-21' }, title: 'Osterferien' },
    { start: { dateTime: '2028-06-20' }, end: { dateTime: '2028-07-31' }, title: 'Sommerferien' },
    { start: { dateTime: '2028-10-07' }, end: { dateTime: '2028-10-18' }, title: 'Herbstferien' },
    { start: { dateTime: '2028-12-20' }, end: { dateTime: '2029-01-03' }, title: 'Weihnachtsferien' },
  ],
  HE: [
    // 2026
    { start: { dateTime: '2026-01-01' }, end: { dateTime: '2026-01-06' }, title: 'Weihnachtsferien' },
    { start: { dateTime: '2026-04-06' }, end: { dateTime: '2026-04-18' }, title: 'Osterferien' },
    { start: { dateTime: '2026-05-26' }, end: { dateTime: '2026-06-05' }, title: 'Pfingstferien' },
    { start: { dateTime: '2026-07-06' }, end: { dateTime: '2026-08-14' }, title: 'Sommerferien' },
    { start: { dateTime: '2026-10-05' }, end: { dateTime: '2026-10-17' }, title: 'Herbstferien' },
    { start: { dateTime: '2026-12-21' }, end: { dateTime: '2027-01-05' }, title: 'Weihnachtsferien' },
    // 2027
    { start: { dateTime: '2027-03-29' }, end: { dateTime: '2027-04-10' }, title: 'Osterferien' },
    { start: { dateTime: '2027-05-18' }, end: { dateTime: '2027-05-28' }, title: 'Pfingstferien' },
    { start: { dateTime: '2027-07-05' }, end: { dateTime: '2027-08-13' }, title: 'Sommerferien' },
    { start: { dateTime: '2027-10-04' }, end: { dateTime: '2027-10-16' }, title: 'Herbstferien' },
    { start: { dateTime: '2027-12-20' }, end: { dateTime: '2028-01-04' }, title: 'Weihnachtsferien' },
    // 2028
    { start: { dateTime: '2028-04-17' }, end: { dateTime: '2028-04-29' }, title: 'Osterferien' },
    { start: { dateTime: '2028-06-06' }, end: { dateTime: '2028-06-16' }, title: 'Pfingstferien' },
    { start: { dateTime: '2028-07-03' }, end: { dateTime: '2028-08-11' }, title: 'Sommerferien' },
    { start: { dateTime: '2028-10-07' }, end: { dateTime: '2028-10-19' }, title: 'Herbstferien' },
    { start: { dateTime: '2028-12-20' }, end: { dateTime: '2029-01-03' }, title: 'Weihnachtsferien' },
  ],
  MV: [
    // 2026
    { start: { dateTime: '2026-01-01' }, end: { dateTime: '2026-01-05' }, title: 'Weihnachtsferien' },
    { start: { dateTime: '2026-02-09' }, end: { dateTime: '2026-02-14' }, title: 'Winterferien' },
    { start: { dateTime: '2026-03-30' }, end: { dateTime: '2026-04-11' }, title: 'Osterferien' },
    { start: { dateTime: '2026-06-18' }, end: { dateTime: '2026-07-29' }, title: 'Sommerferien' },
    { start: { dateTime: '2026-10-05' }, end: { dateTime: '2026-10-17' }, title: 'Herbstferien' },
    { start: { dateTime: '2026-12-21' }, end: { dateTime: '2027-01-03' }, title: 'Weihnachtsferien' },
    // 2027
    { start: { dateTime: '2027-02-08' }, end: { dateTime: '2027-02-13' }, title: 'Winterferien' },
    { start: { dateTime: '2027-03-22' }, end: { dateTime: '2027-04-02' }, title: 'Osterferien' },
    { start: { dateTime: '2027-06-17' }, end: { dateTime: '2027-07-28' }, title: 'Sommerferien' },
    { start: { dateTime: '2027-10-04' }, end: { dateTime: '2027-10-16' }, title: 'Herbstferien' },
    { start: { dateTime: '2027-12-20' }, end: { dateTime: '2028-01-02' }, title: 'Weihnachtsferien' },
    // 2028
    { start: { dateTime: '2028-02-07' }, end: { dateTime: '2028-02-12' }, title: 'Winterferien' },
    { start: { dateTime: '2028-04-10' }, end: { dateTime: '2028-04-22' }, title: 'Osterferien' },
    { start: { dateTime: '2028-06-20' }, end: { dateTime: '2028-07-31' }, title: 'Sommerferien' },
    { start: { dateTime: '2028-10-07' }, end: { dateTime: '2028-10-19' }, title: 'Herbstferien' },
    { start: { dateTime: '2028-12-20' }, end: { dateTime: '2029-01-02' }, title: 'Weihnachtsferien' },
  ],
  NI: [
    // 2026
    { start: { dateTime: '2026-01-01' }, end: { dateTime: '2026-01-05' }, title: 'Weihnachtsferien' },
    { start: { dateTime: '2026-03-30' }, end: { dateTime: '2026-04-10' }, title: 'Osterferien' },
    { start: { dateTime: '2026-06-25' }, end: { dateTime: '2026-08-05' }, title: 'Sommerferien' },
    { start: { dateTime: '2026-10-12' }, end: { dateTime: '2026-10-24' }, title: 'Herbstferien' },
    { start: { dateTime: '2026-12-23' }, end: { dateTime: '2027-01-07' }, title: 'Weihnachtsferien' },
    // 2027
    { start: { dateTime: '2027-03-22' }, end: { dateTime: '2027-04-01' }, title: 'Osterferien' },
    { start: { dateTime: '2027-06-24' }, end: { dateTime: '2027-08-04' }, title: 'Sommerferien' },
    { start: { dateTime: '2027-10-11' }, end: { dateTime: '2027-10-23' }, title: 'Herbstferien' },
    { start: { dateTime: '2027-12-22' }, end: { dateTime: '2028-01-06' }, title: 'Weihnachtsferien' },
    // 2028
    { start: { dateTime: '2028-04-10' }, end: { dateTime: '2028-04-21' }, title: 'Osterferien' },
    { start: { dateTime: '2028-06-27' }, end: { dateTime: '2028-08-07' }, title: 'Sommerferien' },
    { start: { dateTime: '2028-10-14' }, end: { dateTime: '2028-10-26' }, title: 'Herbstferien' },
    { start: { dateTime: '2028-12-20' }, end: { dateTime: '2029-01-04' }, title: 'Weihnachtsferien' },
  ],
  NW: [
    // 2026
    { start: { dateTime: '2026-01-01' }, end: { dateTime: '2026-01-06' }, title: 'Weihnachtsferien' },
    { start: { dateTime: '2026-03-30' }, end: { dateTime: '2026-04-11' }, title: 'Osterferien' },
    { start: { dateTime: '2026-05-26' }, end: { dateTime: '2026-05-29' }, title: 'Pfingstferien' },
    { start: { dateTime: '2026-06-25' }, end: { dateTime: '2026-08-07' }, title: 'Sommerferien' },
    { start: { dateTime: '2026-10-05' }, end: { dateTime: '2026-10-17' }, title: 'Herbstferien' },
    { start: { dateTime: '2026-12-23' }, end: { dateTime: '2027-01-06' }, title: 'Weihnachtsferien' },
    // 2027
    { start: { dateTime: '2027-03-22' }, end: { dateTime: '2027-04-02' }, title: 'Osterferien' },
    { start: { dateTime: '2027-05-18' }, end: { dateTime: '2027-05-21' }, title: 'Pfingstferien' },
    { start: { dateTime: '2027-06-24' }, end: { dateTime: '2027-08-06' }, title: 'Sommerferien' },
    { start: { dateTime: '2027-10-04' }, end: { dateTime: '2027-10-16' }, title: 'Herbstferien' },
    { start: { dateTime: '2027-12-22' }, end: { dateTime: '2028-01-05' }, title: 'Weihnachtsferien' },
    // 2028
    { start: { dateTime: '2028-04-10' }, end: { dateTime: '2028-04-22' }, title: 'Osterferien' },
    { start: { dateTime: '2028-06-06' }, end: { dateTime: '2028-06-08' }, title: 'Pfingstferien' },
    { start: { dateTime: '2028-06-27' }, end: { dateTime: '2028-08-09' }, title: 'Sommerferien' },
    { start: { dateTime: '2028-10-07' }, end: { dateTime: '2028-10-19' }, title: 'Herbstferien' },
    { start: { dateTime: '2028-12-21' }, end: { dateTime: '2029-01-04' }, title: 'Weihnachtsferien' },
  ],
  RP: [
    // 2026
    { start: { dateTime: '2026-01-01' }, end: { dateTime: '2026-01-09' }, title: 'Weihnachtsferien' },
    { start: { dateTime: '2026-03-30' }, end: { dateTime: '2026-04-11' }, title: 'Osterferien' },
    { start: { dateTime: '2026-05-25' }, end: { dateTime: '2026-06-05' }, title: 'Pfingstferien' },
    { start: { dateTime: '2026-07-06' }, end: { dateTime: '2026-08-14' }, title: 'Sommerferien' },
    { start: { dateTime: '2026-10-12' }, end: { dateTime: '2026-10-24' }, title: 'Herbstferien' },
    { start: { dateTime: '2026-12-23' }, end: { dateTime: '2027-01-08' }, title: 'Weihnachtsferien' },
    // 2027
    { start: { dateTime: '2027-03-22' }, end: { dateTime: '2027-04-02' }, title: 'Osterferien' },
    { start: { dateTime: '2027-05-17' }, end: { dateTime: '2027-05-28' }, title: 'Pfingstferien' },
    { start: { dateTime: '2027-07-05' }, end: { dateTime: '2027-08-13' }, title: 'Sommerferien' },
    { start: { dateTime: '2027-10-11' }, end: { dateTime: '2027-10-23' }, title: 'Herbstferien' },
    { start: { dateTime: '2027-12-22' }, end: { dateTime: '2028-01-07' }, title: 'Weihnachtsferien' },
    // 2028
    { start: { dateTime: '2028-04-10' }, end: { dateTime: '2028-04-22' }, title: 'Osterferien' },
    { start: { dateTime: '2028-06-05' }, end: { dateTime: '2028-06-16' }, title: 'Pfingstferien' },
    { start: { dateTime: '2028-07-03' }, end: { dateTime: '2028-08-11' }, title: 'Sommerferien' },
    { start: { dateTime: '2028-10-14' }, end: { dateTime: '2028-10-26' }, title: 'Herbstferien' },
    { start: { dateTime: '2028-12-21' }, end: { dateTime: '2029-01-05' }, title: 'Weihnachtsferien' },
  ],
  SL: [
    // 2026
    { start: { dateTime: '2026-01-01' }, end: { dateTime: '2026-01-09' }, title: 'Weihnachtsferien' },
    { start: { dateTime: '2026-03-30' }, end: { dateTime: '2026-04-11' }, title: 'Osterferien' },
    { start: { dateTime: '2026-05-25' }, end: { dateTime: '2026-06-05' }, title: 'Pfingstferien' },
    { start: { dateTime: '2026-07-06' }, end: { dateTime: '2026-08-14' }, title: 'Sommerferien' },
    { start: { dateTime: '2026-10-12' }, end: { dateTime: '2026-10-24' }, title: 'Herbstferien' },
    { start: { dateTime: '2026-12-23' }, end: { dateTime: '2027-01-03' }, title: 'Weihnachtsferien' },
    // 2027
    { start: { dateTime: '2027-03-22' }, end: { dateTime: '2027-04-02' }, title: 'Osterferien' },
    { start: { dateTime: '2027-05-17' }, end: { dateTime: '2027-05-28' }, title: 'Pfingstferien' },
    { start: { dateTime: '2027-07-05' }, end: { dateTime: '2027-08-13' }, title: 'Sommerferien' },
    { start: { dateTime: '2027-10-11' }, end: { dateTime: '2027-10-23' }, title: 'Herbstferien' },
    { start: { dateTime: '2027-12-22' }, end: { dateTime: '2028-01-02' }, title: 'Weihnachtsferien' },
    // 2028
    { start: { dateTime: '2028-04-10' }, end: { dateTime: '2028-04-22' }, title: 'Osterferien' },
    { start: { dateTime: '2028-06-05' }, end: { dateTime: '2028-06-16' }, title: 'Pfingstferien' },
    { start: { dateTime: '2028-07-03' }, end: { dateTime: '2028-08-11' }, title: 'Sommerferien' },
    { start: { dateTime: '2028-10-14' }, end: { dateTime: '2028-10-26' }, title: 'Herbstferien' },
    { start: { dateTime: '2028-12-21' }, end: { dateTime: '2029-01-03' }, title: 'Weihnachtsferien' },
  ],
  SN: [
    // 2026
    { start: { dateTime: '2026-01-01' }, end: { dateTime: '2026-01-02' }, title: 'Weihnachtsferien' },
    { start: { dateTime: '2026-02-16' }, end: { dateTime: '2026-02-20' }, title: 'Winterferien' },
    { start: { dateTime: '2026-04-06' }, end: { dateTime: '2026-04-18' }, title: 'Osterferien' },
    { start: { dateTime: '2026-07-09' }, end: { dateTime: '2026-08-21' }, title: 'Sommerferien' },
    { start: { dateTime: '2026-10-05' }, end: { dateTime: '2026-10-17' }, title: 'Herbstferien' },
    { start: { dateTime: '2026-12-22' }, end: { dateTime: '2027-01-02' }, title: 'Weihnachtsferien' },
    // 2027
    { start: { dateTime: '2027-02-15' }, end: { dateTime: '2027-02-19' }, title: 'Winterferien' },
    { start: { dateTime: '2027-03-29' }, end: { dateTime: '2027-04-10' }, title: 'Osterferien' },
    { start: { dateTime: '2027-07-08' }, end: { dateTime: '2027-08-20' }, title: 'Sommerferien' },
    { start: { dateTime: '2027-10-04' }, end: { dateTime: '2027-10-16' }, title: 'Herbstferien' },
    { start: { dateTime: '2027-12-21' }, end: { dateTime: '2028-01-01' }, title: 'Weihnachtsferien' },
    // 2028
    { start: { dateTime: '2028-02-14' }, end: { dateTime: '2028-02-18' }, title: 'Winterferien' },
    { start: { dateTime: '2028-04-17' }, end: { dateTime: '2028-04-29' }, title: 'Osterferien' },
    { start: { dateTime: '2028-07-05' }, end: { dateTime: '2028-08-17' }, title: 'Sommerferien' },
    { start: { dateTime: '2028-10-07' }, end: { dateTime: '2028-10-19' }, title: 'Herbstferien' },
    { start: { dateTime: '2028-12-20' }, end: { dateTime: '2029-01-01' }, title: 'Weihnachtsferien' },
  ],
  ST: [
    // 2026
    { start: { dateTime: '2026-01-01' }, end: { dateTime: '2026-01-06' }, title: 'Weihnachtsferien' },
    { start: { dateTime: '2026-02-02' }, end: { dateTime: '2026-02-14' }, title: 'Winterferien' },
    { start: { dateTime: '2026-03-30' }, end: { dateTime: '2026-04-11' }, title: 'Osterferien' },
    { start: { dateTime: '2026-06-25' }, end: { dateTime: '2026-08-07' }, title: 'Sommerferien' },
    { start: { dateTime: '2026-10-12' }, end: { dateTime: '2026-10-23' }, title: 'Herbstferien' },
    { start: { dateTime: '2026-12-21' }, end: { dateTime: '2027-01-03' }, title: 'Weihnachtsferien' },
    // 2027
    { start: { dateTime: '2027-02-01' }, end: { dateTime: '2027-02-13' }, title: 'Winterferien' },
    { start: { dateTime: '2027-03-22' }, end: { dateTime: '2027-04-02' }, title: 'Osterferien' },
    { start: { dateTime: '2027-06-24' }, end: { dateTime: '2027-08-06' }, title: 'Sommerferien' },
    { start: { dateTime: '2027-10-11' }, end: { dateTime: '2027-10-22' }, title: 'Herbstferien' },
    { start: { dateTime: '2027-12-20' }, end: { dateTime: '2028-01-02' }, title: 'Weihnachtsferien' },
    // 2028
    { start: { dateTime: '2028-01-29' }, end: { dateTime: '2028-02-10' }, title: 'Winterferien' },
    { start: { dateTime: '2028-04-10' }, end: { dateTime: '2028-04-22' }, title: 'Osterferien' },
    { start: { dateTime: '2028-06-27' }, end: { dateTime: '2028-08-09' }, title: 'Sommerferien' },
    { start: { dateTime: '2028-10-14' }, end: { dateTime: '2028-10-25' }, title: 'Herbstferien' },
    { start: { dateTime: '2028-12-20' }, end: { dateTime: '2029-01-02' }, title: 'Weihnachtsferien' },
  ],
  SH: [
    // 2026
    { start: { dateTime: '2026-01-01' }, end: { dateTime: '2026-01-04' }, title: 'Weihnachtsferien' },
    { start: { dateTime: '2026-03-02' }, end: { dateTime: '2026-03-06' }, title: 'Winterferien' },
    { start: { dateTime: '2026-03-30' }, end: { dateTime: '2026-04-11' }, title: 'Osterferien' },
    { start: { dateTime: '2026-06-18' }, end: { dateTime: '2026-07-29' }, title: 'Sommerferien' },
    { start: { dateTime: '2026-10-12' }, end: { dateTime: '2026-10-24' }, title: 'Herbstferien' },
    { start: { dateTime: '2026-12-22' }, end: { dateTime: '2027-01-06' }, title: 'Weihnachtsferien' },
    // 2027
    { start: { dateTime: '2027-03-01' }, end: { dateTime: '2027-03-05' }, title: 'Winterferien' },
    { start: { dateTime: '2027-03-22' }, end: { dateTime: '2027-04-01' }, title: 'Osterferien' },
    { start: { dateTime: '2027-06-17' }, end: { dateTime: '2027-07-28' }, title: 'Sommerferien' },
    { start: { dateTime: '2027-10-11' }, end: { dateTime: '2027-10-23' }, title: 'Herbstferien' },
    { start: { dateTime: '2027-12-21' }, end: { dateTime: '2028-01-05' }, title: 'Weihnachtsferien' },
    // 2028
    { start: { dateTime: '2028-02-28' }, end: { dateTime: '2028-03-03' }, title: 'Winterferien' },
    { start: { dateTime: '2028-04-10' }, end: { dateTime: '2028-04-21' }, title: 'Osterferien' },
    { start: { dateTime: '2028-06-20' }, end: { dateTime: '2028-07-31' }, title: 'Sommerferien' },
    { start: { dateTime: '2028-10-14' }, end: { dateTime: '2028-10-26' }, title: 'Herbstferien' },
    { start: { dateTime: '2028-12-20' }, end: { dateTime: '2029-01-04' }, title: 'Weihnachtsferien' },
  ],
  TH: [
    // 2026
    { start: { dateTime: '2026-01-01' }, end: { dateTime: '2026-01-05' }, title: 'Weihnachtsferien' },
    { start: { dateTime: '2026-02-16' }, end: { dateTime: '2026-02-21' }, title: 'Winterferien' },
    { start: { dateTime: '2026-04-06' }, end: { dateTime: '2026-04-18' }, title: 'Osterferien' },
    { start: { dateTime: '2026-05-25' }, end: { dateTime: '2026-06-05' }, title: 'Pfingstferien' },
    { start: { dateTime: '2026-07-09' }, end: { dateTime: '2026-08-21' }, title: 'Sommerferien' },
    { start: { dateTime: '2026-10-12' }, end: { dateTime: '2026-10-24' }, title: 'Herbstferien' },
    { start: { dateTime: '2026-12-22' }, end: { dateTime: '2027-01-02' }, title: 'Weihnachtsferien' },
    // 2027
    { start: { dateTime: '2027-02-15' }, end: { dateTime: '2027-02-20' }, title: 'Winterferien' },
    { start: { dateTime: '2027-03-29' }, end: { dateTime: '2027-04-10' }, title: 'Osterferien' },
    { start: { dateTime: '2027-05-17' }, end: { dateTime: '2027-05-28' }, title: 'Pfingstferien' },
    { start: { dateTime: '2027-07-08' }, end: { dateTime: '2027-08-20' }, title: 'Sommerferien' },
    { start: { dateTime: '2027-10-11' }, end: { dateTime: '2027-10-23' }, title: 'Herbstferien' },
    { start: { dateTime: '2027-12-21' }, end: { dateTime: '2028-01-01' }, title: 'Weihnachtsferien' },
    // 2028
    { start: { dateTime: '2028-02-14' }, end: { dateTime: '2028-02-19' }, title: 'Winterferien' },
    { start: { dateTime: '2028-04-17' }, end: { dateTime: '2028-04-29' }, title: 'Osterferien' },
    { start: { dateTime: '2028-06-05' }, end: { dateTime: '2028-06-16' }, title: 'Pfingstferien' },
    { start: { dateTime: '2028-07-05' }, end: { dateTime: '2028-08-17' }, title: 'Sommerferien' },
    { start: { dateTime: '2028-10-14' }, end: { dateTime: '2028-10-26' }, title: 'Herbstferien' },
    { start: { dateTime: '2028-12-20' }, end: { dateTime: '2029-01-01' }, title: 'Weihnachtsferien' },
  ],
};

// --- main ---

async function main() {
  const raw = readFileSync(join(__dirname, '../citi.json'), 'utf-8');
  const citiData: CitiLocation[] = JSON.parse(raw);

  // 1. clean slate — reverse dependency order
  await prisma.attendance.deleteMany();
  await prisma.category.deleteMany();
  await prisma.course.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.event.deleteMany();
  await prisma.instructor.deleteMany();
  await prisma.location.deleteMany();
  await prisma.module.deleteMany();
  await prisma.participant.deleteMany();
  await prisma.registration.deleteMany();
  await prisma.room.deleteMany();
  await prisma.settings.deleteMany();
  await prisma.target.deleteMany();
  await prisma.text.deleteMany();
  await prisma.user.deleteMany();

  // 2. customer
  const customer = await prisma.customer.create({
    data: { 
      name: "DanceSchool Flip'n Bit", 
      email: 'info@dancedesk.de', 
      logoUrl: 'http://localhost:8000/assets/images/flipnbit2_xs.png',
      tenantId: 'a50834f8-ad1a-46d2-836a-003d8d926dac',
     },
  });

  // 3. instructors — one per dance specialisation, funny names
  const instructorData = [
    { name: 'Flippy Taptoe',           email: 'flippy@dancedesk.de', skill: 'WTP-youngster',    description: 'Tiny feet, big dreams — the kids love her chaos.' },
    { name: 'Sir Waltz von Fancyfeet', email: 'sir-waltz@dancedesk.de', skill: 'WTP-grownups',     description: 'Wears tails on Tuesdays. Judges your posture silently.' },
    { name: 'Rico Caliente',           email: 'rico@dancedesk.de', skill: 'Salsa',            description: 'His hips have never lied. Not even once.' },
    { name: 'MC Bounceback',           email: 'mc-bounceback@dancedesk.de', skill: 'HipHop',           description: 'Drops beats and occasionally students. Certified hype.' },
    { name: 'Sweaty McBurnham',        email: 'sweaty@dancedesk.de', skill: 'Fitness',          description: 'No pain, no gain. Mostly pain. Bring a towel.' },
    { name: 'Lindy Hopalong',          email: 'lindy@dancedesk.de', skill: 'Lindy+Westcoast',  description: 'Swings both ways — Lindy and West Coast. Simultaneously.' },
  ] as const;

  type Skill = typeof instructorData[number]['skill'];
  const instructorMap = new Map<Skill, string>(); // skill → instructor id

  for (const { name, skill, description, email } of instructorData) {
    const inst = await prisma.instructor.create({
      data: {
        name,
        email,
        description,
        skills: [skill],
        customerId: customer.id,
        tenantId: 'a50834f8-ad1a-46d2-836a-003d8d926dac',
      },
    });
    instructorMap.set(skill, inst.id);
  }

  function matchInstructor(courseName: string): string | undefined {
    const n = courseName.toLowerCase();
    if (n.includes('wtp') && (n.includes('kind') || n.includes('jugend') || n.includes('junior') || n.includes('young')))
      return instructorMap.get('WTP-youngster');
    if (n.includes('wtp'))
      return instructorMap.get('WTP-grownups');
    if (n.includes('salsa'))
      return instructorMap.get('Salsa');
    if (n.includes('hiphop') || n.includes('hip-hop') || n.includes('hip hop'))
      return instructorMap.get('HipHop');
    if (n.includes('fitness') || n.includes('workout'))
      return instructorMap.get('Fitness');
    if (n.includes('lindy') || n.includes('westcoast') || n.includes('west coast') || n.includes('swing'))
      return instructorMap.get('Lindy+Westcoast');
    return undefined;
  }

  // 3. locations
  const locationMap = new Map<number, string>(); // citi id → prisma id
  for (const loc of citiData) {
    const location = await prisma.location.create({
      data: {
        name: loc.title,
        isActive: toBool(loc.is_visible),
        tenantId: 'a50834f8-ad1a-46d2-836a-003d8d926dac',
      },
    });
    locationMap.set(loc.id, location.id);
  }
  // title → prisma uuid (built once here, reused for rooms and course matching)
  const locationByTitle = new Map<string, string>(
    citiData.flatMap(loc => {
      const id = locationMap.get(loc.id);
      return id ? [[loc.title, id] as [string, string]] : [];
    })
  );

  // 3b. rooms — created per location, Bühl gets 3 (rotated per course), Achern gets 1
  const roomsByLocation = new Map<string, string[]>(); // locationId → [roomId, ...]

  const roomDefs: { title: string; rooms: { name: string; street: string }[] }[] = [
    {
      title: 'Buehl',
      rooms: [
        { name: 'Dreherstraße',     street: 'Dreherstraße 1' },
        { name: 'Johannespassage',  street: 'Johannespassage 5' },
        { name: 'Eisenbahnstraße',  street: 'Eisenbahnstraße 12' },
      ],
    },
    {
      title: 'Achern',
      rooms: [
        { name: 'Hauptstraße 108', street: 'Hauptstraße 108' },
      ],
    },
  ];

  for (const { title, rooms } of roomDefs) {
    const locationId = locationByTitle.get(title);
    if (!locationId) continue;
    const ids: string[] = [];
    for (const r of rooms) {
      const room = await prisma.room.create({
        data: {
          name:       r.name,
          street:     r.street,
          locationId,
          tenantId:   'a50834f8-ad1a-46d2-836a-003d8d926dac',
        },
      });
      ids.push(room.id);
    }
    roomsByLocation.set(locationId, ids);
  }

  // 4. targets — one per location × headline
  const targetMap = new Map<string, string>(); // `${citiLocId}:${headline}` → prisma id
  
  for (const loc of citiData) {
    const locationId = locationMap.get(loc.id);
    if (!locationId) continue;
    for (const zg of loc.zielgruppen ?? []) {
      if (!zg.headline) continue;
      const key = `${loc.id}:${zg.headline}`;
      const target = await prisma.target.create({
        data: {
          name: zg.headline,
          isActive: toBool(zg.is_visible),
          locationId,
          tenantId: 'a50834f8-ad1a-46d2-836a-003d8d926dac',
          color: [rotator.next(), '#fff'],
        },
      });
      targetMap.set(key, target.id);
    }
  }

  // 5. categories — deduplicated by targetId + headline
  const categoryMap = new Map<string, string>(); // `${targetId}:${headline}` → prisma id

  const uniqueCategories = new Map<string, { name: string; isActive: boolean; targetId: string; color: string[] }>();
  for (const loc of citiData) {
    for (const zg of loc.zielgruppen ?? []) {
      const targetId = targetMap.get(`${loc.id}:${zg.headline}`);
      if (!targetId) continue;
      for (const zs of zg.zielseiten ?? []) {
        if (!zs.headline) continue;
        const key = `${targetId}:${zs.headline}`;
        if (!uniqueCategories.has(key)) {
          uniqueCategories.set(key, {
            name: zs.headline,
            isActive: toBool(zs.is_visible),
            targetId,
            color: [rotator.next(), '#fff'],
          });
        }
      }
    }
  }

  for (const [key, data] of uniqueCategories) {
    const category = await prisma.category.create({ data: { ...data, tenantId: 'a50834f8-ad1a-46d2-836a-003d8d926dac' } });
    categoryMap.set(key, category.id);
  }

  // 6. texts — must come before courses (textTermsId / textInfoId are required FKs)
  const loremIpsum = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Curabitur pretium tincidunt lacus nulla mauris tristique phasellus condimentum fusce eros.';

  const textTermsData = [
    { name: 'Allgemeine Geschäftsbedingungen',  description: 'Standard-AGB für alle Kurse' },
    { name: 'Nutzungsbedingungen Erwachsene',   description: 'Bedingungen für Erwachsenenkurse' },
    { name: 'Teilnahmebedingungen Kinder',      description: 'Bedingungen für Kinderkurse' },
    { name: 'Vertragsbedingungen Clubmitglied', description: 'AGB für Club-Mitgliedschaften' },
    { name: 'Datenschutzbedingungen Kurs',      description: 'Datenschutzhinweise für Kursteilnehmer' },
  ];

  const textInfosData = [
    { name: 'Kursinfo Anfänger',         description: 'Informationen für Anfängerkurse' },
    { name: 'Kursinfo Fortgeschrittene', description: 'Informationen für Fortgeschrittenenkurse' },
    { name: 'Probestunde Hinweise',      description: 'Hinweise zur Probestunde' },
    { name: 'Clubinfo Mitgliedschaft',   description: 'Informationen zur Club-Mitgliedschaft' },
    { name: 'Allgemeine Kurshinweise',   description: 'Allgemeine Informationen zu unseren Kursen' },
  ];

  const defaultTerms = await prisma.text.create({ data: { ...textTermsData[0], type: 0, text: loremIpsum, active: true, tenantId: 'a50834f8-ad1a-46d2-836a-003d8d926dac' } });
  for (const t of textTermsData.slice(1)) {
    await prisma.text.create({ data: { ...t, type: 0, text: loremIpsum, active: true, tenantId: 'a50834f8-ad1a-46d2-836a-003d8d926dac' } });
  }
  const defaultInfo = await prisma.text.create({ data: { ...textInfosData[0], type: 1, text: loremIpsum, active: true, tenantId: 'a50834f8-ad1a-46d2-836a-003d8d926dac' } });
  for (const t of textInfosData.slice(1)) {
    await prisma.text.create({ data: { ...t, type: 1, text: loremIpsum, active: true, tenantId: 'a50834f8-ad1a-46d2-836a-003d8d926dac' } });
  }

  // 7. courses
  let courseCount = 0;
  const courseSeats: Array<{ id: string; seats: number }> = [];
  for (const loc of citiData) {
    for (const zg of loc.zielgruppen ?? []) {
      const targetId = targetMap.get(`${loc.id}:${zg.headline}`);
      if (!targetId) continue;
      for (const zs of zg.zielseiten ?? []) {
        const key = `${targetId}:${zs.headline}`;
        const categoryId = categoryMap.get(key);
        if (!categoryId) continue;
        for (const kurs of zs.kurse ?? []) {
          const startsAt = parseDate(kurs.startdatum, kurs.anfangszeit || '00:00');
          const endsAt   = parseDate(kurs.startdatum, kurs.endezeit   || '00:00');
          const seatsCurrent = kurs.seats_cur === -1 ? 0 : (kurs.seats_cur ?? 0);
          const dates = (kurs.termine ?? []).map(t => ({
            date: new Date(t.datum_ts * 1000).toISOString(),
            isStart: t.is_start === 1,
          }));

          const instructorId = matchInstructor(kurs.kursbezeichnung);
          const locationId   = locationByTitle.get(kurs.standort);
          const roomPool     = locationId ? (roomsByLocation.get(locationId) ?? []) : [];
          const roomId       = roomPool.length ? roomPool[courseCount % roomPool.length] : undefined;
          const course = await prisma.course.create({
            data: {
              name: kurs.kursbezeichnung,
              isActive: true,
              startsAt,
              endsAt,
              frequency: 'weekly',
              isIgnoreCalendar: kurs.kalenderignorieren === 1,
              seatsCurrent: Math.floor(Math.random() * 20) + 1,
              seatsMax: 20,
              dates,
              categoryId,
              textTermsId: defaultTerms.id,
              textInfoId: defaultInfo.id,
              tenantId: 'a50834f8-ad1a-46d2-836a-003d8d926dac',
              ...(instructorId && { instructorId }),
              ...(locationId   && { locationId }),
              ...(roomId       && { roomId }),
            },
          });
          courseSeats.push({ id: course.id, seats: course.seatsCurrent });
          courseCount++;
        }
      }
    }
  }

  // 8. participants — one per seat in each course, fetched page-by-page from randomuser.me
  interface RandomUserName { first: string; last: string; }
  interface RandomUserStreet { number: number; name: string; }
  interface RandomUserLocation { street: RandomUserStreet; city: string; postcode: string | number; coordinates: { latitude: string; longitude: string; } }
  interface RandomUserPicture { thumbnail: string; }
  interface RandomUserDob { date: string; }
  interface RandomUser { gender: string; name: RandomUserName; email: string; phone: string; dob: RandomUserDob; picture: RandomUserPicture; location: RandomUserLocation; }
  interface RandomUserResponse { results: RandomUser[] }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const participantClient = (prisma as any).participant;

  // Buffer of pre-fetched API users not yet consumed
  const userBuffer: RandomUser[] = [];
  let apiPage = 1;
  let participantCount = 0;

  const usedEmails = new Set<string>();
  function uniqueEmail(raw: string): string {
    if (!usedEmails.has(raw)) { usedEmails.add(raw); return raw; }
    const [name, domain] = raw.split('@');
    let n = 1;
    let candidate: string;
    do { candidate = `${name}${n}@${domain}`; n++; } while (usedEmails.has(candidate));
    usedEmails.add(candidate);
    return candidate;
  }

  async function nextUser(): Promise<RandomUser | null> {
    if (userBuffer.length === 0) {
      const res = await fetch(
        `https://randomuser.me/api/?results=100&nat=de&page=${apiPage}`
      );
      const json = await res.json() as RandomUserResponse;
      if (!json.results?.length) return null;
      userBuffer.push(...json.results);
      apiPage++;
    }
    return userBuffer.shift() ?? null;
  }

  for (const { id: courseId, seats } of courseSeats) {
    for (let i = 0; i < seats; i++) {
      const u = await nextUser();
      if (!u) break; // API exhausted

      await participantClient.create({
        data: {
          firstName:  u.name.first,
          lastName:   u.name.last,
          email:      uniqueEmail(u.email),
          password:   await bcrypt.hash('Test123!', 10),
          phone:      u.phone,
          birthDate:  u.dob.date,
          gender:     u.gender,
          imageUrl:   u.picture.thumbnail,
          street:     `${u.location.street.number} ${u.location.street.name}`,
          city:       u.location.city,
          zipCode:    String(u.location.postcode),
          latitude:   parseFloat(u.location.coordinates.latitude),
          longitude:  parseFloat(u.location.coordinates.longitude),
          tenantId:   'a50834f8-ad1a-46d2-836a-003d8d926dac',
          participantCourses: { create: { courseId, tenantId: 'a50834f8-ad1a-46d2-836a-003d8d926dac' } },
        },
      });
      participantCount++;
    }
  }

  // 9. weekly events — Tanztee (Fr+So 15:00), Tanzparty (Fr+So 18:00), DiscoParty (Sa 19:00)
  //    distributed round-robin across all rooms of each location
  {
    const TENANT = 'a50834f8-ad1a-46d2-836a-003d8d926dac';
    const today  = new Date('2026-04-09');
    const end    = new Date(today);
    end.setFullYear(end.getFullYear() + 1);

    // Collect all rooms with their locationId, ordered by location then room
    const allRooms: { roomId: string; locationId: string }[] = [];
    for (const [locationId, roomIds] of roomsByLocation) {
      for (const roomId of roomIds) {
        allRooms.push({ roomId, locationId });
      }
    }

    // Build a list of { date, title, hour } entries for the next year
    type EventSpec = { title: string; hour: number; color: string };

    // day-of-week → events that occur on that day
    const byDow: Record<number, EventSpec[]> = {
      5: [ // Friday
        { title: 'Tanztee',    hour: 15, color: '#f59e0b' },
        { title: 'Tanzparty',  hour: 18, color: '#8b5cf6' },
      ],
      6: [ // Saturday
        { title: 'DiscoParty', hour: 19, color: '#ec4899' },
      ],
      0: [ // Sunday
        { title: 'Tanztee',    hour: 15, color: '#f59e0b' },
        { title: 'Tanzparty',  hour: 18, color: '#8b5cf6' },
      ],
    };

    let roomIndex = 0; // cycles through allRooms round-robin
    let eventCount = 0;

    for (const d = new Date(today); d < end; d.setDate(d.getDate() + 1)) {
      const specs = byDow[d.getDay()];
      if (!specs) continue;

      for (const spec of specs) {
        const { roomId, locationId } = allRooms[roomIndex % allRooms.length];
        roomIndex++;

        const date = new Date(d);
        date.setHours(spec.hour, 0, 0, 0);

        await prisma.event.create({
          data: {
            title:      spec.title,
            startsAt:   date,
            endsAt:     new Date(date.getTime() + 3 * 60 * 60 * 1000), // +3h
            color:      [spec.color, '#fff'],
            icon:       'event',
            type:       'event',
            roomId,
            locationId,
            tenantId:   TENANT,
          },
        });
        eventCount++;
      }
    }
    console.log(`  ${eventCount} events`);
  }

  // 10. modules
  const moduleIds: string[] = [];
  for (const data of [
    { name: 'Kurse',         color: '#66ff33', isActive: true },
    { name: 'Räume',         color: '#338fff', isActive: true },
    { name: 'Lehrer',        color: '#e733ff', isActive: true },
    { name: 'Anmeldungen',   color: '#FFCC33', isActive: true },
    { name: 'Teilnehmer',    color: '#ff3385', isActive: true },
    { name: 'Einstellungen', color: '#CCCCCC', isActive: true },
  ]) {
    const m = await prisma.module.create({ data: { ...data, tenantId: 'a50834f8-ad1a-46d2-836a-003d8d926dac' } });
    moduleIds.push(m.id);
  }

  // 11. user — connected to all locations and modules
  await prisma.user.create({
    data: {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@test.de',
      password: await bcrypt.hash('test123', 10),
      isActive: true,
      tenantId: 'a50834f8-ad1a-46d2-836a-003d8d926dac',
      modules:   { connect: moduleIds.map(id => ({ id })) },
      locations: { connect: [...locationMap.values()].map(id => ({ id })) },
    },
  });

  // 10. settings — with German federal holidays 2026–2028
  const germanyHolidays = [
    // 2026 — Easter: April 5
    { start: { dateTime: '2026-01-01' }, title: 'Neujahr' },
    { start: { dateTime: '2026-04-03' }, title: 'Karfreitag' },
    { start: { dateTime: '2026-04-06' }, title: 'Ostermontag' },
    { start: { dateTime: '2026-05-01' }, title: 'Tag der Arbeit' },
    { start: { dateTime: '2026-05-14' }, title: 'Christi Himmelfahrt' },
    { start: { dateTime: '2026-05-25' }, title: 'Pfingstmontag' },
    { start: { dateTime: '2026-10-03' }, title: 'Tag der deutschen Einheit' },
    { start: { dateTime: '2026-12-25' }, title: '1. Weihnachtstag' },
    { start: { dateTime: '2026-12-26' }, title: '2. Weihnachtstag' },
    // 2027 — Easter: March 28
    { start: { dateTime: '2027-01-01' }, title: 'Neujahr' },
    { start: { dateTime: '2027-03-26' }, title: 'Karfreitag' },
    { start: { dateTime: '2027-03-29' }, title: 'Ostermontag' },
    { start: { dateTime: '2027-05-01' }, title: 'Tag der Arbeit' },
    { start: { dateTime: '2027-05-06' }, title: 'Christi Himmelfahrt' },
    { start: { dateTime: '2027-05-17' }, title: 'Pfingstmontag' },
    { start: { dateTime: '2027-10-03' }, title: 'Tag der deutschen Einheit' },
    { start: { dateTime: '2027-12-25' }, title: '1. Weihnachtstag' },
    { start: { dateTime: '2027-12-26' }, title: '2. Weihnachtstag' },
    // 2028 — Easter: April 16
    { start: { dateTime: '2028-01-01' }, title: 'Neujahr' },
    { start: { dateTime: '2028-04-14' }, title: 'Karfreitag' },
    { start: { dateTime: '2028-04-17' }, title: 'Ostermontag' },
    { start: { dateTime: '2028-05-01' }, title: 'Tag der Arbeit' },
    { start: { dateTime: '2028-05-25' }, title: 'Christi Himmelfahrt' },
    { start: { dateTime: '2028-06-05' }, title: 'Pfingstmontag' },
    { start: { dateTime: '2028-10-03' }, title: 'Tag der deutschen Einheit' },
    { start: { dateTime: '2028-12-25' }, title: '1. Weihnachtstag' },
    { start: { dateTime: '2028-12-26' }, title: '2. Weihnachtstag' },
  ];

  await prisma.settings.create({
    data: {
      tenantId: 'a50834f8-ad1a-46d2-836a-003d8d926dac',
      basic: {
        federalState: 'HE',
        domain: 'http://www.dancedesk.de/',
      },
      calendar: {
        startHour: 10,
        endHour: 20,
        slotHeight: 20,
        minutesPerSlot: 15,
        federalHolidays: germanyHolidays,
        schoolHolidays,
      },
      registration: {
        delTime: 30,
        checkSeats: false,
        waitingList: true,
        displayPastNumber: 52,
        displayNumberOccurrences: 12,
      },
      formFields: [{ name: 'firstName' }, { name: 'lastName' }, { name: 'email' }, { name: 'phone' }],
      contracts: [],
    },
  });

  console.log('Seeded:');
  console.log(`  ${targetMap.size} targets`);
  console.log(`  ${uniqueCategories.size} categories`);
  console.log(`  ${locationMap.size} locations`);
  console.log(`  ${instructorData.length} instructors`);
  console.log(`  ${courseCount} courses`);
  console.log(`  ${participantCount} participants`);
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
