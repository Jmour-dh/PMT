import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskPriority, TaskStatus } from '../../services/project.service';
import { UserService } from '../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from '../../services/Task.service';

@Component({
  selector: 'app-create-task-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay" (click)="closeModal()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>
            {{
              isEditMode
                ? 'Mettre à jour cette tâche'
                : 'Créer une nouvelle tâche'
            }}
          </h2>
          <button class="close-btn" (click)="closeModal()">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <form
          (ngSubmit)="onSubmit($event)"
          #taskForm="ngForm"
          class="task-form"
        >
          <div class="form-group">
            <label for="title">Titre</label>
            <input
              type="text"
              id="title"
              name="title"
              [(ngModel)]="task.title"
              required
              class="form-control"
              placeholder="Entrez le titre de la tâche"
            />
          </div>

          <div class="form-group">
            <label for="description">Description</label>
            <textarea
              id="description"
              name="description"
              [(ngModel)]="task.description"
              required
              class="form-control"
              placeholder="Décrivez la tâche"
              rows="4"
            ></textarea>
          </div>

          <div class="form-group">
            <label for="priority">Priorité</label>
            <select
              id="priority"
              name="priority"
              [(ngModel)]="task.priority"
              required
              class="form-control"
            >
              <option *ngFor="let priority of priorities" [value]="priority">
                {{ priority }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="status">Statut</label>
            <select
              id="status"
              name="status"
              [(ngModel)]="task.status"
              required
              class="form-control"
            >
              <option *ngFor="let status of statuses" [value]="status">
                {{ status }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label for="dueDate">Date d'échéance</label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              [(ngModel)]="task.dueDate"
              required
              class="form-control"
            />
          </div>

          <div class="form-actions">
            <button type="button" class="btn btn-cancel" (click)="closeModal()">
              Annuler
            </button>
            <button
              type="submit"
              class="btn btn-submit"
              [disabled]="!taskForm.valid || isLoading"
            >
              <span *ngIf="!isLoading">{{
                isEditMode ? 'Mettre à jour' : 'Créer la tâche'
              }}</span>
              <span *ngIf="isLoading">
                <i class="fas fa-spinner fa-spin"></i>
                {{
                  isEditMode
                    ? 'Mise à jour en cours...'
                    : 'Création en cours...'
                }}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [
    `
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
        border-radius: 12px;
        width: 90%;
        max-width: 600px;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        animation: modalFadeIn 0.3s ease-out;
      }

      @keyframes modalFadeIn {
        from {
          opacity: 0;
          transform: translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem;
        border-bottom: 1px solid #e9ecef;
      }

      .modal-header h2 {
        margin: 0;
        color: #2c3e50;
        font-size: 1.5rem;
      }

      .close-btn {
        background: none;
        border: none;
        font-size: 1.2rem;
        color: #6c757d;
        cursor: pointer;
        padding: 0.5rem;
        transition: color 0.2s;
      }

      .close-btn:hover {
        color: #343a40;
      }

      .task-form {
        padding: 1.5rem;
      }

      .form-group {
        margin-bottom: 1.5rem;
      }

      .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        color: #495057;
        font-weight: 500;
      }

      .form-control {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #ced4da;
        border-radius: 6px;
        font-size: 1rem;
        transition: border-color 0.2s, box-shadow 0.2s;
      }

      .form-control:focus {
        outline: none;
        border-color: #80bdff;
        box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
      }

      .form-actions {
        display: flex;
        gap: 1rem;
        margin-top: 2rem;
      }

      .btn {
        flex: 1;
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 6px;
        font-size: 1rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
      }

      .btn-cancel {
        background-color: #e9ecef;
        color: #495057;
      }

      .btn-cancel:hover {
        background-color: #dee2e6;
      }

      .btn-submit {
        background-color: #007bff;
        color: white;
      }

      .btn-submit:hover:not(:disabled) {
        background-color: #0056b3;
      }

      .btn-submit:disabled {
        background-color: #b3d7ff;
        cursor: not-allowed;
      }

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
    `,
  ],
})
export class CreateTaskModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() taskCreated = new EventEmitter<void>();
  @Output() taskUpdated = new EventEmitter<void>();
  @Input() isEditMode = false;
  @Input() taskId: number | null = null;
  @Input() set taskToEdit(task: any) {
    if (task) {
      this.isEditMode = true;
      this.taskId = task.id;
      this.task = {
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate.split('T')[0],
        createdById: task.createdById,
        projectId: task.projectId,
      };
    } else {
      this.resetForm();
    }
  }

  task = {
    title: '',
    description: '',
    priority: TaskPriority.MEDIUM,
    status: TaskStatus.TODO,
    dueDate: '',
    createdById: 0,
    projectId: 0,
  };

  resetForm() {
    this.task = {
      title: '',
      description: '',
      priority: TaskPriority.MEDIUM,
      status: TaskStatus.TODO,
      dueDate: '',
      createdById: 0,
      projectId: this.task.projectId,
    };
    this.isEditMode = false;
    this.taskId = null;
  }

  priorities = Object.values(TaskPriority);
  statuses = Object.values(TaskStatus);
  isLoading = false;
  showToast = false;
  toastMessage = '';
  toastColor = '';

  constructor(
    private taskService: TaskService,
    private userService: UserService,
    private route: ActivatedRoute
  ) {
    this.loadCurrentUser();
    this.loadProjectId();
  }

  loadCurrentUser() {
    this.userService.getUserProfile().subscribe({
      next: (user) => {
        this.task.createdById = user.id;
      },
      error: (error) => {
        console.error('Error loading user:', error);
      },
    });
  }

  loadProjectId() {
    const projectId = this.route.snapshot.paramMap.get('id');
    if (projectId) {
      this.task.projectId = parseInt(projectId, 10);
    }
  }

  closeModal() {
    this.close.emit();
    this.resetForm();
  }

  onSubmit(event: Event) {
    event.preventDefault();

    if (!this.task.title || !this.task.description || !this.task.dueDate) {
      return;
    }

    const dueDateFormatted = `${this.task.dueDate}T00:00:00`;
    const taskToSend = { ...this.task, dueDate: dueDateFormatted };

    this.isLoading = true;
    if (this.isEditMode && this.taskId) {
      // Mode édition : mise à jour de la tâche
      this.taskService.updateTask(this.taskId, taskToSend).subscribe({
        next: () => {
          this.isLoading = false;
          this.toastMessage = 'Tâche mise à jour avec succès';
          this.toastColor = '#007bff'; // Couleur bleue
          this.showToast = true;
          this.taskUpdated.emit();
          this.resetForm();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error updating task:', error);
          this.isLoading = false;
        },
      });
    } else {
      // Mode création : création de la tâche
      this.taskService.createTask(taskToSend).subscribe({
        next: () => {
          this.isLoading = false;
          this.toastMessage = 'Tâche créée avec succès';
          this.toastColor = '#4caf50'; // Couleur verte
          this.showToast = true;
          this.taskCreated.emit();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error creating task:', error);
          this.isLoading = false;
        },
      });
    }
  }
}
