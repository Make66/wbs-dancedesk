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
  startdatum: string;
  anfangszeit: string;
  endezeit: string;
  frequenz: number;
  kalenderignorieren: number;
  seats_cur: number;
  termine: CitiTermin[];
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

// --- main ---

async function main() {
  const raw = readFileSync(join(__dirname, '../citi.json'), 'utf-8');
  const citiData: CitiLocation[] = JSON.parse(raw);

  // 1. clean slate — reverse dependency order
  await prisma.course.deleteMany();
  await prisma.category.deleteMany();
  await prisma.target.deleteMany();
  await prisma.location.deleteMany();
  await prisma.room.deleteMany();
  await prisma.text.deleteMany();
  await prisma.module.deleteMany();
  await prisma.registration.deleteMany();
  await prisma.user.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.module.deleteMany();

  // 2. customer
  await prisma.customer.create({
    data: { name: "DanceSchool Flip'n Bit", email: 'info@dancedesk.de', tenantId: 'seed' },
  });

  // 3. locations
  const locationMap = new Map<number, string>(); // citi id → prisma id
  for (const loc of citiData) {
    const location = await prisma.location.create({
      data: {
        name: loc.title,
        active: toBool(loc.is_visible),
        seq: Number(loc.sequence),
        tenantId: 'seed',
      },
    });
    locationMap.set(loc.id, location.id);
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
          active: toBool(zg.is_visible),
          seq: Number(zg.sequence),
          locationId,
          tenantId: 'seed',
        },
      });
      targetMap.set(key, target.id);
    }
  }

  // 5. categories — deduplicated by targetId + headline
  const categoryMap = new Map<string, string>(); // `${targetId}:${headline}` → prisma id

  const uniqueCategories = new Map<string, { name: string; active: boolean; seq: number; targetId: string }>();
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
            active: toBool(zs.is_visible),
            seq: Number(zs.sequence),
            targetId,
          });
        }
      }
    }
  }

  for (const [key, data] of uniqueCategories) {
    const category = await prisma.category.create({ data: { ...data, tenantId: 'seed' } });
    categoryMap.set(key, category.id);
  }

  // 6. courses
  let courseCount = 0;
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

          await prisma.course.create({
            data: {
              name: kurs.kursbezeichnung,
              active: toBool(kurs.is_visible),
              startsAt,
              endsAt,
              frequency: 'weekly',
              isIgnoreCalendar: kurs.kalenderignorieren === 1,
              seatsCurrent,
              seatsMax: 0,
              dates,
              categoryId,
              tenantId: 'seed',
            },
          });
          courseCount++;
        }
      }
    }
  }

  // 7. modules
  const moduleIds: string[] = [];
  for (const data of [
    { name: 'Kurse',         seq: 1, color: '#66ff33', active: true },
    { name: 'Räume',         seq: 2, color: '#338fff', active: true },
    { name: 'Lehrer',        seq: 3, color: '#e733ff', active: true },
    { name: 'Anmeldungen',   seq: 4, color: '#FFCC33', active: true },
    { name: 'Teilnehmer',    seq: 5, color: '#ff3385', active: true },
    { name: 'Einstellungen', seq: 6, color: '#CCCCCC', active: true },
  ]) {
    const m = await prisma.module.create({ data: { ...data, tenantId: 'seed' } });
    moduleIds.push(m.id);
  }

  // 8. user — connected to all locations and modules
  await prisma.user.create({
    data: {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@test.de',
      password: await bcrypt.hash('test123', 10),
      active: true,
      tenantId: 'seed',
      modules:   { connect: moduleIds.map(id => ({ id })) },
      locations: { connect: [...locationMap.values()].map(id => ({ id })) },
    },
  });

  console.log('Seeded:');
  console.log(`  ${targetMap.size} targets`);
  console.log(`  ${uniqueCategories.size} categories`);
  console.log(`  ${locationMap.size} locations`);
  console.log(`  ${courseCount} courses`);
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
