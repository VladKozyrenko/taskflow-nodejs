import { TaskService } from '../../src/services/task.service';
import type { TaskRepository } from '../../src/repositories/task.repository';
import type { ProjectsRepository } from '../../src/repositories/project.repository';
import type { Project, Task } from '@prisma/client';

describe('TaskService (unit)', () => {
  function makeRepos() {
    const tasksRepo: jest.Mocked<
      Pick<TaskRepository, 'create' | 'findAllWithProject' | 'findById' | 'updateStatus'>
    > = {
      create: jest.fn(),
      findAllWithProject: jest.fn(),
      findById: jest.fn(),
      updateStatus: jest.fn(),
    };

    const projectsRepo: jest.Mocked<Pick<ProjectsRepository, 'findById'>> = {
      findById: jest.fn(),
    };

    return { tasksRepo, projectsRepo };
  }

  const mockProject = { id: 1 } as Project;

  const mockTask = { id: 1, title: 'A', status: 'todo', projectId: 1 } as Task;

  test('throws error when title is empty', async () => {
    const { tasksRepo, projectsRepo } = makeRepos();
    projectsRepo.findById.mockResolvedValue(mockProject);

    const service = new TaskService(tasksRepo, projectsRepo);

    await expect(service.create({ title: '   ', projectId: 1 })).rejects.toThrow(
      'Title is required'
    );

    expect(tasksRepo.create).not.toHaveBeenCalled();
  });

  test('throws error when project does not exist', async () => {
    const { tasksRepo, projectsRepo } = makeRepos();
    projectsRepo.findById.mockResolvedValue(null);

    const service = new TaskService(tasksRepo, projectsRepo);

    await expect(service.create({ title: 'A', projectId: 123 })).rejects.toThrow(
      'Project not found'
    );

    expect(tasksRepo.create).not.toHaveBeenCalled();
  });

  test('creates a task with default status', async () => {
    const { tasksRepo, projectsRepo } = makeRepos();
    projectsRepo.findById.mockResolvedValue(mockProject);
    tasksRepo.create.mockResolvedValue(mockTask);

    const service = new TaskService(tasksRepo, projectsRepo);

    const created = await service.create({ title: 'A', projectId: 1 });

    expect(projectsRepo.findById).toHaveBeenCalledWith(1);
    expect(tasksRepo.create).toHaveBeenCalledWith({
      title: 'A',
      status: 'todo',
      projectId: 1,
    });

    expect(created.status).toBe('todo');
  });
});
