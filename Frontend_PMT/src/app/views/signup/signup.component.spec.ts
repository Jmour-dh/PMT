import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SignupComponent } from './signup.component';
import { AuthService } from '../../services/auth/auth.service';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { of, throwError } from 'rxjs';

// Mock Router implementation for testing navigation
class MockRouter {
  events = of(null); 
  navigate = jasmine.createSpy('navigate'); 
  createUrlTree = jasmine.createSpy('createUrlTree'); 
  serializeUrl = jasmine.createSpy('serializeUrl');
}

// Mock ActivatedRoute for testing route parameters
class MockActivatedRoute {
  snapshot = { data: {} }; 
  params = of({}); 
  queryParams = of({}); 
  fragment = of(null); 
  outlet = ''; 
  component = null;
}

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    // Create spy object for AuthService with signup method
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['signup']);

    await TestBed.configureTestingModule({
      imports: [
        FormsModule, 
        CommonModule, 
        SignupComponent 
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy }, 
        { provide: Router, useClass: MockRouter }, 
        { provide: ActivatedRoute, useClass: MockActivatedRoute }, 
        { provide: RouterLink, useValue: {} }
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  beforeEach(() => {
    // Create component instance
    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    // Trigger initial change detection
    fixture.detectChanges();
  });

  // Test 1: Component creation
  it('should create', () => {
    expect(component).toBeTruthy(); // Verify component is properly initialized
  });

  // Test 2: Password mismatch validation
  it('should not call signup when passwords do not match', () => {
    // Set up test data with mismatched passwords
    component.credentials = {
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123',
      confirmPassword: 'differentpassword'
    };

    component.onSignUp();

    // Verify error message and that signup wasn't called
    expect(component.errorMessage).toBe('Les mots de passe ne correspondent pas');
    expect(authService.signup).not.toHaveBeenCalled();
  });

  // Test 3: Email already exists error handling
  it('should set error message when email already exists', fakeAsync(() => {
    // Mock error response for existing email
    const errorResponse = { error: { message: 'Email already exists' } };
    authService.signup.and.returnValue(throwError(() => errorResponse));

    // Set up test data
    component.credentials = {
      email: 'existing@example.com',
      username: 'testuser',
      password: 'password123',
      confirmPassword: 'password123'
    };

    component.onSignUp();
    tick(); // Wait for async operations

    // Verify error message and loading state
    expect(component.errorMessage).toBe('Cet email est déjà utilisé');
    expect(component.isLoading).toBeFalse();
  }));

  // Test 4: Username already exists error handling
  it('should set error message when username already exists', fakeAsync(() => {
    // Mock error response for existing username
    const errorResponse = { error: { message: 'Username already exists' } };
    authService.signup.and.returnValue(throwError(() => errorResponse));

    // Set up test data
    component.credentials = {
      email: 'test@example.com',
      username: 'existinguser',
      password: 'password123',
      confirmPassword: 'password123'
    };

    component.onSignUp();
    tick(); // Wait for async operations

    // Verify error message and loading state
    expect(component.errorMessage).toBe('Ce nom d\'utilisateur est déjà utilisé');
    expect(component.isLoading).toBeFalse();
  }));

  // Test 5: Empty password validation
  it('should set error message when password is empty', fakeAsync(() => {
    // Mock error response for empty password
    const errorResponse = { error: { message: 'Password cannot be null or blank' } };
    authService.signup.and.returnValue(throwError(() => errorResponse));

    // Set up test data with empty password
    component.credentials = {
      email: 'test@example.com',
      username: 'testuser',
      password: '',
      confirmPassword: ''
    };

    component.onSignUp();
    tick(); // Wait for async operations

    // Verify error message and loading state
    expect(component.errorMessage).toBe('Le mot de passe ne peut pas être vide');
    expect(component.isLoading).toBeFalse();
  }));

  // Test 6: Successful signup navigation
  it('should navigate to signin on successful signup', fakeAsync(() => {
    const router = TestBed.inject(Router);
    // Mock successful signup response
    authService.signup.and.returnValue(of({}));

    // Set up valid test data
    component.credentials = {
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123',
      confirmPassword: 'password123'
    };

    component.onSignUp();
    tick(); // Wait for async operations

    // Verify navigation and loading state
    expect(router.navigate).toHaveBeenCalledWith(['/signin']);
    expect(component.isLoading).toBeFalse();
  }));

  // Test 7: Generic error handling
  it('should set generic error message on unknown error', fakeAsync(() => {
    // Mock generic error response
    const errorResponse = { error: { message: 'Unknown error' } };
    authService.signup.and.returnValue(throwError(() => errorResponse));

    // Set up test data
    component.credentials = {
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123',
      confirmPassword: 'password123'
    };

    component.onSignUp();
    tick(); // Wait for async operations

    // Verify generic error message and loading state
    expect(component.errorMessage).toBe('Une erreur est survenue lors de l\'inscription');
    expect(component.isLoading).toBeFalse();
  }));

  // Test 8: Loading state prevention
  it('should not call signup when already loading', () => {
    // Set loading state to true
    component.isLoading = true;
    // Set up test data
    component.credentials = {
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123',
      confirmPassword: 'password123'
    };

    component.onSignUp();

    // Verify signup wasn't called due to loading state
    expect(authService.signup).not.toHaveBeenCalled();
  });
});