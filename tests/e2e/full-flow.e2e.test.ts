import request from 'supertest';
import app from '../../src/app';
import { prisma } from '../../src/prisma';

describe('E2E: Full task flow', () => {
  beforeEach(async () => {
    await prisma.task.deleteMany();
    await prisma.project.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test('User → Project → Task → Get tasks', async () => {
    // 1️⃣ Create user
    const userRes = await request(app).post('/users').send({ email: 'e2e@test.com' });

    expect(userRes.status).toBe(201);
    const userId = userRes.body.id;

    // 2️⃣ Create project
    const projectRes = await request(app).post('/projects').send({
      name: 'E2E Project',
      ownerId: userId,
    });

    expect(projectRes.status).toBe(201);
    const projectId = projectRes.body.id;

    // 3️⃣ Create task
    const taskRes = await request(app).post('/tasks').send({
      title: 'E2E Task',
      status: 'todo',
      projectId,
    });

    expect(taskRes.status).toBe(201);

    // 4️⃣ Get tasks
    const tasksRes = await request(app).get('/tasks');

    expect(tasksRes.status).toBe(200);
    expect(tasksRes.body.length).toBe(1);
    expect(tasksRes.body[0].title).toBe('E2E Task');
  });
});
