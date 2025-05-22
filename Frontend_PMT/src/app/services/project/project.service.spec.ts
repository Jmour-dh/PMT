import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ProjectService } from './project.service';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

registerLocaleData(localeFr, 'fr-FR');

describe('ProjectService', () => {
  let service: ProjectService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProjectService],
    });

    service = TestBed.inject(ProjectService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create a new project (createProject)', () => {
    const newProject = {
      id: 1,
      name: 'New Project',
      description: 'New Description',
      startDate: '2023-04-01',
      createdById: 1,
      members: [],
      tasks: [],
    };

    service.createProject(newProject).subscribe((project) => {
      expect(project).toEqual(newProject);
    });

    const req = httpMock.expectOne('/api/projects/');
    expect(req.request.method).toBe('POST');
    req.flush(newProject);
  });

  it('should update an existing project (updateProject)', () => {
    const updatedProject = {
      id: 1,
      name: 'Updated Project',
      description: 'Updated Description',
      startDate: '2023-04-01',
      createdById: 1,
      members: [],
      tasks: [],
      project: null,
    };

    service.updateProject(updatedProject).subscribe((project) => {
      expect(project).toEqual(updatedProject);
    });

    const req = httpMock.expectOne('/api/projects/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body.startDate).toBe('2023-04-01');
    req.flush(updatedProject);
  });

  it('should fetch all projects (getAllProjects)', () => {
    // Given
    const mockProjects: any[] = [
      { id: 1, name: 'Project 1' },
      { id: 2, name: 'Project 2' },
    ];

    // When
    service.getAllProjects().subscribe((projects) => {
      expect(projects.length).toBe(2);
      expect(projects).toEqual(mockProjects);
    });

    const req = httpMock.expectOne('/api/projects/');
    expect(req.request.method).toBe('GET');

    // Then
    req.flush(mockProjects);
  });

  it('should fetch a project by ID (getProjectById)', () => {
    // Given
    const mockProject = {
      id: 1,
      name: 'Project 1',
      description: 'Description of Project 1',
      startDate: '2023-04-01',
      createdById: 1,
      members: [],
      tasks: [],
    };
    // When
    service.getProjectById(1).subscribe((project) => {
      // Then
      expect(project).toEqual(mockProject);
    });

    // When
    const req = httpMock.expectOne('/api/projects/1');
    expect(req.request.method).toBe('GET');
    // Then
    req.flush(mockProject);
  });

  it('should delete a project (deleteProject)', () => {
    // Given
    service.deleteProject(1).subscribe((response) => {
      expect(response).toBeNull();
    });

    // When
    const req = httpMock.expectOne('/api/projects/1');
    expect(req.request.method).toBe('DELETE');

    // Then
    req.flush(null);
  });
});
