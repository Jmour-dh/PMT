import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { TaskService } from '../../services/Task.service';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-task-history-modal',
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" (click)="closeModal()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>Historique des modifications</h2>
          <button class="close-btn" (click)="closeModal()">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="modal-body">
  <ul *ngIf="!isLoading && taskHistory.length > 0" class="history-list">
    <li *ngFor="let entry of taskHistory">
      <strong>{{ entry.changedField }}</strong> changé de
      <em>{{ entry.oldValue }}</em> à <em>{{ entry.newValue }}</em> par
      {{ entry.modifiedByUsername }} le
      {{ entry.modificationDate | date : 'short' }}.
    </li>
  </ul>
  <p *ngIf="!isLoading && taskHistory.length === 0" class="no-history">
    Aucun historique disponible.
  </p>
</div>
<div class="modal-footer">
  <button class="btn btn-delete"  (click)="onDeleteTask()">
    Supprimer la tâche
  </button>
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

      .modal-body {
        padding: 1.5rem;
      }

      .history-list {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      .history-list li {
        margin-bottom: 1rem;
        color: #495057;
      }

      .no-history {
        color: #6c757d;
        text-align: center;
      }

      .modal-footer {
        padding: 1.5rem;
        border-top: 1px solid #e9ecef;
        display: flex;
        justify-content: flex-end;
      }

      .btn {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 6px;
        font-size: 1rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
      }

      .btn-delete {
        background-color: #ff0000;
        color: #495057;
      }

      .btn-cancel:hover {
        background-color: #dee2e6;
      }
    `,
  ],
})
export class TaskHistoryModalComponent implements OnInit {
  @Input() taskId!: number | null;
  @Input() project: any;
  @Output() close = new EventEmitter<void>();
  @Output() deleteTask = new EventEmitter<number>();
  

  taskHistory: any[] = [];
  isLoading: boolean = true;
  isAdmin: boolean = false;

  constructor(
    private taskService: TaskService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    if (this.taskId) {
      this.loadTaskHistory();
    }
    this.checkUserRole();
  }

  loadTaskHistory() {
    this.taskService.getTaskHistory(this.taskId!).subscribe({
      next: (history) => {
        this.taskHistory = history;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        console.error("Erreur lors du chargement de l'historique des tâches.");
      },
    });
  }

  checkUserRole(): void {
    if (!this.project || !this.project.members) return;

    this.isLoading = true;
    this.userService.getUserProfile().subscribe({
      next: (user) => {
        const currentUser = this.project.members.find(
          (member: any) => member.userId === user.id
        );
        this.isAdmin = currentUser?.role === 'ADMIN';
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

  
  onDeleteTask(): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      if (this.taskId !== null) {
        this.deleteTask.emit(this.taskId); // Émet l'ID de la tâche au parent
      }
    }
  }


  closeModal() {
    this.close.emit();
  }
}
