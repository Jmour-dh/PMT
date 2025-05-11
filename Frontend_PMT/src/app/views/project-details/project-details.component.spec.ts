import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProjectService } from '../../services/project.service';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

beforeAll(() => {
    registerLocaleData(localeFr, 'fr-FR');
  });

describe('ProjectService', () => {
  let service: ProjectService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProjectService]
    });

    service = TestBed.inject(ProjectService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create a new project (createProject)', () => {
    const newProject = { name: 'New Project', description: 'New Description', startDate: '2023-03-01' };
    const mockResponse = {
      id: 3,
      ...newProject,
      createdById: 1,
      members: [],
      tasks: [],
      project: null // Ajout de la propriété `project`
    };
  
    service.createProject(newProject).subscribe((project) => {
      expect(project).toEqual(mockResponse);
    });
  
    const req = httpMock.expectOne('/api/projects/');
    expect(req.request.method).toBe('POST');
    expect(req.request.body.startDate).toBe('2023-03-01');
    req.flush(mockResponse);
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
      project: null // Ajout de la propriété `project`
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
    const mockProjects: any[] = [
      {
        id: 1,
        name: 'Project 1',
        description: 'Description 1',
        startDate: '2023-01-01',
        createdById: 1,
        members: [],
        tasks: [],
        project: null // Ajout de la propriété `project`
      },
      {
        id: 2,
        name: 'Project 2',
        description: 'Description 2',
        startDate: '2023-02-01',
        createdById: 2,
        members: [],
        tasks: [],
        project: null // Ajout de la propriété `project`
      }
    ];
  
    service.getAllProjects().subscribe((projects: any[]) => {
      expect(projects.length).toBe(2);
      expect(projects).toEqual(mockProjects);
    });
  
    const req = httpMock.expectOne('/api/projects/');
    expect(req.request.method).toBe('GET');
    req.flush(mockProjects);
  });
  
  it('should fetch a project by ID (getProjectById)', () => {
    const mockProject = {
      id: 1,
      name: 'Project 1',
      description: 'Description 1',
      startDate: '2023-01-01',
      createdById: 1,
      members: [],
      tasks: [],
      project: null // Ajout de la propriété `project`
    };
  
    service.getProjectById(1).subscribe((project: any) => {
      expect(project).toEqual(mockProject);
    });
  
    const req = httpMock.expectOne('/api/projects/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockProject);
  });
});