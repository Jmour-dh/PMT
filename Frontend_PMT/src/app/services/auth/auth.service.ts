import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { EnvironmentService } from '../environment.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private environmentService: EnvironmentService
  ) {
    this.checkAuth();
  }

  public checkAuth() {
    const token = localStorage.getItem('token');
    this.isAuthenticatedSubject.next(!!token);
    console.log('AuthService initialized, isAuthenticated:', this.isAuthenticatedSubject.value);
    
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  login(email: string, password: string): Observable<string> {
    return this.http.post(
      `${this.environmentService.getApiUrl()}/auth/login`, 
      { email, password },
      { responseType: 'text' }
    ).pipe(
      tap((token: string) => {
        this.handleLoginSuccess(token); 
      })
    );
  }

  signup(email: string, username: string, password: string): Observable<any> {
    return this.http.post(
      `${this.environmentService.getApiUrl()}/auth/signup`,
      { email, username, password }
    );
  }

  handleLoginSuccess(token: string) {
    localStorage.setItem('token', token);
    this.isAuthenticatedSubject.next(true);
    this.router.navigate(['/dashboard']);
  }

  logout() {
    localStorage.removeItem('token');
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/signin']);
  }
} 