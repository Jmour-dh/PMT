import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SigninComponent } from './signin.component';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {  of, throwError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

describe('SigninComponent', () => {
  let component: SigninComponent;
  let fixture: ComponentFixture<SigninComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    // Create spy object for AuthService with required methods
    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'login', 
      'handleLoginSuccess'
    ]);

    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        CommonModule,
        RouterTestingModule,
        SigninComponent 
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SigninComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Test 1: Component Creation
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test 2: Initial State
  it('should initialize with empty credentials and not loading', () => {
    expect(component.credentials.email).toBe('');
    expect(component.credentials.password).toBe('');
    expect(component.errorMessage).toBe('');
    expect(component.isLoading).toBeFalse();
  });

  // Test 3: Prevent login when already loading
  it('should not call login when already loading', () => {
    component.isLoading = true;
    component.onSignIn();
    expect(authService.login).not.toHaveBeenCalled();
  });

  // Test 4: Successful login
  it('should handle successful login', fakeAsync(() => {
    const mockToken = 'mock-token';
    authService.login.and.returnValue(of(mockToken));
    
    component.credentials = {
      email: 'test@example.com',
      password: 'password123'
    };
    
    component.onSignIn();
    tick(); // Wait for async operations
    
    // Verify service calls and state changes
    expect(authService.login).toHaveBeenCalledWith('test@example.com', 'password123');
    expect(authService.handleLoginSuccess).toHaveBeenCalledWith(mockToken);
    expect(component.isLoading).toBeFalse();
    expect(component.errorMessage).toBe('');
  }));

  // Test 5: Failed login
  it('should handle failed login', fakeAsync(() => {
    authService.login.and.returnValue(throwError(() => new Error('Login failed')));
    
    component.credentials = {
      email: 'wrong@example.com',
      password: 'wrongpass'
    };
    
    component.onSignIn();
    tick(); // Wait for async operations
    
    // Verify error handling
    expect(authService.login).toHaveBeenCalledWith('wrong@example.com', 'wrongpass');
    expect(authService.handleLoginSuccess).not.toHaveBeenCalled();
    expect(component.isLoading).toBeFalse();
    expect(component.errorMessage).toBe('Email ou mot de passe incorrect');
  }));

//   // Test 6: Loading state during login
//   it('should set loading state during login', fakeAsync(() => {
//     const mockToken = 'mock-token';
//     authService.login.and.returnValue(of(mockToken));
    
//     component.credentials = {
//       email: 'test@example.com',
//       password: 'password123'
//     };
    
//     // Verify initial state
//     expect(component.isLoading).toBeFalse();
    
//     component.onSignIn();
    
//     // Verify loading state during call
//     expect(component.isLoading).toBeTrue();
    
//     tick(); // Complete async operation
    
//     // Verify loading state after completion
//     expect(component.isLoading).toBeFalse();
//   }));

//   // Test 7: Error message clearing
//   it('should set loading state during login', fakeAsync(() => {
//     // Mock de authService.login
//     authService.login.and.returnValue(of('mockToken').pipe(delay(100)));
  
//     // Vérifiez l'état initial
//     expect(component.isLoading).toBeFalse();
  
//     // Déclenchez la connexion
//     component.onSignIn();
  
//     // Vérifiez que l'état de chargement est défini immédiatement
//     expect(component.isLoading).toBeTrue();
  
//     // Simulez l'écoulement du temps pour compléter l'observable
//     tick(100);
  
//     // Vérifiez que l'état de chargement est réinitialisé après la complétion
//     expect(component.isLoading).toBeFalse();
//   }));

});