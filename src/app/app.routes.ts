import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { MainLayoutComponent } from './layout/main-layout/main-layout';

export const routes: Routes = [
  // 1. Routes Publiques (Auth)
  {
    path: 'auth',
    children: [
      { 
        path: 'login', 
        loadComponent: () => import('./features/auth/login/login').then(m => m.LoginComponent) 
      },
      { 
        path: 'register', 
        loadComponent: () => import('./features/auth/register/register').then(m => m.RegisterComponent) 
      },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },

  // 2. Routes Protégées (Layout Principal)
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard], // Protection globale
    children: [
      // Ici nous ajouterons les enfants : admin, student...
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      
      // Placeholder pour le dashboard par défaut (à créer plus tard)
     /*  { 
        path: 'dashboard', 
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) 
      }, */

      // Module Admin (Lazy Loading)
      {
        path: 'admin',
        canActivate: [authGuard],
        data: { roles: ['ADMIN'] },
        loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES)
      },

      // Module Student (Lazy Loading)
      {
        path: 'student',
        canActivate: [authGuard],
        data: { roles: ['ETUDIANT'] },
        loadChildren: () => import('./features/student/student.routes').then(m => m.STUDENT_ROUTES)
      }
    ]
  },

  // Fallback
  { path: '**', redirectTo: 'auth/login' }
];