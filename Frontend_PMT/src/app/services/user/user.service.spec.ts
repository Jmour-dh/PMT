import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { UserService } from './user.service';
import { User } from '../../models/user.model';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService],
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should retrieve user profile', () => {
    // Given
    const mockUser: User = {
      id: 1,
      username: 'testuser',
      email: 'testuser@example.com',
      createdAt: '2023-01-01T00:00:00Z',
      createdProjects: [],
      memberProjects: [],
      assignedTasks: [],
    };

    spyOn(localStorage, 'getItem').and.returnValue('mock-token');

    // When
    service.getUserProfile().subscribe((user) => {
      expect(user).toEqual(mockUser);
    });

    // Then
    const req = httpMock.expectOne('/api/users/me');
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer mock-token');
    req.flush(mockUser);
  });

  it('should handle error when retrieving user profile', () => {
    // Given
    const mockError = { status: 404, statusText: 'Not Found' };

    spyOn(localStorage, 'getItem').and.returnValue('mock-token');

    // When
    service.getUserProfile().subscribe(
      () => fail('expected an error, not user data'),
      (error) => {
        expect(error.status).toEqual(404);
        expect(error.statusText).toEqual('Not Found');
      }
    );

    // Then
    const req = httpMock.expectOne('/api/users/me');
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer mock-token');
    req.flush(null, mockError);
  });

  it('should update user profile', () => {
    // Given
    const userId = '123';
    const updateData = {
      email: 'newemail@example.com',
      username: 'newusername',
    };
    const mockResponse = { success: true };

    spyOn(localStorage, 'getItem').and.returnValue('mock-token');
    // When
    service.updateUserProfile(userId, updateData).subscribe((response) => {
      expect(response.body).toEqual(mockResponse);
    });

    // Then
    const req = httpMock.expectOne(`/api/users/${userId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.headers.get('Authorization')).toBe('Bearer mock-token');
    expect(req.request.body).toEqual(updateData);
    req.flush(mockResponse);
  });

  it('should delete user profile', () => {
    // Given
    const userId = '123';
    const mockResponse = { success: true };

    spyOn(localStorage, 'getItem').and.returnValue('mock-token');

    // When
    service.deleteUserProfile(userId).subscribe((response) => {
      expect(response.body).toEqual(mockResponse);
    });

    // Then
    const req = httpMock.expectOne(`/api/users/${userId}`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.headers.get('Authorization')).toBe('Bearer mock-token');
    req.flush(mockResponse);
  });
});
