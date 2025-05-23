import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TaskService } from './Task.service';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TaskService],
    });

    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should call assignTask and send a PATCH request', () => {
    // Given
    const projectId = 1;
    const taskId = 2;
    const userId = 3;
    const mockResponse = { success: true };

    // When
    service.assignTask(projectId, taskId, userId).subscribe((response) => {
      // Then
      expect(response).toEqual(mockResponse);
    });

    // Then
    const req = httpMock.expectOne(
      `${service['apiUrl']}${projectId}/${taskId}/assign/${userId}`
    );
    expect(req.request.method).toBe('PATCH');
    expect(req.request.headers.get('Authorization')).toContain('Bearer');
    req.flush(mockResponse);
  });

  it('should call getTaskHistory and send a GET request', () => {
    // Given
    const taskId = 1;
    const mockHistory = [
      { id: 1, action: 'Created', timestamp: '2023-01-01T12:00:00Z' },
      { id: 2, action: 'Updated', timestamp: '2023-01-02T12:00:00Z' },
    ];

    // When
    service.getTaskHistory(taskId).subscribe((history) => {
      // Then
      expect(history).toEqual(mockHistory);
    });

    // Then
    const req = httpMock.expectOne(`api/task-history/${taskId}`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toContain('Bearer');
    req.flush(mockHistory);
  });

  it('should call updateTask and send a PUT request', () => {
    // Given
    const taskId = 1;
    const updatedTask = { title: 'Updated Task Title' };
    const mockResponse = { success: true };

    // When
    service.updateTask(taskId, updatedTask).subscribe((response) => {
      // Then
      expect(response).toEqual(mockResponse);
    });

    // Then
    const req = httpMock.expectOne(`${service['apiUrl']}${taskId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.headers.get('Authorization')).toContain('Bearer');
    expect(req.request.body).toEqual(updatedTask);
    req.flush(mockResponse);
  });

  it('should call deleteTask and send a DELETE request', () => {
    // Given
    const taskId = 1;
    const userId = 123;
    const mockResponse = { success: true };

    // When
    service.deleteTask(taskId, userId).subscribe((response) => {
      // Then
      expect(response).toEqual(mockResponse);
    });

    // Then
    const req = httpMock.expectOne(
      `${service['apiUrl']}${taskId}?userId=${userId}`
    );
    expect(req.request.method).toBe('DELETE');
    expect(req.request.headers.get('Authorization')).toContain('Bearer');
    req.flush(mockResponse);
  });
});
