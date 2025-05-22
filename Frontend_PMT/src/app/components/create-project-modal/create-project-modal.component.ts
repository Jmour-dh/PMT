import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../services/project/project.service';
import { UserService } from '../../services/user/user.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-create-project-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay" (click)="closeModal()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>{{
              isEditMode ? 'Mettre à jour ce projet':'Créer un nouveau projet'
            }}
              </h2>
          <button class="close-btn" (click)="closeModal()">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <form
          (ngSubmit)="onSubmit($event)"
          #projectForm="ngForm"
          class="project-form"
        >
          <div class="form-group">
            <label for="name">Nom du projet</label>
            <input
              type="text"
              id="name"
              name="name"
              [(ngModel)]="project.name"
              required
              class="form-control"
              placeholder="Entrez le nom du projet"
            />
          </div>

          <div class="form-group">
            <label for="description">Description</label>
            <textarea
              id="description"
              name="description"
              [(ngModel)]="project.description"
              required
              class="form-control"
              placeholder="Décrivez votre projet"
              rows="4"
            ></textarea>
          </div>

          <div class="form-group">
            <label for="startDate">Date de début</label>
            <div class="date-picker">
              <input
                type="date"
                id="startDate"
                name="startDate"
                [(ngModel)]="project.startDate"
                required
                class="form-control"
              />
              <i class="fas fa-calendar-alt"></i>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn btn-cancel" (click)="closeModal()">
              Annuler
            </button>
            <button
              type="submit"
              class="btn btn-submit"
              [disabled]="!projectForm.valid || isLoading"
            >
              <span *ngIf="!isLoading">{{
                isEditMode ? 'Mettre à jour' : 'Créer le projet'
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

      .project-form {
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

      textarea.form-control {
        resize: vertical;
        min-height: 100px;
      }

      .date-picker {
        position: relative;
      }

      .date-picker i {
        position: absolute;
        right: 1rem;
        top: 50%;
        transform: translateY(-50%);
        color: #6c757d;
        pointer-events: none;
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

      @media (max-width: 576px) {
        .modal-content {
          width: 95%;
        }

        .form-actions {
          flex-direction: column;
        }

        .btn {
          width: 100%;
        }
      }
    `,
  ],
})
export class CreateProjectModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() projectCreated = new EventEmitter<void>();
  @Output() projectUpdated = new EventEmitter<void>();
  @Input() isEditMode = false;
  @Input() projectId: number | null = null;
  @Input() set projectToEdit(project: any) {
    if (project) {
      this.project = { ...project };
    } else {
      this.project = {
        name: '',
        description: '',
        startDate: '',
        createdById: 0,
      };
    }
  }

  project = {
    name: '',
    description: '',
    startDate: '',
    createdById: 0,
  };
  isLoading = false;

  constructor(
    private projectService: ProjectService,
    private userService: UserService,
    private route: ActivatedRoute
  ) {
    this.loadCurrentUser();
  }

  loadCurrentUser() {
    this.userService.getUserProfile().subscribe({
      next: (user) => {
        this.project.createdById = user.id;
      },
      error: (error) => {
        console.error('Error loading user:', error);
      },
    });
  }

  loadProjectId() {
    const projectId = this.route.snapshot.paramMap.get('id');
    if (projectId) {
      this.projectId = parseInt(projectId, 10);
    }
  }

  closeModal() {
    this.close.emit();
  }

  onSubmit(event: Event) {
    event.preventDefault();

    if (
      !this.project.name ||
      !this.project.description ||
      !this.project.startDate
    ) {
      return;
    }

    if (this.isEditMode ) {
      this.projectService.updateProject(this.project).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.projectUpdated.emit();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error updating project:', error);
          this.isLoading = false;
        },
      });
    } else {
      this.isLoading = true;
      this.projectService.createProject(this.project).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.projectCreated.emit();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error creating project:', error);
          this.isLoading = false;
        },
      });
    }
  }
}
