export interface User {
  id: number;
  username: string;
  email: string;
  createdAt: string;
  createdProjects: Project[];
  memberProjects: Project[];
  assignedTasks: Task[];
}

export interface Project {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  createdAt: string;
  updatedAt: string;
  project: Project;
} 