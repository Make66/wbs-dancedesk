import { PrismaClient } from '../generated/prisma/client.ts';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcrypt';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const CODE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
function generateCode(): string {
  return Array.from({ length: 5 }, () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]).join('');
}

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
  anz_unterrichtsstunden?: number;
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
      code: generateCode(),
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
  const categoryColorMap = new Map<string, string[]>(); // category id → color

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
    categoryColorMap.set(category.id, data.color);
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
          if (startsAt.getFullYear() < new Date().getFullYear()) continue;
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
          const isClub = kurs.anz_unterrichtsstunden == null;
          const courseRepetition = isClub ? 50 : kurs.anz_unterrichtsstunden!;
          const course = await prisma.course.create({
            data: {
              name: kurs.kursbezeichnung,
              isActive: true,
              isClub,
              courseRepetition,
              startsAt,
              endsAt,
              frequency: 'weekly',
              isIgnoreCalendar: kurs.kalenderignorieren === 1,
              seatsCurrent: Math.floor(Math.random() * 20) + 1,
              seatsMax: 20,
              dates,
              categoryId,
              color: categoryColorMap.get(categoryId) ?? [],
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
      },
      holidays: {
        federal: germanyHolidays,
        school: schoolHolidays,
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

  // 12. posts — 20 AI news items (Anthropic & OpenAI)
  const TENANT = 'a50834f8-ad1a-46d2-836a-003d8d926dac';
  const postSeed = [
    {
      title: 'Anthropic veröffentlicht Claude 4 mit erweitertem Kontextfenster',
      teaser: 'Das neue Modell verarbeitet bis zu 500.000 Token und übertrifft GPT-5 in mehreren Benchmarks.',
      text: 'Anthropic hat heute Claude 4 vorgestellt, das bislang leistungsstärkste Modell des Unternehmens. Mit einem Kontextfenster von 500.000 Token können ganze Codebasen oder umfangreiche Dokumente in einem einzigen Prompt verarbeitet werden. In standardisierten Tests wie MMLU und HumanEval erzielt Claude 4 neue Bestwerte und übertrifft dabei auch OpenAIs GPT-5 in mehreren Kategorien.',
      imageUrl: 'https://picsum.photos/seed/claude4/800/450',
      author: 'KI-Redaktion',
      date: '2026-04-10T09:00:00.000Z',
      isTopPost: true,
    },
    {
      title: 'OpenAI stellt GPT-5 offiziell vor',
      teaser: 'GPT-5 soll deutlich zuverlässiger sein und weniger halluzinieren als sein Vorgänger.',
      text: 'OpenAI hat GPT-5 auf einer Pressekonferenz in San Francisco präsentiert. Das Modell wurde auf einem bedeutend größeren und sorgfältig kuratierten Datensatz trainiert. Laut OpenAI reduziert GPT-5 Halluzinationen um 40 % im Vergleich zu GPT-4 und erzielt in juristischen sowie medizinischen Reasoning-Tests erstmals menschliches Niveau.',
      imageUrl: 'https://picsum.photos/seed/gpt5/800/450',
      author: 'Tech-Desk',
      date: '2026-04-08T10:30:00.000Z',
      isTopPost: true,
    },
    {
      title: 'Anthropic erhält 4 Milliarden Dollar Investition von Google',
      teaser: 'Die Finanzierungsrunde bewertet Anthropic mit über 30 Milliarden Dollar.',
      text: 'Google hat eine weitere Investition von 4 Milliarden Dollar in Anthropic angekündigt und damit die bisherige Partnerschaft vertieft. Die Mittel sollen vor allem in den Aufbau eigener KI-Chips sowie die Erweiterung der Rechenzentrumskapazitäten fließen. Anthropic-CEO Dario Amodei betonte, dass die Investition die Unabhängigkeit des Unternehmens nicht einschränke.',
      imageUrl: 'https://picsum.photos/seed/anthropic-google/800/450',
      author: 'Wirtschaftsredaktion',
      date: '2026-03-28T08:00:00.000Z',
      isTopPost: false,
    },
    {
      title: 'OpenAI launcht o3-mini für Entwickler',
      teaser: 'Das schlanke Reasoning-Modell ist besonders für Coding-Aufgaben optimiert.',
      text: 'OpenAI hat o3-mini in der API veröffentlicht. Das Modell ist speziell auf mathematisches und programmiertechnisches Denken ausgelegt und benötigt dabei deutlich weniger Rechenressourcen als o3. Entwickler berichten von deutlich kürzeren Antwortzeiten bei Coding-Aufgaben. Der Preis liegt bei 0,15 Dollar pro Million Input-Token.',
      imageUrl: 'https://picsum.photos/seed/o3mini/800/450',
      author: 'Entwickler-News',
      date: '2026-03-20T14:00:00.000Z',
      isTopPost: false,
    },
    {
      title: 'Anthropic führt "Constitutional AI 2.0" ein',
      teaser: 'Die neue Methode soll KI-Modelle robuster gegen Manipulation machen.',
      text: 'Anthropic hat eine aktualisierte Version seines Constitutional-AI-Ansatzes vorgestellt. CAI 2.0 integriert dynamische Regelwerke, die sich an neue Angriffsmuster anpassen können. In Red-Teaming-Tests zeigte Claude mit CAI 2.0 eine signifikant höhere Resistenz gegenüber Jailbreaking-Versuchen als Vergleichsmodelle.',
      imageUrl: 'https://picsum.photos/seed/cai2/800/450',
      author: 'Sicherheitsredaktion',
      date: '2026-03-15T11:00:00.000Z',
      isTopPost: false,
    },
    {
      title: 'OpenAI und Microsoft verlängern Partnerschaft bis 2030',
      teaser: 'Microsoft sichert sich weiterhin exklusiven Cloud-Zugang zu OpenAI-Modellen.',
      text: 'OpenAI und Microsoft haben ihre strategische Partnerschaft bis 2030 verlängert. Microsoft bleibt der primäre Cloud-Partner und investiert weitere 10 Milliarden Dollar. Im Gegenzug erhält Microsoft exklusiven Frühzugang zu neuen Modellen für seine Copilot-Produktlinie. Die Vereinbarung schließt auch gemeinsame Forschung zu KI-Sicherheit ein.',
      imageUrl: 'https://picsum.photos/seed/openai-ms/800/450',
      author: 'Business-Desk',
      date: '2026-03-10T09:00:00.000Z',
      isTopPost: false,
    },
    {
      title: 'Claude übernimmt Spitzenplatz im LMSYS Chatbot Arena',
      teaser: 'Nutzer bevorzugen Claude in Blindtests gegenüber GPT-4o und Gemini Ultra.',
      text: 'In der aktuellen Auswertung der LMSYS Chatbot Arena hat Claude von Anthropic erstmals die Spitzenposition übernommen. Über 50.000 Blindvergleiche zeigen, dass Nutzer Claude insbesondere bei kreativen Aufgaben und bei der Vermeidung sogenannter "sycophantic" Antworten bevorzugen. GPT-4o und Gemini Ultra folgen auf den Plätzen zwei und drei.',
      imageUrl: 'https://picsum.photos/seed/arena/800/450',
      author: 'KI-Redaktion',
      date: '2026-03-05T16:00:00.000Z',
      isTopPost: false,
    },
    {
      title: 'OpenAI öffnet GPT-4o für kostenlose Nutzer',
      teaser: 'Ab sofort können auch Gratisnutzer auf das fortschrittlichste Multimodal-Modell zugreifen.',
      text: 'OpenAI weitet den Zugang zu GPT-4o auf alle Nutzer aus, auch ohne kostenpflichtiges Abo. Allerdings gelten für Gratisnutzer weiterhin Nutzungslimits. Das Unternehmen begründet den Schritt mit dem Ziel, KI möglichst breit zugänglich zu machen. ChatGPT verzeichnete in der Folge einen Nutzungsanstieg von 20 % innerhalb einer Woche.',
      imageUrl: 'https://picsum.photos/seed/gpt4ofree/800/450',
      author: 'Produkt-News',
      date: '2026-02-28T12:00:00.000Z',
      isTopPost: false,
    },
    {
      title: 'Anthropic veröffentlicht Studie zu KI-Bewusstsein',
      teaser: 'Forscher untersuchen, ob große Sprachmodelle Ansätze von Selbstwahrnehmung zeigen.',
      text: 'In einem ungewöhnlich offenen Forschungsbericht beschäftigt sich Anthropic mit der Frage, ob Claude über rudimentäre Formen von Selbstwahrnehmung verfügt. Die Studie kommt zu keinem eindeutigen Ergebnis, empfiehlt aber einen vorsichtigen Umgang mit dem Thema. Dario Amodei betonte, dass das Unternehmen die Frage ethisch ernst nehme.',
      imageUrl: 'https://picsum.photos/seed/consciousness/800/450',
      author: 'Wissenschaftsredaktion',
      date: '2026-02-20T10:00:00.000Z',
      isTopPost: false,
    },
    {
      title: 'OpenAI startet Sora für alle ChatGPT Plus-Nutzer',
      teaser: 'Das KI-Videogenerierungs-Tool ist ab sofort global verfügbar.',
      text: 'OpenAI hat Sora, sein KI-Videogenerierungstool, weltweit für ChatGPT-Plus-Abonnenten freigeschaltet. Nutzer können Videos mit bis zu einer Minute Länge in 1080p-Auflösung generieren. Trotz der technischen Leistungsfähigkeit gibt es Kritik an fehlenden Wasserzeichen und der Möglichkeit, täuschend echte Desinformationsvideos zu erstellen.',
      imageUrl: 'https://picsum.photos/seed/sora/800/450',
      author: 'Medienredaktion',
      date: '2026-02-14T08:00:00.000Z',
      isTopPost: false,
    },
    {
      title: 'Anthropic kooperiert mit NASA für Weltraumforschung',
      teaser: 'Claude soll wissenschaftliche Daten von Mars-Missionen analysieren.',
      text: 'Anthropic und NASA haben eine Forschungskooperation bekanntgegeben. Claude soll dabei helfen, die enormen Datenmengen der Mars-Perseverance-Mission auszuwerten und Muster in geologischen Proben zu identifizieren. NASA-Forscher hoffen, durch den KI-Einsatz die Analysezeit drastisch zu verkürzen und neue Erkenntnisse zur Marskruste zu gewinnen.',
      imageUrl: 'https://picsum.photos/seed/nasa-ai/800/450',
      author: 'Wissenschaftsredaktion',
      date: '2026-02-07T14:00:00.000Z',
      isTopPost: false,
    },
    {
      title: 'OpenAI gründet gemeinnützige KI-Sicherheitsabteilung',
      teaser: 'Die neue Einheit soll unabhängig von kommerziellen Interessen forschen.',
      text: 'OpenAI hat eine neue gemeinnützige Forschungsabteilung gegründet, die sich ausschließlich mit KI-Sicherheit befasst. Die Einheit wird von Helen Toner geleitet und erhält ein Jahresbudget von 300 Millionen Dollar. Sie soll unabhängig vom kommerziellen Bereich agieren und ihre Ergebnisse vollständig veröffentlichen.',
      imageUrl: 'https://picsum.photos/seed/openai-safety/800/450',
      author: 'Sicherheitsredaktion',
      date: '2026-01-30T09:00:00.000Z',
      isTopPost: false,
    },
    {
      title: 'Claude API erreicht eine Million aktive Entwickler',
      teaser: 'Anthropics Entwicklerplattform verzeichnet rasantes Wachstum.',
      text: 'Anthropic hat bekannt gegeben, dass die Claude API die Marke von einer Million aktiver Entwickler überschritten hat. Das Wachstum sei vor allem auf Unternehmenskunden aus den Bereichen Recht, Medizin und Softwareentwicklung zurückzuführen. Anthropic plant, in Kürze eine günstigere Einstiegsstufe für Startups einzuführen.',
      imageUrl: 'https://picsum.photos/seed/claude-devs/800/450',
      author: 'Entwickler-News',
      date: '2026-01-22T10:00:00.000Z',
      isTopPost: false,
    },
    {
      title: 'OpenAI und Axel Springer schließen Inhaltslizenzvertrag',
      teaser: 'KI-Modelle dürfen künftig auf Inhalte von Bild, Welt und Politico zugreifen.',
      text: 'OpenAI hat einen mehrjährigen Lizenzvertrag mit dem Medienhaus Axel Springer unterzeichnet. Damit dürfen ChatGPT und andere OpenAI-Produkte auf Inhalte von Bild, Welt, Business Insider und Politico zugreifen und diese in Antworten einbinden. Axel Springer erhält im Gegenzug eine Beteiligung sowie frühzeitigen Zugang zu neuen OpenAI-Technologien.',
      imageUrl: 'https://picsum.photos/seed/media-deal/800/450',
      author: 'Medienredaktion',
      date: '2026-01-15T11:00:00.000Z',
      isTopPost: false,
    },
    {
      title: 'Anthropic veröffentlicht "Model Spec" als Open Standard',
      teaser: 'Das Dokument beschreibt die Werte und Verhaltensregeln für Claude-Modelle.',
      text: 'Anthropic hat seine "Model Spec" — das interne Regelwerk für das Verhalten von Claude — als offenen Standard veröffentlicht. Das Unternehmen lädt andere KI-Labore ein, ähnliche Dokumente zu erstellen und zu teilen. Ziel ist eine branchenweite Grundlage für transparentere und vergleichbarere KI-Systeme.',
      imageUrl: 'https://picsum.photos/seed/modelspec/800/450',
      author: 'KI-Politik',
      date: '2026-01-10T09:00:00.000Z',
      isTopPost: false,
    },
    {
      title: 'OpenAI plant eigene KI-Chips mit TSMC',
      teaser: 'Das Unternehmen will die Abhängigkeit von Nvidia reduzieren.',
      text: 'Laut Berichten plant OpenAI die Entwicklung eigener KI-Beschleuniger in Kooperation mit TSMC. Die ersten Chips sollen 2027 in Produktion gehen. Ziel ist es, die Kosten für das Training und den Betrieb großer Modelle deutlich zu senken und die Abhängigkeit von Nvidias H100- und H200-GPUs zu verringern.',
      imageUrl: 'https://picsum.photos/seed/openai-chip/800/450',
      author: 'Hardware-Desk',
      date: '2025-12-20T10:00:00.000Z',
      isTopPost: false,
    },
    {
      title: 'Anthropic und EU einigen sich auf freiwilligen KI-Kodex',
      teaser: 'Claude erfüllt als erstes großes Modell alle Anforderungen des EU AI Act.',
      text: 'Anthropic hat gemeinsam mit der Europäischen Kommission einen freiwilligen Verhaltenskodex für General-Purpose-AI-Modelle unterzeichnet. Claude ist damit das erste weitverbreitete Sprachmodell, das offiziell alle Anforderungen des EU AI Act in der Hochrisiko-Kategorie erfüllt. Das Unternehmen sieht dies als Vorteil im europäischen Unternehmensmarkt.',
      imageUrl: 'https://picsum.photos/seed/eu-ai/800/450',
      author: 'KI-Politik',
      date: '2025-12-12T14:00:00.000Z',
      isTopPost: false,
    },
    {
      title: 'OpenAI integriert ChatGPT in Apple Intelligence',
      teaser: 'iPhones mit iOS 18 können ab sofort direkt auf ChatGPT zugreifen.',
      text: 'Apple und OpenAI haben ihre angekündigte Integration abgeschlossen. iPhone-Nutzer mit iOS 18 können nun Siri-Anfragen nahtlos an ChatGPT weiterleiten, ohne die App wechseln zu müssen. Apple betont, dass dabei keine Nutzerdaten an OpenAI übertragen werden, sofern der Nutzer keine explizite Einwilligung gibt.',
      imageUrl: 'https://picsum.photos/seed/apple-openai/800/450',
      author: 'Produkt-News',
      date: '2025-12-05T10:00:00.000Z',
      isTopPost: false,
    },
    {
      title: 'Anthropic startet Claude for Work — neues Team-Produkt',
      teaser: 'Die kollaborative Plattform ermöglicht Teams die gemeinsame Nutzung von KI-Workflows.',
      text: 'Anthropic hat "Claude for Work" vorgestellt, eine neue kollaborative Plattform für Unternehmen. Teams können damit gemeinsame Prompt-Bibliotheken, geteilte Gesprächsverläufe und rollenbasierte Zugriffsrechte verwalten. Das Produkt richtet sich vor allem an mittelgroße Unternehmen und kostet 30 Dollar pro Nutzer und Monat.',
      imageUrl: 'https://picsum.photos/seed/claude-work/800/450',
      author: 'Business-Desk',
      date: '2025-11-28T09:00:00.000Z',
      isTopPost: false,
    },
    {
      title: 'OpenAI veröffentlicht erstes KI-Sicherheits-Jahrbuch',
      teaser: 'Das Dokument dokumentiert alle bekannten Sicherheitsvorfälle des Jahres 2025.',
      text: 'OpenAI hat erstmals ein umfassendes Jahrbuch zu KI-Sicherheitsvorfällen veröffentlicht. Das Dokument beschreibt 47 dokumentierte Vorfälle aus 2025, darunter Prompt-Injection-Angriffe, unbeabsichtigte Datenlecks und Missbrauch durch staatliche Akteure. OpenAI hofft, mit der Transparenz einen Branchenstandard zu setzen.',
      imageUrl: 'https://picsum.photos/seed/safety-book/800/450',
      author: 'Sicherheitsredaktion',
      date: '2025-11-15T08:00:00.000Z',
      isTopPost: false,
    },
  ];

  for (const post of postSeed) {
    await prisma.post.create({
      data: { ...post, tenantId: TENANT, isActive: true, isArchived: false, isDeleted: false },
    });
  }
  console.log(`  ${postSeed.length} posts`);
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
