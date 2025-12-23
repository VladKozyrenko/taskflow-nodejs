import express from 'express';
import usersRouter from './routes/users.routes';
import projectsRouter from './routes/projects.routes';
import tasksRouter from './routes/tasks.routes';

const app = express();

app.use(express.json());

app.use('/users', usersRouter);
app.use('/projects', projectsRouter);
app.use('/tasks', tasksRouter);

export default app;
