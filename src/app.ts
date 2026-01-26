import express from 'express';

import usersRouter from './routes/users.routes';
import projectsRouter from './routes/projects.routes';
import { createTasksRouter } from './routes/tasks.routes';

import { TaskRepository } from './repositories/task.repository';
import { ProjectsRepository } from './repositories/projects.repository';
import { TaskService } from './services/task.service';

import { errorMiddleware } from './middlewares/error.middleware';

const app = express();
app.use(express.json());

// ---- Composition root ----
const taskRepo = new TaskRepository();
const projectsRepo = new ProjectsRepository();
const taskService = new TaskService(taskRepo, projectsRepo);

// Existing routers
app.use('/users', usersRouter);
app.use('/projects', projectsRouter);

// Tasks router with injected service
app.use('/tasks', createTasksRouter(taskService));

// Global error handler (must be last)
app.use(errorMiddleware);

export default app;
