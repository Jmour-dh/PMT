import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskHistoryModalComponent } from './task-history-modal.component';
import { TaskService } from '../../services/task/Task.service';
import { UserService } from '../../services/user/user.service';
import { of, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { User } from '../../models/user.model';

describe('TaskHistoryModalComponent', () => {
  let component: TaskHistoryModalComponent;
  let fixture: ComponentFixture<TaskHistoryModalComponent>;
  let taskServiceSpy: jasmine.SpyObj<TaskService>;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  const mockTaskHistory = [
    {
      id: 1,
      action: 'CREATE',
      timestamp: '2023-01-01T00:00:00',
      user: { id: 1, username: 'user1' },
    },
    {
      id: 2,
      action: 'UPDATE',
      timestamp: '2023-01-02T00:00:00',
      user: { id: 2, username: 'user2' },
    },
  ];

  const mockUser: User = {
    id: 1,
    username: 'testuser',
    email: 'testuser@example.com',
    createdAt: '2023-01-01',
    createdProjects: [],
    memberProjects: [],
    assignedTasks: [],
  };

  const mockProject = {
    id: 1,
    name: 'Test Project',
    members: [
      { userId: 1, username: 'testuser', role: 'ADMIN' },
      { userId: 2, username: 'user2', role: 'MEMBER' },
    ],
  };

  beforeEach(async () => {
    const taskSpy = jasmine.createSpyObj('TaskService', ['getTaskHistory']);
    const userSpy = jasmine.createSpyObj('UserService', ['getUserProfile']);

    await TestBed.configureTestingModule({
      imports: [
        TaskHistoryModalComponent,
        CommonModule,
        HttpClientTestingModule,
      ],
      providers: [
        { provide: TaskService, useValue: taskSpy },
        { provide: UserService, useValue: userSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskHistoryModalComponent);
    component = fixture.componentInstance;
    taskServiceSpy = TestBed.inject(TaskService) as jasmine.SpyObj<TaskService>;
    userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;

    // Initialisation des inputs
    component.taskId = 1;
    component.project = mockProject;

    // Configuration des mocks
    taskServiceSpy.getTaskHistory.and.returnValue(of(mockTaskHistory));
    userServiceSpy.getUserProfile.and.returnValue(of(mockUser));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct values', () => {
    expect(component.taskId).toBe(1);
    expect(component.project).toEqual(mockProject);
    expect(component.isLoading).toBeFalse();
    expect(component.isAdmin).toBeTrue();
  });

  it('should load task history on init', () => {
    expect(taskServiceSpy.getTaskHistory).toHaveBeenCalledWith(1);
    expect(component.taskHistory).toEqual(mockTaskHistory);
    expect(component.isLoading).toBeFalse();
  });

  it('should check user role on init', () => {
    expect(userServiceSpy.getUserProfile).toHaveBeenCalled();
    expect(component.isAdmin).toBeTrue();
  });

  it('should handle error when loading task history fails', () => {
    const errorResponse = new Error('Failed to load task history');
    taskServiceSpy.getTaskHistory.and.returnValue(
      throwError(() => errorResponse)
    );
    spyOn(console, 'error');

    component.taskId = 2;
    component.loadTaskHistory();

    expect(taskServiceSpy.getTaskHistory).toHaveBeenCalledWith(2);
    expect(console.error).toHaveBeenCalledWith(
      "Erreur lors du chargement de l'historique des tâches."
    );
    expect(component.isLoading).toBeFalse();
  });

  it('should handle error when checking user role fails', () => {
    const errorResponse = new Error('Failed to load user profile');
    userServiceSpy.getUserProfile.and.returnValue(
      throwError(() => errorResponse)
    );
    spyOn(console, 'error');

    component.checkUserRole();

    expect(console.error).toHaveBeenCalledWith(
      'Erreur lors de la récupération du profil utilisateur:',
      errorResponse
    );
    expect(component.isLoading).toBeFalse();
  });

  it('should emit deleteTask event when confirmed', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(component.deleteTask, 'emit');

    component.onDeleteTask();

    expect(window.confirm).toHaveBeenCalledWith(
      'Êtes-vous sûr de vouloir supprimer cette tâche ?'
    );
    expect(component.deleteTask.emit).toHaveBeenCalledWith(1);
  });

  it('should not emit deleteTask event when not confirmed', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    spyOn(component.deleteTask, 'emit');

    component.onDeleteTask();

    expect(component.deleteTask.emit).not.toHaveBeenCalled();
  });

  it('should emit close event', () => {
    spyOn(component.close, 'emit');
    component.closeModal();
    expect(component.close.emit).toHaveBeenCalled();
  });

  it('should not be admin if user is not in project members', () => {
    const nonMemberUser: User = {
      id: 3,
      username: 'nonmember',
      email: 'nonmember@example.com',
      createdAt: '2023-01-01',
      createdProjects: [],
      memberProjects: [],
      assignedTasks: [],
    };

    userServiceSpy.getUserProfile.and.returnValue(of(nonMemberUser));
    component.checkUserRole();

    expect(component.isAdmin).toBeFalse();
  });

  it('should not be admin if user is member but not admin', () => {
    const memberUser: User = {
      id: 2,
      username: 'user2',
      email: 'user2@example.com',
      createdAt: '2023-01-01',
      createdProjects: [],
      memberProjects: [],
      assignedTasks: [],
    };

    userServiceSpy.getUserProfile.and.returnValue(of(memberUser));
    component.checkUserRole();

    expect(component.isAdmin).toBeFalse();
  });
});
