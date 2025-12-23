import { prisma } from '../../src/prisma';

export async function clearDatabase() {
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();
}
