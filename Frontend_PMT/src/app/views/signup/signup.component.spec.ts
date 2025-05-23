import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { SignupComponent } from './signup.component';
import { AuthService } from '../../services/auth/auth.service';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { of, throwError } from 'rxjs';

class MockRouter {
  events = of(null);
  navigate = jasmine.createSpy('navigate');
  createUrlTree = jasmine.createSpy('createUrlTree');
  serializeUrl = jasmine.createSpy('serializeUrl');
}

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
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['signup']);

    await TestBed.configureTestingModule({
      imports: [FormsModule, CommonModule, SignupComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useClass: MockRouter },
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        { provide: RouterLink, useValue: {} },
      ],
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not call signup when passwords do not match', () => {
    component.credentials = {
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123',
      confirmPassword: 'differentpassword',
    };

    component.onSignUp();

    expect(component.errorMessage).toBe(
      'Les mots de passe ne correspondent pas'
    );
    expect(authService.signup).not.toHaveBeenCalled();
  });

  it('should set error message when email already exists', fakeAsync(() => {
    const errorResponse = { error: { message: 'Email already exists' } };
    authService.signup.and.returnValue(throwError(() => errorResponse));

    component.credentials = {
      email: 'existing@example.com',
      username: 'testuser',
      password: 'password123',
      confirmPassword: 'password123',
    };

    component.onSignUp();
    tick();

    expect(component.errorMessage).toBe('Cet email est déjà utilisé');
    expect(component.isLoading).toBeFalse();
  }));

  it('should set error message when username already exists', fakeAsync(() => {
    const errorResponse = { error: { message: 'Username already exists' } };
    authService.signup.and.returnValue(throwError(() => errorResponse));

    component.credentials = {
      email: 'test@example.com',
      username: 'existinguser',
      password: 'password123',
      confirmPassword: 'password123',
    };

    component.onSignUp();
    tick();

    expect(component.errorMessage).toBe(
      "Ce nom d'utilisateur est déjà utilisé"
    );
    expect(component.isLoading).toBeFalse();
  }));

  it('should set error message when password is empty', fakeAsync(() => {
    const errorResponse = {
      error: { message: 'Password cannot be null or blank' },
    };
    authService.signup.and.returnValue(throwError(() => errorResponse));

    component.credentials = {
      email: 'test@example.com',
      username: 'testuser',
      password: '',
      confirmPassword: '',
    };

    component.onSignUp();
    tick();

    expect(component.errorMessage).toBe(
      'Le mot de passe ne peut pas être vide'
    );
    expect(component.isLoading).toBeFalse();
  }));

  it('should navigate to signin on successful signup', fakeAsync(() => {
    const router = TestBed.inject(Router);
    authService.signup.and.returnValue(of({}));

    component.credentials = {
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123',
      confirmPassword: 'password123',
    };

    component.onSignUp();
    tick();

    expect(router.navigate).toHaveBeenCalledWith(['/signin']);
    expect(component.isLoading).toBeFalse();
  }));

  it('should set generic error message on unknown error', fakeAsync(() => {
    const errorResponse = { error: { message: 'Unknown error' } };
    authService.signup.and.returnValue(throwError(() => errorResponse));

    component.credentials = {
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123',
      confirmPassword: 'password123',
    };

    component.onSignUp();
    tick();
    expect(component.errorMessage).toBe(
      "Une erreur est survenue lors de l'inscription"
    );
    expect(component.isLoading).toBeFalse();
  }));

  it('should not call signup when already loading', () => {
    component.isLoading = true;

    component.credentials = {
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123',
      confirmPassword: 'password123',
    };

    component.onSignUp();

    expect(authService.signup).not.toHaveBeenCalled();
  });
});
