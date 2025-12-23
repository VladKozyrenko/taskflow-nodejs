import { Router } from 'express';
import { prisma } from '../prisma';

const router = Router();

router.get('/', async (_req, res) => {
  const projects = await prisma.project.findMany({
    include: {
      tasks: true,
      owner: true,
    },
  });

  res.json(projects);
});

export default router;
