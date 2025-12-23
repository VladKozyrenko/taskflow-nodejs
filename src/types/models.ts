export interface User {
  id: number;
  email: string;
}

export interface Project {
  id: number;
  name: string;
  ownerId: number;
}

export interface Task {
  id: number;
  title: string;
  status: 'todo' | 'in_progress' | 'done';
  projectId: number;
}
