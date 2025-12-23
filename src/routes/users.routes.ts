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

router.post('/', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  const user = await prisma.user.create({
    data: { email },
  });

  res.status(201).json(user);
});

export default router;
