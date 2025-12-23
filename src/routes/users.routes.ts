import { Router } from 'express';
import { prisma } from '../prisma';

const router = Router();

router.get('/', async (_req, res) => {
  const users = await prisma.user.findMany({
    include: {
      projects: true,
    },
  });

  res.json(users);
});

export default router;
