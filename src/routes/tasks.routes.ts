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

export default router;
