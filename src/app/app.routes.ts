import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'users',
    pathMatch: 'full',
  },
  {
    path: 'users',
    loadComponent: () => import('./github/components/github-users-list/github-users-list.component').then(m => m.GithubUsersListComponent),
  },
  {
    path: 'users/:username',
    loadComponent: () => import('./github/components/github-user/github-user.component').then(m => m.GithubUserComponent),
  },
];
