import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ProjectService, Project } from '../../services/project/project.service';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit {
  projects: Project[] = [];
  userProjectIds: number[] = [];
  isLoading = true;

  constructor(
    private projectService: ProjectService,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.loadProjects();
    this.loadUserProjects();
    this.projectService.projectCreated$.subscribe(() => {
      this.refreshProjects();
    });
  }

  loadProjects(): void {
    this.isLoading = true;
    this.projectService.getAllProjects().subscribe({
      next: (projects: Project[]) => {
        this.projects = projects;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.isLoading = false;
      }
    });
  }

  loadUserProjects(): void {
    this.userService.getUserProfile().subscribe({
      next: (user) => {
        this.userProjectIds = user.memberProjects?.map(p => p.id) || [];
      },
      error: (error) => {
        console.error('Error loading user projects:', error);
      }
    });
  }

  isUserMemberOfProject(project: Project): boolean {
    const isMember = this.userProjectIds.includes(project.id);
    return isMember;
  }

  refreshProjects(): void {
    this.loadProjects();
    this.loadUserProjects();
    this.cdr.detectChanges(); 
  }
}
