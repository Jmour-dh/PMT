import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { CreateProjectModalComponent } from '../create-project-modal/create-project-modal.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, CreateProjectModalComponent],
  template: `
    <header class="header">
      <div class="header-container">
        <div class="logo" (click)="goToDashboard()">
          <h1>PMT</h1>
        </div>
        <nav class="nav-menu">
          <button class="nav-btn create-project" (click)="openCreateProjectModal()">
            <i class="fas fa-plus"></i>
            <span class="btn-text">Créer un projet</span>
          </button>
          <button class="nav-btn" (click)="goToProfile()">
            <i class="fas fa-user"></i>
            <span class="btn-text">Mon compte</span>
          </button>
          <button class="nav-btn logout" (click)="logout()">
            <i class="fas fa-sign-out-alt"></i>
            <span class="btn-text">Déconnexion</span>
          </button>
        </nav>
      </div>
    </header>

    <app-create-project-modal 
      *ngIf="showCreateProjectModal" 
      (close)="closeCreateProjectModal()"
      (projectCreated)="onProjectCreated()"
    ></app-create-project-modal>
  `,
  styles: [`
    .header {
      background-color: #f8f9fa;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      padding: 1rem 0;
      border-bottom: 1px solid #e9ecef;
    }

    .header-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo {
      cursor: pointer;
    }

    .logo h1 {
      color: #007bff;
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
    }

    .nav-menu {
      display: flex;
      gap: 1rem;
    }

    .nav-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border: 1px solid #e9ecef;
      border-radius: 4px;
      background-color: #fff;
      color: #007bff;
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: 500;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    }

    .nav-btn:hover {
      background-color: #e9ecef;
      transform: translateY(-1px);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .nav-btn.create-project {
      background-color: #28a745;
      color: white;
      border: none;
    }

    .nav-btn.create-project:hover {
      background-color: #218838;
      transform: translateY(-1px);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .nav-btn.logout {
      background-color: #dc3545;
      color: white;
      border: none;
    }

    .nav-btn.logout:hover {
      background-color: #c82333;
      transform: translateY(-1px);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .btn-text {
      display: inline;
    }

    @media (max-width: 768px) {
      .header-container {
        flex-direction: row;
        gap: 1rem;
      }

      .nav-menu {
        width: auto;
        justify-content: flex-end;
      }

      .nav-btn {
        padding: 0.5rem;
      }

      .btn-text {
        display: none;
      }

      .nav-btn i {
        font-size: 1.2rem;
      }

      .logo h1 {
        font-size: 1.2rem;
      }
    }
  `]
})
export class HeaderComponent {
  @Output() projectCreated = new EventEmitter<void>();
  showCreateProjectModal = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  openCreateProjectModal() {
    this.showCreateProjectModal = true;
  }

  closeCreateProjectModal() {
    this.showCreateProjectModal = false;
  }

  onProjectCreated() {
    this.projectCreated.emit();
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/signin']);
  }
}
