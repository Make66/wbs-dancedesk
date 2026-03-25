import { PrismaClient } from '../generated/prisma/client.ts';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const adapter = new PrismaMariaDb({ host: 'localhost', port: 3306, connectionLimit: 5 });
const prisma = new PrismaClient({ adapter });

async function main() {
    await prisma.post.deleteMany();
    await prisma.user.deleteMany();

    const alice = await prisma.user.create({
        data: { name: 'Alice', email: 'alice@prisma.io' },
    });
    await prisma.post.createMany({
        data: [{ title: 'Post 1', content: 'Content', authorId: alice.id }],
    });
}

main()
    .then(async () => { await prisma.$disconnect(); })
    .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
