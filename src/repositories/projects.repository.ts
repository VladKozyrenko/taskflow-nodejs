import { prisma } from '../prisma';
import type { Project } from '@prisma/client';

export class ProjectsRepository {
  findById(id: number): Promise<Project | null> {
    return prisma.project.findUnique({ where: { id } });
  }
}
