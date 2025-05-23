import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateTaskModalComponent } from './create-task-modal.component';
import { TaskService } from '../../services/task/Task.service';
import { UserService } from '../../services/user/user.service';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TaskPriority, TaskStatus } from '../../services/project/project.service';

describe('CreateTaskModalComponent', () => {
  let component: CreateTaskModalComponent;
  let fixture: ComponentFixture<CreateTaskModalComponent>;
  let taskServiceSpy: jasmine.SpyObj<TaskService>;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  const mockActivatedRoute = {
    snapshot: {
      paramMap: {
        get: (key: string) => '1', // Simule un projectId = 1
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

  const mockTask = {
    id: 1,
    title: 'Test Task',
    description: 'Test Description',
    priority: TaskPriority.MEDIUM,
    status: TaskStatus.TODO,
    dueDate: '2023-01-01T00:00:00',
    createdById: 1,
    projectId: 1,
  };

  beforeEach(async () => {
    const taskSpy = jasmine.createSpyObj('TaskService', ['createTask', 'updateTask']);
    const userSpy = jasmine.createSpyObj('UserService', ['getUserProfile']);

    userSpy.getUserProfile.and.returnValue(of(mockUser));
    taskSpy.createTask.and.returnValue(of(mockTask));
    taskSpy.updateTask.and.returnValue(of(mockTask));

    await TestBed.configureTestingModule({
      imports: [CreateTaskModalComponent, FormsModule, HttpClientTestingModule],
      providers: [
        { provide: TaskService, useValue: taskSpy },
        { provide: UserService, useValue: userSpy },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateTaskModalComponent);
    component = fixture.componentInstance;
    taskServiceSpy = TestBed.inject(TaskService) as jasmine.SpyObj<TaskService>;
    userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.task).toEqual({
      title: '',
      description: '',
      priority: TaskPriority.MEDIUM,
      status: TaskStatus.TODO,
      dueDate: '',
      createdById: 1, 
      projectId: 1,   
    });
    expect(component.priorities).toEqual(Object.values(TaskPriority));
    expect(component.statuses).toEqual(Object.values(TaskStatus));
  });

  it('should load current user and project ID on init', () => {
    expect(userServiceSpy.getUserProfile).toHaveBeenCalled();
    expect(component.task.projectId).toBe(1);
    expect(component.task.createdById).toBe(1);
  });

  it('should handle error when loading user fails', () => {
    const errorResponse = new Error('Failed to load user');
    userServiceSpy.getUserProfile.and.returnValue(throwError(() => errorResponse));
    
    spyOn(console, 'error');
    component.loadCurrentUser();
    
    expect(console.error).toHaveBeenCalledWith('Error loading user:', errorResponse);
  });

  it('should create a task successfully', () => {
    const newTask = {
      title: 'New Task',
      description: 'New Description',
      priority: TaskPriority.HIGH,
      status: TaskStatus.TODO,
      dueDate: '2023-01-01',
      createdById: 1,
      projectId: 1,
    };

    component.task = newTask;
    spyOn(component.taskCreated, 'emit');
    spyOn(component, 'closeModal');

    component.onSubmit(new Event('submit'));

    const expectedTaskToSend = {
      ...newTask,
      dueDate: '2023-01-01T00:00:00'
    };

    expect(taskServiceSpy.createTask).toHaveBeenCalledWith(expectedTaskToSend);
    expect(component.taskCreated.emit).toHaveBeenCalled();
    expect(component.closeModal).toHaveBeenCalled();
    expect(component.isLoading).toBeFalse();
  });

  it('should update a task successfully in edit mode', () => {
    const updatedTask = {
      id: 1,
      title: 'Updated Task',
      description: 'Updated Description',
      priority: TaskPriority.LOW,
      status: TaskStatus.IN_PROGRESS,
      dueDate: '2023-02-01',
      createdById: 1,
      projectId: 1,
    };

    component.isEditMode = true;
    component.taskId = 1;
    component.task = updatedTask;
    
    spyOn(component.taskUpdated, 'emit');
    spyOn(component, 'closeModal');

    component.onSubmit(new Event('submit'));

    const expectedTaskToSend = {
      ...updatedTask,
      dueDate: '2023-02-01T00:00:00'
    };

    expect(taskServiceSpy.updateTask).toHaveBeenCalledWith(1, expectedTaskToSend);
    expect(component.taskUpdated.emit).toHaveBeenCalled();
    expect(component.closeModal).toHaveBeenCalled();
    expect(component.isLoading).toBeFalse();
  });

  it('should not submit if form is invalid', () => {
    const invalidTask = {
      title: '',
      description: '',
      priority: TaskPriority.MEDIUM,
      status: TaskStatus.TODO,
      dueDate: '',
      createdById: 1,
      projectId: 1,
    };

    component.task = invalidTask;
    component.onSubmit(new Event('submit'));

    expect(taskServiceSpy.createTask).not.toHaveBeenCalled();
    expect(taskServiceSpy.updateTask).not.toHaveBeenCalled();
  });

  it('should handle error when creating task fails', () => {
    const newTask = {
      title: 'New Task',
      description: 'New Description',
      priority: TaskPriority.HIGH,
      status: TaskStatus.TODO,
      dueDate: '2023-01-01',
      createdById: 1,
      projectId: 1,
    };

    const errorResponse = new Error('Failed to create task');
    taskServiceSpy.createTask.and.returnValue(throwError(() => errorResponse));
    spyOn(console, 'error');

    component.task = newTask;
    component.onSubmit(new Event('submit'));

    expect(taskServiceSpy.createTask).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith('Error creating task:', errorResponse);
    expect(component.isLoading).toBeFalse();
  });

  it('should handle error when updating task fails', () => {
    const updatedTask = {
      id: 1,
      title: 'Updated Task',
      description: 'Updated Description',
      priority: TaskPriority.LOW,
      status: TaskStatus.IN_PROGRESS,
      dueDate: '2023-02-01',
      createdById: 1,
      projectId: 1,
    };

    component.isEditMode = true;
    component.taskId = 1;
    component.task = updatedTask;
    
    const errorResponse = new Error('Failed to update task');
    taskServiceSpy.updateTask.and.returnValue(throwError(() => errorResponse));
    spyOn(console, 'error');

    component.onSubmit(new Event('submit'));

    expect(taskServiceSpy.updateTask).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith('Error updating task:', errorResponse);
    expect(component.isLoading).toBeFalse();
  });

  it('should initialize with task data when taskToEdit is provided', () => {
    const existingTask = {
      id: 1,
      title: 'Existing Task',
      description: 'Existing Description',
      priority: TaskPriority.HIGH,
      status: TaskStatus.DONE,
      dueDate: '2023-01-01T00:00:00',
      createdById: 1,
      projectId: 1,
    };

    component.taskToEdit = existingTask;

    expect(component.isEditMode).toBeTrue();
    expect(component.taskId).toBe(1);
    expect(component.task).toEqual({
      title: 'Existing Task',
      description: 'Existing Description',
      priority: TaskPriority.HIGH,
      status: TaskStatus.DONE,
      dueDate: '2023-01-01',
      createdById: 1,
      projectId: 1,
    });
  });

  it('should reset form when closeModal is called', () => {
    component.task = {
      title: 'Test',
      description: 'Test',
      priority: TaskPriority.HIGH,
      status: TaskStatus.DONE,
      dueDate: '2023-01-01',
      createdById: 1,
      projectId: 1,
    };
    component.isEditMode = true;
    component.taskId = 1;

    spyOn(component.close, 'emit');
    component.closeModal();

    expect(component.close.emit).toHaveBeenCalled();
    expect(component.task).toEqual({
      title: '',
      description: '',
      priority: TaskPriority.MEDIUM,
      status: TaskStatus.TODO,
      dueDate: '',
      createdById: 0,
      projectId: 1, // projectId doit être conservé
    });
    expect(component.isEditMode).toBeFalse();
    expect(component.taskId).toBeNull();
  });

  it('should show toast message after successful operation', () => {
    const newTask = {
      title: 'New Task',
      description: 'New Description',
      priority: TaskPriority.HIGH,
      status: TaskStatus.TODO,
      dueDate: '2023-01-01',
      createdById: 1,
      projectId: 1,
    };

    component.task = newTask;
    component.onSubmit(new Event('submit'));

    expect(component.showToast).toBeTrue();
    expect(component.toastMessage).toBe('Tâche créée avec succès');
    expect(component.toastColor).toBe('#4caf50');
  });
});