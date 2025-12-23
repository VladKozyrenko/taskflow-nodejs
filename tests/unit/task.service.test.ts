import { TaskService } from '../../src/services/task.service';

describe('TaskService (unit)', () => {
  let service: TaskService;

  beforeEach(() => {
    service = new TaskService();
  });

  test('creates a task with default status', () => {
    const task = service.create({ title: 'Test task' });

    expect(task.id).toBeDefined();
    expect(task.title).toBe('Test task');
    expect(task.status).toBe('todo');
  });

  test('throws error when title is empty', () => {
    expect(() => {
      service.create({ title: '' });
    }).toThrow('Title is required');
  });

  test('returns all created tasks', () => {
    service.create({ title: 'Task 1' });
    service.create({ title: 'Task 2' });

    const tasks = service.getAll();
    expect(tasks).toHaveLength(2);
  });

  test('marks task as done', () => {
    const task = service.create({ title: 'Finish lab' });

    const updated = service.markAsDone(task.id);
    expect(updated.status).toBe('done');
  });

  test('throws error if task does not exist', () => {
    expect(() => {
      service.markAsDone(999);
    }).toThrow('Task not found');
  });
});
