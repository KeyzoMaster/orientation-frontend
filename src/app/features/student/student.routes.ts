import { Routes } from '@angular/router';

export const STUDENT_ROUTES: Routes = [
  {
    path: '',
    children: [
      { 
        path: '', 
        redirectTo: 'simulation', 
        pathMatch: 'full' 
      },
      { 
        path: 'simulation', 
        loadComponent: () => import('./student-dashboard/student-dashboard').then(m => m.StudentDashboard) 
      },
      // Placeholder pour une future page de détail des notes
      { 
        path: 'notes', 
        loadComponent: () => import('./student-notes/student-notes').then(m => m.StudentNotes) 
      }
    ]
  }
];