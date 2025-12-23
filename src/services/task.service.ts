export type TaskStatus = 'todo' | 'in_progress' | 'done';

export interface CreateTaskInput {
  title: string;
  description?: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
}

let nextId = 1;

export class TaskService {
  private tasks: Task[] = [];

  create(input: CreateTaskInput): Task {
    if (!input.title || input.title.trim().length === 0) {
      throw new Error('Title is required');
    }

    const task: Task = {
      id: nextId++,
      title: input.title,
      description: input.description,
      status: 'todo',
    };

    this.tasks.push(task);
    return task;
  }

  getAll(): Task[] {
    return this.tasks;
  }

  markAsDone(id: number): Task {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) {
      throw new Error('Task not found');
    }

    task.status = 'done';
    return task;
  }
}
