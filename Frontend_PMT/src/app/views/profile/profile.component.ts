import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User, Project, Task } from '../../models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="profile-wrapper">
      <!-- Loading Spinner -->
      <div *ngIf="isLoading" class="loading-overlay">
        <div class="spinner"></div>
        <p>Chargement en cours...</p>
      </div>

      <div class="profile-sidebar">
        <div class="user-card">
          <div class="user-avatar">
            <div class="avatar-initial">
              {{ userProfile?.username?.charAt(0)?.toUpperCase() }}
            </div>
          </div>
          <div class="user-info">
            <h2>{{ userProfile?.username }}</h2>
            <p class="user-email">{{ userProfile?.email }}</p>
            <div class="user-stats">
              <div class="stat-item">
                <span class="stat-number">{{ userProfile?.memberProjects?.length || 0 }}</span>
                <span class="stat-label">Projets</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">{{ userProfile?.assignedTasks?.length || 0 }}</span>
                <span class="stat-label">Tâches</span>
              </div>
            </div>
            <div class="join-date">
              <i class="fas fa-calendar-alt"></i>
              Membre depuis {{ userProfile?.createdAt | date:'dd/MM/yyyy' }}
            </div>
          </div>
        </div>

        <!-- Profile Edit Form -->
        <div class="profile-edit-section">
          <h3>Modifier le profil</h3>
          <form (ngSubmit)="onSubmit()" #profileForm="ngForm">
            <div class="form-group">
              <label for="username">Nom d'utilisateur</label>
              <input 
                type="text" 
                id="username" 
                name="username" 
                [(ngModel)]="editForm.username" 
                class="form-control"
                placeholder="Nouveau nom d'utilisateur"
                (input)="checkFormChanges()"
              >
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                [(ngModel)]="editForm.email" 
                class="form-control"
                placeholder="Nouvel email"
                (input)="checkFormChanges()"
              >
            </div>
            <button 
              type="submit" 
              class="btn-save" 
              [disabled]="!profileForm.form.valid || isUpdating || !hasChanges"
            >
              <span *ngIf="!isUpdating">Enregistrer</span>
              <span *ngIf="isUpdating">
                <span class="button-spinner"></span>
                Enregistrement...
              </span>
            </button>
            <div *ngIf="updateError" class="error-message">
              {{ updateError }}
            </div>
            <div *ngIf="updateSuccess" class="success-message">
              Profil mis à jour avec succès
            </div>
          </form>
        </div>
      </div>

      <div class="profile-main">
        <div class="content-wrapper">
          <!-- Projects Section -->
          <section class="content-section">
            <div class="section-title">
              <i class="fas fa-folder"></i>
              <h2>Mes Projets</h2>
            </div>
            <div class="projects-list">
              <div *ngFor="let project of userProfile?.memberProjects" class="project-item">
                <div class="project-main">
                  <h3>{{ project.name }}</h3>
                  <p class="project-description">{{ project.description }}</p>
                </div>
              </div>
            </div>
          </section>

          <!-- Tasks Section -->
          <section class="content-section">
            <div class="section-title">
              <i class="fas fa-tasks"></i>
              <h2>Mes Tâches</h2>
            </div>
            <div class="tasks-list">
              <div *ngIf="userProfile?.assignedTasks?.length; else noTasks">
                <div *ngFor="let task of userProfile?.assignedTasks" class="task-item">
                  <div class="task-main">
                    <div class="task-header">
                      <h3>{{ task.title }}</h3>
                      <div class="task-status" [ngClass]="'status-' + task.status.toLowerCase()">
                        {{ task.status }}
                      </div>
                    </div>
                    <p class="task-description">{{ task.description }}</p>
                  </div>
                  <div class="task-meta">
                    <div class="meta-item">
                      <i class="fas fa-folder"></i>
                      <span>{{ task?.project?.name || 'Projet non spécifié' }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <ng-template #noTasks>
                <div class="empty-state">
                  <i class="fas fa-clipboard-list"></i>
                  <p>Aucune tâche assignée pour le moment</p>
                </div>
              </ng-template>
            </div>
          </section>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

    .profile-wrapper {
      display: flex;
      min-height: 100vh;
      background-color: #f5f7fa;
    }

    .profile-sidebar {
      width: 280px;
      background: white;
      padding: 1.5rem;
      box-shadow: 2px 0 4px rgba(0, 0, 0, 0.05);
      position: sticky;
      top: 0;
      height: 100vh;
      overflow-y: auto;
    }

    .user-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .user-avatar {
      margin-bottom: 1rem;
      text-align: center;
    }

    .avatar-initial {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 2rem;
      font-weight: bold;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .user-info {
      text-align: center;
    }

    .user-info h2 {
      font-size: 1.5rem;
      color: #2d3748;
      margin-bottom: 0.5rem;
    }

    .user-email {
      color: #718096;
      margin-bottom: 1rem;
      font-size: 0.9rem;
    }

    .user-stats {
      display: flex;
      justify-content: center;
      gap: 1.5rem;
      margin-bottom: 1rem;
    }

    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .stat-number {
      font-size: 1.2rem;
      font-weight: bold;
      color: #2d3748;
    }

    .stat-label {
      color: #718096;
      font-size: 0.8rem;
    }

    .join-date {
      color: #718096;
      font-size: 0.8rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .profile-main {
      flex: 1;
      padding: 2rem;
      overflow-y: auto;
    }

    .content-wrapper {
      max-width: 800px;
      margin: 0 auto;
    }

    .content-section {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 2rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .section-title {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .section-title h2 {
      font-size: 1.3rem;
      color: #2d3748;
      margin: 0;
    }

    .section-title i {
      color: #667eea;
      font-size: 1.2rem;
    }

    .projects-list, .tasks-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .project-item, .task-item {
      background: #f8fafc;
      border-radius: 8px;
      padding: 1.2rem;
      transition: transform 0.2s;
    }

    .project-item:hover, .task-item:hover {
      transform: translateX(5px);
    }

    .project-main, .task-main {
      margin-bottom: 0.5rem;
    }

    .project-item h3, .task-item h3 {
      color: #2d3748;
      margin-bottom: 0.5rem;
      font-size: 1.1rem;
    }

    .project-description, .task-description {
      color: #718096;
      font-size: 0.9rem;
      line-height: 1.5;
    }

    .task-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .task-status {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: bold;
    }

    .status-todo {
      background-color: #ebf8ff;
      color: #2b6cb0;
    }

    .status-in-progress {
      background-color: #fffaf0;
      color: #c05621;
    }

    .status-done {
      background-color: #f0fff4;
      color: #2f855a;
    }

    .task-meta {
      display: flex;
      gap: 1rem;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #718096;
      font-size: 0.8rem;
    }

    .empty-state {
      text-align: center;
      padding: 2rem;
      color: #718096;
    }

    .empty-state i {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      color: #cbd5e0;
    }

    .empty-state p {
      font-size: 1rem;
      margin: 0;
    }

    .profile-edit-section {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      margin-top: 1.5rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .profile-edit-section h3 {
      font-size: 1.2rem;
      color: #2d3748;
      margin-bottom: 1rem;
      text-align: center;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      color: #4a5568;
      font-size: 0.9rem;
    }

    .form-control {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      font-size: 0.9rem;
      transition: border-color 0.2s;
    }

    .form-control:focus {
      outline: none;
      border-color: #667eea;
    }

    .btn-save {
      width: 100%;
      padding: 0.75rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      transition: opacity 0.2s;
    }

    .btn-save:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      background: #a0aec0;
    }

    .btn-save:hover:not(:disabled) {
      opacity: 0.9;
    }

    .error-message {
      margin-top: 1rem;
      padding: 0.75rem;
      background-color: #fff5f5;
      color: #c53030;
      border-radius: 6px;
      font-size: 0.9rem;
      text-align: center;
    }

    .success-message {
      margin-top: 1rem;
      padding: 0.75rem;
      background-color: #f0fff4;
      color: #2f855a;
      border-radius: 6px;
      font-size: 0.9rem;
      text-align: center;
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

    .loading-overlay p {
      color: #2d3748;
      font-size: 1.1rem;
      font-weight: 500;
    }

    .button-spinner {
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 2px solid #ffffff;
      border-top: 2px solid transparent;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-right: 8px;
      vertical-align: middle;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @media (max-width: 768px) {
      .profile-wrapper {
        flex-direction: column;
      }

      .profile-sidebar {
        width: 100%;
        position: relative;
        height: auto;
        padding: 1rem;
      }

      .profile-main {
        padding: 1rem;
      }

      .content-wrapper {
        max-width: 100%;
      }

      .profile-edit-section {
        margin-top: 1rem;
      }
    }
  `]
})
export class ProfileComponent implements OnInit {
  userProfile: User | null = null;
  isLoading = true;
  editForm = {
    username: '',
    email: ''
  };
  initialFormValues = {
    username: '',
    email: ''
  };
  hasChanges = false;
  isUpdating = false;
  updateError: string | null = null;
  updateSuccess = false;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getUserProfile().subscribe({
      next: (response) => {
        console.log('Réponse complète:', response);
        this.userProfile = response;
        // Initialize form with current values
        this.editForm.username = response.username;
        this.editForm.email = response.email;
        // Save initial values
        this.initialFormValues = { ...this.editForm };
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors de la requête /me:', error);
        this.isLoading = false;
      }
    });
  }

  checkFormChanges() {
    this.hasChanges = 
      this.editForm.username !== this.initialFormValues.username ||
      this.editForm.email !== this.initialFormValues.email;
  }

  onSubmit() {
    if (!this.userProfile?.id) return;

    this.isUpdating = true;
    this.updateError = null;
    this.updateSuccess = false;

    this.userService.updateUserProfile(this.userProfile.id.toString(), this.editForm).subscribe({
      next: (response) => {
        if (response.status === 200) {
          this.updateSuccess = true;
          this.isUpdating = false;
          
          // Update initial values after successful save
          this.initialFormValues = { ...this.editForm };
          this.hasChanges = false;
          
          // Rafraîchir les données du profil
          this.userService.getUserProfile().subscribe({
            next: (updatedProfile) => {
              this.userProfile = updatedProfile;
              this.editForm.username = updatedProfile.username;
              this.editForm.email = updatedProfile.email;
            },
            error: (error) => {
              console.error('Erreur lors du rafraîchissement du profil:', error);
            }
          });
        }
      },
      error: (error) => {
        if (error.status === 200) {
          this.updateSuccess = true;
          this.isUpdating = false;
          
          // Update initial values after successful save
          this.initialFormValues = { ...this.editForm };
          this.hasChanges = false;
          
          // Rafraîchir les données du profil
          this.userService.getUserProfile().subscribe({
            next: (updatedProfile) => {
              this.userProfile = updatedProfile;
              this.editForm.username = updatedProfile.username;
              this.editForm.email = updatedProfile.email;
            },
            error: (error) => {
              console.error('Erreur lors du rafraîchissement du profil:', error);
            }
          });
        } else {
          console.error('Détails de l\'erreur:', error);
          
          // Gestion des erreurs spécifiques
          if (error.status === 400) {
            const errorMessage = error.error?.message || error.error;
            if (typeof errorMessage === 'string') {
              if (errorMessage.includes('email')) {
                this.updateError = 'Cette adresse email est déjà utilisée. Veuillez en choisir une autre.';
              } else if (errorMessage.includes('username')) {
                this.updateError = 'Ce nom d\'utilisateur est déjà pris. Veuillez en choisir un autre.';
              } else {
                this.updateError = 'Les données saisies ne sont pas valides. Veuillez vérifier vos informations.';
              }
            } else {
              this.updateError = 'Les données saisies ne sont pas valides. Veuillez vérifier vos informations.';
            }
          } else if (error.status === 401) {
            this.updateError = 'Votre session a expiré. Veuillez vous reconnecter.';
          } else if (error.status === 403) {
            this.updateError = 'Vous n\'avez pas les permissions nécessaires pour effectuer cette action.';
          } else if (error.status === 404) {
            this.updateError = 'Le profil n\'a pas été trouvé.';
          } else if (error.status >= 500) {
            this.updateError = 'Une erreur serveur est survenue. Veuillez réessayer plus tard.';
          } else {
            this.updateError = 'Une erreur inattendue est survenue. Veuillez réessayer.';
          }
          
          this.isUpdating = false;
        }
      }
    });
  }
}