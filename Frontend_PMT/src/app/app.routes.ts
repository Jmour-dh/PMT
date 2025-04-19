import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { AuthGuard } from './guards/auth.guard';
import { PublicGuard } from './guards/public.guard';
import { ProfileComponent } from './views/profile/profile.component';

export const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },
            {
                path: 'dashboard',
                loadComponent: () => import('./views/dashboard/dashboard.component').then(m => m.DashboardComponent)
            },
            {
                path: 'profile',
                component: ProfileComponent
            }
        ]
    },
    {
        path: '',
        component: AuthLayoutComponent,
        children: [
            {
                path: 'signin',
                loadComponent: () => import('./views/signin/signin.component').then(m => m.SigninComponent)
            },
            {
                path: 'signup',
                loadComponent: () => import('./views/signup/signup.component').then(m => m.SignupComponent)
            }
        ]
    },
    {
        path: '**',
        redirectTo: 'dashboard'
    }
];
