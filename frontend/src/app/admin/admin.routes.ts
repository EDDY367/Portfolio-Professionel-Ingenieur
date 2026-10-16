import { Routes } from '@angular/router';
import { AdminShellComponent } from './admin-shell';
import { DashboardComponent } from './pages/dashboard';
import { MessagesComponent } from './pages/messages';
import { ProfileEditorComponent } from './pages/profile';
import { ResourceListComponent } from './pages/resource-list';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminShellComponent,
    children: [
      { path: '', component: DashboardComponent, title: 'Admin · Vue d’ensemble' },
      { path: 'profile', component: ProfileEditorComponent, title: 'Admin · Profil' },
      { path: 'messages', component: MessagesComponent, title: 'Admin · Messages' },
      { path: ':type', component: ResourceListComponent, title: 'Admin' },
    ],
  },
];
