import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { UserRole } from '../models/auth.models';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // 1. Vérifier si l'utilisateur est connecté
  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/auth/login']);
  }

  // 2. Vérifier les rôles requis (si définis dans la route)
  // Ex: { path: 'admin', canActivate: [authGuard], data: { roles: ['ADMIN'] } }
  const requiredRoles = route.data['roles'] as UserRole[] | undefined;
  
  if (requiredRoles) {
    const userRole = authService.currentUser()?.role;
    if (userRole && !requiredRoles.includes(userRole)) {
      // Si connecté mais mauvais rôle -> redirection ou page 403
      // Pour l'instant, on renvoie vers le dashboard par défaut ou login
      return router.createUrlTree(['/auth/login']); 
    }
  }

  return true;
};