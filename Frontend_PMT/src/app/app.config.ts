import { ApplicationConfig, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';
import { UserService } from './services/user.service';
import { ProjectService } from './services/project.service';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

// Enregistrer les données de localisation françaises
registerLocaleData(localeFr);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    UserService,
    ProjectService,
    { provide: LOCALE_ID, useValue: 'fr-FR' }
  ]
};
