import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TaskService } from '../../services/task/Task.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-modal-assign',
  imports: [CommonModule],
  templateUrl: './modal-assign.component.html',
  styleUrls: ['./modal-assign.component.css'],
})
export class ModalAssignComponent {
  @Input() members: any[] = [];
  @Input() taskId: number | null = null;
  @Input() projectId: number | null = null;
  @Output() closeModal = new EventEmitter<void>();
  @Output() taskAssigned = new EventEmitter<void>();

  selectedMemberId: number | null = null;

  constructor(private taskService: TaskService, private route: ActivatedRoute) {
    this.loadProjectId();
  }

  loadProjectId() {
    const projectId = this.route.snapshot.paramMap.get('id');
    if (projectId) {
      this.projectId = parseInt(projectId, 10);
    }
  }

  selectMember(userId: number): void {
    this.selectedMemberId = userId;
  }

  assignTask(): void {
    if (!this.projectId || !this.taskId || !this.selectedMemberId) return;

    this.taskService
      .assignTask(this.projectId, this.taskId, this.selectedMemberId)
      .subscribe({
        next: () => {
          this.taskAssigned.emit();
          this.closeModal.emit();
        },
        error: (error) => {
          console.error('Error assigning task:', error);
        },
      });
  }
}
