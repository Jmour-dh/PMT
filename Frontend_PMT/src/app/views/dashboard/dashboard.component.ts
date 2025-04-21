import { Component, OnInit } from '@angular/core';
import { ProjectService, Project } from '../../services/project.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <h1 class="dashboard-title">Tableau de bord des projets</h1>
      
      <div *ngIf="projects.length === 0" class="no-projects">
        <p>Aucun projet n'est disponible pour le moment.</p>
      </div>
      
      <div class="projects-grid" *ngIf="projects.length > 0">
        <div *ngFor="let project of projects" class="project-card">
          <div class="project-header">
            <h2 class="project-name">{{ project.name }}</h2>
          </div>
          
          <p class="project-description">{{ project.description }}</p>
          
          <div class="project-info">
            <div class="info-item">
              <span class="info-label">Membres</span>
              <span class="info-value">{{ project.members?.length || 0 }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Tâches</span>
              <span class="info-value">{{ project.tasks?.length || 0 }}</span>
            </div>
          </div>
          
          <div class="project-dates">
            <span>Date de début: {{ project.startDate | date:'dd/MM/yyyy' }}</span>
          </div>
          
          <div class="project-actions">
            <a [routerLink]="['/projects', project.id]" class="details-link">
              Voir les détails
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
      min-height: calc(100vh - 64px);
      background-color: #f5f5f5;
    }

    .dashboard-title {
      font-size: 2rem;
      font-weight: bold;
      margin-bottom: 2rem;
      color: #333;
    }

    .no-projects {
      text-align: center;
      padding: 2rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .no-projects p {
      color: #666;
      font-size: 1.1rem;
    }

    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .project-card {
      background: white;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .project-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }

    .project-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }

    .project-name {
      font-size: 1.25rem;
      font-weight: 600;
      color: #2c3e50;
      margin: 0;
    }

    .project-status {
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .status-in-progress {
      background-color: #e6f4ea;
      color: #1e7e34;
    }

    .status-planned {
      background-color: #e3f2fd;
      color: #0d47a1;
    }

    .status-completed {
      background-color: #f5f5f5;
      color: #616161;
    }

    .project-description {
      color: #666;
      margin-bottom: 1rem;
      line-height: 1.5;
    }

    .project-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 1rem;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.25rem;
    }

    .info-label {
      font-size: 0.875rem;
      color: #666;
    }

    .info-value {
      font-size: 1.25rem;
      font-weight: 600;
      color: #2c3e50;
    }

    .project-dates {
      display: flex;
      justify-content: space-between;
      font-size: 0.875rem;
      color: #666;
      margin-bottom: 1rem;
    }

    .project-actions {
      margin-top: 1rem;
    }

    .details-link {
      color: #2196f3;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s;
    }

    .details-link:hover {
      color: #1976d2;
    }

    @media (max-width: 768px) {
      .dashboard-container {
        padding: 1rem;
      }

      .projects-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  projects: Project[] = [];

  constructor(private projectService: ProjectService) {
    console.log('DashboardComponent initialized');
  }

  ngOnInit(): void {
    console.log('ngOnInit called');
    this.loadProjects();
  }

  loadProjects(): void {
    console.log('Loading projects...');
    this.projectService.getAllProjects().subscribe({
      next: (projects: Project[]) => {
        this.projects = projects;
      },
      error: (error: any) => {
        console.error('Error loading projects:', error);
      }
    });
  }

}
