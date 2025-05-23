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
  templateUrl:'./create-project-modal.component.html' ,
  styleUrls: [
   './create-project-modal.component.css',
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
