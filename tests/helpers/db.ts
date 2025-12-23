import { prisma } from '../../src/prisma';

export async function resetDatabase() {
  await prisma.$executeRawUnsafe(`
    TRUNCATE TABLE "Task", "Project", "User" RESTART IDENTITY CASCADE;
  `);
}
