import { prisma } from './prisma';

async function main() {
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  const user = await prisma.user.create({
    data: { email: 'user@test.com' },
  });

  const project = await prisma.project.create({
    data: {
      name: 'Demo project',
      ownerId: user.id,
    },
  });

  await prisma.task.createMany({
    data: [
      { title: 'First task', status: 'todo', projectId: project.id },
      { title: 'Second task', status: 'in_progress', projectId: project.id },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
