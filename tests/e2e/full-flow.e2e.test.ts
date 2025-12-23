import request from 'supertest';
import app from '../../src/app';
import { prisma } from '../../src/prisma';
import { resetDatabase } from '../helpers/db';

describe('E2E: Full task flow', () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test('User → Project → Task → Get tasks', async () => {
    const userRes = await request(app).post('/users').send({ email: 'e2e@test.com' });

    expect(userRes.status).toBe(201);
    const userId = userRes.body.id;

    const projectRes = await request(app).post('/projects').send({
      name: 'E2E Project',
      ownerId: userId,
    });

    expect(projectRes.status).toBe(201);
    const projectId = projectRes.body.id;

    const taskRes = await request(app).post('/tasks').send({
      title: 'E2E Task',
      status: 'todo',
      projectId,
    });

    expect(taskRes.status).toBe(201);

    const tasksRes = await request(app).get('/tasks');

    expect(tasksRes.status).toBe(200);
    expect(tasksRes.body.length).toBe(1);
    expect(tasksRes.body[0].title).toBe('E2E Task');
  });
});
