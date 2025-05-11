import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileComponent } from './profile.component';
import { UserService } from '../../services/user.service';
import { ProjectService } from '../../services/project.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpResponse } from '@angular/common/http';

describe('ProfileComponent', () => {
    let component: ProfileComponent;
    let fixture: ComponentFixture<ProfileComponent>;
    let userService: jasmine.SpyObj<UserService>;
  
    beforeEach(async () => {
      // Create spy objects for UserService and ProjectService with mocked methods
      const userServiceSpy = jasmine.createSpyObj('UserService', [
        'getUserProfile',
        'updateUserProfile',
      ]);

  
      // Configure the testing module with necessary imports and providers
      await TestBed.configureTestingModule({
        imports: [ProfileComponent, HttpClientTestingModule], 
        providers: [
          { provide: UserService, useValue: userServiceSpy },
        ],
      }).compileComponents();
  
      // Create component instance and inject dependencies
      fixture = TestBed.createComponent(ProfileComponent);
      component = fixture.componentInstance;
      userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    });
  
    // Test 1: Component creation
    it('should create the component', () => {
      expect(component).toBeTruthy(); 
    });

    // Test 2: Profile loading functionality
    it('should load user profile via loadProfile', () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        createdAt: '2023-01-01',
        createdProjects: [],
        memberProjects: [],
        assignedTasks: [],
      };
      
      userService.getUserProfile.and.returnValue(of(mockUser));

      component.loadProfile();

      expect(userService.getUserProfile).toHaveBeenCalled();
      expect(component.userProfile).toEqual(mockUser);
    });

    // Test 3: Profile update functionality
    it('should submit user profile updates via onSubmit', () => {
      const mockResponse = new HttpResponse({ status: 200 });
      const mockUser = {
        id: 1,
        username: 'updateduser',
        email: 'updated@example.com',
        createdAt: '2023-01-01',
        createdProjects: [],
        memberProjects: [],
        assignedTasks: [],
      };
      
      component.userProfile = { id: 1 } as any;
      component.editForm = { username: 'updateduser', email: 'updated@example.com' };

      userService.updateUserProfile.and.returnValue(of(mockResponse));
      userService.getUserProfile.and.returnValue(of(mockUser));

      component.onSubmit();

      expect(userService.updateUserProfile).toHaveBeenCalledWith('1', component.editForm);
      expect(component.updateSuccess).toBeTrue();
    });
});