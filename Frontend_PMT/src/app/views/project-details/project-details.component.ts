import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProjectService, Project, ProjectMember } from '../../services/project.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="project-details-container">
      <div *ngIf="isLoading" class="loading-overlay">
        <div class="spinner"></div>
        <p>Chargement en cours...</p>
      </div>

      <div *ngIf="!isLoading && project" class="project-content">
        <div class="project-header">
          <h1 class="project-title">{{ project.name }}</h1>
          <p class="project-description">{{ project.description }}</p>
        </div>

        <div class="project-info">
          <div class="info-section">
            <h2>Informations générales</h2>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Date de début</span>
                <span class="info-value">{{ project.startDate | date:'dd/MM/yyyy' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Nombre de membres</span>
                <span class="info-value">{{ project.members?.length || 0 }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Nombre total de tâches</span>
                <span class="info-value">{{ project.tasks?.length || 0 }}</span>
              </div>
            </div>
          </div>

          <div class="members-section">
            <h2>Membres du projet</h2>
            <div class="members-list">
              <div *ngFor="let member of project.members" class="member-card">
                <div class="member-avatar">
                  {{ member.username?.charAt(0)?.toUpperCase() }}
                </div>
                <div class="member-info">
                  <span class="member-name">{{ member.username }}</span>
                  <span class="member-role">{{ member.role }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="tasks-section">
            <h2>Tâches</h2>
            <div class="tasks-grid">
              <div class="task-column">
                <h3>Tâches à faire</h3>
                <div class="task-list">
                  <div *ngFor="let task of todoTasks" class="task-card">
                    <h4>{{ task.title }}</h4>
                    <p>{{ task.description }}</p>
                    <div class="task-meta">
                      <span class="task-assignee" *ngIf="task.assigneeId">
                        Assigné à: {{ getUsernameById(task.assigneeId) }}
                      </span>
                      <div class="task-details-row">
                        <span class="task-due-date" *ngIf="task.dueDate">
                          Échéance: {{ task.dueDate | date:'dd/MM/yyyy' }}
                        </span>
                        <span class="task-priority" [ngClass]="'priority-' + task.priority?.toLowerCase()">
                          Priorité: {{ task.priority }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="task-column">
                <h3>Tâches en cours</h3>
                <div class="task-list">
                  <div *ngFor="let task of inProgressTasks" class="task-card">
                    <h4>{{ task.title }}</h4>
                    <p>{{ task.description }}</p>
                    <div class="task-meta">
                      <span class="task-assignee" *ngIf="task.assigneeId">
                        Assigné à: {{ getUsernameById(task.assigneeId) }}
                      </span>
                      <div class="task-details-row">
                        <span class="task-due-date" *ngIf="task.dueDate">
                          Échéance: {{ task.dueDate | date:'dd/MM/yyyy' }}
                        </span>
                        <span class="task-priority" [ngClass]="'priority-' + task.priority?.toLowerCase()">
                          Priorité: {{ task.priority }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="task-column">
                <h3>Tâches terminées</h3>
                <div class="task-list">
                  <div *ngFor="let task of doneTasks" class="task-card">
                    <h4>{{ task.title }}</h4>
                    <p>{{ task.description }}</p>
                    <div class="task-meta">
                      <span class="task-assignee" *ngIf="task.assigneeId">
                        Assigné à: {{ getUsernameById(task.assigneeId) }}
                      </span>
                      <div class="task-details-row">
                        <span class="task-due-date" *ngIf="task.dueDate">
                          Terminé le: {{ task.dueDate | date:'dd/MM/yyyy' }}
                        </span>
                        <span class="task-priority" [ngClass]="'priority-' + task.priority?.toLowerCase()">
                          Priorité: {{ task.priority }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="!isLoading && !project" class="error-message">
        <p>Projet non trouvé</p>
      </div>
    </div>
  `,
  styles: [`
    .project-details-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
      min-height: calc(100vh - 64px);
      background-color: #f5f5f5;
    }

    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(255, 255, 255, 0.8);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .spinner {
      width: 50px;
      height: 50px;
      border: 5px solid #f3f3f3;
      border-top: 5px solid #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .project-content {
      background: white;
      border-radius: 8px;
      padding: 2rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .project-header {
      margin-bottom: 2rem;
    }

    .project-title {
      font-size: 2rem;
      color: #2c3e50;
      margin-bottom: 1rem;
    }

    .project-description {
      color: #666;
      font-size: 1.1rem;
      line-height: 1.5;
    }

    .info-section, .members-section, .tasks-section {
      margin-bottom: 2rem;
    }

    h2 {
      font-size: 1.5rem;
      color: #2c3e50;
      margin-bottom: 1rem;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .info-item {
      background: #f8fafc;
      padding: 1rem;
      border-radius: 6px;
    }

    .info-label {
      display: block;
      color: #666;
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
    }

    .info-value {
      font-size: 1.2rem;
      font-weight: 600;
      color: #2c3e50;
    }

    .members-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1rem;
    }

    .member-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: #f8fafc;
      border-radius: 6px;
    }

    .member-avatar {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
    }

    .member-info {
      display: flex;
      flex-direction: column;
    }

    .member-name {
      font-weight: 600;
      color: #2c3e50;
    }

    .member-role {
      font-size: 0.8rem;
      color: #666;
    }

    .tasks-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .task-column {
      background: #f8fafc;
      padding: 1rem;
      border-radius: 6px;
    }

    .task-column h3 {
      font-size: 1.2rem;
      color: #2c3e50;
      margin-bottom: 1rem;
      text-align: center;
    }

    .task-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .task-card {
      background: white;
      padding: 1rem;
      border-radius: 6px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .task-card h4 {
      color: #2c3e50;
      margin-bottom: 0.5rem;
    }

    .task-card p {
      color: #666;
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
    }

    .task-meta {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-top: 0.5rem;
      font-size: 0.9rem;
    }

    .task-details-row {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .task-priority {
      display: inline-block;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-weight: 500;
    }

    .priority-low {
      background-color: #e2f3e2;
      color: #2e7d32;
    }

    .priority-medium {
      background-color: #fff3e0;
      color: #f57c00;
    }

    .priority-high {
      background-color: #ffebee;
      color: #c62828;
    }

    .task-due-date {
      color: #666;
    }

    .task-assignee {
      color: #666;
    }

    .error-message {
      text-align: center;
      padding: 2rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .error-message p {
      color: #dc3545;
      font-size: 1.1rem;
    }

    @media (max-width: 768px) {
      .project-details-container {
        padding: 1rem;
      }

      .project-content {
        padding: 1rem;
      }

      .tasks-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ProjectDetailsComponent implements OnInit {
  project: Project | null = null;
  isLoading = true;
  todoTasks: any[] = [];
  inProgressTasks: any[] = [];
  doneTasks: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    const projectId = this.route.snapshot.paramMap.get('id');
    console.log('Project ID from route:', projectId);
    if (projectId) {
      this.loadProjectDetails(parseInt(projectId));
    } else {
      console.error('No project ID found in route parameters');
      this.isLoading = false;
    }
  }

  loadProjectDetails(projectId: number): void {
    console.log('Loading project details for ID:', projectId);
    this.isLoading = true;
    this.projectService.getProjectById(projectId).subscribe({
      next: (project) => {
        console.log('Project details loaded:', project);
        this.project = project;
        this.categorizeTasks(project.tasks || []);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading project details:', error);
        this.isLoading = false;
      }
    });
  }

  categorizeTasks(tasks: any[]): void {
    this.todoTasks = tasks.filter(task => task.status === 'TODO');
    this.inProgressTasks = tasks.filter(task => task.status === 'IN_PROGRESS');
    this.doneTasks = tasks.filter(task => task.status === 'DONE');
    console.log('Tasks categorized:', {
      todo: this.todoTasks.length,
      inProgress: this.inProgressTasks.length,
      done: this.doneTasks.length
    });
  }

  getUsernameById(userId: number): string {
    if (!this.project?.members) return 'Inconnu';
    const member = this.project.members.find(m => m.userId === userId);
    return member?.username || 'Inconnu';
  }
} 