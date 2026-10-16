import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    title: 'Portfolio',
    loadComponent: () => import('./portfolio/portfolio-page').then((m) => m.PortfolioPageComponent),
  },
  {
    path: 'projects/:slug',
    title: 'Projet',
    loadComponent: () => import('./portfolio/project-detail').then((m) => m.ProjectDetailComponent),
  },
  {
    path: 'admin/login',
    title: 'Connexion · Admin',
    canActivate: [guestGuard],
    loadComponent: () => import('./admin/login').then((m) => m.LoginComponent),
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadChildren: () => import('./admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },
  { path: '**', redirectTo: '' },
];
