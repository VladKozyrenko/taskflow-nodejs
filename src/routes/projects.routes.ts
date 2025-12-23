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

router.post('/', async (req, res) => {
  const { name, ownerId } = req.body;

  const project = await prisma.project.create({
    data: {
      name,
      ownerId,
    },
  });

  res.status(201).json(project);
});

export default router;
