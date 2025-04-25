import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TaskService } from '../../services/Task.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-modal-assign',
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" (click)="closeModal.emit()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <h2>Assigner un membre</h2>
        <div class="members-list">
          <div
            *ngFor="let member of members"
            class="member-card"
            (click)="selectMember(member.userId)"
            [class.selected]="selectedMemberId === member.userId"
          >
            <div class="member-info">
              <span class="member-name">{{ member.username }}</span>
              <span class="member-role">{{ member.role }}</span>
            </div>
          </div>
        </div>
        <div class="modal-actions">
          <button type="button" class="cancel-btn" (click)="closeModal.emit()">
            Annuler
          </button>
          <button
            type="button"
            class="submit-btn"
            [disabled]="!selectedMemberId"
            (click)="assignTask()"
          >
            Assigner
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .modal-content {
        background: white;
        padding: 20px;
        border-radius: 8px;
        width: 400px;
        max-width: 90%;
      }

      .members-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-top: 20px;
        margin-bottom: 20px;
      }

      .member-card {
        display: flex;
        align-items: center;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
        cursor: pointer;
      }

      .member-card.selected {
        border: 2px solid #667eea;
        background-color: #eef2ff;
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

      .modal-actions {
        display: flex;
        justify-content: space-between;
      }

      .cancel-btn,
      .submit-btn {
        padding: 10px 20px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }

      .cancel-btn {
        background-color: #e53e3e;
        color: white;
      }

      .submit-btn {
        background-color: #667eea;
        color: white;
      }
    `,
  ],
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
