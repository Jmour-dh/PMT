export interface User {
  id: number;
  username: string;
  email: string;
  createdAt: string;
  createdProjects: Array<{
    id: number;
    name: string;
    description: string;
    startDate: string;
    createdById: number;
  }>;
  memberProjects: MemberProjects[];
  assignedTasks: Task[];
}

export interface Project {
  id: number;
  name: string;
  description: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  project: Project;
} 

export interface MemberProjects {
  id: number;
  username: string;
  role: 'ADMIN' | 'MEMBER' | 'OBSERVER';
}