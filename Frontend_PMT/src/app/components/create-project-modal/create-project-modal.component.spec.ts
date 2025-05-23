import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateProjectModalComponent } from './create-project-modal.component';
import {
  ProjectService,
  TaskPriority,
  TaskStatus,
} from '../../services/project/project.service';
import { UserService } from '../../services/user/user.service';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  Project,
  Task,
  ProjectMember,
  Role,
} from '../../services/project/project.service';

describe('CreateProjectModalComponent', () => {
  let component: CreateProjectModalComponent;
  let fixture: ComponentFixture<CreateProjectModalComponent>;
  let projectServiceSpy: jasmine.SpyObj<ProjectService>;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  const mockActivatedRoute = {
    snapshot: {
      paramMap: {
        get: (key: string) => null,
      },
    },
  };

  const mockUser = {
    id: 1,
    username: 'testuser',
    email: 'testuser@example.com',
    createdAt: '2023-01-01',
    createdProjects: [],
    memberProjects: [],
    assignedTasks: [],
  };

  const mockProject: Project = {
    id: 1,
    name: 'Test Project',
    description: 'Test Description',
    startDate: '2023-01-01',
    createdById: 1,
    members: [],
    tasks: [],
  };

  const mockTask: Task = {
    id: 1,
    title: 'Test Task',
    description: 'Test Description',
    dueDate: '2023-01-01',
    priority: 'LOW' as TaskPriority,
    status: 'TODO' as TaskStatus,
    createdById: 1,
    assigneeId: null,
    projectId: 1,
  };

  const mockMember: ProjectMember = {
    userId: 1,
    username: 'testuser',
    role: 'MEMBER' as Role,
  };

  beforeEach(async () => {
    const projectSpy = jasmine.createSpyObj('ProjectService', [
      'createProject',
      'updateProject',
    ]);
    const userSpy = jasmine.createSpyObj('UserService', ['getUserProfile']);

    userSpy.getUserProfile.and.returnValue(of(mockUser));
    projectSpy.createProject.and.returnValue(of(mockProject));
    projectSpy.updateProject.and.returnValue(of(mockProject));

    await TestBed.configureTestingModule({
      imports: [
        CreateProjectModalComponent,
        FormsModule,
        HttpClientTestingModule,
      ],
      providers: [
        { provide: ProjectService, useValue: projectSpy },
        { provide: UserService, useValue: userSpy },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateProjectModalComponent);
    component = fixture.componentInstance;
    projectServiceSpy = TestBed.inject(
      ProjectService
    ) as jasmine.SpyObj<ProjectService>;
    userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load the current user', () => {
    // Given // When
    component.loadCurrentUser();
    // Then
    expect(userServiceSpy.getUserProfile).toHaveBeenCalled();
    expect(component.project.createdById).toBe(mockUser.id);
  });

  it('should handle error when loading user fails', () => {
    // Given
    const errorResponse = new Error('Failed to load user');
    // When
    userServiceSpy.getUserProfile.and.returnValue(
      throwError(() => errorResponse)
    );

    spyOn(console, 'error');
    component.loadCurrentUser();

    // Then
    expect(userServiceSpy.getUserProfile).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(
      'Error loading user:',
      errorResponse
    );
  });

  it('should create a project successfully', () => {
    // Given
    const newProject = {
      name: 'Test Project',
      description: 'Test Description',
      startDate: '2023-01-01',
      createdById: 1,
    };

    // When
    spyOn(component.projectCreated, 'emit');
    spyOn(component, 'closeModal');

    component.project = newProject;
    component.onSubmit(new Event('submit'));
    // Then
    expect(projectServiceSpy.createProject).toHaveBeenCalledWith(newProject);
    expect(component.projectCreated.emit).toHaveBeenCalled();
    expect(component.closeModal).toHaveBeenCalled();
    expect(component.isLoading).toBeFalse();
  });

  it('should update a project successfully in edit mode', () => {
    // Given
    const updatedProject: Project = {
      id: 1,
      name: 'Updated Project',
      description: 'Updated Description',
      startDate: '2023-01-01',
      createdById: 1,
      members: [mockMember],
      tasks: [mockTask],
    };

    // When
    component.isEditMode = true;
    component.project = updatedProject;

    spyOn(component.projectUpdated, 'emit');
    spyOn(component, 'closeModal');

    component.onSubmit(new Event('submit'));

    // Then
    expect(projectServiceSpy.updateProject).toHaveBeenCalledWith(
      updatedProject
    );
    expect(component.projectUpdated.emit).toHaveBeenCalled();
    expect(component.closeModal).toHaveBeenCalled();
    expect(component.isLoading).toBeFalse();
  });

  it('should not submit if form is invalid', () => {
    // Given
    const invalidProject = {
      name: '',
      description: '',
      startDate: '',
      createdById: 1,
    } as unknown as Project;

    // When
    component.project = invalidProject;
    component.onSubmit(new Event('submit'));

    // Then
    expect(projectServiceSpy.createProject).not.toHaveBeenCalled();
    expect(projectServiceSpy.updateProject).not.toHaveBeenCalled();
  });

  it('should handle error when creating project fails', () => {
    // Given
    const newProject = {
      name: 'Test Project',
      description: 'Test Description',
      startDate: '2023-01-01',
      createdById: 1,
    };

    const errorResponse = new Error('Failed to create project');
    projectServiceSpy.createProject.and.returnValue(
      throwError(() => errorResponse)
    );
    spyOn(console, 'error');
    // When
    component.project = newProject;
    component.onSubmit(new Event('submit'));

    // Then
    expect(projectServiceSpy.createProject).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(
      'Error creating project:',
      errorResponse
    );
    expect(component.isLoading).toBeFalse();
  });

  it('should handle error when updating project fails', () => {
    // Given
    const updatedProject: Project = {
      id: 1,
      name: 'Updated Project',
      description: 'Updated Description',
      startDate: '2023-01-01',
      createdById: 1,
      members: [mockMember],
      tasks: [mockTask],
    };

    component.isEditMode = true;
    component.project = updatedProject;

    const errorResponse = new Error('Failed to update project');
    projectServiceSpy.updateProject.and.returnValue(
      throwError(() => errorResponse)
    );
    spyOn(console, 'error');

    // When
    component.onSubmit(new Event('submit'));

    // Then
    expect(projectServiceSpy.updateProject).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(
      'Error updating project:',
      errorResponse
    );
    expect(component.isLoading).toBeFalse();
  });

  it('should initialize with empty project when no projectToEdit', () => {
    // Given // When
    component.projectToEdit = null;
    // Then
    expect(component.project).toEqual({
      name: '',
      description: '',
      startDate: '',
      createdById: 0,
    });
  });

  it('should initialize with provided project when projectToEdit is set', () => {
    // Given
    const existingProject: Project = {
      id: 1,
      name: 'Existing Project',
      description: 'Existing Description',
      startDate: '2023-01-01',
      createdById: 1,
      members: [mockMember],
      tasks: [mockTask],
    };

    // When
    component.projectToEdit = existingProject;
    // Then
    expect(component.project).toEqual(existingProject);
  });

  it('should emit close event when closeModal is called', () => {
    // Given
    spyOn(component.close, 'emit');
    // When
    component.closeModal();
    // Then
    expect(component.close.emit).toHaveBeenCalled();
  });

  it('should set projectId from route params when loadProjectId is called', () => {
    // Given
    const routeWithParam = {
      snapshot: {
        paramMap: {
          get: (key: string) => '123',
        },
      },
    };

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [
        CreateProjectModalComponent,
        FormsModule,
        HttpClientTestingModule,
      ],
      providers: [
        { provide: ProjectService, useValue: projectServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
        { provide: ActivatedRoute, useValue: routeWithParam },
      ],
    }).compileComponents();

    // When
    const testFixture = TestBed.createComponent(CreateProjectModalComponent);
    const testComponent = testFixture.componentInstance;
    testComponent.loadProjectId();

    // Then
    expect(testComponent.projectId).toBe(123);
  });
});
