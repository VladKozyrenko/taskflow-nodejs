import { prisma } from '../prisma';
import type { Project, Task } from '@prisma/client';
import type { TaskStatus } from '../services/task.service';

export type TaskWithProject = Task & { project: Project };

export class TaskRepository {
  async findAllWithProject(): Promise<TaskWithProject[]> {
    return prisma.task.findMany({
      include: { project: true },
    });
  }

  async create(data: { title: string; status: TaskStatus; projectId: number }): Promise<Task> {
    return prisma.task.create({
      data: {
        title: data.title,
        status: data.status,
        project: {
          connect: { id: data.projectId },
        },
      },
    });
  }

  async findById(id: number): Promise<Task | null> {
    return prisma.task.findUnique({
      where: { id },
    });
  }

  async updateStatus(id: number, status: TaskStatus): Promise<Task> {
    return prisma.task.update({
      where: { id },
      data: { status },
    });
  }
}
