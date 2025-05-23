import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalAssignComponent } from './modal-assign.component';
import { TaskService } from '../../services/task/Task.service';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ModalAssignComponent', () => {
  let component: ModalAssignComponent;
  let fixture: ComponentFixture<ModalAssignComponent>;
  let taskServiceSpy: jasmine.SpyObj<TaskService>;

  const mockActivatedRoute = {
    snapshot: {
      paramMap: {
        get: (key: string) => '123', // Simule un projectId = 123
      },
    },
  };

  const mockMembers = [
    { id: 1, username: 'user1' },
    { id: 2, username: 'user2' },
    { id: 3, username: 'user3' }
  ];

  beforeEach(async () => {
    const taskSpy = jasmine.createSpyObj('TaskService', ['assignTask']);

    await TestBed.configureTestingModule({
      imports: [ModalAssignComponent, CommonModule, HttpClientTestingModule],
      providers: [
        { provide: TaskService, useValue: taskSpy },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalAssignComponent);
    component = fixture.componentInstance;
    taskServiceSpy = TestBed.inject(TaskService) as jasmine.SpyObj<TaskService>;
    
    // Initialisation des inputs
    component.members = mockMembers;
    component.taskId = 456;
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct values', () => {
    expect(component.members).toEqual(mockMembers);
    expect(component.taskId).toBe(456);
    expect(component.projectId).toBe(123); 
    expect(component.selectedMemberId).toBeNull();
  });

  it('should load projectId from route', () => {
    expect(component.projectId).toBe(123);
  });

  it('should select a member', () => {
    component.selectMember(2);
    expect(component.selectedMemberId).toBe(2);
  });

  it('should assign task successfully', () => {
    component.selectedMemberId = 2;
    taskServiceSpy.assignTask.and.returnValue(of({}));
    
    spyOn(component.taskAssigned, 'emit');
    spyOn(component.closeModal, 'emit');

    component.assignTask();

    expect(taskServiceSpy.assignTask).toHaveBeenCalledWith(123, 456, 2);
    expect(component.taskAssigned.emit).toHaveBeenCalled();
    expect(component.closeModal.emit).toHaveBeenCalled();
  });

  it('should not assign task if missing data', () => {
    // Cas 1: projectId manquant
    component.projectId = null;
    component.assignTask();
    expect(taskServiceSpy.assignTask).not.toHaveBeenCalled();

    // Cas 2: taskId manquant
    component.projectId = 123;
    component.taskId = null;
    component.assignTask();
    expect(taskServiceSpy.assignTask).not.toHaveBeenCalled();

    // Cas 3: selectedMemberId manquant
    component.taskId = 456;
    component.selectedMemberId = null;
    component.assignTask();
    expect(taskServiceSpy.assignTask).not.toHaveBeenCalled();
  });

  it('should handle error when assigning task fails', () => {
    const errorResponse = new Error('Failed to assign task');
    taskServiceSpy.assignTask.and.returnValue(throwError(() => errorResponse));
    spyOn(console, 'error');

    component.selectedMemberId = 2;
    component.assignTask();

    expect(taskServiceSpy.assignTask).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith('Error assigning task:', errorResponse);
  });

  it('should emit closeModal event', () => {
    spyOn(component.closeModal, 'emit');
    component.closeModal.emit();
    expect(component.closeModal.emit).toHaveBeenCalled();
  });
});