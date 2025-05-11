import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { ProjectService } from '../../services/project.service';
import { UserService } from '../../services/user.service';
import { of, throwError } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { User } from '../../models/user.model';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let mockProjectService: jasmine.SpyObj<ProjectService>;
  let mockUserService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    mockProjectService = jasmine.createSpyObj('ProjectService', ['getAllProjects', 'projectCreated$']);
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

  it('devrait créer le composant', () => {
    // This test ensures that the component is created successfully.
    expect(component).toBeTruthy();
  });

  it('devrait charger les projets avec succès', fakeAsync(() => {
    // This test verifies that the component correctly loads projects
    // when the API call is successful.
    const mockProjects = [
      { id: 1, name: 'Project 1', description: '', startDate: '', createdById: 1, members: [], tasks: [] },
      { id: 2, name: 'Project 2', description: '', startDate: '', createdById: 2, members: [], tasks: [] },
    ];
    mockProjectService.getAllProjects.and.returnValue(of(mockProjects));

    component.loadProjects();
    tick();

    expect(component.projects).toEqual(mockProjects);
    expect(component.isLoading).toBeFalse();
  }));

  it('devrait gérer une erreur lors du chargement des projets', fakeAsync(() => {
    // This test checks that the component handles errors correctly
    // when the API call to load projects fails.
    mockProjectService.getAllProjects.and.returnValue(throwError(() => new Error('Erreur API')));

    component.loadProjects();
    tick();

    expect(component.projects).toEqual([]);
    expect(component.isLoading).toBeFalse();
  }));

  it('devrait charger les projets utilisateur avec succès', fakeAsync(() => {
    // This test verifies that the component correctly loads user-specific projects
    // when the API call is successful.
    const mockUser: User = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      createdAt: '',
      createdProjects: [],
      memberProjects: [{ id: 1, username: 'testuser', role: 'MEMBER', name: 'Project 1', description: '' }],
      assignedTasks: [],
    };
    mockUserService.getUserProfile.and.returnValue(of(mockUser));

    component.loadUserProjects();
    tick();

    expect(component.userProjectIds).toEqual([1]);
  }));

  it('devrait gérer une erreur lors du chargement des projets utilisateur', fakeAsync(() => {
    // This test ensures that the component handles errors correctly
    // when the API call to load user-specific projects fails.
    mockUserService.getUserProfile.and.returnValue(throwError(() => new Error('Erreur API')));

    component.loadUserProjects();
    tick();

    expect(component.userProjectIds).toEqual([]);
  }));

  it('devrait vérifier si un utilisateur est membre d\'un projet', () => {
    // This test checks if the method correctly identifies whether a user
    // is a member of a specific project based on their project IDs.
    component.userProjectIds = [1, 2, 3];
    const project = { id: 2, name: 'Project 2', description: '', startDate: '', createdById: 1, members: [], tasks: [] };

    const isMember = component.isUserMemberOfProject(project);

    expect(isMember).toBeTrue();
  });

  it('devrait rafraîchir les projets', fakeAsync(() => {
    // This test ensures that the refreshProjects method calls the necessary
    // methods to reload projects and user projects, and triggers change detection.
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