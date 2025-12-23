import { Router } from 'express';
import { prisma } from '../prisma';

const router = Router();

router.get('/', async (_req, res) => {
  const tasks = await prisma.task.findMany({
    include: {
      project: true,
    },
  });

  res.json(tasks);
});

router.post('/', async (req, res) => {
  const { title, status, projectId } = req.body;

  const task = await prisma.task.create({
    data: {
      title,
      status,
      projectId,
    },
  });

  res.status(201).json(task);
});

export default router;
