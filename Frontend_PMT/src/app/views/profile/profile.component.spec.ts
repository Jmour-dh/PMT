import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ProfileComponent } from './profile.component';
import { UserService } from '../../services/user/user.service';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpResponse } from '@angular/common/http';
import { User } from '../../models/user.model';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let userService: jasmine.SpyObj<UserService>;

  const mockUser: User = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    createdAt: '2023-01-01',
    createdProjects: [],
    memberProjects: [],
    assignedTasks: [],
  };

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UserService', [
      'getUserProfile',
      'updateUserProfile',
      'deleteUserProfile',
    ]);

    await TestBed.configureTestingModule({
      imports: [ProfileComponent, HttpClientTestingModule],
      providers: [{ provide: UserService, useValue: userServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load user profile via loadProfile', () => {
    //Given
    userService.getUserProfile.and.returnValue(of(mockUser));

    //When
    component.loadProfile();
    // Then
    expect(userService.getUserProfile).toHaveBeenCalled();
    expect(component.userProfile).toEqual(mockUser);
    expect(component.editForm.username).toBe(mockUser.username);
    expect(component.editForm.email).toBe(mockUser.email);
    expect(component.isLoading).toBeFalse();
  });

  it('should submit user profile updates via onSubmit', () => {
    // Given
    const mockResponse = new HttpResponse({ status: 200 });
    const updatedUser = {
      ...mockUser,
      username: 'updateduser',
      email: 'updated@example.com',
    };

    component.userProfile = { id: 1 } as User;
    component.editForm = {
      username: 'updateduser',
      email: 'updated@example.com',
    };

    userService.updateUserProfile.and.returnValue(of(mockResponse));
    userService.getUserProfile.and.returnValue(of(updatedUser));
    // When
    component.onSubmit();
    // Then
    expect(userService.updateUserProfile).toHaveBeenCalledWith(
      '1',
      component.editForm
    );
    expect(component.updateSuccess).toBeTrue();
    expect(component.userProfile).toEqual(updatedUser);
  });

  it('should handle different error scenarios appropriately', fakeAsync(() => {
    // Given
    component.userProfile = { id: 1 } as User;

    // Senario 1: 401 Unauthorized
    //Given

    userService.updateUserProfile.and.returnValue(
      throwError(() => ({ status: 401 }))
    );
    //When
    component.onSubmit();
    tick();
    //Then
    expect(component.updateError).toContain('session a expiré');

    // Scenario 2: 403 Forbidden
    //Given
    userService.updateUserProfile.and.returnValue(
      throwError(() => ({ status: 403 }))
    );
    //When
    component.onSubmit();
    tick();

    //Then
    expect(component.updateError).toContain('permissions nécessaires');

    // Scenario 3: 500 Internal Server Error
    //Given
    userService.updateUserProfile.and.returnValue(
      throwError(() => ({ status: 500 }))
    );
    //When
    component.onSubmit();
    tick();
    //Then
    expect(component.updateError).toContain('erreur serveur');
  }));

  it('should set initial form values correctly', () => {
    // Given
    userService.getUserProfile.and.returnValue(of(mockUser));

    // When
    component.loadProfile();

    // Then
    expect(component.editForm.username).toBe(mockUser.username);
    expect(component.editForm.email).toBe(mockUser.email);
    expect(component.initialFormValues).toEqual({
      username: mockUser.username,
      email: mockUser.email,
    });
  });
});
