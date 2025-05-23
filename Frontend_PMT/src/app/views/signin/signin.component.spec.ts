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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty credentials and not loading', () => {
    expect(component.credentials.email).toBe('');
    expect(component.credentials.password).toBe('');
    expect(component.errorMessage).toBe('');
    expect(component.isLoading).toBeFalse();
  });

  it('should not call login when already loading', () => {
    component.isLoading = true;
    component.onSignIn();
    expect(authService.login).not.toHaveBeenCalled();
  });

  it('should handle successful login', fakeAsync(() => {
    const mockToken = 'mock-token';
    authService.login.and.returnValue(of(mockToken));
    
    component.credentials = {
      email: 'test@example.com',
      password: 'password123'
    };
    
    component.onSignIn();
    tick();
    
    expect(authService.login).toHaveBeenCalledWith('test@example.com', 'password123');
    expect(authService.handleLoginSuccess).toHaveBeenCalledWith(mockToken);
    expect(component.isLoading).toBeFalse();
    expect(component.errorMessage).toBe('');
  }));

  it('should handle failed login', fakeAsync(() => {
    authService.login.and.returnValue(throwError(() => new Error('Login failed')));
    
    component.credentials = {
      email: 'wrong@example.com',
      password: 'wrongpass'
    };
    
    component.onSignIn();
    tick();
    
    expect(authService.login).toHaveBeenCalledWith('wrong@example.com', 'wrongpass');
    expect(authService.handleLoginSuccess).not.toHaveBeenCalled();
    expect(component.isLoading).toBeFalse();
    expect(component.errorMessage).toBe('Email ou mot de passe incorrect');
  }));

});