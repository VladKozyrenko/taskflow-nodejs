import type { TaskRepository } from '../repositories/task.repository';
import type { ProjectsRepository } from '../repositories/projects.repository';
import { AppError } from '../errors/AppError';

export type TaskStatus = 'todo' | 'in_progress' | 'done';

export interface CreateTaskInput {
  title: string;
  status?: TaskStatus;
  projectId: number;
}

export class TaskService {
  constructor(
    private readonly tasksRepo: TaskRepository,
    private readonly projectsRepo: ProjectsRepository
  ) {}

  async create(input: CreateTaskInput) {
    if (!input.title || input.title.trim().length === 0) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Title is required');
    }

    const status: TaskStatus = input.status ?? 'todo';

    const project = await this.projectsRepo.findById(input.projectId);
    if (!project) {
      throw new AppError(404, 'PROJECT_NOT_FOUND', 'Project not found');
    }

    return this.tasksRepo.create({
      title: input.title.trim(),
      status,
      projectId: input.projectId,
    });
  }

  async getAll() {
    return this.tasksRepo.findAllWithProject();
  }

  async markAsDone(id: number) {
    const existing = await this.tasksRepo.findById(id);
    if (!existing) {
      throw new AppError(404, 'TASK_NOT_FOUND', 'Task not found');
    }

    return this.tasksRepo.updateStatus(id, 'done');
  }
}
