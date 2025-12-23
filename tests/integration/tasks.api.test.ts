import request from 'supertest';
import app from '../../src/app';
import { prisma } from '../../src/prisma';

describe('Tasks API (integration)', () => {
  beforeAll(async () => {
    // БД має бути чистою
    await prisma.task.deleteMany();
    await prisma.project.deleteMany();
    await prisma.user.deleteMany();

    const user = await prisma.user.create({
      data: { email: 'integration@test.com' },
    });

    const project = await prisma.project.create({
      data: {
        name: 'Integration project',
        ownerId: user.id,
      },
    });

    await prisma.task.create({
      data: {
        title: 'Integration task',
        status: 'todo',
        projectId: project.id,
      },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test('GET /tasks returns tasks from database', async () => {
    const response = await request(app).get('/tasks');

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0].title).toBe('Integration task');
  });
});
