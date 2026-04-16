import type { RequestHandler } from 'express';
import prisma from '#db';
import type { federalStateSchema } from '#schemas';
import type { z } from 'zod/v4';

type FederalState = z.infer<typeof federalStateSchema>;
type Holiday = { start: { dateTime: string }; end: { dateTime: string }; title: string };

const schoolHolidays: Record<FederalState, Holiday[]> = {
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

type FederalHoliday = { start: { dateTime: string }; title: string };

const national: FederalHoliday[] = [
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

const dreiKoenige:      FederalHoliday[] = ['2026','2027','2028'].map(y => ({ start: { dateTime: `${y}-01-06` }, title: 'Heilige Drei Könige' }));
const frauentag:        FederalHoliday[] = ['2026','2027','2028'].map(y => ({ start: { dateTime: `${y}-03-08` }, title: 'Internationaler Frauentag' }));
const fronleichnam:     FederalHoliday[] = [
  { start: { dateTime: '2026-06-04' }, title: 'Fronleichnam' },
  { start: { dateTime: '2027-05-27' }, title: 'Fronleichnam' },
  { start: { dateTime: '2028-06-15' }, title: 'Fronleichnam' },
];
const mariaeHimmelfahrt: FederalHoliday[] = ['2026','2027','2028'].map(y => ({ start: { dateTime: `${y}-08-15` }, title: 'Mariä Himmelfahrt' }));
const weltkindertag:    FederalHoliday[] = ['2026','2027','2028'].map(y => ({ start: { dateTime: `${y}-09-20` }, title: 'Weltkindertag' }));
const reformationstag:  FederalHoliday[] = ['2026','2027','2028'].map(y => ({ start: { dateTime: `${y}-10-31` }, title: 'Reformationstag' }));
const allerheiligen:    FederalHoliday[] = ['2026','2027','2028'].map(y => ({ start: { dateTime: `${y}-11-01` }, title: 'Allerheiligen' }));
const bussBettag:       FederalHoliday[] = [
  { start: { dateTime: '2026-11-18' }, title: 'Buß- und Bettag' },
  { start: { dateTime: '2027-11-17' }, title: 'Buß- und Bettag' },
  { start: { dateTime: '2028-11-22' }, title: 'Buß- und Bettag' },
];

const merge = (...groups: FederalHoliday[][]): FederalHoliday[] =>
  ([] as FederalHoliday[]).concat(...groups).sort((a, b) => a.start.dateTime.localeCompare(b.start.dateTime));

const federalHolidays: Record<FederalState, FederalHoliday[]> = {
  BW: merge(national, dreiKoenige, fronleichnam, allerheiligen),
  BY: merge(national, dreiKoenige, fronleichnam, mariaeHimmelfahrt, allerheiligen),
  BE: merge(national, frauentag),
  BB: merge(national, reformationstag),
  HB: merge(national, reformationstag),
  HH: merge(national, reformationstag),
  HE: merge(national, fronleichnam),
  MV: merge(national, frauentag, reformationstag),
  NI: merge(national, reformationstag),
  NW: merge(national, fronleichnam, allerheiligen),
  RP: merge(national, fronleichnam, allerheiligen),
  SL: merge(national, fronleichnam, mariaeHimmelfahrt, allerheiligen),
  SN: merge(national, reformationstag, bussBettag),
  ST: merge(national, dreiKoenige, reformationstag),
  SH: merge(national, reformationstag),
  TH: merge(national, weltkindertag, reformationstag),
};

export const getHolidays: RequestHandler = async (req, res) => {
  const state = String(req.params['state']) as keyof typeof schoolHolidays;
  const holidays = schoolHolidays[state];
  if (!holidays) throw new Error(`No holiday data for state '${state}'`, { cause: { status: 404 } });
  res.json(holidays);
};

export const getFederalHolidays: RequestHandler = async (req, res) => {
  const state = String(req.params['state']) as keyof typeof federalHolidays;
  const holidays = federalHolidays[state];
  if (!holidays) throw new Error(`No federal holiday data for state '${state}'`, { cause: { status: 404 } });
  res.json(holidays);
};

export const getSettings: RequestHandler = async (req, res) => {
  const { tenantId } = req.user!;
  const settings = await prisma.settings.findUnique({ where: { tenantId } });
  res.json(settings);
};

export const upsertSettings: RequestHandler = async (req, res) => {
  const { tenantId } = req.user!;
  const settings = await prisma.settings.upsert({
    where: { tenantId },
    create: { ...req.body, tenantId },
    update: { ...req.body },
  });
  res.json(settings);
};
