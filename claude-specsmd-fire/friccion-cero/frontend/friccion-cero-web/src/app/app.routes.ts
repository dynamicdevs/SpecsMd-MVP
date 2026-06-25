import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },
  {
    path: 'frictions',
    loadComponent: () =>
      import('./features/frictions/friction-list.component').then((m) => m.FrictionListComponent),
  },
  {
    path: 'frictions/new',
    loadComponent: () =>
      import('./features/frictions/friction-form.component').then((m) => m.FrictionFormComponent),
  },
  {
    path: 'frictions/:id',
    loadComponent: () =>
      import('./features/frictions/friction-detail.component').then(
        (m) => m.FrictionDetailComponent,
      ),
  },
  {
    path: 'frictions/:id/edit',
    loadComponent: () =>
      import('./features/frictions/friction-form.component').then((m) => m.FrictionFormComponent),
  },
  {
    path: 'initiatives',
    loadComponent: () =>
      import('./features/initiatives/initiative-list.component').then(
        (m) => m.InitiativeListComponent,
      ),
  },
  {
    path: 'initiatives/:id',
    loadComponent: () =>
      import('./features/initiatives/initiative-detail.component').then(
        (m) => m.InitiativeDetailComponent,
      ),
  },
  { path: '**', redirectTo: 'dashboard' },
];
