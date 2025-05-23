import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  TaskPriority,
  TaskStatus,
} from '../../services/project/project.service';
import { UserService } from '../../services/user/user.service';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from '../../services/task/Task.service';

@Component({
  selector: 'app-create-task-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-task-modal.component.html',
  styleUrls: ['./create-task-modal.component.css'],
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
          this.toastColor = '#4caf50';
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
