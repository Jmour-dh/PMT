import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { TaskService } from '../../services/task/Task.service';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-task-history-modal',
  imports: [CommonModule],
  templateUrl: './task-history-modal.component.html',
  styleUrls: ['./task-history-modal.component.css'],
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
        this.deleteTask.emit(this.taskId);
      }
    }
  }

  closeModal() {
    this.close.emit();
  }
}
