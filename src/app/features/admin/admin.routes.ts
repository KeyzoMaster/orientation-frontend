import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    children: [
      { 
        path: '', 
        redirectTo: 'filieres', 
        pathMatch: 'full' 
      },
      { 
        path: 'filieres', 
        loadComponent: () => import('./admin-dashboard/admin-dashboard').then(m => m.AdminDashboardComponent) 
      }
    ]
  }
];