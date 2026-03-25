import { PrismaClient } from '../generated/prisma/client.ts';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ host: 'localhost', port: 5432});
const prisma = new PrismaClient({ adapter });

async function main() {
    await prisma.customer.deleteMany();
    await prisma.admin.deleteMany();
    await prisma.location.deleteMany();
    await prisma.target.deleteMany();
    await prisma.category.deleteMany();
    await prisma.course.deleteMany();
    await prisma.module.deleteMany();
    await prisma.room.deleteMany();
    await prisma.text.deleteMany();
    
    await prisma.customer.create({
        data: { name: 'DanceSchool Flip\'n Bit', email: 'info@dancedesk.de', tenantId: 'seed' },
    });
}

main()
    .then(async () => { await prisma.$disconnect(); })
    .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
