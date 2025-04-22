import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { AuthGuard } from './guards/auth.guard';
import { PublicGuard } from './guards/public.guard';
import { ProfileComponent } from './views/profile/profile.component';
import { SigninComponent } from './views/signin/signin.component';
import { SignupComponent } from './views/signup/signup.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { ProjectDetailsComponent } from './views/project-details/project-details.component';

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
                component: DashboardComponent
            },
            {
                path: 'profile',
                component: ProfileComponent
            },
            {
                path: 'projects/:id',
                component: ProjectDetailsComponent
            }
        ]
    },
    {
        path: '',
        component: AuthLayoutComponent,
        canActivate: [PublicGuard],
        children: [
            {
                path: 'signin',
                component: SigninComponent
            },
            {
                path: 'signup',
                component: SignupComponent
            }
        ]
    },
    {
        path: '**',
        redirectTo: 'dashboard'
    }
];
