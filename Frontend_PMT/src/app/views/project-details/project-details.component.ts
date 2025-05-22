import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProjectService, Project, Role } from '../../services/project/project.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../services/user.service';
import { CreateTaskModalComponent } from '../../components/create-task-modal/create-task-modal.component';
import { ModalAssignComponent } from '../../components/modal-assign/modal-assign.component';
import { TaskHistoryModalComponent } from '../../components/task-history-modal/task-history-modal.component';
import { TaskService } from '../../services/task/Task.service';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    CreateTaskModalComponent,
    ModalAssignComponent,
    TaskHistoryModalComponent,
  ],
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css'],
})
export class ProjectDetailsComponent implements OnInit {
  project: Project | null = null;
  isLoading = true;
  todoTasks: any[] = [];
  inProgressTasks: any[] = [];
  doneTasks: any[] = [];
  isFabOpen = false;
  isObserver = false;
  isMember = false;
  showInviteModal = false;
  inviteEmail = '';
  selectedRole: Role = Role.MEMBER;
  roles = Object.values(Role);
  showSuccessToast = false;
  errorMessage = '';
  showCreateTaskModal = false;
  showSuccessToastTask = false;
  showAssignTaskModal = false;
  showSuccessToastTaskAssigned = false;
  selectedTaskId: number | null = null;
  showTaskHistoryModal = false;
  selectedTask: any;
  isEditMode = false;
  taskToEdit: any = null;
  showSuccessUpdateToastTask = false;
  showSuccessDeleteToastTask = false;
  currentProject: any;
  currentUserId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private userService: UserService,
    private taskService: TaskService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const projectId = this.route.snapshot.paramMap.get('id');
    if (projectId) {
      this.loadProjectDetails(parseInt(projectId));
    } else {
      console.error('No project ID found in route parameters');
      this.isLoading = false;
    }

    this.userService.getUserProfile().subscribe({
      next: (user) => {
        this.currentUserId = user.id;
      },
      error: (error) => {
        console.error('Error fetching user profile:', error);
        this.isLoading = false;
      },
    });
  }

  loadProjectDetails(projectId: number): void {
    this.isLoading = true;
    setTimeout(() => {
      this.projectService.getProjectById(projectId).subscribe({
        next: (project) => {
          this.project = project;
          this.categorizeTasks(project.tasks || []);
          this.checkUserRole();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading project details:', error);
          this.isLoading = false;
        },
      });
    }, 400);
  }

  categorizeTasks(tasks: any[]): void {
    this.todoTasks = tasks.filter((task) => task.status === 'TODO');
    this.inProgressTasks = tasks.filter(
      (task) => task.status === 'IN_PROGRESS'
    );
    this.doneTasks = tasks.filter((task) => task.status === 'DONE');
  }

  getUsernameById(userId: number): string {
    if (!this.project?.members) return 'Inconnu';
    const member = this.project.members.find((m) => m.userId === userId);
    return member?.username || 'Inconnu';
  }

  toggleFab() {
    this.isFabOpen = !this.isFabOpen;
  }

  openInviteMember() {
    this.showInviteModal = true;
    this.isFabOpen = false;
  }

  closeInviteModal() {
    this.showInviteModal = false;
    this.inviteEmail = '';
    this.selectedRole = Role.MEMBER;
    this.errorMessage = '';
  }

  showToast() {
    this.showSuccessToast = true;
    setTimeout(() => {
      this.showSuccessToast = false;
    }, 3000);
  }

  handleTaskCreated(): void {
    this.closeCreateTaskModal();
    this.showSuccessToastTask = true;

    setTimeout(() => {
      this.showSuccessToastTask = false;
    }, 3000);
  }

  handleTaskUpdated(): void {
    this.closeCreateTaskModal();
    this.showSuccessUpdateToastTask = true;

    setTimeout(() => {
      this.showSuccessUpdateToastTask = false;
    }, 3000);
  }

  submitInvitation() {
    if (!this.project) return;
    this.errorMessage = '';

    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    const body = {
      email: this.inviteEmail,
      role: this.selectedRole,
    };

    this.http
      .post(`/api/projects/${this.project.id}/invite`, body, { headers })
      .subscribe({
        next: () => {
          this.showToast();
          this.closeInviteModal();
          this.loadProjectDetails(this.project!.id);
        },
        error: (error) => {
          console.error("Erreur lors de l'envoi de l'invitation:", error);

          switch (error.status) {
            case 409:
              this.errorMessage = 'Cet utilisateur est déjà membre du projet';
              break;
            case 400:
              this.errorMessage =
                "Cet utilisateur n'existe pas dans le système";
              break;
            default:
              this.errorMessage =
                error.error?.message ||
                "Une erreur est survenue lors de l'envoi de l'invitation";
          }
        },
      });
  }

  checkUserRole(): void {
    if (!this.project || !this.project.members) return;

    this.isLoading = true;
    this.userService.getUserProfile().subscribe({
      next: (user) => {
        const currentUser = this.project!.members.find(
          (member) => member.userId === user.id
        );
        this.isObserver = currentUser?.role === 'OBSERVER';
        this.isMember = currentUser?.role === 'MEMBER';
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

  openCreateTaskModal(): void {
    this.selectedTask = null;
    this.isEditMode = false;
    this.taskToEdit = null;
    this.showCreateTaskModal = true;
    this.isFabOpen = false;
  }

  openEditModal(event: Event, task: any) {
    event.stopPropagation();
    this.selectedTask = task;
    this.isEditMode = true;
    this.showCreateTaskModal = true;
  }

  closeCreateTaskModal(): void {
    this.showCreateTaskModal = false;
    this.isEditMode = false;
    this.taskToEdit = null;
  }

  openAssignTaskModal(event: Event, taskId: number): void {
    event.stopPropagation();
    if (this.isObserver) {
      window.alert("Vous n'avez pas la permission d'assigner une tâche.");
      return;
    }
    this.selectedTaskId = taskId;
    this.showAssignTaskModal = true;
  }

  closeAssignTaskModal(): void {
    this.showAssignTaskModal = false;
    this.selectedTaskId = null;
    this.currentProject = null;
  }

  onTaskAssigned(): void {
    this.closeAssignTaskModal();
    this.showSuccessToastTaskAssigned = true;

    setTimeout(() => {
      this.showSuccessToastTaskAssigned = false;
    }, 3000);
  }

  openTaskHistoryModal(taskId: number): void {
    this.selectedTaskId = taskId;
    this.showTaskHistoryModal = true;
    this.currentProject = this.project;
  }

  onModalClose(): void {
    this.showTaskHistoryModal = false;
  }

  handleDeleteTask(taskId: number): void {
    if (!this.project || !this.currentUserId) {
      console.error(
        'Impossible de supprimer la tâche : projet ou utilisateur non défini.'
      );
      return;
    }

    this.taskService.deleteTask(taskId, this.currentUserId).subscribe({
      next: () => {
        if (this.project) {
          this.loadProjectDetails(this.project.id);
        }
        this.showTaskHistoryModal = false;
        this.showSuccessDeleteToastTask = true;

        setTimeout(() => {
          this.showSuccessDeleteToastTask = false;
        }, 3000);
      },
      error: (error) => {
        console.error('Erreur lors de la suppression de la tâche :', error);
      },
    });
  }
}
