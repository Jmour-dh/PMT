import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { EnvironmentService } from '../environment.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let environmentService: jasmine.SpyObj<EnvironmentService>;
  let router: Router;

  beforeEach(() => {
    const environmentServiceSpy = jasmine.createSpyObj('EnvironmentService', [
      'getApiUrl',
    ]);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        AuthService,
        { provide: EnvironmentService, useValue: environmentServiceSpy },
      ],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    environmentService = TestBed.inject(
      EnvironmentService
    ) as jasmine.SpyObj<EnvironmentService>;
    router = TestBed.inject(Router);

    environmentService.getApiUrl.and.returnValue('http://localhost:8080/api');
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should update isAuthenticated$ based on token presence in localStorage', (done) => {
    spyOn(localStorage, 'getItem').and.returnValue('fake-token');

    const service = TestBed.inject(AuthService);

    service.checkAuth();

    service.isAuthenticated$.subscribe((isAuthenticated) => {
      expect(isAuthenticated).toBeTrue();
      done();
    });
  });

  it('should handle login and update isAuthenticated$', (done) => {
    const mockResponse = 'fake-jwt-token';

    spyOn(service, 'handleLoginSuccess').and.callThrough(); // Espionne handleLoginSuccess

    service.login('testuser@example.com', 'password').subscribe(() => {
      expect(service.handleLoginSuccess).toHaveBeenCalledWith('fake-jwt-token'); // Vérifie que handleLoginSuccess est appelée

      service.isAuthenticated$.subscribe((isAuthenticated) => {
        expect(isAuthenticated).toBeTrue(); // Vérifie que isAuthenticated$ est mis à jour
        done();
      });
    });

    const req = httpMock.expectOne('http://localhost:8080/api/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      email: 'testuser@example.com',
      password: 'password',
    });
    req.flush(mockResponse); // Simule une réponse de l'API
  });

  it('should navigate to login on logout', () => {
    spyOn(router, 'navigate');

    service.logout();
    expect(router.navigate).toHaveBeenCalledWith(['/signin']);
  });

  it('should send correct data on signup', () => {
    service.signup('testuser@example.com', 'testuser', 'password').subscribe();

    const req = httpMock.expectOne('http://localhost:8080/api/auth/signup');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      email: 'testuser@example.com',
      username: 'testuser',
      password: 'password',
    });
  });
});
