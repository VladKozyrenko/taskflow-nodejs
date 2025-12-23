import { Router } from 'express';
import { tasks } from '../data/tasks';

const router = Router();

router.get('/', (req, res) => {
  res.json(tasks);
});

export default router;
