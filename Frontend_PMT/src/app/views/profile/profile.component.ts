import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User, Project, Task } from '../../models/user.model';
import { CreateProjectModalComponent } from '../../components/create-project-modal/create-project-modal.component';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, CreateProjectModalComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  @Output() projectDeleted = new EventEmitter<void>();
  userProfile: User | null = null;
  isLoading = true;
  editForm = {
    username: '',
    email: '',
  };
  initialFormValues = {
    username: '',
    email: '',
  };
  hasChanges = false;
  isUpdating = false;
  updateError: string | null = null;
  updateSuccess = false;
  showCreateProjectModal = false;
  selectedProject: any;
  isEditMode = false;
  showDeletePopup = false;
  isDeleting = false;
  isCreator = false;

  constructor(
    private userService: UserService,
    private projectService: ProjectService
  ) {}

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading = true;
    this.userService.getUserProfile().subscribe({
      next: (response) => {
        this.userProfile = response;
        this.editForm.username = response.username;
        this.editForm.email = response.email;
        this.initialFormValues = { ...this.editForm };
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors de la requête /me:', error);
        this.isLoading = false;
      },
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

    this.userService
      .updateUserProfile(this.userProfile.id.toString(), this.editForm)
      .subscribe({
        next: (response) => {
          if (response.status === 200) {
            this.updateSuccess = true;
            this.isUpdating = false;

            this.initialFormValues = { ...this.editForm };
            this.hasChanges = false;

            this.userService.getUserProfile().subscribe({
              next: (updatedProfile) => {
                this.userProfile = updatedProfile;
                this.editForm.username = updatedProfile.username;
                this.editForm.email = updatedProfile.email;
              },
              error: (error) => {
                console.error(
                  'Erreur lors du rafraîchissement du profil:',
                  error
                );
              },
            });
          }
        },
        error: (error) => {
          if (error.status === 200) {
            this.updateSuccess = true;
            this.isUpdating = false;

            this.initialFormValues = { ...this.editForm };
            this.hasChanges = false;

            this.userService.getUserProfile().subscribe({
              next: (updatedProfile) => {
                this.userProfile = updatedProfile;
                this.editForm.username = updatedProfile.username;
                this.editForm.email = updatedProfile.email;
              },
              error: (error) => {
                console.error(
                  'Erreur lors du rafraîchissement du profil:',
                  error
                );
              },
            });
          } else {
            console.error("Détails de l'erreur:", error);

            if (error.status === 400) {
              const errorMessage = error.error?.message || error.error;
              if (typeof errorMessage === 'string') {
                if (errorMessage.includes('email')) {
                  this.updateError =
                    'Cette adresse email est déjà utilisée. Veuillez en choisir une autre.';
                } else if (errorMessage.includes('username')) {
                  this.updateError =
                    "Ce nom d'utilisateur est déjà pris. Veuillez en choisir un autre.";
                } else {
                  this.updateError =
                    'Les données saisies ne sont pas valides. Veuillez vérifier vos informations.';
                }
              } else {
                this.updateError =
                  'Les données saisies ne sont pas valides. Veuillez vérifier vos informations.';
              }
            } else if (error.status === 401) {
              this.updateError =
                'Votre session a expiré. Veuillez vous reconnecter.';
            } else if (error.status === 403) {
              this.updateError =
                "Vous n'avez pas les permissions nécessaires pour effectuer cette action.";
            } else if (error.status === 404) {
              this.updateError = "Le profil n'a pas été trouvé.";
            } else if (error.status >= 500) {
              this.updateError =
                'Une erreur serveur est survenue. Veuillez réessayer plus tard.';
            } else {
              this.updateError =
                'Une erreur inattendue est survenue. Veuillez réessayer.';
            }

            this.isUpdating = false;
          }
        },
      });
  }

  closeCreateProjectModal(): void {
    this.showCreateProjectModal = false;
  }

  handleProjectUpdated(): void {
    this.closeCreateProjectModal();
    this.loadProfile();
  }

  openEditModal(projet: any) {
    this.selectedProject = projet;
    this.isEditMode = true;
    this.showCreateProjectModal = true;
  }

  confirmDeleteProject(projectId: number): void {
    const confirmation = window.confirm(
      'Êtes-vous sûr de vouloir supprimer ce projet ?'
    );
    if (confirmation) {
      this.projectService.deleteProject(projectId).subscribe({
        next: () => {
          console.log('Projet supprimé avec succès.');
          this.projectDeleted.emit();
          this.loadProfile();
        },
        error: (error) => {
          console.error('Erreur lors de la suppression du projet :', error);
        },
      });
    }
  }

  openDeleteConfirmation(): void {
    this.showDeletePopup = true;
  }

  closeDeleteConfirmation(): void {
    this.showDeletePopup = false;
  }

  confirmDelete(): void {
    this.isDeleting = true;
    const userId = this.userProfile?.id?.toString();

    if (userId) {
      this.userService.deleteUserProfile(userId).subscribe({
        next: () => {
          this.isDeleting = false;
          this.showDeletePopup = false;

          localStorage.removeItem('token');
          window.location.href = '/signin';
        },
        error: (err) => {
          this.isDeleting = false;
          this.showDeletePopup = false;
          alert('Une erreur est survenue lors de la suppression du compte.');
          console.error(err);
        },
      });
    }
  }

  isCreatorOfProject(project: any): boolean {
    return project.createdById === this.userProfile?.id;
  }
}
