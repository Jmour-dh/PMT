import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import {
  ProjectService,
  Project,
  Role,
} from '../../services/project.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../services/user.service';
import { CreateTaskModalComponent } from '../../components/create-task-modal/create-task-modal.component';
import { ModalAssignComponent } from '../../components/modal-assign/modal-assign.component';
import { TaskHistoryModalComponent } from '../../components/task-history-modal/task-history-modal.component';
import { TaskService } from '../../services/Task.service';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    CreateTaskModalComponent,
    ModalAssignComponent,
    TaskHistoryModalComponent,
  ],
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
                <span class="info-value">{{
                  project.startDate | date : 'dd/MM/yyyy'
                }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Nombre de membres</span>
                <span class="info-value">{{
                  project.members.length || 0
                }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Nombre total de tâches</span>
                <span class="info-value">{{ project.tasks.length || 0 }}</span>
              </div>
            </div>
          </div>

          <div class="members-section">
            <h2>Membres du projet</h2>
            <div class="members-list">
              <div *ngFor="let member of project.members" class="member-card">
                <div class="member-avatar">
                  {{ member.username.charAt(0).toUpperCase() }}
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
                  <div
                    *ngFor="let task of todoTasks"
                    class="task-card"
                    (click)="openTaskHistoryModal(task.id)"
                  >
                    <div
                      class="edit-icon"
                      *ngIf="!isObserver"
                      (click)="openEditModal($event, task)"
                    >
                      ✏️
                    </div>
                    <div class="title-span">
                      <div>
                        <h4>{{ task.title }}</h4>
                      </div>
                      <div
                        *ngIf="!task.assigneeId"
                        class="unassigned-icon"
                        (click)="openAssignTaskModal($event, task.id)"
                      >
                        <span>⚠️</span>
                        <div class="tooltip-text">Tâche non assignée</div>
                      </div>
                    </div>

                    <p>{{ task.description }}</p>
                    <div class="task-meta">
                      <span class="task-assignee" *ngIf="task.assigneeId">
                        Assigné à: {{ getUsernameById(task.assigneeId) }}
                      </span>
                      <div class="task-details-row">
                        <span class="task-due-date" *ngIf="task.dueDate">
                          Date d'échéance:
                          {{ task.dueDate | date : 'dd/MM/yyyy' }}
                        </span>
                        <span
                          class="task-priority"
                          [ngClass]="'priority-' + task.priority?.toLowerCase()"
                        >
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
                  <div
                    *ngFor="let task of inProgressTasks"
                    class="task-card"
                    (click)="openTaskHistoryModal(task.id)"
                  >
                    <div
                      class="edit-icon"
                      *ngIf="!isObserver"
                      (click)="openEditModal($event, task)"
                    >
                      ✏️
                    </div>
                    <div class="title-span">
                      <div>
                        <h4>{{ task.title }}</h4>
                      </div>
                      <div
                        *ngIf="!task.assigneeId"
                        class="unassigned-icon"
                        (click)="openAssignTaskModal($event, task.id)"
                      >
                        <span>⚠️</span>
                        <div class="tooltip-text">Tâche non assignée</div>
                      </div>
                    </div>
                    <p>{{ task.description }}</p>
                    <div class="task-meta">
                      <span class="task-assignee" *ngIf="task.assigneeId">
                        Assigné à: {{ getUsernameById(task.assigneeId) }}
                      </span>
                      <div class="task-details-row">
                        <span class="task-due-date" *ngIf="task.dueDate">
                          Échéance: {{ task.dueDate | date : 'dd/MM/yyyy' }}
                        </span>
                        <span
                          class="task-priority"
                          [ngClass]="'priority-' + task.priority?.toLowerCase()"
                        >
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
                  <div
                    *ngFor="let task of doneTasks"
                    class="task-card"
                    (click)="openTaskHistoryModal(task.id)"
                  >
                    <div
                      class="edit-icon"
                      *ngIf="!isObserver"
                      (click)="openEditModal($event, task)"
                    >
                      ✏️
                    </div>
                    <div class="title-span">
                      <div>
                        <h4>{{ task.title }}</h4>
                      </div>
                      <div
                        *ngIf="!task.assigneeId"
                        class="unassigned-icon"
                        (click)="openAssignTaskModal($event, task.id)"
                      >
                        <span>⚠️</span>
                        <div class="tooltip-text">Tâche non assignée</div>
                      </div>
                    </div>

                    <p>{{ task.description }}</p>
                    <div class="task-meta">
                      <span class="task-assignee" *ngIf="task.assigneeId">
                        Assigné à: {{ getUsernameById(task.assigneeId) }}
                      </span>
                      <div class="task-details-row">
                        <span class="task-due-date" *ngIf="task.dueDate">
                          Terminé le: {{ task.dueDate | date : 'dd/MM/yyyy' }}
                        </span>
                        <span
                          class="task-priority"
                          [ngClass]="'priority-' + task.priority?.toLowerCase()"
                        >
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

      <div *ngIf="!isLoading">
        <div class="fab-container" *ngIf="!isObserver">
          <div class="fab-menu" [class.open]="isFabOpen">
            <button
              class="fab-item"
              (click)="openInviteMember()"
              *ngIf="!isMember"
            >
              <span class="fab-icon">👥</span>
              <span class="fab-label">Inviter un membre</span>
            </button>
            <button class="fab-item" (click)="openCreateTaskModal()">
              <span class="fab-icon">➕</span>
              <span class="fab-label">Créer une tâche</span>
            </button>
          </div>
          <button class="fab-button" (click)="toggleFab()">
            <span class="fab-icon">⚙️</span>
          </button>
        </div>
      </div>

      <!-- Modal de création de tâche -->
      <app-create-task-modal
        *ngIf="showCreateTaskModal"
        [taskToEdit]="selectedTask"
        [isEditMode]="isEditMode"
        (close)="closeCreateTaskModal()"
        (taskCreated)="handleTaskCreated(); loadProjectDetails(project!.id)"
        (taskUpdated)="handleTaskUpdated(); loadProjectDetails(project!.id)"
      ></app-create-task-modal>

      <div class="toast" *ngIf="showSuccessToast" [@fadeInOut]>
        <span class="toast-icon">✅</span>
        <span class="toast-message">Invitation envoyée avec succès</span>
      </div>

      <div class="toast" *ngIf="showSuccessToastTask">
        <span class="toast-icon">✅</span>
        <span class="toast-message">Tâche créée avec succès</span>
      </div>

      <div class="toast-update" *ngIf="showSuccessUpdateToastTask">
        <span class="toast-icon">✅</span>
        <span class="toast-message">Tâche est mise à jour</span>
      </div>

      <div class="toast-delete" *ngIf="showSuccessDeleteToastTask">
        <span class="toast-icon">✅</span>
        <span class="toast-message">Tâche supprimé avec succès</span>
      </div>

      <div class="toast" *ngIf="showSuccessToastTaskAssigned">
        <span class="toast-icon">✅</span>
        <span class="toast-message">Tâche assignée avec succès</span>
      </div>
      <div
        class="modal-overlay"
        *ngIf="showInviteModal"
        (click)="closeInviteModal()"
      >
        <div class="modal-content" (click)="$event.stopPropagation()">
          <h2>Inviter un membre</h2>
          <form (ngSubmit)="submitInvitation()">
            <div class="form-group">
              <label for="email">Email</label>
              <input
                type="email"
                id="email"
                [(ngModel)]="inviteEmail"
                name="email"
                required
                placeholder="Entrez l'email du membre"
                [class.error]="errorMessage"
              />
            </div>
            <div class="form-group">
              <label for="role">Rôle</label>
              <select id="role" [(ngModel)]="selectedRole" name="role" required>
                <option *ngFor="let role of roles" [value]="role">
                  {{ role }}
                </option>
              </select>
            </div>
            <div class="error-message" *ngIf="errorMessage">
              {{ errorMessage }}
            </div>
            <div class="modal-actions">
              <button
                type="button"
                class="cancel-btn"
                (click)="closeInviteModal()"
              >
                Annuler
              </button>
              <button type="submit" class="submit-btn">Inviter</button>
            </div>
          </form>
        </div>
      </div>
      <!-- ModalAssignComponent -->
      <app-modal-assign
        *ngIf="showAssignTaskModal"
        [members]="project?.members ?? []"
        [taskId]="selectedTaskId"
        [projectId]="project?.id ?? null"
        (closeModal)="closeAssignTaskModal()"
        (taskAssigned)="onTaskAssigned(); loadProjectDetails(project!.id)"
      ></app-modal-assign>

      <app-task-history-modal
        *ngIf="showTaskHistoryModal"
        [project]="currentProject"
        [taskId]="selectedTaskId"
        (close)="onModalClose()"
        (deleteTask)="handleDeleteTask($event)"
      >
      </app-task-history-modal>
    </div>
  `,
  styles: [
    `
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

      .title-span {
        display: flex;
        justify-content: space-between;
        align-items: center;
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
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
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

      .info-section,
      .members-section,
      .tasks-section {
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
        cursor: pointer;
        position: relative;
      }

      .task-card .edit-icon {
        position: absolute;
        top: -0.5rem;
        right: 0.1rem;
        width: 1rem;
        height: 1rem;
        cursor: pointer;
        z-index: 10;
      }

      .task-card .edit-icon img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }

      .unassigned-icon {
        position: relative;
        display: inline-block;
        cursor: pointer;
      }

      .tooltip-icon {
        font-size: 18px;
        color: #ff9800;
      }

      .tooltip-text {
        visibility: hidden;
        width: 150px;
        background-color: #333;
        color: #fff;
        text-align: center;
        border-radius: 4px;
        padding: 5px;
        position: absolute;
        bottom: 125%;
        left: 50%;
        transform: translateX(-50%);
        opacity: 0;
        transition: opacity 0.3s;
        z-index: 1;
      }

      .unassigned-icon:hover .tooltip-text {
        visibility: visible;
        opacity: 1;
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

      .fab-container {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
      }

      .fab-button {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background-color: #667eea;
        color: white;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        transition: transform 0.3s ease;
      }

      .fab-button:hover {
        transform: scale(1.1);
      }

      .fab-menu {
        position: absolute;
        bottom: 70px;
        right: 0;
        display: flex;
        flex-direction: column;
        gap: 10px;
        opacity: 0;
        visibility: hidden;
        transform: translateY(20px);
        transition: all 0.3s ease;
      }

      .fab-menu.open {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
      }

      .fab-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 20px;
        background-color: white;
        border: none;
        border-radius: 30px;
        cursor: pointer;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        transition: transform 0.2s ease;
      }

      .fab-item:hover {
        transform: translateX(-5px);
      }

      .fab-icon {
        font-size: 20px;
      }

      .fab-label {
        font-size: 14px;
        color: #2c3e50;
      }

      /* Styles pour la modal */
      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
      }

      .modal-content {
        background: white;
        padding: 2rem;
        border-radius: 8px;
        width: 90%;
        max-width: 500px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      }

      .modal-content h2 {
        margin-bottom: 1.5rem;
        color: #2c3e50;
      }

      .form-group {
        margin-bottom: 1.5rem;
      }

      .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        color: #2c3e50;
        font-weight: 500;
      }

      .form-group input,
      .form-group select {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 1rem;
      }

      .modal-actions {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        margin-top: 2rem;
      }

      .cancel-btn {
        padding: 0.75rem 1.5rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        background: white;
        color: #2c3e50;
        cursor: pointer;
      }

      .submit-btn {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 4px;
        background: #667eea;
        color: white;
        cursor: pointer;
      }

      .submit-btn:hover {
        background: #5a67d8;
      }

      /* Styles pour le toast */
      .toast {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: #4caf50;
        color: white;
        padding: 12px 24px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        gap: 8px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        z-index: 1001;
        animation: fadeInOut 3s ease-in-out;
      }

      .toast-update {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: #0ebeff;
        color: white;
        padding: 12px 24px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        gap: 8px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        z-index: 1001;
        animation: fadeInOut 3s ease-in-out;
      }

      .toast-delete {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: #ff0000;
        color: white;
        padding: 12px 24px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        gap: 8px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        z-index: 1001;
        animation: fadeInOut 3s ease-in-out;
      }


      .toast-icon {
        font-size: 18px;
      }

      .toast-message {
        font-size: 14px;
      }

      @keyframes fadeInOut {
        0% {
          opacity: 0;
          transform: translateY(20px);
        }
        10% {
          opacity: 1;
          transform: translateY(0);
        }
        90% {
          opacity: 1;
          transform: translateY(0);
        }
        100% {
          opacity: 0;
          transform: translateY(20px);
        }
      }

      .error-message {
        color: #dc3545;
        font-size: 14px;
        margin-top: 8px;
        margin-bottom: 16px;
      }

      .form-group input.error {
        border-color: #dc3545;
      }
    `,
  ],
})
export class ProjectDetailsComponent implements OnInit {
  project: Project | null = null;
  isLoading = true;
  todoTasks: any[] = [];
  inProgressTasks: any[] = [];
  doneTasks: any[] = [];
  isFabOpen = false;
  isObserver = false;
  isMember = false;
  showInviteModal = false;
  inviteEmail = '';
  selectedRole: Role = Role.MEMBER;
  roles = Object.values(Role);
  showSuccessToast = false;
  errorMessage = '';
  showCreateTaskModal = false;
  showSuccessToastTask = false;
  showAssignTaskModal = false;
  showSuccessToastTaskAssigned = false;
  selectedTaskId: number | null = null;
  showTaskHistoryModal = false;
  selectedTask: any;
  isEditMode = false;
  taskToEdit: any = null;
  showSuccessUpdateToastTask = false;
  showSuccessDeleteToastTask = false;
  currentProject: any;
  currentUserId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private userService: UserService,
    private taskService: TaskService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const projectId = this.route.snapshot.paramMap.get('id');
    if (projectId) {
      this.loadProjectDetails(parseInt(projectId));
    } else {
      console.error('No project ID found in route parameters');
      this.isLoading = false;
    }

    this.userService.getUserProfile().subscribe({
      next: (user) => {
        this.currentUserId = user.id;
      },
      error: (error) => {
        console.error('Error fetching user profile:', error);
        this.isLoading = false;
      }
    });
  }

  

  loadProjectDetails(projectId: number): void {
    this.isLoading = true;
    setTimeout(() => {
      this.projectService.getProjectById(projectId).subscribe({
        next: (project) => {
          this.project = project;
          this.categorizeTasks(project.tasks || []);
          this.checkUserRole();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading project details:', error);
          this.isLoading = false;
        },
      });
    }, 400);
  }

  categorizeTasks(tasks: any[]): void {
    this.todoTasks = tasks.filter((task) => task.status === 'TODO');
    this.inProgressTasks = tasks.filter(
      (task) => task.status === 'IN_PROGRESS'
    );
    this.doneTasks = tasks.filter((task) => task.status === 'DONE');
  }

  getUsernameById(userId: number): string {
    if (!this.project?.members) return 'Inconnu';
    const member = this.project.members.find((m) => m.userId === userId);
    return member?.username || 'Inconnu';
  }

  toggleFab() {
    this.isFabOpen = !this.isFabOpen;
  }

  openInviteMember() {
    this.showInviteModal = true;
    this.isFabOpen = false;
  }

  closeInviteModal() {
    this.showInviteModal = false;
    this.inviteEmail = '';
    this.selectedRole = Role.MEMBER;
    this.errorMessage = '';
  }

  showToast() {
    this.showSuccessToast = true;
    setTimeout(() => {
      this.showSuccessToast = false;
    }, 3000);
  }

  handleTaskCreated(): void {
    this.closeCreateTaskModal();
    this.showSuccessToastTask = true;

    setTimeout(() => {
      this.showSuccessToastTask = false;
    }, 3000);
  }

  handleTaskUpdated(): void {
    this.closeCreateTaskModal();
    this.showSuccessUpdateToastTask = true;

    setTimeout(() => {
      this.showSuccessUpdateToastTask = false;
    }, 3000);
  }

  submitInvitation() {
    if (!this.project) return;
    this.errorMessage = '';

    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    const body = {
      email: this.inviteEmail,
      role: this.selectedRole,
    };

    this.http
      .post(`/api/projects/${this.project.id}/invite`, body, { headers })
      .subscribe({
        next: () => {
          this.showToast();
          this.closeInviteModal();
          this.loadProjectDetails(this.project!.id);
        },
        error: (error) => {
          console.error("Erreur lors de l'envoi de l'invitation:", error);

          switch (error.status) {
            case 409:
              this.errorMessage = 'Cet utilisateur est déjà membre du projet';
              break;
            case 400:
              this.errorMessage =
                "Cet utilisateur n'existe pas dans le système";
              break;
            default:
              this.errorMessage =
                error.error?.message ||
                "Une erreur est survenue lors de l'envoi de l'invitation";
          }
        },
      });
  }

  checkUserRole(): void {
    if (!this.project || !this.project.members) return;

    this.isLoading = true;
    this.userService.getUserProfile().subscribe({
      next: (user) => {
        const currentUser = this.project!.members.find(
          (member) => member.userId === user.id
        );
        this.isObserver = currentUser?.role === 'OBSERVER';
        this.isMember = currentUser?.role === 'MEMBER';
        this.isLoading = false;
      },
      error: (error) => {
        console.error(
          'Erreur lors de la récupération du profil utilisateur:',
          error
        );
        this.isLoading = false;
      },
    });
  }

  openCreateTaskModal(): void {
    this.selectedTask = null;
    this.isEditMode = false;
    this.taskToEdit = null;
    this.showCreateTaskModal = true;
    this.isFabOpen = false;
  }

  openEditModal(event: Event, task: any) {
    event.stopPropagation();
    this.selectedTask = task;
    this.isEditMode = true;
    this.showCreateTaskModal = true;
  }

  closeCreateTaskModal(): void {
    this.showCreateTaskModal = false;
    this.isEditMode = false;
    this.taskToEdit = null;
  }

  openAssignTaskModal(event: Event, taskId: number): void {
    event.stopPropagation();
    if (this.isObserver) {
      window.alert("Vous n'avez pas la permission d'assigner une tâche.");
      return;
    }
    this.selectedTaskId = taskId;
    this.showAssignTaskModal = true;  
  }

  closeAssignTaskModal(): void {
    this.showAssignTaskModal = false;
    this.selectedTaskId = null;
    this.currentProject = null;
  }

  onTaskAssigned(): void {
    this.closeAssignTaskModal();
    this.showSuccessToastTaskAssigned = true;

    setTimeout(() => {
      this.showSuccessToastTaskAssigned = false;
    }, 3000);
  }

  openTaskHistoryModal(taskId: number): void {
    this.selectedTaskId = taskId;
    this.showTaskHistoryModal = true;
    this.currentProject= this.project;
  }

  onModalClose(): void {
    this.showTaskHistoryModal = false;
  }

  handleDeleteTask(taskId: number): void {
    if (!this.project || !this.currentUserId) {
        console.error('Impossible de supprimer la tâche : projet ou utilisateur non défini.');
        return;
    }

    this.taskService.deleteTask(taskId, this.currentUserId).subscribe({
        next: () => {
            if (this.project) {
                this.loadProjectDetails(this.project.id);
            }
            this.showTaskHistoryModal = false;
            this.showSuccessDeleteToastTask = true;

    setTimeout(() => {
      this.showSuccessDeleteToastTask = false;
    }, 3000);
        },
        error: (error) => {
            console.error('Erreur lors de la suppression de la tâche :', error);
        },
    });
}


}
