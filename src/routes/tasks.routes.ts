import { Router } from 'express';
import type { TaskService } from '../services/task.service';
import { AppError } from '../errors/AppError';

export function createTasksRouter(taskService: TaskService) {
  const router = Router();

  router.get('/', async (_req, res, next) => {
    try {
      const tasks = await taskService.getAll();
      res.json(tasks);
    } catch (e) {
      next(e);
    }
  });

  router.post('/', async (req, res, next) => {
    try {
      const { title, status, projectId } = req.body;

      const pid = Number(projectId);
      if (!Number.isFinite(pid)) {
        throw new AppError(400, 'VALIDATION_ERROR', 'projectId must be a number');
      }

      const task = await taskService.create({
        title,
        status,
        projectId: pid,
      });

      res.status(201).json(task);
    } catch (e) {
      next(e);
    }
  });

  router.patch('/:id/done', async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isFinite(id)) {
        throw new AppError(400, 'VALIDATION_ERROR', 'id must be a number');
      }

      const task = await taskService.markAsDone(id);
      res.json(task);
    } catch (e) {
      next(e);
    }
  });

  return router;
}
