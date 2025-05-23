import {
  TestBed,
  ComponentFixture,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { ProjectService } from '../../services/project/project.service';
import { UserService } from '../../services/user/user.service';
import { of, throwError } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { User } from '../../models/user.model';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let mockProjectService: jasmine.SpyObj<ProjectService>;
  let mockUserService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    mockProjectService = jasmine.createSpyObj('ProjectService', [
      'getAllProjects',
      'projectCreated$',
    ]);
    mockUserService = jasmine.createSpyObj('UserService', ['getUserProfile']);

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        { provide: ProjectService, useValue: mockProjectService },
        { provide: UserService, useValue: mockUserService },
        ChangeDetectorRef,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load projects successfully', fakeAsync(() => {
    const mockProjects = [
      {
        id: 1,
        name: 'Project 1',
        description: '',
        startDate: '',
        createdById: 1,
        members: [],
        tasks: [],
      },
      {
        id: 2,
        name: 'Project 2',
        description: '',
        startDate: '',
        createdById: 2,
        members: [],
        tasks: [],
      },
    ];
    mockProjectService.getAllProjects.and.returnValue(of(mockProjects));

    component.loadProjects();
    tick();

    expect(component.projects).toEqual(mockProjects);
    expect(component.isLoading).toBeFalse();
  }));

  it('should handle an error when loading projects', fakeAsync(() => {
    mockProjectService.getAllProjects.and.returnValue(
      throwError(() => new Error('Erreur API'))
    );

    component.loadProjects();
    tick();

    expect(component.projects).toEqual([]);
    expect(component.isLoading).toBeFalse();
  }));

  it('should load user projects successfully', fakeAsync(() => {
    const mockUser: User = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      createdAt: '',
      createdProjects: [],
      memberProjects: [
        {
          id: 1,
          username: 'testuser',
          role: 'MEMBER',
          name: 'Project 1',
          description: '',
        },
      ],
      assignedTasks: [],
    };
    mockUserService.getUserProfile.and.returnValue(of(mockUser));

    component.loadUserProjects();
    tick();

    expect(component.userProjectIds).toEqual([1]);
  }));

  it('should handle an error when loading user projects', fakeAsync(() => {
    mockUserService.getUserProfile.and.returnValue(
      throwError(() => new Error('Erreur API'))
    );

    component.loadUserProjects();
    tick();

    expect(component.userProjectIds).toEqual([]);
  }));

  it('should check if a user is a member of a project', () => {
    component.userProjectIds = [1, 2, 3];
    const project = {
      id: 2,
      name: 'Project 2',
      description: '',
      startDate: '',
      createdById: 1,
      members: [],
      tasks: [],
    };

    const isMember = component.isUserMemberOfProject(project);

    expect(isMember).toBeTrue();
  });

  it('should refresh projects', fakeAsync(() => {
    spyOn(component, 'loadProjects');
    spyOn(component, 'loadUserProjects');
    const cdrSpy = spyOn(component['cdr'], 'detectChanges');

    component.refreshProjects();
    tick();

    expect(component.loadProjects).toHaveBeenCalled();
    expect(component.loadUserProjects).toHaveBeenCalled();
    expect(cdrSpy).toHaveBeenCalled();
  }));
});
