import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard'
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard-page.component').then((m) => m.DashboardPageComponent)
  },
  {
    path: 'frictions',
    loadComponent: () =>
      import('./features/frictions/frictions-page.component').then((m) => m.FrictionsPageComponent)
  },
  {
    path: 'frictions/new',
    loadComponent: () =>
      import('./features/frictions/friction-form-page.component').then((m) => m.FrictionFormPageComponent)
  },
  {
    path: 'frictions/:id',
    loadComponent: () =>
      import('./features/frictions/friction-detail-page.component').then((m) => m.FrictionDetailPageComponent)
  },
  {
    path: 'frictions/:id/edit',
    loadComponent: () =>
      import('./features/frictions/friction-form-page.component').then((m) => m.FrictionFormPageComponent)
  },
  {
    path: 'initiatives',
    loadComponent: () =>
      import('./features/initiatives/initiatives-page.component').then((m) => m.InitiativesPageComponent)
  },
  {
    path: 'initiatives/:id',
    loadComponent: () =>
      import('./features/initiatives/initiative-detail-page.component').then((m) => m.InitiativeDetailPageComponent)
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
