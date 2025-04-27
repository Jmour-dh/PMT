import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { formatDate } from '@angular/common';

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE'
}

export enum Role {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
  OBSERVER = 'OBSERVER'
}

export interface ProjectMember {
  userId: number;
  username: string;
  role: Role;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  createdById: number;
  assigneeId: number | null;
  projectId: number;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  startDate: string; 
  createdById: number;
  members: ProjectMember[];
  tasks: Task[];
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  constructor(private http: HttpClient) { }

  getAllProjects(): Observable<Project[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<Project[]>('/api/projects/', { headers });
  }

  getProjectById(id: number): Observable<Project> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<Project>(`/api/projects/${id}`, { headers });
  }

  createProject(project: any): Observable<Project> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    const formattedProject = {
      ...project,
      startDate: formatDate(project.startDate, 'yyyy-MM-dd', 'fr-FR')
    };

    return this.http.post<Project>('/api/projects/', formattedProject, { headers });
  }

  updateProject(project: Project): Observable<Project> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    const formattedProject = {
      ...project,
      startDate: formatDate(project.startDate, 'yyyy-MM-dd', 'fr-FR')
    };

    return this.http.put<Project>(`/api/projects/${project.id}`, formattedProject, { headers });
  }
} 